import { PanelComponent, PanelHideOption, PanelShowOption } from "../../../scripts/framework/lib/router/PanelComponent";

const { ccclass, property } = cc._decorator;

export interface LoadingPanelShowArgs {
    /**
     * 展示时是否播放展示动画（不传则默认播放）
     */
    playShowAnim?: boolean;

    /**
     * 点击加载页面时回调
     */
    onCancelLoadingBtnClick?: Function;
}

/**
 * 游戏通用 Loading 面板
 *
 * @author caizhitao
 * @created 2020-12-07 20:47:19
 */
@ccclass
export default class LoadingPanel extends PanelComponent {
    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(cc.Node)
    loadingSpriteNode: cc.Node = null;

    private _showArgs: LoadingPanelShowArgs = null;

    onLoad() {
        this.bgNode.opacity = 0;
        this.loadingSpriteNode.opacity = 0;
    }

    show(option: PanelShowOption): void {
        this._showArgs = option.data;
        if (this._showArgs == null || this._showArgs.playShowAnim == null || this._showArgs.playShowAnim) {
            // 默认播放loading动画
            this._playPanelShowAnim(() => {
                option.onShowed();
            });
        } else {
            option.onShowed();
        }
    }

    hide(option: PanelHideOption): void {
        this._playPanelHideAnim(() => {
            this._showArgs = null;
            option.onHided();
        });
    }

    private _playPanelShowAnim(onAnimCompleted: Function) {
        cc.Tween.stopAllByTarget(this.bgNode);
        cc.tween<cc.Node>(this.bgNode)
            .set({ opacity: 0 })
            .to(0.24, { opacity: 220 }, { easing: "sineOut" })
            .call(() => {
                onAnimCompleted();
            })
            .start();
        cc.Tween.stopAllByTarget(this.loadingSpriteNode);
        cc.tween<cc.Node>(this.loadingSpriteNode).set({ opacity: 0, scale: 2 }).to(0.24, { opacity: 255, scale: 1 }, { easing: "sineOut" }).start();
        cc.tween<cc.Node>(this.loadingSpriteNode)
            .repeatForever(cc.tween<cc.Node>().by(0.7, { angle: -360 }))
            .start();
    }

    private _playPanelHideAnim(onAnimCompleted: Function) {
        cc.Tween.stopAllByTarget(this.bgNode);
        cc.tween<cc.Node>(this.bgNode)
            .to(0.24, { opacity: 0 }, { easing: "sineOut" })
            .call(() => {
                onAnimCompleted();
            })
            .start();
        cc.Tween.stopAllByTarget(this.loadingSpriteNode);
        cc.tween<cc.Node>(this.loadingSpriteNode).to(0.24, { scale: 0, opacity: 0 }, { easing: "sineOut" }).start();
    }

    onCancelLoadingBtnClick() {
        this._showArgs && this._showArgs.onCancelLoadingBtnClick && this._showArgs.onCancelLoadingBtnClick();
    }
}
