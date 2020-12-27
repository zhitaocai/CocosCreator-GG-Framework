import { gg } from "../../scripts/framework/gg";
import AssetLoader from "../../scripts/framework/lib/asset/AssetLoader";
import { BundleConfigs } from "./configs/BundleConfigs";
import { PanelConfigs } from "./configs/PanelConfigs";

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
        // 加载 Bundle
        await AssetLoader.loadBundle(BundleConfigs.CommonBundle)
        await AssetLoader.loadBundle(BundleConfigs.GameBundle);

        // 加载启动页
        await gg.panelRouter.loadAsync(PanelConfigs.bootPanel);

        // 打开启动页
        gg.panelRouter.show({
            panel: PanelConfigs.bootPanel,
        });
    }
}
