import GameSettingModule from "../../gamebundle/scripts/setting/GameSettingModule";
import { gg } from "../../scripts/framework/gg";
import { Panels } from "./configs/Panels";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainSceneCtrl extends cc.Component {
    @property(cc.Node)
    rootLayerNode: cc.Node = null;

    onLoad() {
        // 初始化日志管理器
        gg.logger.init({
            enableLog: CC_DEBUG,
        });

        // 初始化面板路由器
        gg.panelRouter.init(this.rootLayerNode, true);
    }

    async start() {
        // 初始化游戏设置
        GameSettingModule.initSettingConfig();

        // 提前加载通用弹窗面板
        await gg.panelRouter.loadAsync(Panels.loadingPanel);
        await gg.panelRouter.loadAsync(Panels.toastPanel);

        // 加载游戏设置面板
        await gg.panelRouter.loadAsync(Panels.gameSettingPanel);

        // 加载游戏主面板
        await gg.panelRouter.loadAsync(Panels.gamePanel);

        // 打开主面板
        gg.panelRouter.show({
            panelConfig: Panels.gamePanel,
        });
    }
}
