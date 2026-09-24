<!-- layout: cover -->
# W2：位置、环境与版本
> 在同一个 VS Code 工作台中，看清项目正在发生什么

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- section: 第一课时：命令作用在哪里？ -->

---
# 同一系统，两种操作入口

```text
VS Code Explorer / Editor
              ↕ 同一批文件
WSL Bash / Integrated Terminal
```

<!-- footer -->
Terminal 是界面；Bash 解释命令；程序执行工作。

---
# 当前位置 + 命令 + 路径

```bash
pwd
```

```text
ls          -la          cli-lab
调用谁       选项          作用对象

~  Home     .  当前目录     ..  上一级
```

<!-- footer -->
相对路径从 `pwd` 显示的位置开始解释。

---
# 删除没有撤销键

```bash
rm <文件>
rmdir <空目录>
```

- 只删除本次刚创建、并且已经核对路径的对象
- 本节不用 `rm -r` 或 `rm -rf`

<!-- footer -->
删除前先看 `pwd` 和目标路径。

---
# 从本地文件操作到远端仓库

```text
GitHub 仓库 ── git clone ──▶ ~/course/w02-workbench
```

```text
仓库根  ~/course/w02-workbench
项目根  warmups/week-02/course-check
```

<!-- footer -->
本节先把 `clone` 当作取得材料；第三课时再打开 Git 关系。

---
<!-- section: 第二课时：程序使用哪个环境？ -->

---
# 同一个“名字”，为什么有时找得到？

```text
当前位置：.../cli-lab/inbox
python3 some.py          ✓

当前位置：.../cli-lab
python3 some.py          ✗
```

<!-- footer -->
文件没有移动；改变的是相对路径的起点。

---
# 谁在找，从哪里找？

```text
Shell  ── PATH ───────────▶ python3
Python ── 当前目录 + 参数 ──▶ some.py
```

<!-- footer -->
存在，不等于当前的查找规则能够找到。

---
# 可调用的工具，项目自己的环境

```text
.python-version
pyproject.toml  ── uv sync --locked ──▶  .venv/
uv.lock
```

```text
uv run python  ──▶  course-check/.venv/.../python
```

<!-- footer -->
锁定不是永不升级，而是让升级成为主动、可测试的改动。

---
<!-- layout: columns -->
# 能找到程序 ≠ 用对项目环境

<!-- column -->
## 运行条件
**解释器从哪里来**

`python3`：机器环境

`uv run python`：项目 `.venv`

`COURSE_MODE=fixture`：本次命令及其子进程

<!-- column -->
## 两种证据
**回答不同问题**

`course_check.py`：报告当前事实

`pytest`：检查已经写下的规则

<!-- footer -->
测试通过，只说明已经覆盖的规则通过。

---
<!-- section: 第三课时：改动怎样被记录？ -->

---
# 只改一项：公开签名

```diff
- signature = "teacher"
+ signature = "s07"
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
git status --short
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
工作区 ── git add ──▶ 暂存区 ── git commit ──▶ 本地历史
  ╰───── git diff ────╯       ╰── git diff --staged ──╯
                                  HEAD ─▶ 当前分支 ─▶ 当前 commit
```

<!-- footer -->
Stage 是选择；Commit 是本地历史，不是上传。

---
<!-- layout: columns -->
# 一个 commit，由 SHA 指认

<!-- column -->
## 查看
**`<short-sha>`**

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
> Commit 写入本地历史；Push 才会尝试发送给 Remote
