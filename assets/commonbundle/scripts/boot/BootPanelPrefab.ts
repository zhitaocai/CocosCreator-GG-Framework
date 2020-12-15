import GameSettingModule from "../../../gamebundle/scripts/gamesetting/GameSettingModule";
import { BundleConfigs } from "../../../mainbundle/scripts/configs/BundleConfigs";
import { PanelConfigs } from "../../../mainbundle/scripts/configs/PanelConfigs";
import { gg } from "../../../scripts/framework/gg";
import AssetLoader from "../../../scripts/framework/lib/asset/AssetLoader";
import { PanelComponent, PanelHideOption, PanelShowOption } from "../../../scripts/framework/lib/router/PanelComponent";

const { ccclass, property } = cc._decorator;

/**
 * 启动页面板
 *
 * @author caizhitao
 * @created 2020-12-14 21:29:55
 */
@ccclass
export default class BootPanelPrefab extends PanelComponent {
    @property({
        type: cc.ProgressBar,
        tooltip: "加载进度",
    })
    loadingProgressBar: cc.ProgressBar = null;

    @property({
        type: cc.Label,
        tooltip: "加载文本",
    })
    loadingLabel: cc.Label = null;

    show(option: PanelShowOption): void {
        option.onShowed();
        this._initGame();
    }

    hide(option: PanelHideOption): void {
        option.onHided();
    }

    private async _initGame() {
        // 加载 Bundle
        this._onLoadProgressChanged(0, "加载游戏设置...");
        await AssetLoader.loadBundle(BundleConfigs.GameBundle);

        // 初始化游戏设置
        this._onLoadProgressChanged(0.1, "加载游戏设置...");
        GameSettingModule.initSettingConfig();

        // 提前加载通用弹窗面板
        this._onLoadProgressChanged(0.2, "加载游戏资源...");
        await gg.panelRouter.loadAsync(PanelConfigs.loadingPanel);

        this._onLoadProgressChanged(0.3, "加载游戏资源...");
        await gg.panelRouter.loadAsync(PanelConfigs.toastPanel);

        // 加载游戏设置面板
        this._onLoadProgressChanged(0.4, "加载游戏资源...");
        await gg.panelRouter.loadAsync(PanelConfigs.gameSettingPanel);

        // 加载游戏主面板
        this._onLoadProgressChanged(0.5, "加载游戏资源...");
        await gg.panelRouter.loadAsync(PanelConfigs.gamePanel);

        // 打开主面板
        this._onLoadProgressChanged(1.0);
        gg.panelRouter.show({
            panel: PanelConfigs.gamePanel,
            onShowed: () => {
                // 主面板打开完毕之后，隐藏并清理启动页面板相关资源（因为后续不会在用到）
                gg.panelRouter.hide({
                    panel: PanelConfigs.bootPanel,
                    onHided: () => {
                        gg.panelRouter.destroy({
                            panel: PanelConfigs.bootPanel,
                        });
                    },
                });
            },
        });
    }

    /**
     * 加载进度更新
     *
     * @param pb 加载进度 [0, 1]
     * @param msg 加载描述信息
     */
    private _onLoadProgressChanged(pb: number, msg: string = null) {
        this.loadingProgressBar.progress = pb;
        if (msg) {
            this.loadingLabel.string = msg;
        }
    }
}
