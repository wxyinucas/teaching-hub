<!-- lesson: 第一课时 -->
<!-- layout: cover -->
# 操作前的介绍与讨论
> 接通 Agent，用证据理解一次委托

AI Agents · W3 · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- section: 第一课时：接通 Agent，观察执行过程 -->

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

---
# API 类型与对话历史

| API 格式 | 多轮上下文 |
| --- | --- |
| Chat Completions | 客户端传入历史 |
| OpenAI Responses | 可用响应编号接续 |
| Anthropic Messages | 客户端传入历史 |

<!-- footer -->
API 规定通信方式，模型依据本次上下文回答。

---
<!-- layout: agenda -->
# 一条请求怎样变成操作？

1. 输入：任务与上下文
2. 模型：提出下一步
3. 工具：执行并返回结果
4. 反馈：继续判断与行动

---
<!-- layout: columns -->
# Agent 从哪里获得上下文？

<!-- column -->
## 输入来源

对话历史

项目文件

工具返回的结果

<!-- column -->
## 上下文维护

读取与补充

选择与压缩

重要信息留在文件

<!-- footer -->
会议记录：带入已有记录，再开始下一轮讨论。

---
<!-- layout: columns -->
# 认识 VS Code 的 Agents Window

<!-- column -->
## Chat：当前工作区

边编辑，边对话

文件、终端与差异

<!-- column -->
## Agents Window：任务与会话

项目、会话与进度

查看任务结果

<!-- footer -->
模型与权限分别核对；原 Chat 配置不代表独立窗口已可用。

---
<!-- lesson: 第二课时 -->
<!-- section: 第二课时：确定验收依据，再委托实现 -->

---
# 从规格得到测试的答案

![蒲丰投针示意图：L 为针长，d 为线间距，angle 为针与平行线的夹角，distance 为针中心到最近线的距离](assets/2026-fall/ai-agents/week-03/buffon-needle.png)

<!-- footer -->
$L$：针长　$d$：线间距　`angle`：夹角　`distance`：中心到最近线的距离

---
# 投针比例与圆周率

独立、均匀取样，投针 $N$ 次，相交 $K$ 次。

$$
\frac{K}{N}\approx p=\frac{2L}{\pi d}
\qquad\Longrightarrow\qquad
\widehat{\pi}=\frac{2LN}{dK}
$$

<!-- footer -->
短针条件：$0<L\leq d$。本次 $K=0$ 时，无法用此式估计。[公式来源](https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/resources/buffons-needle-monte-carlo-simulation/)

---
# 触线的已知答案

针长 $L=0.5$，夹角 $\theta=\pi/2$：伸出距离为 $0.25$。

| 中心到线的距离 | 位置 | 预期结果 |
| --- | --- | --- |
| `0.4` | 够不到线 | `False` |
| `0.1` | 越过线 | `True` |
| `0.25` | 恰好触线 | `True` |

<!-- footer -->
规格先规定：触线也算相交。

---
# 估计值的已知答案

$N=100,\quad K=32,\quad L=0.5,\quad d=1$

$$
\widehat{\pi}=\frac{2LN}{dK}
=\frac{2\times 0.5\times 100}{1\times 32}
=3.125
$$

<!-- footer -->
验收这次计算是否符合公式，不用“更接近 π”替代规则。

---
<!-- layout: columns -->
# 让同一份测试拒绝一个错误

<!-- column -->
## 故障判据

```python
return (
    distance < length / 2
    * math.sin(angle)
)
```

触线：实际 `False`

<!-- column -->
## 修复判据

```python
return (
    distance <= length / 2
    * math.sin(angle)
)
```

触线：实际 `True`

<!-- footer -->
同一规格，同一预期，同一测试；只修实现。

---
# 带着问题看代码

| 要判断的问题 | 定位入口 |
| --- | --- |
| 触线怎么算？ | `crosses_line` |
| 估计值怎么算？ | `estimate_pi` |
| seed 放在哪里？ | `simulate` |

<!-- footer -->
看相关输入、规则与输出；不逐行翻译整份项目。

---
<!-- layout: columns -->
# 把证据写进报告

<!-- column -->
## 程序检查

已知输入与期望值

实际运行公开测试

<!-- column -->
## 产物核验

CSV、图表与 PDF

参数与数字一致

<!-- footer -->
测试有覆盖范围；测试全绿，仍需打开报告。

---
<!-- lesson: 第三课时 -->
<!-- section: 第三课时：借助 Agent 认识工具与代码 -->

---
<!-- layout: columns -->
# 让 Agent 介绍自己，展示一项能力

<!-- column -->
## 能直接执行

查看工具记录

对照实际结果

<!-- column -->
## 能指导操作

自己找到入口

按步骤确认

<!-- column -->
## 尚不能确认

明确权限与限制

继续核验

<!-- footer -->
能力自述，需要实际动作与结果作证。

---
<!-- layout: tree -->
# 让 Agent 导读一次调用

```text
simulate
├─ 取样与累计
│  └─ crosses_line
└─ 估计与返回
   └─ estimate_pi
```

<!-- footer -->
沿一次调用，定位输入、判断和返回值。

---
# 从命令追到 PDF

| 执行对象 | 作用 |
| --- | --- |
| `experiment.py` | 写出 CSV |
| `render_results.py` | 生成图表与参数 |
| `report.tex` | 引用这些结果 |
| 编译器 | 生成 PDF |

<!-- footer -->
`rebuild.sh` 串联重建；公开测试单独运行。

---
# 保存成果与本次课回顾

- 操作：真实工具记录
- 验收：独立预期与反例
- 导读：代码位置与依据

<!-- footer -->
Agent 帮助执行与解释，人决定接受哪些结果。
