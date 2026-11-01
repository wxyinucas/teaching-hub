# W6 学生指南：函数、调用与可见性

本周继续使用已有的 `ai-agents` 仓库，在 `week-06/` 中跟练。完整题目、错误代码、函数壳、检查与参考都在 `demo.ipynb`；本指南帮助你同步材料、启动环境和恢复运行状态。

## 先保存自己的成果，再同步 Notebook

Windows 同学在已有的 VS Code WSL Terminal 中操作；macOS 同学使用已有终端，无需 WSL。下面沿用之前的仓库路径 `~/course/w02-workbench`；如果你的目录不同，替换为实际路径。

1. 如果已经在 Notebook 中练习，先保存，并将自己的成果另存为 `demo-my.ipynb`；已有同名文件时换一个名字，避免覆盖旧成果。
2. 在仓库根目录检查本地状态和远端：

```bash
cd ~/course/w02-workbench
git status -sb
git remote -v
```

找到指向 `wxyinucas/ai-agents` 的教师 remote，**只选对应的一条**更新命令：

- 教师仓库叫 `upstream`：`git pull --no-rebase upstream main`。
- 教师仓库仍叫 `origin`：`git pull --no-rebase origin main`。

更新被本地改动阻止、发生合并冲突或其他报错时，把实际状态与输出交给 Agent，先解释，再保留已有成果并完成更新。不要删除项目重新 clone，不要用 `git reset --hard` 或强制覆盖来消除问题。

3. 更新成功后，在编辑器中重新载入磁盘上的教师版 `week-06/demo.ipynb`，避免继续使用更新前已打开的内容。遇到“磁盘文件已改变”的提示时，先确认个人成果已经另存，不要用旧编辑器内容覆盖刚同步的文件。
4. 打开更新后的 Notebook，选择本周环境，并 **Restart Kernel（重启内核）**，清掉旧变量与导入状态；随后按场景重新运行。保存过的输出不能代替这次运行的结果。

也可以从[本周目录](https://github.com/wxyinucas/ai-agents/tree/main/week-06)查看或取得材料；[README](https://github.com/wxyinucas/ai-agents/blob/main/week-06/README.md)说明启动方法，[Notebook](https://github.com/wxyinucas/ai-agents/blob/main/week-06/demo.ipynb)可在线预览。**首选同步整个周目录**：Notebook 需要同目录的 `defaults.py`，环境还需要 `pyproject.toml`、`uv.lock` 与 `.python-version`，不要只下载一个 `.ipynb` 后在其他周的环境里运行。

## 启动本周环境

在已同步的仓库根目录执行：

```bash
cd week-06
uv sync --locked
code .
```

`uv sync --locked` 按本周锁文件建立或同步 `week-06/.venv/`。在 VS Code 中打开 `demo.ipynb`，右上角选择本周 `.venv` 的 Python kernel，确认使用 Python 3.12。

如果使用 Jupyter 网页版，先完成同步，再在 `week-06/` 中登记本周 kernel 并启动：

```bash
uv run --locked python -m ipykernel install --user --name ai-agents-week-06 --display-name "W6 Python 3.12"
uv run --locked jupyter notebook demo.ipynb
```

本周已声明 `notebook` 依赖，无须加 `--with notebook`。网页中选择 **W6 Python 3.12**；浏览器未自动打开时，使用终端显示的完整本机网址。使用期间保持启动终端运行，结束时按 **Ctrl+C** 并按提示关闭服务。

不确定 kernel 时，在临时代码格运行：

```python
import sys
print(sys.executable)
print(sys.version.split()[0])
```

解释器路径应位于本周的 `week-06/.venv/`，版本为 `3.12.x`。缺少包或导入失败时，先核对当前目录与 kernel，再把实际输出交给 Agent。

## 按场景运行六格

**初始 Playground 有缺陷，函数壳尚未实现，初始断言或检查失败是预期起点。** 直接 Run All 会停在第一个错误，不表示环境安装失败。

每个场景按以下顺序推进；个别场景另有补充知识，先读再做：

1. **场景与需求**：读清输入、输出和哪些数据应保持不变。
2. **输入**：运行以恢复本场景数据，先写下自己对错误代码的预测。
3. **Playground**：运行、比较实际结果，修改实现并用 `print` 观察中间状态；保留问题所需的函数边界。
4. **函数组装**：将修复结果填入给定的正式函数壳，运行这一格，让新定义生效。
5. **单元检查**：运行给定断言，核对换输入、连续调用以及数据应共享还是独立。
6. **参考**：需要时点击展开；这是默认折叠的静态文字，不会替你执行或更新函数。

调试时可以增删打印；**正确的断言和正式单元检查不可删改，修的是实现**。参考代码看懂后，也要亲自运行自己的实现与检查。

需要重试时，从本场景输入格开始，再运行修复后的 Playground、函数组装和单元检查。

**场景五尤其注意运行顺序。** 修复导入方式和配置生成函数后，先重跑“输入”格，恢复 `seed` 与公共配置，再运行修复后的 Playground、组装格和检查。删掉 `from defaults import *` 的源代码，不会撤销它之前运行造成的名字覆盖或数据修改；不要在修复代码里重设 `seed` 来掩盖问题。

## 六个场景做什么

| 场景 | 任务与要核对的产出 |
| --- | --- |
| 一：同名阈值 | 修复 `caller(threshold)`，用本次临时阈值加当前公共 `offset`；`read_threshold()` 仍读取公共基准，调用不改公共变量。 |
| 二：独立累计 | 实现 `make_counters(starts)`，得到各自保留累计值的函数列表；交替调用时互不串值。 |
| 三：递归与日志 | 实现 `sum_trace(x)`，返回累计和与真实的进入、返回事件；各层参数与各次调用的日志符合需求。 |
| 四：分轮收集 | 实现 `collect_batches(batches, target=None)`；默认调用各得新列表，显式给定列表时向原对象追加并返回它。 |
| 五：实验配置 | 实现 `make_run_config(requested_seed)`；保留已有名字、读取当前公共上限，各份标签列表独立。 |
| 六：快照与分叉 | 实现 `make_accumulator(start=0)` 的 `add`、`snapshot`、`fork`；实例内部共享进度，父子分支与嵌套快照彼此独立。 |

完整边界以 Notebook 题面为准。场景六可以与 Agent 合作，先预测父子交错更新和修改旧快照后的结果，再核对当前值与完整历史。

## 与 Agent 合作

可以把当前场景和实际输出连同下面的提示交给 Agent：

```text
我在 week-06/demo.ipynb 做场景……，我的预测是……，实际输出是……。
先沿一次具体调用解释：名字从哪里取值，哪份状态被保留，哪些对象被共享。
协助我修复 Playground，再组装正式函数；保留给定断言和单元检查，不修改 defaults.py。
说明需要从哪一格恢复状态，运行检查并给出实际结果，最后让我核对一条调用过程。
```

本周完成情况以 Notebook 中实际修复后的检查为依据。保留自己的预测、修复与运行结果即可；不新增作业报告或 CI 提交要求。
