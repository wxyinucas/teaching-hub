<!-- layout: cover -->
# W3：受控修改
> Agent 改完项目，我们凭什么保留这次修改？

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- section: 第一课时：建立起点，看懂受控修改 -->

---
<!-- layout: question -->
# Agent 说“完成了”，现在能提交吗？
> 先看实际修改与证据，再决定是否保留

---
<!-- layout: columns -->
# 教师项目、本地项目与个人 fork

<!-- column -->
## upstream
**课程来源**

教师维护的项目

<!-- column -->
## local
**工作现场**

Agent 在这里修改

<!-- column -->
## origin
**个人版本**

本人检查后 push

---
<!-- layout: question -->
# Agent 能响应，就已经可以修改了吗？
> 先确认目录、任务范围与停止条件

---
# 一次修改的责任链

```text
任务与范围 → Agent 计划 → 实际 diff → 给定测试 → 人的决定 → Git 版本
```

---
<!-- layout: question -->
# 测试绿了，为什么仍然可能拒绝？
> 它也许修改了范围之外的文件

---
# 第一课时收口

```text
本次唯一目标：
允许 Agent 修改：
我会运行的测试：
我只有在什么条件下才接受：
```

---
<!-- section: 第二课时：做成一次责任闭环 -->

---
<!-- layout: prompt -->
# 给 Agent 的第一条任务

请先阅读 W3 任务卡和当前项目，复述目标、允许修改的文件和验收命令。等我确认后完成这个小修改，只改允许范围。

完成后不要提交，先告诉我改了什么，展示 diff，并运行任务卡指定的测试。需要越界就停下问我。

---
# Agent 停下以后，人接管检查

```bash
git status --short
git diff --name-only
git diff
uv run pytest
```

先看全部变动，再判断测试支持了什么。

---
<!-- layout: columns -->
# 第二课时结束前，作出真实决定

<!-- column -->
## ACCEPT
**证据足够**

检查后 commit / push

<!-- column -->
## HOLD
**暂不接受**

范围或证据仍需核对

<!-- column -->
## BLOCKED
**链条中断**

保存错误与下一步

---
<!-- section: 第三课时：说清一次接受决定 -->

---
# 第一次平台形状观察

```text
execution_mode=fixture
```

fixture 可以检查格式与处理链，但不代表真实平台连接。

---
# 展示只回答五件事

1. 我交给 Agent 的任务；
2. Agent 实际修改了什么；
3. 我接受、拒绝或修正了什么；
4. 哪些证据支持我的决定；
5. 这些证据仍不能证明什么。

---
# W3 门槛 0

- 从 W2 的可复现基线开始；
- 完成一次受控 Agent 修改；
- 检查关键 diff，解释至少一个测试；
- commit 并 push 自己接受的版本；
- 生成明确标注 fixture 的观察摘要。

> Agent 的“完成”不是交付终点；人的决定才是。
