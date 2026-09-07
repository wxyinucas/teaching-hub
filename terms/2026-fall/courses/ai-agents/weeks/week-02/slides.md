<!-- layout: cover -->
# W2：项目环境与可复现运行
> 理解运行条件，认识数值试验的可复现性

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- section: 第一课时：认识“项目”与“运行条件” -->

---
<!-- layout: question -->
# 屏幕上出现了结果，就算跑对了吗？
> 同一条命令，在不同项目、目录和环境中，可能不是同一件事

---
# 本周的小项目：`course-check 0.1.0`

```text
project: ai-agents-lab
version: 0.1.0
python: 3.12.x
project-env: PASS
course-mode: fixture
signature: s07
RUNTIME_CHECK=PASS
```

它报告当前事实；它不替人宣布一切正确。

---
<!-- layout: columns -->
# 六类文件，三种职责

<!-- column -->
## 项目契约
**需要什么**

`.python-version`

`pyproject.toml`

`uv.lock`

<!-- column -->
## 本节配置
**传递什么**

`signature.toml`

<!-- column -->
## 运行与检查
**实际是否满足**

`course_check.py`

`tests/`

---
<!-- layout: columns -->
# 同样是 TOML，承担不同工作

<!-- column -->
## `pyproject.toml`
**定义整个项目**

```toml
[project]
name = "ai-agents-lab"
version = "0.1.0"
```

<!-- column -->
## `signature.toml`
**只保存本节签名**

```toml
[student]
signature = "s07"
```

---
<!-- layout: columns -->
# 三种版本，回答三个问题

<!-- column -->
## Python `3.12.x`
**用什么解释器？**

<!-- column -->
## 项目 `0.1.0`
**软件自身是哪一版？**

<!-- column -->
## Git commit
**仓库记录了哪次快照？**

<!-- footer -->
本实验认识 commit，但不记录或交换 commit。

---
# 本节只走一条主链

```text
取得 → 定位 → 同步 → 运行 → 测试 → 观察
```

前三步回答“究竟在运行什么”，后三步回答“实际发生了什么”。

---
<!-- section: 第二课时：准备个人项目副本 -->

---
<!-- layout: question -->
# 今天需要编写 Python 吗？
> 不；只把 `signature.toml` 中的 `teacher` 改成自己的公开代号

---
# 从教师仓库到同学手中的 URL

```text
教师仓库
   ↓ fork
自己的 GitHub fork
   ↓ 网页修改 signature.toml
只把 fork HTTPS URL 交给同学
```

不发送签名答案、commit、截图、压缩包或 `.venv`。

---
# 唯一允许修改的位置

```text
warmups/week-02/course-check/signature.toml
```

```toml
[student]
signature = "s07"
```

`s07` 使用教师分配的公开课程代号，不写真实学号。

---
<!-- layout: prompt -->
# 让 Chatbox 带我沿主链操作

请按 W2 guide 带我完成“不影响未来的本节课实验”。每次只给一个操作，等我返回真实输出再继续，并说明当前是在取得、定位、同步、运行、测试还是观察。

只使用 guide 给出的 GitHub、Git 和 uv 路线；不要删除已有目录，不要修改测试、Python、`pyproject.toml` 或 `uv.lock`。最终只根据真实输出判断是否看到同学而非 `teacher` 的签名。

---
<!-- layout: question -->
# 第二课时交付什么？
> 只交给搭档一个信息：自己的 fork HTTPS URL

---
<!-- section: 第三课时：复现同学的运行结果 -->

---
<!-- layout: question -->
# 只收到一个 URL，我们能观察到什么？
> 从零取得项目、恢复环境，让程序自己报告同学留下的签名

---
# 先取得，再进入练习目录

```text
clone 同学的 fork
        ↓
确认 origin 与仓库根目录
        ↓
warmups/week-02/course-check
```

不要在错误目录中追求绿色结果。

---
# 从项目声明恢复局部环境

```bash
uv sync --locked
uv run --locked python -c \
  'import sys; print(sys.executable)'
```

Python 应当来自当前练习目录的 `.venv`。

---
# 同一个环境，两种检查

```bash
COURSE_MODE=fixture \
uv run --locked python course_check.py

COURSE_MODE=fixture \
uv run --locked pytest -q
```

程序报告事实，测试按照给定规则检查事实。

---
<!-- layout: question -->
# 什么时候算完成？
> 自己的机器运行与测试通过，并看到同学而非 `teacher` 的签名

---
<!-- layout: columns -->
# 这个小实验，有哪些工程影子

<!-- column -->
## 恢复环境
**声明 + 锁文件**

新机器建立运行条件

<!-- column -->
## 取得改动
**远端仓库 URL**

另一人拿到项目内容

<!-- column -->
## 检查结果
**自检 + 自动测试**

发现内容或环境异常

<!-- footer -->
正式工程还会固定 commit、tag 或构建产物；本实验主动省略。

---
# 最后只记三项

```text
我的机器：通过 / 未通过
看到的同学代号：
一项观察：
```

W3 从新的课堂入口开始，不继承本节实验目录、签名或结果。
