# Extended Data Figure 4 visual-cortex analysis

This package contains the MATLAB plotting and statistical-analysis code for
Extended Data Figure 4h-k and the corresponding frozen source-data workbook
used for the SynC manuscript resubmission.

## Files

- `ExtendedDataFig4_plot_code.m`: MATLAB code for panels h-k. The source values
  are embedded in the script, matching the original analysis resource.
- `ExtendedDataFig4_source_data.xlsx`: tidy source tables for panels h-k,
  including individual mouse values, means, s.e.m. values, and reported tests.

## Analysis coverage

- Panel h: trial-averaged calcium-response traces for sessions 1-3. Each trace
  contains 1,920 sequential samples. The supplied data did not contain an
  explicit timestamp or sampling-interval vector, so the workbook reports
  sample order without inferring time in seconds.
- Panel i: number of orientation-selective cells in five mice across three
  sessions; Friedman test, chi-square(2) = 3.60, P = 0.165.
- Panel j: mean orientation selectivity index in the same five mice; Friedman
  test, chi-square(2) = 0.40, P = 0.819.
- Panel k: mean change in preferred orientation for sessions 1-2 and sessions
  2-3; two-sided paired Wilcoxon signed-rank test, P = 0.125.

## Running the MATLAB code

Open `ExtendedDataFig4_plot_code.m` in MATLAB and run the script. The plotting
sections use base MATLAB. The `friedman` and `signrank` calls require the
Statistics and Machine Learning Toolbox.

The script is self-contained and does not require the workbook at run time.
The workbook is supplied as a machine-readable audit table for the values
displayed in the figure and used in the tests.

## Provenance

The MATLAB script was copied without analytical changes from
`HaruoKasai/SynC-paper-site`, commit
`4964190cdbfe56bfde9a86bf711b0394d2005060`, path
`public/code/ExtendedDataFig4_plot_code.m`.

SHA-256 checksums:

- MATLAB code: `383de5dec13dafea6748fa19fe1d93e764b56a08a1d028717486dcff991acc1c`
- Source-data workbook: `309776af3857b4e9247d1f166e31c37bee59791aa589e78275179b8d2ca0bd43`
