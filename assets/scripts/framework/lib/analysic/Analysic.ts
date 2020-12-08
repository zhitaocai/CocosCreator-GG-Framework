import { gg } from "../../gg";
import { AnalysicInterface as AnalysicInterface, EventParam } from "./AnalysicInterface";

/**
 * 默认统计分析类
 *
 * @author caizhitao
 * @created 2020-11-26 22:25:55
 */
export default class Analysic implements AnalysicInterface {
    report(eventName: string, eventParams?: EventParam): void {
        gg.logger.log("analysic", "report", eventName, eventParams);
        // gg.logger.log(">> 上报事件")
        // gg.logger.log(">> name       : " + eventName);
        // gg.logger.log(">> params     : ");
        // if (eventParams) {
        //     let keys = Object.keys(eventParams);
        //     if (keys) {
        //         for (let i = 0; i < keys.length; i++) {
        //             gg.logger.log(`>>>> ${keys[i]} : ${eventParams[keys[i]]}`);
        //         }
        //     }
        // }
    }
}
