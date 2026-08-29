# Figure 4g exact permutation analysis

This package reproduces the two-sided group comparisons reported for Figure 4g.
The permutation unit is the animal. Group labels are reassigned across animals
while each animal's complete set of time windows and its missing-value pattern
remain together.

## Tests

- Occupancy: studentized difference in group means; all 24,310 assignments of
  9 WT labels among 17 animals are enumerated.
- Laser response: unstudentized difference in group means; all 75,582
  assignments of 8 WT labels among 19 animals are enumerated. The
  unstudentized statistic is used because the outcome is a discrete score with
  frequent ties.
- Feeding: studentized difference in group means; all 6,435 assignments of 8 WT
  labels among 15 animals are enumerated.

Two-sided P values use the absolute statistic. Within each analysis, the
reported multiplicity-adjusted P values use the Romano-Wolf step-down maxT procedure over
the displayed post-injection time windows. Exact enumeration is used, so no
random-number seed is required. The pre-injection window was treated as a
baseline check and was not included in the maxT family.

## Files

- `Fig4g_exact_permutation_maxT.py`: dependency-free Python 3 analysis.
- `Fig4g_occupancy_input.csv`: animal-level occupancy inputs.
- `Fig4g_laser_input.csv`: animal-level laser-response inputs; blank cells are
  missing observations.
- `Fig4g_feeding_input.csv`: animal-level feeding inputs.
- `Fig4g_reported_tests.csv`: frozen output adopted in the manuscript and
  Source Data 1.

## Run

From the repository root:

```bash
python3 public/code/Fig4g_exact_permutation_maxT.py \
  --data-dir public/data \
  --output /tmp/Fig4g_recalculated.csv
```

Compare the recalculated file with `public/data/Fig4g_reported_tests.csv`.
