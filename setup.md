---
layout: default
title: 设置
description: 安装与基础设置
projectArk: True
---

# 基础设置

- [基础设置](#基础设置)
  - [环境要求](#环境要求)
  - [安装与启动](#启动)
  - [更新](#更新)
  - [选择配置](#选择配置)
  - [快捷键](#快捷键)
  - [其他](#其他)

## 环境要求

- 系统缩放：100%，[设置方法](https://jingyan.baidu.com/article/c85b7a642cd5f6413bac95b7.html)
- 杀毒软件：卸载非 windows 的**任何杀软、管家**
- 防火墙：添加信任或白名单

## 启动
- 新建文件夹，在其中运行 ProjectArk 程序
- 登录界面：
  - 定制版: 安全性更强，但若需要兼容弯刀挂机则**不可勾选**
  - 护盾1: 建议开启此护盾避免其他游戏误检测，需要关闭 Secure Boot。私服不需要，若勾选后程序无法启动或系统蓝屏则勿开启
  - 护盾2: 增强防检测，需要关闭 Secure Boot。私服不需要，若勾选后程序无法启动或系统蓝屏则勿开启
  - 注：定制版本身已足够安全，护盾仅为锦上添花
  
  ![23]({{site.cdn}}/resource/ark_login.png)

- 主界面：

  ![12]({{site.cdn}}/resource/main.png)

- 时长：

  ![12]({{site.cdn}}/resource/rpg_time.png)

## 更新
- [官网]({{site.cdn}}/release)下载更新
- 提示有新版后，右键任务栏托盘小图标-检测更新

  ![12]({{site.cdn}}/resource/update_info.png)

  ![12]({{site.cdn}}/resource/update.png)

## 选择配置参数
- 右键图标-参数选择-切换参数，点击进入配置目录新建配置文件即可添加新配置（如 "default.json"）

  ![12]({{site.cdn}}/resource/set.png)

## 快捷键
- 左键小图标：隐藏/显示 ProjectArk
- ctrl-s: 保存参数设置
- ctrl-w: 关闭 ProjectArk
- 自定义快捷键：修改配置文件中相关内容

      ...
      "ShortCut": {
          "save": "S",
          "exit": "W"
      }
      ...

## 其他
- 手动修改配置文件时需注意使用英文双引号，不可用单引号或中文双引号
