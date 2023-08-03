import {
  Nullable,
  TourItemPlacement,
  ScreenRect,
  ArrowRect,
  MaskRectReactive,
  TragetRect,
} from "../types";
import { isUnDef, getNoMinusNumber, getOffset } from "../utils";

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
  currentMaskRect: MaskRectReactive,
  x: number,
  y: number
): MaskRectReactive => {
  const maskRect = defaultMaskRect();
  if (isUnDef(targetRect)) {
    maskRect.center = {
      left: currentMaskRect.center.left,
      top: currentMaskRect.center.top,
      width: 0,
      height: 0,
    };
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

import { computePosition, offset, flip, arrow } from "@floating-ui/dom";

export const getScreenRect = async (
  targetEl: Nullable<() => HTMLElement>,
  screenRef: HTMLElement,
  arrowRef: Nullable<HTMLElement>,
  placement: TourItemPlacement,
  offsetX: number,
  offsetY: number
): Promise<{ screen: ScreenRect; arrow: Nullable<ArrowRect> }> => {
  const defaultScreenRect: ScreenRect = { top: 0, left: 0 };
  // 没有指引目标，则为全屏居中
  if (isUnDef(targetEl)) {
    const screenRect = screenRef.getBoundingClientRect();
    defaultScreenRect.top = (window.innerHeight - screenRect.height) / 2;
    defaultScreenRect.left = (window.innerWidth - screenRect.width) / 2;
    return { screen: defaultScreenRect, arrow: null };
  }
  //   TODO 位置算法
  const {
    x,
    y,
    middlewareData,
    placement: _resultPlacement,
  } = await computePosition(targetEl(), screenRef, {
    placement: placement,
    middleware: [
      flip({
        fallbackStrategy: "bestFit",
      }),
      offset({ mainAxis: getOffset(placement, offsetX, offsetY) }),
      !isUnDef(arrowRef) && arrow({ element: arrowRef }),
    ],
  });

  const {
    offset: { x: offset_x, y: offset_y } = {},
    arrow: { x: arrowX, y: arrowY, centerOffset: arrow_center_offset } = {},
  } = middlewareData;
  defaultScreenRect.left = x + (offset_x ?? 0 / 1.414);
  defaultScreenRect.top = y + (offset_y ?? 0 / 1.414);

  return {
    screen: defaultScreenRect,
    arrow: getArrowRectPosition(_resultPlacement, {
      x: arrowX ?? 0,
      y: arrowY ?? 0,
      centerOffset: arrow_center_offset ?? 0,
    }),
  };
};

const getArrowRectPosition = (
  place: TourItemPlacement,
  { x, y, centerOffset }: { x: number; y: number; centerOffset: number }
): ArrowRect => {
  switch (place) {
    case "top":
    case "top-start":
    case "top-end":
      return {
        bottom: `${-8}px`,
        left: `${x - centerOffset}px`,
        top: "auto",
        right: "auto",
        rotate: "180deg",
      };
    case "bottom":
    case "bottom-start":
    case "bottom-end":
      return {
        top: `${-8}px`,
        left: `${x - centerOffset}px`,
        right: "uset",
        bottom: "uset",
        rotate: "0deg",
      };
    case "left":
    case "left-start":
    case "left-end":
      return {
        right: `${-8}px`,
        top: `${y - centerOffset}px`,
        left: "auto",
        bottom: "auto",
        rotate: "30deg",
      };
    case "right":
    case "right-start":
    case "right-end":
      return {
        left: `${-8}px`,
        top: `${y - centerOffset}px`,
        right: "auto",
        bottom: "auto",
        rotate: "270deg",
      };
  }
};
