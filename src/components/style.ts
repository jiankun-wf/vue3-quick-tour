import cssRender from 'css-render';

import { MaskCreateProps, DialogStyleProps } from './type';

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

export const createDialogStyle = (id: string, props: DialogStyleProps) => {
 const style = c(`.${props.classPrefix}-tour-dialog_${id}`, () => ({
   position: 'absolute',
   zIndex: props.zIndex,
   boxSizing: 'border-box',
   left: '100px',
   top: '100px',
   backgroundColor: '#fff',
   borderRadius: '4px',
 }), [
   c(`& .${props.classPrefix}-tour-content_${id}`, () => ({ position: 'relative' })),

   c(`& .${props.classPrefix}-tour-inner_${id}`, {
     display: 'flex',
     flexDirection: 'column',
     justifyContent: 'space-between',
     padding: '10px 20px',
     minWidth: '400px',
     minHeight: '150px',
     boxSizing: 'border-box',
   }, [

   ]),
  //  close icon
   c(`& .${props.classPrefix}-tour-close_${id}`, {
     cursor: 'pointer',
     position: 'absolute',
     top: '12px',
     right: '12px',
     outline: 'none',
     width: '22px',
     height: '22px',
     transition: 'background-color .3s',
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: '4px',
   }, [
    c(`&:hover`, {
      backgroundColor: 'rgba(0, 0, 0, 0.06)',
    })
   ])
 ])
 return { mount: style.mount.bind(style), unMount: style.unmount.bind(style) }
}