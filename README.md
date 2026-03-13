# zuoxiqiu.com

个人想法展示网站 - 数字花园 + 实验记录

## 标语

**小小的想法改变世界，世界总需要更多好奇心的人。**

## 技术栈

- **框架**: [Astro](https://astro.build/) - 静态网站生成器
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS
- **部署**: [Vercel](https://vercel.com/) - 静态托管

## 网站架构

```
zuoxiqiu.com
├── 首页（标语 + 最新动态）
├── 想法流（/ideas）
│   ├── 突发奇想（随手记录）
│   └── 标签分类（技术/商业/生活）
├── 实验场（/mvp）
│   ├── 每个MVP的完整记录
│   ├── 状态标记：🧪验证中 / ✅已实现 / ❌已放弃
│   └── 时间线展示
└── 关于我（/about）
```

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建
npm run build
```

## 内容管理

### 添加新想法

在 `src/content/ideas/` 创建 Markdown 文件：

```markdown
---
title: "你的想法标题"
date: 2026-03-13
tags: ["AI", "创业", "工具"]
status: "raw"  # raw | thinking | testing | done | abandoned
---

你的想法内容...
```

### 添加MVP实验

在 `src/content/mvp/` 创建 Markdown 文件：

```markdown
---
title: "MVP项目名称"
date: 2026-03-13
status: "testing"  # testing | done | abandoned
tags: ["产品", "验证"]
---

## 问题
要解决什么问题？

## 方案
怎么解决的？

## 过程
...

## 结果
...

## 复盘
...
```

## 部署

### 部署到 Vercel

1. Push 代码到 GitHub
2. 在 Vercel 导入项目
3. 自动部署

### 绑定自定义域名

1. Vercel Dashboard → Project → Settings → Domains
2. 添加 `zuoxiqiu.com`
3. 配置 DNS 解析

## 维护

| 任务 | 频率 | 负责人 |
|------|------|--------|
| 内容更新 | 随时 | 你 |
| 框架更新 | 每月 | AI |
| 备份 | 自动（Git） | GitHub |

## 许可证

MIT
