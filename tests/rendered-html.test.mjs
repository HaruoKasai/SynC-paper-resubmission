import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const builtAssetRoot = fileURLToPath(new URL("../dist/client/", import.meta.url));
let workerPromise;

async function worker() {
  workerPromise ??= import(
    new URL(`../dist/server/index.js?test=${process.pid}-${Date.now()}`, import.meta.url)
      .href
  ).then((module) => module.default);
  return workerPromise;
}

async function serveBuiltAsset(request) {
  const requestUrl =
    typeof request === "string"
      ? request
      : request instanceof URL
        ? request.href
        : request.url;
  const pathname = decodeURIComponent(new URL(requestUrl).pathname);
  const filePath = join(builtAssetRoot, pathname.replace(/^\/+/, ""));
  try {
    const body = await readFile(filePath);
    const extension = filePath.split(".").pop()?.toLowerCase();
    const contentTypes = {
      css: "text/css; charset=utf-8",
      csv: "text/csv; charset=utf-8",
      js: "text/javascript; charset=utf-8",
      json: "application/json; charset=utf-8",
      md: "text/markdown; charset=utf-8",
      m: "text/plain; charset=utf-8",
      py: "text/x-python; charset=utf-8",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      zip: "application/zip",
    };
    return new Response(body, {
      status: 200,
      headers: { "content-type": contentTypes[extension] ?? "application/octet-stream" },
    });
  } catch {
    return new Response("Not found", {
      status: 404,
      headers: { "x-test-asset-path": filePath },
    });
  }
}

async function fetchApp(pathname, accept = "text/html") {
  const app = await worker();
  return app.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept },
    }),
    {
      ASSETS: { fetch: serveBuiltAsset },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function render(pathname) {
  return fetchApp(pathname, "text/html");
}

function parseSimpleCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) =>
    Object.fromEntries(headers.map((header, index) => [header, line.split(",")[index]])),
  );
}

test("server-renders the analysis resource routes", async () => {
  const cases = [
    ["/", /Rapid associative spine enlargement/],
    ["/statistical-tests", /Two-sided spine-level studentized permutation/],
    ["/python-code", /EEG\/EMG preprocessing and spectral analysis/],
    ["/matlab-code", /MATLAB code and source data for Extended Data Figure 4/],
  ];

  for (const [pathname, expected] of cases) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await response.text();
    assert.match(html, expected);
    assert.doesNotMatch(html, /Your site is taking shape|codex-preview/);
  }
});

test("homepage lists all authors, figure subtitles, and resampling last", async () => {
  const response = await render("/");
  const html = await response.text();

  for (const author of [
    "Siqi Zhou",
    "Takeshi Sawada",
    "Hitoshi Okazaki",
    "Tomoki Arima",
    "Shunki Takaramoto",
    "Sadam Khan Panezai",
    "Masanari Ohtsuka",
    "Shin-Ichiro Terada",
    "Masashi Kondo",
    "Takaaki Hashimoto",
    "Kenichi Ohki",
    "Masanori Matsuzaki",
    "Sho Yagishita",
    "Haruo Kasai",
  ]) {
    assert.match(html, new RegExp(author));
  }

  assert.match(html, /Figure 4c/);
  assert.match(html, /Extended Data Figure 4h–k/);
  assert.match(html, /Extended Data Figure 8/);
  assert.ok(
    html.lastIndexOf("Resampling statistics") > html.lastIndexOf("Statistical analysis"),
  );
});

test("publishes the Extended Data Figure 4 MATLAB package", async () => {
  const paths = [
    "public/code/ExtendedDataFig4_plot_code.m",
    "public/data/ExtendedDataFig4_source_data.xlsx",
    "public/docs/README_ExtendedDataFig4_visual_analysis.md",
  ];
  await Promise.all(paths.map((path) => access(new URL(path, root))));

  const [homePage, matlabPage, matlabCode, readme] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/matlab-code/page.tsx", root), "utf8"),
    readFile(new URL("public/code/ExtendedDataFig4_plot_code.m", root), "utf8"),
    readFile(new URL("public/docs/README_ExtendedDataFig4_visual_analysis.md", root), "utf8"),
  ]);

  assert.match(homePage, /href: "\/matlab-code"/);
  assert.match(matlabPage, /ExtendedDataFig4_plot_code\.m/);
  assert.match(matlabPage, /ExtendedDataFig4_source_data\.xlsx/);
  assert.match(matlabCode, /%% EFig\. 4h/);
  assert.match(matlabCode, /friedman\(data_raw', 1, 'off'\)/);
  assert.match(matlabCode, /signrank\(data_raw\(1,:\), data_raw\(2,:\)\)/);
  assert.match(readme, /Statistics and Machine Learning Toolbox/);
});

test("publishes the Fig. 4c EEG analysis and synthetic workflow demo", async () => {
  const paths = [
    "public/code/Fig4c_EEG_analysis.py",
    "public/data/Fig4c_EEG_demo.npz",
    "public/docs/README_Fig4c_EEG.md",
  ];
  await Promise.all(paths.map((path) => access(new URL(path, root))));

  const [homePage, codePage, analysisCode, readme] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/python-code/page.tsx", root), "utf8"),
    readFile(new URL("public/code/Fig4c_EEG_analysis.py", root), "utf8"),
    readFile(new URL("public/docs/README_Fig4c_EEG.md", root), "utf8"),
  ]);

  assert.match(homePage, /\/python-code#fig4c-eeg/);
  assert.doesNotMatch(homePage, /tkssawada\/SynC/);
  assert.match(codePage, /Fig4c_EEG_analysis\.py/);
  assert.match(codePage, /Fig4c_EEG_demo\.npz/);
  assert.match(codePage, /2,000-Hz synthetic NPZ/);
  assert.doesNotMatch(codePage, /tkssawada\/SynC/);
  assert.match(analysisCode, /BlackrockIO/);
  assert.match(analysisCode, /f\.endswith\(\("\.ns3", "\.ns2"\)\)/);
  assert.match(readme, /raw Blackrock `\.ns2`\/`\.ns3` recordings/);
  assert.match(readme, /synthetic demonstration data/);
});

test("publishes the frozen Fig. 6 and Extended Data Fig. 10 package", async () => {
  const paths = [
    "public/code/Fig6_spine_permutation.py",
    "public/code/ExFig10_mixture_audit.py",
    "public/data/Fig6_ExFig10_FOV_input.csv",
    "public/data/Fig6_ExFig10_spine_input.csv",
    "public/data/Fig6_ExFig10_mixture_parameters.csv",
    "public/data/Fig6_ExFig10_cohort_counts.csv",
    "public/data/Fig6_ExFig10_reported_tests.csv",
    "public/docs/README_Fig6_ExFig10.md",
  ];
  await Promise.all(paths.map((path) => access(new URL(path, root))));

  const [fovCsv, spineCsv, testCsv, methodsPage, codePage, methodsReadme, parameters] =
    await Promise.all([
      readFile(new URL("public/data/Fig6_ExFig10_FOV_input.csv", root), "utf8"),
      readFile(new URL("public/data/Fig6_ExFig10_spine_input.csv", root), "utf8"),
      readFile(new URL("public/data/Fig6_ExFig10_reported_tests.csv", root), "utf8"),
      readFile(new URL("app/statistical-tests/page.tsx", root), "utf8"),
      readFile(new URL("app/python-code/page.tsx", root), "utf8"),
      readFile(new URL("public/docs/README_Fig6_ExFig10.md", root), "utf8"),
      readFile(new URL("public/data/Fig6_ExFig10_mixture_parameters.csv", root), "utf8"),
    ]);

  assert.equal(
    fovCsv.split(/\r?\n/, 1)[0],
    "group,mouse_id,fov_id,n_spines,mean_delta_v_40_80_percent,fov_mean_posterior_score",
  );
  assert.equal(
    spineCsv.split(/\r?\n/, 1)[0],
    "group,role,mouse_id,fov_id,spine_id,corrected_delta_v_40_80_percent,posterior_permissive,permutation_order",
  );
  assert.equal(
    testCsv.split(/\r?\n/, 1)[0],
    "panel,metric,contrast_id,contrast,alternative,effect_first_minus_second,studentized_statistic,p_value,seed,repetitions,inference_role",
  );
  assert.doesNotMatch(spineCsv, /[A-Z]:\\Users\\/i);
  assert.equal(spineCsv.trim().split(/\r?\n/).length - 1, 1088);
  assert.equal((spineCsv.match(/,stim,/g) ?? []).length, 565);
  assert.equal((spineCsv.match(/,neighbor,/g) ?? []).length, 523);
  assert.match(testCsv, /Fig\. 6g,mean_delta_v_40_80_percent,sync_before_vs_0_60/);
  assert.match(testCsv, /0\.012869871301286986/);
  assert.match(testCsv, /0\.007079929200707993/);
  assert.match(testCsv, /0\.005089949100508995/);
  assert.match(testCsv, /0\.04991950080499195/);
  const reportedTests = parseSimpleCsv(testCsv);
  assert.equal(reportedTests.length, 8);
  assert.deepEqual(
    reportedTests.map((row) => `${row.panel}:${row.contrast_id}`),
    [
      "Fig. 6g:sync_before_vs_0_60",
      "Fig. 6g:sync_60_180_vs_0_60",
      "Fig. 6g:dgap_before_vs_0_60",
      "Fig. 6g:dgap_0_60_vs_60_180",
      "Fig. 6h:sync_before_vs_0_60",
      "Fig. 6h:sync_60_180_vs_0_60",
      "Fig. 6h:dgap_before_vs_0_60",
      "Fig. 6h:dgap_0_60_vs_60_180",
    ],
  );
  assert.equal(
    reportedTests.find((row) => row.panel === "Fig. 6h" && row.contrast_id === "sync_before_vs_0_60")?.metric,
    "mixture_fraction_pi",
  );
  assert.doesNotMatch(testCsv, /wt_vs_sync_before/);
  assert.doesNotMatch(testCsv, /sync_before_vs_60_180/);
  assert.match(methodsPage, /Individual stimulated spines are the/);
  assert.match(methodsPage, /π was re-estimated separately in both groups/);
  assert.match(methodsPage, /SynC@FPC before A\/C vs 0–1 h after A\/C/);
  assert.match(methodsPage, /SynC-dGAP@FPC before A\/C vs 0–1 h after A\/C/);
  assert.doesNotMatch(methodsPage, /parametric-\s+bootstrap/);
  assert.match(methodsPage, /same condition-specific mixture fraction/);
  assert.match(methodsPage, /observed information/);
  assert.match(methodsPage, /Percentograms are used only for visualisation/);
  assert.doesNotMatch(methodsPage, /WT versus SynC -A\/C uses/);
  assert.doesNotMatch(methodsPage, /0\.3810|0\.1905/);
  assert.match(codePage, /Fig6_spine_permutation\.py/);
  assert.match(parameters, /pi_WT/);
  assert.doesNotMatch(parameters, /common_pi_sensitivity/);
  assert.doesNotMatch(methodsPage, /common[- ]prior|π = 0\.242/i);
  assert.doesNotMatch(methodsReadme, /common[- ]prior|pi = 0\.241672/i);
  assert.match(methodsReadme, /WT rows and the frozen `pi_WT` parameter remain/);
  assert.match(methodsReadme, /100,000 Monte Carlo permutations/);

  const fovRows = parseSimpleCsv(fovCsv);
  const stimRows = parseSimpleCsv(spineCsv).filter((row) => row.role === "stim");
  const posteriorByFov = new Map();
  for (const row of stimRows) {
    const current = posteriorByFov.get(row.fov_id) ?? { sum: 0, count: 0 };
    current.sum += Number(row.posterior_permissive);
    current.count += 1;
    posteriorByFov.set(row.fov_id, current);
  }
  for (const row of fovRows) {
    const aggregate = posteriorByFov.get(row.fov_id);
    assert.ok(aggregate, `missing stimulated spines for ${row.fov_id}`);
    assert.equal(Number(row.n_spines), aggregate.count);
    assert.ok(
      Math.abs(Number(row.fov_mean_posterior_score) - aggregate.sum / aggregate.count) < 1e-12,
      `posterior mean mismatch for ${row.fov_id}`,
    );
  }
});

test("publishes only stable opaque analysis identifiers", async () => {
  const [fovText, spineText] = await Promise.all([
    readFile(new URL("public/data/Fig6_ExFig10_FOV_input.csv", root), "utf8"),
    readFile(new URL("public/data/Fig6_ExFig10_spine_input.csv", root), "utf8"),
  ]);
  const fovRows = parseSimpleCsv(fovText);
  const spineRows = parseSimpleCsv(spineText);

  assert.equal(new Set(fovRows.map((row) => row.mouse_id)).size, 11);
  assert.equal(new Set(fovRows.map((row) => row.fov_id)).size, 158);
  assert.ok(
    fovRows.every(
      (row) =>
        /^M6-\d{3}$/.test(row.mouse_id) &&
        /^FOV-\d{3}$/.test(row.fov_id),
    ),
  );

  const publishedFovs = new Set(fovRows.map((row) => row.fov_id));
  assert.equal(new Set(spineRows.map((row) => row.spine_id)).size, 1088);
  assert.ok(
    spineRows.every(
      (row) =>
        /^M6-\d{3}$/.test(row.mouse_id) &&
        publishedFovs.has(row.fov_id) &&
        /^SP-\d{4}$/.test(row.spine_id),
    ),
  );
});

test("emits built styles and public downloads for the Sites asset binding", async () => {
  const home = await render("/");
  const html = await home.text();
  const stylesheet = html.match(/href="([^"]+\.css)"/)?.[1];
  assert.ok(stylesheet, "rendered HTML should link a stylesheet");

  const requests = [
    [stylesheet, "text/css"],
    ["/code/Fig4c_EEG_analysis.py", "text/x-python"],
    ["/data/Fig4c_EEG_demo.npz", "application/octet-stream"],
    ["/docs/README_Fig4c_EEG.md", "text/markdown"],
    ["/code/Fig6_spine_permutation.py", "text/x-python"],
    ["/data/Fig6_ExFig10_FOV_input.csv", "text/csv"],
    ["/docs/README_Fig6_ExFig10.md", "text/markdown"],
  ];
  const responses = await Promise.all(
    requests.map(([pathname, accept]) =>
      serveBuiltAsset(
        new Request(`http://localhost${pathname}`, {
          headers: { accept },
        }),
      ),
    ),
  );

  for (const [index, response] of responses.entries()) {
    assert.equal(
      response.status,
      200,
      `${requests[index][0]} -> ${response.headers.get("x-test-asset-path") ?? "no asset path"}`,
    );
  }
});

test("does not publish local drive or network paths", async () => {
  const paths = [
    "public/code/Fig4c_EEG_analysis.py",
    "public/docs/README_Fig4c_EEG.md",
    "public/code/Fig6_spine_permutation.py",
    "public/code/ExFig10_mixture_audit.py",
    "public/data/Fig6_ExFig10_FOV_input.csv",
    "public/data/Fig6_ExFig10_spine_input.csv",
    "public/data/Fig6_ExFig10_mixture_parameters.csv",
    "public/data/Fig6_ExFig10_cohort_counts.csv",
    "public/data/Fig6_ExFig10_reported_tests.csv",
    "public/docs/README_Fig6_ExFig10.md",
  ];

  for (const path of paths) {
    const content = await readFile(new URL(path, root), "utf8");
    assert.doesNotMatch(content, /\b[A-Za-z]:\\+/);
    assert.doesNotMatch(content, /\\\\[A-Za-z0-9_.-]+\\/);
  }
});
