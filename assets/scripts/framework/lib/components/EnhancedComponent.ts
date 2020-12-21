const { ccclass, property } = cc._decorator;

/**
 * 增强型组件（额外附加一些方法）
 * 
 * @author caizhitao
 * @created 2020-12-02 21:25:28
 */
@ccclass
export abstract class EnhancedComponent extends cc.Component {
    /**
     * 分帧执行 Generator 逻辑
     *
     * @param generator 生成器
     * @param duration 持续时间（ms），每次执行 Generator 的操作时，最长可持续执行时长，如：8ms，即正常1帧（16ms）下，分一半时间给此逻辑执行
     */
    executePreFrame(generator: Generator, duration: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let gen = generator;
            let runGenerator = () => {
                let startTime = new Date().getTime();
                for (let iter = gen.next(); ; iter = gen.next()) {
                    if (iter == null || iter.done) {
                        resolve();
                        return;
                    }
                    if (new Date().getTime() - startTime > duration) {
                        this.scheduleOnce(() => {
                            runGenerator();
                        });
                        return;
                    }
                }
            };
            runGenerator();
        });
    }
}
