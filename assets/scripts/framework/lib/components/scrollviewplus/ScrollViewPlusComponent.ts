import ScrollViewPlusItemComponent from "./ScrollViewPlusItemComponent";

const { ccclass, property } = cc._decorator;

/**
 * 只渲染可视区域的ScrollView
 *
 * @author caizhitao
 * @created 2020-12-27 22:08:00
 * @description
 *
 * 用法：
 *
 *      1. 将本组件挂载在节点上即可，和正常ScrollView使用一致
 *
 * 原理：
 *
 *      1. 滚动时，判断子节点是否进入了/离开了可视区域
 *      2. 根据结果回调对应事件，在可以实现类似以下功能：
 *          * 控制可视区域Item显示（透明度改为 255 ），非可视区域Item隐藏（透明度改为 0 ）
 */
@ccclass
export default class ScrollViewPlusComponent extends cc.ScrollView {
    @property({
        tooltip: "是否计算在可视区域中Item的相对位置（可能会相对耗性能）",
    })
    caculatePosition: boolean = false;

    onEnable() {
        super.onEnable();
        this.node.on("scrolling", this._onScrollingDrawCallOpt, this);
    }

    onDisable() {
        super.onDisable();
        this.node.off("scrolling", this._onScrollingDrawCallOpt, this);
    }

    private _onScrollingDrawCallOpt() {
        this.content.childrenCount > 0 && this.optDc();
    }

    optDc() {
        ScrollViewPlusComponent.optDc(this, this.caculatePosition);
    }

    /**
     * 判断目标节点是否在 ScrollView 的可视区域中
     *
     * @param targetNode 目标节点
     */
    isNodeVisiable(node: cc.Node): boolean {
        return ScrollViewPlusComponent.isNodeVisiable(this, node);
    }

    /**
     * 判断目标节点是否在 ScrollView 的可视区域中
     *
     * @param scrollView ScrollView 组件
     * @param targetNode 目标节点
     */
    static isNodeVisiable(scrollView: cc.ScrollView, targetNode: cc.Node): boolean {
        // 获取 ScrollView Node 的左下角坐标在世界坐标系中的坐标
        let svLeftBottomPoint: cc.Vec2 = scrollView.node.parent.convertToWorldSpaceAR(
            cc.v2(scrollView.node.x - scrollView.node.anchorX * scrollView.node.width, scrollView.node.y - scrollView.node.anchorY * scrollView.node.height)
        );
        // 求出 ScrollView 可视区域在世界坐标系中的矩形（碰撞盒）
        let svBBoxRect: cc.Rect = cc.rect(svLeftBottomPoint.x, svLeftBottomPoint.y, scrollView.node.width, scrollView.node.height);

        return targetNode.getBoundingBoxToWorld().intersects(svBBoxRect);
    }

    /**
     * 优化 ScrollView Content 节点 DC，可以手动调用
     *
     * 具体为
     *
     * 1. 进入ScrollView可视区域是，回调对应 Content 子节点上挂载的 ScollViewPlusItem 组件的 onEnterScorllViewEvents 数组事件
     * 2. 退出ScrollView可视区域是，回调对应 Content 子节点上挂载的 ScollViewPlusItem 组件的 onExitScorllViewEvents 数组事件
     */
    static optDc(scrollView: cc.ScrollView, caculatePosition: boolean = false) {
        // 获取 ScrollView Node 的左下角坐标在世界坐标系中的坐标
        let svLeftBottomPoint: cc.Vec2 = scrollView.node.parent.convertToWorldSpaceAR(
            cc.v2(scrollView.node.x - scrollView.node.anchorX * scrollView.node.width, scrollView.node.y - scrollView.node.anchorY * scrollView.node.height)
        );

        // 求出 ScrollView 可视区域在世界坐标系中的矩形（碰撞盒）
        let svBBoxRect: cc.Rect = cc.rect(svLeftBottomPoint.x, svLeftBottomPoint.y, scrollView.node.width, scrollView.node.height);

        // 遍历 ScrollView Content 内容节点的子节点，对每个子节点的包围盒做和 ScrollView 可视区域包围盒做碰撞判断
        scrollView.content.children.forEach((childNode: cc.Node) => {
            // 没有绑定指定组件的子节点不处理
            let itemComponent = childNode.getComponent(ScrollViewPlusItemComponent);
            if (itemComponent == null) {
                return;
            }

            // 如果相交了，那么就显示，否则就隐藏
            let childNodeBBox = childNode.getBoundingBoxToWorld();
            if (childNodeBBox.intersects(svBBoxRect)) {
                if (!itemComponent.isShowing) {
                    itemComponent.isShowing = true;
                    itemComponent.publishOnEnterScrollView();
                }
                if (caculatePosition) {
                    if (itemComponent.isShowing) {
                        itemComponent.publishOnPositionChange(
                            (childNodeBBox.x - (svBBoxRect.x - childNodeBBox.width / 2)) / (childNodeBBox.width + svBBoxRect.width),
                            (childNodeBBox.y - (svBBoxRect.y - childNodeBBox.height / 2)) / (childNodeBBox.height + svBBoxRect.height)
                        );
                    }
                }
            } else {
                if (itemComponent.isShowing) {
                    itemComponent.isShowing = false;
                    itemComponent.publishOnExitScrollView();
                }
            }
        });
    }
}
