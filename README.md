# SynC paper analysis resources

This repository publishes statistical methods, frozen source tables, and
reproducible Python scripts supporting the SynC manuscript.

## Published analyses

- **Figure 4c:** dedicated EEG/EMG preprocessing and spectral-analysis page,
  with the Blackrock workflow, a synthetic processed-signal demo, and usage
  notes kept separate from the resampling-statistics code.
- **Extended Data Figure 4h-k:** MATLAB plotting and non-parametric analysis of
  visual-cortex calcium traces, orientation-selective cell counts, orientation
  selectivity index, and preferred-orientation stability, paired with the
  frozen source-data workbook.
- **Figure 4e:** exact mouse-level sign-flip tests, including dependence-aware
  Romano-Wolf step-down maxT adjustment across the plotted groups and the paired
  first-versus-second A/C comparison.
- **Figure 4g:** animal-level exact group-label permutation tests with
  two-sided Romano-Wolf step-down maxT adjustment; occupancy and feeding use studentized
  mean differences, whereas the discrete laser score uses an unstudentized
  mean difference.
- **Extended Data Figure 6c,f:** mouse-level studentized exact group-label
  permutation tests with Romano-Wolf step-down maxT adjustment across the three
  displayed periods, separately for distance and velocity.
- **Figure 5:** paired studentized exact sign-flip permutation analysis of population
  activity.
- **Figure 6g:** 40-80-s mean spine-volume change analysed at the individual-
  spine level with two-sided studentized permutation tests and a prespecified
  fixed sequence for the two SynC contrasts.
- **Figure 6h / Extended Data Figure 10:** Normal-Exponential (Ex-Gaussian) mixture model,
  condition-specific mixture fractions, direct studentized permutation tests
  of re-estimated mixture fractions, and distributional audit.

The website provides the Figure 4c electrophysiology package under
`/eeg-analysis`, MATLAB resources under `/matlab-code`, and resampling code,
inputs, results, and README downloads under `/python-code`.
Analysis-specific provenance and execution instructions are stored in
`public/docs/`.

## Local development

Node.js 22.13 or newer is required.

```bash
npm install
npm run dev
```

Validate a production build and the rendered routes with:

```bash
npm test
```

## Reproducibility files

- `public/code/`: MATLAB and Python analysis and audit scripts.
- `public/data/`: public, path-sanitised input and reported-result CSVs.
- `public/docs/`: methods, model definitions, seeds, replicate counts, source
  hashes, and adopted fixed-run results.
