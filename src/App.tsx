import { defineComponent, unref } from "vue";
import { NButton, NSpace } from "naive-ui";
import { Tour } from "./components/Tour";
import { ref } from "vue";
import { TourStep } from "./components/type";

const steps: TourStep[] = [
  {
    el: () => document.getElementById("info-btn") as HTMLElement,
    title: '第一步来个rap',
    message: '你是第一步',
    mask: {
      color: "rgba(0, 0, 0, .5)",
    },
  },
  {
    el: () => document.getElementById("success-btn") as HTMLElement,
    title: '第二步来首歌',
    message: '第二步',
    mask: {
      color: "rgba(0, 0, 0, .35)",
    },
  },
  {
    el: () => document.getElementById("warning-btn") as HTMLElement,
    title: '第三步我们来跳个舞',
    message: '你是第三步',
    mask: {
      color: "rgba(0, 0, 0, .2)",
    },
  },
  {
    // el: () => document.getElementById("error-btn") as HTMLElement,
    title: '现在，开始拿起篮球吧！',
    message: '这是最后一步了',
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
  },
];

export default defineComponent({
  name: "RootApp",
  setup() {
    const show = ref(false);
    const current = ref(0);

    const handleOpenTour = () => {
      current.value = 0;
      show.value = true;
    };
    return () => (
      <div>
        <NButton
          type="default"
          onClick={handleOpenTour}
          style="margin-bottom: 20px"
        >
          开始吧
        </NButton>
        <NSpace>
          <NButton id="info-btn" type="info">
            第一步
          </NButton>
          <NButton id="success-btn" type="success">
            第二步
          </NButton>
          <NButton id="warning-btn" type="warning">
            第三部
          </NButton>
          <NButton id="error-btn" type="error">
            第四部
          </NButton>
        </NSpace>

        <Tour
          steps={steps}
          show={unref(show)}
          onUpdate:show={(val) => (show.value = val)}
          mask
          current={unref(current)}
          onUpdate:current={(val) => (current.value = val)}
          padding={{ x: 9, y: 8 }}
        />
      </div>
    );
  },
});
