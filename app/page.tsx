import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SynC | Analysis code",
  description:
    "Analysis code and statistical methods supporting the SynC manuscript.",
};

const codeItems = [
  {
    title: "EEG analysis",
    figure: "Figure 4c",
    description:
      "Blackrock .ns2/.ns3 preprocessing and spectral analysis used for Fig. 4c, with code, a 2,000-Hz synthetic processed-signal demo, and usage notes.",
    status: "View Fig. 4c resources →",
    href: "/python-code#fig4c-eeg",
  },
  {
    title: "Visual-cortex analysis",
    figure: "Extended Data Figure 4h–k",
    description:
      "MATLAB plotting and statistical analysis for Extended Data Fig. 4h–k, paired with the frozen source-data workbook used for the resubmission.",
    status: "View MATLAB code and data →",
    href: "/matlab-code",
  },
  {
    title: "Imaging analysis",
    figure: "Figure 6g,h · Extended Data Figure 10",
    description:
      "Methods, frozen spine-level source tables, and permutation code for Fig. 6g,h and the Extended Data Fig. 10 mixture model.",
    status: "View Fig. 6 resources →",
    href: "/statistical-tests#fig6-spine-analysis",
  },
  {
    title: "Behavioural analysis",
    figure: "Extended Data Figure 8",
    description:
      "Python workflows for food-approach and laser-response analyses using DeepLabCut-derived tracking data.",
    status: "View code →",
    href: "/behavioural-analysis",
  },
];

const resamplingItem = {
  title: "Resampling statistics",
  figure: "Figures 4e and 4g",
  description:
    "Mouse- and animal-level exact permutation inputs, code, and Romano–Wolf step-down maxT results, with dependence and studentization choices recorded explicitly.",
  status: "View Fig. 4e and 4g resources →",
  href: "/statistical-tests#fig4e-signflip",
};

export default function Home() {
  return (
    <main id="main-content">
      <a className="skipLink" href="#main-content">
        Skip to content
      </a>
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top">
          SynC
        </a>
        <div className="navLinks">
          <a href="#code">Code</a>
          <a href="/statistical-tests">Statistics</a>
          <a href="/python-code">Python code</a>
          <a href="/matlab-code">MATLAB code</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <p className="eyebrow">Code and analysis resources</p>
        <h1>
          Rapid associative spine enlargement is required for cognitive
          function and stable wakefulness
        </h1>
        <p className="lead">
          Analysis code and statistical information supporting the manuscript.
          Materials will be updated as the study proceeds toward publication.
        </p>
        <p className="authors">
          Siqi Zhou, Takeshi Sawada, Hitoshi Okazaki, Tomoki Arima, Shunki
          Takaramoto, Sadam Khan Panezai, Masanari Ohtsuka, Shin-Ichiro Terada,
          Masashi Kondo, Takaaki Hashimoto, Kenichi Ohki, Masanori Matsuzaki,
          Sho Yagishita &amp; Haruo Kasai
        </p>
      </section>

      <section className="codeSection" id="code">
        <div className="sectionIntro">
          <p className="sectionLabel">Analysis code</p>
          <h2>Code used in the manuscript</h2>
          <p>
            The repository contains analysis scripts used to produce the
            reported results. File names and brief usage notes will be added as
            the code is consolidated.
          </p>
        </div>

        <div className="codeList">
          {codeItems.map((item) => {
            const content = (
              <>
                <div>
                  <h3>{item.title}</h3>
                  <p className="itemFigure">{item.figure}</p>
                  <p>{item.description}</p>
                </div>
                <span className="status">{item.status}</span>
              </>
            );

            if (!item.href) {
              return <div key={item.title}>{content}</div>;
            }

            const isExternal = item.href.startsWith("http");
            return (
              <a
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                key={item.title}
              >
                {content}
              </a>
            );
          })}
          <div className="statisticalItem">
            <div>
              <h3>Statistical analysis</h3>
              <p className="itemFigure">
                Figures 4e, 4g, 5, 6g,h · Extended Data Figure 10
              </p>
              <p>
                Descriptions of the statistical tests and the corresponding
                Python scripts used in the manuscript.
              </p>
            </div>
            <div className="codeActions">
              <a href="/statistical-tests">Test descriptions →</a>
              <a href="/python-code">Python scripts →</a>
            </div>
          </div>
          <a href={resamplingItem.href}>
            <div>
              <h3>{resamplingItem.title}</h3>
              <p className="itemFigure">{resamplingItem.figure}</p>
              <p>{resamplingItem.description}</p>
            </div>
            <span className="status">{resamplingItem.status}</span>
          </a>
        </div>
      </section>

      <footer>
        <span>SynC analysis resources</span>
        <span>Pre-publication draft</span>
      </footer>
    </main>
  );
}
