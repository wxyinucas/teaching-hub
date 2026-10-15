# T03｜导数、求导与微分

本页按授课顺序收录本专题的例题与练习；当前整理已完成备课的前五次课，后续课程的题目会继续补在这里。第五次课补入隐函数与参数方程求导，可选补充单独标明。

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

### 积与复合的求导

两类结构对应两条运算法则。以下公式默认所涉及的函数在当前点可导，且表达式在当前点有定义：

$$
\left\{
\begin{aligned}
(fg)'(x)
  &=f'(x)g(x)+f(x)g'(x),\\
\bigl(f(g(x))\bigr)'
  &=f'(g(x))g'(x).
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

## 第三次课：题目

本次把已经证明的复合函数求导法则正式命名为链式法则，补齐实数幂公式在负底数上的适用边界；随后依次处理商法则、反函数与反三角函数，并把已有法则递归用于更多因子、更多复合层次和幂指函数。

### 开场工具箱：链式法则与负底数有理数次幂

设

$$
u=g(x),
\qquad
y=f(u)=f(g(x)).
$$

若内层函数 $g$ 在 $x_0$ 处可导，外层函数 $f$ 在 $u_0=g(x_0)$ 处可导，则复合函数 $f\circ g$ 在 $x_0$ 处可导，并且

$$
\boxed{
(f\circ g)'(x_0)
=f'(g(x_0))g'(x_0)
}.
$$

这条结论称为**链式法则**。变化沿

$$
x\longrightarrow u=g(x)\longrightarrow y=f(u)
$$

逐层传递，总变化率等于每一段变化率的乘积。常用记法

$$
\frac{dy}{dx}
=\frac{dy}{du}\frac{du}{dx}
$$

用于提示“沿链条逐层求导并相乘”；其中的 $d$ 不是普通数，不能只把上式理解为分数的机械约分。

对一般实数 $\alpha$，表示式

$$
x^\alpha=e^{\alpha\ln x}
$$

统一覆盖 $x>0$。当

$$
\alpha=\frac pq,
\qquad
p\in\mathbb Z,
\quad
q\in\mathbb N^+,
\quad
p,q\text{ 互质},
$$

且 $q$ 为奇数时，负数有唯一的实 $q$ 次方根，因此对 $x<0$ 可以定义

$$
x^{p/q}=\left(\sqrt[q]{x}\right)^p.
$$

此时

$$
x^{p/q}=(-1)^p(-x)^{p/q},
$$

由正底数幂函数公式和链式法则仍可得到

$$
\boxed{
\left(x^{p/q}\right)'
=\frac pqx^{p/q-1}
},
\qquad x<0,\quad q\text{ 为奇数}.
$$

判断定义域时必须先把 $p/q$ 约成最简分数。例如 $1/3=2/6$，不能根据非最简形式中的偶数分母 $6$ 得出错误结论。若最简分数的分母为偶数，或指数为无理数，负底数通常不定义为实值函数；$x=0$ 是否有定义、是否可导，需要按具体指数另行判断。

### 函数的商

商法则可以看成积法则与链式法则的组合。先写成

$$
\frac{f(x)}{g(x)}
=f(x)\cdot\frac1{g(x)},
$$

再把第二个因子理解为“先算 $g(x)$，再取倒数”。

若 $f,g$ 在当前点可导且 $g(x)\ne0$，则

$$
\boxed{
\left(\frac fg\right)'(x)
=\frac{f'(x)g(x)-f(x)g'(x)}{[g(x)]^2}
}.
$$

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

### 反函数与反三角函数

若函数 $f$ 在区间 $I$ 上连续且严格单调，$x_0$ 是 $I$ 的内点，并且 $f$ 在 $x_0$ 处可导、$f'(x_0)\ne0$，令 $y_0=f(x_0)$，则

$$
\boxed{
(f^{-1})'(y_0)
=\frac1{f'(x_0)}
}.
$$

原函数的导数在 $x_0$ 处计算，反函数的导数在对应的输出位置 $y_0$ 处计算；两个横坐标通常不是同一个数。

28. **例题**　设

    $$
    f(x)=x^3+x.
    $$

    不解出反函数，求 $(f^{-1})'(2)$。

    因为 $f(1)=2$，所以应在原变量的对应位置 $x=1$ 处取导数的倒数：

    $$
    \boxed{(f^{-1})'(2)=\frac1{f'(1)}=\frac14}.
    $$

29. **2024 年选择题**　设

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

正弦、余弦和正切在整个实数轴上并非一一对应，必须先限制到单调区间，再把反函数求导公式用于对应的主值区间。例如，把 $F(t)=\sin t$ 限制在 $[-\pi/2,\pi/2]$ 上，令 $t=\arcsin x$，则当 $|x|<1$ 时，

$$
(\arcsin x)'
=\frac1{\cos t}
=\frac1{\sqrt{1-x^2}}.
$$

把 $F(t)=\tan t$ 限制在 $(-\pi/2,\pi/2)$ 上，则

$$
(\arctan x)'
=\frac1{\sec^2t}
=\frac1{1+x^2}.
$$

四个反三角函数的导数为

$$
\begin{array}{rcll}
(\arcsin x)'&=&\dfrac1{\sqrt{1-x^2}},&|x|<1,\\[.8em]
(\arccos x)'&=&-\dfrac1{\sqrt{1-x^2}},&|x|<1,\\[.8em]
(\arctan x)'&=&\dfrac1{1+x^2},&x\in\mathbb R,\\[.8em]
(\operatorname{arccot}x)'&=&-\dfrac1{1+x^2},&x\in\mathbb R.
\end{array}
$$

这里余弦限制在 $[0,\pi]$ 上定义反余弦；本课程把余切限制在 $(0,\pi)$ 上定义反余切。

### 截至本次课可调用的公式

基本初等函数的导数公式为

$$
\begin{array}{c|c|c}
\text{函数} & \text{导数} & \text{条件}\\
\hline
C & 0 & x\in\mathbb R\\
x^n\ (n\in\mathbb N^+) & nx^{n-1} & x\in\mathbb R\\
x^\alpha\ (\alpha\in\mathbb R) & \alpha x^{\alpha-1} & x>0\\
x^{p/q} & \dfrac pqx^{p/q-1}
  & x<0,\ p,q\text{ 互质},\ q\text{ 为正奇数}\\
1/x & -1/x^2 & x\ne0\\
\sqrt x & 1/(2\sqrt x) & x>0\\
\sin x & \cos x & x\in\mathbb R\\
\cos x & -\sin x & x\in\mathbb R\\
\tan x & \sec^2x & \cos x\ne0\\
\cot x & -\csc^2x & \sin x\ne0\\
\sec x & \sec x\tan x & \cos x\ne0\\
\csc x & -\csc x\cot x & \sin x\ne0\\
\arcsin x & 1/\sqrt{1-x^2} & |x|<1\\
\arccos x & -1/\sqrt{1-x^2} & |x|<1\\
\arctan x & 1/(1+x^2) & x\in\mathbb R\\
\operatorname{arccot}x & -1/(1+x^2) & x\in\mathbb R\\
a^x & a^x\ln a & a>0,\ a\ne1\\
e^x & e^x & x\in\mathbb R\\
\log_a x & 1/(x\ln a) & x>0,\ a>0,\ a\ne1\\
\ln x & 1/x & x>0
\end{array}
$$

第一条实数幂公式用 $e^{\alpha\ln x}$ 统一处理任意实数指数，因此要求 $x>0$；下一行单独登记负底数且最简分母为奇数的有理数指数。$x=0$ 仍须按具体指数另行判断。

基本公式给出各个基本函数的导数，运算法则负责把它们连接起来：

$$
\left\{
\begin{aligned}
(af+bg)'&=af'+bg',\\
(fg)'&=f'g+fg',\\
\left(\frac fg\right)'&=\frac{f'g-fg'}{g^2},
\qquad g(x)\ne0,\\
(f\circ g)'&=(f'\circ g)g'.
\end{aligned}
\right.
$$

其中 $a,b$ 为常数。调用公式时仍须核对当前点的定义域与可导条件；复合时，内层函数值还必须落在外层函数的可导范围内。

### 旧法则的递归：三个因子与三层复合

三个因子的乘积可先分组为 $(fg)h$，连续使用两次积法则：

$$
\boxed{
(fgh)'=f'gh+fg'h+fgh'
}.
$$

三层复合则沿唯一的输入路径逐层使用链式法则：

$$
\boxed{
\bigl(f(g(h(x)))\bigr)'
=f'(g(h(x)))g'(h(x))h'(x)
}.
$$

30. **三个函数相乘**　求

    $$
    y=xe^x\sin x
    $$

    的导数。先保留三项结构，再整理结果：

    $$
    \begin{aligned}
    y'
    &=e^x\sin x+xe^x\sin x+xe^x\cos x\\
    &=\boxed{
    e^x\bigl[(1+x)\sin x+x\cos x\bigr]
    }.
    \end{aligned}
    $$

31. **三层复合函数**　求

    $$
    y=e^{\sin(x^2)}
    $$

    的导数。输入路径为

    $$
    x\longrightarrow x^2
    \longrightarrow\sin(x^2)
    \longrightarrow e^{\sin(x^2)},
    $$

    因而

    $$
    \boxed{
    y'=e^{\sin(x^2)}\cos(x^2)\cdot2x
    }.
    $$

### 幂指函数的指数—对数恒等改写

设 $f,g$ 在所讨论的区间上可导，并且 $f(x)>0$。利用

$$
\boxed{
[f(x)]^{g(x)}
=e^{g(x)\ln f(x)}
}
$$

可以把幂指函数还原成“复合—乘积—复合”的已有结构。令

$$
w(x)=g(x)\ln f(x),
$$

则

$$
w'(x)
=g'(x)\ln f(x)
+g(x)\frac{f'(x)}{f(x)},
$$

从而

$$
\boxed{
\frac{d}{dx}[f(x)]^{g(x)}
=[f(x)]^{g(x)}
\left[
g'(x)\ln f(x)
+g(x)\frac{f'(x)}{f(x)}
\right]
}.
$$

用两个退化情形比较这个通式与旧结论：

- **固定指数，只有底数变化**。令

  $$
  g(x)\equiv\alpha,
  \qquad
  y=[f(x)]^{g(x)}=[f(x)]^\alpha,
  \qquad
  g'(x)=0.
  $$

  将整个对象代入通式：

  $$
  \begin{aligned}
  y'
  &=[f(x)]^\alpha
  \left[
  0\cdot\ln f(x)
  +\alpha\frac{f'(x)}{f(x)}
  \right]\\
  &=\alpha[f(x)]^{\alpha-1}f'(x).
  \end{aligned}
  $$

  这与对 $y=u^\alpha$ 使用实数幂公式和链式法则得到的旧结论一致。

- **固定底数，只有指数变化**。令

  $$
  f(x)\equiv a>0,
  \qquad
  y=[f(x)]^{g(x)}=a^{g(x)},
  \qquad
  f'(x)=0.
  $$

  将整个对象代入通式：

  $$
  \begin{aligned}
  y'
  &=a^{g(x)}
  \left[
  g'(x)\ln a
  +g(x)\frac0a
  \right]\\
  &=a^{g(x)}\ln a\,g'(x).
  \end{aligned}
  $$

  这与对 $y=a^u$ 使用指数函数公式和链式法则得到的旧结论一致。

32. **2021 年计算题的第一阶部分**　设 $x>0$，

    $$
    y=x^x.
    $$

    先恒等改写为

    $$
    x^x=e^{x\ln x},
    $$

    再使用指数函数、积法则和链式法则。原题中的 $y''$ 留到高阶导数部分继续完成。

    参考结果：

    $$
    \boxed{y'=x^x(\ln x+1)}.
    $$

33. **独立代表题**　求

    $$
    y=(1+x^2)^{\sin x}
    $$

    的导数。

    因为 $1+x^2>0$，可以改写为

    $$
    y=e^{\sin x\,\ln(1+x^2)}.
    $$

    参考结果为

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

    把原函数恒等改写为 $y=e^{w(x)}$，其中

    $$
    w(x)
    =3\ln(x^2+1)
     +\frac12\ln(x+1)
     -x-2\ln(x-1).
    $$

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

## 第四次课：题目

### 从再求一次到高阶导数

对导函数继续求导，就得到二阶导数与更高阶导数。统一约定

$$
f^{(0)}(x)=f(x),
\qquad
f^{(1)}(x)=f'(x),
\qquad
f^{(n)}(x)=\bigl[f^{(n-1)}(x)\bigr]'.
$$

其中 $n\in\mathbb N^+$。$f^{(2)}$ 表示二阶导数，不表示 $f^2$；$d^2y/dx^2$ 是二阶导数的整体记号，不是 $(dy/dx)^2$。

36. **承接第 32 题：2021 年计算题的第二阶部分**　设 $x>0$，求 $y=x^x$ 的二阶导数。

    已有 $y'=x^x(\ln x+1)$，把导函数看作乘积再求一次：

    $$
    \begin{aligned}
    y''
    &=\bigl[x^x(\ln x+1)\bigr]'\\
    &=x^x(\ln x+1)^2+x^x\frac1x\\
    &=\boxed{x^x\left[(\ln x+1)^2+\frac1x\right]}.
    \end{aligned}
    $$

#### 光滑与可导的区别

设 $f$ 定义在开区间 $I$ 上。若 $f,f',\ldots,f^{(n)}$ 都在 $I$ 上存在且连续，则称 $f$ 在 $I$ 上 **$n$ 阶光滑**，也称 **$n$ 阶连续可导**，记作

$$
f\in C^n(I).
$$

若对任意正整数 $n$ 都成立，则称 $f$ 在 $I$ 上**光滑**，记作 $f\in C^\infty(I)$。$n$ 阶可导只要求逐阶导数存在；$n$ 阶光滑还要求这些导数连续，不能只根据图像看起来是否有尖点判断。

37. **一阶与二阶可导性的比较**　设 $f(x)=x|x|$，判断它是否一阶光滑，以及零点处是否存在二阶导数。

    在 $x\ne0$ 时分段求导；在零点回到定义：

    $$
    f'(0)
    =\lim_{\Delta x\to0}\frac{\Delta x|\Delta x|}{\Delta x}
    =0.
    $$

    因此对所有 $x\in\mathbb R$，都有

    $$
    \boxed{f'(x)=2|x|}.
    $$

    导函数连续，所以 $f\in C^1(\mathbb R)$。但

    $$
    \frac{f'(\Delta x)-f'(0)}{\Delta x}
    =\frac{2|\Delta x|}{\Delta x}
    =\begin{cases}
    2,&\Delta x>0,\\
    -2,&\Delta x<0.
    \end{cases}
    $$

    左右极限不同，$f''(0)$ 不存在，故 $f\notin C^2(\mathbb R)$。原来 $|x|$ 的尖点在本题中出现在导函数上：完成一次求导不意味着能无限次求下去。

38. **教材习题 2-3 第 2 题（第 77 页）**　物体的运动规律为

    $$
    s(t)=A\sin\omega t,
    $$

    其中 $A,\omega$ 为常数。求速度、加速度，并验证 $s''+\omega^2s=0$。

    参考结果：

    $$
    \left\{
    \begin{aligned}
    v(t)&=s'(t)=A\omega\cos\omega t,\\
    a(t)&=s''(t)=-A\omega^2\sin\omega t=-\omega^2s(t).
    \end{aligned}
    \right.
    $$

    一阶导数是位置的变化率，二阶导数是速度的变化率。把 $a=-\omega^2s$ 移项，便得到 $s''+\omega^2s=0$。

### 从前几阶导数发现通式

以下均设 $n\in\mathbb N^+$。先写前几阶导数，分别观察系数、符号、指数与函数形式，归入终止、稳定、周期循环或阶乘增长等结构，再猜第 $n$ 阶公式。检验通式时，除检查起始阶外，还要把第 $n$ 阶公式再求一次导数，比较能否得到第 $n+1$ 阶公式。

39. **教材第 74 页例 1、例 2：幂函数与多项式**　求 $y=x^\mu$ 的 $n$ 阶导数，其中 $x>0$、$\mu\in\mathbb R$；再求 $m$ 次多项式

    $$
    P_m(x)=a_mx^m+a_{m-1}x^{m-1}+\cdots+a_1x+a_0
    $$

    的高阶导数，其中 $m\in\mathbb N^+$、$a_m\ne0$。

    正整数幂与多项式属于“最终终止”型；一般实数次幂未必终止。每求一次导数，系数再乘一个逐次减小的因子，指数降低 $1$：

    $$
    \boxed{
    (x^\mu)^{(n)}
    =\mu(\mu-1)\cdots(\mu-n+1)x^{\mu-n}
    },
    \qquad x>0.
    $$

    特别地，正整数幂与多项式在全体实数上满足

    $$
    \left\{
    \begin{aligned}
    (x^m)^{(m)}&=m!,&
    (x^m)^{(n)}&=0\quad(n>m),\\
    P_m^{(m)}(x)&=m!a_m,&
    P_m^{(n)}(x)&=0\quad(n>m).
    \end{aligned}
    \right.
    $$

40. **教材第 75 页例 3：指数函数**　求 $y=a^x$ 的 $n$ 阶导数，其中 $a>0$、$a\ne1$。

    这是“形式稳定”型。每次求导保留 $a^x$，同时再乘一个 $\ln a$：

    $$
    (a^x)'=a^x\ln a,
    \qquad
    (a^x)''=a^x(\ln a)^2.
    $$

    因而

    $$
    \boxed{(a^x)^{(n)}=a^x(\ln a)^n},
    \qquad
    \boxed{(e^x)^{(n)}=e^x}.
    $$

41. **教材第 75 页例 4：正弦与余弦**　求 $y=\sin x$、$y=\cos x$ 的 $n$ 阶导数。

    这是“周期循环”型。连续求导后，每经过 $4$ 阶回到原函数；根据 $n$ 除以 $4$ 的余数，可以确定函数与符号。也可用相位平移统一表示：

    $$
    \left\{
    \begin{aligned}
    (\sin x)^{(n)}&=\sin\left(x+\frac{n\pi}{2}\right),\\
    (\cos x)^{(n)}&=\cos\left(x+\frac{n\pi}{2}\right).
    \end{aligned}
    \right.
    $$

    两个函数起点不同，但每求一次导数，相位都增加 $\pi/2$。

42. **教材第 75 页例 5、例 6：倒数与对数**　分别求

    $$
    y=\frac1{a+x}\quad(a+x\ne0),
    \qquad
    y=\ln(a+x)\quad(a+x>0)
    $$

    的 $n$ 阶导数，其中 $a$ 为常数。

    倒数函数的导数依次为

    $$
    -\frac1{(a+x)^2},
    \qquad
    \frac{2!}{(a+x)^3},
    \qquad
    -\frac{3!}{(a+x)^4}.
    $$

    记录符号交替、系数中的阶乘与分母次数增加，得到

    $$
    \boxed{
    \left(\frac1{a+x}\right)^{(n)}
    =(-1)^n\frac{n!}{(a+x)^{n+1}}
    },
    \qquad a+x\ne0.
    $$

    因为 $[\ln(a+x)]'=1/(a+x)$，对数函数的规律比倒数函数相差一阶：

    $$
    \boxed{
    [\ln(a+x)]^{(n)}
    =(-1)^{n-1}\frac{(n-1)!}{(a+x)^n}
    },
    \qquad a+x>0.
    $$

43. **参数回代检查（课堂按现场选择）**　把上述结构用于线性内层 $ax+b$，其中 $a,b$ 为常数。每次使用链式法则都会再乘一个 $a$，因此

    $$
    \left\{
    \begin{aligned}
    [\sin(ax+b)]^{(n)}
    &=a^n\sin\left(ax+b+\frac{n\pi}{2}\right),
    &&a,b\in\mathbb R,\\
    \left(\frac1{ax+b}\right)^{(n)}
    &=(-1)^n\frac{n!a^n}{(ax+b)^{n+1}},
    &&ax+b\ne0,\\
    [\ln(ax+b)]^{(n)}
    &=(-1)^{n-1}\frac{(n-1)!a^n}{(ax+b)^n},
    &&ax+b>0.
    \end{aligned}
    \right.
    $$

    参数代入不改变原有定义域要求。尤其要区分每阶累积的 $a^n$ 与只乘一次 $a$。

### 先改写为线性组合，再调用规律

若 $u,v$ 都 $n$ 阶可导，$A,B$ 为常数，则

$$
\boxed{(Au+Bv)^{(n)}=Au^{(n)}+Bv^{(n)}}.
$$

44. **教材第 76 页例 8：三角函数幂**　求 $y=\sin^3x$ 的 $n$ 阶导数。

    由三倍角恒等式，先改写为线性组合：

    $$
    \sin3x=3\sin x-4\sin^3x,
    \qquad
    \sin^3x=\frac34\sin x-\frac14\sin3x.
    $$

    再调用第 41、43 题的周期规律与参数公式：

    $$
    \boxed{
    (\sin^3x)^{(n)}
    =\frac34\sin\left(x+\frac{n\pi}{2}\right)
    -\frac{3^n}{4}\sin\left(3x+\frac{n\pi}{2}\right)
    }.
    $$

    第二项的 $3^n$ 来自对 $\sin3x$ 连续使用 $n$ 次链式法则。

### 莱布尼茨公式与多项式的终止

反复使用积法则得到

$$
\left\{
\begin{aligned}
(uv)'&=u'v+uv',\\
(uv)''&=u''v+2u'v'+uv'',\\
(uv)'''&=u'''v+3u''v'+3u'v''+uv'''.
\end{aligned}
\right.
$$

每一项的求导次数之和等于总阶数，系数则是二项式系数。若 $u,v$ 都 $n$ 阶可导，**莱布尼茨公式**为

$$
\boxed{
(uv)^{(n)}
=\sum_{k=0}^{n}C_n^k\,u^{(n-k)}v^{(k)}
},
$$

其中

$$
C_n^k=\frac{n!}{k!(n-k)!},
\qquad 0\le k\le n,
\qquad u^{(0)}=u,
\qquad v^{(0)}=v.
$$

$k$ 为整数，系数记录把总共 $n$ 次求导中的 $k$ 次分配给 $v$ 的方式数。继续求一次导数时，中间项按

$$
C_n^{k-1}+C_n^k=C_{n+1}^k,
\qquad 1\le k\le n,
$$

合并，首尾两项的系数仍为 $1$。

遇到“低次多项式乘熟悉函数”，把多项式记作 $v$，列出它何时终止，再调用另一因子的高阶导数通式。莱布尼茨公式只保留可能非零的项，不必机械求到目标阶。

45. **教材习题 2-3 第 6(1) 题（第 77 页）**　求 $y=xe^x$ 的 $n$ 阶导数。

    令 $u=e^x$、$v=x$。因为 $v'=1$、$v^{(k)}=0$（$k\ge2$），只保留 $k=0,1$：

    $$
    y^{(n)}=xe^x+ne^x=\boxed{(x+n)e^x}.
    $$

46. **教材第 76—77 页例 9**　设 $y=x^2e^{2x}$，求 $y^{(20)}$。

    令 $u=e^{2x}$、$v=x^2$。$u^{(r)}=2^re^{2x}$，而 $v'=2x$、$v''=2$、$v^{(k)}=0$（$k\ge3$），所以只保留三项：

    $$
    \begin{aligned}
    y^{(20)}
    &=2^{20}e^{2x}x^2
      +20\cdot2^{19}e^{2x}(2x)
      +C_{20}^2\,2^{18}e^{2x}\cdot2\\
    &=\boxed{2^{20}e^{2x}(x^2+20x+95)}.
    \end{aligned}
    $$

    实际项数由多项式次数控制，不随目标阶数增加到 $20$ 项。

47. **独立代表题（教材第 77 页例 10）**　设 $y=x^2\sin x$，求 $y^{(n)}$。

    把 $x^2$ 放在会终止的一列，至多保留三项。对 $n\ge2$，参考结果为

    $$
    \begin{aligned}
    y^{(n)}
    ={}&x^2\sin\left(x+\frac{n\pi}{2}\right)\\
    &+2nx\sin\left(x+\frac{(n-1)\pi}{2}\right)\\
    &+n(n-1)\sin\left(x+\frac{(n-2)\pi}{2}\right).
    \end{aligned}
    $$

    当 $n=1$ 时，只保留前两项：$y'=x^2\cos x+2x\sin x$。三项分别对应 $x^2$ 的零阶、一阶、二阶导数；剩余求导次数落在正弦函数上，故相位依次为 $n,n-1,n-2$ 倍的 $\pi/2$。

48. **当堂测试（教材习题 2-3 第 8 题，第 77 页）**　设 $f(x)=x^2\ln(1+x)$，求 $f^{(n)}(0)$，其中 $n\ge3$。

    先独立计算，再说明每次删项的依据。令 $u=\ln(1+x)$、$v=x^2$；原函数的定义域为 $x>-1$。在指定点有

    $$
    v(0)=v'(0)=0,
    \qquad v''(0)=2,
    \qquad v^{(k)}(0)=0\quad(k\ge3).
    $$

    代入莱布尼茨公式后只剩 $k=2$：

    $$
    f^{(n)}(0)=2C_n^2u^{(n-2)}(0).
    $$

    由对数的高阶导数公式，对 $r\ge1$，

    $$
    u^{(r)}(0)=(-1)^{r-1}(r-1)!.
    $$

    因此

    $$
    \begin{aligned}
    f^{(n)}(0)
    &=2\frac{n(n-1)}2(-1)^{n-3}(n-3)!\\
    &=\boxed{(-1)^{n-3}\frac{n!}{n-2}}.
    \end{aligned}
    $$

    比较：$k\ge3$ 因为多项式高阶导数**恒为零**而被删去；$k=0,1$ 是因为在**指定点**取值为零。条件 $n\ge3$ 保证调用的对数导数阶数 $n-2\ge1$。

### 可选补充：复合函数的二阶导数

设 $u=g(x)$、$y=f(u)=f(g(x))$，并且 $g$ 在所讨论区间二阶可导、$f$ 在相应的内层函数值范围二阶可导。由链式法则，再结合积法则，

$$
\begin{aligned}
y'&=f'(g(x))g'(x),\\
y''&=\bigl[f'(g(x))\bigr]'g'(x)+f'(g(x))g''(x)\\
&=\boxed{f''(g(x))[g'(x)]^2+f'(g(x))g''(x)}.
\end{aligned}
$$

$f''(g(x))$ 表示先对 $f(u)$ 关于 $u$ 求两次导数，再代入 $u=g(x)$；不能把它误当作整个复合函数的二阶导数。

若内层为 $g(x)=ax+b$，则 $g'=a$、$g''=0$，因此

$$
[f(ax+b)]''=a^2f''(ax+b).
$$

更一般地，若 $f$ 在相应区间 $n$ 阶可导，则

$$
\boxed{[f(ax+b)]^{(n)}=a^nf^{(n)}(ax+b)}.
$$

这统一解释了第 43 题中的参数公式；各函数的定义域条件仍须保留。

49. **选做（教材习题 2-3 第 4(1) 题，第 77 页）**　若 $f$ 在相应范围二阶可导，求 $y=f(x^2)$ 的二阶导数。

    内层是 $u=x^2$，$u'=2x$、$u''=2$。逐阶求导得到

    $$
    \begin{aligned}
    y'&=2xf'(x^2),\\
    y''&=2f'(x^2)+2xf''(x^2)\cdot2x\\
       &=\boxed{4x^2f''(x^2)+2f'(x^2)}.
    \end{aligned}
    $$

    与线性内层比较，本题 $u''\ne0$，所以第二项不能省略。

50. **选做（教材习题 2-3 第 1(2) 题，第 77 页）**　求 $y=e^{-x^2}$ 的二阶导数。

    可以逐阶使用积法则与链式法则，也可以在第 49 题中代入 $f(u)=e^{-u}$。参考计算：

    $$
    \begin{aligned}
    y'&=-2xe^{-x^2},\\
    y''&=-2e^{-x^2}+(-2x)(-2x)e^{-x^2}\\
       &=\boxed{(4x^2-2)e^{-x^2}}.
    \end{aligned}
    $$

    可继续求三阶导数：

    $$
    \begin{aligned}
    y'''
    &=8xe^{-x^2}+(4x^2-2)(-2x)e^{-x^2}\\
    &=\boxed{(12x-8x^3)e^{-x^2}}.
    \end{aligned}
    $$

    结果保持“多项式乘指数函数”的结构，继续求导仍使用已有法则。

### 可选入口：方程中隐藏的函数关系

51. **选做预告**　对圆 $x^2+y^2=1$，在适当局部把 $y$ 看作 $y(x)$，不先解出显函数，求 $y'$。

    整个圆不能给出唯一的 $y=f(x)$。在 $y\ne0$ 的局部，对等式两边关于 $x$ 求导，$y^2=[y(x)]^2$ 使用链式法则：

    $$
    2x+2y\,y'=0,
    \qquad
    \boxed{y'=-\frac{x}{y}}.
    $$

    这里只打开隐函数求导的入口；方程怎样确定局部函数，以及隐函数的一阶、二阶导数，将在下一次课系统讨论。

## 第五次课：题目

### 局部函数、分支与隐式求导

显式表示直接给出 $y=f(x)$；隐式表示用方程 $F(x,y)=0$ 给出关系。方程可能没有实数解，也可能对同一个 $x$ 给出多个 $y$，不能把任意方程直接当成一个函数。

选定曲线上一点 $(x_0,y_0)$，只考察它附近的一段关系；若在选定的这一段中，每个允许的 $x$ 唯一对应一个 $y$，便可以把这一段写成 $y=f(x)$。这里把在所考察点附近确定、使用的函数称为**局部函数**，选定的这一段称为一个**分支**；是否连续、可导，还需要另行判断。

承接第 51 题，圆 $x^2+y^2=1$ 在 $(0,1)$ 附近取上半圆分支，在 $(0,-1)$ 附近取下半圆分支：

$$
\left\{
\begin{aligned}
y&=\sqrt{1-x^2},&&\text{上半圆分支},\\
y&=-\sqrt{1-x^2},&&\text{下半圆分支}.
\end{aligned}
\right.
\qquad -1<x<1.
$$

两个分支可以使用相同的 $x$ 范围，却给出不同的 $y$。“局部”不只是缩小 $x$ 的范围，还要明确靠近哪一个点、选择哪一个分支。沿已经确定的可导分支求导，仍然得到 $y'=-x/y$（$y\ne0$）。

以下对已经确定的可导或二阶可导局部分支求导，不讨论一般方程怎样保证分支存在。每个 $y$ 都读成 $y(x)$；撇号均表示对 $x$ 求导：

$$
\left\{
\begin{aligned}
(x)'&=1,\qquad (y)'=y',\\
(y^2)'&=2y\,y',\\
(e^y)'&=e^y y',\\
(\ln y)'&=\frac{y'}{y}\quad(y>0),\\
(xy)'&=y+xy'.
\end{aligned}
\right.
$$

求一阶导数时，先对原等式两边关于 $x$ 求导，再把含 $y'$ 的项移到同一边，提取 $y'$，并在系数非零时解出。结果可以同时含 $x$ 与 $y$，但它们仍须满足原方程；不要求再消去 $y$。

52. **教材第 78 页例 1**　设方程

    $$
    e^y=xy
    $$

    确定可导的局部分支，求 $y'$。

    左边用链式法则，右边用积法则：

    $$
    e^y y'=y+xy',
    \qquad
    (e^y-x)y'=y.
    $$

    因此在 $e^y-x\ne0$ 时，

    $$
    \boxed{y'=\frac{y}{e^y-x}}.
    $$

    分式中的 $(x,y)$ 必须在原关系上。若解出导数时的系数为零，这个分式不能直接使用，应回到原关系判断，不能直接断言该点不可导。

53. **零系数的两个对照**　比较方程 $y^3=x^3$ 与 $y^3=x$ 在 $(0,0)$ 处所确定函数的可导性。

    对 $y^3=x^3$，沿可导分支求导得到

    $$
    3y^2y'=3x^2,
    \qquad
    y'=\frac{x^2}{y^2}\quad(y\ne0).
    $$

    在 $(0,0)$ 处，分式成为 $0/0$，求导后的等式只剩 $0\cdot y'(0)=0$，没有给出导数值。但原关系在实数范围内等价于 $y=x$，故

    $$
    \boxed{y'(0)=1}.
    $$

    对 $y^3=x$，假设零点存在有限导数，对原等式求导并代入零点会得到

    $$
    3y(0)^2y'(0)=1,
    \qquad 0\cdot y'(0)=1,
    $$

    矛盾。因此这个函数在零点没有有限导数。

    两题解出导数时的系数都为零，结论却不同：公式不能使用，不等于原函数必定不可导。

### 隐函数的切线与二阶导数

求指定点的切线，先确认点满足原关系，再求该分支在该点的导数，最后用点斜式

$$
y-y_0=y'(x_0)(x-x_0).
$$

54. **教材第 78 页例 2**　求曲线

    $$
    xy+\ln y=1
    $$

    在点 $(1,1)$ 处的切线方程。

    对数要求 $y>0$，且 $1+\ln1=1$，所以点在曲线上。在附近的可导分支上求导：

    $$
    y+xy'+\frac{y'}y=0,
    \qquad
    \left(x+\frac1y\right)y'=-y.
    $$

    因而

    $$
    y'=-\frac{y^2}{xy+1}\quad(xy+1\ne0).
    $$

    在 $(1,1)$ 处，分母为 $2$，故

    $$
    y'(1)=-\frac12,
    \qquad
    \boxed{y-1=-\frac12(x-1)}.
    $$

继续求二阶导数时，$y$ 与 $y'$ 都是关于 $x$ 的函数。可以对已解出的 $y'$ 求导，也可以保留第一次求导得到的等式，再求一次导数；选择结构更清楚的一条。收集 $y''$ 后，仍须核对其系数非零，必要时代入 $y'$ 与原方程化简。

55. **教材第 78—79 页例 3**　设二阶可导的局部分支满足

    $$
    x^2-xy+y^2=1,
    $$

    求 $y''$。

    第一次求导：

    $$
    2x-y-xy'+2y\,y'=0,
    \qquad
    y'=\frac{2x-y}{x-2y}\quad(x-2y\ne0).
    $$

    对未解出 $y'$ 的等式继续求导：

    $$
    2-y'-\bigl(y'+xy''\bigr)
    +2\bigl[(y')^2+y\,y''\bigr]=0.
    $$

    其中 $xy'$ 与 $yy'$ 都使用积法则。收集 $y''$：

    $$
    (x-2y)y''=2-2y'+2(y')^2.
    $$

    代入 $y'$ 并通分，用原方程化简：

    $$
    y''=\frac{6(x^2-xy+y^2)}{(x-2y)^3}
    =\boxed{\frac6{(x-2y)^3}},
    \qquad x-2y\ne0.
    $$

    例如在 $(0,1)$ 处，$y'=1/2$、$y''=-3/4$；两个值均沿同一个局部分支计算。

56. **独立练习（教材习题 2-4 第 3 题，第 81 页）**　设方程

    $$
    e^y+6xy+x^2-1=0
    $$

    在 $x=0$ 附近确定二阶可导的函数 $y=y(x)$，求 $y''(0)$。

    原方程在 $x=0$ 处给出 $e^{y(0)}=1$，故 $y(0)=0$。第一次求导：

    $$
    e^y y'+6y+6xy'+2x=0.
    $$

    代入 $x=0$、$y(0)=0$ 得 $y'(0)=0$。继续对函数等式求导：

    $$
    e^y\bigl[(y')^2+y''\bigr]+12y'+6xy''+2=0.
    $$

    再代入上述点值，得到

    $$
    y''(0)+2=0,
    \qquad
    \boxed{y''(0)=-2}.
    $$

    指定点题不必先解出完整的 $y''(x)$。每次先对函数等式求导，再代入点值；不能先把等式变成某一点处的数值等式，再对那个数值等式求导。

### 可选补充：从隐式求导回到差商极限

57. **选做（教材习题 2-4 第 2(3) 题，第 81 页；2020 年真题填空题第 3 题）**　设

    $$
    y=1+xe^y
    $$

    在 $x=0$ 附近确定二阶可导的分支 $y=f(x)$。

    （1）求 $y''$，并计算 $y'(0)$、$y''(0)$。

    原方程给出 $y(0)=1$。第一次求导：

    $$
    y'=e^y+xe^y y',
    \qquad
    (1-xe^y)y'=e^y.
    $$

    所以在 $1-xe^y\ne0$ 时，$y'=e^y/(1-xe^y)$，且 $y'(0)=e$。对未解出的等式继续求导：

    $$
    (1-xe^y)y''=2e^y y'+xe^y(y')^2.
    $$

    代入 $y'$ 后得到

    $$
    \boxed{y''=\frac{e^{2y}(2-xe^y)}{(1-xe^y)^3}},
    \qquad
    \boxed{y''(0)=2e^2}.
    $$

    （2）计算

    $$
    \lim_{n\to\infty}n\left[f\left(\frac2n\right)-1\right].
    $$

    这一步只需一阶导数。由 $f(0)=1$、$f'(0)=e$，还原为差商：

    $$
    n\left[f\left(\frac2n\right)-1\right]
    =2\frac{f(2/n)-f(0)}{2/n}
    \longrightarrow\boxed{2e}.
    $$

### 从极坐标转换到单参数曲线

平面上一点可以用到原点的距离 $r$ 与从 $x$ 轴正方向转到该点方向的有向角 $\theta$ 表示。约定 $r\ge0$，角度以逆时针为正，使用弧度；原点处 $r=0$，角度可以任取。极坐标到直角坐标的转换为

$$
\left\{
\begin{aligned}
x&=r\cos\theta,\\
y&=r\sin\theta.
\end{aligned}
\right.
$$

把点限制在单位圆上时，$r=1$ 固定，只有夹角 $\theta$ 变化：

$$
\left\{
\begin{aligned}
x&=\cos\theta,\\
y&=\sin\theta.
\end{aligned}
\right.
$$

一个角度同时决定两个坐标，不是让 $x$ 与 $y$ 独立变化。把共同变量记为 $t=\theta$，便得到单位圆的参数方程 $x=\cos t$、$y=\sin t$。半径固定为 $R>0$ 时，同理有 $x=R\cos t$、$y=R\sin t$。

一般地，用共同参数 $t$ 表示曲线上点的坐标：

$$
\left\{
\begin{aligned}
x&=x(t),\\
y&=y(t).
\end{aligned}
\right.
$$

这两个等式称为曲线的**参数方程**。本节 $x'(t)$、$y'(t)$ 都表示对 $t$ 求导，不同于关于横坐标的导数 $dy/dx$。若 $t$ 是时间，前两者是速度的横、纵分量，后者是轨迹的切线斜率。

### 参数曲线的一阶导数与变化率

在所考察位置附近，若 $x=x(t)$ 可反解为 $t=t(x)$，便得到局部函数 $y=y(t(x))$。坐标函数可导且 $x'(t)\ne0$ 时，由反函数求导与链式法则，

$$
\boxed{
\frac{dy}{dx}
=\frac{dy}{dt}\frac{dt}{dx}
=\frac{dy/dt}{dx/dt}
=\frac{y'(t)}{x'(t)}
}.
$$

也可比较变化量：

$$
\frac{\Delta y}{\Delta x}
=\frac{\Delta y/\Delta t}{\Delta x/\Delta t}.
$$

当 $\Delta t\to0$ 时，分子、分母分别趋于 $dy/dt$、$dx/dt$，其比给出切线斜率。若 $dx/dt=0$，公式不能直接使用，是否存在关于 $x$ 的导数应根据具体局部分支或差商另行判断。

58. **教材第 80 页例 4：抛射轨迹**　设质点运动满足

    $$
    \left\{
    \begin{aligned}
    x&=v_1t,\\
    y&=v_2t-\frac g2t^2,
    \end{aligned}
    \right.
    \qquad v_1,v_2>0,\quad g>0,\quad t\ge0.
    $$

    求速度大小、轨迹的切线斜率及 $d^2y/dx^2$。

    两个速度分量为

    $$
    \frac{dx}{dt}=v_1,
    \qquad
    \frac{dy}{dt}=v_2-gt.
    $$

    速度大小为 $\sqrt{v_1^2+(v_2-gt)^2}$，轨迹切线斜率为

    $$
    \boxed{\frac{dy}{dx}=\frac{v_2-gt}{v_1}}.
    $$

    $dy/dt$ 是每单位时间的纵坐标变化率，$dy/dx$ 是每单位横坐标变化对应的纵坐标变化率，两者不能互换。在最高点，$dy/dt=0$、$dx/dt=v_1\ne0$，所以切线水平。

### 参数曲线的二阶导数：斜率随横坐标的变化

假设所考察的坐标函数与局部分支二阶可导，且 $x'(t)\ne0$。把已经求出的一阶导数称为斜率，记作

$$
m(t)=\frac{dy}{dx}=\frac{y'(t)}{x'(t)}.
$$

$dm/dt$ 是斜率随参数的变化率；$dm/dx$ 是斜率随横坐标的变化率，后者才是 $d^2y/dx^2$。让参数改变 $\Delta t$，相应地横坐标改变 $\Delta x$、斜率改变 $\Delta m$，则

$$
\frac{\Delta m}{\Delta x}
=\frac{\Delta m/\Delta t}{\Delta x/\Delta t}
\longrightarrow
\frac{dm/dt}{dx/dt}.
$$

因此

$$
\boxed{\frac{d^2y}{dx^2}=\frac{dm}{dx}=\frac{dm/dt}{dx/dt}}.
$$

例如 $dm/dt=6$、$dx/dt=2$ 时，$d^2y/dx^2=3$，不是 $6$。也可从链式法则看：若当前局部分支为 $y=f(x)$，则 $m(t)=f'(x(t))$，所以

$$
\frac{dm}{dt}
=f''(x(t))\frac{dx}{dt}
=\frac{d^2y}{dx^2}\frac{dx}{dt}.
$$

将 $m(t)=y'(t)/x'(t)$ 代回后，得到计算公式：

$$
\boxed{
\frac{d^2y}{dx^2}
=\frac1{x'(t)}\frac d{dt}\left(\frac{y'(t)}{x'(t)}\right)
=\frac{y''(t)x'(t)-y'(t)x''(t)}{[x'(t)]^3}
}.
$$

“先对 $t$ 求导，再除以 $dx/dt$”还可简写成

$$
\frac d{dx}=\frac1{x'(t)}\frac d{dt},
\qquad x'(t)\ne0.
$$

求一、二阶导数时，依次完成：分别对两个坐标关于 $t$ 求导，取比得到 $dy/dx$；把这个比看成 $t$ 的函数再求导，最后除以 $x'(t)$。指定参数的题目，最后代入 $t=t_0$；需要切线时，还要同时计算点的两个坐标。

**接回第 58 题**：对已经得到的抛射轨迹斜率，先对 $t$ 求导，再除以 $dx/dt=v_1$：

$$
\frac{d^2y}{dx^2}
=\frac1{v_1}\frac d{dt}\left(\frac{v_2-gt}{v_1}\right)
=\boxed{-\frac g{v_1^2}}.
$$

本题 $x''(t)=0$，不能用 $y''(t)/x''(t)$ 计算关于 $x$ 的二阶导数。

59. **教材第 80 页例 5：摆线**　设

    $$
    \left\{
    \begin{aligned}
    x&=a(t-\sin t),\\
    y&=a(1-\cos t),
    \end{aligned}
    \right.
    \qquad a>0,
    $$

    求一阶与二阶导数，并在 $t=\pi$ 处求切线。

    两个坐标关于参数的导数为

    $$
    x'(t)=a(1-\cos t),
    \qquad y'(t)=a\sin t.
    $$

    当 $t\ne2k\pi$（$k\in\mathbb Z$）时，$x'(t)\ne0$，因此

    $$
    \frac{dy}{dx}=\frac{\sin t}{1-\cos t}.
    $$

    对这个斜率关于 $t$ 求导：

    $$
    \begin{aligned}
    \frac d{dt}\left(\frac{dy}{dx}\right)
    &=\frac{\cos t(1-\cos t)-\sin^2t}{(1-\cos t)^2}\\
    &=-\frac1{1-\cos t}.
    \end{aligned}
    $$

    最后再除以 $x'(t)$，得到

    $$
    \boxed{\frac{d^2y}{dx^2}=-\frac1{a(1-\cos t)^2}}.
    $$

    在 $t=\pi$ 处，点为 $(a\pi,2a)$，$dy/dx=0$、$d^2y/dx^2=-1/(4a)$，切线为 $\boxed{y=2a}$。

60. **独立练习（教材习题 2-4 第 5(1) 题，第 82 页）**　设

    $$
    \left\{
    \begin{aligned}
    x&=2t-t^2,\\
    y&=3t-t^3.
    \end{aligned}
    \right.
    $$

    求一阶与二阶导数，并在 $t_0=0$ 处求这两个导数及切线方程。

    先分别关于 $t$ 求导：

    $$
    x'(t)=2-2t,
    \qquad y'(t)=3-3t^2.
    $$

    当 $t\ne1$ 时，

    $$
    \frac{dy}{dx}
    =\frac{3-3t^2}{2-2t}
    =\frac32(1+t),
    $$

    从而

    $$
    \frac{d^2y}{dx^2}
    =\frac1{2-2t}\frac d{dt}\left[\frac32(1+t)\right]
    =\frac3{4(1-t)}.
    $$

    在 $t_0=0$ 处，点为 $(0,0)$、$x'(0)=2\ne0$，故

    $$
    \left\{
    \begin{aligned}
    \left.\frac{dy}{dx}\right|_{t=0}&=\frac32,\\
    \left.\frac{d^2y}{dx^2}\right|_{t=0}&=\frac34,
    \end{aligned}
    \right.
    \qquad
    \boxed{y=\frac32x}.
    $$

    $t=1$ 时原公式的分母为零，约分后的表达式不能据此自动补成该点处的导数；本题指定的 $t_0=0$ 不涉及这个边界。

### 可选补充：只求指定参数处的二阶导数

61. **选做（教材习题 2-4 第 7 题，第 82 页）**　设

    $$
    \left\{
    \begin{aligned}
    x&=2e^t+t+1,\\
    y&=4(t-1)e^t+t^2,
    \end{aligned}
    \right.
    $$

    求 $t=0$ 处的 $d^2y/dx^2$。

    分别计算所需的参数导数，不必先展开完整的二阶导数分式：

    $$
    \left\{
    \begin{aligned}
    x'(t)&=2e^t+1,&x''(t)&=2e^t,\\
    y'(t)&=4te^t+2t,&y''(t)&=4(t+1)e^t+2.
    \end{aligned}
    \right.
    $$

    在 $t=0$ 处，$x'(0)=3$、$x''(0)=2$、$y'(0)=0$、$y''(0)=6$，所以

    $$
    \left.\frac{d^2y}{dx^2}\right|_{t=0}
    =\frac{6\cdot3-0\cdot2}{3^3}
    =\boxed{\frac23}.
    $$

### 可选入口：一般极坐标方程

若曲线由 $r=r(\theta)$ 给出，把它改写为

$$
\left\{
\begin{aligned}
x&=r(\theta)\cos\theta,\\
y&=r(\theta)\sin\theta.
\end{aligned}
\right.
$$

共同参数仍然只有 $\theta$。记 $r'=dr/d\theta$，分别求导后取比：

$$
\frac{dy}{dx}
=\frac{r'\sin\theta+r\cos\theta}{r'\cos\theta-r\sin\theta},
\qquad r'\cos\theta-r\sin\theta\ne0.
$$

这里没有增加新的求导法则，仍是先对共同参数求导，再比较两个坐标的变化率。
