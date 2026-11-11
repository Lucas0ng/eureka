/* 30 hand-drawn trees. Loaded before app.js. Not a recolor set. */
window.EUREKA_TREES = [
  { id: 't01', name: '像素新芽', tier: 'common', style: 'pixel', vb: '0 0 16 20', svg:
    '<g shape-rendering="crispEdges"><rect x="7" y="14" width="2" height="4" fill="#6b4423"/><rect x="6" y="10" width="4" height="4" fill="#2f6b45"/><rect x="7" y="8" width="2" height="2" fill="#8fce9a"/><rect x="5" y="11" width="2" height="2" fill="#3e8f5a"/></g>' },
  { id: 't02', name: '像素松', tier: 'common', style: 'pixel', vb: '0 0 16 20', svg:
    '<g shape-rendering="crispEdges"><rect x="7" y="14" width="2" height="5" fill="#6b4423"/><rect x="6" y="12" width="4" height="2" fill="#1f6b42"/><rect x="4" y="10" width="8" height="2" fill="#2f7a4e"/><rect x="5" y="8" width="6" height="2" fill="#1f6b42"/><rect x="6" y="6" width="4" height="2" fill="#3e8f5a"/><rect x="7" y="4" width="2" height="2" fill="#8fce9a"/></g>' },
  { id: 't03', name: '像素橡', tier: 'common', style: 'pixel', vb: '0 0 16 20', svg:
    '<g shape-rendering="crispEdges"><rect x="7" y="12" width="2" height="6" fill="#7a4e2d"/><rect x="4" y="8" width="8" height="5" fill="#3d6b3a"/><rect x="3" y="9" width="2" height="3" fill="#2a522c"/><rect x="11" y="9" width="2" height="3" fill="#4e8a48"/><rect x="6" y="6" width="4" height="3" fill="#5aa05a"/><rect x="5" y="7" width="2" height="2" fill="#2f6b45"/></g>' },
  { id: 't04', name: '铅笔白桦', tier: 'common', style: 'sketch', vb: '0 0 64 80', svg:
    '<rect x="28" y="32" width="8" height="42" rx="3" fill="#f4f1ea" stroke="#3a332c" stroke-width="1.8"/><path d="M30 44h4M30 54h5M31 64h3" stroke="#3a332c" stroke-width="1.7"/><ellipse cx="32" cy="24" rx="16" ry="14" fill="#6fa36a" stroke="#2c3a2c" stroke-width="1.6"/><path d="M18 22c6-8 14-10 18-2M36 14c8 2 12 8 8 14" fill="none" stroke="#243028" stroke-width="1.5"/>' },
  { id: 't05', name: '垂柳', tier: 'common', style: 'sketch', vb: '0 0 64 80', svg:
    '<path d="M34 74c-2-20-1-32 4-42" fill="none" stroke="#5a4632" stroke-width="2" stroke-linecap="round"/><path d="M38 34c8 2 12 8 10 14M36 36c-8 4-12 12-8 20M40 40c6 6 6 14 2 22M32 42c-4 8-2 16 2 22M42 46c4 8 2 14-1 18" fill="none" stroke="#3e6b48" stroke-width="1.3" stroke-linecap="round"/>' },
  { id: 't06', name: '漫画圆树', tier: 'common', style: 'comic', vb: '0 0 64 80', svg:
    '<rect x="29" y="46" width="6" height="26" rx="2" fill="#c9843a" stroke="#1c1917" stroke-width="2.4"/><circle cx="32" cy="32" r="18" fill="#7bc46a" stroke="#1c1917" stroke-width="2.6"/><path d="M22 30c4-8 16-8 20 0" fill="none" stroke="#1c1917" stroke-width="1.6" stroke-linecap="round"/>' },
  { id: 't07', name: '圆点树', tier: 'common', style: 'abstract', vb: '0 0 64 80', svg:
    '<rect x="30" y="46" width="4" height="26" fill="#8A5A3A"/><circle cx="32" cy="40" r="8" fill="#1f6b52"/><circle cx="22" cy="36" r="7" fill="#3e8f6a"/><circle cx="42" cy="34" r="7" fill="#2a7a58"/><circle cx="32" cy="26" r="6" fill="#67a88c"/><circle cx="26" cy="24" r="3" fill="#14543f"/>' },
  { id: 't08', name: '三角松', tier: 'common', style: 'abstract', vb: '0 0 64 80', svg:
    '<rect x="29" y="58" width="6" height="16" fill="#6b4423"/><path d="M32 8 L52 34 H12 Z" fill="#1f6b52"/><path d="M32 22 L58 52 H6 Z" fill="#2f7a56"/><path d="M32 36 L62 68 H2 Z" fill="#14543f"/>' },
  { id: 't09', name: '剪纸松', tier: 'common', style: 'papercut', vb: '0 0 64 80', svg:
    '<path d="M34 8l18 20H16z" fill="#e7d7b0"/><path d="M30 12l16 18H14z" fill="#1f6b4a"/><path d="M36 26l22 26H14z" fill="#c4a574"/><path d="M30 30l20 24H10z" fill="#14382c"/><rect x="28" y="56" width="8" height="16" fill="#e7d7b0"/><rect x="30" y="56" width="5" height="16" fill="#6b3a28"/>' },
  { id: 't10', name: '标本苗', tier: 'common', style: 'botanical', vb: '0 0 64 80', svg:
    '<path d="M32 74V28" fill="none" stroke="#2c3a2e" stroke-width="1.1"/><path d="M32 58c-8-2-12-8-14-14 6 1 10 4 14 8M32 48c8-1 14-6 16-14-6 2-12 5-16 9M32 38c-6-4-8-10-8-16 4 4 6 8 8 12" fill="none" stroke="#2c3a2e" stroke-width="1"/><path d="M18 44c4 2 8 2 12 0M46 36c-4 2-8 2-12 0" fill="none" stroke="#2c3a2e" stroke-width=".8"/><circle cx="32" cy="24" r="1.2" fill="#2c3a2e"/>' },
  { id: 't11', name: '草稿灌木', tier: 'common', style: 'sketch', vb: '0 0 64 80', svg:
    '<ellipse cx="32" cy="50" rx="22" ry="16" fill="#4e7c46"/><ellipse cx="20" cy="46" rx="12" ry="11" fill="#3c663c"/><ellipse cx="44" cy="44" rx="12" ry="10" fill="#6b9a56"/><path d="M16 48c6-10 10-6 14-16M30 54c2-14 8-8 6-18M42 52c6-10 8-4 12-14" fill="none" stroke="#241e18" stroke-width="1.8" stroke-linecap="round"/>' },
  { id: 't12', name: '漫画苹果树', tier: 'common', style: 'comic', vb: '0 0 64 80', svg:
    '<rect x="29" y="48" width="6" height="24" rx="1" fill="#e0a15a" stroke="#1c1917" stroke-width="2.2"/><path d="M32 46c-16 2-22-14-10-24 4 6 10 8 14 6 2-8 12-12 18-4 6 10-4 20-22 22z" fill="#8fd16a" stroke="#1c1917" stroke-width="2.4"/><circle cx="24" cy="34" r="3.2" fill="#e23b3b" stroke="#1c1917" stroke-width="1.6"/><circle cx="40" cy="30" r="2.8" fill="#e23b3b" stroke="#1c1917" stroke-width="1.6"/>' },

  { id: 't13', name: '像素樱', tier: 'rare', style: 'pixel', vb: '0 0 16 20', svg:
    '<g shape-rendering="crispEdges"><rect x="7" y="12" width="2" height="6" fill="#6b4423"/><rect x="4" y="8" width="8" height="4" fill="#f4b6c8"/><rect x="5" y="6" width="6" height="2" fill="#f7d0dc"/><rect x="3" y="9" width="2" height="2" fill="#e889a4"/><rect x="11" y="7" width="2" height="2" fill="#fff"/><rect x="6" y="10" width="2" height="2" fill="#c45b78"/></g>' },
  { id: 't14', name: '霓虹松', tier: 'rare', style: 'cyber', vb: '0 0 64 80', svg:
    '<path d="M32 70V34" fill="none" stroke="#5ce1e6" stroke-width="2"/><path d="M32 56 L16 70 H48 Z M32 42 L20 58 H44 Z M32 28 L24 44 H40 Z" fill="none" stroke="#ff4ecd" stroke-width="1.6"/><circle cx="32" cy="26" r="2" fill="#f8f6a8"/>' },
  { id: 't15', name: '写实橡树', tier: 'rare', style: 'realistic', vb: '0 0 64 80', svg:
    '<path d="M30 50c1 8 1 16 2 24h4c0-8 0-16 1-24" fill="#6a4328"/><path d="M32 18c7 1 14 8 13 16 5 1 9 6 6 11-4 6-12 8-18 6-7 4-16 1-18-6-3-6 1-12 7-13 0-8 4-15 10-14z" fill="#2f5d34"/><path d="M26 24c5 2 8 8 6 13 3 1 6 5 3 8-5 2-11 0-13-5 1-6 1-12 4-16z" fill="#3f7a42"/><path d="M33 46c2 6 1 12 1 18" stroke="#4a2e1c" stroke-width="1" fill="none"/>' },
  { id: 't16', name: '网点松', tier: 'rare', style: 'manga', vb: '0 0 64 80', svg:
    '<rect x="29" y="56" width="6" height="16" fill="#1c1917"/><path d="M32 8 L54 36 H10 Z M32 24 L58 56 H6 Z M32 40 L62 72 H2 Z" fill="#f4f1ea" stroke="#1c1917" stroke-width="2"/><g fill="#1c1917"><circle cx="24" cy="48" r="1.1"/><circle cx="32" cy="52" r="1.1"/><circle cx="40" cy="46" r="1.1"/><circle cx="28" cy="58" r="1.1"/><circle cx="38" cy="60" r="1.1"/><circle cx="32" cy="34" r="1"/><circle cx="22" cy="40" r="1"/></g>' },
  { id: 't17', name: '星座树', tier: 'rare', style: 'abstract', vb: '0 0 64 80', svg:
    '<g fill="none" stroke="#3d5f8a" stroke-width="1.2"><path d="M32 70 L32 40 L20 28 M32 48 L46 30 M32 36 L28 18 M20 28 L14 20 M46 30 L52 18 L46 12"/></g><g fill="#f3e2a2"><circle cx="32" cy="70" r="2"/><circle cx="32" cy="40" r="2.2"/><circle cx="20" cy="28" r="2"/><circle cx="46" cy="30" r="2.4"/><circle cx="28" cy="18" r="1.8"/><circle cx="14" cy="20" r="1.6"/><circle cx="52" cy="18" r="1.8"/><circle cx="46" cy="12" r="2.2"/></g>' },
  { id: 't18', name: '水墨盆景', tier: 'rare', style: 'sketch', vb: '0 0 64 80', svg:
    '<path d="M14 72h36" stroke="#1c1c1c" stroke-width="2"/><path d="M26 72c1-12 6-16 10-30" fill="none" stroke="#1c1c1c" stroke-width="3.4" stroke-linecap="round"/><path d="M36 44c3 10 10 12 16 6" fill="none" stroke="#1c1c1c" stroke-width="2.6" stroke-linecap="round"/><path d="M36 40c10-14 24-10 20 2-8 3-14 6-16 14-2-6-4-10-4-16z" fill="#1a1a1a"/><path d="M28 48c-14-2-18-14-8-18 6 6 12 8 16 6" fill="#1a1a1a"/><ellipse cx="32" cy="74" rx="14" ry="2.6" fill="none" stroke="#1c1c1c" stroke-width="1.6"/>' },
  { id: 't19', name: '浮世松', tier: 'rare', style: 'ukiyo', vb: '0 0 64 80', svg:
    '<path d="M40 74c-6-8-16-10-18-24 2 2 6 2 8-2-8-2-14-10-8-18 6 4 8 10 6 14 6-8 16-8 18-2-4 2-6 6-4 10 8-2 14 4 10 12-4 0-8 2-8 6 4 2 6 6 2 8z" fill="#1c3d28" stroke="#14120f" stroke-width="1.4"/><path d="M38 74c-1-16 2-28-4-36" fill="none" stroke="#14120f" stroke-width="2"/>' },
  { id: 't20', name: '彩窗小树', tier: 'rare', style: 'stained', vb: '0 0 64 80', svg:
    '<g stroke="#1a1a1a" stroke-width="1.6" stroke-linejoin="round"><path d="M30 70h6l1-16h-8z" fill="#8a5a3a"/><path d="M32 18 L46 36 H18 Z" fill="#2f6b8a"/><path d="M32 30 L52 52 H12 Z" fill="#c4554a"/><path d="M32 42 L58 68 H6 Z" fill="#2f7a56"/><path d="M32 18 V68 M18 36 L46 36 M12 52 H52" fill="none"/></g>' },
  { id: 't21', name: '白桦树', tier: 'rare', style: 'realistic', vb: '0 0 64 80', svg:
    '<path d="M28 74c1-20 2-32 4-46 2 14 3 26 4 46z" fill="#f4f1ea" stroke="#2c2824" stroke-width="1"/><path d="M30 40h4M31 50h3M30 60h5M32 68h3" stroke="#2c2824" stroke-width="1.2"/><path d="M32 26c8 2 14 10 12 16 4 4 4 10-2 12-8 2-16 0-20-6-2-8 2-16 10-22z" fill="#6a9a62"/><path d="M24 30c4-6 12-8 16-4" fill="#8fbf78"/>' },

  { id: 't22', name: '电路神木', tier: 'epic', style: 'cyber', vb: '0 0 64 80', svg:
    '<g fill="none" stroke="#7dffe1" stroke-width="1.5"><path d="M32 74V28M32 60H18V48M32 52H48V38M32 40H22V30M48 38h8M18 48h-6"/><path d="M32 28l-8-10M32 28l8-8M32 28V16"/></g><g fill="#ff4ecd"><circle cx="12" cy="48" r="2"/><circle cx="56" cy="38" r="2"/><circle cx="22" cy="30" r="2"/><circle cx="24" cy="18" r="2"/><circle cx="40" cy="20" r="2"/><circle cx="32" cy="16" r="2.4" fill="#f8f6a8"/></g>' },
  { id: 't23', name: '像素古树', tier: 'epic', style: 'pixel', vb: '0 0 16 20', svg:
    '<g shape-rendering="crispEdges"><rect x="6" y="12" width="4" height="7" fill="#5c3a24"/><rect x="7" y="10" width="2" height="2" fill="#e6c56a"/><rect x="2" y="8" width="12" height="4" fill="#1d4d32"/><rect x="3" y="6" width="10" height="2" fill="#2f7a4e"/><rect x="4" y="4" width="8" height="2" fill="#14382a"/><rect x="6" y="2" width="4" height="2" fill="#e6c56a"/><rect x="1" y="9" width="2" height="2" fill="#8fce9a"/><rect x="13" y="7" width="2" height="2" fill="#e6c56a"/></g>' },
  { id: 't24', name: '猴面包树', tier: 'epic', style: 'realistic', vb: '0 0 64 80', svg:
    '<path d="M22 42c-2 10-2 24 0 32h20c2-8 2-22 0-32-2-10-6-16-10-16s-8 6-10 16z" fill="#c4956a"/><path d="M26 48c2 8 2 16 1 24M38 50c-1 8-1 14-1 22" stroke="#8a6244" stroke-width="1" fill="none"/><path d="M20 36c6-12 18-14 26-4 4 4 2 10-2 12-2-6-8-8-12-6-4-4-8-4-12  -2z" fill="#3d6b45"/><ellipse cx="32" cy="30" rx="8" ry="5" fill="#4e8a52"/>' },
  { id: 't25', name: '夜樱', tier: 'epic', style: 'manga', vb: '0 0 64 80', svg:
    '<circle cx="34" cy="28" r="16" fill="#1b1a2e"/><path d="M30 74c2-18 4-30 8-44" fill="none" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/><path d="M38 36c8 2 14 10 10 16" fill="none" stroke="#1c1917" stroke-width="2"/><g fill="#f7b6c8" stroke="#1c1917" stroke-width="1"><circle cx="26" cy="24" r="3"/><circle cx="36" cy="18" r="3.2"/><circle cx="44" cy="26" r="2.6"/><circle cx="32" cy="30" r="2.4"/><circle cx="22" cy="34" r="2.2"/><circle cx="48" cy="36" r="2"/></g><path d="M24 22l2 2M42 24l2-2" stroke="#fff" stroke-width=".8"/>' },
  { id: 't26', name: '分形树', tier: 'epic', style: 'abstract', vb: '0 0 64 80', svg:
    '<ellipse cx="32" cy="38" rx="22" ry="20" fill="#b7d7b4"/><g fill="none" stroke="#12382c" stroke-width="2.6" stroke-linecap="round"><path d="M32 74 V40"/><path d="M32 58 L16 42 L8 28 M16 42 L12 26"/><path d="M32 50 L50 34 L58 20 M50 34 L56 26"/><path d="M32 42 L22 24 L16 12 M22 24 L30 16"/><path d="M32 36 L44 18 L50 8"/></g>' },
  { id: 't27', name: '彩窗高树', tier: 'epic', style: 'stained', vb: '0 0 64 80', svg:
    '<g stroke="#14120f" stroke-width="1.7" stroke-linejoin="round"><path d="M29 74h6V58h-6z" fill="#a8743c"/><polygon points="32,6 40,20 24,20" fill="#f2d36b"/><polygon points="32,16 48,36 16,36" fill="#3d7ea6"/><polygon points="32,28 54,52 10,52" fill="#c4554a"/><polygon points="32,40 60,70 4,70" fill="#2f7a56"/><path d="M32 6 V70 M16 36 H48 M10 52 H54" fill="none"/></g>' },

  { id: 't28', name: '极光树', tier: 'legendary', style: 'cyber', vb: '0 0 64 80', svg:
    '<path d="M32 76V24" stroke="#d7fff6" stroke-width="1.4" fill="none"/><path d="M32 60c-14-4-20-16-14-24 6 6 12 6 16 2-2-10 6-18 14-16-6 6-6 12-2 16 10-2 16 6 12 14-6 2-14 4-26 8z" fill="#5ce1e6" opacity=".85"/><path d="M30 34c8-10 18-8 20 0-8 2-14 6-16 12-4-4-6-8-4-12z" fill="#c9a6ff" opacity=".9"/><path d="M18 28c6-8 16-6 14 2" fill="none" stroke="#f8f6a8" stroke-width="1.2"/><circle cx="32" cy="20" r="2.4" fill="#fff"/>' },
  { id: 't29', name: '千年橡', tier: 'legendary', style: 'realistic', vb: '0 0 64 80', svg:
    '<path d="M24 70c2-6 4-8 8-16 2 4 4 6 8 4-2 6-2 12-1 18H26c0-2-1-4-2-6z" fill="#5c3a24"/><path d="M30 54c-6 2-10-2-12-8 4 0 6 2 8 4" fill="#6b4423"/><path d="M32 16c10 0 20 10 18 20 6 2 10 8 6 14-6 8-16 10-24 8-10 4-20 0-22-10-2-8 2-14 8-16 0-10 6-16 14-16z" fill="#234d30"/><path d="M22 28c6-8 16-8 20-2 2 8-2 12-8 12-2 6-8 8-14 4 0-6 0-10 2-14z" fill="#3d6e42"/><path d="M34 22c6 2 8 8 4 12" fill="#6aaa62"/><path d="M28 48c4 4 6 10 4 16" stroke="#3a2418" stroke-width="1" fill="none"/>' },
  { id: 't30', name: '月下松', tier: 'legendary', style: 'ukiyo', vb: '0 0 64 80', svg:
    '<circle cx="46" cy="18" r="10" fill="#f4e7c2" stroke="#1c1917" stroke-width="1.2"/><circle cx="42" cy="16" r="8" fill="#f7f1e4"/><path d="M22 74c8-10 6-20 14-28-6 2-8 6-6 10 8-6 16-6 20 0-6 2-8 8-4 12 6 0 10 6 6 12-8 2-16 0-20-6-2 6-8 8-10 0z" fill="#14382c" stroke="#14120f" stroke-width="1.3"/><path d="M28 74c2-16 8-26 16-34" fill="none" stroke="#14120f" stroke-width="2.2" stroke-linecap="round"/>' }
];

window.EUREKA_TIER_NAME = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' };
window.EUREKA_STYLE_NAME = {
  pixel: '像素', sketch: '速写', comic: '漫画', abstract: '抽象', papercut: '剪纸',
  botanical: '标本', cyber: '霓虹', realistic: '写实', manga: '漫画', ukiyo: '浮世绘', stained: '彩窗'
};
