# W9 Draft

> 教师临时收件箱。这里不进入网站导航；正式依据以 `runbook.md`、`slides.md` 与 `guide.md` 为准。

## 原稿路线与实测记录（任务调整待讨论）

### 2026-11-16 补充实测：普通日 K 成功

- 用户本人从 `Demo A/C` 生成新授权：仅保留 `Basic data access`，取消 `Watchlist`，账户、订单和交易均关闭；官方 CLI `0.31.2` 兑换成功，退出码为 0。本次未实名证券开户、入金或付费。
- 普通日 K 调用成功，退出码为 0，耗时约 2.34 秒：

  ```bash
  LONGBRIDGE_REGION=global longbridge kline AAPL.US --period day --count 100 --adjust none --format json
  ```

- 返回 100 条记录，字段为 `close`、`high`、`low`、`open`、`time`、`turnover`、`volume`。首条时间为 `2026-06-25T04:00:00Z`，末条时间为 `2026-11-13T05:00:00Z`；时间唯一、升序，OHLC 基本大小关系 100/100 正确。不公开价格或完整响应。
- 已确认当前 Demo 账户在上述条件下能够取得最近 100 根日 K；没有实测 1,000 根，不能把接口上限写成本账户的已验证结果。
- 固定日期的 `kline history` 任务仍未解决。此前的 `requested:0/limit:0` 不能解释为所有纯模拟账户必然没有历史额度；当前账户为何没有生效的历史额度，仍待平台按账户核查。
- [官方成员对两类接口的区分](https://github.com/longbridge/developers/issues/1308#issuecomment-6764276351)：历史接口的 `301607` 涉及每月可查询的不同标的数量；普通 `candlesticks`（最近 N 根）的同一错误码涉及单次请求根数，不能混为一谈。
- [官方成员对模拟账户的补充](https://github.com/longbridge/developers/issues/1216#issuecomment-6908289268)：模拟账户的历史额度并非天然为 0，官方另一个 paper 账户已正常返回历史日 K；这不等于当前账户的历史任务已经通过，也未给出所有纯模拟账户免费开通历史额度的统一步骤。
- 本次授权清理已完成：网页 Revoke 后列表显示 `No authorized third-party clients`；再次执行同一条最近 100 根日 K 命令，退出码为 1，明确返回 `401102`、`the access token has been revoked`；随后 `auth logout` 退出码为 0。
- W9 是否改用最近日 K、相应产物与验收如何设置，留待教师讨论；本次只记录技术可行性，不冻结新的课堂任务。

### 2026-11-16 首次授权审查与实测：固定日期任务暂不放行

- 已修正：一般错误退出不能证明权限不足；撤销后的一般失败不能证明旧授权被拒绝；记录改存个人本地目录；教师 Mac 与学生 WSL 的检查分开，隐藏输入明确在 Bash 执行。
- 已在临时目录运行官方 CLI `0.31.2`：版本、相关子命令帮助、固定 K 线命令的 `--schema`、账户接口的静态 schema 均可用；Bash 隐藏输入用假值核验通过。未恢复全局安装，未做 WSL 安装实测。
- 模拟账户已确认：用户点击 `Open mock account` 后出现“申请已提交，请勿重复提交”；正常刷新 Dashboard 后显示 `Demo A/C`。本次没有重新提交申请，也没有开立真实证券账户或入金。
- 从 Demo 页面重新授权：`Basic data access` 标为 `Included`，保持勾选；主动取消默认勾选的 `Watchlist`，账户、订单和交易均未选择。用户本人生成新授权码，CLI 兑换成功。
- 固定历史行情请求仍返回 `301607`：`history candlestick symbol count out of limit, requested:0/limit:0`。原定六个日期尚未通过实际响应验证；不能把授权成功写成历史 K 线任务成功，也不能据此推断所有模拟账户均无历史行情权限。
- 授权范围与数据额度分开判断：[官方 K 线说明](https://open.longbridge.com/docs/cli/market-data/kline) 另设按账户等级计算的历史标的额度，最低档写为 `Account opened`。文档没有明确保证纯模拟账户属于该档；不能从 `Basic data access` 推出历史额度可用；当时尚未验证普通近期 K 线，其补充实测结果见上。
- 最小真实调用已跑通：`LONGBRIDGE_REGION=global longbridge quote AAPL.US --format json` 退出码为 0，返回 1 条记录。仅核对行数、字段名，不公开价格和完整响应。这是普通行情成功，不是历史日 K 成功。
- 权限反例已跑通：`assets --format json` 的正常输出被丢弃，平台明确返回 `403308`、`Target API is not in authorized scope`，支持本次资产读取被授权范围拒绝。
- 首次授权清理已完成：网页撤销该次 Demo 测试授权，列表显示 `No authorized third-party clients`；再次执行刚才成功的 `quote AAPL.US`，明确返回 `401102`、`the access token has been revoked`；随后 CLI `auth logout` 退出码为 0。未对其他账号下的授权做额外操作。
- 尚待核验：学生 WSL 的实际安装、新学生的注册与网络条件、历史行情权益与可行替代任务。本次结果仅覆盖教师 macOS 和当前 Demo 账户；当前路线不要求为排障付费或入金。
- 内容审阅估算：原有主线约 50～85 分钟，加正常转场和共性排障更像 70～100 分钟；这些不是实测时长。注册等待与现有薄弱 Plan B 不能作为备足 150 分钟的依据，需要另行设计有明确产物和验收的实际任务。

- 主路线：SG 模拟账户 + `.com` + Longbridge CLI + Agent Auth Code。
- CLI 兑换固定使用 `LONGBRIDGE_REGION=global`。
- 权限只保留 `Basic data access`；主动取消默认 `Watchlist`，关闭账户、订单与交易。
- 固定调用：`AAPL.US / day / none / 2025-01-02..2025-01-10 / JSON`，预期 6 条记录。
- 核心个人出口：本人看到 `Demo A/C`；本人完成固定 API 调用。
- 安全闭环：资产读取被拒绝；网页 Revoke；重复调用被服务器拒绝；本地 logout。
- Plan B：解释脱敏证据；缩短一个日期区间并先预测；让 Agent 解释整条链后由学生核对。
- 不进入：数据合同、SDK、策略、订单、交易和金融知识。

## 开课前教师只核对这些事项

- 用普通网络重新打开 `https://open.longbridge.com/connect` 和已授权应用页面，确认入口仍可访问。
- 在教师机确认当前 CLI 版本能够使用 `auth login --auth-code`、`kline history`、`assets` 与 `auth logout`；重新核对官方 GitHub 安装脚本能够下载，避免依赖失效镜像。
- 预先撤销旧的课堂演示授权；准备一个可当场生成、可当场撤销的新演示授权名称。
- 准备不含账号、价格、token 和完整响应的六行脱敏证据卡。
- 确认投影不会显示浏览器自动填充、邮箱、账号编号或授权码；代码生成页不截图、不录屏。
- 把 Guide 官方链接提前打开；页面文字变化时只修正入口和按钮名，不改变权限合同。
- 准备平台不可用时的教师脱敏记录；它只能维持课堂学习，不能替学生完成个人出口。

## 本轮迁移后的待办

- 2026-11-16：由旧 W10 整体前移至 W9，技术步骤仍保留上次核对结果，不视为重新实测。
- 按 W8 形成的授课方式重新编排台本与教师展示；本轮只移动内容。
- Guide 的记录路径已改为个人本地 `~/course/w09-longbridge/notes.md`，不引入第二次 clone。
- 原 W9 的异常与失败处理保留为后续数据核验素材；W10 暂不生成新材料，W11 以后不顺移。
- 容量候选，待讨论而非已定作业：把 API 数据规范化为带批次记录的 CSV，利用乱序、缺字段和重复日期样例检验失败处理；再考虑以“修改未来数据不应改变先前预测”的测试，练习回归分析的时间边界。先解决可用数据入口，再决定是否前移这部分内容；不能把任务预算当成实测时长。

## 第一次课后只记录三个数字

- 第一课时结束，看到 `Demo A/C` 的人数：
- 第三课时第 12 分钟，完成固定调用的人数：
- W9 结束，完成个人出口且完成清理的人数：

## 第一次课后再回答

- 注册最长的等待发生在哪里：
- CLI 安装最常见的错误：
- Agent Auth 最常见的错误：
- 哪一层 Plan B 真正被使用：
- 哪一段必须增加时间：
- 哪一段可以删短：
- 下一次只改的一件事：

<!--
自由记录尚未归位的想法、链接、案例和课堂观察。

整理时只做三种去向：
- 影响教师判断与取舍 → runbook.md
- 必须让全班共同观看 → slides.md
- 学生需要独立照做或核验 → guide.md

公开仓库中不要写学生隐私、密码、授权码、token、账户信息或完整行情响应。
-->
