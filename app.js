/**
 * 咔哒 - 应用逻辑 v2.0
 * 功能：搜索、建议、历史、收藏、暗黑模式、快捷键、网站提交
 */

(function() {
  'use strict';

  // 存储抽象层引用（js/store.js 提供，先于本文件加载）
  const KadaStore = window.KadaStore;

  // ==================== DOM 元素引用 ====================
  const $ = id => document.getElementById(id);

  const searchInput = $('searchInput');
  const searchBtn = $('searchBtn');
  const suggestions = $('suggestions');
  const historyPanel = $('historyPanel');
  const historyList = $('historyList');
  const clearHistoryBtn = $('clearHistory');
  const resultsSection = $('results-section');
  const resultsList = $('resultsList');
  const resultsTitle = $('resultsTitle');
  const clearSearchBtn = $('clearSearch');
  const hotTags = $('hotTags');
  const categoryGrid = $('categoryGrid');
  const backToTop = $('backToTop');
  const themeToggle = $('themeToggle');
  const favoritesList = $('favoritesList');
  const favoritesEmpty = $('favoritesEmpty');
  const statSites = $('statSites');
  const statCategories = $('statCategories');
  const statCommunity = $('statCommunity');
  const heroCount = $('heroCount');
  const searchUrlMsg = $('searchUrlMsg');
  const submitModal = $('submitModal');
  const openSubmitBtn = $('openSubmitBtn');
  const closeSubmitBtn = $('closeSubmitBtn');
  const submitForm = $('submitForm');
  const submitMessage = $('submitMessage');
  const exportBtn = $('exportBtn');

  // ===== 管理员审核系统 DOM 引用 =====
  const adminLink = $('adminLink');
  const adminLoginModal = $('adminLoginModal');
  const adminLoginForm = $('adminLoginForm');
  const adminLoginMessage = $('adminLoginMessage');
  const closeAdminLoginBtn = $('closeAdminLoginBtn');
  const adminModal = $('adminModal');
  const closeAdminBtn = $('closeAdminBtn');
  const adminLogoutBtn = $('adminLogoutBtn');
  const adminUsername = $('adminUsername');
  const adminStats = $('adminStats');
  const adminTabs = $('adminTabs');
  const adminList = $('adminList');
  const changePwdForm = $('changePwdForm');
  const changePwdMessage = $('changePwdMessage');

  // 热门搜索词
  const HOT_KEYWORDS = ['淘宝', '12306', '学信网', '京东', '微信', '支付宝', '百度', '研招网'];

  // localStorage 键名
  const STORAGE_KEYS = {
    HISTORY: 'officialSearch_history',
    FAVORITES: 'officialSearch_favorites',
    THEME: 'officialSearch_theme',
    EXTRA_SITES: 'officialSearch_extra_sites',
    SUBMISSIONS: 'officialSearch_submissions',
    SUBMIT_DRAFT: 'kada_submit_draft',
    ADMIN: 'kada_admin_account',
    ADMIN_SESSION: 'kada_admin_session'
  };

  // 审核状态常量
  const STATUS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' };

  // ==================== 管理员账户 ====================
  // 说明：纯前端站点无后端，管理员凭据存于浏览器 localStorage，
  // 适用于本地/单机使用。部署到服务器后建议迁移为服务端鉴权。
  const DEFAULT_ADMIN = { username: 'admin', password: 'kada2026', createdAt: '' };

  // 简单不可逆哈希（非加密用途，仅避免明文存储）
  function hashPwd(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16) + (h1 >>> 0).toString(16);
  }

  function getAdmin() {
    // 云端模式：凭据仅存内存（登录时由云函数校验，本地不落盘）
    if (KadaStore.isCloud()) {
      return {
        username: KadaStore.getAdminUsername() || DEFAULT_ADMIN.username,
        passwordHash: '',
        createdAt: ''
      };
    }
    try {
      const a = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN));
      if (a && a.username && a.passwordHash) return a;
    } catch (e) { /* ignore */ }
    // 首次访问：创建默认管理员 admin / kada2026
    const def = {
      username: DEFAULT_ADMIN.username,
      passwordHash: hashPwd(DEFAULT_ADMIN.password),
      createdAt: new Date().toISOString()
    };
    try { localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(def)); } catch (e) { /* ignore */ }
    return def;
  }

  function isAdminLoggedIn() {
    // 云端模式：要求内存中存在登录凭据（刷新后需重新登录）
    if (KadaStore.isCloud()) return KadaStore.hasAdminCred();
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === '1';
  }

  function adminLogin(username, password) {
    if (KadaStore.isCloud()) {
      return KadaStore.adminLogin(username, password);
    }
    const admin = getAdmin();
    return Promise.resolve({
      ok: admin.username === username.trim() && admin.passwordHash === hashPwd(password),
      msg: '用户名或密码错误'
    });
  }

  function adminLogout() {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    KadaStore.clearAdminCred();
    if (adminModal) adminModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // ==================== 社区收录池（提交后即时收录） ====================
  // 数据源由 KadaStore 统一管理：配置云端后走云端数据库，否则回退 localStorage
  function getExtraSites() {
    return KadaStore.getCommunitySitesSync();
  }

  function saveExtraSites(sites) {
    KadaStore.saveCommunitySites(sites);
  }

  // 规范化 URL 用于去重（去掉协议、尾部斜杠、www 前缀，返回字符串）
  function normalizeUrlKey(url) {
    return String(url || '')
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/+$/, '');
  }

  // 查找站点是否已收录（官方库或社区池）
  function findExistingSite(url) {
    const target = normalizeUrlKey(url);
    const inOfficial = OFFICIAL_SITES.find(function(s) { return normalizeUrlKey(s.url) === target; });
    if (inOfficial) return { type: 'official', site: inOfficial };
    const inExtra = getExtraSites().find(function(s) { return normalizeUrlKey(s.url) === target; });
    if (inExtra) return { type: 'extra', site: inExtra };
    return null;
  }

  // 搜索社区收录站点（仅返回未拒绝的站点：pending 待核实 / approved 已通过）
  function searchCommunitySites(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results = [];
    getExtraSites().forEach(function(site) {
      if (site.status === STATUS.REJECTED) return; // 已拒绝的不参与搜索
      let score = 0;
      if (site.name.toLowerCase() === q) score = 1000;
      else if (site.name.toLowerCase().includes(q)) score = 500 + (q.length / site.name.length * 100);
      else if ((site.url || '').toLowerCase().includes(q)) score = 400;
      else if ((site.desc || '').toLowerCase().includes(q)) score = 200;
      else if ((site.category || '').includes(q)) score = 100;
      if (score > 0) {
        results.push({ ...site, score, matchedKeyword: site.name, verified: site.status === STATUS.APPROVED, source: 'community' });
      }
    });
    results.sort(function(a, b) { return b.score - a.score; });
    return results;
  }

  // 获取待审核（pending）站点数量
  function countPendingSites() {
    return getExtraSites().filter(function(s) { return !s.status || s.status === STATUS.PENDING; }).length;
  }

  // 全量搜索：官方认证优先，社区收录随后
  function searchAllSites(query) {
    const official = searchOfficialSites(query);
    const community = searchCommunitySites(query);
    return official.concat(community);
  }

  // ==================== 初始化 ====================
  function init() {
    initTheme();
    renderHotTags();
    renderCategories();
    renderFavorites();
    updateStats();
    bindEvents();
    // 管理员登录态导航反馈
    if (adminLink) {
      if (isAdminLoggedIn()) setAdminLinkLabel('管理审核');
      else setAdminLinkLabel('管理员登录');
    }
    // 云端数据就绪（或确认回退本地）后：刷新统计与当前视图，使社区数据切换到云端
    KadaStore.onReady(function() {
      updateStats();
      if (adminModal && !adminModal.classList.contains('hidden')) renderAdminPanel();
      if (resultsSection && !resultsSection.classList.contains('hidden')) {
        renderResults(searchInput.value);
      }
    });
  }

  // ==================== 主题管理 ====================
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ==================== 搜索历史管理 ====================
  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
    } catch (e) {
      return [];
    }
  }

  function addToHistory(query) {
    let history = getHistory();
    history = history.filter(item => item.toLowerCase() !== query.toLowerCase());
    history.unshift(query);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    historyPanel.classList.add('hidden');
  }

  function showHistoryPanel() {
    const history = getHistory();
    if (history.length === 0) return;

    historyList.innerHTML = history.map(function(item) {
      return '<div class="history-item" data-query="' + escapeHtml(item) + '">' +
        '<span class="history-item-icon">🕐</span>' +
        '<span>' + escapeHtml(item) + '</span>' +
      '</div>';
    }).join('');

    historyPanel.classList.remove('hidden');

    // 绑定点击事件
    historyList.querySelectorAll('.history-item').forEach(function(item) {
      item.addEventListener('click', function() {
        const query = this.getAttribute('data-query');
        searchInput.value = query;
        historyPanel.classList.add('hidden');
        handleSearch(); // 智能识别：网址 → 直达 / 关键词 → 搜索
      });
    });
  }

  // ==================== 收藏管理 ====================
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
    } catch (e) {
      return [];
    }
  }

  function isFavorite(url) {
    return getFavorites().some(f => f.url === url);
  }

  function toggleFavorite(site) {
    let favorites = getFavorites();
    const idx = favorites.findIndex(f => f.url === site.url);
    if (idx >= 0) {
      favorites.splice(idx, 1);
    } else {
      favorites.unshift({ name: site.name, url: site.url, desc: site.desc, category: site.category });
      if (favorites.length > 20) favorites = favorites.slice(0, 20);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    renderFavorites();
    return idx >= 0;
  }

  function removeFavorite(url) {
    const favorites = getFavorites().filter(f => f.url !== url);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    renderFavorites();
  }

  function renderFavorites() {
    const favorites = getFavorites();
    if (favorites.length === 0) {
      favoritesList.innerHTML = '';
      favoritesEmpty.classList.remove('hidden');
      return;
    }
    favoritesEmpty.classList.add('hidden');

    favoritesList.innerHTML = favorites.map(function(f) {
      return '<div class="favorite-card">' +
        '<div class="favorite-card-header">' +
          '<div class="fav-icon">' + faviconHtml(f.url, f.name) + '</div>' +
          '<div>' +
            '<div class="favorite-name">' + escapeHtml(f.name) + '</div>' +
            '<div style="font-size:12px;color:var(--text-light)">' + escapeHtml(f.category || '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="favorite-desc">' + escapeHtml(f.desc || '') + '</div>' +
        '<div class="favorite-actions">' +
          '<a href="' + f.url + '" target="_blank" rel="noopener noreferrer" class="favorite-enter">进入网站 ↗</a>' +
          '<button class="favorite-remove" data-url="' + f.url + '" title="取消收藏">×</button>' +
        '</div>' +
      '</div>';
    }).join('');

    // 绑定移除事件
    favoritesList.querySelectorAll('.favorite-remove').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeFavorite(this.getAttribute('data-url'));
      });
    });
  }

  // ==================== 统计信息 ====================
  function updateStats() {
    statSites.textContent = OFFICIAL_SITES.length;
    statCategories.textContent = getCategories().length;
    statCommunity.textContent = countPendingSites();
    if (heroCount) heroCount.textContent = OFFICIAL_SITES.length;
    // 管理员面板若打开，同步刷新统计
    if (adminStats && !adminStats.classList.contains('hidden')) renderAdminStats();
  }

  // ==================== 事件绑定 ====================
  function bindEvents() {
    // 搜索
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keydown', handleSearchKeydown);

    // 输入时显示建议
    let debounceTimer = null;
    searchInput.addEventListener('input', function(e) {
      clearTimeout(debounceTimer);
      const value = e.target.value;
      historyPanel.classList.add('hidden');
      debounceTimer = setTimeout(function() {
        showSuggestions(value);
      }, 150);
    });

    // 聚焦时若为空显示历史
    searchInput.addEventListener('focus', function() {
      if (!this.value.trim()) {
        suggestions.classList.add('hidden');
        showHistoryPanel();
      }
    });

    // 点击外部关闭下拉
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-box-wrapper')) {
        suggestions.classList.add('hidden');
        historyPanel.classList.add('hidden');
      }
    });

    // 清除搜索
    clearSearchBtn.addEventListener('click', clearSearch);

    // 清空历史
    clearHistoryBtn.addEventListener('click', clearHistory);

    // 主题切换
    themeToggle.addEventListener('click', toggleTheme);

    // 回到顶部
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 400) {
        backToTop.classList.remove('hidden');
      } else {
        backToTop.classList.add('hidden');
      }
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 提交弹窗
    openSubmitBtn.addEventListener('click', function() {
      openSubmitModal(); // 打开提交弹窗（自动恢复上次草稿）
    });
    closeSubmitBtn.addEventListener('click', closeSubmitModal);
    submitModal.addEventListener('click', function(e) {
      if (e.target === submitModal) closeSubmitModal();
    });
    submitForm.addEventListener('submit', handleSubmitSite);
    // 输入时实时保存草稿（即使直接刷新页面也不丢）
    submitForm.addEventListener('input', saveSubmitDraft);
    submitForm.addEventListener('change', saveSubmitDraft);
    if (exportBtn) exportBtn.addEventListener('click', exportSubmissions);

    // ===== 管理员审核系统事件 =====
    if (adminLink) adminLink.addEventListener('click', function(e) {
      e.preventDefault();
      openAdminPanel();
    });

    if (adminLoginForm) adminLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = $('adminUsernameInput').value.trim();
      const password = $('adminPasswordInput').value;
      const loginBtn = adminLoginForm.querySelector('[type="submit"]');
      if (loginBtn) { loginBtn.disabled = true; }
      adminLogin(username, password).then(function(result) {
        if (loginBtn) { loginBtn.disabled = false; }
        if (result.ok) {
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, '1');
          adminLoginModal.classList.add('hidden');
          adminLoginForm.reset();
          if (adminLoginMessage) { adminLoginMessage.classList.add('hidden'); adminLoginMessage.textContent = ''; }
          openAdminPanel();
        } else {
          adminLoginMessage.textContent = result.msg || '用户名或密码错误';
          adminLoginMessage.className = 'admin-login-message error';
          adminLoginMessage.classList.remove('hidden');
        }
      });
    });

    if (closeAdminLoginBtn) closeAdminLoginBtn.addEventListener('click', function() {
      adminLoginModal.classList.add('hidden');
      document.body.style.overflow = '';
      if (adminLoginForm) adminLoginForm.reset();
    });
    if (adminLoginModal) adminLoginModal.addEventListener('click', function(e) {
      if (e.target === adminLoginModal) {
        adminLoginModal.classList.add('hidden');
        document.body.style.overflow = '';
        if (adminLoginForm) adminLoginForm.reset();
      }
    });

    if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAdminPanel);
    if (adminModal) adminModal.addEventListener('click', function(e) {
      if (e.target === adminModal) closeAdminPanel();
    });
    if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', function() {
      adminLogout();
      // 提示已退出
      setAdminLinkLabel('管理员登录');
    });

    // 审核面板 tab 切换（事件委托）
    if (adminTabs) adminTabs.addEventListener('click', function(e) {
      const tab = e.target.closest('.admin-tab');
      if (!tab) return;
      adminTabs.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderAdminList(tab.getAttribute('data-tab'));
    });

    // 审核操作（事件委托）
    if (adminList) adminList.addEventListener('click', function(e) {
      const btn = e.target.closest('.admin-btn');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const url = btn.getAttribute('data-url');
      const noteInput = this.querySelector('.admin-note-input[data-url="' + url + '"]');
      handleAdminAction(action, url, noteInput);
    });

    // 修改密码
    if (changePwdForm) changePwdForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const current = $('currentPwd').value;
      const next = $('newPwd').value;
      const confirm = $('confirmPwd').value;
      if (next !== confirm) {
        changePwdMessage.textContent = '两次输入的新密码不一致';
        changePwdMessage.className = 'admin-login-message error';
        changePwdMessage.classList.remove('hidden');
        return;
      }
      const result = changeAdminPassword(current, next);
      result.then(function(r) {
        changePwdMessage.textContent = r.msg;
        changePwdMessage.className = 'admin-login-message ' + (r.ok ? 'success' : 'error');
        changePwdMessage.classList.remove('hidden');
        if (r.ok) changePwdForm.reset();
      });
    });

    // 全局键盘快捷键
    document.addEventListener('keydown', function(e) {
      // '/' 聚焦搜索
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e)) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      // Escape 关闭弹窗/下拉
      if (e.key === 'Escape') {
        closeSubmitModal();
        if (adminModal) closeAdminPanel();
        if (adminLoginModal) adminLoginModal.classList.add('hidden');
        suggestions.classList.add('hidden');
        historyPanel.classList.add('hidden');
        searchInput.blur();
      }
    });
  }

  function isTyping(e) {
    const tag = e.target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable;
  }

  // 打开提交弹窗；prefillUrl 存在时预填官网地址（未收录网址引导提交），否则恢复上次草稿
  function openSubmitModal(prefillUrl) {
    if (prefillUrl) {
      $('submitUrl').value = prefillUrl;
      showSubmitMessage('📝 已预填官网地址，请补充网站名称、分类等信息后提交', 'success');
    } else {
      loadSubmitDraft(); // 恢复上次未提交的草稿
    }
    submitModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeSubmitModal() {
    saveSubmitDraft(); // 关闭前暂存草稿，下次打开自动恢复
    submitModal.classList.add('hidden');
    document.body.style.overflow = '';
    submitMessage.classList.add('hidden');
    submitForm.reset();
  }

  // ==================== 提交草稿自动保存 ====================
  function saveSubmitDraft() {
    const draft = {
      submitName: $('submitName').value,
      submitUrl: $('submitUrl').value,
      submitCategory: $('submitCategory').value,
      submitDesc: $('submitDesc').value,
      submitIcp: $('submitIcp').value
    };
    const hasContent = Object.keys(draft).some(function(k) {
      return String(draft[k]).trim() !== '';
    });
    if (!hasContent) { clearSubmitDraft(); return; } // 全空则不存
    try { localStorage.setItem(STORAGE_KEYS.SUBMIT_DRAFT, JSON.stringify(draft)); } catch (e) { /* ignore */ }
  }

  function loadSubmitDraft() {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMIT_DRAFT)) || null; } catch (e) { raw = null; }
    if (!raw) return;
    const ids = ['submitName', 'submitUrl', 'submitCategory', 'submitDesc', 'submitIcp'];
    const hasContent = ids.some(function(id) {
      return raw[id] !== undefined && raw[id] !== null && String(raw[id]).trim() !== '';
    });
    if (!hasContent) return;
    ids.forEach(function(id) { if (raw[id]) $(id).value = raw[id]; });
    showSubmitMessage('✏️ 已恢复上次未提交的内容，可直接继续填写', 'success');
  }

  function clearSubmitDraft() {
    try { localStorage.removeItem(STORAGE_KEYS.SUBMIT_DRAFT); } catch (e) { /* ignore */ }
  }

  // ==================== 搜索键盘处理 ====================
  function handleSearchKeydown(e) {
    if (e.key === 'Enter') {
      if (suggestionsVisible && activeSuggestionIndex >= 0) {
        // 回车选择高亮建议
        const items = suggestions.querySelectorAll('.suggestion-item');
        const item = items[activeSuggestionIndex];
        if (item) {
          item.click();
          return;
        }
      }
      handleSearch();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const items = suggestions.querySelectorAll('.suggestion-item');
      if (items.length > 0) {
        e.preventDefault();
        const direction = e.key === 'ArrowDown' ? 1 : -1;
        activeSuggestionIndex = (activeSuggestionIndex + direction + items.length) % items.length;
        items.forEach((item, i) => {
          item.classList.toggle('active', i === activeSuggestionIndex);
        });
      }
    }
  }

  let suggestionsVisible = false;
  let activeSuggestionIndex = -1;

  // ==================== 搜索处理 ====================
  function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
      searchInput.focus();
      return;
    }

    // 智能识别：网址形式（如 bilibili.com）→ 直达 / 引导提交收录；其余走关键词搜索
    const urlObj = normalizeUrl(query);
    if (urlObj) {
      handleSearchAsUrl(urlObj, query);
      return;
    }

    suggestions.classList.add('hidden');
    historyPanel.classList.add('hidden');
    hideSearchUrlMsg();
    addToHistory(query);
    renderResults(query);
    scrollToResults();
  }

  // 主搜索框输入网址：已收录 → 直达；未收录 → 引导提交收录
  function handleSearchAsUrl(u, rawQuery) {
    const url = u.href;
    const site = matchOfficialSite(u.hostname);

    suggestions.classList.add('hidden');
    historyPanel.classList.add('hidden');
    hideSearchUrlMsg();
    addToHistory(rawQuery);

    if (site) {
      const verified = !site.status || site.status === STATUS.APPROVED;
      showSearchUrlMsg(
        (verified ? '✅ 已认证：' : '🟠 待核实：') + escapeHtml(site.name) +
        '（' + escapeHtml(site.url) + '）正在打开…',
        'success'
      );
      window.open(url, '_blank', 'noopener');
      return;
    }

    // 未收录 → 引导提交收录（由管理员人工核实），或直接访问
    showSearchUrlMsg(
      '⚠️「' + escapeHtml(url) + '」尚未收录。提交收录将由管理员人工核实，或直接访问？',
      'warn',
      [
        { label: '📝 提交收录', kind: 'primary', fn: function() {
            hideSearchUrlMsg();
            openSubmitModal(url);
          } },
        { label: '直接访问', fn: function() {
            hideSearchUrlMsg();
            window.open(url, '_blank', 'noopener');
          } }
      ]
    );
  }

  // 通用提示条：显示文本 + 可选操作按钮（actions: [{label, kind, fn}]）
  function showUrlMsg(el, text, type, actions) {
    if (!el) return;
    el.textContent = '';
    const span = document.createElement('span');
    span.textContent = text;
    el.appendChild(span);
    (actions || []).forEach(function(a) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = a.label;
      btn.className = 'url-go-msg-btn' + (a.kind ? ' ' + a.kind : '');
      btn.addEventListener('click', a.fn);
      el.appendChild(btn);
    });
    el.className = 'url-go-msg' + (type ? ' ' + type : '');
  }

  function showSearchUrlMsg(text, type, actions) {
    showUrlMsg(searchUrlMsg, text, type, actions);
  }

  function hideSearchUrlMsg() {
    if (searchUrlMsg) searchUrlMsg.classList.add('hidden');
  }

  // 规范化输入为合法 URL，非法返回 null
  function normalizeUrl(input) {
    let raw = String(input || '').trim();
    if (!raw) return null;
    if (/\s/.test(raw)) return null;                  // 含空格视为无效
    if (/[\u4e00-\u9fa5]/.test(raw)) return null;      // 中文域名暂不支持
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(raw)) {
      raw = 'https://' + raw;                          // 自动补全协议
    }
    try {
      const u = new URL(raw);
      if (!u.hostname || u.hostname.indexOf('.') < 0) return null;
      // 纯数字 IP（如 12306 → 0.0.48.18）不是网址，避免数字品牌误判为 IPv4 直达
      if (!/[a-zA-Z]/.test(u.hostname)) return null;
      return u;
    } catch (e) {
      return null;
    }
  }

  // 主机名归一化（去 www. 前缀、统一小写）
  function hostKey(hostname) {
    return String(hostname).replace(/^www\./, '').toLowerCase();
  }

  // 在认证库 + 社区池中匹配域名（官方库优先）
  function matchOfficialSite(hostname) {
    const key = hostKey(hostname);
    const community = getExtraSites().filter(function(s) { return s.status !== STATUS.REJECTED; });
    const all = OFFICIAL_SITES.concat(community);
    for (let i = 0; i < all.length; i++) {
      try {
        if (hostKey(new URL(all[i].url).hostname) === key) return all[i];
      } catch (e) { /* 忽略坏 URL */ }
    }
    return null;
  }

  // ==================== 搜索建议 ====================
  function showSuggestions(query) {
    if (!query || !query.trim()) {
      suggestions.classList.add('hidden');
      suggestionsVisible = false;
      activeSuggestionIndex = -1;
      return;
    }

    const results = searchAllSites(query).slice(0, 6);
    if (results.length === 0) {
      suggestions.classList.add('hidden');
      suggestionsVisible = false;
      activeSuggestionIndex = -1;
      return;
    }

    suggestions.innerHTML = results.map(function(site, i) {
      const pending = site.source === 'community' ? '<span class="suggestion-pending">待核实</span>' : '';
      return '<div class="suggestion-item" data-url="' + site.url + '" data-name="' + escapeHtml(site.name) + '">' +
        '<div class="suggestion-icon">' + faviconHtml(site.url, site.name) + '</div>' +
        '<div class="suggestion-info">' +
          '<div class="suggestion-name">' + highlightMatch(site.name, query) + pending + '</div>' +
          '<div class="suggestion-desc">' + escapeHtml(site.desc) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    suggestions.classList.remove('hidden');
    suggestionsVisible = true;
    activeSuggestionIndex = -1;

    // 绑定建议项点击
    suggestions.querySelectorAll('.suggestion-item').forEach(function(item) {
      item.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        searchInput.value = name;
        suggestions.classList.add('hidden');
        suggestionsVisible = false;
        addToHistory(name);
        renderResults(name);
        scrollToResults();
      });
    });
  }

  // ==================== 渲染搜索结果 ====================
  function renderResults(query) {
    const results = searchAllSites(query);

    resultsTitle.textContent = '搜索 "' + query + '" 的结果（共 ' + results.length + ' 条）';

    if (results.length === 0) {
      resultsList.innerHTML = renderNoResult(query);
    } else {
      resultsList.innerHTML = results.map(function(site, index) {
        return renderResultCard(site, index === 0);
      }).join('');

      // 绑定收藏按钮
      resultsList.querySelectorAll('.fav-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const url = this.getAttribute('data-url');
          const name = this.getAttribute('data-name');
          const desc = this.getAttribute('data-desc');
          const category = this.getAttribute('data-category');
          const removed = toggleFavorite({ name, url, desc, category });
          // 更新按钮状态
          this.classList.toggle('active', !removed);
          this.innerHTML = removed ? starIcon + ' 收藏' : starIcon + ' ✓ 已收藏';
        });
      });
    }

    resultsSection.classList.remove('hidden');
  }

  const starIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';

  // ==================== 渲染单个结果卡片 ====================
  function renderResultCard(site, isFirst) {
    const isOfficial = site.source !== 'community';
    const isApproved = site.status === STATUS.APPROVED;        // 社区站已审核通过
    const isPending = site.status !== STATUS.APPROVED;          // 未通过的社区站（待审核）
    const verified = isOfficial || isApproved;                  // 是否为认证状态
    const officialClass = (isFirst && verified) ? ' official' : '';
    let verifiedBadge = '';
    if (verified) {
      if (isFirst || isApproved) {
        verifiedBadge = '<span class="verified-badge">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 4.5L6 4L5 7.5L2 9L3.5 12L2 15L5 16.5L6 20L9.5 19.5L12 22L14.5 19.5L18 20L19 16.5L22 15L20.5 12L22 9L19 7.5L18 4L14.5 4.5L12 2ZM10.5 15.5L7 12L8.4 10.6L10.5 12.7L15.6 7.6L17 9L10.5 15.5Z"/></svg>' +
          '官方认证' +
        '</span>';
      }
    } else {
      verifiedBadge = '<span class="pending-badge">⏳ 待核实</span>';
    }

    const icpInfo = site.icp ?
      '<span class="result-meta-item">📋 备案: ' + escapeHtml(site.icp) + '</span>' : '';

    const httpsIcon = site.url.startsWith('https://') ?
      '<span class="result-meta-item">🔒 HTTPS</span>' : '';

    const faved = isFavorite(site.url);
    const favBtnClass = faved ? 'fav-btn active' : 'fav-btn';

    return '<div class="result-card' + officialClass + '">' +
      '<div class="result-header">' +
        '<div class="result-title-area">' +
          '<span class="result-name">' + highlightMatch(site.name, '') + '</span>' +
          verifiedBadge +
          '<span class="result-category">' + escapeHtml(site.category) + '</span>' +
        '</div>' +
      '</div>' +
      '<p class="result-desc">' + escapeHtml(site.desc) + '</p>' +
      '<div class="result-url">' +
        '<svg class="result-url-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
          '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>' +
          '<path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>' +
        '</svg>' +
        '<span>' + escapeHtml(site.url) + '</span>' +
      '</div>' +
      '<div class="result-meta">' +
        httpsIcon +
        icpInfo +
        (isFirst && isOfficial ? '<span class="result-meta-item">✓ 人工核实</span>' : '') +
        (isApproved ? '<span class="result-meta-item">🤝 社区审核通过</span>' : '') +
        (isPending && !isOfficial ? '<span class="result-meta-item">🤝 社区收录 · 人工核实中</span>' : '') +
      '</div>' +
      '<div class="result-actions">' +
        '<a href="' + site.url + '" target="_blank" rel="noopener noreferrer" class="enter-btn">' +
          '进入官网' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<path d="M5 12h14M12 5l7 7-7 7"/>' +
          '</svg>' +
        '</a>' +
        '<button class="' + favBtnClass + '" data-url="' + site.url + '" data-name="' + escapeHtml(site.name) + '" data-desc="' + escapeHtml(site.desc) + '" data-category="' + escapeHtml(site.category) + '" title="' + (faved ? '取消收藏' : '收藏到我的收藏夹') + '">' +
          starIcon + (faved ? ' 已收藏' : ' 收藏') +
        '</button>' +
      '</div>' +
    '</div>';
  }

  // ==================== 渲染未收录结果 ====================
  function renderNoResult(query) {
    const encodedQuery = encodeURIComponent(query);
    return '<div class="no-result">' +
      '<div class="no-result-icon">🔍</div>' +
      '<div class="no-result-title">暂未收录 "' + escapeHtml(query) + '" 的官方网站</div>' +
      '<div class="no-result-desc">' +
        '该关键词暂未在我们的认证数据库中找到匹配的官方网站。<br>' +
        '建议您通过以下可信渠道进一步核实：' +
      '</div>' +
      '<div class="no-result-links">' +
        '<a href="https://www.baidu.com/s?wd=' + encodedQuery + '+官方网站" target="_blank" rel="noopener" class="no-result-link">🔍 百度搜索</a>' +
        '<a href="https://www.bing.com/search?q=' + encodedQuery + '+官方网站" target="_blank" rel="noopener" class="no-result-link">🔍 必应搜索</a>' +
        '<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener" class="no-result-link">📋 ICP备案查询</a>' +
      '</div>' +
    '</div>';
  }

  // ==================== 渲染热门搜索 ====================
  function renderHotTags() {
    hotTags.innerHTML = HOT_KEYWORDS.map(function(keyword) {
      return '<span class="hot-tag" data-keyword="' + escapeHtml(keyword) + '">' + escapeHtml(keyword) + '</span>';
    }).join('');

    hotTags.querySelectorAll('.hot-tag').forEach(function(tag) {
      tag.addEventListener('click', function() {
        const keyword = this.getAttribute('data-keyword');
        searchInput.value = keyword;
        renderResults(keyword);
        scrollToResults();
      });
    });
  }

  // ==================== 渲染分类导航 ====================
  function renderCategories() {
    const categories = getCategories();
    categoryGrid.innerHTML = categories.map(function(cat) {
      const sites = OFFICIAL_SITES.filter(function(s) { return s.category === cat; });
      const siteTags = sites.slice(0, 8).map(function(s) {
        return '<span class="category-site-tag" data-url="' + s.url + '" data-name="' + escapeHtml(s.name) + '">' +
          faviconHtml(s.url, s.name, 16) +
          escapeHtml(s.name) +
        '</span>';
      }).join('');
      const moreTag = sites.length > 8 ?
        '<span class="category-site-tag" style="color:var(--text-light)">+' + (sites.length - 8) + ' 更多</span>' : '';

      return '<div class="category-card" data-category="' + escapeHtml(cat) + '">' +
        '<div class="category-card-header">' +
          '<div class="category-card-title">' + getCategoryIcon(cat) + ' ' + escapeHtml(cat) + '</div>' +
          '<span class="category-count">' + sites.length + ' 个网站</span>' +
        '</div>' +
        '<div class="category-sites">' + siteTags + moreTag + '</div>' +
      '</div>';
    }).join('');

    // 绑定分类卡片点击
    categoryGrid.querySelectorAll('.category-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        const tag = e.target.closest('.category-site-tag');
        if (tag && tag.getAttribute('data-name')) {
          const name = tag.getAttribute('data-name');
          searchInput.value = name;
          renderResults(name);
          scrollToResults();
        } else if (!tag) {
          const category = this.getAttribute('data-category');
          searchInput.value = category;
          renderResults(category);
          scrollToResults();
        }
      });
    });
  }

  // ==================== 网站提交处理（提交即收录） ====================
  function handleSubmitSite(e) {
    e.preventDefault();

    const name = $('submitName').value.trim();
    const url = $('submitUrl').value.trim();
    const category = $('submitCategory').value;
    const desc = $('submitDesc').value.trim();
    const icp = $('submitIcp').value.trim();

    if (!name || !url) {
      showSubmitMessage('请填写网站名称和官方地址', 'error');
      return;
    }

    // 简单校验 URL
    if (!/^https?:\/\/.+\..+/.test(url)) {
      showSubmitMessage('请输入有效的网址（需以 http:// 或 https:// 开头）', 'error');
      return;
    }

    // 去重：已在官方库或社区池中的站点不重复收录
    const existing = findExistingSite(url);
    if (existing) {
      const where = existing.type === 'official' ? '官方认证库' : '社区收录池';
      showSubmitMessage('ℹ️ 该网站已存在于「' + where + '」，搜索「' + existing.site.name + '」即可直达', 'error');
      return;
    }

    // 生成搜索关键词（名称 + 域名主体）
    const domainPart = normalizeUrlKey(url).split('/')[0].replace(/\.[a-z]+$/, '').replace(/[.-]/g, ' ');
    const keywords = [name, domainPart].filter(Boolean);

    // 提交（云端模式写入云端数据库；本地模式写入 localStorage）→ 返回 {ok, msg, site}
    const submitBtn = submitForm.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    KadaStore.submitSite({ name, url, category, desc, icp, keywords }).then(function(result) {
      if (submitBtn) submitBtn.disabled = false;
      if (!result.ok) {
        showSubmitMessage(result.msg || '提交失败，请稍后重试', 'error');
        return;
      }
      // 站点已由 store 插入（本地模式写盘 / 云端模式入缓存），此处仅处理附加逻辑
      // 本地模式：同时记录原始提交单（云端模式已由云函数存储，无需本地冗余）
      if (!KadaStore.isCloud()) {
        try {
          const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) || [];
          submissions.push({ name, url, category, desc, icp, time: result.site.submittedAt });
          localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
        } catch (err) { /* ignore */ }
      }

      // 刷新统计
      updateStats();

      showSubmitMessage('✅ 已收录！「' + name + '」现已进入社区收录池（标记待核实），立即搜索即可找到', 'success');
      clearSubmitDraft(); // 提交成功不再保留草稿
      submitForm.reset();
      setTimeout(closeSubmitModal, 3000);
    });
  }

  // ==================== 导出收录记录（管理员审核后正式收录） ====================
  function exportSubmissions() {
    const extraSites = getExtraSites();
    let submissions = [];
    try {
      submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) || [];
    } catch (err) { /* ignore */ }

    const payload = {
      exportedAt: new Date().toISOString(),
      note: '咔哒社区收录导出数据。communitySites 已进入搜索池（待核实）；正式收录步骤：审核后将该站点对象复制进 js/data.js 的 OFFICIAL_SITES 数组，删除 verified/source/submittedAt 字段（keywords 保留），即成为官方认证官网。',
      officialCount: OFFICIAL_SITES.length,
      communityCount: extraSites.length,
      communitySites: extraSites,
      rawSubmissions: submissions
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'kada-community-sites.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);

    showSubmitMessage('📤 已导出收录记录（' + extraSites.length + ' 条社区收录），可据此合并进认证库', 'success');
  }

  function showSubmitMessage(text, type) {
    submitMessage.textContent = text;
    submitMessage.className = 'submit-message ' + type;
    submitMessage.classList.remove('hidden');
  }

  // ==================== 管理员审核系统 ====================

  // 更新某站点的审核状态（云端模式走云函数，本地模式直改存储）→ Promise<boolean>
  function updateSiteStatus(url, status, note) {
    return KadaStore.reviewSite(url, status, note).then(function(r) {
      if (!r.ok) return false;
      // 同步本地展示缓存（与云端保持一致）
      const sites = getExtraSites();
      const site = sites.find(function(s) { return s.url === url; });
      if (site) {
        site.status = status;
        site.reviewedAt = new Date().toISOString();
        site.reviewNote = note || '';
        site.reviewedBy = getAdmin().username;
        site.verified = status === STATUS.APPROVED;
        saveExtraSites(sites);
      }
      updateStats();
      return true;
    });
  }

  function formatTime(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0');
    } catch (e) { return ''; }
  }

  // 审核面板状态徽章
  function adminStatusBadge(status) {
    if (status === STATUS.APPROVED) return '<span class="admin-badge admin-badge-approved">✓ 已通过</span>';
    if (status === STATUS.REJECTED) return '<span class="admin-badge admin-badge-rejected">✗ 已拒绝</span>';
    return '<span class="admin-badge admin-badge-pending">⏳ 待审核</span>';
  }

  // 管理员登录态导航反馈：仅更新文字，保留 🔐 图标（小屏下图标单独展示）
  function setAdminLinkLabel(label) {
    if (!adminLink) return;
    adminLink.title = label === '管理审核' ? '管理员审核面板' : '管理员登录';
    const t = adminLink.querySelector('.admin-link-text');
    if (t) t.textContent = label;
  }

  // 打开管理员登录弹窗
  function openAdminLogin() {
    if (!adminLoginModal) return;
    adminLoginModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const input = $('adminUsernameInput');
    if (input) { setTimeout(function() { input.focus(); }, 50); }
  }

  // 打开管理员面板
  function openAdminPanel() {
    if (!isAdminLoggedIn()) {
      openAdminLogin();
      return;
    }
    adminModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderAdminPanel();
  }

  function closeAdminPanel() {
    adminModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // 渲染审核统计（供面板打开与 updateStats 复用）
  function renderAdminStats() {
    const sites = getExtraSites();
    const pending = sites.filter(function(s) { return !s.status || s.status === STATUS.PENDING; });
    const approved = sites.filter(function(s) { return s.status === STATUS.APPROVED; });
    const rejected = sites.filter(function(s) { return s.status === STATUS.REJECTED; });

    if (adminStats) {
      adminStats.innerHTML =
        '<div class="admin-stat"><span class="admin-stat-num">' + pending.length + '</span><span class="admin-stat-label">待审核</span></div>' +
        '<div class="admin-stat"><span class="admin-stat-num">' + approved.length + '</span><span class="admin-stat-label">已通过</span></div>' +
        '<div class="admin-stat"><span class="admin-stat-num">' + rejected.length + '</span><span class="admin-stat-label">已拒绝</span></div>' +
        '<div class="admin-stat"><span class="admin-stat-num">' + OFFICIAL_SITES.length + '</span><span class="admin-stat-label">官方认证</span></div>';
    }
  }

  // 渲染管理面板（统计 + 列表）
  function renderAdminPanel() {
    const sites = getExtraSites();
    const pending = sites.filter(function(s) { return !s.status || s.status === STATUS.PENDING; });
    const approved = sites.filter(function(s) { return s.status === STATUS.APPROVED; });
    const rejected = sites.filter(function(s) { return s.status === STATUS.REJECTED; });

    if (adminUsername) adminUsername.textContent = getAdmin().username;
    renderAdminStats();
    if (adminTabs) {
      adminTabs.innerHTML =
        '<button class="admin-tab active" data-tab="pending">待审核 (' + pending.length + ')</button>' +
        '<button class="admin-tab" data-tab="approved">已通过 (' + approved.length + ')</button>' +
        '<button class="admin-tab" data-tab="rejected">已拒绝 (' + rejected.length + ')</button>';
    }
    renderAdminList('pending', pending);
  }

  // 渲染审核列表
  function renderAdminList(status, sites) {
    const list = sites || getExtraSites().filter(function(s) {
      return status === STATUS.PENDING ? (!s.status || s.status === STATUS.PENDING) : s.status === status;
    });

    if (list.length === 0) {
      adminList.innerHTML = '<div class="admin-empty">暂无数据</div>';
      return;
    }

    adminList.innerHTML = list.map(function(site) {
      const time = formatTime(site.submittedAt);
      const reviewInfo = site.reviewedAt ?
        '<div class="admin-card-note">审核于 ' + formatTime(site.reviewedAt) +
        (site.reviewNote ? ' · 备注：' + escapeHtml(site.reviewNote) : '') + '</div>' : '';

      let actions = '';
      if (status === STATUS.PENDING) {
        actions =
          '<div class="admin-actions">' +
            '<input type="text" class="admin-note-input" data-url="' + site.url + '" placeholder="审核备注 / 拒绝原因（可选）" maxlength="100">' +
            '<button class="admin-btn admin-btn-approve" data-action="approve" data-url="' + site.url + '">✓ 通过</button>' +
            '<button class="admin-btn admin-btn-reject" data-action="reject" data-url="' + site.url + '">✗ 拒绝</button>' +
          '</div>';
      } else if (status === STATUS.APPROVED) {
        actions =
          '<div class="admin-actions">' +
            '<button class="admin-btn admin-btn-ghost" data-action="restore" data-url="' + site.url + '">↩ 打回待审核</button>' +
          '</div>';
      } else {
        actions =
          '<div class="admin-actions">' +
            '<button class="admin-btn admin-btn-ghost" data-action="restore" data-url="' + site.url + '">↩ 恢复</button>' +
          '</div>';
      }

      return '<div class="admin-card">' +
        '<div class="admin-card-header">' +
          '<div class="admin-card-title">' + faviconHtml(site.url, site.name, 20) +
            '<strong>' + escapeHtml(site.name) + '</strong>' +
            adminStatusBadge(site.status || STATUS.PENDING) +
          '</div>' +
          '<span class="admin-card-category">' + escapeHtml(site.category || '') + '</span>' +
        '</div>' +
        '<div class="admin-card-url"><a href="' + site.url + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(site.url) + '</a></div>' +
        '<div class="admin-card-desc">' + escapeHtml(site.desc || '') +
          (site.icp ? '<span class="admin-card-icp">📋 ' + escapeHtml(site.icp) + '</span>' : '') +
        '</div>' +
        '<div class="admin-card-time">🕐 提交于 ' + (time || '未知') + '</div>' +
        reviewInfo +
        actions +
      '</div>';
    }).join('');
  }

  // 通过 / 拒绝 / 恢复 处理
  function handleAdminAction(action, url, noteInput) {
    const next = action === 'approve' ? STATUS.APPROVED :
                 action === 'reject'  ? STATUS.REJECTED : STATUS.PENDING;
    const note = action === 'restore' ? '' : (noteInput ? noteInput.value : '');
    updateSiteStatus(url, next, note).then(function(ok) {
      if (ok) renderAdminPanel();
    });
  }

  // 修改管理员密码（云端模式走云函数；本地模式直改 localStorage）→ Promise<{ok, msg}>
  function changeAdminPassword(currentPwd, newPwd) {
    if (KadaStore.isCloud()) {
      return KadaStore.changePassword(currentPwd, newPwd);
    }
    const admin = getAdmin();
    if (hashPwd(currentPwd) !== admin.passwordHash) {
      return Promise.resolve({ ok: false, msg: '当前密码不正确' });
    }
    if (newPwd.length < 6) {
      return Promise.resolve({ ok: false, msg: '新密码至少 6 位' });
    }
    admin.passwordHash = hashPwd(newPwd);
    try { localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin)); } catch (e) { /* ignore */ }
    return Promise.resolve({ ok: true, msg: '✅ 密码已更新' });
  }

  // ==================== 工具函数 ====================

  // 滚动到结果区域
  function scrollToResults() {
    setTimeout(function() {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // 清除搜索
  function clearSearch() {
    searchInput.value = '';
    resultsSection.classList.add('hidden');
    searchInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // HTML转义
  function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  // 关键词高亮
  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query);
    const regex = new RegExp('(' + escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escapedText.replace(regex, '<mark style="background:var(--mark-bg);color:var(--primary);padding:0 2px;border-radius:2px;">$1</mark>');
  }

  // 提取域名用于 favicon
  function getDomain(url) {
    try {
      const u = new URL(url);
      return u.hostname;
    } catch (e) {
      return url.replace(/^https?:\/\//, '').split('/')[0];
    }
  }

  // Favicon HTML（使用 Google favicon 服务）
  function faviconHtml(url, name, size) {
    const s = size || 32;
    const domain = getDomain(url);
    return '<img src="https://www.google.com/s2/favicons?domain=' + encodeURIComponent(domain) + '&sz=' + s + '" alt="" loading="lazy" onerror="this.style.display=\'none\'" style="width:' + s + 'px;height:' + s + 'px;">';
  }

  // 获取分类图标
  function getCategoryIcon(cat) {
    const icons = {
      '电商购物': '🛒',
      '社交媒体': '💬',
      '出行交通': '🚄',
      '金融支付': '🏦',
      '政府机构': '🏛️',
      '教育考试': '🎓',
      '生活服务': '🏠',
      '科技互联网': '💻',
      '新闻资讯': '📰',
      '通信运营商': '📱',
      '快递物流': '📦',
      '公共服务': '🔌',
      '视频娱乐': '🎬',
      '音乐阅读': '🎵',
      '国际常用': '🌍',
      '开发者服务': '⌨️',
      '高等院校': '🏫'
    };
    return icons[cat] || '📁';
  }

  // ==================== 启动 ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
