# W5 学生指南：操作、遍历与核验

本周继续使用已有的 `ai-agents` 仓库，在 `week-05/` 练习。材料、Notebook 和测试只维护在[课程仓库](https://github.com/wxyinucas/ai-agents/tree/main/week-05)，不改 W2～W4 的环境与成果。

> **本周 CI 重点操作：先在自己的 GitHub 仓库启用 Actions。** 三道基础题的改动提交并 push 后，进入 **Actions → W5 data operations**，核对本次提交的 **student** 检查结果。具体步骤见下文“重点操作：启用 Actions，提交并查看 CI”；教师仓库的绿色结果不能代替自己的验收。

## 开场 5 分钟：确认 uv 环境，安装 NumPy

课堂开始先完成下面的核验：uv 工具可调用，本周 Python 环境正确，NumPy 能导入并生成数组。

### 1. 确认 uv 工具可调用

在 VS Code 的 WSL Terminal 中执行（macOS 使用已有终端）：

```bash
uv --version
```

应看到 `uv` 的版本号。这一步只确认工具可用，后面还要核对实际使用的 Python 环境。

### 2. 更新材料，进入 W5 项目

在已有仓库的 Terminal 中先确认远端：

```bash
cd ~/course/w02-workbench
git remote -v
```

找到指向 `wxyinucas/ai-agents` 的教师 remote，只选对应的一条更新命令：

- 教师仓库叫 `upstream`：`git pull --no-rebase upstream main`。
- 教师仓库仍叫 `origin`：`git pull --no-rebase origin main`。

有本地改动、合并冲突或其他报错时，把实际输出交给 Agent，先解释状态，再保留已有成果并完成更新；不要重新 clone 或删除项目。

更新成功后进入本周目录，核对 `pwd` 输出的路径末尾为 `week-05`：

```bash
cd ~/course/w02-workbench/week-05
pwd
```

### 3. 安装 NumPy 与本周依赖

NumPy 是用于数组和数值运算的 Python 库。本周的 `pyproject.toml` 已声明 NumPy，`uv.lock` 已记录要安装的版本；在刚才的 `week-05/` 执行：

```bash
uv sync --locked
```

这条命令按锁文件建立或同步本周自己的 `.venv/`，安装 Python 3.12 对应的依赖，包括 NumPy、pytest 与 Notebook kernel；已经安装的依赖会复用。保留 W2～W4 的独立环境，不用 `uv init` 重建项目。

给新项目首次添加 NumPy 依赖通常用 `uv add numpy`；本周已经声明并锁定，直接同步即可，无须再次执行添加命令。

### 4. 核对 Python 环境，实际导入 NumPy

继续在同一目录执行：

```bash
uv run --locked python -c "import sys; print(sys.executable); print(sys.version.split()[0])"
uv run --locked python -c "import numpy as np; print(np.__version__); print(np.array([1, 2, 2, -1]))"
```

核对三项结果：

- 解释器路径位于本周的 `week-05/.venv/`，而不是 W4 或系统 Python。
- Python 版本为 `3.12.x`。
- 能看到 NumPy 的实际版本号和包含 `1、2、2、-1` 的数组，没有导入错误。

完成后打开本周目录：

```bash
code .
```

uv 找不到、更新冲突或下载受阻时，保留当前目录、命令和实际输出，请 Agent 协助定位。前 5 分钟仍未完成的同学先跟看演示，练习时再处理；不要通过重建仓库、修改锁文件或切到其他周的环境来消除报错。

## 先用 Notebook 跟练

下面两种方式任选一种，均使用本周的 Python 环境。

### 方式一：在 VS Code 中打开

在 Explorer 打开 `demo.ipynb`，右上角选择 `week-05/.venv` 对应的 kernel。使用已有的 Python／Jupyter 扩展；找不到环境时，给 Agent 看实际界面。

### 方式二：用 uv 启动 Jupyter 网页版

先完成前面的 `uv sync --locked`。首次使用网页版时，在本周目录登记一个 kernel，让网页使用本周 `.venv`：

```bash
cd ~/course/w02-workbench/week-05
uv run --locked python -m ipykernel install --user --name ai-agents-w5 --display-name "W5 Python 3.12"
```

之后每次在 `week-05/` 启动网页，只需：

```bash
uv run --locked --with notebook jupyter notebook
```

`--with notebook` 会临时提供网页程序，保留本周的依赖配置和锁文件。首次可能需要下载；浏览器未自动打开时，打开终端打印的完整本机网址，以实际显示的端口为准。

在网页文件列表打开 `demo.ipynb`，点击右上角的 kernel 名称，选择 **W5 Python 3.12**；`challenges/demo.ipynb` 也选择它。首次可在临时代码 cell 运行 `import sys; print(sys.executable)`，核对路径仍位于 `week-05/.venv/`。

授课期间保持这个终端运行；结束时回到终端按 **Ctrl+C**，并按提示确认关闭服务。

### 运行与小练习

终端导入成功后，Notebook 也要选择同一个本周环境；若 Notebook 仍报找不到 NumPy，先核对右上角的 kernel。

Notebook 已提供完整短例子和明确输出，不需要从空白重新输入整节课的代码。各组代码都重建自己的起始数据，可按段运行，也可重启 kernel 后 Run All。

每遇到一处“小练习”，做这三步：

1. 先在自己的笔记或 Markdown cell 写下预测。
2. 运行已有代码，再按要求只改一处，重新运行。
3. 对照题目指定的结果；不一致时检查本组初态和实际修改。

关注两个独立问题：**原对象改变了吗？调用返回了什么？** `pop()` 可以同时修改原对象并返回被取出的值。

需要帮助时可以发送：

```text
我在 week-05/demo.ipynb 做这一处小练习，代码和实际输出如下：……。
我的预测是：……。
先解释每次取出了什么、哪一步修改了对象、最后返回或打印了什么。
不要替我改代码；给我一个只改一处的提示，让我自己运行核对。
```

[TEACHER-NOTES.md](https://github.com/wxyinucas/ai-agents/blob/main/week-05/TEACHER-NOTES.md) 提供公开的练习答案，核对前先留下自己的预测。Notebook 是课堂练习，不是 CI 的验收对象。

## 最后的三道任务

打开 `EXPERIMENT.txt` 和 `operations.py`。规格与测试均已给定，和 Agent 在函数壳内实现，不要求背诵定义函数的语法。

- `pop_last(items)`：原地删除列表末项并返回它；空列表返回 `None`，保持为空。
- `positive_squares(values)`：接收整数列表或一维整数数组，返回正数项平方组成的新列表，保留顺序与重复项，不改输入。
- `positive_square_map(record)`：接收字符串键、整数值的字典，保留正数值的键并计算平方，返回新字典，不改输入。

例如 `[1, 2, 2, -1]` 的正数平方结果是 `[1, 4, 4]`，不是去重后的结果；`0` 也不应被保留。完整边界以 `EXPERIMENT.txt` 为准，不增加非法输入、浮点数或多维数组处理。

## 先认识测试反馈，再实现

以下命令都在 `week-05/` 执行。先检查公开参考，再看故障对照：

```bash
uv run --locked pytest -q --impl=reference
uv run --locked pytest -q --impl=broken
```

- `reference` 应通过；`broken` 应出现具体断言失败，这是故障被发现的正常结果。
- 选一条失败，区分返回值不对、原对象变化不对，或应该保留的输入被修改。
- 语法、导入和环境错误不是“发现了题目中的故障”。

`--impl` 是课程工具增加的参数：`student` 检查 `operations.py`，`reference`／`broken` 检查只读的 `examples.py`。初始学生函数尚未实现，默认测试会失败，不是你安装错了。

然后与 Agent 合作：

```text
阅读 EXPERIMENT.txt、operations.py 和公开测试，逐题与我确认原输入怎样变化、应返回什么。
在 operations.py 实现三个函数，不修改教师测试、examples.py 或候选切换工具。
再在 tests/test_student.py 增加一组我选的输入：……；我预测的结果是：……。
运行默认测试，给出实际结果和 diff；最后带我读一段实现，等我核对。
```

本人重跑学生实现的验收：

```bash
uv run --locked pytest -q
```

这条命令默认检查 `student`，包含教师验收和自己的测试。不要用 `--impl=reference` 的绿色结果代替自己的完成情况。循环或推导式都可以，不按源码关键词评分。

## 重点操作：启用 Actions，提交并查看 CI

> **按顺序完成：个人仓库启用 Actions → 提交并 push 作业 → 查看本次提交的 CI。** 开始三道基础题前先启用，完成代码后再回来读结果。

### 1. 确认个人远端，先启用 Actions

回仓库根目录检查：

```bash
cd ~/course/w02-workbench
git remote -v
git status -sb
git diff -- week-05/operations.py week-05/tests/test_student.py
```

`origin` 应指向你自己的 GitHub 仓库；教师仓库保留为 `upstream`。如果 origin 仍指向 `wxyinucas/ai-agents`，沿用 W3 的个人远端接续方式，让 Agent 帮你核对后配置，不要向教师仓库直接 push。

在浏览器打开**自己的 GitHub 仓库**，确认地址中是自己的用户名，然后：

1. 点击 **Actions**；首次使用 fork 时，若出现启用提示，按页面提示启用工作流。
2. 在左侧选择 **W5 data operations**；如果显示禁用，点击 **Enable workflow**。
3. 找不到这个工作流时，先确认个人仓库已同步本周材料，包含 `.github/workflows/week-05.yml`，请 Agent 协助核对。

### 2. 提交并 push 本周作业

确认文件属于自己的作业后：

```bash
git add -- week-05/operations.py week-05/tests/test_student.py
git diff --cached
git commit -m "Complete W5 data operations exercises"
git push origin main
```

`week-05/` 的作业改动 push 后会自动触发检查。

### 3. 打开对应提交，核对 student 结果

在个人仓库的 **Actions → W5 data operations** 中打开与本次提交一致的运行：

- 学生仓库默认检查 `student`；教师原仓库默认检查 `reference`，两种绿色结果含义不同。
- **核对提交编号，打开 W5 acceptance，确认测试步骤为 Run student acceptance tests，再查看通过／失败。**
- 红色时打开失败步骤，找到一条具体断言或环境错误；修改后重新提交，再看新的运行。

**已经 push，但启用后没有本次提交的运行？** 在该工作流页面点击 **Run workflow**，Branch 选择 `main`，implementation 选择 `student`，再点击 **Run workflow**；打开新运行并核对提交编号。不要向 Agent 提供密码或 token。

CI 是在远端重复本地的锁定环境和同一套检查，不会替你修改代码，也不证明未被测试覆盖的行为都正确。

网络、Actions 开关或推送受阻时，保留本地默认测试的真实输出，先完成同一套验收。记录“本地通过、远端未完成”，不用为等待 CI 停止练习。

## 与 Agent 合作：三道综合选做题

课堂默认从 A 题开始，按 **20～30 分钟的合作活动**准备；提前完成者可继续 B、C，自学时也可任选一题，不要求全部完成。它们组合本周已有知识，使用独立函数壳和验收，不改变原三道基础题。

先打开 `challenges/demo.ipynb`，沿用本周 `.venv` kernel；每题先展示题目与输入示例，后面是完整参考代码、运行结果和边界核对。停在题目处与 Agent 合作，再按课堂进度查看解答。完整规格与验收命令见[综合题说明](https://github.com/wxyinucas/ai-agents/blob/main/week-05/challenges/README.md)。选择：

- **A｜保留首次顺序，统计重复情况**：整数列表 → 首次出现顺序的去重列表、频数字典、重复值集合。核对顺序、重复次数和空输入。
- **B｜应用一批修改，报告最终变化**：原字典 + 有序更新清单 + 删除清单 → 新字典、最终发生变化的键。先更新后删除；改回原值不算最终变化。
- **C｜对齐两次测量，找出超阈值变化**：编号 + 两次一维整数数组 + 阈值 → 变化量数组、异常编号列表、正常新值字典。检查正负方向；等于阈值正常。

每题都写明允许的输入、完整预期结果、输入是否改变和边界规则。约 5 分钟核对示例并预测另一组输入，10～15 分钟与 Agent 实现、测试，5～10 分钟亲自检查并解释一个边界。编码提前完成后，直接进入核验。

在 `challenges/work.py` 只实现所选题。以下以 A 为例，命令在 `week-05/` 执行：

```bash
uv run --locked pytest -q challenges -k summarize --challenge-impl=student
```

选 B 时，将 `-k summarize` 改为 `-k apply_changes`；选 C 时改为 `-k compare_measurements`。初始函数壳报未实现是正常起点。

可以把选中题目连同以下提示交给 Agent：

```text
我选 W5 综合题……。先读 challenges/README.md 和给定测试，不马上实现。
和我核对题目示例及我选的另一份输入，完整预期结果是：……。
确认后在 challenges/work.py 实现这一题，在 challenges/test_my_cases.py
用同名 fixture 加入我的输入与预期，不直接导入参考实现、不修改教师测试。
测试函数名包含 summarize、apply_changes 或 compare_measurements 中对应的题目关键字，
例如 test_my_summarize_case，确保 -k 能选中我的测试。
运行所选题的 student 验收，给我实际结果和 diff。
最后沿一个元素或键带我读实现，解释原输入是否改变，以及一个边界。
```

本人重跑验收，保留不同输入的预期、实际结果和一条边界解释即可。公开参考与故障对照的命令见题目说明。

综合题使用单独的验收命令；本周默认测试和 CI 仍检查原三道基础题，不要求完成未选择的综合题。

## 完成后还能做什么

- 给三题各换一组输入，增加自己能解释的测试。
- 将列表结果改成 set 或数组，对照重复项、顺序和结果类型；这些是 Notebook 拓展，不改变三题的固定返回类型。
- 用普通循环和推导式分别实现同一个遍历任务，对照测试结果。

保留一条事前预测、一条失败修正和最终默认测试结果即可，不要求长报告或完整 Agent 对话。

## 遇到问题怎么求助

```text
我在已有 ai-agents 仓库完成 W5，当前目录、命令与实际输出如下：……。
先只读核对环境、Git remote、当前提交和验收模式，解释错误发生在哪一层。
保留 W2～W4 成果，不删除仓库、不丢弃提交、不修改教师测试来消除失败。
给出下一步及影响，等我确认后再处理。
```

macOS 同学在相同仓库、本周目录中执行同样的 uv、pytest 命令，Notebook 也选本周 `.venv`，无需 WSL。

## 参考材料

- [Software Carpentry：Lists](https://swcarpentry.github.io/python-novice-gapminder/11-lists.html)、[For Loops](https://swcarpentry.github.io/python-novice-gapminder/12-for-loops.html)：短例子、小练习与答案。
- [赫尔辛基大学 Python MOOC：Lists](https://programming-26.mooc.fi/part-4/3-lists/)、[List comprehensions](https://programming-26.mooc.fi/part-11/1-list-comprehensions/)：数据操作、函数／方法与推导式的展开。
- [NumPy 官方入门](https://numpy.org/doc/stable/user/absolute_beginners.html)：数值数组与基本操作。
