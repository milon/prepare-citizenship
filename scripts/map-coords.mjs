// Prints marker coordinates for public/canada-capitals-map.svg.
//
// The base map is a hand-traced Lambert conformal conic, so no textbook
// projection matches it exactly. This fits a conic plus an affine correction to
// landmarks measured off the map itself (exact meridian/parallel boundary
// corners, plus lake and island bounding-box centres), which lands cities
// within roughly 20 km — a couple of pixels at the size the map is displayed.
//
// Usage: node scripts/map-coords.mjs [lat,lon ...]
// With no arguments it prints the capitals used by CanadaCapitalsMap.astro.
//
// Coordinates it produces are not automatically inside the right province:
// cities on a coast or river border (Victoria, Ottawa, St. John's) were nudged
// onto the correct side by hand after checking them against the map geometry.

const D = Math.PI / 180;
const t = (lat) => Math.tan(Math.PI / 4 - (lat * D) / 2);
const KM_PER_UNIT = 0.1017;

// label, lat, lon, svg x, svg y, weight
const landmarks = [
  ['corner 60N 141W', 60, -141, -22032, -7952, 3],
  ['corner 60N 120W', 60, -120, -13214, -2631, 3],
  ['corner 60N 110W', 60, -110, -8064, -955, 3],
  ['corner 49N 110W', 49, -110, -10878, 10754, 3],
  ['corner 54N 120W', 54, -120, -15799, 3603, 3],
  ['corner 49N 114.05W', 49, -114.054, -13745, 9968, 3],
  ['Great Bear Lake', 66.05, -121.15, -11107, -8734, 0.6],
  ['Great Slave Lake', 61.82, -113.0, -9178, -3616, 1],
  ['Lake Athabasca', 58.94, -108.58, -7730, -3, 1],
  ['Reindeer Lake', 57.25, -102.38, -4385, 2735, 1],
  ['Lake Winnipeg', 52.14, -97.72, -1839, 8582, 1],
  ['Lake Winnipegosis', 52.38, -100.2, -3561, 8169, 1],
  ['Lake Nipigon', 49.84, -88.5, 4617, 10887, 1],
  ['Lake Superior', 47.71, -88.21, 5193, 13198, 0.8],
  ['Lake Huron/Michigan', 43.96, -83.86, 8917, 17075, 0.5],
  ['Lake Erie', 42.14, -81.18, 11655, 18416, 1],
  ['Lake Ontario', 43.72, -77.93, 13931, 15854, 1],
  ['Vancouver Island', 49.58, -125.85, -21331, 6085, 1],
  ['Newfoundland', 49.13, -56.05, 27498, 3602, 0.8],
  ['Baffin Island', 68.28, -75.5, 8041, -10250, 0.4],
  ['Prince Edward Island', 46.5, -63.2, 23613, 8808, 1],
  ['Cape Breton', 46.28, -60.65, 25645, 8098, 1],
  ['Anticosti', 49.5, -63.1, 22116, 5817, 1],
];

const capitals = [
  ['Whitehorse', 60.7212, -135.0568],
  ['Yellowknife', 62.454, -114.3718],
  ['Iqaluit', 63.7467, -68.517],
  ['Victoria', 48.4284, -123.3656],
  ['Edmonton', 53.5461, -113.4938],
  ['Regina', 50.4452, -104.6189],
  ['Winnipeg', 49.8951, -97.1384],
  ['Toronto', 43.6532, -79.3832],
  ['Ottawa', 45.4215, -75.6972],
  ['Quebec City', 46.8139, -71.208],
  ['Fredericton', 45.9636, -66.6431],
  ['Charlottetown', 46.2382, -63.1311],
  ['Halifax', 44.6488, -63.5752],
  ["St. John's", 47.5615, -52.7126],
];

// A conic maps (lat, lon) onto these two terms; the affine coefficients below
// absorb the tracing error in the base map.
const basis = (n, lon0, lat, lon) => {
  const k = Math.pow(t(lat), n);
  const theta = n * (lon - lon0) * D;
  return [k * Math.sin(theta), k * Math.cos(theta), 1];
};

function solve3(A, b) {
  const M = A.map((row, i) => [...row, b[i]]);
  for (let i = 0; i < 3; i += 1) {
    let pivot = i;
    for (let r = i + 1; r < 3; r += 1) {
      if (Math.abs(M[r][i]) > Math.abs(M[pivot][i])) pivot = r;
    }
    [M[i], M[pivot]] = [M[pivot], M[i]];
    for (let r = i + 1; r < 3; r += 1) {
      const f = M[r][i] / M[i][i];
      for (let c = i; c <= 3; c += 1) M[r][c] -= f * M[i][c];
    }
  }
  const z = [0, 0, 0];
  for (let i = 2; i >= 0; i -= 1) {
    let s = M[i][3];
    for (let c = i + 1; c < 3; c += 1) s -= M[i][c] * z[c];
    z[i] = s / M[i][i];
  }
  return z;
}

function fitAffine(n, lon0) {
  const ATA = Array.from({ length: 3 }, () => new Array(3).fill(0));
  const ATx = new Array(3).fill(0);
  const ATy = new Array(3).fill(0);
  for (const [, lat, lon, x, y, w] of landmarks) {
    const f = basis(n, lon0, lat, lon);
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) ATA[i][j] += w * f[i] * f[j];
      ATx[i] += w * f[i] * x;
      ATy[i] += w * f[i] * y;
    }
  }
  return { n, lon0, ax: solve3(ATA.map((r) => [...r]), ATx), ay: solve3(ATA, ATy) };
}

const project = (m, lat, lon) => {
  const f = basis(m.n, m.lon0, lat, lon);
  return {
    x: f[0] * m.ax[0] + f[1] * m.ax[1] + f[2] * m.ax[2],
    y: f[0] * m.ay[0] + f[1] * m.ay[1] + f[2] * m.ay[2],
  };
};

const rms = (m) => {
  let sum = 0;
  let weight = 0;
  for (const [, lat, lon, x, y, w] of landmarks) {
    const q = project(m, lat, lon);
    sum += w * ((q.x - x) ** 2 + (q.y - y) ** 2);
    weight += w;
  }
  return Math.sqrt(sum / weight);
};

// The cone constant and central meridian are not linear, so scan then refine.
function fit() {
  let best = null;
  for (let n = 0.7; n <= 0.999; n += 0.0005) {
    for (let lon0 = -105; lon0 <= -85; lon0 += 0.25) {
      const m = fitAffine(n, lon0);
      const r = rms(m);
      if (!best || r < best.r) best = { m, r };
    }
  }
  for (let pass = 0; pass < 3; pass += 1) {
    const dn = 0.0001 / 10 ** pass;
    const dlon = 0.05 / 10 ** pass;
    let improved = true;
    while (improved) {
      improved = false;
      for (const [sn, sl] of [
        [dn, 0],
        [-dn, 0],
        [0, dlon],
        [0, -dlon],
      ]) {
        const m = fitAffine(best.m.n + sn, best.m.lon0 + sl);
        const r = rms(m);
        if (r < best.r - 1e-9) {
          best = { m, r };
          improved = true;
        }
      }
    }
  }
  return best;
}

const { m: model, r } = fit();
console.log(`cone constant ${model.n.toFixed(6)}, central meridian ${model.lon0.toFixed(3)}`);
console.log(`landmark fit: ${(r * KM_PER_UNIT).toFixed(1)} km rms\n`);

const args = process.argv.slice(2);
const points = args.length
  ? args.map((arg) => {
      const [lat, lon] = arg.split(',').map(Number);
      return [arg, lat, lon];
    })
  : capitals;

for (const [name, lat, lon] of points) {
  const q = project(model, lat, lon);
  console.log(`${name.padEnd(14)} x ${Math.round(q.x)}  y ${Math.round(q.y)}`);
}
