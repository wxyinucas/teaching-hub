# W7｜调试：找到第一次偏差

这周用 Notebook 调试器找到第一次偏差。每道题已经给出错误版本、固定数组和检查。**先在断点处说清预期和实际看到的值，再决定改哪一行。**

## 获取本周材料

继续使用已经 clone 的 [ai-agents 课程仓库](https://github.com/wxyinucas/ai-agents)，例如 `~/course/w02-workbench`。本周材料随这份仓库更新，保留已有 Git 历史。Windows 用户在 WSL 终端中完成下面的操作。

### 1. 保存自己的工作

如果已经试跑或修改过 Notebook，先另存为个人副本，例如 `exercises-my.ipynb`；已有同名文件时换一个名字。保存后关闭旧版 Notebook 标签页，避免稍后将旧内容覆盖保存回更新后的文件。

进入已有工作台的根目录，查看本地改动和 remote：

```bash
cd ~/course/w02-workbench
git status -sb
git remote -v
```

`git status` 中若还有已跟踪文件的修改，先把要保留的改动 commit，或请 Agent 帮你用 stash 暂存。让它说明保存了哪些文件、个人副本是否包含在内，以及更新后怎样恢复。确认自己的工作已经妥善保存，再拉取教师材料。

### 2. 从教师 remote 更新

在 `git remote -v` 中找出指向 `wxyinucas/ai-agents` 的 remote；SSH 地址是 `git@github.com:wxyinucas/ai-agents.git`，HTTPS 地址也可以。按实际情况执行其中一条：

- `origin` 指向教师仓库：`git pull --no-rebase origin main`
- `origin` 指向自己的 fork、`upstream` 指向教师仓库：`git pull --no-rebase upstream main`

如果找不到教师 remote，或 pull 因本地改动、未完成的 merge、冲突而停止，把 `git status -sb`、`git remote -v` 和报错交给 Agent，让它先解释当前状态，再帮助保存改动、完成合并并重新检查。解决后继续使用这份工作台和已有历史。

### 3. 建立本周环境并打开目录

拉取成功后，在同一终端运行：

```bash
cd week-07
uv sync --locked
code .
```

同步的是整个 `week-07/`，其中各文件的职责如下：

| 文件 | 用途 |
| --- | --- |
| `README.md` | 本周材料入口与运行说明。 |
| `.python-version` | 指定本周使用 Python 3.12。 |
| `pyproject.toml` | 声明本周依赖，包括新增的 NumPy，以及 Notebook 和 kernel 所需工具。 |
| `uv.lock` | 锁定依赖版本；`uv sync --locked` 据此创建或更新本周的 `.venv/`。 |
| `demo.ipynb` | 教师演示：复现两个均值相同的问题，观察变量与调用栈，再修复和检查；课后可以重跑。 |
| `exercises.ipynb` | 学生练习：六个 NumPy 场景，含固定输入、错误 Playground、函数壳、检查与折叠参考解答。 |

`.venv/` 由上面的命令在本周目录中生成。上周的环境即使能运行旧材料，也不代表包含本周的 NumPy 和依赖版本。

## 选对 kernel 再开始

VS Code 需要 Python 和 Jupyter 扩展。重新打开刚更新的 `exercises.ipynb`，在右上角 **Kernel** 选择 `week-07/.venv` 的 Python 3.12；使用 WSL 时，选择 WSL 中的本周环境。确认打开的是新版后，另存为个人练习副本再修改；已有副本时换一个名字。重启这个 Notebook 的 kernel，从输入格开始逐题运行，旧副本留作对照。

可以在临时代码格中核对：

```python
import sys
import numpy as np
print(sys.executable)
print(np.__version__)
```

Python 路径应位于本周的 `week-07/.venv/` 中，NumPy 应能正常导入；不符时先重新选择本周 kernel 并重启。先读练习开头的「开始前：只用到这些 NumPy 记号」，再进入题目；新版使用数组，缺失值用 `np.nan`。

## 第一次用断点

1. 先运行本题输入格，再普通运行错误 Playground，看到实际输出和预期不同。
2. 点击 Playground 中目标行的左侧边缘设断点。在运行按钮旁的菜单选 **Debug Cell**。
3. 停住后看 **Variables** 里的数组、`shape`、掩码或计数。需要看谁把这个值传进来时，去 **Call Stack** 选择上一层调用。用 **Continue** 继续到下一次停住。
4. 停止调试，改好 Playground，把修复写进给定的函数壳，重跑本题检查，再核对变式输入。

卡住时，展开该题末尾「参考解答」，先跟着「动手调试」在原 Playground 设置断点、核对预期和实际，再看参考实现。需要重来时先停止调试，从该题输入格重新运行。初始代码有缺陷，按题目逐格跑。

## 在浏览器中重跑演示

在已同步并安装好环境的 `week-07/` 目录中运行：

```bash
uv run --locked python -m ipykernel install --sys-prefix --name ai-agents-week-07 --display-name "W7 Python 3.12"
uv run --locked jupyter notebook demo.ipynb
```

打开这次启动时终端输出的完整本机链接，保留其中的 token；若出现登录页，使用同一次输出中的 token。Notebook 中选择 **W7 Python 3.12**。

先普通运行「定义」「直接调用」「报告」三格：直接调用得到 `(6.0, 3.0)`，报告却得到 `(6.0, 6.0)`。先预测第二次调用 `mean` 应收到几个元素，再用断点核对。

1. 点顶部工具栏的小虫图标启用调试器，如提示重启则确认。按顺序重跑「定义」和「直接调用」两格，再通过 **View → Debugger Panel** 打开面板。
2. 在「定义」格的 `return float(np.mean(values))` 行左侧设断点，选中「报告」格点击 **▶ 运行**。
3. 第一次停在 `mean`，在 **VARIABLES** 展开 `values`，看 `shape` 或 `size`；在 **CALLSTACK** 点 `report`，看是谁调用了它。点 **Continue**，在第二次停住时比较预期与实际：本应收到 2 个元素，却仍收到 3 个。形状告诉你输入不对；切到 `report` 层的高亮调用行，才能指认传错的是哪个参数。
4. 先说出「预期输入 → 实际输入 → 调用位置」，再 **Continue** 让程序结束，清除断点，只改导致偏差的一处。重跑「定义」「直接调用」「报告」「检查」，核对原例与变式。

演示 Notebook 的折叠区保留了 VS Code 的 **Debug Cell** 步骤和备用停点记录。

## 课堂检查点

两人一组轮流用自己的 Notebook 展示。给同桌看用什么输入复现、在哪里停住、看到了什么、改了哪里，然后重跑。还没修好，就展示已经查过的位置和下一步打算看哪个值。课堂会选一份过程，通过 Live Share 给大家对照。
