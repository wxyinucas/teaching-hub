# W9｜接入市场数据，完成一次可核验的分析

本指南以 `~/course/ai-agents` 为课程仓库路径。已有的 `~/course/w02-workbench` 可以继续使用，只需把下面的仓库路径前缀替换为实际位置；不用重新 clone 或改名。

在自己的 **VS Code 中与 Agent 开发项目**。本周从模拟账户取得行情，保存、检查并分析一批数据；你决定授权范围，并核对实际产物。

## 本周在做什么

市场数据 → 保存与预处理 → 策略计算 → 订单 → 成交 → 账户反馈。

**本周只完成前两步，加上描述性分析**：取得日 K，保存独立批次，检查输入，计算收盘价变化并画图。我们没有编写交易策略，也不发送订单。

- 课堂先认识市场、指数与 ETF、K 线、信号和订单，再接续五个操作单元。
- 真实行情核对实际字段、行数和日期；合成样例有已知答案，用于检查程序。
- 注册或 API 暂时受阻，可以使用合成样例完成数据处理；本人 API 状态仍记为“未完成”。

本周使用 Demo，不要求开立真实证券账户、入金或购买行情。需要这些操作才能继续时，先向教师确认。

## 课前准备与材料

### 更新已有课程仓库

继续使用之前 clone 的课程工作台，例如：

~~~bash
cd ~/course/ai-agents
git status -sb
git remote -v
~~~

先保存自己的改动，再从指向 `wxyinucas/ai-agents` 的 remote 更新。按实际情况选一条：

- `origin` 指向教师仓库：`git pull --no-rebase origin main`
- `upstream` 指向教师仓库：`git pull --no-rebase upstream main`

有本地 commit、未提交改动或冲突时，让 Agent 先解释状态，帮助保留已有工作，再完成更新。不需要重新 clone，也不需要另一个项目仓库。本周材料在 `week-09/`：

- `fixtures/`：明确标为合成的好、坏输入。
- `checks/test_market_data.py`：公开测试。
- `reference/`：课后用于对照的教师实现，先不复制答案。

### 准备操作环境

准备可收验证码的本人邮箱、Chrome、WSL 中的 VS Code 和已配置的 Agent。下面命令默认在 **WSL Ubuntu 的 Bash** 中执行。

本周不重新安装 WSL 或配置 Agent。macOS 用户使用同一套项目命令；CLI 安装见下方说明，隐藏输入授权码时先进入 Bash。

官方入口：

- [账号与授权](https://open.longbridge.com/connect)
- [CLI 安装](https://open.longbridge.com/docs/cli/install)
- [Agent Auth Code](https://open.longbridge.com/docs/agent-auth)
- [K 线命令](https://open.longbridge.com/docs/cli/market-data/kline)
- [已授权应用](https://open.longbridge.com/dashboard/authorized-apps)

## 注册，确认 Demo，安装 CLI

### 使用 SG 与邮箱注册

在 Chrome 打开 [Longbridge 接入页](https://open.longbridge.com/connect)。

1. 需要选择账号地区时，使用 `Switch account`，选择 **Longbridge SG**。
2. 首次注册使用 `Sign up → Email`，由本人填写邮箱并完成验证码与后续页面操作。
3. 已有邮箱与密码账号：登录页选择 `Password`，把账号类型从 `Phone` 改为 `Email`，再由本人输入邮箱与密码。
4. 原来使用 Google 等方式创建的账号，沿用原登录方式；不要假定已有邮箱密码。登录页的 `Phone OTP` 不是邮箱验证码入口。

![切换到 Longbridge SG 的账号地区菜单](assets/2026-fall/ai-agents/week-09/guide/login-region.jpg)

核对所选地区是 **Longbridge SG**；不要把默认显示的 HK 当作本周路线。

![Sign up 中的 Email 注册表单](assets/2026-fall/ai-agents/week-09/guide/login-sg-email.jpg)

这是邮箱**注册**表单，能看到邮箱、验证码与发送验证码的位置；验证码由本人处理。

![Password 登录中的 Email 账号类型](assets/2026-fall/ai-agents/week-09/guide/login-email-password.jpg)

已有邮箱与密码账号核对 `Password → Email`，这里不是首次注册或邮箱验证码登录。

截图用于定位，不代表所有新账号的后续注册步骤都已实测。页面可能继续要求本人确认信息或协议，按自己的实际页面操作；遇到不明要求先询问教师。

### 确认模拟账户

登录后找到 `Open mock account`，按页面申请。若提示申请已提交、请勿重复提交，回到 Dashboard 正常刷新一次，查看是否已经出现 **`Demo A/C`**。

![模拟账户的 Demo A/C 类型标记](assets/2026-fall/ai-agents/week-09/guide/demo-account-label.jpg)

核对的是账户类型 `Demo A/C`，无需向教师或 Agent 提供账号编号。

看到了就记“能进入”；没看到就记录停在哪个页面、出现什么错误。课堂不会等待所有人注册完成才继续：暂时受阻者保留节点，随后用合成样例参加单元 2～4。

### 安装并确认 CLI

在 WSL 终端运行：

~~~bash
uname -s
curl -fsSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
longbridge --version
longbridge auth login --help
~~~

核对：

- WSL 中 `uname -s` 显示 `Linux`。
- CLI 能输出版本号，登录帮助中有 `--auth-code`。

macOS 也使用上面的官方安装命令；`uname -s` 显示 `Darwin` 是正常结果。已有 CLI 就检查版本和帮助，不必重装。

若提示找不到命令，把安装输出和 `command -v longbridge` 的结果交给 Agent，请它先定位原因。不需要安装券商桌面终端、改装 SDK 或更换 API。

### 本周使用的日 K 字段

| 字段 | 本周如何理解 |
| --- | --- |
| `time` | 日 K 的时间标签，按交易所时区理解；不是获取时间 |
| `open / high / low / close` | 这一周期的开、高、低、收 |
| `volume` | 成交量，单位需结合来源核对 |
| `turnover` | 成交额 |

一根日 K 压缩了一个交易周期，不能还原逐笔路径。周末、休市造成相邻记录不连续，不要擅自补自然日。

## 单元 1｜最小授权，取得最近 100 根日 K

**目的：用本人实际响应确认 API 接通，授权范围由本人决定。**

先取得一次真实响应，核对行数、日期与字段；这一单元暂不开发取数程序。

### 选择权限，兑换授权码

回到 [接入页](https://open.longbridge.com/connect)，给本次授权起易认的名称，例如 `W9 Basic Data s07`，把 `s07` 换成自己的公开代号。

生成授权码前核对：

- `Basic data access`：`Included`，保持勾选。
- `Watchlist`：若默认选中，取消。
- 账户、持仓、订单查询和交易权限：全部关闭。

![仅保留 Basic data access 的授权范围](assets/2026-fall/ai-agents/week-09/guide/basic-data-permissions.jpg)

按截图核对基础行情保留、Watchlist 取消；其余账户、订单和交易权限同样不选。

先暂停 Agent，停止投屏授权码页面。由本人确认协议并生成授权码。**授权码有效 10 分钟、只能兑换一次，准备兑换时再生成。** 不把它发进 Agent 对话或写入项目文件。

下面命令必须**逐行执行**，不要整段粘贴：先运行第一行，等提示出现后粘贴授权码并回车，再执行余下三行。输入时不显示字符。

~~~bash
read -r -s -p "Paste W9 auth code: " W9_AUTH_CODE
echo
LONGBRIDGE_REGION=global longbridge auth login --auth-code "$W9_AUTH_CODE"
unset W9_AUTH_CODE
~~~

macOS 默认 zsh 用户先单独运行 `bash`，再执行以上命令。

亲眼核对 CLI 报告认证成功。Agent 接下来沿用 CLI 的登录状态，不需要读 token 或凭据文件；你选择的权限是它能够调用哪些接口的边界。

### 取得第一次响应

建立本周独立项目，打开 VS Code：

~~~bash
mkdir -p ~/course/w09-market-data
cd ~/course/w09-market-data
code .
~~~

给 Agent：

~~~text
我们只做 Longbridge 基础行情实验。沿用已登录的 CLI，不读取凭据，
不查询账户、订单或交易，也不更改授权。
先解释下面命令，等我确认后只运行一次：
LONGBRIDGE_REGION=global longbridge kline AAPL.US --period day --count 100 --adjust none --format json
报告真实退出码、实际行数、首末 time 和字段名，不复述价格或完整响应。
失败时报告实际错误类别，不自行换接口或重试。
~~~

这是普通 `kline` 的最近若干根接口，**不是 `kline history` 按日期查询**。本次教师 Demo 的历史查询额度为 0，不用付费或入金解决课堂任务。

教师在 2026-11-16 的 macOS、CLI 0.31.2、基础行情 Demo 授权中，实际取得 100 条 AAPL 日 K。学生应核对自己的响应：

- 退出码是否为 `0`。
- 实际是否取得 `100` 条，而不是只看命令写了 `--count 100`。
- 字段是否包含 `time,open,high,low,close,volume,turnover`。
- 首末 `time` 是什么；最新日期会变，不能照抄教师日期。

这次实测不能代替每位同学的新账号注册、WSL 安装与本人调用。没有成功就保留真实错误类别，进入离线路线。

**留下**：本人 API 成功／未完成、实际命令、行数、首末时间和字段名。不要把授权码或完整响应贴进交流记录。

做得快时，从本页目录进入 **“选做与参考 → A. 改变取数数量”**，在撤销授权前完成，再回到单元 2。已结束授权就跳过，不重新授权。

## 单元 2｜保存批次，保留第一次取数

**目的：让结果追到具体来源，并在第二次取数后保留第一次。**

### 先看成品，再开始开发

先看教师打开的表和图：合成收盘价 `100、110、99`，对应变化率为“缺失、10%、−10%”。你要做出的程序会生成同类结果，数据来源和日期按自己的批次记录。

再并排看这批数据的三份文件：

- `raw.json`：收到的原响应。
- `bars.csv`：整理后、供分析读取的表。
- `metadata.json`：说明这批数据从哪里来、何时取得或处理。

本单元先做出这三份文件，再新增第二批；旧批次保持不变。教师演示用于看清产物，自己的实现仍与 Agent 一起完成。

下面的开发单元都先让 Agent 实现，再运行所列命令。命令由自己或 Agent **择一执行一次**；Agent 已运行并产生对应结果时，直接核对，不再重复。

### 初始化项目，复制样例与测试

回到自己的 `w09-market-data` 终端。新项目执行：

~~~bash
uv init --bare --python 3.12
uv add pandas matplotlib
uv add --dev pytest
mkdir -p fixtures tests
cp ~/course/ai-agents/week-09/fixtures/*.json fixtures/
cp ~/course/ai-agents/week-09/checks/test_market_data.py tests/
~~~

课程工作台不在示例路径时，只替换 `cp` 的来源路径。已经初始化过项目就检查并沿用已有环境。

目标结构如下，具体实现交给你与 Agent：

~~~text
w09-market-data/
├── pyproject.toml
├── uv.lock
├── fetch_batch.py
├── checks.py
├── analyze.py
├── fixtures/
├── tests/test_market_data.py
├── data/<batch>/        # 原始响应、CSV、来源记录
└── outputs/<batch>/     # 分析表、图、分析记录
~~~

### 先保存一批

给 Agent：

~~~text
在当前 uv 项目新增 fetch_batch.py：
uv run python fetch_batch.py --batch aapl-day-001 --count 100
调用官方 CLI，固定 AAPL.US、day、adjust none、session intraday、JSON，
仅为子进程设置 LONGBRIDGE_REGION=global，不读取凭据。
成功后在 data/<batch>/ 保存 raw.json、bars.csv、metadata.json。
CSV 列固定为 time,open,high,low,close,volume,turnover。
元数据写 batch_id、source=longbridge、实际请求参数、fetched_at_utc，
以及从响应算出的 actual_rows、first_time、last_time。
请求失败或返回错误对象就非0退出，不生成成功CSV。
提供 --input <json> 离线入口：不联网，source=fixture，记录输入文件、
processed_at_utc和实际行数，不写虚构API请求或 fetched_at_utc。
已有同名批次在请求前拒绝，保持其文件不变。把 data/、outputs/ 加入 .gitignore。
先给最小计划，再实现，暂不运行；随后由我选择线上或离线路线，只执行一次。
不要自行扩大接口或权限。
~~~

任选与本人状态相符的一条：

**API 已成功，保存真实批次：**

~~~bash
uv run python fetch_batch.py --batch aapl-day-001 --count 100
~~~

**API 受阻，保存合成批次：**

~~~bash
uv run python fetch_batch.py --batch fixture-001 --input fixtures/good.json
~~~

两条路线的来源不同，不把 `fixture` 写成平台返回。合成好样例的已知内容是：

| 时间（UTC） | close |
| --- | ---: |
| 2025-01-02 05:00 | 100 |
| 2025-01-03 05:00 | 110 |
| 2025-01-06 05:00 | 99 |

它只有 **3 行**。原文件还有开、高、低、成交量和成交额；转换后数值不能变成字符串拼接。

打开这批 `raw.json`、`bars.csv`、`metadata.json`，确认三者对应同一次输入。日 K 的时间、取数或处理时间、批次名称是三件事。

### 追加：第二批不能覆盖第一批

给 Agent：

~~~text
保留第一批全部文件。真实路线新增 aapl-day-002，只把 count 改为20；
离线路线用同一个 fixtures/good.json 新增 fixture-002，不联网。
先准备对应命令，暂不取第二批，由我在下一步选择路线并执行一次。
运行后比较两批的实际行数、日期范围和来源记录。
再故意使用第一批的名字运行一次：必须在再次请求API之前拒绝，
原 raw.json、bars.csv、metadata.json 的内容保持不变。
加一个不联网的覆盖保护测试，用文件内容或摘要证明旧批次没变。
~~~

对应命令：

~~~bash
# 真实路线
uv run python fetch_batch.py --batch aapl-day-002 --count 20
# 离线路线
uv run python fetch_batch.py --batch fixture-002 --input fixtures/good.json
~~~

只执行自己的路线。在线两批记录实际返回值；离线两批都是原样例的 **3 行**，不能伪造成 100／20 行。

**留下**：两个批次各三份文件；首批保持不变的证据；同名批次被拒绝的测试。后续真实路线用 `aapl-day-001`，离线路线用 `fixture-001`。

## 单元 3｜同一入口，区分整理与拒绝

**目的：检查必须决定程序能否继续，错误输入不能变成正常结果。**

先看好输入能生成什么、坏输入会被怎样拒绝。这次给取数程序加上检查：完整乱序可以整理；缺字段或重复时间必须停止，不能悄悄生成正常结果。

### 先看输入与预期，再实现

公开样例都是合成数据，不改自己的真实 `raw.json`。

| 文件 | 改了什么 | 应得到什么 |
| --- | --- | --- |
| `good.json` | 三行完整数据 | 通过，时间升序 |
| `unordered.json` | 同样三行乱序 | 排序通过；输入不变 |
| `missing-close.json` | 一行缺少 close | 拒绝，指出原因 |
| `duplicate-time.json` | 两行对应同一时间 | 拒绝，不能擅自删行 |
| `nan-close.json` | close 为字符串 NaN | 拒绝，不能当普通数值 |
| `error.json` | 整体是错误对象 | 拒绝，不能输出空 CSV |

先将前四个样例及预期交给 Agent：

~~~text
新增 checks.py，提供 validate_bars(rows)，返回按时间升序的新记录列表。
输入必须是非空列表，每行有 time,open,high,low,close,volume,turnover。
time可解析且带时区，统一时区后判断排序和重复；同一时刻不能重复。
数值字段转为有限数值；价格>0，low<=open/close<=high，volume和turnover>=0。
完整乱序可以整理；缺字段、重复时间或不合法数值抛出带原因的ValueError。
不改变输入对象。先写上述好、乱序、缺close、重复time的测试，再实现。
线上和 --input 离线的 fetch_batch.py 都复用它，先校验再建立成功批次；
失败非0退出、不产生成功CSV，不改已有批次。
~~~

此阶段先运行校验和批次测试；分析入口还没开发，不必提前运行分析组：

~~~bash
uv run pytest -q tests/test_market_data.py -k 'validate or fetch'
~~~

公开测试只用合成输入，取数测试以假的 CLI 隔离网络，不调用真实账号。读失败信息，让 Agent 修正实现，不要为通过而删除测试。

### 追加：检查 NaN 与错误对象

~~~text
继续用 fixtures/nan-close.json 和 fixtures/error.json 检查。
两者必须失败，不得变成空CSV或“校验通过”。
从 fetch_batch.py 的 --input 入口分别实际运行好、乱序与坏输入；
好、乱序各生成明确标为fixture的批次，坏输入非0退出且无成功CSV。
证明这些运行没有改动已有的两个批次，再运行公开校验与批次测试。
报告每次用的批次名与退出码；下方 rejected-missing 示例留给我执行，不先运行它。
~~~

例如检查坏输入，以下两行接着执行，以保留真实退出码：

~~~bash
uv run python fetch_batch.py --batch rejected-missing --input fixtures/missing-close.json
echo "FETCH_EXIT=$?"
~~~

应看到具体错误、非 `0` 退出，且没有 `data/rejected-missing/bars.csv`。将坏样例的具体值再改一次，检查程序识别的是规则，而不是文件名或固定数字。

**留下**：测试实际输出；好／乱序处理结果一致；缺字段、重复时间、NaN 与错误对象被拒绝；输入和旧批次保持不变。

## 单元 4｜先计算，再选择展示范围

**目的：让表与图有可验算的含义，展示范围变化不能悄悄改变算法。**

先看全量表和图，再看只展示最后两条的版本。此次新增分析程序：同一条记录的变化率不应因为少展示几行就改变。

### 用已知答案验算

相邻交易日收盘价的比例变化：

$$
r_t=\frac{C_t}{C_{t-1}}-1
$$

合成样例应得到：

| close | change | 图上百分比 |
| ---: | ---: | ---: |
| 100 | 缺失 | 缺失 |
| 110 | 0.10 | 10% |
| 99 | -0.10 | -10% |

第一条没有前一天，**保留缺失，不填 0**。这是不复权收盘价的简单变化率，不是账户盈亏，也不是含分红的总收益。

给 Agent：

~~~text
新增 analyze.py，只读取 data/<batch>/bars.csv，不联网，复用 validate_bars。
按时间升序计算 change=close/前一交易日close-1，首条保留缺失。
入口：uv run python analyze.py --batch <batch>
在 outputs/<batch>/ 保存 analysis.csv（time,close,change）、
figure.png、analysis.meta.json。元数据记录实际输入文件、所属批次、来源与参数。
图分上下两幅：收盘价、百分比变化，共用时间轴。
先用合成数据100、110、99写测试：缺失、0.10、-0.10，浮点用容差比较。
先实现并跑测试，暂不生成分析产物；下一步由我执行一次分析命令。
运行后报告实际行数和日期范围，不改变原始文件。
~~~

所有人都先运行固定样例。若单元 2 还没有 `fixture-001`，先执行：

~~~bash
uv run python fetch_batch.py --batch fixture-001 --input fixtures/good.json
~~~

已有这批就保留它，直接分析：

~~~bash
uv run python analyze.py --batch fixture-001
~~~

### 追加：只展示最后几条

~~~text
新增 --tail N，但必须先对完整批次计算change，再取最后N条展示。
不重新取数，不改变原始CSV或元数据。表、图、分析元数据保存到
outputs/<batch>/tail-<N>/，不能覆盖原全量结果。
先用三行合成数据测试 --tail 2：应得到110/0.10、99/-0.10，
不能把第一条展示结果的change变成缺失。
先实现并通过测试，暂不重跑已有批次；随后由我按下方命令生成结果一次。
真实批次生成 --tail 5；离线路线保留 tail-2 结果即可。
~~~

~~~bash
uv run python analyze.py --batch fixture-001 --tail 2
uv run pytest -q tests/test_market_data.py
~~~

API 成功者再对真实批次执行：

~~~bash
uv run python analyze.py --batch aapl-day-001
uv run python analyze.py --batch aapl-day-001 --tail 5
~~~

打开表和图核对：

- 全量与 tail 结果位于不同目录；原数据仍在。
- 图的横轴是哪些交易日，上下两幅各表示什么量。
- CSV 的 `0.10` 与图上的 `10%` 对应。
- 在代码中找到“计算变化率”和“取最后 N 条”；调换顺序会使哪一格出错？

**留下**：合成样例的全量与 tail-2 结果、测试输出，以及自己选定批次的表、图和分析元数据。图形和测试都不能证明某个交易策略会盈利。

## 单元 5｜验证拒绝，回收本次授权

**目的：分别核对权限边界、服务器撤销和本机退出；已有数据应能继续离线分析。**

只有**已建立且尚未撤销本次授权**的人做下面的在线检查。没有建立者看教师脱敏示例，记录本人 API 未完成；已经结束授权者保留自己的状态。两者都直接做本节最后的离线重跑，不为负面测试新建授权。

### 检查账户读取被拒绝

仅运行一次：

~~~bash
LONGBRIDGE_REGION=global longbridge assets --format json >/dev/null
echo "ASSET_EXIT=$?"
~~~

`>/dev/null` 丢弃可能的正常资产输出，保留错误。CLI 0.31.2 教师实测为退出码 `1`：

~~~text
code: 403308
message: Target API is not in authorized scope
~~~

- 明确的权限拒绝，才能支持“本次账户读取被权限边界拒绝”。
- 网络失败、未登录、参数错误等也会非 `0`，只能记“无法验证”。
- 意外成功时不重跑、不读取或展示资产内容，立即撤销本次授权。

这一条响应不能单独证明其他权限全部关闭，仍要结合自己核对过的授权页。

### 网页撤销，再退出本机

打开 [已授权应用](https://open.longbridge.com/dashboard/authorized-apps)，找到本次命名的授权，`Revoke` 并确认。只操作自己的本次 W9 授权。

![已授权应用页面与本次授权移除后的状态](assets/2026-fall/ai-agents/week-09/guide/authorized-apps.jpg)

核对本次授权是否消失；不要求清空其他应用，截图中的空列表仅是教师本次示例。

撤销后，重复之前成功的同一条命令：

~~~bash
LONGBRIDGE_REGION=global longbridge kline AAPL.US --period day --count 100 --adjust none --format json
~~~

教师实测撤销后返回 `401102`、`the access token has been revoked`。你的结果按实际记录：明确认证拒绝支持旧授权已不可用，网络错误不能替代这项证据；若出现新的登录流程，停止，不重新授权。

**无论复测是否得到明确拒绝，都继续本机退出：**

~~~bash
longbridge auth logout
~~~

网页 Revoke 与本机 logout 是两个动作。某一步受阻时分别记录，不遗漏另一步；若撤销后仍然取数成功，停止调用并向教师求助。

### 离线重跑，留下记录

给 Agent：

~~~text
现在只做离线检查，不发起任何 Longbridge 请求，也不登录。
只用已有本地批次重跑公开测试和已完成的全量分析；
已实现 --tail 就重跑对应结果，此时不新增功能。
核对结果仍能生成、原始数据保持，指出取数入口与分析入口在哪里分开。
~~~

未授权者同样可以执行；未完成的功能如实记录，不让清理等到全部开发结束。

在自己的项目写 `notes.md`，只留五项：

~~~markdown
# W9 记录
- 本人 API：成功／未完成；实际行数、首末时间与字段核对：
- 分析使用的批次与来源：
- 被拒绝的坏输入及实际错误：
- 展示范围改变后，我如何验算 change：
- 权限结束：账户读取结果／网页撤销／旧授权复测／本机 logout：
~~~

记录中不放验证码、授权码、token、账号编号或资产内容。真实行情和生成结果保持本地，`data/`、`outputs/` 不进入公开仓库。用合成输入或教师示例就写明来源，不能代替本人 API 成功。

## 选做与参考

### A. 改变取数数量

仅在本次授权**尚未撤销**时做；已结束就跳过，不重新授权。

保持 AAPL、day、none 不变，将最近根数改成 `5`。先说哪些参数不变，再运行：

~~~bash
LONGBRIDGE_REGION=global longbridge kline AAPL.US --period day --count 5 --adjust none --format json
~~~

核对实际行数、首末时间和字段，分别保留两次结果。不能假定不同时间发出的两个请求必然返回相同快照。

### B. 离线比较两个批次

给 Agent：

~~~text
增加一个本地批次比较入口，按完整且带时区的time对齐，不按行号比较。
报告 added、removed、changed_close；共有且相同的记录也应能核对。
先为下面的固定样例写测试，再实现；不联网、不覆盖输入。
比较只能说明两份快照的差异，不自行解释市场原因。
~~~

固定输入与答案：

| 时间（UTC） | A 的 close | B 的 close | 预期 |
| --- | ---: | ---: | --- |
| 2025-01-02 05:00 | 100 | 无 | removed |
| 2025-01-03 05:00 | 110 | 110 | 共有且相同 |
| 2025-01-06 05:00 | 99 | 100 | changed_close：99 → 100 |
| 2025-01-07 05:00 | 无 | 105 | added |

样例写成完整的 `2025-01-02T05:00:00Z` 等时间，不只用月日。验收时展示固定测试通过、源文件保持，再比较自己的两批真实快照；没有真实批次也可只完成合成测试。

### C. 与教师实现对照

先完成自己的最小实现，再打开课程仓库 `week-09/reference/`。比较取数与分析如何分开、校验在哪里发生、元数据怎样追到输入，不要求照抄全部结构。

在课程工作台执行以下离线示例，不使用本人的 API：

~~~bash
cd ~/course/ai-agents/week-09
uv sync --locked
cd reference
uv run --project .. --locked python fetch_batch.py --batch fixture-demo --input ../fixtures/good.json
uv run --project .. --locked python analyze.py --batch fixture-demo
uv run --project .. --locked python analyze.py --batch fixture-demo --tail 2
W9_PROJECT_ROOT="$PWD" uv run --project .. --locked pytest -q ../checks/test_market_data.py
~~~

`fixture-demo` 已存在时，保留它并换一个新的批次名，后续分析命令一并对应。参考测试与合成结果用于比较实现，不能代替自己的平台调用。

## 遇到问题怎样求助

先停在真实节点，把下面的非敏感信息交给 Agent 或教师：

~~~text
我在 W9 的【注册／CLI／授权／取数／批次／校验／分析／撤销】这一步。
当前目录是【路径】，执行了【命令或页面动作】。
我预期【结果】，实际得到【退出码与脱敏错误】。
最后成功的一步是【步骤】。
请先解释原因，再给一个最小修正；保留已有批次与本地改动。
不读取凭据、不扩大权限、不自行重新授权或更换市场接口。
~~~

- **注册或平台失败**：记录页面与错误，使用 fixture 继续处理；本人 API 保持未完成。
- **更新仓库冲突**：提供 `git status -sb`、`git remote -v` 和冲突文件，让 Agent 帮你理解并保留工作，不直接删除项目重来。
- **公开测试失败**：提供具体测试名与错误，找出输入、预期和实际差别，不删除测试或写死答案。
- **批次已存在**：这是覆盖保护。查看原批次，为新的实验选择新名称，不清空旧数据来“过关”。
- **需要真实开户、入金、扩大权限，或秘密已经泄露**：优先停止相关操作并撤销本次授权，再向教师求助。

本周要分清：请求成功、输入可用、计算正确、权限结束，各自需要哪一份实际证据。
