#!/usr/bin/env python3
"""Reproduce the Figure 4g exact permutation tests and step-down maxT P values."""

from __future__ import annotations

import argparse
import csv
from itertools import combinations
from math import sqrt
from pathlib import Path


ANALYSES = {
    "occupancy": ("Fig4g_occupancy_input.csv", True),
    "laser": ("Fig4g_laser_input.csv", False),
    "feeding": ("Fig4g_feeding_input.csv", True),
}


def mean(values: list[float]) -> float:
    return sum(values) / len(values)


def variance(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    centre = mean(values)
    return sum((value - centre) ** 2 for value in values) / (len(values) - 1)


def statistic(group_a: list[float], group_b: list[float], studentized: bool) -> float:
    difference = mean(group_b) - mean(group_a)
    if not studentized:
        return difference
    standard_error = sqrt(
        variance(group_a) / len(group_a) + variance(group_b) / len(group_b)
    )
    if standard_error == 0:
        return 0.0 if difference == 0 else float("inf")
    return difference / standard_error


def read_input(path: Path) -> tuple[list[str], list[str], list[list[float | None]]]:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames or reader.fieldnames[:3] != ["animal", "group", "unit"]:
            raise ValueError(f"Unexpected columns in {path}")
        windows = reader.fieldnames[3:]
        records = list(reader)
    groups = [record["group"] for record in records]
    rows = [
        [float(record[window]) if record[window] != "" else None for window in windows]
        for record in records
    ]
    return windows, groups, rows


def exact_test(
    analysis: str,
    windows: list[str],
    groups: list[str],
    rows: list[list[float | None]],
    studentized: bool,
) -> list[dict[str, str | int | float]]:
    wt_indices = [index for index, group in enumerate(groups) if group == "WT"]
    sync_indices = [index for index, group in enumerate(groups) if group == "SynC"]
    if len(wt_indices) + len(sync_indices) != len(rows):
        raise ValueError("Groups must be WT or SynC")

    observed_signed: list[float] = []
    observed: list[float] = []
    summaries: list[tuple[int, int, float, float]] = []
    for column in range(len(windows)):
        wt = [rows[index][column] for index in wt_indices if rows[index][column] is not None]
        sync = [rows[index][column] for index in sync_indices if rows[index][column] is not None]
        observed_value = statistic(wt, sync, studentized)
        observed_signed.append(observed_value)
        observed.append(abs(observed_value))
        summaries.append((len(wt), len(sync), mean(wt), mean(sync)))

    raw_exceedances = [0] * len(windows)
    order = sorted(range(len(windows)), key=lambda column: observed[column], reverse=True)
    step_exceedances = [0] * len(windows)
    all_indices = set(range(len(rows)))
    total = 0
    for permuted_wt_tuple in combinations(range(len(rows)), len(wt_indices)):
        permuted_wt = set(permuted_wt_tuple)
        permuted_sync = all_indices - permuted_wt
        permuted_statistics = []
        for column in range(len(windows)):
            wt = [rows[index][column] for index in permuted_wt if rows[index][column] is not None]
            sync = [rows[index][column] for index in permuted_sync if rows[index][column] is not None]
            permuted_statistics.append(abs(statistic(wt, sync, studentized)))
        for column, observed_value in enumerate(observed):
            if permuted_statistics[column] >= observed_value - 1e-12:
                raw_exceedances[column] += 1
        for rank, column in enumerate(order):
            subset_maximum = max(permuted_statistics[index] for index in order[rank:])
            if subset_maximum >= observed[column] - 1e-12:
                step_exceedances[rank] += 1
        total += 1

    adjusted = [0.0] * len(windows)
    cumulative = 0.0
    for rank, column in enumerate(order):
        cumulative = max(cumulative, step_exceedances[rank] / total)
        adjusted[column] = cumulative

    output = []
    for column, window in enumerate(windows):
        n_wt, n_sync, wt_mean, sync_mean = summaries[column]
        output.append(
            {
                "analysis": analysis,
                "time_window": window,
                "n_WT": n_wt,
                "n_SynC": n_sync,
                "WT_mean": wt_mean,
                "SynC_mean": sync_mean,
                "statistic_type": "studentized mean difference" if studentized else "unstudentized mean difference",
                "statistic": observed_signed[column],
                "P_unadjusted": raw_exceedances[column] / total,
                "P_stepdown_maxT": adjusted[column],
                "permutations": total,
            }
        )
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=Path(__file__).resolve().parent.parent / "data")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    results = []
    for analysis, (filename, studentized) in ANALYSES.items():
        windows, groups, rows = read_input(args.data_dir / filename)
        results.extend(exact_test(analysis, windows, groups, rows, studentized))

    fieldnames = list(results[0])
    if args.output:
        with args.output.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)
    else:
        writer = csv.DictWriter(__import__("sys").stdout, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)


if __name__ == "__main__":
    main()
