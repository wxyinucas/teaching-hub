<!-- lesson: 第一课时 -->
<!-- layout: cover -->
# W8：从新项目到数据分析
> 建立 · 修改 · 接续

AI Agents · 王晓宇 · 中国海洋大学 · 2026 秋

---
<!-- layout: question -->
# 建立项目，并应对需求变化
> 完成分析 → 新增实验 → 检查旧批次

---
<!-- layout: columns -->
# 真参数与估计结果

<!-- column -->
## 生成机制
**已知真值**

$y=1+2x+\varepsilon$

噪声：相对真实直线

<!-- column -->
## 数据分析
**根据样本估计**

$\hat y=\hat\beta_0+\hat\beta_1x$

残差：相对拟合直线

<!-- footer -->
一次估计偏离真值，不等于程序出错。

---
<!-- lesson: 第二课时 -->
<!-- layout: question -->
# 解释工程设计，配置语言工作台
> 看见改动的代价，再解释设计的用途

---
<!-- layout: columns -->
# 代码、配置与批次

<!-- column -->
## 代码
**怎样计算**

生成 · 分析 · 检查

<!-- column -->
## 配置
**本次做什么**

样本量 · 参数 · seed

<!-- column -->
## 批次
**这份数据从哪来**

CSV · 配置快照 · 时间

<!-- footer -->
批次命名帮助查找；Git 记录代码与配置历史。

---
<!-- layout: columns -->
# 同一个 IDE，三种职责

<!-- column -->
## 扩展
**编辑与交互**

提示 · 导航 · 终端

<!-- column -->
## 语言环境
**执行代码**

Python · R · MATLAB

<!-- column -->
## Agent
**协助开发**

解释 · 修改 · 排错

<!-- footer -->
本节运行 Python、R；MATLAB 配置编辑与导读。

---
<!-- lesson: 第三课时 -->
<!-- layout: question -->
# 连接数据库，接续外部数据
> 取回记录，沿用分析，分别核验证据

---
<!-- layout: tree -->
# 数据怎样进入分析？

```text
本机 Python ──请求──→ PostgreSQL
    ↑                    │
    └───── 查询结果 ──────┘
            ↓
 CSV → 原分析 → 图与系数
```

<!-- footer -->
服务地址 · 身份 · 权限 · 实际响应
