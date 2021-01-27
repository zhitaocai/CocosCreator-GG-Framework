import SafeAreaAdapterComponent from "../../scripts/framework/lib/components/adapter/SafeAreaAdapterComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SafeAreaWithBottomSceneExample extends cc.Component {
    onLoad() {
        // 网页模拟安全区域（距离屏幕区域各50）
        if (CC_DEBUG) {
            SafeAreaAdapterComponent.safeAreaSimulatehandler = () => {
                return {
                    safeAreaMarginTop: 50,
                    safeAreaMarginBottom: 50,
                    safeAreaMarginLeft: 50,
                    safeAreaMarginRight: 50,
                };
            };
        }
    }
}
