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
<!-- lesson: 第三次课 -->
# 从函数值取倒数到反函数求导

$$
\begin{array}{c}
\boxed{\text{已有工具：积法则＋复合函数求导法则}}
\\[.45em]
\downarrow\quad
\text{拆：}\displaystyle\frac fg=f\cdot\frac1g
\\[.45em]
\boxed{\text{商法则}}
\\[.45em]
\downarrow\quad
\text{辨：函数值取倒数}\ne\text{交换输入输出}
\\[.45em]
\boxed{\text{反函数求导}\longrightarrow\text{反三角函数}}
\\[.45em]
\downarrow\quad
\text{重复与改写}
\\[.45em]
\boxed{fgh,\ f(g(h(x))),\ [f(x)]^{g(x)}}
\end{array}
$$

<!-- footer -->
本次课只做四个动作：拆、辨、重复、改写；新结构始终要接回已有法则。

---
# 链式法则

$$
\begin{gathered}
u=g(x),\qquad y=f(u)=f(g(x)),\qquad u_0=g(x_0),
\\[1em]
g\text{ 在 }x_0\text{ 处可导},
\qquad
f\text{ 在 }u_0\text{ 处可导},
\\[1em]
\boxed{
(f\circ g)'(x_0)
=f'(g(x_0))g'(x_0)
},
\\[1.1em]
x\longrightarrow u=g(x)\longrightarrow y=f(u),
\qquad
\boxed{
\frac{dy}{dx}=\frac{dy}{du}\frac{du}{dx}
}.
\end{gathered}
$$

<!-- footer -->
“链式”指变化率沿输入链逐层相乘；$d$ 不是普通的数，不把公式只理解为机械约分。

---
# 负底数上的有理数次幂

$$
\begin{gathered}
\alpha=\frac pq,
\qquad
 p,q\text{ 互质},
\qquad
q>0\text{ 为奇数},
\qquad
x<0,
\\[1.2em]
\boxed{
x^{p/q}=\left(\sqrt[q]{x}\right)^p
       =(-1)^p(-x)^{p/q}
}.
\end{gathered}
$$

$$
\begin{array}{c|c}
\text{指数} & x<0\text{ 时的实数意义}\\
\hline
p/q\text{ 最简，}q\text{ 为奇数} & \text{有}\\
p/q\text{ 最简，}q\text{ 为偶数} & \text{通常没有}\\
\alpha\text{ 为无理数} & \text{通常没有}
\end{array}
$$

<!-- footer -->
先把 $p/q$ 约成最简形式；$x=0$ 是否有定义、是否可导，需按具体指数另行判断。

---
# 负底数有理数次幂的导数

$$
\begin{aligned}
\frac{d}{dx}x^{p/q}
&=\frac{d}{dx}\left[(-1)^p(-x)^{p/q}\right]\\
&=(-1)^p\frac pq(-x)^{p/q-1}(-1)\\
&=\boxed{\frac pq x^{p/q-1}}.
\end{aligned}
$$

$$
\boxed{
(x^\alpha)'=\alpha x^{\alpha-1},
\qquad
x<0,
\quad
\alpha=\frac pq,
\quad
q\text{ 为奇数}
}
$$

<!-- footer -->
把负底数写成正底数 $-x$ 后，调用正底数幂函数公式与链式法则；本页按现场容量选讲。

---
# 商函数的结构

$$
\begin{gathered}
\left(\frac fg\right)(x)
=f(x)\cdot\frac1{g(x)},
\qquad g(x)\ne0,
\\[.8em]
x
\xrightarrow{\ u=g(x)\ }
u
\xrightarrow{\ \text{取倒数}\ }
\frac1{g(x)},
\\[.8em]
\left(\frac1{g(x)}\right)'
=-\frac{g'(x)}{[g(x)]^2}
\qquad\Longrightarrow\qquad
\boxed{
\left(\frac fg\right)'(x)
=\frac{f'(x)g(x)-f(x)g'(x)}{[g(x)]^2}
}
\end{gathered}
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
# 三个相似记号，三件不同的事

若 $f(x_0)=y_0$，则

$$
\begin{array}{c|c|c}
\text{记号}&\text{做了什么}&\text{对应位置}\\
\hline
\dfrac1{f(x_0)}
&\text{保持输入，对输出取倒数}
&x_0\longmapsto\dfrac1{y_0}\\[.8em]
f^{-1}(y_0)
&\text{交换输入与输出}
&y_0\longmapsto x_0\\[.4em]
(f^{-1})'(y_0)
&\text{求反函数的变化率}
&\text{在输入 }y_0\text{ 处}
\end{array}
$$

$$
(f^{-1})'\ne(f')^{-1},
\qquad
f^{-1}(x)\ne\frac1{f(x)}.
$$

<!-- footer -->
反函数不是把函数值取倒数；反三角函数统一使用 $\arcsin,\arccos,\arctan$ 等记号。

---
# 反函数求导

设 $f$ 在区间 $I$ 上连续且严格单调，$x_0$ 是内点，$f$ 在 $x_0$ 处可导，并且

$$
\begin{gathered}
y_0=f(x_0),
\qquad f'(x_0)\ne0,
\\[.9em]
x_0\xrightarrow{ f }y_0,
\qquad
y_0\xrightarrow{ f^{-1} }x_0,
\\[.9em]
\boxed{
(f^{-1})'(y_0)=\frac1{f'(x_0)}
}
\end{gathered}
$$

<!-- footer -->
$f'(x_0)\ne0$ 不是反函数存在的条件，而是反函数在对应点取得有限导数的条件；用 Demo 观察关于 $y=x$ 的镜像。

---
# 反函数求导的差商证明

$$
 x=f^{-1}(y)\longrightarrow x_0,
 \qquad
\frac{f^{-1}(y)-f^{-1}(y_0)}{y-y_0}
=
\left[
\frac{f(x)-f(x_0)}{x-x_0}
\right]^{-1}
\longrightarrow
\frac1{f'(x_0)}.
$$

<!-- footer -->
让 $y$ 在反函数定义域 $f(I)$ 内趋于 $y_0$；连续且严格单调保证 $x=f^{-1}(y)\to x_0$。

---
# 反正弦函数的导数

令 $t=\arcsin x$，则 $x=\sin t$，且 $t\in[-\pi/2,\pi/2]$：

$$
(\arcsin x)'
=\frac1{\cos t}
=\frac1{\sqrt{1-\sin^2t}}
=\boxed{\frac1{\sqrt{1-x^2}}}.
$$

$$
\boxed{
(\arcsin x)'=\frac1{\sqrt{1-x^2}},
\qquad |x|<1
}
$$

<!-- footer -->
主值区间保证 $\cos t>0$，因此 $\cos t=\sqrt{1-\sin^2t}$；在 $x=\pm1$ 处没有有限导数。

---
# 反三角函数的导数

$$
\begin{array}{c|c|c}
\text{函数}&\text{导数}&\text{条件}\\
\hline
\arcsin x&\dfrac1{\sqrt{1-x^2}}&|x|<1\\[.7em]
\arccos x&-\dfrac1{\sqrt{1-x^2}}&|x|<1\\[.7em]
\arctan x&\dfrac1{1+x^2}&x\in\mathbb R\\[.7em]
\operatorname{arccot}x&-\dfrac1{1+x^2}&x\in\mathbb R
\end{array}
$$

<!-- footer -->
主值区间决定反函数与导数定义域；$\arctan x$ 由 $(\tan t)'=\sec^2t$ 沿同一路线得到。

---
# 基本初等函数的导数：常数与幂函数

$$
\begin{array}{c|c|c}
\text{函数}&\text{导数}&\text{条件}\\
\hline
C&0&x\in\mathbb R\\
x^n&nx^{n-1}&n\in\mathbb N^+, x\in\mathbb R\\
x^\alpha&\alpha x^{\alpha-1}&\alpha\in\mathbb R, x>0\\
x^{p/q}&\dfrac pq x^{p/q-1}&x<0,\ p/q\text{ 最简},\ q\text{ 为奇数}\\[.4em]
1/x&-1/x^2&x\ne0\\
\sqrt x&1/(2\sqrt x)&x>0
\end{array}
$$

<!-- footer -->
$x^\alpha=e^{\alpha\ln x}$ 统一处理正底数；负底数只能按具体有理指数判断，$x=0$ 不在本表新增结论的范围内。

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
# 旧法则的递归：从三个函数到幂指函数

$$
\boxed{\text{辨认结构}}
\longrightarrow
\boxed{\text{加括号或恒等改写}}
\longrightarrow
\boxed{\text{递归调用已有法则}}
$$

$$
\begin{array}{c|c|c}
\text{对象}&\text{先怎样看}&\text{调用什么}\\
\hline
fgh&(fg)h&\text{积法则再用一次}\\
f(g(h(x)))&f\circ g\circ h&\text{链式法则逐层使用}\\
[f(x)]^{g(x)}&e^{g(x)\ln f(x)}&\text{复合＋乘积＋复合}
\end{array}
$$

<!-- footer -->
后半节不新增孤立法则：并列结构重复积法则，嵌套结构重复链式法则，新幂指结构先恒等改写。

---
# 三个函数：并列乘积与逐层复合

$$
\begin{array}{c|c}
\text{并列乘积}&\text{逐层复合}\\
\hline
f(x)g(x)h(x)&f(g(h(x)))\\[.4em]
(fgh)'=[(fg)h]'&(f\circ g\circ h)'\\[.4em]
\boxed{f'gh+fg'h+fgh'}
&\boxed{f'(g(h(x)))g'(h(x))h'(x)}
\end{array}
$$

$$
\begin{array}{c@{\qquad}c}
\text{三个分支并列}
&
x\longrightarrow h(x)\longrightarrow g(h(x))\longrightarrow f(g(h(x)))
\\
\text{求导后产生三项}
&
\text{沿唯一路径乘三个变化率}
\end{array}
$$

<!-- footer -->
积法则的重复使用产生加法；链式法则的重复使用沿输入路径不断相乘。

---
# 固定指数、固定底数与幂指函数

$$
\begin{array}{c|c|c}
\text{结构}&\text{保持不变的部分}&\text{变化的部分}\\
\hline
[f(x)]^\alpha&\text{指数 }\alpha&\text{底数 }f(x)\\
a^{g(x)}&\text{底数 }a&\text{指数 }g(x)\\
[f(x)]^{g(x)}&\text{无}&\text{底数与指数同时变化}
\end{array}
$$

$$
\begin{array}{c@{\qquad}c}
([f(x)]^\alpha)'
=\alpha[f(x)]^{\alpha-1}f'(x)
&
(a^{g(x)})'
=a^{g(x)}\ln a\,g'(x)
\end{array}
$$

<!-- footer -->
$[f(x)]^{g(x)}$ 不能直接套用任一张旧公式；先把它改写成指数函数的复合。

---
# 幂指函数：指数—对数恒等改写

若 $f(x)>0$，令

$$
y=[f(x)]^{g(x)}
=e^{g(x)\ln f(x)}.
$$

$$
\left.
\begin{aligned}
f(x)&\longrightarrow \ln f(x),\\
g(x),\ \ln f(x)&\longrightarrow
w(x)=g(x)\ln f(x),\\
w(x)&\longrightarrow y=e^{w(x)}
\end{aligned}
\right\}
\quad
\text{复合—乘积—复合}
$$

<!-- footer -->
恒等改写只负责把新结构还原为指数复合、内部乘积与对数复合。

---
# 幂指函数的导数

$$
\begin{aligned}
w'(x)
&=g'(x)\ln f(x)+g(x)\frac{f'(x)}{f(x)},\\[.35em]
y'
&=\boxed{
[f(x)]^{g(x)}
\left[
g'(x)\ln f(x)+g(x)\frac{f'(x)}{f(x)}
\right]
}.
\end{aligned}
$$

<!-- footer -->
改写以后仍只调用指数、对数的基本公式以及积法则、链式法则。

---
<!-- layout: columns -->
# 用两个退化对象比较新旧公式

<!-- column -->
## 固定指数

$$
g(x)\equiv\alpha,
\qquad g'(x)=0,
\qquad y=[f(x)]^\alpha
$$

$$
\begin{aligned}
y'
&=[f(x)]^\alpha
\left[0+\alpha\frac{f'(x)}{f(x)}\right]\\
&=\boxed{\alpha[f(x)]^{\alpha-1}f'(x)}.
\end{aligned}
$$

<!-- column -->
## 固定底数

$$
f(x)\equiv a>0,
\qquad f'(x)=0,
\qquad y=a^{g(x)}
$$

$$
\begin{aligned}
y'
&=a^{g(x)}
\left[g'(x)\ln a+0\right]\\
&=\boxed{a^{g(x)}\ln a\,g'(x)}.
\end{aligned}
$$

<!-- footer -->
幂指通式在两个退化情形下，分别回到“幂函数＋链式法则”与“指数函数＋链式法则”。
