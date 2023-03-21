import { PropType } from "vue";
import {
  GlobalThemeOverrides,
  MaskConfig,
  TourStep,
  TransitionLifeCycleProps,
} from "../types";

export const createTourProps = () => {
  return {
    steps: {
      type: Array as PropType<Array<TourStep>>,
      default: () => [],
    },
    classPrefix: {
      type: String as PropType<string>,
      default: "quick",
    },
    mask: {
      type: [Boolean, Object] as PropType<boolean | MaskConfig>,
      default: true,
    },
    current: {
      type: Number as PropType<number>,
      default: 0,
    },
    show: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    arrow: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    padding: {
      type: [Object, Number] as PropType<number | { x: number; y: number }>,
      default: 5,
    },
    maskZIndex: {
      type: [String, Number] as PropType<number | string>,
      default: "1001",
    },
    dialogShowClose: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    modalTransition: {
      type: Object as PropType<TransitionLifeCycleProps>,
      default: undefined,
    },
    maskTransition: {
      type: Object as PropType<TransitionLifeCycleProps>,
      default: undefined,
    },
    globalThemeOverrides: {
      type: Object as PropType<GlobalThemeOverrides>,
      default: undefined,
    },
  };
};
