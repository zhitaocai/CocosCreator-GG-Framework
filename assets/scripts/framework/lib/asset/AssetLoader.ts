/**
 * 提供 Promise 写法的 cc.assetManager 加载器，但是这种写法会缺失加载进度
 *
 * @author caizhitao
 * @created 2020-11-28 12:29:04
 */
export default class AssetLoader {
    static loadBundle(bundleName: string): Promise<cc.AssetManager.Bundle> {
        return new Promise<cc.AssetManager.Bundle>((resolve, reject) => {
            cc.assetManager.loadBundle(bundleName, (error: Error, bundle: cc.AssetManager.Bundle) => {
                error ? reject(error) : resolve(bundle);
            });
        });
    }
}
