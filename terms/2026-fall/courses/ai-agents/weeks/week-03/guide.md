# W3 学生行动指南：接通 Agent，完成一份实验报告

> 先接通自己的 DeepSeek API，再让 Agent 协助完成“投针实验 → 图表 → LaTeX 报告 → Git 版本”。按顺序跟做即可；没完成的步骤可以课后继续。

## 本周路线与边界

- 必修工作台：**VS Code + WSL**；
- 主线 Agent：VS Code 自带的 **Chat → Agent**；
- 模型服务：自己的 **DeepSeek API Key**，按量付费；
- 教师展示：Codex 的 VS Code 原生扩展；学生无需安装或登录；

这条自带 Key（BYOK）的 Chat/Agent 路线不要求 GitHub 登录或 Copilot 订阅；**不等于 DeepSeek API 免费**。按平台要求准备少量可用余额，费用不报销；有支付或账号困难时向教师求助，不购买额外订阅。

以下配置依据 2026-10-05 的官方文档整理，真实接入仍待教师试跑。软件入口、模型 ID 和价格会变化，以 [VS Code 官方模型说明](https://code.visualstudio.com/docs/agent-customization/language-models)和 [DeepSeek 官方文档](https://api-docs.deepseek.com/)为准。

## 课前准备

沿用 W2 已经使用的 **VS Code + WSL** 环境，以及 `~/course/w02-workbench` 中的 `ai-agents` 仓库和本地 commit。不重复安装 WSL、VS Code、Git 或 uv，也不重新 clone。

还没有完成前两周配置时，参考 [W1 Guide](#/terms/2026-fall/courses/ai-agents/weeks/week-01/guide) 和 [W2 Guide](#/terms/2026-fall/courses/ai-agents/weeks/week-02/guide)补做即可。

## 接入 DeepSeek API

### 1. 打开已有工作区

在 WSL Bash 中运行：

~~~bash
cd ~/course/w02-workbench
code .
~~~

这是上周用过的工作区，里面已有 `README.md` 和 Git 历史，不需要新建或改写 README。左下角仍应显示 `WSL: Ubuntu`。若窗口处于 **Restricted Mode**，通过 **Manage Workspace Trust** 检查这个已知课程工作区的信任状态，否则模型选择器可能只显示 `Auto`。

### 2. 准备自己的 API Key

1. 注册或登录 [DeepSeek 开放平台](https://platform.deepseek.com/)；网页版聊天账号可用，不代表 API 已有可用余额。
2. 查看余额与 [当前 API 价格](https://api-docs.deepseek.com/quick_start/pricing/)，需要时按平台要求小额充值。
3. 在 **API Keys** 中创建 Key，例如命名为 `w3-vscode`，立即妥善保存。

**Key 是密码，不是项目材料。** 只填入软件提供的凭据输入框；不发到聊天、不写入代码或配置文件、不放进截图或 Git。怀疑泄露时，在平台撤销旧 Key 再创建新的。

### 3. 在 VS Code 添加模型

使用编辑器自带的 **Chat** 面板，不是 Codex、Cline 面板，也不是单独的 Agents window。

1. 按 `Ctrl+Shift+P`，运行 **Chat: Manage Language Models**。
2. 选择 **Add Models → Custom Endpoint**。找不到这个入口时，先更新 VS Code，再重新打开模型管理。
3. 按提示填写分组／显示名称（例如 `DeepSeek`）和自己的 API Key；API 类型选择 **Chat Completions**。
4. VS Code 自动打开 `chatLanguageModels.json`。**保留生成的 `name`、`vendor`、`apiKey` 引用与其他字段**，只把 `models` 属性的数组值替换为下面的数组：

~~~json
[
  {
    "id": "deepseek-flash",
    "name": "DeepSeek Flash",
    "url": "https://api.deepseek.com/chat/completions",
    "toolCalling": true,
    "vision": true,
    "contextWindow": 1000000,
    "maxOutputTokens": 8192,
    "modelOptions": {
      "thinking": {
        "type": "disabled"
      }
    }
  }
]
~~~

不要把上面的数组覆盖到整个文件，也不要把明文 Key 写进 `apiKey`。原来生成的 `${input:…}` 是凭据引用，应保持不变。模型的 `url` 使用完整接口路径，不只填域名。

本次先关闭 thinking，缩短接入链路；`8192` 是本次配置的单次输出上限，不是模型能力上限。当前 `deepseek-flash` 支持工具调用与图像输入，模型信息以后可能更新，不照抄旧教程中的名称和能力。

5. 保存文件，回到 Chat，在模型选择器中选 **DeepSeek Flash**，模式选 **Agent**。
6. 保持默认的权限批准机制，不开启全部自动批准。模型未出现时，先保存并重启 VS Code；仍不行就带着实际界面向教师或已有可用的 Agent 求助。

### 4. 发出一条真实请求

在新的 Agent 对话中发送：

~~~text
请读取当前工作区的 README.md，告诉我这个项目的目标。
先不要修改文件或运行命令。
~~~

- 确认当前选中的是 **DeepSeek Flash**，不是 `Auto` 或其他模型。
- 查看工具记录，确认读取的是工作区中的 `README.md`；若需要批准，检查对象后再批准。
- 对照 README 核对回答。**成功响应证明 API 接通；读取记录帮助确认 Agent 使用了本地工具。** 不要求余额立刻出现肉眼可见的变化。

接着让 Agent 帮你打开 W2 用过的 Git 面板：

~~~text
请帮我打开 VS Code 的 Source Control（Git）面板，简单解释它有什么用。
如果你不能直接操作界面，就告诉我怎么打开，让我来做；不要修改文件或初始化仓库。
~~~

看到 Source Control 面板就完成这个小操作，仍使用上周的 Git 仓库，不重新初始化。留意这一步是 Agent 直接执行，还是你按它的指导完成。

两个目标：**让 Agent 帮助建立心智模型，也让 Agent 帮忙实现具体任务。** 完成这个固定操作后，再从其他不懂的按钮、文件或报错开始探索。

遇到报错，提供模型名、实际页面和完整错误，隐藏 Key 后求助。不要靠反复充值解决配置问题。

### macOS 补充

macOS 沿用 W2 的本地工作区，不安装 WSL；从 Terminal 进入目录后 `code .`，不需要左下角出现 `WSL: Ubuntu`。命令面板快捷键改为 `Cmd+Shift+P`，模型配置步骤相同。`code` 不存在时，在命令面板运行 **Shell Command: Install 'code' command in PATH**，再重新打开终端。

---

## 让 Agent 完成数值实验与 LaTeX 报告

接通 Agent 后，更新已有的 `ai-agents` 仓库，在其中的 `week-03/` 完成一份可以重新生成的蒲丰投针实验报告。本周不 clone 另一个课程仓库，也不复制材料到仓库外。

### 1. 安装编辑扩展和编译器

**LaTeX Workshop 是编辑扩展，XeLaTeX 是编译器。** 只安装扩展，不能把 `.tex` 变成 PDF。

1. 在 VS Code 按 `Ctrl+Shift+X`，搜索 **LaTeX Workshop**，确认作者是 **James Yu**。
2. 点击安装；若显示 **Install in WSL: Ubuntu**，安装到当前 WSL 环境。
3. 打开 **Terminal → New Terminal**，确认这是 WSL Bash，运行：

~~~bash
xelatex --version
latexmk --version
~~~

能看到两个版本就跳过安装。缺少组件时，在同一个终端运行：

~~~bash
sudo apt update
sudo apt install texlive-xetex texlive-lang-chinese latexmk
~~~

下载可能较大，等待安装完成，再运行前面的版本检查。sudo 密码由你自己在终端输入；输入时不显示字符是正常现象，不交给 Agent。

可以让已经接通的 Agent 帮忙检查：

~~~text
检查当前 WSL 工作区的 LaTeX 环境，目标是 LaTeX Workshop、XeLaTeX 和 latexmk。
先列出已有和缺少的组件，再帮我配置缺少的部分。
遇到 sudo，把命令交给我在终端执行；不要索取密码。
~~~

macOS 补充：不安装 WSL，也不运行 apt。先检查已有的 XeLaTeX；没有 TeX 环境时可在自己的 Terminal 使用 `brew install --cask mactex-no-gui`。安装完成后重开终端，再检查版本；若找不到命令，请让 Agent 检查 `/Library/TeX/texbin` 是否在 PATH 中。已有可用环境时不重复安装；已有 XeLaTeX 但没有 latexmk 时，首次编译可运行 `xelatex -interaction=nonstopmode -halt-on-error report.tex` 两遍，后面的重建脚本也支持这条路线。

参考：[LaTeX Workshop 安装说明](https://github.com/James-Yu/LaTeX-Workshop/wiki/Install)、[MacTeX 的 Homebrew 入口](https://formulae.brew.sh/cask/mactex-no-gui)。

### 2. 用 Git 获取教师材料

教师材料在 [ai-agents 的 week-03](https://github.com/wxyinucas/ai-agents/tree/main/week-03)。其中只有实验要求、报告模板、重建脚本和公开测试，**没有完整答案**。

在 WSL Terminal 中更新上周已经 clone 的仓库：

~~~bash
cd ~/course/w02-workbench
git pull --no-rebase origin main
~~~

成功后，打开本周实验目录：

~~~bash
cd week-03
code .
~~~

这里使用 W2 克隆时记录的教师 `origin`。遇到报错或目录没有出现时，使用本页末尾的备用提示向 Agent 求助。

现在应该看到：

~~~text
w02-workbench/week-03/
├── README-materials.md       # 材料说明
├── EXPERIMENT.txt            # 实验和接口要求
├── report.tex                # 中文报告模板
├── rebuild.sh                # 统一重建入口
└── tests/                    # 教师公开测试
~~~

阅读 `README-materials.md` 和 `EXPERIMENT.txt`，随后直接在这个目录完成实现和报告。

**Python 项目独立，Git 历史沿用。** W3 的 `pyproject.toml`、`uv.lock` 和 `.venv` 都放在 `week-03/`，不改仓库根目录的 W2 项目；不复制文件，不在子目录执行 `git init`。

### 3. 先编译空报告

在 Explorer 中打开 `report.tex`，让 Agent 编译：

~~~text
请用 XeLaTeX 编译提供的 report.tex，让我看到 PDF。
保持模板的字体和版式，先不加入实验图表；有错误就按日志修复并重新编译。
~~~

也可以自己在项目根目录运行：

~~~bash
latexmk -xelatex -interaction=nonstopmode -halt-on-error report.tex
~~~

成功后，在 Explorer 中打开 `report.pdf`。此时尚未运行实验，报告中显示“结果尚未生成”是正常的；**先确认中文和 PDF 能正常显示**。

以后也可以在命令面板运行 **LaTeX Workshop: Build with recipe**，选择 XeLaTeX 配方。若现有配方不是 XeLaTeX，先让 Agent 配好，不要因为报错反复换编译引擎。参考：[LaTeX Workshop 编译说明](https://github.com/James-Yu/LaTeX-Workshop/wiki/Compile)。

### 4. 建立 uv 项目，运行投针实验

实验任务：随机把短针投到等距平行线上，统计触线次数，用它估计 π。学生做批量模拟，不要求做课堂展示中的动画。

向 Agent 发送：

~~~text
阅读 EXPERIMENT.txt 和 tests，在当前 week-03 目录建立独立的 uv Python 3.12 项目，
加入 matplotlib 和 pytest，并生成 uv.lock。
pyproject.toml、uv.lock 和 .venv 都放在 week-03，不改仓库根目录的 W2 项目。
使用 uv init 时加 --no-workspace，不把 W3 加入父项目。
在本周 pyproject.toml 的 [tool.pytest.ini_options] 中设置 testpaths = ["tests"]，不沿用 W2 测试配置。
实现蒲丰投针，默认 seed=42，比较 1000、10000、100000 次投针。
每次独立实验只初始化一次随机数生成器，不在取样循环中重设 seed。
适配教师 rebuild.sh：experiment.py 运行实验，render_results.py 生成图表。
实际运行并保存结果；不做动画，不修改教师脚本与公开测试。
~~~

Agent 请求运行命令或修改文件时，查看它要做什么，再批准。它可以解释不懂的步骤，但不能代替你核对实际结果。

完成后，在项目根目录自己运行：

~~~bash
uv run --locked python experiment.py
~~~

打开 `results.csv`。每行应包含实际使用的 `seed`、投针数 `n`、触线数 `crossings`、估计值 `pi_estimate`、针长 `needle_length` 和线距 `line_spacing`。默认三组投针数都应出现在结果中。

默认种子是 `42`。**随机种子是可复现的起点，不是让结果变好的按钮**；不要在每次落针前重设它。相同环境、参数和种子应能重复运行得到相同结果。

`uv run --locked` 使用已有锁文件；如果提示依赖或锁文件不一致，让 Agent 检查 `pyproject.toml` 和 `uv.lock`，不要直接删除整个环境重来。

### 5. 运行公开测试

在项目根目录运行：

~~~bash
uv run --locked pytest -q
~~~

这些测试检查：

- 已知针位是否触线，包括刚好触线的情况；
- 给定投针数和触线数，估计公式是否算对；
- 固定环境、参数与 seed 能否复现；
- CSV 的记录是否和实际模拟、估计公式一致。

例如默认针长与线距下，100 次投针、32 次触线的估计值是 `3.125`。这类已知答案用于检查规则，**不是要求随机实验每次都接近 π**；投针数增加也不保证每次误差都变小。

有失败时，复制实际输出给 Agent：

~~~text
这是公开测试的失败输出：……
请对照 EXPERIMENT.txt 定位并修复实现，说明错在哪里，然后重新运行测试。
不要修改教师测试，也不要把结果写死。
~~~

最后由你自己再运行一次。看到没有失败项再继续；`collected 0 items` 或没有执行测试，不算通过。

### 6. 用同一份结果生成图、表和报告

向 Agent 发送：

~~~text
读取实际 results.csv，完成 render_results.py：
生成 results-table.tex、results-params.tex 和一张静态 results.png，
让 report.tex 使用这些结果，写一段简要方法和一句观察，再编译 PDF。
保留模板版式和实际 seed、投针数；不要编造或手工美化结果。
~~~

随后自己运行两条命令：

~~~bash
uv run --locked pytest -q
bash rebuild.sh
~~~

教师的 `rebuild.sh` 依次执行“运行实验 → 生成表图 → 编译报告”；失败时停止并显示所在阶段。**它不运行测试**，因此测试单独执行。

打开 `results.csv`、`results.png` 和 `report.pdf`，核对：

- 表格中的投针数、触线数和估计值，以及报告中的 seed、针长与线距，与 CSV 一致；
- 图对应这次实验，坐标轴和各组结果可以辨认；
- 报告写明实际参数，中文、图、表没有截断或缺失。

这里验收的是实现与记录正确，不是“必须算得比别人更接近 π”。未完成者继续这个项目，不需要重新起一个任务。

## 保存并上传自己的版本

### 1. 保存第一版

W3 目录属于上周的 Git 仓库，已经有 W2 的 commit。先让 Agent 整理本周需要保存的文件：

~~~text
请在当前 week-03 目录补齐 .gitignore，排除虚拟环境、缓存、LaTeX 中间文件和凭据。
保留源码、uv.lock、教师材料及报告所需的结果，不修改 W2 文件。
沿用已有 Git 仓库和 W2 历史，不在 week-03 重新初始化。
先让我查看待提交文件，不要替我提交或上传。
~~~

通常需要忽略 `.venv/`、`__pycache__/`、`.pytest_cache/`、`*.aux`、`*.log`、`*.out`、`*.synctex.gz`、`*.fdb_latexmk`、`*.fls`。不要忽略 `.tex` 源文件，也不要把包含 Key 的文件上传。

以下操作仍在 `week-03/` 的终端执行：

~~~bash
git status -sb
git config --get user.name
git config --get user.email
~~~

姓名或邮箱为空时，沿用 W2 的配置方法。先把下面的占位内容换成自己的公开署名和 GitHub 邮箱；邮箱可以使用 GitHub **Settings → Emails** 中的 noreply 地址。

~~~bash
git config user.name "YOUR_PUBLIC_NAME"
git config user.email "YOUR_GITHUB_EMAIL"
~~~

在 Source Control 核对文件，再执行：

~~~bash
git add -- .
git diff --cached
git commit -m "Complete W3 Buffon report"
~~~

`git diff --cached` 展示准备进入这次 commit 的修改。源码、锁文件、图表和报告材料应有解释；不应出现 API Key、虚拟环境或大量中间文件。`report.pdf` 可以一并保存，方便别人查看。

### 2. 上传到自己的 GitHub 仓库

上传的是你已经维护的同一个 Git 仓库，里面包含 W2 和 W3；不另建本地仓库，不要求 fork 或向教师提交 PR。

1. 在 GitHub 新建自己的空仓库，例如 `ai-agents-lab`。不要勾选初始化 README、`.gitignore` 或许可证；这些内容沿用本地已有文件。
2. 复制自己仓库的 HTTPS 地址，把下面的占位地址替换掉，再发给 Agent：

~~~text
请把当前仓库发布到我的 GitHub 仓库：<粘贴自己的仓库 URL>。
沿用已有 Git 历史，保留 W2 和 W3，不重新初始化、不复制项目。
检查现有 remote，把教师 wxyinucas/ai-agents 保留为 upstream，把我的仓库配置为 origin。
先让我核对 remote 和待上传的提交；不要替我 push，登录授权由我完成。
~~~

3. 在 Terminal 查看：

~~~bash
git remote -v
git status -sb
~~~

`origin` 应指向自己的仓库，`upstream` 应指向教师的 `wxyinucas/ai-agents`。确认本地分支仍是 `main` 后上传：

~~~bash
git push -u origin main
~~~

GitHub 登录与授权由本人完成；这个账号用于上传，不是 DeepSeek API 的前提。打开自己的 GitHub 仓库，核对 W2 历史、`week-03/` 源码、锁文件和报告材料已经出现。

已经配置个人 `origin` 的同学不需要再新建仓库；保存新 commit 后继续 push 即可。认证报错时，用末尾的备用提示向 Agent 求助。

## 选做：四个拓展项目

四项可以任选，不做也不影响下一周。全部完成按约 **1 小时**估算，不包含下载等待或故障排查；不要求卡着时间完成。

A 在接通 Agent 后即可做；B、C、D 需要已有投针实验实现，彼此不依赖。让 Agent 帮助实现下面的任务与测试，再由你核对真实结果。教师已有测试和 `rebuild.sh` 保持不变。

### A. 同一任务，比较两种 Agent｜约 15 min

**任务：** 使用 VS Code 原生 Agent 和另一种 Agent，完成同一个只读任务：读取 `README-materials.md`，用两句话说明材料用途，再运行 `git status -sb`。

默认尝试 [Cline 扩展](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)：选择 **Bring my own API key → DeepSeek**，在专用字段填写 Key，从实际列表选择模型；使用 **Act**，保持 **Auto Approve** 关闭。配置过程可以请已接通的 Agent 帮忙，参考 [Cline 官方说明](https://docs.cline.bot/provider-config/deepseek)。不需要购买 ClinePass。

已经能使用 Codex CLI、Claude Code CLI 等终端 Agent，也可以用它们替代 Cline；不必为了选做购买新订阅。

**测试与验收：**

- 两种 Agent 使用同一个工作目录、同一条任务描述；各自留下实际读取文件与运行命令的记录。
- 文件摘要与原文一致；状态输出与自己在 Terminal 执行 `git status -sb` 的结果相符。
- 操作前后核对 Git 状态和文件内容，没有新增修改、提交或上传；不能只凭一份空的 `git diff` 判断。
- 记录实际 Agent、模型名称及两项可观察的差异，例如批准操作的方式、结果展示的位置。模型不同就如实注明，不把所有差异归因于 Agent。

### B. 用参数控制实验｜约 15 min

**任务：** 给 `experiment.py` 增加 `--seed` 和 `--n` 参数，使下面的命令可以直接完成实验、图表和报告，不必再改源码：

~~~bash
bash rebuild.sh --seed 7 --n 2000 5000
~~~

**测试与验收：**

- 本次 `results.csv` 有两组结果：`n=2000`、`n=5000`，两组 `seed` 都是 `7`；报告和图表显示同样的实际参数与结果。
- 相同环境下重复同一命令，两份 CSV 的六个字段一致；换 seed 后记录新 seed，不要求估计值必定改变或变好。
- `uv run --locked python experiment.py --n 0` 明确报错并以非零状态结束，不生成伪造的成功结果。
- 无参数运行仍保留 `seed=42` 和原三组投针数；函数接口及默认参数不变，公开测试仍通过。

### C. 给自己的实现增加独立测试｜约 15 min

**任务：** 在新目录 `tests_extra/` 中编写 `test_extra.py`，检查下面的已知答案，不改教师的 `tests/`：

- 针长 `0.8`、线距 `2.0`、夹角 `π/2`：中心距离为 `0.4` 时刚好触线，应为 `True`；距离为 `0.4001` 时应为 `False`。
- `estimate_pi(100, 25, length=0.25, spacing=2.0)` 应为 `1.0`。
- `estimate_pi(100, 0)` 应抛出 `ValueError`，不能报告一个有效估计值。

**测试与验收：**

~~~bash
uv run --locked python -m pytest -q tests_extra
uv run --locked python -m pytest -q tests tests_extra
~~~

- 第一条确实运行新增测试，且全部通过；第二条中教师测试与新增测试一起通过，不能是零项收集。
- 让 Agent 在**临时副本**中故意制造“刚好触线却不计数”的错误；同一套新增测试必须抓住这个错误。正式项目和教师测试保持不变。
- 能解释上面三个预期结果的依据，而不是用当前程序的输出充当正确答案。

### D. 比较不同 seed 的结果｜约 15 min

**任务：** 新建 `compare_seeds.py`，直接调用已有的 `simulate`，比较三个 seed（`7、42、2026`）与三组投针数（`1000、10000、100000`）的全部组合。不需要先完成 B，也不做动画。

输出独立的 `comparison.csv` 和 `comparison.png`，不覆盖主线的 `results.csv`。CSV 保留每组实际参数、触线数和估计值；图按 seed 分组，展示各组估计值与 π 的绝对误差。把图和两句基于实际数据的观察加入报告。

**测试与验收：**

- 九种参数组合各出现一次；每行与相同参数调用 `simulate` 的结果一致，估计值符合给定公式。
- 相同环境下重复运行，CSV 内容一致；图中的点等于 CSV 计算出的 `abs(pi_estimate - π)`，坐标轴与 seed 标注清楚。
- 自己运行比较程序后，执行 `bash rebuild.sh`；打开 PDF，确认新增图与观察仍在，原报告也能正常重建。
- 用自己的具体结果说明波动；不要求某个 seed 更优，也不要求投针数增加后每次误差都下降。没有出现的现象不编造。

完成选做后检查 Git diff，决定是否保存新的 commit；测试记录和实际产物比 Agent 的“已完成”声明更重要。

## 遇到问题怎么求助

先告诉 Agent 或教师：**你在哪个目录、刚做了什么、实际出现了什么**。命令和完整报错通常比“它不行了”更有用；截图与文字先遮住 Key。

~~~text
我在 ~/course/w02-workbench/week-03，当前做到：……
我运行的命令或点击的入口是：……
实际输出或截图是：……
请先定位问题，说明下一步该做什么，再帮我修复。
~~~

接通 API、编译模板、运行实验、通过测试、重建报告、保存并上传版本，是本周的推进顺序。任何一步卡住，都从这一步求助，不必把前面的步骤全部重做。

### 备用提示：pull 或 merge 遇到问题

你已经有自己的 W2 commit，更新教师材料时可能需要合并。出现报错、停在陌生界面或不知道下一步时，把完整输出一起发给 Agent：

~~~text
我已有 W2 的本地 commit，想更新教师 wxyinucas/ai-agents 的材料，并继续完成 W3。
本地仓库是 ~/course/w02-workbench；刚才执行的命令和完整输出是：……
请检查 Git 状态与 remote，解释问题，再帮我完成 pull 或需要的 merge，保留我的提交和文件。
教师 remote 可能还是 origin，也可能已改为 upstream，请按实际状态处理。
需要我作决定时先问我，不要删除改动、重写历史或替我 push。
~~~
