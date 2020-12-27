const { ccclass, property } = cc._decorator;

/**
 * 缩放方式
 */
export enum SpriteScaleType {
    /**
     * 缩放到填满父节点（图像可能会被裁剪，但父节点有空白）
     */
    FILL,

    /**
     * 缩放到刚好在父节点内部最大化显示（图像会完整显示，但父节点上下或者左右可能会留空）
     */
    SUIT,
}

/**
 * 对齐方式
 */
export enum SpriteAlignType {
    /**
     * 缩放后靠左对齐
     */
    LEFT,

    /**
     * 缩放后靠上对齐
     */
    TOP,

    /**
     * 缩放后靠右对齐
     */
    RIGHT,

    /**
     * 缩放后靠下对齐
     */
    BOTTOM,

    /**
     * 缩放后居中对齐
     */
    CENTER,
}

/**
 * Sprite 适配组件
 *
 * @author caizhitao
 * @created 2020-12-27 21:22:43
 */
@ccclass
export default class SpriteScaleAdapterComponent extends cc.Component {
    @property({
        type: cc.Enum(SpriteScaleType),
        tooltip: "缩放类型:\n-FILL: 缩放到填满父节点（图像可能会被裁剪，但父节点有空白）\n-SUIT: 缩放到刚好在父节点内部最大化显示（图像会完整显示，但父节点上下或者左右可能会留空）",
    })
    scaleType: SpriteScaleType = SpriteScaleType.SUIT;

    @property({
        type: cc.Enum(SpriteAlignType),
        tooltip: "对齐方式类型:\n如：\n-LEFT: 缩放后靠左对齐",
    })
    alignType: SpriteAlignType = SpriteAlignType.CENTER;

    private _sprite: cc.Sprite = null;

    onLoad() {
        this._sprite = this.node.getComponent(cc.Sprite);
    }

    start() {
        this.updateSprite(this.scaleType, this.alignType);
    }

    onEnable() {
        let onResize = this._onResize.bind(this);
        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", onResize);
    }

    onDisable() {
        let onResize = this._onResize.bind(this);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
    }

    private _onResize() {
        this.updateSprite(this.scaleType, this.alignType);
    }

    updateSprite(scaleType: SpriteScaleType, alignType: SpriteAlignType) {
        if (!this._sprite || !this._sprite.enabled || !this._sprite.spriteFrame) {
            return;
        }
        let widget = this.node.parent.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        }
        this.node.width = this._sprite.spriteFrame.getRect().width;
        this.node.height = this._sprite.spriteFrame.getRect().height;
        if (this.node.width / this.node.height > this.node.parent.width / this.node.parent.height) {
            // 设计分辨率宽高比大于显示分辨率
            if (scaleType == SpriteScaleType.SUIT) {
                this.node.scale = this.node.parent.width / this.node.width;
            } else if (scaleType == SpriteScaleType.FILL) {
                this.node.scale = this.node.parent.height / this.node.height;
            }
        } else {
            // 设计分辨率宽高比小于显示分辨率
            if (scaleType == SpriteScaleType.SUIT) {
                this.node.scale = this.node.parent.height / this.node.height;
            } else if (scaleType == SpriteScaleType.FILL) {
                this.node.scale = this.node.parent.width / this.node.width;
            }
        }

        switch (alignType) {
            case SpriteAlignType.CENTER:
                this.node.setPosition(cc.v2());
                break;
            case SpriteAlignType.LEFT:
                this.node.setPosition(cc.v2(-0.5 * (this.node.parent.width - this.node.width * this.node.scale), 0));
                break;
            case SpriteAlignType.RIGHT:
                this.node.setPosition(cc.v2(0.5 * (this.node.parent.width - this.node.width * this.node.scale), 0));
                break;
            case SpriteAlignType.TOP:
                this.node.setPosition(cc.v2(0, 0.5 * (this.node.parent.height - this.node.height * this.node.scale)));
                break;
            case SpriteAlignType.BOTTOM:
                this.node.setPosition(cc.v2(0, -0.5 * (this.node.parent.height - this.node.height * this.node.scale)));
                break;
        }
    }
}
