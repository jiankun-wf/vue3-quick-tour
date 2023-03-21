import { ComputedRef, computed } from "vue";
import { TransitionLifeCycleInner, TransitionLifeCycleProps } from "../types";

const defaultModalTransiton: TransitionLifeCycleInner  = {
    onBeforeEnter: (el) => {
      el.style.transform = "scale(1.06, 1.06)";
      el.style.opacity = '0';
    },
    onEnter: (el, done) => {
      el.offsetWidth;
      el.style.transform = "scale(1, 1)";
      el.style.opacity = '1';
      done();
    },
    onLeave(el, done) {
      el.style.transformOrigin = "bottom left";
      el.style.transform = "scale(0, 0)";
      el.style.opacity = "0";
      setTimeout(done, 377);
    },
};
const defaulMaskTransition: TransitionLifeCycleInner  = {
  onBeforeEnter: (el) => {
    el.style.opacity = '0';
  },
  onEnter: (el, done) => {
    el.offsetWidth;
    el.style.opacity = '1';
    done();
  },
  onLeave(el, done) {
    el.style.opacity = "0";
    setTimeout(done, 377);
  },
};

export const execute = (_transition: TransitionLifeCycleProps): TransitionLifeCycleInner => {
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
      setTimeout(done, 377);
    }
  }
}
export const useTourModalTransition = (
  _transition?: TransitionLifeCycleProps
): ComputedRef<TransitionLifeCycleInner> => {
  return computed(() => {
    if (!_transition) {
      return defaultModalTransiton;
    }
    return execute(_transition);
  });
};



export const useTourMaskTransition = (_transition?: TransitionLifeCycleProps): ComputedRef<TransitionLifeCycleInner> => {
 return computed(() => {
  if(!_transition) {
    return defaulMaskTransition
  } 
  return execute(_transition);
 })
};
