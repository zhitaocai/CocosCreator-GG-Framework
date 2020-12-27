const { ccclass, property } = cc._decorator;

/**
 * 配合「ScrollViewPlus」组件使用的ScrollViewItem组件
 *
 * @author caizhitao
 * @created 2020-12-27 22:08:00
 * @description
 *
 * 用法：
 * 
 *      1. 将本组件挂载在Item节点上
 *      2. 在属性面板上指定事件数组回调，即可监听 Item 「进入」和「离开」ScrollView可视区域的事件
 */
@ccclass
export default class ScrollViewPlusItemComponent extends cc.Component {
    @property({
        type: [cc.Component.EventHandler],
        tooltip: "进入ScrollView时回调",
    })
    onEnterScorllViewEvents: cc.Component.EventHandler[] = [];

    @property({
        type: [cc.Component.EventHandler],
        tooltip: "离开ScrollView时回调",
    })
    onExitScorllViewEvents: cc.Component.EventHandler[] = [];

    @property({
        type: [cc.Component.EventHandler],
        tooltip: "进入ScrollView之后，位置发生改变时回调",
    })
    onPositionChangeEvents: cc.Component.EventHandler[] = [];

    /**
     * 当前是否在展示中
     *
     * 1. 在进入和离开ScrollView期间，为true
     * 2. 在离开ScrolLView期间，为false
     */
    isShowing: boolean = false;

    onDisable() {
        this.isShowing = false;
    }

    /**
     * Item 进入 ScrollView 的时候回调
     */
    publishOnEnterScrollView() {
        if (this.onEnterScorllViewEvents) {
            this.onEnterScorllViewEvents.forEach((event) => {
                event.emit([]);
            });
        }
    }

    /**
     * Item 离开 ScrollView 的时候回调
     */
    publishOnExitScrollView() {
        if (this.onExitScorllViewEvents) {
            this.onExitScorllViewEvents.forEach((event) => {
                event.emit([]);
            });
        }
    }

    /**
     * Item 进入 ScrollView 后，位置发生移动时回调，离开ScrollView后不会回调
     *
     * @param xOffsetPercent 相对于 ScrollView 可视区域中心点，X的偏移量百分比，取值范围：[0, 1]。其中，0：为在可视区域最左边，1：为可视区域最右边
     * @param yOffsetPercent 相对于 ScrollView 可视区域中心点，Y的偏移量百分比，取值范围：[0, 1]。其中，0：为在可视区域最下边，1：为可视区域最上边
     */
    publishOnPositionChange(xOffsetPercent: number, yOffsetPercent: number) {
        if (this.onPositionChangeEvents) {
            this.onPositionChangeEvents.forEach((event) => {
                event.emit([xOffsetPercent, yOffsetPercent]);
            });
        }
    }
}
