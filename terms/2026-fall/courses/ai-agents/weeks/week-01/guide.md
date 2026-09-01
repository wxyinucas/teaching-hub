# W1 学生行动指南：WSL → VS Code → `code .`

> 本指南是 W1 操作与验收的正式依据。安装速度不计分；完成时形成并保存 `READY-*`，受阻时保存可接续的 `BLOCKED-*`。本周不集中收集这些状态。

## 本周要完成什么

- 第一课时：写下自己的“签字”判断；
- 第二课时：让 WSL 2 与 Ubuntu 正常启动，达到 `READY-WSL`；
- 第三课时：从 WSL 的课程目录打开 VS Code，达到 `READY-CODE`。

`BLOCKED-*` 可以使本次课堂正常收口，但不等于已经通关。W1 不要求理解所有命令；先沿固定路线得到可核验状态，W2 再正式学习路径。

## 课前准备与官方入口

- 带 Windows 电脑和充电器，保存正在进行的重要工作；课堂中可能重启；
- 确认自己是否能使用管理员权限、是否允许重启；
- Windows 黄金路线要求 Windows 10 版本 2004（Build 19041）以上或 Windows 11；
- 可以提前尝试，但不要求课前安装成功；
- 只使用课程资料与官方链接，不运行来源不明的“一键安装／修复”脚本。

### 课前试跑

课前可以沿本页尝试一次；这不是到课门槛，也不要求独立解决故障。开始前先保存工作并确认可以重启。成功时记住自己到达的状态；受阻时只需保留最后一个成功动作和完整错误，上课从这里继续。

### 官方入口

- [安装 WSL｜Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install)
- [设置 WSL 开发环境｜Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment)
- [安装 Windows 版 VS Code](https://code.visualstudio.com/docs/setup/windows)
- [VS Code 与 WSL](https://code.visualstudio.com/docs/remote/wsl)
- [Microsoft WSL 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)

官方说明是最终依据。第三方教程与官方路线冲突时，以官方说明和课堂要求为准。

### 中文辅助教程

复核日期：2026-09-02。

- [Bilibili｜从0开始安装 WSL](https://www.bilibili.com/video/BV18VGPzVEzo/)：约 8 分钟，适合先看一遍安装与 Ubuntu 初始化。视频后半包含换源、`apt upgrade` 和 root 密码等额外配置；W1 不要求这些操作，不要机械照抄。
- [小红书｜WSL 安装图文补充](https://www.xiaohongshu.com/explore/6a54eddf0000000015026687)：只作为可选图文参考，页面可能要求登录；公开访问在复核时暂时不可用，因此不能作为唯一入口。

## 第一课时｜留下自己的签字判断

只写一到两句话：

> 当 Agent 交付一个漂亮结果时，我签字前还需要 ______。
>
> 即使这些证据成立，它仍然不能证明 ______。

这里评价的是你能否说明证据与证据的边界，不是金融知识。

## 第二课时｜达到 `READY-WSL`

### 1. 安装并启动 WSL 2 + Ubuntu

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

其他错误不要随机改 BIOS、关闭安全功能或注销发行版；转到本文末尾的 `BLOCKED-*`。

### 2. 保存第二课时状态

成功时把下面状态保存在自己下次能够找到的位置：

```text
状态：READY-WSL
PowerShell 核验：Ubuntu 存在 / VERSION 2
Ubuntu 能够启动：是
WSL 核验：pwd / whoami / cat /etc/os-release 均可运行，输出已保留
```

证据不足时不得宣布 `READY-WSL`；按 `BLOCKED-*` 模板收口。

## 第三课时｜达到 `READY-CODE`

### 1. 安装 Windows 版 VS Code 与 WSL 扩展

1. 在 Windows 安装 VS Code；多数个人电脑使用官方 **User Setup**；
2. 若安装器出现附加任务，勾选 **Add to PATH**；
3. 打开 VS Code，在 Extensions 中安装 Microsoft 发布的 **WSL** 扩展；
4. 安装后关闭并重新打开 PowerShell / Ubuntu 终端。

不要在 Ubuntu 内再安装一份桌面版 VS Code。

### 2. 从固定课程目录打开 VS Code

下面命令运行在 **Ubuntu / WSL Bash**，不是 PowerShell：

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

### 3. 保存 W1 最终状态

成功时把核验结果保存在自己下次能够找到的位置；不集中提交。记录中不要包含密码、完整主机名或无关个人信息。

```text
状态：READY-CODE
PowerShell：Ubuntu 存在 / VERSION 2
VS Code 左下角：WSL: Ubuntu
SYSTEM=Linux
FOLDER=~/course/w01
EDITOR=vscode
课程标记：AI-COURSE-W01
我尚未理解、准备在 W2 继续学习的一点：
```

W1 不安装 Python、Git、`uv`，也不执行 `apt upgrade`。

## 让 Chatbox 一步一步带你操作

### 达到 `READY-WSL`

复制下面整段文字。随后补充真实状态，不要让 Chatbox 假设某一步已经成功：

```text
你是我的 WSL 安装教练。请带我达到 READY-WSL：Ubuntu 正常启动；我能分清 Windows 与 WSL 终端；能在 WSL 中运行 pwd、whoami、cat /etc/os-release 并保存输出。

先询问我的 Windows 版本、管理员权限、当前状态/完整报错和课程资料；课程资料优先，有冲突先说明。每次只给一个动作，标明执行窗口、目的和预期现象；等我返回真实结果后再继续，不得假设成功。

不要索取或让我展示密码、密钥、token。涉及 BIOS、来源不明的管理员脚本、删除/覆盖时，立即停下让我找老师；重启前说明影响。

最后逐项输出“通过 / 未通过 / 对应证据”；证据不足不得宣布 READY-WSL。现在只问第一个问题。
```

### 达到 `READY-CODE`

完成 `READY-WSL` 后，复制下面整段文字：

```text
你是我的 VS Code + WSL 连接教练。请先核验 READY-WSL，再带我达到 READY-CODE：从 WSL 的课程目录运行 code .；VS Code 连接到 WSL；集成终端显示 Linux 且位于同一目录；保存连接状态和终端输出。

先询问我的当前目录、VS Code 状态、屏幕/完整报错和课程资料；课程资料优先，有冲突先说明。每次只给一个动作，标明执行窗口、目的和预期现象；等我返回真实结果后再继续，不得假设成功。

不要索取或让我展示密码、密钥、token。涉及 BIOS、来源不明的管理员脚本、注销 WSL、删除/覆盖时，立即停下让我找老师。

最后逐项输出“通过 / 未通过 / 对应证据”；证据不足不得宣布 READY-CODE。现在只问第一个问题。
```

## 受阻时怎样正常收口

### `BLOCKED-*` 模板

```text
状态码：
当前阶段：
最后一个成功检查点：
实际执行的操作：
完整错误或观察：
已经检查：
下一步准备：
是否涉及密码、token 或个人信息：否
```

状态码：

```text
BLOCKED-OS      Windows 版本、更新或当前不能重启
BLOCKED-PERM    没有必要的管理员权限
BLOCKED-BIOS    虚拟化或固件问题
BLOCKED-NET     下载、代理、商店或 VS Code Server 网络问题
BLOCKED-DISK    空间不足
BLOCKED-OTHER   标准路线暂时不能解释
```

### 必须停止并保存状态的情况

- 没有管理员权限、现在不能重启、系统版本不满足；
- 出现虚拟化 / BIOS 错误；
- 下载或 VS Code Server 长时间无进展；
- Agent 索取密码，或建议来源不明的管理员脚本；
- Agent 建议 `wsl --unregister`、关闭安全功能、修改 BIOS 或不可逆删除；
- 课堂进入最后 10 分钟，或课外补做累计达到 1 小时。

不要只写“装不上”。`BLOCKED-*` 必须留下足够信息，使教师、同学或 Agent 下次能够从该检查点继续。
