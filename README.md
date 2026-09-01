# Teaching Hub

一个按“学期 → 课程 → 教学周”组织的公开备课网站。当前汇集两类核心材料：

- **Runbook（台本）**：主要用于课前规划与放行，课中按需展开教师提示。
- **Slides（课件）**：静态课堂舞台；一次只显示一页，只负责必须共同观看的内容。

首个学期为 `2026-fall`，当前课程包括 AI Agents 与高等数学（上）。AI Agents 已迁移 W1，高等数学暂时只建立课程入口。

## 内容目录

```text
terms/
└── 2026-fall/
    ├── term.json
    ├── templates/
    │   ├── runbook-template.md
    │   └── slides-template.md
    └── courses/
        ├── ai-agents/
        │   ├── course.json
        │   ├── course-design/
        │   └── weeks/week-01/
        │       ├── week.json
        │       ├── runbook.md
        │       ├── slides.md
        │       └── resources/
        └── calculus-i/
            ├── course.json
            └── weeks/
```

同一学期的模板集中维护；课程内容按周组成严格的备课与放行单位。50 分钟课时只存在于台本和课件内部，不继续增加目录层级。

`term.json`、`course.json` 与 `week.json` 会被网站自动发现；新增课程或教学周不需要修改 Vue 路由。`week.json` 只登记已经存在的资源，不预填未来周次。

## 本地运行

需要 Node.js 22 或兼容版本：

```bash
npm ci
npm run dev
```

自动检查与生产构建：

```bash
npm run check
```

网站使用 Hash 路由，适合 GitHub Pages 的静态托管。推送到 `main` 后，GitHub Actions 会先执行测试与构建，再发布 `dist/`。

## 内容契约

台本复制 [`terms/2026-fall/templates/runbook-template.md`](terms/2026-fall/templates/runbook-template.md) 填写。二级标题划分课时，三级标题划分推进段；总览保留根问题、最低出口与硬收口，展开区域再写讲述提示、演示步骤、链接和 Plan B。

课件复制 [`terms/2026-fall/templates/slides-template.md`](terms/2026-fall/templates/slides-template.md) 填写。单独一行 `---` 分页；默认是普通内容页，显式布局只有：

- `cover`：封面；
- `question`：全班面对的单一问题；
- `columns`：两栏或三栏并列；
- `prompt`：可直接复制给 Chatbox 的完整提示词。

`<!-- section: ... -->` 自动生成全局目录页；`<!-- column -->` 分栏；`<!-- footer -->` 写跨栏落点。首版不支持动画、逐项出现、讲者备注、自定义 HTML 或页面级 CSS。

## 公开边界

本仓库只包含可公开的教学内容与网站源码。行政申请表、历史稿、旧 PDF/Beamer 工具链、生成文件、字体文件、缓存和依赖目录均保留在本地旧档案，不进入本仓库。
