# W4 Longbridge 受信取数器

这是教师侧正在验证的一次性工具，不是学生系统的一部分。它只做一件事：
从 SG paper account 读取固定的一小段 AAPL 日 K，并在仓库外生成
`course.market-bars.v1` 数据包，交给学生系统验证。

固定查询为：

```text
AAPL.US · day · no adjustment · 2025-01-02 至 2025-01-10
```

程序没有自定义标的、日期、端点或下单参数；代码只导入 `QuoteContext`，不会导入或创建交易接口。

## 使用前

1. 只使用 SG 模拟账户生成的兼容 API Keys；
2. 关闭正在操作项目的 Agent 与 VS Code 调试会话；
3. Windows 中关闭剪贴板历史、跨设备同步及第三方剪贴板管理器；
4. 在 Longbridge Developer Center 点击 **Copy All**；
5. 不把凭证粘贴到对话、终端、代码、`.env`、截图或报告。

## 一次性运行

在 WSL 中进入这个经过教师核对的工具目录，只运行不含凭证的一条命令：

```bash
uv run --locked python main.py
```

macOS 教师试跑使用同一命令。程序会读取并清空**当前**系统剪贴板，解析恰好三项凭证，
删除进程继承的 `LONGBRIDGE_*` / `LONGPORT_*` 设置，强制构造
`enable_papertrading=True` 且不写 SDK 日志的配置。成功时只显示：

```text
CREDENTIAL_INPUT=PASS
PAPER_GUARD=PASS
QUOTE_CHECK=PASS
SOURCE_CONTRACT=PASS rows=6 output=/tmp/course-w4-longbridge-source.json
```

数据包权限为 `0600`，位置在 Git 仓库外。它包含课程统一字段和真实行情值，但不含凭证；
W4 学生系统读取后只公开摘要、测试状态和数据指纹，不提交这份数据包本身。

## 准确的安全边界

- “清空当前剪贴板”不等于清除 Windows 剪贴板历史、云同步或第三方管理器中的副本；
- Python 字符串、SDK 与系统进程可能在内存中产生短暂副本，不能承诺物理抹除；
- 凭证不做持久化，只在一次性进程中短暂存在；
- 普通 Agent 与受信取数器使用同一系统账号时，不存在绝对技术隔离，所以运行时必须停止 Agent，
  且之后只把不含凭证的数据包路径交给学生程序；
- 任何一次误贴、误投屏或误入文件都按泄露处理：立即在 Developer Center 作废并重新生成 Token。

## 本地验证

```bash
uv run --locked python -m unittest discover -v
```

正式冻结为全班路线前，还必须在干净 WSL、校园网络和近似学生账号上完成试跑；当前 macOS
成功只证明教师基线可行，不能证明 25 人都能顺利注册和取数。
