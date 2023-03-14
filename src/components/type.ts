import { CSSProperties, Ref } from "vue";

// 每步的配置
export type TourItemPlacement =
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export interface MaskConfig {
  color?: string;
  style?: Partial<CSSProperties>;
}
export interface TourStep {
  el?: null | (() => HTMLElement);
  title?: string;
  message?: string;
  placement?: TourItemPlacement;
  beforeEnter?: (next: (current: number, rect: TourRect) => void) => void;
  afterLeave?: () => void;
  mask?: boolean | MaskConfig
}

export type MaskPositions = "left" | "top" | "right" | "bottom" | "center";
export interface RectItem {
  left: number;
  top: number;
  width: number;
  height: number;
}
// 阴影遮罩RectConfig

export interface MaskRectReactive extends Record<MaskPositions, RectItem> {};

// 当前步骤的htmlElement RectConfig
export interface TragetRect extends RectItem {
  right: number;
  bottom: number;
}
// 主屏幕显示内容rect
export interface ScreenRect extends RectItem {}
export interface ArrowRect extends Pick<RectItem, "top" | "left"> {
  direction: string;
  size: number;
}

// 总Rect Map
export interface TourRect {
  screen?: ScreenRect;
  target?: null | TragetRect;
  Mask: MaskRectReactive;
  arraow?: ArrowRect;
}

// 核心处理函数 core argument
export type Nullable<T> = T | null;
export interface TourResolverCoreArgument {
  steps: TourStep[]; // 步骤
  padding: number | { x: number; y: number }; // 留白边距
  current: Ref<number>; // 当前步骤
  emit: (event: any, ...args: any[]) => void; // component emits
  maskRect: MaskRectReactive; // 遮罩位置reactive
  targetRect: Ref<Nullable<TragetRect>>; // 当前步骤 被指引元素rect
  arrowRect: Ref<Nullable<ArrowRect>>; // 箭头rect
  screenRect: Ref<Nullable<ScreenRect>>; // 主体显示内容rect
}


// Mask 创建样式函数
export interface MaskCreateProps {
    zIndex?: string | number;
}

export interface DialogStyleProps {
    zIndex?: string | number;
    classPrefix: string;
}