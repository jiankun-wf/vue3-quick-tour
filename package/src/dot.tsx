import {
  CSSProperties,
  PropType,
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  unref,
} from "vue";
import { createTourDotsStyle } from "../styles";

export const TourDot = defineComponent({
  name: "TourDot",

  props: {
    length: {
      type: Number as PropType<number>,
      default: 0,
    },
    current: Number as PropType<number>,
    style: {
      type: Object as PropType<CSSProperties>,
      default: undefined,
    },
  },
  setup(props) {
    const { mount, unMount } = createTourDotsStyle();
    const getLength = computed(() => {
      const arr = [];
      let i = 0;
      while (i < props.length) {
        arr.push(i);
        i++;
      }
      return arr;
    });

    onMounted(() => {
      mount({ id: 'tour-dot' });
    });

    onUnmounted(() => {
      unMount({ id: 'tour-dot' });
    });

    return () => (
      <div class="tour-dots" style={{ ...props.style }}>
        {unref(getLength).map((num) => (
          <div
            class={["tour-dots__dot", num === props.current && "is-active"]}
          ></div>
        ))}
      </div>
    );
  },
});
