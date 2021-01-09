import Analysis from "./lib/analysis/Analysis";
import { AnalysisInterface } from "./lib/analysis/AnalysisInterface";
import EventManager from "./lib/eventmanager/EventManager";
import { EventManagerInterface } from "./lib/eventmanager/EventManagerInterface";
import CCLogger from "./lib/logger/CCLogger";
import { LoggerInterface } from "./lib/logger/LoggerInterface";
import PanelRouter from "./lib/router/PanelRouter";
import { LocalStorage } from "./lib/storage/LocalStorage";
import { LocalStorageInterface } from "./lib/storage/LocalStorageInterface";

/**
 * 框架接口
 */
export interface FrameworkInterface {
    /**
     * 日志接口
     */
    logger: LoggerInterface;

    /**
     * 事件广播、监听、注销管理器接口
     */
    eventManager: EventManagerInterface;

    /**
     * 事件统计上报接口
     */
    analysis: AnalysisInterface;

    /**
     * 面板路由器接口
     */
    panelRouter: PanelRouter;

    /**
     * 本地缓存键值对存储接口
     */
    storage: LocalStorageInterface;
}

/**
 * GoGame 框架入口
 */
export const gg: FrameworkInterface = {
    logger: ((): LoggerInterface => {
        return new CCLogger();
        // if (cc.sys.isNative) {
        //     return new NativeLogger();
        // } else {
        //     return new CCLogger();
        // }
    })(),
    eventManager: new EventManager(),
    analysis: new Analysis(),
    storage: new LocalStorage(),
    panelRouter: new PanelRouter()
};
