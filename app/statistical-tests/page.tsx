import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Statistical analyses | SynC",
  description:
    "Statistical procedures and reproducibility files supporting the SynC manuscript.",
};

const deltaVResults = [
  [
    "SynC@FPC before A/C vs 0–1 h after A/C",
    "0.0129",
    "First in fixed sequence",
  ],
  [
    "SynC@FPC 1–3 h after A/C vs 0–1 h after A/C",
    "0.00708",
    "Confirmatory after first rejection",
  ],
  [
    "SynC-dGAP@FPC before A/C vs 0–1 h after A/C",
    "0.849",
    "Descriptive",
  ],
  [
    "SynC-dGAP@FPC 0–1 h after A/C vs 1–3 h after A/C",
    "0.882",
    "Descriptive",
  ],
];

const permissiveResults = [
  ["SynC@FPC before A/C vs 0–1 h after A/C", "0.00509"],
  ["SynC@FPC 1–3 h after A/C vs 0–1 h after A/C", "0.0499"],
  ["SynC-dGAP@FPC before A/C vs 0–1 h after A/C", "0.802"],
  ["SynC-dGAP@FPC 0–1 h after A/C vs 1–3 h after A/C", "0.750"],
];

export default function StatisticalTestsPage() {
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
          <Link href="/behavioural-analysis">Behavioural analysis</Link>
        </div>
      </nav>

      <header className="subpageHero">
        <p className="eyebrow">Statistical methods</p>
        <h1>Analysis definitions and reproducibility records</h1>
        <p className="lead">
          Prespecified endpoints, sampling units, statistical models, and
          downloadable source tables used for the SynC manuscript.
        </p>
      </header>

      <article
        className="methodArticle"
        id="fig4e-signflip"
        aria-label="Figure 4e exact sign-flip analysis"
      >
        <section>
          <p className="sectionLabel">Figure 4e · Statistical analysis</p>
          <h2>Exact sign-flip tests preserving repeat measurements</h2>
          <p>
            Cumulative State-C time was tested against zero for all seven
            plotted groups using studentized mouse-level sign-flip statistics
            and a Romano–Wolf step-down maxT adjustment. Seven mice contributed both a
            first- and second-A/C measurement; their two observations shared
            the same sign in every permutation, while the remaining 22
            first-A/C mice were flipped independently.
          </p>
          <div className="methodGrid">
            <div>
              <span>Joint family</span>
              <strong>2²⁹ = 536,870,912 assignments</strong>
            </div>
            <div>
              <span>First A/C</span>
              <strong>step-down maxT P = 3.73 × 10⁻⁹</strong>
            </div>
            <div>
              <span>Second A/C</span>
              <strong>step-down maxT P = 0.0156</strong>
            </div>
          </div>
          <p>
            The secondary ID-matched first-versus-second comparison used a
            two-sided exact paired sign-flip test. All 128 assignments were
            enumerated, giving P = 0.234375. Exact enumeration was used
            throughout, so no random seed was required.
          </p>
          <div className="articleLinks">
            <a className="repoLink" href="/python-code#fig4e-signflip">
              Python script, mouse-level inputs, and reported results →
            </a>
            <a
              className="repoLink"
              href="/docs/README_Fig4e_exact_signflip.md"
              download
            >
              Download analysis README
            </a>
          </div>
        </section>
      </article>

      <article
        className="methodArticle"
        id="fig4g-permutation"
        aria-label="Figure 4g exact permutation analysis"
      >
        <section>
          <p className="sectionLabel">Figure 4g · Statistical analysis</p>
          <h2>Animal-level exact permutation tests</h2>
          <p>
            WT and SynC groups were compared by two-sided exact permutation
            tests. The animal was the permutation unit: group labels were
            reassigned while all time windows and each animal&apos;s missing-value
            pattern were retained together.
          </p>
          <div className="methodGrid">
            <div>
              <span>Occupancy</span>
              <strong>Studentized · 24,310 assignments</strong>
            </div>
            <div>
              <span>Laser response</span>
              <strong>Unstudentized · 75,582 assignments</strong>
            </div>
            <div>
              <span>Feeding</span>
              <strong>Studentized · 6,435 assignments</strong>
            </div>
          </div>
          <p>
            Multiplicity across post-injection windows was controlled within
            each analysis using the Romano–Wolf step-down maxT procedure. The discrete
            laser score, which contains frequent ties, used the unstudentized
            difference in means; occupancy and feeding used studentized mean
            differences. Complete enumeration was used, so no random seed was
            required.
          </p>
          <p>
            Step-down maxT P values, in chronological order, were 0.00905,
            0.000411, 0.00905, and 0.206 for occupancy; 0.0200, 0.00677,
            0.357, and 0.357 for laser response; and 0.0191 and 0.856 for
            feeding latency.
          </p>
          <div className="articleLinks">
            <a className="repoLink" href="/python-code#fig4g-permutation">
              Python script, animal-level inputs, and reported results →
            </a>
            <a
              className="repoLink"
              href="/docs/README_Fig4g_exact_permutation.md"
              download
            >
              Download analysis README
            </a>
          </div>
        </section>
      </article>

      <article
        className="methodArticle"
        id="fig5-permutation"
        aria-label="Figure 5 permutation analysis"
      >
        <section>
          <p className="sectionLabel">Input data</p>
          <h2>Ten mice across two behavioural states</h2>
          <p>
            Each row of the processed input table contains one mouse-level
            estimate for a specified metric, behavioural state, and time window.
            The states were classified as <strong>Immobile</strong> or{" "}
            <strong>Mobile</strong>.
          </p>
          <div className="methodGrid">
            <div>
              <span>Before A/C</span>
              <strong>−45 to 0 min</strong>
            </div>
            <div>
              <span>After A/C</span>
              <strong>0 to 45 min</strong>
            </div>
            <div>
              <span>1 h after A/C</span>
              <strong>45 to 120 min</strong>
            </div>
          </div>
          <h3>Reported metrics</h3>
          <ol>
            <li>Firing rate</li>
            <li>Mean pairwise Spearman correlation</li>
            <li>Normalised participation ratio (PR norm)</li>
            <li>
              Normalised number of principal components explaining 50% of the
              variance (PC50 norm)
            </li>
          </ol>
          <p>
            Mean pairwise Spearman correlation is the signed mean of pairwise
            coefficients across the recorded neuronal population. PR norm
            represents effective dimensionality calculated from the covariance
            eigenvalue spectrum and normalised by neuronal number. PC50 norm is
            the number of principal components required to explain 50% of
            population variance, also normalised by neuronal number.
          </p>
        </section>

        <section>
          <p className="sectionLabel">Statistical analysis</p>
          <h2>Two-sided paired exact sign-flip permutation test</h2>
          <p>
            For each mouse, the paired difference was calculated as the
            comparison value minus its Before value. The test statistic was the
            mean within-mouse difference.
          </p>
          <div className="equation">
            d<sub>i</sub> = Y<sub>i, comparison</sub> − Y<sub>i, Before</sub>
          </div>
          <div className="equation">
            T<sub>obs</sub> = (1/n) Σ d<sub>i</sub>
          </div>
          <p>
            Under the null hypothesis, the sign of each within-mouse difference
            was considered exchangeable. With n = 10, all 2¹⁰ = 1,024 possible
            sign assignments were enumerated. The exact two-sided P value was
            the proportion of permuted absolute statistics at least as large as
            the observed absolute statistic.
          </p>
          <h3>Comparisons</h3>
          <ol>
            <li>After A/C versus Before A/C</li>
            <li>1 h after A/C versus Before A/C</li>
          </ol>
          <p>
            Comparisons were performed separately for Immobile and Mobile
            periods using a prespecified fixed sequence. The second comparison
            was interpreted as confirmatory only when the first was
            significant. No additional multiplicity adjustment was applied
            within each fixed sequence; both nominal exact P values are
            reported for transparency.
          </p>
        </section>

        <section>
          <p className="sectionLabel">Outputs and files</p>
          <h2>Reproducible analysis package</h2>
          <p>
            The script generates a CSV results table, an Excel workbook with
            summary and individual-mouse values, plots of individual
            trajectories and mean ± s.e.m., and the exact permutation P values.
          </p>
          <div className="articleLinks">
            <a className="repoLink" href="/python-code#fig5-permutation">
              Python script and input data →
            </a>
            <a
              className="repoLink"
              href="/docs/README_Fig5_permutation.md"
              download
            >
              Download original README
            </a>
          </div>
        </section>
      </article>

      <article
        className="methodArticle"
        id="fig6-spine-analysis"
        aria-label="Figure 6 and Extended Data Figure 10 spine analysis"
      >
        <section>
          <p className="sectionLabel">Figure 6 · Analysis cohort</p>
          <h2>In vivo stimulated-spine enlargement</h2>
          <p>
            The frozen source package contains 1,088 ROI-level endpoints. The
            primary continuous endpoint is the mean volume change from 40 to
            80 s after stimulation. Individual stimulated spines are the
            analysis observations for Figure 6g,h. FOV membership is retained
            for provenance, homogeneity checks, and display summaries.
          </p>
          <div className="methodGrid">
            <div>
              <span>Stimulated</span>
              <strong>565 spines · 158 FOVs · 11 mice</strong>
            </div>
            <div>
              <span>Neighbouring</span>
              <strong>523 spines · 135 FOVs · 9 mice</strong>
            </div>
            <div>
              <span>Primary endpoint</span>
              <strong>Mean ΔV, 40-80 s</strong>
            </div>
          </div>
        </section>

        <section>
          <p className="sectionLabel">Figure 6 · Image quantification</p>
          <h2>Response-blind brightness correction</h2>
          <p>
            Spine-head fluorescence was locally background-subtracted and
            corrected for field-wide and local intensity fluctuations using an
            equal-weight combination of ROI-external global and local reference
            signals from the same FOV. The correction pipeline was applied
            identically to all ROIs and conditions; genotype, drug condition,
            ROI role, and response magnitude were not inputs during its
            application.
          </p>
          <p>
            No ROI-response-derived early rescue was used for the primary
            40-80-s endpoint. ΔV was normalised to the prestimulation baseline.
            Measurements acquired during optical stimulation from 0 to 4 s
            were omitted because of stimulation artefacts. The displayed time
            courses use non-overlapping 10-s, 4-s, or 2-s bins according to the
            plotted range; endpoint estimation and testing use retained
            unbinned measurements.
          </p>
        </section>

        <section>
          <p className="sectionLabel">Figure 6g,h · Analysis rationale</p>
          <h2>Why two complementary analyses were used</h2>
          <p>
            Figure 6g provides the primary, threshold-free analysis of response
            magnitude using spine-level mean ΔV from 40 to 80 s. Because the null
            and positive-response distributions overlap, classification using
            a single binary threshold would be sensitive to the choice of
            threshold. Figure 6h therefore complements this analysis by using a
            Normal-Exponential (Ex-Gaussian) mixture model to estimate the condition-specific
            permissive fraction. Between-condition tests directly compare this
            fitted fraction by re-estimating it after each group-label
            permutation. Thus, Figure 6g tests the continuous
            response magnitude directly, whereas Figure 6h describes the
            model-dependent heterogeneity underlying that response.
          </p>
        </section>

        <section>
          <p className="sectionLabel">Figure 6g · Continuous endpoint</p>
          <h2>Two-sided spine-level studentized permutation</h2>
          <p>
            Mean ΔV from 40 to 80 s was calculated for every stimulated spine.
            Group contrasts used Welch-type studentized mean differences and
            100,000 group-label permutations preserving group sizes. Monte
            Carlo P values used the plus-one correction and fixed seeds.
          </p>
          <p>
            The prespecified SynC@FPC before A/C versus 0–1 h after A/C
            contrast is tested first. The recovery SynC@FPC contrast is
            confirmatory only after rejection of the first null hypothesis.
            No additional multiplicity adjustment is applied within this fixed
            sequence. SynC-dGAP@FPC comparisons are descriptive controls.
          </p>
          <div className="resultTable" role="table" aria-label="Figure 6g P values">
            <div className="resultRow resultHeader" role="row">
              <span role="columnheader">Contrast</span>
              <span role="columnheader">P</span>
              <span role="columnheader">Policy</span>
            </div>
            {deltaVResults.map(([contrast, pValue, policy]) => (
              <div className="resultRow" role="row" key={contrast}>
                <span role="cell" data-label="Contrast">{contrast}</span>
                <strong role="cell" data-label="P">{pValue}</strong>
                <span role="cell" data-label="Policy">{policy}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="sectionLabel">Figure 6h · Permissive fraction</p>
          <h2>Normal-Exponential (Ex-Gaussian) mixture-fraction permutation</h2>
          <p>
            A zero-centred Normal null distribution was estimated from all
            pooled neighbouring spines (σ = 9.374%). The positive latent
            component was an Exponential distribution with scale θ = 34.429%;
            after convolution with Normal measurement noise, it defines the
            positive-response density. The positive-component fraction π was
            estimated separately for each condition.
          </p>
          <p>
            The bars and tests use the same condition-specific mixture fraction
            π. The shared Normal and positive-component parameters were held at
            their frozen Extended Data Fig. 10 values. Group labels were
            permuted 100,000 times; π was re-estimated separately in both groups
            for every permutation, and its difference was studentized by the
            observed information. The SynC contrasts followed the same fixed
            sequence as Figure 6g; dGAP contrasts were descriptive.
          </p>
          <h3>Direct mixture-fraction comparisons</h3>
          <div className="resultTable" role="table" aria-label="Figure 6h P values">
            <div className="resultRow resultRowTwo resultHeader" role="row">
              <span role="columnheader">Contrast</span>
              <span role="columnheader">P</span>
            </div>
            {permissiveResults.map(([contrast, pValue]) => (
              <div className="resultRow resultRowTwo" role="row" key={contrast}>
                <span role="cell" data-label="Contrast">{contrast}</span>
                <strong role="cell" data-label="P">{pValue}</strong>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="sectionLabel">Extended Data Figure 10</p>
          <h2>Distributional display</h2>
          <p>
            The selected figure uses one-percentile percentograms: variable-width
            bins containing approximately equal numbers of observations, with
            density calculated as count divided by sample size and bin width.
            This display makes the positive tail visible on a logarithmic axis.
            Percentograms are used only for visualisation. Mixture fitting and
            between-condition inference use unbinned spine-level endpoints.
          </p>
        </section>

        <section>
          <p className="sectionLabel">Figure 6 / Extended Data Figure 10 · Files</p>
          <h2>Frozen source and reproducibility package</h2>
          <p>
            Public CSVs omit local filesystem paths and replace original mouse,
            FOV, and spine labels with stable opaque aliases. The
            aliases preserve the analysis hierarchy while keeping the private
            correspondence table outside the distributed package. Every
            endpoint, FOV assignment, posterior probability, model parameter,
            and reported test result needed to audit the figures is retained.
          </p>
          <div className="articleLinks">
            <a className="repoLink" href="/python-code#fig6-permutation">
              Fig. 6g,h permutation code →
            </a>
            <a className="repoLink" href="/python-code#exfig10-mixture">
              Mixture audit code →
            </a>
            <a
              className="repoLink"
              href="/docs/README_Fig6_ExFig10.md"
              download
            >
              Download full README
            </a>
          </div>
        </section>
      </article>

      <footer>
        <span>SynC statistical methods</span>
        <Link href="/">Back to analysis resources</Link>
      </footer>
    </main>
  );
}
