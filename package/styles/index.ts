import cssRender from "css-render";

import { MaskCreateProps, DialogStyleProps } from "../types";
const { c } = cssRender();

export const createMaskStyle = (
  props: MaskCreateProps,
  cssVars: Record<string, string | number>,
  cssId: string
) => {
  const style = c(
    `.${props.classPrefix}-tour-mask`,
    () => ({
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: props.zIndex,
      transition: "all var(--tour-mask-duration) var(--tour-mask-bezier)",
    }),
    [
      c(`&.css-vars-${cssId}`, () => cssVars),
      c(`.${props.classPrefix}-tour-mask-svg`, {
        width: "100%",
        height: "100%",
      }),

      c(`.${props.classPrefix}-tour-mask--placeholder`, {
        transition: "all var(--tour-mask-duration) var(--tour-mask-bezier)",
      }),

      c(`.${props.classPrefix}-tour-mask--background`, {
        transition: "all var(--tour-mask-duration) var(--tour-mask-bezier)",
      }),
    ]
  );
  return { mount: style.mount.bind(style), unMount: style.unmount.bind(style) };
};

export const createDialogStyle = (
  props: DialogStyleProps,
  cssVars: Record<string, string | number>,
  cssId: string
) => {
  const style = c(
    `.${props.classPrefix}-tour-dialog`,
    () => ({
      position: "absolute",
      zIndex: props.zIndex,
      boxSizing: "border-box",
      backgroundColor: "var(--tour-modal-background)",
      borderRadius: "var(--tour-border-radius)",
      transition: "all var(--tour-duration) var(--tour-bezier)",
      color: "var(--tour-text-color)",
      boxShadow:
        "0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)",
    }),
    [
      c(`&.css-vars-${cssId}`, () => cssVars),
      c(
        `& .${props.classPrefix}-tour-content`,
        () => ({
          position: "relative",
        }),
        [
          c(
            `& .${props.classPrefix}-tour-arrow`,
            {
              position: "absolute",
              display: "block",
              pointerEvents: "none",
              width: "12px",
              height: "12px",
            },
            [
              c(`&:before`, {
                position: "absolute",
                bottom: "0",
                insetInlineStart: "0",
                zIndex: "1",
                width: "calc(6px * 1.414)",
                height: "calc(6px * 1.414)",
                background: "#FFF",
                content: "''",
                transform: "rotate(45deg)",
              }),
            ]
          ),
          c(
            `& .${props.classPrefix}-tour-inner`,
            {
              display: "flex",
              flexDirection: "column",
              minWidth: "400px",
              boxSizing: "border-box",
              lineHeight: "var(--tour-line-height)",
            },
            [
              //  close icon
              c(
                `& .${props.classPrefix}-tour-close`,
                {
                  cursor: "pointer",
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  outline: "none",
                  width: "var(--tour-modal-close-width)",
                  height: "var(--tour-modal-close-height)",
                  transition:
                    "background-color var(--tour-duration) var(--tour-bezier)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "var(--tour-border-radius)",
                },
                [
                  c(`&:hover`, {
                    backgroundColor: "var(--tour-modal-close-bg)",
                  }),
                ]
              ),
              c(
                `.${props.classPrefix}-tour-header`,
                {
                  padding: "16px 16px 8px",
                },
                [
                  c(`.${props.classPrefix}-tour-title`, {
                    fontSize: "var(--tour-modal-title-size)",
                    fontWeight: "var(--tour-modal-title-weight)",
                  }),
                ]
              ),
              c(`.${props.classPrefix}-tour-message`, {
                padding: "0px 16px 0",
              }),
              c(
                `.${props.classPrefix}-tour-footer`,
                {
                  padding: "16px 16px 16px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
                [
                  c(
                    `.tour-prev-button`,
                    {
                      margin: "0",
                      lineHeight: "1",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      height: "var(--tour-button-height)",
                      outline: "none",
                      border: "1px solid var(--tour-border-color)",
                      borderRadius: "var(--tour-border-radius)",
                      fontSize: "var(--tour-border)",
                      padding: "8px 12px",
                      transition:
                        "border var(--tour-duration) var(--tour-bezier)",
                    },
                    [
                      c(`&:hover`, {
                        borderColor: "var(--tour-primary-color)",
                      }),
                    ]
                  ),
                  c(`.tour-next-button`, {
                    margin: "0 0 0 10px",
                    lineHeight: "1",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    backgroundColor: "var(--tour-primary-color)",
                    height: "var(--tour-button-height)",
                    outline: "none",
                    border: "1px solid var(--tour-primary-color)",
                    borderRadius: "var(--tour-border-radius)",
                    color: "#fff",
                    padding: "8px 12px",
                  }),
                  c(
                    `.tour-finish-button`,
                    {
                      margin: "0 0 0 10px",
                      lineHeight: "1",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      height: "var(--tour-button-height)",
                      outline: "none",
                      border: "1px solid var(--tour-border-color)",
                      borderRadius: "var(--tour-border-radius)",
                      fontSize: "var(--tour-border)",
                      transition:
                        "border var(--tour-duration) var(--tour-bezier)",
                      padding: "8px 12px",
                    },
                    [
                      c(`&:hover`, {
                        borderColor: "var(--tour-primary-color)",
                      }),
                    ]
                  ),
                ]
              ),
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
      gap: "var(--tour-dot-gap)",
    },
    [
      c(
        `.tour-dots__dot`,
        {
          width: "var(--tour-dot-width)",
          height: "var(--tour-dot-height)",
          borderRadius: "var(--tour-dot-width)",
          backgroundColor: "var(--tour-dot-background)",
          cursor: "default",
          transition:
            "background-color var(--tour-dot-duration) var(--tour-dot-bezier)",
        },
        [
          c(`&.is-active`, {
            backgroundColor: "var(--tour-dot-primary-color)",
          }),
        ]
      ),
    ]
  );
  return { mount: style.mount.bind(style), unMount: style.unmount.bind(style) };
};
