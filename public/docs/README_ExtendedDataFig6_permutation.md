# Extended Data Figure 6c,f exact permutation analysis

This package reproduces the WT-versus-SynC@FPC comparisons for the laser-dot
and food-pellet AUC panels in Extended Data Figure 6c and 6f. The statistical
unit is the mouse.

## Tests

The test statistic is the studentized difference in group means. Group labels
are reassigned across mice while each mouse's complete set of periods and its
missing-value pattern remain together. Distance and velocity are separate
multiplicity families; within each measure, the three displayed periods
(before i.p. A/C, 0–50 min after A/C, and 60–90 min after A/C) are adjusted by
the Romano–Wolf step-down maxT procedure. All label assignments are enumerated:
11,440 for Extended Data Figure 6c and 6,435 for Extended Data Figure 6f.

Two-sided P values use the absolute studentized statistic. Figure labels are
derived from the adjusted P values: `*` for P < 0.05, `**` for P < 0.01, and
`n.s.` otherwise.

## Identifier limitation

The supplied summary CSV files contained values in mouse-wise row order but
did not contain original mouse identifiers. The input files therefore use
sequential audit identifiers (`WT_01`, `SynC_01`, and so on) while preserving
that row order. In Extended Data Figure 6c, the blank late-period cells preserve
the supplied reduction from 7 WT and 9 SynC mice to 5 WT and 8 SynC mice. The
joint permutation analysis assumes that rows across periods refer to the same
mice, as in the supplied summaries.

## Files

- `ExtendedDataFig6_exact_permutation_maxT.py`: dependency-free Python 3 analysis.
- `ExtendedDataFig6c_laser_input.csv`: laser-dot animal-level AUC inputs.
- `ExtendedDataFig6f_food_input.csv`: food-pellet animal-level AUC inputs.
- `ExtendedDataFig6_reported_tests.csv`: frozen output used in the manuscript
  and Source Data.
- `ExtendedDataFigure6_source_data.xlsx`: submission-format Source Data
  workbook containing the plotted individual values and frozen test results.

## Run

From the repository root:

```bash
python3 public/code/ExtendedDataFig6_exact_permutation_maxT.py \
  --data-dir public/data \
  --output /tmp/ExtendedDataFig6_recalculated.csv
```

Compare the recalculated file with
`public/data/ExtendedDataFig6_reported_tests.csv`.
