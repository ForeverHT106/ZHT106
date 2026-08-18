/* ============================================================================
 * KadaStore — 咔哒数据存储抽象层
 *
 * 两种模式：
 *   1. 本地模式（默认）：社区收录数据存浏览器 localStorage，零依赖、零请求
 *   2. 云端模式：接入腾讯云 CloudBase PostgreSQL，通过 PostgREST HTTP API 直接读写
 *
 * 启用云端模式只需修改下方 CLOUD_CONFIG：
 *   enabled: true
 *   envId: '你的云开发环境 ID'
 *
 * 云端模式下本地偏好（主题/历史/收藏/草稿）仍存 localStorage，不受影响。
 * 云端不可用（网络/未配置/额度超限）时自动回退本地模式，网站照常工作。
 * ========================================================================== */
(function(window) {
  'use strict';

  // ==================== 云端配置（启用前请修改） ====================
  var CLOUD_CONFIG = {
    enabled: true,                         // true = 启用云端存储
    envId: 'breeze-0-d7gyop0ga59286558'    // 云开发环境 ID
  };

  // ==================== 本地存储键（本地模式 / 回退缓存） ====================
  var LOCAL_KEYS = {
    EXTRA_SITES: 'officialSearch_extra_sites',
    SUBMISSIONS: 'officialSearch_submissions'
  };

  var STATUS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' };

  // ==================== 内部状态 ====================
  var isCloud = false;          // 当前是否实际使用云端（enabled 且初始化成功）
  var cache = null;             // 云端数据内存缓存（仅 approved 站点）
  var ready = false;            // 初始化流程已结束（成功或失败回退）
  var readyFns = [];            // onReady 回调
  var adminCred = null;         // 云端管理员登录凭据（仅存内存，不落盘）
  var lastError = null;         // 最近一次初始化失败原因（诊断用）

  var token = null;             // 匿名 access_token
  var tokenExpiresAt = 0;       // token 过期时间戳（毫秒）
  var deviceId = null;          // 匿名登录设备 ID（会话内复用）

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

  function baseUrl() {
    return 'https://' + CLOUD_CONFIG.envId + '.api.tcloudbasegateway.com/v1/rdb/rest';
  }

  function authUrl() {
    return 'https://' + CLOUD_CONFIG.envId + '.api.tcloudbasegateway.com/auth/v1/signin/anonymously';
  }

  function makeDeviceId() {
    var s = '';
    try {
      s = window.navigator.userAgent || '';
      s += window.navigator.language || '';
      s += window.screen ? (window.screen.width + 'x' + window.screen.height) : '';
    } catch (e) { /* ignore */ }
    return 'kada-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10) + '-' + hashString(s).slice(0, 8);
  }

  function hashString(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h).toString(16);
  }

  function fetchJson(url, options) {
    options = options || {};
    options.headers = options.headers || {};
    if (options.body && typeof options.body === 'object') {
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
      options.body = JSON.stringify(options.body);
    }
    return window.fetch(url, options).then(function(res) {
      return res.text().then(function(text) {
        var data;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = { raw: text }; }
        return { res: res, data: data };
      });
    });
  }

  function getToken() {
    if (token && Date.now() < tokenExpiresAt - 60000) {
      return Promise.resolve(token);
    }
    deviceId = deviceId || makeDeviceId();
    return fetchJson(authUrl(), {
      method: 'POST',
      headers: { 'x-device-id': deviceId },
      body: {}
    }).then(function(r) {
      if (!r.res.ok || !r.data || !r.data.access_token) {
        throw new Error(r.data && (r.data.message || r.data.error_description) ? (r.data.message || r.data.error_description) : '匿名登录失败');
      }
      token = r.data.access_token;
      var exp = r.data.expires_in ? parseInt(r.data.expires_in, 10) : 7200;
      tokenExpiresAt = Date.now() + exp * 1000;
      return token;
    });
  }

  function api(path, options, retry) {
    retry = retry === undefined ? true : retry;
    return getToken().then(function(tk) {
      options = options || {};
      options.headers = options.headers || {};
      options.headers['Authorization'] = 'Bearer ' + tk;
      return fetchJson(baseUrl() + path, options);
    }).then(function(r) {
      if (r.res.status === 401 && retry) {
        token = null;
        tokenExpiresAt = 0;
        return api(path, options, false);
      }
      if (!r.res.ok) {
        var msg = r.data && (r.data.message || r.data.msg || r.data.error_description);
        throw new Error(msg || ('HTTP ' + r.res.status));
      }
      return r.data;
    });
  }

  function loadCloudSites() {
    return api('/sites?order=created_at.desc', { method: 'GET' })
      .then(function(list) {
        cache = Array.isArray(list) ? list : [];
      });
  }

  // ==================== 云端初始化（异步，不阻塞页面） ====================
  function initCloud() {
    if (!CLOUD_CONFIG.enabled || !CLOUD_CONFIG.envId) {
      ready = true;
      fireReady();
      return;
    }
    if (!window.fetch) {
      lastError = '浏览器不支持 fetch，已回退本地模式';
      ready = true;
      console.warn('[KadaStore]', lastError);
      fireReady();
      return;
    }
    loadCloudSites()
      .then(function() {
        isCloud = true;
        ready = true;
        fireReady();
      })
      .catch(function(err) {
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

    // 保存社区站点（本地模式落盘；云端模式仅更新内存缓存，云端数据以接口为准）
    saveCommunitySites: function(sites) {
      if (isCloud) { cache = sites.slice(); return; }
      writeJSON(LOCAL_KEYS.EXTRA_SITES, sites);
    },

    // 提交收录：返回 Promise<{ok, msg, site?}>
    submitSite: function(data) {
      if (isCloud) {
        var payload = {
          p_name: data.name,
          p_url: data.url,
          p_category: data.category,
          p_description: data.desc || '',
          p_icp: data.icp || '',
          p_keywords: JSON.stringify(data.keywords || []),
          p_source: 'community'
        };
        return api('/rpc/submit_site', { method: 'POST', body: payload })
          .then(function(r) {
            // 提交成功后刷新缓存，让管理员面板立即看到 pending 记录
            if (r.ok) loadCloudSites().catch(function() { /* ignore */ });
            return r;
          });
      }
      // 本地模式
      var sites = readJSON(LOCAL_KEYS.EXTRA_SITES, []);
      var site = {
        name: data.name, url: data.url, category: data.category,
        description: data.desc || '', icp: data.icp || '', keywords: data.keywords || [],
        verified: false, source: 'community',
        status: STATUS.PENDING,
        createdAt: new Date().toISOString()
      };
      sites.unshift(site);
      writeJSON(LOCAL_KEYS.EXTRA_SITES, sites);
      return Promise.resolve({ ok: true, msg: '已收录', site: site });
    },

    // 管理员审核：返回 Promise<{ok, msg}>
    reviewSite: function(url, status, note) {
      if (isCloud) {
        if (!adminCred) return Promise.resolve({ ok: false, msg: '未登录' });
        var payload = {
          p_password: adminCred.password,
          p_url: url,
          p_status: status,
          p_note: note || ''
        };
        return api('/rpc/admin_review', { method: 'POST', body: payload })
          .then(function(r) {
            if (r.ok) {
              // 审核成功后刷新 approved 缓存
              loadCloudSites().catch(function() { /* ignore */ });
            }
            return r;
          });
      }
      var sites = readJSON(LOCAL_KEYS.EXTRA_SITES, []);
      var site = sites.find(function(s) { return s.url === url; });
      if (!site) return Promise.resolve({ ok: false, msg: '未找到该提交' });
      site.status = status;
      site.reviewedAt = new Date().toISOString();
      site.reviewNote = note || '';
      site.verified = status === STATUS.APPROVED;
      writeJSON(LOCAL_KEYS.EXTRA_SITES, sites);
      return Promise.resolve({ ok: true, msg: '操作成功' });
    },

    // 管理员登录：返回 Promise<{ok, msg}>
    adminLogin: function(username, password) {
      if (isCloud) {
        return api('/rpc/admin_login', {
          method: 'POST',
          body: { p_username: username, p_password: password }
        }).then(function(r) {
          if (r.ok) adminCred = { username: username, password: password };
          return r;
        });
      }
      return Promise.resolve({ ok: true, msg: '本地模式' });
    },

    // 修改密码：返回 Promise<{ok, msg}>
    changePassword: function(currentPwd, newPwd) {
      if (isCloud) {
        return api('/rpc/admin_change_pwd', {
          method: 'POST',
          body: { p_current: currentPwd, p_new: newPwd }
        }).then(function(r) {
          if (r.ok && adminCred) adminCred.password = newPwd;
          return r;
        });
      }
      return Promise.resolve({ ok: true, msg: '本地模式' });
    },

    // 云端管理员用户名（内存）
    getAdminUsername: function() {
      return adminCred ? adminCred.username : '';
    },
    // 云端模式登录态（内存凭据是否存在）；本地模式恒 true
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
