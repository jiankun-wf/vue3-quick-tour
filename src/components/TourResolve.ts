import { nextTick, unref } from "vue";
// utils
import { deepMerge, isFunction, noMinusNumber, outSideOfStep } from "./utils";

// types
import {
  MaskRectReactive,
  Nullable,
  ScreenRect,
  TourRect,
  TourResolverCoreArgument,
  TragetRect,
} from "./type";
import { getMaskRect, getScreenRect, getTargetRect } from "./get-position";

// 设置 Rect、暴露step-change
export const useTourTransition = (args: TourResolverCoreArgument) => {
  const {
    steps,
    padding,
    current,
    emit,
    maskRect,
    targetRect,
    arrowRect,
    screenRect,
    screenRef,
  } = args;

  // 获取当前步骤
  const getCurrentStep = (step?: number) => {
    step = step ?? unref(current);
    // 是否超出当前可变内容

    if (outSideOfStep(step, steps.length, false)) {
      return null;
    }
    return deepMerge(steps.at(step));
  };
  // 计算targerRect maskRect rect 值
  const getMaskTargetRect = (step: number) => {
    const { el } = getCurrentStep(step);
    // 上下的间距
    const rectPadding =
      typeof padding === "number" ? { x: padding, y: padding } : padding;
    const { x, y } = rectPadding;
    // 没有el 时， 此步默认为全屏居中引导框
    const targetRect: Nullable<TragetRect> = getTargetRect(el);

    const maskRect: MaskRectReactive = getMaskRect(targetRect, x, y);

    return {
      target: targetRect,
      mask: maskRect,
    };
  };

  const setScreenArrowRect = () => {
    const { placement = "bottom" } = getCurrentStep();
    const _targetRect = unref(targetRect);
    const _screenRef = unref(screenRef);
    const _screenRect = _screenRef!.getBoundingClientRect();

    screenRect.value = getScreenRect(_targetRect, _screenRect, 8, 8);
  };

  const setMaskTargetRect = (step: number) => {
    const { mask: _maskRect, target: _targetRect } = getMaskTargetRect(step);
    Object.assign(maskRect, _maskRect);
    targetRect.value = _targetRect;
  };

  const changeStep = (step: number) => {
    // 超出可变换范围
    if (outSideOfStep(step, steps.length, true)) {
      return;
    }
    // 相同的当前步骤
    if (step === unref(current)) {
      return;
    }

    // 设置阴影遮罩；
    setMaskTargetRect(step);
    current.value = step;
    nextTick(() => {
      setScreenArrowRect();
    });
    emit("update:current", step);
    emit("change", step, getCurrentStep());
    return true;
  };

  const next = () => {
    const result = changeStep(unref(current) + 1);
    result && emit("next", unref(current), getCurrentStep());
  };

  const prev = () => {
    const result = changeStep(unref(current) - 1);
    result && emit("prev", unref(current), getCurrentStep());
  };

  const last = () => {
    const result = changeStep(steps.length - 1);
    result && emit("finish");
  };

  return {
    next,
    prev,
    last,
    load: () => {
      setMaskTargetRect(unref(current));
      nextTick(setScreenArrowRect);
    },
    getCurrentStep,
    changeStep,
  };
};
