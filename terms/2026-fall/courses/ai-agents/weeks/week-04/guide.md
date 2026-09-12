# W4 学生行动指南：完成一次最小权限的真实 API 调用

> 本周使用 Longbridge 模拟账户，让本地 Agent 完成一次真实历史行情调用。你不需要申请真实证券账户、投入资金或学习交易；你需要决定授予什么权限，核对调用证据，并在结束时撤销授权。

## 本周只完成什么

个人完成需要两项事实：

1. 你本人在 Longbridge 页面中看到了 `Demo A/C`；
2. 你本人只授予 `Basic data access`，并成功执行指定的 AAPL 历史日 K 调用。

课堂还会检查账户读取应当被拒绝，并完成远程撤销与本地退出。教师提供的脱敏记录可以在平台受阻时帮助你继续学习，但不能冒充你的个人注册或调用已经成功。

本周不申请真实证券账户、不入金、不授予账户、订单或交易权限，也不生成策略和买卖指令。第三课时只会发出一次预期被拒绝的资产读取请求，用来证明账户权限没有被授予；正常输出会直接丢弃。

## 课前准备

准备以下条件：

- 可以接收验证码的本人邮箱；
- Windows 上的 Chrome；
- 已能进入的 WSL Ubuntu；
- WSL 中可运行 `uname -s`；
- W3 使用的本地 Agent；
- 本课程个人项目仍位于自己的 WSL 目录中。

本周官方参考入口：

- [Longbridge Agent 授权入口](https://open.longbridge.com/connect)
- [Longbridge CLI 安装说明](https://open.longbridge.com/docs/cli/install)
- [Agent Auth Code 官方说明](https://open.longbridge.com/docs/agent-auth)
- [历史 K 线命令说明](https://open.longbridge.com/docs/cli/market-data/kline)
- [模拟账户常见问题](https://open.longbridge.com/docs/qa/general)

页面名称、位置和版本可能变化。以下步骤最后核对于 2026-09-09；上课时以教师展示的官方页面为准，不根据旧视频猜按钮。

## 第一课时｜注册并确认模拟账户

### 1. 打开唯一入口

在 Chrome 中打开：

<https://open.longbridge.com/connect>

页面要求选择地区时，课程主线统一选择 **Singapore / SG**。使用 `.com` 页面和邮箱注册或登录。不要同时尝试 HK、SG、`.com`、`.cn` 多条路线；已有其他地区账号时先向教师说明，不要为了过关重复注册。

邮箱验证码只由你本人填写：不要发给教师、同学或 Agent，也不要截进图片。

### 2. 打开模拟账户

登录后：

1. 如果页面显示 `Open Mock Account`，点击它打开模拟账户；
2. 回到开发者授权页面；
3. 确认页面中可以看到 `Demo A/C`。

官方说明，调用模拟接口不要求先开立真实证券账户。本课程也不要求你申请真实账户、提交入金或取得交易资格。页面一旦进入这些流程，先停下来请教师确认。

### 3. 只留下两个状态

第一课时结束时，只选择下面一种：

```text
能进入：我在自己的页面中看到了 Demo A/C。
不能进入：我停在【页面或动作】，页面显示【不含个人信息的错误类别】。
```

不要写“应该可以”“同学已经成功”或“只差一点”。看到了就是能进入，没有看到就是不能进入。

完成较快时，可以提前进行下一节的 CLI 安装，但只做到 `longbridge --version`，不要提前生成授权码。

## 第二课时｜安装 CLI 并完成最小授权

### 1. 在 WSL 中安装官方 CLI

以下命令必须在 WSL Ubuntu 的 Bash 中运行，不是在 Windows PowerShell 中：

```bash
uname -s
curl -sSL https://github.com/longbridge/longbridge-terminal/raw/main/install | sh
longbridge --version
longbridge auth login --help
```

最低预期：

- `uname -s` 显示 `Linux`；
- 安装脚本明确报告成功；
- `longbridge --version` 显示版本号；
- `longbridge auth login --help` 中能够找到 `--auth-code`。

安装脚本可能请求当前 WSL 用户的 `sudo` 密码。终端输入密码时没有字符显示是正常的；不要把密码发给 Agent。

这里使用的是 Longbridge 官方开源仓库给出的安装入口。不要把任意网站的 `curl ... | sh` 当成通用安装办法：域名、来源与命令目的不清楚时先停下。

如果仍显示 `longbridge: command not found`，依次检查：

```bash
command -v longbridge
ls -l /usr/local/bin/longbridge
```

不要改装 SDK、Python 包或非官方客户端来绕过本周入口。保存实际错误，转去阅读教师脱敏记录。

### 2. 在网页上只选择基础行情权限

回到：

<https://open.longbridge.com/connect>

为本次授权使用能辨认的名称，例如：

```text
W4 Basic Data s07
```

把 `s07` 换成自己的公开代号。生成授权码前逐项确认：

| 权限 | 本周选择 |
| --- | --- |
| `Basic data access` | 保留 |
| `Watchlist` | 如果默认选中，取消 |
| `Account & Positions` | 关闭 |
| `Trade Order Lookup` | 关闭 |
| `Trade Execution` | 关闭 |

你应当能够说出：“本次授权只能读取基础行情，不能查看账户和订单，更不能交易。”不能确认时不要生成代码。

### 3. 不把授权码交给 Agent

Agent Auth Code 有效期为 10 分钟，成功兑换后只能使用一次。它是临时秘密，不是课堂材料：

- 不截图、不投屏；
- 不发进 Agent 对话；
- 不写入 Markdown、代码、`.env` 或终端命令历史；
- 不复制给教师或同学。

先在 WSL 中运行下面第一行，终端等待时再点击网页上的复制按钮并粘贴。隐藏输入时屏幕不显示字符，这是正常的：

```bash
read -r -s -p "Paste W4 auth code: " W4_AUTH_CODE
echo
LONGBRIDGE_REGION=global longbridge auth login --auth-code "$W4_AUTH_CODE"
unset W4_AUTH_CODE
```

成功时应看到类似：

```text
Successfully authenticated.
```

不要把真实授权码写在 `--auth-code` 后面直接执行，否则它可能进入 shell 历史。代码失败后也不要反复提交同一个值：先检查自己仍在 `.com` 页面、使用 SG 账号，而且命令保留了 `LONGBRIDGE_REGION=global`；需要重试时回到网页生成新代码。

授权成功后，CLI 会把 token 保存在当前 WSL 用户目录。它不在 Git 项目里，但同一用户运行的 Agent 可能调用这个 CLI。因此真正的限制来自你刚才选择的最小权限，而不是“我没有把 token 写进代码”。

### 4. 让 Agent 只执行固定行情请求

把下面整段交给 W3 已配置好的本地 Agent：

```text
我们现在只验证一次 Longbridge 基础行情调用。不要枚举或读取已有环境变量，不要读取、显示或寻找授权码、token、账户信息和本地凭据文件；允许按给定命令为当前进程设置公开且非敏感的 `LONGBRIDGE_REGION=global`。不要修改授权，不要查询资产、订单或交易，也不要创建或修改项目文件。

请先逐项解释下面命令中的数据来源、标的、周期、起止日期、复权方式和输出格式；等我确认后，只运行这一条命令：

LONGBRIDGE_REGION=global longbridge kline history AAPL.US --period day --start 2025-01-02 --end 2025-01-10 --adjust none --format json

执行后只报告命令是否成功、返回记录数、每条记录的 time，以及字段名称。不要在回答中复述价格或完整 JSON；不要运行其他 Longbridge 命令，也不要 git add、commit 或 push。完成后停下来，等我核对。
```

Agent 解释准确后再允许执行。你自己核对实际命令必须是：

```bash
LONGBRIDGE_REGION=global longbridge kline history AAPL.US \
  --period day --start 2025-01-02 --end 2025-01-10 \
  --adjust none --format json
```

本次冻结结果应当有 6 条记录，对应：

```text
2025-01-02
2025-01-03
2025-01-06
2025-01-07
2025-01-08
2025-01-10
```

你要核对的是请求对象、记录数和日期。不要把价格或完整 JSON 复制进报告；Agent 的摘要也不能代替你亲眼查看实际输出。

第二课时结束时只记录：

```text
本人固定调用：成功 / 尚未成功
若未成功，停在：
屏幕上的错误类别：
```

## 第三课时｜验证权限边界并结束授权

### 1. 检查账户读取应当被拒绝

只有刚才本人授权成功、且授权尚未撤销时运行：

```bash
LONGBRIDGE_REGION=global longbridge assets --format json >/dev/null
echo "ASSET_EXIT=$?"
```

这是一次无修改作用的读取检查；`>/dev/null` 会丢弃可能的正常输出。按照本周权限合同，平台应拒绝账户读取，`ASSET_EXIT` 应为非 0。

如果 `ASSET_EXIT=0`，不要重新运行，不要查看或展示资产内容。这说明你授予的权限超出了课堂约定：立即进入下一步撤销，并在记录中写“权限范围错误”。

三类证据要分开解释：

- 授权页中亲眼看到的选择：说明当时选择了哪些权限；
- 行情调用成功：当前授权允许读取指定行情；
- 资产读取失败：只说明当前授权没有账户读取能力。

资产读取失败不能单独证明 Watchlist、订单查询和交易权限也已关闭；这些仍依赖你对授权页的核对。本周不额外测试订单或交易接口。上述证据也不能证明平台永远可用、数据绝对正确或任何策略将来盈利。

### 2. 在网页端撤销本次授权

打开 Longbridge 的已授权应用页面：

<https://open.longbridge.com/dashboard/authorized-apps>

找到自己命名的 `W4 Basic Data s07`，选择 **Revoke** 并确认。只撤销本次 W4 授权，不操作其他应用。

撤销后再次运行固定行情命令：

```bash
LONGBRIDGE_REGION=global longbridge kline history AAPL.US \
  --period day --start 2025-01-02 --end 2025-01-10 \
  --adjust none --format json
```

预期结果是服务器拒绝调用。这比只看本地 `auth status` 更可靠：网页已经撤销以后，CLI 仍可能暂时看见缓存 token，但它不应再能换来真实响应。

### 3. 清除本机登录状态

确认远程调用被拒绝后运行：

```bash
longbridge auth logout
longbridge auth status
```

- 网页 **Revoke** 让服务器不再接受本次授权；
- `auth logout` 清除本机保存的 token。

两者不是同一个动作。`auth status` 的内容不要投屏、截图或写入报告。本次练习授权到这里完整结束。以后若有新的课程任务，再按新的任务范围重新授权。

## 留下一张不含秘密的 W4 记录

在 WSL 中进入自己的课程项目，把 `s07` 换成自己的公开代号，再明确建立周目录和空白文件：

```bash
cd ~/course/ai-agents-project
mkdir -p students/s07/weeks/week-04
touch students/s07/weeks/week-04/report.md
```

随后在 VS Code Explorer 中打开 `students/s07/weeks/week-04/report.md`，由本人填写。不要让 Agent 代写人的判断。使用下面的固定结构：

```markdown
# W4 外部系统接入记录

- 我是否亲眼看到 Demo A/C：是 / 否
- 授权页中我实际选择的权限：
- 固定请求：AAPL.US / day / none / 2025-01-02..2025-01-10
- 本人固定调用：成功 / 尚未成功
- 返回记录数与日期：
- 账户读取是否被拒绝：
- 网页撤销是否完成：
- 本地 logout 是否完成：
- 这些证据能够支持：
- 这些证据仍不能支持：
- 个人完成：是 / 否
- 如果未完成，下一次只从哪里继续：
```

个人完成只能在“亲眼看到 `Demo A/C`”和“本人固定调用成功”都成立时写“是”。只要 `auth login` 成功，或 Authorized Apps 中还存在本次 W4 授权，就必须完成撤销与本地退出后再离场；只生成但没有兑换的一次性代码不等于已经建立授权。

报告中不要出现邮箱、手机号、姓名、账号编号、授权码、token、完整 JSON、价格、资产、订单、截图或本地凭据路径。提交前搜索并逐行检查；本周课堂不要求为了赶时间 commit 或 push。

## Plan B｜主线完成较快时

按顺序进行，教师一旦宣布收口就停在当前项，不继续探索新接口。

### A. 解释六条脱敏证据

教师会提供类似下面的记录：

```text
DEMO_ACCOUNT=VISIBLE
AUTH_PAGE=BASIC_DATA_ONLY_SELECTED
KLINE_ROWS=6
ACCOUNT_SCOPE=DENIED
POST_REVOKE_API=REJECTED
LOCAL_TOKEN=CLEARED
```

逐条写出它支持什么，再写出整组证据仍不能支持什么。使用教师记录时明确标注“教师示例”，不能把它写进自己的个人完成事实。

### B. 先预测，再改变一个日期

只在本次授权尚未 Revoke 时进行；已经撤销就直接跳过，不为 Plan B 重新授权。

先写下预测：把结束日期改为 `2025-01-03`，应返回几条记录？再运行：

```bash
LONGBRIDGE_REGION=global longbridge kline history AAPL.US \
  --period day --start 2025-01-02 --end 2025-01-03 \
  --adjust none --format json
```

核对预测与实际，不继续更换市场、接口或行情等级。

### C. 让 Agent 解释整条链，再由你核对

```text
不要运行命令，也不要读取任何账户、授权或本地文件。请只根据我提供的六条脱敏状态，解释“注册—身份认证—权限授权—行情成功—账户拒绝—远程撤销—本地退出”各发生在哪里，每条证据支持什么、不能支持什么。

如果一条状态不足以支持某个结论，请明确说证据不足，不要替我补全事实。解释后停止，等我逐条核对。
```

Agent 的解释只有与课堂定义和实际证据一致时才保留。

## 平台受阻时怎样继续

到教师宣布的平台操作停止点仍未完成时：

1. 停止重复登录、生成代码或更换地区；
2. 写下最后成功到达的页面或命令，以及不含个人信息的错误类别；
3. 使用教师脱敏记录完成“成功、拒绝与撤销分别证明什么”；
4. 个人完成保持“否”，课后只从真实阻塞点继续。

平台故障不是你的个人失败，但教师示例也不是你的个人成功。诚实地区分这两件事，就是本周要练习的责任。

## 遇到这些情况，先停一下

- 页面要求申请真实证券账户、入金或授予交易权限；
- 地区不是 SG，或者准备同时尝试多个账号和入口；
- Agent、同学或任何教程要求你发送邮箱验证码、授权码或 token；
- 授权页面中 `Watchlist`、账户、订单或交易权限没有关闭；
- 授权码已经截图、进入对话、文件或 shell 历史；
- `ASSET_EXIT=0`，说明账户权限可能被错误授予；
- 网页撤销后固定行情调用仍然成功；
- 账号信息、完整响应、价格或凭据出现在待提交文件；
- 同一失败重复发生，却没有新的错误信息。

停止后保留准确节点，关闭 Agent；涉及授权范围或秘密泄露时，优先撤销授权，再处理课程进度。
