<!-- layout: cover -->
# W4：源码怎样变成一次运行？
> 同样的结果，为什么会有不同的运行路径？

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- section: 第一课时：同一个结果，四种语言怎样运行 -->

---
<!-- layout: question -->
# 从上周的命令提出新问题
> 源码留在磁盘；每执行一次命令，才发生一次运行

---
# 沿 `market-check` 找到 Python 的入口

```text
Bash → uv → 本项目的 Python → market-check 入口
```

```toml
[project.scripts]
market-check = "quant_lab.cli:main"
```

<!-- footer -->
VS Code 是工作界面；它不是执行这段 Python 源码的语言工具。

---
<!-- layout: columns -->
# 四种语言，完成同一件极小的事

<!-- column -->
## Python · R
**把源码交给已有的运行工具**

```bash
python3 rows.py
Rscript rows.R
```

<!-- column -->
## Rust · C
**先得到本机可执行文件，再运行**

```bash
rustc rows.rs -o "$demo_out/rows-rust"
cc rows.c -o "$demo_out/rows-c"
```

<!-- footer -->
四份程序都打印 `[trace] rows=4`；本周不要求记住四套语法。

---
<!-- layout: question -->
# `cargo run` 做了哪两件事？
> 需要时构建；然后运行生成的程序

---
# 亲眼看一次编译产物

```bash
file "$demo_out/rows-c"
vim -R -n -b "$demo_out/rows-c"
xxd -l 64 "$demo_out/rows-c"
```

源码是文本；这里看到的是本机可执行文件。

<!-- footer -->
Mac：Mach-O；WSL Linux：通常是 ELF。只读 Vim 用 `:q!` 退出。

---
<!-- layout: columns -->
# 把可见结果和内部追踪分开

<!-- column -->
## `stdout`
**给调用者的结果**

```text
rows=4
```

<!-- column -->
## `stderr`
**诊断线索**

```text
[trace] stage=entered
```

<!-- column -->
## 退出状态
**这次运行如何结束**

```text
EXIT=0
```

<!-- footer -->
输入通道 `stdin` 今天只认识名字，留待以后。

---
<!-- section: 第二课时：让自己的程序留下两处足迹 -->

---
<!-- layout: question -->
# 从演示回到自己的 W3 程序
> 继续维护唯一的 students/sXX/system/

---
# 从个人项目声明定位入口

```text
本人 pyproject.toml → [project.scripts] → market-check 的右侧
```

找两处位置：

- 取得输入路径；
- 成功读入数据。

<!-- footer -->
每个人的源码路径可以不同，不照抄教师的 `quant_lab.cli:main`。

---
<!-- layout: prompt -->
# 请 Agent 增加可开关的追踪

我的公开代号是 `s07`。请先核对你要修改的路径，只修改我的 `students/s07/system/` 中已有的 `market-check`，不要提交 Git。增加可选的 `--trace`：默认输出和 W3 失败行为不变；打开后用 `print` 与 f-string 向 `stderr` 输出两处简短追踪——取得输入路径时、成功读入数据后（含行数）。不要打印数据正文或凭证。完成后列出实际改动和验证命令，等我审查。

---
# 正常、失败、旧合同各验证一次

```text
正常输入 + --trace    → 结果与两处追踪
缺失文件 + --trace    → 明确失败与最后到达的位置
W3 公开测试           → 原有合同仍成立
```

<!-- footer -->
看真实输出、退出状态与 diff；不是让 Agent 宣称“已完成”。

---
# 保存候选状态，不急着发布

```text
入口路径 · 两次运行 · W3 测试 · 实际 diff
```

```text
READY-TRACE / HOLD-TRACE / FOLLOWED-TEACHER
```

<!-- footer -->
使用教师画面不等于本人运行成功。

---
<!-- section: 第三课时：用足迹缩小问题范围 -->

---
<!-- layout: question -->
# 预测一份新的失败输入
> 缺少 close 列：追踪几条？DATA_CHECK？退出状态？

---
<!-- layout: columns -->
# 三份证据：追踪、结果和测试可能不同步

<!-- column -->
## 没开追踪
**0 条追踪**

正常输入，`PASS`

<!-- column -->
## 读入后拒绝
**2 条追踪**

缺少 `close`，`FAIL`

<!-- column -->
## 自报成功仍有错
**2 条追踪**

自报 `PASS`，测试发现 `symbols` 错误

<!-- footer -->
分别判断：到哪里了？程序自报什么？外部证据证明什么？

---
# 在个人版本上验证“读入后仍失败”

```bash
uv run --locked market-check \
  ../../../course/week-03/tests/fixtures/missing_close.csv --trace
echo "MISSING_COLUMN_EXIT=$?"
```

先写预测，再看本人程序的真实结果；教师输出不是自己的必然输出。

---
<!-- layout: columns -->
# 给三种证据各安排一个问题

<!-- column -->
## 命令与退出码
**是否结束？怎样结束？**

<!-- column -->
## 追踪
**到过哪些内部位置？**

<!-- column -->
## 公开测试
**外部行为符合合同吗？**

---
# 保存本周真实出口

```text
命令 → 项目入口
我对一次输入的预测
实际最后一条追踪与退出状态
这些证据仍不能证明什么
```

<!-- footer -->
下次结果不符，先从哪一层找证据？
