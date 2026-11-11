/* 30 illustrated trees. Ids, names, tiers, styles and odds stay the gacha contract.
   Each drawing is its own picture: pixel, sketch, comic, abstract, papercut,
   botanical, neon, realistic, manga, ukiyo-e, stained glass. */
(function () {
  const VB = '0 0 80 104';

  function shade(rx) {
    return '<ellipse cx="40" cy="100" rx="' + (rx || 16) + '" ry="3.1" fill="rgba(28,22,16,.22)"/>';
  }

  function blocks(list) {
    let o = '<g shape-rendering="crispEdges">';
    for (let i = 0; i < list.length; i++) {
      const r = list[i];
      o += '<rect x="' + (r[0] * 4) + '" y="' + (r[1] * 4) + '" width="' + (r[2] * 4) + '" height="' + (r[3] * 4) + '" fill="' + r[4] + '"/>';
    }
    return o + '</g>';
  }

  function tone(cx, cy, rx, ry, gap, rad, fill) {
    let o = '';
    for (let y = cy - ry; y <= cy + ry; y += gap) {
      for (let x = cx - rx; x <= cx + rx; x += gap) {
        const nx = (x - cx) / rx;
        const ny = (y - cy) / ry;
        if (nx * nx + ny * ny <= 1) {
          o += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + rad + '" fill="' + fill + '"/>';
        }
      }
    }
    return o;
  }

  function fractalSvg() {
    const paths = [];
    const leaves = [];
    function walk(x, y, len, ang, depth) {
      const x2 = x + Math.sin(ang) * len;
      const y2 = y - Math.cos(ang) * len;
      const w = Math.max(0.6, depth * 0.55);
      paths.push('<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" stroke-width="' + w.toFixed(2) + '"/>');
      if (depth === 0) {
        leaves.push('<ellipse cx="' + x2.toFixed(1) + '" cy="' + y2.toFixed(1) + '" rx="3.1" ry="1.8" transform="rotate(' + (ang * 50).toFixed(0) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ')" fill="#8ed0a4"/>');
        return;
      }
      walk(x2, y2, len * 0.72, ang - 0.52, depth - 1);
      walk(x2, y2, len * 0.68, ang + 0.46, depth - 1);
      if (depth >= 3) walk(x2, y2, len * 0.48, ang + 0.06, depth - 2);
    }
    walk(40, 100, 26, 0, 5);
    return shade(14) +
      '<ellipse cx="40" cy="54" rx="30" ry="30" fill="#d7edda"/>' +
      '<ellipse cx="28" cy="46" rx="12" ry="10" fill="#edf7ee"/>' +
      '<g fill="none" stroke="#14382c" stroke-linecap="round">' + paths.join('') + '</g>' +
      leaves.join('');
  }

  const trunk = '#6b3e24';
  const trunkD = '#4a2816';
  const moss = '#1f6b45';
  const leaf = '#2f8a52';
  const leafL = '#8fd09a';
  const leafD = '#184832';

  const t01 = blocks([
    [4, 23, 12, 1, '#3a2416'], [5, 22, 10, 1, '#6b4423'], [6, 21, 8, 1, '#c4a882'],
    [9, 13, 2, 9, '#3f6b32'], [8, 15, 1, 4, '#2c5524'], [11, 16, 1, 3, '#6aaa62'],
    [4, 14, 5, 3, leaf], [3, 15, 2, 2, moss], [4, 14, 2, 1, leafL],
    [11, 12, 6, 3, leafL], [14, 11, 2, 1, '#d8f5d4'], [11, 14, 2, 1, moss],
    [7, 11, 4, 3, leaf], [8, 9, 2, 2, leafL], [9, 8, 2, 1, '#e7f6df'],
    [5, 18, 3, 1, '#6aaa62'], [12, 17, 3, 1, moss]
  ]);

  const t02 = blocks([
    [9, 18, 2, 6, trunk], [9, 23, 2, 1, trunkD], [8, 24, 4, 1, '#3a2416'],
    [9, 3, 2, 2, leafL],
    [8, 5, 4, 2, leaf], [7, 6, 1, 1, leafD], [12, 5, 1, 1, leafL],
    [7, 7, 6, 2, moss], [6, 8, 1, 1, leafD], [13, 7, 1, 1, leaf],
    [6, 9, 8, 2, leaf], [5, 10, 1, 1, leafD], [14, 9, 1, 1, leafL],
    [9, 11, 2, 1, trunk],
    [5, 12, 10, 2, moss], [4, 13, 1, 1, leafD], [15, 12, 1, 1, leaf],
    [4, 14, 12, 2, leaf], [3, 15, 1, 1, leafD], [16, 14, 2, 1, leafL],
    [9, 16, 2, 2, trunk],
    [3, 17, 14, 2, moss], [2, 18, 1, 1, leafD], [17, 17, 1, 1, leafL],
    [8, 19, 1, 1, leafL]
  ]);

  const t03 = blocks([
    [9, 16, 2, 8, trunk], [8, 20, 1, 3, trunkD], [11, 18, 1, 4, '#8a6244'],
    [8, 24, 4, 1, '#3a2416'],
    [6, 6, 8, 2, leaf], [5, 8, 10, 2, moss], [4, 10, 12, 3, leafD],
    [3, 12, 14, 3, leaf], [4, 15, 12, 2, moss],
    [7, 4, 6, 2, leafL], [8, 3, 4, 1, '#d4f0c8'],
    [2, 13, 2, 2, leafD], [16, 11, 2, 2, leafL],
    [5, 9, 2, 1, leafL], [13, 12, 2, 1, '#c8e8b0'],
    [7, 14, 2, 1, '#143828'], [12, 16, 2, 1, leafL]
  ]);

  const t13 = blocks([
    [9, 16, 2, 8, trunk], [8, 24, 4, 1, '#3a2416'], [10, 15, 1, 2, trunkD],
    [5, 7, 10, 3, '#f4b6c8'], [4, 10, 12, 3, '#e889a8'], [6, 5, 8, 2, '#fad4e0'],
    [3, 9, 2, 2, '#fff'], [15, 8, 2, 2, '#c45b78'], [7, 4, 3, 1, '#fff6f8'],
    [8, 13, 4, 2, '#f7d0dc'], [2, 12, 2, 1, '#f4b6c8'], [16, 13, 2, 1, '#fff'],
    [4, 18, 1, 1, '#f7d0dc'], [15, 17, 1, 1, '#e889a8'], [6, 20, 1, 1, '#f4b6c8'],
    [13, 21, 1, 1, '#fff'], [11, 8, 1, 1, '#fff']
  ]);

  const t23 = blocks([
    [8, 14, 4, 10, trunk], [7, 18, 1, 5, trunkD], [12, 16, 1, 6, '#a07848'],
    [6, 23, 8, 1, '#3a2416'], [9, 12, 2, 2, '#e6c56a'],
    [4, 4, 12, 2, moss], [3, 6, 14, 2, leafD], [2, 8, 16, 3, leaf],
    [1, 11, 18, 3, moss], [2, 14, 16, 2, leafD],
    [5, 2, 10, 2, leafL], [7, 1, 6, 1, '#e6c56a'],
    [0, 10, 2, 2, leafL], [18, 8, 2, 2, '#e6c56a'],
    [4, 7, 2, 1, '#d8f5d4'], [14, 5, 2, 1, '#e6c56a'],
    [6, 13, 2, 1, '#f0d060'], [13, 12, 2, 1, leafL],
    [9, 9, 2, 2, '#143828'], [15, 15, 2, 1, '#e6c56a'],
    [3, 16, 2, 1, moss], [11, 3, 1, 1, '#fff6d0']
  ]);

  function tree(id, name, tier, style, svg) {
    return { id: id, name: name, tier: tier, style: style, vb: VB, svg: svg };
  }

  window.EUREKA_TREES = [
    tree('t01', '像素新芽', 'common', 'pixel', t01),
    tree('t02', '像素松', 'common', 'pixel', t02),
    tree('t03', '像素橡', 'common', 'pixel', t03),

    tree('t04', '铅笔白桦', 'common', 'sketch',
      shade(13) +
      '<g fill="none" stroke-linecap="round">' +
      '<path d="M37 100 C36 78 34 58 39 40" stroke="#f7f4ee" stroke-width="9"/>' +
      '<path d="M37 100 C36 78 34 58 39 40" stroke="#2c2824" stroke-width="1.4"/>' +
      '<path d="M34 58 h7 M35 70 h5 M33 82 h6 M35 92 h4" stroke="#2c2824" stroke-width="1.15"/>' +
      '<path d="M39 42 C28 36 16 30 20 18" stroke="#2c2824" stroke-width="1.15"/>' +
      '<path d="M39 40 C50 32 62 28 58 16" stroke="#2c2824" stroke-width="1.15"/>' +
      '<path d="M30 30 C24 22 28 14 36 16" stroke="#3d6b45" stroke-width="1.3"/>' +
      '<path d="M36 18 C42 8 54 12 52 24 C48 20 40 22 36 28" stroke="#3d6b45" stroke-width="1.25"/>' +
      '<path d="M24 28 C18 20 22 12 30 18" stroke="#2f5a38" stroke-width="1.2"/>' +
      '<path d="M22 24 l4 2 M28 16 l3 3 M48 18 l-4 3 M34 12 l2 4" stroke="#243028" stroke-width=".9"/>' +
      '</g>' +
      '<ellipse cx="34" cy="26" rx="18" ry="15" fill="#5f9a56" opacity=".72"/>' +
      '<ellipse cx="48" cy="20" rx="12" ry="11" fill="#8fbf78" opacity=".8"/>' +
      '<ellipse cx="28" cy="20" rx="8" ry="7" fill="#cfe6b4" opacity=".85"/>'),

    tree('t05', '垂柳', 'common', 'sketch',
      shade(22) +
      '<ellipse cx="36" cy="34" rx="20" ry="14" fill="#8fbf78" opacity=".28"/>' +
      '<ellipse cx="48" cy="48" rx="14" ry="18" fill="#3e6b48" opacity=".18"/>' +
      '<path d="M44 100 C40 78 42 60 36 46 C32 38 38 30 34 22" fill="none" stroke="#5a4632" stroke-width="2.6" stroke-linecap="round"/>' +
      '<g fill="none" stroke="#3e6b48" stroke-linecap="round">' +
      '<path d="M36 44 C28 48 22 58 24 72" stroke-width="1.35"/>' +
      '<path d="M38 50 C48 54 54 66 50 80" stroke-width="1.35"/>' +
      '<path d="M34 36 C24 40 16 50 18 64" stroke-width="1.25"/>' +
      '<path d="M40 40 C52 36 62 46 60 60" stroke-width="1.2"/>' +
      '<path d="M33 52 C26 60 24 72 28 84" stroke-width="1.15"/>' +
      '<path d="M42 58 C50 66 52 78 46 90" stroke-width="1.15"/>' +
      '<path d="M30 30 C22 28 16 36 18 46" stroke-width="1.1"/>' +
      '<path d="M36 28 C44 22 54 26 56 36" stroke-width="1.1"/>' +
      '</g>' +
      '<g fill="#6fa36a">' +
      '<ellipse cx="24" cy="70" rx="3.2" ry="5.2" transform="rotate(12 24 70)"/>' +
      '<ellipse cx="50" cy="78" rx="3" ry="5" transform="rotate(-8 50 78)"/>' +
      '<ellipse cx="18" cy="62" rx="2.8" ry="4.6" transform="rotate(8 18 62)"/>' +
      '<ellipse cx="59" cy="58" rx="2.6" ry="4.4"/>' +
      '<ellipse cx="28" cy="82" rx="2.6" ry="4.2" transform="rotate(-6 28 82)"/>' +
      '<ellipse cx="34" cy="24" rx="4" ry="2.4" fill="#8fbf78"/>' +
      '</g>' +
      '<path d="M30 24 C26 18 32 14 36 18" fill="none" stroke="#2c3a28" stroke-width="1"/>'),

    tree('t06', '漫画圆树', 'common', 'comic',
      shade(18) +
      '<rect x="36" y="66" width="8" height="32" rx="3" fill="#e0a15a" stroke="#1c1917" stroke-width="3"/>' +
      '<path d="M40 70 C20 66 8 54 16 42 C8 34 16 18 30 24 C32 10 50 8 54 22 C68 12 80 26 72 40 C82 50 72 68 54 68 C48 76 42 74 40 70 Z" fill="#8fd16a" stroke="#1c1917" stroke-width="3.2" stroke-linejoin="round"/>' +
      '<ellipse cx="28" cy="38" rx="8" ry="5" fill="#fff" opacity=".55"/>' +
      '<path d="M24 48c10-8 22-6 30 2" fill="none" stroke="#1c1917" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M34 62c3 3 8 3 10 0" fill="none" stroke="#1c1917" stroke-width="2" stroke-linecap="round"/>'),

    tree('t07', '圆点树', 'common', 'abstract',
      shade(16) +
      '<rect x="37" y="68" width="6" height="30" rx="3" fill="#8A5A3A"/>' +
      '<circle cx="40" cy="62" r="10" fill="#14543f"/>' +
      '<circle cx="24" cy="52" r="12" fill="#1f6b52"/>' +
      '<circle cx="56" cy="50" r="11" fill="#2a7a58"/>' +
      '<circle cx="40" cy="40" r="13" fill="#3e8f6a"/>' +
      '<circle cx="28" cy="36" r="8" fill="#67a88c"/>' +
      '<circle cx="50" cy="32" r="7" fill="#1f6b52"/>' +
      '<circle cx="38" cy="24" r="6" fill="#b7d7c4"/>' +
      '<circle cx="46" cy="46" r="3" fill="#e7f2ea"/>'),

    tree('t08', '三角松', 'common', 'abstract',
      shade(18) +
      '<rect x="35" y="78" width="10" height="20" fill="#6b4423"/>' +
      '<path d="M40 8 L62 40 H18 Z" fill="#14543f"/>' +
      '<path d="M40 24 L70 58 H10 Z" fill="#1f6b52"/>' +
      '<path d="M40 42 L76 84 H4 Z" fill="#2f7a56"/>' +
      '<path d="M40 8 L48 28 H40 Z" fill="#8fbf78"/>' +
      '<path d="M40 24 L52 46 H40 Z" fill="#b7d7c4" opacity=".9"/>' +
      '<rect x="38" y="70" width="4" height="10" fill="#e7d3b0"/>'),

    tree('t09', '剪纸松', 'common', 'papercut',
      shade(16) +
      '<circle cx="40" cy="50" r="34" fill="#f3e6d0"/>' +
      '<circle cx="42" cy="52" r="32" fill="#c4554a"/>' +
      '<circle cx="40" cy="50" r="30" fill="#f7f1e4"/>' +
      '<path fill="#1f6b4a" fill-rule="evenodd" d="M40 14 L66 46 H14 Z M40 24 L56 42 H24 Z M40 34 L70 66 H10 Z M40 44 L58 62 H22 Z M40 50 L74 88 H6 Z M40 60 L60 84 H20 Z"/>' +
      '<rect x="36" y="84" width="8" height="14" fill="#f3e6d0"/>' +
      '<rect x="38" y="86" width="4" height="12" fill="#6b3a28"/>' +
      '<circle cx="40" cy="50" r="30" fill="none" stroke="#8a1e24" stroke-width="1.2"/>'),

    tree('t10', '标本苗', 'common', 'botanical',
      shade(14) +
      '<path d="M40 98 V36" fill="none" stroke="#243028" stroke-width="1.35"/>' +
      '<path d="M40 82 C24 76 12 64 14 50 C26 56 34 68 40 76 Z" fill="#d7e6cc" stroke="#243028" stroke-width="1.15"/>' +
      '<path d="M40 74 C56 68 70 54 66 40 C54 48 46 58 40 68 Z" fill="#c5d8b4" stroke="#243028" stroke-width="1.15"/>' +
      '<path d="M40 58 C28 48 22 36 26 24 C32 34 36 44 40 52 Z" fill="#e7f2e4" stroke="#243028" stroke-width="1.1"/>' +
      '<path d="M40 52 C52 42 62 30 56 20 C50 30 46 40 40 48 Z" fill="#d5e4c8" stroke="#243028" stroke-width="1.1"/>' +
      '<path d="M40 76 C28 72 20 66 16 58 M40 66 C52 60 60 50 64 42 M40 54 C32 46 28 36 30 28 M40 48 C48 40 54 32 54 24" fill="none" stroke="#243028" stroke-width=".7"/>' +
      '<path d="M34 96 C28 102 20 98 18 92 M48 96 C54 102 62 96 64 90" fill="none" stroke="#243028" stroke-width="1"/>' +
      '<path d="M52 70 V96" stroke="#8a8175" stroke-width="1.1"/>' +
      '<rect x="46" y="62" width="16" height="10" rx="1.2" fill="#f7f3ea" stroke="#8a8175" stroke-width=".8"/>' +
      '<path d="M48 65 h12 M48 68 h8" stroke="#8a8175" stroke-width=".6"/>' +
      '<circle cx="40" cy="30" r="1.1" fill="#243028"/>'),

    tree('t11', '草稿灌木', 'common', 'sketch',
      shade(20) +
      '<ellipse cx="40" cy="70" rx="26" ry="16" fill="#6a9a58" opacity=".35"/>' +
      '<ellipse cx="26" cy="66" rx="14" ry="12" fill="#3e6b40" opacity=".3"/>' +
      '<g fill="none" stroke="#241e18" stroke-linecap="round">' +
      '<path d="M14 74 C18 58 24 60 28 48" stroke-width="1.7"/>' +
      '<path d="M22 76 C24 60 30 64 32 46" stroke-width="1.8"/>' +
      '<path d="M32 78 C34 58 40 62 38 42" stroke-width="1.7"/>' +
      '<path d="M44 78 C46 60 52 58 56 44" stroke-width="1.8"/>' +
      '<path d="M54 74 C60 62 66 64 68 50" stroke-width="1.6"/>' +
      '<path d="M20 64 C28 58 36 60 48 52" stroke-width="1.1"/>' +
      '<path d="M26 56 C34 48 46 50 58 42" stroke-width="1.05"/>' +
      '<path d="M18 52 l6 3 M36 44 l5 4 M50 46 l6 -2 M30 40 l3 5" stroke-width="1"/>' +
      '</g>' +
      '<g fill="#3e6b40">' +
      '<ellipse cx="24" cy="62" rx="6" ry="3.4" opacity=".45"/>' +
      '<ellipse cx="42" cy="58" rx="7" ry="3.6" opacity=".4"/>' +
      '<ellipse cx="58" cy="60" rx="5" ry="3" opacity=".4"/>' +
      '</g>'),

    tree('t12', '漫画苹果树', 'common', 'comic',
      shade(16) +
      '<rect x="36" y="64" width="9" height="34" rx="2" fill="#e0a15a" stroke="#1c1917" stroke-width="3"/>' +
      '<path d="M40 66 C18 62 10 40 24 30 C28 42 36 46 42 42 C44 28 60 24 68 36 C78 50 64 66 40 66 Z" fill="#8fd16a" stroke="#1c1917" stroke-width="3.2" stroke-linejoin="round"/>' +
      '<path d="M28 40c6-8 16-8 20 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>' +
      '<circle cx="30" cy="48" r="4.2" fill="#e23b3b" stroke="#1c1917" stroke-width="2.2"/>' +
      '<circle cx="46" cy="40" r="3.6" fill="#e23b3b" stroke="#1c1917" stroke-width="2.2"/>' +
      '<circle cx="54" cy="52" r="3.2" fill="#c42828" stroke="#1c1917" stroke-width="2"/>' +
      '<path d="M28 46c1-2 2-2 3-1 M44 38c1-1.6 2-1.6 2.4-.6" stroke="#fff" stroke-width="1" fill="none"/>'),

    tree('t13', '像素樱', 'rare', 'pixel', t13),

    tree('t14', '霓虹松', 'rare', 'cyber',
      '<defs><radialGradient id="t14n" cx="50%" cy="46%" r="62%"><stop offset="0" stop-color="#10181c"/><stop offset=".7" stop-color="#10181c"/><stop offset="1" stop-color="#10181c" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse cx="40" cy="52" rx="32" ry="36" fill="url(#t14n)"/>' +
      '<path d="M40 92 V36" stroke="#06383c" stroke-width="5"/>' +
      '<path d="M40 92 V36" stroke="#5ce1e6" stroke-width="1.6"/>' +
      '<g fill="none" stroke-linejoin="round">' +
      '<path d="M40 16 L56 40 H24 Z" stroke="#ff4ecd" stroke-width="1.7"/>' +
      '<path d="M40 16 L56 40 H24 Z" stroke="#5ce1e6" stroke-width=".7" opacity=".9"/>' +
      '<path d="M40 30 L64 58 H16 Z" stroke="#5ce1e6" stroke-width="1.6"/>' +
      '<path d="M40 46 L70 78 H10 Z" stroke="#ff4ecd" stroke-width="1.5"/>' +
      '<path d="M40 46 L70 78 H10 Z" stroke="#7dffe1" stroke-width=".6"/>' +
      '</g>' +
      '<g fill="#f8f6a8">' +
      '<circle cx="40" cy="16" r="1.8"/>' +
      '<circle cx="24" cy="40" r="1.4"/>' +
      '<circle cx="56" cy="40" r="1.4"/>' +
      '<circle cx="16" cy="58" r="1.3"/>' +
      '<circle cx="64" cy="58" r="1.3"/>' +
      '</g>' +
      '<path d="M18 86 H62" stroke="#5ce1e6" stroke-width=".8" opacity=".7"/>'),

    tree('t15', '写实橡树', 'rare', 'realistic',
      '<defs><radialGradient id="t15g" cx="36%" cy="30%" r="72%"><stop offset="0" stop-color="#d7eea6"/><stop offset=".48" stop-color="#3e8a46"/><stop offset="1" stop-color="#173c28"/></radialGradient>' +
      '<linearGradient id="t15t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5c3a24"/><stop offset=".45" stop-color="#a07850"/><stop offset="1" stop-color="#4a2c18"/></linearGradient></defs>' +
      shade(20) +
      '<path d="M34 100 C32 82 30 70 36 58 C34 74 38 86 42 100 Z" fill="url(#t15t)"/>' +
      '<path d="M42 100 C46 84 52 72 58 64 C50 74 46 86 44 100 Z" fill="#6e4a30"/>' +
      '<path d="M36 62 C30 58 24 60 22 66" fill="none" stroke="#4a2c18" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="40" cy="40" rx="24" ry="20" fill="url(#t15g)"/>' +
      '<ellipse cx="24" cy="46" rx="13" ry="11" fill="#245c34"/>' +
      '<ellipse cx="56" cy="44" rx="12" ry="11" fill="#2f6d40"/>' +
      '<ellipse cx="40" cy="26" rx="12" ry="10" fill="#6aaa58"/>' +
      '<ellipse cx="30" cy="30" rx="8" ry="6" fill="#c5e090" opacity=".85"/>' +
      '<path d="M38 70 C40 78 39 88 40 96" fill="none" stroke="#3a2418" stroke-width="1"/>' +
      '<path d="M26 44 c4 2 6 2 8 0 M50 36 c4 1 6 3 6 5" fill="none" stroke="#14321e" stroke-width=".7" opacity=".45"/>'),

    tree('t16', '网点松', 'rare', 'manga',
      '<defs><clipPath id="t16c"><path d="M40 6 L64 36 H16 Z M40 22 L70 54 H10 Z M40 40 L76 82 H4 Z"/></clipPath></defs>' +
      shade(18) +
      '<path d="M40 6 L64 36 H16 Z M40 22 L70 54 H10 Z M40 40 L76 82 H4 Z" fill="#f4f1ea" stroke="#1c1917" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<g clip-path="url(#t16c)">' + tone(40, 48, 28, 30, 4.2, 0.85, '#1c1917') + '</g>' +
      '<path d="M40 6 L64 36 H16 Z M40 22 L70 54 H10 Z M40 40 L76 82 H4 Z" fill="none" stroke="#1c1917" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<rect x="36" y="78" width="8" height="20" fill="#1c1917"/>' +
      '<path d="M52 18 l6 -2 M58 28 l7 1" stroke="#1c1917" stroke-width="1"/>'),

    tree('t17', '星座树', 'rare', 'abstract',
      '<defs><radialGradient id="t17n" cx="50%" cy="48%" r="64%"><stop offset="0" stop-color="#1b2744"/><stop offset=".68" stop-color="#1b2744"/><stop offset="1" stop-color="#1b2744" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse cx="40" cy="52" rx="32" ry="36" fill="url(#t17n)"/>' +
      '<ellipse cx="28" cy="36" rx="10" ry="6" fill="#31487a" opacity=".45"/>' +
      '<g fill="none" stroke="#8eb4e0" stroke-width="1.15">' +
      '<path d="M40 92 L40 62 L26 46 L18 34"/>' +
      '<path d="M40 70 L56 50 L64 36 L58 24"/>' +
      '<path d="M40 54 L34 36 L28 22"/>' +
      '<path d="M26 46 L22 58"/>' +
      '<path d="M56 50 L50 40"/>' +
      '</g>' +
      '<g fill="#f3e2a2" stroke="#fff6d2" stroke-width=".4">' +
      '<circle cx="40" cy="92" r="2.1"/><circle cx="40" cy="62" r="2.3"/>' +
      '<circle cx="26" cy="46" r="2.2"/><circle cx="18" cy="34" r="1.7"/>' +
      '<circle cx="56" cy="50" r="2.4"/><circle cx="64" cy="36" r="1.8"/>' +
      '<circle cx="58" cy="24" r="2.2"/><circle cx="34" cy="36" r="1.8"/>' +
      '<circle cx="28" cy="22" r="2"/><circle cx="22" cy="58" r="1.5"/>' +
      '<circle cx="50" cy="40" r="1.6"/>' +
      '</g>' +
      '<circle cx="14" cy="20" r=".7" fill="#fff"/><circle cx="66" cy="16" r=".6" fill="#fff"/>' +
      '<circle cx="60" cy="70" r=".6" fill="#d7e4ff"/>'),

    tree('t18', '水墨盆景', 'rare', 'sketch',
      '<path d="M16 86 h48" stroke="#1c1c1c" stroke-width="1.4"/>' +
      '<path d="M22 86 Q40 84 58 86 Q40 92 22 86 Z" fill="none" stroke="#1c1c1c" stroke-width="1.5"/>' +
      '<path d="M24 86 Q40 80 56 86" fill="#1c1c1c"/>' +
      '<path d="M34 84 C36 70 44 64 48 52" fill="none" stroke="#1c1c1c" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M46 58 C54 66 66 64 70 54" fill="none" stroke="#1c1c1c" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M48 50 C36 36 18 40 16 28 C28 32 38 36 44 48 C46 40 52 30 66 26 C58 36 54 42 50 50 Z" fill="#1a1a1a"/>' +
      '<path d="M44 62 C28 58 16 48 20 36 C30 44 36 48 42 52 C36 50 30 44 28 38" fill="#1a1a1a"/>' +
      '<path d="M30 34 C24 26 28 18 36 20" fill="#1a1a1a" opacity=".85"/>' +
      '<path d="M18 24 C28 18 40 22 36 32" fill="none" stroke="#1c1c1c" stroke-width="1.2" opacity=".35"/>' +
      '<path d="M52 40 c6 2 10 1 12 -2" fill="none" stroke="#6a6a6a" stroke-width="3" stroke-linecap="round" opacity=".35"/>' +
      '<ellipse cx="40" cy="90" rx="16" ry="2.4" fill="none" stroke="#1c1c1c" stroke-width="1.2"/>'),

    tree('t19', '浮世松', 'rare', 'ukiyo',
      shade(15) +
      '<path d="M46 98 C44 78 36 68 38 54" fill="none" stroke="#14120f" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M38 58 C28 44 14 46 12 34 C22 38 30 36 34 46 C28 40 24 30 30 22 C36 30 36 40 40 46 C36 34 42 22 52 20 C48 32 46 40 50 48 C58 36 70 38 72 48 C62 50 54 46 50 54 C60 52 70 60 66 70 C56 66 50 60 48 54 C42 66 28 64 24 54 C32 58 36 56 38 58 Z" fill="#1c3d28" stroke="#14120f" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<g fill="none" stroke="#e8f0df" stroke-width="1" stroke-linecap="round">' +
      '<path d="M22 34 c4 -6 8 -6 10 0 M30 26 c4 -7 9 -6 10 1 M48 28 c5 -8 10 -6 8 2"/>' +
      '<path d="M18 46 c5 -5 9 -4 10 1 M60 46 c4 -6 8 -4 7 2 M58 62 c5 -4 8 -2 6 3"/>' +
      '</g>' +
      '<rect x="62" y="74" width="7" height="7" fill="#c4372f" stroke="#14120f" stroke-width=".6"/>' +
      '<path d="M63.5 75.5 h4 M63.5 78 h3" stroke="#f7f1e4" stroke-width=".6"/>'),

    tree('t20', '彩窗小树', 'rare', 'stained',
      '<path d="M14 96 V46 C14 20 66 20 66 46 V96" fill="#f4efe4"/>' +
      '<g stroke="#1a1612" stroke-width="2.1" stroke-linejoin="round">' +
      '<path d="M40 24 L56 42 H24 Z" fill="#f2d36b"/>' +
      '<path d="M24 42 H56 L60 60 H20 Z" fill="#3d7ea6"/>' +
      '<path d="M20 60 H60 L64 78 H16 Z" fill="#c4554a"/>' +
      '<path d="M16 78 H64 L66 94 H14 Z" fill="#2f7a56"/>' +
      '<path d="M36 90 h8 v10 h-8 z" fill="#8a5a3a"/>' +
      '<path d="M40 24 V94 M24 42 H56 M20 60 H60 M16 78 H64" fill="none"/>' +
      '</g>' +
      '<path d="M14 96 V46 C14 20 66 20 66 46 V96" fill="none" stroke="#1a1612" stroke-width="3"/>'),

    tree('t21', '白桦树', 'rare', 'realistic',
      '<defs><linearGradient id="t21t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9d4cc"/><stop offset=".4" stop-color="#f7f4ee"/><stop offset="1" stop-color="#b7b1a8"/></linearGradient>' +
      '<radialGradient id="t21g" cx="40%" cy="32%" r="70%"><stop offset="0" stop-color="#d5ee9c"/><stop offset=".55" stop-color="#5a9a52"/><stop offset="1" stop-color="#234a30"/></radialGradient></defs>' +
      shade(16) +
      '<path d="M34 100 C33 78 32 60 36 46 C38 64 40 82 42 100 Z" fill="url(#t21t)" stroke="#2c2824" stroke-width=".8"/>' +
      '<path d="M42 100 C46 82 50 66 54 54 C48 68 44 84 42 100 Z" fill="#e4dfd6" stroke="#2c2824" stroke-width=".6"/>' +
      '<g stroke="#2c2824" stroke-width="1.15" fill="none">' +
      '<path d="M35 58 h5 M36 68 h4 M34 78 h6 M35 90 h4"/>' +
      '<path d="M44 62 h3 M46 74 h4"/>' +
      '</g>' +
      '<ellipse cx="42" cy="34" rx="20" ry="16" fill="url(#t21g)"/>' +
      '<ellipse cx="28" cy="36" rx="10" ry="8" fill="#3d7a42"/>' +
      '<ellipse cx="54" cy="30" rx="9" ry="7" fill="#6aaa58"/>' +
      '<ellipse cx="36" cy="22" rx="8" ry="6" fill="#c6e494"/>' +
      '<path d="M36 46 C30 42 26 44 24 40" fill="none" stroke="#5c3a24" stroke-width="1.4" stroke-linecap="round"/>'),

    tree('t22', '电路神木', 'epic', 'cyber',
      '<defs><radialGradient id="t22b" cx="50%" cy="48%" r="62%"><stop offset="0" stop-color="#10181c"/><stop offset=".72" stop-color="#10181c"/><stop offset="1" stop-color="#10181c" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse cx="40" cy="50" rx="34" ry="40" fill="url(#t22b)"/>' +
      '<g fill="none" stroke="#7dffe1" stroke-width="1.45" stroke-linecap="round">' +
      '<path d="M40 90 V28"/>' +
      '<path d="M40 72 H22 V56 H12"/>' +
      '<path d="M40 64 H58 V46 H68"/>' +
      '<path d="M40 48 H26 V34 H16"/>' +
      '<path d="M40 40 H54 V26 H64"/>' +
      '<path d="M40 28 L28 16 H18"/>' +
      '<path d="M40 28 L52 14 H62"/>' +
      '<path d="M40 28 V12"/>' +
      '<path d="M22 56 H14 V46" stroke="#ff4ecd"/>' +
      '<path d="M58 46 H66 V36" stroke="#ff4ecd"/>' +
      '</g>' +
      '<g>' +
      '<circle cx="12" cy="56" r="2.1" fill="#ff4ecd"/>' +
      '<circle cx="68" cy="46" r="2.1" fill="#5ce1e6"/>' +
      '<circle cx="16" cy="34" r="1.8" fill="#f8f6a8"/>' +
      '<circle cx="64" cy="26" r="1.8" fill="#ff4ecd"/>' +
      '<circle cx="18" cy="16" r="1.7" fill="#5ce1e6"/>' +
      '<circle cx="62" cy="14" r="1.7" fill="#f8f6a8"/>' +
      '<circle cx="40" cy="12" r="2.6" fill="#f8f6a8"/>' +
      '<circle cx="40" cy="28" r="2" fill="#ff4ecd"/>' +
      '<circle cx="14" cy="46" r="1.5" fill="#7dffe1"/>' +
      '<circle cx="66" cy="36" r="1.5" fill="#ff4ecd"/>' +
      '</g>' +
      '<rect x="34" y="44" width="12" height="8" rx="1" fill="none" stroke="#5ce1e6" stroke-width="1"/>'),

    tree('t23', '像素古树', 'epic', 'pixel', t23),

    tree('t24', '猴面包树', 'epic', 'realistic',
      '<defs><linearGradient id="t24t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a38"/><stop offset=".42" stop-color="#e4c09a"/><stop offset="1" stop-color="#6b4428"/></linearGradient>' +
      '<radialGradient id="t24g" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#b7d98a"/><stop offset="1" stop-color="#2c5c38"/></radialGradient></defs>' +
      shade(22) +
      '<path d="M24 100 C16 86 14 64 22 50 C30 40 50 40 58 50 C66 64 64 86 56 100 Z" fill="url(#t24t)"/>' +
      '<path d="M32 52 C30 70 32 86 34 100 M48 52 C50 72 48 88 46 100 M40 48 C38 66 40 84 41 100" fill="none" stroke="#7a5436" stroke-width="1.05" opacity=".7"/>' +
      '<ellipse cx="28" cy="78" rx="3" ry="5" fill="#c4956a" opacity=".45"/>' +
      '<path d="M22 56 C10 50 8 40 16 36 C14 46 18 52 24 54 Z" fill="#6aaa55"/>' +
      '<path d="M58 54 C70 46 74 36 64 32 C66 42 62 50 56 52 Z" fill="#3d6b45"/>' +
      '<ellipse cx="40" cy="38" rx="16" ry="9" fill="url(#t24g)"/>' +
      '<ellipse cx="30" cy="34" rx="7" ry="4" fill="#d5eea4" opacity=".8"/>' +
      '<path d="M26 100 C20 96 16 98 14 94 M54 100 C60 96 66 98 68 92" fill="none" stroke="#5c3a24" stroke-width="2" stroke-linecap="round"/>'),

    tree('t25', '夜樱', 'epic', 'manga',
      '<defs><clipPath id="t25c"><circle cx="42" cy="36" r="24"/></clipPath></defs>' +
      '<circle cx="42" cy="36" r="26" fill="#161426"/>' +
      '<circle cx="52" cy="24" r="8" fill="#f7f1e4"/>' +
      '<circle cx="48" cy="22" r="7" fill="#161426"/>' +
      '<g clip-path="url(#t25c)" opacity=".45">' + tone(42, 36, 22, 22, 3.6, 0.55, '#f7f1e4') + '</g>' +
      '<path d="M34 100 C36 78 40 62 46 46" fill="none" stroke="#1c1917" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M46 52 C58 46 66 36 62 26" fill="none" stroke="#1c1917" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M44 60 C32 56 24 48 26 38" fill="none" stroke="#1c1917" stroke-width="2" stroke-linecap="round"/>' +
      '<g fill="#f7b6c8" stroke="#1c1917" stroke-width="1.1">' +
      '<circle cx="30" cy="34" r="3.3"/><circle cx="40" cy="22" r="3.6"/>' +
      '<circle cx="52" cy="30" r="3"/><circle cx="36" cy="42" r="2.8"/>' +
      '<circle cx="24" cy="44" r="2.5"/><circle cx="58" cy="40" r="2.6"/>' +
      '<circle cx="46" cy="16" r="2.4"/><circle cx="18" cy="36" r="2"/>' +
      '</g>' +
      '<g fill="#fff" opacity=".8">' +
      '<circle cx="28" cy="32" r=".6"/><circle cx="50" cy="28" r=".5"/><circle cx="38" cy="20" r=".5"/>' +
      '</g>' +
      shade(12)),

    tree('t26', '分形树', 'epic', 'abstract', fractalSvg()),

    tree('t27', '彩窗高树', 'epic', 'stained',
      '<path d="M22 98 V28 C22 8 58 8 58 28 V98" fill="#f7f3ea"/>' +
      '<g stroke="#14120f" stroke-width="1.8" stroke-linejoin="round">' +
      '<circle cx="40" cy="26" r="12" fill="#f2d36b"/>' +
      '<circle cx="40" cy="26" r="4.5" fill="#c4554a"/>' +
      '<path d="M40 14 V38 M28 26 H52 M31 17 L49 35 M49 17 L31 35" fill="none"/>' +
      '<path d="M26 40 H54 L58 56 H22 Z" fill="#3d7ea6"/>' +
      '<path d="M22 56 H58 L62 72 H18 Z" fill="#2f7a56"/>' +
      '<path d="M18 72 H62 L64 88 H16 Z" fill="#c4554a"/>' +
      '<path d="M16 88 H64 V98 H16 Z" fill="#f2d36b"/>' +
      '<path d="M36 88 h8 v10 h-8 z" fill="#8a5a3a"/>' +
      '<path d="M40 40 V98 M26 40 H54 M22 56 H58 M18 72 H62" fill="none"/>' +
      '</g>' +
      '<path d="M20 98 V30 C20 6 60 6 60 30 V98" fill="none" stroke="#14120f" stroke-width="3"/>'),

    tree('t28', '极光树', 'legendary', 'cyber',
      '<defs><linearGradient id="t28a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5ce1e6"/><stop offset=".5" stop-color="#c9a6ff"/><stop offset="1" stop-color="#f8f6a8"/></linearGradient></defs>' +
      '<ellipse cx="40" cy="50" rx="34" ry="38" fill="#0c1418"/>' +
      '<path d="M8 62 C22 28 34 26 42 42 C50 58 62 34 74 24 C62 40 50 44 40 40 C28 36 18 58 8 62 Z" fill="#5ce1e6" opacity=".9"/>' +
      '<path d="M14 50 C28 18 48 16 60 34 C46 30 34 36 28 48 C24 36 16 40 14 50 Z" fill="#c9a6ff" opacity=".88"/>' +
      '<path d="M20 40 C32 16 52 22 64 18 C52 28 40 26 34 36 C40 24 52 26 58 20" fill="#f8f6a8" opacity=".75"/>' +
      '<path d="M12 70 C24 48 36 64 48 50 C58 40 66 52 72 46" fill="none" stroke="url(#t28a)" stroke-width="1.4" opacity=".9"/>' +
      '<rect x="38" y="58" width="4" height="36" rx="2" fill="#e7fff8"/>' +
      '<path d="M40 58 V40" stroke="#fff" stroke-width="1.2"/>' +
      '<g fill="#fff">' +
      '<circle cx="40" cy="18" r="2.2"/><circle cx="18" cy="28" r="1"/>' +
      '<circle cx="64" cy="22" r="1.1"/><circle cx="22" cy="48" r=".8"/>' +
      '<circle cx="66" cy="58" r=".8"/><circle cx="14" cy="40" r=".7"/>' +
      '<circle cx="70" cy="36" r=".7"/>' +
      '</g>' +
      '<path d="M16 90 H64" stroke="#5ce1e6" stroke-width=".8" opacity=".65"/>'),

    tree('t29', '千年橡', 'legendary', 'realistic',
      '<defs><radialGradient id="t29g" cx="38%" cy="28%" r="75%"><stop offset="0" stop-color="#e4f2b4"/><stop offset=".42" stop-color="#3f8644"/><stop offset="1" stop-color="#143424"/></radialGradient>' +
      '<linearGradient id="t29t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a2c18"/><stop offset=".4" stop-color="#a07850"/><stop offset="1" stop-color="#3a2214"/></linearGradient></defs>' +
      shade(24) +
      '<path d="M18 96 C10 90 8 84 14 80" fill="none" stroke="#4a2c18" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M62 98 C70 90 74 82 68 76" fill="none" stroke="#5c3a24" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M30 100 C26 78 22 64 28 52 C24 68 30 84 36 100 Z" fill="url(#t29t)"/>' +
      '<path d="M36 100 C40 76 48 62 58 50 C50 64 44 82 40 100 Z" fill="#6b4428"/>' +
      '<path d="M34 70 C24 66 16 70 14 62" fill="none" stroke="#3a2416" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M48 64 C58 58 66 60 70 52" fill="none" stroke="#5c3a24" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="40" cy="38" rx="26" ry="20" fill="url(#t29g)"/>' +
      '<ellipse cx="20" cy="42" rx="13" ry="11" fill="#1e4c30"/>' +
      '<ellipse cx="60" cy="40" rx="13" ry="12" fill="#245636"/>' +
      '<ellipse cx="40" cy="22" rx="14" ry="11" fill="#5a9a48"/>' +
      '<ellipse cx="28" cy="24" rx="8" ry="6" fill="#d7ee9e"/>' +
      '<ellipse cx="52" cy="26" rx="7" ry="5" fill="#8fbf62"/>' +
      '<path d="M34 58 C36 70 34 84 36 96" fill="none" stroke="#3a2418" stroke-width="1"/>' +
      '<path d="M22 40 c3 2 5 1 6 -1 M48 22 c4 1 6 3 5 5 M16 84 c2 -2 4 -2 5 0" fill="none" stroke="#1a3824" stroke-width=".7" opacity=".5"/>' +
      '<circle cx="18" cy="36" r="1.3" fill="#e6c56a"/><circle cx="64" cy="30" r="1.2" fill="#f0d78a"/>'),

    tree('t30', '月下松', 'legendary', 'ukiyo',
      '<ellipse cx="40" cy="54" rx="36" ry="40" fill="#1a2744"/>' +
      '<circle cx="54" cy="28" r="14" fill="#f4e7c2" stroke="#14120f" stroke-width="1.3"/>' +
      '<circle cx="50" cy="26" r="11" fill="#f7f1e4"/>' +
      '<path d="M8 70 C20 64 28 66 40 62 C52 58 64 64 74 58" fill="none" stroke="#f7f1e4" stroke-width="3" opacity=".35" stroke-linecap="round"/>' +
      '<path d="M6 78 C22 72 34 76 48 70 C60 66 70 72 76 68" fill="none" stroke="#f7f1e4" stroke-width="2" opacity=".25"/>' +
      '<path d="M30 100 C32 78 28 64 34 50" fill="none" stroke="#14120f" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M34 54 C24 40 10 42 8 30 C18 34 26 32 30 42 C24 36 18 26 26 18 C32 28 32 38 38 44 C34 32 42 18 54 16 C48 30 46 38 52 46 C62 34 74 38 74 50 C64 50 54 46 50 54 C58 56 66 64 60 74 C50 68 42 62 40 54 C32 66 18 62 16 50 C24 56 30 52 34 54 Z" fill="#14382c" stroke="#14120f" stroke-width="1.45" stroke-linejoin="round"/>' +
      '<g fill="none" stroke="#d7e6cf" stroke-width=".9" stroke-linecap="round">' +
      '<path d="M16 32 c4 -6 8 -5 9 1 M26 22 c4 -7 8 -6 8 1 M46 22 c5 -8 10 -6 8 2"/>' +
      '<path d="M14 44 c5 -5 8 -4 9 1 M62 46 c4 -6 8 -3 6 2 M54 64 c5 -4 8 -2 5 3"/>' +
      '</g>' +
      '<rect x="64" y="78" width="8" height="8" fill="#c4372f" stroke="#14120f" stroke-width=".6"/>' +
      '<path d="M66 80 h4.5 M66 82.5 h3.2 M66 85 h4" stroke="#f7f1e4" stroke-width=".55"/>' +
      '<circle cx="16" cy="20" r=".7" fill="#fff"/><circle cx="24" cy="14" r=".5" fill="#fff"/>')
  ];

  window.EUREKA_TIER_NAME = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' };
  window.EUREKA_STYLE_NAME = {
    pixel: '像素', sketch: '速写', comic: '漫画', abstract: '抽象', papercut: '剪纸',
    botanical: '标本', cyber: '霓虹', realistic: '写实', manga: '漫画', ukiyo: '浮世绘', stained: '彩窗'
  };
})();
