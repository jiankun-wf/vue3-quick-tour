# vue3-quick-tour

## 全屏漫游式指引解决方案

## antd 的感觉有点生硬，没有过度效果 https://ant-design.antgroup.com/components/tour-cn

## intro.js 样式不太好

## 围绕客户端做的基建

### 1. 优点

1. vue3 + tsx。
2. css-render 不生成 css 文件，也无需引入。
3. transition-hooks 自定义遮罩动画、弹出框动画。

4. 指定位置，以及自动定位（尚在完善）。

5. 自定义位置（next v2.0）。
6. 自定义主题，以及 dark mode （next v2.0）。
7. 每步支持多个节点（？？？ 产品，听我说谢谢你 next v99.0）。

### 2. props

|      属性       |               传值                |  默认值   |             说明             |
| :-------------: | :-------------------------------: | :-------: | :--------------------------: |
|      steps      |            TourStep[]             |    [ ]    |       每步的配置，必填       |
|   classPrefix   |              string               |   quick   |       全局 calss 前缀        |
|      mask       |       boolean / MaskConfig        |   true    |        全局 mask 配置        |
| v-model:current |              number               |     0     |   当前步骤，支持非受控模式   |
|  v-model:show   |              boolean              |   false   | 是否展示引导，支持非受控模式 |
|      arrow      |              boolean              |   true    |         是否展示箭头         |
|     padding     | number / { x: number, y: number } |     5     |    指引元素的水平垂直边距    |
|   maskZIndex    |          number / string          |   1001    |     遮罩层的 z-index 值      |
| dialogShowClose |              boolean              |   true    |      是否展示关闭 icon       |
| modalTransition |     TransitionLifeCycleProps      | undefined |        自定义弹框动画        |
| maskTransition  |     TransitionLifeCycleProps      | undefined |        自定义遮罩动画        |

### 3. 详细配置说明

#### 1. TourStep

|    值     |           类型           | 默认值      | 说明                                      |
| :-------: | :----------------------: | ----------- | ----------------------------------------- |
|    el     |  null () => HTMLElment   | null        | 指引对象，为 null 时全屏居中              |
|   title   |          string          | undefined   | 弹框标题                                  |
|  message  |          string          | undefined   | 弹框内容                                  |
| placement | top、bottom、left、right | bottom.auto | 弹框相对于指引目标位置                    |
|   mask    |   boolean / MaskConfig   | undefined   | 当前步骤 mask 配置 undefined 时随全局配置 |

#### 2. MaskConfig

|  值   |           类型           | 默认值          | 说明              |
| :---: | :----------------------: | --------------- | ----------------- |
| style | CSSProperties、undefined | undefined       | mask-wrapper 样式 |
| color |    string、undefined     | rgba(0,0,0,0.5) | 遮罩颜色          |

#### 3. TransitionLifeCycleProps（您需预设好 el.style，剩下的交给我来执行）

##### 以弹出层默认过渡动画为例：

|      值       |           类型            | 默认值                                                                                                     | 说明                              |
| :-----------: | :-----------------------: | ---------------------------------------------------------------------------------------------------------- | --------------------------------- |
| onBeforeEnter | (el: HTMLElement) => void | el.style.transform = "scale(1.06, 1.06)"; el.style.opacity = '0';                                          | 进入开始的状态，形同 v-enter-from |
|    onEnter    | (el: HTMLElement) => void | el.style.transform = "scale(1, 1)"; el.style.opacity = '1'                                                 | 进入结束的状态                    |
|    onLeave    | (el: HTMLElement) => void | 　 el.style.transformOrigin = "bottom left"; el.style.transform = "scale(0, 0)";　 el.style.opacity = "0"; | 离开的结束状态                    |

### 4. emits

|     事件名     |           说明           |
| :------------: | :----------------------: |
| update:current |       更新当前步骤       |
|  update:show   |       更新展示引导       |
|     change     |       步骤变换触发       |
|      next      |      下一步触发事件      |
|      prev      |      上一步触发事件      |
|     finish     |       指引结束事件       |
|      open      |         打开事件         |
|     opened     | 完全打开事件（动画结束） |
|     close      |         关闭时间         |
|     closed     | 完全结束事件（动画结束） |

### 5. slots

| 插槽名  |                                                          scoped values                                                           |              说明              |
| :-----: | :------------------------------------------------------------------------------------------------------------------------------: | :----------------------------: |
| default | close（关闭）、current（当前）、currentStep（当前详情信息）、next（下一步）、prev（上一步）、last（最后一步）、steps（步骤集合） | 完全支持您自己渲染指引提示内容 |
|  close  |                                   close（关闭）、current（当前）、currentStep（当前详情信息）                                    |      自定义渲染关闭 icon       |
|  title  |                                                   currentStep（当前详情信息）                                                    |        自定义渲染 title        |
| content |                                                   currentStep（当前详情信息）                                                    |       自定义渲染 message       |
|   ...   |                                                               ...                                                                |          更多的在路上          |

### 6. 运行

1. pnpm install
2. pnpm dev

### 7. 构建

1. pnpm build:lib
