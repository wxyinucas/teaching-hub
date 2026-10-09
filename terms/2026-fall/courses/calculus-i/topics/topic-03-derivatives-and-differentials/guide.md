# T03｜导数、求导与微分

本页按授课顺序收录本专题的例题与练习；当前先整理已经完成的前三次课，后续课程的题目会继续补在这里。

## 回看导数：一个对象，三类问题

导数首先是差商的极限：

$$
f'(x_0)
=
\lim_{\Delta x\to0}
\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}.
$$

围绕这个对象，本专题前三次课处理三类问题：

- **导数是否存在**：回到定义，检查连续性、左右导数与定义域；
- **怎样计算导数**：先识别表达式结构，再调用基本公式、线性法则、积商法则与链式法则；
- **怎样使用导数**：把导数解释为切线斜率、瞬时变化率，或用它研究反函数与分段连接点。

公式的条件是公式的一部分。表达式有定义并不保证处处可导；公式条件不满足时，应回到定义判断，而不是根据形式猜测。

## 第一次课：题目

### 极限复习附栏

以下题目用于恢复进入导数定义所需的极限工具，不另占本专题的主练习编号。

- 连续函数直接代入：

  $$
  \lim_{x\to1}\frac{x^2+1}{x+2}=\frac23.
  $$

- 定义域决定允许的趋近方式：$F(x)=\sqrt{\sin x}$ 在自然定义域内满足

  $$
  \lim_{\substack{x\to0\\x\in D}}\sqrt{\sin x}=0,
  $$

  但实数范围内的左极限没有定义。函数 $\sqrt{-x^2}$ 的自然定义域只有 $\{0\}$，所以 $x\to0$ 时没有去心的极限过程。
- 第一重要极限与变量代换：

  $$
  \lim_{x\to0}\frac{\sin3x}{\sin2x}=\frac32.
  $$

- 多项式在无穷远处由最高次项控制：

  $$
  \lim_{x\to\infty}\frac{3x^2+x}{2x^2-1}=\frac32.
  $$

- 第二重要极限：

  $$
  \lim_{x\to0}(1+2x)^{3/x}=e^6.
  $$

- 加减相消不能机械使用等价无穷小：

  $$
  \lim_{x\to0}\frac{\sin x-x}{x^3}=-\frac16.
  $$

  直接使用 $\sin x\sim x$ 会丢掉相消后真正起作用的三阶项。

### 导数定义与差商辨认

1. **例题（教材第 61 页例 1）**　设 $f(x)=x^2$。由定义求任意固定点 $x_0$ 处的导数，并写出导函数。

   参考结果：

   $$
   f'(x_0)=2x_0,
   \qquad
   f'(x)=2x.
   $$

2. **例题（教材第 61 页例 2）**　已知 $f'(x_0)$ 存在，求

   $$
   \lim_{\Delta x\to0}
   \frac{f(x_0+\Delta x)-f(x_0-\Delta x)}{\Delta x}.
   $$

   在分子中加减 $f(x_0)$，可将它拆成两个标准差商，结果为

   $$
   2f'(x_0).
   $$

   反过来，对称差商存在不能推出函数可导。例如 $f(x)=|x|$ 在 $x_0=0$ 处的对称差商恒为 $0$，但左右导数不同。

3. **课堂练习**　已知 $f'(x_0)$ 存在，求

   $$
   \lim_{\Delta x\to0}
   \frac{f(x_0+3\Delta x)-f(x_0)}{\Delta x}.
   $$

   分子中的自变量增量是 $3\Delta x$，因此结果为

   $$
   3f'(x_0).
   $$

4. **独立练习**　设 $f(x)=1/x$，$x_0\ne0$。由定义求 $f'(x_0)$。

   参考结果：

   $$
   f'(x_0)=-\frac1{x_0^2}.
   $$

### 左右导数与第一套求导工具

5. **例题**　判断 $f(x)=|x|$ 在各点的可导性。

   参考结果：

   $$
   f'(x)=
   \begin{cases}
   -1,&x<0,\\
   1,&x>0.
   \end{cases}
   $$

   在 $x=0$ 处，左、右导数分别为 $-1$ 与 $1$，所以不可导。

6. **例题**　使用二项式展开证明：对正整数 $n$，

   $$
   (x^n)'=nx^{n-1}.
   $$

   展开 $(x+\Delta x)^n-x^n$ 后约去 $\Delta x$；其余各项都含有正次幂的 $\Delta x$，取极限后消失。

7. **例题与课堂练习**　分别求下列多项式的导函数：

   $$
   P(x)=3x^5-2x^3+4x-7,
   $$

   $$
   Q(x)=2x^4-5x^2+3x-1.
   $$

   参考结果：

   $$
   P'(x)=15x^4-6x^2+4,
   \qquad
   Q'(x)=8x^3-10x+3.
   $$

### 绝对值、分段函数与定义型综合题

8. **定义证明**　设 $x_0$ 是定义域的内点，$u$ 在 $x_0$ 处可导且 $u(x_0)=0$。证明

   $$
   |u(x)|\text{ 在 }x_0\text{ 处可导}
   \quad\Longleftrightarrow\quad
   u'(x_0)=0,
   $$

   且可导时导数为 $0$。

#### 第 8 题参考解答

由 $u(x_0)=0$，先把这个条件代入差商：

$$
\frac{|u(x_0+\Delta x)|-|u(x_0)|}{\Delta x}
=
\frac{|u(x_0+\Delta x)|}{\Delta x}.
$$

再将它改写为

$$
\frac{|u(x_0+\Delta x)|}{\Delta x}
=
\left|
\frac{u(x_0+\Delta x)-u(x_0)}{\Delta x}
\right|
\frac{|\Delta x|}{\Delta x}.
$$

这里没有使用 $|a|-|b|=|a-b|$；一般而言这个等式并不成立。

当 $\Delta x\to0^+$ 时，右侧趋于 $|u'(x_0)|$；当 $\Delta x\to0^-$ 时，右侧趋于 $-|u'(x_0)|$。两者相等当且仅当 $u'(x_0)=0$，此时共同极限为 $0$。

9. **教材习题 2-1 第 12 题（第 67 页）**　判断函数

   $$
   f(x)=|x-1|\left|(x-2)^2\right||x-3|\sin(x-1)
   $$

   有几个不可导点。

#### 第 9 题参考解答

只需检查绝对值内部为 $0$ 的三个点：

- 在 $x=1$ 处，$|x-1|$ 单独会形成尖点，但

  $$
  \frac{f(x)-f(1)}{x-1}
  =(x-2)^2|x-3|\,|x-1|
  \frac{\sin(x-1)}{x-1}
  \longrightarrow0.
  $$

  外面的无穷小量把尖点压平。
- 在 $x=2$ 处，

  $$
  |(x-2)^2|=(x-2)^2,
  $$

  本来就没有尖点。
- 在 $x=3$ 处，$|x-3|$ 形成尖点，其余因子趋于非零常数 $2\sin2$，所以尖点被保留。

因此只有 $x=3$ 不可导，不可导点共有

$$
\boxed{1\text{ 个}}.
$$

10. **选做（教材习题 2-1 第 11 题，第 66 页）**　设

    $$
    f(x)=
    \begin{cases}
    x^2,&x\le1,\\
    ax+b,&x>1.
    \end{cases}
    $$

    求 $a,b$，使 $f$ 在 $x=1$ 处可导。

    参考结果：先由连续性得到 $a+b=1$，再由左右导数相等得到

    $$
    \boxed{a=2,\qquad b=-1}.
    $$

11. **选做（教材习题 2-1 第 14 题，第 67 页）**　已知 $f$ 在 $x=1$ 处可导，且

    $$
    \lim_{x\to0}
    \frac{f(e^{x^2})-3f(1+\sin^2x)}{x^2}=2,
    $$

    求 $f'(1)$。

#### 第 11 题参考解答

因为 $f$ 在 $1$ 处可导，所以它在 $1$ 处连续。原极限有限，分子必须趋于 $0$，于是

$$
f(1)-3f(1)=0,
\qquad
f(1)=0.
$$

再把原式拆成

$$
\frac{f(e^{x^2})-f(1)}{e^{x^2}-1}
\frac{e^{x^2}-1}{x^2}
-3
\frac{f(1+\sin^2x)-f(1)}{\sin^2x}
\frac{\sin^2x}{x^2}.
$$

两个函数差商都趋于 $f'(1)$，另外两个因子都趋于 $1$，所以

$$
-2f'(1)=2,
\qquad
\boxed{f'(1)=-1}.
$$

12. **2021 年选择题第 2 题**　设

    $$
    f(x)=|x^2-x-6|,
    $$

    求不可导点的个数。

    令 $u(x)=x^2-x-6$。其零点为 $-2,3$，并且

    $$
    u'(-2)=-5\ne0,
    \qquad
    u'(3)=5\ne0.
    $$

    因此两个零点都会形成尖点，不可导点共有 $2$ 个。

13. **2022 年选择题第 2 题**　若函数 $f(x)$ 在 $(-1,1)$ 内连续，则 $xf(x)$ 在（　）。

    - A. $(-1,1)$ 内可导；
    - B. $x=1$ 处可导；
    - C. $x=0$ 处可导；
    - D. $(-1,1)$ 内处处不可导。

    令 $G(x)=xf(x)$。由定义，

    $$
    G'(0)
    =\lim_{x\to0}\frac{xf(x)-0\cdot f(0)}x
    =\lim_{x\to0}f(x)
    =f(0).
    $$

    因此选择 C。题设没有给出 $f$ 可导，所以不能使用积法则。

## 第二次课：题目

### 基本公式与结构辨认

#### 指数、对数导数公式的依赖链

T01/T02 曾把 $\ln(1+u)\sim u$ 与 $a^u-1\sim u\ln a$ 作为常用等价无穷小直接使用。这里不把它们继续当作未经说明的前提，而是从第二重要极限补出一条不依赖导数的证明链。

允许调用的已有结论是：

- 完整的双侧函数极限

  $$
  \lim_{u\to0}(1+u)^{1/u}=e,
  \qquad 1+u>0;
  $$

- 指数函数与自然对数函数已经定义、连续、互为反函数，并满足指数与对数运算律。

这些是基本初等函数理论的前提；以下过程不使用指数函数或对数函数尚待证明的导数。

1. **对数局部极限。** 当 $0<|u|<1$ 时，$1+u>0$，因此

   $$
   \ln\left((1+u)^{1/u}\right)
   =\frac{\ln(1+u)}u.
   $$

   第二重要极限给出 $(1+u)^{1/u}\to e$；再由 $\ln x$ 在 $e$ 处连续，

   $$
   \boxed{
   \lim_{u\to0}\frac{\ln(1+u)}u
   =\ln e=1
   }.
   $$

2. **自然指数局部极限。** 令 $v=e^u-1$。由指数函数在 $0$ 处连续，$u\to0$ 时 $v\to0$。当 $u\ne0$ 时，指数函数的单射性保证 $v\ne0$；由互逆关系还有

   $$
   u=\ln(1+v).
   $$

   因而

   $$
   \begin{aligned}
   \frac{e^u-1}u
   &=\frac{v}{\ln(1+v)}\\
   &=\left(\frac{\ln(1+v)}v\right)^{-1}
   \longrightarrow1.
   \end{aligned}
   $$

   括号内的比值趋于 $1$，因此在充分靠近 $0$ 时非零，取倒数的极限是合法的。

   即

   $$
   \boxed{
   \lim_{u\to0}\frac{e^u-1}u=1
   }.
   $$

3. **一般正底数的指数局部极限。** 若 $a>0$ 且 $a\ne1$，令 $w=u\ln a$。此时 $u\to0$ 蕴含 $w\to0$，并且

   $$
   a^u=e^{u\ln a}=e^w.
   $$

   所以

   $$
   \begin{aligned}
   \frac{a^u-1}u
   &=\frac{e^w-1}{w}\ln a\\
   &\longrightarrow\ln a.
   \end{aligned}
   $$

   当 $a=1$ 时，分子恒为 $0$，极限也等于 $0=\ln1$。因此对所有 $a>0$，

   $$
   \boxed{
   \lim_{u\to0}\frac{a^u-1}u=\ln a
   }.
   $$

   当 $0<a<1$ 时，$\ln a<0$，变量 $w=u\ln a$ 的趋近方向会反转；这里使用的是双侧极限 $w\to0$，所以结论不受影响。

现在再回到导数定义。对 $x>0$，令 $u=\Delta x/x$，则

$$
\begin{aligned}
\frac{\ln(x+\Delta x)-\ln x}{\Delta x}
&=\frac1x\frac{\ln(1+u)}u
\longrightarrow\frac1x,
\end{aligned}
$$

所以

$$
\boxed{(\ln x)'=\frac1x}\qquad(x>0).
$$

对 $a>0$，

$$
\begin{aligned}
\frac{a^{x+\Delta x}-a^x}{\Delta x}
&=a^x\frac{a^{\Delta x}-1}{\Delta x}
\longrightarrow a^x\ln a,
\end{aligned}
$$

所以

$$
\boxed{(a^x)'=a^x\ln a}.
$$

当 $a=1$ 时它退化为常数函数；当 $a=e$ 时得到 $(e^x)'=e^x$。整条依赖链为

$$
\text{函数型第二重要极限}
\longrightarrow
\text{对数局部极限}
\longrightarrow
\text{指数局部极限}
\longrightarrow
\text{指数、对数导数},
$$

其中没有一步反过来使用待证导数。

本次可调用的基本导数为

$$
\begin{array}{c|c}
\text{函数} & \text{导数}\\
\hline
C & 0\\
x^n\ (n\in\mathbb N^+) & nx^{n-1}\\
1/x & -1/x^2\\
\sqrt x & 1/(2\sqrt x)\\
\sin x & \cos x\\
\cos x & -\sin x\\
a^x & a^x\ln a\\
e^x & e^x\\
\ln x & 1/x\\
\log_a x & 1/(x\ln a)
\end{array}
$$

使用时同时核对函数的定义域与参数条件。

14. **教材公式检查与纠错**　先完成教材习题 2-1 第 6 题的 (1)、(4)、(5)（第 66 页），并写出公式适用范围：

    $$
    \begin{array}{c|c|c}
    y & y' & \text{适用范围}\\
    \hline
    x^5 & 5x^4 & x\in\mathbb R\\
    2^x & 2^x\ln2 & x\in\mathbb R\\
    \log_2x & \dfrac1{x\ln2} & x>0
    \end{array}
    $$

    教材习题 2-1 第 7 题的第一步给出

    $$
    (\cos x)'\big|_{x=\pi/3}
    =-\frac{\sqrt3}{2};
    $$

    教材习题 2-2 第 1 题 (3)（第 73 页）可以提前用线性法则完成：

    $$
    \left(\ln x-2\log_2x+4\log_3x\right)'
    =\frac1x-\frac2{x\ln2}+\frac4{x\ln3},
    \qquad x>0.
    $$

    另外核对以下边界：$(\sqrt x)'=1/(2\sqrt x)$ 只适用于 $x>0$；$(\cos x)'=-\sin x$；标准三角导数公式使用弧度制；$(a^x)'$ 在实函数范围内要求 $a>0$；$(\log_a x)'$ 要求 $x>0$、$a>0$ 且 $a\ne1$。

15. **独立代表题**　设 $x>0$，求

    $$
    f(x)
    =2x^4-\frac3x+8\sqrt x
     +4\cdot2^x-5\log_2x
     +6\sin x-7\cos x
    $$

    的导函数。

    参考结果：

    $$
    \begin{aligned}
    f'(x)
    &=8x^3+\frac3{x^2}+\frac4{\sqrt x}
      +4\cdot2^x\ln2-\frac5{x\ln2}\\
    &\qquad+6\cos x+7\sin x.
    \end{aligned}
    $$

16. **教材分层练习：从公式调用到一点处变化率**

    1. 习题 2-2 第 1 题 (2)（第 73 页）：

       $$
       y=5x^2-2^x+3e^x,
       \qquad
       y'=10x-2^x\ln2+3e^x.
       $$

    2. 习题 2-1 第 3 题（第 66 页）：质点的位置为

       $$
       s(t)=t^2+2t+1\;(\mathrm m).
       $$

       其速度函数与 $t=2\,\mathrm s$ 时的瞬时速度为

       $$
       v(t)=s'(t)=2t+2,
       \qquad
       v(2)=6\;\mathrm{m/s}.
       $$

    3. 习题 2-2 第 2 题（第 73 页）：曲线

       $$
       y=e^x+x^2+\sin x
       $$

       在 $(0,1)$ 处满足

       $$
       y'=e^x+2x+\cos x,
       \qquad
       y'(0)=2.
       $$

       因而切线与法线分别为

       $$
       y=2x+1,
       \qquad
       y=-\frac12x+1.
       $$

    三题依次训练“调用公式得到导函数—在指定点读取导数值—解释为物理或几何变化率”。

17. **结构辨析**　在只学过基本公式与线性法则、尚未学习积法则和链式法则时，判断哪些表达式已经能够直接求导：

    $$
    \begin{array}{lll}
    \text{A. }3x^4-2e^x+\ln x+\sin x,
    &\text{B. }\sin2x,
    &\text{C. }xe^x,\\
    \text{D. }\ln(1+x),
    &\text{E. }2^x,
    &\text{F. }(x+1)^2.
    \end{array}
    $$

    A、E 可以直接处理；F 可以先展开成多项式。B、D 尚缺链式法则，C 尚缺积法则。

18. **2021 年计算题**　求曲线 $y=x^2$ 与 $y=\sqrt x$ 在点 $(1,1)$ 处两条切线所成的锐角。

    参考结果：

    $$
    m_1=2,
    \qquad
    m_2=\frac12,
    $$

    $$
    \tan\theta
    =\left|\frac{m_1-m_2}{1+m_1m_2}\right|
    =\frac34,
    \qquad
    \boxed{\theta=\arctan\frac34}.
    $$

### 积、复合与商的求导

三类结构对应三条运算法则。以下公式默认所涉及的函数在当前点可导，且表达式在当前点有定义：

$$
\left\{
\begin{aligned}
(fg)'(x)
  &=f'(x)g(x)+f(x)g'(x),\\
\bigl(f(g(x))\bigr)'
  &=f'(g(x))g'(x),\\
\left(\frac fg\right)'(x)
  &=\frac{f'(x)g(x)-f(x)g'(x)}{[g(x)]^2},
  \qquad g(x)\ne0.
\end{aligned}
\right.
$$

其中，复合函数求导还要求内层函数值 $g(x)$ 落在外层函数 $f$ 的可导范围内。

#### 函数的乘积

积法则处理两个因子同时随 $x$ 变化的情形。求导时，一个因子求导、另一个因子保留原样；交换角色再做一次，最后相加。

19. **教材第 68 页例 2**　设

    $$
    f(x)=e^x(\cos x+\sin x),
    $$

    求 $f'(1)$。

    参考解答：

    $$
    \begin{aligned}
    f'(x)
    &=e^x(\cos x+\sin x)
      +e^x(\cos x-\sin x)\\
    &=2e^x\cos x,
    \end{aligned}
    $$

    因此

    $$
    \boxed{f'(1)=2e\cos1}.
    $$

20. **教材习题 2-2 第 1 题选做（第 73 页）**　先圈出每个乘积的两个因子，再求导。

    $$
    \left\{
    \begin{aligned}
    \text{(6)}\quad y&=\sin x\cos x,\\
    \text{(7)}\quad y&=x^3\ln x,\\
    \text{(9)}\quad y&=(1+x)(2-3x).
    \end{aligned}
    \right.
    $$

    参考结果：

    $$
    \left\{
    \begin{aligned}
    \text{(6)}\quad y'&=\cos^2x-\sin^2x,\\
    \text{(7)}\quad y'&=x^2(3\ln x+1),\qquad x>0,\\
    \text{(9)}\quad y'&=-1-6x.
    \end{aligned}
    \right.
    $$

    第 (9) 题也可以先展开为多项式再求导，两种路线结果相同。

回看第 13 题：积法则给出的是方便调用的充分条件。如果某个因子不可导，不能直接调用积法则，但具体的乘积仍可能在该点可导，此时应回到导数定义。

#### 复合函数

把复合函数写成

$$
x\longrightarrow u=g(x)
\longrightarrow y=f(u)=f(g(x)).
$$

链式法则说明，变化率沿这条路径逐段传递并相乘：

$$
\frac{dy}{dx}
=\frac{dy}{du}\frac{du}{dx}
=f'(g(x))g'(x).
$$

21. **先辨认“相乘”还是“复合”**　比较

    $$
    \left\{
    \begin{aligned}
    y_1&=2\sin x,\\
    y_2&=\sin2x.
    \end{aligned}
    \right.
    $$

    $y_1$ 是常数与函数相乘；$y_2$ 是 $u=2x$ 与 $y=\sin u$ 的复合。因此

    $$
    \left\{
    \begin{aligned}
    y_1'&=2\cos x,\\
    y_2'&=2\cos2x.
    \end{aligned}
    \right.
    $$

22. **教材第 71 页例 7**　求

    $$
    y=\sin(\cos x)
    $$

    的导数。

    令 $u=\cos x$，则 $y=\sin u$。因此

    $$
    \boxed{
    y'=\cos u\,u'
      =-\sin x\cos(\cos x)
    }.
    $$

23. **教材第 71 页例 9：实数次数的幂函数**　设 $\alpha\in\mathbb R$。当 $x>0$ 时，

    $$
    x^\alpha=e^{\alpha\ln x}.
    $$

    由链式法则，

    $$
    \begin{aligned}
    (x^\alpha)'
    &=(e^{\alpha\ln x})'\\
    &=e^{\alpha\ln x}\frac\alpha x\\
    &=\alpha x^{\alpha-1}.
    \end{aligned}
    $$

    因此

    $$
    \boxed{(x^\alpha)'=\alpha x^{\alpha-1}},
    \qquad x>0.
    $$

    条件 $x>0$ 来自表示式中的 $\ln x$。正整数幂的公式在全体实数上成立；某个具体指数若允许更大的实数定义域，应按该函数本身另行判断。

24. **教材习题 2-2 第 5 题选做（第 73 页）**　先写出每题的内函数与外函数，再求导。

    $$
    \left\{
    \begin{aligned}
    \text{(1)}\quad y&=\ln(4+x^2),\\
    \text{(2)}\quad y&=\sin(3x+2),\\
    \text{(3)}\quad y&=(2x+5)^{100}.
    \end{aligned}
    \right.
    $$

    参考结果：

    $$
    \left\{
    \begin{aligned}
    \text{(1)}\quad y'&=\frac{2x}{4+x^2},\\[.4em]
    \text{(2)}\quad y'&=3\cos(3x+2),\\
    \text{(3)}\quad y'&=200(2x+5)^{99}.
    \end{aligned}
    \right.
    $$

#### 函数的商

商法则可以看成积法则与链式法则的组合。先写成

$$
\frac{f(x)}{g(x)}
=f(x)\cdot\frac1{g(x)},
$$

再把第二个因子理解为“先算 $g(x)$，再取倒数”。

25. **教材第 68 页例 3：比较求导路线**　求

    $$
    y=\frac{x-1}{x+1}
    $$

    的导数。

    可以直接使用商法则，也可以先写成

    $$
    y=(x-1)\frac1{x+1},
    $$

    再使用积法则和链式法则。两条路线均得到

    $$
    \boxed{y'=\frac2{(x+1)^2}},
    \qquad x\ne-1.
    $$

    商法则还可以直接由定义得到。记

    $$
    \Delta f=f(x+\Delta x)-f(x),
    \qquad
    \Delta g=g(x+\Delta x)-g(x),
    $$

    则

    $$
    \frac{\Delta(f/g)}{\Delta x}
    =
    \frac{
      g(x)\dfrac{\Delta f}{\Delta x}
      -f(x)\dfrac{\Delta g}{\Delta x}
    }{g(x)[g(x)+\Delta g]}.
    $$

    当 $\Delta x\to0$ 时，上式趋于

    $$
    \frac{f'(x)g(x)-f(x)g'(x)}{[g(x)]^2}.
    $$

    两种方法的起点不同：运算法则把商拆成“乘积＋倒数复合”，定义法直接追踪函数增量；它们得到的是同一结果。

26. **教材第 68 页例 4**　由 $\tan x=\sin x/\cos x$，

    $$
    \begin{aligned}
    (\tan x)'
    &=\frac{\cos x\cos x-\sin x(-\sin x)}{\cos^2x}\\
    &=\sec^2x,
    \end{aligned}
    $$

    其中 $x\ne\pi/2+k\pi$，$k\in\mathbb Z$。同理，

    $$
    \left\{
    \begin{aligned}
    (\cot x)'&=-\csc^2x,\\
    (\sec x)'&=\sec x\tan x,\\
    (\csc x)'&=-\csc x\cot x.
    \end{aligned}
    \right.
    $$

    $\cot x,\csc x$ 要求 $x\ne k\pi$；$\tan x,\sec x$ 要求 $x\ne\pi/2+k\pi$。

27. **教材习题 2-2 第 1 题选做（第 73 页）**　求下列函数的导数，并在第一步保留商法则的分子顺序与分母平方：

    $$
    \left\{
    \begin{aligned}
    \text{(10)}\quad y&=\frac{1-e^x}{1+e^x},\\[.5em]
    \text{(11)}\quad y&=\frac{1+\sin x}{x+\cos x}.
    \end{aligned}
    \right.
    $$

    参考结果：

    $$
    \left\{
    \begin{aligned}
    \text{(10)}\quad y'&=-\frac{2e^x}{(1+e^x)^2},\\[.7em]
    \text{(11)}\quad y'&=\frac{x\cos x}{(x+\cos x)^2},
      \qquad x+\cos x\ne0.
    \end{aligned}
    \right.
    $$

#### 截至本次课可调用的公式

基本初等函数的导数公式为

$$
\begin{array}{c|c|c}
\text{函数} & \text{导数} & \text{条件}\\
\hline
C & 0 & x\in\mathbb R\\
x^n\ (n\in\mathbb N^+) & nx^{n-1} & x\in\mathbb R\\
x^\alpha\ (\alpha\in\mathbb R) & \alpha x^{\alpha-1} & x>0\\
1/x & -1/x^2 & x\ne0\\
\sqrt x & 1/(2\sqrt x) & x>0\\
\sin x & \cos x & x\in\mathbb R\\
\cos x & -\sin x & x\in\mathbb R\\
\tan x & \sec^2x & \cos x\ne0\\
\cot x & -\csc^2x & \sin x\ne0\\
\sec x & \sec x\tan x & \cos x\ne0\\
\csc x & -\csc x\cot x & \sin x\ne0\\
a^x & a^x\ln a & a>0,\ a\ne1\\
e^x & e^x & x\in\mathbb R\\
\log_a x & 1/(x\ln a) & x>0,\ a>0,\ a\ne1\\
\ln x & 1/x & x>0
\end{array}
$$

基本公式给出各个基本函数的导数，运算法则负责把它们连接起来：

$$
\left\{
\begin{aligned}
(af+bg)'&=af'+bg',\\
(fg)'&=f'g+fg',\\
\bigl(f(g(x))\bigr)'&=f'(g(x))g'(x),\\
\left(\frac fg\right)'&=\frac{f'g-fg'}{g^2},
\qquad g(x)\ne0.
\end{aligned}
\right.
$$

其中 $a,b$ 为常数。调用公式时仍须核对当前点的定义域与可导条件；反三角函数的导数将在反函数求导之后补入。

## 第三次课：题目

### 链式法则的进一步应用与混合结构

第二次课已经建立链式法则与实数次数幂函数的导数公式。本节先恢复一次积法则：

$$
F(x)=(x^2+1)e^x,
\qquad
F'(x)=e^x(x^2+2x+1).
$$

28. **基础练习**　求下列函数的导数，并标出每一层的内、外函数：

    1. $y=\sin2x$；
    2. $y=\ln(1+x)$；
    3. $y=e^{\sin(x^2)}$；
    4. $y=(1+x^2)^{3/2}$。

    参考结果：

    $$
    (\sin2x)'=2\cos2x,
    $$

    $$
    \bigl(\ln(1+x)\bigr)'=\frac1{1+x},
    \qquad x>-1,
    $$

    $$
    \left(e^{\sin(x^2)}\right)'
    =2xe^{\sin(x^2)}\cos(x^2).
    $$

    $$
    \left((1+x^2)^{3/2}\right)'
    =3x\sqrt{1+x^2}.
    $$

29. **独立代表题**　设

    $$
    H(x)=e^{x^2}\sin(1+x).
    $$

    先说明最外层及两个分支的结构，再求导。

    参考结果：

    $$
    H'(x)
    =e^{x^2}
    \bigl[2x\sin(1+x)+\cos(1+x)\bigr].
    $$

### 反函数求导

30. **例题**　设

    $$
    f(x)=x^3+x.
    $$

    不解出反函数，求 $(f^{-1})'(2)$。

    因为 $f(1)=2$，所以应在原变量的对应位置 $x=1$ 处取导数的倒数：

    $$
    \boxed{(f^{-1})'(2)=\frac1{f'(1)}=\frac14}.
    $$

31. **2024 年选择题**　设

    $$
    y=f(x)=\sin x-2x,
    $$

    求反函数 $x=x(y)$ 的导数。

    题目已经给出反函数；又有

    $$
    f'(x)=\cos x-2\le-1<0,
    $$

    所以对应位置的原函数导数不为 $0$，并且

    $$
    \boxed{x'(y)=\frac1{\cos x-2}}.
    $$

    右侧的 $x$ 表示与当前 $y$ 对应的原变量位置；不需要先把反函数显式解出。

### 对数求导

32. **2021 年计算题的第一阶部分**　设 $x>0$，

    $$
    y=x^x.
    $$

    使用对数求导求 $y'$。原题中的 $y''$ 留到高阶导数部分继续完成。

    参考结果：

    $$
    \boxed{y'=x^x(\ln x+1)}.
    $$

33. **独立代表题**　求

    $$
    y=(1+x^2)^{\sin x}
    $$

    的导数。

    因为 $1+x^2>0$，可以直接取对数。参考结果为

    $$
    \boxed{
    y'
    =(1+x^2)^{\sin x}
    \left[
    \cos x\ln(1+x^2)
    +\frac{2x\sin x}{1+x^2}
    \right]
    }.
    $$

34. **选做**　设 $x>1$，

    $$
    y=
    \frac{(x^2+1)^3\sqrt{x+1}}
         {e^x(x-1)^2}.
    $$

    使用对数求导，保留原式的因子结构。

    参考结果：

    $$
    y'
    =y\left[
    \frac{6x}{x^2+1}
    +\frac1{2(x+1)}
    -1-\frac2{x-1}
    \right].
    $$

### 分段函数综合题

35. **2024 年计算题**　确定常数 $a,b$，使

    $$
    f(x)=
    \begin{cases}
    \cos3x,&x\le0,\\
    be^x+a,&x>0
    \end{cases}
    $$

    在 $x=0$ 处可导。

    先由连续性得到 $a+b=1$，再由左右导数相等得到 $b=0$，因此

    $$
    \boxed{a=1,\qquad b=0}.
    $$
