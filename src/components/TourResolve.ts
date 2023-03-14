import { unref } from "vue";
// utils
import { deepMerge, isFunction, noMinusNumber, outSideOfStep } from "./utils";

// types
import { MaskRectReactive, Nullable, ScreenRect, TourRect, TourResolverCoreArgument, TragetRect } from "./type";

// 设置 Rect、暴露step-change
export const useTourTransition = (args: TourResolverCoreArgument) => {
  const { steps, padding, current, emit, maskRect, targetRect, arrowRect, screenRect } = args;

  // 获取当前步骤
  const getCurrentStep = (step?: number) => {
    step = step ?? unref(current);
  // 是否超出当前可变内容

    if (outSideOfStep(step, steps.length, false)) {
      return null;
    }
    return deepMerge(steps.at(step));
  };

  const getRealExtent = (
    val: number,
    base: number,
    type: "plus" | "minus"
  ): number => {
    if (type === "plus") return val + base;
    if (type === "minus") return val - base;
    return val;
  };
  // 计算四类rect 值   
  const getRect = (step: number) => {
    const { el, placement } = getCurrentStep(step);
    let maskRect: MaskRectReactive;
    let targetRect: Nullable<TragetRect>;
    let screenRect: ScreenRect
    // 上下的间距
    const rectPadding = typeof padding === 'number' ? { x: padding, y: padding } : padding;
    const { x, y } = rectPadding;
    // 没有el 时， 此步默认为全屏居中引导框
    if (isFunction(el)) {
      const element = el();
      const _targetRect = element.getBoundingClientRect();

      // 设置目标源rect
      targetRect = {
        left: _targetRect.left,
        top: _targetRect.top,
        width: _targetRect.width,
        height: _targetRect.height,
        right: window.innerWidth - _targetRect.left - _targetRect.width,
        bottom: window.innerWidth - _targetRect.left - _targetRect.width,
      };
      // 设置遮罩rect 
      maskRect = {
        center: {
          top: getRealExtent(targetRect.top, y, "minus"),
          left: getRealExtent(targetRect.left, x, "minus"),
          width: getRealExtent(targetRect.width, x * 2, "plus"),
          height: getRealExtent(targetRect.height, y * 2, "plus"),
        },
        top: {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: noMinusNumber(
            getRealExtent(targetRect.top, y, "minus")
          ),
        },
        right: {
          top: 0,
          left: getRealExtent(
            targetRect.left + targetRect.width,
            x,
            "plus"
          ),
          width: getRealExtent(
            (window.innerWidth - targetRect.left - targetRect.width),
            x,
            "minus"
          ),
          height: window.innerHeight,
        },
        bottom: {
          top: getRealExtent(
            targetRect.top + targetRect.height,
            y,
            "plus"
          ),
          left: 0,
          height: getRealExtent(
            window.innerHeight - targetRect.top - targetRect.height,
            y,
            "minus"
          ),
          width: window.innerWidth,
        },
        left: {
          top: 0,
          left: 0,
          height: window.innerHeight,
          width: getRealExtent(targetRect.left, x, "minus"),
        },
      };
    } else {
      targetRect = null;
      maskRect = {
        center: {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        },
        top: {
          width: window.innerWidth,
          height: window.innerHeight,
          left: 0,
          top: 0,
        },
        right: { width: 0, height: 0, left: 0, top: 0 },
        bottom: { width: 0, height: 0, left: 0, top: 0 },
        left: { width: 0, height: 0, left: 0, top: 0 },
      };
    }

    return {
      targetRect,
      maskRect,
      screenRect,
    };
  };

  const setRect = (step: number) => {
    const { maskRect: _maskRect, targetRect: _targetRect } = getRect(step);
    Object.assign(maskRect, _maskRect);
    targetRect.value = _targetRect;
  }

  const changeStep = (step: number) => {
    // 超出可变换范围
    if (outSideOfStep(step, steps.length, true)) {
      return;
    }
    // 相同的当前步骤
    if (step === unref(current)) {
      return;
    };

    // 设置阴影遮罩；
    setRect(step);
    current.value = step;
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

  return { next, prev, last, load: setRect, getCurrentStep, changeStep };
};