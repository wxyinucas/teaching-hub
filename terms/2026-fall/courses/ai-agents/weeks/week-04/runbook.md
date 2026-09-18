# W4｜源码怎样变成一次运行？

> AI Agents · W4 · 3 × 50 min · 约 30 名学生，按零编程基础设计 · 无助教

## 本次课

- 根问题：同样是写下一段源码，Python／R 与 Rust／C 怎样把它变成一次运行？回到 `market-check` 后，我们怎样看见程序走到了哪里？
- 最低出口：学生能区分源码、语言运行工具、编译后的本机可执行文件和正在运行的进程；沿 W3 命令找到入口，说明参数、`stdout`、`stderr` 与退出状态各留下什么证据，并用两处追踪输出缩小故障范围。
- 硬收口：三课时合起来是备课单位。第一课时的 50 分钟是软检查点，编译产物演示可借第二课时前 10 分钟；第二课时第 35 分钟停止让 Agent 改代码，第三课时第 40 分钟停止排障，最后留下真实判断。学生设备受阻时使用教师准备的输出，不冒充本人运行。

## 第一课时 · 讲：同一个结果，四种语言怎样运行

### 0-8 | 从上周的命令提出新问题

> 源码是文件；每执行一次命令，才发生一次具体的运行。

#### 课前提醒

- [ ] 在教师 Mac 上跑通 W3 教师参考版的正常与缺文件输入；W3 参考实现须已按第三课时约定揭示，不能提前推送到公开主分支。
- [ ] 课前运行 `week-04/demo/` 中的极小程序与 Cargo 版本；核对 Mac 上 `python3`、`Rscript`、`rustc`、`cargo`、`cc`、`file`、`vim`、`xxd`、`objdump` 均可用。保存运行结果和二进制查看画面，现场任何一步失败就切到这些真实记录。
- [ ] 准备 W3 教师参考版的**独立追踪副本**：在副本 `cli.py` 导入 `sys`，在 `_check_file` 开头与 `pd.read_csv()` 成功后各加一条 `print(..., file=sys.stderr)`；跑通正常、缺文件、缺少 `close` 列三种输入并保存输出。第二、三课时不用首次现场制作副本。
- [ ] 保存 W3 `pyproject.toml` 的 `[project.scripts]` 与 `cli.py` 的入口画面；教师投影上不出现个人账号、密钥或学生目录。
- [ ] 课前打开两个固定的 Bash 终端标签：一个位于 `ai-agents-project` 根目录，另一个位于 `teaching-hub` 根目录；课堂不靠临时猜当前目录切换项目。Mac 与学生 WSL 都用 Bash，但编译出的可执行文件仍按各自操作系统采用不同格式。

- 展示：从 W3 教师参考版运行熟悉的命令，不先打开源码。

```bash
cd course/references/week-03
uv run --locked market-check ../../week-03/data/sample_prices.csv
echo "EXIT=$?"
```

- 展示：同一份源码在磁盘上不动，命令执行后屏幕出现 `rows=4`、`DATA_CHECK=PASS` 和退出状态 0。
- 问：如果再次运行并换一份输入，得到不同结果，是源码文件变了，还是发生了另一次运行？先让学生写下猜测；此时只区分“存着的程序”和“一次运行”，不讲操作系统进程细节。

### 8-18 | 沿 `market-check` 找到 Python 的入口

> VS Code 是工作界面，Agent 可以代按回车；真正执行时仍要经过 Bash、uv 和 Python。

- 指向 W3 命令的四段：Bash 接收命令；uv 选用本项目锁定的 Python 环境；`pyproject.toml` 把 `market-check` 指向 Python 入口；入口取得路径，程序读文件并输出。
- 展示教师版本的确切映射：

```toml
[project.scripts]
market-check = "quant_lab.cli:main"
```

- 在 `src/quant_lab/cli.py` 只定位 `main`；让学生看见 W3 的 Python 源码不是一个叫 `market-check` 的文件。学生的 Agent 可能生成不同路径，个人入口要从自己的 `pyproject.toml` 找。
- 从教师版本运行以下命令，屏幕上指出项目的 Python 路径；W2 已讲过局部环境，这里只核对“用的是哪一个 Python”，不重讲 uv 安装。

```bash
uv run --locked python -c 'import sys; print(sys.executable)'
```

- 收束：`python3 某文件.py` 是把源码交给已有的 Python 运行工具；`uv run --locked market-check ...` 还多了项目环境和命令入口的映射。下一段对照 Rust／C 是否也这样运行。

### 18-32 | 四种语言，完成同一件极小的事

> 四份源码都打印 `[trace] rows=4`；Python／R 交给已有的语言运行工具，Rust／C 在这里先生成新的本机可执行文件。

- 打开 `week-04/demo/rows.py`、`rows.R`、`rows.rs`、`rows.c`；四份只看“已有值是 4、如何放进输出”。Python 的 `f"...{rows}..."`、C 的 `%d`、R 的 `sprintf`、Rust 的 `println!` 是不同的写法，不要求学生记住四套语法。
- 先让学生预测：下列哪些命令会在 `demo_out` 中产生一个名为 `rows-*` 的新可执行文件？然后切到已经打开的 `teaching-hub` 根终端运行：

```bash
cd terms/2026-fall/courses/ai-agents/weeks/week-04/demo
demo_out="$(mktemp -d)"
python3 rows.py
Rscript rows.R
rustc rows.rs -o "$demo_out/rows-rust"
"$demo_out/rows-rust"
cc rows.c -o "$demo_out/rows-c"
"$demo_out/rows-c"
CARGO_TARGET_DIR="$demo_out/cargo-target" cargo run --locked --offline --manifest-path rows-cargo/Cargo.toml
```

- 对照答案：四种语言的输出相同，路径却不同。Python／R 的源码交给已安装的运行工具；`rustc`、`cc` 先把本课的源码变成本机可执行文件，再由 Bash 执行 `./...`。Python／R 内部也会解析或形成内部代码，不能说“完全没有编译”；这里的区别是它们没有先为这个例子生成可直接启动的独立本机程序。
- 指认 Cargo 的 `Compiling`、`Running` 和 `cargo-target/debug/rows-cargo`；`cargo run` 把“需要时构建，然后运行生成的程序”包起来，已有产物且源码未变时未必重编。它与 `python3 rows.py` 不是只换了一个命令名。

### 32-42 | 亲眼看一次编译产物

> 编译后得到的是本机可执行文件，不是把源码换个后缀的普通文本。

- 在刚才同一个终端会话中，先用 `file` 看类型，再用只读 Vim 打开较小的 C 产物，输入 `:q!` 退出；最后用 `xxd` 看开头 64 字节。**不要 `cat` 整个二进制文件。**

```bash
file "$demo_out/rows-rust" "$demo_out/rows-c"
file "$demo_out/cargo-target/debug/rows-cargo"
vim -R -n -b "$demo_out/rows-c"
xxd -l 64 "$demo_out/rows-c"
```

- Mac 上 `file` 会报告 Mach-O；若以后在 WSL Linux 上重编，通常是 ELF。这里看到的是最终可执行文件，不是中间的 `.o` 文件；本周只看这个最终产物。它面向对应系统，不是跨系统通用的文本脚本。
- 若学生追问 `objdump`，只展示已经试跑的开头几行；它显示的是反汇编，不是更清晰的 C 源码，本周不读机器指令。Mac 的 `otool` 和 WSL 的 `readelf` 也不是跨平台同一命令。

```bash
objdump -d "$demo_out/rows-c" | sed -n '1,18p'
```

- 再运行一次 `"$demo_out/rows-c"`：**能用文本编辑器打开一个文件，不等于这个文件是供人阅读的源码；Bash 实际启动的是编译后的程序。**

### 42-50 | 把可见结果和内部追踪分开

> `stdout` 给调用者结果，`stderr` 留诊断线索，退出状态说明这次运行如何结束。

- 打开 `demo/channels.py`：第一处 `print` 表示“走到这里”，第二处用 f-string 显示此时 `rows` 的值；不系统讲变量，只让学生读出两次追踪先后。
- 从刚才的 `demo/` 目录在同一个终端会话中运行；先看混在屏幕上的效果，再让 Bash 把两个输出通道分别写进两个文本文件：

```bash
python3 channels.py
python3 channels.py > "$demo_out/result.txt" 2> "$demo_out/trace.txt"
echo "EXIT=$?"
cat "$demo_out/result.txt"
cat "$demo_out/trace.txt"
```

- 指认：`rows=4` 是结果；两条 `[trace]` 是到达位置和当时值的线索；`EXIT=0` 是结束状态。`stdin` 是另一条输入通道，本周只点名，留待以后补充。四语言小程序的 `[trace]` 只是格式化输出示意，真正给 `market-check` 加追踪时写入 `stderr`。
- 让学生用一句话复述：`python3 rows.py` 与 `cargo run` 的工作流程哪里不同？若本段借用第二课时前 10 分钟，下一课时直接跳过重复回顾，不削掉个人实践。

## 第二课时 · 做：让自己的程序留下两处足迹

### 0-10 | 从演示回到自己的 W3 程序

> 只在自己的持续 `system/` 中工作；没有个人可运行版本者使用教师基线，并如实标明来源。

#### 课前提醒

- [ ] 在至少一份 W3 学生式实现和教师参考实现上试跑“找到入口 → 加追踪 → 正常／失败输入 → W3 公开测试”；确认教师自己的版本能从头到尾完成。
- [ ] 准备不含账号、密钥和学生信息的教师追踪结果，供 W3 环境仍受阻者跟随判读；不现场为 30 人逐台重装环境。

- 若第一课时的二进制查看超时，本段先完成 `channels.py` 的 `stdout / stderr` 分离，再直接转入下一段；不重讲 W3 环境。
- 若讲解准时结束，展示：`ACCEPT` 者继续用自己的版本；采用教师基线者保留原尝试和原判断，记录采用来源。学生进入本人 `students/sXX/system/`，用上周正常输入重跑一次。
- 若基线尚未无损接入个人 `system/`，先跟随教师画面，不现场覆盖旧文件；第 10 分钟停止个人环境排障。

### 10-20 | 从个人项目声明定位入口

> 每个人的实现路径可以不同，但必须能说出命令最后指向哪里。

- 让学生从本人 `system/` 运行以下命令，确认 Python 确实存在于本项目的局部环境；VS Code 只是承载终端与文件，不是这门语言本身。

```bash
uv run --locked python -c 'import sys; print(sys.executable)'
```

- 让学生打开本人的 `pyproject.toml`，找到 `[project.scripts]` 中 `market-check` 的右侧；据此打开源码，不照抄教师的 `quant_lab.cli:main` 路径。
- 问：命令进来后，哪一处能观察“拿到了文件路径”？哪一处能观察“数据已经读入”？学生先标两处，不改代码。
- 受阻者在教师参考版本上完成同一张“两处位置”标注，并写明不是自己的实现。

### 20-35 | 请 Agent 增加可开关的追踪

> 追踪只在明确打开时出现；不改变上周命令的默认结果。

- 展示并让学生向 Agent 发出同一份范围明确的请求；将 `s07` 换成自己的代号，先核对 Agent 将要修改的路径。

```text
请只修改 students/s07/system/ 内的现有 market-check 程序，不改教师区、公共区、报告或其他人的目录，也不要提交 Git。

增加一个可选的 --trace 开关，用法为 market-check <CSV> --trace。不带它时，W3 的命令、stdout、退出码和失败行为保持不变，也不出现追踪信息；带上它时，用 print 和 f-string 向 stderr 输出两处简短追踪：进入处理时的输入路径，以及成功读入数据后的行数。不要打印 CSV 正文、环境变量或凭证。完成后停下，列出实际改动，并告诉我从我的 system 目录运行的验证命令；不要替我作出接受决定。
```

- 让学生逐次核对权限提示；第 35 分钟停止新增功能、改格式或追求更完整的日志。Agent 未就绪者跟随教师代码和输出，保持真实状态。

### 35-43 | 正常、失败、旧合同各验证一次

> 新追踪可观察，旧行为仍成立，才算有一份可审查的候选改动。

- 从本人 `system/` 执行，`s07` 只是示例代号：

```bash
uv run --locked market-check ../../../course/week-03/data/sample_prices.csv --trace
uv run --locked market-check ../../../course/week-03/data/missing.csv --trace
echo "MISSING_EXIT=$?"
uv run --locked pytest -q ../../../course/week-03/tests
```

- 看三个事实：正常时两条追踪与原结果并存；缺文件时只抵达预期位置并明确失败；W3 的 5 个测试仍通过。最后检查 `git diff`，确认只改本人 `system/`，且没有完整数据或敏感信息进入追踪。
- 若结果不符，只留下真实命令、输出、退出状态和 diff；不靠反复让 Agent“修到绿”越过第 43 分钟。

### 43-50 | 保存候选状态，不急着发布

> 第二课时只保存可诊断的现场；第三课时再解释它、决定保留或修复。

- 每人写下：自己的入口路径；正常运行出现的追踪；缺文件运行最后出现的追踪；W3 测试结果；一处自己看过的 diff。
- 写明状态：`READY-TRACE / HOLD-TRACE / FOLLOWED-TEACHER`。跟随教师画面者不能记作本人运行成功。
- 不在最后 10 分钟临时扩大需求，也不把“Agent 说完成了”当作结论。

## 第三课时 · 诊断：用足迹缩小问题范围

### 0-8 | 预测一份新的失败输入

> 文件可以成功读入，却仍不满足程序合同；追踪位置与行为判断要分开。

#### 课前提醒

- [ ] 在教师追踪副本上运行 `course/week-03/tests/fixtures/missing_close.csv`，保存真实输出；另备一个**独立故障副本**，只把 `symbols` 的输出故意固定为 `AAPL`，运行第二份正常 fixture 与相应公开测试，保存实际失败断言。两个副本都不覆盖 W3 参考实现。
- 展示：新的 `missing_close.csv`，先不运行。让学生写下两条 `[trace]` 会出现几条，以及 `DATA_CHECK` 应是什么；然后展示教师真实结果。
- `FOLLOWED-TEACHER` 者继续使用教师记录；`READY-TRACE` 与 `HOLD-TRACE` 者沿用自己的版本，不重新初始化仓库。

### 8-22 | 三份证据：追踪、结果和测试可能不同步

> 同一份画面要分别判断“运行到哪里、程序宣称什么、外部测试证明什么”。

- 出示三份已准备好的画面：
  1. 正常输入，不带 `--trace`：零条追踪，`DATA_CHECK=PASS`；
  2. 缺少 `close` 列，带 `--trace`：两条追踪，`DATA_CHECK=FAIL`；
  3. 故障副本读取第二份正常 fixture，带 `--trace`：两条追踪，自报 `DATA_CHECK=PASS`，但公开测试指出 `symbols` 不对。
- 让学生各填三栏：**最后确认到哪一层／程序自报什么／下一步信哪条外部证据**。第 18 分钟投影标准判读；有人愿意回应就听一例，不把自愿发言当作推进条件。
- 教师收口：第 1 份没有追踪是因为没打开，不是故障；第 2 份说明读入成功但数据不合合同；第 3 份说明能运行且自报成功，也不等于实现正确。

### 22-35 | 在个人版本上验证“读入后仍失败”

> 先说预期，再运行一次；结果不符就改判断，不改写事实。

- 让学生先预测本人程序处理 `missing_close.csv --trace` 时的两条追踪、`DATA_CHECK` 和退出状态，再从 `system/` 运行：

```bash
uv run --locked market-check ../../../course/week-03/tests/fixtures/missing_close.csv --trace
echo "MISSING_COLUMN_EXIT=$?"
```

- 对照真实结果：若个人实现的追踪位置与教师版本不同，先回到个人插入点解释，不把教师画面当作自己程序的必然输出。`FOLLOWED-TEACHER` 者使用教师已保存的输出判读，注明来源。
- 选择一份预测不符的匿名例子，按“原预测 → 实际证据 → 修正判断”展示；没有学生愿意展示就用教师预备的差异例子，不现场逐台修复。

### 35-42 | 给三种证据各安排一个问题

> 命令、追踪和测试各回答不同问题，不能用一个绿色字样代替所有判断。

- 问并回答：命令与退出码说明是否成功结束；追踪说明到过哪些内部位置；公开测试检查外部行为是否满足合同。第 3 份故障副本在前两项看似顺利，仍被第二份正常 fixture 的测试抓住。
- 预告 W5：今天只观察“值是什么”；下周研究“值为什么变成这样”。正式日志、调试器与测试比较留到 W8。

### 42-50 | 保存本周真实出口

> 能画出执行链、解释一次追踪和一个证据边界，就能带着问题进入 W5。

- 每人留下四行：`命令 → 项目入口`；一次正常或失败输入的预期；实际最后一条追踪及退出状态；这份证据仍不能证明什么。
- `READY-TRACE` 者检查 `--trace` 关闭时 W3 行为不变；`HOLD-TRACE` 者记录最小问题；`FOLLOWED-TEACHER` 者标注使用教师证据。第 40 分钟以后不再为补齐状态重开排障。
- 收尾只问：下次如果结果不符，你先从哪一层找证据？

## 临场取舍

- 慢了 · 删什么：第一课时先删 `objdump` 和 C 产物的细看，R 只展示源码；保住 Python 与 Rust 的不同运行路径、`file`／只读 Vim／`xxd` 三种观察、以及 `stdout / stderr`。讲解最多借第二课时前 10 分钟，仍要给学生留下个人操作时间；第三课时可只处理两份新证据。不能删“先预测 → 真实运行／观察 → 解释”。
- 快了 · 做什么：教师展示预先试跑的 `objdump -d` 开头几行，或让学生把第二份正常 fixture 也跑一遍；不在课堂临时安装语言、解释机器指令或引入未来量化功能。
- 坏了 · 怎么退：教师 Mac 的 R、Rust、C 工具或现场运行失败，改用课前保存的真实源码、命令、产物类型和输出；只保留已经可靠的 Python 演示。学生环境、Agent 或 W3 基线未就绪，使用教师版本做位置标注和诊断并注明来源。既不把教师证据写成本人运行，也不现场全班重装工具。
