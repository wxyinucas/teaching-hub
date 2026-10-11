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

- [ ] **准备账号**：登录 DeepSeek 开放平台，确认可用余额与创建 Key 的入口；投屏时不显示 Key。
- [ ] **接通 Agent**：按下文配置原生 Chat/Agent；确认实际模型，取得 README 读取与 `pwd` 执行记录。试过新对话的上下文演示、Git 面板和 Agents Window 入口，记下实际界面。
- [ ] **取得材料、编译模板**：在保留 W2 本地 commit 的练习副本中 pull，确认 `week-03/` 和演示目录都已取得；进入 `week-03/`，配置 LaTeX Workshop 与编译器，让尚无图表的 `report.tex` 先生成 PDF。
- [ ] **跑通学生路线**：用刚接通的原生 Agent + DeepSeek，照 Guide 在 `week-03/` 建立独立 uv 项目、实现实验；自己运行公开测试与 `bash rebuild.sh`，打开 CSV、图和 PDF，核对实际参数与数字。确认 W2 根项目配置未改，记下展示耗时。
- [ ] **准备测试反例**：在仓库外的新临时目录中复制 `demos/week-03-buffon/` 的 `experiment.py`、`pyproject.toml`、`uv.lock`、`.python-version`，以及 `week-03/tests/`；不复制 `.venv`。在副本中执行 `uv sync --locked`，先确认公开测试通过，再只将相交判据的 `<=` 改为 `<`。按下文跑定点测试，确认是断言失败，而不是导入或环境错误；课上只操作这个副本。
- [ ] **准备导读**：在自己的完成版中找到相交判据、估计公式、seed 初始化、CSV 写出和 LaTeX 引入图表的位置；实际走一遍下文三处定位，不依赖 Agent 临场讲一整份源码。
- [ ] **试走保存与上传**：在练习副本检查 `.gitignore`、diff 与 commit，再按现有 remote 情况上传个人仓库；确认 W2 历史保留，没有 Key、虚拟环境与编译中间文件。
- [ ] **打开课堂入口**：打开 Slides、Guide、完成版项目和故障副本；故障副本先保持 `<`，两者的窗口与终端路径能清楚区分。

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

#### 接通真实模型

> 沿用 W2 工作区，配置自己的模型与凭据，再发起真实调用。

- 在 WSL Bash 中打开已有工作区：

```bash
cd ~/course/w02-workbench
code .
```

- 沿用 W2 的 VS Code + WSL 环境和已有 `README.md`，不重复安装，不改写文件。
- 若窗口处于 Restricted Mode，通过 Manage Workspace Trust 检查这个已知课程工作区的信任状态。

- 点击 VS Code 窗口顶部的 **Chat** 图标，打开原生 **Chat** 面板；不是 Codex 或 Cline 面板，也不另开 Agents window。

**准备 DeepSeek API Key**

1. 打开 [DeepSeek 开放平台](https://platform.deepseek.com/)，注册或登录。
2. 查看余额；需要时按平台当前要求小额充值。
3. 在 **API Keys** 中创建 Key，名称填 `w3-vscode`，立即妥善保存。
4. 接下来只把 Key 粘贴到 VS Code 的凭据输入框，不投影、不发到聊天、不写入文件。

**在 VS Code 添加 DeepSeek 模型**

1. 按 `Ctrl+Shift+P`，输入并运行 `Chat: Manage Language Models`。
2. 选择 **Add Models → Custom Endpoint**。
3. 按提示填写分组／显示名称 `ds` 与自己的 API Key；API 类型选择 **Chat Completions**。
   - 直观介绍：这里选的是 Agent 与模型服务沟通的格式，不是模型本身。
   - **Chat Completions**：发送对话历史，取回下一条回复；也可以包含工具调用。
   - **Responses**：OpenAI 较新的接口，把回复、工具调用等分成不同项目；还支持衔接上一轮响应、使用服务端内置工具。
   - **Anthropic Messages**：用文本、图片、工具调用等内容块组织消息；多轮对话同样由调用方传入历史，字段格式不同。
   - 我们填写的 DeepSeek 地址使用 Chat Completions；先匹配服务端的接口，不是名字越新就越该选。
4. 在自动打开的 `chatLanguageModels.json` 中，修改刚新增的 `ds` 项；完整结构如下，`apiKey` 保留本机生成的引用：

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

5. 示例中的凭据编号来自教师机器；学生保留各自的 `${input:…}`，不照抄编号、不写明文 Key；文件中已有的其他配置项保留。
6. 保存，回到 **Chat**；模式选择 **Agent**，模型选择 **DS Flash**，不是 `Auto`。
7. 保持默认批准机制，不选择全部自动批准。

<!-- API 串词参考：https://code.visualstudio.com/docs/agent-customization/language-models；https://developers.openai.com/api/docs/guides/migrate-to-responses；https://platform.claude.com/docs/en/api/messages/create -->
<!-- 记忆力串词参考：https://developers.openai.com/api/docs/guides/conversation-state；https://api-docs.deepseek.com/guides/multi_round_chat/；https://platform.claude.com/docs/en/build-with-claude/working-with-messages -->

#### 一条请求怎样变成操作？

> 模型提出行动，工具实际执行，结果再回到对话；回答与执行记录分别核对。

- 在 Chat 中新建对话，发送：

```text
请读取当前工作区的 README.md，告诉我这个项目的目标。
先不要修改文件或运行命令。
```

- 查看工具记录：读取的是当前工作区的 `README.md`；若出现批准请求，检查后再批准。
- 对照文件检查回答：项目目标应与 README 一致。
- 继续发送：

```text
为了核对工作位置，请运行 pwd，并对照刚才 README.md 的位置解释结果。
只执行这个只读检查，不修改文件。
```

- 展开实际记录，依次指出：
  - 输入：我的任务与 Agent 已取得的项目内容；
  - 行动：读取文件、调用终端；不是模型靠文字改变了文件系统；
  - 反馈：文件内容、命令输出或报错回到对话；
  - 下一步：模型根据反馈给出回答，或者继续提出操作。
- 对照 Terminal 的 `pwd` 与 Explorer 的工作区：Agent 调用工具时也有工作位置。
- 默认机制下，有些只读操作可能直接执行；需要批准时，先看命令、目录与作用范围，不开启全部自动批准。
- 只看可见的请求、工具与结果；不把聊天中的过程叙述当作模型内部推理的完整记录。

#### Agent 从哪里获得上下文？

> 对话历史和项目文件是输入来源；模型参数不是本次聊天的笔记本。

- 在当前对话发送：

```text
本次课堂的临时暗号是“W3-Q9L7”。只复述这个暗号，不写入文件。
```

- 同一对话继续问“刚才的临时暗号是什么？”；随后新建空白对话，再问：

```text
上一段对话里的临时暗号是什么？不要搜索文件。
如果当前可见上下文中没有，就说不知道，不要猜。
```

- 对照两个回答和当前对话的附带内容：前一段历史是否被带入？有没有自动附加摘要、记忆或文件？不把“新建对话”一概等同于清空系统所有上下文。
- 把包含暗号的原始消息主动粘贴到新对话，再问一次；这次明确知道信息由谁提供。暗号答对与否，不能单独证明 API 怎样存储历史。
- **会议记录类比**：
  - Chat Completions / Messages：客户端选取记录，每轮随请求带给模型；
  - OpenAI Responses：还可以把上次 API 返回的响应编号发给同一服务，由服务端接续它保存的相关记录；不是去取本地 VS Code 或网页聊天；
  - 模型根据本次获得的记录回答，不把聊天历史直接写进参数。
- 项目文件也可以重新读取；文件仍在，不等于模型此刻已读到。历史保存了，也不等于全部都在当前上下文里。
- 上下文有限，Agent 可能筛选或压缩旧记录；重要的规格和结果保存在文件中，换对话后可以明确让它再读。

#### 让 Agent 帮助打开 Git 面板

> 打开 Source Control，区分 Agent 直接执行与指导自己操作。

- 在已经接通的 Agent 对话中继续：

```text
请帮我打开 VS Code 的 Source Control（Git）面板，简单解释它有什么用。
如果你不能直接操作界面，就告诉我怎么打开，让我来做；不要修改文件或初始化仓库。
```

- 看结果：Source Control 面板已经打开，仍是 W2 的仓库；不重新初始化。
- 看过程：是 Agent 直接打开，还是自己按它的指导打开？

#### 认识 VS Code 的 Agents Window

> Chat 围绕当前项目操作；Agents Window 围绕任务与会话组织工作。

- 打开：标题栏 **Open in Agents**；或按 `Ctrl+Shift+P`，运行 **Chat: Open Agents window**，打开独立窗口。
- 对照：Chat 在编辑器旁，方便边看代码、边运行、边修改；Agents Window 集中查看多个项目的任务、进度与结果。
- 看 **Sessions**：选择一个会话，查看它对应的项目与谈话；切换会话，当前工作的对象随之切换。
- 看 **Changes / Files**：核对该会话的文件改动与项目文件；Agent 说“完成了”，仍要打开实际文件与 diff 检查。
- 核对模型与授权：原 Chat 接通 DeepSeek，不代表 Agents Window 已可使用它；自带 Key 的接入可能需要额外设置。
- 本段只展示入口与工作方式；随后返回原工作区的 Chat，继续本周实验，不增加学生必修配置。

<!-- Agents Window 参考：https://code.visualstudio.com/docs/agents/run/agents-window；https://code.visualstudio.com/docs/agents/run/agents-window-configuration -->

### 50-100 | 先确定怎样验收，再让 Agent 实现

> 从规格得到独立的期望值，用测试拒绝错误，再带着问题定位代码；最后完成同一份实验报告。

#### 取得材料，编译模板

> 先确认交付对象与运行条件；能编译 PDF，不等于实验已经正确。

- 回到 W2 仓库更新材料，再打开本周目录：

```bash
cd ~/course/w02-workbench
git remote -v
git pull --no-rebase origin main
cd week-03
code .
ls
```

- 上面的 `origin` 按仍指向教师仓库的情况写；已配置个人 remote 者从教师 `upstream` 更新。发生 merge 问题，把完整输出交给 Agent 协助，保留已有 commit，不重建仓库。
- 对照文件：`EXPERIMENT.txt` 是要求，`tests/` 是部分验收，`report.tex` 是模板，`rebuild.sh` 是重建入口；两份 Python 实现尚待生成。
- `week-03/` 有自己的 uv 环境；Git 仍沿用 W2 历史，不在子目录 `git init`。
- 向 Agent 发送：

```text
检查当前 WSL 工作区的 LaTeX 环境，目标是 LaTeX Workshop、XeLaTeX 和 latexmk。
先列出已有和缺少的组件，再帮我配置缺少的部分。
遇到 sudo，把命令交给我在终端执行；不要索取密码。
最后回答：安装的 LaTeX 组件，是全局的，还是这个项目局部的？
```

- 在 Extensions 核对 **LaTeX Workshop（James Yu）** 的 WSL 安装位置；缺少编译组件时，在 WSL Terminal 执行：

```bash
sudo apt update
sudo apt install texlive-xetex texlive-lang-chinese latexmk
xelatex --version
latexmk --version
```

- 扩展整合编辑与编译操作，不能替代编译引擎；密码本人输入。[安装说明](https://github.com/James-Yu/LaTeX-Workshop/wiki/Install)
- 请 Agent 用 XeLaTeX 编译 `report.tex`，保留字体与版式，暂不加入图表；亲自打开 PDF。参考命令：

```bash
latexmk -xelatex -interaction=nonstopmode -halt-on-error report.tex
```

**转场：** 生成报告对 Agent 并不困难。接下来先不让它写程序：我们凭什么接受程序的结果？

#### 从规格得到测试的答案

> 先有理由说明“应该是什么”，再把这个判断写成测试；不能用待验收程序自己的输出定义正确。

- 直观介绍：纸面上画一组等距平行线，随机投下一根短针；重复很多次，统计有多少次针碰到线，用这个比例估计 π。
- 先认清四个物理量：
  - `L`：针长，代码中叫 `length`；`d`：相邻平行线的间距，代码中叫 `spacing`。本实验限定 `0 < L <= d`。
  - `angle`：针与平行线的夹角，用弧度表示；`0` 表示平行，`π/2` 表示垂直。
  - `distance`：针的**中心**到最近一条线的距离，不是线间距 `d`。
- 一次投针：独立、均匀地抽取 `distance ∈ [0, d/2]` 和 `angle ∈ [0, π/2]`；利用位置与方向的对称性，不必模拟整张纸。
  - 半根针朝垂直于线的方向伸出 `L/2 × sin(angle)`；伸出距离够到最近的线，就记为相交。
  - 重复 `N` 次，累计相交次数 `K`，得到相交比例 `K/N`。
- 原理：在上述条件下，理论相交概率是 `p = 2L/(πd)`。用实验比例 `K/N` 估计 `p`，反过来得到 `π ≈ 2LN/(dK)`；`K=0` 时不能用这个式子估计。
- 这里不推导概率公式；程序要做的是“取样 → 判断相交 → 累计 → 代入公式”，再记录结果。
- 打开 `EXPERIMENT.txt`，只找两条规则：
  - 针尖接触平行线，也算相交；
  - 估计值由本次投针数与相交数计算，不能直接填 `math.pi`。
- 固定 `L=0.5、d=1、angle=π/2`：半根针长 `0.25`，沿垂直方向的伸出距离也为 `0.25`。
  - 中心距 `0.4`：够不到线，`False`；
  - 中心距 `0.1`：越过线，`True`；
  - 中心距 `0.25`：恰好触线，按规格是 `True`。
- 打开 `tests/test_experiment.py`，定位 `test_crossing_known_positions`：上方参数列表保存这些已知输入与期望值，下方断言比较实际返回值。

```python
assert experiment.crosses_line(distance, angle) is expected
```

- 只拆三个对象：`distance, angle` 是输入；函数调用得到实际结果；`expected` 是事先按规则确定的答案。`assert` 不成立，测试就失败。
- 再定位 `test_estimator_has_a_hand_calculable_answer`：
  - `N=100、K=32、L=0.5、d=1`；
  - `2 × 0.5 × 100 / (1 × 32) = 3.125`；
  - `pytest.approx(3.125)` 允许浮点计算的小误差，不是把任意“接近 π”的数字都判对。
- 直观介绍：`pytest` 负责寻找、执行测试并报告失败；它不替我们决定什么是正确。测试可以由 Agent 写，期望值仍要有独立依据。

**转场：** 测试文件里的这些答案已经固定。现在给它一个能运行、甚至能生成漂亮报告，但边界判断有错的程序。

#### 让同一份测试拒绝一个错误

> 实现服从规格和测试；不是为了全绿而改掉预期答案。

- 教师切换到课前准备的**故障副本**，学生先观察；不用尚无实现的 `week-03/` 来演示断言失败。
- 在副本的 Terminal 核对位置和导入对象：

```bash
pwd
uv run --locked python -c "import experiment; print(experiment.__file__)"
cp experiment.py experiment.before-fix.py
uv run --locked python -m pytest -q tests/test_experiment.py -k crossing_known_positions
```

- `-k crossing_known_positions` 只选择名称匹配的这组测试；`-q` 简化输出。
- 看失败记录：输入、实际 `False`、预期 `True`、断言所在文件；本副本应有两个触线案例失败，其余三个案例通过。
- 故障已预先设置：相交判据把 `<=` 写成 `<`。连续随机取样几乎不会恰好落在这个边界，输出看起来正常也不奇怪。
- 将真实失败信息交给 Agent：

```text
本实验规定“针尖触到线也算相交”。请按这条规则解释下面的真实失败记录。
指出测试输入、预期值、实际值，以及实现中对应的判断。
先不要改文件，不修改测试；每处给出文件名和代码位置。
实际失败输出：〈粘贴本次测试输出〉
```

- 在编辑器亲自找到判据，确认应为 `<=`；再批准 Agent **只修正副本的这一个比较符号**，保持测试不变。
- 重新运行完全相同的定点测试，再运行整套测试：

```bash
uv run --locked python -m pytest -q tests/test_experiment.py -k crossing_known_positions
uv run --locked python -m pytest -q tests/test_experiment.py
```

- 运行 `diff -u experiment.before-fix.py experiment.py`，对照修复前后的判据；检查 Agent 的编辑记录，确认测试未改。临时副本不需要另建 Git 仓库。
- 导入失败、依赖报错、没收集到测试，是检查还没运行起来；不能把这些当作“测试抓到了算法错误”。

#### 带着问题看代码

> 不逐行读完整项目；从一个要判断的问题，找到它对应的输入、规则与输出。

- 保持故障副本的修复版打开；先用 `Ctrl+P` 找 `experiment.py`，再用编辑器搜索定位 `def crosses_line`。
- 问题一：“触线为什么应该返回 `True`？”
  - 看函数签名：输入 `distance、angle`，默认针长与线间距；
  - 看末尾判据：`distance <= length / 2 * math.sin(angle)`；
  - 代入刚才的 `0.25、π/2`，再回到测试的 `True`。
- 问题二：“算出 `3.14159`，是不是就比 `3.125` 更正确？”
  - 搜索 `def estimate_pi`，只看零相交的处理与返回公式；
  - 对当前手算输入，应返回 `3.125`；直接返回 `math.pi` 虽然更像圆周率，却没执行约定的估计。
- 问题三：“seed 应放在哪里？”
  - 搜索 `def simulate`，找到随机数生成器初始化，再看取样循环；
  - 教师实现的 `rng = random.Random(seed)` 在 `for` 外，每次调用初始化一次；
  - 若移到循环内，每次投针都从同一个起点开始，可能反复取得同一针；本次只定位说明，不再制造故障。
- 请 Agent 每次只解释当前问题的几行，不展开整份程序；对照文件核验它的解释，不把解说文字当作源代码。
- 当前公开测试检查已知针位、公式、部分非法输入、复现与 CSV 一致性；**尚未证明**取样均匀、彼此独立、seed 没在循环内重设，也没验收图表与 PDF。

**转场：** 我们不要求先掌握所有 Python 语法，但至少能围绕一个问题，追到对应的规则与实现。接下来用这个方式接受 Agent 为自己生成的实验。

#### 委托实现自己的实验

> 先交代验收要求，再让 Agent 实现；代码生成快，不等于验收可以省略。

- 返回自己的 `week-03/` 工作区；教师故障副本不作为学生项目继续使用。
- 学生先发送只读请求：

```text
阅读 EXPERIMENT.txt 和 tests，不修改文件。
用简短要点说明需要实现的三个函数，并选一个能手算的测试，解释它的预期值从哪里来。
```

- 核对触线规则与 `3.125`，再发送实现请求：

```text
按现有要求，在 week-03 建立独立的 uv Python 3.12 项目，加入 matplotlib 和 pytest。
pyproject.toml、uv.lock、.venv 留在本周目录，不改 W2 根项目；uv init 加 --no-workspace，不另建 Git 仓库。
本周 [tool.pytest.ini_options] 设置 testpaths = ["tests"]。
实现 experiment.py，默认 seed=42，每次实验在循环外初始化一次随机数生成器。
默认运行 1000、10000、100000 次投针，CSV 保存真实参数、交叉数与估计值。
保持教师 tests 和 rebuild.sh 不变，实际运行公开测试；失败时先解释，再修实现。
```

- 本人在 Terminal 运行 `uv run --locked pytest -q`，对照工具记录；不只接受聊天中的“全部通过”。
- 在自己的版本中重新找到相交判据、估计公式与 seed 的位置；实现写法可以不同，依据同一规格判断。

#### 把证据写进报告

> 程序通过测试，与图表、文字使用本次结果，是两项不同的核验。

- 公开测试在临时目录检查 CSV，不保证项目目录中已有结果。先实际运行实验，再打开生成的 CSV：

```bash
uv run --locked python experiment.py
```

- 发送：

```text
读取真实 results.csv，完成 render_results.py，生成 results-table.tex、results-params.tex 和 results.png。
让 report.tex 引入这些结果，保留模板版式，写明实际参数，补一句基于结果的观察。
适配教师 rebuild.sh，不修改它；运行测试并重建报告，给我实际输出文件的位置。
```

- 本人依次运行：

```bash
uv run --locked pytest -q
bash rebuild.sh
```

- 展开三个实际阶段：实验写 CSV → 图表程序读取 CSV → LaTeX 编译 PDF；`rebuild.sh` 不包含测试。
- 从 CSV 选一行，核对 PDF 中的 seed、`N`、`K` 与估计值；检查图和参数也来自同一份结果。
- 估计值不要求等于 π，投针数增加也不保证每次误差都变小。
- 测试全绿但 PDF 仍是旧版，也不能交付；自己打开产物检查，不以 Agent 的“完成了”收口。

### 100-150 | 让 Agent 带路，自己认识工具与代码

> 不再靠增加代码功能充实任务；借助 Agent 认识 VS Code、核验它的能力，并导读现有项目。

#### 让 Agent 介绍自己，展示一项能力

> 能力介绍是一份待验证的说明，实际工具与结果才是证据。

- 已完成者打开自己的 `week-03/`。尚无 Python 实现者打开仓库根目录，用 `demos/week-03-buffon/` 只读导读；测试仍在 `week-03/tests/`，自己的报告可继续完成。
- 新建 Agent 对话，发送：

```text
结合当前工作区和本次会话实际可用的工具，介绍你能怎样帮助我。
区分能直接执行、只能指导我操作、目前不能确认的事情；不要猜测自己拥有的权限。
选一项读取文件的能力实际展示，说明读取了哪里、得到什么。不修改文件，不安装软件。
```

- 展开读取记录，亲自打开同一文件；解释是否有内容依据？有没有把别处的文件当成当前项目？
- 继续问：“如果我要求你点击某个 VS Code 按钮，你能直接完成，还是只能给操作步骤？”；以实际结果区分，不强求它控制界面。
- 直观介绍：Agent 可以帮助理解 Agent；但它的自我介绍也可能不准确，同样需要外部核验。

#### 让 Agent 带路认识 VS Code

> 从“它告诉我在哪里”走到“我自己能找到并检查”；不重新安装工具。

- 发出一条逐步指导请求：

```text
我想用当前项目熟悉 VS Code，请每次只带我做一步，等我确认再继续。
先找到 experiment.py，再搜索 crosses_line，查看它的调用位置，最后打开 Source Control 看改动。
说明这一步用的是 Explorer、编辑器搜索、全项目搜索还是 Git 面板。
由我操作；不要编辑文件、初始化仓库或安装扩展。界面不一致时先问我看到什么。
```

- 教师带全班走一次：
  1. Explorer 或 `Ctrl+P`：找到并打开 `experiment.py`；
  2. `Ctrl+F`：在当前文件搜索 `crosses_line`；
  3. `Ctrl+Shift+F`：在工作区搜索同名函数，看到定义、调用与测试；搜索文本命中不等于语义上的调用，逐处核对；
  4. Source Control：已有跟踪文件的改动就打开 diff，看旧内容与新内容；只有未跟踪的新文件，就查看完整内容；工作区干净就确认没有待提交改动，不为演示再制造修改。
- 若当前环境能使用“转到定义／查找引用”，补充展示；不可用时继续用搜索，不临时增加语言扩展配置。
- 每走到一处，让 Agent 解释当前界面回答了哪个问题；学生自己执行，不把四段操作说明一次读完当作完成。
- 完成后任选一个还不会的操作继续探索：并排查看测试与实现、拆分终端、找到工作区设置、从 Problems 面板定位一条已有报错。先告诉 Agent 目标，再按逐步指导亲自操作；不要求全部完成或安装新工具。

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

- 教师在参考实现中沿 `simulate → crosses_line → estimate_pi → 返回结果` 定位；学生按自己生成的实现核对，不要求文件长得完全一样。
- 在签名看输入，在调用处看传入值，在返回处看输出；用公开测试里的已知输入连接起来。
- 自选一个问题继续追问：
  - `length` 不写时，为什么用 `0.5`？默认参数在哪里？
  - `crossings` 从哪里开始累计，最后传给谁？
  - `seed` 从哪里传入，在哪里真正影响随机数？
  - `import experiment` 为什么不该自动运行完整实验？入口保护在哪里？
- 保存一条“问题 → 对应文件／函数 → 已核验的解释”；不以 Agent 回复篇幅或新增代码量评价完成度。

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

- 对照真实文件，沿一条链定位：
  1. `rebuild.sh` 调用 `experiment.py`；实验把结果写入 `results.csv`；
  2. `render_results.py` 读取 CSV，生成图、表与参数，不重新模拟；
  3. `report.tex` 用 `\input` 引入文字／表格，用 `\includegraphics` 引入图片；
  4. `latexmk` 或 `xelatex` 生成 PDF；脚本没有调用 `pytest`。
- 从 CSV 选同一行，自己找到表格和 PDF 对应数字；用文件证据检查 Agent 的路线，而不是只接受它画的一张关系图。
- 问：“只重新编译 LaTeX，能自动更新模拟结果吗？”；对照脚本与文件回答：编译只能使用当时已有的图表，需要更新整条生成链。

#### 保存成果与本次课回顾

> Agent 可以执行、解释和带路；人仍要找到依据，决定接受什么。

- 完成报告者让 Agent 检查 `week-03/.gitignore`，排除凭据、`.venv`、缓存和 LaTeX 中间文件；保留源码、锁文件与报告材料。
- 本人查看 Source Control 和 `git diff`，确认本周改动后 commit；不因只读探索再制造一批无关改动。
- 需要发布时：已有个人 `origin` 就沿用；尚无个人仓库，建立空仓库，将教师地址保留为 `upstream`，个人地址设为 `origin` 再 push。账号登录本人完成，不重新初始化 W2 历史，不要求 fork 或 PR。
- 回顾三件事：
  - 工具使用：请求、上下文、工具与反馈，各自做了什么；
  - 验收依据：为什么这个输入应该得到这个输出，测试如何拒绝错误；
  - 代码导读：从问题出发，能找到相关位置并核验解释。
- API 接通、代码生成与 PDF 出现，都是过程节点；能说明自己据什么接受结果，才是一次完整的委托。

## 临场取舍

- 已经接通：继续展开真实工具记录，比较上下文来源；不要只等全班配置完成。
- 安装或编译耗时：第三课时继续报告；先看教师的确定性测试与故障演示，不靠安装等待填满教学。
- 实验尚未完成：借助教师公开实现完成只读导读，自己的项目继续推进；不把缺少源码误当成导读失败。
- 提前完成：自选同一项目的一个问题，让 Agent 带路找到依据；例如 seed 的作用、脚本的工作目录、图表数据来源、测试漏掉的性质。只读探索即可，不要求再增加功能。
- 模型未出现：保存配置并重启 VS Code；仍失败时带着实际界面求助。
- 连接报错：保留 Provider、模型名和完整错误，隐藏 Key 后向已有可用的 Agent 或教师求助；没有成功响应就继续处理接入。
- 界面不同：提供实际页面或截图，借助 Agent 和 [VS Code 官方模型说明](https://code.visualstudio.com/docs/agent-customization/language-models)定位，不照着旧按钮名称盲点。
