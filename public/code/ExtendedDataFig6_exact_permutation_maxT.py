#!/usr/bin/env python3
"""Reproduce Extended Data Fig. 6c,f exact permutation step-down maxT tests."""

from __future__ import annotations

import argparse
import csv
from itertools import combinations
from math import sqrt
from pathlib import Path


ANALYSES = {
    "E6c_laser": "ExtendedDataFig6c_laser_input.csv",
    "E6f_food": "ExtendedDataFig6f_food_input.csv",
}
MEASURES = {
    "Distance": ["distance_before", "distance_0_50", "distance_60_90"],
    "Velocity": ["velocity_before", "velocity_0_50", "velocity_60_90"],
}
PERIODS = ["Before i.p. A/C", "0–50 min after A/C", "60–90 min after A/C"]


def mean(values: list[float]) -> float:
    return sum(values) / len(values)


def variance(values: list[float]) -> float:
    centre = mean(values)
    return sum((value - centre) ** 2 for value in values) / (len(values) - 1)


def studentized_difference(wt: list[float], sync: list[float]) -> float:
    difference = mean(sync) - mean(wt)
    standard_error = sqrt(variance(wt) / len(wt) + variance(sync) / len(sync))
    if standard_error == 0:
        return 0.0 if difference == 0 else float("inf")
    return difference / standard_error


def read_input(path: Path) -> tuple[list[str], list[str], list[dict[str, float | None]]]:
    with path.open(newline="", encoding="utf-8") as handle:
        records = list(csv.DictReader(handle))
    animals = [record["animal"] for record in records]
    groups = [record["group"] for record in records]
    rows = []
    for record in records:
        rows.append(
            {
                column: float(record[column]) if record[column] else None
                for columns in MEASURES.values()
                for column in columns
            }
        )
    return animals, groups, rows


def exact_family(
    analysis: str,
    measure: str,
    columns: list[str],
    groups: list[str],
    rows: list[dict[str, float | None]],
) -> list[dict[str, str | int | float]]:
    wt_indices = [index for index, group in enumerate(groups) if group == "WT"]
    sync_indices = [index for index, group in enumerate(groups) if group == "SynC"]
    if len(wt_indices) + len(sync_indices) != len(rows):
        raise ValueError("Groups must be WT or SynC")

    observed_signed = []
    observed_absolute = []
    summaries = []
    for column in columns:
        wt = [rows[index][column] for index in wt_indices if rows[index][column] is not None]
        sync = [rows[index][column] for index in sync_indices if rows[index][column] is not None]
        statistic = studentized_difference(wt, sync)
        observed_signed.append(statistic)
        observed_absolute.append(abs(statistic))
        summaries.append((len(wt), len(sync), mean(wt), mean(sync)))

    order = sorted(
        range(len(columns)), key=lambda index: observed_absolute[index], reverse=True
    )
    raw_exceedances = [0] * len(columns)
    step_exceedances = [0] * len(columns)
    all_indices = set(range(len(rows)))
    total = 0

    for permuted_wt_tuple in combinations(range(len(rows)), len(wt_indices)):
        permuted_wt = set(permuted_wt_tuple)
        permuted_sync = all_indices - permuted_wt
        permuted_statistics = []
        for column in columns:
            wt = [rows[index][column] for index in permuted_wt if rows[index][column] is not None]
            sync = [rows[index][column] for index in permuted_sync if rows[index][column] is not None]
            permuted_statistics.append(abs(studentized_difference(wt, sync)))

        for index, observed in enumerate(observed_absolute):
            if permuted_statistics[index] >= observed - 1e-12:
                raw_exceedances[index] += 1
        for rank, index in enumerate(order):
            subset_maximum = max(permuted_statistics[item] for item in order[rank:])
            if subset_maximum >= observed_absolute[index] - 1e-12:
                step_exceedances[rank] += 1
        total += 1

    adjusted = [0.0] * len(columns)
    cumulative = 0.0
    for rank, index in enumerate(order):
        cumulative = max(cumulative, step_exceedances[rank] / total)
        adjusted[index] = cumulative

    output = []
    for index, period in enumerate(PERIODS):
        n_wt, n_sync, wt_mean, sync_mean = summaries[index]
        output.append(
            {
                "analysis": analysis,
                "measure": measure,
                "period": period,
                "n_WT": n_wt,
                "n_SynC": n_sync,
                "WT_mean": wt_mean,
                "SynC_mean": sync_mean,
                "statistic_type": "studentized mean difference",
                "statistic": observed_signed[index],
                "P_unadjusted": raw_exceedances[index] / total,
                "P_stepdown_maxT": adjusted[index],
                "figure_label": "**" if adjusted[index] < 0.01 else "*" if adjusted[index] < 0.05 else "n.s.",
                "permutations": total,
            }
        )
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path(__file__).resolve().parent.parent / "data",
    )
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    results = []
    for analysis, filename in ANALYSES.items():
        _, groups, rows = read_input(args.data_dir / filename)
        for measure, columns in MEASURES.items():
            results.extend(exact_family(analysis, measure, columns, groups, rows))

    writer_target = args.output.open("w", newline="", encoding="utf-8") if args.output else __import__("sys").stdout
    try:
        writer = csv.DictWriter(
            writer_target, fieldnames=list(results[0]), lineterminator="\n"
        )
        writer.writeheader()
        writer.writerows(results)
    finally:
        if args.output:
            writer_target.close()


if __name__ == "__main__":
    main()
