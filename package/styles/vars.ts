import { CSSProperties, ComputedRef, computed } from "vue";
import { GlobalThemeOverrides } from "../types";
import { isUnDef } from "../utils";

export const defaultCssVars: Required<GlobalThemeOverrides> = {
  common: {
    primaryColor: "#2080f0",
    lineHeight: "1.6",
    duration: 377,
    bezier: "cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadiusSmall: "2px",
    borderRadius: "4px",
    borderRadiusLarge: "8px",
    borderColor: "rgb(224, 224, 230)",
  },
  dot: {
    backgroundColor: "rgba(0,0,0,0.2)",
    primaryColor: undefined,
    size: 8,
    gap: 6,
  },
  modal: {
    closeIconSize: 22,
    closeIconBackgroundColor: "rgba(0, 0, 0, 0.06)",
    titleFontSize: "14px",
    titleFontWeight: "600",
    lineHeight: undefined,
    bezier: undefined,
    duration: undefined,
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.85)",
  },
  mask: {
    bezier: undefined,
    duration: undefined,
  },
  button: {
    primaryColor: undefined,
    height: "30px",
  },
  arrow: {
    size: 16,
  }
};

export const getModalStyleConfig = (themeOverrides?: GlobalThemeOverrides) => {
  const { common, modal, button } = defaultCssVars;
  if (isUnDef(themeOverrides)) {
    Object.assign(modal, common);
    Object.assign(button, common);
  } else {
    const {
      common: propsCommon = {},
      modal: propsModal = {},
      button: propsButton = {},
    } = themeOverrides;
    Object.assign(common, propsCommon);
    Object.assign(modal, common, propsModal);
    Object.assign(button, common, propsButton);
  }
  return { common, modal, button };
}

export const getModalStyleVars = (
  themeOverrides?: GlobalThemeOverrides
): ComputedRef<CSSProperties> => {
  return computed(() => {
    const { common, modal, button } = getModalStyleConfig(themeOverrides);
    const {
      closeIconBackgroundColor,
      closeIconSize,
      titleFontSize,
      titleFontWeight,
      bezier,
      duration,
      backgroundColor,
      color,
    } = modal;
    const {
      primaryColor,
      borderRadius,
      borderColor,
      lineHeight,
      borderRadiusLarge,
      borderRadiusSmall,
    } = common;
    const { primaryColor: _buttonPrimaryColor, height } = button;
    return {
      "--tour-modal-close-width": `${closeIconSize}px`,
      "--tour-modal-close-height": `${closeIconSize}px`,
      "--tour-modal-close-bg": `${closeIconBackgroundColor}`,
      "--tour-modal-title-size": `${titleFontSize}`,
      "--tour-modal-title-weight": `${titleFontWeight}`,
      "--tour-bezier": `${bezier}`,
      "--tour-duration": `${duration}ms`,
      "--tour-border-radius": `${borderRadius}`,
      "--tour-primary-color": `${primaryColor}`,
      "--tour-modal-background": `${backgroundColor}`,
      "--tour-text-color": `${color}`,
      "--tour-button-height": `${height}`,
      "--tour-border-color": `${borderColor}`,
      "--tour-lineHeight": `${lineHeight}`,
      "--tour-border-radius-sm": `${borderRadiusSmall}`,
      "--tour-border-radius-lg": `${borderRadiusLarge}`,
    };
  });
};

export const getDotStyleVars = (
  themeOverrides?: GlobalThemeOverrides
): ComputedRef<CSSProperties> => {
  return computed(() => {
    const { common, dot } = defaultCssVars;
    if (isUnDef(themeOverrides)) {
      Object.assign(dot, common);
    } else {
      const { common: propsCommon = {}, dot: propsDot = {} } = themeOverrides;
      Object.assign(common, propsCommon);
      Object.assign(dot, common, propsDot);
    }
    const { size, primaryColor, backgroundColor, duration, bezier, gap } = dot;
    return {
      "--tour-dot-width": `${size}px`,
      "--tour-dot-height": `${size}px`,
      "--tour-dot-background": `${backgroundColor}`,
      "--tour-dot-primary-color": `${primaryColor}`,
      "--tour-dot-bezier": `${bezier}`,
      "--tour-dot-duration": `${duration}ms`,
      "--tour-dot-gap": `${gap}px`,
    };
  });
};

export const getMaskConfig = (themeOverrides?: GlobalThemeOverrides) => {
  const { common, mask } = defaultCssVars;
  if (isUnDef(themeOverrides)) {
    Object.assign(mask, common);
  } else {
    const { common: propsCommon = {}, mask: propsMask = {} } = themeOverrides;
    Object.assign(mask, common, propsCommon, propsMask);
  }
  return mask;
}

export const getMaskStyleVars = (
  themeOverrides?: GlobalThemeOverrides
): ComputedRef<CSSProperties> => {
  return computed(() => {
    const { duration, bezier } = getMaskConfig(themeOverrides);
    return {
      '--tour-mask-duration': `${duration}ms`,
      '--tour-mask-bezier': `${bezier}`,
    };
  });
};