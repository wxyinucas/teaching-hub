# W2 学生行动指南：位置、环境与版本

本周使用两个位置：

```text
~/course/cli-lab/
└── 练习文件、目录、路径与命令查找

~/course/w02-workbench/
└── 练习项目环境、Git 状态与本地 commit
```

三节课依次完成三件事：

1. 用 Explorer 和终端操作同一份文件系统，并在课末取得本周项目；
2. 区分脚本路径、`PATH` 与项目 Python，用 uv 恢复并运行项目；
3. 让一项修改经历工作区、暂存区和本地历史，同时证明它尚未上传。

本周目录和 commit 只用于课堂观察，不是 W3 的正式项目起点。

本指南中的 **Explorer** 指 VS Code 左侧的文件浏览区，不是 Windows 文件资源管理器；**Integrated Terminal** 指 VS Code 内置的终端面板，本周在其中运行 WSL Bash；**Source Control** 指 VS Code 左侧用来观察 Git 状态的面板。

Terminal 是输入和显示文字的界面；Bash 是读取命令的 Shell；`ls`、`tree`、`python3` 等则是被 Shell 调用的程序。

除非文字明确要求一次执行，代码块也应从上到下逐行运行；某一步出现与指南不同的错误时，停在原处，不继续执行后面的命令。

## 全周操作边界

- 项目命令统一在 **VS Code 的 WSL Bash 集成终端**运行；左下角应显示 `WSL: Ubuntu`。
- `uname -s` 应输出 `Linux`；`pwd` 应显示 `/home/...` 下的 WSL 路径，而不是 `C:\...` 或 `/mnt/c/...`。
- 本周不执行 `git push`，不点击 Sync 或 Publish Branch。
- 本周不使用 `rm -r`、`rm -rf`、`git reset`、`git restore` 或 Source Control 的 Discard Changes。
- 教师带领安装 `tree` 时，可以在本机输入 WSL 用户密码；终端不显示密码字符是正常现象。不要展示、发送或记录密码。
- 任何 GitHub 密码、token、Cookie 或其他网络服务凭证请求，都先停止并告诉教师。

## 第一课时｜同一文件系统的两种入口

### 1. 打开统一工作台

在 Windows Terminal 中打开 Ubuntu／WSL Bash（不是 PowerShell），先执行本节唯一一组外部终端命令：

```bash
mkdir -p ~/course
cd ~/course
code .
```

在打开或切换后的 VS Code 窗口选择 **Terminal → New Terminal**，新建 Integrated Terminal 后再执行：

```bash
uname -s
pwd
ls
ls -la
```

最低预期：

- `uname -s` 输出 `Linux`；
- `pwd` 以 `/course` 结尾；
- Explorer 与终端显示的是同一个 `~/course` 目录。

`ls` 显示普通目录项；`ls -la` 中，`-l` 要求详细列表，`-a` 还会显示以 `.` 开头的隐藏项。

阅读命令时先找四种可能出现的部分：

```text
command [subcommand] [options] [positional arguments]
```

方括号表示这一部分可以省略，不是需要原样输入的字符：

- **command** 是首先启动的程序，例如 `ls`、`git`、`uv`；
- **subcommand** 让多功能程序选择本次动作，例如 `git clone` 中的 `clone`；
- **option** 改变动作方式。无需额外值的 option 常称为 **flag**，例如 `ls -a`；`tree -L 2` 中的 `-L` 是带值 option，`2` 是它的值；
- **positional argument** 靠位置说明作用，例如 URL、文件名和目标目录。

例如 `ls -la cli-lab` 中，`ls` 是 command，`-l` 与 `-a` 是两个合写的 flags，`cli-lab` 是位置参数。不同工具的具体语法由工具自己规定，不确定时查看它的 `--help`。

常用路径符号：

- `~`：当前用户的 home（用户主目录）；
- `.`：当前目录；
- `..`：上一级目录；
- 相对路径从 `pwd` 显示的位置开始解释。

### 2. 安装并验证 `tree`

先检查：

```bash
command -v tree
```

`command -v` 用来询问 Shell：“按当前查找规则，能否找到这个命令；找到的是哪一个程序？”没有输出表示当前找不到。

若输出了一条路径，再运行：

```bash
tree --version
```

若第一条没有输出，在教师带领下执行：

```bash
sudo apt update
sudo apt install tree
```

安装完成后重新核对：

```bash
command -v tree
tree --version
```

安装失败时保留终端输出并求助；不要自行反复更换软件源。后续文件实验仍可借助 Explorer 和 `ls` 继续。

### 3. 从空目录建立文件树

先只执行下面三条检查命令：

```bash
cd ~/course
pwd
ls
```

`pwd` 应以 `/course` 结尾，`ls` 的结果中不应出现 `cli-lab`。若已经出现，停下求助，不执行下面的创建命令。

确认后再执行：

```bash
mkdir cli-lab
cd cli-lab
mkdir inbox
touch inbox/note.txt
pwd
tree
```

在 Explorer 中打开 `inbox/note.txt`，写入下面一行并保存：

```text
created in Terminal; edited in VS Code
```

回到终端核对：

```bash
cat inbox/note.txt
```

### 4. 复制并移动文件

在 `~/course/cli-lab` 中执行：

```bash
mkdir archive
cd inbox
pwd
cp note.txt note-copy.txt
mv note-copy.txt ../archive/
cd ..
tree
```

最低预期：

```text
.
├── archive
│   └── note-copy.txt
└── inbox
    └── note.txt
```

`cp` 保留源文件并产生副本；`mv` 改变副本所在的路径。从 `inbox` 出发，`../archive/` 指向平级目录 `archive`。

### 5. 观察一次安全失败，再清理实验文件

仍在 `~/course/cli-lab` 中，先执行：

```bash
rmdir inbox
```

这条命令应失败，因为 `inbox` 仍包含 `note.txt`。目录和文件没有因此受损。

先只检查，不删除：

```bash
pwd
tree
```

只有当 `pwd` 是 `~/course/cli-lab`，而且目录树与本节创建的内容完全一致时，才执行：

```bash
rm inbox/note.txt
rm archive/note-copy.txt
rmdir archive
tree
cd ~/course
pwd
```

清理后必须保留：

```text
~/course/cli-lab/
└── inbox/
```

不要删除 `inbox` 或 `cli-lab`；第二课时会继续使用它们。

### 6. 取得本周项目

先回到 home，并检查目标位置：

```bash
cd ~
pwd
ls ~/course
```

若 `~/course` 的列表中已经有 `w02-workbench`，停下求助，不执行 clone。确认目标不存在后，只执行：

```bash
git clone https://github.com/wxyinucas/ai-agents.git ~/course/w02-workbench
```

`git` 是 command，`clone` 是 subcommand，仓库 URL 与 `~/course/w02-workbench` 是两个位置参数：前者说明来源，后者指定本地目标目录。目标不存在时 Git 会创建它；若省略目标目录，Git 通常会在当前位置按仓库名创建 `ai-agents/`。本课明确指定统一目录。

确认 clone 成功后再执行：

```bash
cd ~/course/w02-workbench
pwd
tree -L 2
code .
```

`tree -L 2` 只显示当前目录以下两层，避免一次打印过多内容；`-L` 是带值 option，`2` 是它的值。

在打开或切换后的 `w02-workbench` 窗口中新建 Integrated Terminal，再运行一次 `pwd`。它应以 `/course/w02-workbench` 结尾。

此时暂时把 `git clone` 理解为“把远端仓库取得为本地目录”；第三课时再解释它附带的 Git 关系。

### 第一课时完成核对

- [ ] `~/course/cli-lab/inbox` 存在且为空；
- [ ] `~/course/w02-workbench` 已成功 clone；
- [ ] `w02-workbench` 窗口左下角显示 `WSL: Ubuntu`；
- [ ] 新终端的 `pwd` 指向 `~/course/w02-workbench`。

### 第一课时需要停下求助的情况

- 创建前已经存在 `~/course/cli-lab`；
- 删除前 `pwd` 不是 `~/course/cli-lab`，或 `tree` 显示了不是本次创建的内容；
- 安装 `tree` 失败；停止安装操作，不自行更换软件源；
- clone 目标已经存在或 clone 报错；不删除、不覆盖，也不换一个目录名继续。

## 第二课时｜谁在找，按什么规则找？

### 1. 在 Vim 中创建一行程序

先检查工具：

```bash
command -v vim
command -v python3
command -v uv
```

三条命令都应输出路径。然后另开一个 VS Code 窗口：

```bash
code -n ~/course/cli-lab
```

其中 `-n`（`--new-window`）是“另开窗口”的 option，`~/course/cli-lab` 是要打开的位置参数。该命令只打开已有目录，不负责创建它。

在 `cli-lab` 窗口的新终端中执行：

```bash
cd ~/course/cli-lab/inbox
pwd
vim some.py
```

Vim 中只完成四步：

1. 按 `i` 进入插入模式；
2. 输入 `print("hello world!")`；
3. 按 `Esc`；
4. 输入 `:wq`，再按 Enter 保存退出。

若操作失控，按 `Esc`，输入 `:q!` 后按 Enter 放弃退出，并告诉教师。

运行：

```bash
python3 some.py
```

最低预期：终端输出 `hello world!`，Explorer 中出现 `inbox/some.py`。

### 2. 只改变当前位置，制造一次失败

先预测，再依次执行：

```bash
cd ..
pwd
python3 some.py
python3 inbox/some.py
```

预期结果：

1. `pwd` 指向 `~/course/cli-lab`；
2. `python3 some.py` 报告找不到脚本；
3. `python3 inbox/some.py` 再次输出 `hello world!`。

`some.py` 始终存在；改变的是相对路径的起点。

### 3. 区分两次查找

先只列出当前终端会话中的环境变量名称，避免意外显示 token 等私密值：

```bash
printenv | cut -d= -f1 | sort
```

`printenv` 给出环境变量，`cut -d= -f1` 取每行等号前的名称，`sort` 对名称排序；竖线 `|` 把左侧命令的输出交给右侧继续处理。

再逐项查看几个与本课有关的值：

```bash
printenv USER
printenv HOME
printenv SHELL
printenv PWD
printenv PATH
```

最后把 `PATH` 中由冒号分隔的目录逐行显示：

```bash
printf '%s\n' "$PATH" | tr ':' '\n'
```

这里只需观察：`PATH` 不是一个目录，而是一组有先后顺序的搜索目录。

执行：

```bash
pwd
command -v python3
python3 --version
```

```text
Shell  ── PATH ───────────▶ python3
Python ── 当前目录 + 参数 ──▶ some.py
```

`PATH` 是一个环境变量，里面按顺序记录了 Shell 查找程序的一组目录。Shell 从这些目录中寻找 `python3`；Python 再按命令提供的文件路径寻找脚本。两者都在查找，但使用的规则不同。

“全局／局部”必须先说明相对于谁、在哪个范围。环境变量是 Shell 交给程序的一组“名称—值”设置，稍后使用的 `COURSE_MODE` 就是一个例子。文件路径、`PATH`、环境变量和以后会遇到的程序变量，可以共享“可见范围”这个观察角度，但不是同一套机制。

### 4. 查看项目声明的运行条件

切回 Explorer 根目录为 `w02-workbench` 的窗口，在其集成终端执行：

```bash
cd ~/course/w02-workbench/warmups/week-02/course-check
pwd
ls -la
```

先在 Explorer 中查看随项目取得的三个文件；`.venv/` 此时通常还没有出现：

- `.python-version`：项目希望采用的 Python；
- `pyproject.toml`：项目名称、项目版本、Python 范围和依赖声明；依赖是项目运行时需要的其他软件包；
- `uv.lock`：已经解析并锁定的依赖版本；

下一步同步后会出现第四个对象：

- `.venv/`：在当前机器恢复出的项目环境。本项目的 `.gitignore` 已告诉 Git 不追踪它；它可以重新生成，不必提交到仓库。

项目版本 `0.1.0`、Python 版本 `3.12.x` 与依赖版本回答的是不同问题。

为什么记录和锁定版本：

- 今天运行成功，只能证明当前代码、Python 和依赖能够共同工作；
- 代码即使不变，将来重新安装时得到的运行条件也可能变化；
- 锁定不是永不升级，而是让升级成为一次主动、可观察、重新接受测试的改动；
- 跨操作系统或 CPU 架构时，这些记录未必能直接复现，但仍为重建和排查环境提供充分线索。

### 5. 用 uv 恢复并核对项目环境

仍在 `course-check` 项目根执行：

```bash
command -v uv
uv --version
python3 -c 'import sys; print(sys.executable)'
uv sync --locked
uv run --locked python -c 'import sys; print(sys.executable)'
```

`python -c '...'` 直接执行引号中的一行 Python；这里仅用来打印实际运行的解释器路径。`uv sync --locked` 严格按照现有锁文件恢复 `.venv`，不会顺手更新锁文件。

刷新 Explorer，确认项目根出现 `.venv/`。再比较两次 Python 路径：

- `python3 -c ...` 输出的是机器环境中的 Python，例如 `/usr/bin/python3`；
- `uv run --locked python -c ...` 输出的路径应位于当前项目的 `.../course-check/.venv/bin/python`。

本课程统一使用 `uv run` 明确说明“从当前项目环境运行”，不要求手动激活 `.venv`。

### 6. 让项目报告事实并运行测试

执行：

```bash
unset COURSE_MODE
COURSE_MODE=fixture uv run --locked python course_check.py
COURSE_MODE=fixture uv run --locked pytest -q
printenv COURSE_MODE
```

第一条 `unset` 清除 Shell 中可能残留的同名变量；`pytest` 是项目使用的测试程序，`-q` 只让它减少输出。最后的 `printenv` 再检查变量是否仍然存在。

`fixture` 只是本课程为固定实验数据约定的运行模式值，不是 Bash 的特殊关键字。

程序最低预期：

```text
project: ai-agents-lab
version: 0.1.0
python: 3.12.x
project-env: PASS
course-mode: fixture
signature: teacher
RUNTIME_CHECK=PASS
```

pytest 应显示 `6 passed`；最后的 `printenv COURSE_MODE` 应没有输出。`COURSE_MODE=fixture` 只对紧随其后的命令及其子进程可见，没有永久写入 shell 或项目文件。

测试通过只说明已经写下的规则通过；此时签名仍是 `teacher`，因为个人签名属于第三课时的新任务。

### 第二课时完成核对

- [ ] 从 `inbox` 运行 `some.py` 成功；从 `cli-lab` 省略路径时失败，补全路径后成功；
- [ ] 能说明 Shell 如何找到 `python3`，以及 Python 如何找到 `some.py`；
- [ ] 项目 Python 路径位于 `course-check/.venv/`；
- [ ] 程序显示 `RUNTIME_CHECK=PASS`，pytest 显示 `6 passed`；
- [ ] 最后的 `printenv COURSE_MODE` 没有输出。

### 第二课时需要停下求助的情况

- `vim`、`python3` 或 `uv` 任意一个无法找到；
- 实验开始前 `inbox/some.py` 已经存在；
- Vim 无法正常退出；
- `uv sync --locked` 失败；不改锁文件、不换镜像、不手动安装依赖；
- 项目解释器不在 `.venv`，程序显示 FAIL，或测试失败。

## 第三课时｜工作区、暂存区与本地历史

### 1. 从干净工作区开始

切回 `w02-workbench` 窗口，在仓库根目录（也就是 clone 得到的最外层目录 `~/course/w02-workbench`）执行：

```bash
cd ~/course/w02-workbench
pwd
git status --short
```

`git status --short` 必须没有输出。若已有改动，保留现场并直接求助；不要使用 reset、restore 或 Discard Changes 清理。

### 2. 修改并验证公开签名

在 Explorer 中打开：

```text
warmups/week-02/course-check/signature.toml
```

只把 `teacher` 改为教师指定或认可的公开课程代号，例如：

```toml
[student]
signature = "s07"
```

如果教师尚未说明代号规则，先询问，不自行写入个人信息。不要写姓名、完整学号、个人邮箱或其他个人信息。保存后先验证：

```bash
cd warmups/week-02/course-check
COURSE_MODE=fixture uv run --locked python course_check.py
cd ../../..
```

程序必须显示本人公开代号与 `RUNTIME_CHECK=PASS`。

### 3. 用终端和 Source Control 查看同一个 diff

在仓库根执行：

```bash
git status --short
git diff -- warmups/week-02/course-check/signature.toml
```

最低预期：

- `git status --short` 显示第二列为 `M`，例如：

  ```text
   M warmups/week-02/course-check/signature.toml
  ```

- diff（差异记录）只包含 `teacher` 到个人代号的一行替换。

按 `Ctrl+Shift+G` 打开 VS Code Source Control；`signature.toml` 应位于 Changes。点击它，图形 diff 应显示同一处删除和新增。

```text
git status --short    ↔ Source Control 状态列表
git diff              ↔ Changes
git diff --staged     ↔ Staged Changes
```

Git 的“追踪”不是保存每次键盘输入，而是比较当前状态与已经记录的状态。

### 4. 把唯一改动送入暂存区

```text
工作区 ── Stage / git add ──▶ 暂存区 ── Commit ──▶ 本地历史
  │                              │
  └─ git diff：与暂存区比较       └─ git diff --staged：与 HEAD 比较
```

这里先把 `HEAD` 理解为“当前分支最新一次 commit 的位置”。

在 Source Control 的 Changes 中，只对 `signature.toml` 选择 **Stage Changes**。它应移动到 Staged Changes。

回到终端执行：

```bash
git status --short
git diff -- warmups/week-02/course-check/signature.toml
git diff --staged -- warmups/week-02/course-check/signature.toml
```

预期：

- 状态显示第一列为 `M`，例如：

  ```text
  M  warmups/week-02/course-check/signature.toml
  ```

- 普通 `git diff` 没有输出；
- `git diff --staged` 仍显示这一行修改。

Save 写入工作区；Stage 选择下一次快照；Commit 才把快照写入本地历史。Unstage 只把改动移回 Changes，不会删除文件内容。

### 5. 设置本仓库身份并 commit

把示例 `s07` 替换为 `signature.toml` 中使用的同一个公开课程代号：

```bash
git config --local user.name "s07"
git config --local user.email "s07@example.invalid"
```

`--local` 表示身份只写入当前仓库的 `.git/config`；`example.invalid` 是用于示例的无效域名，不接收邮件。

在 Source Control 输入框填写：

```text
w2: set public signature
```

确认 Staged Changes 中只有 `signature.toml`，再选择 **Commit**。

Source Control 无法完成时，在仓库根使用终端路线：

```bash
git add warmups/week-02/course-check/signature.toml
git commit -m "w2: set public signature"
```

提交后执行：

```bash
git log -1 --oneline
git show --stat --oneline HEAD
```

若 `git show` 进入分页界面，按 `q` 返回终端。

每个 commit 都有一个完整对象 ID；命令行和界面通常只显示其中足以区分对象的短前缀，称为短 SHA。`HEAD` 是一个引用；在本课的正常分支状态下，它经当前分支解析到最新 commit。可以在 Source Control 面板的 Graph（提交图）中找到同一条提交并查看其文件；若界面没有 Graph，以终端结果为准。

以下命令只认识，不执行：

```bash
git show SHORT_SHA
git revert SHORT_SHA
```

`git show` 查看指定历史对象；`git revert` 新增一个 commit，抵消旧 commit 带来的改动，但不删除旧历史。

### 6. 证明 commit 尚未上传

`git clone` 会把来源仓库的网络地址记录为 `origin`；它只是这个地址在本地的默认简称。然后在仓库根执行：

```bash
git status --short
git status -sb
git log -1 --oneline
git remote get-url origin
```

最低预期：

- 第一条没有输出，说明工作区干净；
- 本流程正常完成时，`git status -sb` 应包含 `ahead 1`；若没有，保留完整输出并求助；
- 最新提交信息是 `w2: set public signature`；
- `origin` 仍指向教师仓库；
- Source Control Graph 可能把这条 commit 显示为尚未 push／outgoing；若界面没有该提示，以 `git status -sb` 的 `ahead 1` 为准。

Commit 保存本地历史；只有 Push 才会尝试把本地 commit 发送给 remote。本周不执行 push，也不点击 Sync 或 Publish Branch。

### 第三课时完成核对

- [ ] 程序曾显示本人公开代号与 `RUNTIME_CHECK=PASS`；
- [ ] `git status --short` 没有输出；
- [ ] `git log -1 --oneline` 显示 `w2: set public signature`；
- [ ] 能说明这次 commit 仍只在本机，尚未 push。

### 第三课时需要停下求助的情况

- 初始 `git status --short` 已有输出；
- 程序没有显示新签名或 PASS；
- diff 出现额外文件或额外修改；
- Staged Changes 不止一个文件；
- Git 或 VS Code 索取 GitHub 凭证，或者准备执行 Sync、Publish 或 Push；
- 不使用 reset、restore 或 Discard Changes 来“修好”现场。

## 选做挑战卡

完成三课主线后自由选做；做 0 张不影响本周完成状态，卡片之间没有先后依赖。不安装新工具、不删除文件、不修改测试、不 push。

### A｜两种路径

从仓库根出发，先用 `cat` 和相对路径显示一次文件内容：

```bash
cat warmups/week-02/course-check/signature.toml
```

再运行 `pwd`，把它输出的完整路径抄下来，末尾接上 `/warmups/week-02/course-check/signature.toml`，放在 `cat` 后面再次执行。两次输出应完全相同，并包含自己的公开代号。

### B｜从帮助中学习

从 `ls --help` 或 `tree --help` 找一个只改变显示方式、不会改动文件的选项。记录所选选项和预测，再在 `cli-lab` 中分别运行“不带该选项”和“带该选项”的完整命令；最后记录实际输出与一句话结论。

### C｜解释复合命令

把下面命令拆成 `COURSE_MODE=fixture`、`uv run`、`--locked`、`pytest` 和 `-q` 五段，分别写出“由谁处理”和“改变了什么”：

```bash
COURSE_MODE=fixture uv run --locked pytest -q
```

### D｜只读检查项目环境

在 `course-check` 项目根执行：

```bash
uv tree --locked
uv lock --check
```

它们是本挑战中新出现的只读检查命令。必要时先查看 `uv tree --help` 和 `uv lock --help`：第一条应显示项目的依赖树，第二条应在锁文件有效时无报错结束。用一句话分别记录结果；不要修改依赖和锁文件。

### E｜用对象 ID 查看历史

在仓库根执行：

```bash
git rev-parse HEAD
git log -1 --oneline
```

第一条应给出完整对象 ID，第二条开头应给出同一个 commit 的短 SHA。再把第二条中的短 SHA 替换到 `SHORT_SHA` 的位置：

```bash
git show --stat --oneline SHORT_SHA
```

若 `git show` 显示的提交信息仍是 `w2: set public signature`，挑战完成。最后说明完整对象 ID、短 SHA 和 `HEAD` 在本仓库中怎样标识同一个 commit。

## 求助时保留什么？

不要随机继续尝试。保留当前终端输出、`pwd`、Explorer 根目录和 Source Control 状态，并告诉教师：

1. 最后一个成功动作是什么；
2. 实际执行了什么命令或界面动作；
3. 屏幕上的完整错误信息是什么。

真实现场比“清理后重新开始”更容易判断和接续。

W3 会从新的正式仓库开始，不继承本周目录、环境或提交。
