# W8｜从新项目到数据分析

本指南以 `~/course/ai-agents` 为课程仓库路径。已有的 `~/course/w02-workbench` 可以继续使用，只需把下面的仓库路径前缀替换为实际位置；不用重新 clone 或改名。

你在自己的 **VS Code 中与 Agent 开发项目**。课堂 Notebook 由教师展示，不是本周需要填写或提交的练习本。

本周依次做三件事：建立并修改分析项目，接入 R／MATLAB 编辑工作台，再使用教师提供的外部数据。

## 获取材料，建立自己的项目

### 更新已有课程仓库

在之前 clone 的工作台根目录查看状态和 remote，例如：

```bash
cd ~/course/ai-agents
git status -sb
git remote -v
```

先保存自己的改动，再从指向 `wxyinucas/ai-agents` 的 remote 更新。按实际情况选一条：

- `origin` 指向教师仓库：`git pull --no-rebase origin main`
- `upstream` 指向教师仓库：`git pull --no-rebase upstream main`

有本地改动、冲突或不明 remote 时，请 Agent 先解释当前状态，帮助保留已有工作，再完成更新。材料在 `week-08/`；不需要再次 clone。

### 新建分析项目

下面在课程仓库之外建立本周项目。Windows 用户继续使用 WSL 终端；已有同名项目就先确认内容，不确定时求助。

```bash
mkdir -p ~/course/w08-analysis
cd ~/course/w08-analysis
uv init --bare --python 3.12
uv add numpy matplotlib
uv add --dev pytest
code .
```

在新窗口里使用已有 Agent，确认它操作的是 `w08-analysis`。本周学生主线不需要安装 Jupyter 或数据库。

## 教学点一：完成分析，再应对需求变化

### 第一轮：让分析工作起来

把下面的 Prompt 交给 Agent：

```text
在当前 uv 项目中做一个测量模拟和一元线性回归分析。
x 是 [0,10] 上 100 个等距点；用 np.random.default_rng(42) 一次生成独立正态噪声，
均值 0、标准差 1，y=1+2*x+noise。
保存 data/base-001.csv（sample_id,x,y），输出散点、拟合直线和带名称的回归系数。
analyze.py 提供 fit_line(x,y)，返回 (slope,intercept)，只能从输入数据估计。
先给最小计划，再实现并运行检查；告诉我实际运行命令。
```

实现方式自由。先跟着 Agent 给出的命令运行，再亲自打开文件检查：

- CSV 有 `100` 行观测，编号唯一，`x,y` 是完整、有限的数值；`x` 从 `0` 到 `10` 等距排列。
- 图来自这份 CSV，斜率和截距带名称，能指出结果保存的位置。
- 计算真实噪声 `y-(1+2*x)`，看均值、样本标准差和直方图。单次结果不要求恰好等于 `0` 和 `1`。

把公开测试复制到自己项目；课程工作台不在示例路径时，替换来源路径：

```bash
mkdir -p tests
cp ~/course/ai-agents/week-08/checks/test_analysis.py tests/
uv run pytest -q
```

测试中的已知答案来自输入本身，例如 `x=[0,1,2]、y=[1,3,5]` 应得到斜率 `2`、截距 `1`。带噪声数据的估计值允许偏离真参数。测试通过后仍需打开实际 CSV 和图检查。

### 第二轮：新增实验，保留原批次

课堂推进到第二轮后，把新要求交给 Agent：

```text
保留 base-001 的数据和结果，新增两个批次：
noise-002：仅将噪声标准差改为 2，仍用 seed=42；
seed-003：回到噪声标准差 1，仅将 seed 改为 43。
其他设计不变。每批分别保存 CSV、图、回归系数与实际参数，明确它们的对应关系。
不要为新实验改写拟合算法；完成后重跑原检查，并确认旧批次未被覆盖。
```

完成后核对：

- 三批数据和结果分别保留；原基准数据仍是原来的内容。
- 图、系数和参数记录对应同一批数据，输出没有仍在偷偷读取旧文件。
- 原有测试继续通过；能指出这次修改了哪些文件。

### 第三轮：对照工程设计

听完课堂讲解，再与 `week-08/reference/` 对照：参数放在哪里，新增一批要改哪里，结果怎样追到输入。

- 参考项目把实验设计放在 JSON 中；TOML 也是可选格式。它们与声明环境依赖的 `pyproject.toml` 职责不同。
- CSV 文件名区分批次；同名 `.meta.json` 保存 `batch_id`、生成时间、实际配置快照和运行版本。
- 时间戳说明何时生成；批次名称方便查找；两者都不能替代内容检查。代码与配置的历史仍由 Git 记录。

参考项目的运行示例，在课程工作台中执行：

```bash
cd ~/course/ai-agents/week-08
uv sync --locked
cd reference
uv run --locked python simulate.py --config configs/base-001.json --out data/base-001.csv
uv run --locked python analyze.py --input data/base-001.csv --prefix outputs/base-001
```

这套结构用于比较和接续，不要求将自己的项目全部改成相同布局。保留数据与同名元数据，避免只剩图片和记忆中的参数。

## 教学点二：配置 R／MATLAB 工作台

### 在当前系统准备 R

先在 VS Code 终端执行 `Rscript --version`。有版本输出就使用现有安装；没有时按当前系统安装。

**Windows + WSL／Ubuntu**：在 WSL 中运行：

```bash
sudo apt update
sudo apt install r-base
Rscript --version
```

本周基础 R 足以运行回归与绘图，不要求追最新版本。发行版或安装问题可对照 [CRAN 的 Ubuntu 说明](https://cran.r-project.org/bin/linux/ubuntu/)。

**macOS**：从 [CRAN 的 macOS 下载页](https://cran.r-project.org/bin/macosx/) 选择适合芯片和系统版本的安装包，安装后重新打开终端，运行 `Rscript --version`。

### 配置 VS Code 的 R 扩展

1. 在扩展面板安装 [R 扩展](https://marketplace.visualstudio.com/items?itemName=REditorSupport.r)，标识为 `REditorSupport.r`。WSL 窗口中安装到 WSL。
2. 在终端输入 `R`，进入 R 控制台后执行：

```r
install.packages("languageserver", repos = "https://cloud.r-project.org")
q()
```

如询问是否使用、创建个人库，选择使用个人库；退出时不保存工作区。Ubuntu 若提示编译器或系统库缺失，按 [languageserver 官方依赖说明](https://github.com/REditorSupport/languageserver#installation) 补充所缺项，再重试。

3. 打开一个 `.R` 文件，在命令面板运行 `R: Create R terminal`；执行 `1 + 1`，应得到 `2`。再核对 `Rscript` 能运行脚本。

扩展支持提示、编辑与 R 终端；R 本身执行代码。更完整的功能说明见 [VS Code 的 R 文档](https://code.visualstudio.com/docs/languages/r)。`uv` 管理 Python 项目，不负责安装 R；WSL 工作区使用 WSL 内的 R。

### 让 Agent 接入同一份分析

在自己的项目中给 Agent：

```text
读取 data/base-001.csv，用基础 R 拟合 y ~ x，打印 summary(model)，
保存散点和拟合直线。写成 plot.R，接收输入 CSV 与输出图片两个参数。
先解释，再给运行命令，不新增 R 包。
```

```bash
Rscript plot.R data/base-001.csv outputs/base-001-r.png
```

打开图，按名称核对 Python 与 R 的截距、斜率，允许浮点差异。两者使用同一 CSV；不通过各自重新模拟来比较。R 尚未配置成功时，先完成 Python 主线，再按错误信息求助。

### MATLAB：配置编辑与代码导读

1. 在扩展面板安装 MathWorks 发布的 [MATLAB 官方扩展](https://marketplace.visualstudio.com/items?itemName=MathWorks.language-matlab)，标识为 `MathWorks.language-matlab`。
2. 打开课程材料中的 `week-08/reference/analysis.m`，查看语法高亮和代码结构。
3. 给 Agent：`逐段指出读数据、拟合和绘图在哪里；将系数改成带名称的输出。解释后再修改，不执行 MATLAB。`

基础编辑不要求安装 MATLAB；执行和部分高级功能另需 MATLAB 本体及可用授权。本周只做编辑与导读，不要求安装本体。已有环境者可在设置中查看 `MATLAB Install Path`，路径需指向扩展实际运行系统中的 MATLAB，不直接混用 Windows 与 WSL 路径。[官方扩展说明](https://github.com/mathworks/MATLAB-extension-for-vscode)

阅读、修改过的 `.m` 文件仍是“未运行”；Python／R 的结果不能替代 MATLAB 的执行验证。

## 教学点三：使用外部数据，接续原分析

PostgreSQL 的连接、查询与导出由教师演示。你不需要安装数据库，也不领取数据库凭证。

### 取得本次分析的数据

把教师提供的两个文件放进自己的项目：

- `data/application.csv`
- `data/application.meta.json`

若课堂使用备用数据，可从已更新的课程材料复制：

```bash
cp ~/course/ai-agents/week-08/data/application.csv data/
cp ~/course/ai-agents/week-08/data/application.meta.json data/
```

备用文件是合成实验记录，来源已在元数据中标明。它们能继续分析，但不能证明你或教师本次成功调用了数据库。

### 交给已有程序分析

```text
请检查这份新数据能否交给现有分析，说明输入和来源；沿用拟合方法，
输出这一批的图、系数与残差检查，不把结果写死为原模拟参数。
```

先检查字段、行数、缺失、范围和散点，再运行已有分析。打开实际结果，核对：

- 输入是哪批记录，实际使用多少行，结果保存在哪里。
- 原批次与结果仍在，没有被本次分析覆盖。
- 没有生成真参数时，只能计算残差，不能把它称为真实噪声。

连接成功、取回正确数据、得到合理分析，分别需要证据。以后接入 Longbridge 时，同样先检查身份、权限、请求和实际响应；本周不注册或授权交易。

## 选做：按区间分析

给程序增加按 `x` 区间筛选再拟合的功能，记录实际样本数。先写检查再实现：

- `x=[0,1,2,3]、y=[1,3,5,100]`，只取 `0≤x≤2` 时应得到斜率 `2`、截距 `1`。
- 没有给筛选条件时，保留原来的分析行为。
- 保存新的批次与结果，不覆盖已有产物。

## 遇到问题，怎样向 Agent 求助

提供当前目录、实际命令、完整错误、预期与实际结果；让 Agent 先定位再修改。例如：

```text
我在这个项目运行以下命令，预期是……，实际是……。
请先检查当前目录、运行环境、实际输入和调用位置，给出定位依据，
再做最小修复；保留原数据和测试，修改后重跑检查。
```

结束前保存代码、配置、测试、README 与环境记录。新项目尚未初始化 Git 时先执行 `git init`，再用 `git status` 查看；选中要保存的文件 `git add`，通过 `git diff --cached` 核对后形成一次本地 commit。本周不要求建立新 remote。

让 Agent 核对 `.gitignore`：本地环境和生成产物不混入代码提交。数据和元数据仍按批次留在本地；连接密码、授权信息不进代码或对话。
