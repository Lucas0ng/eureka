/* 30 collectible trees. Ids, tiers and odds are the gacha contract; drawings are hand-built SVG.
   Shared frame: viewBox 0 0 80 104, trunk base at x=40 on a ground line at y=100, soft shadow.
   Styles: pixel, cyber, realistic, comic, manga, sketch, abstract, papercut, botanical, ukiyo, stained.
   Ids inside drawings are prefixed by the app at render time, so only url(#id) references are used. */
(function () {
  const VB = '0 0 80 104';

  /* ---------- small helpers ---------- */
  function N(n) { return String(Math.round(n * 10) / 10); }
  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shade(rx, op) {
    return '<ellipse cx="40" cy="100" rx="' + rx + '" ry="' + N(rx * 0.16 + 0.8) + '" fill="#14261d" fill-opacity="' + (op || 0.24) + '"/>';
  }
  function P(d, fill, ex) { return '<path d="' + d + '" fill="' + fill + '"' + (ex ? ' ' + ex : '') + '/>'; }
  /* stroke-only path; fill-opacity=0 keeps it a line even in the locked silhouette (which forces fill) */
  function L(d, stroke, w, ex) {
    return '<path d="' + d + '" fill="none" fill-opacity="0" stroke="' + stroke + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + (ex ? ' ' + ex : '') + '/>';
  }
  /* outline only on the outer edge of a union path: wide stroke first, fill drawn again on top */
  function rimP(d, fill, stroke, w) {
    return P(d, fill, 'stroke="' + stroke + '" stroke-width="' + N(w * 2) + '" stroke-linejoin="round"') + P(d, fill);
  }
  function C(cx, cy, r, fill, ex) { return '<circle cx="' + N(cx) + '" cy="' + N(cy) + '" r="' + N(r) + '" fill="' + fill + '"' + (ex ? ' ' + ex : '') + '/>'; }
  function E(cx, cy, rx, ry, fill, ex) { return '<ellipse cx="' + N(cx) + '" cy="' + N(cy) + '" rx="' + N(rx) + '" ry="' + N(ry) + '" fill="' + fill + '"' + (ex ? ' ' + ex : '') + '/>'; }
  function lg(id, x1, y1, x2, y2, stops) {
    let o = '<linearGradient id="' + id + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">';
    stops.forEach(function (s) { o += '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; });
    return o + '</linearGradient>';
  }
  function rg(id, cx, cy, r, stops) {
    let o = '<radialGradient id="' + id + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '">';
    stops.forEach(function (s) { o += '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; });
    return o + '</radialGradient>';
  }
  function pt(x, y) { return N(x) + ' ' + N(y); }

  /* lumpy closed blob: scalloped foliage edge */
  function lump(cx, cy, rx, ry, n, amp, seed) {
    const R = rng(seed);
    const rot = R() * 6.283;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = rot + i / n * 6.283;
      const k = 1 - amp * 0.55 + R() * amp * 0.35;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k, a]);
    }
    let d = 'M' + pt(pts[0][0], pts[0][1]);
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % n];
      const am = p[2] + 3.1416 / n;
      const k = 1 + amp * (0.45 + R() * 0.5);
      d += 'Q' + pt(cx + Math.cos(am) * rx * k, cy + Math.sin(am) * ry * k) + ' ' + pt(q[0], q[1]);
    }
    return d + 'Z';
  }

  /* regular comic cloud with round bumps */
  function cloud(cx, cy, rx, ry, n, rot) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (rot || -1.5708) + i / n * 6.283;
      pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    let d = 'M' + pt(pts[0][0], pts[0][1]);
    for (let i = 0; i < n; i++) {
      const q = pts[(i + 1) % n];
      const ch = Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]);
      d += 'A' + N(ch * 0.58) + ' ' + N(ch * 0.58) + ' 0 0 1 ' + pt(q[0], q[1]);
    }
    return d + 'Z';
  }

  /* tapered, slightly bent limb as a closed path */
  function limb(x0, y0, x1, y1, w0, w1, bend) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const mx = (x0 + x1) / 2 + nx * (bend || 0);
    const my = (y0 + y1) / 2 + ny * (bend || 0);
    const wm = (w0 + w1) / 4;
    return 'M' + pt(x0 - nx * w0 / 2, y0 - ny * w0 / 2) +
      'Q' + pt(mx - nx * wm, my - ny * wm) + ' ' + pt(x1 - nx * w1 / 2, y1 - ny * w1 / 2) +
      'L' + pt(x1 + nx * w1 / 2, y1 + ny * w1 / 2) +
      'Q' + pt(mx + nx * wm, my + ny * wm) + ' ' + pt(x0 + nx * w0 / 2, y0 + ny * w0 / 2) + 'Z';
  }
  function limbs(list) { return list.map(function (a) { return limb.apply(null, a); }).join(''); }

  /* lens-shaped leaf dab */
  function dab(x, y, s, ang) {
    const c = Math.cos(ang);
    const si = Math.sin(ang);
    const ax = x - c * s;
    const ay = y - si * s;
    const bx = x + c * s;
    const by = y + si * s;
    const w = s * 0.62;
    return 'M' + pt(ax, ay) + 'Q' + pt(x - si * w, y + c * w) + ' ' + pt(bx, by) + 'Q' + pt(x + si * w, y - c * w) + ' ' + pt(ax, ay) + 'Z';
  }
  /* ginkgo fan leaf, apex at (x,y) pointing along ang */
  function fan(x, y, s, ang) {
    const ux = Math.sin(ang);
    const uy = -Math.cos(ang);
    const px = Math.cos(ang);
    const py = Math.sin(ang);
    return 'M' + pt(x, y) + 'L' + pt(x + ux * s - px * s * 0.9, y + uy * s - py * s * 0.9) +
      'Q' + pt(x + ux * s * 1.6, y + uy * s * 1.6) + ' ' + pt(x + ux * s + px * s * 0.9, y + uy * s + py * s * 0.9) + 'Z';
  }

  /* painterly canopy: per cluster a shadow mass, a mid mass, a lit mass up-left and leaf dabs */
  function canopy(cl, pal, seed, o) {
    o = o || {};
    const R = rng(seed + 99);
    let back = '';
    let mid = '';
    let lite = '';
    let hi = '';
    let dk = '';
    const mark = o.mark || dab;
    cl.forEach(function (c, i) {
      const x = c[0];
      const y = c[1];
      const r = c[2];
      const s = seed + i * 13;
      back += lump(x, y, r, r * 0.9, 8, 0.26, s);
      mid += lump(x - r * 0.13, y - r * 0.17, r * 0.8, r * 0.7, 8, 0.26, s + 3);
      lite += lump(x - r * 0.3, y - r * 0.36, r * 0.5, r * 0.42, 7, 0.3, s + 5);
      const nd = o.dabs == null ? 4 : o.dabs;
      for (let k = 0; k < nd; k++) {
        const a = 3.4 + R() * 1.9;
        const rr = r * (0.25 + R() * 0.5);
        hi += mark(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.9, (o.ds || 1.5) * (0.8 + R() * 0.4), (o.mark ? -0.5 + R() : R() * 3.14));
      }
      for (let k = 0; k < (o.dk == null ? 3 : o.dk); k++) {
        const a = 0.2 + R() * 1.6;
        const rr = r * (0.45 + R() * 0.4);
        dk += mark(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.85, (o.ds || 1.5) * (0.8 + R() * 0.4), (o.mark ? -0.5 + R() : R() * 3.14));
      }
    });
    return P(back, pal[1], 'stroke="' + pal[0] + '" stroke-width="' + N((o.rim || 1.4) * 2) + '" stroke-linejoin="round"') + P(back, pal[1]) +
      P(dk, pal[0], 'fill-opacity=".55"') + P(mid, pal[2]) + P(lite, pal[3]) + P(hi, pal[4]);
  }

  /* ---------- pixel sprite engine: 40x52 grid of 2-unit pixels ---------- */
  const BAYER = [[0, 2], [3, 1]];
  function sprite(ramps, build) {
    const W = 40;
    const H = 52;
    const g = new Array(W * H).fill(null);
    let z = 0;
    function set(x, y, c) { if (x >= 0 && y >= 0 && x < W && y < 50) g[y * W + x] = c; }
    const api = {
      blob: function (cx, cy, rx, ry, m) {
        z++;
        for (let y = Math.floor(cy - ry); y <= cy + ry; y++) {
          for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
            const dx = (x + 0.5 - cx) / rx;
            const dy = (y + 0.5 - cy) / ry;
            if (dx * dx + dy * dy <= 1) set(x, y, { m: m, l: -(dx * 0.62 + dy * 0.78) * 0.95 + 0.08, z: z });
          }
        }
      },
      line: function (x0, y0, x1, y1, w0, w1, m) {
        z++;
        const dx = x1 - x0;
        const dy = y1 - y0;
        const len2 = dx * dx + dy * dy || 1;
        const len = Math.sqrt(len2);
        let nx = dy / len;
        let ny = -dx / len;
        if (nx > 0 || (nx === 0 && ny > 0)) { nx = -nx; ny = -ny; }
        const pad = Math.max(w0, w1);
        for (let y = Math.floor(Math.min(y0, y1) - pad); y <= Math.max(y0, y1) + pad; y++) {
          for (let x = Math.floor(Math.min(x0, x1) - pad); x <= Math.max(x0, x1) + pad; x++) {
            const px = x + 0.5 - x0;
            const py = y + 0.5 - y0;
            let t = (px * dx + py * dy) / len2;
            t = Math.max(0, Math.min(1, t));
            const ex = px - dx * t;
            const ey = py - dy * t;
            const w = (w0 + (w1 - w0) * t) / 2;
            if (ex * ex + ey * ey <= w * w) {
              const s = (ex * nx + ey * ny) / w;
              set(x, y, { m: m, l: s * 0.75 - 0.05, z: z });
            }
          }
        }
      },
      tri: function (ax, ay, by, hw, m) {
        z++;
        for (let y = Math.floor(ay); y < by; y++) {
          const t = (y + 0.5 - ay) / (by - ay);
          const w = hw * t + 0.6;
          for (let x = Math.floor(ax - w); x <= ax + w; x++) {
            const dx = (x + 0.5 - ax) / w;
            if (Math.abs(dx) > 1) continue;
            if (y >= by - 1 && (x % 3) === 1) continue;
            set(x, y, { m: m, l: -dx * 0.8 + 0.42 - 0.75 * t, z: z });
          }
        }
      },
      dot: function (x, y, color) { set(x, y, { c: color, z: 999 }); }
    };
    build(api);
    const col = new Array(W * H).fill(null);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const c = g[y * W + x];
        if (!c) continue;
        if (c.c) { col[y * W + x] = c.c; continue; }
        let l = c.l;
        for (let k = 1; k <= 2; k++) {
          const up = y - k >= 0 ? g[(y - k) * W + x] : null;
          if (up && !up.c && up.z > c.z) { l -= 0.8; break; }
        }
        const Lv = l + (BAYER[y & 1][x & 1] / 3 - 0.5) * 0.2;
        let lvl = Lv > 0.6 ? 4 : Lv > 0.12 ? 3 : Lv > -0.38 ? 2 : 1;
        const nb = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
        for (let i = 0; i < 4; i++) {
          const n = (nb[i][0] < 0 || nb[i][1] < 0 || nb[i][0] >= W || nb[i][1] >= H) ? null : g[nb[i][1] * W + nb[i][0]];
          if (!n || n.c || (n.m !== c.m && n.z > c.z)) { lvl = 0; break; }
        }
        col[y * W + x] = ramps[c.m][lvl];
      }
    }
    /* run-length rows, merged vertically, one path per colour */
    const byCol = {};
    let open = {};
    for (let y = 0; y < H; y++) {
      const next = {};
      let x = 0;
      while (x < W) {
        const c = col[y * W + x];
        if (!c) { x++; continue; }
        let e = x;
        while (e + 1 < W && col[y * W + e + 1] === c) e++;
        const key = x + ',' + (e - x + 1) + ',' + c;
        let r = open[key];
        if (r) r[3]++;
        else { r = [x, y, e - x + 1, 1]; (byCol[c] = byCol[c] || []).push(r); }
        next[key] = r;
        x = e + 1;
      }
      open = next;
    }
    let o = '<g transform="scale(2)" shape-rendering="crispEdges">';
    Object.keys(byCol).forEach(function (c) {
      let d = '';
      byCol[c].forEach(function (r) { d += 'M' + r[0] + ' ' + r[1] + 'h' + r[2] + 'v' + r[3] + 'h-' + r[2] + 'z'; });
      o += '<path fill="' + c + '" d="' + d + '"/>';
    });
    return o + '</g>';
  }

  const BARK = ['#24160f', '#553522', '#7f5233', '#a8774c', '#cc9c6c'];

  /* t01 pixel sprout */
  const t01 = shade(13) + sprite({
    leaf: ['#173d26', '#2c6c3a', '#4ea24a', '#8fd36a', '#dcf7a0'],
    bark: BARK,
    soil: ['#2a1c13', '#5a3f2c', '#7e5a3e', '#a07a55', '#c29c72']
  }, function (s) {
    s.blob(20, 50.6, 7, 2.8, 'soil');
    s.line(20, 49.5, 20, 30, 3.8, 2.2, 'bark');
    s.line(20, 41, 14, 35, 1.6, 1.2, 'bark');
    s.line(20, 36, 25.5, 30, 1.6, 1.2, 'bark');
    s.blob(13.5, 32.5, 5.2, 4.4, 'leaf');
    s.blob(26.5, 28.5, 5.4, 4.6, 'leaf');
    s.blob(19.5, 23, 6.2, 5.2, 'leaf');
    s.blob(22, 18, 3.6, 3.2, 'leaf');
    [[11, 47, '#4ea24a'], [11, 46, '#8fd36a'], [12, 47, '#2c6c3a'], [28, 47, '#4ea24a'], [28, 46, '#8fd36a'], [27, 47, '#2c6c3a'],
      [29, 23, '#f7b6c8'], [30, 23, '#f08aa8'], [29, 22, '#fff0f4']].forEach(function (d) { s.dot(d[0], d[1], d[2]); });
  });

  /* t02 pixel pine */
  const t02 = shade(14) + sprite({
    pine: ['#0e2a22', '#1c5640', '#2e8a58', '#62bb6a', '#bfe991'],
    bark: BARK
  }, function (s) {
    s.line(20, 49.5, 20, 40, 3.6, 3, 'bark');
    s.tri(20, 30, 45, 15.5, 'pine');
    s.tri(20, 22, 37, 12.5, 'pine');
    s.tri(20, 15.5, 30, 9.5, 'pine');
    s.tri(20, 11, 22.5, 6, 'pine');
    [[14, 41, '#7f5233'], [14, 42, '#553522'], [26, 34, '#7f5233'], [26, 35, '#553522'], [19, 11, '#e9ffd0']].forEach(function (d) { s.dot(d[0], d[1], d[2]); });
  });

  /* t13 pixel cherry */
  const t13 = shade(17) + sprite({
    pink: ['#6c1f3f', '#c64f78', '#ec88a8', '#f9bccd', '#fff3f6'],
    bark: ['#22130e', '#4a2b21', '#6e4232', '#93604a', '#b58066']
  }, function (s) {
    s.line(19, 47.5, 14, 50, 1.8, 1.2, 'bark');
    s.line(21, 47.5, 26, 50, 1.8, 1.2, 'bark');
    s.line(20, 49.5, 20, 35, 4.2, 3, 'bark');
    s.line(20, 39, 11, 29, 2.4, 1.5, 'bark');
    s.line(20, 37, 29, 27, 2.4, 1.5, 'bark');
    s.line(20, 35, 19, 24, 2, 1.4, 'bark');
    s.blob(5.5, 25, 3.6, 3.1, 'pink');
    s.blob(34.5, 22.5, 3.6, 3.1, 'pink');
    s.blob(9.5, 28.5, 5.6, 4.6, 'pink');
    s.blob(30.5, 26.5, 6, 5, 'pink');
    s.blob(14, 20.5, 6.6, 5.6, 'pink');
    s.blob(26.5, 18.5, 6.6, 5.6, 'pink');
    s.blob(20, 13.5, 6, 5, 'pink');
    s.blob(19.5, 26, 5, 3.4, 'pink');
    [[6, 34, '#f9bccd'], [33, 36, '#ec88a8'], [9, 41, '#fff3f6'], [30, 43, '#f9bccd'], [14, 46, '#ec88a8'],
      [25, 41, '#f9bccd'], [3, 38, '#ec88a8'], [36, 30, '#fff3f6'], [11, 37, '#ec88a8']].forEach(function (d) { s.dot(d[0], d[1], d[2]); });
  });

  /* t23 pixel ancient sacred tree with shimenawa rope and fireflies */
  const t23 = shade(22) + sprite({
    leaf: ['#0b241e', '#19503f', '#2c8450', '#69bf5a', '#d0ef88'],
    bark: ['#1d130e', '#493225', '#704e3d', '#987155', '#bf9876'],
    rope: ['#4a3418', '#9a7438', '#c8a058', '#e8c98a', '#fff1cc']
  }, function (s) {
    s.line(20, 46, 6, 50, 4, 1.4, 'bark');
    s.line(20, 46, 34, 50, 4, 1.4, 'bark');
    s.line(19, 47, 12, 50, 3, 1.2, 'bark');
    s.line(21, 47, 28, 50, 3, 1.2, 'bark');
    s.line(20, 50, 20, 28, 8.4, 5.6, 'bark');
    s.line(19, 33, 7, 24, 3.6, 2, 'bark');
    s.line(21, 32, 33, 22, 3.6, 2, 'bark');
    s.line(20, 30, 21, 16, 3, 2, 'bark');
    s.line(15.6, 35.5, 24.4, 35.5, 2.2, 2.2, 'rope');
    s.blob(4.5, 18.5, 3.6, 3, 'leaf');
    s.blob(35.5, 16, 3.6, 3, 'leaf');
    s.blob(7, 24.5, 5.6, 4.6, 'leaf');
    s.blob(33, 22.5, 6, 5, 'leaf');
    s.blob(9.5, 11.5, 4.4, 3.8, 'leaf');
    s.blob(30.5, 9.5, 4.4, 3.8, 'leaf');
    s.blob(13, 17.5, 7, 5.6, 'leaf');
    s.blob(27.5, 15.5, 7, 5.6, 'leaf');
    s.blob(20, 10.5, 7, 5.4, 'leaf');
    s.blob(20, 22, 6.4, 4, 'leaf');
    /* glowing hollow */
    [[19, 40], [20, 40], [19, 41], [20, 41], [19, 42], [20, 42], [19, 43], [20, 43]].forEach(function (d, i) {
      s.dot(d[0], d[1], (i === 2 || i === 5) ? '#ffe9a0' : (i < 2 || i > 5) ? '#2a1a10' : '#f2a93a');
    });
    /* shide paper zigzags */
    [[17, 37], [17, 38], [18, 38], [18, 39], [22, 37], [22, 38], [23, 38], [23, 39]].forEach(function (d) { s.dot(d[0], d[1], '#ffffff'); });
    /* hanging vines */
    [[5, 29], [5, 30], [5, 31], [5, 32], [35, 27], [35, 28], [35, 29], [35, 30], [35, 31], [27, 20], [27, 21], [27, 22]].forEach(function (d, i) {
      s.dot(d[0], d[1], i % 2 ? '#69bf5a' : '#2c8450');
    });
    /* fireflies */
    [[2, 33], [37, 36], [10, 39], [30, 42], [33, 4], [6, 6]].forEach(function (f) {
      s.dot(f[0], f[1], '#fffbe0');
      s.dot(f[0] - 1, f[1], '#f2b232');
      s.dot(f[0] + 1, f[1], '#f2b232');
      s.dot(f[0], f[1] - 1, '#f2b232');
      s.dot(f[0], f[1] + 1, '#f2b232');
    });
  });

  /* ---------- cyber ---------- */
  const CY = '#2de2e6';
  const MG = '#ff3fa4';
  const AC = '#c6ff3d';
  const DK = '#151a33';
  function neon(d, c, w) {
    return L(d, c, N(w * 3.2), 'stroke-opacity=".22"') + L(d, c, w);
  }
  function node(x, y, c, r) {
    return C(x, y, (r || 1) * 2.4, c, 'fill-opacity=".25"') + C(x, y, r || 1, c) + C(x, y, (r || 1) * 0.42, '#ffffff');
  }
  function lens(x0, y0, x1, y1, w) {
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    const nx = -dy / len * w;
    const ny = dx / len * w;
    return 'M' + pt(x0, y0) + 'Q' + pt(mx + nx, my + ny) + ' ' + pt(x1, y1) + 'Q' + pt(mx - nx, my - ny) + ' ' + pt(x0, y0) + 'Z';
  }

  function t11() {
    const leaves = [[40, 62, 18, 46, 9, CY], [40, 60, 62, 43, 9, MG], [40, 55, 40, 26, 10, AC]];
    let o = shade(13);
    o += P('M30 91H50L47.5 100H32.5Z', DK, 'stroke="' + CY + '" stroke-width=".8" stroke-linejoin="round"');
    o += L('M33.5 95.5H38L39.5 94H46', CY, 0.7) + C(46.5, 94, 0.9, AC);
    o += P(limb(40, 91, 40, 50, 3.4, 2, 0), DK);
    o += L('M40 89V58', AC, 0.6, 'stroke-opacity=".9"');
    leaves.forEach(function (l) {
      const d = lens(l[0], l[1], l[2], l[3], l[4]);
      o += P(d, '#1b2046');
      o += neon(d, l[5], 1);
    });
    o += L('M38 58L30 50H26M30 50V45', CY, 0.7) + L('M42 56L50 48H55M50 48V44', MG, 0.7) + L('M40 51V34M40 44L44 40M40 39L36 35', AC, 0.7);
    o += node(26, 50, CY, 0.9) + node(30, 45, CY, 0.7) + node(55, 48, MG, 0.9) + node(50, 44, MG, 0.7) + node(40, 33, AC, 1.1) + node(44, 40, AC, 0.7) + node(36, 35, AC, 0.7);
    return o;
  }

  function t14() {
    const tiers = [[58, 90, 27], [42, 74, 23], [28, 58, 18.5], [16, 43, 13]];
    let o = shade(18);
    o += P('M36.5 88H43.5V100H36.5Z', DK, 'stroke="' + MG + '" stroke-width=".7"') + L('M40 99V90', MG, 0.7);
    tiers.forEach(function (t, i) {
      const ay = t[0] - (i === 3 ? 0 : 0);
      const d = 'M40 ' + t[0] + 'L' + pt(40 + t[2], t[1]) + 'Q40 ' + N(t[1] - 3) + ' ' + pt(40 - t[2], t[1]) + 'Z';
      o += P(d, i % 2 ? '#1a2044' : DK);
      let scan = '';
      for (let y = ay + 5; y < t[1] - 2; y += 3.2) {
        const hw = t[2] * (y - ay) / (t[1] - ay) - 1.4;
        scan += 'M' + pt(40 - hw, y) + 'H' + N(40 + hw);
      }
      o += L(scan, CY, 0.4, 'stroke-opacity=".35"');
      o += L('M40 ' + t[0] + 'L' + pt(40 - t[2] * 0.45, t[1] - 1.2) + 'M40 ' + t[0] + 'L' + pt(40 + t[2] * 0.45, t[1] - 1.2), MG, 0.55, 'stroke-opacity=".75"');
      o += neon(d, CY, 0.9);
      o += node(40 - t[2], t[1], i % 2 ? AC : MG, 0.85) + node(40 + t[2], t[1], i % 2 ? MG : AC, 0.85);
    });
    o += P('M40 9.5L43 14L40 18.5L37 14Z', '#fff', 'stroke="' + AC + '" stroke-width=".8"') + C(40, 14, 5.5, AC, 'fill-opacity=".2"');
    return o;
  }

  function hexLattice(cx, cy, rx, ry, s, seed, fills, lit) {
    const R = rng(seed);
    const groups = {};
    const centers = [];
    const w = Math.sqrt(3) * s;
    for (let j = 0, y = cy - ry; y <= cy + ry; j++, y += 1.5 * s) {
      for (let x = cx - rx - (j % 2 ? w / 2 : 0); x <= cx + rx; x += w) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        if (dx * dx + dy * dy > 0.92 + R() * 0.18) continue;
        let f = fills[Math.floor(R() * fills.length)];
        if (R() < 0.16) f = lit[Math.floor(R() * lit.length)];
        let d = '';
        for (let k = 0; k < 6; k++) {
          const a = Math.PI / 6 + k * Math.PI / 3;
          d += (k ? 'L' : 'M') + pt(x + Math.cos(a) * s, y + Math.sin(a) * s);
        }
        groups[f] = (groups[f] || '') + d + 'Z';
        centers.push([x, y]);
      }
    }
    let o = '';
    Object.keys(groups).forEach(function (f) { o += P(groups[f], f); });
    return { svg: o, centers: centers };
  }

  function t22() {
    let o = shade(22);
    const trunk = 'M23 100Q33 97 35.4 88L44.6 88Q47 97 57 100Z' + limbs([[40, 100, 40, 60, 11, 8, 0], [37, 68, 20, 50, 5, 2.4, -2], [43, 66, 60, 48, 5, 2.4, 2], [40, 64, 40, 42, 4, 2, 0]]);
    o += P(trunk, DK, 'stroke="' + CY + '" stroke-width="1.3" stroke-linejoin="round"') + P(trunk, DK);
    const hx = hexLattice(40, 33, 32, 23, 4.1, 7, ['#161b37', '#1c2347', '#222b56'], ['#1f7a8c', '#7a2a72', '#5a7a1e']);
    o += '<g stroke="' + CY + '" stroke-width=".55" stroke-opacity=".7" stroke-linejoin="round">' + hx.svg + '</g>';
    o += neon('M35 98V82L31 78V64L22 55V47', CY, 0.8) + neon('M45 98V84L49 80V64L58 55V45', MG, 0.8) + neon('M40 96V44L44 40V24M40 52L34 46V32', AC, 0.75);
    o += L('M23 99H57', CY, 0.6, 'stroke-opacity=".6"');
    o += node(22, 47, CY, 1.2) + node(58, 45, MG, 1.2) + node(44, 24, AC, 1.3) + node(34, 32, AC, 1) + node(31, 64, CY, 0.8) + node(49, 64, MG, 0.8);
    const R = rng(31);
    hx.centers.forEach(function (c) {
      if (R() < 0.12) o += node(c[0], c[1], [CY, MG, AC][Math.floor(R() * 3)], 0.7);
    });
    return o;
  }

  function triLattice(cx, cy, rx, ry, s, seed, fills, lit) {
    const R = rng(seed);
    const groups = {};
    const verts = [];
    const h = s * Math.sqrt(3) / 2;
    for (let j = 0, y = cy - ry; y < cy + ry; j++, y += h) {
      for (let i = -1, x0 = cx - rx - (j % 2 ? s / 2 : 0); x0 < cx + rx; i++, x0 += s) {
        const tris = [[[x0, y + h], [x0 + s, y + h], [x0 + s / 2, y]], [[x0 + s / 2, y], [x0 + s * 1.5, y], [x0 + s, y + h]]];
        tris.forEach(function (t) {
          const mx = (t[0][0] + t[1][0] + t[2][0]) / 3;
          const my = (t[0][1] + t[1][1] + t[2][1]) / 3;
          const dx = (mx - cx) / rx;
          const dy = (my - cy) / ry;
          if (dx * dx + dy * dy > 0.9 + R() * 0.07) return;
          let f = fills[Math.floor(R() * fills.length)];
          if (R() < 0.17) f = lit[Math.floor(R() * lit.length)];
          groups[f] = (groups[f] || '') + 'M' + pt(t[0][0], t[0][1]) + 'L' + pt(t[1][0], t[1][1]) + 'L' + pt(t[2][0], t[2][1]) + 'Z';
          verts.push(t[2]);
        });
      }
    }
    let o = '';
    Object.keys(groups).forEach(function (f) { o += P(groups[f], f); });
    return { svg: o, verts: verts };
  }

  function t28() {
    let o = '<defs>' +
      lg('a1', 0, 0, 0, 1, [[0, '#b38bff', 0], [0.5, '#7bffcf', 0.5], [0.86, '#5dffb0'], [1, '#5dffb0', 0]]) +
      lg('a2', 0, 0, 0, 1, [[0, '#ff6fd0', 0], [0.6, '#ff6fd0', 0.7], [0.9, '#b38bff'], [1, '#b38bff', 0]]) +
      lg('ed', 0, 0, 1, 0, [[0, '#2de2e6'], [0.5, '#7bffb0'], [1, '#ff5fc8']]) + '</defs>';
    o += shade(25);
    function band(y0, amp, th, ph) {
      let top = '';
      let bot = '';
      for (let x = 4; x <= 76; x += 4) {
        const yt = y0 + Math.sin(x * 0.085 + ph) * amp;
        const yb = yt + (th + Math.sin(x * 0.21 + ph * 2) * 2.2) * Math.pow(Math.sin(Math.PI * (x - 4) / 72), 0.6);
        top += (x === 4 ? 'M' : 'L') + pt(x, yt);
        bot = 'L' + pt(x, yb) + bot;
      }
      return top + bot + 'Z';
    }
    o += P(band(10, 5, 15, 0.4), 'url(#a1)', 'fill-opacity=".6"') + P(band(4, 4, 10, 2.2), 'url(#a2)', 'fill-opacity=".5"');
    let rays = '';
    for (let x = 7; x < 75; x += 3.4) rays += 'M' + pt(x, 12 + Math.sin(x * 0.085 + 0.4) * 5) + 'v' + N(9 + Math.sin(x) * 3);
    o += L(rays, '#c8ffe6', 0.6, 'stroke-opacity=".45"');
    const trunk = 'M21 100Q32 96 36 86L44 86Q48 96 59 100Z' + limbs([[40, 100, 40, 58, 10, 7, 0], [37, 66, 18, 46, 4.6, 2, -3], [43, 64, 62, 44, 4.6, 2, 3], [40, 62, 38, 36, 4, 1.8, -1]]);
    o += rimP(trunk, '#191530', 'url(#ed)', 0.7);
    const tl = triLattice(40, 38, 33, 25, 7.2, 12, ['#1a1736', '#221d46', '#2a2456'], ['#22a08e', '#6a4ce0', '#d04aa6', '#3fd08a']);
    o += '<g stroke="url(#ed)" stroke-width=".6" stroke-linejoin="round">' + tl.svg + '</g>';
    o += neon('M40 96V62L36 56V40', '#7bffb0', 0.7) + neon('M37 68L26 57H20', CY, 0.6) + neon('M43 66L54 55H60', '#ff5fc8', 0.6);
    const R = rng(77);
    tl.verts.forEach(function (v) {
      if (R() < 0.1) o += node(v[0], v[1], ['#7bffb0', CY, '#ff5fc8'][Math.floor(R() * 3)], 0.7);
    });
    [[8, 62, '#7bffb0'], [72, 64, '#ff5fc8'], [12, 76, CY], [68, 80, '#7bffb0'], [20, 90, '#ff5fc8'], [62, 92, CY]].forEach(function (p) {
      o += C(p[0], p[1], 1.6, p[2], 'fill-opacity=".3"') + C(p[0], p[1], 0.6, p[2]);
    });
    return o;
  }

  /* ---------- realistic ---------- */
  function bark(id, a, b, c) { return lg(id, 0, 0, 1, 0, [[0, a], [0.45, b], [1, c]]); }

  function t03() {
    const pal = ['#56701c', '#86a028', '#bccd38', '#e6dc54', '#fff4a6'];
    let o = '<defs>' + bark('b', '#9a8674', '#6a5848', '#3c3129') + '</defs>' + shade(13);
    o += P('M35 100Q38.4 97.5 38.3 92L41.7 92Q41.6 97.5 45 100Z' + limbs([[40, 100, 40, 40, 4.4, 1.4, 0], [40, 76, 29, 63, 1.7, 0.7, -1], [40, 68, 52, 55, 1.6, 0.7, 1], [40, 58, 31, 47, 1.2, 0.6, 0], [40, 53, 49, 43, 1.2, 0.6, 0]]), 'url(#b)');
    o += L('M39.2 96C39 88 39.4 80 39.2 70M40.8 90C41 84 40.6 78 40.9 74', '#2e2620', 0.5, 'stroke-opacity=".6"');
    o += canopy([[40, 33, 8], [31.5, 43, 8], [49, 41.5, 8.5], [40, 47.5, 7], [29.5, 56, 7.5], [50.5, 54.5, 7.8], [38, 63.5, 6.6], [47, 66, 5.8]], pal, 3, { mark: fan, ds: 1.7, dabs: 4, dk: 2, rim: 1.3 });
    o += P(fan(31, 99, 1.8, -1.2) + fan(50, 98.6, 1.7, 0.9) + fan(54.5, 100, 1.5, 1.6), '#f2c230', 'stroke="#a8781a" stroke-width=".35"');
    return o;
  }

  function t15() {
    const pal = ['#11301d', '#225a32', '#3f8a3c', '#86bb4c', '#d6eb8c'];
    let o = '<defs>' + bark('b', '#8f6a4c', '#5e4232', '#33231a') + '</defs>' + shade(19);
    o += P('M27 100Q34 97 36 88L44 88Q46 97 54 100Z' + limbs([[40, 100, 40, 64, 10, 7, 0], [38, 72, 22, 48, 5, 2, -3], [42, 70, 58, 46, 5, 2, 3], [40, 66, 41, 36, 4, 1.6, 1], [36, 58, 14, 54, 2.6, 1, -1], [45, 58, 66, 52, 2.6, 1, 1]]), 'url(#b)');
    o += L('M36.5 98C36 90 37 80 36.4 70M40 99C40.4 92 39.6 84 40.3 74M43.5 97C44 90 43 82 43.8 72', '#241810', 0.6, 'stroke-opacity=".55"');
    o += L('M35.6 94C35.5 86 36.4 78 36 70', '#c9a27a', 0.5, 'stroke-opacity=".6"');
    o += canopy([[40, 27, 10], [25, 33, 10], [55, 31, 10.5], [15.5, 46, 7.8], [64.5, 44, 7.8], [29, 47, 9], [51, 46, 9.5], [40, 40, 8]], pal, 15, { dabs: 6, dk: 4, ds: 1.7 });
    return o;
  }

  function t21() {
    const pal = ['#2c5626', '#5d8f3a', '#9ac24e', '#d2e47c', '#f6f8c6'];
    let o = '<defs>' + bark('b', '#ffffff', '#efebe2', '#b8b1a4') + '</defs>' + shade(15);
    const tr = 'M33.5 100Q37.5 98 37 93L42.2 93Q42 98 46.5 100Z' + limbs([[39.6, 100, 41, 18, 5.4, 1.3, -2], [42, 99, 55, 38, 3.2, 1, 1.5]]);
    o += rimP(tr, 'url(#b)', '#4a4743', 0.7);
    o += L('M40.6 48Q34 40 27 34M41 40Q46 32 51 27M53 46Q58 40 61 32M39.6 60Q33 54 24 50', '#4f463e', 0.9);
    let m = '';
    [[94, 2.4], [88, 3], [82, 2], [76, 3.2], [70, 2.2], [64, 2.8], [57, 2], [51, 2.4], [45, 1.6], [38, 1.4]].forEach(function (a, i) {
      const cx = 39.6 + (100 - a[0]) / 82 * 1.4 - (a[0] > 60 ? 1 : 0.5);
      m += 'M' + pt(cx - a[1] / 2 + (i % 2 ? 0.8 : -0.4), a[0]) + 'h' + N(a[1]);
    });
    [[92, 1.6], [84, 2], [76, 1.4], [68, 1.8], [60, 1.4], [52, 1.2]].forEach(function (a) {
      const cx = 42.5 + (99 - a[0]) / 61 * 12.5;
      m += 'M' + pt(cx - a[1] / 2, a[0]) + 'h' + N(a[1]);
    });
    o += L(m, '#24221f', 1.05);
    o += P('M38.4 74l1.8-1.6 1.6 1.6-1.6 1.2z M39.2 58l1.6-1.4 1.4 1.4-1.4 1z', '#24221f');
    o += canopy([[42, 21, 6.6], [32, 27, 6.4], [51.5, 26, 6.6], [24, 38, 5.8], [58, 37, 6.2], [38, 33, 5.6], [47, 41, 5.4], [30, 45, 5], [62, 27, 4.6], [19.5, 30, 4.2]], pal, 21, { dabs: 4, dk: 2, ds: 1.3, rim: 1.2 });
    return o;
  }

  function t24() {
    const pal = ['#143a22', '#2a6a34', '#5c9a3c', '#a6c95a', '#e8f2a0'];
    let o = '<defs>' + lg('b', 0, 0, 1, 0, [[0, '#f0d0b0'], [0.3, '#c7987a'], [0.7, '#93654f'], [1, '#5c3c32']]) +
      rg('g', 0.5, 0.5, 0.5, [[0, '#ffd98a'], [0.6, '#ffd98a', 0.3], [1, '#ffd98a', 0]]) + '</defs>';
    o += C(40, 42, 36, 'url(#g)', 'fill-opacity=".45"');
    o += shade(22);
    const tr = 'M21 100Q28 96 27 86Q23.5 70 29.5 56Q34 47 35 40L45 40Q46 47 50.5 56Q56.5 70 53 86Q52 96 59 100Z' +
      limbs([[37, 44, 15, 27, 5, 1.6, -2], [39, 42, 26, 18, 4.6, 1.4, -1], [40, 42, 40, 12, 4.6, 1.4, 0], [41, 42, 54, 18, 4.6, 1.4, 1], [43, 44, 65, 27, 5, 1.6, 2]]);
    o += rimP(tr, 'url(#b)', '#4a3028', 0.8);
    o += L('M31 96Q27.5 76 33 58M36.5 98Q34.5 76 37.5 50M44 98Q46 76 43 50M49.5 96Q53 76 47.5 58', '#6e4a3c', 0.7, 'stroke-opacity=".7"');
    o += L('M29 92Q26 76 30.5 62M33.6 84Q32 72 35 60', '#fbe4c8', 0.7, 'stroke-opacity=".8"');
    o += canopy([[14.5, 26, 5.6], [26, 18, 6], [40, 12.5, 6.2], [54, 18, 6], [65.5, 26, 5.6], [33, 23.5, 4.4], [47, 23.5, 4.4]], pal, 24, { dabs: 4, dk: 2, ds: 1.3, rim: 1.2 });
    let str = '';
    let pods = '';
    [[20, 31, 6], [31, 27, 8], [50, 27, 7], [61, 31, 5.5]].forEach(function (p) {
      str += 'M' + pt(p[0], p[1]) + 'v' + N(p[2]);
      pods += lump(p[0], p[1] + p[2] + 2, 1.5, 2.4, 6, 0.08, p[0]);
    });
    o += L(str, '#4a3a2a', 0.5) + P(pods, '#efe3c4', 'stroke="#7d6a50" stroke-width=".5"');
    return o;
  }

  function t29() {
    const pal = ['#0f281a', '#1f5130', '#3c8a3e', '#9cc458', '#f6e08a'];
    let o = '<defs>' + bark('b', '#9a7454', '#664632', '#33231a') +
      rg('g', 0.5, 0.5, 0.5, [[0, '#ffe9a6'], [0.55, '#ffe08a', 0.35], [1, '#ffe08a', 0]]) + '</defs>';
    o += C(40, 40, 39, 'url(#g)', 'fill-opacity=".5"');
    o += shade(28, 0.28);
    const tr = 'M8 100Q20 98 27 92Q33 86 34 76L46 76Q47 86 53 92Q60 98 72 100Z' +
      limbs([[40, 100, 40, 58, 16, 11, 0], [36, 64, 16, 42, 7, 2.4, -4], [44, 62, 64, 40, 7, 2.4, 4], [39, 60, 31, 26, 5, 2, -2], [42, 60, 50, 24, 5, 2, 2], [34, 70, 11, 58, 3.6, 1.2, -2], [47, 70, 69, 58, 3.6, 1.2, 2]]);
    o += rimP(tr, 'url(#b)', '#1f150e', 0.9);
    o += L('M33 96C31 88 34 80 32.5 70M38 99C37 90 39 82 37.6 72M43 99C44 90 42 82 43.6 72M48 96C49 88 46.5 80 47.4 70M22 96Q26 92 29 86M58 96Q54 92 51 86', '#1e140d', 0.7, 'stroke-opacity=".6"');
    o += L('M31.5 94C30.5 86 32.6 80 31.6 72M35.4 90C35 84 36.4 80 35.6 74', '#e6c48c', 0.6, 'stroke-opacity=".7"');
    o += E(43, 85, 2.6, 4.6, '#1a100a') + E(42.6, 86, 1.2, 2.4, '#ffcf6a', 'fill-opacity=".7"');
    o += P('M27 99Q32 97 33.5 92Q31 96 25 98Z M51 99Q47.5 97 46 92Q49 96 55 98Z', '#5f8a3a', 'fill-opacity=".8"');
    o += canopy([[40, 18, 11], [24, 24, 11], [56, 22, 11], [13.5, 38, 8], [66.5, 36, 8], [28, 40, 10], [52, 38, 10.5], [40, 31, 9], [19, 52, 6.4], [61, 50, 6.4], [40, 47, 6.6]], pal, 29, { dabs: 3, dk: 1, ds: 2.1, rim: 1.5 });
    [[16, 60, 1], [64, 66, 0.9], [30, 14, 0.8], [52, 10, 0.9], [70, 26, 0.8], [8, 30, 0.8], [24, 72, 0.7], [58, 80, 0.7]].forEach(function (m) {
      o += C(m[0], m[1], m[2] * 2.2, '#ffe9a0', 'fill-opacity=".35"') + C(m[0], m[1], m[2], '#fff3c0');
    });
    return o;
  }

  /* ---------- comic ---------- */
  const INK = '#1d1a17';
  function comicTree(cfg) {
    let o = '<defs><clipPath id="k"><path d="' + cfg.crown + '"/></clipPath></defs>' + shade(cfg.sh || 15);
    o += P(cfg.trunk, cfg.tf, 'stroke="' + INK + '" stroke-width="2.3" stroke-linejoin="round"');
    o += P(cfg.trunkShade, cfg.ts);
    o += P(cfg.crown, cfg.cf);
    o += '<g clip-path="url(#k)">' + C(cfg.shadow[0], cfg.shadow[1], cfg.shadow[2], cfg.cs) + '</g>';
    o += L(cfg.crown, INK, 2.4);
    return o;
  }

  function t06() {
    const crown = cloud(40, 49, 19.5, 17.5, 7);
    let o = comicTree({
      crown: crown, cf: '#7fd35c', cs: '#4cae46', ch: '#c9f59a',
      shadow: [53, 66, 25],
      trunk: 'M34 100Q37.5 95 37 84L36.6 68H43.4L43 84Q42.5 95 46 100Z', tf: '#d99856', ts: '#b07038',
      trunkShade: 'M41 74H43.2L42.9 84Q42.6 94 45 98.8H42Q41.4 92 41.2 84Z'
    });
    o += P('M27 40Q29 32 37 31Q32 34 31 41Q29 44 27 40Z', '#ffffff', 'fill-opacity=".9"');
    o += E(34.5, 52, 1.7, 2.3, INK) + E(45.5, 52, 1.7, 2.3, INK) + C(35.1, 51.1, 0.6, '#fff') + C(46.1, 51.1, 0.6, '#fff');
    o += E(30.5, 56.5, 2.6, 1.4, '#ff8d8a', 'fill-opacity=".75"') + E(49.5, 56.5, 2.6, 1.4, '#ff8d8a', 'fill-opacity=".75"');
    o += L('M37.6 56q2.4 2.4 4.8 0', INK, 1.3);
    o += L('M30 99.5l1.2-3.4 1.2 3.4M48.5 99.5l1.2-3 1.2 3', '#2f7a3a', 1.2);
    return o;
  }

  function t12() {
    const crown = cloud(40, 46, 25, 20, 9);
    let o = comicTree({
      crown: crown, cf: '#4fbf5c', cs: '#2f9a4a', ch: '#a6e87f', sh: 17,
      shadow: [56, 66, 28],
      trunk: 'M33 100Q37 95 36.6 86L36 64H44L43.4 86Q43 95 47 100Z', tf: '#a8673a', ts: '#7d4826',
      trunkShade: 'M41.4 70H43.8L43.4 86Q43 94 46 98.8H43Q41.8 92 41.6 86Z'
    });
    o += L('M38.5 72Q34 66 30 64M41.5 70Q46 64 51 63', INK, 2.2);
    o += P('M22 36Q25 28 33 26.5Q28 30 27 37Q24 40 22 36Z', '#e4ffc8', 'fill-opacity=".9"');
    [[29, 44], [42, 36], [53, 46], [34, 55], [48, 58], [57, 34], [22, 54]].forEach(function (a) {
      o += C(a[0], a[1], 3.2, '#ef3e36', 'stroke="' + INK + '" stroke-width="1.5"') + C(a[0] - 1.1, a[1] - 1, 0.9, '#ffd0c8');
      o += L('M' + pt(a[0], a[1] - 3) + 'l.6-1.6', INK, 0.9);
    });
    o += C(55, 97, 3, '#ef3e36', 'stroke="' + INK + '" stroke-width="1.5"') + C(53.9, 96, 0.9, '#ffd0c8') + P('M55.4 94q1.8-2.2 3.6-.6q-1.8 1.6-3.6.6z', '#4fbf5c', 'stroke="' + INK + '" stroke-width=".8"');
    return o;
  }

  /* ---------- manga ---------- */
  const MK = '#141414';
  const TONE = '<pattern id="tn" width="2.3" height="2.3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="1.15" cy="1.15" r=".52" fill="' + MK + '"/></pattern>' +
    '<pattern id="tl" width="2.1" height="2.1" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="1.05" cy="1.05" r=".36" fill="' + MK + '"/></pattern>' +
    '<pattern id="td" width="2.3" height="2.3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="1.15" cy="1.15" r=".92" fill="' + MK + '"/></pattern>';

  function pineTier(ay, by, hw) {
    let d = 'M40 ' + ay;
    for (let k = 1; k <= 3; k++) {
      const t = k / 4;
      d += 'L' + pt(40 + hw * t + 0.6, ay + (by - ay) * t + 0.4);
    }
    d += 'L' + pt(40 + hw, by);
    const n = Math.max(4, Math.round(hw / 3.4));
    for (let i = 1; i <= n; i++) {
      const x = 40 + hw - 2 * hw * i / n;
      const xm = 40 + hw - 2 * hw * (i - 0.5) / n;
      d += 'L' + pt(xm, by - 3.2) + 'L' + pt(x, by + (i % 2 ? 0.8 : 0));
    }
    for (let k = 3; k >= 1; k--) {
      const t = k / 4;
      d += 'L' + pt(40 - hw * t - 0.6, ay + (by - ay) * t + 0.4);
    }
    return d + 'Z';
  }

  function t16() {
    const tiers = [[56, 90, 27], [41, 73, 22], [28, 57, 17], [16, 42, 11.5]];
    let o = '<defs>' + TONE;
    tiers.forEach(function (t, i) { o += '<clipPath id="c' + i + '"><path d="' + pineTier(t[0], t[1], t[2]) + '"/></clipPath>'; });
    o += '</defs>' + shade(18, 0.3);
    o += P('M36.5 86H43.5V100H36.5Z', MK) + L('M38.2 90V99', '#fff', 0.8);
    tiers.forEach(function (t, i) {
      const d = pineTier(t[0], t[1], t[2]);
      o += P(d, '#fbfaf6');
      o += '<g clip-path="url(#c' + i + ')">' + P('M40 ' + (t[0] - 2) + 'L' + pt(40 + t[2] + 3, t[1] + 3) + 'L40 ' + N(t[1] + 3) + 'Z', 'url(#tn)');
      if (i < 3) o += P(pineTier(tiers[i + 1][0], tiers[i + 1][1], tiers[i + 1][2]), 'url(#td)', 'transform="translate(1.6 3.6)"');
      o += P('M' + pt(40 + t[2] * 0.25, t[1] - 3) + 'L' + pt(40 + t[2] + 2, t[1] - 3) + 'L' + pt(40 + t[2] + 2, t[1] + 2) + 'L' + pt(40 + t[2] * 0.25, t[1] + 2) + 'Z', 'url(#td)') + '</g>';
      o += L(d, MK, 1.5);
      o += L('M' + pt(40 - t[2] * 0.42, t[0] + (t[1] - t[0]) * 0.55) + 'l-2.6 3.2M' + pt(40 - t[2] * 0.62, t[0] + (t[1] - t[0]) * 0.8) + 'l-2.4 2.8', MK, 1.1);
    });
    o += L('M60 30q7-1.6 14 .6M63 35q5-1 10 .4M8 62q5-1.4 10 0M6 67q4-1 8 .2', MK, 0.8);
    o += L('M24 100H56', MK, 1.2);
    return o;
  }

  function t25() {
    const PK = '#ff5c96';
    let o = '<defs>' + TONE + '</defs>' + shade(22, 0.3);
    const night = [[40, 24, 13], [22, 32, 11], [58, 30, 11], [14, 46, 7], [66, 46, 7], [30, 46, 9], [50, 44, 9]];
    let nd = '';
    night.forEach(function (c, i) { nd += lump(c[0], c[1], c[2], c[2] * 0.88, 9, 0.24, 250 + i * 7); });
    o += P(nd, '#1c1b26');
    const tr = 'M28 100Q35 97 36 88L43 88Q45 97 52 100Z' + limbs([[40, 100, 38, 58, 9, 5, -2], [38, 66, 18, 44, 4, 1.2, -3], [39, 62, 58, 40, 4, 1.2, 3], [38, 60, 37, 30, 3, 1, 1], [41, 72, 64, 62, 2.6, 0.9, 2]]);
    o += P(tr, '#16151a');
    o += L('M36.4 96Q34.6 80 36.6 64M35 90Q33.6 84 34.2 78', '#ffffff', 0.7);
    const bl = [[38, 20, 8], [24, 30, 7.5], [54, 26, 8], [16, 44, 5], [64, 42, 5], [32, 42, 6.5], [48, 40, 6.5], [44, 30, 6], [28, 18, 5], [60, 16, 4.6]];
    let bd = '';
    let tone = '';
    bl.forEach(function (c, i) {
      bd += lump(c[0], c[1], c[2], c[2] * 0.85, 8, 0.3, 300 + i * 5);
      tone += lump(c[0] + c[2] * 0.25, c[1] + c[2] * 0.4, c[2] * 0.52, c[2] * 0.3, 7, 0.2, 340 + i * 5);
    });
    o += P(bd, '#fbf7f8', 'stroke="#16151a" stroke-width="1"');
    o += P(tone, 'url(#tl)');
    const R = rng(25);
    let pk = '';
    bl.forEach(function (c) {
      for (let k = 0; k < 3; k++) {
        const a = R() * 6.28;
        const rr = c[2] * (0.2 + R() * 0.5);
        pk += 'M' + pt(c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr) + 'h0';
      }
    });
    o += L(pk, PK, 1.9);
    let pet = '';
    [[8, 58], [70, 56], [12, 74], [66, 80], [22, 88], [58, 92], [74, 68], [6, 86], [30, 66]].forEach(function (p, i) { pet += dab(p[0], p[1], 1.4, i * 0.9); });
    o += P(pet, PK, 'stroke="#16151a" stroke-width=".4"');
    o += L('M10 64l5-3M64 86l5-3M70 62l4-2.4M16 80l4-2.4', MK, 0.6);
    [[64, 62, 68], [17, 49, 56]].forEach(function (l) {
      o += L('M' + pt(l[0], l[1]) + 'V' + N(l[2] - 4.6), MK, 0.6);
      o += C(l[0], l[2], 7, PK, 'fill-opacity=".22"');
      o += E(l[0], l[2], 3.6, 4.6, PK, 'stroke="' + MK + '" stroke-width=".9"');
      o += L('M' + pt(l[0] - 3.4, l[2] - 1.5) + 'H' + N(l[0] + 3.4) + 'M' + pt(l[0] - 3.4, l[2] + 1.5) + 'H' + N(l[0] + 3.4) + 'M' + pt(l[0], l[2] - 4.6) + 'V' + N(l[2] + 4.6), MK, 0.5);
      o += P('M' + pt(l[0] - 2, l[2] - 5.6) + 'h4v1.4h-4z M' + pt(l[0] - 2, l[2] + 4.2) + 'h4v1.4h-4z', MK);
      o += E(l[0] - 1.4, l[2] - 1.2, 0.8, 1.6, '#ffffff', 'fill-opacity=".85"');
    });
    return o;
  }

  /* ---------- sketch / ink ---------- */
  const GR = '#3c3b38';
  function hatch(cx, cy, n, len, gap, ang) {
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    let d = '';
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * gap;
      const x = cx - s * off;
      const y = cy + c * off;
      const l = len * (0.7 + 0.3 * Math.sin(i * 2.1 + cx));
      d += 'M' + pt(x - c * l / 2, y - s * l / 2) + 'L' + pt(x + c * l / 2, y + s * l / 2);
    }
    return d;
  }

  function t04() {
    const cl = [[40, 34, 11], [33, 28, 7], [29, 44, 9.6], [51, 42, 10], [40, 53, 9]];
    let crown = '';
    cl.forEach(function (c, i) { crown += lump(c[0], c[1], c[2], c[2] * 0.9, 8, 0.32, 40 + i * 3); });
    let h1 = '';
    let h2 = '';
    const R = rng(4);
    for (let c = 84; c < 128; c += 2 + R() * 0.8) {
      const a = 22 + R() * 6;
      h1 += 'M' + pt(c - 68 + R() * 4, 68 - R() * 4) + 'L' + pt(c - a, a);
    }
    for (let k = -34; k < 14; k += 2.3 + R() * 0.9) h2 += 'M' + pt((k + 100) / 2 + R() * 3, (100 - k) / 2) + 'L' + pt(62 - R() * 4, 62 - k - R() * 4);
    let o = '<defs><clipPath id="c"><path d="' + crown + '"/></clipPath></defs>' + shade(13, 0.18);
    o += P('M38 100C38 86 38.6 72 39.2 56L41.2 56C41.6 72 42 86 42.6 100Z', '#fbf9f4');
    o += L('M39.6 62Q34 56 31 50M40.8 60Q46 54 50 49', GR, 1.15);
    o += rimP(crown, '#dce7cb', GR, 1.2);
    o += '<g clip-path="url(#c)">' + L(h1, '#77756f', 1.1) + L(h2, '#5f5d58', 1.1) + '</g>';
    o += L(lump(40.6, 43.4, 19, 18, 11, 0.22, 7), '#8f8d86', 0.7, 'stroke-dasharray="9 5"');
    o += L('M38 100C38 86 38.6 72 39.2 61M42.6 100C42 86 41.6 72 41.3 61', GR, 1.25);
    o += L('M38.5 92h2.6M39.4 86h2.4M38.6 79h1.8M40 73h1.8M38.8 67h2.2', '#1f1e1c', 1.2);
    o += L('M41.6 96l1-2M41.4 88l.9-2M41.2 80l.9-2', '#5d5b56', 0.9);
    o += L('M27 100.2q6-1.4 12-.2t13 0M30 99l-.8-2.4M50 99.4l.8-2.2', GR, 1);
    return o;
  }

  function t05() {
    let o = shade(14, 0.18);
    o += P('M13 76Q13 36 40 31Q67 36 67 76Q60 71 54 79Q46 73 40 81Q33 73 26 79Q20 71 13 76Z', '#e2e9d4');
    o += P('M34.5 100Q38 92 37.4 80Q37 66 39.6 56L43 56Q41.6 68 42.6 80Q43 92 46.5 100Z', '#f3efe6');
    o += L('M34.5 100Q38 92 37.4 80Q37 66 39.6 56M43 56Q41.6 68 42.6 80Q43 92 46.5 100', GR, 1.25);
    o += L('M41.2 94q.8-1 1-2.6M41 86q.6-1 .8-2.4M41.2 76q.4-1 .6-2.2M40.8 68q.4-1 .5-2', '#5d5b56', 1);
    o += L('M40 58Q31 40 18 43M41.6 57Q50 38 62 43M40.6 57Q40.4 42 38 33', GR, 1.2);
    const R = rng(5);
    let a = '';
    let b = '';
    let ticks = '';
    for (let i = 0; i < 17; i++) {
      const u = i / 16;
      const sx = 15 + u * 50;
      const sy = 44 - Math.sin(u * Math.PI) * 12 + R() * 2;
      const ey = 64 + Math.sin(u * Math.PI) * 18 + R() * 4;
      const ex = sx + (u - 0.5) * 6 + (R() - 0.5) * 3;
      const d = 'M' + pt(sx, sy) + 'C' + pt(sx + (u - 0.5) * 8, sy - 4) + ' ' + pt(ex, ey - 16) + ' ' + pt(ex, ey);
      if (i % 2) a += d; else b += d;
      for (let t = 0.35; t < 1; t += 0.2) {
        const x = sx + (ex - sx) * t + (u - 0.5) * 2;
        const y = sy + (ey - sy) * t;
        ticks += 'M' + pt(x, y) + 'l' + (i % 2 ? '1.3 1.6' : '-1.3 1.6');
      }
    }
    o += L(b, '#6f8f58', 1.2) + L(a, GR, 1.1) + L(ticks, '#58744a', 1);
    o += L('M28 100.3q6-1.2 12 0t12-.2', GR, 1);
    return o;
  }

  function t18() {
    let o = '<defs>' + lg('w', 0, 0, 0, 1, [[0, '#1f1f1f', 0.95], [0.45, '#5b5c59', 0.8], [1, '#b8b8b2', 0.55]]) + '</defs>' + shade(19, 0.22);
    const pads = [[18, 60, 12, 6], [62, 50, 11, 5.6], [24, 37, 10.5, 5.4], [44, 26, 13, 6.6], [55, 37, 7, 3.8]];
    let soft = '';
    pads.forEach(function (p, i) { soft += lump(p[0] + 1, p[1] + 1.4, p[2] * 1.18, p[3] * 1.3, 9, 0.3, 180 + i); });
    o += P(soft, '#7f807b', 'fill-opacity=".28"');
    const tr = limbs([[42, 88, 34, 72, 7, 5, -3], [34, 72, 46, 56, 5, 3.6, 3], [46, 56, 36, 40, 3.6, 2.2, -3], [36, 40, 43, 27, 2.2, 1.1, 2], [35, 70, 19, 62, 2.6, 1, 1], [45, 58, 61, 51, 2.4, 1, -1], [38, 44, 25, 38, 1.6, 0.8, 0]]);
    o += P(tr, '#1b1a19');
    o += L('M40 86Q35 80 35.6 73M37 70Q41 64 44 58M43 54Q39 48 37.4 42', '#9a9893', 0.55, 'stroke-opacity=".9"');
    let pd = '';
    pads.forEach(function (p, i) { pd += lump(p[0], p[1], p[2], p[3], 10, 0.26, 200 + i * 3); });
    o += P(pd, 'url(#w)');
    const R = rng(18);
    let dots = '';
    pads.forEach(function (p) {
      for (let k = 0; k < 7; k++) {
        const x = p[0] + (R() - 0.5) * p[2] * 1.6;
        dots += 'M' + pt(x, p[1] - p[3] * (0.55 + R() * 0.4) * Math.sqrt(1 - Math.pow((x - p[0]) / p[2], 2))) + 'h0';
      }
    });
    o += L(dots, '#0f0f0f', 1.4);
    o += P('M17 86.5H63V89.6H17Z', '#2a2927') + P('M19.5 89.6H60.5L57.5 97H22.5Z', '#4b4a47') + L('M21 91.6H59', '#8f8e89', 0.6);
    o += P('M24 97H29V99.6H24Z M51 97H56V99.6H51Z', '#2a2927');
    o += L('M22 86.2q3-1.4 6 0t6 0M46 86.2q3-1.4 6 0t6 0', '#3a3a36', 0.9);
    o += P('M37.4 90.8H42.6V95.8H37.4Z', '#c23a2e') + L('M38.6 92.2h2.8M38.6 93.4h1.6M40.6 93.4v1.4M38.6 94.6h2.8', '#f6eee0', 0.45);
    return o;
  }

  /* ---------- abstract ---------- */
  function t07() {
    let o = shade(14);
    o += P('M38.4 58H41.6V100H38.4Z', '#1d1d1b');
    o += C(42, 45, 15.5, '#e7b13c');
    o += C(28, 37, 9.5, '#e1664a', 'fill-opacity=".92"');
    o += P('M41 26A11 11 0 0 1 63 26Z', '#26355f');
    o += P('M42 45m-15.5 0a15.5 15.5 0 0 0 31 0Z', '#d1932c') + C(50, 38, 4.4, '#2f8f88');
    o += C(55, 56, 3.6, '#1d1d1b');
    o += L('M28 60A6 6 0 1 1 28.1 60', '#1d1d1b', 1.2);
    o += L('M18 52L60 30', '#1d1d1b', 0.9);
    o += P('M48 66H54V72H48Z', '#e1664a');
    o += P('M30 100H50V101.6H30Z', '#1d1d1b');
    return o;
  }

  function t08() {
    let o = shade(15);
    o += P('M37 84H43V100H37Z', '#2b2b2b');
    [[56, 88, 24, '#3a8f7c', '#1f5f58'], [40, 70, 19, '#e7b13c', '#c27d2a'], [24, 52, 14, '#e8664a', '#b2433a']].forEach(function (t) {
      o += P('M40 ' + t[0] + 'L' + pt(40 - t[2], t[1]) + 'H40Z', t[3]);
      o += P('M40 ' + t[0] + 'L' + pt(40 + t[2], t[1]) + 'H40Z', t[4]);
    });
    o += C(60, 30, 4.2, '#26355f');
    o += L('M14 92H66', '#2b2b2b', 0.9);
    o += C(24, 76, 1.8, '#f4ead4') + C(48, 60, 1.4, '#f4ead4');
    return o;
  }

  function sparkle(x, y, r) {
    return 'M' + pt(x, y - r) + 'Q' + pt(x, y) + ' ' + pt(x + r, y) + 'Q' + pt(x, y) + ' ' + pt(x, y + r) + 'Q' + pt(x, y) + ' ' + pt(x - r, y) + 'Q' + pt(x, y) + ' ' + pt(x, y - r) + 'Z';
  }
  function t17() {
    let o = shade(17);
    o += P('M37.8 60H42.2V100H37.8Z', '#1f2a5a');
    o += C(40, 40, 23, '#1f2a5a');
    o += P('M17 40A23 23 0 0 0 63 40Z', '#2b3c7a');
    o += C(60, 20, 6, '#e9b949') + C(63, 17.5, 5, '#1f2a5a');
    o += P('M34 100A6 6 0 0 1 46 100Z', '#e9b949');
    o += L('M40 99V62', '#e9b949', 0.7);
    const lines = 'M40 58L40 47L30 37L24 29M30 37L21 43M40 47L50 35L56 27M50 35L60 43M40 47L40 31L40 22M40 31L33 25M40 31L47 25';
    o += L(lines, '#f3e9c6', 0.75);
    [[40, 58, 1.2], [40, 47, 1.5], [30, 37, 1.3], [21, 43, 1.1], [50, 35, 1.3], [60, 43, 1.1], [40, 31, 1.3], [33, 25, 1], [47, 25, 1]].forEach(function (s) {
      o += C(s[0], s[1], s[2] * 2, '#f2c14e', 'fill-opacity=".25"') + C(s[0], s[1], s[2], '#f2c14e');
    });
    o += P(sparkle(24, 29, 3.4) + sparkle(56, 27, 3.4) + sparkle(40, 22, 4.2), '#fff4cf');
    o += L('M27 50h0M52 52h0M34 54h0M46 18h0M22 36h0M58 36h0M30 23h0', '#fff', 1, 'stroke-opacity=".8"');
    return o;
  }

  function t26() {
    const segs = [];
    const tips = [];
    const R = rng(26);
    function walk(x, y, len, ang, d) {
      const x2 = x + Math.sin(ang) * len;
      const y2 = y - Math.cos(ang) * len;
      (segs[d] = segs[d] || []).push([x, y, x2, y2]);
      if (d === 7) { tips.push([x2, y2]); return; }
      const j = (R() - 0.5) * 0.16;
      walk(x2, y2, len * 0.76, ang - 0.47 + j, d + 1);
      walk(x2, y2, len * 0.73, ang + 0.42 + j, d + 1);
    }
    walk(40, 100, 23, 0, 0);
    let mx = 0;
    let my = 100;
    tips.forEach(function (t) { mx = Math.max(mx, Math.abs(t[0] - 40)); my = Math.min(my, t[1]); });
    const kx = Math.min(1, 31 / mx);
    const ky = Math.min(1, 88 / (100 - my));
    function X(x) { return 40 + (x - 40) * kx; }
    function Y(y) { return 100 - (100 - y) * ky; }
    const cols = ['#22304f', '#26405e', '#2b546c', '#2f6a74', '#3a8a7a', '#5aa874', '#8cc152', '#b8cc50'];
    let o = shade(20);
    o += C(40, 46, 27, '#f2c14e', 'fill-opacity=".2"');
    segs.forEach(function (s, d) {
      let p = '';
      s.forEach(function (g) { p += 'M' + pt(X(g[0]), Y(g[1])) + 'L' + pt(X(g[2]), Y(g[3])); });
      o += L(p, cols[d], N(Math.max(0.8, 5.2 - d * 0.62)));
    });
    const lc = ['#e8673c', '#f2c14e', '#2f8f88', '#e8673c', '#f2c14e', '#7a5cc8'];
    const groups = {};
    tips.forEach(function (t, i) {
      const c = lc[(i * 7 + Math.floor(X(t[0]) / 9)) % lc.length];
      groups[c] = (groups[c] || '') + 'M' + pt(X(t[0]), Y(t[1])) + 'h0';
    });
    Object.keys(groups).forEach(function (c) { o += L(groups[c], c, 3.4); });
    o += L('M28 100.4H52', '#22304f', 1.4);
    return o;
  }

  /* ---------- papercut ---------- */
  function t09() {
    const CR = '#f7f0dc';
    function tier(ay, by, hw) {
      const n = Math.max(3, Math.round(hw / 5));
      const w = 2 * hw / n;
      let d = 'M40 ' + ay + 'L' + pt(40 + hw, by);
      for (let i = 0; i < n; i++) d += 'a' + N(w / 2) + ' ' + N(w / 2.6) + ' 0 0 1 -' + N(w) + ' 0';
      return d + 'Z';
    }
    let o = shade(15);
    o += P('M36.6 84H43.4V100H36.6Z', '#173226', 'fill-opacity=".3" transform="translate(1.2 1.4)"');
    o += P('M36.6 84H43.4V100H36.6Z', '#b07a48', 'stroke="' + CR + '" stroke-width="1.6"');
    o += P('M40 84H43.4V100H40Z', '#8e5e36');
    [[54, 86, 25, '#2e7a4f', '#3f9460'], [39, 70, 20, '#4c9c5f', '#68b471'], [24, 55, 14.5, '#7bbf6e', '#9fd48a']].forEach(function (t, i) {
      const d = tier(t[0], t[1], t[2]);
      o += P(d, '#173226', 'fill-opacity=".35" transform="translate(1.4 2)"');
      o += P(d, t[3], 'stroke="' + CR + '" stroke-width="2" stroke-linejoin="round"');
      o += P('M40 ' + N(t[0] + 4) + 'L' + pt(40 - t[2] * 0.72, t[1] - 3) + 'H40Z', t[4]);
      let cut = '';
      const y = t[1] - 7 + (i === 2 ? 1 : 0);
      for (let k = -2; k <= 2; k++) {
        const x = 40 + k * 6;
        if (Math.abs(k * 6) > t[2] * (y - t[0]) / (t[1] - t[0]) - 4) continue;
        cut += 'M' + pt(x, y - 2) + 'l1.6 2-1.6 2-1.6-2z';
      }
      cut += 'M' + pt(40 - 1.2, t[0] + (t[1] - t[0]) * 0.45) + 'a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0z';
      o += P(cut, CR);
    });
    o += L('M24 100.6h32', '#8e5e36', 0.9);
    return o;
  }

  /* ---------- botanical ---------- */
  function t10() {
    function leaf(x, y, len, w, ang, fill) {
      return '<g transform="translate(' + pt(x, y) + ') rotate(' + ang + ')">' +
        P('M0 0C' + pt(len * 0.3, -w) + ' ' + pt(len * 0.78, -w * 0.75) + ' ' + N(len) + ' 0C' + pt(len * 0.78, w * 0.75) + ' ' + pt(len * 0.3, w) + ' 0 0Z', fill, 'stroke="#2c4426" stroke-width=".7"') +
        L('M0 0L' + N(len * 0.94) + ' 0M' + N(len * 0.25) + ' 0l' + pt(len * 0.14, -w * 0.62) + 'M' + N(len * 0.5) + ' 0l' + pt(len * 0.13, -w * 0.55) + 'M' + N(len * 0.25) + ' 0l' + pt(len * 0.14, w * 0.62) + 'M' + N(len * 0.5) + ' 0l' + pt(len * 0.13, w * 0.55), '#2c4426', 0.45) + '</g>';
    }
    let o = shade(13, 0.2);
    o += L('M40 100C40.6 86 39.4 70 40.6 56C41.4 46 40.8 36 41.2 27', '#4a5a32', 1.3);
    o += L('M40 100l-3.4 1.2M40 100l3 1.4M40.2 99.6l-1.6 1.8', '#6b5a3e', 0.6);
    const L1 = [[40.1, 88, 15, 4.6, 205, '#7fa564'], [40.2, 80, 14, 4.4, -25, '#93b872'], [40.4, 71, 13, 4.2, 200, '#8bb26a'], [40.7, 62, 12.5, 4, -28, '#c9a94a'], [40.8, 53, 11, 3.6, 205, '#93b872'], [41, 45, 10, 3.3, -30, '#7fa564'], [41, 37, 8.5, 2.9, 210, '#9bbe76'], [41.2, 31, 7, 2.5, -40, '#a6c77e']];
    L1.forEach(function (l) { o += leaf(l[0], l[1], l[2], l[3], l[4], l[5]); });
    o += P('M41.2 27C39.6 24 40.4 21 41.6 19.6C43 21.4 43 24.4 41.2 27Z', '#b9d38c', 'stroke="#2c4426" stroke-width=".6"');
    o += P('M33 66.5L48 62.4L48.9 65.6L33.9 69.7Z', '#f6eedb', 'fill-opacity=".9" stroke="#cbbd98" stroke-width=".35"');
    o += P('M28 44.6L36 43L36.5 45.6L28.5 47.2Z', '#f6eedb', 'fill-opacity=".9" stroke="#cbbd98" stroke-width=".35"');
    o += L('M41 76Q50 80 53 85', '#8a7a5a', 0.5);
    o += P('M51 84.5L66 82L68 94L53 96.5Z', '#f8f2e1', 'stroke="#8a7a5a" stroke-width=".6"');
    o += C(53.4, 86.3, 0.8, '#d7c9a6', 'stroke="#8a7a5a" stroke-width=".35"');
    o += L('M55.6 88.4l9-1.5M56 91l7.6-1.3M56.4 93.6l5-.8', '#3d3a33', 0.6);
    o += L('M55.4 85.6l3-.5', '#b0453a', 0.8);
    return o;
  }

  /* ---------- ukiyo-e ---------- */
  const UK = '#1e2622';
  function pad(cx, cy, w, h, n) {
    const x0 = cx - w / 2;
    const x1 = cx + w / 2;
    let d = 'M' + pt(x0, cy) + 'Q' + pt(cx, cy + h * 0.28) + ' ' + pt(x1, cy);
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      const tm = (i - 0.5) / n;
      d += 'Q' + pt(x1 - w * tm, cy - h * (Math.sin(Math.PI * tm) * 0.75 + 0.55)) + ' ' + pt(x1 - w * t, cy - h * Math.sin(Math.PI * t) * 0.75);
    }
    return d + 'Z';
  }
  function needles(cx, cy, w, h, n) {
    let d = '';
    const m = Math.round(w / 1.25);
    for (let i = 1; i < m; i++) {
      const t = i / m;
      const x = cx + w / 2 - w * t;
      const k = (t * n) % 1;
      const top = cy - h * (Math.sin(Math.PI * t) * 0.75 + 0.27 * (1 - Math.pow(2 * k - 1, 2))) + 1.1;
      const lean = (x - cx) / w * 1.6;
      d += 'M' + pt(x, top) + 'l' + pt(lean, 2.6);
    }
    return d;
  }
  function ukiyoPine(tr, pads, gid, nc) {
    let o = rimP(tr, 'url(#tk)', UK, 0.9);
    o += L('M' + pads.trunkMarks, UK, 0.6, 'stroke-opacity=".7"');
    let pd = '';
    let nd = '';
    pads.list.forEach(function (p) {
      const n = Math.max(3, Math.round(p[2] / 6));
      pd += pad(p[0], p[1], p[2], p[3], n);
      nd += needles(p[0], p[1], p[2], p[3], n);
    });
    o += P(pd, 'url(#' + gid + ')', 'stroke="' + UK + '" stroke-width=".9" stroke-linejoin="round"');
    o += L(nd, nc || '#cfe8d6', 0.5, 'stroke-opacity=".75"');
    return o;
  }
  function seal(x, y) {
    return P('M' + pt(x, y) + 'h6v8h-6z', '#c4372f') + L('M' + pt(x + 1.2, y + 1.6) + 'h3.6M' + pt(x + 1.2, y + 3.6) + 'h2.4M' + pt(x + 3, y + 3.6) + 'v2.6M' + pt(x + 1.2, y + 6.4) + 'h3.6', '#f7efe0', 0.5);
  }

  function t19() {
    let o = '<defs>' + lg('tk', 0, 0, 1, 0, [[0, '#c27a4e'], [1, '#6e3424']]) + lg('pg', 0, 0, 0, 1, [[0, '#173f3c'], [0.55, '#2f6a5c'], [1, '#79b08e']]) + '</defs>';
    o += shade(17);
    const tr = 'M34 100Q39.5 97.5 40 93L45.4 93Q46 97.5 51 100Z' + limbs([[44, 100, 38, 78, 6.4, 5, 2], [38, 78, 46, 58, 5, 4, -3], [46, 58, 35, 42, 4, 3, -2], [35, 42, 40, 27, 3, 1.6, 2], [40, 68, 61, 60, 2.6, 1.2, -2], [38, 75, 19, 69, 2.4, 1, 2], [37, 47, 21, 42, 2, 1, 1]]);
    o += ukiyoPine(tr, {
      trunkMarks: '41 95q1.4-1 2.6 0M39 86q1.4-1 2.6 0M40 76q1.4-1 2.6 0M42 66q1.4-1 2.6 0M40 54q1.2-1 2.2 0',
      list: [[22, 70, 20, 8], [62, 61, 20, 8.4], [24, 45, 22, 9], [52, 38, 22, 9], [39, 28, 18, 8.4]]
    }, 'pg');
    o += seal(62, 82);
    return o;
  }

  function t30() {
    let o = '<defs>' + lg('tk', 0, 0, 1, 0, [[0, '#a8603e'], [1, '#5a2a1c']]) + lg('pg', 0, 0, 0, 1, [[0, '#0f2a3e'], [0.55, '#25505e'], [1, '#5f9488']]) +
      rg('m', 0.42, 0.4, 0.62, [[0, '#fffbe8'], [0.7, '#f8e6a8'], [1, '#eccf80']]) +
      lg('cl', 0, 0, 1, 0, [[0, '#f0b4ae', 0], [0.3, '#f0b4ae', 0.9], [0.8, '#f6d0c4', 0.9], [1, '#f6d0c4', 0]]) + '</defs>';
    o += C(54, 28, 26, '#fff2c4', 'fill-opacity=".3"');
    o += C(54, 28, 19, 'url(#m)', 'stroke="' + UK + '" stroke-width=".9"');
    o += P('M30 40h40a3 3 0 0 1 0 6h-40a3 3 0 0 1 0-6z M8 22h30a2.6 2.6 0 0 1 0 5.2h-30a2.6 2.6 0 0 1 0-5.2z', 'url(#cl)');
    o += shade(26, 0.28);
    const tr = 'M29 100Q37 97.5 38.6 92L46.4 92Q47.5 97.5 55 100Z' + limbs([[43, 100, 34, 76, 8.4, 6.5, 3], [34, 76, 46, 54, 6.5, 5, -4], [46, 54, 36, 34, 5, 3.5, -3], [36, 34, 42, 15, 3.5, 1.6, 3], [44, 60, 67, 50, 3.4, 1.4, -3], [36, 80, 13, 72, 3, 1.2, 3], [38, 40, 16, 34, 2.6, 1, 2], [40, 28, 58, 22, 2, 1, -1]]);
    o += ukiyoPine(tr, {
      trunkMarks: '40 96q1.6-1 3 0M37 86q1.6-1 3 0M38 76q1.6-1 3 0M42 64q1.4-1 2.6 0M40 50q1.4-1 2.6 0M38 40q1.2-1 2.2 0',
      list: [[15, 73, 20, 8], [66, 51, 20, 8.6], [18, 36, 22, 9.4], [58, 24, 20, 8.6], [40, 16, 22, 9], [46, 45, 18, 7.6], [29, 59, 18, 7.4]]
    }, 'pg');
    o += seal(66, 82);
    return o;
  }

  /* ---------- stained glass ---------- */
  const LEAD = '#262220';

  function t20() {
    const crown = cloud(40, 45, 20.5, 18.5, 7);
    const pal = ['#d4e86e', '#9ccf45', '#5fbe5a', '#25a06c', '#1d8262', '#176452'];
    const acc = ['#f2b233', '#d23c4f', '#2f6db5', '#f2b233'];
    let o = shade(17);
    o += P('M33.5 100L37.6 66H40V100Z', '#e0a34a') + P('M40 66H42.4L46.5 100H40Z', '#9a5a2a');
    o += L('M33.5 100L37.6 66H42.4L46.5 100ZM40 66V100M35.6 84H44.4', LEAD, 1.3);
    o += stainedCrown('g', crown, [14, 20, 66, 70], 7, 20, function (x, y, R) {
      if (R() < 0.11) return acc[Math.floor(R() * acc.length)];
      const t = ((x - 14) / 52 * 0.45 + (y - 20) / 50 * 0.55) * pal.length + (R() - 0.5) * 1.6;
      return pal[Math.max(0, Math.min(pal.length - 1, Math.floor(t)))];
    }, 'M40 72V56M40 63L30 52M40 60L50.5 49M40 56V44');
    o += L('M24 34l3-5M28.4 27.6l1.2-1.6', '#ffffff', 1, 'stroke-opacity=".85"');
    return o;
  }

  function t27() {
    let o = '<defs>' + rg('gl', 0.5, 0.5, 0.5, [[0, '#ffe6a0'], [0.6, '#ffe6a0', 0.3], [1, '#ffe6a0', 0]]) + '</defs>';
    o += E(40, 46, 38, 44, 'url(#gl)', 'fill-opacity=".5"');
    o += shade(21);
    o += P('M28 100L36 76H40V100Z', '#e0a34a') + P('M40 76H44L52 100H40Z', '#9a5a2a') + P('M23 100Q30 98 33 90L35.6 92L31.6 100Z', '#c4823a') + P('M57 100Q50 98 47 90L44.4 92L48.4 100Z', '#7a4420');
    o += L('M28 100L36 76H44L52 100M40 76V100M33.2 88H46.8M23 100Q30 98 33 90M57 100Q50 98 47 90', LEAD, 1.3);
    const crown = cloud(40, 45, 23, 30, 10);
    const ring = ['#fff0a0', '#ffd860', '#a8d84a', '#4cbf6a', '#1f9a6a', '#22a39a', '#2f6db5', '#4a3fa8'];
    o += stainedCrown('g', crown, [12, 10, 68, 82], 6, 27, function (x, y, R) {
      if (R() < 0.08) return R() < 0.5 ? '#d23c4f' : '#f2b233';
      const dx = (x - 40) / 25;
      const dy = (y - 40) / 33;
      const t = Math.sqrt(dx * dx + dy * dy) * ring.length + (R() - 0.5) * 1.4;
      return ring[Math.max(0, Math.min(ring.length - 1, Math.floor(t)))];
    }, 'M40 80V62M40 70L28 58M40 68L52 55M40 62V46M40 52L32 42M40 50L48 40M40 46V32');
    const R = rng(270);
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * 6.283 + R();
      const r = 0.45 + R() * 0.35;
      const x = 40 + Math.cos(a) * 21 * r;
      const y = 45 + Math.sin(a) * 28 * r;
      o += C(x, y, 1.6, i % 3 ? '#e0405a' : '#ffd860', 'stroke="' + LEAD + '" stroke-width=".7"') + C(x - 0.5, y - 0.5, 0.45, '#fff');
    }
    o += L('M22 30l4-8M27 20l1.6-2.4', '#ffffff', 1, 'stroke-opacity=".85"');
    return o;
  }

  /* stained glass crown: jittered lead grid clipped to the crown, branch cames, outer came */
  function stainedCrown(id, crown, box, cell, seed, colorAt, branches) {
    const R = rng(seed);
    const x0 = box[0];
    const y0 = box[1];
    const cols = Math.ceil((box[2] - x0) / cell);
    const rows = Math.ceil((box[3] - y0) / cell);
    const g = [];
    for (let j = 0; j <= rows; j++) {
      g[j] = [];
      for (let i = 0; i <= cols; i++) {
        const e = i === 0 || j === 0 || i === cols || j === rows;
        g[j][i] = [x0 + i * cell + (e ? 0 : (R() - 0.5) * cell * 0.65), y0 + j * cell + (e ? 0 : (R() - 0.5) * cell * 0.65)];
      }
    }
    const groups = {};
    function add(c, pts) {
      let d = 'M' + pt(pts[0][0], pts[0][1]);
      for (let k = 1; k < pts.length; k++) d += 'L' + pt(pts[k][0], pts[k][1]);
      groups[c] = (groups[c] || '') + d + 'Z';
    }
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const a = g[j][i];
        const b = g[j][i + 1];
        const c = g[j + 1][i + 1];
        const d = g[j + 1][i];
        const cx = (a[0] + c[0]) / 2;
        const cy = (a[1] + c[1]) / 2;
        if (R() < 0.45) {
          add(colorAt(cx - 1, cy - 1, R), [a, b, c]);
          add(colorAt(cx + 1, cy + 1, R), [a, c, d]);
        } else add(colorAt(cx, cy, R), [a, b, c, d]);
      }
    }
    let o = '<defs><clipPath id="' + id + '"><path d="' + crown + '"/></clipPath>' +
      lg(id + 'l', 0, 0, 1, 1, [[0, '#ffffff', 0.55], [0.45, '#ffffff', 0.08], [1, '#ffffff', 0]]) + '</defs>';
    o += P(crown, '#1f8a62');
    o += '<g clip-path="url(#' + id + ')"><g stroke="' + LEAD + '" stroke-width=".9" stroke-linejoin="round">';
    Object.keys(groups).forEach(function (c) { o += P(groups[c], c); });
    o += '</g>';
    o += P('M' + pt(box[0], box[1]) + 'H' + N(box[2]) + 'V' + N(box[3]) + 'H' + N(box[0]) + 'Z', 'url(#' + id + 'l)');
    o += L(branches, LEAD, 2.2) + '</g>';
    o += L(crown, LEAD, 2.3);
    return o;
  }

  function tree(id, name, tier, style, svg) {
    return { id: id, name: name, tier: tier, style: style, vb: VB, svg: svg };
  }

  window.EUREKA_TREES = [
    tree('t01', '像素新芽', 'common', 'pixel', t01),
    tree('t02', '像素松', 'common', 'pixel', t02),
    tree('t03', '小银杏', 'common', 'realistic', t03()),
    tree('t04', '铅笔白桦', 'common', 'sketch', t04()),
    tree('t05', '垂柳', 'common', 'sketch', t05()),
    tree('t06', '漫画圆树', 'common', 'comic', t06()),
    tree('t07', '圆点树', 'common', 'abstract', t07()),
    tree('t08', '三角松', 'common', 'abstract', t08()),
    tree('t09', '剪纸松', 'common', 'papercut', t09()),
    tree('t10', '标本苗', 'common', 'botanical', t10()),
    tree('t11', '霓虹苗', 'common', 'cyber', t11()),
    tree('t12', '漫画苹果树', 'common', 'comic', t12()),

    tree('t13', '像素樱', 'rare', 'pixel', t13),
    tree('t14', '霓虹松', 'rare', 'cyber', t14()),
    tree('t15', '写实橡树', 'rare', 'realistic', t15()),
    tree('t16', '网点松', 'rare', 'manga', t16()),
    tree('t17', '星座树', 'rare', 'abstract', t17()),
    tree('t18', '水墨盆景', 'rare', 'sketch', t18()),
    tree('t19', '浮世松', 'rare', 'ukiyo', t19()),
    tree('t20', '彩窗小树', 'rare', 'stained', t20()),
    tree('t21', '白桦树', 'rare', 'realistic', t21()),

    tree('t22', '电路神木', 'epic', 'cyber', t22()),
    tree('t23', '像素古树', 'epic', 'pixel', t23),
    tree('t24', '猴面包树', 'epic', 'realistic', t24()),
    tree('t25', '夜樱', 'epic', 'manga', t25()),
    tree('t26', '分形树', 'epic', 'abstract', t26()),
    tree('t27', '彩窗高树', 'epic', 'stained', t27()),

    tree('t28', '极光树', 'legendary', 'cyber', t28()),
    tree('t29', '千年橡', 'legendary', 'realistic', t29()),
    tree('t30', '月下松', 'legendary', 'ukiyo', t30())
  ];

  window.EUREKA_TIER_NAME = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' };
  window.EUREKA_STYLE_NAME = {
    pixel: '像素', sketch: '素描', comic: '漫画', abstract: '抽象', papercut: '剪纸',
    botanical: '标本', cyber: '赛博朋克', realistic: '写实', manga: '漫画', ukiyo: '浮世绘', stained: '彩窗'
  };
})();
