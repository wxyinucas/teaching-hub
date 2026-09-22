# W2 学生行动指南：位置、环境与版本

本周只使用一个项目：

```text
warmups/week-02/course-check/
```

三节课依次回答三个问题：

1. 我在哪里，这条命令会作用于什么？
2. 程序使用哪一个 Python 和哪一组依赖？
3. 当前修改在工作区、本地仓库还是远端仓库？

本周副本只用于课堂观察，不是 W3 的正式项目起点。

## 统一操作环境

取得项目的第一组命令可以在外部 WSL Bash 中执行；`code .` 打开项目后，统一转入 **VS Code 的 WSL Bash 集成终端**。

开始前核对：

- VS Code 左下角显示 `WSL: Ubuntu`；
- 集成终端运行 `uname -s`，输出 `Linux`；
- `pwd` 显示 `/home/...` 下的 WSL 路径，而不是 `C:\...` 或 `/mnt/c/...`；
- 本周不在管理员 PowerShell、Command Prompt 或普通 Windows 文件夹中运行项目命令。

VS Code 提供统一工作台，Integrated Terminal 是终端界面，WSL Bash 才是本周解释命令的 shell。

## 取得本周项目

### 第一次取得

在 WSL Bash 中执行：

```bash
mkdir -p ~/course
git clone https://github.com/wxyinucas/ai-agents.git ~/course/w02-workbench
cd ~/course/w02-workbench
code .
```

此时暂时把 `git clone` 当作“取得课堂材料”的固定动作；第三课时再解释它建立的本地与远端关系。

### 目标目录已经存在

不要删除或覆盖已有目录。若 `~/course/w02-workbench` 已存在，改用：

```bash
git clone https://github.com/wxyinucas/ai-agents.git ~/course/w02-workbench-2
cd ~/course/w02-workbench-2
code .
```

两个目录都存在或来源不清楚时停止 clone，保留现场并告诉教师；不要执行 `rm -rf`、强制重置或覆盖文件。

## 第一课时｜命令与路径

### 1. 确认当前工作位置

在 VS Code 集成终端运行：

```bash
uname -s
pwd
echo "$SHELL"
```

最低预期：

- `uname -s` 输出 `Linux`；
- `pwd` 以 `/course/w02-workbench` 或 `/course/w02-workbench-2` 结尾；
- shell 路径以 `bash` 结尾。

### 2. 看懂一条命令的常见结构

```text
command [subcommand] [options] [arguments]
```

例如：

```bash
ls -la warmups/week-02/course-check
```

- `ls`：命令；
- `-la`：选项；
- `warmups/week-02/course-check`：参数。

这是一种常见阅读模型，不是所有程序都必须严格符合的语法。遇到陌生命令，先看该程序自己的帮助：

```bash
ls --help
```

常用操作：

- Tab：补全命令或路径；
- `↑`／`↓`：查看历史命令；
- `Ctrl+C`：停止当前命令；
- 路径含空格时：用引号包住完整路径。

### 3. 用路径进入项目

```bash
cd ~/course/w02-workbench
pwd
ls
cd warmups/week-02/course-check
pwd
ls -la
cat signature.toml
```

若使用备用目录，把第一条中的 `w02-workbench` 改为 `w02-workbench-2`。

路径符号：

- `~`：当前用户的 home；
- `.`：当前目录；
- `..`：上一级目录；
- `/home/...`：绝对路径；
- `warmups/week-02/course-check`：从当前目录出发的相对路径。

本周同时存在两个重要层级：

```text
仓库根：~/course/w02-workbench
项目根：~/course/w02-workbench/warmups/week-02/course-check
```

“VS Code 已经打开仓库”不等于“终端已经进入项目根”。运行项目前始终先看 `pwd`。

### 4. 独立完成一次定位

从项目根开始：

```bash
pwd
cd ../../..
pwd
cd warmups/week-02/course-check
pwd
```

完成标准：三次 `pwd` 分别证明自己从项目根回到仓库根，再重新进入项目根。

## 第二课时｜uv 与作用范围

### 1. 三种作用范围

- **机器或用户级工具**：`git`、`uv`、`code` 可以服务多个项目；
- **项目级条件**：`.python-version`、`pyproject.toml`、`uv.lock` 与 `.venv` 围绕当前项目；
- **单次进程级信息**：`COURSE_MODE=fixture` 只影响紧随其后的那次运行。

查看 shell 从哪里找到工具：

```bash
command -v git
command -v uv
command -v code
```

“全局／局部”描述作用范围，不表示高级／低级，也不是 Git 的 local／remote。

### 2. 四类项目文件

- `.python-version`：希望使用 Python `3.12`；
- `pyproject.toml`：声明项目名、项目版本、Python 范围和依赖；
- `uv.lock`：记录本次解析采用的精确依赖版本，由 uv 管理；
- `.venv/`：uv 在当前机器恢复出的项目环境，不提交到 Git。

不要手动修改 `uv.lock` 或 `.venv`。

### 3. 恢复并核对项目环境

确认 `pwd` 位于 `warmups/week-02/course-check`，再运行：

```bash
uv --version
uv sync --locked
uv run --locked python -c 'import sys; print(sys.executable)'
```

最后一条路径应位于当前项目的：

```text
.../warmups/week-02/course-check/.venv/bin/python
```

本课程统一使用 `uv run`，不要求手动激活 `.venv`。

### 4. 观察一次运行的可见性

```bash
unset COURSE_MODE
printenv COURSE_MODE
COURSE_MODE=fixture printenv COURSE_MODE
printenv COURSE_MODE
```

预期依次看到：空、`fixture`、再次为空。

这说明 `NAME=value command` 可以只把信息交给一次命令，并没有永久修改项目或用户配置。

### 5. 运行程序和给定测试

```bash
COURSE_MODE=fixture uv run --locked python course_check.py
COURSE_MODE=fixture uv run --locked pytest -q
```

程序预期显示：

```text
project: ai-agents-lab
version: 0.1.0
python: 3.12.x
project-env: PASS
course-mode: fixture
signature: teacher
RUNTIME_CHECK=PASS
```

Python 补丁版本可以不同。pytest 应全部通过；此时签名仍是 `teacher` 并不矛盾——测试只检查已经写入的规则，不会替人完成第三课时的签名修改。

### 6. 用户级配置与项目级配置

uv 的用户级配置可以位于 WSL 的：

```text
~/.config/uv/uv.toml
```

项目级 uv 配置可以位于：

```text
项目根/uv.toml
```

或 `pyproject.toml` 的 `[tool.uv]` 分区中。

- 用户级配置：个人默认只需设置一次，但同伴看不见，换机器时也可能遗漏；
- 项目级配置：随项目共享、可以审查和复现，但需要逐项目维护；
- 决定项目能否复现的条件，应尽量写进项目；只代表个人偏好的默认设置可以留在用户级。

本周只认识边界，不创建这些配置文件。项目依赖声明与 uv 自身的行为配置也不是同一件事。

## 第三课时｜Git 与 Source Control

### 1. 看清本地与远端

先回到仓库根：

```bash
cd ~/course/w02-workbench
git remote -v
git branch --show-current
git status --short
```

若使用备用目录，修改第一条路径。

- 工作区：Explorer 中当前可以编辑的文件；
- 本地仓库：`.git/` 保存的历史和配置；
- `origin`：一个惯用的 remote 名称，记录本仓库来自哪个网络地址。

`clone` 会取得文件与历史，并记录 `origin`；本地修改不会自动上传到 GitHub。

### 2. 只修改公开签名

在 Explorer 中打开：

```text
warmups/week-02/course-check/signature.toml
```

只把 `teacher` 改为教师分配的公开课程代号，例如：

```toml
[student]
signature = "s07"
```

不要写姓名、完整学号、个人邮箱、密码、token 或其他个人信息。

保存后，VS Code Source Control 应出现一个修改文件。

### 3. 用两种入口核对同一份 diff

在仓库根运行：

```bash
git status --short
git diff -- warmups/week-02/course-check/signature.toml
```

再在 Source Control 中点击 `signature.toml`，核对图形差异视图与终端显示的是同一处删除和新增。

对应关系：

```text
git status    ↔  Changes
git diff      ↔  差异视图
git add       ↔  Stage Changes
git commit    ↔  Commit
```

只有能说明“改了哪个文件、旧值是什么、新值是什么”，才进入提交。

### 4. 设置本仓库的公开提交身份

把示例 `s07` 替换为本人公开课程代号：

```bash
git config --local user.name "s07"
git config --local user.email "s07@example.invalid"
```

`--local` 表示这些设置只写入当前仓库的 `.git/config`，不会改变其他项目。`example.invalid` 是专门用于示例的无效域名，不接收邮件。

### 5. 用 Source Control 完成本地提交

1. 在 Source Control 中只对 `signature.toml` 选择 **Stage Changes**；
2. 确认 Staged Changes 中只有这一项；
3. 输入提交信息：

   ```text
   w2: set public signature
   ```

4. 点击 **Commit**。

若 Source Control 无法完成，可在仓库根使用：

```bash
git add warmups/week-02/course-check/signature.toml
git commit -m "w2: set public signature"
```

核对：

```bash
git status --short
git log -1 --oneline
git remote -v
```

最低预期：

- `git status --short` 没有输出；
- 最新提交信息是 `w2: set public signature`；
- `origin` 仍指向教师仓库；
- GitHub 页面没有出现这次本地提交。

本周不运行 `git push`。commit 保存本地历史，push 才会尝试把本地历史发送到 remote。

## 完成核对

回到项目根：

```bash
cd warmups/week-02/course-check
pwd
COURSE_MODE=fixture uv run --locked python course_check.py
COURSE_MODE=fixture uv run --locked pytest -q
git -C ../../.. log -1 --oneline
```

本周完成时应同时具备：

- `pwd` 指向 `warmups/week-02/course-check`；
- 程序使用项目 `.venv`，并显示本人公开课程代号；
- pytest 全部通过；
- 最新本地 commit 是 `w2: set public signature`；
- 能解释这次 commit 仍只在本机，尚未 push。

## 选做挑战卡

做 0 张也不影响本周完成状态。每张卡互相独立，不安装新工具、不删除文件、不 push。

### A｜路径

从仓库根出发，分别用相对路径和绝对路径读取一次 `signature.toml`；每次先用 `pwd` 说明起点。

### B｜帮助

从 `ls --help` 找到一个课堂未讲的选项：先写下预测，再在项目目录验证。

### C｜拆命令

逐层解释下面每一段交给谁：

```bash
COURSE_MODE=fixture uv run --locked pytest -q
```

### D｜观察环境

运行：

```bash
uv tree
uv lock --check
```

用一句话分别说明它们展示或检查了什么；不要修改依赖。

### E｜观察提交

```bash
git show --stat --oneline HEAD
git config --show-origin --get user.name
```

指出最新提交改了什么，以及当前提交身份来自哪个配置文件。

## 遇到这些情况，先停一下

- VS Code 左下角不是 `WSL: Ubuntu`，或 `uname -s` 不是 `Linux`；
- 说不清当前目录是仓库根还是项目根；
- `w02-workbench` 与 `w02-workbench-2` 都已存在或来源不明；
- 命令要求输入 GitHub 密码、token、Cookie 或其他凭证；
- 准备运行 `git push`、删除目录、强制重置、修改测试或手动改写 `uv.lock`；
- 同一个操作连续失败，却没有产生新的错误信息或线索。

保留当前终端输出和 Source Control 状态，告诉教师最后一个成功动作和实际错误。真实现场比随机继续操作更容易接续。

W3 会从新的正式仓库开始，不继承本周目录、环境或提交。
