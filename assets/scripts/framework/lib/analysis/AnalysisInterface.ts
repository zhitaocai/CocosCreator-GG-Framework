/**
 * 数据上报/事件埋点接口
 *
 * @author caizhitao
 * @created 2020-11-26 22:26:22
 */
export interface AnalysisInterface {
    /**
     * 上报统计事件
     *
     * @param eventName 事件名
     * @param eventParams 自定义参数属性，如：eventParams["date"] = "2019"
     *
     * @example
     *
     * log("game_finished", {
     *      "time": "000",
     *      "score": "111",
     * });
     *
     */
    report(eventName: string, eventParams?: EventParam): void;
}

export type EventParam =
    | {
          [
              /**
               * 参数名
               */
              key: string
          ]: string;
      }
    | {
          /**
           * 用于上传事件特殊值。
           *
           * 如：分数、ID等
           */
          statistics: string;

          /**
           * 事件触发入口来源。
           *
           * 如：打开一个页面，可以从A，B两个入口页面进入，那么就可以用 entrance 去标识不同的入口
           */
          entrance: string;

          /**
           * 记录事件触发分支。
           *
           * 如：同一个操作，可以是免费触发，看视频触发，积分兑换后触发，那么就可以用 tab 去标识事件的不同触发分支
           */
          tab: string;
      }
    | any;
