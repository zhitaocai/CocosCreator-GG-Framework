import { gg } from "../../../scripts/framework/gg";
import { GameSettingConst } from "./GameSettingConst";
import GameSettingModel from "./GameSettingModel";

/**
 * 游戏设置模块
 *
 * @author caizhitao
 * @created 2020-12-10 21:02:45
 */
export default class GameSettingModule {
    /**
     * 游戏设置数据
     */
    static data: GameSettingModel = null;

    /**
     * 初始化游戏配置
     */
    static initSettingConfig() {
        let settingCacheJsonStr = gg.storage.getItem(GameSettingConst.CacheKey);
        if (settingCacheJsonStr == null || settingCacheJsonStr == "") {
            this.data = new GameSettingModel();
        } else {
            try {
                this.data = new GameSettingModel().fromJSON(JSON.parse(settingCacheJsonStr));
            } catch (error) {
                gg.logger.error("解析游戏缓存设置信息时失败", error);
                gg.logger.error("将重置游戏设置");
                this.data = new GameSettingModel();
            }
        }
        gg.logger.log("游戏设置", this.data);
    }

    /**
     * 保存游戏配置
     */
    static saveSettingConfig() {
        this.data && gg.storage.setItem(GameSettingConst.CacheKey, this.data.toJsonString());
    }
}
