---
title: "Docker OpenClaw + 飞书部署指南"
date: 2026-03-18
tags: ["OpenClaw", "Docker", "飞书", "部署"]
status: "done"
---

## 背景

记录 Docker 部署 OpenClaw 飞书机器人的完整流程。

## 环境准备

### 服务器配置
- 阿里云 ECS 或类似云服务器
- Ubuntu 20.04+
- Docker & Docker Compose 已安装

### 所需凭证
部署前需要准备以下凭证（请替换为实际值）：

```bash
# 飞书应用凭证
FEISHU_APP_ID=<FEISHU_APP_ID>
FEISHU_APP_SECRET=<FEISHU_APP_SECRET>

# OpenRouter API Key
OPENROUTER_API_KEY=<OPENROUTER_API_KEY>

# 服务器 SSH 配置
SSH_PORT=<SSH_PORT>
SSH_PASSWORD=<SSH_PASSWORD>
```

## 部署步骤

### 1. 服务器初始化

```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
apt install docker-compose -y
```

### 2. 配置 OpenClaw

创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  openclaw:
    image: openclaw/openclaw:latest
    container_name: openclaw
    restart: always
    ports:
      - "3000:3000"
    environment:
      - FEISHU_APP_ID=${FEISHU_APP_ID}
      - FEISHU_APP_SECRET=${FEISHU_APP_SECRET}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
    volumes:
      - ./data:/app/data
```

### 3. 启动服务

```bash
# 加载环境变量
export FEISHU_APP_ID=<你的AppID>
export FEISHU_APP_SECRET=<你的AppSecret>
export OPENROUTER_API_KEY=<你的APIKey>

# 启动
docker-compose up -d

# 查看日志
docker logs -f openclaw
```

### 4. 飞书机器人配置

1. 登录飞书开发者后台
2. 创建企业自建应用
3. 获取 App ID 和 App Secret
4. 配置机器人回调地址：`http://<服务器IP>:3000/webhook`
5. 发布应用

## 安全加固

### SSH 配置

```bash
# 修改默认端口
vim /etc/ssh/sshd_config
# Port 2223

# 禁用 root 密码登录
PermitRootLogin prohibit-password
PasswordAuthentication no

# 重启 SSH
systemctl restart sshd
```

### 防火墙配置

```bash
# 开放必要端口
ufw allow 2223/tcp
ufw allow 3000/tcp
ufw enable
```

## 常见问题

### Q: 容器启动失败？
检查环境变量是否正确设置

### Q: 飞书收不到消息？
检查回调地址是否可公网访问

### Q: 如何更新版本？
```bash
docker-compose pull
docker-compose up -d
```

## 参考

- [OpenClaw 官方文档](https://github.com/openclaw/openclaw)
- [飞书机器人开发文档](https://open.feishu.cn/)
