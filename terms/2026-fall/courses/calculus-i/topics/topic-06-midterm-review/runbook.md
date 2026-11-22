# T06｜阶段复习与期中讲评

> 高等数学（上） · 3 次课 · 约 100 人 · 板书与题目 Slides 配合 · 工作版

## 本专题

- 根问题：学过的定义、定理和算法，面对跨专题题目时怎样重新找到入口？
- 最低出口：能把题目放回相应 Topic，识别共同结构，并用已经学过的方法完成求解或证明。
- 硬收口：通过期中试卷讲评检查知识网络中的薄弱点；下一专题回到不定积分的计算主线。

- **Road map：从零散题目回到知识结构**
  - 把学生提交的题目放回原专题，先恢复必要的定义、定理与算法
  - 比较内核相同的题目，提炼可迁移的识别信号与求解结构
  - 补齐 $O$、$o$ 与嵌套 Taylor 展开的尺度语言
  - 用真实答卷检验理解，区分概念缺口、方法选择与计算失误

## 第一次课 · 跨专题答疑：从学生题目回到知识结构

> 本专题覆盖多个已学 Topic；学生题目按课程 Topic 归类，在每个 Topic 内先回补知识点或总结算法，再依次处理 Exercises。

### 0-50 | Course Topic → 知识点／算法总结 → Exercises

#### 课前检查

- 题目统一改写为简答题，并按课程 Topic 顺序重新编号。
- 相同知识结构的题目归入同一个课程 Topic；先整理本组题目共同依赖的知识点或算法，再按 Exercise 编号依次处理。
- 后续新增题目直接插入对应课程 Topic 与知识点，再统一顺延 Exercise 编号。

#### T01 · 极限：从定义到存在与运算

##### 知识点：函数极限的定义

- 先把待证结论改写成 $|f(x)-A|$ 的估计，再把它控制为 $|x-x_0|$ 的倍数。
- 根据给定的 $\varepsilon$ 反推 $\delta$，最后按定义完整写出“任给—存在—只要—就有”的逻辑链。

##### Exercise 01｜用定义证明函数极限

- 利用函数极限的定义，证明

    $$
    \lim_{x \to \frac12}\frac{1-4x^2}{2x-1}=-2.
    $$

- **求解**：当 $x\ne\frac12$ 时，

  $$
  \frac{1-4x^2}{2x-1}
  =\frac{(1-2x)(1+2x)}{2x-1}
  =-(1+2x).
  $$

  任给 $\varepsilon>0$，取

  $$
  \delta=\frac{\varepsilon}{2}.
  $$

  当

  $$
  0<\left|x-\frac12\right|<\delta
  $$

  时，有

  $$
  \left|
  \frac{1-4x^2}{2x-1}-(-2)
  \right|
  =|1-2x|
  =2\left|x-\frac12\right|
  <2\delta
  =\varepsilon.
  $$

  因此

  $$
  \boxed{
  \lim_{x\to\frac12}\frac{1-4x^2}{2x-1}=-2
  }.
  $$

##### 知识点：无穷远处的极限只约束函数的尾部

- 函数在无穷远处趋于有限值，只能直接控制充分靠后的函数值，不能自动控制整个定义域上的行为。
- 沿整数取值只检查了一条特殊的自变量序列；判断它能否反推函数极限时，要回到海涅定理的“任意趋近序列”。
- 极限可以保留非严格不等式，但严格正的函数仍可能趋于零。

##### Exercise 02｜辨析无穷远极限的四个命题

- 判断下列命题的真假，并说明理由；对于错误命题给出反例。

    1. 若 $\displaystyle\lim_{x\to+\infty}f(x)=A$，则 $f(x)$ 在其定义域内一定有界；

    2. $\displaystyle\lim_{x\to+\infty}f(x)=A$ 的充要条件是 $\displaystyle\lim_{n\to\infty}f(n)=A$；

    3. 若 $f(x)>0$ 且 $\displaystyle\lim_{x\to+\infty}f(x)=A$，则 $A>0$；

    4. 若 $f(x)>0$ 且 $\displaystyle\lim_{x\to+\infty}f(x)=A$，则 $A\ge0$。

- **求解**：

  1. 命题错误。无穷远处的极限只控制函数在充分靠后的尾部，不能控制整个定义域。例如

     $$
     f(x)=\frac1{x-1},\qquad x\ne1.
     $$

     虽然 $\lim_{x\to+\infty}f(x)=0$，但 $f(x)$ 在 $x=1$ 附近无界。

  2. 命题错误。若 $\lim_{x\to+\infty}f(x)=A$，则沿整数序列必有 $f(n)\to A$，所以该条件是必要的；但它不充分。例如取

     $$
     f(x)=\sin\pi x.
     $$

     对每个正整数 $n$ 都有 $f(n)=0$，但 $f(x)$ 在 $x\to+\infty$ 时不断振荡，不存在极限。

  3. 命题错误。取

     $$
     f(x)=\mathrm e^{-x}>0,
     \qquad
     \lim_{x\to+\infty}f(x)=0.
     $$

     严格正的函数仍然可以趋于零。

  4. 命题正确。若反设 $A<0$，取 $\varepsilon=-A/2>0$。当 $x$ 充分大时，

     $$
     |f(x)-A|<-\frac A2,
     $$

     从而

     $$
     f(x)<A-\frac A2=\frac A2<0,
     $$

     与 $f(x)>0$ 矛盾。因此必有 $A\ge0$。

  综上，只有第 4 个命题正确。

##### 算法总结：从最低次项判断多项式商的极限

- 分子、分母分别提出最低次幂；趋近零点时，真正决定极限的是最低次非零项。
- 比较两个最低次数，再在出现负次幂时检查左右趋近是否给出同一个结果。

##### Exercise 03｜多项式商在零点处的分类讨论

- 设 $m>k$、$n>e$，且 $m,k,n,e$ 均为正整数，

    $$
    a_m\ne0,\qquad a_k\ne0,\qquad b_n\ne0,\qquad b_e\ne0.
    $$

    讨论极限

    $$
    \lim_{x\to0}
    \frac{a_mx^m+a_{m-1}x^{m-1}+\cdots+a_kx^k}
    {b_nx^n+b_{n-1}x^{n-1}+\cdots+b_ex^e}.
    $$

- **求解**：分别提出分子、分母的最低次幂：

  $$
  \frac{a_mx^m+\cdots+a_kx^k}
  {b_nx^n+\cdots+b_ex^e}
  =x^{k-e}
  \frac{a_k+a_{k+1}x+\cdots+a_mx^{m-k}}
  {b_e+b_{e+1}x+\cdots+b_nx^{n-e}}.
  $$

  记

  $$
  c=\frac{a_k}{b_e}\ne0.
  $$

  右侧第二个因子在 $x\to0$ 时趋于 $c$，因此只需比较 $k$ 与 $e$。

  1. 当 $k>e$ 时，$x^{k-e}\to0$，原极限为

     $$
     \boxed{0}.
     $$

  2. 当 $k=e$ 时，原极限为

     $$
     \boxed{\frac{a_k}{b_e}}.
     $$

  3. 当 $k<e$ 时，令 $d=e-k>0$，原式与

     $$
     \frac{c}{x^d}
     $$

     具有相同的发散方式：

     - 若 $d$ 为偶数，则双侧无穷极限存在，并且

       $$
       \lim_{x\to0}\frac{c}{x^d}
       =
       \begin{cases}
       +\infty,&c>0,\\
       -\infty,&c<0;
       \end{cases}
       $$

     - 若 $d$ 为奇数，则左右极限符号相反，双侧极限不存在。

  若只讨论有限极限，则 $k<e$ 时均不存在有限极限；若允许无穷极限，还需按 $e-k$ 的奇偶性与 $a_k/b_e$ 的符号分类。

#### T02 · 函数的连续性

##### 算法总结：先用最大项夹逼，再检查分段函数的拼接点

- 先用最大项同时控制根式中的和，得到可取极限的上下界。
- 极限生成函数后，先写出由“最大值”决定的分段表达式，再逐一检查分段点；端点 $x=0$ 单独讨论。

##### Exercise 04*｜最大项、函数表达式与连续性

- 设 $m$ 为正整数。

    1. 证明：当 $a_i>0\ (i=1,2,\ldots,m)$ 时，

       $$
       \lim_{n\to\infty}
       \sqrt[n]{a_1^n+a_2^n+\cdots+a_m^n}
       =\max_{1\le i\le m}\{a_i\}.
       $$

    2. 利用上述结论求

       $$
       f(x)=\lim_{n\to\infty}
       \sqrt[n]{1+x^n+\left(\frac{x^2}{2}\right)^n},
       \qquad x\ge0,
       $$

       并讨论 $f(x)$ 的连续性。讨论时单独处理 $x=0$。

- **求解（1）**：令

  $$
  M=\max_{1\le i\le m}\{a_i\}.
  $$

  由于各 $a_i>0$，有

  $$
  M^n
  \le a_1^n+a_2^n+\cdots+a_m^n
  \le mM^n.
  $$

  两端取 $n$ 次方根：

  $$
  M
  \le
  \sqrt[n]{a_1^n+a_2^n+\cdots+a_m^n}
  \le
  \sqrt[n]{m}\,M.
  $$

  因为 $\sqrt[n]{m}\to1$，由夹逼准则得到

  $$
  \boxed{
  \lim_{n\to\infty}
  \sqrt[n]{a_1^n+a_2^n+\cdots+a_m^n}=M
  }.
  $$

- **求解（2）**：当 $x>0$ 时，由（1）可得

  $$
  f(x)=\max\left\{1,x,\frac{x^2}{2}\right\}.
  $$

  当 $x=0$ 时不能原样套用（1）中的正数条件，但可以直接计算：

  $$
  f(0)=\lim_{n\to\infty}\sqrt[n]{1}=1.
  $$

  比较三个函数可得

  $$
  f(x)=
  \begin{cases}
  1,&0\le x\le1,\\[2mm]
  x,&1\le x\le2,\\[2mm]
  \dfrac{x^2}{2},&x\ge2.
  \end{cases}
  $$

  各段内部连续；在 $x=1$ 处两段函数值都为 $1$，在 $x=2$ 处两段函数值都为 $2$。端点 $x=0$ 的右邻域内 $f(x)\equiv1$，因此

  $$
  \boxed{f(x)\text{ 在 }[0,+\infty)\text{ 上连续}}.
  $$

##### 算法总结：先按 $|x|$ 与 $1$ 的关系求逐点极限，再检查分界点

- 固定 $x$，先比较 $|x|$ 与 $1$，由此判断 $x^{2n}$ 趋于 $0$、保持为 $1$，还是趋于 $+\infty$。
- 把逐点极限写成分段函数后，各段内部直接使用初等函数的连续性；只需另外检查分界点处的左右极限与函数值。

##### Exercise 05*｜逐点极限生成的分段函数与连续性

- 讨论函数

    $$
    f(x)=\lim_{n\to\infty}
    x\frac{1-x^{2n}}{1+x^{2n}}
    $$

    的连续性。

- **求解**：固定 $x$，按照 $|x|$ 与 $1$ 的关系分类。

  - 当 $|x|<1$ 时，$x^{2n}\to0$，因此 $f(x)=x$。

  - 当 $|x|=1$ 时，$x^{2n}=1$，因此 $f(1)=f(-1)=0$。

  - 当 $|x|>1$ 时，分子、分母同除以 $x^{2n}$：

    $$
    \frac{1-x^{2n}}{1+x^{2n}}
    =\frac{x^{-2n}-1}{x^{-2n}+1}
    \longrightarrow-1,
    $$

    再乘上外面的 $x$，因此 $f(x)=-x$。

  所以

  $$
  f(x)=
  \begin{cases}
  -x,&|x|>1,\\[1mm]
  0,&x=\pm1,\\[1mm]
  x,&|x|<1.
  \end{cases}
  $$

  各段内部连续。两个分界点处都有

  $$
  \begin{aligned}
  \lim_{x\to-1^-}f(x)&=1,
  &\lim_{x\to-1^+}f(x)&=-1,\\
  \lim_{x\to1^-}f(x)&=1,
  &\lim_{x\to1^+}f(x)&=-1.
  \end{aligned}
  $$

  因此 $x=-1$ 与 $x=1$ 都是跳跃间断点，结论为

  $$
  \boxed{f(x)\text{ 在 }\mathbb R\setminus\{-1,1\}\text{ 上连续}}.
  $$

#### T03 · 导数、求导与微分

##### 知识点：可导性给出一点附近的一阶局部展开

- 在 $x_0$ 处可导意味着 $f(x_0+h)=f(x_0)+f'(x_0)h+o(h)$。
- 同一关系中同时出现 $x_0+h$ 与 $x_0-h$ 时，分别写出局部展开，再比较常数项与一次项。

##### 算法总结：把幂指函数写成指数，再在指数中识别导数定义

- 先作指数对数变换，再把对数中的底数改写成 $1+$ 增量。
- 单独检查这个增量是否趋于零，并确认 $1+$ 增量从某一项开始为正。
- 对 $\ln(1+u)$ 作一阶 Taylor–Peano 展开，再用导数定义计算 $nu_n$ 的极限。

##### Exercise 06*｜由一点处的导数计算 $1^\infty$ 型极限

- 已知 $f'(a)$ 存在，且 $f(a)\ne0$，求

    $$
    \lim_{n\to\infty}
    \left(
    \frac{f\left(a+\dfrac1n\right)}{f(a)}
    \right)^n.
    $$

- **求解**：先作指数对数变换，并把对数中的底数改写成 $1+$ 增量：

  $$
  \begin{aligned}
  \left(
  \frac{f\left(a+\dfrac1n\right)}{f(a)}
  \right)^n
  &=\exp\left[
  n\ln\frac{f\left(a+\dfrac1n\right)}{f(a)}
  \right]\\
  &=\exp\left\{
  n\ln\left[
  1+\frac{f\left(a+\dfrac1n\right)-f(a)}{f(a)}
  \right]
  \right\}.
  \end{aligned}
  $$

  现在单独考察增量

  $$
  u_n=
  \frac{f\left(a+\dfrac1n\right)-f(a)}{f(a)}.
  $$

  因为 $f$ 在 $a$ 处可导，所以它在 $a$ 处连续；又因为 $f(a)\ne0$，所以 $u_n\to0$，从而 $1+u_n$ 从某一项开始为正，可以直接作 Taylor–Peano 展开：

  $$
  \ln(1+u_n)=u_n+o(u_n).
  $$

  另一方面，由导数定义，

  $$
  nu_n
  =
  \frac1{f(a)}
  \frac{
  f\left(a+\dfrac1n\right)-f(a)
  }{\dfrac1n}
  \longrightarrow
  \frac{f'(a)}{f(a)}.
  $$

  因此

  $$
  \begin{aligned}
  n\ln(1+u_n)
  &=nu_n+n\,o(u_n)\\
  &=nu_n+(nu_n)o(1)\\
  &\longrightarrow\frac{f'(a)}{f(a)}.
  \end{aligned}
  $$

  代回指数函数，得到

  $$
  \boxed{
  \lim_{n\to\infty}
  \left(
  \frac{f\left(a+\dfrac1n\right)}{f(a)}
  \right)^n
  =\exp\left(\frac{f'(a)}{f(a)}\right)
  }.
  $$

##### Exercise 07｜利用 $o(x)$ 读取一点处的导数

- 已知 $f(x)$ 在 $x=1$ 的邻域内满足

    $$
    f(1+x)-3f(1-x)=8x+o(x)\qquad(x\to0),
    $$

    且 $f(x)$ 在 $x=1$ 处可导，求 $f'(1)$。

- **解法一：一阶泰勒展开**。记

  $$
  f(1)=\alpha,
  \qquad
  f'(1)=\beta.
  $$

  由于 $f$ 在 $x=1$ 处可导，

  $$
  f(1+x)=\alpha+\beta x+o(x),
  \qquad
  f(1-x)=\alpha-\beta x+o(x).
  $$

  代入已知关系，得到

  $$
  -2\alpha+4\beta x+o(x)=8x+o(x).
  $$

  先令 $x\to0$，得到 $\alpha=0$；再把等式除以 $x$ 并令 $x\to0$，得到

  $$
  4\beta=8.
  $$

  因此

  $$
  \boxed{f'(1)=2}.
  $$

- **解法二：直接凑导数定义**。由于 $f$ 在 $x=1$ 处可导，所以它在该点连续。令 $x\to0$，原关系给出

  $$
  f(1)-3f(1)=0,
  $$

  因而 $f(1)=0$。于是原式可以改写为

  $$
  \bigl[f(1+x)-f(1)\bigr]
  -3\bigl[f(1-x)-f(1)\bigr]
  =8x+o(x).
  $$

  两边除以 $x$：

  $$
  \frac{f(1+x)-f(1)}x
  -3\frac{f(1-x)-f(1)}x
  =8+o(1).
  $$

  第一个差商趋于 $f'(1)$。第二个差商中，函数内部的增量是 $-x$，所以

  $$
  \frac{f(1-x)-f(1)}x
  =-\frac{f(1-x)-f(1)}{-x}
  \longrightarrow-f'(1).
  $$

  因此

  $$
  f'(1)-3\bigl[-f'(1)\bigr]=8,
  $$

  从而

  $$
  \boxed{f'(1)=2}.
  $$

##### 算法总结：逐层展开复合函数，再把余项换回关于 $x$ 的阶

- 先展开外层函数，再展开它的内层变量：
  - $\ln(1+\sin3x)$ 先按 $\ln(1+u)$ 展开，再把 $u=\sin3x$ 按 $x$ 展开；
  - $f(\cos x)$ 先把 $f(1+u)$ 在 $u=0$ 处作一阶展开，再把 $u=\cos x-1$ 按 $x$ 展开。
- 每完成一次代入，都把余项重新整理成关于 $x$ 的小 $o$，最后直接比较整个分子与 $x^3$ 的主部。

##### Exercise 08｜用嵌套泰勒展开处理复合极限

- 设函数 $f(x)$ 在 $x=1$ 处可导，且

    $$
    f(1)=0,\qquad f'(1)=2.
    $$

    求极限

    $$
    \lim_{x\to0}
    \frac{\ln(1+\sin3x)\,f(\cos x)}{x^3}.
    $$

- **求解**：先处理第一个复合函数。由

  $$
  \ln(1+u)=u+o(u),
  \qquad
  \sin3x=3x+o(x),
  $$

  并且 $\sin3x/x\to3$，所以当前展开中的具体余项满足

  $$
  \frac{o(\sin3x)}x
  =
  \frac{o(\sin3x)}{\sin3x}
  \cdot
  \frac{\sin3x}{x}
  \longrightarrow0.
  $$

  即 $o(\sin3x)=o(x)$。把 $u=\sin3x$ 代入第一式，得到

  $$
  \begin{aligned}
  \ln(1+\sin3x)
  &=\sin3x+o(\sin3x)\\
  &=3x+o(x).
  \end{aligned}
  $$

  再处理 $f(\cos x)$。函数 $f$ 在 $x=1$ 处可导，因此

  $$
  f(1+u)=f(1)+f'(1)u+o(u)
  =2u+o(u).
  $$

  同时，

  $$
  \cos x-1=-\frac{x^2}{2}+o(x^2).
  $$

  这里 $(\cos x-1)/x^2\to-1/2$，同样有

  $$
  \frac{o(\cos x-1)}{x^2}
  =
  \frac{o(\cos x-1)}{\cos x-1}
  \cdot
  \frac{\cos x-1}{x^2}
  \longrightarrow0.
  $$

  因而 $o(\cos x-1)=o(x^2)$。把 $u=\cos x-1$ 代入 $f(1+u)$ 的展开式：

  $$
  \begin{aligned}
  f(\cos x)
  &=2(\cos x-1)+o(\cos x-1)\\
  &=2\left(-\frac{x^2}{2}+o(x^2)\right)+o(x^2)\\
  &=-x^2+o(x^2).
  \end{aligned}
  $$

  因此，原式中的两部分已经分别化为关于 $x$ 的展开式：

  $$
  \begin{aligned}
  \frac{\ln(1+\sin3x)\,f(\cos x)}{x^3}
  &=\frac{[3x+o(x)][-x^2+o(x^2)]}{x^3}\\
  &=[3+o(1)][-1+o(1)].
  \end{aligned}
  $$

  因此

  $$
  \boxed{
  \lim_{x\to0}
  \frac{\ln(1+\sin3x)\,f(\cos x)}{x^3}
  =-3
  }.
  $$

##### 算法总结：回到完整的双侧差商，检查条件覆盖了哪些趋近方式

- 先把给定极限换成 $t\to0$ 下的差商，判断代换是否覆盖零点两侧的全部 $t$。
- 只能看到对称差、缩放差或单侧自变量时，不应直接推出可导；需要继续证明，或构造反例。

##### Exercise 09｜比较四种变尺度差商

- 设 $f(0)=0$。判断下列条件中，哪些足以推出 $f(x)$ 在 $x=0$ 处可导，并说明理由；对于不能推出可导的条件，说明其障碍或给出反例。

    1. $\displaystyle\lim_{h\to0}\frac{f(3h)-f(h)}{2h}$ 存在；

    2. $\displaystyle\lim_{h\to0}\frac{f(h)-f(-h)}{2h}$ 存在；

    3. $\displaystyle\lim_{h\to0}\frac{f(h^3)}{h^3}$ 存在；

    4. $\displaystyle\lim_{h\to0}\frac{f(h^2)}{h^2}$ 存在。

- **求解**：

  1. 条件 1 不能保证可导。令

     $$
     f(0)=0,
     \qquad
     f(x)=1\quad(x\ne0).
     $$

     当 $h\ne0$ 时，

     $$
     \frac{f(3h)-f(h)}{2h}=0,
     $$

     但 $f$ 在 $0$ 处甚至不连续。

  2. 条件 2 不能保证可导。取 $f(x)=|x|$，则

     $$
     \frac{f(h)-f(-h)}{2h}=0,
     $$

     但 $f$ 在 $0$ 处不可导。

  3. 条件 3 能保证可导。令 $t=h^3$；当 $h\to0$ 时，$t\to0$，而且 $h\mapsto h^3$ 覆盖零点两侧所有充分接近零的实数。因此

     $$
     \lim_{h\to0}\frac{f(h^3)}{h^3}
     =\lim_{t\to0}\frac{f(t)-f(0)}{t}.
     $$

     左侧极限存在，就等价于 $f'(0)$ 存在。

  4. 条件 4 不能保证可导。仍取 $f(x)=|x|$，则

     $$
     \frac{f(h^2)}{h^2}=1,
     $$

     但 $t=h^2$ 只能从右侧趋近零，不能控制左侧差商。

  因此四个条件中，只有第 3 个是充分条件。

##### Exercise 10｜求含绝对值乘积函数可导的充要条件

- 设 $f(x)$ 处处可导，令

    $$
    F(x)=f(x)\bigl(1+|\sin x|\bigr).
    $$

    求 $F(x)$ 在 $x=0$ 处可导的充要条件，并证明。

- **求解**：由 $F(0)=f(0)$，有

  $$
  \frac{F(h)-F(0)}{h}
  =\frac{f(h)-f(0)}{h}\bigl(1+|\sin h|\bigr)
  +f(0)\frac{|\sin h|}{h}.
  $$

  第一项在 $h\to0$ 时趋于 $f'(0)$，而

  $$
  \lim_{h\to0^+}\frac{|\sin h|}{h}=1,
  \qquad
  \lim_{h\to0^-}\frac{|\sin h|}{h}=-1.
  $$

  因此

  $$
  F'_+(0)=f'(0)+f(0),
  \qquad
  F'_-(0)=f'(0)-f(0).
  $$

  左右导数相等，当且仅当 $f(0)=0$。所以

  $$
  \boxed{F(x)\text{ 在 }0\text{ 处可导}\iff f(0)=0}.
  $$

##### 算法总结：幂指恒等变换与一阶麦克劳林展开

- 底数趋于 $1$、指数发散时，先用 $u^v=\mathrm e^{v\ln u}$ 把幂指关系改写成指数函数。
- 再依次使用 $f(t)$ 在零点的一阶 Taylor–Peano 展开、$\sin x$ 与 $\ln(1+u)$ 的麦克劳林展开，算出指数部分的极限。

##### Exercise 11*｜可导函数进入底数

- 设函数 $f(x)$ 在 $x=0$ 的邻域内连续可导，且

    $$
    f(0)=1,\qquad f'(0)=4.
    $$

    求极限

    $$
    \lim_{x\to0}[f(\sin x)]^{\frac1{2x}}.
    $$

- **求解**：因为 $f(0)=1$ 且 $f$ 在零点附近连续，所以 $x$ 充分接近零时 $f(\sin x)>0$。先作幂指恒等变换：

  $$
  [f(\sin x)]^{\frac1{2x}}
  =\exp\left(\frac{\ln f(\sin x)}{2x}\right).
  $$

  由 $f(0)=1$、$f'(0)=4$，$f$ 在零点的一阶展开为

  $$
  f(t)=1+4t+o(t)\qquad(t\to0),
  $$

  而

  $$
  \sin x=x+o(x).
  $$

  因为 $\sin x/x\to1$，同阶尺度替换规则给出

  $$
  o(\sin x)=o(x).
  $$

  直接展开对数：

  $$
  \begin{aligned}
  \ln f(\sin x)
  &=\ln\bigl[1+4\sin x+o(\sin x)\bigr]\\
  &=\ln\bigl[1+4x+o(x)\bigr]\\
  &=4x+o(x),
  &&\text{由 }\ln(1+u)=u+o(u).
  \end{aligned}
  $$

  所以指数部分满足

  $$
  \frac{\ln f(\sin x)}{2x}
  =\frac{4x+o(x)}{2x}
  \longrightarrow2.
  $$

  所以

  $$
  \boxed{
  \lim_{x\to0}[f(\sin x)]^{\frac1{2x}}
  =\mathrm e^2
  }.
  $$

##### 算法总结：隐函数先确定基点，再沿依赖关系逐层求导

- 先把指定的 $x$ 代回隐式方程，确定对应的 $y$；再检查该点附近能否把 $y$ 看成 $x$ 的函数。
- 对隐式方程连续求导得到 $y',y''$，随后按照 $x\to y\to z$ 的依赖顺序使用复合函数求导法则。

##### Exercise 12｜沿隐式确定的函数连续求导

- 已知函数 $f(x)$ 二阶可导，且 $f'(1)=1$。函数 $y=y(x)$ 由方程

    $$
    xy-\mathrm e^x+\mathrm e^y=0
    $$

    确定。设

    $$
    z=f(\mathrm e^y-\sin x),
    $$

    求

    $$
    \left.\frac{\mathrm d^2z}{\mathrm dx^2}\right|_{x=0}.
    $$

- **求解**：先确定基点。令 $x=0$，隐式方程给出

  $$
  -1+\mathrm e^{y(0)}=0,
  $$

  因而 $y(0)=0$。

  对隐式方程求导：

  $$
  y+xy'-\mathrm e^x+\mathrm e^y y'=0.
  $$

  代入 $x=0$、$y(0)=0$，得到

  $$
  y'(0)=1.
  $$

  再求一次导数：

  $$
  2y'+xy''-\mathrm e^x
  +\mathrm e^y\bigl[(y')^2+y''\bigr]=0.
  $$

  代入 $x=0$、$y(0)=0$、$y'(0)=1$，得到

  $$
  y''(0)=-2.
  $$

  令

  $$
  u(x)=\mathrm e^{y(x)}-\sin x.
  $$

  则

  $$
  u(0)=1,
  \qquad
  u'(0)=\mathrm e^{y(0)}y'(0)-1=0,
  $$

  并且

  $$
  u''(0)
  =\mathrm e^{y(0)}\bigl[(y'(0))^2+y''(0)\bigr]
  =-1.
  $$

  由 $z=f(u)$，

  $$
  z''=f''(u)(u')^2+f'(u)u''.
  $$

  因此

  $$
  \boxed{
  z''(0)=f''(1)\cdot0^2+f'(1)(-1)=-1
  }.
  $$

### 50-100 | Course Topic → 知识点／算法总结 → Exercises（继续）

> 本卡片只是页面与课时的软分割，不预设新的教学阶段；若上一组 Topic–Exercise Pair 尚未完成，就在这里直接继续。

#### T04 · 中值定理、洛必达与泰勒

##### 算法总结：为目标等式寻找可以比较的中值定理结论

- 目标式中出现两个中间点时，先把分别含 $\eta$ 与 $\xi$ 的部分移到等式两侧，再观察两侧分别是哪一个函数的导数。
- 若要用两次中值定理得到相等的导数值，就让两个对象在同一区间上具有相同的割线斜率；端点条件负责验证这个共同的区间变化率。
- 两次中值定理产生的中间点不必相同；题目真正比较的是同一区间上的两个平均变化率。

##### Exercise 13｜分别使用中值定理，再比较两个中间值

- 已知函数 $f(x)$ 在 $[a,b]$ 上连续，在 $(a,b)$ 内可导，且

    $$
    f(a)=f(b)=1.
    $$

    证明：存在 $\xi,\eta\in(a,b)$，使得

    $$
    \mathrm e^{\eta-\xi}\bigl[f(\eta)+f'(\eta)\bigr]=1.
    $$

    > **题面校正：** 原书写作“存在两个不同的点 $\xi,\eta$”，该要求不成立；取 $f(x)\equiv1$ 即可看出只能有 $\xi=\eta$。这里使用校正后的命题。

- **求解**：先把分别含 $\eta$ 与 $\xi$ 的部分分离到等式两侧。待证等式等价于

  $$
  \mathrm e^\eta\bigl[f(\eta)+f'(\eta)\bigr]
  =\mathrm e^\xi.
  $$

  现在两侧都可以读成导数值：

  $$
  \mathrm e^\eta\bigl[f(\eta)+f'(\eta)\bigr]
  =\left.\bigl(\mathrm e^x f(x)\bigr)'\right|_{x=\eta},
  \qquad
  \mathrm e^\xi
  =\left.\bigl(\mathrm e^x\bigr)'\right|_{x=\xi}.
  $$

  因此，题目暗示我们在同一个区间 $[a,b]$ 上，分别对

  $$
  \varphi(x)=\mathrm e^x f(x),
  \qquad
  \psi(x)=\mathrm e^x
  $$

  使用拉格朗日中值定理。要让两次中值定理得到的导数值相等，只需先检查两个函数在 $[a,b]$ 上的割线斜率是否相同。

  由 $f(a)=f(b)=1$，

  $$
  \varphi(b)-\varphi(a)
  =\mathrm e^b f(b)-\mathrm e^a f(a)
  =\mathrm e^b-\mathrm e^a
  =\psi(b)-\psi(a).
  $$

  所以两者在同一区间上的割线斜率相等：

  $$
  \frac{\varphi(b)-\varphi(a)}{b-a}
  =\frac{\psi(b)-\psi(a)}{b-a}.
  $$

  分别使用拉格朗日中值定理，存在 $\eta,\xi\in(a,b)$，使得

  $$
  \varphi'(\eta)
  =\frac{\varphi(b)-\varphi(a)}{b-a}
  =\frac{\psi(b)-\psi(a)}{b-a}
  =\psi'(\xi).
  $$

  代回两个导数的具体形式：

  $$
  \mathrm e^\eta\bigl[f(\eta)+f'(\eta)\bigr]
  =\mathrm e^\xi.
  $$

  两边除以 $\mathrm e^\xi$，便得到

  $$
  \boxed{
  \mathrm e^{\eta-\xi}\bigl[f(\eta)+f'(\eta)\bigr]=1
  }.
  $$

  两次中值定理产生的点不必相同，也不能保证一定不同。

##### 算法总结：先找到附近的导数，再把结论拉回目标点

- 已知 $f(x)\to0$，可以在远端取一个固定长度的小区间，用端点函数值控制割线斜率；中值定理先给出区间内某一点的导数。
- 这个中间点不是目标点 $x$。再用 $f''(x)\to0$ 说明 $f'$ 在这段短区间内变化很小，便能把中间点处的结论拉回 $x$。

##### Exercise 14｜由函数与二阶导数的极限推出一阶导数的极限

- 设 $f(x)$ 定义在 $(1,+\infty)$ 上，且 $f'(x),f''(x)$ 存在。证明：若

    $$
    \lim_{x\to+\infty}f(x)=0,
    \qquad
    \lim_{x\to+\infty}f''(x)=0,
    $$

    则

    $$
    \lim_{x\to+\infty}f'(x)=0.
    $$

- **求解**：目标是控制 $f'(x)$，但已知条件首先给出的是函数值 $f(x)\to0$。为了从函数值找到导数，在远端点 $x$ 的旁边再取一点。取固定长度为 $1$ 的区间 $[x,x+1]$，则

  $$
  f(x+1)-f(x)\longrightarrow0.
  $$

  这说明该区间的割线斜率趋于零。对 $f$ 使用拉格朗日中值定理，存在

  $$
  \eta_x\in(x,x+1),
  $$

  使得

  $$
  f'(\eta_x)=f(x+1)-f(x).
  $$

  因此我们已经找到一个距离 $x$ 不超过 $1$ 的点 $\eta_x$，使得

  $$
  f'(\eta_x)\longrightarrow0.
  $$

  但题目要证明的是 $f'(x)\to0$，而不是 $f'(\eta_x)\to0$。这里正好使用另一个条件 $f''(x)\to0$：它说明在无穷远处，$f'$ 在一段固定长度的区间内变化越来越小。

  对 $f'$ 在 $[x,\eta_x]$ 上使用拉格朗日中值定理，存在

  $$
  \zeta_x\in(x,\eta_x),
  $$

  使得

  $$
  f'(\eta_x)-f'(x)
  =f''(\zeta_x)(\eta_x-x).
  $$

  由于 $\zeta_x>x$，有 $\zeta_x\to+\infty$，所以 $f''(\zeta_x)\to0$；同时

  $$
  0<\eta_x-x<1,
  $$

  因而

  $$
  f'(\eta_x)-f'(x)\longrightarrow0.
  $$

  现在 $f'(\eta_x)\to0$，并且 $f'(x)$ 与它的差也趋于零，所以

  $$
  \boxed{\lim_{x\to+\infty}f'(x)=0}.
  $$

##### 算法总结：沿复合结构从外向内逐层反解

- 若 $\dfrac{W(x)}{V(x)}\to A$，先把它读成渐近等式

  $$
  W(x)=A\,V(x)+o(V(x)).
  $$

- 再按照复合顺序的反方向逐层解除外层函数；每解除一层，都用相应的一阶 Taylor–Peano 展开传递主部。
- 同时追踪各层的阶：$a^x-1$ 是 $x$ 的一阶量，$\ln(1+u)$ 因而也是一阶量；解除对数后 $u$ 仍是一阶量，再乘上 $\sin x$，便得到 $f(x)$ 的二阶主部。

##### Exercise 15｜由复合极限反推未知函数的消失阶

- 设

    $$
    \lim_{x\to0}
    \frac{\ln\left(1+\dfrac{f(x)}{\sin x}\right)}{a^x-1}
    =A,
    \qquad a>0,\quad a\ne1.
    $$

    求

    $$
    \lim_{x\to0}\frac{f(x)}{x^2}.
    $$

- **求解**：先把原式的复合层次写清楚。令

  $$
  u(x)=\frac{f(x)}{\sin x},
  \qquad
  w(x)=\ln(1+u(x)).
  $$

  已知条件就是

  $$
  \frac{w(x)}{a^x-1}\to A.
  $$

  因为 $a\ne1$，所以 $a^x-1$ 在 $x=0$ 的去心邻域内不为零。按照极限的含义，上式可以写成

  $$
  w(x)
  =
  A(a^x-1)+o(a^x-1).
  $$

  又因为

  $$
  a^x-1=x\ln a+o(x),
  $$

  所以

  $$
  w(x)=A\ln a\,x+o(x).
  $$

  这一步先确定了最外层 $w(x)$ 的一阶主部，同时也说明 $w(x)\to0$。

  接下来解除最外层的对数。由 $w(x)=\ln(1+u(x))$，

  $$
  u(x)=\mathrm e^{w(x)}-1.
  $$

  当 $w(x)\to0$ 时，记 Taylor–Peano 余项为 $\rho(x)$，则

  $$
  \mathrm e^{w(x)}-1=w(x)+\rho(x),
  \qquad
  \rho(x)=o(w(x)).
  $$

  而 $w(x)=O(x)$，所以这个具体余项满足

  $$
  \rho(x)
  =
  w(x)o(1)
  =
  O(x)o(1)
  =
  o(x).
  $$

  从而

  $$
  u(x)=A\ln a\,x+o(x).
  $$

  最后解除 $u(x)=f(x)/\sin x$。由

  $$
  \sin x=x+o(x),
  $$

  得到

  $$
  \begin{aligned}
  f(x)
  &=\sin x\cdot u(x)\\
  &=[x+o(x)][A\ln a\,x+o(x)]\\
  &=A\ln a\,x^2+o(x^2).
  \end{aligned}
  $$

  因此

  $$
  \boxed{
  \lim_{x\to0}\frac{f(x)}{x^2}=A\ln a
  }.
  $$

##### 算法总结：把无穷远问题换到零点，再决定泰勒展开阶数

- 当 $x\to+\infty$ 且表达式适合用 $1/x$ 描述时，先令 $t=1/x$，把问题换成 $t\to0^+$。
- 展开根式或幂指式以前，先提出决定增长阶的幂；否则泰勒展开看不清需要消去的主部。
- 先判断低阶项会怎样抵消；展开到“第一个不会被抵消的项”即可。
- 乘积、根式与幂指式先转成便于统一展开的结构，再集中保留目标阶数以内的项。

##### Exercise 16*｜确定能够消去主部的常数

- 确定常数 $a,b$，使得

    $$
    \lim_{x\to+\infty}
    \left(\sqrt[3]{1-x^6}-ax^2-b\right)=0.
    $$

- **求解**：令

  $$
  t=\frac1x.
  $$

  当 $x\to+\infty$ 时，$t\to0^+$。注意此时 $t>0$，因此在实数立方根下，

  $$
  \begin{aligned}
  \sqrt[3]{1-x^6}
  &=\sqrt[3]{1-\frac1{t^6}}\\
  &=\sqrt[3]{-\frac{1-t^6}{t^6}}\\
  &=-\frac1{t^2}(1-t^6)^{1/3}.
  \end{aligned}
  $$

  这里的负号来自实数立方根保留符号：

  $$
  \sqrt[3]{-A}=-\sqrt[3]{A}.
  $$

  利用

  $$
  (1+u)^\alpha=1+\alpha u+o(u),
  $$

  得到

  $$
  (1-t^6)^{1/3}
  =1-\frac13t^6+o(t^6).
  $$

  所以

  $$
  \sqrt[3]{1-x^6}
  =-\frac1{t^2}+\frac13t^4+o(t^4).
  $$

  原式于是变成

  $$
  -\frac{1+a}{t^2}-b+\frac13t^4+o(t^4).
  $$

  要使该式趋于零，必须先消去 $t^{-2}$ 项，再消去常数项：

  $$
  1+a=0,
  \qquad
  b=0.
  $$

  因此

  $$
  \boxed{a=-1,\qquad b=0}.
  $$

##### Exercise 17*｜展开幂指型表达式并保留抵消后的首项

- 求极限

    $$
    \lim_{x\to+\infty}
    \left\{
    \frac{\mathrm e}{2}x
    +x^2\left[\left(1+\frac1x\right)^x-\mathrm e\right]
    \right\}.
    $$

- **求解**：令

  $$
  t=\frac1x.
  $$

  当 $x\to+\infty$ 时，$t\to0^+$。先不展开 $\ln(1+t)$，而把内层整体与它的极限值分开。因为

  $$
  \frac{\ln(1+t)}t\to1,
  $$

  所以定义

  $$
  \delta(t)
  =
  \frac{\ln(1+t)}t-1,
  \qquad
  \delta(t)\to0.
  $$

  先把这个尚未展开的无穷小整体代回去：

  $$
  (1+t)^{1/t}
  =
  \exp\left(\frac{\ln(1+t)}t\right)
  =
  \mathrm e^{1+\delta(t)}
  =
  \mathrm e\,\mathrm e^{\delta(t)}.
  $$

  因而原式精确地改写成

  $$
  \mathrm e\left[
  \frac1{2t}
  +\frac{\mathrm e^{\delta(t)}-1}{t^2}
  \right].
  $$

  接着直接使用指数函数的麦克劳林展开，把外层的前两阶拆出来；此时先保留余项，不急着判断它除以 $t^2$ 后是否趋于零：

  $$
  \mathrm e^{\delta(t)}-1
  =
  \delta(t)+\frac{\delta(t)^2}{2}+r(t),
  \qquad
  r(t)=o(\delta(t)^2).
  $$

  代回完整表达式并先做结构整理：

  $$
  \begin{aligned}
  &\mathrm e\left[
  \frac1{2t}
  +\frac{\mathrm e^{\delta(t)}-1}{t^2}
  \right]\\
  &=
  \mathrm e\left[
  \frac1{2t}
  +\frac{\delta(t)}{t^2}
  +\frac12\frac{\delta(t)^2}{t^2}
  +\frac{r(t)}{t^2}
  \right]\\
  &=
  \mathrm e\left[
  \frac{\delta(t)+t/2}{t^2}
  +\frac12\left(\frac{\delta(t)}t\right)^2
  +\frac{r(t)}{t^2}
  \right].
  \end{aligned}
  $$

  走到这里，如果不拆开 $\delta(t)$，三个部分都无法继续判断。特别是第一项发生了一次抵消：

  $$
  \frac{\delta(t)+t/2}{t^2}
  =
  \frac{\ln(1+t)-t+t^2/2}{t^3}.
  $$

  分母已经达到 $t^3$，因而直到此时，才确定必须把对数展开到三阶：

  $$
  \ln(1+t)
  =
  t-\frac{t^2}{2}+\frac{t^3}{3}+o(t^3).
  $$

  从而

  $$
  \delta(t)
  =
  -\frac t2+\frac{t^2}{3}+o(t^2).
  $$

  现在三个部分可以同时处理：

  $$
  \frac{\delta(t)+t/2}{t^2}\to\frac13,
  \qquad
  \left(\frac{\delta(t)}t\right)^2\to\frac14.
  $$

  同时 $\delta(t)^2/t^2\to1/4$，而 $r(t)=o(\delta(t)^2)$，所以

  $$
  \frac{r(t)}{t^2}
  =
  \frac{r(t)}{\delta(t)^2}
  \cdot
  \frac{\delta(t)^2}{t^2}
  \longrightarrow0.
  $$

  最终

  $$
  \begin{aligned}
  \lim
  &=
  \mathrm e\left[
  \frac13
  +\frac12\left(-\frac12\right)^2
  \right]\\
  &=
  \boxed{\frac{11\mathrm e}{24}}.
  \end{aligned}
  $$

##### Exercise 18*｜多个三角因子的联合展开

- 求极限

    $$
    \lim_{x\to0}
    x^{-2}\left(
    1-\cos x\sqrt{\cos2x}\sqrt[3]{\cos3x}
    \right).
    $$

- **求解**：当 $x\to0$ 时，

  $$
  \cos x=1-\frac{x^2}{2}+o(x^2).
  $$

  又因为

  $$
  \cos2x=1-2x^2+o(x^2),
  $$

  这里不能直接对展开式逐项开方，而要使用

  $$
  (1+u)^{\alpha}=1+\alpha u+o(u)
  \qquad(u\to0).
  $$

  令

  $$
  u=-2x^2+o(x^2),
  $$

  则 $u\to0$，并且

  $$
  \frac{u}{x^2}
  =
  -2+o(1)
  \longrightarrow-2.
  $$

  因而 $u$ 与 $x^2$ 同阶。这里把 $o(u)$ 理解为当前展开中产生的那个具体余项，则

  $$
  \frac{o(u)}{x^2}
  =
  \frac{o(u)}u
  \cdot
  \frac{u}{x^2}
  \longrightarrow0.
  $$

  因此

  $$
  o(u)=o(x^2).
  $$

  $$
  \begin{aligned}
  \sqrt{\cos2x}
  &=(1+u)^{1/2}\\
  &=1+\frac12u+o(u)\\
  &=1+\frac12\left[-2x^2+o(x^2)\right]+o(x^2)\\
  &=1-x^2+o(x^2).
  \end{aligned}
  $$

  同理，先写出

  $$
  \cos3x=1-\frac92x^2+o(x^2),
  $$

  再把 $u=-\frac92x^2+o(x^2)$ 代入 $(1+u)^{1/3}$ 的展开：

  $$
  \begin{aligned}
  \sqrt[3]{\cos3x}
  &=1+\frac13\left[-\frac92x^2+o(x^2)\right]+o(x^2)\\
  &=1-\frac32x^2+o(x^2).
  \end{aligned}
  $$

  三个因子相乘：

  $$
  \begin{aligned}
  \cos x\sqrt{\cos2x}\sqrt[3]{\cos3x}
  &=\left(1-\frac12x^2+o(x^2)\right)
    \left(1-x^2+o(x^2)\right)\\
  &\qquad\cdot
    \left(1-\frac32x^2+o(x^2)\right)\\
  &=1-3x^2+o(x^2).
  \end{aligned}
  $$

  因此

  $$
  \boxed{
  \lim_{x\to0}
  x^{-2}\left(
  1-\cos x\sqrt{\cos2x}\sqrt[3]{\cos3x}
  \right)=3
  }.
  $$

##### 算法总结：比较同一余项的两种表达，反推中值点的位置

- 先把同一个一阶泰勒余项写成带 Peano 余项的三阶展开，读出二次项之后的首个非零项。
- **先读懂原题中的 $\theta$**：题目沿用了 Taylor 定理的常见简写。对每个固定的 $x\ne a$，定理给出一个数 $\theta\in(0,1)$，使

  $$
  \xi=a+\theta(x-a)
  $$

  是 $a$ 与 $x$ 之间的中间点。真正的中间点是 $\xi$；$\theta$ 只是它在区间中的相对位置。固定 $x$ 时，$\theta$ 是一个数，不是函数；当 $x$ 变化时，每次取得的 $\theta$ 也可能变化，原题中的 $\lim\theta$ 正是考察这些数随 $x\to a$ 的变化。为了在求解中明确这种依赖，我们再把相应的数记作 $\theta_h$。
- 再展开拉格朗日型余项中的 $f''\bigl(a+\theta(x-a)\bigr)$；由 $0<\theta<1$ 可知中间点随 $x$ 一起趋于 $a$。
- 比较两种表达在三次项上的系数，证明无论每个 $x$ 选择哪一个符合条件的 $\theta$，这些数都趋于 $1/3$。

##### Exercise 19｜由泰勒余项反推中值点的极限

- 设 $f(x)$ 三阶可导，且 $f'''(a) \neq 0$，

  $$
  f(x) = f(a) + f'(a)(x - a) + \frac{f''[a + \theta(x - a)](x - a)^2}{2} \quad (0 < \theta < 1),
  $$

  证明：$\displaystyle\lim_{x \to a} \theta = \frac{1}{3}$。

- **求解**：令 $h=x-a$。对每个 $h\ne0$，从原题等式中取一个相应的 $\theta$，并把它记作 $\theta_h$。于是

  $$
  0<\theta_h<1.
  $$

  当 $h\to0$ 时，$f$ 在 $a$ 处的 Taylor–Peano 展开为

  $$
  f(a+h)
  =f(a)+f'(a)h
  +\frac{f''(a)}2h^2
  +\frac{f'''(a)}6h^3
  +o(h^3).
  $$

  题设给出的另一种余项表示为

  $$
  f(a+h)
  =f(a)+f'(a)h
  +\frac12f''\bigl(a+\theta_h\,h\bigr)h^2.
  $$

  比较两式，消去相同项并除以 $h^2/2$，得到

  $$
  f''(a+\theta_h\,h)
  =f''(a)+\frac13f'''(a)h+o(h).
  $$

  另一方面，因为 $0<\theta_h<1$，所以 $\theta_h\,h\to0$。由 $f''$ 在 $a$ 处可导，

  $$
  f''(a+\theta_h\,h)
  =f''(a)+f'''(a)\theta_h\,h+o(\theta_h\,h).
  $$

  比较后两式：

  $$
  f'''(a)\theta_h\,h+o(\theta_h\,h)
  =\frac13f'''(a)h+o(h).
  $$

  除以 $h$。由于 $0<\theta_h<1$，

  $$
  \frac{o(\theta_h\,h)}h
  =\theta_h\frac{o(\theta_h\,h)}{\theta_h\,h}
  =o(1).
  $$

  因而

  $$
  f'''(a)\left(\theta_h-\frac13\right)=o(1).
  $$

  由 $f'''(a)\ne0$，得到

  $$
  \boxed{\lim_{h\to0}\theta_h=\frac13},
  $$

  这就是原题所写的 $\displaystyle\lim_{x\to a}\theta=1/3$。

#### T05 · 导数的应用

##### 知识点：二阶导数控制凸性，凸性控制函数值的平均

- $f''(x)>0$ 说明函数严格凸；图像位于任意两点所连弦的下方。
- 先把“图像在弦的下方”写成两个点的任意加权不等式，再对点的个数使用数学归纳法。
- 也可以在所有点的平均值处作切线；各点分别与切线比较后，线性项会在求和时自动抵消。

##### Exercise 20｜证明有限个点的 Jensen 型不等式

- 设 $f$ 在 $[a,b]$ 上连续，在 $(a,b)$ 内二阶可导，且

    $$
    f''(x)>0\qquad(x\in(a,b)).
    $$

    证明：对于任意正整数 $n$ 以及任意 $x_1,x_2,\ldots,x_n\in[a,b]$，恒有

    $$
    \frac{f(x_1)+f(x_2)+\cdots+f(x_n)}{n}
    \ge
    f\left(\frac{x_1+x_2+\cdots+x_n}{n}\right).
    $$

- **求解一：二点加权不等式与数学归纳法**。先证明严格凸函数的二点加权不等式。任取 $u,v\in[a,b]$ 与 $0\le\lambda\le1$，令

  $$
  z=(1-\lambda)u+\lambda v.
  $$

  当 $u=v$ 或 $\lambda=0,1$ 时，结论显然成立；若 $u>v$，同时交换 $u,v$ 并把 $\lambda$ 换成 $1-\lambda$，加权点与待证不等式都保持不变。因此以下不妨设 $u<v$ 且 $0<\lambda<1$，于是 $u<z<v$。分别在 $[u,z]$ 与 $[z,v]$ 上使用拉格朗日中值定理，存在

  $$
  \xi_1\in(u,z),
  \qquad
  \xi_2\in(z,v),
  $$

  使得

  $$
  \frac{f(z)-f(u)}{z-u}=f'(\xi_1),
  \qquad
  \frac{f(v)-f(z)}{v-z}=f'(\xi_2).
  $$

  因为 $f''(x)>0$，所以 $f'$ 严格递增。由 $\xi_1<\xi_2$，得到

  $$
  \frac{f(z)-f(u)}{z-u}
  <
  \frac{f(v)-f(z)}{v-z}.
  $$

  又因为

  $$
  z-u=\lambda(v-u),
  \qquad
  v-z=(1-\lambda)(v-u),
  $$

  整理可得

  $$
  f\bigl((1-\lambda)u+\lambda v\bigr)
  \le
  (1-\lambda)f(u)+\lambda f(v).
  $$

  现在对点的个数 $n$ 使用数学归纳法。当 $n=1$ 时，结论显然成立。假设结论对 $n$ 个点成立，记

  $$
  \bar x_n=\frac{x_1+x_2+\cdots+x_n}{n}.
  $$

  则 $n+1$ 个点的平均值可以先看成“前 $n$ 个点的平均值”与“最后一个点”的加权平均：

  $$
  \frac{x_1+\cdots+x_n+x_{n+1}}{n+1}
  =\frac{n}{n+1}\bar x_n+\frac1{n+1}x_{n+1}.
  $$

  对右侧使用刚刚证明的二点加权不等式，再使用归纳假设：

  $$
  \begin{aligned}
  f\left(\frac{x_1+\cdots+x_{n+1}}{n+1}\right)
  &\le
  \frac{n}{n+1}f(\bar x_n)
  +\frac1{n+1}f(x_{n+1})\\
  &\le
  \frac{n}{n+1}\cdot
  \frac{f(x_1)+\cdots+f(x_n)}n
  +\frac1{n+1}f(x_{n+1})\\
  &=\frac{f(x_1)+\cdots+f(x_{n+1})}{n+1}.
  \end{aligned}
  $$

  因此结论对任意正整数 $n$ 成立。

- **另解：利用平均值处的切线一次比较所有点**。记

  $$
  \bar x=\frac{x_1+x_2+\cdots+x_n}{n}.
  $$

  因为 $x_i\in[a,b]$，所以 $\bar x\in[a,b]$。若 $\bar x=a$ 或 $\bar x=b$，则所有 $x_i$ 都等于同一个端点，结论显然成立。以下设 $\bar x\in(a,b)$。

  由 $f''(x)>0$，$f'(x)$ 严格递增。先证明对任意 $x\in[a,b]$，都有

  $$
  f(x)\ge f(\bar x)+f'(\bar x)(x-\bar x).
  $$

  当 $x>\bar x$ 时，由拉格朗日中值定理，存在 $\xi\in(\bar x,x)$，使得

  $$
  f(x)-f(\bar x)=f'(\xi)(x-\bar x).
  $$

  此时 $f'(\xi)>f'(\bar x)$，所需不等式成立。当 $x<\bar x$ 时，存在 $\xi\in(x,\bar x)$ 使得同一等式成立；此时

  $$
  f'(\xi)<f'(\bar x),
  \qquad
  x-\bar x<0,
  $$

  两边乘以负数 $x-\bar x$ 后不等号反向，仍得到上述不等式。

  对 $x=x_1,x_2,\ldots,x_n$ 分别使用该不等式并求和：

  $$
  \sum_{i=1}^n f(x_i)
  \ge
  nf(\bar x)
  +f'(\bar x)\sum_{i=1}^n(x_i-\bar x).
  $$

  由于

  $$
  \sum_{i=1}^n(x_i-\bar x)=0,
  $$

  所以

  $$
  \boxed{
  \frac{f(x_1)+\cdots+f(x_n)}n
  \ge
  f\left(\frac{x_1+\cdots+x_n}{n}\right)
  }.
  $$

  两种方法中，由 $f$ 的严格凸性可知，等号成立当且仅当

  $$
  x_1=x_2=\cdots=x_n.
  $$

#### T08 · 定积分及其应用（超前入口）

##### 知识点：等距求和乘以小区间长度形成黎曼和

- 先识别采样点覆盖的区间以及相邻采样点之间的步长。
- 把题目前的系数改写成“常数倍乘步长”，从而读出对应的定积分。

##### Exercise 21｜把等距求和识别为定积分

- 求极限

    $$
    \lim_{n\to\infty}\frac1n
    \left(
    \sqrt{1+\sin\frac{\pi}{3n}}
    +\sqrt{1+\sin\frac{2\pi}{3n}}
    +\cdots
    +\sqrt{1+\sin\frac{3n\pi}{3n}}
    \right).
    $$

    > 本题属于尚未正式进入的 T08。若本次答疑处理，只把它作为“极限和为什么会导向定积分”的预告；完整方法在 T08 建立定积分定义后再回看。

- **求解**：令

  $$
  \Delta x=\frac{\pi}{3n},
  \qquad
  x_k=\frac{k\pi}{3n}
  \quad(k=1,2,\ldots,3n).
  $$

  注意到

  $$
  \frac1n=\frac3\pi\,\Delta x.
  $$

  因此原极限是区间 $[0,\pi]$ 上的右端点黎曼和：

  $$
  \begin{aligned}
  \lim_{n\to\infty}
  \frac1n\sum_{k=1}^{3n}\sqrt{1+\sin\frac{k\pi}{3n}}
  &=\frac3\pi
  \lim_{n\to\infty}
  \sum_{k=1}^{3n}\sqrt{1+\sin x_k}\,\Delta x\\
  &=\frac3\pi
  \int_0^\pi\sqrt{1+\sin x}\,\mathrm dx.
  \end{aligned}
  $$

  因为

  $$
  1+\sin x
  =\left(\sin\frac x2+\cos\frac x2\right)^2,
  $$

  且当 $x\in[0,\pi]$ 时，$\sin(x/2),\cos(x/2)\ge0$，所以

  $$
  \sqrt{1+\sin x}
  =\sin\frac x2+\cos\frac x2.
  $$

  于是

  $$
  \int_0^\pi\sqrt{1+\sin x}\,\mathrm dx
  =\int_0^\pi
  \left(\sin\frac x2+\cos\frac x2\right)\mathrm dx
  =2+2=4.
  $$

  最终得到

  $$
  \boxed{\frac{12}{\pi}}.
  $$

#### 后续题目入口

- 新题先归入已有课程 Topic，再放到相应的知识点或算法总结下；只有出现新的知识结构时才新增小节。
- 本课题目池继续追加时，统一顺延 Exercise 编号，课堂仍从前向后连续处理。
- 当堂未处理的题目保留在本课题目池中，供后续答疑或课程 Guide 继续处理。

## 第二次课 · 期中前复习：补齐 $O$、$o$ 记号，继续跨专题答疑

### 0-50 | 先补齐 $O$、$o$ 记号，再回到未完成题目

#### 承接：上次使用了三步尚未解释的尺度运算

- 在 Exercise 06 中，我们写过

  $$
  n\,o(u_n)=(nu_n)o(1).
  $$

- 在 Exercise 15 中，我们又用到了：若 $w(x)=O(x)$，那么一个相对于 $w(x)$ 可忽略的余项，也可以吸收到 $o(x)$ 中。
- 在 Exercise 17 的嵌套 Taylor 展开中，还要把外层产生的 $o(\delta(t)^2)$ 重新换算成关于 $t$ 的余项。
- 这些步骤都不是单纯移动括号：有时要判断乘上的尺度是否有界，有时要比较两个尺度谁控制谁，有时还要把内层变量的阶传递给外层余项。
- 先把 $O$、$o$ 的定义与常见运算补齐，再回到原题说明这些改写为什么成立。

#### 定义：$O(1)$ 表示当前过程有界

- 对数列而言，

  $$
  c_n=O(1)\qquad(n\to\infty)
  $$

  表示存在常数 $M>0$ 与正整数 $N$，使得当 $n\ge N$ 时，

  $$
  |c_n|\le M.
  $$

- 对函数而言，

  $$
  c(x)=O(1)\qquad(x\to x_0)
  $$

  表示 $c(x)$ 在 $x_0$ 的某个去心邻域内有界。
- $O(1)$ 只控制“不会无限变大”，不要求极限存在，更不要求趋于零。例如

  $$
  (-1)^n=O(1),
  $$

  但 $(-1)^n$ 没有极限。

#### 定义：$O(u_n)$ 表示不超过 $u_n$ 的尺度

- 以数列为例，

  $$
  r_n=O(u_n)
  $$

  表示存在常数 $M>0$，使得充分大的 $n$ 都满足

  $$
  |r_n|\le M|u_n|.
  $$

- 等价地，存在一个有界数列 $c_n=O(1)$，使得

  $$
  r_n=u_nc_n.
  $$

  因而可以把定义记成

  $$
  \boxed{O(u_n)=u_nO(1)}.
  $$

- 若 $u_n$ 从某一项开始不为零，上述定义也等价于比值 $r_n/u_n$ 最终有界。
- $O(u_n)$ 只说明 $r_n$ 不会超过 $u_n$ 的尺度；它并不说明 $r_n$ 相对于 $u_n$ 可以忽略。例如

  $$
  3u_n=O(u_n),
  $$

  但通常不能写成 $3u_n=o(u_n)$。
- $O(u_n)$ 也不等于“必定与 $u_n$ 同阶”。例如当 $x\to0$ 时，

  $$
  x^2=O(x),
  \qquad
  x^2=o(x).
  $$

#### 定义：$o(1)$ 表示一个趋于零的过程

- 对数列而言，

  $$
  \varepsilon_n=o(1)\qquad(n\to\infty)
  $$

  就是

  $$
  \varepsilon_n\to0.
  $$

- 对函数而言，

  $$
  \varepsilon(x)=o(1)\qquad(x\to x_0)
  $$

  就是

  $$
  \varepsilon(x)\to0.
  $$

- 因此，$o(1)$ 不是某个固定的数，也不是某个固定的函数；它概括表示“在当前趋近过程中趋于零的一项”。不同位置出现的 $o(1)$ 可以代表不同的无穷小。

#### 定义：$o(u_n)$ 表示相对于 $u_n$ 可以忽略

- 若 $u_n\to0$，则

  $$
  r_n=o(u_n)
  $$

  表示存在一个趋于零的数列 $\varepsilon_n$，使

  $$
  r_n=u_n\varepsilon_n,
  \qquad
  \varepsilon_n=o(1).
  $$

  也就是说，$r_n$ 不仅趋于零，而且相对于 $u_n$ 还要更小。
- 若 $u_n$ 从某一项开始不为零，上述定义等价于

  $$
  \frac{r_n}{u_n}\to0.
  $$

- 因而最常用的符号改写就是

  $$
  \boxed{o(u_n)=u_n o(1)}.
  $$

- 以前见过的

  $$
  f(x)=P_n(x)+o\bigl((x-x_0)^n\bigr)
  $$

  也是同一件事：余项除以 $(x-x_0)^n$ 后趋于零。

#### 比较：$O$ 控制尺度，$o$ 进一步表示可以忽略

- 两个记号的结构只有一个关键词不同：

  $$
  O(u_n)=u_nO(1),
  \qquad
  o(u_n)=u_no(1).
  $$

- 因为每个趋于零的量都必然有界，所以

  $$
  r_n=o(u_n)
  \quad\Longrightarrow\quad
  r_n=O(u_n).
  $$

- 反过来一般不成立：$O(u_n)$ 允许与 $u_n$ 同阶，$o(u_n)$ 则要求相对比值趋于零。

#### 运算：把 $O$、$o$ 还原成有界因子与趋零因子

- 下列“等式”描述的是尺度关系：左侧任取符合条件的具体函数或数列，运算结果都属于右侧所写的尺度；不能把 $O$、$o$ 当成两个固定的量。

- **先只看 $o(1)$**：在同一个趋近过程中，

  $$
  o(1)+o(1)=o(1),
  \qquad
  c\,o(1)=o(1),
  \qquad
  o(1)o(1)=o(1).
  $$

  这里 $c$ 是固定常数；三条关系分别来自极限的加法、数乘与乘法运算。

- **乘另一个尺度**：

  $$
  v_n o(u_n)
  =v_nu_n o(1)
  =o(v_nu_n).
  $$

- **有界量乘 $o(1)$**：若 $v_n$ 有界，特别是 $v_n$ 趋于有限值，则

  $$
  v_n o(1)=o(1).
  $$

- **同阶的 $O$、$o$ 相加**：

  $$
  \begin{aligned}
  O(u_n)+O(u_n)&=O(u_n),\\
  O(u_n)+o(u_n)&=O(u_n),\\
  o(u_n)+o(u_n)&=o(u_n).
  \end{aligned}
  $$

- **不同尺度相乘**：

  $$
  \begin{aligned}
  O(u_n)O(v_n)&=O(u_nv_n),\\
  O(u_n)o(v_n)&=o(u_nv_n),\\
  o(u_n)o(v_n)&=o(u_nv_n).
  \end{aligned}
  $$

- **尺度向上传递**：若 $r_n=o(w_n)$，同时 $w_n=O(u_n)$，则

  $$
  r_n
  =w_no(1)
  =u_nO(1)o(1)
  =u_no(1)
  =o(u_n).
  $$

  这正是 Exercise 15 中使用的规则：$w(x)=O(x)$，所以相对于 $w(x)$ 可忽略的那个具体余项，也相对于 $x$ 可忽略。

- 这些式子都来自同一个动作：把 $O$ 写成“原尺度乘一个有界因子”，把 $o$ 写成“原尺度乘一个趋零因子”，再进行普通代数运算。
- 加法与乘法可以按上述规则处理；除法还要检查分母是否可能趋于零，不能机械套用同样的记号运算。

#### 推论：同阶尺度可以替换小 $o$ 的参照对象

- 设

  $$
  u=x^m+o(x^m).
  $$

  其中 $m$ 为正整数。则

  $$
  \frac{u}{x^m}
  =
  1+o(1)
  \longrightarrow1,
  $$

  所以 $u$ 与 $x^m$ 同阶。

- 把 $o(u)$ 理解为当前运算中的一个具体余项。由定义，

  $$
  \frac{o(u)}u\to0.
  $$

  使用 Exercise 18 中刚才的换算：

  $$
  \frac{o(u)}{x^m}
  =
  \frac{o(u)}u
  \cdot
  \frac{u}{x^m}
  \longrightarrow0.
  $$

  因此

  $$
  o(u)=o(x^m).
  $$

- 这里能够写成“相等”，是因为反方向也成立：由 $u/x^m\to1$ 可知 $x^m/u\to1$，所以任何 $o(x^m)$ 也必然是 $o(u)$。
- 更一般地，若

  $$
  u=cx^m+o(x^m),
  \qquad c\ne0,
  $$

  则 $u/x^m\to c$，仍然有

  $$
  o(u)=o(x^m).
  $$

#### 回到 Exercise 17：嵌套 Taylor 先统一尺度，不写 $o(o(t))$

- 先不展开内层，而把它与极限值 $1$ 的差记成

  $$
  \delta(t)
  =
  \frac{\ln(1+t)}t-1,
  \qquad
  \delta(t)\to0.
  $$

- 把这个整体代回原题以后，表达式变成

  $$
  \mathrm e\left[
  \frac1{2t}
  +\frac{\mathrm e^{\delta(t)}-1}{t^2}
  \right].
  $$

- 直接使用指数函数的麦克劳林展开，先把外层拆到二阶，并暂时保留余项：

  $$
  \mathrm e^{\delta(t)}-1
  =
  \delta(t)+\frac{\delta(t)^2}{2}+r(t),
  \qquad
  r(t)=o(\delta(t)^2).
  $$

- 代回完整表达式并整理：

  $$
  \mathrm e\left[
  \frac{\delta(t)+t/2}{t^2}
  +\frac12\left(\frac{\delta(t)}t\right)^2
  +\frac{r(t)}{t^2}
  \right].
  $$

- 到这里，不拆开 $\delta(t)$ 就无法继续。第一项进一步写成

  $$
  \frac{\delta(t)+t/2}{t^2}
  =
  \frac{\ln(1+t)-t+t^2/2}{t^3},
  $$

  此时才确定 $\ln(1+t)$ 必须展开到三阶。展开后同时得到 $\delta(t)\sim-t/2$，从而也能判断

  $$
  \frac{r(t)}{t^2}
  =
  \frac{r(t)}{\delta(t)^2}
  \cdot
  \frac{\delta(t)^2}{t^2}
  \to0.
  $$

- 所以这里不出现 $o(o(t^2))$：$\delta(t)$ 在前半段始终作为一个完整的内层无穷小；外层余项单独记成 $r(t)$。直到最后展开内层，才把所有对象统一换回 $t$ 的尺度。

- **嵌套展开的通用顺序**：
  1. 先减去内层函数的极限值，把剩余部分整体记成一个无穷小；
  2. 不急着展开内层，先把它代回完整题目；
  3. 先展开外层并保留它自己的余项，再结合完整表达式做结构整理；
  4. 当整体已经无法继续推进时，再拆开内层，并由整理后的分母确定它必须展开到几阶。

#### 回到 Exercise 15：为什么 $o(w(x))$ 可以吸收到 $o(x)$

- 上一课已经得到

  $$
  w(x)=A\ln a\,x+o(x).
  $$

- 其中 $A\ln a\,x=O(x)$，而 $o(x)$ 也必然是 $O(x)$，所以

  $$
  w(x)=O(x).
  $$

- 在

  $$
  \mathrm e^{w(x)}-1=w(x)+r(x)
  $$

  中，Taylor–Peano 余项满足

  $$
  r(x)=o(w(x)).
  $$

- 现在使用刚才的尺度传递规则：

  $$
  r(x)
  =w(x)o(1)
  =O(x)o(1)
  =o(x).
  $$

  因而这里只是把**这个具体余项**从“相对于 $w(x)$ 可忽略”提升为“相对于 $x$ 也可忽略”；并不是说所有 $o(w(x))$ 与所有 $o(x)$ 完全相同。

#### 比较：可以改写，不代表一定趋于零

- 对任意 $u_n$，只要 $r_n=o(u_n)$，都可以写成

  $$
  n r_n=(nu_n)o(1).
  $$

- 但如果 $nu_n$ 无界，就不能只凭右边含有 $o(1)$，断言整个乘积趋于零。一个趋于零的量与一个趋于无穷的量相乘，仍然属于未定式。
- 例如取

  $$
  u_n=\frac1{\sqrt n},
  \qquad
  r_n=\frac1n.
  $$

  此时 $r_n=o(u_n)$，但

  $$
  nr_n=1\not\to0.
  $$

- 因此要分清两件事：
  - $n\,o(u_n)=(nu_n)o(1)$ 是由定义得到的**合法尺度改写**；
  - $(nu_n)o(1)\to0$ 还需要 $nu_n$ 有界等额外条件。

#### 回到 Exercise 06：为什么这里的余项确实消失

- 对数的一阶 Taylor–Peano 展开写成

  $$
  \ln(1+u_n)=u_n+r_n,
  \qquad
  r_n=o(u_n).
  $$

- 由定义，存在 $\varepsilon_n=o(1)$，使得

  $$
  r_n=u_n\varepsilon_n.
  $$

  两边乘以 $n$：

  $$
  nr_n
  =nu_n\varepsilon_n
  =(nu_n)o(1).
  $$

- 原题已经由导数定义得到

  $$
  nu_n\to\frac{f'(a)}{f(a)}.
  $$

  所以 $nu_n$ 趋于有限值，必然有界，从而

  $$
  (nu_n)o(1)=o(1)\to0.
  $$

- 因此完整的运算链是

  $$
  \begin{aligned}
  n\ln(1+u_n)
  &=nu_n+n\,o(u_n)\\
  &=nu_n+(nu_n)o(1)\\
  &=nu_n+o(1)\\
  &\longrightarrow\frac{f'(a)}{f(a)}.
  \end{aligned}
  $$

#### 快速检查：先判断尺度，再处理小 $o$

- 若 $a_n=o(1/n)$，则

  $$
  na_n=o(1)\to0.
  $$

- 若只知道 $a_n=o(1)$，则不能直接判断 $na_n$ 的极限；还要比较 $a_n$ 与 $1/n$ 的大小。
- 小 $o$ 的下标对象说明“相对于谁可以忽略”；真正计算时，把它还原成“该对象乘 $o(1)$”。

### 50-100 | 继续上一课题目，并接入期中复习补充题

#### T03 · 导数、求导与微分

##### 知识点：把恒等式证明转化为常数函数判定

- 把等式左边整体记成函数 $F(x)$；若能证明 $F'(x)=0$，就把一个反三角函数恒等式转化成“函数在区间上是常数”。
- 再选择一个容易计算的点确定常数值；若这个点是区间端点，而求导公式只在开区间内成立，就用连续性把结论接回端点。
- 反三角函数求导时仍要检查定义域与根号的符号；这里 $\sqrt{(x^2-1)^2}=|x^2-1|$，不能直接去掉绝对值。

##### Exercise 01｜由导数为零证明反三角函数恒等式

- 证明

  $$
  2\arctan x
  +\arcsin\frac{2x}{1+x^2}
  =\pi,
  \qquad x\ge1.
  $$

- **主解法：证明左边是常数函数**。令

  $$
  F(x)
  =2\arctan x
  +\arcsin\frac{2x}{1+x^2}.
  $$

  对 $x>1$，令

  $$
  u(x)=\frac{2x}{1+x^2}.
  $$

  则

  $$
  u'(x)=\frac{2(1-x^2)}{(1+x^2)^2},
  $$

  并且

  $$
  \begin{aligned}
  \sqrt{1-u(x)^2}
  &=\sqrt{1-\frac{4x^2}{(1+x^2)^2}}\\
  &=\frac{|x^2-1|}{1+x^2}\\
  &=\frac{x^2-1}{1+x^2}.
  \end{aligned}
  $$

  最后一个等号使用了 $x>1$。于是

  $$
  \begin{aligned}
  F'(x)
  &=\frac{2}{1+x^2}
  +\frac{u'(x)}{\sqrt{1-u(x)^2}}\\
  &=\frac{2}{1+x^2}
  +\frac{\dfrac{2(1-x^2)}{(1+x^2)^2}}
  {\dfrac{x^2-1}{1+x^2}}\\
  &=\frac{2}{1+x^2}-\frac{2}{1+x^2}\\
  &=0.
  \end{aligned}
  $$

  因此 $F$ 在 $(1,+\infty)$ 上是常数。虽然 $x=1$ 处不能直接使用上面的反正弦求导公式，但 $F$ 在 $x=1$ 处连续，而且

  $$
  F(1)
  =2\arctan1+\arcsin1
  =\frac\pi2+\frac\pi2
  =\pi.
  $$

  所以

  $$
  \boxed{F(x)=\pi\qquad(x\ge1)}.
  $$

- **补充视角：主值范围与二倍角公式**。令 $\theta=\arctan x$。当 $x\ge1$ 时，

  $$
  \theta\in\left[\frac\pi4,\frac\pi2\right),
  \qquad
  2\theta\in\left[\frac\pi2,\pi\right).
  $$

  又有

  $$
  \sin2\theta
  =\frac{2\tan\theta}{1+\tan^2\theta}
  =\frac{2x}{1+x^2}.
  $$

  因为 $\arcsin$ 的主值属于 $[-\pi/2,\pi/2]$，所以

  $$
  \arcsin(\sin2\theta)=\pi-2\theta,
  $$

  从而原式仍等于 $\pi$。

##### 算法总结：代换后的差商必须覆盖原点两侧

- 给定的极限看起来像导数定义时，先把复合内层记成新变量 $t$。
- 除了比较新旧分母的比例，还要检查 $h\to0$ 时，$t$ 是否能够从左右两侧遍历零点附近的所有取值。
- 只看到右侧、某一条数列或对称差，都不足以自动推出双侧导数存在。

##### Exercise 02｜判断哪一种变尺度差商等价于导数存在

- 设 $f(x)$ 在 $x=0$ 的某邻域内有定义，且 $f(0)=0$。判断下列哪个条件与 $f'(0)$ 存在等价：

  1. $\displaystyle\lim_{h\to0}\frac{f(1-\cos h)}{h^2}$ 存在；
  2. $\displaystyle\lim_{h\to0}\frac{f(1-\mathrm e^h)}h$ 存在；
  3. $\displaystyle\lim_{n\to\infty}n f\left(\frac1n\right)$ 存在；
  4. $\displaystyle\lim_{h\to0}\frac{f(h)-f(-h)}h$ 存在。

- **求解**：正确的是第 2 个条件。

  - 对第 2 个条件，令

    $$
    t=1-\mathrm e^h.
    $$

    当 $h\to0$ 时，$t\to0$，且这个代换在零点附近同时覆盖 $t<0$ 与 $t>0$；反变换为

    $$
    h=\ln(1-t).
    $$

    同时，

    $$
    \frac{t}{h}
    =\frac{1-\mathrm e^h}{h}\to-1.
    $$

    若第 2 个极限存在，则

    $$
    \frac{f(t)}t
    =\frac{f(1-\mathrm e^h)}h
    \cdot\frac{h}{1-\mathrm e^h}
    $$

    存在双侧极限，所以 $f'(0)$ 存在。反过来，若 $f'(0)$ 存在，则

    $$
    \frac{f(1-\mathrm e^h)}h
    =\frac{f(t)-f(0)}t\cdot\frac{t}{h}
    \longrightarrow-f'(0),
    $$

    因而第 2 个极限存在。

  - 其余三个条件都不能控制完整的双侧差商。统一取反例

    $$
    f(x)=|x|.
    $$

    此时 $f'(0)$ 不存在，但

    $$
    \frac{f(1-\cos h)}{h^2}\to\frac12,
    \qquad
    n f\left(\frac1n\right)=1,
    $$

    并且

    $$
    \frac{f(h)-f(-h)}h=0.
    $$

  因此答案为

  $$
  \boxed{\text{第 2 个条件}}.
  $$

##### 算法总结：参数方程求二阶导数仍然要对 $x$ 求导

- 先分别计算 $dx/dt$ 与 $dy/dt$，在 $dx/dt\ne0$ 时得到

  $$
  \frac{dy}{dx}=\frac{dy/dt}{dx/dt}.
  $$

- 求二阶导数时，先把 $dy/dx$ 看成参数 $t$ 的函数，再除以 $dx/dt$：

  $$
  \frac{d^2y}{dx^2}
  =\frac{d}{dx}\left(\frac{dy}{dx}\right)
  =\frac{\dfrac d{dt}\left(\dfrac{dy}{dx}\right)}{dx/dt}.
  $$

##### Exercise 03｜由参数方程连续求一阶与二阶导数

- 设

  $$
  \begin{cases}
  x=\cos t,\\
  y=t\cos t-\sin t,
  \end{cases}
  $$

  求 $dy/dx$ 与 $d^2y/dx^2$。

- **求解**：当 $\sin t\ne0$ 时，$dx/dt\ne0$。先分别对参数求导：

  $$
  \frac{dx}{dt}=-\sin t,
  $$

  $$
  \frac{dy}{dt}
  =\cos t-t\sin t-\cos t
  =-t\sin t.
  $$

  因而

  $$
  \boxed{\frac{dy}{dx}=t}.
  $$

  再对 $t$ 求导，并除以 $dx/dt$：

  $$
  \boxed{
  \frac{d^2y}{dx^2}
  =\frac{d(t)/dt}{dx/dt}
  =-\frac1{\sin t}
  }.
  $$

  上述两个参数求导公式直接适用的条件是 $\sin t\ne0$；当 $t=k\pi$ 时，$dx/dt=dy/dt=0$，不能直接套用标准公式。

#### T04 · 中值定理、洛必达与泰勒

##### 算法总结：先由有限极限确定消失阶，再读取 Taylor 系数

- 分母是二阶无穷小时，商趋于有限值会迫使分子至少消去常数项与一次项。
- 先用外层函数的连续性确定 $f(0)$，再把复合函数与三角函数都展开到目标阶，最后把系数与 $f''(0)$ 对应起来。

##### Exercise 04｜由复合极限反推二阶导数

- 设函数 $f(x)$ 在 $x=0$ 处二阶可导，且

  $$
  \lim_{x\to0}
  \frac{\mathrm e^{f(x)}-1}{1-\cos x}=2.
  $$

  求 $f''(0)$。

- **求解**：因为 $1-\cos x\to0$，而原商趋于有限值，所以

  $$
  \mathrm e^{f(x)}-1\to0.
  $$

  从而 $f(x)\to0$。又因为二阶可导必然连续，所以

  $$
  f(0)=0.
  $$

  正好使用本次课补充的小 $o$ 运算：

  $$
  \mathrm e^{f(x)}-1
  =f(x)+o(f(x))
  =f(x)[1+o(1)],
  $$

  $$
  1-\cos x
  =\frac{x^2}{2}+o(x^2)
  =x^2\left[\frac12+o(1)\right].
  $$

  因此原商可以写成

  $$
  \frac{\mathrm e^{f(x)}-1}{1-\cos x}
  =\frac{f(x)}{x^2}
  \cdot
  \frac{1+o(1)}{\dfrac12+o(1)}.
  $$

  第二个因子趋于 $2$，而原商也趋于 $2$，所以

  $$
  \frac{f(x)}{x^2}\to1.
  $$

  因而

  $$
  f'(0)
  =\lim_{x\to0}\frac{f(x)-f(0)}x
  =\lim_{x\to0}x\frac{f(x)}{x^2}
  =0.
  $$

  在 $x=0$ 处写出二阶 Taylor–Peano 展开：

  $$
  f(x)
  =f(0)+f'(0)x+\frac{f''(0)}2x^2+o(x^2)
  =\frac{f''(0)}2x^2+o(x^2).
  $$

  两边除以 $x^2$ 并取极限：

  $$
  1=\frac{f''(0)}2,
  $$

  所以

  $$
  \boxed{f''(0)=2}.
  $$

##### 算法总结：先制造两个零端点，再为目标式寻找乘积导数

- 题目给出的零点可能还不够使用罗尔定理；先用介值定理或离散函数值的符号关系，找到另一个零点。
- 把目标式改写成

  $$
  g'(x)+p(x)g(x)=0
  $$

  后，尝试寻找权函数 $\mu(x)$，使它成为

  $$
  [\mu(x)g(x)]'=0.
  $$

- 两个零端点保证 $\mu g$ 的端点值相等，罗尔定理再给出所需的中间点。

##### Exercise 05｜先找零端点，再处理任意参数

- [已讲原型：T04 · 2023 年应用与证明题 2](#/terms/2026-fall/courses/calculus-i/topics/topic-04-mvt-lhopital-taylor/runbook)

- 设函数 $f(x)$ 在 $[0,1]$ 上连续，在 $(0,1)$ 内可导，并且

  $$
  f(0)=f(1)=0,
  \qquad
  f\left(\frac12\right)=1.
  $$

  证明：

  1. 存在 $\eta\in(1/2,1)$，使得 $f(\eta)=\eta$；
  2. 对任意实数 $\lambda$，存在 $\xi\in(0,\eta)$，使得

     $$
     f'(\xi)-\lambda[f(\xi)-\xi]=1.
     $$

- **证明（1）**：令

  $$
  g(x)=f(x)-x.
  $$

  则

  $$
  g\left(\frac12\right)
  =1-\frac12
  =\frac12>0,
  \qquad
  g(1)=f(1)-1=-1<0.
  $$

  由介值定理，存在 $\eta\in(1/2,1)$，使得

  $$
  g(\eta)=0,
  $$

  即

  $$
  \boxed{f(\eta)=\eta}.
  $$

- **证明（2）**：由 $f(0)=0$ 与 $f(\eta)=\eta$，有

  $$
  g(0)=g(\eta)=0.
  $$

  目标等式可以改写成

  $$
  g'(\xi)-\lambda g(\xi)=0.
  $$

  这提示我们构造

  $$
  \Phi(x)=\mathrm e^{-\lambda x}g(x)
  =\mathrm e^{-\lambda x}[f(x)-x].
  $$

  因为

  $$
  \Phi(0)=\Phi(\eta)=0,
  $$

  由罗尔定理，存在 $\xi\in(0,\eta)$，使得

  $$
  \begin{aligned}
  0=\Phi'(\xi)
  &=\mathrm e^{-\lambda\xi}
  \left\{f'(\xi)-1-\lambda[f(\xi)-\xi]\right\}.
  \end{aligned}
  $$

  指数因子不为零，所以

  $$
  \boxed{
  f'(\xi)-\lambda[f(\xi)-\xi]=1
  }.
  $$

##### Exercise 06｜先由离散函数值找到零点，再构造乘积

- 已知函数 $f(x)$ 在 $[0,3]$ 上连续，在 $(0,3)$ 内可导，且

  $$
  f(1)+f(2)+f(3)=0.
  $$

  证明：

  1. 存在 $\eta\in[1,3]$，使得 $f(\eta)=0$；
  2. 若还有 $f(0)=0$，则存在 $\xi\in(0,3)$，使得

     $$
     f(\xi)+2f'(\xi)=0.
     $$

- **证明（1）**：若 $f(1),f(2),f(3)$ 中至少一个等于零，结论立即成立。

  若三者都不为零，由

  $$
  f(1)+f(2)+f(3)=0
  $$

  可知三者不可能严格同号，因此至少有两个函数值异号。由连续函数的介值定理，它们所对应的两个点之间至少存在一点 $\eta$，使得

  $$
  \boxed{f(\eta)=0}.
  $$

- **证明（2）**：现在

  $$
  f(0)=f(\eta)=0.
  $$

  目标式

  $$
  f(\xi)+2f'(\xi)=0
  $$

  等价于

  $$
  f'(\xi)+\frac12f(\xi)=0.
  $$

  因此构造

  $$
  \Phi(x)=\mathrm e^{x/2}f(x).
  $$

  在区间 $[0,\eta]$ 上，

  $$
  \Phi(0)=\Phi(\eta)=0.
  $$

  由罗尔定理，存在 $\xi\in(0,\eta)\subset(0,3)$，使得

  $$
  0=\Phi'(\xi)
  =\mathrm e^{\xi/2}
  \left[f'(\xi)+\frac12f(\xi)\right].
  $$

  所以

  $$
  \boxed{f(\xi)+2f'(\xi)=0}.
  $$

#### 课堂组合

- 上一次答疑课停在 Exercise 10；从上一课的 Exercise 11 开始继续处理尚未讲解的题目。
- 本课新增的六道题从 Exercise 01 重新编号，并按 T03、T04 分类；课堂根据学生问题把两组材料交叉使用。
- 新增材料不要求独立填满 100 分钟；本次课的完整容量来自“上一课未完成题目＋本课补充题目”。

## 第三次课 · 期中考试试卷选讲

> 中国海洋大学全日制本科课程期中考试试卷 · 2026 年秋季学期 · 高等数学 II-1

### 0-50 | Course Topic → 知识点／算法总结 → Exercises

#### T01 · 极限：把趋近过程与函数在一点的取值分开

##### 知识点：函数极限只考察去心邻域

- 讨论 $\displaystyle\lim_{x\to x_0}f(x)$ 时，只看 $x$ 接近但不等于 $x_0$ 时的函数值。
- $f(x_0)$ 是否有定义、取什么值，都不能单独决定极限是否存在；反过来，极限存在也不能保证函数在 $x_0$ 处已经定义。

##### Exercise 01｜比较函数极限与点值
> 期中考试 · 选择题 1 · 3 分

- **题目**。设 $f(x)$ 在 $x_0$ 的某去心邻域内有定义，则下列命题中正确的是（　）。
  - A. 若 $\displaystyle\lim_{x\to x_0}f(x)$ 存在，则 $f(x)$ 在 $x_0$ 处必有定义；
  - B. 若 $\displaystyle\lim_{x\to x_0}f(x)=A$，则 $f(x_0)=A$；
  - C. 若 $f(x_0)=A$，则 $\displaystyle\lim_{x\to x_0}f(x)=A$；
  - D. $\displaystyle\lim_{x\to x_0}f(x)$ 是否存在，与 $f(x)$ 在 $x_0$ 处是否有定义无关。
- **判断 A、B、C**。极限只考察去心邻域。即使极限存在，也可以不给 $f(x_0)$ 赋值，或者另外赋一个不等于极限值的数，因此 A、B 都不成立；反过来，只知道 $f(x_0)=A$ 也不能决定附近的趋近过程，因此 C 不成立。
- **判断 D**。改变或删除单点 $x_0$ 处的函数值，不会改变 $\displaystyle\lim_{x\to x_0}f(x)$，所以 D 正确。
- **答案**：D。

##### 算法总结：先找首个不消失的幂次

- 对形如

  $$
  [1+u(x)]^\alpha-1,
  \qquad
  u(x)\to0,
  $$

  的无穷小，沿用已经使用过的等价关系

  $$
  (1+u)^\alpha-1\sim\alpha u.
  $$

- “与 $x^p$ 同阶”不是只问极限是否为零，而是要找到展开后首个非零项的幂次。

##### Exercise 02｜判断复合无穷小的阶
> 期中考试 · 选择题 2 · 3 分

- **题目**。当 $x\to0$ 时，无穷小

  $$
  \sqrt[10]{1+3x^6}-1
  $$

  与 $x^p$ 同阶，则 $p$ 等于（　）。
  - A. $3$；
  - B. $6$；
  - C. $10$；
  - D. $12$。
- **沿用常见等价无穷小**。令 $u=3x^6$，则

  $$
  \sqrt[10]{1+3x^6}-1
  =(1+u)^{1/10}-1
  \sim\frac1{10}u
  =\frac3{10}x^6.
  $$

- 与它同阶的是 $x^6$，常数 $3/10$ 不改变阶。
- **答案**：B，$p=6$。

##### 算法总结：和式先用统一上下界夹住

- 遇到 $n$ 项和，若每一项都接近同一个简单量，不必逐项求极限；先给每一项找统一的上下界，再对整个和使用夹逼准则。
- 这里不提前调用尚未正式学习的定积分。用夹逼准则正好复习数列极限的基本工具。

##### Exercise 03｜用夹逼准则处理等长和式
> 期中考试 · 填空题 1 · 3 分

- **题目**。计算

  $$
  \lim_{n\to\infty}
  \left(
  \frac1{\sqrt{n^2+1}}
  +\frac1{\sqrt{n^2+2}}
  +\cdots
  +\frac1{\sqrt{n^2+n}}
  \right).
  $$

- 记括号中的和为 $S_n$。当 $1\le k\le n$ 时，

  $$
  \frac1{\sqrt{n^2+n}}
  \le
  \frac1{\sqrt{n^2+k}}
  \le
  \frac1{\sqrt{n^2+1}}.
  $$

- 将统一上下界分别相加 $n$ 次：

  $$
  \frac{n}{\sqrt{n^2+n}}
  \le S_n\le
  \frac{n}{\sqrt{n^2+1}}.
  $$

- 两端同时除以 $n$：

  $$
  \frac1{\sqrt{1+1/n}}
  \le S_n\le
  \frac1{\sqrt{1+1/n^2}}.
  $$

  左右两端都趋于 $1$，由夹逼准则，

  $$
  \boxed{\lim_{n\to\infty}S_n=1}.
  $$

##### 算法总结：幂指极限先做指数对数恒等变换

- 对 $1^\infty$ 型表达式，先写成

  $$
  [g(x)]^{h(x)}
  =\exp\!\bigl(h(x)\ln g(x)\bigr),
  $$

  再用麦克劳林展开读取指数中的首项。
- 展开时先统一尺度。本题分子、分母都需要保留到 $x^2$ 阶。

##### Exercise 04｜用麦克劳林展开处理幂指极限
> 期中考试 · 填空题 2 · 3 分

- **题目**。计算

  $$
  \lim_{x\to0}
  (\cos2x)^{\frac1{x\sin x}}.
  $$

- 当 $x$ 足够接近 $0$ 时 $\cos2x>0$。先做指数对数恒等变换：

  $$
  (\cos2x)^{\frac1{x\sin x}}
  =
  \exp\left(
  \frac{\ln(\cos2x)}{x\sin x}
  \right).
  $$

- 使用已经学过的麦克劳林展开：

  $$
  \cos2x
  =1-2x^2+o(x^2),
  $$

  因而

  $$
  \ln(\cos2x)
  =\ln\!\left[1-2x^2+o(x^2)\right]
  =-2x^2+o(x^2).
  $$

  同时

  $$
  x\sin x=x^2+o(x^2).
  $$

- 所以指数部分满足

  $$
  \frac{\ln(\cos2x)}{x\sin x}
  =
  \frac{-2x^2+o(x^2)}{x^2+o(x^2)}
  \longrightarrow-2.
  $$

  从而

  $$
  \boxed{
  \lim_{x\to0}
  (\cos2x)^{\frac1{x\sin x}}
  =\mathrm e^{-2}
  }.
  $$

##### 算法总结：绝对值与 $\mathrm e^{1/x}$ 同时出现时分别计算左右极限

- $|x|$ 在 $x>0$ 与 $x<0$ 上给出不同符号；$\mathrm e^{1/x}$ 在两个方向上又分别趋于 $+\infty$ 与 $0$。
- 这类题不能先把双侧过程合并。先求左右极限，再用“左右极限相等”反求参数。

##### Exercise 05｜由双侧极限存在反求参数
> 期中考试 · 计算题 4 · 10 分

- **题目**。已知极限

  $$
  \lim_{x\to0}
  \left(
  \frac{2+\mathrm e^{1/x}}{1+\mathrm e^{1/x}}
  +\frac{\sin ax}{|x|}
  \right)
  $$

  存在，求 $a$ 及该极限值。
- **从右侧逼近**。当 $x\to0^+$ 时，

  $$
  \mathrm e^{1/x}\to+\infty,
  \qquad
  \frac{2+\mathrm e^{1/x}}{1+\mathrm e^{1/x}}\to1,
  $$

  并且 $|x|=x$，所以

  $$
  \frac{\sin ax}{|x|}
  =\frac{\sin ax}{x}
  \longrightarrow a.
  $$

  因而右极限为 $1+a$。
- **从左侧逼近**。当 $x\to0^-$ 时，

  $$
  \mathrm e^{1/x}\to0,
  \qquad
  \frac{2+\mathrm e^{1/x}}{1+\mathrm e^{1/x}}\to2,
  $$

  并且 $|x|=-x$，所以

  $$
  \frac{\sin ax}{|x|}
  =-\frac{\sin ax}{x}
  \longrightarrow-a.
  $$

  因而左极限为 $2-a$。
- 双侧极限存在要求

  $$
  1+a=2-a,
  $$

  所以

  $$
  \boxed{a=\frac12},
  \qquad
  \boxed{\text{原极限}=\frac32}.
  $$

#### T02 · 连续性：先找定义域中的特殊点，再检查能否接上

##### 算法总结：分母为零只给出候选间断点

- 对分式函数，先解分母为零，得到所有候选间断点；再比较分子是否也为零。
- 分子、分母同时为零时继续比较消失的阶，可能是可去间断点；只有分母为零时，通常产生无穷间断点。

##### Exercise 06｜分类讨论所有整数点处的间断
> 期中考试 · 选择题 5 · 3 分

- **题目**。设

  $$
  f(x)=\frac{x^3-x}{\sin\pi x},
  $$

  讨论其间断点，则结论为（　）。
  - A. 有三个可去间断点；
  - B. 只有一个可去间断点；
  - C. 有两个跳跃间断点；
  - D. 有无穷多个第一类间断点。
- **先找候选点**。当且仅当 $x=k\in\mathbb Z$ 时 $\sin\pi x=0$，所以所有整数都是候选间断点。
- **检查分子**：

  $$
  x^3-x=x(x-1)(x+1).
  $$

  它只在 $x=-1,0,1$ 三个整数点为零。
- **比较消失的阶**。对 $k=-1,0,1$，当 $x\to k$ 时，

  $$
  \sin\pi x
  \sim \pi(-1)^k(x-k),
  \qquad
  x^3-x
  \sim(3k^2-1)(x-k).
  $$

  分子、分母都以一阶速度趋于零，约去共同的 $x-k$ 后得到有限极限，因此这三个点都是可去间断点。
- 对其余整数 $k$，分子不为零而分母趋于零，函数无界，产生无穷间断点；它们不是第一类间断点。
- **答案**：A。

##### 算法总结：分段点处用“极限值＝函数值”

- 分段函数在拼接点连续，需要同时检查：

  $$
  \lim_{x\to x_0^-}f(x)
  =
  \lim_{x\to x_0^+}f(x)
  =
  f(x_0).
  $$

- 本题两侧已经写在同一个分式中，可以直接计算 $x\to0$ 时的极限，再与单独给出的 $f(0)$ 比较。

##### Exercise 07｜由连续性反求分段函数中的参数
> 期中考试 · 计算题 3 · 10 分

- **题目**。已知

  $$
  f(x)=
  \begin{cases}
  \dfrac{\sin2x+\mathrm e^{2ax}-1}{x},&x\ne0,\\[6pt]
  a,&x=0
  \end{cases}
  $$

  在 $(-\infty,+\infty)$ 上连续，求 $a$。
- 只需检查拼接点 $x=0$。沿用两个重要极限：

  $$
  \frac{\sin2x}{x}
  =2\frac{\sin2x}{2x}
  \longrightarrow2,
  $$

  以及

  $$
  \frac{\mathrm e^{2ax}-1}{x}
  =
  2a\frac{\mathrm e^{2ax}-1}{2ax}
  \longrightarrow2a.
  $$

  当 $a=0$ 时第二项恒为 $0$，同一结论仍成立。
- 因而

  $$
  \lim_{x\to0}f(x)=2+2a.
  $$

  连续性要求该极限等于 $f(0)=a$：

  $$
  2+2a=a.
  $$

  所以

  $$
  \boxed{a=-2}.
  $$

### 50-100 | Course Topic → 知识点／算法总结 → Exercises（继续）

#### T03 · 导数、求导与微分

##### 算法总结：把变尺度差商拆回标准导数定义

- 已知的是

  $$
  f'(x_0)
  =
  \lim_{\Delta x\to0}
  \frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}.
  $$

- 题面同时出现 $x_0+2h$ 与 $x_0-h$ 时，先在分子中加减 $f(x_0)$，把它拆成两个标准差商，再核对每个增量的倍数与方向。

##### Exercise 08｜由一点处的导数计算双向差商
> 期中考试 · 选择题 3 · 3 分

- **题目**。设 $f'(x_0)=2$，则

  $$
  \lim_{h\to0}
  \frac{f(x_0+2h)-f(x_0-h)}{h}
  $$

  等于（　）。
  - A. $2$；
  - B. $1$；
  - C. $6$；
  - D. 不确定。
- **补上共同基点 $f(x_0)$**：

  $$
  \begin{aligned}
  &\frac{f(x_0+2h)-f(x_0-h)}h\\
  &=
  \frac{f(x_0+2h)-f(x_0)}h
  +\frac{f(x_0)-f(x_0-h)}h\\
  &=
  2\frac{f(x_0+2h)-f(x_0)}{2h}
  +\frac{f(x_0-h)-f(x_0)}{-h}.
  \end{aligned}
  $$

- 当 $h\to0$ 时，$2h\to0$、$-h\to0$，两个标准差商都趋于 $f'(x_0)=2$。因此原极限为

  $$
  2f'(x_0)+f'(x_0)=3f'(x_0)=6.
  $$

- **答案**：C。

##### 算法总结：分段函数可导要先连续，再比较左右导数

- 在拼接点可导必须同时满足：
  1. 左右函数值接上；
  2. 左右导数相等。
- 只比较两侧求导公式，会漏掉连续性条件。

##### Exercise 09｜由拼接点可导反求两个参数
> 期中考试 · 选择题 4 · 3 分

- **题目**。设

  $$
  f(x)=
  \begin{cases}
  x^2,&x\le1,\\
  ax+b,&x>1,
  \end{cases}
  $$

  若 $f$ 在 $x=1$ 处可导，则 $(a,b)$ 等于（　）。
  - A. $(2,-1)$；
  - B. $(2,1)$；
  - C. $(-2,1)$；
  - D. $(1,0)$。
- **先用连续性**：

  $$
  1=a+b.
  $$

- **再比较左右导数**。左侧函数 $x^2$ 在 $1$ 处的导数为 $2$；右侧一次函数的导数为 $a$，所以

  $$
  a=2.
  $$

  代回连续性条件得到 $b=-1$。
- **答案**：A，$(a,b)=(2,-1)$。

##### 算法总结：等价于可导的条件必须覆盖完整双侧差商

- 只让新变量从非负一侧趋于 $0$，最多读取右导数，不能保证双侧可导。
- 若代换 $t=\varphi(x)$ 在 $0$ 附近保持双侧、可逆，并且 $\varphi(x)/x\to1$，就可以把新的差商还原成 $f(t)/t$。

##### Exercise 10｜辨认真正等价于可导存在的变尺度差商
> 期中考试 · 选择题 6 · 3 分

- **题目**。设 $f(0)=0$，则 $f$ 在 $x=0$ 处可导的充要条件是下列哪个极限存在（　）。
  - A. $\displaystyle\lim_{x\to0}\frac{f(\ln(1+x^2))}{x}$；
  - B. $\displaystyle\lim_{x\to0}\frac{f(1-\cos x)}{x^2}$；
  - C. $\displaystyle\lim_{x\to0}\frac{f(x^2)}x$；
  - D. $\displaystyle\lim_{x\to0}\frac{f(\mathrm e^x-1)}x$。
- **先排除 A、B、C**。三者放进 $f$ 的自变量在 $x\to0$ 时都只从非负一侧趋于 $0$。更直接地，取

  $$
  f(t)=|t|,
  $$

  则 $f(0)=0$，但 $f'(0)$ 不存在；另一方面，

  $$
  \frac{f(\ln(1+x^2))}{x}
  =\frac{\ln(1+x^2)}x\to0,
  $$

  $$
  \frac{f(1-\cos x)}{x^2}
  =\frac{1-\cos x}{x^2}\to\frac12,
  $$

  $$
  \frac{f(x^2)}x=x\to0.
  $$

  所以 A、B、C 都不能推出可导。
- **证明 D 的充分性**。令

  $$
  t=\mathrm e^x-1.
  $$

  当 $x\to0$ 时，$t\to0$ 且覆盖零点两侧，并且 $x=\ln(1+t)$。若 D 中的极限为 $L$，则

  $$
  \frac{f(t)}t
  =
  \frac{f(t)}{\ln(1+t)}
  \frac{\ln(1+t)}t
  \longrightarrow L.
  $$

  因而 $f'(0)$ 存在。
- **证明 D 的必要性**。若 $f'(0)$ 存在，则

  $$
  \frac{f(\mathrm e^x-1)}x
  =
  \frac{f(t)}t\frac{t}{x}
  \longrightarrow f'(0)\cdot1.
  $$

- **答案**：D。

##### 算法总结：反函数导数先找对应的原函数点

- 若 $y=g(x)$ 的反函数为 $x=\varphi(y)$，则

  $$
  \varphi'(y_0)
  =
  \frac1{g'(x_0)},
  \qquad
  y_0=g(x_0).
  $$

- 不能把反函数的输入 $y_0$ 直接代入 $g'$；先解出与它对应的 $x_0$。

##### Exercise 11｜求反函数在指定函数值处的导数
> 期中考试 · 填空题 3 · 3 分

- **题目**。设 $y=x+\mathrm e^x$，其反函数为 $x=\varphi(y)$，求 $\varphi'(1)$。
- 记

  $$
  g(x)=x+\mathrm e^x.
  $$

  因为 $g'(x)=1+\mathrm e^x>0$，所以 $g$ 严格递增；再由

  $$
  g(0)=0+\mathrm e^0=1
  $$

  可知与 $y=1$ 对应的原函数点是 $x_0=0$。
- 于是

  $$
  g'(0)=2,
  \qquad
  \boxed{\varphi'(1)=\frac1{g'(0)}=\frac12}.
  $$

##### 算法总结：高阶导数先写出周期规律

- 对 $\sin(ax)$ 连续求导，每求一次导数都会多乘一个 $a$，相位同时增加 $\pi/2$：

  $$
  \frac{d^n}{dx^n}\sin(ax)
  =
  a^n\sin\left(ax+\frac{n\pi}{2}\right).
  $$

- 真正需要计算的是 $n$ 除以 $4$ 的余数，不必连续写出上千次求导。

##### Exercise 12｜利用周期规律计算高阶导数
> 期中考试 · 填空题 4 · 3 分

- **题目**。设 $f(x)=\sin2x$，求

  $$
  f^{(2026)}\left(\frac\pi4\right).
  $$

- 由高阶导数公式，

  $$
  f^{(2026)}(x)
  =
  2^{2026}
  \sin\left(2x+\frac{2026\pi}{2}\right).
  $$

- 因为 $2026\equiv2\pmod4$，所以第 $2026$ 阶导数的三角函数部分与原函数相比多出一个负号，系数则为 $2^{2026}$。代入 $x=\pi/4$：

  $$
  f^{(2026)}\left(\frac\pi4\right)
  =
  -2^{2026}\sin\frac\pi2
  =
  \boxed{-2^{2026}}.
  $$

##### 知识点：切线方程同时给出点值与导数值

- 曲线 $y=f(x)$ 在 $x=x_0$ 处的切线为

  $$
  y-f(x_0)=f'(x_0)(x-x_0).
  $$

- 已知切线的一般式时，代入 $x_0$ 读取切点纵坐标，直线斜率就是 $f'(x_0)$。

##### Exercise 13｜从切线方程读取函数值与导数值
> 期中考试 · 填空题 5 · 共 2 空，每空 3 分

- **题目**。已知曲线 $y=f(x)$ 在点 $(1,f(1))$ 处的切线为

  $$
  y=3x-1,
  $$

  求 $f(1)$ 与 $f'(1)$。
- 切点在直线上。代入 $x=1$：

  $$
  f(1)=3\cdot1-1=2.
  $$

- 直线的斜率为 $3$，因此

  $$
  f'(1)=3.
  $$

- **答案**：

  $$
  \boxed{f(1)=2,\qquad f'(1)=3}.
  $$

##### 算法总结：幂指函数先取对数，微分先求导再乘 $dx$

- 对 $y=[u(x)]^{v(x)}$，沿用指数对数恒等变换：

  $$
  \ln y=v(x)\ln u(x),
  $$

  再做隐式求导。
- 求函数微分时不需要另造一套法则；先求 $y'$，再写

  $$
  dy=y'\,dx.
  $$

##### Exercise 14｜幂指函数求导与复合函数微分
> 期中考试 · 计算题 1 · 10 分

- **题目（1）**。设

  $$
  y=(1+x^2)^{1/x},
  $$

  求 $y'(1)$。
- 两边取对数：

  $$
  \ln y=\frac{\ln(1+x^2)}x.
  $$

  对两边求导：

  $$
  \frac{y'}y
  =
  \frac{
  \dfrac{2x^2}{1+x^2}
  -\ln(1+x^2)
  }{x^2}.
  $$

  当 $x=1$ 时，

  $$
  y(1)=2,
  \qquad
  \left.\frac{y'}y\right|_{x=1}
  =1-\ln2.
  $$

  因而

  $$
  \boxed{y'(1)=2(1-\ln2)}.
  $$

- **题目（2）**。已知

  $$
  y=\ln(\mathrm e^x+\cos2x),
  $$

  求 $dy$。
- 在对数真数为正的区间上，沿复合结构逐层求导：

  $$
  y'
  =
  \frac{\mathrm e^x-2\sin2x}
  {\mathrm e^x+\cos2x}.
  $$

  所以

  $$
  \boxed{
  dy=
  \frac{\mathrm e^x-2\sin2x}
  {\mathrm e^x+\cos2x}\,dx
  }.
  $$

##### 算法总结：参数方程的二阶导数仍然是对 $x$ 求导

- 第一次求导：

  $$
  \frac{dy}{dx}
  =
  \frac{dy/dt}{dx/dt}.
  $$

- 第二次不能只对 $t$ 求导。应当把 $dy/dx$ 看成关于 $t$ 的函数，再除以 $dx/dt$：

  $$
  \frac{d^2y}{dx^2}
  =
  \frac{
  \dfrac d{dt}\left(\dfrac{dy}{dx}\right)
  }{dx/dt}.
  $$

##### Exercise 15｜由参数方程连续求一阶与二阶导数
> 期中考试 · 计算题 2 · 10 分

- **题目**。设

  $$
  \begin{cases}
  x=\arctan t,\\
  y=7t-\cos t,
  \end{cases}
  $$

  求

  $$
  \left.\frac{d^2y}{dx^2}\right|_{t=0}.
  $$

- 先求参数导数：

  $$
  \frac{dx}{dt}=\frac1{1+t^2},
  \qquad
  \frac{dy}{dt}=7+\sin t.
  $$

- 因而

  $$
  \frac{dy}{dx}
  =
  (7+\sin t)(1+t^2).
  $$

- 再对 $t$ 求导，并除以 $dx/dt$：

  $$
  \begin{aligned}
  \frac{d^2y}{dx^2}
  &=
  \frac{
  \dfrac d{dt}
  \left[(7+\sin t)(1+t^2)\right]
  }{1/(1+t^2)}\\
  &=
  \left[
  (1+t^2)\cos t
  +2t(7+\sin t)
  \right](1+t^2).
  \end{aligned}
  $$

- 代入 $t=0$：

  $$
  \boxed{
  \left.\frac{d^2y}{dx^2}\right|_{t=0}=1
  }.
  $$

##### 算法总结：复合求导先给每一层命名

- 面对多层复合函数，先写清楚

  $$
  x\longmapsto u(x)
  \longmapsto f(u)
  \longmapsto \mathrm e^{f(u)},
  $$

  再沿箭头方向逐层乘上导数。
- 指定点计算时，先求内层变量在该点的值，再代入各层导数。

##### Exercise 16｜沿三层复合结构求指定点处的导数
> 期中考试 · 计算题 5 · 10 分

- **题目**。已知

  $$
  y=\mathrm e^{f\left(\frac{x-1}{x+1}\right)},
  \qquad
  f(x)=\arctan x,
  $$

  求 $y'(0)$。
- **第一步：从头替换符号，只看复合结构**。依次令

  $$
  u=\frac{x-1}{x+1},
  \qquad
  v=f(u),
  \qquad
  y=\mathrm e^v.
  $$

  于是变量之间的依赖关系为

  $$
  x\longmapsto u\longmapsto v\longmapsto y.
  $$

  一般地，把三层复合函数写成

  $$
  u=U(x),
  \qquad
  v=G(u),
  \qquad
  y=H(v),
  \qquad\text{即}\qquad
  y=H\bigl(G(U(x))\bigr),
  $$

  则三层复合的链式法则为

  $$
  \frac{dy}{dx}
  =
  \frac{dy}{dv}
  \frac{dv}{du}
  \frac{du}{dx}
  =
  H'\bigl(G(U(x))\bigr)
  G'\bigl(U(x)\bigr)
  U'(x).
  $$

  对本题而言，这个公式先写成

  $$
  \frac{dy}{dx}
  =
  \mathrm e^v f'(u)u'(x).
  $$

- **第二步：逐层计算三个导数因子**。

  $$
  \frac{dy}{dv}=\mathrm e^v,
  \qquad
  \frac{dv}{du}=f'(u)=\frac1{1+u^2},
  \qquad
  \frac{du}{dx}=\frac2{(x+1)^2}.
  $$

  因而

  $$
  y'
  =
  \mathrm e^{\arctan u}
  \frac1{1+u^2}
  \frac2{(x+1)^2},
  \qquad
  u=\frac{x-1}{x+1}.
  $$

- **第三步：从内层开始代入指定点**。当 $x=0$ 时，

  $$
  u(0)=-1,
  \qquad
  v(0)=f(-1)=\arctan(-1)=-\frac\pi4.
  $$

  三个导数因子在对应位置的值分别为

  $$
  \left.\frac{dy}{dv}\right|_{v=-\pi/4}
  =\mathrm e^{-\pi/4},
  \qquad
  \left.\frac{dv}{du}\right|_{u=-1}
  =\frac12,
  \qquad
  \left.\frac{du}{dx}\right|_{x=0}
  =2.
  $$

  所以

  $$
  \boxed{
  y'(0)
  =
  \mathrm e^{-\pi/4}
  \cdot\frac12\cdot2
  =
  \mathrm e^{-\pi/4}
  }.
  $$

##### 算法总结：一点可导与导函数在该点连续是两件事

- 一点可导只要求该点的差商极限存在。
- 导函数在该点连续还要求

  $$
  \lim_{x\to x_0}f'(x)=f'(x_0).
  $$

- 含有 $\sin(1/x)$、$\cos(1/x)$ 时，先观察前面的系数能否压住振荡；没有趋零因子的振荡项通常会破坏导函数的极限。

##### Exercise 17｜函数可导但导函数不连续
> 期中考试 · 证明题 1 · 7 分

- **题目**。设

  $$
  f(x)=
  \begin{cases}
  x^2\sin\dfrac1x+x,&x\ne0,\\[4pt]
  0,&x=0.
  \end{cases}
  $$

  1. 证明 $f$ 在 $x=0$ 处连续；
  2. 判断 $f$ 在 $x=0$ 处是否可导；若可导，求 $f'(0)$，并讨论 $f'$ 在 $x=0$ 处的连续性。
- **先证连续**。当 $x\ne0$ 时，

  $$
  \left|x^2\sin\frac1x+x\right|
  \le x^2+|x|
  \longrightarrow0.
  $$

  因而

  $$
  \lim_{x\to0}f(x)=0=f(0),
  $$

  所以 $f$ 在 $0$ 处连续。
- **再用定义求 $f'(0)$**：

  $$
  \begin{aligned}
  f'(0)
  &=
  \lim_{h\to0}
  \frac{f(h)-f(0)}h\\
  &=
  \lim_{h\to0}
  \left(
  h\sin\frac1h+1
  \right)\\
  &=1.
  \end{aligned}
  $$

  所以 $f$ 在 $0$ 处可导，且

  $$
  \boxed{f'(0)=1}.
  $$

- **考察导函数的连续性**。当 $x\ne0$ 时，

  $$
  f'(x)
  =
  2x\sin\frac1x
  -\cos\frac1x
  +1.
  $$

  第一项趋于 $0$，但余弦项没有极限。为了把“不存在”写得更明确，取两列趋于 $0$ 的点：

  $$
  x_n=\frac1{2n\pi},
  \qquad
  y_n=\frac1{(2n+1)\pi}.
  $$

  则

  $$
  f'(x_n)=0,
  \qquad
  f'(y_n)=2.
  $$

  因而 $\displaystyle\lim_{x\to0}f'(x)$ 不存在，不可能等于 $f'(0)=1$。所以 $f'$ 在 $0$ 处不连续。

#### T05 · 导数的应用：存在性与唯一性使用不同工具

##### 算法总结：先用介值定理找根，再用导数符号排除第二个根

- “有且仅有一个”要拆成两个任务：
  1. 连续函数在端点异号，用介值定理证明至少有一个根；
  2. 用导数符号证明函数严格单调，从而证明至多有一个根。
- 严格单调的结论仍来自已经学过的拉格朗日中值定理：区间内导数恒正，就能比较任意两点的函数值。

##### Exercise 18｜证明非线性方程在区间内有唯一实根
> 期中考试 · 证明题 2 · 7 分

- **题目**。证明方程

  $$
  x\cdot2^x=1
  $$

  在区间 $(0,1)$ 内有且仅有一个实根。
- 令

  $$
  F(x)=x\cdot2^x-1.
  $$

  $F$ 在 $[0,1]$ 上连续，并且

  $$
  F(0)=-1<0,
  \qquad
  F(1)=1>0.
  $$

  由介值定理，至少存在一点 $\xi\in(0,1)$，使 $F(\xi)=0$。
- **唯一性：由 $F'(x)>0$ 证明严格递增，因此至多有一个根**。对 $x\in(0,1)$，

  $$
  F'(x)
  =
  2^x(1+x\ln2)>0.
  $$

  若 $0<x_1<x_2<1$，由拉格朗日中值定理，存在 $\eta\in(x_1,x_2)$，使

  $$
  F(x_2)-F(x_1)
  =
  F'(\eta)(x_2-x_1)>0.
  $$

  因此 $F$ 在 $(0,1)$ 上严格递增，不可能在两个不同点都取零值。
- 所以方程在 $(0,1)$ 内

  $$
  \boxed{\text{有且仅有一个实根}}.
  $$
