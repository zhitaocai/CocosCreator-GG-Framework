/**
 */

const { ccclass, property } = cc._decorator;

/**
 * 安全区域适配组件
 *
 * @author caizhitao
 * @created 2020-12-27 21:22:42
 * @description
 *
 * 用法：
 *
 * 1. 将本组件挂载在节点上即可（注意该节点不能挂在 Widget 组件）
 *
 * 适配原理：
 *
 * 1. 将节点的宽高设置为安全区域的宽高
 */
@ccclass
export default class SafeAreaAdapterComponent extends cc.Component {
    onLoad() {
        this._onResize();
    }

    onEnable() {
        let onResize = this._onResize.bind(this);
        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", onResize);
    }

    onDisable() {
        let onResize = this._onResize.bind(this);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
    }

    private _onResize() {
        SafeAreaAdapterComponent.safeArea = null;
        if (this.node) {
            // 将屏幕尺寸下的安全区域大小，转换为设计分辨率下的大小，重新给节点设置大小
            this.node.width = SafeAreaAdapterComponent.safeArea.safeAreaWidth / SafeAreaAdapterComponent.safeArea.designPxToScreenPxRatio;
            this.node.height = SafeAreaAdapterComponent.safeArea.safeAreaHeight / SafeAreaAdapterComponent.safeArea.designPxToScreenPxRatio;

            // 根据安全区域的 margin 设置节点的偏移，使重置宽高后的节点位置在安全中心
            // 需要将屏幕尺寸下的像素值转换为设计费分辨率下的像素值
            this.node.setPosition(
                cc.v2(
                    SafeAreaAdapterComponent.safeArea.safeAreaXOffset / SafeAreaAdapterComponent.safeArea.designPxToScreenPxRatio,
                    SafeAreaAdapterComponent.safeArea.safeAreaYOffset / SafeAreaAdapterComponent.safeArea.designPxToScreenPxRatio
                )
            );
        }
    }

    private static _safeArea: SafeArea;

    static set safeArea(value: SafeArea) {
        this._safeArea = value;
    }

    /**
     * 基于屏幕尺寸的安全区域
     *
     * 可以通过 screenPxToDesignPx 转换为基于设计画布尺寸的像素大小
     */
    static get safeArea() {
        if (this._safeArea == null || this._safeArea == undefined) {
            // 初始屏幕宽高像素
            let screenWidth = cc.view.getCanvasSize().width;
            let screenHeight = cc.view.getCanvasSize().height;

            // 安全区域距离屏幕边缘的距离像素
            let safeAreaMarginTop = 0;
            let safeAreaMarginBottom = 0;
            let safeAreaMarginLeft = 0;
            let safeAreaMarginRight = 0;

            // 「设计分辨率」像素值转换到 「屏幕分辨率」 下的像素比
            let designWidth = cc.view.getVisibleSize().width;
            let designHeight = cc.view.getVisibleSize().height;
            let designPxToScreenPxRatio = Math.min(screenWidth / designWidth, screenHeight / designHeight);

            if (CC_JSB) {
                // 设计分辨率下的安全区域大小
                let safeAreaRectInDesignPx = cc.sys.getSafeAreaRect();

                // 求出设计分辨率下，屏幕宽高
                let screenWidthToDesgignWidth = screenWidth / designPxToScreenPxRatio;
                let screenHeightToDesignHeight = screenHeight / designPxToScreenPxRatio;

                // 求出设计分辨率下的安全区域的位置（相对于 Cocos 坐标系，X轴正方向往右，Y轴正方向往上）
                let safeAreaRectLeftBottomXInDesign = -designWidth * 0.5 + safeAreaRectInDesignPx.x;
                let safeAreaRectLeftBottomYInDesign = -designHeight * 0.5 + safeAreaRectInDesignPx.y;
                let safeAreaRectWidthInDesign = safeAreaRectInDesignPx.width;
                let safeAreaRectHeightInDesign = safeAreaRectInDesignPx.height;

                // 求出安全区域在设计分辨率下的margin值
                let safeAreaMarginTopInDesign = screenHeightToDesignHeight * 0.5 - (safeAreaRectLeftBottomYInDesign + safeAreaRectHeightInDesign);
                let safeAreaMarginBottomInDesign = Math.abs(-screenHeightToDesignHeight * 0.5 - safeAreaRectLeftBottomYInDesign);
                let safeAreaMarginLeftInDesign = Math.abs(-screenWidthToDesgignWidth * 0.5 - safeAreaRectLeftBottomXInDesign);
                let safeAreaMarginRightInDesign = screenWidthToDesgignWidth * 0.5 - (safeAreaRectLeftBottomXInDesign + safeAreaRectWidthInDesign);

                // 求出安全区域在屏幕分辨率下的margin值
                safeAreaMarginTop = safeAreaMarginTopInDesign * designPxToScreenPxRatio;
                safeAreaMarginBottom = safeAreaMarginBottomInDesign * designPxToScreenPxRatio;
                safeAreaMarginLeft = safeAreaMarginLeftInDesign * designPxToScreenPxRatio;
                safeAreaMarginRight = safeAreaMarginRightInDesign * designPxToScreenPxRatio;
            }

            // // 微信平台 安全区域
            // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //     try {
            //         if (wx.getSystemInfoSync) {
            //             let res = wx.getSystemInfoSync();
            //             if (res) {
            //                 screenWidth = res.screenWidth * res.pixelRatio;
            //                 screenHeight = res.screenHeight * res.pixelRatio;

            //                 let safeArea = res.safeArea;
            //                 if (safeArea) {
            //                     safeAreaMarginTop = safeArea.top * res.pixelRatio;
            //                     safeAreaMarginBottom = screenHeight - safeArea.bottom * res.pixelRatio;
            //                     safeAreaMarginLeft = safeArea.left * res.pixelRatio;
            //                     safeAreaMarginRight = screenWidth - safeArea.right * res.pixelRatio;
            //                 }
            //             }
            //         }
            //     } catch (error) {
            //         if (CC_DEBUG) {
            //             cc.error("获取微信安全区域失败", error);
            //         }
            //     }
            // }

            // 调试模式下模拟安全区域
            // if (CC_DEBUG) {
            //     safeAreaMarginTop = 200;
            //     safeAreaMarginBottom = 50;
            //     safeAreaMarginLeft = 0;
            //     safeAreaMarginRight = 0;
            // }

            // 计算安全区域的宽高像素
            let safeAreaWidth = screenWidth - safeAreaMarginLeft - safeAreaMarginRight;
            let safeAreaHeight = screenHeight - safeAreaMarginTop - safeAreaMarginBottom;

            // 计算安全区域 X、Y 偏移像素（相对于 Cocos 坐标系，X轴正方向往右，Y轴正方向往上）
            let safeAreaXOffset = (safeAreaMarginLeft - safeAreaMarginRight) * 0.5;
            let safeAreaYOffset = (safeAreaMarginBottom - safeAreaMarginTop) * 0.5;

            this._safeArea = {
                screenWidth: screenWidth,
                screenHeight: screenHeight,
                safeAreaWidth: safeAreaWidth,
                safeAreaHeight: safeAreaHeight,
                safeAreaMarginTop: safeAreaMarginTop,
                safeAreaMarginBottom: safeAreaMarginBottom,
                safeAreaMarginLeft: safeAreaMarginLeft,
                safeAreaMarginRight: safeAreaMarginRight,
                safeAreaXOffset: safeAreaXOffset,
                safeAreaYOffset: safeAreaYOffset,
                designPxToScreenPxRatio: designPxToScreenPxRatio,
            };
        }
        return this._safeArea;
    }

    static screenPxToDesignPx(screenPx: number) {
        return screenPx / this.safeArea.designPxToScreenPxRatio;
    }

    static designPxToScreenPx(designPx: number) {
        return designPx * this.safeArea.designPxToScreenPxRatio;
    }
}

/**
 * 屏幕分辨率下 的像素值
 */
export interface SafeArea {
    /**
     * 屏幕分辨率下：画布（屏幕)宽度
     */
    screenWidth: number;

    /**
     * 屏幕分辨率下：画布（屏幕）高度
     */
    screenHeight: number;

    /**
     * 屏幕分辨率下：安全区域宽度像素
     */
    safeAreaWidth: number;

    /**
     * 屏幕分辨率下：安全区域高度像素
     */
    safeAreaHeight: number;

    /**
     * 屏幕分辨率下：安全区域距离画布（屏幕）上边缘的距离像素
     */
    safeAreaMarginTop: number;

    /**
     * 屏幕分辨率下：安全区域距离画布（屏幕）下边缘的距离像素
     */
    safeAreaMarginBottom: number;

    /**
     * 屏幕分辨率下：安全区域距离画布（屏幕）左边缘的距离像素
     */
    safeAreaMarginLeft: number;

    /**
     * 屏幕分辨率下：安全区域距离画布（屏幕）右边缘的距离像素
     */
    safeAreaMarginRight: number;

    /**
     * 屏幕分辨率下：安全区域 X 偏移像素（相对于 Cocos 坐标系，X轴正方向往右，Y轴正方向往上）
     */
    safeAreaXOffset: number;

    /**
     * 屏幕分辨率下：安全区域 Y 偏移像素（相对于 Cocos 坐标系，X轴正方向往右，Y轴正方向往上）
     */
    safeAreaYOffset: number;

    /**
     * 「设计分辨率」像素值转换到 「屏幕分辨率」 下的像素比
     *
     * e.g.
     *
     * * screenPx = designPx * pixelRatio
     * * designPx = screenPx / pixelRatio
     */
    designPxToScreenPxRatio: number;
}
