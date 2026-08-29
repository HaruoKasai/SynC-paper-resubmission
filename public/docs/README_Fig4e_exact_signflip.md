# Figure 4e exact sign-flip analyses

This package reproduces the Figure 4e tests of cumulative time spent in
State-C during the first hour after A/C.

## Primary family

All seven plotted groups are tested against zero using studentized sign-flip
statistics with a single-step maxT adjustment. The permutation unit is the
mouse. Seven mice were measured after both their first and second A/C
administrations; each paired mouse therefore receives the same sign in both
conditions. The other 22 mice in the first-A/C SynC@FPC group receive
independent signs.

The complete effective joint space contains 2^29 = 536,870,912 assignments.
The script evaluates it exactly by dynamic programming over the distribution
of signed sums rather than iterating over every assignment. No random-number
seed is used.

## Secondary paired comparison

The ID-matched second-minus-first differences from seven mice are tested with
a two-sided exact paired sign-flip permutation. All 2^7 = 128 assignments are
enumerated. Thirty assignments are at least as extreme as observed, giving
P = 30/128 = 0.234375.

## Files

- `Fig4e_exact_signflip_maxT.py`: dependency-free Python 3 analysis.
- `Fig4e_statec_input.csv`: the 110 plotted mouse-level values. Mouse IDs are
  included only where they were available in the source table; sequential
  source-row labels are not animal identifiers.
- `Fig4e_reported_tests.csv`: frozen output adopted in the manuscript and
  Source Data 1.

## Run

From the repository root:

```bash
python3 public/code/Fig4e_exact_signflip_maxT.py \
  --input public/data/Fig4e_statec_input.csv \
  --output /tmp/Fig4e_recalculated.csv
```

Compare the recalculated file with `public/data/Fig4e_reported_tests.csv`.
