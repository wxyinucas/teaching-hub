<!-- lesson: 第一次课 -->
<!-- layout: question -->
# T01 · 极限
> 极限的定义与运算

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定义 -->
# T01 · Exercise 01

利用函数极限的定义，证明

$$
\lim_{x\to\frac12}\frac{1-4x^2}{2x-1}=-2.
$$

<!-- formulas -->

- **任意：** $\varepsilon>0$
- **存在：** $\delta>0$
- **只要：** $0<|x-x_0|<\delta$
- **就有：** $|f(x)-A|<\varepsilon$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定义与结论 -->
# T01 · Exercise 02

判断四个命题的真假，并说明理由；错误命题给出反例。

1. $f(x)\to A$，则 $f$ 在定义域内有界；
2. $f(n)\to A$，当且仅当 $f(x)\to A$；
3. $f(x)>0$ 且 $f(x)\to A$，则 $A>0$；
4. $f(x)>0$ 且 $f(x)\to A$，则 $A\ge0$。

以上函数极限均指 $x\to+\infty$。

<!-- formulas -->

- **无穷远极限**只直接控制充分靠后的函数值
- **海涅定理**要求任意趋近序列都给出同一函数值极限
- **序列条件：** $x_n\to+\infty$
- **极限保序：** 保留非严格不等式
- 严格正的函数可以趋于零

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的算法 -->
# T01 · Exercise 03

讨论极限

$$
\lim_{x\to0}
\frac{a_mx^m+\cdots+a_kx^k}
{b_nx^n+\cdots+b_ex^e},
$$

其中 $m>k$、$n>e$，$m,k,n,e$ 均为正整数，且
$a_m a_k b_n b_e\ne0$。

<!-- formulas -->

- **分子最低次幂：** $x^k$
- **分母最低次幂：** $x^e$
- **若出现负次幂：** $x^{-d}$
- **继续检查：** 次数奇偶与左右极限符号

---
<!-- layout: question -->
# T02 · 函数的连续性
> 从逐点极限到连续性判断

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的结论 -->
# T02 · Exercise 04*

设 $m$ 为正整数。

1. 证明：当 $a_i>0$ 时，

   $$
   \lim_{n\to\infty}\sqrt[n]{a_1^n+\cdots+a_m^n}
   =\max_{1\le i\le m}a_i.
   $$

2. 求

   $$
   f(x)=\lim_{n\to\infty}
   \sqrt[n]{1+x^n+\left(\frac{x^2}{2}\right)^n},
   \quad x\ge0,
   $$

   并讨论其连续性，其中 $x=0$ 单独讨论。

<!-- formulas -->

- **最大项：** $M=\max a_i$
- **夹逼：** $M^n\le\sum_{i=1}^m a_i^n\le mM^n$
- **分段函数：** 重点检查拼接点与定义域端点

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的分段讨论 -->
# T02 · Exercise 05*

讨论函数

$$
f(x)=\lim_{n\to\infty}
x\frac{1-x^{2n}}{1+x^{2n}}
$$

的连续性。

<!-- formulas -->

- **区间一：** $|x|<1$
- **分界点：** $x=\pm1$
- **区间二：** $|x|>1$
- **连续性：** 比较左右极限与函数值

---
<!-- layout: question -->
# T03 · 导数、求导与微分
> 可导性与求导

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的变换与展开 -->
# T03 · Exercise 06*

已知 $f'(a)$ 存在，且 $f(a)\ne0$，求

$$
\lim_{n\to\infty}
\left(
\frac{f\left(a+\dfrac1n\right)}{f(a)}
\right)^n.
$$

<!-- formulas -->

- **指数对数变换：** $B_n^n=\exp(n\ln B_n)$
- **底数增量：** $\displaystyle u_n=\frac{f\left(a+\frac1n\right)-f(a)}{f(a)}\to0$
- **从某项起：** $1+u_n>0$
- **Taylor–Peano：** $\ln(1+u_n)=u_n+o(u_n)$
- **导数定义：** $\displaystyle nu_n\to\frac{f'(a)}{f(a)}$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定义与结论 -->
# T03 · Exercise 07

已知 $f$ 在 $x=1$ 处可导，并且

$$
f(1+x)-3f(1-x)=8x+o(x)\qquad(x\to0).
$$

求 $f'(1)$。

<!-- formulas -->

- **一阶展开：** $f(1\pm x)=f(1)\pm f'(1)x+o(x)$
- **连续性：** 可导先推出连续
- **令：** $x\to0$
- **得到：** $f(1)=0$
- **反向增量：** $\displaystyle\frac{f(1-x)-f(1)}x\to-f'(1)$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的一阶展开 -->
# T03 · Exercise 08

设 $f$ 在 $x=1$ 处可导，且

$$
f(1)=0,\qquad f'(1)=2.
$$

求

$$
\lim_{x\to0}
\frac{\ln(1+\sin3x)\,f(\cos x)}{x^3}.
$$

<!-- formulas -->

- **对数外层：** $\ln(1+u)=u+o(u)$
- **正弦内层：** $\sin3x=3x+o(x)\quad o(\sin3x)=o(x)$
- **函数外层：** $f(1+u)=f(1)+f'(1)u+o(u)$
- **余弦内层：** $\cos x-1=-\dfrac{x^2}{2}+o(x^2)\quad o(\cos x-1)=o(x^2)$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定义 -->
# T03 · Exercise 09

设 $f(0)=0$。判断哪些条件足以推出 $f$ 在 $0$ 处可导，并说明理由。

1. $\displaystyle\lim_{h\to0}\frac{f(3h)-f(h)}{2h}$ 存在；
2. $\displaystyle\lim_{h\to0}\frac{f(h)-f(-h)}{2h}$ 存在；
3. $\displaystyle\lim_{h\to0}\frac{f(h^3)}{h^3}$ 存在；
4. $\displaystyle\lim_{h\to0}\frac{f(h^2)}{h^2}$ 存在。

<!-- formulas -->

- **导数定义：** $\displaystyle f'(0)=\lim_{t\to0}\frac{f(t)-f(0)}t$
- **双侧覆盖：** $t=h^3$
- **仅覆盖右侧：** $t=h^2$
- **条件不足：** 构造反例

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定义 -->
# T03 · Exercise 10

设 $f$ 处处可导，令

$$
F(x)=f(x)\bigl(1+|\sin x|\bigr).
$$

求 $F$ 在 $x=0$ 处可导的充要条件，并证明。

<!-- formulas -->

- 一点可导等价于左右导数都存在且相等
- **右侧：** $\displaystyle\lim_{h\to0^+}\frac{|\sin h|}{h}=1$
- **左侧：** $\displaystyle\lim_{h\to0^-}\frac{|\sin h|}{h}=-1$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的恒等式与展开式 -->
# T03 · Exercise 11*

设 $f$ 在 $x=0$ 的邻域内连续可导，且

$$
f(0)=1,\qquad f'(0)=4.
$$

求

$$
\lim_{x\to0}[f(\sin x)]^{\frac1{2x}}.
$$

<!-- formulas -->

- $\displaystyle u^v=\mathrm e^{v\ln u}$
- $f(t)=1+4t+o(t)$
- $\sin x=x+o(x)\quad o(\sin x)=o(x)$
- $\ln(1+u)=u+o(u)$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的求导公式 -->
# T03 · Exercise 12

函数 $y=y(x)$ 由

$$
xy-\mathrm e^x+\mathrm e^y=0
$$

确定。已知 $f$ 二阶可导且 $f'(1)=1$，令

$$
z=f(\mathrm e^y-\sin x).
$$

求 $z''(0)$。

<!-- formulas -->

- **隐式求导：** 方程两边同时对自变量求导
- **复合函数：** $z=f(u(x))$
- **二阶导数：** $z''=f''(u)(u')^2+f'(u)u''$

---
<!-- layout: question -->
# T04 · 中值定理、洛必达与 Taylor 展开
> 中值定理与局部展开

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定理与构造 -->
# T04 · Exercise 13

设 $f$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导，且

$$
f(a)=f(b)=1.
$$

证明：存在 $\xi,\eta\in(a,b)$，使得

$$
\mathrm e^{\eta-\xi}\bigl[f(\eta)+f'(\eta)\bigr]=1.
$$

<!-- formulas -->

- **中值定理：** 导数值等于区间上的割线斜率
- **构造一：** $\varphi(x)=\mathrm e^x f(x)$
- **构造二：** $\psi(x)=\mathrm e^x$
- **相同区间增量：** $\Delta\varphi=\Delta\psi=\mathrm e^b-\mathrm e^a$
- **导数一：** $\varphi'(\eta)=\mathrm e^\eta[f(\eta)+f'(\eta)]$
- **导数二：** $\psi'(\xi)=\mathrm e^\xi$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定理 -->
# T04 · Exercise 14

设 $f$ 定义在 $(1,+\infty)$ 上，且 $f',f''$ 存在。证明：若

$$
\lim_{x\to+\infty}f(x)=0,
\qquad
\lim_{x\to+\infty}f''(x)=0,
$$

则 $\displaystyle\lim_{x\to+\infty}f'(x)=0$。

<!-- formulas -->

- **原函数区间：** $[x,x+1]$
- **中值定理：** $f'(\eta_x)=f(x+1)-f(x)\to0$
- **导函数区间：** $[x,\eta_x]$
- **控制距离：** $0<\eta_x-x<1$
- **控制变化：** $f''(x)\to0$
- **最终目标：** $f'(x)\to0$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的一阶展开 -->
# T04 · Exercise 15

设

$$
\lim_{x\to0}
\frac{\ln\left(1+\dfrac{f(x)}{\sin x}\right)}{a^x-1}
=A,
\qquad a>0,\quad a\ne1.
$$

求 $\displaystyle\lim_{x\to0}\frac{f(x)}{x^2}$。

<!-- formulas -->

- **两层变量：** $\displaystyle u=\frac{f(x)}{\sin x}\quad w=\ln(1+u)$
- **已知极限：** $w=[A+o(1)](a^x-1)$
- **指数增量：** $a^x-1=x\ln a+o(x)$
- **解除对数：** $u=\mathrm e^w-1=w+o(w)$
- **恢复原函数：** $f(x)=u\sin x\quad \sin x=x+o(x)$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的展开式 -->
# T04 · Exercise 16*

确定常数 $a,b$，使得

$$
\lim_{x\to+\infty}
\left(\sqrt[3]{1-x^6}-ax^2-b\right)=0.
$$

<!-- formulas -->

- **换元：** $t=1/x$
- **趋近方向：** $x\to+\infty\Rightarrow t\to0^+$
- **负号来源：** $\displaystyle1-\frac1{t^6}=-\frac{1-t^6}{t^6}$
- **实数立方根：** $\displaystyle\sqrt[3]{1-x^6}=-\frac1{t^2}(1-t^6)^{1/3}$
- **展开：** $\displaystyle(1+u)^\alpha=1+\alpha u+o(u)$
- **先消去：** $t^{-2}$
- **再消去：** 常数项

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的展开式 -->
# T04 · Exercise 17*

求

$$
\lim_{x\to+\infty}
\left\{
\frac{\mathrm e}{2}x
+x^2\left[\left(1+\frac1x\right)^x-\mathrm e\right]
\right\}.
$$

<!-- formulas -->

- **换元：** $t=1/x$
- **内层整体：** $\displaystyle\delta(t)=\frac{\ln(1+t)}t-1\to0$
- **外层展开：** $\displaystyle\mathrm e^\delta-1=\delta+\frac{\delta^2}{2}+o(\delta^2)$
- 先把 $\delta(t)$ 整体代入并整理，再决定 $\ln(1+t)$ 的展开阶数

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的展开式 -->
# T04 · Exercise 18*

求

$$
\lim_{x\to0}x^{-2}
\left(1-\cos x\sqrt{\cos2x}\sqrt[3]{\cos3x}\right).
$$

<!-- formulas -->

- $\displaystyle\cos(kx)=1-\frac{k^2x^2}{2}+o(x^2)$
- $\displaystyle(1+u)^\alpha=1+\alpha u+o(u)$
- $\displaystyle u=cx^2+o(x^2),\ c\ne0\Rightarrow o(u)=o(x^2)$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的展开式 -->
# T04 · Exercise 19

设 $f$ 三阶可导且 $f'''(a)\ne0$。对于每个充分接近且不等于 $a$ 的 $x$，存在 $\theta(x)\in(0,1)$，使得

$$
\begin{aligned}
f(x)
&=f(a)+f'(a)(x-a)\\
&\quad+\frac12
f''\bigl(a+\theta(x)(x-a)\bigr)(x-a)^2,
\end{aligned}
$$

证明 $\displaystyle\lim_{x\to a}\theta(x)=\frac13$。

<!-- formulas -->

- **Taylor–Peano 展开**保留到三阶
- $f''(a+u)=f''(a)+f'''(a)u+o(u)$
- **中值点：** $0<\theta<1$
- **因此：** $\theta(x)(x-a)\to0$

---
<!-- layout: question -->
# T05 · 导数的应用
> 凸性与平均值

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的两种思路 -->
# T05 · Exercise 20

设 $f$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内二阶可导，且 $f''(x)>0$。证明：对于任意正整数 $n$ 以及任意 $x_1,\ldots,x_n\in[a,b]$，恒有

$$
\frac{f(x_1)+\cdots+f(x_n)}n
\ge
f\left(\frac{x_1+\cdots+x_n}{n}\right),
$$

<!-- formulas -->

- **凸性条件：** $f''>0$
- **一阶导数：** 严格递增
- **二点加权与归纳：** 先建立任意两点的加权不等式并按点的个数归纳
- **切线支撑：** 在平均值处作切线并在求和时消去线性项

---
<!-- layout: question -->
# T08 · 定积分及其应用
> 黎曼和

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定义与恒等式 -->
# T08 · Exercise 21

求

$$
\lim_{n\to\infty}\frac1n
\sum_{k=1}^{3n}\sqrt{1+\sin\frac{k\pi}{3n}}.
$$

<!-- formulas -->

- **黎曼和：** $\displaystyle\sum_{k=1}^N f(x_k)\,\Delta x\to\int_a^b f(x)\,dx$
- $\displaystyle1+\sin x=\left(\sin\frac x2+\cos\frac x2\right)^2$

---
<!-- lesson: 第二次课 -->
<!-- layout: question -->
# O 与 o 记号
> 余项尺度、嵌套 Taylor 与期中复习

---
<!-- layout: content -->
# O(1) 与 o(1)

- $c_n=O(1)$：存在 $M>0$，使充分大的 $n$ 都满足 $|c_n|\le M$
- $\varepsilon_n=o(1)$：$\varepsilon_n\to0$

$$
o(1)\subset O(1)
$$

- $O(1)$ 只表示有界，不保证收敛
- 例如 $(-1)^n=O(1)$，但 $(-1)^n$ 没有极限

---
<!-- layout: content -->
# O(u) 与 o(u)

$$
O(u)=uO(1),
\qquad
o(u)=uo(1)
$$

- $r=O(u)$：$r/u$ 最终有界
- $r=o(u)$：$r/u\to0$
- $o(u)\subset O(u)$，反过来一般不成立
- $3u=O(u)$，但通常 $3u\ne o(u)$

---
<!-- layout: content -->
# 加法规则

$$
\begin{aligned}
O(u)+O(u)&=O(u),\\
O(u)+o(u)&=O(u),\\
o(u)+o(u)&=o(u).
\end{aligned}
$$

- 同一位置出现的 $O$、$o$ 可以表示不同的具体量
- 这些式子描述尺度类别，不是固定函数的恒等式

---
<!-- layout: content -->
# 乘法与尺度传递

$$
\begin{aligned}
O(u)O(v)&=O(uv),\\
O(u)o(v)&=o(uv),\\
o(u)o(v)&=o(uv).
\end{aligned}
$$

$$
r=o(w),\quad w=O(u)
\quad\Longrightarrow\quad
r=o(u)
$$

- Exercise 15：$w=A\ln a\,x+o(x)=O(x)$，所以外层余项 $o(w)$ 可以写成 $o(x)$
- 除法还要检查分母，不能机械套用上述规则

---
<!-- layout: content -->
# 同阶尺度可以替换

$$
u=cx^m+o(x^m),
\qquad c\ne0
$$

$$
\frac{u}{x^m}\to c
$$

$$
\frac{o(u)}{x^m}
=
\frac{o(u)}u\cdot\frac{u}{x^m}
\to0
$$

$$
\boxed{o(u)=o(x^m)}
$$

---
<!-- layout: content -->
# 嵌套 Taylor：先保留整体

$$
\delta(t)
=
\frac{\ln(1+t)}t-1
\to0
$$

先不展开 $\ln(1+t)$：

$$
(1+t)^{1/t}
=
\mathrm e\,\mathrm e^{\delta(t)}
$$

$$
L
=
\mathrm e\left[
\frac1{2t}
+\frac{\mathrm e^{\delta(t)}-1}{t^2}
\right]
$$

---
<!-- layout: content -->
# 外层展开以后先整理

$$
\mathrm e^{\delta(t)}-1
=
\delta(t)+\frac{\delta(t)^2}{2}+r(t),
\qquad
r(t)=o(\delta(t)^2)
$$

$$
L
=
\mathrm e\left[
\frac{\delta(t)+t/2}{t^2}
+\frac12\left(\frac{\delta(t)}t\right)^2
+\frac{r(t)}{t^2}
\right]
$$

- 到这里不拆开 $\delta(t)$，三个部分都无法继续

---
<!-- layout: content -->
# 受阻以后再展开内层

$$
\frac{\delta(t)+t/2}{t^2}
=
\frac{\ln(1+t)-t+t^2/2}{t^3}
$$

$$
\ln(1+t)
=
t-\frac{t^2}{2}+\frac{t^3}{3}+o(t^3)
$$

- 此时才确定对数必须展开到三阶
- $\delta(t)\sim-t/2$，所以 $\displaystyle\frac{r(t)}{t^2}\to0$
- 最终结果：$\displaystyle L=\frac{11\mathrm e}{24}$

---
<!-- layout: content -->
# 为什么这个余项能消失

$$
\begin{aligned}
n\ln(1+u_n)
&=nu_n+n\,o(u_n)\\
&=nu_n+(nu_n)o(1).
\end{aligned}
$$

原题已经证明

$$
nu_n\to\frac{f'(a)}{f(a)}.
$$

- $n\,o(u_n)=(nu_n)o(1)$ 是合法尺度改写
- $nu_n$ 收敛，所以它有界
- 因此 $\displaystyle(nu_n)o(1)=o(1)\to0$

---
<!-- layout: content -->
# 只有小 o 还不够

$$
\begin{aligned}
u_n&=n^{-1/2},
&r_n&=n^{-1},\\
r_n&=o(u_n),
&nr_n&=1\not\to0.
\end{aligned}
$$

- 乘上一个随 $n$ 境长的量后，必须重新检查尺度
- 原题中余项消失，关键是 $nu_n$ 收敛，而不只是 $r_n=o(u_n)$

---
<!-- layout: question -->
# T03 · 导数、求导与微分
> 主值范围、差商与参数方程

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的恒等式与范围 -->
# T03 · Exercise 01

证明

$$
2\arctan x
+\arcsin\frac{2x}{1+x^2}
=\pi,
\qquad x\ge1.
$$

<!-- formulas -->

- $\displaystyle\theta=\arctan x$
- $\displaystyle\sin2\theta=\frac{2\tan\theta}{1+\tan^2\theta}$
- $\displaystyle\arctan x\in\left[\frac\pi4,\frac\pi2\right)$
- $\displaystyle\arcsin y\in\left[-\frac\pi2,\frac\pi2\right]$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定义与代换 -->
# T03 · Exercise 02

设 $f(0)=0$。判断哪个条件与 $f'(0)$ 存在等价。

1. $\displaystyle\lim_{h\to0}\frac{f(1-\cos h)}{h^2}$ 存在
2. $\displaystyle\lim_{h\to0}\frac{f(1-\mathrm e^h)}h$ 存在
3. $\displaystyle\lim_{n\to\infty}n f\left(\frac1n\right)$ 存在
4. $\displaystyle\lim_{h\to0}\frac{f(h)-f(-h)}h$ 存在

<!-- formulas -->

- $\displaystyle f'(0)=\lim_{t\to0}\frac{f(t)-f(0)}t$
- 检查新变量是否覆盖 $t\to0^-$ 与 $t\to0^+$
- $\displaystyle t=1-\mathrm e^h$
- $\displaystyle\frac{t}{h}\to-1$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 参数方程求导公式 -->
# T03 · Exercise 03

设

$$
\begin{cases}
x=\cos t,\\
y=t\cos t-\sin t,
\end{cases}
$$

求

$$
\frac{dy}{dx},
\qquad
\frac{d^2y}{dx^2}.
$$

<!-- formulas -->

- 条件：$\displaystyle\frac{dx}{dt}\ne0$
- $\displaystyle\frac{dy}{dx}=\frac{dy/dt}{dx/dt}$
- $\displaystyle\frac{d^2y}{dx^2}
=\frac{\dfrac d{dt}\left(\dfrac{dy}{dx}\right)}{dx/dt}$

---
<!-- layout: question -->
# T04 · 中值定理、洛必达与泰勒
> Taylor 系数与零端点构造

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的 Taylor–Peano 展开 -->
# T04 · Exercise 04

设 $f$ 在 $x=0$ 处二阶可导，且

$$
\lim_{x\to0}
\frac{\mathrm e^{f(x)}-1}{1-\cos x}=2.
$$

求 $f''(0)$。

<!-- formulas -->

- $\mathrm e^u-1=u+o(u)$
- $\displaystyle1-\cos x=\frac{x^2}{2}+o(x^2)$
- $\displaystyle f(x)=f(0)+f'(0)x+\frac{f''(0)}2x^2+o(x^2)$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的构造 -->
# T04 · Exercise 05

设 $f$ 在 $[0,1]$ 上连续、在 $(0,1)$ 内可导，且

$$
f(0)=f(1)=0,
\qquad
f\left(\frac12\right)=1.
$$

证明：

1. 存在 $\eta\in(1/2,1)$，使 $f(\eta)=\eta$
2. 对任意 $\lambda\in\mathbb R$，存在 $\xi\in(0,\eta)$，使
   $f'(\xi)-\lambda[f(\xi)-\xi]=1$

<!-- formulas -->

- [已讲原型：T04 · 2023 年应用与证明题 2](#/terms/2026-fall/courses/calculus-i/topics/topic-04-mvt-lhopital-taylor/runbook)
- $g(x)=f(x)-x$
- 先用介值定理找到 $g(\eta)=0$
- $\Phi(x)=\mathrm e^{-\lambda x}g(x)$
- 在 $[0,\eta]$ 上使用罗尔定理

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的构造 -->
# T04 · Exercise 06

设 $f$ 在 $[0,3]$ 上连续、在 $(0,3)$ 内可导，且

$$
f(1)+f(2)+f(3)=0.
$$

证明：

1. 存在 $\eta\in[1,3]$，使 $f(\eta)=0$
2. 若 $f(0)=0$，则存在 $\xi\in(0,3)$，使
   $f(\xi)+2f'(\xi)=0$

<!-- formulas -->

- 三个函数值不可能严格同号
- 先用介值定理找到零点
- $\Phi(x)=\mathrm e^{x/2}f(x)$
- 在 $[0,\eta]$ 上使用罗尔定理

---
<!-- lesson: 第三次课 -->
<!-- layout: question -->
# 期中考试试卷讲评
> 按 Course Topic 重组全部试题

---
<!-- layout: question -->
# T01 · 极限
> 点值、无穷小阶、夹逼与左右极限

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定义 -->
# T01 · Exercise 01

设 $f(x)$ 在 $x_0$ 的某去心邻域内有定义，则下列命题中正确的是（　）。

A. 若 $\displaystyle\lim_{x\to x_0}f(x)$ 存在，则 $f(x)$ 在 $x_0$ 处必有定义

B. 若 $\displaystyle\lim_{x\to x_0}f(x)=A$，则 $f(x_0)=A$

C. 若 $f(x_0)=A$，则 $\displaystyle\lim_{x\to x_0}f(x)=A$

D. $\displaystyle\lim_{x\to x_0}f(x)$ 是否存在，与 $f(x)$ 在 $x_0$ 处是否有定义无关

<!-- formulas -->

- 极限定义使用 $0<|x-x_0|<\delta$
- 极限只考察 $x_0$ 的去心邻域
- 连续性才要求 $\displaystyle\lim_{x\to x_0}f(x)=f(x_0)$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的等价关系 -->
# T01 · Exercise 02

当 $x\to0$ 时，无穷小

$$
\sqrt[10]{1+3x^6}-1
$$

与 $x^p$ 同阶，则 $p$ 等于（　）。

A. $3$　　B. $6$　　C. $10$　　D. $12$

<!-- formulas -->

- 令 $u=3x^6$
- $\displaystyle(1+u)^\alpha-1\sim\alpha u$
- 同阶要求比值趋于非零常数

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的准则 -->
# T01 · Exercise 03

计算

$$
\lim_{n\to\infty}
\left(
\frac1{\sqrt{n^2+1}}
+\frac1{\sqrt{n^2+2}}
+\cdots
+\frac1{\sqrt{n^2+n}}
\right).
$$

<!-- formulas -->

- 共有 $n$ 项
- 对 $1\le k\le n$，统一比较
  $\displaystyle\frac1{\sqrt{n^2+k}}$
- 夹逼准则
- 不需要使用定积分

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的恒等变换与展开 -->
# T01 · Exercise 04

计算

$$
\lim_{x\to0}
(\cos2x)^{\frac1{x\sin x}}.
$$

<!-- formulas -->

- $\displaystyle a(x)^{b(x)}
=\exp[b(x)\ln a(x)]$
- $\displaystyle\cos2x=1-2x^2+o(x^2)$
- $\displaystyle\ln(1+u)=u+o(u)$
- $\displaystyle\sin x=x+o(x)$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的左右极限 -->
# T01 · Exercise 05

已知极限

$$
\lim_{x\to0}
\left(
\frac{2+\mathrm e^{1/x}}
{1+\mathrm e^{1/x}}
+\frac{\sin ax}{|x|}
\right)
$$

存在，求 $a$ 及该极限值。

<!-- formulas -->

- 双侧极限存在要求左右极限相等
- $x\to0^+$ 时：$\mathrm e^{1/x}\to+\infty$，$|x|=x$
- $x\to0^-$ 时：$\mathrm e^{1/x}\to0$，$|x|=-x$
- $\displaystyle\lim_{x\to0}\frac{\sin ax}{x}=a$

---
<!-- layout: question -->
# T02 · 连续性
> 候选间断点与分段点拼接

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的间断点分类 -->
# T02 · Exercise 06

设 $f(x)=\dfrac{x^3-x}{\sin\pi x}$。讨论其间断点，则结论为（　）。

A. 有三个可去间断点　　B. 只有一个可去间断点

C. 有两个跳跃间断点　　D. 有无穷多个第一类间断点

<!-- formulas -->

- 先解 $\sin\pi x=0$
- $x^3-x=x(x-1)(x+1)$
- 同时为零时继续比较消失的阶
- 函数无界时属于无穷间断点

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的连续性条件 -->
# T02 · Exercise 07

已知

$$
f(x)=
\begin{cases}
\dfrac{\sin2x+\mathrm e^{2ax}-1}{x},&x\ne0,\\[6pt]
a,&x=0,
\end{cases}
$$

在 $(-\infty,+\infty)$ 上连续，求 $a$。

<!-- formulas -->

- 拼接条件：
  $\displaystyle\lim_{x\to0}f(x)=f(0)$
- $\displaystyle\lim_{u\to0}\frac{\sin u}{u}=1$
- $\displaystyle\lim_{u\to0}\frac{\mathrm e^u-1}{u}=1$

---
<!-- layout: question -->
# T03 · 导数、求导与微分
> 差商、复合结构与参数方程

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的导数定义 -->
# T03 · Exercise 08

设 $f'(x_0)=2$，则

$$
\lim_{h\to0}
\frac{f(x_0+2h)-f(x_0-h)}h
$$

等于（　）。

A. $2$　　B. $1$　　C. $6$　　D. 不确定

<!-- formulas -->

- 在分子中加减 $f(x_0)$
- $\displaystyle
f'(x_0)=
\lim_{\Delta x\to0}
\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}$
- 分别检查增量 $2h$ 与 $-h$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的可导条件 -->
# T03 · Exercise 09

设

$$
f(x)=
\begin{cases}
x^2,&x\le1,\\
ax+b,&x>1,
\end{cases}
$$

若 $f$ 在 $x=1$ 处可导，则 $(a,b)$ 等于（　）。

A. $(2,-1)$　　B. $(2,1)$

C. $(-2,1)$　　D. $(1,0)$

<!-- formulas -->

- 可导必连续
- 先比较左右函数值
- 再比较左右导数

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的导数定义 -->
# T03 · Exercise 10

设 $f(0)=0$，则 $f$ 在 $x=0$ 处可导的充要条件是下列哪个极限存在（　）。

A. $\lim_{x\to0}\frac{f(\ln(1+x^2))}{x}$　　B. $\lim_{x\to0}\frac{f(1-\cos x)}{x^2}$

C. $\lim_{x\to0}\frac{f(x^2)}x$　　D. $\lim_{x\to0}\frac{f(\mathrm e^x-1)}x$

<!-- formulas -->

- $\displaystyle f'(0)=\lim_{t\to0}\frac{f(t)}t$
- 检查内层变量是否覆盖 $t\to0^-$ 与 $t\to0^+$
- 检查新变量与原增量是否同阶
- 反例可从 $f(t)=|t|$ 开始尝试

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 反函数求导公式 -->
# T03 · Exercise 11

设

$$
y=x+\mathrm e^x
$$

的反函数为 $x=\varphi(y)$，求

$$
\varphi'(1).
$$

<!-- formulas -->

- 先由 $y_0=g(x_0)$ 找到对应的 $x_0$
- $\displaystyle(g^{-1})'(y_0)=\frac1{g'(x_0)}$
- $\displaystyle g(x)=x+\mathrm e^x$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的高阶导数规律 -->
# T03 · Exercise 12

设 $f(x)=\sin2x$，求

$$
f^{(2026)}
\left(\frac\pi4\right).
$$

<!-- formulas -->

- $\displaystyle
\frac{d^n}{dx^n}\sin(ax)
=
a^n\sin\left(ax+\frac{n\pi}{2}\right)$
- 三角函数连续求导以 $4$ 为周期
- 先计算 $2026\bmod4$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 切线与导数 -->
# T03 · Exercise 13

已知曲线 $y=f(x)$ 在点 $(1,f(1))$ 处的切线为

$$
y=3x-1.
$$

求

$$
f(1),
\qquad
f'(1).
$$

<!-- formulas -->

- 切点位于切线上
- $\displaystyle
y-f(x_0)=f'(x_0)(x-x_0)$
- 导数等于切线斜率

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的求导与微分公式 -->
# T03 · Exercise 14

1. 设
   $$
   y=(1+x^2)^{1/x},
   $$
   求 $y'(1)$。

2. 已知
   $$
   y=\ln(\mathrm e^x+\cos2x),
   $$
   求 $dy$。

<!-- formulas -->

- 幂指函数：先写 $\ln y$
- $\displaystyle(\ln u)'=\frac{u'}u$
- 商的求导法则
- $\displaystyle dy=y'\,dx$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 参数方程求导公式 -->
# T03 · Exercise 15

设

$$
\begin{cases}
x=\arctan t,\\
y=7t-\cos t,
\end{cases}
$$

求

$$
\left.
\frac{d^2y}{dx^2}
\right|_{t=0}.
$$

<!-- formulas -->

- $\displaystyle\frac{dy}{dx}
=\frac{dy/dt}{dx/dt}$
- $\displaystyle
\frac{d^2y}{dx^2}
=
\frac{\dfrac d{dt}\left(\dfrac{dy}{dx}\right)}
{dx/dt}$
- 先确认 $\displaystyle dx/dt\ne0$

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 复合函数求导法则 -->
# T03 · Exercise 16

已知

$$
y=\mathrm e^{f\left(\frac{x-1}{x+1}\right)},
\qquad
f(x)=\arctan x,
$$

求

$$
\left.\frac{dy}{dx}\right|_{x=0}.
$$

<!-- formulas -->

- $\displaystyle u=\frac{x-1}{x+1},\quad v=f(u),\quad y=\mathrm e^v$
- $\displaystyle\frac{dy}{dx}=\frac{dy}{dv}\frac{dv}{du}\frac{du}{dx}$
- $\displaystyle(\arctan u)'=\frac1{1+u^2}$
- 指定点计算从 $u(0)$ 开始，逐层向外

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 连续、可导与导函数连续 -->
# T03 · Exercise 17

设 $f(0)=0$；当 $x\ne0$ 时，$f(x)=x^2\sin\dfrac1x+x$。

（1）证明 $f$ 在 $x=0$ 处连续；

（2）判断 $f$ 在 $x=0$ 处是否可导；若可导，求 $f'(0)$ 并讨论 $f'$ 在 $x=0$ 处的连续性。

<!-- formulas -->

- 连续：$\displaystyle\lim_{x\to0}f(x)=f(0)$
- 可导：回到 $x=0$ 处的差商
- 导函数连续：$\displaystyle\lim_{x\to0}f'(x)=f'(0)$
- $\displaystyle|\sin(1/x)|\le1$

---
<!-- layout: question -->
# T05 · 导数的应用
> 方程根的存在性与唯一性

---
<!-- layout: exercise -->
<!-- timer: 60 -->
<!-- formulas-title: 可能用到的定理 -->
# T05 · Exercise 18

证明方程

$$
x\cdot2^x=1
$$

在区间 $(0,1)$ 内有且仅有一个实根。

<!-- formulas -->

- 令 $\displaystyle F(x)=x\cdot2^x-1$
- 介值定理：端点异号 $\Longrightarrow$ 至少一个根
- 拉格朗日中值定理：$F'(x)>0\Longrightarrow F$ 严格递增
- 严格递增 $\Longrightarrow$ 至多一个根
