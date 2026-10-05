# W3 学生行动指南：接通 Agent，完成一份实验报告

> 先接通自己的 DeepSeek API，再让 Agent 协助完成“投针实验 → 图表 → LaTeX 报告 → Git 版本”。按顺序跟做即可；没完成的步骤可以课后继续。

## 本周路线与边界

- 必修工作台：**VS Code + WSL**；
- 主线 Agent：VS Code 自带的 **Chat → Agent**；
- 模型服务：自己的 **DeepSeek API Key**，按量付费；
- 教师展示：Codex 的 VS Code 原生扩展；学生无需安装或登录；

这条自带 Key（BYOK）的 Chat/Agent 路线不要求 GitHub 登录或 Copilot 订阅；**不等于 DeepSeek API 免费**。按平台要求准备少量可用余额，费用不报销；有支付或账号困难时向教师求助，不购买额外订阅。

以下配置依据 2026-10-05 的官方文档整理，尚未在 Windows + WSL 实测；界面或环境有差异时，课堂按实际页面求助处理。软件入口、模型 ID 和价格会变化，以 [VS Code 官方模型说明](https://code.visualstudio.com/docs/agent-customization/language-models)和 [DeepSeek 官方文档](https://api-docs.deepseek.com/)为准。

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

课上使用的[可运行教师演示](https://github.com/wxyinucas/ai-agents/tree/main/demos/week-03-buffon)另放在同一仓库的 `demos/week-03-buffon/`，包含批量模拟、静态图表和报告源码。想在本地复现时，按其中的 README 运行即可；不需要另外 clone，不覆盖自己的 `week-03/`，也不要求完成动画。

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

## 选做：同一份报告的四轮维护

先完成主线的一份报告，再围绕它继续：**换 Agent 核验 → 参数化运行 → 测试纠错 → 随机结果对照**。建议按 A → B → C → D 推进，也可以任选；四项都只依赖主线，不要求先做完上一项。

每项按约 **20 分钟**设计，全套约 **80 分钟**；这是未实测的估计，不包括安装等待和故障排查。完成一项可以继续下一项，不要求卡着时间或全部做完，也不影响下一周。

每轮都走完“确认现状 → 委托一个增量 → 自己运行与核验 → 查看 diff → 保存版本”。教师 `tests/` 和 `rebuild.sh` 保持不变；新增测试放在 `tests_extra/`。A 的检查阶段只读，比较记录按需保存；B、C、D 核验后可以各自留下一个 commit。

### A. 换一个 Agent，核验同一份报告｜约 20 min

**目标：** 不重做报告，让两种 Agent 检查同一批已有结果，再由你判断检查是否可靠。

1. 打开 `results.csv`、`results-params.tex` 和 PDF，先记下实际 seed 与投针数；自己运行 `git status -sb`，保留当前状态。
2. 使用 VS Code 原生 Agent 和另一种 Agent。默认可尝试 [Cline 扩展](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)：选择 **Bring my own API key → DeepSeek**，在专用字段填写 Key，从实际列表选择模型；使用 **Act**，保持 **Auto Approve** 关闭。参考 [Cline 官方说明](https://docs.cline.bot/provider-config/deepseek)。已经可用的 Codex CLI、Claude Code CLI 等也可以；不为选做购买新订阅，安装卡住时先做 B。
3. 对两种 Agent 发送完全相同的任务；核对它们是否真的读取了文件并执行了命令：

~~~text
请只读检查当前 week-03 的实验报告：读取 EXPERIMENT.txt、results.csv、results-params.tex 和 report.tex。
告诉我实际 seed、各组投针数，以及报告是否引用了这份结果；运行 git status -sb。
指出一个已确认的问题或仍需人工核验的地方，不为找问题而编造。
不要修改文件、重新运行实验或编译，也不要提交、上传。
~~~

4. 把两份回答与第一步的文件、实际命令记录对照。追问其中一个结论：“你依据的是哪份文件、哪段实际内容？”不能只看回答是否流畅。
5. 再看 Git 状态与文件内容；检查结束后，用几句话记下实际 Agent／模型、一项共同结论和两项可观察差异。需要保存比较记录时，在核对只读操作没有改动后再保存。

**测试与验收：**

- 两种 Agent 检查的是同一目录、同一版文件；实际参数与 CSV 一致，不能把需求中的默认值当作本次运行结果。
- 状态输出与自己执行的 `git status -sb` 相符；只读检查期间没有修改、提交或上传，不能只凭空的 `git diff` 判断。
- 能指出至少一个结论的文件依据，以及仍需人打开 PDF 核验的内容。模型不同就如实注明，不把所有差异归因于 Agent。

### B. 把手改参数变成可重复的命令｜约 20 min

**目标：** 不再为了换 seed 或投针数修改源码，用同一个入口重建报告。

1. 先写下本次预期：两组投针数 `2000、5000`，seed 都是 `7`；原有函数接口和无参数运行保持不变。
2. 让 Agent 给 `experiment.py` 增加参数与说明：

~~~text
给 experiment.py 增加 --seed 和 --n 参数，以及 --help 说明。
让 bash rebuild.sh --seed 7 --n 2000 5000 可以重建两组实验的图表和报告，不修改教师脚本。
无参数运行保留 seed=42 和原三组投针数；原函数接口不变。
非法投针数要报错并以非零状态结束；实际运行正常、重复和失败三种情况，再运行教师测试。
~~~

3. 自己运行两次，检查同一环境下能否复现；`cmp` 无输出且正常结束表示两份文件一致：

~~~bash
bash rebuild.sh --seed 7 --n 2000 5000
cp results.csv results-first.csv
bash rebuild.sh --seed 7 --n 2000 5000
cmp results-first.csv results.csv
~~~

4. 打开 CSV、图与 PDF，核对不是只更新了某一处；再检查错误输入与默认路线：

~~~bash
uv run --locked python experiment.py --help
uv run --locked python experiment.py --n 0
bash rebuild.sh
uv run --locked python -m pytest -q tests
~~~

5. 对照原版看 diff，只保留参数化有关的变化；临时比较文件按需保留，不混入实现代码。核验后保存版本。

**测试与验收：**

- 带参数运行的 CSV 恰好有 `n=2000、5000` 两行，两行 seed 为 `7`；PDF、参数说明和图表一致，两次 CSV 的六个字段一致。
- `--help` 说明参数用法与默认值；`--n 0` 明确报错、非零退出，不把失败报告成成功。
- 无参数运行恢复 seed `42` 与原三组投针数，教师测试仍通过。换 seed 不要求结果一定改变或变好。

### C. 让新测试抓住一个真实错误｜约 20 min

**目标：** 不只看到测试通过，还验证测试能区分正确实现和故障实现。

1. 先核对三个已知答案：
   - 针长 `0.8`、线距 `2.0`、夹角 `π/2`：中心距离 `0.4` 刚好触线，应为 `True`；距离 `0.4001` 应为 `False`。
   - `estimate_pi(100, 25, length=0.25, spacing=2.0)` 应为 `1.0`。
   - `estimate_pi(100, 0)` 应抛出 `ValueError`，不能给出有效估计值。
2. 请 Agent 在 `tests_extra/test_geometry.py` 中把上述事实写成测试；先说明预期答案的依据，不用当前程序输出当答案。
3. 自己运行新测试与教师测试，确认确实收集到了测试：

~~~bash
uv run --locked python -m pytest -q tests_extra
uv run --locked python -m pytest -q tests tests_extra
~~~

4. 再交给 Agent 一个故障验证任务；你核对它实际测试的目录与失败断言：

~~~text
在项目外创建临时副本，只把“触线也计数”的 <= 判据改为 <，其他规则不变。
在副本中运行同一套 tests_extra，确认测试导入的是副本的 experiment.py。
我要看到刚好触线的断言失败，不是导入失败或环境错误。不要改正式实现或教师测试，也不要把故障版本复制回来。
~~~

5. 回到正式项目，重新运行教师与新增测试；看 diff，确认本轮留下的是测试，不是故意制造的故障，再保存版本。

**测试与验收：**

- 正式实现中，新测试与教师测试全部通过，不能是零项收集。
- 故障副本中，同一套新测试在“刚好触线”的预期断言处失败；正式实现未被故障副本覆盖。
- 能解释几何边界、手算公式和零交叉三个答案的依据；不能把 Agent 的“测试有效”声明当证据。

### D. 在同一份报告中对照随机结果｜约 20 min

**目标：** 复用已有算法增加一次对照实验，不重写投针，也不假设样本越大每次都更准。

1. 确认已有 `simulate` 可调用；先列出 seed `7、42、2026` 与投针数 `1000、10000、100000` 的九种组合。不需要先完成 B。
2. 给 Agent 以下任务：

~~~text
新增 compare_seeds.py，直接调用已有 simulate，运行 seed=7、42、2026 与 n=1000、10000、100000 的全部组合。
输出 comparison.csv 和 comparison.png，不覆盖主线的 results.csv。CSV 保留六个实际字段；图按 seed 分组显示估计值与绝对误差。
在 tests_extra/test_comparison.py 中检查组合完整、结果与 simulate 一致、相同环境下可复现。
运行程序与测试，把图和两句基于实际数据的观察加入报告，保留原图表与模板结构。不要做动画或重写投针算法。
~~~

3. 自己运行程序和测试，打开九行结果与图，核对实际组合和图上的点：

~~~bash
uv run --locked python compare_seeds.py
uv run --locked python -m pytest -q tests tests_extra
~~~

4. 用实际数据比较两组 seed 的表现，再检查一个 seed 下误差随投针数怎样变化。把观察写入报告；没有出现的现象不编造。
5. 执行 `bash rebuild.sh`，再次打开 PDF，确认新增比较仍在、原主线也能重建；看 diff，保存这一轮版本。

**测试与验收：**

- 九种组合各出现一次；每行与相同参数调用 `simulate` 的结果一致，估计值符合给定公式。
- 相同环境下重复运行，CSV 内容一致；图中的误差等于 CSV 计算出的 `abs(pi_estimate - π)`，坐标轴与 seed 标注清楚。
- 教师测试和新增测试都通过；原始 `results.csv` 不被比较程序覆盖，重建后两组图表和观察仍在 PDF 中。
- 观察有对应数字，不要求某个 seed 更优，也不要求投针数增加后每次误差都下降。

一轮完成后先检查实际产物和 Git diff，再进入下一轮。测试记录与真实文件比 Agent 的“已完成”声明更重要。

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
