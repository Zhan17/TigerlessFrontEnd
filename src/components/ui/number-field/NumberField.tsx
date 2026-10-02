import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  useId,
} from "react";
import { SortIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type NumberFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  /** Accessible name (the visible label may be shared by several fields). */
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Unit shown inside the field ("ft", "in", "lbs", "cm", "kg"). */
  unit: string;
  step?: number;
  min?: number;
  max?: number;
  /** Error message; marks the field invalid and is announced. */
  error?: string;
  /** Accessible names for the stepper buttons. */
  incrementLabel: string;
  decrementLabel: string;
};

/**
 * Pill number input with a unit suffix and the design's up/down stepper
 * (the sort icon split into two hit areas). The buttons and the arrow keys
 * share one stepping rule: within min / max, never against the direction
 * pressed (a typed 11.5 with max 11 stays 11.5 on "increase" instead of
 * dropping to 11), and a step that changes nothing reports nothing (R11).
 * Self-designed states: hover = darker border, focus = ring, invalid = red
 * border + message.
 */
export function NumberField({
  label,
  value,
  onChange,
  unit,
  step = 1,
  min,
  max,
  error,
  incrementLabel,
  decrementLabel,
  className,
  id,
  ...props
}: NumberFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const stepBy = (direction: 1 | -1) => {
    // Empty field: either button starts from the minimum.
    if (value.trim() === "") {
      onChange(String(min ?? 0));
      return;
    }
    const current = Number(value);
    if (!Number.isFinite(current)) return;
    let next = current + direction * step;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    next = Math.round(next * 100) / 100;
    if (direction === 1 ? next <= current : next >= current) return;
    onChange(String(next));
  };

  // Arrow keys use the same rule (the native step would also clamp a value
  // above max downwards on ArrowUp).
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    stepBy(event.key === "ArrowUp" ? 1 : -1);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn(
          "flex h-control items-center gap-1 rounded-full border bg-input pr-3 pl-4",
          "transition-[border-color,box-shadow] duration-(--duration-fast)",
          "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-focus",
          error ? "border-danger" : "border-border hover:border-sage-300",
        )}
      >
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          aria-label={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.value)
          }
          onKeyDown={onKeyDown}
          className={cn(
            "w-full min-w-0 bg-transparent text-button text-heading-strong outline-none placeholder:text-ink-400",
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          )}
          {...props}
        />
        <span className="relative flex shrink-0 flex-col text-sage-400">
          <SortIcon className="size-6" />
          <button
            type="button"
            tabIndex={-1}
            aria-label={incrementLabel}
            onClick={() => stepBy(1)}
            className="absolute inset-x-0 top-0 h-1/2 cursor-pointer rounded-t-full hover:bg-sage-200/40 active:bg-sage-200/70"
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label={decrementLabel}
            onClick={() => stepBy(-1)}
            className="absolute inset-x-0 bottom-0 h-1/2 cursor-pointer rounded-b-full hover:bg-sage-200/40 active:bg-sage-200/70"
          />
        </span>
        <span aria-hidden className="shrink-0 text-button text-ink-500">
          {unit}
        </span>
      </div>
      {error ? (
        <p id={errorId} className="px-4 text-caption leading-snug text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
