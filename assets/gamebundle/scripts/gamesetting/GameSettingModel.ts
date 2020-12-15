/**
 * 游戏设置模块数据
 *
 * @author caizhitao
 * @created 2020-12-10 21:02:57
 */
export default class GameSettingModel {
    /**
     * 音乐音量[0, 1]
     */
    musicVolume: number = 1;

    /**
     * 音效音量[0, 1]
     */
    soundVolume: number = 1;

    /**
     * 是否允许振动
     */
    enableVibrate: boolean = true;

    fromJSON(json: any): GameSettingModel {
        this.musicVolume = json.musicVolume;
        this.soundVolume = json.soundVolume;
        this.enableVibrate = json.enableVibrate;
        return this;
    }

    toJSON() {
        let json = {};
        json = Object.assign(json, this);
        return json;
    }

    toJsonString() {
        return JSON.stringify(this.toJSON());
    }
}
