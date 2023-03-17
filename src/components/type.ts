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
  el?: null | (() => HTMLElement); // 绑定的element 此项为null时，弹出窗口居中显示
  title?: string; // 标题
  message?: string; // 内容文字
  placement?: TourItemPlacement; // 位置 TODO：位置算法；
  beforeEnter?: (next: (current: number, rect: TourRect) => void) => void; // 进入之前的判断 next do (TODO) 
  mask?: boolean | MaskConfig // 此步是否有遮罩？简单的true/false时配置跟着整体走；
}

export type MaskPositions = "left" | "top" | "right" | "bottom" | "center";
export interface RectItem<T = number> {
  left: number;
  top: number;
  width: T;
  height: T;
}
// 阴影遮罩RectConfig

export interface MaskRectReactive extends Record<MaskPositions, RectItem<string | number>> {};

// 当前步骤的htmlElement RectConfig
export interface TragetRect extends RectItem {
  right: number;
  bottom: number;
}
// 主屏幕显示内容rect
export interface ScreenRect extends Pick<RectItem, 'top' | 'left'> {}
// 箭头显示rect
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
  screenRef: Ref<Nullable<Element>>;
}


// Mask 创建样式函数
export interface MaskCreateProps {
    zIndex?: string | number;
}

export interface DialogStyleProps {
    zIndex?: string | number;
    classPrefix: string;
}

export interface TransitionLifeCycleProps<T = HTMLElement> {
  onBeforeEnter: (el: T) => void;
  onEnter: (el: T) => void;
  onLeave: (el: T) => void;
}

export interface TransitionLifeCycleInner<T = HTMLElement> {
  onBeforeEnter: (el: T) => void;
  onEnter: (el: T, done: () => void) => void;
  onLeave: (el: T, done: () => void) => void;
}