import { ComputedRef, computed } from "vue";
import { TransitionLifeCycleInner, TransitionLifeCycleProps } from "../types";

const defaultModalTransiton: TransitionLifeCycleProps  = {
    onBeforeEnter: (el) => {
      el.style.transform = "scale(1.06, 1.06)";
      el.style.opacity = '0';
    },
    onEnter: (el) => {
      el.style.transform = "scale(1, 1)";
      el.style.opacity = '1';
    },
    onLeave(el) {
      el.style.transformOrigin = "bottom left";
      el.style.transform = "scale(0, 0)";
      el.style.opacity = "0";
    },
};
const defaulMaskTransition: TransitionLifeCycleProps  = {
  onBeforeEnter: (el) => {
    el.style.opacity = '0';
  },
  onEnter: (el) => {
    el.style.opacity = '1';
  },
  onLeave(el) {
    el.style.opacity = "0";
  },
};

export const execute = (_transition: TransitionLifeCycleProps, duration?: number): TransitionLifeCycleInner => {
  return {
    onBeforeEnter: (el) => { 
      _transition.onBeforeEnter?.(el)
    },
    onEnter: (el, done) => {
      el.offsetWidth;
      _transition.onEnter?.(el);
      done();
    },
    onLeave: (el, done) => {
      _transition.onLeave?.(el);
      setTimeout(done, duration ?? 377);
    }
  }
}
export const useTourModalTransition = (
  _transition?: TransitionLifeCycleProps,
  duration?: number
): ComputedRef<TransitionLifeCycleInner> => {
  return computed(() => {
    if (!_transition) {
      return execute(defaultModalTransiton, duration);
    }
    return execute(_transition, duration);
  });
};



export const useTourMaskTransition = (_transition?: TransitionLifeCycleProps, duration?: number): ComputedRef<TransitionLifeCycleInner> => {
 return computed(() => {
  if(!_transition) {
    return execute(defaulMaskTransition, duration);
  } 
  return execute(_transition, duration);
 })
};
