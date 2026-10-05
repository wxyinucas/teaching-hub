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
