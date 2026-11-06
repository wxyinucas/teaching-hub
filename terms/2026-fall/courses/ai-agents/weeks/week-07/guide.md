# W7｜调试：找到第一次偏差

这周用 VS Code 的 Notebook 调试器观察程序。每道题已经给出错误版本、固定输入和检查。先定位，再修改。

## 同步材料

沿用之前 clone 的 [ai-agents 仓库](https://github.com/wxyinucas/ai-agents)。如果你已开始修改材料，先保存个人副本。进入已有工作台的根目录，例如 `~/course/w02-workbench`，查看教师仓库对应的 remote 名称。

```bash
git status -sb
git remote -v
```

教师仓库是 `origin` 时运行 `git pull --no-rebase origin main`，是 `upstream` 时运行 `git pull --no-rebase upstream main`。更新成功后，在同一终端执行：

```bash
cd week-07
uv sync --locked
code .
```

Windows 用户在 WSL 中操作。打开 `exercises.ipynb`，选右上角的 Kernel，选择本周目录 `.venv` 的 Python 3.12。`demo.ipynb` 是教师演示，课后也可以自己重跑。

## 第一次用断点

1. 先运行本题输入格，再普通运行错误 Playground，看到实际输出和预期不同。
2. 点击 Playground 中目标行的左侧边缘设断点。在运行按钮旁的菜单选 **Debug Cell**。
3. 停住后看 **Variables** 里的值。需要看谁把这个值传进来时，去 **Call Stack** 选择上一层调用。用 **Continue** 继续到下一次停住。
4. 停止调试，改好 Playground，把修复写进给定的函数壳，重跑本题检查，再核对变式输入。

需要重来时先停止调试，从该题输入格重新运行。初始代码有缺陷，按题目逐格跑。

## 课堂检查点

两人一组轮流用自己的 Notebook 展示。给同桌看用什么输入复现、在哪里停住、看到了什么、改了哪里，然后重跑。还没修好，就展示已经查过的位置和下一步打算看哪个值。课堂会选一份过程，通过 Live Share 给大家对照。
