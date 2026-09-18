# W4 学生行动指南：看见程序怎样运行

本周先比较同一件小事在不同语言中的运行路径，再让你自己的 `market-check` 留下两处可开关的追踪。你不需要手写 Rust 或 C，也不需要为了本周安装 R、Rust 或 C；它们由教师演示，用来对照概念。后续持续维护的仍是你唯一的 Python 项目。

正式项目仓库：<https://github.com/wxyinucas/ai-agents-project>。本周只用本地教学 CSV，不连接行情或账户，不读取凭证，不发起交易，也不配置 CI。

## 课前：确认 Python 项目和任务已经到手

W3 已经在自己的 fork 中完成、提交并 push，且本地没有未保存修改时，先在 GitHub 的个人 fork 页面使用 **Sync fork → Update branch**，再从 WSL Bash 更新本地项目：

```bash
cd ~/course/ai-agents-project
git status --short --branch
git remote -v
git pull --ff-only origin main
ls course/week-04
```

确认 `origin` 是自己的 fork，`course/week-04/` 中已有本周任务书和测试。如果本地有未提交的 W3 改动、同步产生冲突，或 `pull --ff-only` 失败，先停下保存状态，不要强制 push、删除目录或覆盖文件；带着完整信息请 Agent 协助判断。

从自己的 `system/` 确认项目使用的 Python：

```bash
cd students/s07/system
uv run --locked python --version
uv run --locked python -c 'rows=4; print(f"[trace] rows={rows}")'
```

把 `s07` 换成自己的公开代号。能看到 Python 版本与 `[trace] rows=4`，就已经有本周所需的 Python 环境；不必另装一个全局 Python。若 W3 项目还不能运行，保留原尝试与错误，不把教师画面记成本人的运行结果。教师的 W3 标准版按 W3 约定，在第三课时展示和判断结束后才发布；需要恢复时先保留个人版本，再在本人 `system/` 中采用，不直接覆盖旧文件。

## 第一课时：看同一个结果的不同来路

教师会展示 Python、R、Rust、C 四份极小程序。请只抓住两组区别：

- 源码文件保存在磁盘上；一次命令会发起一次新的运行。
- `python3 rows.py` 把源码交给 Python；`rustc` 或 `cc` 在本例中先生成本机可执行文件，再运行它。`cargo run` 把“需要时构建、然后运行”合在一个命令里。

教师还会用 `file`、只读 Vim、`xxd` 查看编译产物，并用一段 Python 程序把普通结果写到 `stdout`，把追踪写到 `stderr`。这里不用背四门语言的语法、二进制字节或机器指令。下课后若想重看演示源码，可在[教学网站仓库的 W4 demo](https://github.com/wxyinucas/teaching-hub/tree/main/terms/2026-fall/courses/ai-agents/weeks/week-04/demo)中查看。

## 第二课时：只在自己的持续项目里加追踪

从仓库根目录初始化本周报告；脚本不会覆盖你的 `system/`：

```bash
cd ~/course/ai-agents-project
bash course/week-04/init-week.sh s07
cd students/s07/system
```

如果报告目录已存在，不要删除后重来；打开已有的 `students/s07/weeks/week-04/report.md` 即可。尚无可运行的 W3 `system/` 时，先保留旧尝试，再按课堂公布的教师基线无损接续；不要直接复制文件覆盖个人目录。

先读 `course/week-04/PROJECT_BRIEF.txt`。再打开本人 `pyproject.toml` 的 `[project.scripts]`，沿 `market-check` 找到自己程序的入口。标出“开始处理输入路径”和“CSV 已成功读入”两处位置。每个人的文件名、模块和函数可以不同，不必照抄教师的实现。

如需让 Agent 修改，可复制下面的请求；先替换 `s07`，再核对它要修改的实际路径：

```text
请只修改我的 students/s07/system/ 中已有的 market-check 程序，不改教师区、公共区、报告、根文件或其他学生目录，也不要提交 Git。

增加一个可选的 --trace 开关：不带它时，W3 命令的 stdout、stderr、退出状态和成功／失败行为都保持不变；带上它时，用 print 和 f-string 向 stderr 输出两处简短追踪——开始处理输入路径时，以及成功读入 CSV 后（包含行数）。不要打印 CSV 正文、环境变量或凭证。

完成后停下，列出真实改动，给出从我自己的 system/ 中运行的验证命令，等我审查。
```

本周改动只落在本人 `system/`；`students/s07/weeks/week-04/report.md` 由你本人填写。Agent 申请越界、联网、读取凭证或替你提交时，不授权。

## 自己核对三种输入和旧合同

以下命令从本人 `students/s07/system/` 运行；先预测每次会有几条追踪，再看实际输出：

```bash
uv run --locked market-check ../../../course/week-03/data/sample_prices.csv
uv run --locked market-check ../../../course/week-03/data/sample_prices.csv --trace
uv run --locked market-check ../../../course/week-03/data/missing.csv --trace
echo "MISSING_EXIT=$?"
uv run --locked market-check ../../../course/week-03/tests/fixtures/missing_close.csv --trace
echo "MISSING_COLUMN_EXIT=$?"
uv run --locked pytest -q ../../../course/week-03/tests ../../../course/week-04/tests
```

最低预期：未打开 `--trace` 时没有新追踪，W3 可见结果不变；正常输入有两条追踪并仍通过；不存在的文件只有第一条追踪并失败；缺少 `close` 列的文件有两条追踪但仍失败。**追踪表示程序到过某处，不表示数据或结果正确。** `echo` 要紧跟对应的失败命令，才能读到那次运行的退出状态。

需要分别看两个输出通道时，可把一次正常运行的输出写到系统临时目录，不在个人项目里留下待提交的诊断文件：

```bash
check_dir="$(mktemp -d)"
uv run --locked market-check ../../../course/week-03/data/sample_prices.csv --trace > "$check_dir/result.txt" 2> "$check_dir/trace.txt"
echo "EXIT=$?"
cat "$check_dir/result.txt"
cat "$check_dir/trace.txt"
```

公开测试只是检查合同的一部分；还要检查 `git status --short` 和实际 diff。确认没有改教师区、公共区或其他学生目录，没有把完整 CSV、密钥、`.venv` 或临时输出加入提交。

## 第三课时：用证据修正自己的判断

先对 `missing_close.csv --trace` 写下预测，再运行并比较。若个人程序的追踪位置与教师演示不同，先解释自己的插入点；不要把教师输出当成本人必然的结果。

把四件事写进 `students/s07/weeks/week-04/report.md`：命令怎样到达项目入口；一次输入的事前预测；真实追踪、结果与退出状态；这些证据还不能证明什么。状态按实际填写：可以接受当前候选版本、需要暂缓，或本周只能跟随教师证据。跟随教师的部分必须标明来源。

只有在本人检查过路径、diff、W3 和 W4 测试，且决定接受时，才从仓库根目录精确暂存个人系统与本人报告，然后检查 staged diff、提交并 push 自己的 `origin/main`：

```bash
cd ~/course/ai-agents-project
git add -- students/s07/system students/s07/weeks/week-04/report.md
git diff --cached --name-only
git diff --cached
git commit -m "Add optional W4 trace output"
git push origin main
```

`s07` 只是示例。若仍有越界、失败或无法解释的改动，就先保留现场和下一步，不用一个“绿色”结果掩盖它；本周不提交 upstream PR。
