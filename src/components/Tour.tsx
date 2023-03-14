import {
  PropType,
  defineComponent,
  ref,
  unref,
  watch,
  Transition,
  reactive,
  Teleport,
  CSSProperties,
  computed,
  renderSlot,
  onMounted,
  onUnmounted,
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
// utils
import { useTourTransition } from "./TourResolve";
import { isObject } from "./utils";
// style render
import { createDialogStyle } from "./style";
// icon svg
import close from "../assets/close.svg";
import { DialogCloseSvg } from "./TourDialogClose";

export const Tour = defineComponent({
  name: "TourQuick",
  props: {
    steps: {
      type: Array as PropType<Array<TourStep>>,
      default: () => [],
    },
    classPrefix: {
      type: String as PropType<string>,
      default: "quick",
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
    dialogShowClose: {
      type: Boolean as PropType<boolean>,
      default: true,
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
    const id = `${Math.random().toString(16).slice(2)}`;
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

    const { next, prev, last, load, changeStep } = useTourTransition({
      steps: props.steps,
      emit: emit,
      padding: props.padding,
      current: current,
      maskRect,
      targetRect,
      screenRect,
      arrowRect,
    });
    const { mount, unMount } = createDialogStyle(id, {
      classPrefix: props.classPrefix,
      zIndex: Number(props.maskZIndex) + 1,
    });

    const openTour = () => {
      show.value = true;
      load(unref(current));
      emit("update:show", true);
      emit("open");
    };

    const closeTour = () => {
      show.value = false;
      emit("update:show", false);
      emit("close");
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
        val ? openTour() : closeTour();
      }
    );

    watch(
      () => props.current,
      (val, oldVal) => {
        changeStep(val);
      }
    );

    onMounted(() => {
      mount();
    });

    onUnmounted(() => {
      unMount();
    });

    expose({
      prev,
      next,
      last,
    });

    return () => (
      <div>
        <Teleport to="body">
          {unref(show) && (
            <div>
              <div
                class={`${props.classPrefix}-tour-dialog_${id}`}
                style={{
                  top: unref(screenRect)?.top,
                  left: unref(screenRect)?.left,
                }}
              >
                {slots.default ? (
                  renderSlot(slots, "default", {
                    close: closeTour.bind(null),
                    current: unref(current),
                    currentStep: unref(getCurrentStep),
                    next,
                    prev,
                    last,
                    steps: props.steps,
                  })
                ) : (
                  <div class={`${props.classPrefix}-tour-content_${id}`}>
                    {props.arrow && (
                      <div
                        class={`${props.classPrefix}-tour-arrow_${id}`}
                      ></div>
                    )}
                    <div class={`${props.classPrefix}-tour-inner_${id}`}>
                      {slots.close ? (
                        renderSlot(slots, "close", {
                          close: closeTour.bind(null),
                          current: unref(current),
                          currentStep: unref(getCurrentStep),
                        })
                      ) : (
                        <span
                          class={`${props.classPrefix}-tour-close_${id}`}
                          role="img"
                          title="关闭"
                        >
                          <DialogCloseSvg onClick={closeTour} />
                        </span>
                      )}
                      <div class={`${props.classPrefix}-tour-header_${id}`}>
                        {slots.title ? (
                          renderSlot(slots, "title", {
                            currentStep: unref(getCurrentStep),
                          })
                        ) : (
                          <span class={`${props.classPrefix}-tour-title_${id}`}>
                            {unref(getCurrentStep)?.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
      </div>
    );
  },
});
