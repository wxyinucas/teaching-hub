<!-- lesson: 第一课时 -->
<!-- layout: cover -->
# 名字的指向变了，还是对象的内容变了？
> W4：赋值以后，到底改了什么？

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
# 两个名字，看同一次整数操作

```python
x = 1000
y = x
x += 1
print(x, y)
```

<!-- footer -->
结果：`1001 1000`。原来的整数改了吗？`y` 为什么仍看到 `1000`？

---
<!-- layout: tree -->
# 变化发生在名字到对象的关系上

```text
操作前：x ─┐
           ├→ A：1000
        y ─┘

操作后：x ───→ B：1001
        y ───→ A：1000
```

<!-- footer -->
`x` 重新绑定到计算结果；原来的整数对象没有被改写。

---
# 同样留下第二个名字，列表会怎样？

```python
l = [10, 20, 30]
other = l
saved_item = l[2]
l[2] += 1
print(l, other, saved_item)
```

<!-- footer -->
两边都看到 `[10, 20, 31]`；`saved_item` 仍为 `30`。改变的是哪一层？

---
<!-- layout: columns -->
# 值相等，是否就是同一个对象？

`a = [1, 2]`　`b = [1, 2]`　`c = a`

<!-- column -->
## ==：值是否相等
**内容比较**

`a == b` → `True`

`a == c` → `True`

<!-- column -->
## is：是否同一对象
**身份比较**

`a is b` → `False`

`a is c` → `True`

<!-- footer -->
修改 `a[0]` 后，`b` 和 `c` 谁会看到变化？先画关系，再运行。

---
# 变量名、对象身份与内存位置

```python
a = [1, 2]
old = a
before_id = id(a)
a[0] = 9
print(a is old, id(a) == before_id)
```

<!-- footer -->
两项都是 `True`，内容却变了。`id` 是对象身份；CPython 中对应对象地址。

---
<!-- layout: columns -->
# 字符串为什么不能照着列表改？

<!-- column -->
## 尝试改一个字符
**不可原地修改**

```python
s = "cat"
s[1] = "u"
```

结果：`TypeError`

<!-- column -->
## 取得不同文本的结果
**名字重新绑定**

```python
s = "cat"
old = s
s = s.replace("a", "u")
print(s, old, s is old)
```

结果：`cut cat False`

---
<!-- lesson: 第二课时 -->
<!-- layout: question -->
# 同样的赋值，究竟改变了哪一层？
> 看操作对象，画最终关系，分别检查内容和身份。

---
<!-- layout: columns -->
# 两种写法，相同输出，不同关系

<!-- column -->
## 内置列表的 +=
**原地扩展**

```python
a = [1, 2]
b = a
a += [3]
print(b, a is b)
```

`[1, 2, 3] True`

<!-- column -->
## 相加后赋给 a
**重新绑定**

```python
a = [1, 2]
b = a
a = a + [3]
print(b, a is b)
```

`[1, 2] False`

<!-- footer -->
`a` 的输出一样；另一个名字揭示了不同关系。`+=` 的行为由对象类型决定。

---
<!-- layout: columns -->
# 字典：换关联，与改被关联的对象

<!-- column -->
## 替换键对应的值
**字典内容变了**

```python
d = {"k": 10}
value = d["k"]
d["k"] = 99
print(value, d["k"])
```

`10 99`

<!-- column -->
## 修改键关联的列表
**列表内容变了**

```python
d = {"k": [10]}
value = d["k"]
d["k"].append(99)
print(value, d["k"] is value)
```

`[10, 99] True`

<!-- footer -->
名字 → 字典 → 键关联的对象。先判断变化发生在哪一层。

---
<!-- layout: columns -->
# 同一个关系问题，R 与 Bash 怎样表达？

<!-- column -->
## R：普通向量
**修改后的值**

```r
a <- c(10, 20, 30)
b <- a
b[3] <- 99
print(a)
print(b)
```

`a` 保持原值；`b` 第三项变为 `99`。

<!-- column -->
## Bash：普通变量
**保存展开后的文本**

```bash
a=cat
b="$a"
a=cut
printf '%s %s\n' "$a" "$b"
```

输出：`cut cat`

<!-- footer -->
R 普通向量呈现修改时复制的值语义；本例 Bash 没有 Python 列表式的共享关系。

---
# 怎么保存“修改前”的证据？

```python
source = {"alpha": 0.05, "data": [10, 20, 30]}
variant = source.copy()
print(source is variant)
print(source["data"] is variant["data"])
variant["alpha"] = 0.01
variant["data"][2] = 99
print(source)
```

<!-- footer -->
身份检查：`False`、`True`。原始记录的 `alpha` 没变，`data` 却被修改了。

---
<!-- layout: tree -->
# 外层独立，不保证里面的数据独立

```text
source  → 字典 A → alpha：0.05
                 → data ─┐
                         ├→ 列表 L
variant → 字典 B → data ─┘
                 → alpha：0.01
```

<!-- footer -->
旧引用用于身份比较；独立快照用于检查修改前的内容。

---
# 开始探索：新方案不能污染原始记录

```text
make_variant(source, alpha, index, replacement)
```

```python
source = {"alpha": 0.05, "data": [10, 20, 30]}
# alpha=0.01, index=2, replacement=99
# 结果：{"alpha": 0.01, "data": [10, 20, 99]}
```

<!-- footer -->
输入均合法；原始记录保持不变。测试结果，也测试需要隔离的对象关系。

---
<!-- lesson: 第三课时 -->
<!-- layout: question -->
# 用测试证明：修改副本，保留原始记录
> 先让测试拒绝错误，再实现并核验实际证据。

---
<!-- layout: prompt -->
# 与 Agent 先写能拒绝错误的测试

请先读本周实验说明和现有函数壳，与我一起设计 `make_variant` 的测试，暂不修改实现。

检查正确结果、原始内容不变、结果字典与 `data` 列表的独立性；再检查修改结果和两次结果是否互相干扰。每个预期值先解释依据。

先运行教师给的“直接共享”和“只复制外层”故障版本，记录实际失败，再停下来让我检查。

---
<!-- layout: prompt -->
# 再实现，追踪每个对象关系

根据已检查的测试，在本周允许修改的实验范围内实现 `make_variant`。

请说明 `source`、结果字典和两份 `data` 列表之间的关系；选择能满足验收的复制或重建方式。

运行测试，列出实际改动和结果，再停下让我检查。

---
<!-- layout: columns -->
# 验收看值，也看关系

<!-- column -->
## 结果与原件
**内容证据**

结果符合独立预期

原始内容保持不变

<!-- column -->
## 对象隔离
**身份证据**

结果字典独立

结果 `data` 列表独立

<!-- column -->
## 后续修改
**行为证据**

修改结果不影响原件

两次结果互不干扰

<!-- footer -->
不可变数字与字符串不必拥有不同身份；隔离针对任务需要修改的对象。

---
# 在实验分支保存与核对模拟远端

- 改动在本次实验分支
- 基准分支保持初始状态
- 提交含已检查的实现与测试
- 模拟远端分支与本地提交一致

<!-- footer -->
成功 push 证明交付状态；程序是否正确，仍看测试与实际产物。

---
<!-- layout: columns -->
# 用三种证据作出本周判断

<!-- column -->
## 是否同一对象？
**保留旧引用**

用 `is`／`id`

不能推出内容没变

<!-- column -->
## 值是否相等？
**比较值**

用 `==`

不能推出是同一对象

<!-- column -->
## 原始内容是否保持？
**独立内容快照**

比较前后内容

不能保证所有将来操作

---
# 保存真实状态，解释改变了什么

1. 原来的预测
2. 哪一层关系或内容改变
3. 身份、值与快照的实际证据
4. 证据仍不能证明什么

<!-- footer -->
工作版：实验包入口、取得方式、测试命令、预设分支和模拟远端待落实。
