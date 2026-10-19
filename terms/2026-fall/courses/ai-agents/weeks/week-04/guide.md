# W4 学生指南：给追加实验保留独立方案

本周继续使用已有的 `ai-agents` 仓库，在 `week-04/` 完成独立的 Python 练习。不换仓库，不改 W2、W3 的环境和报告，也不需要另建 Git 仓库。

## 背景与目的

你已经用蒲丰投针做出一版图表。导师要求换一个随机种子、增加某组投针数，追加一版实验；旧方案必须保留，才能重跑旧图、对照新结果。

随后，还需要从相同参数生成两份候选，分别继续调整。起初的内容可以相等，但修改第一份时，第二份和原始配置都不能跟着变。

本周实现 `make_variant`，把维护要求变成可反复使用的功能。与 Agent 先写有依据的测试，检查它能拒绝错误，再核验实现。本周不重写投针算法，不要求重新生成 PDF，也不以估计值更接近 π 作为成功标准。

## 先看全图：进程内存、名字与对象

Python 程序运行在一个进程中。解释器在这个进程的内存中保存对象，也维护名字与对象的绑定；Notebook 背后的 kernel 就是执行代码并保留这些状态的进程。

本周把变量理解为用来找到对象的名字。执行 `probe = 42` 后，`probe` 是名字，`42` 是整数对象，箭头表示绑定：

```text
当前 Python 进程的内存（关系示意）
名字与绑定                    对象
probe ─────────────────────→ 整数对象：42
```

对 `名字 = 表达式`，先计算右边得到对象，再建立或更新左边名字的绑定。列表、字典本身也是对象，它们的元素或条目还关联着其他对象。图只画关系，不代表实际内存分区。

整数对象的值不能原地改写；列表和字典允许修改内容。每读一行代码，都问：**改了哪个名字的绑定，还是改了哪个对象的内容？还有谁能找到这个对象？** 堆栈、地址等实现细节留作备用，本周先沿关系判断结果。

## 取得本周材料与环境

### 更新已有仓库

在 VS Code 的 WSL Terminal 执行：

```bash
cd ~/course/w02-workbench
git remote -v
```

找到地址为 `wxyinucas/ai-agents` 的教师 remote，只运行对应的一条：

- 教师仓库已叫 `upstream`：

  ```bash
  git pull --no-rebase upstream main
  ```

- 尚未配置个人 remote，教师仓库仍叫 `origin`：

  ```bash
  git pull --no-rebase origin main
  ```

已有本地提交时，更新可能需要合并。出现冲突或其他报错，把完整输出交给 Agent，先解释当前状态，再协助保留已有成果、完成更新；备用提示见本页末尾。不要为了取得材料重新 clone 或删除原项目。

### 打开独立的 W4 项目

更新成功后执行：

```bash
cd ~/course/w02-workbench/week-04
uv sync --locked
code .
```

本目录提供自己的 `pyproject.toml`、`uv.lock`，包含 Python 3.12、pytest 和 Notebook kernel 所需的 ipykernel。`uv sync --locked` 按锁文件建立 `week-04/.venv/`，不用让 Agent 重建项目或改根目录依赖。

- `README-materials.md`、`EXPERIMENT.txt`：运行方法、任务与验收约定。
- `variant.py`：你与 Agent 实现的函数入口，可以修改。
- `examples.py`：两份故障和课堂已展示的参考，只读对照。
- `tests/conftest.py`：切换实现的课程工具，不修改。
- `tests/test_acceptance.py`：教师公开验收，阅读但不修改。
- `tests/test_student.py`：你与 Agent 编写的独立测试，可以修改。
- `demo.ipynb`：课堂演示与可复现的 cell 组，不替代作业。

## 在 Notebook 中观察运行状态

在 Explorer 打开 `demo.ipynb`，右上角选择本周 `.venv` 的 Python kernel。若 VS Code 尚无 Python、Jupyter 扩展，借助 Agent 安装；kernel 列表不同或没有本周环境时，提供实际界面让 Agent 定位。

- Notebook 是代码与输出的界面，kernel 在进程内存中保存对象与名字绑定。
- 同一 kernel 的 cell 共用状态，不是各自独立的小程序。
- 按组执行“初始化 → 修改 → 观察”；不要在观察前重跑初始化，把变化抹掉。
- 旧输出不会因变量变化自动刷新；重跑观察 cell 才查询当前值。
- 清空输出不清除名字绑定；重启 kernel 会重置运行状态，旧绑定不会自动进入新进程。重启后单独查询旧名字，可能得到 `NameError`。

需要导读时可发送：

```text
我正在 VS Code 的 demo.ipynb 中做实验。
只解释我选中的这一段，先问我预期结果，再结合我提供的实际输出解释。
不要修改或代我执行；看不到 kernel 状态时，告诉我应查询什么，不要猜。
```

Notebook 是观察工具，不是额外的提交门槛。安装受阻时先跟看教师输出，作业测试仍可在 Terminal 执行。

## 先认识列表、字典与 type()

在 `demo.ipynb` 找到“先认识实验材料：列表、字典与类型”这一组，沿用本周 kernel，按下面的顺序执行。这组练习使用 `sizes` 和 `config`；后续课堂实验会各自重新初始化 `source`。

### 创建列表，按位置取值

列表 list 按顺序放一组值，用方括号创建：

```python
sizes = [1000, 10000, 100000]
print(sizes[0], sizes[2])
print(type(sizes), type(sizes[2]))
```

预期输出：

```text
1000 100000
<class 'list'> <class 'int'>
```

位置编号叫索引，Python 从 `0` 开始编号，所以 `sizes[2]` 是第 3 项。`type()` 查看对象的类型；先看输出引号里的名字：整个 `sizes` 是 `list`，取出的这一项是整数 `int`。

### 修改列表中的一项

在下一格执行：

```python
sizes[2] = 500000
print(sizes)
```

输出应为 `[1000, 10000, 500000]`。等号右侧给出新值，左侧指出要修改的位置；前两项保持原样。

### 用字典组织配置，按字段取值

另建一份练习配置：

```python
config = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
print(type(config))
print(config["seed"])
print(config["sample_sizes"])
```

预期输出：

```text
<class 'dict'>
42
[1000, 10000, 100000]
```

字典 dict 用 `字段名: 值` 组成记录，字段名也叫键 key，对应的内容叫值 value。这里 `"seed"`、`"sample_sizes"` 是文字键，保留引号；它们不是位置编号。

同样写方括号：列表中填位置，字典中填键。

### 先找字段，再找第 3 项

把两组连续的方括号拆开看：

```python
print(config["sample_sizes"])
print(config["sample_sizes"][2])
print(type(config["sample_sizes"]), type(config["sample_sizes"][2]))
```

预期输出：

```text
[1000, 10000, 100000]
100000
<class 'list'> <class 'int'>
```

`config["sample_sizes"]` 先取出列表，后面的 `[2]` 再取这个列表的第 3 项。按同一条路径也能修改：

```python
config["seed"] = 2026
config["sample_sizes"][2] = 500000
print(config)
```

预期为 `{'seed': 2026, 'sample_sizes': [1000, 10000, 500000]}`：第一行改字典字段的值，第二行改字段内列表的一项。

`type()` 只回答“是哪类对象”，不回答“是不是同一个对象”。后续用 `is` 比较身份、用 `==` 比较内容。

## 同一列表：重新绑定，还是修改内容？

下面两组实验**分别从各自的初始化开始**，不要把第二组接在第一组的状态上。

第一组只给名字 `l` 重新赋值：

```python
l = [1000, 10000, 100000]
other = l
l = [1000, 10000, 500000]
print(l, other, l is other)
# [1000, 10000, 500000] [1000, 10000, 100000] False
```

右边的列表表达式建立新列表，`l` 改为绑定它；`other` 仍绑定原列表。第二组从相同的干净初态重来，只改列表第三项：

```python
l = [1000, 10000, 100000]
other = l
saved_item = l[2]
l[2] = 500000
print(l, other, l is other)
print(saved_item, l[2], saved_item is l[2])
# [1000, 10000, 500000] [1000, 10000, 500000] True
# 100000 500000 False
```

第二组中，`l`、`other` 仍绑定同一个列表，第三项改为关联整数 `500000`；`saved_item` 仍绑定原整数 `100000`，整数本身没有被改写。**两组中 `other` 的绑定都没变**，但第二组通过它观察到的列表内容变了。

整数例子也按同一规则读：先执行 `seed = 42`、`old_seed = seed`，再执行 `seed = 2026`，换的是 `seed` 的绑定，`old_seed` 仍关联整数 `42`。不能只记“数字不跟着变、列表会跟着变”，要看具体操作改的是哪里。

## 本周大作业：维护独立的追加方案

### 固定入口与已知答案

在 `variant.py` 实现：

```text
make_variant(source, seed, index, replacement)
```

- `source` 是普通字典，本题只含整数 `seed` 和非空正整数列表 `sample_sizes`。
- 其余参数给出新 seed、要修改的位置和新的正整数样本量；位置从 0 开始。
- 输入与位置均合法，不增加非法输入处理。
- 返回更新后的独立方案，只更新 seed 和指定样本量，其他内容保持。

例如：

```python
source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
result = make_variant(source, seed=2026, index=2, replacement=500000)

# result 应为 {"seed": 2026, "sample_sizes": [1000, 10000, 500000]}
# source 仍为 {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
```

预期来自输入与修改规则，不从候选实现的输出反推。`is` 检查身份，`==` 检查内容；两者回答不同问题。

沿关系读配置：`source` 先找到字典，`source["seed"]` 再按键找到整数，`source["sample_sizes"][2]` 则继续找到列表的第三项。`variant = source` 只增加名字绑定；`variant["seed"] = 2026` 改字典条目的关联，`variant["sample_sizes"][2] = 500000` 改内层列表的内容。是否影响旧方案，要检查具体哪一层仍然共享。

### 五项验收承诺

- 返回结果正确，未指定的内容保持。
- `source` 保持调用前内容。
- 返回字典及其 `sample_sizes` 列表，分别与原字典、原列表不同。
- 后续修改返回结果，不影响 `source`。
- 相同参数调用两次：内容相等，但字典和列表各自独立；修改第一份，不影响第二份和 `source`。

另选一组合法输入写自己的测试，不只复制课堂例子。不可变整数不需要拥有不同身份；也不要求实现任意复杂对象的通用深复制。

## 与 Agent 先写测试，再实现

### 写自己的测试

`tests/test_student.py` 初始只有说明，没有现成测试。把自己的输入与预期交给 Agent：

```text
阅读 EXPERIMENT.txt、variant.py 和 tests/conftest.py，暂不实现函数。
我选的输入是：……；调用参数是：……；我预测结果是：……。
先与我核对预期依据，再在 tests/test_student.py 写测试。
每个测试用函数参数 make_variant 接收课程 fixture，不直接 import 候选实现。
覆盖正确内容、source 保持、两层身份、后续修改和相同参数的两次调用。
预期记录独立建立，不用 before = source 保存旧内容；不改教师测试。
```

**fixture** 是教师提供的测试辅助：pytest 把选中的候选函数传给你的测试。测试使用 `def test_某个承诺(make_variant):`，在里面调用这个参数。

`--impl` 是本周工具增加的开关，不是 pytest 原生选项：`reference` 为参考，`direct` 为直接共享故障，`shallow` 为浅复制故障，`student` 为 `variant.py` 的实现（默认）。直接 import 某个实现，就会绕过开关。

### 接受正确实现，拒绝两种故障

写好学生测试后，在 `week-04/` 逐条执行：

```bash
uv run --locked pytest -q tests/test_student.py --impl=reference
uv run --locked pytest -q tests/test_student.py --impl=direct
uv run --locked pytest -q tests/test_student.py --impl=shallow
```

- 参考应通过；两份故障应出现有依据的断言失败。
- 解释一条失败断言：它比较谁、答案从哪里来、能拒绝什么错误。
- 导入、语法、环境错误不算发现共享故障。
- `no tests ran` 表示没有执行学生测试，不是通过；初始空文件出现这个结果正常。
- 参考也失败时，先核对测试依据，不能把“任何程序都失败”当作有效验收。

教师和学生测试分开运行。教师测试通过，不代表你已经设计了自己的测试。

### 实现并接受两份核验

确认测试有效后发送：

```text
根据已核验的测试实现 variant.py 中的 make_variant。
可以按层复制、重建容器或 deepcopy；不修改教师工具和测试，不降低预期。
运行我的测试和教师验收，给出实际结果与 diff。
指出哪里建立独立字典、独立列表，哪里更新指定内容，等我核对。
```

本人在 Terminal 重跑：

```bash
uv run --locked pytest -q tests/test_student.py --impl=student
uv run --locked pytest -q tests/test_acceptance.py --impl=student
```

教师验收用多组合法输入检查同样的承诺，不要求源码出现某个 copy 关键词。初始 student 函数壳抛出 `NotImplementedError`，需要你与 Agent 完成后再通过。

## 失败时怎么定位

只读一条真实失败：输入、预期、实际结果与失败断言；判断是内容不对、原配置变了，还是某层仍共享。

```text
这是实际失败输出：……。
只对照这一条断言，解释比较对象与预期依据。
找到实现的对应位置，指出共享或修改落在哪一层。
先不改代码和测试，等我确认后再修实现。
```

修复后用同一份测试重跑。让 Agent 指路，你在实际文件找到独立列表与指定修改的位置，不只接受聊天里的“全部完成”。

## 选做：参数没变化，是否仍需要独立？

把新 seed 设为原 seed，把 replacement 设为原位置已有的数：

- 先预测：直接共享故障能通过哪些内容比较？
- 运行验证，再增加身份检查或后续修改，暴露共享。
- 用同一份测试检查参考与学生实现，解释“这次值没变”和“以后可以独立维护”的区别。

这个输入仍遵循必做的隔离约定；选做的是亲自构造并解释反例，不是新功能。

## 保存成果与自己的依据

保留 `variant.py`、自己的测试与实际运行记录。说明一次预测、一次被证据推翻的解释、最终独立关系和未完成条件；自己的笔记即可，不要求长报告或完整 Agent 对话。

沿用已有仓库和本地提交方式，不要求实验分支、模拟远端或 CI：

```bash
cd ~/course/w02-workbench
git status -sb
git diff -- week-04/variant.py week-04/tests/test_student.py
git add -- week-04/variant.py week-04/tests/test_student.py
git diff --cached
git commit -m "Complete W4 configuration isolation exercise"
```

先确认暂存内容属于本周；若已有其他暂存文件，也一并核对。另存的证据按实际路径选择加入，不提交 `.venv/` 或缓存。本周不新增 push、PR 或分支要求。

未通过可保存候选与失败输出，提交说明写真实进度。配置测试不证明实验结论一定可靠。

## 遇到问题怎么求助

更新材料有冲突时：

```text
我在已有的 ai-agents 本地仓库中取得 W4 材料，遇到这些输出：……。
先只读检查目录、Git 状态、remote 和冲突，解释它们各自意味着什么。
我需要保留 W2/W3 成果；不要删除仓库、丢弃提交或 force push。
给出下一步及影响，等我确认后再处理。
```

环境或测试受阻时，提供实际目录、命令与完整错误，不贴 API Key。让 Agent 先解释，再协助处理。

macOS 同学沿用 W2 的 Bash／zsh 与 VS Code，在同一仓库 `week-04/` 执行相同 uv、pytest 命令，无需 WSL；Notebook 同样选本周 `.venv` 的 kernel。
