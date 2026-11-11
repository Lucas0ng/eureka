'use strict';

/* Storage contract — do not rename the original keys.
   eureka-items-v1: [{ id, text, cat:'now'|'long', done, t, m?, dt? }]
   eureka-stats-v1: { pts, days:{'Y-M-D': n}, focus, wilt? }
   eureka-forest-v1: { planted:[], migrated, focusBonus }
   Backup file: { items, st, forest? } — old backups without forest still restore. */
const ITEM_KEY = 'eureka-items-v1';
const STAT_KEY = 'eureka-stats-v1';
const FOREST_KEY = 'eureka-forest-v1';
const ODDS = {
  normal: [['common', 58], ['rare', 27], ['epic', 12], ['legendary', 3]],
  boosted: [['common', 34], ['rare', 36], ['epic', 20], ['legendary', 10]]
};
const LEVELS = [
  { name: '新芽', icon: 'sprout' },
  { name: '小苗', icon: 'sapling' },
  { name: '小树', icon: 'tree' },
  { name: '行动派', icon: 'spark' },
  { name: '专注达人', icon: 'flame' },
  { name: '执行王', icon: 'arrow' },
  { name: 'Eureka 大师', icon: 'e' }
];
function levelMeta(l) {
  return LEVELS[Math.min(Math.max(l, 0), LEVELS.length - 1)];
}
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'ico');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#i-' + name);
  svg.appendChild(use);
  return svg;
}
const RING_C = 2 * Math.PI * 46;
const DOC_TITLE = 'Eureka！灵感记事本';

const $ = id => document.getElementById(id);

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (tag === 'button') n.type = 'button';
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function loadRaw(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null || raw === '') return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

let items = loadRaw(ITEM_KEY);
let st = loadRaw(STAT_KEY);
if (!Array.isArray(items)) items = [];
if (!st || typeof st !== 'object' || Array.isArray(st)) st = { pts: 0, days: {}, focus: 0 };

let tab = 'now';
let view = 'home';
let pickId = null;
let selM = 0;
let focusId = null;
let mode = 'focus';
let len = 25;
let left = 25 * 60;
let endAt = 0;
let tick = null;
let running = false;
let started = false;
let wilted = false;
let locked = false;
let lockY = 0;
let sheetTimer = 0;
let pendingBackup = null;

function ensureStats() {
  if (!st || typeof st !== 'object' || Array.isArray(st)) st = {};
  if (typeof st.pts !== 'number' || !isFinite(st.pts)) st.pts = 0;
  if (!st.days || typeof st.days !== 'object' || Array.isArray(st.days)) st.days = {};
  if (typeof st.focus !== 'number' || !isFinite(st.focus)) st.focus = 0;
}

function normalizeItems() {
  if (!Array.isArray(items)) items = [];
  items.forEach(i => {
    if (i && typeof i === 'object' && i.id != null) i.id = String(i.id);
  });
}

ensureStats();
normalizeItems();

function save() {
  localStorage.setItem(ITEM_KEY, JSON.stringify(items));
}
function saveS() {
  localStorage.setItem(STAT_KEY, JSON.stringify(st));
}

let forest = loadRaw(FOREST_KEY);
let pendingReveal = null;
let revealTimer = 0;
let scrollGrove = false;
const TREES = window.EUREKA_TREES || [];
const TREE_BY_ID = {};
TREES.forEach(t => { TREE_BY_ID[t.id] = t; });

function ensureForest() {
  if (!forest || typeof forest !== 'object' || Array.isArray(forest)) forest = {};
  if (!Array.isArray(forest.planted)) forest.planted = [];
  if (typeof forest.focusBonus !== 'number') forest.focusBonus = 0;
}
function saveForest() {
  localStorage.setItem(FOREST_KEY, JSON.stringify(forest));
}
function treeById(id) { return TREE_BY_ID[id] || null; }
function applyForestBackup(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.planted)) return;
  forest = {
    planted: raw.planted.filter(p => p && treeById(p.treeId)).map(p => ({
      id: String(p.id || (Date.now() + Math.random())),
      taskId: p.taskId == null ? '' : String(p.taskId),
      treeId: p.treeId,
      at: p.at || 0,
      scale: Number(p.scale) || 1,
      flip: !!p.flip,
      y: Number(p.y) || 0,
      jitter: Number(p.jitter) || 0
    })),
    migrated: true,
    focusBonus: Number(raw.focusBonus) || 0
  };
  saveForest();
}
function rollTier(boosted) {
  const table = boosted ? ODDS.boosted : ODDS.normal;
  let r = Math.random() * 100;
  for (let i = 0; i < table.length; i++) {
    r -= table[i][1];
    if (r < 0) return table[i][0];
  }
  return 'common';
}
function rollTree(boosted) {
  const tier = rollTier(boosted);
  const pool = TREES.filter(t => t.tier === tier);
  return pool[Math.floor(Math.random() * pool.length)] || TREES[0];
}
function makePlant(taskId, tree) {
  return {
    id: Date.now() + '' + Math.random(),
    taskId: taskId == null ? '' : String(taskId),
    treeId: tree.id,
    at: Date.now(),
    scale: Math.round((0.84 + Math.random() * 0.28) * 100) / 100,
    flip: Math.random() < 0.45,
    y: Math.floor(Math.random() * 8),
    jitter: Math.floor(Math.random() * 14) - 6
  };
}
function alreadyPlanted(taskId) {
  const id = String(taskId);
  return forest.planted.some(p => p.taskId && p.taskId === id);
}
function plantForTask(it) {
  ensureForest();
  if (!it || alreadyPlanted(it.id)) return null;
  const boosted = forest.focusBonus > 0;
  const tree = rollTree(boosted);
  if (!tree) return null;
  if (boosted) forest.focusBonus = 0;
  const planted = makePlant(it.id, tree);
  forest.planted.push(planted);
  saveForest();
  scrollGrove = true;
  return { tree, planted, boosted };
}
function migrateForest() {
  ensureForest();
  if (forest.migrated) return;
  const done = items.filter(i => i && i.done);
  const cap = Math.min(done.length, 24);
  for (let i = 0; i < cap; i++) {
    if (alreadyPlanted(done[i].id)) continue;
    const tree = rollTree(false);
    if (tree) forest.planted.push(makePlant(done[i].id, tree));
  }
  forest.migrated = true;
  saveForest();
}
function renderTreeSvg(tree) {
  const holder = document.createElement('template');
  holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (tree.vb || '0 0 64 80') + '" aria-hidden="true">' + tree.svg + '</svg>';
  return holder.content.firstElementChild;
}
function renderGrove() {
  ensureForest();
  const owned = {};
  forest.planted.forEach(p => { owned[p.treeId] = (owned[p.treeId] || 0) + 1; });
  const kinds = Object.keys(owned).length;
  $('groveNote').textContent = forest.planted.length
    ? '已种 ' + forest.planted.length + ' 棵 · 图鉴 ' + kinds + '/30。点按森林打开图鉴。'
    : '完成一件事，这里会长出第一棵树。';
  const world = $('groveWorld');
  world.replaceChildren();
  const ground = document.createElement('div');
  ground.className = 'grove-ground';
  const n = forest.planted.length;
  const width = Math.max(340, 28 + n * 46 + 36);
  world.style.width = width + 'px';
  world.appendChild(ground);
  for (let i = 0; i < Math.ceil(width / 88); i++) {
    const shrub = document.createElement('i');
    shrub.className = 'shrub';
    shrub.style.left = (18 + i * 88 + (i % 2) * 12) + 'px';
    shrub.style.transform = 'scale(' + (0.8 + (i % 3) * 0.15) + ')';
    world.appendChild(shrub);
  }
  if (!n) {
    const empty = document.createElement('p');
    empty.className = 'grove-empty';
    empty.textContent = '草地还空着';
    world.appendChild(empty);
  }
  forest.planted.forEach((p, i) => {
    const spec = treeById(p.treeId);
    if (!spec) return;
    const node = document.createElement('div');
    node.className = 'grove-tree tier-' + spec.tier;
    const scale = p.scale || 1;
    node.style.left = (8 + i * 46 + (p.jitter || 0)) + 'px';
    node.style.bottom = (26 + (p.y || 0)) + 'px';
    node.style.zIndex = String(i + 1);
    node.style.transform = 'scale(' + (p.flip ? -scale : scale) + ', ' + scale + ')';
    node.appendChild(renderTreeSvg(spec));
    world.appendChild(node);
  });
  if (scrollGrove) {
    scrollGrove = false;
    requestAnimationFrame(() => { $('grove').scrollLeft = $('grove').scrollWidth; });
  }
}
function renderCodex() {
  ensureForest();
  const owned = {};
  forest.planted.forEach(p => { owned[p.treeId] = (owned[p.treeId] || 0) + 1; });
  const found = Object.keys(owned).length;
  $('codexNote').textContent = '已发现 ' + found + '/30。普通 58% · 稀有 27% · 史诗 12% · 传说 3%。专注结束后，下一棵更容易出稀有。';
  const grid = $('codexGrid');
  grid.replaceChildren();
  TREES.forEach(tree => {
    const count = owned[tree.id] || 0;
    const card = el('div', 'codex-card' + (count ? '' : ' locked'));
    card.dataset.tier = tree.tier;
    const art = el('div', 'art');
    const svg = renderTreeSvg(tree);
    art.appendChild(svg);
    card.appendChild(art);
    card.appendChild(el('div', 'nm', count ? tree.name : '???'));
    const tier = el('span', 'tier tier-' + tree.tier, window.EUREKA_TIER_NAME[tree.tier] || tree.tier);
    card.appendChild(tier);
    const styleName = count ? (window.EUREKA_STYLE_NAME[tree.style] || '') : '';
    card.appendChild(el('div', 'subline', (styleName ? styleName + ' · ' : '') + '拥有 ' + count));
    grid.appendChild(card);
  });
}
function openCodex() {
  renderCodex();
  $('codex').hidden = false;
  lockBody();
}
function closeCodex() {
  $('codex').hidden = true;
  unlockBody();
}
function closeReveal() {
  clearTimeout(revealTimer);
  $('reveal').hidden = true;
  unlockBody();
}
function openReveal(info) {
  if (!info || !info.tree) return;
  const tree = info.tree;
  const card = $('revealCard');
  card.className = 'reveal-card tier-' + tree.tier;
  const rare = tree.tier === 'epic' || tree.tier === 'legendary';
  $('revealKicker').textContent = (info.boosted ? '专注加成 · ' : '') + (tree.tier === 'common' ? '种下了一棵树' : '新的树！');
  const art = $('revealArt');
  art.replaceChildren(renderTreeSvg(tree));
  $('revealName').textContent = tree.name;
  $('revealMeta').textContent = (window.EUREKA_TIER_NAME[tree.tier] || '') + ' · ' + (window.EUREKA_STYLE_NAME[tree.style] || '');
  $('reveal').hidden = false;
  lockBody();
  clearTimeout(revealTimer);
  if (!rare) revealTimer = setTimeout(closeReveal, tree.tier === 'rare' ? 2400 : 1700);
  if (tree.tier === 'legendary') vibrate([80, 40, 120]);
  else if (tree.tier !== 'common') vibrate(40);
}
function queueReveal(info) {
  if (!info) return;
  if ($('focus').classList.contains('show')) pendingReveal = info;
  else openReveal(info);
}
function grantFocusBonus() {
  ensureForest();
  forest.focusBonus = 1;
  saveForest();
}

function textOf(i) {
  return i && typeof i.text === 'string' ? i.text : '';
}
function pad(n) { return String(n).padStart(2, '0'); }
function dkey(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}
function dk(d) {
  const x = new Date(d);
  return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate());
}
function openCat(cat) {
  return items.filter(i => i && !i.done && i.cat === cat);
}
function level(p) {
  let l = 0, need = 50, acc = 0;
  while (p >= acc + need) { acc += need; l++; need = Math.round(need * 1.5); }
  return { l, acc, need };
}
function streak() {
  let n = 0;
  const d = new Date();
  if (!st.days[dkey(d)]) d.setDate(d.getDate() - 1);
  while (st.days[dkey(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}
function fmt(s) {
  s = Math.max(0, s | 0);
  return pad(Math.floor(s / 60)) + ':' + pad(s % 60);
}
function mLabel(m) {
  if (!m) return '';
  if (m >= 60) return '1 小时+';
  return m + ' 分钟';
}
function durationFor(item) {
  const m = item && Number(item.m);
  if (m && m <= 5) return 5;
  if (m && m <= 15) return 15;
  return 25;
}
function toast(m) {
  const t = $('toast');
  t.replaceChildren(document.createTextNode(m));
  t.classList.remove('act');
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 1800);
}
function toastAct(m, fn) {
  const t = $('toast');
  t.replaceChildren(document.createTextNode(m));
  const b = el('button', null, '撤销');
  b.addEventListener('click', () => { fn(); t.classList.remove('show', 'act'); });
  t.appendChild(b);
  t.classList.add('show', 'act');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show', 'act'), 4000);
}
function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#2C7A5E', '#C47A45', '#E3C27A', '#67A88C', '#D08A62'];
  for (let i = 0; i < 22; i++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = (Math.random() * 100) + '%';
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = (Math.random() * 0.2) + 's';
    c.style.width = (5 + Math.random() * 5) + 'px';
    c.style.height = (8 + Math.random() * 6) + 'px';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1600);
  }
}
function award(n, why) {
  const before = level(st.pts).l;
  st.pts = Math.max(0, st.pts + n);
  if (n > 0) {
    const k = dkey();
    st.days[k] = (st.days[k] || 0) + 1;
  }
  saveS();
  const after = level(st.pts).l;
  if (after > before) {
    toast('升级了！' + levelMeta(after).name);
    vibrate(200);
  } else if (n > 0) toast('+' + n + ' 分' + (why ? ' ' + why : ''));
}
function unaward(n) {
  st.pts = Math.max(0, st.pts - n);
  const k = dkey();
  if (st.days[k]) st.days[k]--;
  saveS();
}

function lockBody() {
  if (locked) return;
  locked = true;
  lockY = window.scrollY || 0;
  document.body.style.top = '-' + lockY + 'px';
  document.body.classList.add('lock');
}
function unlockBody() {
  if ($('focus').classList.contains('show')) return;
  if (!$('sheet').hidden && $('sheet').classList.contains('show')) return;
  if ($('codex') && !$('codex').hidden) return;
  if ($('reveal') && !$('reveal').hidden) return;
  if (!locked) return;
  locked = false;
  document.body.classList.remove('lock');
  document.body.style.top = '';
  window.scrollTo(0, lockY);
}

function setView(next) {
  view = next;
  $('viewHome').hidden = next !== 'home';
  $('viewStats').hidden = next !== 'stats';
  document.querySelectorAll('.tabbar button').forEach(b => {
    const on = b.dataset.view === next;
    b.classList.toggle('on', on);
    if (on) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  if (!locked) window.scrollTo(0, 0);
}

function choose() {
  const pool = openCat('now').length ? openCat('now') : openCat('long');
  if (!pool.length) { pickId = null; return { empty: true, same: false }; }
  const others = pool.filter(i => i.id !== pickId);
  const src = others.length ? others : pool;
  const p = src[Math.floor(Math.random() * src.length)];
  const same = p.id === pickId;
  pickId = p.id;
  return { empty: false, same };
}

function homeSub() {
  if (!items.length) return '冒出念头先记下，再回到手头的事';
  if (openCat('now').length) return '先做一件，其余的先放着';
  if (openCat('long').length) return '长期的事，可以先拆成 5 分钟';
  return '今天先到这里。新的念头，随时记下来';
}
function renderPill() {
  const s = streak();
  const pill = $('pill');
  pill.replaceChildren();
  if (s > 0) {
    pill.appendChild(icon('flame'));
    pill.appendChild(document.createTextNode(String(s)));
  } else {
    pill.textContent = 'Lv.' + (level(st.pts).l + 1);
  }
}

function renderStats() {
  const L = level(st.pts);
  const meta = levelMeta(L.l);
  const lv = $('lv');
  lv.replaceChildren(document.createTextNode('Lv.' + (L.l + 1) + ' '), icon(meta.icon), document.createTextNode(' ' + meta.name));
  $('pts').textContent = st.pts + ' 分';
  const pct = Math.max(0, Math.min(100, ((st.pts - L.acc) / L.need) * 100));
  $('barFill').style.width = pct + '%';
  $('toNext').textContent = '再得 ' + (L.acc + L.need - st.pts) + ' 分升级';
  $('nToday').textContent = st.days[dkey()] || 0;
  $('nFocus').textContent = st.focus || 0;
  renderGrove();

  const done = items.filter(i => i && i.done).length;
  const dl = items.filter(i => i && i.done && i.cat === 'long').length;
  const badges = [
    ['spark', '第一条念头', items.length >= 1],
    ['check', '完成第一件', done >= 1],
    ['ten', '完成 10 件', done >= 10],
    ['tree', '完成长期目标', dl >= 1],
    ['timer', '第一次专注', (st.focus || 0) >= 1],
    ['timer-check', '专注 10 次', (st.focus || 0) >= 10],
    ['flame', '连续 3 天', streak() >= 3],
    ['crown', '连续 7 天', streak() >= 7]
  ];
  const box = $('badges');
  box.replaceChildren();
  badges.forEach(([glyph, name, got]) => {
    const b = el('span', 'badge' + (got ? ' got' : ''));
    b.append(icon(glyph), document.createTextNode(name));
    box.appendChild(b);
  });
}

function renderHome() {
  if (!items.some(i => i && i.id === pickId && !i.done)) choose();
  const p = items.find(i => i && i.id === pickId && !i.done);
  $('homeSub').textContent = homeSub();
  renderPill();
  const s = streak();
  $('pill').setAttribute('aria-label', s > 0 ? '连续 ' + s + ' 天，查看进度' : '查看进度');
  const pool = openCat('now').length ? openCat('now') : openCat('long');
  $('heroTop').hidden = !p;
  $('pickShuffle').hidden = !p || pool.length < 2;
  $('pickBody').hidden = !p;
  $('pickEmpty').hidden = !!p;
  if (!p) return;
  $('pickText').textContent = textOf(p);
  const bits = [];
  if (p.m) bits.push(p.m >= 60 ? '大约 1 小时以上' : '大约 ' + p.m + ' 分钟');
  bits.push(p.cat === 'long' ? '长期想做' : '立刻去做');
  $('pickMeta').textContent = bits.join(' · ');
  $('pickSplit').hidden = p.cat !== 'long';
}

function renderTabs() {
  const map = {
    now: ['立刻去做', openCat('now').length],
    long: ['长期想做', openCat('long').length],
    hist: ['已完成', items.filter(i => i && i.done).length]
  };
  $('segs').querySelectorAll('button').forEach(b => {
    const pair = map[b.dataset.tab];
    const on = b.dataset.tab === tab;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
    b.replaceChildren(document.createTextNode(pair[0]));
    if (pair[1]) b.appendChild(el('span', 'count', String(pair[1])));
  });
}

function checkButton(label) {
  const b = el('button', 'chk');
  b.dataset.act = 'toggle';
  b.setAttribute('aria-label', label);
  const dot = el('i', 'dot');
  dot.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.2 6.2 4.8 8.8 9.8 3.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  b.appendChild(dot);
  return b;
}
function moreButton() {
  const b = el('button', 'icon-btn');
  b.dataset.act = 'more';
  b.setAttribute('aria-label', '更多');
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="1.35" fill="currentColor"/><circle cx="12" cy="12" r="1.35" fill="currentColor"/><circle cx="18" cy="12" r="1.35" fill="currentColor"/></svg>';
  return b;
}

function renderList() {
  const ul = $('list');
  ul.replaceChildren();
  if (tab === 'hist') {
    const dn = items.filter(i => i && i.done).sort((a, b) => (b.dt || 0) - (a.dt || 0));
    if (!dn.length) {
      ul.appendChild(el('li', 'empty', '做完的事，会留在这里'));
      return;
    }
    const td = dk(Date.now());
    const yd = dk(Date.now() - 864e5);
    let last = '';
    dn.forEach(i => {
      const k = i.dt ? dk(i.dt) : 'old';
      if (k !== last) {
        last = k;
        const c = dn.filter(j => (j.dt ? dk(j.dt) : 'old') === k).length;
        const label = k === 'old' ? '更早' : k === td ? '今天' : k === yd ? '昨天' : (k.slice(5, 7) + '月' + k.slice(8) + '日');
        ul.appendChild(el('li', 'day', label + ' · 完成 ' + c + ' 件'));
      }
      const li = el('li', 'item done');
      li.dataset.id = i.id;
      li.appendChild(checkButton('恢复'));
      const copy = el('div', 'copy hist-copy');
      const title = el('span', 'title', textOf(i));
      const cat = i.cat === 'long' ? '长期' : '立刻';
      let tag = cat;
      if (i.dt) {
        const x = new Date(i.dt);
        tag += ' · ' + pad(x.getHours()) + ':' + pad(x.getMinutes());
      }
      copy.appendChild(title);
      copy.appendChild(el('span', 'tag', tag));
      li.appendChild(copy);
      const del = el('button', 'icon-btn quiet', '×');
      del.dataset.act = 'del';
      del.setAttribute('aria-label', '删除');
      li.appendChild(del);
      ul.appendChild(li);
    });
    return;
  }

  const list = items.filter(i => i && i.cat === tab && !i.done).sort((a, b) => (b.t || 0) - (a.t || 0));
  if (!list.length) {
    ul.appendChild(el('li', 'empty', tab === 'now' ? '立刻要做的，会显示在这里' : '先放着的想法，会显示在这里'));
    return;
  }
  list.forEach(i => {
    const li = el('li', 'item');
    li.dataset.id = i.id;
    li.appendChild(checkButton('完成'));
    const main = el('button', 'row-main');
    main.dataset.act = 'focus';
    const copy = el('span', 'copy');
    copy.appendChild(el('span', 'title', textOf(i)));
    if (i.m) copy.appendChild(el('span', 'tag', mLabel(i.m)));
    main.appendChild(copy);
    main.appendChild(el('span', 'go', '专注'));
    li.appendChild(main);
    li.appendChild(moreButton());
    ul.appendChild(li);
  });
}

function render() {
  renderStats();
  renderHome();
  renderTabs();
  renderList();
}

function addItem(cat) {
  const v = $('input').value.trim();
  if (!v) { $('input').focus(); return; }
  const item = { id: Date.now() + '' + Math.random(), text: v, cat, done: false, t: Date.now() };
  if (selM) item.m = selM;
  items.push(item);
  selM = 0;
  document.querySelectorAll('#ests button').forEach(b => {
    b.classList.remove('on');
    b.setAttribute('aria-pressed', 'false');
  });
  save();
  $('input').value = '';
  $('input').blur();
  tab = cat;
  render();
  toast(cat === 'now' ? '记下了，先回到手头的事' : '先放着，以后再做');
}

function deleteItem(it) {
  const idx = items.indexOf(it);
  if (idx < 0) return;
  items.splice(idx, 1);
  save();
  render();
  toastAct('已删除', () => {
    items.splice(Math.min(idx, items.length), 0, it);
    save();
    render();
  });
}

function closeSheet() {
  const root = $('sheet');
  root.classList.remove('show');
  document.body.classList.remove('sheeting');
  clearTimeout(sheetTimer);
  sheetTimer = setTimeout(() => {
    if (!root.classList.contains('show')) root.hidden = true;
  }, 320);
  unlockBody();
}
function openSheet(build) {
  const root = $('sheet');
  const panel = $('sheetPanel');
  const toastEl = $('toast');
  if (toastEl && !toastEl.classList.contains('act')) toastEl.classList.remove('show');
  clearTimeout(sheetTimer);
  panel.replaceChildren();
  panel.appendChild(el('div', 'grab'));
  build(panel);
  const was = root.classList.contains('show') && !root.hidden;
  root.hidden = false;
  document.body.classList.add('sheeting');
  lockBody();
  if (!was) {
    root.classList.remove('show');
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('show')));
  } else root.classList.add('show');
}

function commitSplit(it) {
  const input = $('splitInput');
  const v = input ? input.value.trim() : '';
  if (!v) { if (input) input.focus(); return; }
  const id = Date.now() + '' + Math.random();
  items.push({
    id,
    text: v + '（' + textOf(it) + '）',
    cat: 'now',
    done: false,
    t: Date.now(),
    m: 5
  });
  pickId = id;
  tab = 'now';
  save();
  closeSheet();
  setView('home');
  render();
  toast('第一步放进立刻去做了');
}
function openSplit(it) {
  openSheet(panel => {
    panel.appendChild(el('h3', 'sheet-title', '拆一个 5 分钟的第一步'));
    panel.appendChild(el('p', 'sheet-note', textOf(it)));
    const ta = el('textarea', 'sheet-input');
    ta.id = 'splitInput';
    ta.rows = 3;
    ta.placeholder = '例如：只打开文档，写第一句';
    panel.appendChild(ta);
    const saveBtn = el('button', 'btn primary block', '放进立刻去做');
    const cancel = el('button', 'btn soft block', '取消');
    saveBtn.addEventListener('click', () => commitSplit(it));
    cancel.addEventListener('click', closeSheet);
    ta.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        commitSplit(it);
      }
    });
    panel.appendChild(saveBtn);
    panel.appendChild(cancel);
    setTimeout(() => ta.focus(), 280);
  });
}
function openActions(it) {
  openSheet(panel => {
    panel.appendChild(el('h3', 'sheet-title', textOf(it)));
    const actions = [];
    if (!it.done && it.cat === 'long') actions.push(['split', '拆成 5 分钟的第一步', '']);
    if (!it.done) actions.push(['move', it.cat === 'now' ? '移到长期想做' : '移到立刻去做', '']);
    actions.push(['del', '删除', ' danger']);
    actions.forEach(([id, label, extra]) => {
      const b = el('button', 'sheet-action' + extra, label);
      b.addEventListener('click', () => {
        if (id === 'split') { openSplit(it); return; }
        closeSheet();
        if (id === 'move') {
          it.cat = it.cat === 'now' ? 'long' : 'now';
          save();
          render();
          toast(it.cat === 'long' ? '已移到长期想做' : '已移到立刻去做');
        } else if (id === 'del') deleteItem(it);
      });
      panel.appendChild(b);
    });
    const cancel = el('button', 'btn soft block', '取消');
    cancel.addEventListener('click', closeSheet);
    panel.appendChild(cancel);
  });
}

function makeTree(stage) {
  const node = $('treeTpl').content.firstElementChild.cloneNode(true);
  node.dataset.stage = stage || 'sprout';
  return node;
}
function applyStage(stage) {
  const svg = $('plantSlot').querySelector('.tree-svg');
  if (svg) svg.dataset.stage = stage;
}
function stageFor(p) {
  if (p >= 0.72) return 'tree';
  if (p >= 0.34) return 'sapling';
  return 'sprout';
}
function setRing(p) {
  const clamped = Math.max(0, Math.min(1, p || 0));
  const ring = $('ring');
  ring.style.strokeDasharray = String(RING_C);
  ring.style.strokeDashoffset = String(RING_C * (1 - clamped));
}
function setDocTitle() {
  if (!$('focus').classList.contains('show')) { document.title = DOC_TITLE; return; }
  const label = { focus: '专注', done: '完成', break: '休息', ask: '休息好了' }[mode] || '专注';
  document.title = fmt(left) + ' · ' + label;
}
function stopTick() {
  if (tick) clearInterval(tick);
  tick = null;
}
function syncFocusUI() {
  const root = $('focus');
  root.dataset.mode = mode;
  root.dataset.running = running ? '1' : '0';
  const ask = mode === 'ask';
  $('askBlock').hidden = !ask;
  $('runBlock').hidden = ask;
  $('lens').hidden = !(mode === 'focus' && !started);
  $('fDone').hidden = mode === 'break';
  $('timer').hidden = ask;
  $('fQuestion').hidden = !ask;
  $('fReward').hidden = mode !== 'done';
  $('fKicker').textContent = { focus: '专注', done: '这一轮完成', break: '休息', ask: '休息好了' }[mode] || '专注';
  if (mode === 'done') {
    $('fPrimary').textContent = '休息 5 分钟';
    $('fDone').textContent = '标记做完';
    $('fHint').textContent = forest && forest.focusBonus
      ? '先休息一下，再决定继续还是换一件。下一棵树更容易遇到稀有。'
      : '先休息一下，再决定继续还是换一件。';
  } else if (mode === 'break') {
    $('fPrimary').textContent = running ? '暂停' : '继续';
    $('fHint').textContent = '起来走走，喝口水，看看远处。';
  } else if (mode === 'ask') {
    $('fHint').textContent = '';
  } else {
    $('fPrimary').textContent = running ? '暂停' : (wilted ? '重新开始' : (started ? '继续' : '开始'));
    $('fDone').textContent = '做完了';
    $('fHint').textContent = '只做这一件。想到别的，先放下，回头再记。';
  }
}
function markLens() {
  document.querySelectorAll('#lens button').forEach(b => {
    const on = +b.dataset.l === len;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}
function plantProgress() {
  const p = 1 - left / (len * 60);
  setRing(p);
  applyStage(wilted ? 'seed' : stageFor(Math.max(0, p)));
}
function startTick() {
  running = true;
  started = true;
  wilted = false;
  endAt = Date.now() + left * 1000;
  stopTick();
  tick = setInterval(step, 500);
  syncFocusUI();
  setDocTitle();
  if (mode === 'focus') plantProgress();
}
function pauseTimer() {
  left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
  running = false;
  stopTick();
  syncFocusUI();
  setDocTitle();
}
function step() {
  left = Math.round((endAt - Date.now()) / 1000);
  if (left <= 0) {
    left = 0;
    $('timer').textContent = '00:00';
    stopTick();
    running = false;
    if (mode === 'break') {
      mode = 'ask';
      setRing(1);
      applyStage('tree');
      syncFocusUI();
      setDocTitle();
      vibrate([200, 100, 200]);
      return;
    }
    finishSession();
    return;
  }
  $('timer').textContent = fmt(left);
  setDocTitle();
  if (mode === 'break') setRing(1 - left / (5 * 60));
  else plantProgress();
}
function finishSession() {
  const gained = len >= 25 ? 15 : len >= 15 ? 10 : 5;
  const before = level(st.pts).l;
  st.focus = (Number(st.focus) || 0) + 1;
  st.pts = (Number(st.pts) || 0) + gained;
  saveS();
  grantFocusBonus();
  const after = level(st.pts).l;
  mode = 'done';
  running = false;
  left = 0;
  setRing(1);
  applyStage('tree');
  $('timer').textContent = '00:00';
  $('fReward').textContent = '+' + gained + ' 分';
  syncFocusUI();
  setDocTitle();
  confetti();
  vibrate([300, 150, 300]);
  if (after > before) toast('升级了！' + levelMeta(after).name);
  else toast('专注完成 +' + gained + ' 分');
  render();
}
function startBreak() {
  mode = 'break';
  running = false;
  left = 5 * 60;
  $('timer').textContent = fmt(left);
  setRing(0);
  applyStage('tree');
  startTick();
}
function startFocus(id, keepLen) {
  const it = items.find(i => i && i.id === id && !i.done);
  if (!it) return;
  if (!$('sheet').hidden) closeSheet();
  focusId = id;
  stopTick();
  running = false;
  started = false;
  wilted = false;
  mode = 'focus';
  if (!keepLen) len = durationFor(it);
  left = len * 60;
  $('fText').textContent = textOf(it);
  $('timer').textContent = fmt(left);
  $('fReward').textContent = '';
  markLens();
  applyStage('sprout');
  setRing(0);
  syncFocusUI();
  setDocTitle();
  $('focus').classList.add('show');
  $('focus').setAttribute('aria-hidden', 'false');
  document.body.classList.add('focusing');
  lockBody();
}
function endFocus() {
  stopTick();
  running = false;
  $('focus').classList.remove('show');
  $('focus').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('focusing');
  document.title = DOC_TITLE;
  unlockBody();
  render();
  if (pendingReveal) {
    const info = pendingReveal;
    pendingReveal = null;
    setTimeout(() => openReveal(info), 280);
  }
}
function completeFocused() {
  const it = items.find(i => i && i.id === focusId);
  if (it && !it.done) {
    it.done = true;
    it.dt = Date.now();
    save();
    award(it.cat === 'long' ? 30 : 10, it.cat === 'long' ? '长期的也做到了' : '完成了一件');
    confetti();
    queueReveal(plantForTask(it));
  }
  endFocus();
}
function wilt() {
  stopTick();
  running = false;
  started = false;
  wilted = true;
  mode = 'focus';
  st.wilt = (st.wilt || 0) + 1;
  saveS();
  left = len * 60;
  $('timer').textContent = fmt(left);
  applyStage('seed');
  setRing(0);
  syncFocusUI();
  setDocTitle();
  toast('离开了一下，这轮专注中断了');
}
function onPrimary() {
  if (mode === 'done') { startBreak(); return; }
  if (running) { pauseTimer(); return; }
  startTick();
}
function swapFromFocus() {
  const current = focusId;
  const pool = openCat('now').length ? openCat('now') : openCat('long');
  const others = pool.filter(i => i.id !== current);
  if (!others.length) {
    endFocus();
    toast('没有别的事了');
    return;
  }
  const p = others[Math.floor(Math.random() * others.length)];
  pickId = p.id;
  startFocus(p.id);
}

function bind() {
  $('pill').addEventListener('click', () => setView('stats'));
  document.querySelectorAll('.tabbar button').forEach(b => {
    b.addEventListener('click', () => setView(b.dataset.view));
  });
  document.querySelectorAll('[data-add]').forEach(b => {
    b.addEventListener('click', () => addItem(b.dataset.add));
  });
  document.querySelectorAll('#ests button').forEach(b => {
    b.addEventListener('click', () => {
      const m = +b.dataset.m;
      selM = selM === m ? 0 : m;
      document.querySelectorAll('#ests button').forEach(x => {
        const on = +x.dataset.m === selM;
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  });
  $('input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      addItem(selM >= 60 ? 'long' : 'now');
    }
  });
  $('segs').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    tab = b.dataset.tab;
    render();
  });
  $('list').addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const li = btn.closest('li');
    if (!li) return;
    const it = items.find(i => i && String(i.id) === li.dataset.id);
    if (!it) return;
    const act = btn.dataset.act;
    if (act === 'toggle') {
      it.done = !it.done;
      it.dt = it.done ? Date.now() : 0;
      const v = it.cat === 'long' ? 30 : 10;
      if (it.done) {
        award(v, it.cat === 'long' ? '长期的也做到了' : '完成了一件');
        confetti();
        queueReveal(plantForTask(it));
      } else {
        unaward(v);
        toast('已放回「' + (it.cat === 'long' ? '长期想做' : '立刻去做') + '」');
      }
      save();
      render();
      return;
    }
    if (act === 'focus') { startFocus(it.id); return; }
    if (act === 'more') { openActions(it); return; }
    if (act === 'del') deleteItem(it);
  });
  $('pickShuffle').addEventListener('click', () => {
    const r = choose();
    render();
    if (r.same) toast('暂时只有这一件');
  });
  $('pickFocus').addEventListener('click', () => { if (pickId) startFocus(pickId); });
  $('pickSplit').addEventListener('click', () => {
    const it = items.find(i => i && i.id === pickId);
    if (it) openSplit(it);
  });
  $('fPrimary').addEventListener('click', onPrimary);
  $('fDone').addEventListener('click', completeFocused);
  $('fExit').addEventListener('click', endFocus);
  $('fCont').addEventListener('click', () => startFocus(focusId, true));
  $('fSwap').addEventListener('click', swapFromFocus);
  document.querySelectorAll('#lens button').forEach(b => {
    b.addEventListener('click', () => {
      if (mode !== 'focus' || started) return;
      len = +b.dataset.l;
      left = len * 60;
      $('timer').textContent = fmt(left);
      markLens();
      setDocTitle();
    });
  });
  $('sheetBackdrop').addEventListener('click', closeSheet);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('reveal').hidden) { closeReveal(); return; }
    if (!$('codex').hidden) { closeCodex(); return; }
    if (!$('sheet').hidden && $('sheet').classList.contains('show')) { closeSheet(); return; }
    if ($('focus').classList.contains('show')) endFocus();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (running && mode === 'focus' && tick) wilt();
      return;
    }
    if (tick) step();
  });
  $('exp').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ items, st, forest })], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'eureka-backup-' + dkey() + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  });
  $('imp').addEventListener('click', () => $('impF').click());
  $('impF').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    f.text().then(t => {
      let data;
      try { data = JSON.parse(t); }
      catch (err) { toast('这个文件读不了'); return; }
      if (!data || typeof data !== 'object' || Array.isArray(data) || (!Array.isArray(data.items) && !(data.st && typeof data.st === 'object'))) {
        toast('这个文件读不了');
        return;
      }
      pendingBackup = data;
      openSheet(panel => {
        panel.appendChild(el('h3', 'sheet-title', '用备份替换当前数据？'));
        panel.appendChild(el('p', 'sheet-note', '清单和进度会换成备份里的内容。旧备份也能用。备份里如果带了森林，会一起换上。'));
        const ok = el('button', 'btn primary block', '替换');
        const cancel = el('button', 'btn soft block', '取消');
        ok.addEventListener('click', () => {
          if (!pendingBackup) return;
          if (Array.isArray(pendingBackup.items)) items = pendingBackup.items;
          if (pendingBackup.st && typeof pendingBackup.st === 'object' && !Array.isArray(pendingBackup.st)) st = pendingBackup.st;
          ensureStats();
          normalizeItems();
          if (pendingBackup.forest && typeof pendingBackup.forest === 'object') applyForestBackup(pendingBackup.forest);
          pickId = null;
          save();
          saveS();
          pendingBackup = null;
          closeSheet();
          render();
          toast('已经恢复');
        });
        cancel.addEventListener('click', () => { pendingBackup = null; closeSheet(); });
        panel.appendChild(ok);
        panel.appendChild(cancel);
      });
    }).catch(() => toast('这个文件读不了'));
  });
}

$('plantSlot').appendChild(makeTree('sprout'));
let groveMoved = false;
let groveX = 0;
$('grove').addEventListener('pointerdown', e => { groveX = e.clientX; groveMoved = false; });
$('grove').addEventListener('pointermove', e => { if (Math.abs(e.clientX - groveX) > 8) groveMoved = true; });
$('grove').addEventListener('click', () => { if (!groveMoved) openCodex(); });
$('grove').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCodex(); } });
$('openCodex').addEventListener('click', openCodex);
$('closeCodex').addEventListener('click', closeCodex);
$('revealOk').addEventListener('click', closeReveal);
$('reveal').addEventListener('click', e => { if (e.target === $('reveal')) closeReveal(); });
migrateForest();
bind();
render();
if ('serviceWorker' in navigator && location.search.indexOf('nosw=1') === -1) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
