<!-- lesson: 第一课时 -->
<!-- layout: cover -->
# W4：赋值以后，到底改了什么？
> 导师要求追加实验，旧方案还在吗？

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- section: 第一课时：只改新方案，旧配置却变了 -->

---
<!-- layout: columns -->
# 从 Bash 到 Notebook：代码在哪里执行？

<!-- column -->
## Terminal
**启动另一个进程**

Bash → Python → `>>>`

退出重进：旧名字不在

<!-- column -->
## Notebook
**多个 cell，同一 kernel**

界面组织代码与输出

kernel 执行并保留状态

<!-- footer -->
终端里的 Python 与 Notebook kernel，不是同一个进程。

---
<!-- layout: columns -->
# 旧输出，不是当前状态

<!-- column -->
## 屏幕上的 42
**历史输出**

`probe = 42`

`print(probe)` → `42`

<!-- column -->
## kernel 中的 2026
**修改之后**

`probe = 2026`

重跑观察 → `2026`

<!-- footer -->
修改变量不会刷新旧输出；清空输出不等于重启 kernel。

---
<!-- layout: columns -->
# 导师要追加实验，旧配置却变了

<!-- column -->
## 昨天的基线
**保留旧图与旧表**

seed：`42`

投针数：`1000 · 10000 · 100000`

<!-- column -->
## 今天的追加
**两版同时存在**

seed：`2026`

最大投针数：`500000`

<!-- footer -->
`variant = source`：新名字，真的代表新方案吗？

---
<!-- layout: columns -->
# 内容相等，是不是同一对象？

<!-- column -->
## ==
**比较内容**

`source == variant` → `True`

`source == same_content` → `True`

<!-- column -->
## is
**比较身份**

`source is variant` → `True`

`source is same_content` → `False`

<!-- footer -->
内容相同，可以是不同对象；起新名字，不会自动复制对象。

---
<!-- layout: tree -->
# 数字没跟着变：名字重新绑定

```text
原先：seed、old_seed → 42
后来：seed → 2026
      old_seed → 42
```

<!-- footer -->
`seed = 2026`：seed 换了指向；旧整数没有被改写。

---
<!-- layout: tree -->
# 列表跟着变：对象内容被修改

```text
l、other → 同一列表
第三项：100000 → 500000
saved_item → 100000
```

<!-- footer -->
`l[2] = 500000`：改的是列表内容，不是 l 的绑定。

---
<!-- layout: columns -->
# 回到旧配置：这次改了哪一层？

<!-- column -->
## 名字 → 字典
**增加入口**

`variant = source`

字典没有复制

<!-- column -->
## 字典 → 值
**替换关联**

`variant["seed"] = 2026`

共享字典中的 seed 改变

<!-- column -->
## 字典 → 列表
**修改第三项**

sample_sizes 第三项换值

两条路径到达同一列表

<!-- footer -->
保留旧方案，不能只给它起一个新名字。

---
<!-- lesson: 第二课时 -->
<!-- section: 第二课时：复制了外层，里面仍会共享 -->

---
<!-- layout: columns -->
# 复制以后，先分别改两项

`variant = source.copy()`

<!-- column -->
## 先改 seed
**旧值保持**

source：`42`

variant：`2026`

<!-- column -->
## 再改 sample_sizes
**旧列表也变了**

source：第三项 `500000`

variant：第三项 `500000`

<!-- footer -->
`source is variant` 为 False，为什么仍然互相影响？

---
<!-- layout: tree -->
# 沿关系再查一层

```text
source  → 字典 A ─┐
                  ├→ 列表 L
variant → 字典 B ─┘
```

<!-- footer -->
字典不同，sample_sizes 仍是同一列表；浅复制只建立新外层。

---
<!-- layout: columns -->
# “旧配置没变”的检查也可能被骗

<!-- column -->
## before = source
**一起被修改**

事后 `source == before`

仍为 `True`

<!-- column -->
## 独立写出的旧配置
**不随程序改变**

事后比较原始内容

污染被发现：`False`

<!-- footer -->
浅复制快照仍可能共享列表；“预期答案”也需要独立。

---
# 怎样让两版配置真正独立？

```python
variant = source.copy()
variant["sample_sizes"] = (
    source["sample_sizes"].copy()
)
```

<!-- footer -->
新字典配新列表；本题列表里是不可变整数，复制到这一层足够。

---
<!-- layout: columns -->
# 换一种语言，赋值的行为相同吗？

<!-- column -->
## Python 列表
**共享可变对象**

`other = l`

改 l 的第三项

other 也看见

<!-- column -->
## R 普通向量
**另一绑定的值保持**

`b <- a`

改 b 的第三项

a 保持原值

<!-- column -->
## Bash 普通文本
**保存展开后的值**

`b="$a"`

后来 a 改为 `2026`

b 仍为 `42`

<!-- footer -->
相近的赋值外观，不保证相同的修改行为。

---
<!-- lesson: 第三课时 -->
<!-- section: 第三课时：与 Agent 实现，并用证据验收 -->

---
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
