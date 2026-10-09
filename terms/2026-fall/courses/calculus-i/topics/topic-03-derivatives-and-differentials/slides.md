<!-- lesson: 第一次课 -->
# 本专题的问题地图

$$
\begin{gathered}
\boxed{\text{两点间的平均变化}}
\xrightarrow{\text{缩小间隔}}
\boxed{
  \begin{gathered}
  \text{导数}\\[-.15em]
  \text{一点附近的变化率}
  \end{gathered}}
\\[.55em]
\color{#5e33bf}{\swarrow\hspace{12em}\searrow}
\\[-.2em]
\begin{array}{ccc}
\boxed{
  \begin{gathered}
  \text{把它算出来}\\[-.15em]
  \text{基本答案＋组合规则}
  \end{gathered}}
&&
\boxed{
  \begin{gathered}
  \text{把它用起来}\\[-.15em]
  \text{当前斜率画出局部直线}
  \end{gathered}}
\\[.55em]
\begin{array}{cc}
\boxed{\text{高阶导数}}
&
\boxed{\text{隐函数、参数方程}}
\end{array}
&&
\boxed{\text{微分、局部线性}}
\end{array}
\end{gathered}
$$

<!-- footer -->
核心对象始终不变：一点附近的变化。

---
<!-- lesson: 第二次课 -->
# 求导算法的总图

$$
\begin{gathered}
\boxed{
  \begin{gathered}
  C,\ x^n,\ x^{-1},\ \sqrt x,\ \sin x,\ a^x,\ \ln x\\[-.15em]
  \text{基本部件（叶子）}
  \end{gathered}}
\longrightarrow
\boxed{
  \begin{gathered}
  +,-,\times,\div,\circ,(\cdot)^{-1}\\[-.15em]
  \text{运算节点}
  \end{gathered}}
\longrightarrow
\boxed{\text{具体函数的表达式树}}
\\[.65em]
\color{#5e33bf}{\downarrow\ \text{识别最外层节点}}
\\[.25em]
\boxed{\text{套用节点法则，并对子式递归}}
\\[.55em]
\color{#5e33bf}{\downarrow\ \text{到达叶子}}
\\[.25em]
\boxed{\text{调用基本公式}}
\\[.55em]
\color{#5e33bf}{\downarrow\ \text{逐层回代并合并}}
\\[.25em]
\boxed{f'(x)}
\end{gathered}
$$

<!-- footer -->
与连续性的组织方式相同：先固定基本部件，再依靠运算法则覆盖具体表达式。

---
# 基本公式的两条来源线

$$
\begin{array}{cc}
\begin{gathered}
\text{第一重要极限}\\[.25em]
\boxed{\dfrac{\sin u}{u}\to1}\\[.7em]
\Downarrow\\[.45em]
\sin x,\cos x\text{ 的导数}
\end{gathered}
&
\begin{gathered}
\text{第二重要极限}\\[.25em]
\boxed{(1+u)^{1/u}\to e}\\[.55em]
\Downarrow\ {\scriptstyle \ln\text{ 连续}}\\[.35em]
\boxed{\dfrac{\ln(1+u)}u\to1}\\[.55em]
\Downarrow\ {\scriptstyle \exp,\ln\text{ 互逆}}\\[.35em]
\boxed{\dfrac{e^u-1}u\to1}\\[.55em]
\Downarrow\ {\scriptstyle a^u=e^{u\ln a}}\\[.35em]
\boxed{\dfrac{a^u-1}u\to\ln a}\\[.55em]
\Downarrow\\[.35em]
\ln x,\ e^x,\ a^x\text{ 的导数}
\end{gathered}
\end{array}
$$

<!-- footer -->
右侧只使用函数型第二重要极限，以及指数、对数函数连续、互逆和满足运算律的既有理论；没有调用导数。

---
# 函数的和、积、复合与商

$$
\left\{
\begin{aligned}
(f+g)(x)&=f(x)+g(x),\\
(fg)(x)&=f(x)g(x),\\
(f\circ g)(x)&=f(g(x)),\\
\left(\frac fg\right)(x)&=\frac{f(x)}{g(x)},
\qquad g(x)\ne0.
\end{aligned}
\right.
$$

<!-- footer -->
$fg$ 表示函数的积；$f\circ g$ 才表示先算 $g$ 、再把结果送入 $f$ 。

---
# 乘积结构与复合结构

$$
\begin{array}{cc}
\boxed{
\begin{gathered}
y=x\cdot x\\[-.1em]
\text{两个函数并列相乘}
\end{gathered}}
&
\boxed{
\begin{gathered}
y=\sin(x^2)\\[-.1em]
x\longrightarrow u=x^2\longrightarrow y=\sin u
\end{gathered}}
\\[1em]
(x\cdot x)'=2x\ne x'\cdot x'=1
&
(\sin(x^2))'=\cos(x^2)\cdot2x
\end{array}
$$

<!-- footer -->
积法则处理两个因子的并列变化；复合函数求导法则处理内、外两层的变化传递。

---
# 积函数的增量

$$
\left\{
\begin{aligned}
\Delta f&=f(x+\Delta x)-f(x),\\
\Delta g&=g(x+\Delta x)-g(x).
\end{aligned}
\right.
$$

$$
\begin{array}{c|cc}
&f(x)&\Delta f\\
\hline
g(x)&f(x)g(x)&g(x)\Delta f\\[.35em]
\Delta g&f(x)\Delta g&\Delta f\,\Delta g
\end{array}
$$

$$
\boxed{
\Delta(fg)=g(x)\Delta f+f(x)\Delta g+\Delta f\,\Delta g
}
$$

<!-- footer -->
矩形只演示 $f(x),g(x),\Delta f,\Delta g$ 均为正的情形；代数展开适用于一般情形。

---
# 函数的乘积求导

$$
\begin{aligned}
\frac{\Delta(fg)}{\Delta x}
={}&g(x)\frac{\Delta f}{\Delta x}
+f(x)\frac{\Delta g}{\Delta x}\\
&+\frac{\Delta f}{\Delta x}
  \frac{\Delta g}{\Delta x}\Delta x.
\end{aligned}
$$

$$
\Delta x\to0
\qquad\Longrightarrow\qquad
\boxed{(fg)'(x)=f'(x)g(x)+f(x)g'(x)}
$$

<!-- footer -->
一个因子求导时，另一个因子原样保留；交换角色再做一次，最后相加。

---
# 复合函数：变化率逐层传递

$$
\begin{gathered}
x
\xrightarrow{\ u=g(x)\ }
u
\xrightarrow{\ y=f(u)\ }
y
\\[.9em]
\Delta x
\xrightarrow{\ \text{局部倍率 }g'(x)\ }
\Delta u
\xrightarrow{\ \text{局部倍率 }f'(u)\ }
\Delta y
\\[.9em]
\boxed{
\frac{dy}{dx}
=\frac{dy}{du}\frac{du}{dx}
=f'\!\bigl(g(x)\bigr)\,g'(x)
}
\end{gathered}
$$

<!-- footer -->
两段差商把 $\Delta x\to\Delta u\to\Delta y$ 连起来；严格证明还要单独补齐 $\Delta u=0$ 的情形。

---
# 实数次数幂函数的导数

对 $x>0$，

$$
\begin{aligned}
x^\alpha&=e^{\alpha\ln x},\\[.35em]
(x^\alpha)'
&=(e^{\alpha\ln x})'\\
&=e^{\alpha\ln x}\cdot\frac{\alpha}{x}\\
&=\alpha x^{\alpha-1}.
\end{aligned}
$$

$$
\boxed{(x^\alpha)'=\alpha x^{\alpha-1}\qquad(x>0)}
$$

<!-- footer -->
指数函数、对数函数与链式法则已经齐备；正整数幂在全体实数上的结论仍由二项式展开保证。

---
# 商函数的结构

$$
\left(\frac fg\right)(x)
=\frac{f(x)}{g(x)}
=\underbrace{f(x)}_{\text{第一个因子}}
\cdot
\underbrace{\frac1{g(x)}}_{\text{第二个因子}},
\qquad g(x)\ne0.
$$

$$
x
\xrightarrow{\ u=g(x)\ }
u
\xrightarrow{\ \text{取倒数}\ }
\frac1{g(x)}
$$

$$
\left(\frac1{g(x)}\right)'
=-\frac{g'(x)}{[g(x)]^2}
\qquad\Longrightarrow\qquad
\boxed{
\left(\frac fg\right)'(x)
=\frac{f'(x)g(x)-f(x)g'(x)}{[g(x)]^2}
}
$$

<!-- footer -->
商函数先拆成乘积，其中第二个因子是分母函数与倒数函数的复合。

---
# 商法则的两条路线

$$
\begin{array}{c|c|c}
&\text{运算法则路线}&\text{定义路线}\\
\hline
\text{起点}
&f/g=f\cdot(1/g)
&\text{商函数的差商}\\[.45em]
\text{拆分}
&\text{积法则＋倒数函数的复合}
&\text{通分＋函数增量}\\[.45em]
\text{终点}
&\dfrac{f'g-fg'}{g^2}
&\dfrac{f'g-fg'}{g^2}
\end{array}
$$

$$
\boxed{
\left(\frac fg\right)'(x)
=\frac{f'(x)g(x)-f(x)g'(x)}{[g(x)]^2}
}
$$

<!-- footer -->
定义路线直接追踪增量；运算法则路线复用已经建立的抽象结论。

---
# 基本初等函数的导数：常数与幂函数

$$
\begin{array}{c|c|c}
\text{函数}&\text{导数}&\text{条件}\\
\hline
C&0&x\in\mathbb R\\
x^n&nx^{n-1}&n\in\mathbb N^+, x\in\mathbb R\\
x^\alpha&\alpha x^{\alpha-1}&\alpha\in\mathbb R, x>0\\
1/x&-1/x^2&x\ne0\\
\sqrt x&1/(2\sqrt x)&x>0
\end{array}
$$

<!-- footer -->
$x^\alpha$ 的统一表示使用 $x>0$；具体指数可以按函数本身判断更大的定义域。

---
# 基本初等函数的导数：指数、对数与三角函数

$$
\begin{array}{c|c||c|c}
\text{函数}&\text{导数}&\text{函数}&\text{导数}\\
\hline
e^x&e^x&\sin x&\cos x\\
a^x&a^x\ln a&\cos x&-\sin x\\
\ln x&1/x&\tan x&\sec^2x\\
\log_a x&1/(x\ln a)&\cot x&-\csc^2x\\
&&\sec x&\sec x\tan x\\
&&\csc x&-\csc x\cot x
\end{array}
$$

<!-- footer -->
$a^x,\log_a x$ 要求 $a>0,a\ne1$，对数的真数为正；$\tan x,\sec x$ 要求 $\cos x\ne0$，$\cot x,\csc x$ 要求 $\sin x\ne0$。

---
# 导数的四类运算法则

$$
\left\{
\begin{aligned}
(af+bg)'&=af'+bg',\\
(fg)'&=f'g+fg',\\
(f\circ g)'&=(f'\circ g)g',\\
\left(\frac fg\right)'&=\frac{f'g-fg'}{g^2},
\qquad g(x)\ne0.
\end{aligned}
\right.
$$

$$
\boxed{
\text{基本公式给出部件，运算法则负责组合}
}
$$

<!-- footer -->
$a,b$ 是常数；使用每条法则前，先确认函数在当前点有定义并满足可导条件。

---
<!-- lesson: 第三次课 -->
# 对数求导：先改写结构

$$
\begin{array}{rcl}
y=[f(x)]^{g(x)}
&\xrightarrow{\ \text{取对数}\ }&
\ln y=g(x)\ln f(x)
\\[1.15em]
y=\dfrac{p(x)^\alpha q(x)^\beta}{r(x)^\gamma}
&\xrightarrow{\ \text{取对数}\ }&
\ln y=
\alpha\ln p+\beta\ln q-\gamma\ln r
\end{array}
$$

$$
\boxed{\text{幂变乘积，乘变加，除变减}}
$$

<!-- footer -->
对数只负责拆结构；改写以后，仍然调用积法则、链式法则和基本公式。
