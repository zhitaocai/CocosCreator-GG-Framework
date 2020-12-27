/**
 */

const { ccclass, property } = cc._decorator;

/**
 * 游戏主内容节点自适应所有分辨率的脚本
 * 
 * @author caizhitao
 * @created 2020-12-27 21:22:43
 * @description
 *
 * 用法：
 *      1. 将本组件挂载在节点上即可
 *
 * 适配原理：
 *      1. 将游戏主内容节点的宽高设置为画布的大小
 *
 * 注意：
 *      1. 挂载这个脚本的节点不能加入Widget组件，不然这个适配是没有效果的
 *      2. 目前只支持 SHOW_ALL 模式下的背景缩放适配，不支持其他模式的背景缩放
 *
 *  @example
    ```
    // e.g.
    // 代码中设置 SHOW_ALL 模式的参考代码
    cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);

    // 或者 Canvas 组件中，同时勾选 Fit Width 和 Fit Height 
    ```
 */
@ccclass
export default class ScreenAreaAdapterComponent extends cc.Component {
    onLoad() {
        this._onResize();
    }

    onEnable() {
        let onResize = this._onResize.bind(this);
        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", onResize);
        // cc.view.setResizeCallback(onResize);
    }

    onDisable() {
        let onResize = this._onResize.bind(this);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
        // cc.view.setResizeCallback(null);
    }

    /**
     * 窗口尺寸发生改变时，更新适配节点的宽高
     */
    private _onResize() {
        // if (CC_DEBUG) {
        //     cc.log(`屏幕分辨率: ${cc.view.getCanvasSize().width} x ${cc.view.getCanvasSize().height}`);
        //     cc.log(`视图窗口可见区域分辨率: ${cc.view.getVisibleSize().width} x ${cc.view.getVisibleSize().height}`);
        //     cc.log(`视图中边框尺寸: ${cc.view.getFrameSize().width} x ${cc.view.getFrameSize().height}`);
        //     cc.log(`设备或浏览器像素比例: ${cc.view.getDevicePixelRatio()}`);
        //     cc.log(`节点宽高: ${this.node.width} x ${this.node.height}`);
        // }

        // 1. 计算 SHOW_ALL 模式下，本节点缩放到完全能显示节点所有内容的实际缩放值
        let designWidth = cc.view.getVisibleSize().width;
        let designHeight = cc.view.getVisibleSize().height;
        let canvasWidth = cc.view.getCanvasSize().width;
        let canvasHeight = cc.view.getCanvasSize().height;
        let scaleForShowAll = Math.min(canvasWidth / designWidth, canvasHeight / designHeight);

        // 2. 根据缩放值，重新设置节点的宽高
        this.node.width = canvasWidth / scaleForShowAll;
        this.node.height = canvasHeight / scaleForShowAll;
    }
}
