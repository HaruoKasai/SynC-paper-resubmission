# Figure 6 and Extended Data Figure 10 reproducibility record

This package publishes the frozen 40-80-s spine-enlargement endpoint, FOV
summaries, fitted mixture parameters, and the adopted 100,000-permutation
two-sided tests used for Fig. 6g,h and Extended Data Fig. 10.

## Frozen source

- Freeze version: `tyx_fig6_f2_g3_frozen_integrated_20260810_v4`
- Source commit: `9c6a8a01a53769e9bec234886af31654bd60ee6e`
- Frozen ROI rows: 1,088
- Stimulated: 565 spines, 158 FOVs, 11 mice
- Neighbouring: 523 spines, 135 FOVs, 9 mice

SHA-256 hashes of the internal frozen inputs are:

| Internal frozen file | SHA-256 |
| --- | --- |
| `fov_summary.csv` | `FB81B66BB0C4ACB4ABFF23F51B0504456821C2F7B2B98C8F26133117803332DB` |
| `spine_endpoint_40_80_and_posterior.csv` | `BC47A7E3231DA81491172E25C12652B970845424FBDB1402718B0CC9D832FC47` |
| `mixture_parameters.csv` | `E431E8CB0D6B6ED84EF4AF0607AC3F2860BBB0D975A333ADECE2581A5827336E` |
| 100,000-permutation two-sided result CSV | `E956C23AA73C2217109425DA8DE6AFE06F78694A2E097B3FC50BFDE1CA810599` |
| Adopted Fig. 6g,h permutation script | `2DA1920334FF35CD2936AD53F3C13A31D44916B25D2B100B979ABE2F9AB42D87` |

The public CSVs exclude local filesystem paths and redundant internal columns.
Original mouse, FOV, and spine labels are replaced by stable opaque aliases.
These aliases preserve the mouse/FOV/spine hierarchy across files, but the
private correspondence table is not distributed. Endpoint values,
condition-specific posterior probabilities, and group mixture fractions are
unchanged. The Fig. 6h FOV table contains the within-FOV means of those frozen
condition-specific posterior probabilities.

Rows in the public source tables follow the display order: WT, the three SynC
conditions in chronological order, and the three SynC-dGAP conditions in
chronological order. Within each condition, stable mouse, FOV, and spine aliases
determine row order. The `permutation_order` column preserves the frozen input
sequence that generated the adopted seeded Monte Carlo results; the analysis
script restores that sequence before permutation, so presentation sorting does
not alter the reported P values.

## Cohort

| Condition | Stimulated spines | FOVs | Mice |
| --- | ---: | ---: | ---: |
| WT | 82 | 24 | 2 |
| SynC@FPC before A/C | 110 | 30 | 5 |
| SynC@FPC 0–1 h after A/C | 55 | 16 | 5 |
| SynC@FPC 1–3 h after A/C | 115 | 33 | 5 |
| SynC-dGAP@FPC before A/C | 79 | 21 | 4 |
| SynC-dGAP@FPC 0–1 h after A/C | 54 | 14 | 4 |
| SynC-dGAP@FPC 1–3 h after A/C | 70 | 20 | 3 |

## Image quantification and endpoint

Spine-head fluorescence was locally background-subtracted and corrected for
field-wide and local intensity fluctuations using an equal-weight combination
of ROI-external global and local reference signals from the same FOV. Once
specified, the same pipeline was applied to stimulated and neighbouring ROIs
in every genotype and drug condition. Genotype, drug condition, ROI role, and
response magnitude were not inputs during application of the correction.

The primary endpoint is mean Delta V from 40 to 80 s after stimulation. No
ROI-response-derived early rescue was used for this endpoint. Measurements
during optical stimulation (0-4 s) were omitted because of stimulation
artefacts. Binning in Fig. 6c-f is for display only; endpoint estimation and
testing use retained unbinned measurements.

## Figure 6g: continuous endpoint

The analysis observations are individual stimulated spines. FOV membership is
retained for provenance, homogeneity checks, and display summaries, but FOVs
are not averaged for inference. Each contrast uses a two-sided studentized
permutation test with the Welch-type difference in mean 40-80-s Delta V.
Group labels are reassigned while preserving the two group sizes.

The adopted Monte Carlo run uses 100,000 permutations. SynC@FPC before A/C
versus 0–1 h after A/C is tested first; the 1–3 h versus 0–1 h recovery
contrast is confirmatory only after rejection of the first null hypothesis.
No additional multiplicity adjustment is applied within this fixed sequence.
SynC-dGAP@FPC contrasts are descriptive and unadjusted.

| Contrast | P |
| --- | ---: |
| SynC@FPC before A/C vs 0–1 h after A/C | 0.0129 |
| SynC@FPC 1–3 h after A/C vs 0–1 h after A/C | 0.00708 |
| SynC-dGAP@FPC before A/C vs 0–1 h after A/C | 0.849 |
| SynC-dGAP@FPC 0–1 h after A/C vs 1–3 h after A/C | 0.882 |

## Figure 6h and Extended Data Figure 10: Normal-Exponential (Ex-Gaussian) mixture model

The pooled neighbouring-spine endpoints define a zero-centred Normal null with
sigma = 9.3740%. The latent positive component is Gamma with fitted shape 1.0;
it is therefore Exponential with scale theta = 34.4291%. The observed positive
density is the convolution of that Exponential component with Normal
measurement noise.

Condition-specific fitted positive-component fractions are:

| Condition | pi |
| --- | ---: |
| WT | 37.64% |
| SynC@FPC before A/C | 26.57% |
| SynC@FPC 0–1 h after A/C | 4.14% |
| SynC@FPC 1–3 h after A/C | 18.90% |
| SynC-dGAP@FPC before A/C | 23.69% |
| SynC-dGAP@FPC 0–1 h after A/C | 26.58% |
| SynC-dGAP@FPC 1–3 h after A/C | 23.01% |

Figure 6h displays the condition-specific mixture fraction pi estimated from
the Extended Data Fig. 10 model. Its test is therefore not the Fig. 6g test
applied to posterior scores. The shared null sigma and positive-component theta
are held at their frozen Extended Data Fig. 10 values. For every group-label
permutation, pi is re-estimated separately in both groups by maximum likelihood.
The pi difference is studentized using the observed information of the two
fitted fractions. Thus the hypothesis test directly targets the quantity shown
by the Fig. 6h bars.

The same SynC fixed sequence and descriptive dGAP policy used for Fig. 6g are
applied. The adopted run uses 100,000 Monte Carlo permutations unless otherwise
stated. Because the SynC recovery result was close to the 0.05 threshold, its
frozen Monte Carlo stream was extended to 3,000,000 permutations.

| Contrast | P |
| --- | ---: |
| SynC@FPC before A/C vs 0–1 h after A/C | 0.00509 |
| SynC@FPC 1–3 h after A/C vs 0–1 h after A/C | 0.0490 (3,000,000 permutations) |
| SynC-dGAP@FPC before A/C vs 0–1 h after A/C | 0.802 |
| SynC-dGAP@FPC 0–1 h after A/C vs 1–3 h after A/C | 0.750 |

Run the adopted analysis with:

```bash
python Fig6_spine_permutation.py Fig6_ExFig10_spine_input.csv \
  --parameters Fig6_ExFig10_mixture_parameters.csv \
  --output Fig6_ExFig10_reported_tests.csv
```

The script requires Python 3.12+ and NumPy. Seeds for every contrast and panel
are recorded in the result CSV.

The selected Extended Data Fig. 10 uses one-percentile percentograms. Bin
widths vary so that each bin contains approximately equal numbers of points;
the height is `count / (sample size x bin width)`, preserving density area.
Percentograms are visualisation only. Model fitting, posterior calculation,
and testing use unbinned endpoints.

Run the mixture audit with:

```bash
python ExFig10_mixture_audit.py Fig6_ExFig10_spine_input.csv \
  --parameters Fig6_ExFig10_mixture_parameters.csv
```

This script requires NumPy, pandas, and SciPy. It validates the frozen posterior
probabilities against the Normal-convolved Exponential density and reports the
condition-specific mixture fractions.

## Public files

- `Fig6_ExFig10_FOV_input.csv`: descriptive FOV summaries used for provenance,
  homogeneity checks, and display; not the inferential input.
- `Fig6_ExFig10_spine_input.csv`: path-sanitised frozen ROI endpoint table in
  figure order, with `permutation_order` retaining the frozen seeded-analysis
  sequence.
- `Fig6_ExFig10_cohort_counts.csv`: role/group cohort counts.
- `Fig6_ExFig10_mixture_parameters.csv`: frozen joint model parameters.
- `Fig6_ExFig10_reported_tests.csv`: adopted 100,000-permutation Fig. 6g/h
  SynC and dGAP results.
- `Fig6_spine_permutation.py`: adopted Fig. 6g continuous-endpoint and Fig. 6h
  mixture-fraction tests.

WT rows and the frozen `pi_WT` parameter remain in the spine-level source and
mixture-model files because WT is displayed in Extended Data Fig. 10. No WT
contrast is reported in the Fig. 6g/h hypothesis-test output.
