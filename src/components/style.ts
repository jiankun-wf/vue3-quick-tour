import cssRender from 'css-render';

import { MaskCreateProps } from './type';

const { c } = cssRender();

export const createMaskStyle = (id: string, props: MaskCreateProps) => {
  const style = c(`.tour-mask-${id}`, () => ({
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: props.zIndex,
  }), [
    c(`.tour-mask-svg-${id}`, {
        width: '100%',
        height: '100%',
    }),

    c(`.tour-mask--placeholder-${id}`, {
        transition: 'all .3s ease',
    })
  ])

  return { mount: style.mount.bind(style), unMount: style.unmount.bind(style) }
}