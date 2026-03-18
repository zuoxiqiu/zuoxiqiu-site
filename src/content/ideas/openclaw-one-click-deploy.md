---
title: "OpenClaw 一键部署方案对比"
date: 2026-03-18
tags: ["OpenClaw", "Docker", "部署"]
status: "done"
---

## 背景

需要为团队快速部署 OpenClaw 飞书机器人，调研了两个方案。

## 方案一：Tauri 图形安装器 (推荐)

基于 `openclawapp` 项目定制。

### 架构
- Tauri + React 前端
- 内置 OpenClaw Core
- 单文件可执行程序

### 流程
1. 下载 `openclawapp.exe` (~100MB)
2. 双击运行，图形界面配置
3. 输入 API Key 和飞书凭证
4. 自动启动并注册系统服务

### 优点
- ✅ 成功率 90%+
- ✅ 体积小 (100MB)
- ✅ 用户体验好，傻瓜式操作
- ✅ 跨平台 (Windows/macOS/Linux)
- ✅ 维护成本低

### 缺点
- 需要预配置飞书 AppID/AppSecret

---

## 方案二：Docker 一键安装包

基于既有 Docker 部署经验打包。

### 架构
- Docker Desktop + 预构建镜像
- Batch 脚本 + Python 配置向导
- U 盘分发

### 流程
1. 插入 U 盘，运行 `一键安装.bat`
2. 自动检测/安装 Docker Desktop
3. 导入预构建镜像 (1.5GB)
4. 运行配置向导输入凭证
5. `docker-compose up -d` 启动

### 优点
- 容器化，环境隔离
- 一次构建，到处运行

### 缺点
- ❌ 成功率仅 30-40%
- ❌ 体积巨大 (2GB+)
- ❌ 依赖 Docker Desktop，安装复杂
- ❌ Windows 家庭版/WSL2 兼容性问题
- ❌ 资源占用高 (8GB 内存)
- ❌ 维护成本极高

---

## GLM-5 锐评

> 方案二是典型的技术自嗨：用大炮打蚊子，还打歪了。
> 
> 投入产出比为负。不要做。用方案一。Period.

### 关键问题
1. **时间严重低估**：预估 2 小时，实际 8-12 小时
2. **成功率高估 2-3 倍**：实际成功率 20-30%
3. **用户体验极差**：十步操作 vs 一键安装
4. **重复造轮子**：已有成功率 90% 的方案

---

## 结论

**采用方案一 (Tauri 图形安装器)**

理由：
- 成功率更高 (90% vs 30%)
- 用户体验更好
- 维护成本更低
- 已有成熟方案可用

---

## 参考

- [openclawapp](https://github.com/openclawapp/openclawapp) - Tauri 安装器
- [OpenClaw Docker 部署](https://github.com/openclaw/openclaw) - 官方文档
