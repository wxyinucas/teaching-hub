<!-- lesson: 第一次课 -->
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
# 函数远端的输入范围

$$
\begin{array}{rcl}
x\to+\infty:\ x>X
&& \color{#5e33bf}{\underset{X}{\circ}\;\xrightarrow{\hspace{6em}}\;+\infty}
\\[1.15em]
x\to-\infty:\ x<-X
&& \color{#5e33bf}{-\infty\;\xleftarrow{\hspace{6em}}\;\underset{-X}{\circ}}
\\[1.15em]
|x|\to\infty:\ |x|>X
&& \color{#5e33bf}{-\infty\;\xleftarrow{\hspace{3em}}\;\underset{-X}{\circ}
\qquad
\underset{X}{\circ}\;\xrightarrow{\hspace{3em}}\;+\infty}
\end{array}
$$

- 数列只检查正整数 $n>N$；函数检查定义域 $D$ 内范围中的全部允许实数 $x$。

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
# 有限点附近的去心邻域

$$
\begin{array}{ccccc}
x_0-\delta && x_0 && x_0+\delta
\\[-.25em]
\color{#5e33bf}{\circ}
& \color{#5e33bf}{\rule[.35ex]{6em}{.12em}}
& \color{#5e33bf}{\circ}
& \color{#5e33bf}{\rule[.35ex]{6em}{.12em}}
& \color{#5e33bf}{\circ}
\end{array}
$$

$$
0<|x-x_0|<\delta
\quad\Longleftrightarrow\quad
x\in(x_0-\delta,x_0)\cup(x_0,x_0+\delta).
$$

- 三个端点都不包含；真正接受检验的只有范围内属于定义域 $D$ 的点。

<!-- footer -->
输入离 $x_0$ 足够近，但不取 $x_0$ 本身。

---
# 写出函数在有限点的极限定义

设 $f:D\to\mathbb R$，$x_0$ 是 $D$ 的聚点。

$$
\forall\varepsilon>0,\ \exists\delta>0,\ \forall x\in D,\qquad
0<|x-x_0|<\delta\ \Longrightarrow\ |f(x)-A|<\varepsilon.
$$

- $\delta$ 限制输入离 $x_0$ 多近；$\varepsilon$ 限制输出离 $A$ 多近。
- 不检验 $x=x_0$；$f(x_0)$ 可以不存在，也可以不同于 $A$。

<!-- footer -->
远端门槛换成去心邻域；“误差先给—范围后定—全体达标”不变。

---
<!-- lesson: 第二次课 -->
# 再看“输入过程的描述”

$$
\begin{aligned}
x\to x_0 &: \quad 0<|x-x_0|<\delta,\\
x\to +\infty &: \quad x>X,\\
x\to -\infty &: \quad x<-X,\\
x\to \infty &: \quad |x|>X.
\end{aligned}
\qquad\Longrightarrow\qquad |f(x)-A|<\varepsilon
$$

- $x_0$ 必须是定义域的聚点；$x_0$ 本身可以不属于定义域。
- $\infty$ 不是实数，只描述输入不断离开有限范围的过程。

<!-- footer -->
输入条件随趋近方式改变；输出误差与“范围内全体达标”不变。

---
# 函数在有限点处的极限

$$
\forall\varepsilon>0,\ \exists\delta>0,\ \forall x\in D,\qquad
0<|x-x_0|<\delta\ \Longrightarrow\ |f(x)-A|<\varepsilon.
$$

- 输入：$x$ 在定义域中靠近 $x_0$，但不取 $x_0$。
- 输出：$f(x)$ 落在 $A$ 的 $\varepsilon$ 带内。
- 次序：先给 $\varepsilon$，再选 $\delta$，最后检查范围内所有允许的 $x$。

<!-- footer -->
$f(x_0)$ 不参与检验；邻域内的函数值可以波动，但必须全部达标。

---
# 单侧极限的两个输入范围

$$
\begin{aligned}
x\to x_0^-&:\quad 0<x_0-x<\delta,\\
x\to x_0^+&:\quad 0<x-x_0<\delta.
\end{aligned}
$$

- 只取定义域 $D$ 中相应一侧的输入。
- 两侧都要求 $|f(x)-A|<\varepsilon$；$x_0$ 本身仍不参加。
- $\varepsilon$ 先给，$\delta$ 后定，范围内的每个允许输入都要达标。

---
# 双侧极限由左右极限共同决定

$$
\lim_{x\to x_0}f(x)=A
\quad\Longleftrightarrow\quad
\lim_{x\to x_0^-}f(x)
=\lim_{x\to x_0^+}f(x)=A.
$$

左右两侧都能从定义域取点趋近 $x_0$。

$$
\delta=\min\{\delta_-,\delta_+\}
$$

<!-- footer -->
两侧各自达标，还必须指向同一个 $A$。

---
# 函数在无穷远处的极限

$$
\begin{aligned}
x\to+\infty &: \quad x>X,\\
x\to-\infty &: \quad x<-X,\\
x\to\infty &: \quad |x|>X
\end{aligned}
\qquad\Longrightarrow\qquad |f(x)-A|<\varepsilon.
$$

- 每一行都按“任给 $\varepsilon>0$，存在 $X>0$，对定义域内全部允许输入”读取。
- 双向无穷远极限等于 $A$，当且仅当正、负无穷远处的极限都等于 $A$。

<!-- footer -->
越过门槛只是输入条件；门槛之外的每一个允许输入都必须满足同一个误差要求。

---
# 题型：用定义证明有限点处的函数极限

$$
\lim_{x\to1}(5x+1)=6,
\qquad |(5x+1)-6|=5|x-1|,
\qquad \delta=\frac{\varepsilon}{5}.
$$

<!-- footer -->
教材第 20 页例 7；从输出误差倒推输入距离，再按定义次序正向核验。

---
# 例题：用固定邻域控制辅助因子

$$
\lim_{x\to2}x^2=4,
\qquad |x^2-4|=|x-2|\,|x+2|.
$$

$$
|x-2|<1\quad\Longrightarrow\quad |x+2|<5.
$$

- 倒推：$\delta=\min\{1,\varepsilon/5\}$。
- 写回：任给 $\varepsilon>0$ 后选定 $\delta$，再核验所有 $0<|x-2|<\delta$ 的输入。

---
# 课堂练习：用定义证明去心化简后的极限

$$
\lim_{x\to2}\frac{x-2}{x^2-4}=\frac14.
$$

$$
\left|\frac{x-2}{x^2-4}-\frac14\right|
=\frac{|x-2|}{4|x+2|}.
$$

$$
|x-2|<1\quad\Longrightarrow\quad |x+2|>3,
\qquad
\delta=\min\{1,12\varepsilon\}.
$$

<!-- footer -->
教材第 20 页例 8；$x=2$ 时原式无定义，但点值不参与极限判断。

---
# 题型：用左右极限判断分段函数

$$
\operatorname{sgn}x=
\begin{cases}
1,&x>0,\\
0,&x=0,\\
-1,&x<0.
\end{cases}
$$

$$
\lim_{x\to0^-}\operatorname{sgn}x=-1,
\qquad
\lim_{x\to0^+}\operatorname{sgn}x=1.
$$

<!-- footer -->
教材第 22 页例 9；$f(0)=0$ 不改变双侧极限不存在的结论。

---
# 课堂练习：左右一致但点值不同

$$
g(x)=
\begin{cases}
x+1,&x<1,\\
9,&x=1,\\
3-x,&x>1.
\end{cases}
$$

- 分别判断 $x\to1^-$、$x\to1^+$ 与 $x\to1$ 的极限。
- $g(1)=9$ 会改变这些极限吗？

---
# 定理：用取点数列刻画函数极限（海涅定理）

设 $x_0$ 是 $D$ 的聚点。对每个取点数列 $(x_n)$：

$$
x_n\in D\setminus\{x_0\},\quad x_n\to x_0
\quad\Longrightarrow\quad f(x_n)\to A.
$$

上述要求对每一列都成立，当且仅当 $\lim_{x\to x_0}f(x)=A$。

<!-- footer -->
可选例题：符号函数在 $1/n$ 与 $-1/n$ 上分别取值 $1$ 与 $-1$。

---
# 题型：用两条取点列否定函数极限

$$
x_n=\frac1{\pi/2+2n\pi},
\qquad
y_n=\frac1{3\pi/2+2n\pi}.
$$

$$
x_n,y_n\to0,
\qquad
\sin\frac1{x_n}=1,
\qquad
\sin\frac1{y_n}=-1.
$$

<!-- footer -->
两种允许的取点方式给出不同结果，足以否定有限极限存在。

---
# 定理：函数极限的四个局部性质

- **唯一性**：极限若存在，只能有一个。
- **局部有界性**：充分靠近 $x_0$ 时，$|f(x)|\le M$。
- **局部保号性**：若极限 $A>0$（或 $A<0$），则函数在局部保持同号。
- **局部保序性**：若局部恒有 $f(x)\le g(x)$，则两者的有限极限满足 $A\le B$。

$$
|f(x)-A|<1\quad\Longrightarrow\quad |f(x)|<|A|+1.
$$

<!-- footer -->
这些结论只控制某个去心邻域，不要求整个定义域都如此。

---
# 定理：极限的四则运算与复合运算

若 $f(x)\to A$、$g(x)\to B$，则

$$
\lim(f\pm g)=A\pm B,
\qquad
\lim(fg)=AB,
\qquad
\lim\frac fg=\frac AB\quad(B\ne0).
$$

- 商法则先核对分母的极限不为 $0$。
- 复合极限先核对内层函数值满足外层极限的取点条件。
- 外层函数在目标点连续时，才可以直接使用其点值。

<!-- footer -->
先确认极限存在和附加条件，再做代数运算。

---
# 定理：三明治准则

在同一个局部范围内，若

$$
g(x)\le f(x)\le h(x),
\qquad
\lim g(x)=\lim h(x)=A,
$$

则

$$
\lim f(x)=A.
$$

<!-- footer -->
先构造上下界，再确认两侧趋向同一个结果。

---
# 题型：为振荡函数构造上下界

$$
-|x|\le x\sin\frac1x\le |x|
\qquad\Longrightarrow\qquad
\lim_{x\to0}x\sin\frac1x=0.
$$

- $\sin(1/x)$ 本身没有极限，不能直接使用乘法法则。
- 振荡没有消失，但振幅被趋向 $0$ 的上下界压住。
- 课堂练习：判断 $\displaystyle\lim_{x\to0}x^2\cos\frac1x$。

---
# 定理：第一重要极限

对 $0<x<\pi/2$，由单位圆中的面积关系得到

$$
\frac12\sin x\le\frac12x\le\frac12\tan x
\quad\Longrightarrow\quad
\cos x\le\frac{\sin x}{x}\le1.
$$

<!-- footer -->
面积关系只给出夹逼框架；还必须确认下界 $\cos x$ 的极限。

---
# 夹逼前先补齐 cos x → 1

又由 $|\sin u|\le|u|$，

$$
0\le1-\cos x
=2\sin^2\frac x2
\le\frac{x^2}{2}\longrightarrow0.
$$

因此 $\cos x\to1$；结合偶性与夹逼准则，

$$
\lim_{x\to0}\frac{\sin x}{x}=1.
$$

<!-- footer -->
这里没有使用尚未建立的三角函数连续性。

---
# 定理：单调有界数列必有极限

$$
\begin{aligned}
\text{单调递增且有上界}
&\Longrightarrow a_n\to\sup\{a_n:n\in\mathbb N\},\\
\text{单调递减且有下界}
&\Longrightarrow a_n\to\inf\{a_n:n\in\mathbb N\}.
\end{aligned}
$$

- 单调但无界，不能保证收敛到有限实数。
- 有界但不单调，也可能持续振荡。
- 准则先保证极限存在；极限值仍需继续辨认。
