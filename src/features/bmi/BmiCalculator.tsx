"use client";

import Image from "next/image";
import { type FormEvent, useId, useState } from "react";
import { ArrowRightCircleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { NumberField } from "@/components/ui/number-field";
import { RadioPill } from "@/components/ui/radio-pill";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { Cta } from "@/content/schemas";
import { TextAction } from "@/features/shared/TextAction";
import { uiCopy } from "@/lib/ui-copy";
import { BmiGauge } from "./BmiGauge";
import { BmiScale } from "./BmiScale";
import {
  type BmiInput,
  calculateBmi,
  categorize,
  convertInput,
  type FieldName,
  LIMITS,
  type Sex,
  type UnitSystem,
  validate,
  withoutExact,
} from "./bmi";

export type BmiCalculatorProps = {
  eyebrow: string;
  tag: string;
  heading: string;
  helper: string;
  optionsCta: Cta | null;
  /** Prefill (stories, or a future profile); empty by default (C9). */
  defaultInput?: BmiInput;
  defaultSex?: Sex;
  /** Show the result for the prefilled values on first render. */
  defaultCalculated?: boolean;
};

const EMPTY: BmiInput = {
  unit: "imperial",
  heightFt: "",
  heightIn: "",
  heightCm: "",
  weight: "",
};

const copy = uiCopy.bmi;

/**
 * BMI / eligibility checker. Rules are pure functions in ./bmi (decision
 * 3.1); nothing is stored (3.2: refresh clears it). The button stays
 * disabled until the input is valid; out-of-range values show a message.
 * Switching units converts the typed values and recalculates an existing
 * result. The result names the chosen sex (C6) — the number itself does
 * not depend on it.
 *
 * Mobile follows the mobile board (one card, gauge on top, no legend/link);
 * from lg it is the form card + result card of the desktop board.
 */
export function BmiCalculator({
  eyebrow,
  tag,
  heading,
  helper,
  optionsCta,
  defaultInput = EMPTY,
  defaultSex = "female",
  defaultCalculated = false,
}: BmiCalculatorProps) {
  const headingId = useId();
  const [input, setInput] = useState<BmiInput>(defaultInput);
  const [sex, setSex] = useState<Sex>(defaultSex);
  const [bmi, setBmi] = useState<number | null>(() =>
    defaultCalculated ? calculateBmi(defaultInput) : null,
  );

  const errors = validate(input);
  const valid = Object.keys(errors).length === 0;
  const imperial = input.unit === "imperial";

  // Typing in a field replaces that part of any exact measurement carried
  // over from a unit switch.
  const set = (field: FieldName) => (value: string) =>
    setInput((current) => ({
      ...withoutExact(current, field),
      [field]: value,
    }));

  const changeUnit = (unit: UnitSystem) => {
    const next = convertInput(input, unit);
    setInput(next);
    if (bmi !== null) setBmi(calculateBmi(next));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (valid) setBmi(calculateBmi(input));
  };

  // Only out-of-range values get a message; empty fields just keep the
  // button disabled.
  // Height in ft/in is checked as a whole, so its message names the range.
  const rangeError = (
    field: FieldName,
    min: number,
    max: number,
    unit: string,
  ) => {
    if (errors[field] !== "range") return undefined;
    if (field === "heightFt") {
      const [low, high] = LIMITS.imperial.height;
      return copy.heightRange(low, high);
    }
    return copy.range(min, max, unit);
  };

  const resultText =
    bmi === null
      ? copy.empty
      : copy.result(sex, bmi.toFixed(1), copy.categories[categorize(bmi)]);

  const field = (
    name: FieldName,
    label: string,
    unit: string,
    [min, max]: readonly [number, number],
  ) => (
    <NumberField
      label={label}
      unit={unit}
      value={input[name]}
      onChange={set(name)}
      min={min}
      max={max}
      placeholder="0"
      error={rangeError(name, min, max, unit)}
      incrementLabel={copy.increase(label)}
      decrementLabel={copy.decrease(label)}
    />
  );

  return (
    <div className="mx-auto mt-8 max-w-content rounded-shell lg:bg-surface lg:p-3">
      <div className="relative isolate overflow-hidden rounded-card p-3 shadow-card lg:p-10">
        <Image
          src="/images/bmi-background.webp"
          alt=""
          fill
          sizes="(min-width: 80rem) 81rem, 100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[rgb(60_58_58/0.6)]"
        />

        <div className="mx-auto grid max-w-[73rem] gap-6 lg:grid-cols-[34.6875rem_minmax(0,1fr)] lg:items-end">
          <form
            aria-labelledby={headingId}
            noValidate
            onSubmit={onSubmit}
            className="flex flex-col gap-6 rounded-card border border-mint-100 bg-surface p-3 shadow-soft lg:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-3">
                <Eyebrow className="hidden lg:block">{eyebrow}</Eyebrow>
                <div className="flex flex-col gap-2 lg:gap-4">
                  <h3
                    id={headingId}
                    className="max-w-[19.5rem] text-title font-medium text-heading-strong"
                  >
                    {heading}
                  </h3>
                  <p className="text-body-sm text-copy">{helper}</p>
                </div>
              </div>
              <Eyebrow className="hidden lg:block">{tag}</Eyebrow>
            </div>

            {/* Mobile board: the gauge sits inside the form card. */}
            <div className="flex flex-col items-center gap-2 lg:hidden">
              <BmiGauge
                bmi={bmi}
                label={copy.scoreLabelShort}
                className="w-34"
              />
            </div>

            <div className="flex flex-col gap-4">
              <SegmentedControl
                label={copy.units.label}
                value={input.unit}
                onChange={changeUnit}
                options={[
                  { value: "imperial", label: copy.units.imperial },
                  { value: "metric", label: copy.units.metric },
                ]}
                className="w-45"
              />

              <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-label text-copy">{copy.height}</span>
                  {imperial ? (
                    <div className="grid grid-cols-2 gap-3 lg:w-[16.125rem]">
                      {field(
                        "heightFt",
                        copy.fieldLabels.heightFt,
                        copy.unitSuffix.ft,
                        LIMITS.imperial.heightFt,
                      )}
                      {field(
                        "heightIn",
                        copy.fieldLabels.heightIn,
                        copy.unitSuffix.in,
                        LIMITS.imperial.heightIn,
                      )}
                    </div>
                  ) : (
                    <div className="lg:w-[16.125rem]">
                      {field(
                        "heightCm",
                        copy.fieldLabels.heightCm,
                        copy.unitSuffix.cm,
                        LIMITS.metric.heightCm,
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-label text-copy">{copy.weight}</span>
                  {imperial
                    ? field(
                        "weight",
                        copy.fieldLabels.weightLb,
                        copy.unitSuffix.lbs,
                        LIMITS.imperial.weightLb,
                      )
                    : field(
                        "weight",
                        copy.fieldLabels.weightKg,
                        copy.unitSuffix.kg,
                        LIMITS.metric.weightKg,
                      )}
                </div>
              </div>

              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="mb-2 text-label text-copy">
                  {copy.sex}
                </legend>
                <div className="grid grid-cols-2 gap-3 lg:flex">
                  {(["male", "female"] as const).map((option) => (
                    <RadioPill
                      key={option}
                      name={`${headingId}-sex`}
                      value={option}
                      checked={sex === option}
                      onChange={() => setSex(option)}
                      className="lg:w-[7.6875rem]"
                    >
                      {copy.sexes[option]}
                    </RadioPill>
                  ))}
                </div>
              </fieldset>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={!valid}
              className="justify-center font-normal"
            >
              {copy.submit}
            </Button>

            {/* Mobile: the result sentence under the button. */}
            <p
              aria-live="polite"
              className="text-center text-body-sm text-copy lg:hidden"
            >
              {resultText}
            </p>
          </form>

          <section
            aria-label={copy.scoreLabel}
            className="hidden flex-col items-center gap-6 rounded-card border border-[rgb(12_27_46/0.08)] bg-surface px-6 py-8 shadow-soft lg:flex"
          >
            <BmiGauge bmi={bmi} label={copy.scoreLabel} className="w-54" />
            <p
              aria-live="polite"
              className="text-center text-body-sm text-copy"
            >
              {resultText}
            </p>
            <BmiScale bmi={bmi} />
            {optionsCta ? (
              <TextAction
                link={optionsCta.link}
                className="group/link inline-flex items-center gap-2 self-start rounded-full text-label text-heading transition-colors hover:text-accent"
              >
                {optionsCta.label}
                <ArrowRightCircleIcon className="size-6 transition-transform duration-(--duration-base) group-hover/link:translate-x-0.5" />
              </TextAction>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
