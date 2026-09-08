# W3 学生行动指南：把自然语言契约变成可核验项目

> 本周从一份自然语言说明出发，请本地 Agent 在你的个人目录中补全一个由 uv 管理的 Python 项目。你不需要独立写出全部代码，但必须守住目录边界、审查修改、运行公开测试，并决定是否接受这个版本。

正式项目仓库：<https://github.com/wxyinucas/ai-agents-project>

## 本周路线与边界

- 必修工作台：**VS Code + WSL**；
- 主线 Agent：VS Code 中的 **Cline**；
- 默认入口：Cline Provider 中当前标有 **FREE** 的模型；
- 低价增强：自己的 DeepSeek API Key，自愿使用、按量付费；
- 选学：Codex 图形界面或 Claude Code 终端界面。

免费模型、界面名称、账号条件和计费规则都可能变化。本页不固定模型名和软件版本；以下链接与步骤已于 2026-09-08 核对，**开课前请重新打开官方文档确认**。课程不要求购买订阅或充值，个人产生的费用不报销。

本周只处理仓库中的本地 fixture：不做 CI，不连接 Longbridge，不读取真实账户，不发起交易，也不向教师仓库提交 PR。Agent 只修改你的 `students/sXX/system/`；你亲自填写 `students/sXX/weeks/week-03/report.md`。

## 课前准备

### 1. 确认 WSL、Git 与 uv

以下命令都在 Ubuntu / WSL Bash 中运行：

~~~bash
uname -s
git --version
uv --version
~~~

最低预期：`uname` 输出 `Linux`，Git 与 uv 都能显示版本。W1 或 W2 已经完成这部分时不要重复安装。

### 2. 安装 VS Code 的 WSL 工作方式

按照 [VS Code 官方 WSL 指南](https://code.visualstudio.com/docs/remote/wsl) 操作：

1. 把 VS Code 安装在 Windows，不要在 WSL 中另装一份；
2. 在 VS Code 的 Extensions 中安装微软官方 **WSL** 扩展；
3. 从 WSL 终端进入一个 Linux 目录后运行 `code .`；
4. 确认新窗口左下角显示 `WSL: Ubuntu` 或自己的 WSL 发行版；
5. 选择 **Terminal → New Terminal**，确认新终端仍显示 Linux 路径。

第一次执行 `code .` 时，VS Code 可能自动安装配套的 VS Code Server，等待它完成即可。如果 `code` 不存在，先重开 WSL 终端，再按官方指南检查 VS Code 是否加入 `PATH`。

### 3. 安装并登录 Cline

按照 [Cline 官方安装页](https://docs.cline.bot/getting-started/installing-cline) 操作：

1. 在已经连接 WSL 的 VS Code 窗口中点击 Extensions，或按 Ctrl+Shift+X；
2. 搜索 Cline，打开 Cline 扩展页面并选择 Install；
3. 如果页面显示 **Install in WSL: Ubuntu**，按提示安装到当前 WSL 环境；
4. 点击 Activity Bar 中的 Cline 图标；若图标没有出现，重启 VS Code；
5. 打开 Cline 设置，把 API Provider 设为 **Cline**；
6. 选择 Sign In，在浏览器中用 GitHub、Google 或邮箱完成登录；
7. 返回 VS Code，选择当前标有 **FREE** 的模型。

[Cline 官方登录与模型说明](https://docs.cline.bot/getting-started/authorizing-with-cline) 说明，登录凭据由 IDE 的原生安全存储管理；免费模型会轮换，也可能有临时配额。不要因为某个免费模型暂时不可用而在课堂中匆忙付费。

#### 可选：改用 DeepSeek API

只有在你已有 DeepSeek 账号并理解按量计费时才使用这条路线。以 [Cline 官方 DeepSeek 配置页](https://docs.cline.bot/provider-config/deepseek) 为准：

1. 登录 [DeepSeek 开放平台](https://platform.deepseek.com/)；
2. 在 API Keys 页面创建一个仅供本机使用的 Key；
3. 立即把 Key 保存到自己的密码管理工具；
4. 在 Cline 设置中把 API Provider 改为 **DeepSeek**；
5. 只把 Key 粘贴到 Cline 专用的 DeepSeek API Key 字段；
6. 从当前列表选择可用模型，保存后发一条普通消息检查连接。

模型与费用以 [DeepSeek 官方实时价格页](https://api-docs.deepseek.com/quick_start/pricing/) 为准，不照抄旧教程中的模型名或价格。

### API Key 是密码，不是项目材料

- 不把 Key 发送到 Cline 对话或任何其他聊天输入框；
- 不把 Key 写入代码、PROJECT_BRIEF.txt、.env、VS Code 设置文件、作业记录或截图；
- 优先使用 Cline 的专用凭据字段和 IDE 安全存储；
- 不在投屏、录屏或结对核验时展示 Key；
- 一旦怀疑泄露，立即在服务商后台撤销旧 Key，再创建新 Key。

到课程公布的 Agent 安装硬停止点仍不能让 Cline 正常响应时，记录 **BLOCKED-AGENT**，停止反复安装、换模型或充值。你仍可使用既有 diff 或同伴屏幕继续练习审查，但不能把这种跟随记录成“我已完成 Agent 配置”或 ACCEPT。

## 取得自己的正式项目

### 1. 在 GitHub 网页 fork

1. 打开 <https://github.com/wxyinucas/ai-agents-project>；
2. 点击 Fork，在自己的 GitHub 账号下建立 fork；
3. 确认仓库所有者是自己，并显示它 fork 自 wxyinucas/ai-agents-project。

不要在教师仓库中直接编辑，也不要创建 upstream PR。

### 2. 从自己的 fork clone

把 `YOUR_GITHUB_NAME` 换成自己的 GitHub 用户名。项目放在 WSL 文件系统的 `~/course` 下，不放在 `C:\` 或 `/mnt/c` 中。本周延续 W2 的 HTTPS 路线，不在课堂临时配置 SSH Key。

~~~bash
mkdir -p ~/course
cd ~/course
ls
git clone "https://github.com/YOUR_GITHUB_NAME/ai-agents-project.git"
cd ai-agents-project
~~~

如果 ~/course/ai-agents-project 已存在，不要删除、覆盖或再次 clone；先确认它是否就是本课程项目。

新 clone 的仓库已把自己的 fork 记为 `origin`。本周不需要另加 `upstream`：

~~~bash
git remote -v
pwd
git rev-parse --show-toplevel
git status --short --branch
~~~

最低预期：

~~~text
origin    https://github.com/YOUR_GITHUB_NAME/ai-agents-project.git
~~~

fetch 与 push 两行都可能显示，这是正常的。`origin` 必须是自己的 fork；分支应为 `main`，起点不应有未解释的修改。

### 3. 提前检查本地提交身份

W3 第一次从 WSL 产生本地 commit。先查看当前项目实际会使用的名称和邮箱：

~~~bash
git config --get user.name
git config --get user.email
~~~

任一项为空时，不要等到第三课时才处理。从 GitHub **Settings → Emails** 查看自己的 `noreply` 地址，再只为当前仓库设置：

~~~bash
git config user.name "YOUR_PUBLIC_NAME"
git config user.email "YOUR_GITHUB_NOREPLY_EMAIL"
~~~

这里故意不使用 `--global`：设置只对当前项目生效，不替你决定其他项目的身份。地址要从本人账号复制，不要根据格式猜测。参考 [GitHub 官方的提交邮箱说明](https://docs.github.com/zh/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address)。

### 4. 初始化自己的学生目录

仍在仓库根目录，把 `s07` 换成教师分配给你的公开代号，只运行一次：

~~~bash
bash course/week-03/init-student.sh s07
~~~

成功时应看到：

~~~text
STUDENT_INIT=PASS
student=s07
system=students/s07/system
report=students/s07/weeks/week-03/report.md
~~~

脚本只接受 `sNN` 形式的代号。个人目录已经存在时，它会停止而不会覆盖；不要删除目录后重来，请先核对自己是否曾经初始化过。成功后确认以下两个位置存在：

~~~bash
ls -la students/s07/system
ls -l students/s07/weeks/week-03/report.md
~~~

## 从 WSL 打开正确的 VS Code 窗口

仍在仓库根目录运行：

~~~bash
code .
~~~

在 VS Code 中认出五个固定工作位置，并各做一次动作：

| 工作位置 | 本周用它做什么 |
| --- | --- |
| 文件资源管理器（Explorer） | 确认项目文件与目录结构 |
| 编辑器（Editor） | 阅读 brief、测试、代码和 diff |
| 集成终端（Terminal） | 确认当前目录，运行 uv 与 Git 命令 |
| 源代码管理／差异视图（Source Control） | 找到所有变化，逐文件检查内容 |
| Cline 对话面板 | 给出任务，阅读行动请求，决定是否授权 |

Activity Bar 是切换这些视图的图标栏，Extensions 只是安装 Cline 的入口，不另算一个工作位置。Status Bar 用来确认 WSL 和当前分支。

在集成终端再次运行：

~~~bash
pwd
git status --short --branch
~~~

如果路径不是刚才的 WSL 仓库，或左下角不是 WSL，关闭窗口，回到 WSL 项目目录重新运行 code .。不要让 Agent 在错误目录中“帮忙找项目”。

## 先认识 starter

Explorer 中应当看到：

~~~text
course/
└── week-03/
    ├── PROJECT_BRIEF.txt
    ├── data/sample_prices.csv
    ├── tests/
    │   ├── fixtures/
    │   │   ├── another_valid_prices.csv
    │   │   ├── missing_close.csv
    │   │   ├── missing_symbol.csv
    │   │   └── missing_timestamp.csv
    │   └── test_project_contract.py
    ├── report-template.md
    └── init-student.sh
common/
students/
├── README.md
└── s07/
    ├── system/
    └── weeks/week-03/report.md
README.md
.gitignore
~~~

- `course/week-03/` 是教师给定的本周合同：任务、数据、公开测试、报告模板和初始化脚本；
- `common/` 是教师公共区，将来按课程进度增加稳定能力；
- `students/s07/system/` 是你的唯一持续系统，后续周次继续在这里演化，不按周复制源码；
- `students/s07/weeks/week-03/report.md` 是本周责任记录，由你本人填写；
- 根 `README.md`、`.gitignore` 与 `students/README.md` 也是教师保护文件。

此时你的 `system/` 中没有 pyproject.toml、uv.lock 和源码是正常的：把契约转成这些项目文件，正是本周任务。

保护范围固定为：根 `README.md`、`course/**`、`common/**`、根 `.gitignore`、`students/README.md`、其他学生目录，以及由你亲自填写的本周报告。Agent 只可以修改你自己的 `students/s07/system/**`。

## Prompt 1｜只读确认，不允许修改

把下面整段交给 Cline：

~~~text
你现在只做只读检查。不要创建、修改或删除文件，不要安装依赖，不要运行会改变项目的命令，不要读取或显示任何环境变量、API Key 或凭据。

请完成以下事项：
1. 说明你当前看到的工作目录，并判断它是否是 ai-agents-project 的 Git 根目录。
2. 我的课程公开代号是 s07。区分 course、common 和 students 三个区域，确认你之后只可以修改 students/s07/system；students/s07/weeks/week-03/report.md 由我自己填写。
3. 阅读 course/week-03/PROJECT_BRIEF.txt 与 course/week-03/tests/test_project_contract.py，复述本周目标、输入、成功输出、失败行为，以及从 students/s07/system 中运行的验收命令。
4. 列出所有保护区域，以及你预计只在 students/s07/system 中新增的文件；不要现在创建它们。
5. 说明五项公开测试分别检查什么，并指出测试通过仍不能证明什么。

如果目录、brief 或测试不完整，请停止并明确指出缺少什么。完成复述后等待我的确认，不要开始实现，也不要执行 git add、commit 或 push。
~~~

把示例中的 `s07` 全部换成自己的公开代号。你自己打开 brief 和测试，至少核对：项目名是 quant-lab；Python 是 3.12.x；输入至少有 timestamp、symbol、close；失败必须非零退出并包含 DATA_CHECK=FAIL；Agent 只改本人 `system/`；教师区、公共区、根保护文件、本人报告和其他学生目录不得修改；本周不读取凭据、不连接网络服务、不实现未来功能。

Agent 说错目录、保护范围或验收命令时，不要发 Prompt 2。

## Prompt 2｜生成最小项目，但不得提交

确认 Prompt 1 的复述准确后，再发送：

~~~text
我已核对你的复述。我的课程公开代号是 s07；现在允许你按 course/week-03/PROJECT_BRIEF.txt 补全 students/s07/system。

请只在 students/s07/system 中生成一个足够小、便于初学者解释的 uv Python 项目，并严格满足全部公开测试。不要修改根 README.md、course/**、common/**、根 .gitignore、students/README.md、students/s07/weeks/** 或其他学生目录；不要读取环境变量或凭据，不要连接行情、账户或其他网络服务，不要生成策略、订单、数据库、网页或未来功能的空壳。

请自行完成必要的最小项目结构、pandas 运行依赖、pytest 开发依赖、market-check 命令入口和 uv.lock。所有实现命令都从 students/s07/system 中运行。先生成锁文件，再运行并报告下列验收的真实结果：

cd students/s07/system
uv sync --locked
uv run --locked pytest -q ../../../course/week-03/tests
uv run --locked market-check ../../../course/week-03/data/sample_prices.csv
uv run --locked market-check ../../../course/week-03/tests/fixtures/missing_close.csv
echo "FAILURE_EXIT=$?"

遇到失败时查明原因并在约束内修正；如果必须修改保护文件或扩大范围，请停止并问我。完成后逐项列出新增或修改的文件、每个文件的职责、测试结果和仍未证明的内容。

不要填写我的 report.md，不要执行 git add、git commit、git push，不要创建或切换分支。完成后停下来，等我独立检查。
~~~

Cline 请求权限时先读清动作，只批准本人 `system/` 内的文件操作，以及从该目录运行的建项目／验收命令。不要开启“全部自动批准”，也不要批准读取凭据、修改保护区或仓库外文件、删除目录、强制重置或向远端写入。

## 独立检查 Agent 的结果

### 1. 文件范围与 diff

~~~bash
cd ~/course/ai-agents-project
git status --short
git diff --cached --name-status
git diff --cached
git add --intent-to-add .
git diff HEAD --name-status
git diff HEAD
git diff HEAD -- README.md course common .gitignore students/README.md
~~~

这些命令从仓库根运行；把 `s07` 换成自己的公开代号。两条 `git diff --cached` 命令检查 Agent 是否擅自暂存了内容；正常应没有输出。`--intent-to-add` 让仓库中所有全新文件进入完整 diff，但不会暂存其内容。随后检查每一条变化路径：都必须位于本人的 `students/s07/**`；教师／公共保护区的最后一条 diff 必须没有输出，其他学生目录也不能出现变化。此后 `git status --short` 中的 ` A` 是审查标记，不代表文件内容已暂存；选择 HOLD 时可以保留该状态。仍要在 VS Code 源代码管理面板中逐个打开变化文件。

至少确认：

- `students/s07/system/` 中存在 pyproject.toml 和 uv.lock；
- 其中的 pyproject.toml 声明 quant-lab 与 Python >=3.12,<3.13；
- pandas 是运行依赖，pytest 是开发依赖；
- market-check 指向真实实现，而不是固定打印样例答案；
- 源码只读取传入的本地 CSV，不读取密钥或环境变量，不连接网络；
- .venv、缓存、凭据和无关文件没有出现在待提交清单中；
- Agent 没有修改本人 `system/` 以外的任何文件；
- 你能用一句话说明每个新增源文件的职责。

测试通过不能抵消越界修改。出现无法解释的文件、保护文件变化或敏感信息时，选择 HOLD。

### 2. 自己跑完验收路线

~~~bash
cd students/s07/system
uv sync --locked
uv run --locked pytest -q ../../../course/week-03/tests
uv run --locked market-check ../../../course/week-03/data/sample_prices.csv
uv run --locked market-check ../../../course/week-03/tests/fixtures/missing_close.csv
echo "FAILURE_EXIT=$?"
cd ../../..
~~~

公开测试当前有五项。没有自行增加测试时，最低预期是 `5 passed`，且没有 `failed` 或 `error`。前三条命令应正常结束；缺列命令应输出 `DATA_CHECK=FAIL`，紧接着的一行应显示 `FAILURE_EXIT` 为非 0。这是“程序成功拒绝错误输入”的证据，不是需要被消除的红灯。`echo` 必须在失败命令之后立即运行，否则它显示的就不是该命令的退出状态。

样例程序的可见事实应为：

~~~text
execution_mode=fixture
symbols=AAPL
rows=4
start=2026-09-01T09:30:00
end=2026-09-01T09:33:00
DATA_CHECK=PASS
~~~

公开测试还会使用另一份正常数据、缺列数据和不存在的路径，所以只把这六行写死不能通过。

### 3. 解释一项测试

从 `course/week-03/tests/test_project_contract.py` 中选一项，请 Agent 用日常语言解释，再由你对照源码填写本人的 `students/s07/weeks/week-03/report.md`：

~~~text
测试名称：
它给程序的输入：
它期待的结果：
我的实际结果：
它支持我作出的判断：
即使通过，它仍不能证明：
~~~

如果只能复述“绿了”，却说不清输入和期待结果，证据还不足以 ACCEPT。

## 作出 ACCEPT 或 HOLD

只有同时满足下面条件才选择 ACCEPT：

- 仓库根、本人 `system/` 和 `origin` 都正确；
- Agent 只改本人 `system/`，保护区保持原样，修改范围可以逐项解释；
- 锁定环境、公开测试和正常样例都成功，失败样例明确拒绝并返回非 0；
- 输出来自实际读取数据，不是硬编码；
- 没有密钥、真实账户、联网功能或越界文件；
- 你能解释一项公开测试及其证据边界。

状态分界只看一件事：自己的仓库里是否已经有一份可以完整审查的候选实现。

- Agent 在硬停止前没有产生这样的候选实现，包括安装、登录、工作区失败、会话中断或生成未完成：选择 BLOCKED-AGENT；
- 候选实现已经存在，但范围、测试、证据或发布条件有一项不满足：选择 HOLD。

两种情况都保留现场，不为得到完成标签而删除测试或掩盖错误。

打开 `students/s07/weeks/week-03/report.md`，由你本人填写，不把这一步交给 Agent：

~~~text
决定：ACCEPT / HOLD / BLOCKED-AGENT
我实际使用的 Agent 与模型路线：
origin：
Agent 新增或修改了什么：
保护文件是否未变：
验收路线的真实结果：
我能解释的一项测试：
这些证据能够证明：
这些证据仍不能证明：
若未接受，下一步只做什么：
~~~

## 只有 ACCEPT 才保存并 push

确认自己已经回到仓库根，把 `s07` 换成自己的公开代号。只暂存经过审查的个人系统和本人填写的本周报告；不使用 `git add .`、通配符或“全部暂存”：

~~~bash
git add -- students/s07/system students/s07/weeks/week-03/report.md
git diff --cached --name-only
git diff --cached
git diff --cached -- README.md course common .gitignore students/README.md
~~~

确认前两条 diff 中的每个文件都属于 `students/s07/**`，最后一条保护区 diff 没有输出，再运行：

~~~bash
git commit -m "Build W3 fixture data checker"
git push origin main
git status --short --branch
git log -1 --oneline
~~~

第一次 push 时，VS Code 可能要求在浏览器中登录 GitHub；按界面返回 VS Code，不在终端输入 GitHub 密码或把 token 交给 Agent。也可以在 Source Control 的 `…` 菜单选择 **Push**，使用同一个浏览器登录流程。参考 [VS Code 官方 GitHub 工作流](https://code.visualstudio.com/docs/sourcecontrol/github)。

不要创建指向教师仓库的 PR，也不要创建 `dev-week-03` 或其他周分支。W3 只在个人 `origin/main` 上持续；push 失败时保留本地 commit 和完整错误，不要强制 push。

## 参考实现与 W4 恢复基线

参考实现会在第三课时讨论结束后公开，而不是在你第一次作出 ACCEPT/HOLD 之前公开。它是一种可比较、可恢复的实现，不是唯一正确答案。

- 已经 ACCEPT：后续继续演化同一个 `students/sXX/system/`，并把参考实现用于比较；
- HOLD 或 BLOCKED-AGENT：可以在 W4 前采用教师发布的恢复基线；
- 无论选择哪条路线，都不要删除或覆盖本周第一次尝试；按届时发布的无损取得步骤保留它。新的周次只在 `students/sXX/weeks/week-XX/` 增加责任记录，不复制一份新的源码。

## 选学：Codex GUI 与 Claude Code TUI

选学工具不影响 W3 完成判定。不要同时让两个 Agent 修改同一个工作目录；若试用，先完成主线或使用另一个独立副本。

### Codex GUI

Codex 图形界面当前位于统一的 ChatGPT desktop app 中。安装与入口以 [OpenAI 官方桌面应用指南](https://learn.chatgpt.com/zh-Hans/docs/app) 为准：

1. 从官方页面安装 ChatGPT desktop app；
2. 启动应用，用自己的 ChatGPT 账号登录并进入 Codex；
3. 添加或打开本地课程项目；
4. Windows 用户若要让 Agent 在 WSL 中工作，按 [OpenAI 官方 Windows/WSL 指南](https://learn.chatgpt.com/zh-Hans/docs/windows/windows-app) 在设置中把 Agent 环境切换为 WSL，重启应用后再添加 WSL 中的课程仓库；
5. 保留沙箱与 **Ask for approval**，不要授予完整系统访问；
6. 先发送 Prompt 1，确认目录与权限，再决定是否发送 Prompt 2。

如果账号没有 Codex、额度不可用或系统不受支持，到此停止即可；课程不要求为选学工具付费，也不提供绕过地区或账号限制的方法。

### Claude Code TUI

课程项目位于 WSL，因此也应在 WSL 内安装和运行。以 [Anthropic 官方安装说明](https://code.claude.com/docs/en/installation) 为准。官方当前推荐的原生安装路线是：

~~~bash
curl -fsSL https://claude.ai/install.sh | bash
~~~

这会下载并执行脚本，因此只从上面的 Anthropic 官方页面复制，不使用博客、网盘或群聊转发的命令。安装后重开 WSL 终端，再运行：

~~~bash
claude --version
claude doctor
cd ~/course/ai-agents-project
claude
~~~

第一次运行会引导浏览器登录。WSL2 中若浏览器不能自动返回终端，按界面提示复制登录地址或验证码，不把验证码发给他人。进入后先使用 Prompt 1，并逐项审查权限请求；按 Ctrl+D 可以退出。

Claude Code 不包含在免费 Claude.ai 套餐中，通常需要符合条件的订阅、Console 余额或组织账号；服务地区也有限制。没有现成条件就跳过，不要为 W3 临时购买。

## 必须停下来的情况

- Agent 看到的不是当前 WSL 仓库；
- `origin` 不是自己的 fork；
- 初始化命令中的代号不是教师分配的本人 `sNN`，或目标目录已经存在；
- Agent 要修改根 `README.md`、`course/**`、`common/**`、根 `.gitignore`、`students/README.md`、本人周报告或其他学生目录；
- Agent 索取、读取或显示 API Key、token、.env 或真实账户信息；
- Agent 要连接行情、账户或其他网络服务；
- Agent 建议删除目录、强制重置、强制 push 或向远端写入；
- 当前工作区包含自己无法解释的修改；
- 同一操作反复失败，却没有得到新证据。

不要只写“失败”。完整错误、最后成功检查点和明确下一步，才是可以继续工作的记录。
