# W01 证据卡

## 课时 1｜责任退出卡

> Agent 说：“策略回测收益 38%，我已经完成。”  
> 在我为它签字之前，我至少还要看到 ______ 的可反驳证据；即使该证据成立，它仍不能证明 ______。

只需写一到两句话。评价的是证据边界，不是金融知识。

## 课时 2｜WSL 状态

提交一种状态：

```text
READY-WSL
PowerShell 核验：Ubuntu 存在 / VERSION 2
Ubuntu 能够启动：是
WSL 核验：pwd / whoami / cat /etc/os-release 均可运行，输出已保留
```

或填写下方 `BLOCKED-*` 模板。

## 课时 3｜最终状态

### `READY-CODE`

现场展示或填写核验结果；不要上传包含密码、完整主机名或无关个人信息的截图。

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

### `BLOCKED-*`

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

`READY-WSL` 和 `READY-VSCODE` 是过程检查点；`READY-CODE` 才是 W1 成功出口。结构化 `BLOCKED-*` 可以使课堂合法收口，但仍须沿保存的检查点补做或进入教师安排的 fallback。
