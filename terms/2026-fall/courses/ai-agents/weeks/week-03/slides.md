<!-- layout: cover -->
# W3：从一句需求到一个项目
> 本地 Agent 怎样进入我们的工作流？

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- section: 第一课时：读懂工作台与项目合同 -->

---
<!-- layout: question -->
# Agent 能写完整个项目，我们还需要做什么？
> 给出边界，检查证据，并决定是否保留

---
<!-- layout: columns -->
# VS Code：五个固定工作位置

<!-- column -->
## 看见项目
**文件资源管理器 · 编辑器**

看结构，读任务、测试与代码

<!-- column -->
## 运行项目
**集成终端**

确认目录，运行真实命令

<!-- column -->
## 作出决定
**差异视图 · Cline 面板**

看实际改动，决定是否授权

---
<!-- layout: columns -->
# 同一个窗口，背后是四层

```text
IDE → Agent 插件 → API 服务商 → 模型
```

<!-- column -->
## 本周主线
**VS Code + Cline**

一套全班共同工作流

<!-- column -->
## GUI 形态
**Codex**

选学：独立图形界面

<!-- column -->
## TUI 形态
**Claude Code**

选学：终端中的 Agent

<!-- footer -->
工作位置、行动代理、连接入口与生成模型，不是同一件事。

---
<!-- layout: columns -->
# 能调用，不等于可以授权

<!-- column -->
## 权限
**每次先问清动作**

- 读哪些文件？
- 改哪些文件？
- 运行什么命令？
- 为什么需要联网？

<!-- column -->
## 密钥
**只进服务商设置**

不进对话、终端命令、项目文件、截图或 Git 提交。

<!-- footer -->
越出工作区、修改教师起点、读取凭证或执行不可逆命令：停下。

---
<!-- layout: columns -->
# 一座仓库，三种责任

<!-- column -->
## 教师给合同
**`course/week-03/`**

```text
PROJECT_BRIEF.txt
data/
tests/
report-template.md
init-student.sh
```

<!-- column -->
## 学生养系统
**`students/sXX/`**

```text
system/                # 唯一代码
weeks/
└── week-03/report.md  # 本周记录
```

<!-- footer -->
`common/` 由教师维护；Agent 只修改本人 `system/`。

---
# 测试：保存下来、反复执行的小实验

```text
项目声明与锁文件
样例数据
另一组正常数据
缺少必要字段
文件不存在
```

同一条命令，重复检查同一份合同：

```bash
cd students/s07/system
uv run --locked pytest -q ../../../course/week-03/tests
```

---
<!-- section: 第二课时：让 Agent 受控生成项目 -->

---
<!-- layout: question -->
# 先把“我的位置”钉死
> 从仓库根初始化一次，再从仓库根打开 VS Code

```bash
bash course/week-03/init-student.sh s07
code .
```

```text
system=students/s07/system
report=students/s07/weeks/week-03/report.md
```

`s07` 只是示例，必须换成教师分配的本人 `sNN`。

---
<!-- layout: prompt -->
# 第一步：只读自解释

只读取当前工作区，不修改文件，也不运行命令。我的公开代号是 `s07`。

请区分 `course`、`common` 与 `students`，确认你只能修改 `students/s07/system`；再根据 `course/week-03` 中的 brief 和公开测试复述目标、成功输出、两类失败、保护范围与验收命令。等待我确认。

---
<!-- layout: prompt -->
# 第二步：确认后再生成

你的复述准确，可以开始。

请严格按 `course/week-03/PROJECT_BRIEF.txt`，只在 `students/s07/system` 中补成最小 uv Python 项目。不要修改教师区、公共区、本人周报告或其他学生目录；不要联网实现功能，不要读取凭证，不要增加未来功能，也不要执行 `git add/commit/push`。

从本人 `system/` 运行教师指定的公开测试与正反例。完成后停下，报告实际改动、真实结果和仍不能证明的事情；若必须越界，先停止并询问我。

---
<!-- layout: question -->
# Agent 说“完成了”，第二课时就结束
> 保存现场；不追绿，不提交，不提前作出 ACCEPT

```text
git status --short
Agent 是否只改了我的 system：
实际新增了什么：
状态：READY-REVIEW / BLOCKED-AGENT
```

---
<!-- section: 第三课时：用证据决定是否保留 -->

---
<!-- layout: columns -->
# 三类证据，缺一不可

<!-- column -->
## 公开测试
**合同的重复检查**

```text
5 passed
```

`../../../course/week-03/tests`

<!-- column -->
## 正常输入
**程序报告事实**

```text
rows=4
DATA_CHECK=PASS
```

<!-- column -->
## 失败输入
**程序明确拒绝**

```text
DATA_CHECK=FAIL
FAILURE_EXIT=1
```

---
<!-- layout: columns -->
# 看完所有改动，再解释一个测试

<!-- column -->
## 实际改了什么
**新文件不会自动出现在 `git diff`**

先看 `git status`，再在 SCM 逐个打开新文件；或：

```bash
git add --intent-to-add .
git diff HEAD --name-status
git diff HEAD
git diff HEAD -- README.md course common \
  .gitignore students/README.md
```

<!-- column -->
## 证据说明什么
**也要说它不能证明什么**

```text
输入或起点
预期结果
实际结果
判断边界
```

---
<!-- layout: columns -->
# 展示之后，先作出自己的决定

<!-- column -->
## ACCEPT
**范围与证据都足够**

只提交 `students/sXX/**`，push `origin/main`

<!-- column -->
## HOLD
**仍有越界或证据缺口**

保留现场，不用绿色结果掩盖问题

<!-- footer -->
展示：任务边界 → 关键 diff → 一个测试 → 正常／失败运行 → 我的决定

---
<!-- layout: question -->
# 什么时候才能看参考实现？
> 展示与判断结束以后；答案不能替代自己的证据

```text
ACCEPT → 在同一份 system 上继续进入 W4
HOLD / BLOCKED-AGENT → 保留首次尝试，使用教师恢复基线
```

教师版本只是满足合同的一种实现；周次只追加记录，不复制源码。
