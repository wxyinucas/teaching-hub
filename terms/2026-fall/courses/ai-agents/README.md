# AI Agents

本课程不以系统教授统计理论为目标，而是用量化程序提供一个会产生外部反馈的练习场。学生可以让 Agent 完成实现，但必须能够提出规格、设计证据、判断证据，并为最终产物的安全、合规与适用边界负责。

- `course-design/`：课程定位、16 周蓝图、学生证据契约与平台决策。
- [课程练习仓库](https://github.com/wxyinucas/ai-agents)：发布可独立取得的课堂代码；W2 在 `warmups/week-02/course-check/` 中练习路径、项目环境与本地 Git 状态，不作为后续项目基础。
- [正式项目仓库](https://github.com/wxyinucas/ai-agents-project)：W3 从自然语言契约与公开测试起步。`course/` 保存教师任务，`common/` 保存公共能力，`students/sXX/system/` 是每名学生唯一持续演化的系统，`students/sXX/weeks/` 只追加周记录。
- `weeks/`：按周冻结 `week.json`、`draft.md`、`runbook.md`、`slides.md` 与 `guide.md`；不再建立职责含混的 `resources/`。

当前以[16 周课程蓝图](./course-design/16-week-blueprint.md)为准：W1～W3 建立工作台与 Agent，W4～W9 进行编程入门，W10～W15 完成一次量化实践闭环，W16 核验个人证据。约 30 名学生，其中不少是数学专业研究生；课程仍按无编程基础、无助教设计。原 W4 的 Longbridge 只读授权材料已移至 W10，授课前须按平台现状复测。旧版[蓝图](./course-design/16-week-blueprint-v1.md)仅供追溯。

`course.json.weekMap` 展示完整 16 周课程地图；地图条目不承担开放状态，也不登记资源。W1～W4 已有台本、Slides 与 Guide；W4 仍待教师按实际课堂节奏继续迭代。W10 保留了从原 W4 平移的授权材料。其余周次不预先生成空目录。

学生证据随任务阶段递进：W1 是环境状态与命令输出；项目出现后加入可复现命令、测试、diff 与 Git 记录；后续再接入数据契约、平台对账、版本冻结与个人责任核验。每一层只在课程真正需要它时引入。

版本路线保持单一：普通周只更新个人 fork 的 `origin/main`，不使用 `dev-week-*` 分支。旧版 W6、W9、W14 的 PR/tag 周号不沿用；具体汇总节点随各周任务设计确定。
