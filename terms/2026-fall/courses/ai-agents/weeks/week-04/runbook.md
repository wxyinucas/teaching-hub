# W4｜赋值以后，到底改了什么？

> W4 · 3 × 50 min · 约 30 名学生，按零编程基础设计 · 无助教 · 学术模拟配置案例；W3 投针报告独立维护

## 知识地图

- **Road map：导师要求追加实验 → 旧配置意外改变 → 复制后仍然串 → 用测试保住两版方案**
  - 前置：W1～W3 的工作台、Python 环境与 Agent
  - 进入实验台｜Bash → Python 交互模式 → VS Code Notebook
    - 解释器与进程；交互方式相似，使用的语言不同
    - 同一 kernel 的 cell 共享状态；初始化与观察分开
  - 第一次失败｜只改追加实验，旧配置也变了
    - 同一份模拟配置：seed 随机种子 · sample_sizes 样本量列表
    - is 看身份 · == 看值；相等不代表同一对象
    - 整数重新绑定 · 列表内容修改；指明操作落在哪一层
  - 第二次失败｜种子隔离了，样本量仍然共享
    - 先改 seed，再改 sample_sizes；分别观察结果
    - 字典不同 · sample_sizes 相同；沿关系查到共享层
    - before 冒充旧配置；验收也可能一起被污染
    - 按层复制：建立独立字典与列表，再用原来的检查核验
    - R／Bash 短对照；同样的赋值形式，不预设相同语义
  - 自由探索｜先拒绝错误，再兑现承诺
    - 独立预期与快照 → 拒绝两份故障 → 实现 make_variant
    - 后续修改 · 两次调用；核对尚未触发的共享关系
    - 看代码与 diff · 保存实验状态 · 解释证据
  - 接续：W5 容器与迭代，W6 键值对与映射

## 本次课 · 导师让你追加实验，旧方案还在吗？

### 0-50 | 只改追加实验，旧配置为什么也变了？

> 先看代码由哪个进程执行，再在 Notebook 中复现第一次污染，分清对象身份与内容。

**工作版状态：** 新版作业已在本稿中约定，函数壳、故障程序、测试入口、演示 Notebook 与保存步骤尚待落实。现有仓库的 W4 作业及本站 Slides／Guide 仍对应旧版，本轮只整理台本，不标为课堂冻结。

**整周目标与收口**

- 根问题：赋值以后，我究竟改了名字的指向、对象的内容，还是两者都改了？我凭什么判断？
- 本周至少：解释两次污染；与 Agent 写出能拒绝两份故障的测试，核验修复、后续修改与两次调用，并留下自己的判断。
- 教师示范结束即可交接本周实操，不等课时边界、不补满 100 分钟；第三课时以学生操作为主，最后 10 分钟保存状态并回顾。

#### 从 Bash 到 Notebook：代码在哪里执行？

> 启动 Python → 退出重进 → 在 Notebook 查询与修改 → 重跑旧观察 → 重启 kernel。

- [ ] 课前：确认 W2 的 `uv.lock` 有效，终端中能用 `uv run --locked python` 进入与退出 Python。
- [ ] 课前：准备 VS Code 的 Python／Jupyter 扩展、Python 3.12／ipykernel 环境与开场四个 cell，选好实际演示的 kernel；不改 W3 项目或锁文件。

- **从 Bash 启动 Python，查询 probe。** 在 VS Code 的 WSL Terminal 执行：

  ~~~bash
  cd ~/course/w02-workbench
  echo "现在由 Bash 解释输入"
  uv run --locked python
  ~~~

  - `>>>` 出现：终端窗口没换，接收输入的程序从 Bash 换成 Python；二者都在解释各自语言的输入。
  - 在 `>>>` 输入：

    ~~~python
    probe = 42
    print(probe)
    ~~~

  - 输出 `42`：“每一行结束，Python 进程没有结束；下一条输入仍能查询 probe。”
  - “解释型语言通常把源码交给解释器运行，不需要我们先手动编译出独立可执行文件；交互模式让我们一次提交一小段，立即看结果。”
    - 补充：交互式是使用方式；解释型不等于内部完全不编译，CPython 也会编译成字节码。

- **退出 Python，重新进入，再查 probe。**
  - 在 Python 输入 `exit()`，回到 Bash；执行 `uv run --locked python`。
  - 在新的 `>>>` 输入 `print(probe)` → `NameError`。
  - “刚才那个进程结束了，新进程没有保留它的普通名字。”输入 `exit()` 回 Bash。

- **打开准备好的 Notebook，顺序运行四个 cell。**
  - 新建备用入口：命令面板运行 `Create: New Jupyter Notebook`。
  - 指认代码 cell、下方输出与右上角已选好的 kernel。
  - “Notebook 是界面，kernel 是执行代码、保留变量的进程；它与刚才终端中的 Python 分开。”
  - 初始化 cell：`probe = 42`。
  - 第一次观察 cell：`print(probe)` → `42`。
  - 修改 cell：`probe = 2026`。
  - 再次观察 cell：`print(probe)` → `2026`。
  - 指着前后两个输出问：“同一个名字，为什么前面仍显示 42？”

- **只重跑“第一次观察”cell。**
  - `print(probe)` → `2026`。
  - “cell 共用同一个 kernel 的状态。前面的 42 是旧输出；修改变量不会自动刷新它，编辑代码也不会自动执行。”

- **重启 kernel，只运行观察 cell，再恢复这组实验。**
  - [ ] 课前：亲自核对旧输出不刷新、重跑观察得 `2026`、重启后查询得 `NameError`；保存真实输出备用。
  - 重启后运行 `print(probe)` → `NameError`。
  - “清空输出只清显示；重启 kernel 才重置运行状态。”
  - 从上至下重跑开场四个 cell → 两次观察分别得到 `42`、`2026`。
  - 后续每个独立实验各用一组 cell：初始化 → 修改 → 观察；只在新实验开始时恢复输入，不在观察前重新初始化。
  - 代码与输出仍在 VS Code；需要导读时，可选中代码让现有 Agent 解释。

    ~~~text
    我正在 VS Code 的 Python Notebook 中逐步做实验。
    请阅读我当前的代码，每次只解释我选中的一段；先问我预期结果，再结合我实际运行的输出解释。
    不修改代码、不替我执行。若看不到 kernel 当前状态，告诉我应该在观察 cell 中查询什么，不要猜。
    ~~~

- **转场：** 实验台已经能分段执行、保留状态。现在导师要求两版方案同时存在：起一个新名字，真的能得到另一份吗？

#### 导师要追加实验，旧配置却变了

> 导师要求保留旧方案 → 起一个新名字 → 修改追加方案 → 旧配置也变了。

- [ ] 课前：准备本段的初始化、起新名字、修改和观察 cell；代码、输出与关系图能同时看到，保留旧配置被污染的真实输出。

- **提出导师的要求，建立昨天的配置。** 在本组初始化 cell 中执行：

  - “昨天用 seed=42，投针 1000、10000、100000 次，已经做出了论文里的图。导师要求：保留旧版，再换种子、把最大投针数提高到 500000；下午一起看两版。”

  ~~~python
  source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  ~~~

  - source 是旧方案；seed 是随机种子，sample_sizes 是三组投针数。
  - 本段只修改配置，不重跑模拟或改 W3 的 CSV／PDF；旧版保留，不挑一个更漂亮的种子覆盖它。

- **起名 variant，先看两行相同的输出。** 在下一 cell 执行：

  ~~~python
  variant = source
  print("旧实验：", source)
  print("追加实验：", variant)
  ~~~

  - 问：“这行像是在准备一份新方案。只改 variant，旧 seed 和旧投针数会保持吗？”

- **修改 variant，再运行观察 cell。**

  ~~~python
  variant["seed"] = 2026
  variant["sample_sizes"][2] = 500000
  ~~~

  - 方括号先找字段，再找位置；位置 2 是第三项。
  - 接着运行观察，不重新初始化 source：

    ~~~python
    print("旧实验：", source)
    print("追加实验：", variant)
    ~~~

  - 两行都是 `{"seed": 2026, "sample_sizes": [1000, 10000, 500000]}`。
  - “代码执行成功，旧方案却丢了。是两份配置一起变了，还是一直只有一份？”

- **转场：** 先不修程序，找一条能区分这两种解释的证据。

#### 内容相等，是不是同一对象？

> 再建一份相等配置 → 分别比较值与身份 → 按结果画出关系。

- **保留刚才的 source／variant，另建 same_content。** 接着上一组观察 cell 执行：

  ~~~python
  same_content = {"seed": 2026, "sample_sizes": [1000, 10000, 500000]}
  print(source == variant, source is variant)
  print(source == same_content, source is same_content)
  ~~~

  - 第一行 `True True`；第二行 `True False`。
  - “`==` 问内容是否相等；`is` 问是不是同一个对象。相等的内容可以放在不同对象里。”

- **按身份结果画图，指认两个名字与两个字典。**

  ~~~text
  source ──┐
           ├→ 字典 A：seed 为 2026，sample_sizes 为 [1000, 10000, 500000]
  variant ─┘

  same_content → 字典 B：seed 为 2026，sample_sizes 为 [1000, 10000, 500000]
  ~~~

  - source／variant 指向 A；same_content 指向 B。A、B 只是对象编号，不是内存地址。
  - “`variant = source` 增加了一个名字，没有复制字典。”
  - 问：“两个名字指向同一个对象，以后一定一起变吗？”

#### 数字没跟着变：名字重新绑定

> 两个名字指向 42 → 把 seed 改为 2026 → old_seed 仍是 42。

- **在新的实验组中，把问题缩成一个种子。**

  ~~~python
  seed = 42
  old_seed = seed
  print(seed is old_seed)
  ~~~

  - `True`：此刻指向同一整数。问：“把 seed 改为 2026，old_seed 会不会也变？”

- **重新赋值，再查询两个名字。**

  ~~~python
  seed = 2026
  print(seed, old_seed, seed is old_seed)
  ~~~

  - `2026 42 False`：old_seed 留在旧值，seed 改了绑定。

- **在关系图上只移动 seed 的箭头。**

  ~~~text
  before:
  seed     --+
             +-> integer 42
  old_seed --+

  after:
  seed     ----> integer 2026
  old_seed ----> integer 42
  ~~~

  - “旧整数没被改写，也不是赋值自动复制了整数；seed 换了指向。”
  - 问：“换成样本量列表，改第三项，另一个名字会看到什么？”

#### 列表跟着变：对象内容被修改

> 两个名字指向同一列表 → 改第三项 → 列表一起变，旧整数没变。

- **在新的实验组中建立列表，留下第三项的旧引用。**

  ~~~python
  l = [1000, 10000, 100000]
  other = l
  saved_item = l[2]
  print(l is other)
  ~~~

  - `True`。问：“导师只改最大投针数；other 与 saved_item 各会看到什么？”

- **改第三项，分别查询列表与旧整数。**

  ~~~python
  l[2] = 500000
  print(l, other, l is other)
  print(saved_item, l[2], saved_item is l[2])
  ~~~

  - 第一行 `[1000, 10000, 500000] [1000, 10000, 500000] True`：两个名字仍看到同一列表。
  - 第二行 `100000 500000 False`：旧整数没变，第三项关联到了新整数。

- **保留 l／other 的箭头，只更新列表第三项。**
  - saved_item 仍指向 100000。
  - “这次改的是列表内容，不是 l 的绑定；列表里的旧整数也没被原地改写。”

#### 回到旧配置：这次改了哪一层？

> 回看最初三行代码 → 沿关系图指出改变的位置 → 提出复制方案。

- **打开最初的赋值与修改代码，不重新运行。** 沿关系图逐行指认：
  - `variant = source`：增加名字绑定，字典未复制。
  - `variant["seed"] = 2026`：替换共享字典中 seed 的值关联。
  - `variant["sample_sizes"][2] = 500000`：找到共享列表，替换第三项的关联。
- **从 source／variant 各走一次到字典和列表。**
  - “两个名字都能找到被修改的内容。保留旧方案，不能只给它起一个新名字。”
- **提出下一次尝试。**
  - 问：“明确复制字典，让 source is variant 变成 False，旧方案就安全了吗？”

### 50-100 | 复制以后，为什么仍会污染旧实验？

> 查清复制到哪一层，并用独立基准检查原始内容是否保持。

#### 复制以后，先分别改两项

> 复制字典 → 改 seed，旧值保持 → 改第三项，旧样本量仍被污染。

- [ ] 课前：把改 seed 与改 sample_sizes 分开执行，保存“旧 seed 保持、旧样本量被污染”的真实输出。

- **打开新实验组，复制字典，先比较身份。**

  - “这次明确调用 copy；导师要求的两项修改，都会只影响新方案吗？”

  ~~~python
  source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  variant = source.copy()
  print(source is variant)
  ~~~

  - `False`：外层字典确实不同。

- **只改 seed，打印两份配置。**

  ~~~python
  variant["seed"] = 2026
  print("旧实验：", source)
  print("追加实验：", variant)
  ~~~

  - 旧 seed 为 `42`，新 seed 为 `2026`；两份样本量都没变。
  - 问：“第一项隔离了，第三个投针数呢？”

- **接着改 sample_sizes 第三项，再打印一次。**

  ~~~python
  variant["sample_sizes"][2] = 500000
  print("旧实验：", source)
  print("追加实验：", variant)
  ~~~

  - 两份 sample_sizes 都是 `[1000, 10000, 500000]`；seed 仍各自保持。
  - “外层已经不同，里面仍有什么关系没有断开？”

#### 沿关系再查一层

> 查询字典身份 → 查询列表身份 → 在图上找出共享层。

- **保留刚才的两份配置，分别比较字典与列表。**

  ~~~python
  print(source is variant)
  print(source["sample_sizes"] is variant["sample_sizes"])
  ~~~

  - `False`、`True`：字典不同，sample_sizes 仍是同一列表。

- **画两个字典，共同指向一个列表。**

  ~~~text
  source  -> A (seed=42)   -> sample_sizes --+
                                           +-> L: [1000, 10000, 500000]
  variant -> B (seed=2026) -> sample_sizes --+
  ~~~

  - 沿 variant 指到 B 的 seed：修改只落在 B。
  - 再沿 variant 指到 L 的第三项：source 也能到达这个位置。
  - “浅复制新建了外层，保留了里面的关系；外层独立，不代表内层独立。”

- **画一个新列表，预测两条路径的结果。**
  - 问：“把 variant 改为指向新列表，再改第三项，source 还会看到变化吗？”

#### “旧配置没变”的检查也可能被骗

> 保存 before → 污染后检查竟为 True → 换独立基准，错误才被发现。

- [ ] 课前：三次检查各自使用干净输入；保留直接引用、浅复制快照与独立基准的实际输出作为备用。

- **打开“直接引用快照”实验组，运行比较。**

  - “导师追问：怎么证明旧配置没动？修改前存 before，事后比较，会可靠吗？”

  ~~~python
  source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  before = source
  variant = source
  variant["sample_sizes"][2] = 500000
  print(source == before)
  print(source)
  ~~~

  - `True`，但 sample_sizes 已是 `[1000, 10000, 500000]`。
  - 把 before 也画到同一字典：“它是另一个入口，不是一张保存旧内容的照片。”

- **切到“浅复制快照”实验组，用新的输入再试。**

  ~~~python
  source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  before = source.copy()
  variant = source
  variant["sample_sizes"][2] = 500000
  print(source == before, source["sample_sizes"] is before["sample_sizes"])
  ~~~

  - `True True`：字典不同，样本量列表仍共享，检查又漏掉污染。

- **切到“独立基准”实验组，先写下原始内容再修改。**

  ~~~python
  source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  expected_source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  variant = source
  variant["sample_sizes"][2] = 500000
  print(source == expected_source)
  ~~~

  - `False`：“证据没有跟着被测对象改变，这次才发现了污染。”
  - 已知输入可独立写出预期；本题普通对象也可用 `copy.deepcopy` 保存内容快照，必须覆盖会被修改的列表。
  - 问：“测试也能写错。预期答案从候选程序自己的输出取得，能独立验收它吗？”

- **转场：** 程序可能共享错误，验收也可能共享同一种错误。接下来把“独立”写成明确的承诺。

#### 怎样让两版配置真正独立？

> 新字典配新列表 → 修改追加方案 → 核对内容与两层身份。

- **沿刚才的新列表关系图，运行按层复制的实验组。**

  ~~~python
  source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  variant = source.copy()
  variant["sample_sizes"] = source["sample_sizes"].copy()

  variant["seed"] = 2026
  variant["sample_sizes"][2] = 500000
  print(source)
  print(variant)
  print(source is variant, source["sample_sizes"] is variant["sample_sizes"])
  ~~~

  - 旧配置：seed=42，样本量 1000、10000、100000；新配置：seed=2026，样本量 1000、10000、500000。
  - 身份是 `False False`：两个字典、两个列表。

- **选中两行 copy，再指回关系图。**

  - 字典 copy 建立新外层；列表 copy 建立新 sample_sizes。
  - 替换 variant 的列表关联，再修改第三项；source 仍指向原列表。
  - “复制哪些层，要看哪些内容需要独立修改。这里列表里是不可变整数，复制到列表这一层足够。”
  - 本题也可用 `copy.deepcopy(source)`；更深结构仍需按要求核验，不把 copy 当作全自动隔离。

- **转场：** Python 给了我们检查身份和复制对象的工具，但不会替我们决定哪些关系应该共享。换一种语言，同样的赋值外观是否承诺同样的事？

#### 换一种语言，赋值的行为相同吗？

> Python 列表的预测 → R 普通向量的结果 → Bash 文本赋值的结果。

- **切到 R 终端，先预测，再运行普通向量赋值。**

  - [ ] 课前：准备可用的 R 终端及本段实际输出；无需在 Python Notebook 中切换 kernel。

  ~~~r
  a <- c(1000, 10000, 100000)
  b <- a
  b[3] <- 500000
  print(a)
  print(b)
  ~~~

  - a 保持 1000、10000、100000；b 变为 1000、10000、500000，可能用科学计数法显示。
  - “相近的赋值写法，不保证相同的修改行为。普通 R 向量呈现修改时复制的值语义；不代表赋值时就完整复制内存。”
  - 顺手指认：R 第三项写 `b[3]`，Python 写 `l[2]`；R 的 `identical` 不是 Python `is` 的替代。

- **切回 Bash 终端，运行普通文本赋值。**

  - [ ] 课前：在 Bash 中核对输出为 `2026 42`，留下实际记录。

  ~~~bash
  a=42
  b="$a"
  a=2026
  printf '%s %s\n' "$a" "$b"
  ~~~

  - `2026 42`：“b 收到的是当时展开的文本；这里不是整数计算，也没有共享可变列表。”

- **回到 Python 的关系图，对照三种行为。**
  - Python 列表允许多处看到同一次修改；独立方案需要额外隔离。
  - R 普通向量的复制由实现管理，另一绑定观察到的值保持；Bash 本例赋的是文本。
  - 问：“熟悉一种语言，能否直接担保另一种语言里这行代码的结果？”

#### 本周实操：保留旧方案，生成追加实验

> 读懂约定 → 与 Agent 先写测试 → 拒绝两种故障 → 实现与导读。

- [ ] 课前：落实学生实验目录、已知输入、make_variant 函数壳与测试入口；把实际路径和运行命令补到本段，不改 W3 项目。

- **给出本周任务：让导师反复生成追加方案，旧配置一直保留。**
  - 必做：实现配置生成函数、与 Agent 写测试、核验两种故障与修复，再说明一个依据。
  - 沿用投针实验的参数，不重写投针算法、不改 W3 的报告；本周验收的是配置隔离，不是估计值更接近 π。

- **打开函数壳与任务说明，读输入输出。**

  ~~~text
  make_variant(source, seed, index, replacement)

  source：含 seed 与 sample_sizes 的普通字典，sample_sizes 是正整数样本量列表。
  其余三个参数：新 seed、sample_sizes 中要改的位置、新的正整数样本量。
  本题输入结构、数值与 index 都合法。
  返回：修改后的独立方案。
  ~~~

  - “参数是输入，返回值是我们要检查的结果。实现路径可以不同，入口与承诺固定。”

- **出示一个已知输入，让学生先写预期。**

  ~~~text
  原始：{"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  参数：seed=2026，index=2，replacement=500000
  结果：{"seed": 2026, "sample_sizes": [1000, 10000, 500000]}
  旧配置：仍是 {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  ~~~

- **逐条对应五项验收，不指定代码写法。**

  - 更新指定参数与位置，其他内容保留；对照独立预期。
  - source 保持原始内容；对照调用前的独立快照。
  - 结果字典与 source 不同，结果的 sample_sizes 与原 sample_sizes 不同；分别用 is 检查。
  - 再修改结果，不影响 source。
  - 调用两次产生两份结果，修改其中一份不影响另一份。

- **交接学生与 Agent，先只写测试。**

  ~~~text
  请先读实验说明和 make_variant 函数壳，与我一起写测试，暂不修改实现。
  先检查给定输入的结果、原始内容、外层身份和 sample_sizes 身份。
  解释预期答案从哪里来；保存原始内容时，不要留下共享的可变数据。
  分别运行教师的直接共享、浅复制两份故障，指出哪项断言拒绝了它们。
  给我实际输出，等我检查后再实现。
  ~~~

  - 每人先留下一个预测，再开始 Agent 对话；测试的预期不能由候选程序自己的输出充当。
  - 示范到这里即可开始做，不等第二课时结束。先做一次调用，再增加后续修改与两次调用；后面的第三课时段落供实操检查与诊断，不再整段重复示范。

### 100-150 | 与 Agent 完成本周实操，验收两版实验

> 学生继续测试与实现 → 检查后续修改 → 导读依据 → 保存与回顾。

#### 先让测试拒绝两种已知错误

> 核对输入与答案 → 对同一份测试切换故障 → 找出实际失败的断言。

- [ ] 课前：备好可分别运行的直接共享、浅复制两份故障及参考实现；同一组测试拒绝两份故障、接受参考实现，每次重新建立输入，保留实际输出。

- **打开一次调用的测试，先核对独立答案。** 从实验包加载候选 make_variant 后，检查这些断言：

  ~~~python
  source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  expected_source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  expected_result = {"seed": 2026, "sample_sizes": [1000, 10000, 500000]}

  result = make_variant(source, 2026, 2, 500000)

  assert result == expected_result
  assert source == expected_source
  assert result is not source
  assert result["sample_sizes"] is not source["sample_sizes"]
  ~~~

  - 前两条比较值，后两条比较身份；预期记录各自建立。
  - 问：“为什么这两个预期正确？为什么不写 expected_source = source？”

- **用同一组测试分别运行直接共享、浅复制故障。** 每份重新建立输入。

  - 直接共享：结果可能正确，旧配置已变，字典和列表也不独立。
  - 浅复制：字典独立，旧样本量已变，列表仍共享。
  - 只打开一条真实失败：输入 → 预期 → 实际 → 失败断言。一次运行可能只报告最先失败的断言。
  - 导入或环境报错：保留输出求助；尚未执行断言，不算测试已经拒绝了共享故障。

- **把真实输出交给 Agent，只定位这一处。**

  ~~~text
  这是刚才的真实测试输出：……
  先对照任务说明，指出输入、预期值、实际值和失败断言。
  再找到候选实现对应的位置，解释共享发生在哪一层。
  不要修改测试或实现，每次只解释这一处，等我确认。
  ~~~

  - 学生在实际文件找到同一位置，确认它与失败断言的关系，再进入实现。

#### 根据同一份测试实现修复

> 委托实现 → 本人重跑 → 看实现与 diff，确认修的是程序。

- **保留刚才的测试，委托 Agent 实现。**

  ~~~text
  根据刚才核验过的测试，实现 make_variant。
  可以按层级复制、重建容器，或对本题普通对象使用 deepcopy。
  不要修改测试的预期值；运行同一份测试，给我实际改动与结果。
  指出哪里建立了独立关系，哪里修改指定内容；等我核对后再继续。
  ~~~

- **在学生自己的 Terminal 重跑测试。**
  - 使用本周实验包已核验的入口，看实际输出，再对照 Agent 工具记录。
  - 仍失败：回到具体断言修实现；通过后继续检查文件。

- **打开实现和 diff，定位独立关系与指定修改。**
  - 核对 source 与 result 的内容、字典身份和列表身份。
  - 看失败断言仍在，预期仍是原来的工作要求。
  - “按层复制、重建容器或 deepcopy 都可以；不按出现了哪个关键词评分，也不要求不可变整数有不同身份。”

#### 通过一次以后，再修改一次

> 再改返回结果 → 生成两份候选 → 改其中一份，核对另外两份。

- [ ] 课前：用参考实现核对本段的后续修改、两次调用；再准备另一组合法输入，避免只验收写死的示例。

- **追加导师的要求，在新实验组中修改返回结果。**
  - “下午导师又说：最小样本量也改一下，基线仍要保留。首次返回正确，能保证后续不串吗？”

  ~~~python
  source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  expected_source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  result = make_variant(source, 2026, 2, 500000)

  result["seed"] = 2027
  result["sample_sizes"][0] = 2000
  assert source == expected_source
  ~~~

  - 断言通过：source 仍是基线。学生把这个后续操作加入自己的测试。

- **再开一组实验，连续生成两份候选，只改 first。**

  ~~~python
  source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  expected_source = {"seed": 42, "sample_sizes": [1000, 10000, 100000]}
  first = make_variant(source, 2026, 2, 500000)
  second = make_variant(source, 2027, 0, 2000)

  assert first is not second
  assert first["sample_sizes"] is not second["sample_sizes"]

  first["seed"] = 2028
  first["sample_sizes"][1] = 250000
  assert second == {"seed": 2027, "sample_sizes": [2000, 10000, 100000]}
  assert source == expected_source
  ~~~

  - 断言通过：second 保留自己的结果，source 保留基线。把两次调用的检查也加入测试。

- **换一组合法输入，先写答案，再核验。**
  - 仍按同一接口，不增加新功能；确认实现没有把课堂示例写死。
  - 提前完成者选自己的 seed、样本量与修改位置：与 Agent 增加一项测试，用两份故障核对它能发现什么，再追到修复位置。

#### 带着证据看代码

> 选一项验收承诺 → 让 Agent 指路 → 在源码与测试中核对 → 留下自己的解释。

- [ ] 课前：在参考实现中定位独立字典、独立 sample_sizes 和指定修改的位置，打开对应测试与实际 diff。

- **选“旧配置保持”这项承诺，让 Agent 指路。**

  ~~~text
  只读我的 make_variant 和相关测试。
  指出建立独立字典、建立独立 sample_sizes、更新 seed 和 sample_sizes[index] 的位置。
  结合一次调用解释 source 与返回结果的关系；每次只看相关几行，等我确认。
  再指出一项这些测试尚不能证明的性质，不修改代码。
  ~~~

- **打开 Agent 指出的几行，再打开对应断言。**

  - 指出哪层不再共享，后续修改会沿哪条路径到达哪个对象。
  - “用了 deepcopy”还不够；结合实际文件说出它在本题兑现了什么。
  - 再说一项没有证明的事：这份配置测试不证明投针估计一定更准确。

- **在自己的记录里留下四行，完成本周实操证据。**

  - 开场预测。
  - 一次被证据推翻的解释。
  - 最终哪一层关系改变，哪份内容保持。
  - 实际运行证据与尚未完成的条件；借教师记录者写明来源。

#### 保存状态与本次课回顾

> 保存真实进度 → 核对文件与历史 → 回答名字、对象与独立基准三个问题。

- **最后 10 分钟，保存当前版本与实际结果。**

  - 当前已通过：保存实现、测试与实际结果。
  - 仍有失败：保存候选版本、失败输出和未完成条件，不写“已经完成”。
  - 使用教师记录：说明自己核对了哪一段，自己的项目仍停在哪一步。

- **核对实验仓库，再按实验包步骤保存。**

  - [ ] 课前：准备实验分支、恢复副本与已核验的保存步骤；若启用模拟 push，另行准备模拟远端，不修改正式 remote。

  ~~~bash
  git rev-parse --show-toplevel
  git branch --show-current
  git status -sb
  git diff
  ~~~

  - 核对实验路径和分支，查看 diff，新文件打开看完整内容；再按实验包步骤保存实现、测试与简短证据。
  - 模拟 push 仅在课前已准备、主线已完成时追加：核对本地与模拟远端是否同一版本，不改正式 remote 或 W3 历史。

- **回到根问题，只问三件事。**

  - 直接赋值后改 variant：改了名字指向、对象内容，还是两者？指明哪一层。
  - 浅复制后为何只有 sample_sizes 污染旧配置？哪条身份检查提供证据？
  - 为何 before = source 不能证明原始内容保持？独立基准怎样拒绝错误？

  - “导师要的是追加一组实验，不是让旧方案悄悄变成新方案。看清修改落在哪一层，再用独立证据验收。”
  - 配置隔离不等于实验结论可靠：估计值是否稳定仍需真实模拟；同时换 seed 与样本量，也不能把结果差异单独归因于其中一个因素。

#### 主线完成后的备用反例

> 按剩余时间选一个实验，不要求全做，也不挤占本周实操。

- **字符串能原地改字符吗？** 先预测，单独运行失败例：

  - [ ] 课前：若选这个反例，核对 TypeError 与后续 `cut cat False` 的实际输出。

  ~~~python
  s = "cat"
  s[1] = "u"
  ~~~

  - 看：TypeError。从干净状态换成返回新文本的操作：

  ~~~python
  s = "cat"
  old = s
  s = s.replace("a", "u")
  print(s, old, s is old)
  ~~~

  - 看：`cut cat False`；原字符串未改写，s 绑定到新结果。回到整数反例。

- **a 的结果相同，对 b 的影响相同吗？**

  - 在两组独立 cell 中，先预测再分别运行：

    ~~~python
    a = [1, 2]
    b = a
    a += [3]
    print(a, b, a is b)
    ~~~

    ~~~python
    a = [1, 2]
    b = a
    a = a + [3]
    print(a, b, a is b)
    ~~~

  - 第一组 `[1, 2, 3] [1, 2, 3] True`；第二组 `[1, 2, 3] [1, 2] False`。
  - 前者扩展原列表；后者新建列表并重新绑定 a。
  - 问：“出现赋值语法，是否就能断定绑定一定改变？”

- **可以先改内容，再改绑定吗？**

  - 在新的实验组中运行：

    ~~~python
    a = [1, 2]
    b = a
    a[0] = 9
    a = a + [3]
    print(a, b, a is b)
    ~~~

  - `[9, 2, 3] [9, 2] False`：b 留在已改内容的旧列表，a 指向新列表。画出两步关系。

- **变量地址和对象身份，是同一观察层吗？**

  - [ ] 课前：若展示 C，备好已编译的小例子及源码、产物、运行结果；学生不安装 Rust／C 工具链。
  - 保留旧引用后比较 `id(source)`：同一对象的内容可以改变，身份保持。
  - Python 的名字绑定对象；CPython 的 id 对应对象地址，不是名字 source 自己的固定地址。
  - 教师用已核验的 C 普通 int 示例，对照 `x += 1` 更新同一变量存储位置；只展示“源码 → 编译产物 → 运行”，学生不安装工具链。
  - 不研究缓存、驻留与地址复用；身份比较期间保留旧对象引用。

- **教师核验依据**

  - [Python 交互解释器](https://docs.python.org/3.12/tutorial/interpreter.html)
  - [Python 对解释型与交互式的说明](https://docs.python.org/3.12/glossary.html#term-interpreted)
  - [VS Code 的 Jupyter Notebook](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)
  - [Jupyter kernel 与运行状态](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Running%20Code.html#managing-the-kernel)
  - [Python 对象、身份、类型与可变性](https://docs.python.org/3.12/reference/datamodel.html#objects-values-and-types)
  - [Python 赋值与增量赋值](https://docs.python.org/3.12/reference/simple_stmts.html#augmented-assignment-statements)
  - [Python id 与生命周期](https://docs.python.org/3.12/library/functions.html#id)
  - [Python 浅复制与深复制](https://docs.python.org/3.12/library/copy.html)
  - [R 共享赋值与修改时复制](https://cran.r-project.org/doc/manuals/r-release/R-ints.html#Rest-of-header)
  - [Bash 变量赋值与展开](https://www.gnu.org/s/bash/manual/bash.html#Shell-Parameters)

## 临场取舍

- 慢了：保留两次污染、整数反例、is／==、独立基准与学生测试；用 R／Bash 的课前真实输出完成短对照，不展开复制 API 或地址细节。
- 示范提前结束：直接交接本周实操；已完成者选新输入增加测试与导读，教师可从备用反例选一个，不补满固定讲授时长。
- 坏了：展示课前真实输出与关系图，继续预测和判读，并说明证据来源。未可靠的实验入口不标为已完成。
- 实验未通过：保留真实失败，按最后一个可运行节点继续；不改 W3、既有历史或正式 remote。
- Notebook 受阻：用已跑通的 Python 交互模式按同一顺序展示代码与输出；课后再借助 Agent 定位 Notebook 环境，不让配置问题吞掉本周主线。
