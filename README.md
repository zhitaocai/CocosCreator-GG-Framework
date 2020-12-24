# Cocos Creator GG Framework

[![](https://img.shields.io/badge/Release-0.1.0-orange.svg)](CHANGELOG.md)
[![](https://img.shields.io/badge/LICENSE-MIT-green.svg)](LICENSE)
[![](https://img.shields.io/badge/Support-Cocos%20Creator%202.4.3-green.svg)](http://www.cocos.com/creator)

Cocos Creator GG Framework 是一个让游戏快速搭建跑起来的框架，意为 Go Game! 

// TODO：框架介绍贴图

GG 框架使用 TypeScript 语言，基于 **单场景+多Prefab** 的结构。框架入口为 `gg`，只需要在编辑器中输入 `gg.` 即可通过 Visual Studio Code 编辑器的提示，了解框架所有API的用法及其含义，十分方便上手。

现在，Go Game!

## 一、项目开发环境配置

1. 安装 [Cocos Creator 2.4.3](https://www.cocos.com/)
2. 安装 [NodeJS](https://nodejs.org/en/)，安装成功后，安装依赖 npm 包
   ```
   # 安装本项目的所有依赖（项目只依赖 TypeScript + ESLint 相关依赖，用于规范项目，提高代码质量）
   npm i --save-dev
   ```     
3. 推荐使用 VSCode 作为代码编辑器
4. 推荐安装 VSCode 插件 [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 、[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 安装完毕后。打开 VSCode `settings.json`，配置以下代码即可
    ```
    "eslint.alwaysShowStatus": true,
    "eslint.format.enable": true,
    "eslint.validate": [
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact",
    ],
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    ```
      

## 二、项目规范

- 采用[CocosCreator 官方推荐编码规范](http://docs.cocos.com/creator/manual/zh/scripting/reference/coding-standards.html?h=%E8%A7%84%E8%8C%83)
- 项目采用 [TypeScript+ESLint](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md) 作为规范（TSLint 已经停止维护，TypeScript+ESlint 是未来）
  - [ESLint](https://eslint.org/docs/user-guide/configuring)
  - [TypeScript+ESLint](https://github.com/typescript-eslint/typescript-eslint)

## 三、项目详细介绍

项目基础架构为 **单场景 + 多Prefab** 。其中，

* 不同的 Prefab 将通过 AssetBundle 去进行组织以形成模块。形成模块的目的解耦，提高复用性，方便跨项目使用
* 在跨项目使用的时候，我们的数据结构和逻辑基本是可以复用的，只有UI可能会有差异

项目结构概览：

```
assets
┣━━ mainbundle (此为文件夹，无需配置为bundle，打包后会变为内置的 main Bundle，bundle 优先级: 7)
┃    ┣━━ scenes
┃    ┃   ┗━━ MainScene.fire (主场景)
┃    ┗━━ scripts
┃        ┣━━ configs
┃        ┃   ┣━━ BundleConfigs.ts (记录所有 Bundle 配置的脚本)
┃        ┃   ┗━━ PanelConfigs.ts (记录所有面板配置的脚本)
┃        ┗━━ MainSceneCtrl.ts (主场景入口逻辑脚本)
┣━━ commonbundle (通用模块 bundle 优先级: 6)
┃    ┣━━ prefabs
┃    ┃   ┣━━ boot
┃    ┃   ┃   ┗━━ BootPanelPrefab.prefab (游戏启动页面板 Prefab)
┃    ┃   ┗━━ popwindow
┃    ┃       ┣━━ LoadingPanelPrefab.prefab (全局通用 Loading 面板 Prefab)
┃    ┃       ┗━━ ToastPanelPrefab.prefab (全局通用 Toast 面板 Prefab)
┃    ┣━━ scripts
┃    ┃   ┣━━ boot
┃    ┃   ┃   ┗━━ BootPanelPrefab.ts (游戏启动页面板 Prefab 的控制脚本)
┃    ┃   ┗━━ popwindow
┃    ┃       ┣━━ LoadingPanelPrefab.ts (全局通用 Loading 面板 Prefab 的控制脚本)
┃    ┃       ┗━━ ToastPanelPrefab.ts (全局通用 Toast 面板 Prefab 的控制脚本)
┃    ┗━━ textures
┃        ┗━━ xxx (自行组织)
┗━━ gamebundle (游戏模块 bundle 优先级: 5)
     ┣━━ prefabs
     ┃   ┣━━ game
     ┃   ┃   ┗━━ GamePanelPrefab.prefab (游戏主面板 Prefab)
     ┃   ┗━━ gamesetting
     ┃       ┗━━ GameSettingPanelPrefab.prefab (游戏设置面板 Prefab)
     ┣━━ scripts
     ┃   ┣━━ game
     ┃   ┃   ┗━━ GamePanelPrefab.prefab (游戏主面板 Prefab 的控制脚本)
     ┃   ┗━━ gamesetting
     ┃       ┣━━ GameSettingConst.ts (游戏设置模块的常量)
     ┃       ┣━━ GameSettingEvent.ts (游戏设置模块的广播事件)
     ┃       ┣━━ GameSettingModel.ts (游戏设置模块的数据模型)
     ┃       ┣━━ GameSettingModule.ts (游戏设置模块的逻辑控制)
     ┃       ┗━━ GameSettingPanelPrefab.ts (游戏设置面板 Prefab 的控制脚本)
     ┗━━ textures
         ┗━━ xxx (自行组织)
```

说明：

1. 除了 `mainBundle` 文件夹之外，其他 `*bundle` 后缀的文件夹都需要配置为 bundle
2. 此框架项目取消了使用 `resources` 的 bundle ，只保留了 `main`, `internal` 两个内置 bundle （对于内置 bundle 的理解可以阅读 [官方文档](http://docs.cocos.com/creator/manual/zh/asset-manager/bundle.html) ）
3. 注意bundle优先级， `mainbundle > commonbundle > gamebundle > ...bundle`
4. 上述结构中的 `gamebundle/scripts/gamesetting` 是一份总结下来的[模块结构的框架](模块结构说明.md)
5. 项目的阅读只需要从 `MainSceneCtrl.ts` 中阅读即可，过程中了解一下 `gg.` 框架的接口

## 四、答疑

### 4.1 为什么是 **单场景+多Prefab** 的结构呢？

* **方便恢复页面状态**
  * 考虑一个这样子的需求：从页面A切换到页面B，然后从页面B切换回页面A的时候，页面A要恢复到打开页面B之前的状态。比如：切换前页面A的ScrollView是滚动到70%的位置，切换回来后，也需要恢复到 70% 的位置
  * 那么，
    * 如果页面A、B是场景的结构，那么要实现这样子的需求，则需要写额外的状态存储及恢复状态逻辑，因为从场景A切换到场景B的时候，场景A是被销毁了，再次打开时需要重新恢复
    * 而如果页面A、B是Prefab的结构，那么是不需要写这样子的逻辑，只需要 active = true/false 切换即可
* **方便快速从编辑器中切换不同Prefab**
  * 不知道你发现没有，在编辑器中，打开了PrefabA，然后切换到 PrefabB 的时候，流程是这样子的：**关闭 Prefab A -> 打开当前的场景 -> 打开 PrefabB** 。这样子的话，如果我们是单场景，并且该场景超级简单，那么从 PrefabA 切换到 PrefabB 的时候就会超级快
* **方便实现切换动画**
  * 场景之前的切换是硬切的，没有什么动画效果，当前可以通过全局节点去做云合并类似的动画效果
  * Prefab的话，就比较方便做切换动画，在我们这个框架中就是通过 ``gg.panelRouter.show/hide`` 去切换Prefab页面，同时很方便做切换动画
* **方便多人协作**
  * 多人协作时，如果多人同时修改场景的话，后续合并会变得十分困难
  * 用Prefab的话，会更好吗？其实也不会，如果多人同时修改同一个Prefab的话，那么后续合并也会变得十分困难。那为什么还是Prefab呢？因为Prefab可以做颗粒度更细的UI，一个很大的页面可以分成很多个小Prefab去弄

### 4.2 为什么启动页不放在 MainScene.scene 中， 而是要单独弄一个 BootPanelPrefab.prefab 呢？

这个是为了优化小游戏首包体积，这样子设计，**小游戏首包体积几乎是只有一个场景（无任何资源引用）+框架脚本，保证一个极小体积的首包**。当然不是非得这样子弄，只是这样子弄的意图是这个意思。

// TODO 补充更详细说明

## 支持一下作者吧

如果此项目对你学习有帮助，不妨支持一下我吧~

ps：支持扫码催更哦🤣🤣🤣👇👇👇👇

![](static/Pay.png)

## LICENSE

    MIT License

    Copyright (c) 2020 Zhitao Cai

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.



