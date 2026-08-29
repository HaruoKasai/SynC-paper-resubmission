# SynC paper analysis resources

This repository publishes statistical methods, frozen source tables, and
reproducible Python scripts supporting the SynC manuscript.

## Published analyses

- **Figure 4e:** exact mouse-level sign-flip tests, including dependence-aware
  Romano-Wolf step-down maxT adjustment across the plotted groups and the paired
  first-versus-second A/C comparison.
- **Figure 4g:** animal-level exact group-label permutation tests with
  two-sided Romano-Wolf step-down maxT adjustment; occupancy and feeding use studentized
  mean differences, whereas the discrete laser score uses an unstudentized
  mean difference.
- **Figure 5:** paired studentized exact sign-flip permutation analysis of population
  activity.
- **Figure 6g:** 40-80-s mean spine-volume change analysed at the individual-
  spine level with two-sided studentized permutation tests and a prespecified
  fixed sequence for the two SynC contrasts.
- **Figure 6h / Extended Data Figure 10:** Normal-Exponential (Ex-Gaussian) mixture model,
  condition-specific mixture fractions, direct studentized permutation tests
  of re-estimated mixture fractions, and distributional audit.

The website provides method summaries under `/statistical-tests` and direct
downloads under `/python-code`. Analysis-specific provenance and execution
instructions are stored in `public/docs/`.

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

- `public/code/`: Python analysis and audit scripts.
- `public/data/`: public, path-sanitised input and reported-result CSVs.
- `public/docs/`: methods, model definitions, seeds, replicate counts, source
  hashes, and adopted fixed-run results.
