import { defineComponent, unref } from "vue";
import { NButton, NSpace } from "naive-ui";
import { Tour } from "./components/Tour";
import { ref } from "vue";
import { TourStep } from "./components/type";

const steps: TourStep[] = [
  {
    el: () => document.getElementById("info-btn") as HTMLElement,
  },
  {
    el: () => document.getElementById("success-btn") as HTMLElement,
    mask: {
      color: "rgba(80, 255, 255, .4)",
      style: {
        boxShadow: "inset 0 0 15px #333",
      },
    },
  },
  {
    el: () => document.getElementById("warning-btn") as HTMLElement,
  },
  {
    el: () => document.getElementById("error-btn") as HTMLElement,
  },
];

export default defineComponent({
  name: "RootApp",
  setup() {
    const show = ref(false);
    const current = ref(0);

    const handleOpenTour = () => {
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
            Info
          </NButton>
          <NButton id="success-btn" type="success">
            Success
          </NButton>
          <NButton id="warning-btn" type="warning">
            Warning
          </NButton>
          <NButton id="error-btn" type="error">
            Error
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
