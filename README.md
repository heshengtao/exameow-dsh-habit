# Exameow Study Streak

A DeepSeek Harness plugin that turns daily Exameow practice into a small, visible habit: a streak, a daily question goal, XP levels, a quick check-in, and a durable reminder delivered by DSH itself.

The plugin is deliberately small and local-first. It does not replace Exameow; it sits below the DSH composer and nudges you back into the app.

[Exameow on GitHub](https://github.com/heshengtao/exameow) · [Download Exameow](https://github.com/heshengtao/exameow/releases/latest)

## What it does

- **Daily goal** — choose how many questions you want to finish each day (default 10).
- **Streak + XP + level** — finishing the goal keeps the streak alive; every logged question grants XP, and a completed day grants a bonus.
- **Composer dock** — a compact card under the message composer shows today’s progress, streak, level, and remaining questions.
- **Durable DSH reminder** — set a local time (for example `20:00`, `Asia/Shanghai`). The plugin creates a real DSH schedule bound to the current session, so the reminder arrives even after a restart as long as DSH is running.
- **One-click launch** — “Study now” tries to open the installed Exameow desktop app; if it is missing, it opens the GitHub release page instead.
- **Agent tool** — `study_habit` lets the model read the state, log questions, check in, change the goal, set or clear the reminder, and open the app.

## Install

### From a local checkout

```bash
git clone https://github.com/heshengtao/exameow-dsh-habit.git
```

Then ask DeepSeek Harness’s Plugin Manager to install the bundle from that directory, or use the `plugin_manager` tool with:

```json
{ "action": "install_bundle", "target": "/absolute/path/to/exameow-dsh-habit" }
```

The package is a normal DSH bundle: `package.json` declares `dsh.bundle.patch` and `dsh.client`, and `cordis.patch.yml` inserts the Host row. No build step, no npm dependencies, no network access from the plugin.

### Requirements

- DeepSeek Harness with the Web UI and the `schedule` service (the standard Web/profile bundle).
- Exameow desktop is optional but recommended. Install it from [GitHub Releases](https://github.com/heshengtao/exameow/releases/latest).

## Use

Open any conversation. The study card appears below the composer.

| Control | Behavior |
| --- | --- |
| Flame / number | Current streak. The small number is today’s streak; the panel shows the best streak. |
| Progress bar | Today’s completed questions against the daily goal. |
| **Study now** | Opens Exameow. If it cannot be found, opens the release page. |
| **+1 / +5 questions** | Logs completed practice. Reaching the goal completes the day and adds the daily bonus. |
| **Finish today** | Marks the goal complete in one click. |
| **Bell** | Expands study settings. |
| **Daily goal** | Change the target (1–100). |
| **Daily reminder** | Enable a DSH schedule at the chosen local time and time zone. Changes to the time use **Save**. |

### Ask the agent

The model can call `study_habit`:

```text
Read my study habit.
I finished 5 questions today.
Set a daily Exameow reminder for 20:00 Asia/Shanghai.
Open Exameow.
```

A reminder is bound to the session where it was created. If you switch to another session, the old reminder still delivers into its original session; create a new one from the session where you want the nudge.

## Data and privacy

State is stored on this machine at:

```text
~/.exameow-study-habit/state.json
```

It contains only the daily goal, question counts, streak, XP, and reminder metadata. Nothing is uploaded. Delete that file to reset all progress.

## How it works

- **Host** (`index.js`) owns the state, registers the `study_habit` tool, exposes a tiny same-origin JSON API, and creates/deletes DSH schedule entries.
- **Client** (`client.js`) renders the dock card with the host theme tokens and the active DSH locale, and talks to the Host API.
- **Schedule** uses DSH’s shared `schedule` service with a daily wall-clock rule. DSH must be running at the chosen time; delivery is a normal follow-up message in the bound session.

## Development

```bash
node --check index.js
node --check client.js
```

There is no build step. Edit `index.js` or `client.js`, reinstall/reload the bundle in DSH, and refresh the page.

## License

Apache-2.0. See [LICENSE](LICENSE).

---

## 中文说明

一个给 DeepSeek Harness 用的每日学习打卡插件：在输入框下方显示连续天数、每日题量目标、XP 等级和今日进度；完成目标后延续连续记录；可以设置一个由 DSH 真正调度的每日提醒，提醒会作为一条消息回到当前会话。

插件不替代 Exameow，只负责把“该去刷题了”变得看得见。

- **每日目标**：默认 10 题，可调整 1–100。
- **连续天数 / XP / 等级**：记题得 XP，完成当日目标有额外奖励。
- **一键打开**：尝试打开已安装的 Exameow；没检测到就打开 GitHub Releases。
- **定时提醒**：选择本地时间后，通过 DSH 的 `schedule` 服务创建每日提醒，重启 DSH 后仍然有效（DSH 需保持运行）。
- **Agent 工具**：`study_habit`，支持 `status` / `log` / `checkin` / `set_goal` / `set_reminder` / `clear_reminder` / `open_app`。

安装：克隆本仓库后，在 DSH 的插件管理器里从本地目录安装，或调用 `plugin_manager` 的 `install_bundle`，`target` 指向本目录。

数据只保存在 `~/.exameow-study-habit/state.json`，不上传。删除该文件即可重置。

Exameow 下载：[GitHub Releases](https://github.com/heshengtao/exameow/releases/latest)。

没有出现任何其他学习产品的名称；这里只有猫、火焰、连续天数和每日目标。
