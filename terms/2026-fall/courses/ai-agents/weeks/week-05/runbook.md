# W5｜数据操作与遍历

> 3 × 50 min · 完整示例与小练习在 Notebook 中；具体操作见学生指南。

## 知识地图

- **Road map：确定操作 → 比较对象 → 遍历处理 → 测试与 CI 核验**
  - 对象：list · dict · set · 一维数值数组；tuple 与 zip 各一例
  - 操作：取值／成员判断 → 修改 → 增加 → 删除
  - 遍历：逐项展示 → 变换 → 筛选 → 用推导式生成新结果
  - 贯穿观察：函数与方法的调用形式；原对象是否改变；返回什么

## 本次课 · 从一个元素的操作到一组数据的处理

### 0-50 | 不同对象，怎样完成数据操作？

> 认识四类对象的组织方式，执行基本操作，并分别观察原对象与返回值。

- [ ] 课前：在 `week-05/` 执行 `uv sync --locked`，VS Code 打开 `demo.ipynb` 并选本周 `.venv`；重启 kernel 后 Run All。
- [ ] 课前：`challenges/demo.ipynb` 跑过准备展示的综合题，课堂打开时停在该题的题目 Markdown。
- [ ] 课前：Terminal 停在 `week-05/`，准备下文的参考与故障测试命令；浏览器打开课程仓库的 W5 Actions 记录。
- 材料：[demo.ipynb](https://github.com/wxyinucas/ai-agents/blob/main/week-05/demo.ipynb)；[小练习答案](https://github.com/wxyinucas/ai-agents/blob/main/week-05/TEACHER-NOTES.md)。
- 默认路线：主 Notebook 从头到小练习 8 → 综合 Notebook 的 A 题 → 第三课时回 `operations.py` 与 Terminal；B、C 留给提前完成者。
- 演示直接运行 Notebook 已写好的分段代码；停在“小练习”处，让学生预测、运行、修改一处并核对。

#### 用一次 deepcopy 接续上周

> 看一次独立修改的结果，结束复制话题。

~~~python
from copy import deepcopy
source = {"values": [1, 2, 3]}
other = deepcopy(source)
other["values"][0] = 9
print(source, other)
~~~

- 原配置仍是 `[1, 2, 3]`，新配置为 `[9, 2, 3]`。

#### 固定四类初始对象

> 看清每类对象怎样组织数据；后续各组操作从这份初始化重新开始。

~~~python
import numpy as np
xs = [1, 2, 2, -1]
record = {"a": 1, "b": 2, "c": 2, "d": -1}
unique = {1, 2, 2, -1}
a = np.array([1, 2, 2, -1])
~~~

- list：按顺序放元素；dict：按键关联值；set：不重复的元素，不记录位置顺序。
- 数组：本次只用一维数值数据，指认 `a.shape`、`a.dtype`。
- `type()` 看类型；`len()` 看数量。list 有 4 项，这个 set 有 3 项。
- 小练习 1：只改一个列表元素，再建集合，核对数量与重复值。

#### 取值与成员判断

> 区分按位置取值、按键取值，以及判断元素是否存在。

- `xs[0]`、`a[0]`：按位置取出 `1`；`record["b"]`：按键取出 `2`。
- `2 in unique`：`True`；set 不提供 `unique[0]` 这样的索引取值。
- `"b" in record` 为 `True`，`2 in record` 为 `False`：字典的成员判断看键。
- 小练习 2：将键从 `"b"` 换成 `"d"`，先预测取值与成员判断。

#### 修改与增加

> 对照修改已有内容与增加内容；不支持同一种操作时，直接辨认差异。

- list：`xs[0] = 10`；`xs.append(5)`。
- dict：`record["b"] = 20` 更新已有键；`record["e"] = 5` 增加新键。
- set：`unique.add(5)`；再次加入 `2` 不增加重复元素。
- 数组：`a[0] = 10` 原地修改；`grown = np.append(a, 5)` 得到新数组，a 的长度不变。
- 小练习 3：将 append 换成 pop，同时看原列表和返回值。

#### 删除与取出

> 看清按什么删除、删掉什么，以及是否同时得到一个返回值。

- list：`removed = xs.pop()` 删除并返回最后一项 `-1`。
- dict：`removed = record.pop("b")` 删除键值对，返回值 `2`。
- set：`unique.discard(2)` 删除指定元素；`unique.pop()` 取出任意元素，不预设取到谁。
- 数组：`remaining = np.delete(a, 0)` 得到删去第 1 项的新数组；a 保持原样。
- 小练习 4：改变数组追加的值，核对原数组、新数组和两个长度。

#### 同时看原对象与返回值

> 调用形式、原地修改、返回结果，分别判断。

- `len(xs)` 是内置函数；`xs.append(5)` 是列表的方法；`np.append(a, 5)` 是模块中的函数。
- `xs.append(5)` 改原对象，返回 `None`；`np.append(a, 5)` 不改原数组，返回新数组。
- `xs.pop()` 既改原对象，也返回被删除的元素。函数／方法的写法不能直接决定这两种行为。

### 50-100 | 怎样把一次操作推广到一组数据？

> 用同一批数据完成展示、变换、筛选与收集，再用推导式表达相同过程。

- 先重新运行“四类初始对象”代码，恢复 xs、record、unique 和 a。

#### 遍历时，每次取出了什么？

> 认识 for 循环，先确定循环变量每次接收的内容。

~~~python
for item in xs:
    print(item)
~~~

- 依次将 xs 换成 record、unique、a：字典默认取键，其余本例取元素。
- 冒号开始循环体，缩进标明重复执行的部分；循环变量每轮接收下一项。
- set 不保证显示顺序；遍历顺序不能作为本例 set 的验收条件。

#### 一项也可以是一对值

> 用一个 tuple 和一个 zip 例子，看懂成对数据与拆包。

~~~python
pair = ("a", 1)
key, value = pair
for key, value in zip(["a", "b"], [1, 2]):
    print(key, value)
~~~

- tuple 在这里保存一对值；zip 将对应位置配对。例子使用等长输入，不展开迭代器机制。
- 对照 `for key, value in record.items():`，同时取得字典的键和值。
- 小练习 5：交换打印键和值的顺序，核对每轮接收与显示的内容。

#### 逐项变换，收集结果

> 对每项执行同一个计算，把结果加入新列表。

~~~python
squares = []
for item in xs:
    squares.append(item ** 2)
~~~

- 从固定初始 xs 得到 `[1, 4, 4, 1]`；原 xs 保持不变。
- 结果列表先在循环外建立，循环内逐项追加。
- 小练习 6：将平方换成乘 10，原输入是否改变？

#### 加入条件，只处理需要的元素

> 将遍历、筛选与变换组合起来。

~~~python
positive_squares = []
for item in xs:
    if item > 0:
        positive_squares.append(item ** 2)
~~~

- 得到 `[1, 4, 4]`：条件先筛选原元素，再计算平方。
- 改变筛选条件，运行并核对实际留下哪些元素。
- 小练习 7：使用含 0 的输入，将 `> 0` 改为 `>= 0`，核对两次结果。

#### 用推导式生成新结果

> 将已经理解的循环写成推导式，对照结果与保留规则。

~~~python
new_list = [x ** 2 for x in xs if x > 0]
new_set = {x ** 2 for x in xs if x > 0}
new_dict = {k: v ** 2 for k, v in record.items() if v > 0}
new_array = np.array([x ** 2 for x in a if x > 0])
~~~

- 从固定初态分别得到 `[1, 4, 4]`、`{1, 4}`、`{"a": 1, "b": 4, "c": 4}` 和数值数组 `[1, 4, 4]`。
- 对照每项生成什么、从哪里遍历、保留什么；筛选写在 if 子句中，不引入额外的 filter 函数。
- 本组新建结果，原输入保持；集合去重，列表保留重复项。
- 小练习 8：字典只保留原值 `>= 2` 的项，预测留下哪些键。

#### 与 Agent 完成一道综合题

> 组合已有操作，先确定结果，再实现、核验和解释；按进度选一题，约 20～30 分钟。

- 打开 `week-05/challenges/demo.ipynb`，默认展示 A：顺序去重与频数统计；B 应用修改、C 比较测量留作继续探索。
- 先展示题目 Markdown 和输入示例，停下来让学生与 Agent 合作；再往下展示“参考解答”的完整 Python 代码、运行结果与边界核对。
- 前 5 分钟：核对题目示例，再选一份不同输入，写下预期结果。
- 中间 10～15 分钟：Agent 协助实现、补测试，本人运行；完成得快就进入下一步。
- 最后 5～10 分钟：用一条边界或反例核对规则，沿一个元素解释它如何进入结果。
- 选做验收单独运行；本周原三道基础题与 CI 保持独立。题目和命令见 Guide。

### 100-150 | 与 Agent 完成练习，用测试和 CI 核验

> 将数据操作用于明确任务，读懂失败反馈，核对修复前后的结果。

#### 题组与验收约定

> 先明确要完成的操作、原输入是否允许改变，以及应返回什么。

- 打开 `EXPERIMENT.txt`、`operations.py` 与公开测试，使用已给出的函数壳。
- `pop_last(items)`：原地取出列表末项并返回；空列表返回 `None`。
- `positive_squares(values)`：整数列表／一维整数数组 → 正数平方的新列表，保留顺序和重复项，不改输入。
- `positive_square_map(record)`：字典 → 正值对应的新字典，值平方、键顺序保持，不改输入。
- 观察点：空输入、0、重复值、筛选后为空；输入变化与返回内容分别核验。

#### 先看一次失败，再看修复

> 知道测试如何指出未满足的要求，再开始独立操作。

- 以下命令在 `week-05/` 执行，先运行公开参考，再只看一个已知故障。

~~~bash
uv run --locked pytest -q --impl=reference
uv run --locked pytest -q 'tests/test_acceptance.py::test_pop_last_returns_item_and_changes_input[several]' --impl=broken
~~~

- 故障返回了正确的末项，却没真正删除它；失败落在原列表的比较上。
- 对照 `examples.py` 的 broken 与 reference 两个版本，再看修复多了哪一步。
- `--impl` 选择检查谁；默认检查 `operations.py`，初始函数壳报未实现，不是环境错误。

#### 与 Agent 实现并核验

> 由 Agent 协助完成代码，本人核对操作与结果。

- 先读题并预测一组结果，再请 Agent 解释、实现。
- 本人运行测试，检查原输入是否变化、返回值是否符合要求。
- 选一段实现，用输入、逐项处理与最终结果解释它在做什么。
- 在 `tests/test_student.py` 增加一组自己的输入，再亲自运行 `uv run --locked pytest -q`。

#### 提交到远端，查看 CI

> 让远端重复本地检查，并找到具体失败位置。

- 按 Guide 提交并 push 到个人远端；在 **Actions → W5 data operations** 找到本次提交的检查。
- CI 使用与本地相同的锁定环境和测试命令；教师提前配置，不展开 YAML。
- 学生仓库默认检查 student；教师原仓库默认检查 reference。查看提交编号与模式，教师的绿色不代表学生作业完成。
- 检查失败时区分环境／启动失败与断言失败；修复后重新提交，核对对应的新结果。
- 网络或 Actions 受阻时保留本地默认测试输出，注明远端未完成，继续练习。

#### 本次课回顾

> 用实际操作与测试结果，说明自己如何处理了一组数据。

- 选择一次调用：原对象变了吗？返回了什么？
- 选择一段遍历：每次取出什么，做什么处理，留下什么结果？
- 保留自己的代码、测试结果与一次失败修正；已完成者更换输入、增加测试。
- 基础任务完成后，可继续另一道综合题；不要求本周完成全部三题。
