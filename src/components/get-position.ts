import {
  ArrowRect,
  MaskRectReactive,
  Nullable,
  ScreenRect,
  TourItemPlacement,
  TragetRect,
} from "./type";
import { isFunction, isUnDef, getNoMinusNumber } from "./utils";

export const getTargetRect = (
  el: null | (() => HTMLElement)
): Nullable<TragetRect> => {
  if (isUnDef(el)) return null;
  const element = el();
  const { width, height, left, right, top, bottom } =
    element.getBoundingClientRect();
  return {
    width,
    height,
    left,
    right,
    top,
    bottom,
  };
};

export const defaultMaskRect = (): MaskRectReactive => ({
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
});

export const getMaskRect = (
  targetRect: Nullable<TragetRect>,
  x: number,
  y: number
): MaskRectReactive => {
  const maskRect = defaultMaskRect();
  if (targetRect === null) {
    return maskRect;
  }
  maskRect.center = {
    top: getNoMinusNumber(targetRect.top - y),
    left: getNoMinusNumber(targetRect.left - x),
    width: getNoMinusNumber(targetRect.width + 2 * x),
    height: getNoMinusNumber(targetRect.height + 2 * y),
  };
  maskRect.top = {
    top: 0,
    left: 0,
    width: "100%",
    height: getNoMinusNumber(targetRect.top - y),
  };
  maskRect.left = {
    top: 0,
    left: 0,
    width: getNoMinusNumber(targetRect.left - x),
    height: "100%",
  };
  maskRect.bottom = {
    top: getNoMinusNumber(targetRect.bottom + y),
    left: 0,
    width: "100%",
    height: getNoMinusNumber(
      window.innerHeight - targetRect.top - targetRect.height - y
    ),
  };
  maskRect.right = {
    top: 0,
    left: getNoMinusNumber(targetRect.right + x),
    width: getNoMinusNumber(
      window.innerWidth - targetRect.left - targetRect.width - x
    ),
    height: "100%",
  };
  return maskRect;
};

import { computePosition, offset, autoPlacement, arrow } from "@floating-ui/dom";

export const getScreenRect = async (
  targetEl: Nullable<() => HTMLElement>,
  screenRef: HTMLElement,
  arrowRef: Nullable<HTMLElement>,
  placement: TourItemPlacement,
  offsetX: number,
  offsetY: number
): Promise<{ screen: ScreenRect, arrow: Nullable<ArrowRect> }> => {
  const defaultScreenRect: ScreenRect = { top: 0, left: 0 };
  const defaultArrowRect: ArrowRect = { top: 0, left: 0, direction: 'left', size: 16 }
  // 没有指引目标，则为全屏居中
  if (isUnDef(targetEl)) {
    const screenRect = screenRef.getBoundingClientRect();
    defaultScreenRect.top = (window.innerHeight - screenRect.height) / 2;
    defaultScreenRect.left = (window.innerWidth - screenRect.width) / 2;
    return { screen: defaultScreenRect, arrow: null };
  }
  //   TODO 位置算法
  if(isUnDef(arrowRef)) {
    const {x,y,middlewareData: { arrow }} = await computePosition(targetEl(), screenRef, {
      placement: placement,
      middleware: [autoPlacement(), offset(12)],
    })
    defaultScreenRect.left = x;
    defaultScreenRect.top = y;
  } else {
    const {x,y,middlewareData} = await computePosition(targetEl(), screenRef, {
      placement: placement,
      middleware: [offset(12), arrow({ element: arrowRef })],
    })
    defaultScreenRect.left = x;
    defaultScreenRect.top = y;
    defaultArrowRect.left = middlewareData.arrow?.x ?? 0;
    defaultArrowRect.top = middlewareData.arrow?.y ?? 0;
  }

  return {
    screen: defaultScreenRect,
    arrow: defaultArrowRect,
  };
};

export const getArrowRect = (
  targetRect: Nullable<TragetRect>,
  screenRect: ScreenRect,
  placement: TourItemPlacement
): ArrowRect => {
  return {
    direction: placement,
    top: 0,
    left: 0,
    size: 10,
  };
};
