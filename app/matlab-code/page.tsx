import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MATLAB visual-cortex analysis | SynC",
  description:
    "MATLAB code and frozen source data for the Extended Data Figure 4 visual-cortex analyses.",
};

const files = [
  {
    name: "ExtendedDataFig4_plot_code.m",
    href: "/code/ExtendedDataFig4_plot_code.m",
    action: "Download MATLAB code",
  },
  {
    name: "ExtendedDataFig4_source_data.xlsx",
    href: "/data/ExtendedDataFig4_source_data.xlsx",
    action: "Download source data",
  },
  {
    name: "README_ExtendedDataFig4_visual_analysis.md",
    href: "/docs/README_ExtendedDataFig4_visual_analysis.md",
    action: "Download README",
  },
];

export default function MatlabCodePage() {
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
          <Link href="/python-code">Python code</Link>
          <Link href="/statistical-tests">Statistics</Link>
        </div>
      </nav>

      <header className="subpageHero">
        <p className="eyebrow">Visual-cortex reproducibility package</p>
        <h1>MATLAB code and source data for Extended Data Figure 4</h1>
        <p className="lead">
          Downloadable MATLAB code reproduces the plotted calcium traces,
          orientation-selective cell counts, orientation selectivity index,
          preferred-orientation changes, and the reported non-parametric tests
          for panels h–k.
        </p>
      </header>

      <section className="scriptCatalogue" aria-label="MATLAB analysis files">
        <article className="scriptCard" id="extended-data-fig-4">
          <div>
            <p className="sectionLabel">Extended Data Figure 4h–k</p>
            <h2>Functional stability in mouse primary visual cortex</h2>
            <p>
              Panel h contains three trial-averaged ΔF/F response traces with
              1,920 sequential samples per session. Panels i and j use Friedman
              tests across the same five mice and three sessions. Panel k uses
              a paired Wilcoxon signed-rank test for the session 1–2 versus
              session 2–3 change in preferred orientation.
            </p>
            <ul className="analysisDetails">
              <li>Panel i: Friedman χ²(2) = 3.60, P = 0.165.</li>
              <li>Panel j: Friedman χ²(2) = 0.40, P = 0.819.</li>
              <li>Panel k: two-sided paired Wilcoxon P = 0.125.</li>
              <li>
                The workbook retains panel-h sample order because the supplied
                source did not include an explicit timestamp vector.
              </li>
            </ul>
            <a
              className="repoLink"
              href="/docs/README_ExtendedDataFig4_visual_analysis.md"
            >
              Read provenance and execution notes →
            </a>
          </div>
          <div className="filePanel">
            <span>Files</span>
            {files.map((file) => (
              <div className="downloadFile" key={file.name}>
                <strong>{file.name}</strong>
                <a href={file.href} download>
                  {file.action}
                </a>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer>
        <span>SynC MATLAB analysis resources</span>
        <Link href="/">Back to analysis resources</Link>
      </footer>
    </main>
  );
}
