# Exameow Daily Study

A DeepSeek Harness plugin that turns daily Exameow practice into a calm, native-feeling habit page: a daily question goal, a streak, XP levels, a seven-day view, and a durable reminder delivered by DSH itself.

The plugin does not replace Exameow. It adds one panel to DSH:

> Sidebar → **Daily Study** (directly below **Automation tasks**)

The page uses DSH theme tokens and the active DSH language, so it follows the rest of the app instead of looking like an embedded widget.

[Exameow on GitHub](https://github.com/heshengtao/exameow) · [Download Exameow](https://github.com/heshengtao/exameow/releases/latest)

## What it does

- **Daily goal** — choose how many questions to finish each day (default 10).
- **Streak + XP + level** — logging questions grants XP; finishing the goal keeps the streak alive and adds a daily bonus.
- **Native sidebar page** — a full main panel named **Daily Study**, not a card glued under the composer.
- **This week** — a compact seven-day view of completed questions.
- **Durable DSH reminder** — pick a local time (for example `20:00`, `Asia/Shanghai`) and a destination session. The plugin creates a real DSH schedule, so the reminder survives restarts as long as DSH is running.
- **One-click launch** — “Open Exameow” tries the installed desktop app; if it is missing, the Download action opens the GitHub release page.
- **Agent tool** — `study_habit` lets the model read the state, log questions, check in, change the goal, set or clear the reminder, and open the app.

## Language

The sidebar label, page title, settings, buttons, and notices follow the active DSH locale. The plugin ships English and Simplified Chinese dictionaries; DSH's own locale preference chooses between them.

## Install

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

1. Open **Daily Study** in the left sidebar, below **Automation tasks**.
2. Set the daily question goal and click **Save**.
3. Choose a **Reminder session** from recent sessions, pick a time, and switch **Daily reminder** on.
4. After practicing in Exameow, use **+1 question**, **+5 questions**, or **Finish today** on the study page, or ask the agent to record it.

A reminder is bound to one session. If you switch sessions, change **Reminder session** and click **Save reminder**; the old schedule is replaced.

### Ask the agent

The model can call `study_habit`:

```text
Read my study habit.
I finished 5 questions today.
Set a daily Exameow reminder for 20:00 Asia/Shanghai.
Open Exameow.
```

## Data and privacy

State is stored on this machine at:

```text
~/.exameow-study-habit/state.json
```

It contains the daily goal, question counts, streak, XP, and reminder metadata. Nothing is uploaded. Delete that file to reset all progress.

## How it works

- **Host** (`index.js`) owns the state, registers the `study_habit` tool, exposes a small same-origin JSON API, and creates/deletes DSH schedule entries.
- **Client** (`client.js`) registers a `sidebar.panellist` icon and a `main` panel keyed `exameow-study`, styled with DSH theme tokens and localized through DSH's locale service.
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

一个给 DeepSeek Harness 用的每日学习页面：在左侧栏「自动化任务」下方新增「每日学习」，展示连续天数、每日题量目标、XP 等级、今日进度和最近七天记录；可以设置由 DSH 真正调度的每日提醒。

页面使用 DSH 的主题变量和当前语言，不再是输入框下方那种突兀的卡片。

- **每日目标**：默认 10 题，可调整 1–100。
- **连续天数 / XP / 等级**：记题得 XP，完成当日目标有额外奖励。
- **独立页面**：侧栏「每日学习」，主区域一个完整面板。
- **本周记录**：最近七天的完成题数。
- **定时提醒**：选择时间和接收会话后，通过 DSH 的 `schedule` 服务创建每日提醒；重启 DSH 后仍有效（DSH 需保持运行）。
- **打开 App**：优先打开已安装的 Exameow；没检测到就打开 GitHub Releases。
- **Agent 工具**：`study_habit`，支持 `status` / `log` / `checkin` / `set_goal` / `set_reminder` / `clear_reminder` / `open_app`。

安装：克隆本仓库后，在 DSH 的插件管理器里从本地目录安装，或调用 `plugin_manager` 的 `install_bundle`，`target` 指向本目录。

数据只保存在 `~/.exameow-study-habit/state.json`，不上传。删除该文件即可重置。

Exameow 下载：[GitHub Releases](https://github.com/heshengtao/exameow/releases/latest)。

没有出现任何其他学习产品的名称。
