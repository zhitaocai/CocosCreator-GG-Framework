/**
 * 提供 Promise 写法的 Bundler 加载器，但是这种写法会缺失加载进度
 *
 * @author caizhitao
 * @created 2020-11-28 10:27:10
 */
export default class BundleLoader {
    static load<T extends cc.Asset>(bundle: cc.AssetManager.Bundle, path: string, type?: typeof cc.Asset): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            bundle.load(path, type, (error: Error, asset: T) => {
                error ? reject(error) : resolve(asset);
            });
        });
    }

    static loadDir<T extends cc.Asset>(bundle: cc.AssetManager.Bundle, dirPath: string, type?: typeof cc.Asset): Promise<Array<T>> {
        return new Promise<Array<T>>((resolve, reject) => {
            bundle.loadDir(dirPath, type, (error: Error, asset: Array<T>) => {
                error ? reject(error) : resolve(asset);
            });
        });
    }

    static loadScene(bundle: cc.AssetManager.Bundle, sceneName: string, options?: Record<string, any>) {
        return new Promise<cc.SceneAsset>((resolve, reject) => {
            bundle.loadScene(sceneName, options, (error: Error, asset: cc.SceneAsset) => {
                error ? reject(error) : resolve(asset);
            });
        });
    }
}
