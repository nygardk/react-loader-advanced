import * as React from 'react'

declare module 'react-loader-advanced' {
  interface Timeout {
    enter: number
    exit: number
  }

  interface TransitionConfig {
    classNames: string
    timeout: number | Timeout
  }

  interface Props {
    backgroundStyle?: React.CSSProperties
    children?: React.ReactNode
    className?: string
    contentBlur?: number,
    contentStyle?: React.CSSProperties
    disableDefaultStyles?: boolean
    foregroundStyle?: React.CSSProperties
    hideContentOnLoad?: boolean
    message?: React.ReactNode
    messageStyle?: React.CSSProperties
    priority?: number,
    show: boolean
    style?: React.CSSProperties
    transitionConfig?: TransitionConfig
  }

  export default class Loader extends React.Component<Props, {}> { }
}
