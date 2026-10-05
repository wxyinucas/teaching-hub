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
  C,\ x^\alpha,\ \sin x,\ \cos x,\ a^x,\ \ln x\\[-.15em]
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
# 四个极限锚点

当 $u\to0$ 时：

$$
\begin{array}{rcl}
\dfrac{(1+u)^\alpha-1}{u}\to\alpha
&\Longrightarrow&
(x^\alpha)'=\alpha x^{\alpha-1}
\\[.9em]
\dfrac{\sin u}{u}\to1
&\Longrightarrow&
(\sin x)'=\cos x
\\[.9em]
\dfrac{a^u-1}{u}\to\ln a
&\Longrightarrow&
(a^x)'=a^x\ln a
\\[.9em]
\dfrac{\ln(1+u)}{u}\to1
&\Longrightarrow&
(\ln x)'=\dfrac1x
\end{array}
$$

<!-- footer -->
极限锚点只说明基本公式从哪里来。形成公式表以后，具体函数按照表达式结构递归求导。

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
