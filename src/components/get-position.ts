import { MaskRectReactive, Nullable, ScreenRect, TragetRect } from "./type";
import { isFunction, isUnDef } from "./utils";

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
    top: targetRect.top - y,
    left: targetRect.left - x,
    width: targetRect.width + 2 * x,
    height: targetRect.height + 2 * y,
  };
  maskRect.top = {
    top: 0,
    left: 0,
    width: "100%",
    height: targetRect.top - y,
  };
  maskRect.left = {
    top: 0,
    left: 0,
    width: targetRect.left - x,
    height: "100%",
  };
  maskRect.bottom = {
    top: targetRect.bottom + y,
    left: 0,
    width: "100%",
    height: window.innerHeight - targetRect.top - targetRect.height - y,
  };
  maskRect.right = {
    top: 0,
    left: targetRect.right + x,
    width: window.innerWidth - targetRect.left - targetRect.width - x,
    height: "100%",
  };
  return maskRect;
};

export const getScreenRect = (
  targetRect: Nullable<TragetRect>,
  screenRect: DOMRect,
  offsetX: number,
  offsetY: number
): ScreenRect => {
  const defaultRect: ScreenRect = { top: 0, left: 0 };
  const {} = screenRect;
  // 没有指引目标，则为全屏居中
  if (isUnDef(targetRect)) {
    defaultRect.top = (window.innerHeight - screenRect.height) / 2;
    defaultRect.left = (window.innerWidth - screenRect.width) / 2;
    return defaultRect;
  }
  //   TODO 位置算法
  defaultRect.top = 100 - offsetY;
  defaultRect.left = 100 - offsetX;
  return defaultRect;
};
