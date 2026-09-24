# W2｜看清项目的位置、环境与版本

> W2 · 3 × 50 min · 约 30 名学生，按零编程基础设计 · 无助教

## 知识地图

- **Road map：从可接续工作台进入可运行、可追踪的项目**
  - 看清工作位置
    - 图形界面与命令行是操作同一文件系统的两种入口
    - VS Code Explorer 显示目录状态，WSL Bash 用文字命令改变同一状态
    - 当前目录、命令结构与路径共同决定一次操作作用在哪里
  - 看清运行条件
    - `git`、`uv` 是多个项目都能调用的工具
    - `pyproject.toml`、`uv.lock` 与 `.venv` 共同限定当前项目
    - 环境变量还可以只对一次运行可见
  - 看清版本状态
    - 工作区保存当前文件，本地仓库保存提交历史，remote 指向网络上的仓库
    - VS Code Source Control 把同一份 Git 状态变成可视界面
  - 从这里进入后续课程
    - W3：在正式项目中配置本地开发工具
    - W4～W9：预测、运行、追踪、诊断和验收程序

## 本次课 · 从文件系统操作进入可运行、可追踪的项目

### 0-50 | 图形界面与命令行如何操作同一份文件？

> 把 VS Code Explorer 与 WSL Bash 放在一起，用一个连续的目录实验观察命令怎样改变文件系统，最后取得本周项目。

**本课实验全景：清理前的临时目标状态**

```text
~/course/
└── cli-lab/
    ├── inbox/
    │   └── note.txt
    └── archive/
        └── note-copy.txt
```

- `note.txt`：由终端创建，在 VS Code 编辑器中写入内容，再回到终端读取；
- `note-copy.txt`：先在 `inbox` 中复制，再移动到平级的 `archive`；
- 达到上图后，删除实验文件和 `archive`，但保留空的 `~/course/cli-lab/inbox`，供下一课时继续使用；
- 全程路线只有一条：**定位 → 建立 → 查看 → 复制 → 移动 → 删除 → 回到 home → clone**。

#### 同一系统，两种操作入口

> 图形界面强调发现和直接操作，命令行强调精确描述、重复执行与组合；二者改变的是同一台计算机中的状态。

**课前检查**

- [ ] 在真实 Windows + WSL 2 设备中，从 WSL 执行 `code .`，确认 VS Code 左下角显示 `WSL: Ubuntu`，新建终端后 `uname -s` 输出 `Linux`。
- [ ] 确认 Windows 版 VS Code、Microsoft WSL 扩展、Git 与 uv 可用；确认学校网络可以通过 Ubuntu 软件源安装 `tree`。
- [ ] 在临时目录完整走通 `cli-lab` 的创建、移动与清理；正式演示开始前确认 `~/course/cli-lab` 和 `~/course/w02-workbench` 尚不存在。
- [ ] 保存一张 VS Code Explorer 与 WSL Bash 集成终端同时可见的真实画面，作为投影或设备异常时的 Plan B。

*翻页：同一系统，两种操作入口*

- 历史只讲三步：文字终端先于图形界面出现；鼠标和窗口降低了发现与操作门槛；文字命令因为便于保存、复制、远程执行和自动化而一直保留下来。
- 图形界面：容易发现功能、直接看到空间关系，适合探索和一次性操作；大量重复操作不容易准确复现。
- 命令行：动作和对象写得明确，容易记录、重放和组合；代价是必须看清当前目录、路径和报错。
- 明确：这不是“先进／落后”的比较，而是操作同一个系统时两种不同的侧重。

**转场：** 接下来不靠抽象描述判断二者是否相同；把 Explorer 和 Terminal 放在一起，每执行一条命令就观察图形界面发生了什么。

#### 把两个视角放在一起

> Explorer 显示目录树，Terminal 接收文字操作；`pwd` 给出命令行当前采用的观察位置。

*翻页：当前位置 + 命令 + 路径*

- 在外部 WSL Bash 中执行：

```bash
mkdir -p ~/course
cd ~/course
code .
```

- 在新打开的 VS Code 中并排保留 Explorer 和 Integrated Terminal；从此处开始，课堂命令统一在集成终端执行。
- 运行：

```bash
uname -s
pwd
ls
ls -la
```

- 指出：`pwd` 回答“我在哪里”，`ls` 回答“这里有什么”，`cd` 改变命令行接下来采用的观察位置。
- 用 `ls -la` 当场拆解统一阅读方式：
  - `ls`：调用谁；
  - `-la`：附加什么选项；
  - 没有显式路径参数：默认查看当前目录 `.`。
- 给出常见外形，但不要求背诵：

```text
command [subcommand] [options] [arguments]
```

- 明确：Integrated Terminal 是界面，WSL Bash 负责解释命令，`ls` 等程序完成具体工作；“VS Code 打开了某个文件夹”与“终端当前位于某个目录”需要分别核对。

**转场：** `ls` 已经能够调用，`tree` 还不一定存在。下一步亲手给系统增加一个新命令。

#### 安装一个新的命令

> 命令不是需要背诵的魔法词汇；很多命令本身就是 shell 找到并启动的程序。

- 先运行：

```bash
command -v tree
tree --version
```

- 未安装者执行：

```bash
sudo apt update
sudo apt install tree
```

- 说明：输入 `sudo` 密码时终端不会显示字符；输入 WSL 用户密码后按 Enter。安装询问是否继续时，确认即将安装的是 `tree` 再选择继续。
- 安装后重新运行：

```bash
command -v tree
tree --version
tree -L 2
```

- 收束：安装前 shell 找不到 `tree`，安装后可以找到并启动它；`apt`、`sudo` 和安装范围的细节留到下一课时讨论。
- 安装失败时保留终端输出并直接求助；其余文件操作仍可通过 Explorer 和 `ls` 继续，不在课堂上反复更换软件源。

**转场：** 工具已经齐全。现在从一个空目录开始，让终端创建对象，让 Explorer 负责实时显示结果。

#### 从空目录建立一棵树

> 每次改变文件系统前先说出预期变化，执行后同时用 Explorer 和 `tree` 核对。

- 本段出口：`~/course/cli-lab/inbox/note.txt` 已存在，Explorer、`ls` 与 `tree` 显示的结构一致，终端能够读出文件内容。
- 本段要证明：终端可以建立目录与空文件，VS Code 编辑器可以写入同一个文件，终端随后能够读到变化；Explorer、`ls` 与 `tree` 只是同一状态的不同视图。
- 本段命令工具箱：`cd`、`pwd`、`mkdir`、`touch`、`cat`、`ls`、`tree`；按现场节奏输入，不要求逐行照读台本。
- 讲解只抓三个点：`mkdir` 创建目录；文件不存在时 `touch` 创建空文件；`cat` 把文件内容输出到终端。
- 路径只抓四个符号：`~` 是 home，`.` 是当前目录，`..` 是上一级目录，以 `/` 开头的是绝对路径。
- 每完成一个动作都问同样三件事：现在在哪里、调用了什么、目标路径指向谁。
- 若创建 `cli-lab` 时发现它已经存在，停止操作并直接求助；不删除未知目录。

**转场：** 我们已经建立了对象；接下来不增加新概念，只用源路径和目标路径重新组织它们。

#### 用路径重新组织这棵树

> `cp` 产生副本，`mv` 改变对象所在的位置；相对路径把动作与当前目录连接起来。

- 本段出口：达到本课开头给出的完整目录树，并能说明副本如何从 `inbox` 到达平级的 `archive`。
- 本段要证明：`cp` 保留源文件并产生副本，`mv` 改变副本所在的路径；从 `inbox` 出发，`../archive/` 指向一个平级目录。
- 本段命令工具箱：`cp <源路径> <目标路径>`、`mv <源路径> <目标路径>`、`mkdir`、`cd`、`pwd`、`tree`；命令顺序由上面的目标状态决定。
- 核验只看三件事：源文件是否仍在、目标文件是否到达 `archive`、切换目录后 `pwd` 是否与预期一致。

*翻页：删除没有撤销键*

- 回到 `cli-lab`，先用 `rmdir inbox` 尝试删除非空目录；读取报错，并指出这次失败保护了其中的文件。
- 清理出口：`note.txt`、`note-copy.txt` 与 `archive` 已删除；空的 `~/course/cli-lab/inbox` 被保留，`pwd` 显示已经回到 `~/course`。
- 本段命令工具箱：`rm <文件>`、`rmdir <空目录>`、`cd`、`pwd`、`tree`；先核对路径，再决定删除对象。
- 清理原则：`rm` 只指向本次实验创建且已经核对过的文件，`rmdir` 只处理确认已经为空的目录；每次删除后都从 Explorer 或 `tree` 验证状态。
- 明确：`rm` 不经过 Windows 回收站；本节只删除自己刚刚创建并已经核对路径的实验文件，不使用 `rm -r` 或 `rm -rf`。
- 收束：GUI 中的复制、拖动和删除，与 `cp`、`mv`、`rm` 改变的是同一份文件系统状态；命令行的区别是把动作与路径写成了可以复述的文字。

**转场：** 本地目录已经能够独立操作。最后用一条网络命令，把远端仓库变成本地目录树。

#### 回到 home，取得本周项目

> `git clone` 第一次把远端内容变成本地文件与目录；它为什么还能带来历史，留到第三课时解释。

*翻页：从本地文件操作到远端仓库*

- 第 43 分钟停止继续扩展文件实验，统一执行：

```bash
cd ~
pwd
git clone https://github.com/wxyinucas/ai-agents.git ~/course/w02-workbench
cd ~/course/w02-workbench
pwd
tree -L 2
code .
```

- 检查：VS Code 左下角显示 `WSL: Ubuntu`，Explorer 顶层目录是 `w02-workbench`；在这个新窗口中新建 Integrated Terminal，再运行 `pwd`，输出应以 `/course/w02-workbench` 结尾。
- 目标目录已经存在或 clone 报错时，保留终端输出并直接求助；不删除目录，也不换一个名字继续 clone。
- 说明：这一份本地副本只服务本周观察，不是 W3 的正式项目起点。
- 最后只收四句话：
  1. 图形界面与命令行可以操作同一份文件系统；
  2. 当前目录决定相对路径从哪里开始解释；
  3. 一条命令要看调用对象、选项和路径参数；
  4. `git clone` 把远端仓库取得为本地目录，Git 关系留到第三课时再打开。

**转场：** 第一课时回答了“命令在哪里、作用于谁”；下一课时继续问，进入同一个项目后，程序究竟使用哪一个 Python 和哪一组依赖。

### 50-100 | 为什么找得到 Python，却找不到 `some.py`？

> 先用一次自然的报错看清“谁在找、从哪里找”，再进入现成项目，观察 uv 怎样把机器上的 Python 变成项目明确的运行环境。

**本课只走两个场景**

```text
~/course/cli-lab/inbox/some.py
└── 观察：当前目录、脚本路径与 PATH

~/course/w02-workbench/warmups/week-02/course-check/
└── 观察：机器上的 Python 与项目需要的 Python
```

#### 用 Vim 写下第一行 Python

> 在 `inbox` 中创建并运行一行程序，先取得一个毫无悬念的成功结果。

**课前检查**

- [ ] 在真实 WSL 环境确认 `vim`、`python3` 和 `uv` 都能由 `command -v` 找到；缺少任何一项时保留输出并直接求助。
- [ ] 从干净 clone 删除本地 `.venv` 后完整运行 `uv sync --locked`，记录首次下载用时，并保存同步成功与项目 Python 路径的画面作为 Plan B。
- [ ] 确认第一课时结束时保留了空的 `~/course/cli-lab/inbox`，且 `~/course/w02-workbench` 已成功取得。

*翻页：同一个“名字”，为什么有时找得到？*

- 从第一课时保留的 `w02-workbench` 窗口之外，另开一个 `cli-lab` 窗口：

```bash
code -n ~/course/cli-lab
```

- 在新窗口的集成终端执行：

```bash
cd ~/course/cli-lab/inbox
pwd
vim some.py
```

- Vim 只演示本次必需的四步：按 `i` 进入插入模式，写入 `print("hello world!")`，按 `Esc`，输入 `:wq` 后按 Enter 保存退出；操作失控时按 `Esc` 后输入 `:q!` 放弃退出并直接求助。
- 运行：

```bash
python3 some.py
```

- 出口：终端打印 `hello world!`，Explorer 中出现 `inbox/some.py`；此处不讲 Python 语法，只确认“解释器读到文件并执行了一条语句”。

**转场：** 文件和 Python 都没有改变；现在只改变终端所处的位置，看刚才的命令还能否成立。

#### 换一个目录，制造一次失败

> `cd ..` 不会移动或删除文件，却会改变相对路径从哪里开始解释。

- 先让学生预测三条命令的结果，再依次执行：

```bash
cd ..
pwd
python3 some.py
python3 inbox/some.py
```

- 预期：`python3 some.py` 报告找不到脚本；显式写出 `inbox/some.py` 后再次打印 `hello world!`。
- 在 Explorer 中指出 `some.py` 始终存在；失败不是“文件消失了”，而是当前目录下没有这条相对路径。
- 不立刻给出抽象定义，只追问：同一条命令中，为什么 `python3` 仍然有效，而 `some.py` 需要换一种写法？

**转场：** 一条命令里其实发生了两次查找。把两次查找拆开，才能回答这个问题。

#### 谁在找，按什么规则找？

> Shell 通过 `PATH` 找程序；Python 按给出的文件路径找脚本。二者都在“查找”，但规则不同。

*翻页：谁在找，从哪里找？*

- 在 `~/course/cli-lab` 执行：

```bash
pwd
command -v python3
python3 --version
```

- 固定两条关系：

```text
Shell  ── PATH ──> python3
Python ── 当前目录 + 参数 ──> some.py
```

- “全局／局部”不是对象天生的标签，必须先问“相对于谁、在哪个范围”：课堂口语里的“全局工具”，准确地说只是当前 shell 能从 `PATH` 找到、因而可在多个项目中调用的工具。
- 以后讲程序变量时也会遇到类似问题：一个名字在当前位置是否可见。这里只保留这个共同的观察视角；文件路径、`PATH`、环境变量和 Python 变量并不是同一套机制。
- 收口：**存在，不等于当前的查找规则能够找到。**

**转场：** 能从 `PATH` 找到一个 Python，只能说明“有 Python 可用”，还没有回答“它是不是这个项目需要的 Python”。

#### 找到 Python，还不等于找到正确的 Python

> 代码不会自动保存它运行成功时的条件；项目需要同时记录 Python 范围和依赖版本，才有机会在另一台机器或未来再次复现。

- 先保留机器事实：`command -v python3` 和 `python3 --version` 分别回答“调用的是谁”和“它是什么版本”。
- 提出场景：两台机器都能运行 `python3`，但一台是 `3.10`，另一台是 `3.12`；程序还能否保证得到同样结果？
- 今天运行成功，只能证明“当前代码 + 当前 Python + 当前依赖”能够配合工作；代码即使没有改变，重新安装时得到的运行条件仍可能发生变化。
- 如果不记录版本，几个月后的作者——包括未来的自己——可能已经无法运行今天成功的代码；锁定版本，是把一组已经解析、验证过的运行条件保存下来。
- “锁定”不等于永远不升级：升级应当成为一次主动、可观察、重新接受测试的改动，而不是在下次安装时悄悄发生。
- 版本信息也不能保证跨操作系统、CPU 架构或外部服务完全复现；但即使原环境不能直接运行，它仍为新系统重建和排查环境提供了充分线索。
- 切回第一课时保留的 `w02-workbench` 窗口，再进入已经准备好的项目：

```bash
cd ~/course/w02-workbench/warmups/week-02/course-check
pwd
```

- 在 Explorer 中先看三个已经随项目取得的文件，并预告同步后将出现第四个对象：
  - `.python-version`：项目希望采用的 Python；
  - `pyproject.toml`：项目名称、项目版本、Python 范围和依赖声明；
  - `uv.lock`：已经解析并锁定的依赖版本；
  - `.venv/`：尚未出现；它将是当前机器为这个项目恢复出的局部环境。
- 明确：项目版本 `0.1.0`、Python 版本 `3.12.x` 与依赖版本回答的是三个不同问题；本节只要求能够分辨。
- 收口：**可复现不是保证程序永远正确，而是尽量让明天面对的，仍然是今天验证过的运行条件。**

**转场：** 这些文件只是项目写下的要求。下一步让 uv 按要求在当前机器上恢复运行条件。

#### 用 uv 恢复项目环境

> uv 可以跨项目调用；它读取当前项目的声明与锁文件，把结果恢复到项目自己的 `.venv` 中。

*翻页：可调用的工具，项目自己的环境*

- 在 `course-check` 项目根执行：

```bash
command -v uv
uv --version
python3 -c 'import sys; print(sys.executable)'
uv sync --locked
uv run --locked python -c 'import sys; print(sys.executable)'
```

- 比较两次 Python 路径：前一条报告 shell 从机器环境找到的 Python，最后一条应指向当前 `course-check/.venv/`；后者才是“本次确实使用了项目环境”的证据。
- 在 Explorer 中观察 `.venv`：`pyproject.toml` 与 `uv.lock` 可以共享和审查，`.venv` 是这台机器据此恢复出的结果，可以重新生成。
- 不执行 `source .venv/bin/activate`；本课程统一用 `uv run` 明确说明“从当前项目环境运行”。
- 第 90 分钟仍有大面积下载问题时，停止等待，直接展示课前保存的成功画面；学生课后继续完成，不在课堂上反复更换软件源。

**转场：** 解释器路径已经证明环境正确；最后让这个环境真正运行项目，并观察一条只对本次运行可见的信息。

#### 让项目报告它实际使用了什么

> 程序报告事实，测试检查规则；先取得可观察证据，再讨论“应该如此”。

*翻页：能找到程序 ≠ 用对项目环境*

- 在项目根执行：

```bash
unset COURSE_MODE
COURSE_MODE=fixture uv run --locked python course_check.py
COURSE_MODE=fixture uv run --locked pytest -q
printenv COURSE_MODE
```

- 程序输出应包含项目 `ai-agents-lab`、版本 `0.1.0`、Python `3.12.x`、`project-env: PASS` 与 `course-mode: fixture`；此时签名仍可保持教师默认值 `teacher`。
- pytest 应全部通过；它只说明当前写下的规则通过，不代表所有可能的问题都已经被覆盖。
- 最后一条没有输出：`COURSE_MODE=fixture` 只把信息交给紧随其后的那次运行，没有永久写入 shell 或项目文件。
- 本课只收三句话：
  1. 当前目录决定相对文件路径从哪里开始解释；
  2. `PATH` 中能找到 Python，不代表它就是项目要求的 Python；
  3. uv 用项目文件恢复局部环境，并让运行过程给出可核对的证据。

**转场：** 项目已经能在明确环境中运行；最后一课时制造一个小改动，看 VS Code 和 Git 怎样共同记录它。

### 100-150 | 一个改动怎样成为本地历史？

> 修改并验证一项公开签名，用终端和 VS Code 观察同一个改动怎样从工作区进入暂存区，最终成为由 SHA 指认的本地 commit。

#### 先让工作区出现一个可验证的改动

> 从干净仓库开始，只修改一项程序能够报告的公开信息；先证明结果正确，再考虑提交。

**课前检查**

- [ ] 在没有全局 Git 身份的新仓库中完整走通 repo-local 身份、Stage、Commit 与 Source Control Graph；确认不会弹出 GitHub 登录。
- [ ] 准备终端路线作为 Source Control 操作失效时的 Plan B；本周任何情况下都不执行 `git push`，也不点击 Sync 或 Publish Branch。
- [ ] 准备一张已完成 commit 的 Source Control Graph 画面，作为界面版本不同或投影不清时的 Plan B。

*翻页：只改一项：公开签名*

- 切回 Explorer 根目录为 `w02-workbench` 的 VS Code 窗口，在仓库根确认起点：

```bash
cd ~/course/w02-workbench
pwd
git status --short
```

- `git status --short` 应没有输出；若已经存在改动，保留现场并直接求助，不执行 reset、restore 或覆盖。
- 在 Explorer 中打开 `warmups/week-02/course-check/signature.toml`，只把 `teacher` 改为本人公开课程代号，例如：

```toml
[student]
signature = "s07"
```

- 保存后立即验证程序确实读到了新值：

```bash
cd warmups/week-02/course-check
COURSE_MODE=fixture uv run --locked python course_check.py
cd ../../..
```

- 出口：程序显示新的公开代号与 `RUNTIME_CHECK=PASS`；不写姓名、完整学号、邮箱或其他个人信息。
- 提问：程序结果已经改变，GitHub 页面为什么没有改变？先保留问题，不急着讲 remote。

**转场：** 文件已经改变，但还没有进入本地历史。先用两个入口观察 Git 此刻究竟看见了什么。

#### 两个入口观察同一个 diff

> `git status` 报告哪些状态发生变化，`git diff` 展示工作区与暂存区之间具体变了什么。

*翻页：两个入口，同一个 diff*

- 在仓库根执行：

```bash
git status --short
git diff -- warmups/week-02/course-check/signature.toml
```

- 在 Source Control 中点击同一文件，核对图形 diff 与终端都显示 `teacher` 被替换为个人代号。
- 固定对应关系：
  - `git status` ↔ Source Control 中的状态列表；
  - `git diff` ↔ Changes 中尚未 Stage 的差异；
  - Explorer、Source Control 与终端观察的是同一个工作区，不需要互相同步。
- 让学生用一句话说明：改了哪个文件、旧值是什么、新值是什么；说不清就不进入 Stage。
- 明确：Git 的“追踪”不是保存每次键盘输入，而是比较当前状态与已经记录的状态。

**转场：** diff 已经能够解释。现在把“当前文件”与“下一次准备保存的快照”分开。

#### 把改动送入暂存区

> Save 写入工作区；Stage 选择下一次 commit 的内容；两者不是同一个动作。

*翻页：一个改动怎样成为历史？*

- 在 Source Control 的 Changes 中只对 `signature.toml` 选择 Stage Changes，观察它移动到 Staged Changes。
- 回到终端比较：

```bash
git status --short
git diff -- warmups/week-02/course-check/signature.toml
git diff --staged -- warmups/week-02/course-check/signature.toml
```

- 预期：普通 `git diff` 不再显示这项差异，`git diff --staged` 仍显示它；改动没有消失，只是进入了“下一次 commit 将包含什么”的快照。
- 固定一句话：**Save 改变工作区文件；Stage 选择下一次快照；Commit 才把快照写入本地历史。**
- 说明：Unstage 只把改动移回 Changes，不会删除文件内容；本节不使用 Discard Changes。

**转场：** 暂存区已经准确描述下一次快照；现在给它作者身份和一句说明，把它写入本地历史。

#### 用 commit 保存历史，用 SHA 找回它

> Commit 是带有作者、时间、说明和父级关系的历史节点；SHA 是 Git 用来指认这个节点的对象 ID。

*翻页：一个 commit，由 SHA 指认*

- 在仓库根设置仅属于这个练习仓库的公开身份；把示例代号替换为本人课程代号：

```bash
git config --local user.name "s07"
git config --local user.email "s07@example.invalid"
```

- 在 Source Control 的输入框填写固定提交信息并选择 Commit：

```text
w2: set public signature
```

- 第 140 分钟仍未完成提交时，统一切换终端 Plan B：

```bash
git add warmups/week-02/course-check/signature.toml
git commit -m "w2: set public signature"
```

- 提交后执行：

```bash
git log -1 --oneline
git show --stat --oneline HEAD
```

- 在 Source Control Graph 中找到同一个 commit：短 SHA、提交信息和改动文件应与终端一致。
- 完整对象 ID 指认一个 commit；界面和 `--oneline` 通常显示能够在当前仓库中消除歧义的短前缀。`HEAD` 表示当前所在的 commit，也可以把它换成明确的 SHA 交给 `git show`。
- 只介绍、不执行：`git revert <sha>` 不会删除旧 commit，而会新增一个反向 commit 来撤销它；查看历史用 `git show`，暂不进入 checkout 与 detached HEAD。

**转场：** 本地历史已经多出一个节点。最后证明它仍只存在于本机，而没有自动进入 GitHub。

#### 本地 commit 为什么没有改变 GitHub？

> Clone 取得历史并记录 remote；Commit 更新本地历史；只有 Push 才会尝试把本地 commit 发送给 remote。

*翻页：本地 commit 后，GitHub 会变化吗？*

- 在仓库根执行：

```bash
git status --short
git status -sb
git log -1 --oneline
git remote get-url origin
```

- 核对：第一条没有输出，说明工作区已经干净；第二条通常显示本地分支相对 `origin` 为 `ahead 1`；最新 commit 是 `w2: set public signature`；`origin` 仍指向教师仓库。
- 在 Source Control Graph 中观察这条 commit 处于 outgoing／尚未 push 的一侧；不同版本界面文字可以不同，以终端事实为准。
- 本周故意停在本地 commit，不点击 Sync 或 Publish Branch；W3 再处理个人 fork、认证、push 与 upstream。
- 做得快：完成 Guide 中任意一张独立挑战卡；做 0 张不影响本周完成状态，不提前进入 W3。
- 本周副本和 commit 不作为 W3 起点；下一周从新的正式仓库独立开始。

#### 本次课回顾

> Git 让改动经历可观察、可选择、可说明的过程；VS Code 把同一套状态可视化，但没有创造另一套 Git。

- Save 改变工作区，Stage 选择下一次快照，Commit 把快照写入本地历史。
- `git diff` 查看未暂存差异，`git diff --staged` 查看下一次 commit 将包含什么。
- 每个 commit 由对象 ID 指认；`git show` 用来查看，`git revert` 通过新 commit 撤销旧 commit。
- Commit 不等于上传；本地历史与 remote 只有在明确执行 Push 后才可能发生联系。
