/* ============================================================================
 * KadaStore — 咔哒数据存储抽象层
 *
 * 两种模式：
 *   1. 本地模式（默认）：社区收录数据存浏览器 localStorage，零依赖、零请求
 *   2. 云端模式：接入腾讯云开发 CloudBase，社区收录数据存云端数据库，所有访客共享
 *
 * 启用云端模式只需修改下方 CLOUD_CONFIG：
 *   enabled: true
 *   envId:   '你的云开发环境 ID'（云开发控制台 → 概览 → 环境 ID）
 *
 * 云端模式下本地偏好（主题/历史/收藏/草稿）仍存 localStorage，不受影响。
 * 云端不可用（网络/未配置/额度超限）时自动回退本地模式，网站照常工作。
 * ========================================================================== */
(function(window) {
  'use strict';

  // ==================== 云端配置（启用前请修改） ====================
  var CLOUD_CONFIG = {
    enabled: true,           // true = 启用云端存储
    envId: 'breeze-0-d7gyop0ga59286558',   // 云开发环境 ID
    region: 'ap-shanghai',   // 环境地域（控制台可查）：ap-shanghai / ap-guangzhou / ap-beijing 等
    collection: 'sites',     // 社区收录集合名（需与云函数一致）
    // Publishable Key（公开密钥）：云开发控制台 → API Key 管理页 → publish_key。
    // 填入后可绕过匿名登录开关，直接以匿名权限访问云函数/数据库。
    accessKey: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImI0MGYzMzAwLTE2ZjYtNDI4My04NDg1LTVmOGUyYWI0YjFmZSJ9.eyJpc3MiOiJodHRwczovL2JyZWV6ZS0wLWQ3Z3lvcDBnYTU5Mjg2NTU4LmFwLXNoYW5naGFpLnRjYi1hcGkudGVuY2VudGNsb3VkYXBpLmNvbSIsInN1YiI6ImFub24iLCJhdWQiOiJicmVlemUtMC1kN2d5b3AwZ2E1OTI4NjU1OCIsImV4cCI6NDA5MDcyNjkzOCwiaWF0IjoxNzg3MDQzNzM4LCJub25jZSI6IjRyRms3Z3JqUl9XYmExMXdjNlFyYkEiLCJhdF9oYXNoIjoiNHJGazdncmpSX1diYTExd2M2UXJiQSIsIm5hbWUiOiJBbm9ueW1vdXMiLCJzY29wZSI6ImFub255bW91cyIsInByb2plY3RfaWQiOiJicmVlemUtMC1kN2d5b3AwZ2E1OTI4NjU1OCIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJyb2xlIjoiYW5vbiIsImlzX2Fub255bW91cyI6dHJ1ZSwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiYW5vbnltb3VzIiwicHJvdmlkZXJzIjpbImFub255bW91cyJdfSwidXNlcl9tZXRhZGF0YSI6eyJuYW1lIjoiQW5vbnltb3VzIn0sInVzZXJfdHlwZSI6IiIsImNsaWVudF90eXBlIjoiY2xpZW50X3VzZXIiLCJpc19zeXN0ZW1fYWRtaW4iOmZhbHNlfQ.WAksLBEThYI1XTPe4em1rSUa9jn0ISWDB3p-5PSlG1CnU2atgr5ZHKwLAUXoZKd70dnpGMQCKdJpmX8yQ4euhQdDpF1-tMIZC4wJsxKjdcSdp6rGHaNDjdfcUQhsB-shtw4q8LFzos0zCpuo98gMqTVcOqnKnPCUTLN6chWJIKupX6KDjslHNDRQHVbedVzGM8M11bpY60NhXUYMcW9fXwFW80u0kQ2Yh8U-N_YfuZ3oyCOmusfByyrHaA2dd8TbrtHHY6MY192ktqAaz7Jgs11YbQf56yDh96DwwVMETLK6gOcTOBH5hZG6jAmTo2AufrRIqCqEu6JD75te-151LQ',
    sdkUrl: 'https://static.cloudbase.net/cloudbase-js-sdk/2.17.3/cloudbase.full.js'
  };

  // ==================== 本地存储键（本地模式 / 回退缓存） ====================
  var LOCAL_KEYS = {
    EXTRA_SITES: 'officialSearch_extra_sites',
    SUBMISSIONS: 'officialSearch_submissions'
  };

  var STATUS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' };

  // ==================== 内部状态 ====================
  var isCloud = false;    // 当前是否实际使用云端（enabled 且初始化成功）
  var cloudApp = null;    // CloudBase app 实例
  var db = null;          // CloudBase 数据库实例
  var cache = null;       // 云端数据内存缓存
  var ready = false;      // 初始化流程已结束（成功或失败回退）
  var readyFns = [];      // onReady 回调
  var adminCred = null;   // 云端管理员登录凭据（仅存内存，不落盘）
  var lastError = null;   // 最近一次初始化失败原因（诊断用）

  // ==================== 工具 ====================
  function readJSON(key, fallback) {
    try {
      var v = window.localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }

  function writeJSON(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  function loadScript(url) {
    return new Promise(function(resolve, reject) {
      var s = window.document.createElement('script');
      s.src = url;
      s.onload = resolve;
      s.onerror = function() { reject(new Error('CloudBase SDK 加载失败')); };
      window.document.head.appendChild(s);
    });
  }

  // ==================== 云端调用封装 ====================
  function callCloud(action, payload) {
    var data = Object.assign({ action: action }, payload || {});
    if (adminCred) data.__admin = adminCred; // 管理员凭据随请求携带（仅内存，HTTPS）
    return cloudApp.callFunction({ name: 'kadaApi', data: data })
      .then(function(res) {
        return res && res.result ? res.result : { ok: false, msg: '云函数返回异常' };
      })
      .catch(function(err) {
        return { ok: false, msg: '云端请求失败：' + (err && err.message ? err.message : '网络错误') };
      });
  }

  // ==================== 云端初始化（异步，不阻塞页面） ====================
  function initCloud() {
    if (!CLOUD_CONFIG.enabled || !CLOUD_CONFIG.envId) {
      ready = true;
      fireReady();
      return;
    }
    loadScript(CLOUD_CONFIG.sdkUrl)
      .then(function() {
        if (!window.cloudbase) throw new Error('CloudBase SDK 未注入');
        var initOpts = {
          env: CLOUD_CONFIG.envId,
          region: CLOUD_CONFIG.region,
          clientId: CLOUD_CONFIG.envId   // 新版 CloudBase Identity 需要 clientId
        };
        if (CLOUD_CONFIG.accessKey) initOpts.accessKey = CLOUD_CONFIG.accessKey; // Publishable Key
        cloudApp = window.cloudbase.init(initOpts);
        // 尝试匿名登录；配置了 accessKey 时即使登录失败也不阻断（accessKey 本身可访问资源）
        return cloudApp.auth({ persistence: 'local' }).signInAnonymously().catch(function(err) {
          if (CLOUD_CONFIG.accessKey) {
            console.warn('[KadaStore] 匿名登录未生效（已配置 accessKey，继续尝试访问）:', JSON.stringify(err));
            return null;
          }
          throw err;
        });
      })
      .then(function() {
        db = cloudApp.database();
        return db.collection(CLOUD_CONFIG.collection)
          .orderBy('submittedAt', 'desc')
          .limit(1000)
          .get();
      })
      .then(function(res) {
        cache = res && res.data ? res.data : [];
        isCloud = true;
        ready = true;
        fireReady();
      })
      .catch(function(err) {
        // 云端不可用 → 回退本地模式（记录原因，F12 控制台可查）
        isCloud = false;
        lastError = err && err.message ? err.message : (typeof err === 'object' ? JSON.stringify(err) : String(err));
        ready = true;
        console.warn('[KadaStore] 云端初始化失败，已回退本地模式。原因：', lastError);
        fireReady();
      });
  }

  function fireReady() {
    var fns = readyFns;
    readyFns = [];
    fns.forEach(function(fn) { try { fn(); } catch (e) { /* ignore */ } });
  }

  // ==================== 对外接口 ====================
  var store = {
    // 当前是否云端模式（true = 数据真实存在云端）
    isCloud: function() { return isCloud; },
    // 是否已配置云端（enabled + envId）
    configured: function() { return !!(CLOUD_CONFIG.enabled && CLOUD_CONFIG.envId); },
    // 最近一次初始化失败原因（诊断用；成功为 null）
    getLastError: function() { return lastError; },

    // 同步读取社区站点（云端：内存缓存；未就绪/本地：localStorage）
    getCommunitySitesSync: function() {
      if (isCloud && cache) return cache;
      return readJSON(LOCAL_KEYS.EXTRA_SITES, []);
    },

    // 保存社区站点（本地模式落盘；云端模式仅更新内存缓存，云端数据以云函数为准）
    saveCommunitySites: function(sites) {
      if (isCloud) { cache = sites.slice(); return; }
      writeJSON(LOCAL_KEYS.EXTRA_SITES, sites);
    },

    // 提交收录：返回 Promise<{ok, msg, site?}>（site 含云端 _id）
    submitSite: function(data) {
      if (isCloud) {
        return callCloud('submit', {
          name: data.name, url: data.url, category: data.category,
          desc: data.desc, icp: data.icp, keywords: data.keywords || []
        }).then(function(r) {
          if (r.ok && r.site && cache) cache = [r.site].concat(cache);
          return r;
        });
      }
      // 本地模式
      var sites = readJSON(LOCAL_KEYS.EXTRA_SITES, []);
      var site = {
        name: data.name, url: data.url, category: data.category,
        desc: data.desc, icp: data.icp, keywords: data.keywords || [],
        verified: false, source: 'community',
        status: STATUS.PENDING,
        submittedAt: new Date().toISOString()
      };
      sites.unshift(site);
      writeJSON(LOCAL_KEYS.EXTRA_SITES, sites);
      return Promise.resolve({ ok: true, msg: '已收录', site: site });
    },

    // 管理员审核：返回 Promise<{ok, msg}>
    reviewSite: function(url, status, note) {
      if (isCloud) {
        return callCloud('review', { url: url, status: status, note: note || '' });
      }
      var sites = readJSON(LOCAL_KEYS.EXTRA_SITES, []);
      var site = sites.find(function(s) { return s.url === url; });
      if (!site) return Promise.resolve({ ok: false, msg: '未找到该提交' });
      site.status = status;
      site.reviewedAt = new Date().toISOString();
      site.reviewNote = note || '';
      site.verified = status === STATUS.APPROVED;
      writeJSON(LOCAL_KEYS.EXTRA_SITES, sites);
      return Promise.resolve({ ok: true });
    },

    // 管理员登录（云端模式校验；本地模式返回 ok 由 app.js 自行校验）：返回 Promise<{ok, msg}>
    adminLogin: function(username, password) {
      if (isCloud) {
        return callCloud('login', { username: username, password: password }).then(function(r) {
          if (r.ok) adminCred = { username: username, password: password };
          return r;
        });
      }
      return Promise.resolve({ ok: true });
    },

    // 修改密码（云端模式；本地模式由 app.js 自行校验）：返回 Promise<{ok, msg}>
    changePassword: function(currentPwd, newPwd) {
      if (isCloud) {
        return callCloud('changePwd', { currentPwd: currentPwd, newPwd: newPwd });
      }
      return Promise.resolve({ ok: true });
    },

    // 云端管理员用户名（内存）
    getAdminUsername: function() {
      return adminCred ? adminCred.username : '';
    },
    // 云端模式登录态（内存凭据是否存在）；本地模式恒 true（由 sessionStorage 管理）
    hasAdminCred: function() {
      return isCloud ? !!adminCred : true;
    },
    // 登出（云端模式清内存凭据）
    clearAdminCred: function() {
      adminCred = null;
    },

    // 初始化完成回调（无论云端成功与否都会触发）
    onReady: function(fn) {
      if (ready) { try { fn(); } catch (e) { /* ignore */ } return; }
      readyFns.push(fn);
    }
  };

  window.KadaStore = store;

  // 启动初始化
  initCloud();
})(window);
