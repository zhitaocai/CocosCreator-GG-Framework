/**
 * 面板状态枚举
 *
 * @author caizhitao
 * @created 2020-12-04 16:00:09
 */

export enum PanelStateEnum {
    /**
     * 面板加载中
     */
    Loading = "Loading",

    /**
     * 面板加载失败
     */
    LoadFailure = "LoadingFailure",

    /**
     * 面板加载成功
     */
    LoadSuccess = "LoadingSuccess",

    /**
     * 面板展示中（一般为正在进行展示动画）
     */
    Showing = "Showing",

    /**
     * 面板展示完毕（一般为展示动画已经执行完毕）
     */
    Showed = "Showed",

    /**
     * 面板隐藏中（一般为正在进行隐藏动画）
     */
    Hiding = "Hiding",

    /**
     * 面板隐藏完毕（一般为隐藏动画已经执行完毕）
     */
    Hided = "Hided",
}
