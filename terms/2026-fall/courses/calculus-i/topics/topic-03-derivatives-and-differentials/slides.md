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
\begin{array}{c@{\qquad\qquad}c}
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
<!-- lesson: 第三次课 -->
# 链式法则：变化率逐层传递

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
(f\circ g)'(x)
=
f'\!\bigl(g(x)\bigr)\,g'(x)
}
\end{gathered}
$$

<!-- footer -->
每经过一层，乘上这一层的局部变化率；沿同一关系反向走时，在原导数非零处取倒数。

---
# 一般实数幂：现在再来证明

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
