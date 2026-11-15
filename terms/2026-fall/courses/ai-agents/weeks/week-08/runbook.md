# W8｜从新项目到数据分析

> 3 × 50 min · Notebook 用于教师展示，学生在自己的 VS Code 中与 Agent 开发；三个教学点按进展接续，课时是软分界。

## 知识地图

- **Road map：项目与需求变更 → R／MATLAB 工作台 → PostgreSQL 与外部数据**
  - 项目与需求变更：完成分析 → 新增实验并保留旧批次 → 解释工程设计。
    - 先给简短 Prompt 和验收，再发布修改要求；配置文件与批次记录放在第三轮解释。
    - 人工讲解：seed、数据初探、回归估计、噪声与残差；用实际产物核验 Agent 的工作。
  - R／MATLAB 工作台：区分编辑器扩展、语言运行环境与 Agent；Python、R 实际运行，MATLAB 只配置编辑与导读，不要求执行。
  - PostgreSQL 与外部数据：教师连接、查询、导出，学生复用分析；为 Longbridge 的身份、权限、请求和响应建立认识。

## 本次课 · 建立、修改并接续一个分析项目

### 0-50 | 建立项目，并应对需求变化

> 学生完成基准分析，再按新要求增加实验；保留各批次的输入、结果与参数关系。

- [ ] 课前：更新课程仓库，在 `week-08/` 执行 `uv sync --locked --extra database`，按 README 中同样携带 extra 的命令启动 `demo.ipynb`；完整跑过教师演示，课堂前重启 kernel。数据库开关仍默认关闭；Notebook 只供教师展示，学生不用在其中填题。
- [ ] 课前：授课机确认 Agent、VS Code、`Rscript` 和 R 扩展可用；准备 MATLAB 官方扩展与示例 `.m` 文件。数据库连接与备用材料见第三课时检查。
- 材料：课程仓库 `week-08/demo.ipynb`、`checks/test_analysis.py`、`reference/`。学生另建 `~/course/w08-analysis`，参考项目按课堂进展再打开。

#### 第一轮：先让分析工作起来

*翻页：建立项目，并应对需求变化*

- 打开 Notebook 的第一轮需求，只展示目标、Prompt 和验收；实现方式由学生与 Agent 决定。
- 新建项目；沿用已有 Agent。学生在自己的 VS Code 执行，教师在 Notebook 演示需求与实际结果。

```bash
mkdir -p ~/course/w08-analysis
cd ~/course/w08-analysis
uv init --bare --python 3.12
uv add numpy matplotlib
uv add --dev pytest
code .
```

```text
在当前 uv 项目中做一个测量模拟和一元线性回归分析。
x 是 [0,10] 上 100 个等距点；用 np.random.default_rng(42) 一次生成独立正态噪声，
均值 0、标准差 1，y=1+2*x+noise。
保存 data/base-001.csv（sample_id,x,y），输出散点、拟合直线和带名称的回归系数。
analyze.py 提供 fit_line(x,y)，返回 (slope,intercept)，只能从输入数据估计。
先给最小计划，再实现并运行检查；告诉我实际运行命令。
```

- 不要求第一轮就采用统一配置结构；Agent 已经做好配置也可以，后面用实际修改检验。
- 验收：`100` 行、编号唯一、数值完整；打开图和实际系数。已知 `x=[0,1,2]、y=[1,3,5]` 应在浮点容差内得到 `(2,1)`；再用公开测试换一组值。
- 已知答案检查：把课程材料的 `checks/test_analysis.py` 复制到自己项目的 `tests/`，运行 `uv run pytest -q`。先确认测试在测自己的 `analyze.py`。

#### 先检查数据，再解释系数

- 在 Notebook 展示 CSV 前几行、行数、缺失、范围与散点；学生对自己的数据做同样核对。
  - `x` 是固定设计，不是随机抽样；范围与间距应符合要求。
  - 基准设计可算真实噪声 `noise = y-(1+2*x)`，查看均值、样本标准差和直方图。
  - 均值在 `0` 附近、标准差在 `1` 附近，不要求单次样本恰好相等；图形与统计量用于发现问题，不能证明正态性与独立性。
  - `y` 还随 `x` 变化，整列 `y` 的标准差不是噪声标准差，也不要求整列 `y` 呈正态。
- 回到一元回归：`1,2` 是真参数，`intercept,slope` 是本批数据的估计；拟合时要保留截距项。
  - 在代码中指认拟合调用、返回顺序、`y_hat = intercept + slope*x`；不展开推导。
  - 噪声用真参数计算；残差是 `y-y_hat`。模拟里知道前者，应用中通常只能看到后者。
  - 带截距的最小二乘残差均值接近零是代数性质，不能用来证明真实噪声均值为零或模型正确。

#### 第二轮：发布修改要求

- 打开 Notebook 的第二轮需求。学生继续修改自己的项目，教师先不公布配置实现。

```text
保留 base-001 的数据和结果，新增两个批次：
noise-002：仅将噪声标准差改为 2，仍用 seed=42；
seed-003：回到噪声标准差 1，仅将 seed 改为 43。
其他设计不变。每批分别保存 CSV、图、回归系数与实际参数，明确它们的对应关系。
不要为新实验改写拟合算法；完成后重跑原检查，并确认旧批次未被覆盖。
```

- 验收看实际文件：三个批次是否齐全？基准 CSV 是否保持？换数据后图和系数是否确实更新？
- 在 Notebook 对照“始终写 `results.csv`”的覆盖结果与分批保存的结果；演示覆盖只发生在临时副本。
- 保留第一轮和第二轮的改动。观察项目能否应对新需求，不从完成速度或最终成品推断学生的态度。

### 50-100 | 解释工程设计，配置语言工作台

> 第三轮说明配置和批次记录怎样支持维护，再配置 R／MATLAB 的 VS Code 工作台。

#### 第三轮：这些工程设计解决了什么问题

*翻页：解释工程设计，配置语言工作台*

- 打开 Notebook 的第三轮对照与参考项目：参数散落在代码里，改一轮要找哪些地方？参数集中到一份配置后，改动在哪里？
- 参考采用 JSON；TOML 同样可以表达配置，本节只实际维护一种格式。`pyproject.toml` 声明项目环境，实验配置保存这次实验怎么做，职责不同。
- 打开 `reference/configs/base-001.json`，逐项对应实验设计。学生可沿用已有合理结构，也可参考调整。

```json
{
  "batch_id": "base-001",
  "n": 100,
  "seed": 42,
  "slope": 2.0,
  "intercept": 1.0,
  "noise_std": 1.0,
  "x_min": 0.0,
  "x_max": 10.0
}
```

- **seed 与设计**：seed 重放随机抽样；换 seed 是同一设计再抽一批，换噪声大小或样本量是改变设计条件。
  - 一次模拟只创建一次生成器；循环里反复重设 seed，可能每个点都得到同一个噪声。
  - 同一代码、环境和随机调用顺序下谈重现；Python 和 R 都写 `42` 不代表同一组数。
  - 固定 `x`、seed 和抽样方式，只放大噪声标准差，是放大同一组标准正态抽样，最小二乘系数偏差也随之缩放；换 seed 后则不是同一个对照。
  - `n=100` 是一批中的 100 条观测，重复使用同一 seed 不等于做了多次独立实验。
- **标准差与方差**：`noise_std=2` 表示方差 `4`，检查生成函数实际接收哪一种参数。
- **CSV 批次命名**：`base-001.csv`、`noise-002.csv`、`seed-003.csv` 区分批次，不能单靠名字证明内容正确。
  - 同名 `.meta.json` 记录批次、UTC 生成时间、实际配置快照与 Python／NumPy 版本。之后改配置，不改旧数据的记录。
  - 批次命名不是 Git 版本控制；Git 保存代码与配置历史，时间戳说明何时生成，内容核对说明拿到的是否同一批数据。
  - CSV 每行保存观测；本例没有逐条观测时间，不把批量生成时间伪装成时间序列。
- 在 `reference/` 实际运行一批；再看自己的工程能否只换配置和输出位置完成同一件事。

```bash
uv run --locked python simulate.py --config configs/base-001.json --out data/base-001.csv
uv run --locked python analyze.py --input data/base-001.csv --prefix outputs/base-001
```

#### 在新项目中让 Agent 帮助排错

- Notebook 给一组已知答案和斜率、截距颠倒的结果；指认承诺的返回顺序、库函数输出和调用者接收的位置。
- 提示词：`预期 (2,1)，实际 (1,2)。沿测试、函数返回值与调用位置定位，先给依据再做最小修复，不修改预期答案。`
- 修复后重跑公开测试和另一批数据；可在返回处设断点，沿用 W7 的检查方法。学生遇到真实故障也按这个顺序求助。

#### 配置 R 的 VS Code 工作台

- 教师从 Notebook 的说明切到 VS Code：确认 R 运行环境 → 安装 R 扩展 → 配置 `languageserver` → 打开 `.R` 文件 → 运行脚本。具体安装按 Guide。
- 扩展提供编辑、提示和终端交互；`Rscript` 才执行 R。WSL 工作区使用 WSL 中的 R 与扩展，不把 Windows 的安装路径直接当 Linux 路径。
- 让 Agent 阅读或生成 `plot.R`：读取同一份 CSV，用 `lm(y ~ x, data=...)` 分析，输出 `summary` 和图；不与 Python 相互调用。

```text
读取 data/base-001.csv，用基础 R 拟合 y ~ x，打印 summary(model)，
保存散点和拟合直线。写成 plot.R，接收输入 CSV 与输出图片两个参数。
先解释，再给运行命令，不新增 R 包。
```

```bash
Rscript plot.R data/base-001.csv outputs/base-001-r.png
```

- 按名称核对 Python／R 的截距与斜率，不假定系数顺序相同；同一个 CSV 才能对照计算。
- 简读 `Estimate`、`Std. Error`、`Residual standard error`。本例后者用残差平方和除以 `n-2` 再开方；与 `np.std(residual, ddof=1)` 的分母不同。
- 看残差对 `x` 的图，寻找曲线或波动扩大的线索；高 `R²`、显著的 p 值不能替代程序检查。

#### 配置 MATLAB 的编辑与分析工作台

- 展示 MathWorks 官方扩展，打开 `reference/analysis.m`：语法支持、文件导航、Agent 读取与修改。
- 区分扩展与 MATLAB 本体及授权：能编辑 `.m` 文件，不代表已经具备执行环境。本节不安装 MATLAB 本体，也不要求运行。
- 提示词：`逐段指出读数据、拟合和绘图在哪里；将系数改成带名称的输出。解释后再修改，不执行 MATLAB。`
- 对照代码与 diff；保持“已阅读、已修改、未运行”的状态。Python、R 的运行结果用于理解同一分析意图，不冒充 MATLAB 的执行验证。

### 100-150 | 连接数据库，接续外部数据

> 教师演示 PostgreSQL 取数，学生使用导出的模拟实验记录；区分连接成功、数据正确与分析合理。

#### 看清客户端、服务端与连接配置

*翻页：连接数据库，接续外部数据*

- [ ] 课前：按 `reference/db/README.md` 在自己的 PostgreSQL 中准备课程专用表和只读连接，跑过校准批次与应用批次的查询。连接信息不进项目、Notebook、Agent 对话和投影。
- [ ] 课前：确认 `uv sync --locked --extra database` 可用，配置服务名 `w08_demo`；准备不可用时使用的 `week-08/data/` 合成 CSV 与来源记录。备用文件不伪装成现场数据库返回。
- 展示：本机 Python 客户端 → PostgreSQL 服务 → 查询结果 → CSV → 原分析。连接数据库不等于 SSH 登录服务器。
- 解释主机、端口、数据库、用户分别定位什么；凭证由本人配置。Agent 帮助编写和检查调用代码，不需要看到真实密码。
- 打开查询，只解释列、筛选条件和排序，不展开 SQL 教程。

```sql
SELECT sample_id, x, y
FROM w08_demo.measurements
WHERE dataset = 'calibration'
ORDER BY sample_id;
```

#### 同一批记录，换存放位置后是否一致

- 教师在 `reference/` 执行取数，打开实际 CSV 和元数据；没有现场连接就明确使用合成备用文件。

```bash
uv run --locked --extra database python fetch_data.py --dataset calibration --out data/db-calibration.csv
uv run --locked python analyze.py --input data/db-calibration.csv --prefix outputs/db-calibration
```

- 校准批次原样存入数据库；按 `sample_id` 对齐，核对编号、行数和 `x,y`，浮点值用容差比较，再对照拟合结果。
- 生成时间、导出时间分别记录；导出不是重新抽样，文件名相似也不证明内容相同。

#### 取得另一批数据，完成应用分析

- 教师取 `application`，学生领取 CSV 和同名元数据。应用批次只先公开来源与批次，完整生成配置留到讲评。

```bash
uv run --locked --extra database python fetch_data.py --dataset application --out data/application.csv
```

- 学生在自己的项目：放入 `data/application.csv` 与 `data/application.meta.json`，请 Agent 沿用已有分析程序，先检查数据，再估计系数、画图并看残差。

```text
请检查这份新数据能否交给现有分析，说明输入和来源；沿用拟合方法，
输出这一批的图、系数与残差检查，不把结果写死为原模拟参数。
```

- 验收：输入是哪批记录，实际用了多少行，结果保存在哪里？原批次是否仍在？没有生成真值时，不从残差冒充真实噪声。
- 最后展示教师的生成设计：`n=80、seed=7、slope=-0.5、intercept=4、noise_std=0.5`，`x` 仍在 `[0,10]` 等距。估计值允许偏离真值。
- 测试核对确定性计算；批次记录核对实际输入；统计诊断检查模型解释的线索。三者分别提供证据。

#### 为 Longbridge 接入做准备

- 服务地址定位去哪里，认证说明以谁的身份，授权规定能做什么；请求和实际响应说明这次做成了什么。
- 下一步更换外部数据来源，仍先检查字段、数量、时间与缺失；本节不安装 Longbridge、不授权交易。

#### 本次课回顾

- 保存代码、配置、测试、README 和环境记录，用 `git status`、`git diff --cached` 核对再提交；新文件先 `git add` 才能查看暂存差异。
- CSV 与元数据按批次保留在本地；生成产物不混入代码提交，连接凭证不进仓库。
- 指认三件事：项目怎样应对变更，语言怎样接入工作台，外部数据怎样进入分析。

## 临场取舍

- 慢了：第一点跨过课时边界继续；R 保留一次实际运行，MATLAB 保留配置导读。数据库用教师短演示与同批备用数据接续。
- 快了：增加按 `x` 区间分析的需求，约 20 分钟；先筛再拟合，记录实际样本数。`x=[0,1,2,3]、y=[1,3,5,100]` 只取 `0≤x≤2` 时应恢复斜率 `2`、截距 `1`，原有无筛选行为继续通过检查。
- 坏了：Agent 暂不可用就用参考项目继续演示与核验；数据库失败用明确标记为合成来源的 CSV，不把备用输出说成现场调用。
