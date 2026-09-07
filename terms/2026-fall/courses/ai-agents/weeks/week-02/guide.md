# W2 学生行动指南：不影响未来的本节课实验

> 本节实验只有一个目标：把同学 fork 中的 `course-check` 取得到自己的机器，在项目局部环境中运行并通过给定测试，看到同学留下的公开签名。

本实验不作为 W3 的起点。实验目录、签名和结果都不要求在后续课程中继续使用。

## 项目在哪里

教师课程仓库：<https://github.com/wxyinucas/ai-agents>

本节练习位于仓库中的：

```text
warmups/week-02/course-check/
```

`course-check 0.1.0` 是一个极小的环境体检程序。它不分析行情，也不要求你编写 Python；它只报告当前项目、Python、项目环境、运行模式和一项公开签名。

预期输出的形状是：

```text
project: ai-agents-lab
version: 0.1.0
python: 3.12.x
project-env: PASS
course-mode: fixture
signature: s07
RUNTIME_CHECK=PASS
```

`s07` 只是示例。课堂使用教师分配的公开课程代号，不在公开仓库写入姓名、真实学号或其他个人信息。

## 六类文件分别负责什么

- `.python-version`：说明练习希望使用 Python `3.12`；
- `pyproject.toml`：声明项目名称、项目版本、Python 范围和依赖；
- `uv.lock`：记录本次实际采用的依赖版本；
- `signature.toml`：保存本次实验要传递的公开签名；这是唯一需要改动的练习文件；
- `course_check.py`：读取并报告当前实际状态；
- `tests/`：用给定规则检查这些状态。

TOML 是一种配置文件格式。这里只需要认出“分区、键和值”即可：

```toml
[project]
name = "ai-agents-lab"
version = "0.1.0"

[student]
signature = "s07"
```

`pyproject.toml` 定义整个项目，`signature.toml` 只保存本节实验的签名。格式相同，不代表职责相同。

同步后出现的 `.venv/` 是 uv 在当前机器恢复出的项目局部环境。它不是从同学电脑复制来的，也不需要提交到 GitHub。

## 三种“版本”不要混在一起

- Python `3.12.x`：解释器版本；本课只要求都属于 `3.12` 系列；
- 项目 `0.1.0`：程序自身的版本，写作“主版本.次版本.修补版本”；本周只需要辨认；
- Git commit：仓库的一次源码快照；在 GitHub 网页保存签名时会自动形成一次 commit。

本实验不记录或交换 commit，只交换 fork URL。它因此只是一次课堂观察，不承担正式交付的精确版本保证。

## 本节实验的主链

```text
取得 → 定位 → 同步 → 运行 → 测试 → 观察
```

- **取得**：从同学的 fork 把项目 clone 到自己的机器；
- **定位**：确认远端来源、仓库根目录和练习目录；
- **同步**：根据 `pyproject.toml` 与 `uv.lock` 恢复项目环境；
- **运行**：让程序报告当前实际状态；
- **测试**：运行教师给定的外部检查；
- **观察**：确认签名来自同学，而不是模板中的 `teacher`。

前三步回答“究竟在运行什么”，后三步回答“它实际做了什么、给定检查是否接受”。

## 第二课时｜准备一份可被同学取得的 fork

### 1. 在 GitHub 网页中 fork

1. 打开 <https://github.com/wxyinucas/ai-agents>；
2. 使用 GitHub 的 **Fork** 功能，在自己的账号下建立 fork；
3. 确认浏览器显示的是自己账号下的仓库，而不是教师仓库。

本节使用公开仓库和 HTTPS URL。不要把 GitHub 密码、token 或 Cookie 发给教师、同学或 Chatbox。

### 2. 只修改公开签名

在自己的 fork 中打开：

```text
warmups/week-02/course-check/signature.toml
```

选择网页编辑，只把模板值 `teacher` 改成教师分配给你的公开课程代号。例如：

```toml
[student]
signature = "s07"
```

通过 GitHub 网页保存这次修改。随后重新打开该文件，确认：

- 当前仓库属于自己；
- 文件路径没有改变；
- 文件中不再是 `teacher`；
- 除签名值外没有修改其他内容。

不要在本节修改 Python、测试、`pyproject.toml` 或 `uv.lock`。

### 3. 只交换一个信息

从自己 fork 的 **Code → HTTPS** 复制仓库 URL，交给搭档。

```text
我交给同学的唯一信息：自己的 fork HTTPS URL
```

不发送 commit、签名代号、截图、压缩包或 `.venv`。签名应该由同学在运行结果中观察到。

## 可以交给 Chatbox 的简短 Prompt

```text
请按 W2 guide 带我完成“不影响未来的本节课实验”。每次只给一个操作，等我返回真实输出再继续，并说明当前是在取得、定位、同步、运行、测试还是观察。

只使用 guide 给出的 GitHub、Git 和 uv 路线。不要删除已有目录，不要修改测试、Python、pyproject.toml 或 uv.lock，也不要索取密码或 token。最终只根据真实输出判断是否看到同学而非 teacher 的签名。
```

Chatbox 的建议与本页冲突时，以本页为准。本地 Agent 的安装、授权和代码修改不属于本节实验。

## 第三课时｜在自己的机器运行同学的 fork

两人只交换 fork HTTPS URL。每个人都在自己的机器上操作，不接管同学的电脑。

### 1. 确认 WSL 与工具

下面所有命令都在 **Ubuntu / WSL Bash** 中执行：

```bash
uname -s
git --version
uv --version
```

最低预期：`uname -s` 输出 `Linux`，Git 和 uv 都能显示版本。工具缺失时只使用教师发布的安装路线，不运行搜索到的“一键配置”脚本。

### 2. clone 同学的 fork

先准备课程目录并确认实验目录尚不存在：

```bash
mkdir -p ~/course
cd ~/course
ls
```

把下面占位内容替换成同学发来的 HTTPS URL：

```bash
git clone "【同学的 fork HTTPS URL】" ~/course/w2-peer
cd ~/course/w2-peer
```

如果 `~/course/w2-peer` 已经存在，不要删除或覆盖；改用固定备用目录 `~/course/w2-peer-2`。两个目录都已存在时停止 clone，保留现场并告诉教师。

### 3. 定位远端、仓库和练习目录

```bash
git remote get-url origin
git rev-parse --show-toplevel
cd warmups/week-02/course-check
pwd
ls -a
```

核对：

- `origin` 是同学发来的 fork URL；
- Git 根目录是刚刚 clone 的 `w2-peer`；
- 当前目录以 `warmups/week-02/course-check` 结尾；
- 当前目录存在 `.python-version`、`pyproject.toml`、`uv.lock`、`signature.toml`、`course_check.py` 和 `tests/`。

不要提前打开 `signature.toml` 寻找答案；让程序输出完成这次观察。

### 4. 恢复项目局部环境

确认仍在练习目录后运行：

```bash
uv sync --locked
uv run --locked python -c 'import sys; print(sys.executable)'
```

最低预期：同步正常结束，第二条命令显示的 Python 位于当前练习目录的 `.venv` 中。

第一次同步可能需要下载 Python 或测试依赖。不要删除锁文件、改用另一种包管理器或反复重建环境。

### 5. 运行体检程序

```bash
COURSE_MODE=fixture uv run --locked python course_check.py
```

核对七行关键信息：

```text
project: ai-agents-lab
version: 0.1.0
python: 3.12.x
project-env: PASS
course-mode: fixture
signature: 同学的公开课程代号
RUNTIME_CHECK=PASS
```

Python 补丁版本和绝对路径可以与教师不同。签名必须是同学的公开课程代号，不能仍然是 `teacher`。

### 6. 运行给定测试

```bash
COURSE_MODE=fixture uv run --locked pytest -q
```

最低预期：测试摘要全部为 `passed`，没有 `failed` 或 `error`。

程序负责报告事实，测试负责按照给定规则检查事实。测试通过只说明当前练习覆盖的规则通过了，不说明所有可能功能都正确。

### 7. 只记录三项结果

```text
我的机器：通过 / 未通过
看到的同学代号：
一项观察：
```

完成标准：自己的机器成功运行程序与给定测试，并且程序显示的是同学的公开课程代号，而不是 `teacher`。

如果未通过，把“最后成功到哪一步，以及实际看到了什么”压缩成第三项观察；本节不增加新的状态码、表单或交付物。

## 为什么要让别人再运行一次

数值试验不能只满足于“在我的电脑上得到了结果”。我们还希望别人能够在相同条件下，稳定地复现这个结果。

为此，需要把可能影响结果的条件写清楚并尽量固定下来，例如代码和软件的版本、使用的数据与配置，以及随机过程中的随机种子。本周会先认识“版本”在其中的作用；其他条件等到后续真正进行数值试验时再处理。

这个小实验只让我们体验最基本的一步：一项改动离开原来的电脑以后，能不能在另一台机器上重新出现。

## 遇到这些情况，先停一下

出现下面任何一种情况时，不要继续猜，也不要为了得到绿色结果反复尝试。保留当前画面，告诉教师你已经做到哪一步、实际看到了什么：

- 已经进入课堂最后 10 分钟；
- 你说不清当前终端位于哪个目录，或者正在运行谁的仓库；
- `~/course/w2-peer` 与备用目录 `~/course/w2-peer-2` 都已存在，或者远端不是同学的 fork；
- Chatbox 建议你删除目录、强制重置、修改测试或改写 `uv.lock`；
- 网页或命令要求提供密码、token、Cookie 等敏感信息；
- 同一个操作已经失败多次，而且没有出现新的线索。

停下来不等于失败。留下真实现场，通常比继续随机操作更容易解决问题。

W3 从教师届时发布的新入口开始，不继承本节实验目录、签名或结果。
