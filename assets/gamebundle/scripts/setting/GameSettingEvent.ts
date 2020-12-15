/**
 * 游戏设置模块事件
 *
 * @author caizhitao
 * @created 2020-12-15 21:44:17
 */
export enum GameSettingEvent {
    /**
     * 音乐音量改变时回调
     */
    OnMusicVolumeChanged = "GameSettingEvent.OnMusicVolumeChanged",

    /**
     * 音效音量改变时回调
     */
    OnSoundVolumeChanged = "GameSettingEvent.OnSoundVolumeChanged",

    /**
     * 振动开关改变时回调
     */
    OnVibrateChanged = "GameSettingEvent.OnVibrateChanged",
}
