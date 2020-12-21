import { gg } from "../../gg";
import { PanelComponent } from "./PanelComponent";
import { PanelConfig } from "./PanelConfig";
import { PanelStateEnum } from "./PanelStateEnum";

/**
 * 面板路由器
 *
 * 面板结构如下：
 *
 * - 图层1
 *   - 面板1
 *   - 面板2
 * - 图层2
 *   - 面板3
 *   - 面板4
 * - ...
 *
 * 根据面板所以依附的图层节点的zIndex 来决定面板的显示前后顺序（zIndex大的图层会挡住zIndex小的图层）
 *
 * 本工具提供以下方法：
 *
 * * init
 * * preload
 * * load
 * * loadAsync
 * * show
 * * showAsync
 * * hide
 * * hideAsync
 * * destroy
 * * getPanelState
 *
 * @author caizhitao
 * @created 2020-11-28 09:51:33
 */
export default class PanelRouter {
    private static Tag = "PanelRouter";

    /**
     * 是否允许输出调试Log
     */
    private _enabledLog: boolean = true;

    /**
     * 所有UI图层的根节点
     */
    private _rootNode: cc.Node = null;

    /**
     * 记录图层节点的Map
     *
     * key: 图层节点zIndex
     * value: 图层节点
     */
    private _layerNodeMap: Map<number, cc.Node> = new Map();

    /**
     * 记录面板缓存的Map
     *
     * * key: 面板Prefab路径
     * * value: 面板缓存（节点、状态）
     */
    private _panelCacheMap: Map<string, PanelCache> = new Map();

    /**
     * 初始化面板路由器
     *
     * @param rootNode 图层根节点（此节点建议最好是扩充全屏的）
     * @param enableDebugLog 是否允许打印面板路由器操作日志
     */
    init(rootNode: cc.Node, enableDebugLog: boolean) {
        this._enabledLog = enableDebugLog;
        this._rootNode = rootNode;
    }

    /**
     * 预加载面板资源（只下载到本地，不加载解析到内存）
     */
    preload(panelConfig: PanelConfig) {
        let preloadBundlePrefab = (bundle: cc.AssetManager.Bundle) => {
            let prefabPath = panelConfig.prefabPath.substring(panelConfig.prefabPath.indexOf("/") + 1);
            bundle.preload(prefabPath);
        };
        let bundleName = panelConfig.prefabPath.substring(0, panelConfig.prefabPath.indexOf("/"));
        let bundle: cc.AssetManager.Bundle = cc.assetManager.getBundle(bundleName);
        if (bundle == null) {
            cc.assetManager.loadBundle(bundleName, (error: Error, bundle: cc.AssetManager.Bundle) => {
                preloadBundlePrefab(bundle);
            });
        } else {
            preloadBundlePrefab(bundle);
        }
    }

    /**
     * （Promise）加载面板资源（加载到内存）
     */
    loadAsync(panelConfig: PanelConfig): Promise<cc.Prefab> {
        return new Promise<cc.Prefab>((resolve, reject) => {
            this.load(panelConfig, null, (error: Error, prefab: cc.Prefab) => {
                error ? reject(error) : resolve(prefab);
            });
        });
    }

    /**
     * 加载面板资源（加载到内存）
     */
    load(panelConfig: PanelConfig, onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onCompleted: (error: Error, prefab: cc.Prefab) => void) {
        let prefabPath = panelConfig.prefabPath;
        let panelCache = this._panelCacheMap.get(prefabPath);
        if (!panelCache) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试加载面板", "面板还不存在，将开始加载面板");

            // 初始化面板状态并记录下来
            panelCache = {
                node: null,
                prefab: null,
                state: PanelStateEnum.Loading,
            };
            this._panelCacheMap.set(prefabPath, panelCache);
        }
        panelCache.state = PanelStateEnum.Loading;

        // 开始加载面板
        this._loadBundlePrefab(panelConfig, onProgress, (error: Error, prefab: cc.Prefab) => {
            // 加载完毕后，需要在此获取面板状态
            // 因为加载是一个过程，这个过程中，面板可能被销毁了等等之类，因此加载完毕后，重新获取面板状态
            panelCache = this._panelCacheMap.get(prefabPath);
            if (error) {
                // 处理面板实际加载失败的逻辑
                this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试加载面板", "加载面板失败", error);
                if (!panelCache) {
                    this._enabledLog && gg.logger.warn(PanelRouter.Tag, prefabPath, "尝试加载面板", "当前已经找不到面板记录，可能面板加载过程中触发销毁，导致加载结束后找不到对应面板记录");
                } else {
                    if (
                        panelCache.state === PanelStateEnum.LoadFailure ||
                        panelCache.state === PanelStateEnum.LoadSuccess ||
                        panelCache.state === PanelStateEnum.Showing ||
                        panelCache.state === PanelStateEnum.Showed ||
                        panelCache.state === PanelStateEnum.Hiding ||
                        panelCache.state === PanelStateEnum.Hided
                    ) {
                        this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试加载面板", "面板状态异常，原则上不会出现这个状态", panelCache.state);
                    } else {
                        // 更新面板状态
                        panelCache.node = null;
                        panelCache.prefab = null;
                        panelCache.state = PanelStateEnum.LoadFailure;
                    }
                }
            } else {
                // 处理面板实际加载成功的逻辑
                this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试加载面板", "加载面板成功");

                if (!panelCache) {
                    this._enabledLog && gg.logger.warn(PanelRouter.Tag, prefabPath, "尝试加载面板", "当前已经找不到面板记录，可能面板加载过程中触发销毁，导致加载结束后找不到对应面板记录");
                    // 销毁 prefab
                    prefab.decRef();
                } else {
                    if (
                        panelCache.state === PanelStateEnum.LoadFailure ||
                        panelCache.state === PanelStateEnum.LoadSuccess ||
                        panelCache.state === PanelStateEnum.Showing ||
                        panelCache.state === PanelStateEnum.Showed ||
                        panelCache.state === PanelStateEnum.Hiding ||
                        panelCache.state === PanelStateEnum.Hided
                    ) {
                        this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试加载面板", "面板状态异常，原则上不会出现这个状态", panelCache.state);
                    } else {
                        // 更新面板状态
                        panelCache.node = null;
                        panelCache.prefab = prefab;
                        panelCache.state = PanelStateEnum.LoadSuccess;

                        // Prefab 引用 + 1
                        panelCache.prefab.addRef();
                    }
                }
            }
            onCompleted(error, prefab);
        });
    }

    private _loadBundlePrefab(
        panelConfig: PanelConfig,
        onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void,
        onCompleted: (error: Error, prefab: cc.Prefab) => void
    ) {
        let loadBundlePrefab = (bundle: cc.AssetManager.Bundle) => {
            let prefabPath = panelConfig.prefabPath.substring(panelConfig.prefabPath.indexOf("/") + 1);
            bundle.load(prefabPath, cc.Prefab, onProgress, (error: Error, prefab: cc.Prefab) => {
                onCompleted(error, prefab);
            });
        };
        let bundleName = panelConfig.prefabPath.substring(0, panelConfig.prefabPath.indexOf("/"));
        let bundle: cc.AssetManager.Bundle = cc.assetManager.getBundle(bundleName);
        if (bundle == null) {
            cc.assetManager.loadBundle(bundleName, (error: Error, bundle: cc.AssetManager.Bundle) => {
                loadBundlePrefab(bundle);
            });
        } else {
            loadBundlePrefab(bundle);
        }
    }

    /**
     * （Promise）展示面板
     *
     * @param option 展示面板的参数
     */
    showAsync(option: CommonPanelOption) {
        return new Promise<void>((resolve, reject) => {
            this.show({
                panel: option.panel,
                data: option.data,
                onShowed: (error) => {
                    error ? reject(error) : resolve();
                },
            });
        });
    }

    /**
     * 展示面板
     *
     * @param option 展示面板的参数
     */
    show(option: ShowPanelOption) {
        let prefabPath = option.panel.prefabPath;
        let panelCache = this._panelCacheMap.get(prefabPath);
        if (!panelCache) {
            this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试展示面板", "面板还没有加载，不能展示");
            option.onShowed && option.onShowed(new Error("show error"));
            return;
        }
        if (panelCache.state === PanelStateEnum.Loading) {
            this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试展示面板", "面板在加载中，不能展示");
            option.onShowed && option.onShowed(new Error("show error"));
            return;
        }
        if (panelCache.state === PanelStateEnum.LoadFailure) {
            this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试展示面板", "面板加载失败，不能展示");
            option.onShowed && option.onShowed(new Error("show error"));
            return;
        }
        if (panelCache.state === PanelStateEnum.LoadSuccess) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试展示面板", "面板已加载成功，将尝试展示面板");
            this._showPanel(option, panelCache);
            return;
        }
        if (panelCache.state === PanelStateEnum.Showing) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试展示面板", "面板正在展示中");
            this._showPanel(option, panelCache);
            return;
        }
        if (panelCache.state === PanelStateEnum.Showed) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试展示面板", "面板已展示");
            this._showPanel(option, panelCache);
            return;
        }
        if (panelCache.state === PanelStateEnum.Hiding) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试展示面板", "面板在隐藏中，将停止隐藏动画，并立即开始展示");
            this._showPanel(option, panelCache);
            return;
        }
        if (panelCache.state === PanelStateEnum.Hided) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试展示面板", "面板已隐藏，将重新展示");
            this._showPanel(option, panelCache);
            return;
        }
    }

    private _showPanel(option: ShowPanelOption, panelCache: PanelCache) {
        if (panelCache.node == null) {
            // 获取面板层级节点
            let panelLayerNode = this._layerNodeMap.get(option.panel.layerZIndex);
            if (panelLayerNode == null) {
                panelLayerNode = new cc.Node();
                panelLayerNode.zIndex = option.panel.layerZIndex;
                // 为图层添加 Widget 组件，扩充至全屏尺寸
                let widget: cc.Widget = panelLayerNode.addComponent(cc.Widget);
                widget.top = 0;
                widget.bottom = 0;
                widget.left = 0;
                widget.right = 0;
                widget.isAlignTop = true;
                widget.isAlignBottom = true;
                widget.isAlignLeft = true;
                widget.isAlignRight = true;
                widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
                // 将图层节点添加到根节点中
                this._rootNode.addChild(panelLayerNode);
                // 缓存层级节点
                this._layerNodeMap.set(option.panel.layerZIndex, panelLayerNode);
            }
            // 将面板加入到层级节点中
            let panelNode = cc.instantiate(panelCache.prefab);
            panelNode.setPosition(cc.v2(0, 0));
            panelNode.setParent(panelLayerNode);
            panelCache.node = panelNode;
        }
        panelCache.state = PanelStateEnum.Showing;
        panelCache.node.active = true;
        panelCache.node.getComponent(PanelComponent).show({
            data: option.data,
            onShowed: () => {
                this._enabledLog && gg.logger.log(PanelRouter.Tag, option.panel.prefabPath, "尝试展示面板", "面板已经展示完成");
                panelCache.state = PanelStateEnum.Showed;
                option.onShowed && option.onShowed();
            },
        });
    }

    /**
     * （Promise）隐藏面板
     *
     * @param option 隐藏面板的参数
     */
    hideAsync(option: CommonPanelOption) {
        return new Promise<void>((resolve, reject) => {
            this.hide({
                panel: option.panel,
                data: option.data,
                onHided: (error) => {
                    error ? reject(error) : resolve();
                },
            });
        });
    }

    /**
     * 隐藏面板
     *
     * @param option 隐藏面板的参数
     */
    hide(option: HidePanelOption) {
        let prefabPath = option.panel.prefabPath;
        let panelCache = this._panelCacheMap.get(prefabPath);
        if (!panelCache) {
            this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试隐藏面板", "面板还没有加载，不能隐藏");
            option.onHided && option.onHided(new Error("hide error"));
            return;
        }
        if (panelCache.state === PanelStateEnum.Loading) {
            this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试隐藏面板", "面板在加载中，不能隐藏");
            option.onHided && option.onHided(new Error("hide error"));
            return;
        }
        if (panelCache.state === PanelStateEnum.LoadFailure) {
            this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试隐藏面板", "面板加载失败，不能隐藏");
            option.onHided && option.onHided(new Error("hide error"));
            return;
        }
        if (panelCache.state === PanelStateEnum.LoadSuccess) {
            this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试隐藏面板", "面板已加载成功，但未展示，不能隐藏");
            option.onHided && option.onHided(new Error("hide error"));
            return;
        }
        if (panelCache.state === PanelStateEnum.Showing) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试隐藏面板", "面板在展示中（可能正在执行展示动画），将停止展示并立即隐藏");
            this._hidePanel(option, panelCache);
            return;
        }
        if (panelCache.state === PanelStateEnum.Showed) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试隐藏面板", "面板已展示，将立即隐藏");
            this._hidePanel(option, panelCache);
            return;
        }
        if (panelCache.state === PanelStateEnum.Hiding) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试隐藏面板", "面板正在隐藏中");
            this._hidePanel(option, panelCache);
            return;
        }
        if (panelCache.state === PanelStateEnum.Hided) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试隐藏面板", "面板已隐藏");
            this._hidePanel(option, panelCache);
            return;
        }
    }

    private _hidePanel(option: HidePanelOption, panelCache: PanelCache) {
        panelCache.state = PanelStateEnum.Hiding;
        panelCache.node.getComponent(PanelComponent).hide({
            data: option.data,
            onHided: () => {
                this._enabledLog && gg.logger.log(PanelRouter.Tag, option.panel.prefabPath, "尝试隐藏面板", "面板隐藏成功");
                panelCache.state = PanelStateEnum.Hided;
                panelCache.node.active = false;
                option.onHided && option.onHided();
            },
        });
    }

    /**
     * 销毁面板
     *
     * @param option 销毁参数
     */
    destroy(option: CommonPanelOption) {
        let prefabPath = option.panel.prefabPath;
        let panel = this._panelCacheMap.get(prefabPath);
        if (!panel) {
            this._enabledLog && gg.logger.error(PanelRouter.Tag, prefabPath, "尝试销毁面板", "当前面板还不存在（建议检查为什么此时触发销毁方法）");
            return;
        }
        if (panel.state === PanelStateEnum.Loading) {
            this._enabledLog && gg.logger.warn(PanelRouter.Tag, prefabPath, "尝试销毁面板", "面板在加载中时，将销毁面板资源（建议检查为什么此时触发了销毁方法）");
            this._destroyPanel(panel, prefabPath);
            return;
        }
        if (panel.state === PanelStateEnum.LoadFailure) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试销毁面板", "面板加载已经失败，将销毁面板资源");
            this._destroyPanel(panel, prefabPath);
            return;
        }
        if (panel.state === PanelStateEnum.LoadSuccess) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试销毁面板", "面板加载已经成功（但无后续操作），将销毁面板资源");
            this._destroyPanel(panel, prefabPath);
            return;
        }
        if (panel.state === PanelStateEnum.Showing) {
            this._enabledLog && gg.logger.warn(PanelRouter.Tag, prefabPath, "尝试销毁面板", "面板在展示中（可能正在执行展示动画），将销毁面板资源（建议检查为什么此时触发了销毁方法）");
            this._destroyPanel(panel, prefabPath);
            return;
        }
        if (panel.state === PanelStateEnum.Showed) {
            this._enabledLog && gg.logger.warn(PanelRouter.Tag, prefabPath, "尝试销毁面板", "面板已展示，将销毁面板资源（建议检查为什么此时触发了销毁方法）");
            this._destroyPanel(panel, prefabPath);
            return;
        }
        if (panel.state === PanelStateEnum.Hiding) {
            this._enabledLog && gg.logger.warn(PanelRouter.Tag, prefabPath, "尝试销毁面板", "面板在隐藏中（可能正在执行隐藏动画），将销毁面板资源（建议检查为什么此时触发了销毁方法）");
            this._destroyPanel(panel, prefabPath);
            return;
        }
        if (panel.state === PanelStateEnum.Hided) {
            this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试销毁面板", "面板已隐藏，将销毁面板资源");
            this._destroyPanel(panel, prefabPath);
            return;
        }
    }

    private _destroyPanel(panelCache: PanelCache, prefabPath: string) {
        if (panelCache.node) {
            panelCache.node.destroy();
            panelCache.node = null;
        }
        if (panelCache.prefab) {
            panelCache.prefab.decRef();
            panelCache.prefab = null;
        }
        this._panelCacheMap.delete(prefabPath);
        this._enabledLog && gg.logger.log(PanelRouter.Tag, prefabPath, "尝试销毁面板", "面板销毁成功");
    }

    /**
     * 获取面板当前状态
     *
     * @returns 如果还没有创建或者已经销毁了，那么返回null，否则返回对应的状态
     */
    getPanelState(panelConfig: PanelConfig): PanelStateEnum {
        let panel = this._panelCacheMap.get(panelConfig.prefabPath);
        if (!panel) {
            return null;
        }
        return panel.state;
    }
}

interface PanelCache {
    /**
     * 面板节点（在面板状态为 Loading 和 LoadingFailure ）的时候，节点是不存在的
     */
    node: cc.Node;

    /**
     * 面板 Prefab Asset
     */
    prefab: cc.Prefab;

    /**
     * 面板状态
     */
    state: PanelStateEnum;
}

export interface CommonPanelOption {
    /**
     * 要操作的面板
     */
    panel: PanelConfig;

    /**
     * 操作面板时传入的参数
     */
    data?: any;
}

export interface ShowPanelOption extends CommonPanelOption {
    /**
     * 展示动画播完完毕之后回调（如果没有展示动画，则立即回调）
     *
     */
    onShowed?(
        /**
         * 展示错误时，此参数存在
         */
        error?: Error
    ): void;
}

export interface HidePanelOption extends CommonPanelOption {
    /**
     * 隐藏动画播完完毕之后回调（如果没有隐藏动画，则立即回调）
     */
    onHided?(
        /**
         * 隐藏错误时，此参数存在
         */
        error?: Error
    ): void;
}
