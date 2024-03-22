import { type PropType, defineComponent, watch } from "vue";
import { type ButtonsConfig, type TourStep } from "../types";

export const ControlButton = defineComponent({
  name: "ControlButton",
  props: {
    current: {
      type: Number as PropType<number>,
      default: 0,
    },
    steps: {
      type: Array as PropType<Array<TourStep>>,
      default: () => [],
    },
    buttonProps: {
      type: Object as PropType<ButtonsConfig>,
      default: () => ({}),
    },
  },
  emits: ["prev-click", "next-click", "finish-click"],
  setup(props, { emit }) {

    watch(() => props.current, (val) => {
        console.log(val);
    }, { immediate: true })

    return () => (
        
      <div class="control-buttons">
        {/* 上一步 */}
        {props.current > 0 && (
          <button
            class="tour-prev-button"
            onClick={emit.bind(null, "prev-click")}
          >
            {props.buttonProps.prev?.text ?? "上一步"}
          </button>
        )}
        {/* 下一步 */}
        {props.current < props.steps.length - 1 && (
          <button
            class="tour-next-button"
            onClick={emit.bind(null, "next-click")}
          >
            {props.buttonProps.next?.text ?? "下一步"}
          </button>
        )}

        {props.current === props.steps.length - 1 && (
          <button
            class="tour-finish-button"
            onClick={emit.bind(null, "finish-click")}
          >
            {props.buttonProps.finish?.text ?? "我知道了"}
          </button>
        )}
      </div>
    );
  },
});
