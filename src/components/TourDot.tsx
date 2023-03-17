import {
  PropType,
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  unref,
} from "vue";
import { createTourDotsStyle } from "./style";

export const TourDot = defineComponent({
  name: "TourDot",

  props: {
    length: {
      type: Number as PropType<number>,
      default: 0,
    },
    current: Number as PropType<number>,
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
      mount();
    });

    onUnmounted(() => {
      unMount();
    });

    return () => (
      <div class="tour-dots">
        {unref(getLength).map((num) => (
          <div class={[
            'tour-dots__dot',
            num === props.current && 'is-active',
          ]}></div>
        ))}
      </div>
    );
  },
});
