<!-- lesson: 第一课时 -->
<!-- layout: cover -->
# W4：赋值以后，到底改了什么？
> 名字、对象与可变性

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- layout: columns -->
# 从 Bash 到 Notebook：代码在哪里执行？

<!-- column -->
## 进程与内存
**运行的场地**

解释器执行代码

内存中保存对象与绑定

<!-- column -->
## 名字与绑定
**找到对象的入口**

`probe = 42`

名字 probe → 整数对象 42

<!-- column -->
## 对象与关联
**具体的数据**

整数 · 列表 · 字典

容器中的条目还关联其他对象

<!-- footer -->
每一步都问：改了哪个名字的绑定，还是哪个对象的内容？

---
# 进程内存中的名字与对象

![当前 Python 或 kernel 进程的内存中，probe 这个名字绑定整数对象 42。名字、绑定和对象都属于该进程的运行状态；左右排布只表示关系，不表示堆栈分区。](assets/2026-fall/ai-agents/week-04/process-name-object.svg)

---
<!-- layout: columns -->
# 旧输出，不是当前状态

<!-- column -->
## 屏幕上的 42
**先前的输出**

`probe = 42`

`print(probe)` → `42`

<!-- column -->
## 当前绑定到 2026
**再次运行才查询**

`probe = 2026`

重跑 `print(probe)` → `2026`

<!-- footer -->
cell 共用一个 kernel 的运行状态；重启后直接查询 probe → NameError。

---
<!-- layout: columns -->
# 先认识实验材料：列表、字典与类型

<!-- column -->
## list：按位置
**从 0 开始编号**

```python
sizes = [1000, 10000, 100000]
sizes[2]        # 100000
type(sizes)     # list
type(sizes[2])  # int
```

<!-- column -->
## dict：按键
**用字段组织记录**

```python
config = {"seed": 42,
          "sample_sizes":
              [1000, 10000, 100000]}
config["seed"]  # 42
type(config)    # dict
```

<!-- footer -->
type() 查看对象类型；is 比较身份，== 比较内容。

---
<!-- layout: tree -->
# 先找字段，再找第 3 项

```text
config → 字典
         "sample_sizes" → 列表
                          [2] → 整数 100000
```

<!-- footer -->
`config["seed"] = 2026` 改字典条目；`config["sample_sizes"][2] = 500000` 改列表项。

---
# 内容相等，是不是同一对象？

| 比较对象 | == 内容 | is 身份 |
| --- | --- | --- |
| `source`、`variant` | `True` | `True` |
| `source`、`same_content` | `True` | `False` |

<!-- footer -->
`variant = source`；`same_content` 是另建的同内容字典。

---
# 数字没跟着变：名字重新绑定

![seed 原来与 old_seed 都指向整数 42。执行 seed = 2026，只改变 seed 的指向，old_seed 仍指向旧整数 42。灰色虚线表示已解除的原指向。](assets/2026-fall/ai-agents/week-04/integer-rebinding.svg)

---
<!-- layout: columns -->
# 同一列表：重新绑定名字，还是修改内容？

两组各从 `l = [1000, 10000, 100000]`、`other = l` 开始。

<!-- column -->
## 重新绑定 l
**名字改为关联新列表**

`l = [1000, 10000, 500000]`

other 的第三项仍是 `100000`

<!-- column -->
## 修改列表内容
**两个名字仍关联同一列表**

`l[2] = 500000`

other 的第三项也变为 `500000`

<!-- footer -->
两组中 other 的绑定都没有改变；第二组观察到的对象内容变了。

---
# 只给 l 重新赋值，other 仍找到谁？

![l 与 other 原来绑定同一列表 L。执行 l = [1000, 10000, 500000] 建立新列表 M，只有 l 改为绑定 M；other 仍绑定 L，第三项保持 100000。](assets/2026-fall/ai-agents/week-04/list-name-rebinding.svg)

---
# 修改同一个列表的第三项

![l 和 other 指向同一列表。执行 l[2] = 500000，替换列表第 3 项的指向。saved_item 仍直接指向旧整数 100000。灰色虚线表示已解除的原指向。](assets/2026-fall/ai-agents/week-04/list-slot-replacement.svg)

---
# 回到旧配置：这次改了哪一层？

![variant = source 后，两个名字指向同一个字典。执行 variant["seed"] = 2026，替换共享字典中 seed 的值关联，两个名字都看到 2026，旧整数 42 没有被改写。](assets/2026-fall/ai-agents/week-04/shared-dict-seed.svg)

---
# 只改第三项，谁的列表变了？

![source 与 variant 仍指向同一字典，沿 sample_sizes 到达同一列表。替换索引 2，也就是第 3 项的关联后，两条路径都看到 500000。](assets/2026-fall/ai-agents/week-04/shared-dict-list.svg)

---
<!-- lesson: 第二课时 -->
# 复制以后，先分别改两项

![variant = source.copy() 建立不同的外层字典。执行 variant["seed"] = 2026，只改变新字典的 seed 关联，source 仍为 42。](assets/2026-fall/ai-agents/week-04/shallow-dict-seed.svg)

---
# 浅复制以后，再改列表第三项

![外层字典虽然不同，sample_sizes 仍指向同一个列表。执行 variant["sample_sizes"][2] = 500000，source 与 variant 都看到第三项改变。](assets/2026-fall/ai-agents/week-04/shallow-dict-list.svg)

---
# 沿关系再查一层

![浅复制产生两个不同字典，但两份 sample_sizes 仍引用同一个列表。外层 is 为 False，内层 is 为 True。](assets/2026-fall/ai-agents/week-04/shallow-relations.svg)

---
# “旧配置没变”的检查也可能被骗

![before = source、variant = source 后，三个名字进入同一字典。修改共享列表第三项，before 也看到 500000，所以 source == before 仍为 True，无法证明原始内容保持。](assets/2026-fall/ai-agents/week-04/baseline-direct.svg)

---
# before 也浅复制，检查就可靠吗？

![before 是 source 的浅复制，外层字典不同，但 sample_sizes 仍共享。第三项被修改后，两边一起变成 500000，source == before 仍为 True。](assets/2026-fall/ai-agents/week-04/baseline-shallow.svg)

---
# 独立基准：谁没有跟着变？

![独立写出的 expected_source 使用独立列表，仍保留第三项 100000。variant 污染 source 后，source 的第三项变成 500000，与独立基准的内容比较为 False，污染得以暴露。](assets/2026-fall/ai-agents/week-04/baseline-independent.svg)

---
# 怎样让两版配置真正独立？

![先复制外层字典，再复制内层 sample_sizes 并替换 variant 的列表关联。source 保留旧列表，variant 改指新列表；两列表内容相等，身份不同。](assets/2026-fall/ai-agents/week-04/copy-inner-list.svg)

---
# 两层独立以后，修改 seed

![沿用两个独立字典与两个独立列表的状态。修改 variant 的 seed 关联，只让 variant 看到 2026，source 的 seed 保持 42。](assets/2026-fall/ai-agents/week-04/independent-seed.svg)

---
# 两层独立以后，修改列表第三项

![沿用两个独立列表的状态。修改 variant 列表索引 2 的关联，仅新列表的第三项变成 500000；source 的第三项仍为 100000。](assets/2026-fall/ai-agents/week-04/independent-list.svg)

---
# 换一种语言，赋值的行为相同吗？

![R 普通数值向量：a 初始化为 c(1000, 10000, 100000)，b 从 a 赋值。修改 b 的第三项为 500000 后，a 保持原值。只比较可观察的值，不表示物理内存分配。](assets/2026-fall/ai-agents/week-04/r-vector-values.svg)

---
# Bash 文本赋值：后来改的是谁？

![Bash 中 a=42 后令 b="$a"，b 保存当时展开的文本 42。随后 a=2026，b 仍是文本 42，不会随 a 更新。](assets/2026-fall/ai-agents/week-04/bash-text-values.svg)

---
<!-- lesson: 第三课时 -->
<!-- layout: columns -->
# 本周大作业：给导师维护可独立修改的实验方案

<!-- column -->
## 背景
**旧版仍能重跑**

论文已有基线

导师要求追加两份候选

<!-- column -->
## 目的
**从手工修复到重复使用**

同样的起始参数

后续可以分别调整

<!-- footer -->
`make_variant(source, seed, index, replacement)`：返回独立方案，不改 W3 报告。

---
<!-- layout: columns -->
# 一份功能，三类证据

<!-- column -->
## 内容
**结果对，基线在**

改指定参数与位置

其他内容保持

<!-- column -->
## 身份
**该隔离的层，确实独立**

结果字典独立

sample_sizes 独立

<!-- column -->
## 行为
**以后也能分别修改**

结果不影响 source

两次结果互不串扰

<!-- footer -->
本周验收配置隔离，不验收估计值是否更接近 π。

---
<!-- layout: columns -->
# 先让测试拒绝两种已知错误

<!-- column -->
## direct
**直接共享**

字典相同

列表相同

<!-- column -->
## shallow
**只复制外层**

字典不同

列表相同

<!-- column -->
## reference
**满足本题承诺**

字典不同

列表不同

<!-- footer -->
同一份测试：接受参考，拒绝两份故障；找到实际失败的断言。

---
<!-- layout: prompt -->
# 先与 Agent 写测试

请读 EXPERIMENT.txt 和函数壳，先在 tests/test_student.py 写测试，暂不修改实现。

用课程 fixture 参数 make_variant，不直接 import 候选实现。检查独立预期、原始内容、字典与 sample_sizes 的身份；预期不能来自候选输出。

用 --impl=reference、direct、shallow 运行同一份测试。解释实际失败的断言，等我核对后再实现。

---
<!-- layout: columns -->
# 根据同一份测试实现修复

<!-- column -->
## 委托 Agent
**实现固定承诺**

复制、重建或 deepcopy

测试预期不改

<!-- column -->
## 本人核验
**同一测试，真实结果**

重跑学生测试与公开验收

查看实现与 diff

<!-- footer -->
不是看到“测试通过”就结束：独立关系建立在哪里？

---
<!-- layout: tree -->
# 通过一次以后，再修改一次

```text
source ──→ 基线
first  ──→ 候选 A
second ──→ 候选 B
```

<!-- footer -->
同样参数，值相等、身份独立；只改 first，source 与 second 保持。

---
<!-- layout: columns -->
# 带着证据看代码

<!-- column -->
## 找到承诺
**旧配置保持**

预期从哪里来？

哪条断言检查它？

<!-- column -->
## 找到实现
**哪一层不再共享**

Agent 指路，本人核对

后续修改沿哪条路径？

<!-- footer -->
“用了 deepcopy”不是解释；指出实际代码兑现了哪项承诺。

---
<!-- layout: columns -->
# 保存状态与本次课回顾

<!-- column -->
## 保存
**真实进度**

实现 · 测试 · 实际输出

仍有失败：保留失败

<!-- column -->
## 回答
**名字 · 对象 · 基准**

哪一层改变？

凭什么说原始内容保持？

<!-- footer -->
配置隔离，不等于实验结论可靠。

---
<!-- layout: question -->
# 选做挑战与备用反例
> 新参数与原参数完全相同，还需要独立方案吗？

---
# 这次没改坏，不等于以后可以放心改

- 先看内容：直接共享可能通过
- 再改一份：另外两份应该保持
- 用身份或后续修改，拒绝共享故障

<!-- footer -->
只增补测试，不增加新接口；保留真实证据。
