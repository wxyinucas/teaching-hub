# W1 学生行动指南：WSL → VS Code → `code .`

> 本指南是 W1 操作与验收的参考标准。完成时形成并保存 `READY-*`，受阻时保存可接续的 `BLOCKED-*`。

## 现在开始｜先试一次 WSL

这不是到课门槛，也不要求你课前独立排除故障。它只让你提前走上课堂会使用的同一条路线。

**目标**：
- Ubuntu 能在 WSL 2 中启动，并在其中运行 `pwd`、`whoami`、`cat /etc/os-release`。
- 完成后用 `READY-WSL` 标记当前进度。这不是表单，也不集中提交；把核验输出留在自己下次能找到的位置即可。不能继续时保存 `BLOCKED-*`，上课从这个检查点接着做。

**开始前检查**：
- 使用自己的 Windows 电脑，保存正在进行的重要工作，确认能够使用管理员权限并允许重启。
  - 最好是 Windows 10 版本 2004（Build 19041）以上或 Windows 11。
  - 不要运行来源不明的“一键安装／修复”脚本。

**第一次尝试**：

### 如果你知道下面的操作是在做什么，或者尝试过程很顺利，就直接做
在 **Windows 管理员 PowerShell** 中运行：

```powershell
wsl --install
```

随后只按系统提示继续。若顺利完成，进入本文“第二课时”逐项核验。

### 若你内心觉得不稳妥，或者出了问题

- 参考本页末尾的《参考资料》；
- 若命令、权限、重启或下载出现问题，不要随机修改 BIOS、关闭安全功能或删除发行版，直接使用文末 `BLOCKED-*` 模板保存现场。

## 如何使用本页

- 课前：可以先试一次 WSL；成功不是到课门槛，遇阻也不要求独立修好。
- 课中：第二课时查阅 WSL 安装与核验细节；第三课时查阅 VS Code 接入与 `code .` 的操作细节。
- 收口：完成时保存核验输出；不能继续时保存最后一个成功动作、完整错误和下一步。

`BLOCKED-*` 可以使本次课堂正常收口（也就是带着明确结果的结束），但不等于已经通关。W1 不要求理解所有命令；先沿固定路线得到可核验状态，W2 再正式学习路径。

> **下面有两条平行路线，可以任选一条作为主路线。**
> - 你可以直接跟随“第二课时”和“第三课时”的步骤操作；
> - 也可以复制后面的 Chatbox 提示词，让 Agent 每次只带你做一个动作。
>
> 两条路线使用同一套安全边界与 `READY-*` / `BLOCKED-*` 出口，不需要先把手动路线全部做完，才有资格使用 Chatbox。

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
你是我的 WSL 安装教练。我没有编程经验，也可能分不清 Windows PowerShell、Ubuntu / WSL Bash 和 VS Code 集成终端；不要假设我已经打开了正确的窗口。

请带我达到 READY-WSL：Ubuntu 正常启动；我能辨认当前使用的终端；能在 WSL 中运行 pwd、whoami、cat /etc/os-release 并保存输出。

开始安装前，先让我描述当前窗口的标题、提示符以及它是否位于 VS Code 内；必要时让我提供遮去个人信息的截图。然后每次只给一条无副作用的识别命令，根据真实输出明确告诉我：这是 Windows PowerShell、WSL Bash，还是 VS Code 内运行的某种 shell。不要只凭窗口外观猜测；VS Code 集成终端也可能是 PowerShell。

确认终端后，再询问我的 Windows 版本、管理员权限、是否允许重启、当前状态或完整报错，以及课程资料。课程资料优先，有冲突先说明。每次只给一个动作，并固定写清：
1. 在哪个应用、哪个终端中执行；
2. 如何打开或辨认这个终端；
3. 这一步的目的；
4. 预期会看到什么；
5. 我应该把什么真实结果回复给你。

等我返回结果后再继续，不得假设成功，也不要一次给出整串命令。

不要索取或让我展示密码、密钥、token。涉及 BIOS、来源不明的管理员脚本、删除/覆盖时，立即停下让我找老师；重启前说明影响。

最后逐项输出“通过 / 未通过 / 对应证据”；证据不足不得宣布 READY-WSL。现在只问第一个问题。
```

### 达到 `READY-CODE`

完成 `READY-WSL` 后，复制下面整段文字：

```text
你是我的 VS Code + WSL 连接教练。我没有编程经验，也可能分不清 Windows PowerShell、Ubuntu / WSL Bash 和 VS Code 集成终端；不要假设我已经打开了正确的窗口。

请先用真实输出核验 READY-WSL，再带我达到 READY-CODE：从 WSL 的课程目录运行 code .；VS Code 连接到 WSL；集成终端显示 Linux 且位于同一目录；保存连接状态和终端输出。

先让我描述当前窗口、提示符、VS Code 左下角连接状态、当前目录和完整报错；必要时让我提供遮去个人信息的截图。每次只给一个动作，写清在哪个应用和终端执行、如何确认窗口正确、目的、预期现象，以及我要回复的真实结果。等我返回后再继续，不得假设成功，也不要一次给出整串命令。

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

## 参考资料

官方说明是最终依据。第三方教程与官方路线冲突时，以官方说明和课堂要求为准。

- [安装 WSL｜Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install)
- [设置 WSL 开发环境｜Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment)
- [安装 Windows 版 VS Code](https://code.visualstudio.com/docs/setup/windows)
- [VS Code 与 WSL](https://code.visualstudio.com/docs/remote/wsl)
- [Microsoft WSL 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)

中文辅助教程复核于 2026-09-02：

- [Bilibili｜从 0 开始安装 WSL](https://www.bilibili.com/video/BV18VGPzVEzo/)：约 8 分钟，适合先看一遍安装与 Ubuntu 初始化。视频后半包含换源、`apt upgrade` 和 root 密码等额外配置；W1 不要求这些操作，不要机械照抄。
- [小红书｜WSL 安装图文补充](https://www.xiaohongshu.com/explore/6a54eddf0000000015026687)：只作为可选图文参考，页面可能要求登录；公开访问在复核时暂时不可用，因此不能作为唯一入口。
