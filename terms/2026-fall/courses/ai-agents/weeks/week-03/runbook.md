# W3｜接通 Agent，用证据理解一次委托

> W3 · 3 × 50 min · 约 30 名学生，按零编程基础设计 · 无助教 · Windows + WSL 的界面与环境差异课上按实际情况处理

## 知识地图

- **Road map：接通 Agent → 建立验收依据 → 借助 Agent 理解工作台与代码**
  - 前置：W2 本地工作台（WSL · VS Code · uv · Git）
  - 操作前的介绍与讨论
    - 共享协作 · 开源与付费 · IDE
    - Agent 与 LLM · 常见例子 · 使用入口
  - ① 接通 Agent｜本周必达
    - 主线：VS Code 原生 Agent + DeepSeek API；Cline 选做
    - 请求 → 上下文 → 工具 → 执行反馈；模型、工作位置与权限
    - Git 面板 · Agents Window；区分直接执行与指导操作
  - ② 建立验收依据｜以投针报告为例
    - 材料入口：已有 ai-agents 仓库 → pull → week-03 独立实验目录
    - 规格与已知答案 → 公开测试 → 故障反例 → 定位与修复
    - 带着问题看代码：输入 · 判断 · 输出；seed=42 与取样循环
    - 实验 → CSV → 图表 → PDF；测试证据与产物核验分开
  - ③ 借助 Agent 理解｜少增加功能，多打开已有系统
    - 工作台：找文件 · 搜索 · 看差异；由 Agent 带路，自己操作
    - 能力：实际工具与记录；能执行、能指导、尚不确定
    - 代码导读：入口 → 调用 → 结果；用真实文件验证解释
    - 保留成果：diff → commit → 个人 remote；沿用 W2 历史
  - 进度：API 优先；报告可继续完成，已完成者进入只读探索

## 本次课 · 从成功调用走向有依据的使用

### 0-50 | 把 DeepSeek API 接入 VS Code

> 接通自己的模型 API，并在真实操作中分清模型、工具、上下文与人的批准。

**课前亲自跑一遍（整周）**

- **准备账号**
  - [ ] 登录 DeepSeek 开放平台，确认可用余额。
  - [ ] 找到创建 Key 的入口；确认投屏时不显示 Key。
- **接通 Agent**
  - [ ] 按下文配置原生 Chat/Agent，确认实际选择的模型。
  - [ ] 取得 README 读取记录，核对所读文件。
  - [ ] 取得 `pwd` 执行记录，核对工作位置。
  - [ ] 试过同会话、新会话与主动补记录的上下文演示。
  - [ ] 试过 Git 面板与 Agents Window 入口，记下实际界面。
- **取得材料、编译模板**
  - [ ] 在保留 W2 本地 commit 的练习副本中 pull。
  - [ ] 确认 `week-03/` 与演示目录都已取得。
  - [ ] 进入 `week-03/`，配置 LaTeX Workshop 与编译器。
  - [ ] 让尚无图表的 `report.tex` 生成 PDF，亲自打开。
- **跑通学生路线**
  - [ ] 用刚接通的原生 Agent + DeepSeek，照 Guide 在 `week-03/` 建立独立 uv 项目、实现实验。
  - [ ] 自己运行公开测试，确认实际结果。
  - [ ] 自己运行 `bash rebuild.sh`，打开 CSV、图与 PDF。
  - [ ] 核对实际参数与数字；确认 W2 根项目配置未改，记下展示耗时。
- **准备测试反例**
  - [ ] 在仓库外建立新临时目录，复制 `demos/week-03-buffon/` 的 `experiment.py`、`pyproject.toml`、`uv.lock`、`.python-version`，以及 `week-03/tests/`；不复制 `.venv`。
  - [ ] 在副本执行 `uv sync --locked`，先确认全套测试通过。
  - [ ] 只将相交判据的 `<=` 改为 `<`；按下文跑定点测试。
  - [ ] 核对 `2 failed, 3 passed, 15 deselected`，且失败原因是 `False is True`。
  - [ ] 试过修复并保存真实失败输出与修复前后的单行 diff，现场卡住时可直接展示；课上只操作这个副本。
- **准备导读**
  - [ ] 在完成版中找到相交判据、估计公式与 seed 初始化。
  - [ ] 找到 CSV 写出与 LaTeX 引入图表的位置。
  - [ ] 实际走一遍下文三处定位，不依赖 Agent 临场讲一整份源码。
- **试走保存与上传**
  - [ ] 在练习副本检查 `.gitignore` 与 diff，确认没有 Key、虚拟环境与编译中间文件。
  - [ ] 试过 commit，确认 W2 历史保留。
  - [ ] 按现有 remote 情况上传个人仓库。
- **打开课堂入口**
  - [ ] 打开 Slides、Guide、完成版项目与故障副本。
  - [ ] 故障副本恢复并保持 `<`；两者的窗口与终端路径能清楚区分。

#### 操作前的介绍与讨论

*slides: 操作前的介绍与讨论*

- **照念：** “W2 搭好本地工作台；W3 让 Agent 进入这个工作台。”

*slides: 共享与协作*

- 指着“共享”：源码、文档、可复用的实现。
- 指着“协作”：提出问题、复现错误、补充说明、提交改动。
- **照念：** “从 GitHub 拿到他人的成果，也可以留下让后来者继续使用的成果。”

*slides: 开源与付费*

- 开源：按许可证使用、修改与分享软件；代码可见只是其中一部分。
- 付费：软件、算力、托管、维护与支持，都可能产生费用。
- **照念：** “开放代码与付费服务可以同时存在。Agent 工具怎样开放，与模型 API 怎么收费，是两个问题。”[开源与商业使用说明](https://opensource.org/faq)

*slides: IDE：把工具放在同一处*

- 编辑器：修改文本；IDE：整合编辑、运行、调试等工具。
- 依次指认 W2 的 VS Code：Explorer 找文件、Editor 改文本、Terminal 运行命令、Source Control 看 Git。
- **照念：** “过去分散在不同工具里的动作，可以放在同一个工作台；今天再接入 Agent。”

*slides: 比较常见 Agent 和 LLM*

- LLM：理解输入，生成回答和行动建议。
- Agent：围绕任务组织模型、工具和反馈，读取文件、执行命令、继续修改；工具执行由 Agent 系统承接。
- **照念：** “模型建议下一步，Agent 调用工具，再把执行结果交回模型。”

*slides: 常见 Agent 与运行框架*

- 指认 Agent 例子：VS Code 原生 Agent、Cline、OpenCode、Claude Code（CC）、Codex。
- DSH（DeepSeek Harness）：承载模型、工具与任务循环的 Agent harness；有本地网页入口，只介绍，不要求安装。

*slides: 常见模型系列*

- 指认 LLM 例子：DeepSeek、Kimi、GPT、Claude 系列。
- 指认常见搭配：Claude Code + Claude；Codex + OpenAI 模型；Cline、OpenCode 可以选择多家模型服务。
- **照念：** “同一个 Agent 可以接不同兼容模型；同一个模型也可以被不同 Agent 调用。”

*slides: Agent 的不同入口*

- IDE 集成式：Agent 和文件、终端、差异视图放在一起；原生 Agent 与扩展是两种接入方式。
- 终端式：从当前目录开始，执行命令、查看输出；终端也可以放在 IDE 内。
- 独立 App／网页：单独的任务界面；仍需确认项目位置、模型与权限。
- **照念：** “入口可以不同，模型也可以换；本周只维护 VS Code 原生 Agent + DeepSeek API 这一条实践路线。”

*slides: 下面开始操作*

> 下面开始操作

#### 接通真实模型

> 沿用 W2 工作区，配置自己的模型与凭据，再发起真实调用。

**① 回到已有工作区。** 在 WSL Bash 中执行：

```bash
cd ~/course/w02-workbench
code .
```

- 看 Explorer：仍是 W2 的工作区，已有 `README.md`；不重复安装、不改写文件。
- 若窗口处于 Restricted Mode，通过 Manage Workspace Trust 检查这个已知课程工作区的信任状态。

**② 打开原生 Chat。** 点击 VS Code 窗口顶部的 **Chat** 图标。

- 看：原生 **Chat** 面板已打开；不是 Codex 或 Cline 面板，也不另开 Agents window。

**③ 准备 DeepSeek API Key。** 凭据操作不投屏显示 Key。

1. 打开 [DeepSeek 开放平台](https://platform.deepseek.com/)，注册或登录。
2. 查看余额；需要时按平台当前要求小额充值。
3. 在 **API Keys** 中创建 Key，名称填 `w3-vscode`，立即妥善保存。
4. 接下来只把 Key 粘贴到 VS Code 的凭据输入框，不投影、不发到聊天、不写入文件。

**④ 添加模型服务。** 按顺序完成，每次只定位当前这一项。

1. 按 `Ctrl+Shift+P`，输入并运行 `Chat: Manage Language Models`。
2. 选择 **Add Models → Custom Endpoint**。
3. 按提示填写分组／显示名称 `ds`。
4. 在凭据输入框填写自己的 API Key。
5. API 类型选择 **Chat Completions**。

- **照念：** “这里选的是 Agent 与模型服务沟通的格式，不是模型本身。先匹配服务端接口，不是名字越新就越该选。”

| 接口格式 | 请求与回复怎样组织 |
| --- | --- |
| Chat Completions | 发送对话历史，取回下一条回复；也可以包含工具调用。我们填写的 DeepSeek 地址使用这一种。 |
| Responses | OpenAI 较新的接口，把回复、工具调用等分成不同项目；还支持衔接上一轮响应、使用服务端内置工具。 |
| Anthropic Messages | 用文本、图片、工具调用等内容块组织消息；多轮对话同样由调用方传入历史，字段格式不同。 |

**⑤ 修改新增的配置项。** 在自动打开的 `chatLanguageModels.json` 中找到刚新增的 `ds` 项；完整结构如下，`apiKey` 保留本机生成的引用：

```json
[
  {
    "name": "ds",
    "vendor": "customendpoint",
    "apiKey": "${input:chat.lm.secret.3287ba8d}",
    "apiType": "chat-completions",
    "models": [
      {
        "id": "deepseek-flash",
        "name": "DS Flash",
        "url": "https://api.deepseek.com/chat/completions",
        "toolCalling": true,
        "vision": true,
        "maxInputTokens": 128000,
        "maxOutputTokens": 16000
      }
    ]
  }
]
```

- 核对凭据引用：示例编号来自教师机器；学生保留各自的 `${input:…}`，不照抄编号、不写明文 Key。
- 核对编辑范围：只修改刚新增的 `ds` 项，文件中已有的其他配置项保留。

**⑥ 选择实际使用的模式与模型。** 保存配置，回到 **Chat**。

1. 模式选择 **Agent**。
2. 模型选择 **DS Flash**，不是 `Auto`。
3. 保持默认批准机制，不选择全部自动批准。

<!-- API 串词参考：https://code.visualstudio.com/docs/agent-customization/language-models；https://developers.openai.com/api/docs/guides/migrate-to-responses；https://platform.claude.com/docs/en/api/messages/create -->
<!-- 记忆力串词参考：https://developers.openai.com/api/docs/guides/conversation-state；https://api-docs.deepseek.com/guides/multi_round_chat/；https://platform.claude.com/docs/en/build-with-claude/working-with-messages -->

#### 一条请求怎样变成操作？

> 模型提出行动，工具实际执行，结果再回到对话；回答与执行记录分别核对。

**① 请求读取。** 在 Chat 中新建对话，发送：

```text
请读取当前工作区的 README.md，告诉我这个项目的目标。
先不要修改文件或运行命令。
```

- 看工具记录中的文件位置：读取的是当前工作区的 `README.md`；若出现批准请求，检查后再批准。

**② 核对回答。** 亲自打开同一份 README，对照 Agent 概括的项目目标；应与文件一致。

**③ 核对工作位置。** 在同一对话继续发送：

```text
为了核对工作位置，请运行 pwd，并对照刚才 README.md 的位置解释结果。
只执行这个只读检查，不修改文件。
```

- 看实际命令、执行位置与输出；对照 Terminal 的 `pwd` 与 Explorer 的工作区。
- 默认机制下，有些只读操作可能直接执行；需要批准时，先看命令、目录与作用范围，不开启全部自动批准。

**④ 沿实际记录指认四步。** 每次只指当前这一处：

| 指哪里 | 照念 |
| --- | --- |
| 我的请求与已取得的 README 内容 | “这是本次输入。” |
| 读取文件、调用终端的记录 | “这是工具实际执行的行动，不是模型靠文字改变文件系统。” |
| 文件内容、命令输出或报错 | “这是返回给对话的反馈。” |
| 收到反馈后的回答或下一项操作 | “模型根据反馈，回答或者继续提出操作。” |

- 只看可见的请求、工具与结果；不把聊天中的过程叙述当作模型内部推理的完整记录。

#### Agent 从哪里获得上下文？

> 对话历史和项目文件是输入来源；模型参数不是本次聊天的笔记本。

**① 同会话：先给记录，再追问。** 在当前对话发送：

```text
本次课堂的临时暗号是“W3-Q9L7”。只复述这个暗号，不写入文件。
```

- 同一对话继续问“刚才的临时暗号是什么？”；看回答，并指认前面包含暗号的原始消息。

**② 新会话：先看它实际获得了什么。** 新建空白对话，发送：

```text
上一段对话里的临时暗号是什么？不要搜索文件。
如果当前可见上下文中没有，就说不知道，不要猜。
```

- 对照两次回答与当前对话的附带内容：前一段历史是否被带入？有没有自动附加摘要、记忆或文件？只能确认到哪里，就说明到哪里。
- 不把“新建对话”一概等同于清空系统所有上下文；不预设它一定不知道。

**③ 主动补记录：明确这次信息由谁提供。** 把包含暗号的原始消息粘贴到新对话，再问一次“刚才的临时暗号是什么？”

- 看本次回答；指出信息由自己主动粘贴。暗号答对与否，不能单独证明 API 怎样存储历史。

**④ 用会议记录类比收住。**

- Chat Completions / Messages：客户端选取记录，每轮随请求带给模型。
- OpenAI Responses：还可以把上次 API 返回的响应编号发给同一服务，由服务端接续它保存的相关记录；不是去取本地 VS Code 或网页聊天。
- **照念：** “模型根据本次获得的记录回答，不把聊天历史直接写进参数。”
- 项目文件也可以重新读取；文件仍在，不等于模型此刻已读到。历史保存了，也不等于全部都在当前上下文里。
- 上下文有限，Agent 可能筛选或压缩旧记录；重要的规格和结果保存在文件中，换对话后可以明确让它再读。

#### 让 Agent 帮助打开 Git 面板

> 打开 Source Control，区分 Agent 直接执行与指导自己操作。

**① 发出请求。** 在已经接通的 Agent 对话中继续：

```text
请帮我打开 VS Code 的 Source Control（Git）面板，简单解释它有什么用。
如果你不能直接操作界面，就告诉我怎么打开，让我来做；不要修改文件或初始化仓库。
```

**② 按实际能力打开。** 若 Agent 已直接打开，查看面板；若只给操作指导，自己按它的步骤打开。界面不同，就对照实际界面定位。

**③ 看结果与过程。**

- 结果：Source Control 面板已经打开，仍是 W2 的仓库；不重新初始化。
- 过程：是 Agent 直接打开，还是自己按它的指导打开？以这次实际发生的操作回答。

#### 认识 VS Code 的 Agents Window

> Chat 围绕当前项目操作；Agents Window 围绕任务与会话组织工作。

**① 找到入口。** 使用标题栏 **Open in Agents**；或按 `Ctrl+Shift+P`，运行 **Chat: Open Agents window**。看：独立窗口已打开。

**② 对照原 Chat。**

- 指原 Chat：在编辑器旁，方便边看代码、边运行、边修改。
- 指 Agents Window：集中查看多个项目的任务、进度与结果。

**③ 查看一个会话。** 在 **Sessions** 选择一个会话，核对它对应的项目与谈话。

- 切换另一个会话时，再看项目与谈话；当前工作的对象随会话切换。只按实际可见的会话展示。

**④ 查看该会话的文件。** 找到 **Changes / Files**，核对项目文件与文件改动。

- **照念：** “Agent 说完成了，仍要打开实际文件与 diff 检查。”

**⑤ 核对模型与授权。** 看独立窗口实际可用的模型与设置；原 Chat 接通 DeepSeek，不代表 Agents Window 已可使用它，自带 Key 的接入可能需要额外设置。

**⑥ 回到原工作区。** 返回原工作区的 Chat，继续本周实验；本段只展示入口与工作方式，不增加学生必修配置。

<!-- Agents Window 参考：https://code.visualstudio.com/docs/agents/run/agents-window；https://code.visualstudio.com/docs/agents/run/agents-window-configuration -->

### 50-100 | 先确定怎样验收，再让 Agent 实现

> 从规格得到独立的期望值，用测试拒绝错误，再带着问题定位代码；最后完成同一份实验报告。

#### 取得材料，编译模板

> 先确认交付对象与运行条件；能编译 PDF，不等于实验已经正确。

**① 回到已有仓库。** 在 WSL Terminal 执行：

```bash
cd ~/course/w02-workbench
pwd
git status --short
```

- 路径应指向 W2 的 `w02-workbench`；看到已有修改先辨认，保留它们与本地 commit，不重新 clone 或初始化。

**② 找到教师 remote。** 执行：

```bash
git remote -v
```

- 找地址中的 `wxyinucas/ai-agents`，再读它左侧的 remote 名称；不要只凭 `origin` 这个名字判断是谁的仓库。

**③ 只运行对应的一条更新命令。** 教师仓库仍叫 `origin`：

```bash
git pull --no-rebase origin main
```

- 已把教师仓库改名为 `upstream`、个人仓库叫 `origin`：

```bash
git pull --no-rebase upstream main
```

- 名称不同、没找到教师地址或出现 merge 问题时停在这里，把完整输出交给 Agent 协助；不覆盖个人 remote，不丢弃修改，不重建仓库。

**④ 确认本周材料。** 更新成功后执行：

```bash
cd week-03
code .
pwd
ls
```

- Terminal 路径与 Explorer 都应是 `week-03/`。依次指出：`EXPERIMENT.txt` 是要求，`tests/` 是部分验收，`report.tex` 是模板，`rebuild.sh` 是重建入口；初始材料不提供完整 Python 实现，已有实现者查看自己的版本。
- 本周 uv 项目与 W2 根项目分开，Git 仍沿用 W2 历史；现在只编译 LaTeX，尚未建立本周 Python 项目时不先运行 `uv run`。

**⑤ 先查已有 LaTeX 组件。** 向 Agent 发送：

```text
检查当前 WSL 工作区的 LaTeX 环境，目标是 LaTeX Workshop、XeLaTeX 和 latexmk。
先只列出已有和缺少的组件，不安装，不修改项目。
说明这些组件是全局的，还是这个项目局部的。
```

- 在 Extensions 核对 **LaTeX Workshop（James Yu）** 是否安装到 WSL；在 WSL Terminal 检查两个编译命令：

```bash
xelatex --version
latexmk --version
```

**⑥ 只补缺少的组件。** 缺少扩展，安装到当前 WSL；缺少编译组件，在同一个 WSL Terminal 执行：

```bash
sudo apt update
sudo apt install texlive-xetex texlive-lang-chinese latexmk
```

- sudo 密码本人输入，不交给 Agent。安装结束，再检查刚才两个版本；已有可用组件就跳过安装。扩展整合编辑与编译操作，不能替代编译引擎。[安装说明](https://github.com/James-Yu/LaTeX-Workshop/wiki/Install)

**⑦ 编译空模板，再亲自打开。** 请 Agent 用 XeLaTeX 编译 `report.tex`，保留字体与版式，暂不加入图表。参考命令：

```bash
latexmk -xelatex -interaction=nonstopmode -halt-on-error report.tex
```

- 命令成功后打开本周 `report.pdf`；没有结果时，表格与图像占位说明是正常状态。编译失败先看实际报错，未生成 PDF 就不当作完成。

**转场：** 生成报告对 Agent 并不困难。接下来先不让它写程序：我们凭什么接受程序的结果？

#### 从规格得到测试的答案

> 先有理由说明“应该是什么”，再把这个判断写成测试；不能用待验收程序自己的输出定义正确。

**① 先说实验做什么。**

> 纸上有一组等距平行线。随机投下一根短针，记录它有没有碰到线；重复很多次，用碰线的比例估计 π。

**② 一次只认一个物理量。** 指着图或纸面依次说明：

| 量 | 指哪里、怎么说 | 代码名称 |
| --- | --- | --- |
| `L` | 整根针的长度；本实验针长不超过线间距，`0 < L <= d`。 | `length` |
| `d` | 相邻两条平行线之间的距离。 | `spacing` |
| 角度 | 针与平行线的夹角；`0` 是平行，`π/2` 是垂直，用弧度表示。 | `angle` |
| 中心距 | 针的中心到最近一条线的距离；不是相邻两条线的间距。 | `distance` |

**③ 把一次投针拆成取样与判断。**

1. 随机取中心距 `distance ∈ [0, d/2]`，再独立随机取角度 `angle ∈ [0, π/2]`；两者都均匀取样。位置与方向具有对称性，不必模拟整张纸。
2. 从针中心出发，半根针朝垂直于线的方向伸出 `L/2 × sin(angle)`。
3. 伸出距离够到最近的线，就记为相交。

**④ 从一次判断走到估计。**

1. 重复 `N` 次，累计相交次数 `K`；实验得到的相交比例是 `K/N`。
2. 在上述条件下，理论相交概率是 `p = 2L/(πd)`；用 `K/N` 估计 `p`，反过来得到 `π ≈ 2LN/(dK)`。
3. `K=0` 时不能用这个式子估计。这里不推导概率公式；程序依次做“取样 → 判断相交 → 累计 → 代入公式”，再记录结果。

**⑤ 从规格先定答案。** 打开 `EXPERIMENT.txt`，只找两条规则：针尖接触平行线也算相交；估计值由本次投针数与相交数计算，不能直接填 `math.pi`。

- 固定 `L=0.5、d=1、angle=π/2`。先算半根针长：`0.5/2=0.25`；针垂直于线，所以垂直方向也伸出 `0.25`。
- 每次只换中心距，对照同一段伸出距离：

| 中心距 | 先按几何与规格判断 | 提前写下的答案 |
| --- | --- | --- |
| `0.4` | `0.25` 够不到 `0.4`，针碰不到线。 | `False` |
| `0.1` | `0.25` 超过 `0.1`，针越过线。 | `True` |
| `0.25` | 刚好够到；规格说触线也算。 | `True` |

**⑥ 再看测试怎样比较。** 打开 `tests/test_experiment.py`，搜索 `test_crossing_known_positions`；先看它上方的参数列表，找到刚才三组输入与答案，再看断言：

```python
assert experiment.crosses_line(distance, angle) is expected
```

1. `distance, angle`：把事先选好的位置和角度交给函数。
2. `experiment.crosses_line(...)`：取得程序的实际回答。
3. `expected`：与事先按规格确定的答案比较。`assert` 不成立，测试就失败。

**⑦ 核对另一道手算题。** 搜索 `test_estimator_has_a_hand_calculable_answer`：

1. 读输入：`N=100、K=32、L=0.5、d=1`。
2. 代公式：`2 × 0.5 × 100 / (1 × 32) = 3.125`。
3. 看断言中的 `pytest.approx(3.125)`：允许浮点计算的小误差，不是把任意“接近 π”的数字都判对。

- **照念：** “`pytest` 寻找和执行测试，告诉我们哪里失败；正确答案由规格与独立计算来决定。测试可以由 Agent 写，期望值仍要有依据。”

**转场：** 测试文件里的这些答案已经固定。现在给它一个能运行、甚至能生成漂亮报告，但边界判断有错的程序。

#### 让同一份测试拒绝一个错误

> 实现服从规格和测试；不是为了全绿而改掉预期答案。

**开场照念：**

> 针尖恰好触到线，也算相交。现在这个程序能运行，但它把“恰好触线”漏掉了。我们用事先确定的答案找出错误，只改实现，不改答案。

**① 跑出失败。** 切换到课前准备的**故障副本**，学生先观察，不在自己的项目里造错。只打开 `experiment.py` 与 `tests/test_experiment.py`，在副本的 Terminal 执行：

```bash
pwd
uv run --locked python -c "import experiment; print(experiment.__file__)"
cp experiment.py experiment.before-fix.py
uv run --locked python -m pytest -q tests/test_experiment.py -k crossing_known_positions
```

- 先看导入路径确实属于故障副本；最后一条命令只选取五个固定针位，`-q` 简化输出。
- **只认底部结果：`2 failed, 3 passed, 15 deselected`。** `deselected` 是另外十五项本次没有运行，不是失败。

**② 红字只读这一例。** 找到 `distance = 0.25`、`angle = 1.570796…` 的失败，不逐行读完整输出：

| 看哪里 | 看到什么 | 台上怎么说 |
| --- | --- | --- |
| 输入 | 中心距 `0.25`，针垂直于线（角度 `π/2`） | 针长 `0.5`，半根针正好伸出 `0.25`，针尖刚好触线。 |
| 预期 | `expected = True` | 规格说触线也算，所以提前确定的答案是“相交”。 |
| 实际 | `assert False is True` | 程序却回答“不相交”，所以这条断言失败。 |
| 定位 | `tests/test_experiment.py` 的断言行 | 这是测试发现错误的位置；错误判据要去实现里找。 |

- 问学生一句：“`0.25 < 0.25` 成立吗？”不成立；`0.25 <= 0.25` 才成立。
- **为什么有两个失败？** 另一例是 `distance=0、angle=0`：针平行且落在线上，也算相交。错误程序判断 `0 < 0`，仍回答 `False`。其余三例都没有卡在相等边界。
- 连续随机取样几乎不会恰好落在这个边界；随机结果看起来正常，不能代替这两个确定的反例。

**③ 只改一个符号。** 把刚才的真实失败输出交给 Agent，先让它解释：

```text
本实验规定“针尖触到线也算相交”。请按这条规则解释下面的真实失败记录。
指出测试输入、预期值、实际值，以及实现中对应的判断。
先不要改文件，不修改测试；每处给出文件名和代码位置。
实际失败输出：〈粘贴本次测试输出〉
```

- 在编辑器搜索 `def crosses_line`，只看末尾这一行：

```python
# 修复前：漏掉“相等”
return distance < length / 2 * math.sin(angle)
# 修复后：包括“相等”
return distance <= length / 2 * math.sin(angle)
```

- 核对解释后，再发：“只在故障副本的这行比较符号上增加 `=`，保持测试与其他代码不变。”批准这一处修改。

**④ 同一份测试重跑。** 仍在故障副本中执行：

```bash
uv run --locked python -m pytest -q tests/test_experiment.py -k crossing_known_positions
uv run --locked python -m pytest -q tests/test_experiment.py
```

- 第一条应为 `5 passed, 15 deselected`；第二条应为 `20 passed`。
- 运行 `diff -u experiment.before-fix.py experiment.py`，应只看到 `<` 变为 `<=`；检查 Agent 的编辑记录，确认测试未改。临时副本不需要另建 Git 仓库。

**收口照念：**

> 答案先来自规格，测试把实际结果与答案比较。刚才只多了一个等号，同一份测试从失败变为通过，支持我们接受这处修复；它还没有证明整个随机实验和报告都正确。

**现场卡住时：** 导入失败、依赖报错、没收集到测试，说明测试尚未运行起来。展示课前保存的真实失败输出与单行 diff，明确说“这是课前试跑的记录”，继续上述判断；不把环境报错冒充算法反例，也不为这一段临时修整套环境。

#### 带着问题看代码

> 不逐行读完整项目；从一个要判断的问题，找到它对应的输入、规则与输出。

- 保持故障副本的修复版打开，用 `Ctrl+P` 打开 `experiment.py`；下面每个问题都按“找位置 → 代入或追踪 → 核对结论”走。

**① 触线为什么返回 `True`？**

1. 搜索 `def crosses_line`，看签名中的输入 `distance、angle` 与默认针长、线间距。
2. 找末尾判据 `distance <= length / 2 * math.sin(angle)`，代入 `0.25、π/2`，两边都为 `0.25`。
3. `0.25 <= 0.25` 成立；回到测试的 `True`，核对规则与实现一致。

**② `3.14159` 是否比 `3.125` 更正确？**

1. 搜索 `def estimate_pi`，只看零相交的处理与返回公式。
2. 代入刚才的 `100、32` 与默认几何参数，按公式得到 `3.125`；直接返回 `math.pi` 没有执行这次估计。
3. **照念：** “这里验收的是 `100/32 = 3.125` 这次计算有没有按公式执行，不是谁报的数字更像 π。”

**③ seed 应放在哪里？**

1. 搜索 `def simulate`，先找到 `rng = random.Random(seed)`，再找到 `for` 取样循环。
2. 沿缩进看位置：教师实现在循环外初始化，每次 `simulate` 调用设一次，循环内继续取样。
3. **照念：** “seed 像这次实验的起跑线：开始时设一次，接下来继续往前取样；每一针都回起跑线，就可能重复同一针。”本次只定位说明，不再制造故障。

- 请 Agent 每次只解释当前问题的几行，对照文件核验，不把解说文字当作源代码。
- 当前公开测试检查已知针位、公式、部分非法输入、复现与 CSV 一致性；**尚未证明**取样均匀、彼此独立、seed 没在循环内重设，也没验收图表与 PDF。

**转场：** 我们不要求先掌握所有 Python 语法，但至少能围绕一个问题，追到对应的规则与实现。接下来用这个方式接受 Agent 为自己生成的实验。

#### 委托实现自己的实验

> 先交代验收要求，再让 Agent 实现；代码生成快，不等于验收可以省略。

**① 回到自己的项目，先只读复述。** 返回学生的 `week-03/`，核对 Explorer 与 Terminal 路径，离开教师故障副本；发送：

```text
阅读 EXPERIMENT.txt 和 tests，不修改文件。
用简短要点说明需要实现的三个函数，并选一个能手算的测试，解释它的预期值从哪里来。
```

- 核对三个函数是 `crosses_line`、`estimate_pi`、`simulate`，触线规则与手算 `3.125` 的依据没有变。

**② 指定项目范围，再委托生成。** 发送：

```text
按现有要求，在 week-03 建立独立的 uv Python 3.12 项目，加入 matplotlib 和 pytest。
pyproject.toml、uv.lock、.venv 留在本周目录，不改 W2 根项目；uv init 加 --no-workspace，不另建 Git 仓库。
本周 [tool.pytest.ini_options] 设置 testpaths = ["tests"]。
实现 experiment.py，默认 seed=42，每次实验在循环外初始化一次随机数生成器。
默认运行 1000、10000、100000 次投针，CSV 保存真实参数、交叉数与估计值。
保持教师 tests 和 rebuild.sh 不变；先 uv sync 安装依赖并生成锁文件，再实际运行公开测试。
失败时先解释，再修实现。
```

**③ 看项目已经建在本周，再本人测试。** 打开本周 `pyproject.toml`，核对 Python 3.12、两个依赖与 `testpaths = ["tests"]`；确认本周已生成 `uv.lock` 与 `.venv/`，再在自己的 Terminal 执行：

```bash
uv run --locked pytest -q
```

- 核对实际输出与 Agent 工具记录；原始公开测试应为 `20 passed`。失败先看原因，修实现，不接受只在聊天里说“全部通过”。
- 在 Source Control 确认 W2 根项目配置未被改，教师 `tests/` 与 `rebuild.sh` 未被改；独立项目没建好，停在此处补齐，不借根项目环境继续运行。

**④ 用刚才三问接受自己的实现。** 在自己的 `experiment.py` 找相交判据、估计公式与 seed 初始化位置；写法可以不同，依据同一规格判断。

#### 把证据写进报告

> 程序通过测试，与图表、文字使用本次结果，是两项不同的核验。

**① 先生成本周真实 CSV。** 公开测试在临时目录检查 CSV，不保证自己的项目目录已有结果；在自己的 `week-03/` 执行：

```bash
uv run --locked python experiment.py
```

- 打开本周 `results.csv`，看表头与实际行：`seed、n、crossings、pi_estimate、needle_length、line_spacing`。不把测试临时目录的结果当作本周报告输入。

**② 委托图表，再接入 LaTeX。** 发送：

```text
读取真实 results.csv，完成 render_results.py，生成 results-table.tex、results-params.tex 和 results.png。
图表与参数都读取同一份 CSV，不在这一步重新投针。
让 report.tex 引入这些结果，保留模板版式，写明实际参数，补一句基于结果的观察。
适配教师 rebuild.sh，不修改它；运行测试并重建报告，给我实际输出文件的位置。
```

**③ 本人先测试，再重建。** 仍在自己的 `week-03/` 依次执行：

```bash
uv run --locked pytest -q
bash rebuild.sh
```

- 第一条完成公开测试；第二条依次显示三个阶段：实验写 `results.csv` → 图表程序读取 CSV、生成表格／参数／图片 → LaTeX 编译 `report.pdf`。`rebuild.sh` 不包含测试；某阶段报错就先处理该阶段，不把已有旧 PDF 当作重建成功。

**④ 打开产物，沿同一行核对。**

1. 从重建后的 `results.csv` 选一行，读出 seed、`N`、`K`、估计值、针长与线间距。
2. 打开 `results-params.tex` 与 PDF 的参数部分，对照实际 seed、各组 `N`、针长、线间距。
3. 打开 `results-table.tex` 与 PDF 表格，找到同一组 `N`，核对 `K` 与估计值；显示的小数位数可以不同，数值要对应。
4. 打开 `results.png` 与 PDF 中的图，找到这组 `N` 对应的估计值；最后读报告的观察，确认它说的是本次结果。

- 估计值不要求等于 π，投针数增加也不保证每次误差都变小。测试全绿但 PDF 仍是旧版，也不能交付；亲自打开产物完成核验，不以 Agent 的“完成了”收口。

### 100-150 | 让 Agent 带路，自己认识工具与代码

> 不再靠增加代码功能充实任务；借助 Agent 认识 VS Code、核验它的能力，并导读现有项目。

#### 让 Agent 介绍自己，展示一项能力

> 能力介绍是一份待验证的说明，实际工具与结果才是证据。

**① 先选正在看的项目。** 已完成者打开自己的 `week-03/`；尚无 Python 实现者打开 W2 仓库根目录，用 `demos/week-03-buffon/` 只读导读，测试在 `week-03/tests/`。后者只借源码学习，自己的报告可继续完成。

- 看 Explorer 顶部与 Terminal 的 `pwd`，确认窗口对应哪个目录；教师源码与学生源码不能混用路径。

**② 再看能力介绍。** 新建 Agent 对话，发送：

```text
结合当前工作区和本次会话实际可用的工具，介绍你能怎样帮助我。
区分能直接执行、只能指导我操作、目前不能确认的事情；不要猜测自己拥有的权限。
选一项读取文件的能力实际展示，说明读取了哪里、得到什么。不修改文件，不安装软件。
```

**③ 验证一次读取。** 展开工具记录，先看文件路径，再亲自打开同一文件；找出回答引用的一处内容，核对它是否真的在文件里。只有介绍、没有读取记录时，请它实际读取一次，不把自我介绍当作演示完成。

**④ 分清操作与指导。** 继续问：“如果我要求你点击某个 VS Code 按钮，你能直接完成，还是只能给操作步骤？”；看实际结果，不强求它控制界面。

**照念：** “它说自己会做什么，先当作说明。真正读到了哪个文件、返回了什么，才是这次能力的证据。”

#### 让 Agent 带路认识 VS Code

> 从“它告诉我在哪里”走到“我自己能找到并检查”；不重新安装工具。

- 发出一条逐步指导请求：

```text
我想用当前项目熟悉 VS Code，请每次只带我做一步，等我确认再继续。
先找到 experiment.py，再搜索 crosses_line，查看它的调用位置，最后打开 Source Control 看改动。
说明这一步用的是 Explorer、编辑器搜索、全项目搜索还是 Git 面板。
由我操作；不要编辑文件、初始化仓库或安装扩展。界面不一致时先问我看到什么。
```

**① 找文件。** 按 `Ctrl+P`，输入 `experiment.py`，在列表核对路径后打开；教师演示选 `demos/week-03-buffon/experiment.py`。看编辑器标签与面包屑路径，确认打开的是刚选的文件。

**② 搜当前文件。** 光标留在这份代码里，按 `Ctrl+F`，输入 `crosses_line`；先找到 `def crosses_line`，再切换命中位置看它在哪里被使用。这个搜索只回答“当前文件哪里出现了这段文字”。

**③ 搜整个工作区。** 按 `Ctrl+Shift+F`，输入同样文字；先看结果属于哪些文件，再点击一处调用或测试。

- 自己打开 `week-03/` 时，通常能看到实现和 `tests/`；打开仓库根目录时，还可能看到教师演示与学生实现，先核对路径。
- `def` 是定义；`crosses_line(...)` 可能是调用；注释和字符串也可能命中。搜索命中不等于语义上的调用，要打开代码核对。

**④ 看文件改动。** 打开左侧 Source Control，逐个看文件标记：

- 已跟踪文件有改动：点开 diff，对照旧内容与新内容；关注本次增加或修改的内容。
- 新文件标为 `U`：打开完整文件；它还没有旧版可比，不能只靠普通 `git diff` 检查。
- 没有改动：确认工作区干净，继续导读；不为演示制造修改。

- 每完成一步，让学生说一句“我现在看的是哪个文件／哪种结果”，再向 Agent 确认继续；不一次读完四段说明。
- 若已有“转到定义／查找引用”可用，可补充展示；不可用就继续用搜索，不临时增加扩展配置。
- 完成后任选一个还不会的操作继续探索：并排查看测试与实现、拆分终端、找到工作区设置、从 Problems 面板定位一条已有报错。让 Agent 一步一步带路，不要求全部完成或安装新工具。

#### 让 Agent 导读一次调用

> 先追一个结果，再追函数；不是听完整项目的逐行翻译。

- 发送：

```text
只读当前项目的 experiment.py 和公开 tests；先确认文件路径。
若我使用教师演示，源码在 demos/week-03-buffon/，测试在 week-03/tests/。
带我追踪一次 simulate 调用：
输入怎样进入，在哪里取样，怎样判断相交并累计，最后怎样得到估计值。
先给不超过五步的调用路线，再逐步指出文件、函数和代码位置；每步等我确认后继续。
不要改代码，无法从文件确定的事情请明确说不知道。
```

**沿这五站停一下。** 教师参考实现的路线是 `simulate → crosses_line → estimate_pi → 返回结果`；学生按自己生成的实现核对，写法不必一样。

1. **输入进入。** 找到一处 `simulate(...)` 调用，看传入的投针数、seed、针长和线间距；再打开 `def simulate`，对照参数位置与默认值。省略的参数使用定义中的默认值，不是 Agent 临时猜出来的数。
2. **开始取样。** 在 `simulate` 中找 `rng = random.Random(seed)`、`crossings = 0` 与 `for`；初始化在循环外。一次循环就是一针，循环内取出中心距和角度；先不展开每条输入检查。
3. **判断这一针。** 找到循环里的 `crosses_line(...)`，看它拿到刚取出的两个数；跳到判据，再用已知的 `0.25、π/2` 理解为什么边界返回 `True`。这组确定输入解释规则，不要求随机调用恰好抽到它。
4. **累计相交数。** 回到循环，找结果怎样改变 `crossings`；教师实现用 `crossings += ...`，`True` 计一次，`False` 计零次。循环结束后的数就是本次 `K`。
5. **得到并返回估计。** 找到 `estimate_pi(n, crossings, length, spacing)`，用第二课时的 `N=100、K=32` 再对照公式；最后看返回结果中的 `n`、`crossings`、`pi_estimate` 与参数。这个结果随后才由外层程序写进 CSV，`simulate` 本身不等于整份报告。

- 每站只打开对应几行：先让 Agent 指路，再由学生找到位置；一站能说明后才继续，不让它翻译完整源码。
- 自选一个问题继续追问：
  - `length` 不写时，为什么用 `0.5`？默认参数在哪里？
  - `crossings` 从哪里开始累计，最后传给谁？
  - `seed` 从哪里传入，在哪里真正影响随机数？
  - `import experiment` 为什么不该自动运行完整实验？入口保护在哪里？
- 用自己的话记一条“问题 → 对应文件／函数 → 已核验的解释”，自己的笔记即可；不以 Agent 回复篇幅或新增代码量评价完成度。

#### 从命令追到 PDF

> 顺着实际输入输出看项目分工，确认重建了什么、没有检查什么。

- 发送：

```text
只读当前项目的 rebuild.sh、experiment.py、render_results.py 和 report.tex；先确认文件路径。
若我使用教师演示，这四个文件都在 demos/week-03-buffon/。
以 bash rebuild.sh 为起点，说明程序怎样依次生成 CSV、参数、表格、图片和 PDF。
每一步指出谁读什么、写什么，以及对应代码位置。
检查脚本是否运行测试；若没有，指出应单独执行的命令。
不要修改文件，不代我运行；先给简短路线，我选一步后再展开。
```

**按四个文件查，不把它们都叫“生成报告”。**

| 打开哪个文件 | 只定位哪里 | 它读什么／写什么 |
| --- | --- | --- |
| `rebuild.sh` | `experiment.py`、`render_results.py` 和 LaTeX 命令 | 串联三个阶段；自己不计算相交次数。教师脚本先切到脚本所在目录。 |
| `experiment.py` | 从 `main` 沿调用找到 `simulate` 与 CSV 写出 | 读取实验参数，运行模拟，写 `results.csv`；调用可以经过其他函数。 |
| `render_results.py` | CSV 读取与三处结果写出 | 读已有 CSV，写 `results-params.tex`、`results-table.tex`、`results.png`；不重新投针。 |
| `report.tex` | `\input`、`\includegraphics` | 引入参数、表格和图片；编译器据此生成 `report.pdf`。 |

**再把两个检查分开。** 搜索脚本中的 `pytest`，确认没有测试调用；学生完成版的测试命令仍在 `week-03/` 单独执行：

```bash
uv run --locked pytest -q
```

- 教师演示只读导读时不代学生运行测试；公开测试在 `week-03/tests/`，不把演示目录的“没有收集到测试”当作通过。
- 已有报告时，从 `results.csv` 选一行，记住 `seed、n、crossings、pi_estimate`；在 `results-table.tex` 与 PDF 找同一行，估计值允许按展示位数四舍五入，再核对参数与图来自同一 CSV。
- 若自己的产物尚未生成，先借教师已有产物看这条链；这不代表自己的报告已经完成。

**收口问一句：** “只重新编译 LaTeX，能自动更新模拟结果吗？”对照四个文件回答：编译使用当时已有的图表；要重新投针并更新报告，需要更新整条生成链。

#### 保存成果与本次课回顾

> Agent 可以执行、解释和带路；人仍要找到依据，决定接受什么。

**① 先确定要保存的内容。** 完成报告者让 Agent 检查 `week-03/.gitignore`，排除凭据、`.venv`、缓存和 LaTeX 中间文件；保留源码、锁文件与报告材料。尚未完成者可以保存真实的当前进度，提交说明不写“完成报告”；只读探索没有改动就不用再提交。

- 若 `.gitignore` 还列着 `results.csv`、`results-table.tex`、`results-params.tex`、`results.png`，先移除这些结果文件的忽略条目；想保存 PDF 时也移除 `report.pdf` 条目。凭据、环境、缓存与编译中间文件仍排除，再查看实际待提交文件。

**② 回到同一个 Git 仓库根目录。** 以下 Git 操作在 W2 仓库根目录进行，不在 `week-03/` 新建仓库：

```bash
cd ~/course/w02-workbench
git rev-parse --show-toplevel
git status --short --untracked-files=all
git diff -- week-03
git diff --cached --name-only
```

- 第一条 Git 输出应是原来的 `w02-workbench` 仓库；状态列出本周文件与已有其他改动。
- 普通 diff 检查已跟踪文件；`U`／`??` 新文件逐个打开看完整内容，图片和 PDF 亲自打开。确认没有 Key、环境目录和编译中间文件，也没有混入不属于本次保存的改动。
- 最后一条检查是否已有暂存内容；有不认识的文件先核对，不能因为新加了 W3 就忽略它们。

**③ 选择文件，再核对暂存区。** 在 Source Control 只暂存已经检查、决定保存的文件；也可用明确的文件路径。下面是完成版常见文件的示例，实际文件存在并核对后才使用：

```bash
git add -- week-03/.gitignore week-03/pyproject.toml week-03/uv.lock
git add -- week-03/experiment.py week-03/render_results.py week-03/report.tex
git add -- week-03/results.csv week-03/results-table.tex week-03/results-params.tex week-03/results.png
git diff --cached --stat
git diff --cached
```

- 若本周存在 `.python-version`，可单独暂存 `week-03/.python-version`；想一并保存 PDF，可再暂存 `week-03/report.pdf`。未生成的文件不加进命令，二进制文件内容仍靠打开核对。
- `--cached` 是这次 commit 真正要收进历史的版本；暂存后又改了文件，要重新决定是否把后来的修改暂存，不能只看编辑器最终文字。

**④ 保存本地历史。** 沿用 W2 的 Git 身份；若 commit 报姓名／邮箱缺失，本人按 W2 方法填自己的公开署名和实际邮箱，Agent 不猜地址。完成版示例：

```bash
git commit -m "Complete W3 Buffon report"
git log -1 --oneline
git status -sb
```

- 看见新的 commit 与剩余状态，才确认已保存在本地历史；这一步还没有上传。

**⑤ 需要发布时，先读现有 remote。**

```bash
git remote -v
git branch --show-current
```

- 个人 `origin` 已存在且地址正确：沿用，确认当前分支是 `main` 后运行 `git push -u origin main`。
- 尚无个人 remote：本人在 GitHub 建空仓库，不初始化 README 等文件，复制真实的个人 URL。若 `origin` 确实是教师 `wxyinucas/ai-agents`，且没有冲突的 `upstream`，可按原规则把教师改名为 `upstream`，再添加个人 `origin`：

```bash
git remote rename origin upstream
# 下一行 URL 必须替换成刚复制的本人仓库地址，再执行。
git remote add origin "<必须替换：本人 GitHub 仓库的真实 HTTPS URL>"
git remote -v
```

- 若教师已叫 `upstream`、且没有 `origin`，只添加个人 `origin`；已有命名或地址不符合上述情况，先把实际输出交给 Agent 解释，不覆盖地址、不删 remote。
- 核对个人目标 URL、待上传 commit 和 `main` 分支后，由本人执行对应 push；分支不是 `main` 时先核对，不临时重命名或重建历史。账号登录与上传授权由本人完成，Agent 的帮助不提供 GitHub 写权限。
- 打开自己的 GitHub 仓库，确认 W2 历史仍在，W3 源码、锁文件与决定保存的报告材料已出现；认证或历史冲突报错时保留输出求助，不 force push。

**回顾只问三件事。**

- 工具使用：请求、上下文、工具与反馈，各自做了什么？
- 验收依据：为什么这个输入应该得到这个输出，测试如何拒绝错误？
- 代码导读：从问题出发，能否找到相关位置并核验解释？

**照念：** “API 接通、代码生成与 PDF 出现，都是过程节点。能说明自己据什么接受结果，才是一次完整的委托。”

## 临场取舍

- 已经接通：展开自己的 README 读取与 `pwd` 记录，再比较上下文来源；不只等全班配置完成。
- 安装或编译耗时：先保留最后的实际输出；第二课时跟看教师的确定性测试与故障演示，第三课时再继续自己的报告，不用等待填满教学。
- 实验尚未完成：打开仓库根目录，源码选 `demos/week-03-buffon/`、测试选 `week-03/tests/`；只读走一次调用，随后返回自己的 `week-03/` 继续推进。借教师实现导读不等于完成本人实现。
- 提前完成：从 seed 的作用、脚本工作目录、图表数据来源或测试漏掉的性质中选一个问题；让 Agent 一步一步带路，自己找到依据。只读探索即可，不要求再增加功能。
- 模型未出现：保存配置，重启 VS Code，回 Chat 查看模型列表；仍失败时保留实际界面求助，不切成 `Auto` 后宣称接通 DeepSeek。
- 连接报错：记下 Provider、模型名和完整错误；遮住 Key 后向已有可用的 Agent 或教师求助。没有成功响应就仍在处理接入，不冒充已完成。
- 界面不同：先说清当前窗口、面板与看到的按钮，再提供不含 Key 的实际页面或截图；借助 Agent 和 [VS Code 官方模型说明](https://code.visualstudio.com/docs/agent-customization/language-models)定位，不照旧按钮名称盲点。
