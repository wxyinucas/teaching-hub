# AI Agents

本课程不以系统教授统计理论为目标，而是用量化程序提供一个会产生外部反馈的练习场。学生可以让 Agent 完成实现，但必须能够提出规格、设计证据、判断证据，并为最终产物的安全、合规与适用边界负责。

- `course-design/`：课程定位、16 周蓝图、学生证据契约与平台决策。
- [`template.md`](./template.md)：按 topic 整理 Agent 实验、问题与协作记录的交流模板；需要通过文件沟通时使用，不是周报告，也不要求上传。网站入口放在 W1 卡片，读取课程根目录的同一文件，全学期通用。
- [课程练习仓库](https://github.com/wxyinucas/ai-agents)：发布可独立取得的课堂代码；W2 使用仓库根目录的工作台练习路径、项目环境与本地 Git 状态。W3 沿用学生已 clone 到 `~/course/w02-workbench` 的这份仓库与 Git 历史，更新后进入唯一维护报告材料的 `week-03/`；它是使用自己的 `pyproject.toml`、`uv.lock` 和 `.venv/` 的独立 uv 子项目。W2 工作台代码不作为 W3 报告的实现基线。
- [课程项目仓库](https://github.com/wxyinucas/ai-agents-project)：留作后续持续系统启用；`course/` 保存相应的逐周任务、模板、公开测试与工具，`common/`、`students/sXX/system/` 与 `students/sXX/weeks/` 保持稳定边界。何时建立及如何接续由当周任务明确；两个仓库不是复制材料的流水线。
- `weeks/`：按周冻结 `week.json`、`draft.md`、`runbook.md`、`slides.md` 与 `guide.md`；不再建立职责含混的 `resources/`。

当前以[16 周课程蓝图](./course-design/16-week-blueprint.md)为准：W1～W3 建立工作台与 Agent；W4～W10 每周围绕一个编程核心概念，通过小实验、跨语言对照和较大的自由探索建立基础；W10 以外部接口与真实只读数据接续后半段量化实践，W11～W15 完成一次有两轮对照的量化闭环，W16 核验个人证据。约 30 名学生，其中不少是数学专业研究生；课程仍按无编程基础、无助教设计。原 W4 的 Longbridge 只读授权材料已移至 W10，授课前须按平台现状复测。旧版[蓝图](./course-design/16-week-blueprint-v1.md)仅供追溯。

编程阶段的概念、语言边界和探索任务契约见[W4～W10 专项设计](./course-design/w4-w9-progressive-programming-system.md)。学生需要掌握 Python、了解 R 与 Bash；Rust 和 C 只在特定场景由教师展示，不要求学生安装工具链或本地编译执行。跨语言对照围绕同一概念，比较形式、实际行为、共同结构与设计取舍。教师提供简单可恢复的环境、少量 Agent Prompt 和明确验收条件，学生与 Agent 先写能拒绝错误的测试，再实现或操作、核验证据并解释结果。测试从 W4 贯穿，不再以逐周给同一行情程序增加功能作为固定课表；练习是否接续及持续系统何时启用，由各周任务明确。

`course.json.weekMap` 展示完整 16 周课程地图；地图条目不承担开放状态，也不登记资源。W1～W4 已有台本、Slides 与 Guide；W4 已采用新版课时卡片结构，当前集中打磨以原始记录两次污染为主线的 runbook，现场操作展示为主。现有 W4 Slides 与 Guide 对应上一版，暂不随本轮改台本同步；实验包入口、测试命令与模拟远端仍待落实，尚未课堂冻结。后续备课先敲定台本，再制作所需派生材料。W10 保留了从原 W4 平移的授权材料，尚待按外部接口与数据边界重新编排。其余周次不预先生成空目录。

学生证据随任务阶段递进：W1 是环境状态与命令输出；项目出现后加入可复现命令、测试、diff 与 Git 记录；后续再接入数据契约、平台对账、版本冻结与个人责任核验。每一层只在课程真正需要它时引入。

版本路线保持单一：W3 发布时保留当前 Git 历史，将教师 remote 保留为 `upstream`，个人 remote 设为 `origin`，上传包含 W2 与 W3 的同一仓库；本次不要求 fork、PR 或建立 `students/sXX/system/`。持续系统正式建立后，普通周更新个人 fork 的 `origin/main`，不使用 `dev-week-*` 分支。branch／push 与 merge 可以在设计好的实验仓库中探索，push 使用模拟远端；这些实验不自动改变正式提交路线。旧版 W6、W9、W14 的 PR/tag 周号不沿用；具体汇总节点随各周任务设计确定。
