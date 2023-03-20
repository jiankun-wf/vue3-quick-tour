import cssRender from "css-render";

import { MaskCreateProps, DialogStyleProps } from "./type";

const { c } = cssRender();

export const createMaskStyle = (id: string, props: MaskCreateProps) => {
  const style = c(
    `.tour-mask-${id}`,
    () => ({
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: props.zIndex,
      "--duration": ".377s",
      "--easing-function": "ease",
      transition: "all var(--duration) var(--easing-function)",
    }),
    [
      c(`.tour-mask-svg-${id}`, {
        width: "100%",
        height: "100%",
      }),

      c(`.tour-mask--placeholder-${id}`, {
        transition: "all var(--duration) var(--easing-function)",
      }),

      c(`.tour-mask--background-${id}`, {
        transition: "all var(--duration) var(--easing-function)",
      }),
    ]
  );

  return { mount: style.mount.bind(style), unMount: style.unmount.bind(style) };
};

export const createDialogStyle = (id: string, props: DialogStyleProps) => {
  const style = c(
    `.${props.classPrefix}-tour-dialog_${id}`,
    () => ({
      position: "absolute",
      zIndex: props.zIndex,
      boxSizing: "border-box",
      backgroundColor: "#fff",
      borderRadius: "4px",
      "--duration": "377ms",
      "--easing-function": "ease",
      transition: "all var(--duration) var(--easing-function)",
      color: "rgba(0, 0, 0, 0.85),",
      "--primary-color": "#2080f0",
      width: '476px',
    }),
    [
      c(
        `& .${props.classPrefix}-tour-content_${id}`,
        () => ({
          position: "relative",
        }),
        [
          c(
            `& .${props.classPrefix}-tour-arrow_${id}`,
            {
              position: "absolute",
              display: "block",
              pointerEvents: "none",
              width: "16px",
              height: "16px",
              overflow: "hidden",
            },
            [
              c(`&::before`, {
                position: "absolute",
                bottom: "0",
                insetInlineStart: "0",
                zIndex: "1",
                width: "16px",
                height: "8px",
                background: "#FFF",
                clipPath: `path('M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z')`,
                content: "",
              }),
              c(`&::after`, {
                content: "",
                position: "absolute",
                width: "9px",
                height: "9px",
                bottom: "0",
                insetInline: "0px",
                margin: "auto",
                borderRadius: "2px",
                transform: "translateY(50%) rotate(-135deg)",
                boxShadow: "2px 2px 5px rgba(0,0,0,.05)",
                zIndex: "0",
              }),
            ]
          ),
          c(
            `& .${props.classPrefix}-tour-inner_${id}`,
            {
              display: "flex",
              flexDirection: "column",
              minWidth: "400px",
              boxSizing: "border-box",
              lineHeight: "22px",
            },
            [
              //  close icon
              c(
                `& .${props.classPrefix}-tour-close_${id}`,
                {
                  cursor: "pointer",
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  outline: "none",
                  width: "22px",
                  height: "22px",
                  transition:
                    "background-color var(--duration) var(--easing-function)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                },
                [
                  c(`&:hover`, {
                    backgroundColor: "rgba(0, 0, 0, 0.06)",
                  }),
                ]
              ),
              c(
                `.${props.classPrefix}-tour-header_${id}`,
                {
                  padding: "16px 16px 8px",
                },
                [
                  c(`.${props.classPrefix}-tour-title_${id}`, {
                    fontSize: "14px",
                    fontWeight: "600",
                  }),
                ]
              ),
              c(`.${props.classPrefix}-tour-message_${id}`, {
                padding: "0px 16px 0",
              }),
              c(`.${props.classPrefix}-tour-footer_${id}`, {
                padding: "16px 16px 16px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }),
            ]
          ),
        ]
      ),
    ]
  );
  return { mount: style.mount.bind(style), unMount: style.unmount.bind(style) };
};

export const createTourDotsStyle = () => {
  const style = c(
    `.tour-dots`,
    {
      display: "flex",
      flexDirection: "row",
      gap: "5px",
    },
    [
      c(
        `.tour-dots__dot`,
        {
          width: "8px",
          height: "8px",
          borderRadius: "6px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          cursor: "default",
          transition: "background-color var(--duration) var(--easing-function)",
        },
        [
          c(`&.is-active`, {
            backgroundColor: "var(--primary-color)",
          }),
        ]
      ),
    ]
  );
  return { mount: style.mount.bind(style), unMount: style.unmount.bind(style) };
};
