import { ComputedRef, computed, nextTick, unref, Ref } from "vue";
// utils
import { deepMerge, isUnDef, outSideOfStep } from "../utils";

// types
import {
  Nullable,
  TourResolverCoreArgument,
  TourStep,
  MaskRectReactive,
  TragetRect,
} from "../types";
import { getMaskRect, getScreenRect, getTargetRect } from "./position";

// 设置 Rect、暴露next、prev、load
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
    arrowRef,
  } = args;

  // 上下的间距
  const rectPadding =
    typeof padding === "number" ? { x: padding, y: padding } : padding;
  const { x: offsetX, y: offsetY } = rectPadding;

  // 获取当前步骤
  const getCurrentStep = (step?: number) => {
    step = step ?? unref(current);
    // 是否超出当前可变内容

    if (outSideOfStep(step, steps.length, false)) {
      return null;
    }
    return deepMerge(steps[step]);
  };
  // 计算targerRect maskRect rect 值
  const getMaskTargetRect = (step: number) => {
    const { el } = getCurrentStep(step);
    // 没有el 时， 此步默认为全屏居中引导框
    const targetRect: Nullable<TragetRect> = getTargetRect(el);

    const _maskRect: MaskRectReactive = getMaskRect(
      targetRect,
      maskRect,
      offsetX,
      offsetY
    );

    return {
      target: targetRect,
      mask: _maskRect,
    };
  };

  const setScreenArrowRect = async () => {
    const { placement, el } = getCurrentStep();
    const _screenRef = unref(screenRef) as HTMLElement;
    const _arrowRef = unref(arrowRef) as Nullable<HTMLElement>;

    const { screen, arrow } = await getScreenRect(
      el,
      _screenRef as HTMLElement,
      _arrowRef,
      placement,
      offsetX,
      offsetY
    );

    screenRect.value = screen;
    arrowRect.value = arrow;
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

export const useTourMaskSetting = (
  getCurrentStep: ComputedRef<TourStep>,
  props: Record<string, any>,
  show: Ref<boolean>
) => {
  const getMaskColor = computed(() => {
    const { mask } = unref(getCurrentStep) || {};
    if (typeof mask === "object") {
      return (
        mask.color ??
        (typeof props.mask === "object" ? props.mask.color : undefined)
      );
    }
    return typeof props.mask === "object" ? props.mask.color : undefined;
  });
  // 获取当前遮罩样式
  const getMaskWrapperStyle = computed(() => {
    const { mask } = unref(getCurrentStep) || {};
    if (typeof mask === "object") {
      return (
        mask.style ??
        (typeof props.mask === "object" ? props.mask.style : undefined)
      );
    }
    return typeof props.mask === "object" ? props.mask.style : undefined;
  });
  //  获取当前遮罩是否显示
  const getMaskShow = computed(() => {
    const { mask } = unref(getCurrentStep) || {};
    if (isUnDef(mask)) {
      return props.mask === false ? false : unref(show);
    }
    if (typeof mask === "boolean") {
      return mask === false ? false : unref(show);
    }
    return unref(show);
  });

  return { getMaskColor, getMaskWrapperStyle, getMaskShow };
};
