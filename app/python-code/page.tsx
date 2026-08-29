import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Python analysis code | SynC",
  description:
    "Python scripts, public inputs, and clearly labelled demos supporting analyses in the SynC manuscript.",
};

const scripts = [
  {
    id: "fig4c-eeg",
    label: "Figure 4c",
    name: "EEG/EMG preprocessing and spectral analysis",
    description:
      "Processes Blackrock .ns2/.ns3 electrophysiology recordings and generates referenced EEG/EMG traces, STFT power spectra, event tables, and summary figures. The included 2,000-Hz synthetic NPZ starts at the processed-signal stage and tests STFT and figure generation; it is not manuscript source data.",
    detailHref: "/docs/README_Fig4c_EEG.md",
    detailLabel: "Read data and usage notes →",
    files: [
      {
        name: "Fig4c_EEG_analysis.py",
        href: "/code/Fig4c_EEG_analysis.py",
        action: "Download Python",
      },
      {
        name: "Fig4c_EEG_demo.npz",
        href: "/data/Fig4c_EEG_demo.npz",
        action: "Download synthetic demo",
      },
      {
        name: "README_Fig4c_EEG.md",
        href: "/docs/README_Fig4c_EEG.md",
        action: "Download README",
      },
    ],
  },
  {
    id: "fig4e-signflip",
    detailHref: "/statistical-tests#fig4e-signflip",
    detailLabel: "Read the method description →",
    label: "Figure 4e",
    name: "Exact sign-flip tests with single-step maxT",
    description:
      "Reproduces the mouse-level tests against zero while preserving the dependence of seven repeat measurements, plus the exact paired first-versus-second A/C comparison.",
    files: [
      {
        name: "Fig4e_exact_signflip_maxT.py",
        href: "/code/Fig4e_exact_signflip_maxT.py",
        action: "Download Python",
      },
      {
        name: "Fig4e_statec_input.csv",
        href: "/data/Fig4e_statec_input.csv",
        action: "Download mouse-level input",
      },
      {
        name: "Fig4e_reported_tests.csv",
        href: "/data/Fig4e_reported_tests.csv",
        action: "Download reported results",
      },
      {
        name: "README_Fig4e_exact_signflip.md",
        href: "/docs/README_Fig4e_exact_signflip.md",
        action: "Download README",
      },
    ],
  },
  {
    id: "fig4g-permutation",
    detailHref: "/statistical-tests#fig4g-permutation",
    detailLabel: "Read the method description →",
    label: "Figure 4g",
    name: "Exact permutation tests with single-step maxT",
    description:
      "Reproduces the animal-level group comparisons for occupancy, laser response, and feeding. Complete group-label permutation spaces are enumerated while retaining each animal's time windows and missing-value pattern.",
    files: [
      {
        name: "Fig4g_exact_permutation_maxT.py",
        href: "/code/Fig4g_exact_permutation_maxT.py",
        action: "Download Python",
      },
      {
        name: "Fig4g_occupancy_input.csv",
        href: "/data/Fig4g_occupancy_input.csv",
        action: "Download occupancy input",
      },
      {
        name: "Fig4g_laser_input.csv",
        href: "/data/Fig4g_laser_input.csv",
        action: "Download laser input",
      },
      {
        name: "Fig4g_feeding_input.csv",
        href: "/data/Fig4g_feeding_input.csv",
        action: "Download feeding input",
      },
      {
        name: "Fig4g_reported_tests.csv",
        href: "/data/Fig4g_reported_tests.csv",
        action: "Download reported results",
      },
      {
        name: "README_Fig4g_exact_permutation.md",
        href: "/docs/README_Fig4g_exact_permutation.md",
        action: "Download README",
      },
    ],
  },
  {
    id: "fig5-permutation",
    detailHref: "/statistical-tests#fig5-permutation",
    detailLabel: "Read the method description →",
    label: "Figure 5",
    name: "Paired exact sign-flip permutation test",
    description:
      "Reproduces the n = 10 Fig. 5 analysis for firing rate, Spearman pairwise correlation, normalised participation ratio, and normalised PC50 in immobile and mobile periods.",
    files: [
      {
        name: "Fig5_Permutation_test.py",
        href: "/code/Fig5_Permutation_test.py",
        action: "Download Python",
      },
      {
        name: "Fig5_permutation_input_N10.csv",
        href: "/data/Fig5_permutation_input_N10.csv",
        action: "Download input CSV",
      },
      {
        name: "README_Fig5_permutation.md",
        href: "/docs/README_Fig5_permutation.md",
        action: "Download README",
      },
    ],
  },
  {
    id: "fig6-bootstrap",
    detailHref: "/statistical-tests#fig6-spine-analysis",
    detailLabel: "Read the method description →",
    label: "Figure 6g",
    name: "FOV-level parametric bootstrap",
    description:
      "Recomputes the adopted 10,000-replicate, two-sided comparisons of FOV mean ΔV and fixed condition-specific-posterior FOV means, including the mouse random intercept and the documented primary/secondary policy.",
    files: [
      {
        name: "Fig6_FOV_parametric_bootstrap.py",
        href: "/code/Fig6_FOV_parametric_bootstrap.py",
        action: "Download Python",
      },
      {
        name: "Fig6_ExFig10_FOV_input.csv",
        href: "/data/Fig6_ExFig10_FOV_input.csv",
        action: "Download FOV input",
      },
      {
        name: "Fig6_ExFig10_reported_tests.csv",
        href: "/data/Fig6_ExFig10_reported_tests.csv",
        action: "Download reported tests",
      },
      {
        name: "README_Fig6_ExFig10.md",
        href: "/docs/README_Fig6_ExFig10.md",
        action: "Download README",
      },
    ],
  },
  {
    id: "exfig10-mixture",
    detailHref: "/statistical-tests#fig6-spine-analysis",
    detailLabel: "Read the method description →",
    label: "Extended Data Figure 10",
    name: "Normal-Exponential mixture audit",
    description:
      "Recalculates the Normal and positive-response densities, verifies each spine's posterior permissive probability, and reproduces condition-specific π values from the frozen 40-80-s endpoints.",
    files: [
      {
        name: "ExFig10_mixture_audit.py",
        href: "/code/ExFig10_mixture_audit.py",
        action: "Download Python",
      },
      {
        name: "Fig6_ExFig10_spine_input.csv",
        href: "/data/Fig6_ExFig10_spine_input.csv",
        action: "Download spine input",
      },
      {
        name: "Fig6_ExFig10_mixture_parameters.csv",
        href: "/data/Fig6_ExFig10_mixture_parameters.csv",
        action: "Download parameters",
      },
      {
        name: "Fig6_ExFig10_cohort_counts.csv",
        href: "/data/Fig6_ExFig10_cohort_counts.csv",
        action: "Download cohort counts",
      },
    ],
  },
];

export default function PythonCodePage() {
  return (
    <main id="main-content">
      <a className="skipLink" href="#main-content">
        Skip to content
      </a>
      <nav className="nav" aria-label="Page navigation">
        <Link className="brand" href="/">
          SynC
        </Link>
        <div className="navLinks">
          <Link href="/">Home</Link>
          <Link href="/statistical-tests">Test descriptions</Link>
          <Link href="/behavioural-analysis">Behavioural analysis</Link>
        </div>
      </nav>

      <header className="subpageHero">
        <p className="eyebrow">Reproducible analysis</p>
        <h1>Python code and frozen source tables</h1>
        <p className="lead">
          Downloadable analysis scripts are paired with exact public inputs or
          clearly labelled workflow demos, plus their method and usage records.
        </p>
      </header>

      <section className="scriptCatalogue" aria-label="Python scripts">
        {scripts.map((script) => (
          <article className="scriptCard" id={script.id} key={script.id}>
            <div>
              <p className="sectionLabel">{script.label}</p>
              <h2>{script.name}</h2>
              <p>{script.description}</p>
              <a
                className="repoLink"
                href={script.detailHref}
              >
                {script.detailLabel}
              </a>
            </div>
            <div className="filePanel">
              <span>Files</span>
              {script.files.map((file) => (
                <div className="downloadFile" key={file.name}>
                  <strong>{file.name}</strong>
                  <a href={file.href} download>
                    {file.action}
                  </a>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <footer>
        <span>SynC analysis code</span>
        <Link href="/">Back to analysis resources</Link>
      </footer>
    </main>
  );
}
