# 2026 秋季模板

这个目录保存同一学期课程可复用的内容基线。课程可以在自己的 `course-design/` 中声明不同的备课单位和材料职责；学期模板不覆盖课程契约。模板只约束内容结构，颜色、字体、导航和交互统一由网站源码维护。

- `runbook-template.md`：展示当前台本解析格式的三课时基线，不规定所有课程都必须采用同样的备课单位。
- `slides-template.md`：需要 Slides 时使用的静态页面基线，展示常用布局；不是完整能力清单。

台本总览始终只保留“根问题、最低出口、硬收口”三个锚点。课前放行可用一个初始计时基准：

```text
教师块独立试讲时间 × 1.25 + 学生块的 p80 或硬截止 + 转场 ≤ 备课单位可用时间的 80%
```

剩余 20% 用于互动、等待、意外和收口；如果担心内容不足，准备 Plan B，不继续向主线加料。

先按课程契约判断需要哪些材料，再把相应模板复制到 `weeks/week-XX/` 或 `topics/topic-XX-slug/`；不为保持目录整齐而生成空材料，也不在实例中添加自定义 CSS、HTML 或页面组件。

## 网站展示能力的查看入口

备课方法仍以 [`docs/prep-system.md`](../../../docs/prep-system.md) 为准。确定网站支持的布局、内容语法、导航与交互时，先读实际实现；文档与实现不一致时，以解析器、渲染组件和样式共同形成的实际行为为准。仅被解析器识别或移除的标记，不等于已经有对应展示功能。

| 展示能力 | 实现入口 |
| --- | --- |
| 课程、教学周、专题与资源登记 | [`catalog.js`](../../../src/lib/catalog.js)、[`CourseView.vue`](../../../src/views/CourseView.vue) |
| 台本结构、卡片与导航 | [`runbook.js`](../../../src/lib/runbook.js)、[`RunbookReader.vue`](../../../src/components/runbook/RunbookReader.vue)、[`runbook.css`](../../../src/styles/runbook.css) |
| Slides 语法、布局与课次导航 | [`slides.js`](../../../src/lib/slides.js)、[`SlidesReader.vue`](../../../src/components/slides/SlidesReader.vue)、[`SlidesView.vue`](../../../src/views/SlidesView.vue)、[`slides.css`](../../../src/styles/slides.css) |
| Markdown 正文与 Guide 目录 | [`markdown.js`](../../../src/lib/markdown.js)、[`SegmentNotes.vue`](../../../src/components/runbook/SegmentNotes.vue)、[`GuideView.vue`](../../../src/views/GuideView.vue) |
| 交互 Demo | [`DemoView.vue`](../../../src/views/DemoView.vue)、[`demos/`](../../../src/components/demos/)；新增演示需要实现并注册组件 |
| 真题语法与浏览 | [`exams.js`](../../../src/lib/exams.js)、[`ExamsView.vue`](../../../src/views/ExamsView.vue) |

## Slides 布局与标记

单独一行 `---` 分页；代码围栏内的 `---` 不分页。当前 `layout` 支持七种值：

| 布局 | 实际展示 |
| --- | --- |
| `content` | 默认普通内容页，支持正文与页脚；省略 `layout` 时使用此布局 |
| `cover` | 封面，展示标题、副标题与补充正文 |
| `question` | 单一问题，只展示标题与副标题；额外正文不会显示 |
| `columns` | 两栏或三栏并列，可带引导正文与跨栏页脚 |
| `prompt` | 提示词正文与复制按钮，复制原始 Markdown 正文 |
| `agenda` | 议程正文，为有序列表提供大号编号与纵向排布 |
| `tree` | 树状文本页，为代码围栏中的等宽文本提供居中排版；不自动生成树图 |

除 `section` 目录页外，每页须有 `#` 标题；`cover` 与 `question` 的副标题使用首个 `>` 引用行。相关标记如下：

- `<!-- section: 名称 -->`：独占一页，不填正文，可同时带 `lesson` 标记；自动展示全局目录并突出当前位置，目录条目不能点击跳转。它不是 `layout` 的取值。
- `<!-- lesson: 标签 -->`：开始一个课次并生成课次切换栏；启用时第一页也必须标记。翻页限定在当前课次，跨课次通过切换栏完成。
- `<!-- column -->`：划分 `columns` 的两栏或三栏，各栏须有 `##` 标题。
- `<!-- footer -->`：在 `columns`、`content` 或 `tree` 中分出一处页脚。

`columns` 的引导正文写在页标题与第一个 `column` 标记之间，无需 `lead` 标记。`lead` 与 `subsection` 注释当前只被识别并移除，没有独立的展示或导航功能。

`columns` 布局采用统一的动态排版规则：

- 纵向保持标题区位置不变，按页面实际存在的 `lead`、分栏主体和 `footer` 内容组高度，自动把相邻区域之间的剩余距离均分；只有一个主体内容组时，将它放在标题以下的剩余区域中央。
- 横向使用等宽的两栏或三栏网格、平衡的左右留白和固定在列边界上的分隔线；实例页不单独调整列宽、坐标或边距。

## Markdown 与公式

台本展开正文、Guide 正文和 Slides 正文支持 TeX 公式：行内公式写作 `$...$`，独立公式块写作单独成段的 `$$...$$`。需要显示普通美元符号时写 `\$`；行内代码和代码围栏中的内容始终按原文显示，不解析公式。

标题、台本总览的三个锚点、区段标题、摘要和导航字段保持纯文本，不在其中使用 TeX。这些字段承担定位与检索职责，不属于公式正文。
