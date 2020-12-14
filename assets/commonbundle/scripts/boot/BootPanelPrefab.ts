import { Panels } from "../../../mainbundle/scripts/configs/Panels";
import { gg } from "../../../scripts/framework/gg";
import { PanelComponent, PanelHideOption, PanelShowOption } from "../../../scripts/framework/lib/router/PanelComponent";
import { LoadingPanelShowArgs } from "../popwindow/LoadingPanelPrefab";
import { ToastPanelShowArgs } from "../popwindow/ToastPanelPrefab";

const { ccclass, property } = cc._decorator;

/**
 * @author caizhitao
 * @created 2020-12-14 21:29:55
 */
@ccclass
export default class BootPanelPrefab extends PanelComponent {
    @property({
        type: cc.ProgressBar,
        tooltip: "加载进度",
    })
    loadingProgressBar: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: "加载文本",
    })
    loadingLabel: cc.Node = null;

    show(option: PanelShowOption): void {
        option.onShowed();
        //     // 默认播放loading动画
        //     this._playPanelShowAnim(() => {
        //         option.onShowed();
        //     });
    }

    hide(option: PanelHideOption): void {
        option.onHided();
        // this._playPanelHideAnim(() => {
        //     option.onHided();
        // });
    }

    // private async _initGame() {
    //     // 初始化游戏设置
    //     GameSettingModule.initSettingConfig();

    //     // 提前加载通用弹窗面板
    //     await gg.panelRouter.loadAsync(Panels.loadingPanel);
    //     await gg.panelRouter.loadAsync(Panels.toastPanel);

    //     // 加载游戏设置面板
    //     await gg.panelRouter.loadAsync(Panels.gameSettingPanel);

    //     // 加载游戏主面板
    //     await gg.panelRouter.loadAsync(Panels.gamePanel);

    //     // 打开主面板
    //     gg.panelRouter.show({
    //         panelConfig: Panels.gamePanel,
    //     });
    // }

    onShowToastPanelBtnClick() {
        //   // 提前加载 Pop 弹窗面板
        //   await gg.panelRouter.loadAsync(Panels.loadingPanel);
        //   await gg.panelRouter.loadAsync(Panels.toastPanel);
        gg.panelRouter.show({
            panelConfig: Panels.toastPanel,
            data: <ToastPanelShowArgs>{
                text: "短Toast测试",
            },
        });
    }

    onShowLoadingPanelBtnClick() {
        // 打开面板弹窗
        gg.panelRouter.show({
            panelConfig: Panels.loadingPanel,
            data: <LoadingPanelShowArgs>{
                playShowAnim: true,
            },
            onShowed: () => {},
        });
    }

    onShowGameSettingPanelBtnClick() {
        gg.panelRouter.show({
            panelConfig: Panels.gameSettingPanel,
        });
    }
}
