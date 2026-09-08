# W3 Draft

> 教师临时收件箱。这里的内容尚未进入本周教学合同；正式依据以 `runbook.md`、`slides.md` 与 `guide.md` 为准。

## 开课前还要真机试跑

- 用一台干净 Windows + WSL 机器，独立跑完“fork → HTTPS clone → `init-student.sh s07` → 根目录 `code .` → Cline 登录 → 只在个人 `system/` 生成 → 从 `system/` 调用教师测试 → 审查 → 填报告 → commit → 浏览器授权 push”，记录实际 p80 时间。
- 分别真机验证初始化脚本的三条分支：合法代号输出 `STUDENT_INIT=PASS`；目录已存在时退出 1 且不覆盖；代号不是 `sNN` 时退出 2。
- 开课前 48 小时重新打开 Cline 官方页，确认当时可用的 FREE 入口、登录按钮和 WSL 扩展行为；不把某一模型名写进冻结资料。
- 准备一份不含账号、密钥或个人信息的教师会话录屏，供 `BLOCKED-AGENT` 学生继续审查链。

## 第三课时后才执行

- 展示和 `ACCEPT/HOLD` 判断全部结束后，再把本地 `teacher/w3-reference` 参考分支发布到课程仓库。
- 发布前从参考实现的个人 `system/` 重跑 `uv sync --locked`、`uv run --locked pytest -q ../../../course/week-03/tests` 和正反例，并确认它没有改动 `course/**`、`common/**`、根保护文件、报告或其他学生目录。
- 补一份“保留首次尝试、无覆盖取得恢复基线”的简短步骤，只在参考分支真正发布后填入确切命令。
- W6 前补上第一次里程碑 PR 的学生操作页：只把本人 `students/sXX/**` PR 到教师 `upstream/main`；合入后由教师创建 `checkpoint-w06` tag，不引入 `dev-week-*` 分支。

<!--
自由记录尚未归位的想法、链接、案例和课堂观察。

整理时只做三种去向：
- 影响教师判断与取舍 → runbook.md
- 必须让全班共同观看 → slides.md
- 学生需要独立照做或核验 → guide.md

公开仓库中不要写学生隐私、密码、token 或其他敏感信息。
-->
