# W01 学生任务卡：WSL → VS Code → `code .`

> 官方路线复核日期：2026-08-24。  
> W1 不要求理解所有命令；先沿固定路线得到可核验状态，W2 再正式学习路径。

## 本周出口

- 成功：从 WSL 的 `~/course/w01` 执行 `code .`，提交 `READY-CODE`；
- 未成功：提交结构化 `BLOCKED-*`，使下一次能够从当前检查点继续。

安装速度不计分。`BLOCKED-*` 可以结束本次课堂，但不等于已经通关。

## 课前准备

- 带电脑和充电器，保存正在进行的重要工作；课堂中可能重启；
- 确认是否能使用 Windows 管理员权限、是否允许重启；
- Windows 黄金路线要求 Windows 10 版本 2004（Build 19041）以上或 Windows 11；
- 可以提前尝试，但不要求课前安装成功；
- 只使用下方官方链接，不运行来源不明的“一键安装/修复”脚本。

官方入口：

- [安装 WSL｜Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install)
- [设置 WSL 开发环境｜Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment)
- [安装 Windows 版 VS Code](https://code.visualstudio.com/docs/setup/windows)
- [VS Code 与 WSL](https://code.visualstudio.com/docs/remote/wsl)
- [Microsoft WSL 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)

<!-- 发布前补充：教师验证过的 Bilibili 教程、小红书图文和课程文件入口。 -->

## 第一步｜安装并启动 WSL 2 + Ubuntu

下面的命令运行在 **Windows 管理员 PowerShell**，不是 Ubuntu：

```powershell
wsl --install
```

1. 等待命令完成；按系统提示重启 Windows；
2. 从开始菜单打开 Ubuntu；首次启动会等待解压；
3. 创建 Linux 用户名和密码。输入密码时屏幕不显示字符属于正常现象；
4. 不把 Windows 或 Linux 密码发给教师、同学或 Agent。

重启后，在 **普通 PowerShell** 中核验：

```powershell
wsl --list --verbose
```

最低预期：列表中存在 Ubuntu，并且 `VERSION` 为 `2`。

随后在 **Ubuntu / WSL Bash** 中运行并保留输出：

```bash
pwd
whoami
cat /etc/os-release
```

最低预期：三条命令均可运行，最后一条输出能够确认当前发行版为 Ubuntu。这组输出与 PowerShell 核验共同构成 `READY-WSL` 的证据。

如果 `wsl --install` 只显示帮助文本，先记录现象并请教师确认，再使用官方分支：

```powershell
wsl --list --online
wsl --install -d Ubuntu
```

其他错误不要随机改 BIOS、关闭安全功能或卸载发行版；转到 `BLOCKED-*`。

## 第二步｜安装 Windows 版 VS Code 与 WSL 扩展

1. 在 Windows 安装 VS Code；多数个人电脑使用官方 **User Setup**；
2. 若安装器出现附加任务，勾选 **Add to PATH**；
3. 打开 VS Code，在 Extensions 中安装 Microsoft 发布的 **WSL** 扩展；
4. 安装后关闭并重新打开 PowerShell/Ubuntu 终端。

不要在 Ubuntu 内再安装一份桌面版 VS Code。

## 第三步｜从固定课程目录打开 VS Code

下面命令运行在 **Ubuntu / WSL Bash**，不是 PowerShell。整段可以复制：

```bash
mkdir -p ~/course/w01
cd ~/course/w01
printf 'AI-COURSE-W01\n' > COURSE_MARKER.txt
pwd
code .
```

首次执行 `code .` 时，VS Code 会下载并启动 VS Code Server，可能需要等待。成功后检查：

- VS Code 左下角显示 `WSL: Ubuntu`；
- VS Code 打开了 `COURSE_MARKER.txt`；
- 在 VS Code 的 Terminal → New Terminal 中执行下方核验命令。

```bash
printf 'SYSTEM=%s\nFOLDER=%s\nEDITOR=%s\n' "$(uname -s)" "${PWD/#$HOME/~}" "$TERM_PROGRAM"
cat COURSE_MARKER.txt
```

预期结果包含：

```text
SYSTEM=Linux
FOLDER=~/course/w01
EDITOR=vscode
AI-COURSE-W01
```

出现这些结果即可提交 `READY-CODE`。W1 不安装 Python、Git、`uv`，也不执行 `apt upgrade`。

## 让 Chatbox 帮你达到 `READY-WSL`

复制下面整段文字。随后按 Chatbox 的提问补充真实状态，不要让它假设某一步已经成功：

```text
你是我的 WSL 安装教练。请带我达到 READY-WSL：Ubuntu 正常启动；我能分清 Windows 与 WSL 终端；能在 WSL 中运行 pwd、whoami、cat /etc/os-release 并保存输出。

先询问我的 Windows 版本、管理员权限、当前状态/完整报错和课程资料；课程资料优先，有冲突先说明。每次只给一个动作，标明执行窗口、目的和预期现象；等我返回真实结果后再继续，不得假设成功。

不要索取或让我展示密码、密钥、token。涉及 BIOS、来源不明的管理员脚本、删除/覆盖时，立即停下让我找老师；重启前说明影响。

最后逐项输出“通过 / 未通过 / 对应证据”；证据不足不得宣布 READY-WSL。现在只问第一个问题。
```

## 让 Chatbox 帮你达到 `READY-CODE`

完成 `READY-WSL` 后，复制下面整段文字：

```text
你是我的 VS Code + WSL 连接教练。请先核验 READY-WSL，再带我达到 READY-CODE：从 WSL 的课程目录运行 code .；VS Code 连接到 WSL；集成终端显示 Linux 且位于同一目录；保存连接状态和终端输出。

先询问我的当前目录、VS Code 状态、屏幕/完整报错和课程资料；课程资料优先，有冲突先说明。每次只给一个动作，标明执行窗口、目的和预期现象；等我返回真实结果后再继续，不得假设成功。

不要索取或让我展示密码、密钥、token。涉及 BIOS、来源不明的管理员脚本、注销 WSL、删除/覆盖时，立即停下让我找老师。

最后逐项输出“通过 / 未通过 / 对应证据”；证据不足不得宣布 READY-CODE。现在只问第一个问题。
```

### 故障交接模板

如果 Chatbox 需要了解错误，把下面模板连同完整报错发给它；让它先解释，再提出一个最小检查动作：

```text
我的目标：
当前阶段与最后一个成功检查点：
我实际执行的操作：
完整错误或观察：
我已经检查过什么：
安全限制：不要索取密码或 token；不要擅自执行管理员命令、修改 BIOS、
关闭安全功能、注销 WSL 发行版或删除数据。需要高权限时先解释并等待确认。
```

## 必须停止并提交状态的情况

- 没有管理员权限、现在不能重启、系统版本不满足；
- 出现虚拟化/BIOS 错误；
- 下载或 VS Code Server 长时间无进展；
- Agent 索取密码，或建议来源不明的管理员脚本；
- Agent 建议 `wsl --unregister`、关闭安全功能、修改 BIOS 或不可逆删除；
- 课堂进入最后 10 分钟，或课外补做累计达到 1 小时。

此时不要只写“装不上”。改用[证据卡](./W01-证据卡.md)提交可接续的 `BLOCKED-*`。
