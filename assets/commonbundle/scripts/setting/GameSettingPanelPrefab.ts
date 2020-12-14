import { Panels } from "../../../mainbundle/scripts/configs/Panels";
import { gg } from "../../../scripts/framework/gg";
import { PanelComponent, PanelHideOption, PanelShowOption } from "../../../scripts/framework/lib/router/PanelComponent";
import GameSettingModule from "./GameSettingModule";

const { ccclass, property } = cc._decorator;

/**
 * 游戏设置面板
 *
 * @author caizhitao
 * @created 2020-12-10 21:03:06
 */
@ccclass
export default class GameSettingPanelPrefab extends PanelComponent {
    @property(cc.Node)
    dialogBgNode: cc.Node = null;

    @property(cc.Node)
    dialogContentNode: cc.Node = null;

    @property(cc.Slider)
    musicVolumeSlider: cc.Slider = null;

    @property(cc.Slider)
    soundVolumeSlider: cc.Slider = null;

    @property(cc.Toggle)
    vibrateToggle: cc.Toggle = null;

    @property(cc.Button)
    closeBtn: cc.Button = null;

    onLoad() {
        this.musicVolumeSlider.node.on("slide", this._onMusicVolumeChanged, this);
        this.soundVolumeSlider.node.on("slide", this._onSoundVolumeChanged, this);
        this.vibrateToggle.node.on("toggle", this._onVibrateChanged, this);
    }

    show(option: PanelShowOption): void {
        // 显示最新的游戏配置
        this.musicVolumeSlider.progress = GameSettingModule.data.musicVolume;
        this.soundVolumeSlider.progress = GameSettingModule.data.soundVolume;
        this.vibrateToggle.isChecked = GameSettingModule.data.enableVibrate;

        // 让关闭按钮可以点击
        this.closeBtn.interactable = true;

        // 播放展示动画
        this._playPanelShowAnim(() => {
            option.onShowed();
        });
    }

    hide(option: PanelHideOption): void {
        // 让关闭按钮不可以点击
        this.closeBtn.interactable = false;

        // 面板退出的时候，持久化游戏设置，保存到本地缓存中
        GameSettingModule.saveSettingConfig();

        // 播放隐藏动画
        this._playPanelHideAnim(() => {
            option.onHided();
        });
    }

    onCloseBtnClick() {
        gg.panelRouter.hide({
            panel: Panels.gameSettingPanel,
        });
    }

    private _onMusicVolumeChanged(slider: cc.Slider) {
        GameSettingModule.data.musicVolume = slider.progress;
    }

    private _onSoundVolumeChanged(slider: cc.Slider) {
        GameSettingModule.data.soundVolume = slider.progress;
    }

    private _onVibrateChanged(toggle: cc.Toggle) {
        GameSettingModule.data.enableVibrate = toggle.isChecked;
    }

    private _playPanelShowAnim(onAnimCompleted: Function) {
        cc.Tween.stopAllByTarget(this.dialogBgNode);
        cc.tween<cc.Node>(this.dialogBgNode).set({ opacity: 0 }).to(0.24, { opacity: 220 }, { easing: "sineOut" }).start();

        cc.Tween.stopAllByTarget(this.dialogContentNode);
        cc.tween<cc.Node>(this.dialogContentNode)
            .set({ opacity: 0, position: cc.v3(0, 100, 0) })
            .to(0.24, { opacity: 255, position: cc.v3() }, { easing: "sineOut" })
            .call(() => {
                onAnimCompleted();
            })
            .start();
    }

    private _playPanelHideAnim(onAnimCompleted: Function) {
        cc.Tween.stopAllByTarget(this.dialogBgNode);
        cc.tween<cc.Node>(this.dialogBgNode).to(0.24, { opacity: 0 }, { easing: "sineOut" }).start();

        cc.Tween.stopAllByTarget(this.dialogContentNode);
        cc.tween<cc.Node>(this.dialogContentNode)
            .to(0.24, { opacity: 0, position: cc.v3(0, 100, 0) }, { easing: "sineOut" })
            .call(() => {
                onAnimCompleted();
            })
            .start();
    }
}
