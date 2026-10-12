# W3 学生行动指南：接通 Agent，用证据理解一次委托

> 先接通自己的 DeepSeek API，再用测试和实际文件核验实验报告，最后让 Agent 带你认识 VS Code 与现有代码。按顺序跟做即可；没完成的报告可以课后继续，不要求不断增加代码功能。

## 本周路线与边界

- 必修工作台：**VS Code + WSL**；
- 主线 Agent：VS Code 自带的 **Chat → Agent**；
- 模型服务：自己的 **DeepSeek API Key**，按量付费；
- 教师展示：不同 Agent 入口与 VS Code 的 Agents Window；学生不增加必修配置。

本周分三步：**接通并观察操作 → 先确定怎样验收 → 借助 Agent 理解工具与代码**。Agent 可以帮你执行，也可以帮你理解；它说“完成了”，还需要实际记录与文件来确认。

这条自带 Key（BYOK）的 Chat/Agent 路线不要求 GitHub 登录或 Copilot 订阅；**不等于 DeepSeek API 免费**。按平台要求准备少量可用余额，费用不报销；有支付或账号困难时向教师求助，不购买额外订阅。

以下配置按本次使用的 VS Code 配置结构更新，尚未在 Windows + WSL 实测；界面或环境有差异时，课堂按实际页面求助处理。软件入口、模型 ID 和价格会变化，以 [VS Code 官方模型说明](https://code.visualstudio.com/docs/agent-customization/language-models)和 [DeepSeek 官方文档](https://api-docs.deepseek.com/)为准。

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
3. 按提示填写分组／显示名称 `ds` 和自己的 API Key；API 类型选择 **Chat Completions**。
4. VS Code 自动打开 `chatLanguageModels.json`。修改刚新增的 `ds` 配置项，使其结构如下；**`apiKey` 必须保留你自己机器生成的 `${input:…}` 引用**，不照抄示例编号。

~~~json
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
~~~

上面的数组展示只有一个配置项时的完整文件结构。已有其他模型配置时，只修改新增的 `ds` 项，不覆盖其他项。示例中的 `${input:chat.lm.secret.3287ba8d}` 是教师机器上的凭据引用，不是通用编号，更不是 API Key；保留你自己的引用，不把明文 Key 写进文件。模型的 `url` 使用完整接口路径，不只填域名。

本次配置的输入、输出上限分别为 `128000`、`16000`；这是告诉 VS Code 按哪些上限组织请求，不会提高模型服务本身的能力。配置中的显示名称是 **DS Flash**，实际请求的模型 ID 是 `deepseek-flash`。

5. 保存文件，回到 Chat，在模型选择器中选 **DS Flash**，模式选 **Agent**。
6. 保持默认的权限批准机制，不开启全部自动批准。模型未出现时，先保存并重启 VS Code；仍不行就带着实际界面向教师或已有可用的 Agent 求助。

### 4. 发出一条真实请求

在新的 Agent 对话中发送：

~~~text
请读取当前工作区的 README.md，告诉我这个项目的目标。
先不要修改文件或运行命令。
~~~

- 确认当前选中的是 **DS Flash**，不是 `Auto` 或其他模型。
- 查看工具记录，确认读取的是工作区中的 `README.md`；若需要批准，检查对象后再批准。
- 对照 README 核对回答。**成功响应证明 API 接通；读取记录帮助确认 Agent 使用了本地工具。** 不要求余额立刻出现肉眼可见的变化。

### 5. 看一条请求怎样变成操作

在刚才的对话中继续发送：

~~~text
为了核对工作位置，请运行 pwd，并对照刚才 README.md 的位置解释结果。
只执行这个只读检查，不修改文件。
~~~

展开实际工具记录，同时在自己的 Terminal 运行 `pwd`，对照 Explorer 中的目录。这里分别发生了四件事：

- 你提出任务，历史对话和已经读取的文件成为输入；
- 模型提出行动，Agent 系统调用读取文件或终端等工具；
- 文件内容、命令输出或报错返回对话；
- 模型根据这些反馈回答，或继续提出下一步。

模型的文字回答不等于工具已经执行。需要批准时，先查看命令、工作目录与作用范围；某些只读操作可能直接执行，不必为了看到批准框反复操作。聊天中的过程说明也不是模型内部推理的完整记录。

### 6. 分清历史记录与当前上下文

在当前对话发送：

~~~text
本次课堂的临时暗号是“W3-Q9L7”。只复述这个暗号，不写入文件。
~~~

1. 在同一对话问“刚才的临时暗号是什么？”。
2. 新建空白对话，发送：

~~~text
上一段对话里的临时暗号是什么？不要搜索文件。
如果当前可见上下文中没有，就说不知道，不要猜。
~~~

3. 查看新对话是否自动附带了文件、摘要或记忆。然后主动粘贴那条包含暗号的原始消息，再问一次。

可以把上下文理解为**本轮提供的会议记录**：有时客户端每轮附上记录，有时服务端按记录编号接续已保存的内容。模型根据本次得到的内容回答，不把这次聊天直接写进参数。本周的 DeepSeek Chat Completions 路线由调用方带入历史。

新建对话不一定清除了软件附带的全部上下文；答对暗号也不能单独证明历史怎样存储。项目文件仍在，不等于当前已读到；重要的要求与结果保存到文件，换对话后明确请 Agent 再读。

### 7. 让 Agent 帮你打开 Git 面板

~~~text
请帮我打开 VS Code 的 Source Control（Git）面板，简单解释它有什么用。
如果你不能直接操作界面，就告诉我怎么打开，让我来做；不要修改文件或初始化仓库。
~~~

看到 Source Control 面板就完成这个小操作，仍使用上周的 Git 仓库，不重新初始化。留意这一步是 Agent 直接执行，还是你按它的指导完成。

两个目标：**让 Agent 帮助建立心智模型，也让 Agent 帮忙实现具体任务。** 完成这个固定操作后，再从其他不懂的按钮、文件或报错开始探索。

遇到报错，提供模型名、实际页面和完整错误，隐藏 Key 后求助。不要靠反复充值解决配置问题。

教师还会展示 **Agents Window**：它按项目与会话组织任务，与编辑器旁的 Chat 侧重点不同。原 Chat 已接通 DeepSeek，不代表这个独立窗口已经配置好同一模型。本周继续使用原工作区的 **Chat → Agent + DS Flash**，不用跟着增加另一套配置。

### macOS 补充

macOS 沿用 W2 的本地工作区，不安装 WSL；从 Terminal 进入目录后 `code .`，不需要左下角出现 `WSL: Ubuntu`。命令面板快捷键改为 `Cmd+Shift+P`，模型配置步骤相同。`code` 不存在时，在命令面板运行 **Shell Command: Install 'code' command in PATH**，再重新打开终端。

---

## 先确定怎样验收，再完成实验报告

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
最后回答：安装的 LaTeX 组件，是全局的，还是这个项目局部的？
~~~

macOS 补充：不安装 WSL，也不运行 apt。先检查已有的 XeLaTeX；没有 TeX 环境时可在自己的 Terminal 使用 `brew install --cask mactex-no-gui`。安装完成后重开终端，再检查版本；若找不到命令，请让 Agent 检查 `/Library/TeX/texbin` 是否在 PATH 中。已有可用环境时不重复安装；已有 XeLaTeX 但没有 latexmk 时，首次编译可运行 `xelatex -interaction=nonstopmode -halt-on-error report.tex` 两遍，后面的重建脚本也支持这条路线。

参考：[LaTeX Workshop 安装说明](https://github.com/James-Yu/LaTeX-Workshop/wiki/Install)、[MacTeX 的 Homebrew 入口](https://formulae.brew.sh/cask/mactex-no-gui)。

### 2. 用 Git 获取教师材料

教师材料在 [ai-agents 的 week-03](https://github.com/wxyinucas/ai-agents/tree/main/week-03)。其中只有实验要求、报告模板、重建脚本和公开测试，**没有完整答案**。

课上使用的[可运行教师演示](https://github.com/wxyinucas/ai-agents/tree/main/demos/week-03-buffon)另放在同一仓库的 `demos/week-03-buffon/`，包含批量模拟、静态图表和报告源码。想在本地复现时，按其中的 README 运行即可；不需要另外 clone，不覆盖自己的 `week-03/`，也不要求完成动画。

在 WSL Terminal 中进入上周已经 clone 的仓库，先核对 remote：

~~~bash
cd ~/course/w02-workbench
git remote -v
~~~

找到指向教师 `wxyinucas/ai-agents` 的名称，再运行对应的一条命令：

- 教师仓库仍叫 `origin`：运行 `git pull --no-rebase origin main`；
- 已把教师仓库改名为 `upstream`、个人仓库叫 `origin`：运行 `git pull --no-rebase upstream main`。

如果名称不同、没有找到教师地址或出现 merge 问题，用本页末尾的备用提示请 Agent 检查。不要为了更新材料覆盖个人 remote、删除自己的修改或重建仓库。

更新成功后，打开本周实验目录：

~~~bash
cd week-03
code .
~~~

目录没有出现时，先让 Agent 检查刚才的更新结果与实际路径。

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

### 4. 在生成实现之前，先找到测试答案的依据

实验场景：在纸面上画一组等距平行线，随机投下一根短针；重复很多次，统计针碰到线的比例，用它估计 π。先认清图中的四个量：

- `L`：针的全长，代码中叫 `length`；`d`：相邻平行线的间距，代码中叫 `spacing`。本实验限定 `0 < L <= d`。
- `angle`：针与平行线的夹角，使用**弧度**；`0` 表示平行，`π/2` 表示垂直。
- `distance`：针的**中心**到最近一条线的垂直距离，不是针尖到线的距离，也不是线距 `d`。

程序不必画出整张纸，每次投针只需要：

1. 独立、均匀地抽取 `distance ∈ [0, d/2]` 和 `angle ∈ [0, π/2]`。位置与方向具有对称性，所以只模拟这一半距离和这一种锐角方向。
2. 比较 `distance` 与 `L/2 × sin(angle)`：后者是半根针垂直于平行线方向的伸出距离；`distance <= L/2 × sin(angle)` 时算相交，包括恰好触线。
3. 重复 `N` 次，累计相交次数 `K`，得到相交比例 `K/N`。

在上述取样条件下，理论相交概率为 `p = 2L/(πd)`。用 `K/N` 估计 `p`，就得到 `π ≈ 2LN/(dK)`；`K=0` 时不能用这个式子估计。本周只使用这个结论，不展开推导。参考：[MIT 的投针实验讲解](https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/resources/buffons-needle-monte-carlo-simulation/)。

现在打开 `EXPERIMENT.txt`，找到“接触到线也记为相交”和估计公式两条规则，再发送：

~~~text
阅读 EXPERIMENT.txt 和 tests，不修改文件。
用简短要点说明需要实现的三个函数，并选一个能手算的测试，解释它的预期值从哪里来。
~~~

自己核对两组已知答案：

- 针长 `0.5`、线距 `1`、夹角 `π/2` 时，半根针沿垂直方向伸出 `0.25`。
  - 中心距 `0.4`：够不到线，应为 `False`；
  - 中心距 `0.1`：越过线，应为 `True`；
  - 中心距 `0.25`：恰好触线，按规格也应为 `True`。
- 100 次投针、32 次触线时，`2 × 0.5 × 100 / (1 × 32) = 3.125`。这里要执行规定的估计公式，不能直接返回 `math.pi`。

打开 `tests/test_experiment.py`，搜索 `test_crossing_known_positions`，对照上方的输入与期望值，以及下面的断言：

~~~python
assert experiment.crosses_line(distance, angle) is expected
~~~

函数返回的是实际结果，`expected` 是提前按规格确定的答案。再搜索 `test_estimator_has_a_hand_calculable_answer`：`pytest.approx(3.125)` 只允许浮点计算的小误差，不是把任意“像 π”的数字都判对。

**测试先行，是先确定验收依据，不是先敲一条测试命令。** `pytest` 执行测试、报告失败，不替我们决定正确答案；测试可以由 Agent 写，答案仍要有独立理由。

课上教师会用另一个故障副本展示：把触线判据的 `<=` 写成 `<`，同一份测试如何拒绝它。**学生先观察，不需要在自己的项目中造错。** 定点测试中的五个针位应有两个失败、三个通过：

- `distance=0.25、angle=π/2`：针尖恰好触线，预期 `True`；错误判据算的是 `0.25 < 0.25`，实际为 `False`。
- `distance=0、angle=0`：针平行且落在线上，同样应为 `True`；错误判据算的是 `0 < 0`，仍为 `False`。

其余三例没有卡在相等边界。失败结果应为 `2 failed, 3 passed, 15 deselected`；`deselected` 是另外十五项本次未运行，不是失败。只将实现中的 `<` 改成 `<=`、保持测试不变，重跑同一组应为 `5 passed, 15 deselected`，再跑整套应为 `20 passed`。这支持接受该处修复，还不能证明整个实验与报告正确。

当前目录还没有 `experiment.py`，此时运行测试可能只得到导入失败，不能把它当作测试抓到了算法错误。

### 5. 委托实现自己的实验

向 Agent 发送：

~~~text
按现有 EXPERIMENT.txt 和 tests，在当前 week-03 目录建立独立的 uv Python 3.12 项目，
加入 matplotlib 和 pytest，并生成 uv.lock。
pyproject.toml、uv.lock 和 .venv 都放在 week-03，不改仓库根目录的 W2 项目。
使用 uv init 时加 --no-workspace，不把 W3 加入父项目，也不另建 Git 仓库。
在本周 pyproject.toml 的 [tool.pytest.ini_options] 中设置 testpaths = ["tests"]，不沿用 W2 测试配置。
实现蒲丰投针，默认 seed=42，比较 1000、10000、100000 次投针。
每次独立实验只初始化一次随机数生成器，不在取样循环中重设 seed。
实现 experiment.py，CSV 保存真实参数、触线数与估计值；不做动画。
保持教师 tests 和 rebuild.sh 不变，实际运行公开测试；失败时先解释，再修实现。
~~~

Agent 请求运行命令或修改文件时，查看它要做什么，再批准。它可以解释不懂的步骤，但不能代替你核对实际结果。

默认种子是 `42`。**随机种子是可复现的起点，不是让结果变好的按钮**；不要在每次落针前重设它。相同环境、参数和种子应能重复运行得到相同结果。

`uv run --locked` 使用已有锁文件；如果提示依赖或锁文件不一致，让 Agent 检查 `pyproject.toml` 和 `uv.lock`，不要直接删除整个环境重来。

### 6. 自己运行公开测试

在项目根目录运行：

~~~bash
uv run --locked pytest -q
~~~

这些测试检查：

- 已知针位是否触线，包括刚好触线的情况；
- 给定投针数和触线数，估计公式是否算对；
- 固定环境、参数与 seed 能否复现；
- CSV 的记录是否和实际模拟、估计公式一致。

还有部分非法输入检查。已知答案用于检查规则，**不是要求随机实验每次都接近 π**；投针数增加也不保证每次误差都变小。

这些公开测试尚未证明取样均匀、彼此独立、seed 没在循环内重设，也没有验收图表和 PDF。测试通过只说明已检查的性质满足要求，后面仍需定位关键代码、打开真实产物。

有失败时，复制实际输出给 Agent：

~~~text
这是公开测试的失败输出：……
先对照 EXPERIMENT.txt 解释测试输入、预期值和实际值，指出实现中对应的判断。
再修复实现并重新运行同一份测试，告诉我修改了哪里。
不要修改教师测试，也不要把结果写死。
~~~

最后由你自己再运行一次。看到实际测试已运行且没有失败项再继续；`collected 0 items` 不算通过，导入失败和依赖报错也不等于验收断言已经执行。

### 7. 带着问题看三处代码

不要求逐行读完整项目。打开自己的 `experiment.py`，每次只追一个问题：

1. **触线为什么应返回 `True`？** 用 `Ctrl+F` 搜索 `def crosses_line`，先看输入，再找对应的相交判据，代入刚才的 `0.25、π/2`；回到测试中的 `True`。
2. **为什么手算输入应得到 `3.125`？** 搜索 `def estimate_pi`，找到返回公式，以及相交数为零时的处理。比较的是规定的计算，不是谁输出得更像 π。
3. **seed 在哪里影响实验？** 搜索 `def simulate`，找到随机数生成器的初始化与取样循环，确认每次调用初始化一次，而不是每次投针都重设。自己的写法可以不同，不要求变量名完全相同。

可以复制下面的请求；把问题占位替换成上面的一条：

~~~text
只读 experiment.py 和相关公开测试，帮我回答：〈写下一个具体问题〉。
先指出对应的文件、函数和代码位置，只解释相关的几行，不逐行翻译整个项目。
说明输入、判断依据和输出之间的关系；等我找到并确认后再继续，不修改代码。
~~~

自己在编辑器找到同一位置，核对 Agent 的解释。**“带着问题看代码”不是先学完全部语法，而是能找到这一次判断的依据。**

### 8. 用同一份结果生成图、表和报告

公开测试会在临时目录检查 CSV，测试通过不保证项目目录中已有结果。先在 `week-03/` 的 Terminal 实际运行实验：

~~~bash
uv run --locked python experiment.py
~~~

打开当前目录的 `results.csv`。每行应包含实际使用的 `seed`、投针数 `n`、触线数 `crossings`、估计值 `pi_estimate`、针长 `needle_length` 和线距 `line_spacing`，默认三组投针数都应出现。

向 Agent 发送：

~~~text
读取实际 results.csv，完成 render_results.py：
生成 results-table.tex、results-params.tex 和一张静态 results.png，
让 report.tex 使用这些结果，写一段简要方法和一句观察，再编译 PDF。
适配教师 rebuild.sh，不修改它；运行测试并重建报告，给我实际输出文件的位置。
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

## 让 Agent 带路，自己认识工具与代码

这一部分不要求再增加代码功能。已经完成报告，就用自己的 `week-03/`；尚无 Python 实现时，打开已有仓库根目录，阅读教师的 `demos/week-03-buffon/`。教师的 Python 源码在演示目录，**公开测试仍在 `week-03/tests/`**；只读导读不需要先配置或运行另一个 Python 环境。

需要切回仓库根目录时，在 WSL Terminal 运行：

~~~bash
cd ~/course/w02-workbench
code .
~~~

下面每条请求都先确认实际文件路径。自己的实现和教师实现可以不同，按读到的文件核对，不要求照抄教师代码。

### 1. 让 Agent 介绍自己，再展示一项能力

新建 Agent 对话，发送：

~~~text
结合当前工作区和本次会话实际可用的工具，介绍你能怎样帮助我。
区分能直接执行、只能指导我操作、目前不能确认的事情；不要猜测自己拥有的权限。
选一项读取文件的能力实际展示，说明读取了哪里、得到什么。不修改文件，不安装软件。
~~~

展开工具记录，自己打开同一文件，核对解释是否有依据。再问：“如果我要求你点击某个 VS Code 按钮，你能直接完成，还是只能给操作步骤？”

不用强求 Agent 能控制所有界面。**“能执行”“能指导”“尚不确定”都可以是准确回答**；能力介绍需要实际操作来确认，不能只看它列了多少项。

### 2. 让 Agent 每次带你做一个 VS Code 操作

使用自己的项目时，发送：

~~~text
我想用当前项目熟悉 VS Code，请每次只带我做一步，等我确认再继续。
先找到 experiment.py，再搜索 crosses_line，查看它的调用位置，最后打开 Source Control 看改动。
说明这一步用的是 Explorer、编辑器搜索、全项目搜索还是 Git 面板。
由我操作；不要编辑文件、初始化仓库或安装扩展。界面不一致时先问我看到什么。
~~~

如果读教师实现，在这条请求开头补一句：“源码在 `demos/week-03-buffon/`，公开测试在 `week-03/tests/`。”

实际走到四处：

1. 在 **Explorer** 中打开 `experiment.py`，或按 `Ctrl+P` 输入文件名；看到文件的实际路径。
2. 按 `Ctrl+F`，在当前文件搜索 `crosses_line`；找到函数定义。
3. 按 `Ctrl+Shift+F`，在整个工作区搜索同名函数；逐处区分定义、调用和测试。文本命中不一定就是调用，不能只按搜索结果数量判断。
4. 打开 **Source Control**，选择一项实际改动：已跟踪文件可以看 diff；未跟踪的新文件先看完整内容；工作区干净就确认没有待提交改动，不为演示再造一次修改。

每一步让 Agent 解释“这个界面帮我回答了哪个问题”，然后自己操作确认。当前环境支持“转到定义／查找引用”时也可以试；暂不可用就继续用搜索，不为这一项临时安装新扩展。

macOS 使用 `Cmd+P`、`Cmd+F` 和 `Cmd+Shift+F`。Explorer、Source Control 等面板职责相同。

### 3. 导读一次 simulate 调用

发送下面的请求，按自己的实际目录选择文件：

~~~text
只读当前项目的 experiment.py 和公开 tests；先确认文件路径。
若我使用教师演示，源码在 demos/week-03-buffon/，测试在 week-03/tests/。
带我追踪一次 simulate 调用：
输入怎样进入，在哪里取样，怎样判断相交并累计，最后怎样得到估计值。
先给不超过五步的调用路线，再逐步指出文件、函数和代码位置；每步等我确认后继续。
不要改代码，无法从文件确定的事情请明确说不知道。
~~~

在文件中核对 `simulate → crosses_line → estimate_pi → 返回结果`：签名里看输入，调用处看传入的值，返回处看输出。回到前面已知答案的测试，看它怎样使用这些函数。

不要一次要求 Agent 解释整份源码。先确认一条路线，再选择一个问题继续追：

- 没写 `length` 时，为什么用 `0.5`？默认参数在哪里？
- `crossings` 从哪里开始累计，最后传给谁？
- `seed` 从哪里传入，在哪里真正影响随机数？
- `import experiment` 为什么不应该自动运行完整实验？实际入口保护在哪里？

核对的是你打开的实现，不是要求它必须长得和教师版本一样。

### 4. 从重建命令追到 PDF

发送：

~~~text
只读当前项目的 rebuild.sh、experiment.py、render_results.py 和 report.tex；先确认文件路径。
若我使用教师演示，这四个文件都在 demos/week-03-buffon/。
以 bash rebuild.sh 为起点，说明程序怎样依次生成 CSV、参数、表格、图片和 PDF。
每一步指出谁读什么、写什么，以及对应代码位置。
检查脚本是否运行测试；若没有，指出应单独执行的命令。
不要修改文件，不代我运行；先给简短路线，我选一步后再展开。
~~~

对照实际文件，找到四个环节：

1. `rebuild.sh` 调用 `experiment.py`，实验写出 `results.csv`；
2. `render_results.py` 读取 CSV，生成参数、表格和图片，不重新模拟；
3. `report.tex` 用 `\input` 引入文字／表格，用 `\includegraphics` 引入图片；
4. LaTeX 编译器生成 PDF；脚本没有执行 `pytest`，测试仍需单独运行。

已经有报告时，从 CSV 选一行，自己在图表和 PDF 中找到对应数据。仅重新编译 LaTeX，不会自动重新投针；要更新结果，需要更新整条生成链。

最后用自己的话记下一条：**问题 → 对应文件／函数 → 已核验的解释**。可以保存在自己的笔记中，不要求上传；Agent 回答得长、代码生成得多，都不能代替这一步。

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

若现有 `.gitignore` 还列着 `results.csv`、`results-table.tex`、`results-params.tex`、`results.png`，先移除这些结果文件的忽略条目，才能把本次结果保存进 Git。想一并保存 PDF 时，也移除 `report.pdf` 条目；凭据、环境、缓存和编译中间文件仍排除。

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

在 Source Control 逐个核对文件，只暂存决定保存的内容：已跟踪文件看 diff，新文件看完整内容，图片与 PDF 亲自打开。若已有暂存文件，也一并核对；然后执行：

~~~bash
git diff --cached --stat
git diff --cached
git commit -m "Complete W3 Buffon report"
~~~

`git diff --cached` 展示准备进入这次 commit 的修改。源码、锁文件、图表和报告材料应有解释；不应出现 API Key、虚拟环境或大量中间文件。`report.pdf` 可以一并保存，方便别人查看。

### 2. 上传到自己的 GitHub 仓库

上传的是你已经维护的同一个 Git 仓库，里面包含 W2 和 W3；不另建本地仓库，不要求 fork 或向教师提交 PR。

1. 先用 `git remote -v` 检查：已经有自己的 GitHub `origin`，就沿用，不再新建。还没有时，在 GitHub 新建自己的空仓库，例如 `ai-agents-lab`；不要勾选初始化 README、`.gitignore` 或许可证，这些内容沿用本地已有文件。
2. 复制自己仓库的 HTTPS 地址，把下面的占位地址替换掉，再发给 Agent：

~~~text
请把当前仓库发布到我的 GitHub 仓库：<粘贴自己的仓库 URL>。
沿用已有 Git 历史，保留 W2 和 W3，不重新初始化、不复制项目。
检查现有 remote，已有正确的个人 origin 就沿用，不盲目覆盖。
尚未配置时，把教师 wxyinucas/ai-agents 保留为 upstream，把我的仓库配置为 origin。
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

## 选做：围绕同一个项目继续探索

任选一个自己真正不懂的问题，让 Agent 带路，自己找到依据。四项没有固定顺序，不要求全部完成，也不要求新增代码或留下新 commit；只读探索没有文件变化是正常的。

### A. 学会一个还不熟悉的 VS Code 操作

从“并排打开测试与实现”“拆分终端”“找到工作区设置”“从 Problems 面板定位已有报错”中选一个目标。发给 Agent：

~~~text
我想在当前 VS Code 中完成：〈填一个操作目标〉。
每次只教我一步，等我实际完成再继续；告诉我这个操作解决什么问题。
不要编辑文件或安装扩展，界面不一致时先问我看到什么。
~~~

**确认完成：** 你能自己走到目标界面，并说清它帮助解决什么问题。没有现成报错时，不为练习 Problems 制造错误；换另一个目标即可。

### B. 看清一个测试到底检查了什么

打开自己的 `tests/test_experiment.py`，选一个测试名称，发给 Agent。若使用教师演示，公开测试在仓库根目录下的 `week-03/tests/test_experiment.py`：

~~~text
只读公开 tests 和相关实现，解释〈填测试名称〉。
指出输入、预期答案的依据、实际调用，以及断言比较了什么。
再说明它尚不能证明的一项性质。逐处给出文件位置，不修改或新增测试。
~~~

**确认完成：** 自己找到断言，解释它比较的对象，并指出一项覆盖之外的性质。复现一致不等于取样分布正确；CSV 与实现一致，也不等于独立证明整个实现正确。

### C. 追清一个入口或文件位置问题

任选一个问题：“导入与直接运行有什么不同？”“结果为什么写到这个目录？”“只编译 LaTeX，哪些结果不会更新？”。

~~~text
只读当前项目，帮我回答：〈填一个入口或文件位置问题〉。
先找到决定这一行为的脚本或源码，只解释相关位置。
给出文件依据和一条简短结论；不要运行程序或修改文件，我确认后再追下一步。
~~~

**确认完成：** 能指出对应代码或脚本中的实际位置，而不是只记住一句泛泛解释。当前未生成源码时，可以阅读教师的 `demos/week-03-buffon/`，说明自己看的是什么目录。

### D. 可选：用另一种 Agent 核验同一份材料

不要求购买新订阅。已经有其他可用 Agent 就沿用；想尝试 Cline 时：

1. 在 Extensions 搜索 [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)，安装后打开其侧栏。
2. 选择 **Bring my own API key → DeepSeek**，把 Key 填入专用凭据字段；从实际列表选择模型，不把 Key 发到对话或写入项目。
3. 使用 **Act**，保持 **Auto Approve** 关闭。遇到不同界面或配置卡住时向 Agent／教师求助，继续用已经接通的原生 Agent 即可。

参考：[Cline 的 DeepSeek 配置说明](https://docs.cline.bot/provider-config/deepseek)。这同样调用模型 API，仍可能产生用量费用；不是免费的模型替代品。

向原生 Agent 和另一种 Agent 发送同一条只读请求：

~~~text
请只读当前实验的要求、实现和公开测试；先确认实际目录。
若使用教师演示，要求与测试在 week-03，实现在 demos/week-03-buffon。
选一个可以手算的测试，说明预期值的依据，并指出实现中对应的判断。
给出具体文件和代码位置，不修改文件、不运行实验、不提交或上传。
~~~

**确认完成：** 两种 Agent 读的是同一版文件；你能在编辑器找到至少一个结论的依据。模型或附带上下文不同就如实注明，不把所有差异归因于 Agent 名称；只读核验不应增加代码功能。

## 遇到问题怎么求助

先告诉 Agent 或教师：**你在哪个目录、刚做了什么、实际出现了什么**。命令和完整报错通常比“它不行了”更有用；截图与文字先遮住 Key。

~~~text
我在 ~/course/w02-workbench/week-03，当前做到：……
我运行的命令或点击的入口是：……
实际输出或截图是：……
请先定位问题，说明下一步该做什么，再帮我修复。
~~~

本周按“接通 API → 先确定验收依据 → 委托实现并测试 → 核验报告 → 工具与代码导读 → 保存版本”推进。任何一步卡住，都从这一步求助，不必把前面的步骤全部重做。尚未完成自己的实现，可以先只读教师演示完成导读，再继续自己的报告。

### 备用提示：pull 或 merge 遇到问题

你已经有自己的 W2 commit，更新教师材料时可能需要合并。出现报错、停在陌生界面或不知道下一步时，把完整输出一起发给 Agent：

~~~text
我已有 W2 的本地 commit，想更新教师 wxyinucas/ai-agents 的材料，并继续完成 W3。
本地仓库是 ~/course/w02-workbench；刚才执行的命令和完整输出是：……
请检查 Git 状态与 remote，解释问题，再帮我完成 pull 或需要的 merge，保留我的提交和文件。
教师 remote 可能还是 origin，也可能已改为 upstream，请按实际状态处理。
需要我作决定时先问我，不要删除改动、重写历史或替我 push。
~~~
