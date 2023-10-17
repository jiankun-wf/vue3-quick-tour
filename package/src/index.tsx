import {
  defineComponent,
  ref,
  unref,
  watch,
  reactive,
  Teleport,
  computed,
  renderSlot,
  onMounted,
  onUnmounted,
  Transition,
  isVNode,
  CSSProperties,
} from "vue";

// component
import { TourMask } from "./mask";
import { TourDot } from "./dot";
import { TourModalClose } from "./close";
//   types
import {
  TragetRect,
  ScreenRect,
  ArrowRect,
  MaskRectReactive,
  type Nullable,
  type TourStep,
  type TourProps,
} from "../types";
// utils
import {
  useTourTransition,
  useTourMaskSetting,
  useTourButtonSetting,
} from "../hooks";
import { defaultMaskRect } from "../hooks/position";
import { useTourModalTransition } from "../hooks/transition";
//   styles
import {
  getDotStyleVars,
  getModalStyleConfig,
  getModalStyleVars,
} from "../styles/vars";
// style render
import { createDialogStyle } from "../styles";
// props
import { createTourProps } from "../props";
import { ControlButton } from "./Control";

export const Tour = defineComponent({
  name: "TourQuick",
  props: createTourProps(),
  emits: [
    "update:current",
    "update:show",
    "next",
    "prev",
    "finish",
    "open",
    "opened",
    "change",
    "close",
    "closed",
  ],
  setup(props, { emit, expose, slots }) {
    const show = ref(props.show);
    const current = ref(props.current || 0);

    const screenRef = ref<Nullable<Element>>(null);
    const screenRect = ref<Nullable<ScreenRect>>(null);
    const targetRect = ref<Nullable<TragetRect>>(null);
    const arrowRef = ref<Nullable<Element>>(null);
    const arrowRect = ref<Nullable<ArrowRect>>(null);
    const maskRect = reactive<MaskRectReactive>(defaultMaskRect());

    // 获取当前步骤信息
    const getCurrentStep = computed(
      () => props.steps[unref(current)] as TourStep
    );
    // modal--transition处理函数
    const __transition = useTourModalTransition(
      props.modalTransition,
      getModalStyleConfig(props.globalThemeOverrides).common?.duration
    );
    // 控制上一条、下一条核心处理函数
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
      arrowRef,
    });
    // 获取当前mask配置
    const { getMaskColor, getMaskWrapperStyle, getMaskShow } =
      useTourMaskSetting(getCurrentStep, props, show);

    // 获取button---config

    const { getCurrentStepButtonProps } = useTourButtonSetting(
      getCurrentStep,
      props
    );

    // css-vars
    const dotStyleVars = getDotStyleVars(props.globalThemeOverrides);
    const modalStyleVars = getModalStyleVars(props.globalThemeOverrides);

    // 获取当前遮罩颜色
    const cssvarsId = Date.now().toString(16);
    const { mount, unMount } = createDialogStyle(
      {
        classPrefix: props.classPrefix,
        zIndex: Number(props.maskZIndex) + 1,
      },
      unref(modalStyleVars) as any,
      cssvarsId
    );

    const openTour = () => {
      show.value = true;
      load();
      emit("update:show", true);
      emit("open");
    };

    const closeTour = () => {
      show.value = false;
      emit("update:show", false);
      emit("close");
      restRect();
    };

    const handleFinish = () => {
      closeTour();
      emit("finish");
    };

    const restRect = () => {
      Object.assign(maskRect, defaultMaskRect());
      targetRect.value = null;
      screenRect.value = null;
      arrowRect.value = null;
    };

    const renderContentMessage = () => {
      const { message } = unref(getCurrentStep);
      if (typeof message === "string") {
        return message;
      } else if (isVNode(message)) {
        return message;
      }
    };

    watch(
      () => props.show,
      (val) => {
        show.value = val;
        val && openTour();
      }
    );

    watch(
      () => props.current,
      (val) => {
        changeStep(val);
      }
    );

    onMounted(() => {
      mount({ id: "tour-dialog" });
    });

    onUnmounted(() => {
      unMount({ id: "tour-dialog" });
    });

    expose({
      prev,
      next,
      last,
    });

    return () => (
      <div>
        <Teleport to="body">
          <Transition
            {...(unref(__transition) as any)}
            css={false}
            onAfterEnter={emit.bind(null, "opened")}
            onAfterLeave={() => {
              restRect();
              emit("closed");
            }}
          >
            {unref(show) && (
              <div
                key={unref(show) ? "show" : "hidden"}
                class={`${props.classPrefix}-tour-dialog css-vars-${cssvarsId}`}
                style={{
                  top: `${unref(screenRect)?.top}px`,
                  left: `${unref(screenRect)?.left}px`,
                }}
                ref={(_ref) => (screenRef.value = _ref as Element)}
              >
                <div class={`${props.classPrefix}-tour-content`}>
                  {props.arrow && (
                    <div
                      class={`${props.classPrefix}-tour-arrow`}
                      ref={(_ref) => (arrowRef.value = _ref as Element)}
                      style={{ ...unref(arrowRect) }}
                    ></div>
                  )}
                  {slots.default ? (
                    renderSlot(slots, "default", {
                      close: closeTour.bind(null),
                      current: unref(current),
                      currentStep: unref(getCurrentStep),
                      next: next.bind(null),
                      prev: prev.bind(null),
                      last,
                      steps: props.steps,
                    })
                  ) : (
                    <>
                      <div class={`${props.classPrefix}-tour-inner`}>
                        {slots.close ? (
                          renderSlot(slots, "close", {
                            close: closeTour.bind(null),
                            current: unref(current),
                            currentStep: unref(getCurrentStep),
                          })
                        ) : (
                          <span
                            class={`${props.classPrefix}-tour-close`}
                            role="img"
                            title="关闭"
                          >
                            <TourModalClose onClick={closeTour} />
                          </span>
                        )}
                        <div class={`${props.classPrefix}-tour-header`}>
                          {slots.title ? (
                            renderSlot(slots, "title", {
                              currentStep: unref(getCurrentStep),
                            })
                          ) : (
                            <span class={`${props.classPrefix}-tour-title`}>
                              {unref(getCurrentStep)?.title}
                            </span>
                          )}
                        </div>
                        <div class={`${props.classPrefix}-tour-message`}>
                          {slots.content
                            ? renderSlot(slots, "content", {
                                currentStep: unref(getCurrentStep),
                              })
                            : renderContentMessage()}
                        </div>
                        <div class={`${props.classPrefix}-tour-footer`}>
                          <TourDot
                            length={props.steps.length}
                            current={unref(current)}
                            style={unref(dotStyleVars)}
                          ></TourDot>
                          {/* 上一步 */}

                          <ControlButton
                            onFinish-click={handleFinish}
                            onPrev-click={prev}
                            onNext-click={next}
                            current={unref(current)}
                            buttonProps={unref(getCurrentStepButtonProps)}
                            steps={props.steps}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </Transition>
        </Teleport>

        <TourMask
          show={unref(getMaskShow)}
          maskRect={maskRect}
          zIndex={props.maskZIndex}
          color={unref(getMaskColor)}
          wrapperStyle={unref(getMaskWrapperStyle)}
          transition={props.maskTransition}
          globalThemeOverrides={props.globalThemeOverrides}
        />
      </div>
    );
  },
});
