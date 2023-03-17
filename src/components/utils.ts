import { warn } from "vue";
import { Nullable } from "./type";

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
    let key: string;
    for (key in target) {
      src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}

export function outSideOfStep(step: number, stepsLength: number, outputWarn = false) {
    if(step < 0 || step >= stepsLength) {
      outputWarn && warn('step is outside steps length');
       return true;
    }
    return false;
}

export function isFunction(val: unknown): val is Function {
 return Object.prototype.toString.call(val) === '[object Function]'
}

export function isObject(val: unknown): val is Object {
  return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Object]'
}

export function isUnDef(val: unknown): val is Nullable<undefined> {
  return val === undefined || val === null  
}
// 不为负数
export function noMinusNumber(num: number): number {
  return num < 0 ? 0 : num;
}