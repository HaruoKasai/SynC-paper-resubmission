#!/usr/bin/env python3
"""Reproduce the Figure 4e exact sign-flip permutation analyses."""

from __future__ import annotations

import argparse
import csv
from collections import Counter
from itertools import product
from math import sqrt
from pathlib import Path


FIRST_GROUP = "SynC@FPC + A/C"
SECOND_GROUP = "SynC@FPC A/C 2nd"
GROUP_ORDER = [
    "WT + A/C",
    FIRST_GROUP,
    "SynC@FPC - A/C",
    "dGAP@FPC + A/C",
    "FKBP-GAP + A/C",
    "SynC@M1 + A/C",
    SECOND_GROUP,
]
SCALE = 1000


def studentized_from_sum(signed_sum: int, sum_squares: int, n: int) -> float:
    """Studentized signed mean; input values share an arbitrary integer scale."""
    if n < 2:
        return 0.0
    residual_sum_squares = sum_squares - signed_sum * signed_sum / n
    if residual_sum_squares <= 0:
        return 0.0 if signed_sum == 0 else float("inf")
    variance = residual_sum_squares / (n - 1)
    standard_error = sqrt(variance / n)
    return (signed_sum / n) / standard_error


def signed_sum_distribution(values: list[int]) -> Counter[int]:
    distribution = Counter({0: 1})
    for value in values:
        updated: Counter[int] = Counter()
        for current_sum, count in distribution.items():
            updated[current_sum + value] += count
            updated[current_sum - value] += count
        distribution = updated
    return distribution


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def scaled(value: str) -> int:
    return round(float(value) * SCALE)


def exact_joint_maxt(rows: list[dict[str, str]]) -> list[dict[str, str | int | float]]:
    """Exact Romano-Wolf step-down maxT test for the against-zero family."""
    first_rows = [row for row in rows if row["figure_group"] == FIRST_GROUP]
    second_rows = [row for row in rows if row["figure_group"] == SECOND_GROUP]
    second_by_id = {row["mouse_id"]: scaled(row["state_c_time_min"]) for row in second_rows}
    shared_first = [scaled(row["state_c_time_min"]) for row in first_rows if row["mouse_id"] in second_by_id]
    shared_second = [second_by_id[row["mouse_id"]] for row in first_rows if row["mouse_id"] in second_by_id]
    first_only = [scaled(row["state_c_time_min"]) for row in first_rows if row["mouse_id"] not in second_by_id]

    all_first = shared_first + first_only
    all_second = shared_second
    first_squares = sum(value * value for value in all_first)
    second_squares = sum(value * value for value in all_second)
    observed_first = abs(studentized_from_sum(sum(all_first), first_squares, len(all_first)))
    observed_second = abs(studentized_from_sum(sum(all_second), second_squares, len(all_second)))

    first_only_distribution = signed_sum_distribution(first_only)
    exceed_first = 0
    exceed_second_stage = 0
    total = 0
    for signs in product((-1, 1), repeat=len(shared_first)):
        shared_first_sum = sum(sign * value for sign, value in zip(signs, shared_first))
        shared_second_sum = sum(sign * value for sign, value in zip(signs, shared_second))
        second_statistic = abs(
            studentized_from_sum(shared_second_sum, second_squares, len(all_second))
        )
        for first_only_sum, multiplicity in first_only_distribution.items():
            first_statistic = abs(
                studentized_from_sum(
                    shared_first_sum + first_only_sum,
                    first_squares,
                    len(all_first),
                )
            )
            joint_maximum = max(first_statistic, second_statistic)
            if joint_maximum >= observed_first - 1e-12:
                exceed_first += multiplicity
            if second_statistic >= observed_second - 1e-12:
                exceed_second_stage += multiplicity
            total += multiplicity

    # The first-A/C hypothesis has the larger observed statistic. After it is
    # removed, the second step contains only the second-A/C hypothesis. The
    # cumulative maximum enforces the monotonicity of adjusted P values.
    exceed_second = max(exceed_first, exceed_second_stage)

    summaries = []
    for group in GROUP_ORDER:
        group_values = [float(row["state_c_time_min"]) for row in rows if row["figure_group"] == group]
        if group == FIRST_GROUP:
            statistic, exceedances = observed_first, exceed_first
        elif group == SECOND_GROUP:
            statistic, exceedances = observed_second, exceed_second
        else:
            statistic, exceedances = 0.0, total
        summaries.append(
            {
                "analysis": "against_zero_stepdown_maxT",
                "comparison": group,
                "n": len(group_values),
                "reference_mean_min": 0.0,
                "comparison_mean_min": sum(group_values) / len(group_values),
                "statistic_type": "studentized mean",
                "statistic": statistic,
                "extreme_assignments": exceedances,
                "total_assignments": total,
                "P": exceedances / total,
            }
        )
    return summaries


def exact_paired(rows: list[dict[str, str]]) -> dict[str, str | int | float]:
    first = {
        row["mouse_id"]: float(row["state_c_time_min"])
        for row in rows
        if row["figure_group"] == FIRST_GROUP and row["matched_repeat_pair"] == "yes"
    }
    second = {
        row["mouse_id"]: float(row["state_c_time_min"])
        for row in rows
        if row["figure_group"] == SECOND_GROUP
    }
    ids = sorted(first.keys() & second.keys())
    differences = [
        scaled(str(second[mouse_id] - first[mouse_id])) for mouse_id in ids
    ]
    sum_squares = sum(value * value for value in differences)
    observed = abs(studentized_from_sum(sum(differences), sum_squares, len(differences)))
    extreme = 0
    total = 0
    for signs in product((-1, 1), repeat=len(differences)):
        signed_sum = sum(sign * value for sign, value in zip(signs, differences))
        permuted = abs(studentized_from_sum(signed_sum, sum_squares, len(differences)))
        if permuted >= observed - 1e-12:
            extreme += 1
        total += 1
    return {
        "analysis": "paired_first_vs_second",
        "comparison": "First A/C vs second A/C",
        "n": len(differences),
        "reference_mean_min": sum(first[mouse_id] for mouse_id in ids) / len(ids),
        "comparison_mean_min": sum(second[mouse_id] for mouse_id in ids) / len(ids),
        "statistic_type": "studentized mean paired difference",
        "statistic": studentized_from_sum(sum(differences), sum_squares, len(differences)),
        "extreme_assignments": extreme,
        "total_assignments": total,
        "P": extreme / total,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    rows = read_rows(args.input)
    results = exact_joint_maxt(rows) + [exact_paired(rows)]
    fieldnames = list(results[0])
    if args.output:
        handle = args.output.open("w", newline="", encoding="utf-8")
    else:
        handle = __import__("sys").stdout
    with handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)


if __name__ == "__main__":
    main()
