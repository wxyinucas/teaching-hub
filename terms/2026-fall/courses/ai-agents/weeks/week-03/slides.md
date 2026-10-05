<!-- layout: cover -->
# 操作前的介绍与讨论
> 本地工作台，接入 Agent

AI Agents · W3 · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- layout: columns -->
# 共享与协作

<!-- column -->
## 使用他人的成果
**源码 · 文档**

阅读与运行

修改与复用

<!-- column -->
## 留下可继续的成果
**问题 · 改动**

复现错误

补充说明与实现

<!-- footer -->
GitHub：既能取得成果，也能参与协作。

---
<!-- layout: columns -->
# 开源与付费

<!-- column -->
## 软件的开放方式
**许可证**

使用与修改

分享与协作

<!-- column -->
## 软件与服务的费用
**资源与支持**

算力与托管

维护与服务

<!-- footer -->
开放代码与付费服务可以同时存在。[OSI](https://opensource.org/faq)

---
<!-- layout: columns -->
# IDE：把工具放在同一处

<!-- column -->
## 编辑器
**修改文本**

写代码

改配置与文档

<!-- column -->
## 集成开发环境
**整合工作工具**

编辑、运行与调试

文件与版本管理

<!-- footer -->
在同一工作台里，接入 Agent。

---
<!-- layout: columns -->
# 比较常见 Agent 和 LLM

<!-- column -->
## LLM
**生成回答与建议**

理解输入

提出下一步

<!-- column -->
## Agent
**组织工具与执行**

读取、修改、运行

根据结果继续推进

<!-- footer -->
模型建议下一步，Agent 调用工具并带回结果。

---
# 常见 Agent 与运行框架

| 工具／框架 | 常见入口 |
| --- | --- |
| [VS Code Agent](https://code.visualstudio.com/docs/agent-customization/language-models) / [Cline](https://github.com/cline/cline) | IDE 原生侧栏／扩展 |
| [OpenCode](https://opencode.ai/docs/) / [Claude Code](https://code.claude.com/docs/en/overview) | 终端等 |
| [Codex](https://developers.openai.com/codex/) | App、终端、IDE 等 |

<!-- footer -->
[DSH](https://github.com/deepseek-ai/deepseek-harness)：Agent harness，本地网页入口。

---
# 常见模型系列

| 模型系列 | 提供方 |
| --- | --- |
| [DeepSeek](https://github.com/deepseek-ai/DeepSeek-V3) | DeepSeek |
| [Kimi](https://platform.kimi.ai/docs/overview) | Moonshot AI（月之暗面） |
| [GPT](https://developers.openai.com/api/docs/models) | OpenAI |
| [Claude](https://platform.claude.com/docs/en/models/overview) | Anthropic |

---
<!-- layout: columns -->
# Agent 的不同入口

<!-- column -->
## IDE 集成式
**围绕编辑工作区**

文件、终端与差异

原生侧栏或扩展

<!-- column -->
## 终端式
**围绕目录与命令**

文字交互

也能放进 IDE

<!-- column -->
## App／网页
**独立任务界面**

Codex App

DSH 本地网页

<!-- footer -->
入口不同，都要确认工作区、模型与权限。

---
<!-- layout: question -->
# 下面开始操作
> VS Code 原生 Agent + DeepSeek API
