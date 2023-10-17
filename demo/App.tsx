import { defineComponent, h, unref } from "vue";
import { NButton, NGradientText } from "naive-ui";
import { type TourStep } from "../package/index";
import { Tour } from "../package/index";
// import { Tour } from '../es/index';
// import { Tour, TourStep } from 'vue3-quick-tour'
import { ref } from "vue";

const steps: TourStep[] = [
  {
    el: () => document.getElementById("info-btn") as HTMLElement,
    title: "平凡之路",
    message: "这是一个很普通的常规渲染",
    mask: {
      color: 'rgba(0, 0, 0, .3)',
    },
    placement: "top",
    buttonProps: {
      prev: { text: '向前' },
      next: { text: '往后' },
      finish: { text: '知道' }
    }
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
      {
        default: () => "葫芦娃，一根藤上七个瓜~",
      }
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
        type: "error",
        size: "26",
      },
      {
        default: () => "抱歉，不需要标题",
      }
    ),
    mask: false,
    placement: "right",
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
  {
    el: () => document.getElementById("open-tour") as HTMLElement,
    title: "回到梦开始的地方",
    message: h(
      NGradientText,
      {
        type: "info",
        size: "30",
      },
      {
        default: () => "点我重新开始",
      }
    ),
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "right-end",
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
        <div id="open-tour" style={{ display: 'inline-block' }}>
          <NButton
            type="default"
            onClick={handleOpenTour}
            style="margin: 20px"
          >
            开始吧
          </NButton>
        </div>

        <div style={{ transform: "translate(300px,100px)", display: 'inline-block' }} id="info-btn">
          <NButton type="info">第一步</NButton>
        </div>

        <div style={{ transform: "translate(600px,600px)", display: 'inline-block' }} id="success-btn">
          <NButton type="success">第二步</NButton>
        </div>

        <div style={{ transform: "translate(1000px,100px)", display: 'inline-block' }} id="warning-btn">
          <NButton type="warning">第三部</NButton>
        </div>
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
          onOpen={() => {
            console.log("open");
          }}
          onOpened={() => {
            console.log("opened");
          }}
          onClose={() => {
            console.log("close");
          }}
          onClosed={() => {
            console.log("closed");
          }}
          onNext={() => {
            console.log("next");
          }}
          padding={{ x: 10, y: 8 }}
          globalThemeOverrides={{
            common: {
              primaryColor: "rgb(238, 79, 18)", // 主题色
              duration: 300, // 动画过渡时长
              // bezier: 'linear', // 动画表现曲线
              borderRadius: "4px",
            },
            mask: {
              duration: 300,
            },
          }}

          buttonProps={{
            finish: { text: '我不知道' },
            prev: { text: '往前看' },
            next: { text: '往后看' }
          }}
        />
      </div>
    );
  },
});
