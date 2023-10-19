import { warn } from "vue";
import { Nullable, TourItemPlacement } from "../types";

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key])
      ? deepMerge(src[key], target[key])
      : (src[key] = target[key]);
  }
  return src;
}

export function outSideOfStep(
  step: number,
  stepsLength: number,
  outputWarn = false
) {
  if (step < 0 || step >= stepsLength) {
    outputWarn && warn("step is outside steps length");
    return true;
  }
  return false;
}

export function isFunction(val: unknown): val is Function {
  return Object.prototype.toString.call(val) === "[object Function]";
}

export function isObject(val: unknown): val is Object {
  return (
    typeof val === "object" &&
    Object.prototype.toString.call(val) === "[object Object]"
  );
}

export function isUnDef(val: unknown): val is Nullable<undefined> {
  return val === undefined || val === null;
}
// 不为负数
export function getNoMinusNumber(num: number): number {
  return num < 0 ? 0 : num;
}

//
export function getOffset(
  placement: TourItemPlacement,
  offsetX: number,
  offsetY: number
): number {
  if (offsetX === offsetY) return offsetX ?? 0;
  switch (placement) {
    case "top":
    case "bottom":
    case "top-start":
    case "bottom-start":
    case "bottom-end":
    case "top-end":
      return offsetY;
    case "right":
    case "left":
    case "right-start":
    case "right-end":
    case "left-start":
    case "left-end":
      return offsetX;
  }
}
