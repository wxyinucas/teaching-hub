<!-- layout: cover -->
# W2：位置、环境与版本
> 在同一个 VS Code 工作台中，看清项目正在发生什么

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- section: 第一课时：命令作用在哪里？ -->

---
<!-- layout: columns -->
# 同一份文件，两种操作入口

<!-- column -->
## 图形界面
**看见状态 · 直接操作**

Explorer 展示结构

Editor 修改文件

<!-- column -->
## 命令行
**描述动作 · 重复组合**

Terminal 接收文字

Bash 解释命令

<!-- footer -->
两种入口改变的是同一份文件系统状态。

---
<!-- layout: columns -->
# 相对路径从当前位置开始解释

<!-- column -->
## 当前起点
**pwd**

`~/course`

<!-- column -->
## 本次操作
**ls cli-lab**

查看 `~/course/cli-lab`

<!-- footer -->
当前位置补全相对路径的起点；命令描述动作，路径指向对象。

---
<!-- layout: columns -->
# 简单命令与多级命令

<!-- column -->
## ls -la cli-lab
**直接调用一个程序**

`ls`　command

`-l -a`　flags

`cli-lab`　positional argument

<!-- column -->
## git clone URL [TARGET]
**先选择工具中的动作**

`git`　command

`clone`　subcommand

`URL [TARGET]`　positional arguments

<!-- footer -->
`[]` 表示可选；flag 不需要额外值，`-L 2` 则是 option 与它的 value。

---
<!-- layout: question -->
# 你现在在哪里，准备删除什么？
> 先看 `pwd` 和目标路径；本节只删除刚创建并已经核对的实验对象。

---
<!-- layout: columns -->
# Clone 的来源与本地目标

<!-- column -->
## 远端来源
**GitHub 仓库**

`wxyinucas/ai-agents`

<!-- column -->
## 本地目标
**课程工作台**

`~/course/w02-workbench`

<!-- footer -->
`git clone <URL> [<TARGET>]` 取得材料和历史；第三课时再打开 remote 关系。

---
<!-- section: 第二课时：程序使用哪个环境？ -->

---
<!-- layout: columns -->
# 为什么同一个命令一成一败？

<!-- column -->
## 当前位于 inbox/
**脚本就在当前目录**

`python3 some.py`　✓

<!-- column -->
## 回到 cli-lab/
**相对路径的起点改变**

`python3 some.py`　✗

<!-- footer -->
文件没有移动；改变的是相对路径从哪里开始解释。

---
<!-- layout: columns -->
# 两次查找，两套规则

<!-- column -->
## Shell 找程序
**PATH**

找到 `python3`

<!-- column -->
## Python 找脚本
**当前目录 + 参数**

找到 `some.py`

<!-- footer -->
存在，不等于当前的查找规则能够找到。

---
<!-- layout: columns -->
# 项目环境：声明、锁定、恢复

<!-- column -->
## 声明
**Python 与依赖**

`.python-version`

`pyproject.toml`

<!-- column -->
## 锁定
**已经解析的版本**

`uv.lock`

<!-- column -->
## 恢复
**当前机器的结果**

`.venv/`

<!-- footer -->
`uv sync --locked` 按项目记录恢复环境；锁定让升级成为主动、可测试的改动。

---
<!-- layout: columns -->
# 从能调用，到证据充分

<!-- column -->
## 找得到
**机器上的程序**

`command -v python3`

<!-- column -->
## 用得对
**项目中的解释器**

`sys.executable`

指向 `.venv/`

<!-- column -->
## 验收过
**事实与规则**

`course_check.py`

`pytest`

<!-- footer -->
程序报告当前事实；测试检查已经写下的规则。

---
<!-- section: 第三课时：改动怎样被记录？ -->

---
<!-- layout: columns -->
# 只改一个可验证输入

<!-- column -->
## 修改前
**教师默认值**

`signature = "teacher"`

<!-- column -->
## 修改后
**公开课程代号**

`signature = "s07"`

<!-- footer -->
先运行程序并确认它读到新值，再考虑提交。

---
<!-- layout: columns -->
# 一个改动，两个观察入口

<!-- column -->
## Terminal
**精确描述状态**

`git status --short`

`git diff`

<!-- column -->
## Source Control
**可视化同一状态**

Changes

Diff Editor

<!-- footer -->
两者读取同一个工作区，没有第二套 Git 状态。

---
<!-- layout: columns -->
# 一个改动怎样成为历史？

<!-- column -->
## 工作区
**Save**

当前文件

<!-- column -->
## 暂存区
**Stage · git add**

下一次快照

<!-- column -->
## 本地历史
**Commit**

由 SHA 指认的节点

<!-- footer -->
Save 改变文件；Stage 选择快照；Commit 写入本地历史。

---
<!-- layout: columns -->
# Commit 的指认与撤销

<!-- column -->
## 指认与查看
**SHA · HEAD**

`git show <sha>`

<!-- column -->
## 保留历史地撤销
**新增反向 commit**

`git revert <sha>`

<!-- footer -->
Revert 不删除旧历史；本节只理解，不执行。

---
<!-- layout: question -->
# 本地 commit 后，GitHub 会变化吗？
> Commit 写入本地历史；Push 才会尝试发送给 remote。
