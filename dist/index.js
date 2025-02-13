'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const peq = new Uint32Array(65536);
const myers_32 = (a, b) => {
  const n = a.length;
  const m = b.length;
  const lst = 1 << n - 1;
  let pv = -1;
  let mv = 0;
  let sc = n;
  let i = n;
  while (i--) {
    peq[a.charCodeAt(i)] |= 1 << i;
  }
  for (i = 0; i < m; i++) {
    let eq = peq[b.charCodeAt(i)];
    const xv = eq | mv;
    eq |= (eq & pv) + pv ^ pv;
    mv |= ~(eq | pv);
    pv &= eq;
    if (mv & lst) {
      sc++;
    }
    if (pv & lst) {
      sc--;
    }
    mv = mv << 1 | 1;
    pv = pv << 1 | ~(xv | mv);
    mv &= xv;
  }
  i = n;
  while (i--) {
    peq[a.charCodeAt(i)] = 0;
  }
  return sc;
};
const myers_x = (b, a) => {
  const n = a.length;
  const m = b.length;
  const mhc = [];
  const phc = [];
  const hsize = Math.ceil(n / 32);
  const vsize = Math.ceil(m / 32);
  for (let i = 0; i < hsize; i++) {
    phc[i] = -1;
    mhc[i] = 0;
  }
  let j = 0;
  for (; j < vsize - 1; j++) {
    let mv2 = 0;
    let pv2 = -1;
    const start2 = j * 32;
    const vlen2 = Math.min(32, m) + start2;
    for (let k = start2; k < vlen2; k++) {
      peq[b.charCodeAt(k)] |= 1 << k;
    }
    for (let i = 0; i < n; i++) {
      const eq = peq[a.charCodeAt(i)];
      const pb = phc[i / 32 | 0] >>> i % 32 & 1;
      const mb = mhc[i / 32 | 0] >>> i % 32 & 1;
      const xv = eq | mv2;
      const xh = ((eq | mb) & pv2) + pv2 ^ pv2 | eq | mb;
      let ph = mv2 | ~(xh | pv2);
      let mh = pv2 & xh;
      if (ph >>> 31 ^ pb) {
        phc[i / 32 | 0] ^= 1 << i % 32;
      }
      if (mh >>> 31 ^ mb) {
        mhc[i / 32 | 0] ^= 1 << i % 32;
      }
      ph = ph << 1 | pb;
      mh = mh << 1 | mb;
      pv2 = mh | ~(xv | ph);
      mv2 = ph & xv;
    }
    for (let k = start2; k < vlen2; k++) {
      peq[b.charCodeAt(k)] = 0;
    }
  }
  let mv = 0;
  let pv = -1;
  const start = j * 32;
  const vlen = Math.min(32, m - start) + start;
  for (let k = start; k < vlen; k++) {
    peq[b.charCodeAt(k)] |= 1 << k;
  }
  let score = m;
  for (let i = 0; i < n; i++) {
    const eq = peq[a.charCodeAt(i)];
    const pb = phc[i / 32 | 0] >>> i % 32 & 1;
    const mb = mhc[i / 32 | 0] >>> i % 32 & 1;
    const xv = eq | mv;
    const xh = ((eq | mb) & pv) + pv ^ pv | eq | mb;
    let ph = mv | ~(xh | pv);
    let mh = pv & xh;
    score += ph >>> m % 32 - 1 & 1;
    score -= mh >>> m % 32 - 1 & 1;
    if (ph >>> 31 ^ pb) {
      phc[i / 32 | 0] ^= 1 << i % 32;
    }
    if (mh >>> 31 ^ mb) {
      mhc[i / 32 | 0] ^= 1 << i % 32;
    }
    ph = ph << 1 | pb;
    mh = mh << 1 | mb;
    pv = mh | ~(xv | ph);
    mv = ph & xv;
  }
  for (let k = start; k < vlen; k++) {
    peq[b.charCodeAt(k)] = 0;
  }
  return score;
};
const distance = (a, b) => {
  if (a.length < b.length) {
    const tmp = b;
    b = a;
    a = tmp;
  }
  if (b.length === 0) {
    return a.length;
  }
  if (a.length <= 32) {
    return myers_32(a, b);
  }
  return myers_x(a, b);
};
const closest = (str, arr) => {
  let min_distance = Infinity;
  let min_index = 0;
  for (let i = 0; i < arr.length; i++) {
    const dist = distance(str, arr[i]);
    if (dist < min_distance) {
      min_distance = dist;
      min_index = i;
    }
  }
  return arr[min_index];
};

exports.closest = closest;
exports.distance = distance;
//# sourceMappingURL=index.js.map
