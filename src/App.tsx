import { defineComponent, h, unref } from "vue";
import { NButton, NGradientText, NSwitch } from "naive-ui";
import { Tour } from "./components/Tour";
import { ref } from "vue";
import { TourStep } from "./components/type";

const steps: TourStep[] = [
  {
    el: () => document.getElementById("info-btn") as HTMLElement,
    title: "平凡之路",
    message: "这是一个很普通的常规渲染",
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "right",
  },
  {
    el: () => document.getElementById("success-btn") as HTMLElement,
    title: "如果来点样式呢？",
    message: h(
      NGradientText,
      {
        gradient: "linear-gradient(90deg, red 0%, green 50%, blue 100%)",
        size: "48",
        style: { whiteSpace: "normal" },
      },
      "葫芦娃，一根藤上七个瓜~"
    ),
    mask: {
      color: "rgba(0, 0, 0, .5)",
    },
    placement: "top",
  },
  {
    el: () => document.getElementById("warning-btn") as HTMLElement,
    message: h(
      NGradientText,
      {
        type: "success",
        size: "26",
      },
      "抱歉，不需要标题"
    ),
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "left-start",
  },
  {
    // el: () => document.getElementById("error-btn") as HTMLElement,
    title: "最后重申，我是真ikun",
    message: h("img", {
      style: { width: "100%" },
      src: "https://blog.haiya360.com/usr/uploads/2020/07/1689695513.gif",
    }),
    mask: {
      color: "rgba(0, 0, 0, 1)",
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
        <NButton
          style={{ transform: "translate(200px,300px)" }}
          id="info-btn"
          type="info"
        >
          第一步
        </NButton>
        <NButton
          style={{ transform: "translate(500px,500px)" }}
          id="success-btn"
          type="success"
        >
          第二步
        </NButton>
        <NButton
          style={{ transform: "translate(700px,100px)" }}
          id="warning-btn"
          type="warning"
        >
          第三部
        </NButton>
        {/* <NButton style={{ transform: 'translate(900px,0px)' }}  id="error-btn" type="error">
          第四部
        </NButton> */}

        <Tour
          steps={steps}
          show={unref(show)}
          onUpdate:show={(val) => (show.value = val)}
          mask
          current={unref(current)}
          onUpdate:current={(val) => (current.value = val)}
          padding={6}
        />
      </div>
    );
  },
});
