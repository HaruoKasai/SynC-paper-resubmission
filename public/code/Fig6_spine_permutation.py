#!/usr/bin/env python3
"""Reproduce the adopted spine-level permutation tests for Fig. 6g and 6h.

Fig. 6g compares the continuous 40-80-s Delta V endpoint with a Welch-type
studentized difference in means. Fig. 6h compares the condition-specific
mixture fraction pi from the frozen Extended Data Fig. 10 Normal-Exponential
model. For Fig. 6h, group labels are permuted and pi is re-estimated for both
groups in every permutation; the pi difference is studentized by the observed
information of the two fitted mixture fractions.

The common Normal and Normal-convolved Exponential component parameters are
held at their frozen Extended Data Fig. 10 values. They are shared across
conditions and are not condition-specific quantities. Individual stimulated
spines are the permutation units. FOV identifiers are retained for provenance
and homogeneity checks but are not used as averaging units for inference.
"""

from __future__ import annotations

import argparse
import csv
import math
from pathlib import Path

import numpy as np


CONTRASTS = (
    ("sync_before_vs_0_60", "SynC before", "SynC 0-60", "primary", 2026072801, 2026072901),
    ("sync_60_180_vs_0_60", "SynC 60-180", "SynC 0-60", "secondary", 2026072802, 2026072902),
    ("dgap_before_vs_0_60", "dGAP before", "dGAP 0-60", "descriptive", 2026073001, 2026073101),
    ("dgap_0_60_vs_60_180", "dGAP 0-60", "dGAP 60-180", "descriptive", 2026073002, 2026073102),
)


def _load_spines(path: Path) -> dict[str, list[dict[str, str]]]:
    grouped: dict[str, list[dict[str, str]]] = {}
    with path.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if row["role"] != "stim":
                continue
            grouped.setdefault(row["group"], []).append(row)
    return grouped


def _load_parameters(path: Path) -> dict[str, float]:
    with path.open(newline="", encoding="utf-8") as handle:
        row = next(csv.DictReader(handle))
    return {
        "sigma": float(row["null_sigma_percent"]),
        "theta": float(row["gamma_scale_theta_percent"]),
    }


def _welch_statistic(first: np.ndarray, second: np.ndarray) -> float:
    denominator = math.sqrt(
        first.var(ddof=1) / len(first) + second.var(ddof=1) / len(second)
    )
    return float((first.mean() - second.mean()) / denominator)


def _delta_v_test(
    first: np.ndarray,
    second: np.ndarray,
    repetitions: int,
    seed: int,
) -> tuple[float, float, float]:
    observed = _welch_statistic(first, second)
    pooled = np.concatenate((first, second))
    n_first = len(first)
    rng = np.random.default_rng(seed)
    exceedances = 0
    for _ in range(repetitions):
        permuted = rng.permutation(pooled)
        statistic = _welch_statistic(permuted[:n_first], permuted[n_first:])
        exceedances += abs(statistic) >= abs(observed) - 1.0e-15
    p_value = (exceedances + 1) / (repetitions + 1)
    return float(first.mean() - second.mean()), observed, p_value


def _likelihood_ratio(value: float, sigma: float, theta: float) -> float:
    """Return f_positive(value) / f_null(value) for the frozen ex-Gaussian."""
    z_value = value / sigma - sigma / theta
    log_phi = math.log(0.5 * math.erfc(-z_value / math.sqrt(2.0)))
    log_ratio = (
        math.log(sigma * math.sqrt(2.0 * math.pi) / theta)
        + sigma * sigma / (2.0 * theta * theta)
        - value / theta
        + value * value / (2.0 * sigma * sigma)
        + log_phi
    )
    return math.exp(log_ratio)


def _fit_pi(difference_ratio: np.ndarray, iterations: int = 60) -> float:
    """Fit pi by bisection on the concave mixture log-likelihood score."""
    lower, upper = 0.0, 1.0
    for _ in range(iterations):
        value = (lower + upper) / 2.0
        score = np.sum(difference_ratio / (1.0 + value * difference_ratio))
        if score > 0.0:
            lower = value
        else:
            upper = value
    return (lower + upper) / 2.0


def _pi_statistic(first: np.ndarray, second: np.ndarray) -> tuple[float, float, float]:
    pi_first = _fit_pi(first)
    pi_second = _fit_pi(second)
    information_first = np.sum((first / (1.0 + pi_first * first)) ** 2)
    information_second = np.sum((second / (1.0 + pi_second * second)) ** 2)
    standard_error = math.sqrt(1.0 / information_first + 1.0 / information_second)
    statistic = (pi_first - pi_second) / standard_error
    return pi_first, pi_second, float(statistic)


def _pi_test(
    first: np.ndarray,
    second: np.ndarray,
    repetitions: int,
    seed: int,
    batch_size: int,
) -> tuple[float, float, float]:
    pi_first, pi_second, observed = _pi_statistic(first, second)
    pooled = np.concatenate((first, second))
    n_total = len(pooled)
    n_first = len(first)
    rng = np.random.default_rng(seed)
    exceedances = 0
    completed = 0

    while completed < repetitions:
        current = min(batch_size, repetitions - completed)
        indices = np.argpartition(
            rng.random((current, n_total)), n_first - 1, axis=1
        )[:, :n_first]
        first_mask = np.zeros((current, n_total), dtype=bool)
        first_mask[np.arange(current)[:, None], indices] = True

        lower_first = np.zeros(current)
        upper_first = np.ones(current)
        lower_second = np.zeros(current)
        upper_second = np.ones(current)
        for _ in range(38):
            perm_pi_first = (lower_first + upper_first) / 2.0
            perm_pi_second = (lower_second + upper_second) / 2.0
            score_values_first = pooled[None, :] / (
                1.0 + perm_pi_first[:, None] * pooled[None, :]
            )
            score_values_second = pooled[None, :] / (
                1.0 + perm_pi_second[:, None] * pooled[None, :]
            )
            score_first = np.sum(
                np.where(first_mask, score_values_first, 0.0), axis=1
            )
            score_second = np.sum(
                np.where(first_mask, 0.0, score_values_second), axis=1
            )
            positive = score_first > 0.0
            lower_first[positive] = perm_pi_first[positive]
            upper_first[~positive] = perm_pi_first[~positive]
            positive = score_second > 0.0
            lower_second[positive] = perm_pi_second[positive]
            upper_second[~positive] = perm_pi_second[~positive]

        perm_pi_first = (lower_first + upper_first) / 2.0
        perm_pi_second = (lower_second + upper_second) / 2.0
        information_values_first = (
            pooled[None, :] / (1.0 + perm_pi_first[:, None] * pooled[None, :])
        ) ** 2
        information_values_second = (
            pooled[None, :] / (1.0 + perm_pi_second[:, None] * pooled[None, :])
        ) ** 2
        information_first = np.sum(
            np.where(first_mask, information_values_first, 0.0), axis=1
        )
        information_second = np.sum(
            np.where(first_mask, 0.0, information_values_second), axis=1
        )
        statistics = (perm_pi_first - perm_pi_second) / np.sqrt(
            1.0 / information_first + 1.0 / information_second
        )
        exceedances += int(np.count_nonzero(np.abs(statistics) >= abs(observed) - 1.0e-14))
        completed += current

    p_value = (exceedances + 1) / (repetitions + 1)
    return pi_first - pi_second, observed, p_value


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("spine_csv", type=Path)
    parser.add_argument("--parameters", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("Fig6_spine_permutation_results.csv"))
    parser.add_argument("--repetitions", type=int, default=100_000)
    parser.add_argument("--batch-size", type=int, default=1_000)
    args = parser.parse_args()

    groups = _load_spines(args.spine_csv)
    parameters = _load_parameters(args.parameters)
    ratio_minus_one: dict[str, np.ndarray] = {}
    delta_v: dict[str, np.ndarray] = {}
    for group, rows in groups.items():
        values = np.array(
            [float(row["corrected_delta_v_40_80_percent"]) for row in rows]
        )
        delta_v[group] = values
        ratio_minus_one[group] = np.array(
            [
                _likelihood_ratio(value, parameters["sigma"], parameters["theta"])
                - 1.0
                for value in values
            ]
        )

    output_rows: list[dict[str, str | int | float]] = []
    for contrast_id, first_group, second_group, role, delta_seed, pi_seed in CONTRASTS:
        # The recovery sequence is generated as acute -> recovery, matching the
        # prespecified temporal order and the frozen Monte Carlo stream. Its
        # displayed effect is then oriented as recovery minus acute.
        reverse_for_temporal_order = contrast_id == "sync_60_180_vs_0_60"
        permutation_first = second_group if reverse_for_temporal_order else first_group
        permutation_second = first_group if reverse_for_temporal_order else second_group
        effect, statistic, p_value = _delta_v_test(
            delta_v[permutation_first],
            delta_v[permutation_second],
            args.repetitions,
            delta_seed,
        )
        if reverse_for_temporal_order:
            effect, statistic = -effect, -statistic
        output_rows.append(
            {
                "panel": "Fig. 6g",
                "metric": "mean_delta_v_40_80_percent",
                "contrast_id": contrast_id,
                "contrast": f"{first_group} vs {second_group}",
                "alternative": "two-sided",
                "effect_first_minus_second": effect,
                "studentized_statistic": statistic,
                "p_value": p_value,
                "seed": delta_seed,
                "repetitions": args.repetitions,
                "inference_role": role,
            }
        )

        effect, statistic, p_value = _pi_test(
            ratio_minus_one[permutation_first],
            ratio_minus_one[permutation_second],
            args.repetitions,
            pi_seed,
            args.batch_size,
        )
        if reverse_for_temporal_order:
            effect, statistic = -effect, -statistic
        output_rows.append(
            {
                "panel": "Fig. 6h",
                "metric": "mixture_fraction_pi",
                "contrast_id": contrast_id,
                "contrast": f"{first_group} vs {second_group}",
                "alternative": "two-sided",
                "effect_first_minus_second": effect,
                "studentized_statistic": statistic,
                "p_value": p_value,
                "seed": pi_seed,
                "repetitions": args.repetitions,
                "inference_role": role,
            }
        )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=list(output_rows[0]),
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(output_rows)
    for row in output_rows:
        print(
            f"{row['panel']} {row['contrast_id']}: "
            f"effect={float(row['effect_first_minus_second']):.9g}, "
            f"P={float(row['p_value']):.9g}"
        )


if __name__ == "__main__":
    main()
