<!-- layout: cover -->
# W2：位置、环境与版本
> 在同一个 VS Code 工作台中，看清项目正在发生什么

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- section: 第一课时：命令作用在哪里？ -->

---
<!-- layout: columns -->
# 认识统一工作台

<!-- column -->
## VS Code
**组织界面**

Explorer · 编辑器 · Terminal

<!-- column -->
## WSL Bash
**解释命令**

路径 · 选项 · 参数

<!-- column -->
## 程序
**执行工作**

`git` · `uv` · `python`

<!-- footer -->
Integrated Terminal 是界面；Shell 决定命令怎样被解释。

---
# 取得项目，暂不展开 Git

```bash
mkdir -p ~/course
git clone https://github.com/wxyinucas/ai-agents.git \
  ~/course/w02-workbench
cd ~/course/w02-workbench
code .
```

<!-- footer -->
先把 `clone` 当作取得材料的固定动作；第三课时再解释它。

---
# 命令有结构

```bash
ls -la warmups/week-02/course-check
```

```text
ls        -la        warmups/week-02/course-check
命令      选项        参数
```

<!-- footer -->
常见形状：`command [subcommand] [options] [arguments]`

---
<!-- layout: columns -->
# 路径决定作用对象

<!-- column -->
## `~`
**用户 Home**

从稳定起点出发

<!-- column -->
## `.`
**当前目录**

相对路径的起点

<!-- column -->
## `..`
**上一级目录**

沿目录树返回

<!-- footer -->
执行前先用 `pwd` 回答：我现在在哪里？

---
<!-- layout: columns -->
# 两个根目录，不是一回事

<!-- column -->
## 仓库根
**整个课程练习仓库**

```text
~/course/w02-workbench
```

<!-- column -->
## 项目根
**本周 Python 项目**

```text
warmups/week-02/course-check
```

<!-- footer -->
打开了仓库，不等于终端已经进入项目目录。

---
<!-- section: 第二课时：程序使用哪个环境？ -->

---
<!-- layout: columns -->
# 三种作用范围

<!-- column -->
## 机器／用户级
**多个项目可调用**

`git` · `uv` · `code`

<!-- column -->
## 项目级
**属于当前项目**

声明 · 锁文件 · `.venv`

<!-- column -->
## 单次进程级
**只影响一次运行**

`COURSE_MODE=fixture`

---
<!-- layout: columns -->
# 项目用文件说明自己

<!-- column -->
## 声明
**需要什么**

`.python-version`

`pyproject.toml`

<!-- column -->
## 锁定
**这次采用什么**

`uv.lock`

<!-- column -->
## 恢复
**本机实际装出什么**

`.venv/`

---
# 用 uv 恢复项目环境

```bash
uv sync --locked

uv run --locked python -c \
  'import sys; print(sys.executable)'
```

<!-- footer -->
Python 应来自当前 `course-check/.venv/`。

---
# 让信息只对一次运行可见

```bash
unset COURSE_MODE
printenv COURSE_MODE

COURSE_MODE=fixture printenv COURSE_MODE

printenv COURSE_MODE
```

<!-- footer -->
预期：空 → `fixture` → 再次为空

---
<!-- layout: columns -->
# 程序报告事实，测试检查规则

<!-- column -->
## 程序
**现在实际是什么**

```bash
COURSE_MODE=fixture \
uv run --locked python course_check.py
```

<!-- column -->
## 测试
**给定规则是否满足**

```bash
COURSE_MODE=fixture \
uv run --locked pytest -q
```

<!-- footer -->
测试通过，只说明已经覆盖的规则通过。

---
<!-- layout: columns -->
# 全局配置与项目配置各自承担什么？

<!-- column -->
## 用户级
**个人默认**

`~/.config/uv/uv.toml`

方便，但不会随项目共享

<!-- column -->
## 项目级
**共同约定**

`uv.toml` · `[tool.uv]`

可见、可审查、可复现

<!-- footer -->
决定项目能否复现的条件，应尽量留在项目中。

---
<!-- section: 第三课时：改动怎样被记录？ -->

---
# 只改一项：公开签名

```toml
[student]
signature = "teacher"
```

```text
             ↓ 只改一项
```

```toml
[student]
signature = "s07"
```

<!-- footer -->
先让程序读到新值，再考虑是否提交。

---
<!-- layout: columns -->
# 两个入口，同一个 diff

<!-- column -->
## 终端
**精确描述状态**

```text
git status
git diff
git diff --staged
```

<!-- column -->
## Source Control
**可视化同一状态**

Changes

Staged Changes

Diff Editor

---
# 一个改动怎样成为历史？

```text
编辑器
  │ Save
  ▼
工作区 ── git add ──▶ 暂存区 ── git commit ──▶ Commit（HEAD）
  ╰───── git diff ────╯       ╰── git diff --staged ──╯
```

<!-- footer -->
Stage 是选择；Commit 是本地历史，不是上传。

---
<!-- layout: columns -->
# 一个 commit，由 SHA 指认

<!-- column -->
## 查看
**`a1b2c3d`**

```bash
git show <sha>
```

<!-- column -->
## 撤销
**新增反向 commit**

```bash
git revert <sha>
```

<!-- footer -->
Revert 保留旧历史；本节只理解，不执行。

---
<!-- layout: question -->
# 本地 commit 后，GitHub 会变化吗？
> 不会；commit 保存本地历史，push 才会尝试发送给远端
