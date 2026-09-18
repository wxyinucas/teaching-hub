# 从 T00 复现 ε–N 的先后关系

$$
\forall\varepsilon>0,\ \exists N\in\mathbb N,\ \forall n>N,
\qquad |a_n-A|<\varepsilon.
$$

- 输出：$|a_n-A|<\varepsilon$，数列项落在 $A$ 附近。
- 输入：$n>N$，检查门槛之后的整个尾部。
- 次序：先给误差，再找门槛，最后检查所有 $n>N$。

<!-- footer -->
开头可以例外，尾部可以波动；给定精度后，整段尾部不能再越界。

---
# 例题：倒推 N，再正向验证

$$
\left|\frac{(-1)^n}{n}-0\right|=\frac1n<\varepsilon
\qquad\Longleftarrow\qquad n>\frac1\varepsilon.
$$

- 倒推：正整数 $N>1/\varepsilon$ 足够。
- 写回：任给 $\varepsilon>0$，选定 $N$，对所有 $n>N$ 核验。
- 独立练习：$\displaystyle\lim_{n\to\infty}\sqrt[n]{a}=1$（$a>1$）。

<!-- footer -->
不必寻找最小的 $N$；找到一个有效的 $N$ 即可。

---
# 从原数列抽出子数列

$$
n_1<n_2<\cdots,\qquad b_k=a_{n_k},\qquad n_k\ge k.
$$

$$
a_n\to A\quad\Longrightarrow\quad a_{n_k}\to A.
$$

若 $a_n=(-1)^n$，则 $a_{2k}=1$，$a_{2k-1}=-1$。

<!-- footer -->
可以跳项，不能调序；两条子数列走向不同数值，原数列不收敛。

---
# 把数列尾部的门槛换成函数远端的门槛

$$
n>N\quad\longrightarrow\quad x>X
$$

- 数列：检查正整数 $n$；函数：检查定义域 $D$ 内所有允许的实数 $x$。
- 右端：$x>X$；左端：$x<-X$；双向：$|x|>X$。
- 双向有限极限等于 $A$，当且仅当左、右远端都趋于 $A$。

<!-- footer -->
改变的是输入范围；$|f(x)-A|<\varepsilon$ 与“范围内全体达标”不变。

---
# 例题：在函数远端验证阈值

$$
f(x)=\frac{\cos(\pi x)}{x},\qquad
f(n)=\frac{(-1)^n}{n}\quad(n\in\mathbb N).
$$

$$
|f(x)|\le\frac1{|x|}<\varepsilon
\qquad\bigl(|x|>X>1/\varepsilon\bigr).
$$

- 整数点的结果只是线索；估计必须覆盖所有足够远的实数输入。
- 同一个估计处理 $+\infty$、$-\infty$ 与双向 $\infty$。

---
# 写出函数在有限点的极限定义

设 $f:D\to\mathbb R$，$x_0$ 是 $D$ 的聚点。

$$
0<|x-x_0|<\delta
\quad\Longleftrightarrow\quad
x\in(x_0-\delta,x_0)\cup(x_0,x_0+\delta).
$$

$$
\forall\varepsilon>0,\ \exists\delta>0,\ \forall x\in D,\qquad
0<|x-x_0|<\delta\ \Longrightarrow\ |f(x)-A|<\varepsilon.
$$

- $\delta$ 限制输入离 $x_0$ 多近；$\varepsilon$ 限制输出离 $A$ 多近。
- 不检验 $x=x_0$；$f(x_0)$ 可以不存在，也可以不同于 $A$。

<!-- footer -->
远端门槛换成去心邻域；“误差先给—范围后定—全体达标”不变。
