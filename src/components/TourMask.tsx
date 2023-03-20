import {
  CSSProperties,
  PropType,
  Teleport,
  Transition,
  defineComponent,
  onMounted,
  onUnmounted,
  unref,
} from "vue";
import { MaskRectReactive, TransitionLifeCycleProps } from "./type";
import { createMaskStyle } from "./style";
import { useTourMaskTransition } from "./create-transition";

export const TourMask = defineComponent({
  name: "TourMask",
  props: {
    maskRect: {
      type: Object as PropType<MaskRectReactive>,
      default: () => ({}),
    },
    zIndex: {
      type: [String, Number] as PropType<number | string>,
      default: "1001",
    },
    color: {
      type: String as PropType<string>,
      default: "rgba(0,0,0,0.5)",
    },
    wrapperStyle: {
      type: Object as PropType<Partial<CSSProperties>>,
      default: undefined,
    },
    show: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    transition: {
      type: Object as PropType<TransitionLifeCycleProps>,
      default: undefined,
    }
  },
  setup(props) {
    const id = `${Math.random().toString(16).slice(2)}`;
    const { mount, unMount } = createMaskStyle(id, { zIndex: props.zIndex });
    const __transition = useTourMaskTransition(props.transition);
    onMounted(() => {
      mount();
    });

    onUnmounted(() => {
      unMount();
    })
    return () => (
      <Teleport to="body">
        <Transition { ...unref(__transition) as any }>
          {props.show && (
            <div key={props.show ? "show" : "hidden"} class={`tour-mask-${id}`} style={props.wrapperStyle}>
              <svg class={`tour-mask-svg-${id}`}>
                <defs>
                  <mask id="quick-tour-mask-:r0:">
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="white"
                    ></rect>
                    <rect
                      fill="black"
                      rx="4"
                      x={props.maskRect.center!.left}
                      y={props.maskRect.center!.top}
                      width={props.maskRect.center!.width}
                      height={props.maskRect.center!.height}
                      class={`tour-mask--placeholder-${id}`}
                    ></rect>
                  </mask>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  pointer-events="auto"
                  // 这是背景颜色！！！！！
                  fill={props.color}
                  class={`tour-mask--background-${id}`}
                  mask="url(#quick-tour-mask-:r0:)"
                ></rect>
                {/* 上 */}
                <rect
                  fill="transparent"
                  pointer-events="auto"
                  x={props.maskRect.top.left}
                  y={props.maskRect.top.top}
                  width={props.maskRect.top.width}
                  height={props.maskRect.top.height}
                ></rect>
                {/* 右 */}
                <rect
                  fill="transparent"
                  pointer-events="auto"
                  x={props.maskRect.right.left}
                  y={props.maskRect.right.top}
                  width={props.maskRect.right.width}
                  height={props.maskRect.right.height}
                ></rect>
                {/* 下 */}
                <rect
                  fill="transparent"
                  pointer-events="auto"
                  x={props.maskRect.bottom.left}
                  y={props.maskRect.bottom.top}
                  width={props.maskRect.bottom.width}
                  height={props.maskRect.bottom.height}
                ></rect>
                {/* 左 */}
                <rect
                  fill="transparent"
                  pointer-events="auto"
                  x={props.maskRect.left.left}
                  y={props.maskRect.left.top}
                  width={props.maskRect.left.width}
                  height={props.maskRect.left.height}
                ></rect>
              </svg>
            </div>
          )}
        </Transition>
      </Teleport>
    );
  },
});
