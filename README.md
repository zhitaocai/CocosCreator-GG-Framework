# Cocos Creator GG Framework

[![](https://img.shields.io/badge/Release-0.1.0-orange.svg)](CHANGELOG.md)

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

// TODO