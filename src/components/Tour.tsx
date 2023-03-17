import {
  PropType,
  defineComponent,
  ref,
  unref,
  watch,
  reactive,
  Teleport,
  CSSProperties,
  computed,
  renderSlot,
  onMounted,
  onUnmounted,
  Transition,
} from "vue";

// mask
import { TourMask } from "./TourMask";
// dot
import { TourDot } from "./TourDot";

import {
  TragetRect,
  ScreenRect,
  ArrowRect,
  MaskRectReactive,
  type Nullable,
  TourStep,
TransitionLifeCycleProps,
} from "./type";
// utils
import { useTourTransition } from "./TourResolve";
import { defaultMaskRect } from './get-position';

// style render
import { createDialogStyle } from "./style";
// icon svg
import { DialogCloseSvg } from "./TourDialogClose";
import { useTourModalTransition } from "./create-transition";

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
    modalTransition: {
      type: Object as PropType<TransitionLifeCycleProps>,
      default: undefined,
    },
    maskTransition: {
      type: Object as PropType<TransitionLifeCycleProps>,
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
    "change",
    "prev",
    "close",
    "closed",
  ],
  setup(props, { emit, expose, slots }) {
    const id = `${Math.random().toString(16).slice(2)}`;
    const show = ref(props.show);
    const current = ref(props.current || 0);

    const screenRef = ref<Nullable<Element>>(null);
    const screenRect = ref<Nullable<ScreenRect>>(null);
    const targetRect = ref<Nullable<TragetRect>>(null);
    const arrowRect = ref<Nullable<ArrowRect>>(null);

    const __transition = useTourModalTransition(props.modalTransition);

    const maskRect = reactive<MaskRectReactive>(defaultMaskRect());

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

    const { next, prev, last, load, changeStep } = useTourTransition({
      steps: props.steps,
      emit: emit,
      padding: props.padding,
      current: current,
      maskRect,
      targetRect,
      screenRect,
      arrowRect,
      screenRef,
    });
    const { mount, unMount } = createDialogStyle(id, {
      classPrefix: props.classPrefix,
      zIndex: Number(props.maskZIndex) + 1,
    });

    const openTour = () => {
      show.value = true;
      load();
      emit("update:show", true);
      emit("open");
    };

    const closeTour = () => {
      show.value = false;
      restRect();
      emit("update:show", false);
      emit("close");
    };

    const handleFinish = () => {
      closeTour();
      emit('finish')
    };

    const restRect = () => {
      Object.assign(maskRect, defaultMaskRect());
      targetRect.value = null;
      screenRect.value = null;
      arrowRect.value = null;
      emit('closed');
    };

    watch(
      () => props.show,
      (val) => {
        val ? openTour() : closeTour();
      }
    );

    watch(
      () => props.current,
      (val) => {
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
          <Transition { ...unref(__transition) as any } css={false} onAfterEnter={emit('opened')} onAfterLeave={restRect}>
            {unref(show) && (
              <div
                key={unref(show) ? "show" : "hidden"}
                class={`${props.classPrefix}-tour-dialog_${id}`}
                style={{
                  top: `${unref(screenRect)?.top}px`,
                  left: `${unref(screenRect)?.left}px`,
                }}
                ref={(_ref) => (screenRef.value = _ref as Element)}
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
                      <div class={`${props.classPrefix}-tour-content_${id}`}>
                        {slots.content
                          ? renderSlot(slots, "content", {
                              currentStep: unref(getCurrentStep),
                            })
                          : unref(getCurrentStep)?.message}
                      </div>
                      <div class={`${props.classPrefix}-tour-footer_${id}`}>
                        <TourDot
                          length={props.steps.length}
                          current={unref(current)}
                        ></TourDot>
                        {/* 上一步 */}
                        {unref(current) > 0 && (
                          <button title="上一步" onClick={prev}>
                            上一步
                          </button>
                        )}
                        {/* 下一步 */}
                        {unref(current) < props.steps.length - 1 && (
                          <button title="下一步" onClick={next}>
                            下一步
                          </button>
                        )}

                        {unref(current) === props.steps.length - 1 && (
                          <button title="我知道了" onClick={handleFinish}>
                            我知道了
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Transition>
        </Teleport>

        <TourMask
          show={unref(getMaskShow) && props.mask}
          maskRect={maskRect}
          zIndex={props.maskZIndex}
          color={unref(getMaskColor)}
          wrapperStyle={unref(getMaskWrapperStyle)}
          transition={props.maskTransition}
        />
      </div>
    );
  },
});
