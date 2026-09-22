# W2｜看清项目的位置、环境与版本

> W2 · 3 × 50 min · 约 30 名学生，按零编程基础设计 · 无助教

## 知识地图

- **Road map：从可接续工作台进入可运行、可追踪的项目**
  - 看清工作位置
    - VS Code 是统一工作台，Integrated Terminal 是终端界面，WSL Bash 负责解释命令
    - 命令、选项、参数与路径共同决定一次操作作用在哪里
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

## 本次课 · 用同一个项目看清位置、环境和版本

### 0-50 | 我在哪里，这条命令在做什么？

> 在 VS Code 的 WSL 工作区中取得 `course-check`，能拆开一条命令，并用路径判断它会作用于哪里。

#### 认识统一工作台

> VS Code 负责把文件、终端和运行结果放在一起；真正解释本周命令的是 WSL Bash。

**课前检查**

- [ ] 在真实 Windows + WSL 2 设备中，从 WSL 执行 `code .`，确认 VS Code 左下角显示 `WSL: Ubuntu`，新建终端后 `uname -s` 输出 `Linux`。
- [ ] 确认 Windows 版 VS Code、Microsoft WSL 扩展、Git 与 uv 可用；保存一张 WSL 工作区和集成终端的真实画面作为 Plan B。
- [ ] 在干净目录完整走通本周全部命令；演示仓库路径固定为 `~/course/w02-workbench`，课前不得留下同名目录。

*翻页：认识统一工作台*

- 展示：VS Code 窗口、Explorer、编辑器与 Integrated Terminal 是同一个工作台里的不同区域。
- 展示：在集成终端运行：

```bash
uname -s
pwd
echo "$SHELL"
```

- 明确：Integrated Terminal 只是终端界面；本周在其中运行的是 WSL Bash，`git`、`uv`、`python` 才是稍后被调用的程序。
- 明确：管理员 PowerShell 继续只负责 Windows 与 WSL 的系统级操作；取得项目的第一组命令可在外部 WSL Bash 中执行，`code .` 打开项目后统一转入 VS Code 的 WSL Bash 集成终端。

**转场：** 工作窗口已经确定；先取得贯穿本周的同一个项目，Git 的含义留到第三课时再打开。

#### 取得项目，暂不展开 Git

> `git clone` 此时只作为取得课堂材料的固定动作；第三课时再解释它留下了什么关系。

*翻页：取得项目，暂不展开 Git*

- 展示后让学生依次执行：

```bash
mkdir -p ~/course
git clone https://github.com/wxyinucas/ai-agents.git ~/course/w02-workbench
cd ~/course/w02-workbench
code .
```

- 检查：VS Code 左下角仍是 `WSL: Ubuntu`；Explorer 顶层目录是 `w02-workbench`；集成终端 `pwd` 以 `/course/w02-workbench` 结尾。
- 停止条件：目标目录已经存在时不删除、不覆盖、不继续 clone；按 Guide 改用 `~/course/w02-workbench-2`。
- 说明：这一份本地副本只服务本周观察，不是 W3 的正式项目起点。

#### 命令有结构

> 不必背完命令；先能认出“调用谁、附加什么选项、把什么交给它”。

*翻页：命令有结构*

- 展示：

```bash
ls -la warmups/week-02/course-check
```

- 拆开：
  - `ls`：命令；
  - `-la`：选项，改变命令的行为；
  - `warmups/week-02/course-check`：参数，指定命令作用的对象。
- 补充统一形状：

```text
command [subcommand] [options] [arguments]
```

- 展示：用 `ls --help` 查帮助；用 Tab 补全路径、方向键调出历史命令、`Ctrl+C` 停止当前命令。
- 强调：短选项、长选项和位置参数并非所有程序完全相同；看 `--help` 比猜语法可靠。

#### 路径决定作用对象

> `~`、`.`、`..` 与当前目录共同决定一条相对路径指向哪里。

*翻页：路径决定作用对象*

- 从仓库根目录逐条执行，并在 Explorer 中同步指出当前目录：

```bash
pwd
ls
cd warmups/week-02/course-check
pwd
ls -la
cat signature.toml
cd ..
pwd
cd course-check
```

- 解释：
  - `~`：当前用户的 home；
  - `.`：当前目录；
  - `..`：上一级目录；
  - 以 `/` 开头的是绝对路径，不以 `/` 开头的是相对路径。
- 路径中有空格时统一加引号；不依赖“终端看起来像在某处”的感觉，只相信 `pwd` 的真实输出。

*翻页：两个根目录，不是一回事*

- 仓库根：`~/course/w02-workbench`，包含整个课程练习仓库；
- 项目根：`~/course/w02-workbench/warmups/week-02/course-check`，包含本周 Python 项目的声明、源码和测试；
- 一条命令可以从仓库根运行，也可以要求先进入项目根；“已经打开仓库”不等于“当前终端位于项目目录”。

#### 把命令重新组合起来

> 学生能够独立定位仓库根和项目根，并说明一条命令的组成，而不是继续照抄整段命令。

- 让学生完成四个动作：
  1. 从项目根用 `pwd` 证明自己在哪里；
  2. 用 `cd ../../..` 回到仓库根，再用 `pwd` 核对；
  3. 只凭相对路径重新进入 `warmups/week-02/course-check`；
  4. 用一句话拆解 `ls -la .` 中的命令、选项和参数。
- 做得快：从 `ls --help` 找到一个课堂未讲的选项，先预测效果，再在项目目录验证；不安装新工具，不删除或移动文件。
- 第 45 分钟停止新挑战，所有人回到项目根并保持 VS Code 窗口不关闭。

**转场：** 路径回答“命令在哪里发生”；下一课时继续问，同一个目录里的程序究竟使用哪一个 Python 和哪一组依赖。

### 50-100 | 程序究竟使用哪个环境？

> 分清机器可调用的工具、项目自己的运行环境和只对一次命令可见的信息，并用 uv 运行同一个项目。

#### 三种作用范围

> “全局／局部”描述可见范围和归属，不代表高级／低级，也不等同于 Git 的 local／remote。

*翻页：三种作用范围*

- 机器或用户级：`git`、`uv`、`code` 可以服务多个项目，shell 通过 `PATH` 找到它们；
- 项目级：`.python-version`、`pyproject.toml`、`uv.lock` 与 `.venv` 围绕当前项目组织；
- 单次进程级：`COURSE_MODE=fixture` 只把信息交给紧随其后的那次运行。
- 展示：

```bash
command -v git
command -v uv
command -v code
```

- 收束：本周所谓“全局工具”是多个项目可调用的入口；“项目局部环境”是当前项目按自己的声明恢复出的运行条件。

#### 项目用文件说明自己

> 项目声明“需要什么”，锁文件记录“这次采用什么”，`.venv` 是当前机器据此恢复出的结果。

*翻页：项目用文件说明自己*

- 在 Explorer 中只打开并指出：
  - `.python-version`：希望使用 Python `3.12`；
  - `pyproject.toml`：项目名、版本、Python 范围与依赖；
  - `uv.lock`：解析后的精确依赖版本，由 uv 管理；
  - `.venv/`：本机项目环境，可以重新生成，不提交到 Git。
- 不逐行讲 TOML，只要求认出分区、键和值；不手动编辑 `uv.lock` 或 `.venv`。
- 项目版本 `0.1.0` 与 Python 版本 `3.12.x` 回答不同问题，本课只要求会辨认。

#### 用 uv 恢复项目环境

> `uv sync` 根据项目文件准备环境，`uv run` 明确从该环境启动命令，不依赖手动激活。

**课前检查**

- [ ] 在删除本地 `.venv` 的干净副本中完整跑通 `uv sync --locked`，确认网络正常并记录首次下载所需时间。
- [ ] 保存同步成功输出、项目 Python 绝对路径和 `.venv` 出现在 Explorer 中的三张画面；第 70 分钟仍有大面积网络问题就切换到教师画面。

*翻页：用 uv 恢复项目环境*

- 在项目根执行：

```bash
uv --version
uv sync --locked
uv run --locked python -c 'import sys; print(sys.executable)'
```

- 检查：最后一条输出指向当前 `course-check/.venv/` 中的 Python。
- 在 Explorer 中显示 `.venv`，再回到 `pyproject.toml` 与 `uv.lock`：前两者是可共享的项目说明，`.venv` 是这台机器上的恢复结果。
- 不执行 `source .venv/bin/activate`；本课程统一用 `uv run` 明确每次运行属于哪个项目。

#### 让信息只对一次运行可见

> 环境变量可以改变一次进程看见的信息，而不必永久改写程序或项目文件。

*翻页：让信息只对一次运行可见*

- 先让学生预测，再逐条执行：

```bash
unset COURSE_MODE
printenv COURSE_MODE
COURSE_MODE=fixture printenv COURSE_MODE
printenv COURSE_MODE
```

- 预期依次看到：空、`fixture`、再次为空。
- 解释：`COURSE_MODE=fixture` 只对紧随其后的进程可见；它不是写入 `signature.toml` 的项目配置，也没有成为全局永久设置。
- 本周只使用无敏感信息的课堂模式；token、密码、Cookie 与 `.env` 不进入演示、记录或提交。

#### 程序报告事实，测试检查规则

> 程序把当前状态显示给人，测试按照预先写下的规则检查其中一部分；二者不能替代人的判断。

*翻页：程序报告事实，测试检查规则*

- 在项目根执行：

```bash
COURSE_MODE=fixture uv run --locked python course_check.py
COURSE_MODE=fixture uv run --locked pytest -q
```

- 运行结果应包含：项目 `ai-agents-lab`、版本 `0.1.0`、Python `3.12.x`、项目环境与运行模式通过，以及当前签名。
- pytest 应全部通过；此时签名仍可以是教师默认值 `teacher`，说明“测试覆盖的规则通过”不等于“所有课堂目标已经完成”。
- 让学生指出复合命令的层次：环境变量 → `uv run` 及其选项 → 被启动的 `python` 或 `pytest` → 各自参数。

#### 全局配置与项目配置各自承担什么？

> 个人默认可以放在用户级；决定项目能否复现的条件，应尽量随项目一起被看见、审查和共享。

*翻页：全局配置与项目配置各自承担什么？*

- WSL 用户级 uv 配置可以放在 `~/.config/uv/uv.toml`，影响这个用户随后操作的多个项目；
- 项目级 uv 配置可以放在项目 `uv.toml`，或写在 `pyproject.toml` 的 `[tool.uv]` 中；
- 用户级配置的优点是个人默认只设置一次，代价是对同伴不可见、换机器时容易遗漏；
- 项目级配置的优点是随项目共享、可审查、容易复现，代价是每个项目都要明确维护；
- `pyproject.toml` 中的依赖声明和 uv 自身的行为配置不是一回事。本课只识别边界，不现场创建配置文件。

**转场：** 项目已经能在明确环境中运行；最后一课时制造一个小改动，看 VS Code 和 Git 怎样共同记录它。

### 100-150 | 改动在哪里，怎样被记录？

> 在 VS Code 中修改公开签名，用终端与 Source Control 核对同一份 diff，再把它保存为只存在于本机的 Git commit。

#### 本地与远端不是同一个地方

> clone 建立本地仓库并记住 remote；本地文件和本地 commit 都不会自动改变 GitHub。

*翻页：本地与远端不是同一个地方*

- 回到仓库根执行：

```bash
cd ~/course/w02-workbench
git remote -v
git branch --show-current
git status --short
```

- 若第一课时使用了备用目录，第一条改为 `cd ~/course/w02-workbench-2`。

- 指出三个位置：
  - 工作区：Explorer 中当前可编辑的文件；
  - 本地仓库：`.git/` 中保存的历史与配置；
  - remote：`origin` 记录的网络仓库地址。
- `git clone` 同时取得文件和历史，并把来源记为 `origin`；它不意味着以后每次本地修改都会自动上传。
- 本周不登录 GitHub、不 push、不配置第二个 remote；只把本地状态看清。

#### 制造一个可解释的本地改动

> 只改一项公开签名，让后面的 diff、运行结果和 commit 都有清楚含义。

*翻页：制造一个可解释的本地改动*

- 在 Explorer 中打开：

```text
warmups/week-02/course-check/signature.toml
```

- 只把 `teacher` 改为本人公开课程代号，例如：

```toml
[student]
signature = "s07"
```

- 保存文件；不写姓名、完整学号、邮箱或其他个人信息。
- 观察：Explorer 标签出现未提交状态，Source Control 出现一个 Changes 项；这不是报错，而是 Git 发现工作区与上一次提交不同。

#### 终端与 Source Control 看见同一个 diff

> 图形界面和命令行不是两套状态；它们只是观察同一个 Git 工作区的两种入口。

*翻页：终端与 Source Control 看见同一个 diff*

- 在仓库根执行：

```bash
git status --short
git diff -- warmups/week-02/course-check/signature.toml
```

- 在 Source Control 中点击同一文件，核对删除行与新增行和终端 diff 一致。
- 固定对应关系：
  - `git status` ↔ Source Control 的 Changes；
  - `git diff` ↔ 差异视图；
  - `git add` ↔ Stage Changes；
  - `git commit` ↔ Commit。
- 让学生用一句话说明：改了哪个文件、旧值是什么、新值是什么；说不清就不进入提交。

#### 把改动保存成本地提交

> 暂存选择“这次提交包括什么”，commit 把所选改动保存为本地历史；remote 仍保持不变。

**课前检查**

- [ ] 在无全局 Git 身份的新仓库中验证 repo-local 身份、Source Control 暂存与 commit 流程；确认不会弹出 GitHub 登录。
- [ ] 准备终端路线作为 Source Control 操作失效时的 Plan B；本周任何情况下都不执行 `git push`。

*翻页：把改动保存成本地提交*

- 先在仓库根设置仅属于这个练习仓库的公开身份；把示例代号替换为本人课程代号：

```bash
git config --local user.name "s07"
git config --local user.email "s07@example.invalid"
```

- 在 Source Control 中只暂存 `signature.toml`，提交信息固定为：

```text
w2: set public signature
```

- Source Control 无法完成时使用终端 Plan B：

```bash
git add warmups/week-02/course-check/signature.toml
git commit -m "w2: set public signature"
```

- 提交后核对：

```bash
git status --short
git log -1 --oneline
git remote -v
```

- 预期：`git status --short` 没有输出；`git log` 显示刚才的本地提交；`origin` 仍是教师远端，GitHub 页面没有变化。

*翻页：本地 commit 后，GitHub 会变化吗？*

- 不会；commit 保存本地历史，push 才会尝试把本地历史发送给远端。
- 本周故意停在 commit：先把 local／remote 分清，再在 W3 的正式项目中处理个人 fork、认证与 push。

#### 带着四项证据结束

> 最终画面同时说明：位置正确、项目环境正确、运行通过、本地历史已经记录；任何一项都不能由“应该如此”代替。

*翻页：带着四项证据结束*

- 在项目根重新运行：

```bash
pwd
COURSE_MODE=fixture uv run --locked python course_check.py
COURSE_MODE=fixture uv run --locked pytest -q
git -C ../../.. log -1 --oneline
```

- 核对：
  - `pwd` 以 `warmups/week-02/course-check` 结尾；
  - Python 来自项目 `.venv`，程序显示本人公开代号；
  - pytest 全部通过；
  - 最新本地 commit 是 `w2: set public signature`。
- 做得快：完成 Guide 中任意一张独立挑战卡；做 0 张不影响本周完成状态，不提前进入 W3。
- 本周副本和 commit 都不作为 W3 起点；下一周从新的正式仓库独立开始。

#### 本次课回顾

> 同一个项目可以从位置、运行条件和版本状态三个层面被核验；VS Code 把这些证据放进同一个工作台，但没有替我们作出判断。

- 命令由程序、子命令、选项和参数组成；路径决定它作用于哪里。
- `uv` 是可被多个项目调用的工具，`.venv` 是当前项目按声明恢复出的局部环境，环境变量还可以只影响一次运行。
- 工作区、本地 commit 与 remote 分属不同位置；Source Control 与 Git 命令观察的是同一份状态。
- 程序输出、测试、diff 和 commit 分别回答不同问题；它们合在一起，才足以说明本周项目确实按预期运行并留下记录。
