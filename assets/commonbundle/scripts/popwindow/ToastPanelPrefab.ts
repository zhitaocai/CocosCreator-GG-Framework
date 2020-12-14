import { Panels } from "../../../mainbundle/scripts/configs/Panels";
import { gg } from "../../../scripts/framework/gg";
import { PanelComponent, PanelHideOption, PanelShowOption } from "../../../scripts/framework/lib/router/PanelComponent";

const { ccclass, property } = cc._decorator;

export interface ToastPanelShowArgs {
    /**
     * 文本内容
     */
    text: string;

    /**
     * Toast展示持续时间(s)，不传则默认显示2秒后自动消失
     */
    duration?: number;
}

/**
 * Toast 面板
 *
 * @author caizhitao
 * @created 2020-12-07 22:02:32
 */
@ccclass
export default class ToastPanelPrefab extends PanelComponent {
    @property(cc.Node)
    textBgNode: cc.Node = null;

    @property(cc.Label)
    textLabel: cc.Label = null;

    @property({ tooltip: "文本上边界距离文本背景节点上边界的Margin值" })
    textMarginTop: number = 30;

    @property({ tooltip: "文本下边界距离文本背景节点下边界的Margin值" })
    textMarginBottom: number = 30;

    @property({ tooltip: "文本左边界距离文本背景节点左边界的Margin值" })
    textMarginLeft: number = 30;

    @property({ tooltip: "文本右边界距离文本背景节点右边界的Margin值" })
    textMarginRight: number = 30;

    show(option: PanelShowOption): void {
        let showArgs = option.data as ToastPanelShowArgs;
        let duration = showArgs.duration == null ? 2 : showArgs.duration;
        this._updateToastLabel(showArgs.text);
        this._startHideScheduler(duration);
        this._playPanelShowAnim();
        option.onShowed();
    }

    private _updateToastLabel(text: string) {
        // 设置文本最大长度
        let textLabelMaxWidth = this.node.width * 0.6;

        // NONE 模式渲染文本，得到文本宽度
        this.textLabel.overflow = cc.Label.Overflow.NONE;
        this.textLabel.string = text;
        if (this.textLabel["_forceUpdateRenderData"] != null) {
            this.textLabel["_forceUpdateRenderData"]();
        }

        if (this.textLabel.node.width > textLabelMaxWidth) {
            // 如果大于最大宽度，那么设置为 RESIZE_HEIGHT 模式重新渲染
            this.textLabel.node.width = textLabelMaxWidth;
            this.textLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this.textLabel.string = text;
            if (this.textLabel["_forceUpdateRenderData"] != null) {
                this.textLabel["_forceUpdateRenderData"]();
            }
        }

        // 根据文本宽高，重新设置文本背景节点的宽高
        this.textBgNode.width = this.textLabel.node.width + this.textMarginLeft + this.textMarginRight;
        this.textBgNode.height = this.textLabel.node.height + this.textMarginTop + this.textMarginBottom;
    }

    /**
     * 启动隐藏倒计时
     */
    private _startHideScheduler(duration: number) {
        this.unscheduleAllCallbacks();
        this.scheduleOnce(() => {
            gg.panelRouter.hide({
                panelConfig: Panels.toastPanel,
            });
        }, duration);
    }

    hide(option: PanelHideOption): void {
        this.unscheduleAllCallbacks();
        this._playPanelHideAnim(() => {
            option.onHided();
        });
    }

    //////////////////////////////////////////////////////////////
    // 面板动画相关

    private _playPanelShowAnim(onAnimCompleted?: Function) {
        cc.Tween.stopAllByTarget(this.textBgNode);
        cc.tween<cc.Node>(this.textBgNode)
            .set({
                scale: 0,
                opacity: 0,
                position: cc.v3(0, -100, 0),
            })
            .to(0.24, { scale: 1, opacity: 255, position: cc.v3() }, { easing: "backOut" })
            .call(() => {
                onAnimCompleted && onAnimCompleted();
            })
            .start();
    }

    private _playPanelHideAnim(onHideComleted: Function) {
        cc.Tween.stopAllByTarget(this.textBgNode);
        cc.tween(this.textBgNode)
            .to(0.24, { opacity: 0 })
            .call(() => {
                onHideComleted();
            })
            .start();
    }
}
