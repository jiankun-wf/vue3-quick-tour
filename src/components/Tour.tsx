import {
  PropType,
  defineComponent,
  ref,
  unref,
  watch,
  Transition,
  reactive,
  Fragment,
  Teleport,
  CSSProperties,
  computed,
  renderSlot,
} from "vue";

// mask
import { TourMask } from "./TourMask";

import {
  TragetRect,
  ScreenRect,
  ArrowRect,
  MaskRectReactive,
  type Nullable,
  TourStep,
} from "./type";

import { useTourTransition } from "./TourResolve";
import { isObject } from "./utils";

export const Tour = defineComponent({
  name: "TourQuick",
  props: {
    steps: {
      type: Array as PropType<Array<TourStep>>,
      default: () => [],
    },
    mask: {
      type: Boolean as PropType<boolean>,
      default: false,
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
    maskStyle: {
      type: Object as PropType<Partial<CSSProperties>>,
      default: undefined,
    },
    maskColor: {
      type: String as PropType<string>,
      default: undefined,
    },
  },
  emits: [
    "update:current",
    "update:show",
    "next",
    "finish",
    "open",
    "opened",
    "close",
    "change",
    "prev",
  ],
  setup(props, { emit, expose, slots }) {
    const show = ref(props.show);
    const current = ref(props.current || 0);

    const screenRect = ref<Nullable<ScreenRect>>(null);
    const targetRect = ref<Nullable<TragetRect>>(null);
    const arrowRect = ref<Nullable<ArrowRect>>(null);

    const maskRect = reactive<MaskRectReactive>({
      left: { left: 0, top: 0, width: 0, height: 0 },
      top: { left: 0, top: 0, width: 0, height: 0 },
      right: { left: 0, top: 0, width: 0, height: 0 },
      bottom: { left: 0, top: 0, width: 0, height: 0 },
      center: { left: 0, top: 0, width: 0, height: 0 },
    });

    const { next, prev, last, load } = useTourTransition({
      steps: props.steps,
      emit: emit,
      padding: props.padding,
      current: current,
      maskRect,
      targetRect,
      screenRect,
      arrowRect,
    });

    const openTour = (val: boolean) => {
      show.value = val;
      load(unref(current));
      emit("update:show", val);
      emit("open");
    };

    // 获取当前步骤信息
    const getCurrentStep = computed(() => props.steps?.at(unref(current)));
    // 获取当前遮罩颜色
    const getMaskColor = computed(() => {
      const { mask } = unref(getCurrentStep) || {};
      if (typeof mask === "object") {
        return mask.color ?? props.maskColor;
      }
      return props.maskColor;
    });
    // 获取当前遮罩样式
    const getMaskWrapperStyle = computed(() => {
      const { mask } = unref(getCurrentStep) || {};
      if (typeof mask === "object") {
        return mask.style ?? props.maskStyle;
      }
      return props.maskStyle;
    });
    //  获取当前遮罩是否显示
    const getMaskShow = computed(() => {
      const { mask } = unref(getCurrentStep) || {};
      if (typeof mask === "boolean") {
        return mask === false ? false : unref(show);
      }
      return unref(show);
    });

    watch(
      () => props.show,
      (val) => {
        openTour(val);
      }
    );

    expose({
      prev,
      next,
      last,
    });

    return () => (
      <Fragment>
        <Teleport to="body">
          {unref(show) && (
            <div>
              <div class="quick-tour-dialog">
                {slots.default ? (
                  renderSlot(slots, "default")
                ) : (
                  <div class="quick-tour-content">
                    <div class="quick-tour-inner"></div>
                  </div>
                )}
              </div>
              {props.arrow && <div class="quick-tour-arrow"></div>}
            </div>
          )}
        </Teleport>

        <Transition name="fade">
          {unref(getMaskShow) && props.mask && (
            <TourMask
              key={unref(show) ? "show" : "hidden"}
              maskRect={maskRect}
              zIndex={props.maskZIndex}
              color={unref(getMaskColor)}
              wrapperStyle={unref(getMaskWrapperStyle)}
            />
          )}
        </Transition>
      </Fragment>
    );
  },
});
