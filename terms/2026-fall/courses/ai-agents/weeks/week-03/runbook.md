# W3｜把模型 API 接入本地 Agent

> W3 · 3 × 50 min · 约 30 名学生，按零编程基础设计 · 无助教 · 试跑版，Windows + WSL 接入与整链路待真机核验

## 知识地图

- **Road map：接通 Agent → 完成实验报告 → 维护与发布**
  - 前置：W2 本地工作台（WSL · VS Code · uv · Git）
  - 操作前的介绍与讨论
    - 共享协作 · 开源与付费 · IDE
    - Agent 与 LLM · 常见例子 · 使用入口
  - ① 接通 Agent｜本周必达
    - 主线：VS Code 原生 Agent + DeepSeek API；Cline 选做
    - 真实响应 → README 读取 → Git 面板；批准与核验
  - ② 完成实验报告｜接通后推进
    - 材料入口：已有 ai-agents 仓库 → pull → week-03 独立实验目录
    - 编译出口：LaTeX 扩展 + 编译器 → 模板 → PDF
    - 投针实验：uv · seed=42 · 教师动态演示／学生批量模拟
    - 结果核验：公开测试 → 实际图表 → 一页报告（seed、投针数）
  - ③ 维护与发布｜同一项目
    - 统一入口：rebuild.sh（实验 → 图表 → PDF）；测试独立运行
    - 首版 commit → 改动 → 测试与重建 → diff → commit / push
    - 拓展选做：比较 Agent／实验参数／独立测试／随机结果对照
  - 进度：API 优先；报告可跨课时继续，完成后再选做维护

## 本次课 · 接通 Agent，再进入实验报告

### 0-50 | 把 DeepSeek API 接入 VS Code

> 完成最小 API 配置，获得一次真实响应；随后借助 Agent 探索使用方法。

**课前检查**

- [ ] 跑通 Windows + WSL 中的原生 Chat/Agent：添加模型 → DeepSeek 配置 → 请求成功，记下实际界面、模型名称与耗时。
- [ ] 确认 DeepSeek 注册、可用余额与创建 Key 的入口；准备投屏时隐藏 Key 的方式。
- [ ] 核对 [VS Code 模型配置](https://code.visualstudio.com/docs/agent-customization/language-models#_add-a-custom-endpoint-model)与 [DeepSeek 模型信息](https://api-docs.deepseek.com/)；试跑下方配置、README 读取与一次小操作。

#### 操作前的介绍与讨论

*slides: 操作前的介绍与讨论*

- W2：本地工作台；W3：让 Agent 进入工作台。

*slides: 共享与协作*

- 共享：源码、文档、可复用的实现。
- 协作：提出问题、复现错误、补充说明、提交改动。
- 直观介绍：从 GitHub 拿到他人的成果，也可以留下让后来者继续使用的成果。

*slides: 开源与付费*

- 开源：按许可证使用、修改与分享软件；代码可见只是其中一部分。
- 付费：软件、算力、托管、维护与支持，都可能产生费用。
- 直观介绍：开放代码与付费服务可以同时存在；Agent 工具的开放方式，与模型 API 怎么收费，是不同的问题。[开源与商业使用说明](https://opensource.org/faq)

*slides: IDE：把工具放在同一处*

- 编辑器：修改文本；IDE：整合编辑、运行、调试等工具。
- W2 的 VS Code：Explorer、Editor、Terminal、Source Control。
- 直观介绍：过去需要在不同工具之间切换的动作，可以在同一工作台里完成；今天再接入 Agent。

*slides: 比较常见 Agent 和 LLM*

- Agent：围绕任务组织模型、工具和反馈，读取文件、执行命令、继续修改。
- LLM：理解输入，生成回答和行动建议；工具执行由 Agent 系统承接。
- 直观介绍：模型建议下一步，Agent 调用工具，再把执行结果交回模型。

*slides: 常见 Agent 与运行框架*

- Agent 例子：VS Code 原生 Agent、Cline、OpenCode、Claude Code（CC）、Codex。
- DSH（DeepSeek Harness）：承载模型、工具与任务循环的 Agent harness；有本地网页入口，只介绍，不要求安装。

*slides: 常见模型系列*

- LLM 例子：DeepSeek、Kimi、GPT、Claude 系列。
- 常见搭配：Claude Code + Claude；Codex + OpenAI 模型；Cline、OpenCode 可以选择多家模型服务。
- 同一个 Agent 可以接不同兼容模型；同一个模型也可以被不同 Agent 调用。

*slides: Agent 的不同入口*

- IDE 集成式：Agent 和文件、终端、差异视图放在一起；原生 Agent 与扩展是两种接入方式。
- 终端式：从当前目录开始，执行命令、查看输出；终端也可以放在 IDE 内。
- 独立 App／网页：单独的任务界面；仍需确认项目位置、模型与权限。
- 直观介绍：入口可以不同，模型也可以换；本周只维护 **VS Code 原生 Agent + DeepSeek API** 这一条实践路线。

*slides: 下面开始操作*

> 下面开始操作

#### 打开工作区与原生 Chat

> 沿用 W2 工作区，让 Agent 读取已有文件。

- 在 WSL Bash 中打开已有工作区：

```bash
cd ~/course/w02-workbench
code .
```

- 沿用 W2 的 VS Code + WSL 环境和已有 `README.md`，不重复安装，不改写文件。
- 若窗口处于 Restricted Mode，通过 Manage Workspace Trust 检查这个已知课程工作区的信任状态。

- 点击 VS Code 窗口顶部的 **Chat** 图标，打开原生 **Chat** 面板；不是 Codex 或 Cline 面板，也不另开 Agents window。

#### 准备 DeepSeek API Key

> 准备自己的 Key 与可用余额；Key 不进入聊天或项目。

1. 打开 [DeepSeek 开放平台](https://platform.deepseek.com/)，注册或登录。
2. 查看余额；需要时按平台当前要求小额充值。
3. 在 **API Keys** 中创建 Key，名称填 `w3-vscode`，立即妥善保存。
4. 接下来只把 Key 粘贴到 VS Code 的凭据输入框，不投影、不发到聊天、不写入文件。

#### 在 VS Code 添加 DeepSeek 模型

> 复制模型配置，保留软件生成的凭据引用。

1. 按 `Ctrl+Shift+P`，输入并运行 `Chat: Manage Language Models`。
2. 选择 **Add Models → Custom Endpoint**。
3. 按提示填写分组／显示名称 `DeepSeek` 与自己的 API Key；API 类型选择 **Chat Completions**。
4. 在自动打开的 `chatLanguageModels.json` 中，找到 `models` 属性；只把它后面的数组 `[...]` 替换为：

```json
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
```

5. 其他字段保持不变，尤其是 `apiKey` 的 `${input:…}` 引用；不要用明文 Key 替换它，也不要把上面的数组覆盖到整个文件。
6. 保存，回到 **Chat**；模式选择 **Agent**，模型选择 **DeepSeek Flash**，不是 `Auto`。
7. 保持默认批准机制，不选择全部自动批准。

#### 发出第一条请求

> 发出请求，核对真实回答与文件读取记录。

- 在 Chat 中新建对话，发送：

```text
请读取当前工作区的 README.md，告诉我这个项目的目标。
先不要修改文件或运行命令。
```

- 查看工具记录：读取的是当前工作区的 `README.md`；若出现批准请求，检查后再批准。
- 对照文件检查回答：项目目标应与 README 一致。

#### 让 Agent 帮助打开 Git 面板

> 打开 Source Control，区分 Agent 直接执行与指导自己操作。

- 在已经接通的 Agent 对话中继续：

```text
请帮我打开 VS Code 的 Source Control（Git）面板，简单解释它有什么用。
如果你不能直接操作界面，就告诉我怎么打开，让我来做；不要修改文件或初始化仓库。
```

- 看结果：Source Control 面板已经打开，仍是 W2 的仓库；不重新初始化。
- 看过程：是 Agent 直接打开，还是自己按它的指导打开？

### 50-100 | 让 Agent 把数值实验写成报告

> Agent 执行，人批准、矫正与核验：先编译模板，再完成投针实验、测试与图表，逐步写成报告。

**课前检查**

- [ ] 确认 [ai-agents 的 W3 材料](https://github.com/wxyinucas/ai-agents/tree/main/week-03)已推送；在有 W2 本地 commit 的副本中 pull，进入 `week-03/`，不另 clone 或复制材料。
- [ ] 模板使用 XeLaTeX，不依赖教师机器的私有字体；尚未生成图表时也能单独编译。
- [ ] 核对师生共用 `rebuild.sh`：根目录 `experiment.py` → `results.csv` → `render_results.py` → 表图与参数 → PDF；失败即停止。公开测试独立运行。
- [ ] 核对公开测试：触线也计数；零交叉明确报错；手算 `N=100, K=32, L=0.5, d=1` 得 `3.125`；维护时可加实验组、改 seed。
- [ ] 在 Windows + WSL 中逐步跑通安装 → 编译模板 → uv 实验 → 测试 → 图表 → PDF，再验证 `bash rebuild.sh`；记录下载与编译耗时。macOS 的 Homebrew 安装方式留给 Guide 补充。
- [ ] 准备动态投针演示及录屏；公开测试先在教师实现上运行通过。

#### 配置扩展与编译器

> 扩展负责编辑体验，编译器负责生成 PDF。

- 在已接通的 Agent 中发送：

```text
检查当前 WSL 工作区的 LaTeX 环境，目标是 LaTeX Workshop、XeLaTeX 和 latexmk。
先列出已有和缺少的组件，再帮我配置缺少的部分。
遇到 sudo，把命令交给我在终端执行；不要索取密码。
```

- 在 Extensions 中核对 **LaTeX Workshop（James Yu）**，安装到当前 WSL 环境。
- Ubuntu 缺少编译组件时，在 WSL Terminal 执行：

```bash
sudo apt update
sudo apt install texlive-xetex texlive-lang-chinese latexmk
xelatex --version
latexmk --version
```

- 按需批准安装；密码由本人输入。[LaTeX Workshop 安装说明](https://github.com/James-Yu/LaTeX-Workshop/wiki/Install)

#### 取得教师材料

> 更新已有仓库，在 W3 目录中直接完成实验。

- 在已有仓库取得本周材料，再打开实验目录：

```bash
cd ~/course/w02-workbench
git pull --no-rebase origin main
cd week-03
code .
ls
```

- 看 `EXPERIMENT.txt`、`report.tex`、`rebuild.sh`、`tests/`；实现和报告直接在这里完成。
- `week-03/` 使用自己的 uv 项目和环境；Git 仍沿用 W2 历史，不在子目录执行 `git init`。

#### 先编译一份空报告

> 模板先能独立编译，实验随后填入。

- 在当前 `week-03` 工作区打开 `report.tex`。
- 发送：

```text
请用 XeLaTeX 编译提供的 report.tex，让我看到 PDF。
保持模板的字体和版式，不加入实验图表；有错误就按日志修复并重新编译。
```

- 查看编译记录，亲自打开 PDF。终端参考命令：

```bash
latexmk -xelatex -interaction=nonstopmode -halt-on-error report.tex
```

#### 从动态投针到批量模拟

> 演示可以动态，学生实验只需批量运行。

- 展示动态投针：平行线 → 随机落针 → 统计交叉 → 估计 π。
- 默认 `seed=42`；每次独立实验开始时初始化随机数生成器，取样循环中不重复设置 seed，以免反复从同一起点取样。
- 学生发送：

```text
阅读 EXPERIMENT.txt 和 tests，在当前 week-03 目录建立独立的 uv Python 3.12 项目。
pyproject.toml、uv.lock 和 .venv 都放在 week-03，不改仓库根目录的 W2 项目。
使用 uv init 时加 --no-workspace，不把 W3 加入父项目。
在本周 pyproject.toml 的 [tool.pytest.ini_options] 中设置 testpaths = ["tests"]，不沿用 W2 测试配置。
加入 matplotlib 和 pytest，生成 uv.lock；适配教师 rebuild.sh，不修改教师脚本。
实现蒲丰投针，默认 seed=42，每次独立实验只初始化一次随机数生成器，不在取样循环中重设。
从 1000、10000、100000 次投针开始，保存实际 seed、投针数、交叉数和 π 的估计值。
实际运行程序，不编造结果；不做动画，不修改教师测试。
```

- 查看 Agent 的命令和实际输出；复用 W2 的 uv 工作流，不重新讲一遍安装与版本管理。

#### 用已知答案检查程序

> 先核对确定性的规则，不用“接近 π”代替测试。

- 让 Agent 安装项目所需的测试依赖并运行公开测试；本人在 Terminal 再运行一次：

```bash
uv run --locked pytest -q
```

- 展示三类检查：固定针位是否交叉；给定投针数与交叉数，估计公式是否算对；固定环境、参数与种子能否复现。
- 测试失败：对照实验说明修正实现，再运行；教师测试保持不变。
- 估计值不要求等于 π，投针数增加也不保证每一次误差都变小。

#### 把本次结果放进报告

> 图、表、文字使用同一份实际结果。

- 发送：

```text
读取实际 results.csv，完成 render_results.py，生成 results-table.tex、results-params.tex 和 results.png。
让 report.tex 使用这些结果。
保持模板版式，写明实际 seed 和投针数，补上简要方法和一句观察，再编译 PDF。
核对表格数字与程序输出一致，并重新运行测试；不要手工编造或美化实验结果。
```

- 用教师提供的统一入口重新生成报告；项目适配入口，内部代码结构不作统一要求：

```bash
bash rebuild.sh
```

- 脚本只串联“运行实验 → 生成图表 → 编译 PDF”；任何一步失败即停止，测试仍单独执行。
- 打开原始结果、图与 PDF：核对 seed、投针数、交叉数和估计值；看图表是否完整、是否对应本次运行。
- 未完成者在第三课时继续同一个项目，不另起任务。

### 100-150 | 修改报告，检查版本并上传

> 完成报告后保存第一版，再修改一项要求，检查整条链路并上传。

#### 完成报告，保存第一版

> 先有可比较的版本，再展示维护。

- 继续完成实验、测试、图表与 PDF；已经完成者先核对产物。
- 让 Agent 补齐 `week-03/.gitignore`，排除虚拟环境、缓存、LaTeX 中间文件与任何凭据；保留源码、锁文件及报告所需材料。
- 在 Source Control 查看本周改动，确认后保存 W3 首版 commit；保留 W2 历史，不初始化新的 Git 仓库。

#### 同一个项目，增加一条要求

> 改动后，实验与报告一起更新。

- 打开 Guide 的“选做：四个拓展项目”，按任务与验收标准自行推进；四项合计按约一小时估算，不作为下一周前提。
  - A：同一只读任务，比较两种 Agent。
  - B：用参数改变 seed 与投针数，不改源码。
  - C：新增确定性测试，验证它能抓住故障副本。
  - D：比较不同 seed 的真实结果，补进报告；不依赖 B。
- 看实际命令、测试结果与 Git diff；不修改教师公开测试与 `rebuild.sh`。

#### 检查变化，上传自己的版本

> 本地保存与 remote 发布是两个动作。

- 查看 `git diff` 与 Source Control，对照新增要求、测试结果和 PDF。
- 确认后 commit；在 GitHub 建立自己的空仓库，让 Agent 保留教师 remote 为 `upstream`、配置自己的 `origin`，再 push；登录授权由本人完成。
- 上传同一仓库中的 W2 与 W3，不复制文件、不重新初始化历史；不要求 fork 或 PR。
- 打开自己的 GitHub 仓库，核对源码、锁文件与报告材料已经上传；不上传 Key、虚拟环境与编译中间文件。

#### 本次课回顾

> 模型接通之后，用真实执行与核验完成一次委托。

- API 接入 → 模板编译 → 实验运行 → 测试 → 图表与 PDF → Git 版本。
- Agent 帮助执行；人批准操作、检查证据、决定保留哪一版。

## 临场取舍

- 已经接通：借助 Agent 自行探索，或提前进入实验报告。
- 安装或编译耗时：第三课时继续报告，不强求第 100 分钟前得到最终 PDF。
- 提前完成：选择同一项目的一项维护任务；不临时增加另一套工具或新主题。
- 模型未出现：保存配置并重启 VS Code；仍失败时带着实际界面求助。
- 连接报错：保留 Provider、模型名和完整错误，隐藏 Key 后向已有可用的 Agent 或教师求助；没有成功响应就继续处理接入。
- 界面不同：提供实际页面或截图，借助 Agent 和 [VS Code 官方模型说明](https://code.visualstudio.com/docs/agent-customization/language-models)定位，不照着旧按钮名称盲点。
