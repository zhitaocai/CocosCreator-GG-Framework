# Cocos Creator GG Framework

[![](https://img.shields.io/badge/Release-0.1.0-orange.svg)](CHANGELOG.md)
[![](https://img.shields.io/badge/LICENSE-MIT-green.svg)](LICENSE)
[![](https://img.shields.io/badge/Support-Cocos%20Creator%202.4.3-green.svg)](http://www.cocos.com/creator)

Cocos Creator GG Framework 是一个让游戏快速搭建跑起来的框架，意为 Go Game! 

// TODO：框架介绍贴图

GG 框架基于 TypeScript 语言，框架入口为 `gg`，只需要在编辑器中输入 `gg.` 即可通过 Visual Studio Code 编辑器的提示，了解框架所有API的用法及其含义，十分方便上手。

现在，Go Game!

## 一、项目规范

- 采用[CocosCreator 官方推荐编码规范](http://docs.cocos.com/creator/manual/zh/scripting/reference/coding-standards.html?h=%E8%A7%84%E8%8C%83)
- 采用[VsCode 上的 Prettier 插件进行格式化控制](https://juejin.im/post/5a791d566fb9a0634853400e)
    1. 项目采用了 VsCode 上的 **Prettier** 插件进行代码格式化控制
    2. `.prettierrc` 文件为 Prettier 插件的配置文件，在 VsCode 运行时，会读取这个格式化控制配置文件
    3. 更多关于 Prettier 插件的使用，可以查阅下面两篇文章：
        - [VsCode + Prettier 使用教程](https://juejin.im/post/5a791d566fb9a0634853400e)
        - [Prettier 配置文件说明](https://prettier.io/docs/en/configuration.html)

## 二、项目开发环境配置

1. 安装 [Cocos Creator 2.4.3](https://www.cocos.com/)
2. 安装 [NodeJS](https://nodejs.org/en/)，安装成功后，建议全局下载以下 npm 包（可跳过）：
   ```
   npm install typescript -g
   npm install tslint -g
   ```     
3. 推荐使用 VSCode + TypeScript    

## 三、项目详细介绍

项目基础架构为 **单场景 + 多Prefab** 。其中，

* 不同的 Prefab 将通过 AssetBundle 去进行组织以形成模块。形成模块的目的解耦，提高复用性，方便跨项目使用
* 在跨项目使用的时候，我们的数据结构和逻辑基本是可以服用的，只有UI可能会有差异

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
4. 模块结构可以参考 `gamebundle/scripts/setting`
5. 项目的阅读只需要从 `MainSceneCtrl.ts` 中阅读即可，过程中了解一下 `gg.` 框架的接口

## 四、项目模块结构说明

为了 **易于团队协助** 、**方便业务扩展**、**复用业务逻辑**，项目采用模块结构思想。如一般可以分为以下模块：

* 登录模块
* 大厅模块
* 游戏战斗模块
* 每日签到模块
* 邮件系统模块
* 聊天系统模块
* ...

为了方便同一时刻团队能同时开发多个UI界面等，项目采用 **单场景 + 多Prefab** 结构，场景主要用于挂载不同模块的UI界面，每个模块的UI界面由相应模块的 Prefab 组成。

### 4.1 模块组成

* **模块常量类**：负责定义由该模块产生的各种常量
* **模块事件类**：负责定义由该模块产生的各种事件消息
* **模块数据类**：负责保存和读取数据，基本上没有任何其它逻辑
* **模块逻辑类**：负责游戏逻辑，包括网络通信、数据处理等，并负责更新数据类中的数据
* **模块面板类**：负责界面UI显示，关联UI的Prefab。可以读取数据类中的数据，以刷新UI界面；可调用模块类中的方法，做出各种处理

### 4.2 模块命名规则

- 模块文件夹名：`XXX`
  - 模块常量类名：`XXXConst.ts`
  - 模块事件类名：`XXXEvent.ts`
  - 模块数据类名：`XXXModel.ts`
  - 模块逻辑类名：`XXXModule.ts`
  - 模块面板类名：`XXXPanelPrefab.ts`

### 4.3 模块约束

在每一个模块中：

- **模块逻辑类** 和 **模块数据类** 有且只有 **一个**
- **模块逻辑类** 是全局可以访问
- **模块面板类** 可以有 **多个**
- **模块面板类** 可以直接通过面板路由器进行展示、隐藏、销毁(gg.panelRouter.show/hide/destroy)
- **模块面板类** 可以直接引用/使用所有模块的 **模块逻辑类**
- **模块面板类** 自身不应该被任意的 **模块逻辑类** 和 **模块数据类** 引用（如：不能直接通过 **模块逻辑类** 直接操作某个模块的面板类），以便于移植 **“除面板以外的模块和数据”** 到其它项目使用。如: 同一公司的登录、聊天、背包等大部分是可以复用的
- **模块面板类** 的UI更新可以通过在 Component 的 `onEnable` 和 `onDisable` 去注册/注销 **模块事件类所定义的事件**。当数据更新、逻辑变化时，广播事件以驱动UI更新

### 4.4 新增一个模块的步骤流程

1. 在合适的 bundle 中新建模块名字命名的目录，如 `XXX`
2. 在 `XXX` 目录下创建以下文件
   * `XXXConst.ts`（可选，如果有模块自己本身产生的常量，有则需要）
   * `XXXEvent.ts`（可选，如果有模块自己本身产生的事件，则需要）
   * `XXXModel.ts`（必须）
   * `XXXModule.ts`（必须）
   * `XXXPanelPrefab.ts`（可选，如果有面板显示，则需要）


## Q & A

### 为什么是 **单场景+多Prefab** 的结构呢？

* 方便恢复页面状态
  * 考虑一个这样子的需求：从页面A切换到页面B，然后从页面B切换回页面A的时候，页面A要恢复到打开页面B之前的状态。比如：切换前页面A的ScrollView是滚动到70%的位置，切换回来后，也需要恢复到 70% 的位置
  * 那么，
    * 如果页面A、B是场景的结构，那么要实现这样子的需求，则需要写额外的状态存储及恢复状态逻辑，因为从场景A切换到场景B的时候，场景A是被销毁了，再次打开时需要重新恢复
    * 而如果页面A、B是Prefab的结构，那么是不需要写这样子的逻辑，只需要 active = true/false 切换即可
* 方便快速从编辑器中切换不同Prefab
  * 不知道你发现没有，在编辑器中，打开了PrefabA，然后切换到 PrefabB 的时候，流程是这样子的：**关闭 Prefab A -> 打开当前的场景 -> 打开 PrefabB** 。这样子的话，如果我们是单场景，并且该场景超级简单，那么从 PrefabA 切换到 PrefabB 的时候就会超级快

### 为什么启动页不放在 MainScene.scene 中， 而是要单独弄一个 BootPanelPrefab.prefab 呢？

这个是为了优化小游戏首包体积，这样子设计，**小游戏首包体积几乎是只有一个场景（无任何资源引用）+框架脚本，保证一个极小体积的首包**。当然不是非得这样子弄，只是这样子弄的意图是这个意思。

// TODO 补充更详细说明

## 支持一下作者吧

如果此项目对你学习和理解Shader有帮助，不妨支持一下我吧~

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



