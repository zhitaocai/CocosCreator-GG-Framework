import { PanelConfig } from "../../../scripts/framework/lib/router/PanelConfig";
import { BundleConfigs } from "./BundleConfigs";

/**
 * 面板图层层级（层级大的显示在最前面）
 */
enum PanelLayerEnum {
    /**
     * 普通界面
     */
    UILayer = 200,

    /**
     * 弹窗层级
     */
    PopLayer = 400,
}

interface PanelConfigProperty {
    [
        /**
         * 参数名
         */
        key: string
    ]: PanelConfig;
}

/**
 * 游戏面板配置
 */
export const PanelConfigs: PanelConfigProperty = {
    // ///////////////////////////////////////////////////////
    // 普通页面层级

    /**
     * 游戏启动页面板
     */
    bootPanel: {
        prefabPath: `${BundleConfigs.CommonBundle}/prefabs/boot/BootPanelPrefab`,
        layerZIndex: PanelLayerEnum.UILayer,
    },
    /**
     * 游戏主面板
     */
    gamePanel: {
        prefabPath: `${BundleConfigs.GameBundle}/prefabs/game/GamePanelPrefab`,
        layerZIndex: PanelLayerEnum.UILayer,
    },

    /**
     * 游戏设置面板
     */
    gameSettingPanel: {
        prefabPath: `${BundleConfigs.GameBundle}/prefabs/gamesetting/GameSettingPanelPrefab`,
        layerZIndex: PanelLayerEnum.UILayer,
    },

    // ///////////////////////////////////////////////////////
    // 弹窗层级

    /**
     * 通用加载页面
     */
    loadingPanel: {
        prefabPath: `${BundleConfigs.CommonBundle}/prefabs/popwindow/LoadingPanelPrefab`,
        layerZIndex: PanelLayerEnum.PopLayer,
    },

    /**
     * 通用Toast页面
     */
    toastPanel: {
        prefabPath: `${BundleConfigs.CommonBundle}/prefabs/popwindow/ToastPanelPrefab`,
        layerZIndex: PanelLayerEnum.PopLayer,
    },
};
