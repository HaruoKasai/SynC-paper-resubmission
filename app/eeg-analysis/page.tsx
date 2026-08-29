import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EEG analysis | SynC",
  description:
    "EEG/EMG preprocessing and spectral-analysis code for Figure 4c of the SynC manuscript.",
};

const files = [
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
];

export default function EegAnalysisPage() {
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
          <Link href="/matlab-code">MATLAB code</Link>
          <Link href="/statistical-tests">Resampling statistics</Link>
        </div>
      </nav>

      <header className="subpageHero">
        <p className="eyebrow">EEG analysis · Figure 4c</p>
        <h1>EEG/EMG preprocessing and spectral analysis</h1>
        <p className="lead">
          A dedicated electrophysiology package containing only the Figure 4c
          workflow, synthetic processed-signal demonstration, and usage notes.
        </p>
      </header>

      <section className="scriptCatalogue" aria-label="Figure 4c EEG analysis files">
        <article className="scriptCard" id="fig4c-eeg">
          <div>
            <p className="sectionLabel">Figure 4c</p>
            <h2>Blackrock EEG/EMG workflow</h2>
            <p>
              The Python workflow processes Blackrock .ns2/.ns3 recordings and
              generates referenced EEG/EMG traces, STFT power spectra, event
              tables, and summary figures. The included 2,000-Hz synthetic NPZ
              starts at the processed-signal stage and is a workflow test, not
              manuscript source data.
            </p>
            <a className="repoLink" href="/docs/README_Fig4c_EEG.md">
              Read data and usage notes →
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
        <span>SynC EEG analysis resources</span>
        <Link href="/">Back to analysis resources</Link>
      </footer>
    </main>
  );
}
