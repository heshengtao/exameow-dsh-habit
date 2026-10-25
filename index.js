/**
 * Exameow Study Streak — Host half.
 *
 * The Host owns the durable daily-study state and the DSH schedule binding.
 * The browser half only renders and calls the small JSON API below.
 */
import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const RELEASE_URL = 'https://github.com/heshengtao/exameow/releases/latest';
const APP_ID = 'com.exameow.app';
const REMINDER_TITLE = 'Exameow 每日学习';
const STATE_VERSION = 1;
const HISTORY_DAYS = 180;
const XP_PER_QUESTION = 10;
const XP_DAILY_BONUS = 20;
const LEVEL_XP = 100;
const DEFAULT_GOAL = 10;
const DEFAULT_TIME = '20:00';

export const inject = ['tools', 'webServer'];

export function apply(ctx, config = {}) {
  const fallbackTimeZone =
    config.timeZone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    'UTC';
  const defaultGoal = clampGoal(config.goal ?? DEFAULT_GOAL);
  const stateFile = resolveStateFile(config);
  let queue = Promise.resolve();

  function defaultState() {
    return {
      version: STATE_VERSION,
      goal: defaultGoal,
      xp: 0,
      streak: 0,
      bestStreak: 0,
      lastCompletedDate: null,
      timeZone: fallbackTimeZone,
      days: {},
      reminder: {
        enabled: false,
        time: DEFAULT_TIME,
        timeZone: fallbackTimeZone,
        scheduleId: null,
        sessionId: null,
        localOnly: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  function normalizeState(raw) {
    const base = defaultState();
    if (!raw || typeof raw !== 'object') return base;
    const state = {
      ...base,
      ...raw,
      version: STATE_VERSION,
      goal: clampGoal(raw.goal ?? base.goal),
      xp: Number.isFinite(Number(raw.xp)) ? Math.max(0, Math.floor(Number(raw.xp))) : 0,
      streak: Number.isFinite(Number(raw.streak)) ? Math.max(0, Math.floor(Number(raw.streak))) : 0,
      bestStreak: Number.isFinite(Number(raw.bestStreak))
        ? Math.max(0, Math.floor(Number(raw.bestStreak)))
        : 0,
      lastCompletedDate: typeof raw.lastCompletedDate === 'string' ? raw.lastCompletedDate : null,
      timeZone: typeof raw.timeZone === 'string' && raw.timeZone ? raw.timeZone : fallbackTimeZone,
      days: raw.days && typeof raw.days === 'object' && !Array.isArray(raw.days) ? raw.days : {},
      reminder: {
        ...base.reminder,
        ...(raw.reminder && typeof raw.reminder === 'object' ? raw.reminder : {}),
      },
    };
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    for (const [key, value] of Object.entries(state.days)) {
      if (!value || typeof value !== 'object') {
        state.days[key] = { count: 0, done: false, updatedAt: null };
        continue;
      }
      value.count = Number.isFinite(Number(value.count))
        ? Math.max(0, Math.floor(Number(value.count)))
        : 0;
      value.done = Boolean(value.done);
    }
    pruneDays(state);
    return state;
  }

  function pruneDays(state) {
    const cutoff = new Date(Date.now() - HISTORY_DAYS * 86400000)
      .toISOString()
      .slice(0, 10);
    for (const key of Object.keys(state.days)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || key < cutoff) delete state.days[key];
    }
  }

  async function readState() {
    try {
      const raw = await fs.readFile(stateFile, 'utf8');
      return normalizeState(JSON.parse(raw));
    } catch (error) {
      if (error?.code === 'ENOENT') return defaultState();
      try {
        await fs.rename(stateFile, `${stateFile}.corrupt-${Date.now()}`);
      } catch {
        // Keep going with a clean state; the old file stays in place if it cannot be moved.
      }
      return defaultState();
    }
  }

  async function writeState(state) {
    await fs.mkdir(path.dirname(stateFile), { recursive: true });
    const body = JSON.stringify(state, null, 2);
    const temp = `${stateFile}.tmp`;
    await fs.writeFile(temp, body, 'utf8');
    try {
      await fs.rename(temp, stateFile);
    } catch {
      // Windows cannot always rename over an existing file.
      await fs.rm(stateFile, { force: true });
      await fs.rename(temp, stateFile);
    }
  }

  function getState() {
    const run = queue.then(() => readState());
    queue = run.catch(() => {});
    return run;
  }

  function mutate(fn) {
    const run = queue.then(async () => {
      const state = await readState();
      const result = await fn(state);
      state.updatedAt = new Date().toISOString();
      pruneDays(state);
      await writeState(state);
      return result;
    });
    queue = run.catch(() => {});
    return run;
  }

  function statusOf(state) {
    const timeZone = state.timeZone || fallbackTimeZone;
    const today = dateKey(new Date(), timeZone);
    const yesterday = dateKey(new Date(Date.now() - 86400000), timeZone);
    const day = state.days[today] || { count: 0, done: false };
    const count = Math.max(0, Number(day.count) || 0);
    const done = Boolean(day.done) || count >= state.goal;
    const streak =
      state.lastCompletedDate === today || state.lastCompletedDate === yesterday
        ? state.streak
        : 0;
    const level = 1 + Math.floor(state.xp / LEVEL_XP);
    const levelXp = state.xp % LEVEL_XP;
    const progress = state.goal > 0 ? Math.min(100, Math.round((count / state.goal) * 100)) : 100;
    const reminder = state.reminder || {};
    return {
      goal: state.goal,
      today,
      todayCount: count,
      remaining: Math.max(0, state.goal - count),
      done,
      progress,
      streak,
      bestStreak: Math.max(state.bestStreak, streak),
      xp: state.xp,
      level,
      levelXp,
      levelSpan: LEVEL_XP,
      timeZone,
      reminder: {
        enabled: Boolean(reminder.enabled),
        time: typeof reminder.time === 'string' ? reminder.time : DEFAULT_TIME,
        timeZone: reminder.timeZone || timeZone,
        scheduleId: reminder.scheduleId || null,
        sessionId: reminder.sessionId || null,
        localOnly: Boolean(reminder.localOnly),
      },
      app: {
        installed: isAppInstalled(),
        releaseUrl: RELEASE_URL,
      },
      scheduleAvailable: Boolean(ctx.get('schedule')),
      clientLastSeen: state.clientLastSeen || null,
      updatedAt: state.updatedAt,
    };
  }

  function ensureDay(state, key) {
    let day = state.days[key];
    if (!day || typeof day !== 'object') {
      day = { count: 0, done: false, updatedAt: null };
      state.days[key] = day;
    }
    return day;
  }

  function completeDay(state, day, today, yesterday) {
    if (day.done) return false;
    day.done = true;
    day.completedAt = new Date().toISOString();
    if (state.lastCompletedDate !== today) {
      state.streak =
        state.lastCompletedDate === yesterday ? Math.max(1, state.streak) + 1 : 1;
      state.lastCompletedDate = today;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
    }
    return true;
  }

  function logQuestions(state, count) {
    const today = dateKey(new Date(), state.timeZone || fallbackTimeZone);
    const yesterday = dateKey(new Date(Date.now() - 86400000), state.timeZone || fallbackTimeZone);
    const day = ensureDay(state, today);
    const before = Math.max(0, Number(day.count) || 0);
    const wasDone = Boolean(day.done) || before >= state.goal;
    day.count = before + count;
    day.updatedAt = new Date().toISOString();
    let awardedXp = (day.count - before) * XP_PER_QUESTION;
    const completedNow = !wasDone && day.count >= state.goal
      ? completeDay(state, day, today, yesterday)
      : false;
    if (completedNow) awardedXp += XP_DAILY_BONUS;
    state.xp += awardedXp;
    return { awardedXp, completedNow };
  }

  function completeToday(state, withXp) {
    const today = dateKey(new Date(), state.timeZone || fallbackTimeZone);
    const yesterday = dateKey(new Date(Date.now() - 86400000), state.timeZone || fallbackTimeZone);
    const day = ensureDay(state, today);
    const before = Math.max(0, Number(day.count) || 0);
    const wasDone = Boolean(day.done) || before >= state.goal;
    day.count = Math.max(before, state.goal);
    day.updatedAt = new Date().toISOString();
    let awardedXp = withXp ? Math.max(0, state.goal - before) * XP_PER_QUESTION : 0;
    const completedNow = completeDay(state, day, today, yesterday);
    if (completedNow && withXp) awardedXp += XP_DAILY_BONUS;
    state.xp += awardedXp;
    return { awardedXp, completedNow, alreadyDone: wasDone };
  }

  async function setReminder(state, { time, timeZone, sessionId }) {
    const normalizedTime = normalizeTime(time || state.reminder?.time || DEFAULT_TIME);
    const tz = normalizeTimeZone(timeZone || state.reminder?.timeZone || state.timeZone || fallbackTimeZone);
    if (!sessionId) throw new Error('缺少当前会话，无法创建提醒');
    state.timeZone = tz;

    const schedule = ctx.get('schedule');
    let record = null;
    if (schedule) {
      const prompt = buildReminderPrompt(state);
      record = await schedule.create(sessionId, {
        title: REMINDER_TITLE,
        prompt,
        daily: { time: normalizedTime, time_zone: tz },
      });
      const old = state.reminder;
      if (old?.scheduleId && old?.sessionId && old.scheduleId !== record.id) {
        try {
          await schedule.delete({ sessionId: old.sessionId, id: old.scheduleId });
        } catch {
          // A stale binding should not prevent the new reminder from working.
        }
      }
    }

    state.reminder = {
      enabled: true,
      time: normalizedTime.slice(0, 5),
      timeZone: tz,
      scheduleId: record?.id || null,
      sessionId,
      localOnly: !schedule,
    };
    return { localOnly: !schedule, scheduleId: record?.id || null };
  }

  async function clearReminder(state) {
    const schedule = ctx.get('schedule');
    const old = state.reminder;
    if (schedule && old?.scheduleId && old?.sessionId) {
      try {
        await schedule.delete({ sessionId: old.sessionId, id: old.scheduleId });
      } catch {
        // Clearing the local switch still matters if the stored task is already gone.
      }
    }
    state.reminder = {
      ...(old || {}),
      enabled: false,
      scheduleId: null,
      sessionId: null,
      localOnly: false,
    };
  }

  function buildReminderPrompt(state) {
    const stateView = statusOf(state);
    const remaining = Math.max(0, stateView.goal - stateView.todayCount);
    return [
      `[Exameow 每日学习] 今天 ${stateView.todayCount}/${stateView.goal} 题，连续 ${stateView.streak} 天，Lv.${stateView.level}。`,
      remaining > 0
        ? `还差 ${remaining} 题完成今日目标。`
        : '今日目标已经完成，继续保持。',
      '打开 Exameow 刷几题；完成后回到这条会话告诉我「记一题」或「完成今日学习」。',
      `如果还没安装 Exameow：${RELEASE_URL}`,
    ].join('\n');
  }

  async function runAction(input, sessionId) {
    const action = String(input?.action || 'status');
    switch (action) {
      case 'status': {
        const state = await getState();
        return { state: statusOf(state) };
      }
      case 'log': {
        const count = clampCount(input?.count ?? 1);
        return mutate((state) => {
          const result = logQuestions(state, count);
          return {
            state: statusOf(state),
            awardedXp: result.awardedXp,
            completedNow: result.completedNow,
          };
        });
      }
      case 'checkin': {
        return mutate((state) => {
          const result = completeToday(state, true);
          return {
            state: statusOf(state),
            awardedXp: result.awardedXp,
            completedNow: result.completedNow,
            alreadyDone: result.alreadyDone,
          };
        });
      }
      case 'set_goal': {
        const goal = clampGoal(input?.goal);
        return mutate((state) => {
          state.goal = goal;
          const today = dateKey(new Date(), state.timeZone || fallbackTimeZone);
          const yesterday = dateKey(
            new Date(Date.now() - 86400000),
            state.timeZone || fallbackTimeZone,
          );
          const day = ensureDay(state, today);
          if (!day.done && day.count >= state.goal) {
            completeDay(state, day, today, yesterday);
          }
          return { state: statusOf(state) };
        });
      }
      case 'set_reminder': {
        return mutate(async (state) => {
          const result = await setReminder(state, {
            time: input?.time,
            timeZone: input?.time_zone || input?.timeZone,
            sessionId: input?.sessionId || input?.session_id || sessionId,
          });
          return { state: statusOf(state), ...result };
        });
      }
      case 'clear_reminder': {
        return mutate(async (state) => {
          await clearReminder(state);
          return { state: statusOf(state) };
        });
      }
      case 'open_app': {
        const app = await openApp();
        const state = await getState();
        return { state: statusOf(state), app };
      }
      case 'client_ready': {
        return mutate((state) => {
          state.clientLastSeen = new Date().toISOString();
          state.clientVersion = 1;
          return { state: statusOf(state) };
        });
      }
      default:
        throw new Error(`未知操作：${action}`);
    }
  }

  // ---- Browser API ---------------------------------------------------------

  function sendJson(res, status, payload) {
    if (res.writableEnded) return;
    const body = JSON.stringify(payload);
    res.writeHead(status, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'content-length': Buffer.byteLength(body),
    });
    res.end(body);
  }

  function readJson(req) {
    return new Promise((resolve, reject) => {
      let raw = '';
      let size = 0;
      req.setEncoding('utf8');
      req.on('data', (chunk) => {
        size += Buffer.byteLength(chunk);
        if (size > 32768) {
          reject(new Error('请求体过大'));
          req.destroy();
          return;
        }
        raw += chunk;
      });
      req.on('end', () => {
        if (!raw.trim()) return resolve({});
        try {
          resolve(JSON.parse(raw));
        } catch {
          reject(new Error('请求 JSON 格式错误'));
        }
      });
      req.on('error', reject);
    });
  }

  async function handleState(req, res) {
    if (req.method !== 'GET') {
      sendJson(res, 405, { ok: false, error: 'method_not_allowed' });
      return;
    }
    try {
      const state = await getState();
      sendJson(res, 200, { ok: true, state: statusOf(state) });
    } catch (error) {
      sendJson(res, 500, { ok: false, error: String(error?.message || error) });
    }
  }

  async function handleAction(req, res) {
    if (req.method !== 'POST') {
      sendJson(res, 405, { ok: false, error: 'method_not_allowed' });
      return;
    }
    try {
      const body = await readJson(req);
      const sessionId = body?.sessionId || body?.session_id || null;
      const result = await runAction(body, sessionId);
      sendJson(res, 200, { ok: true, ...result });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: String(error?.message || error),
        code: error?.code,
      });
    }
  }

  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: '/exameow-habit/state',
      handler: handleState,
    }),
  );
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: '/exameow-habit/action',
      handler: handleAction,
    }),
  );

  // ---- Agent tool ----------------------------------------------------------

  ctx.effect(() =>
    ctx.tools.register({
      name: 'study_habit',
      description:
        'Track the user\'s daily Exameow study habit and its DSH reminder. ' +
        'Use action=status before suggesting a study plan, action=log after the user finishes ' +
        'questions, action=checkin when the user says today\'s goal is done, action=set_goal to ' +
        'change the daily question target, action=set_reminder to create or replace a durable ' +
        'daily reminder for the current session, action=clear_reminder to stop it, and ' +
        'action=open_app to launch Exameow (falling back to its GitHub release page).',
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: [
              'status',
              'log',
              'checkin',
              'set_goal',
              'set_reminder',
              'clear_reminder',
              'open_app',
            ],
            description: 'The habit operation to perform.',
          },
          count: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'Questions completed, for action=log. Defaults to 1.',
          },
          goal: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'Daily question target, for action=set_goal.',
          },
          time: {
            type: 'string',
            description: 'Local reminder time in HH:mm, for action=set_reminder. Defaults to 20:00.',
          },
          time_zone: {
            type: 'string',
            description:
              'IANA time zone such as Asia/Shanghai, for action=set_reminder. Defaults to the Host zone.',
          },
        },
        required: ['action'],
        additionalProperties: false,
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            state: { type: 'object' },
            awardedXp: { type: 'number' },
            completedNow: { type: 'boolean' },
            localOnly: { type: 'boolean' },
            scheduleId: { type: 'string' },
            app: { type: 'object' },
          },
          additionalProperties: true,
        },
        render(_args, value) {
          const view = value?.state;
          if (!view) {
            return [{ type: 'text', text: JSON.stringify(value, null, 2) }];
          }
          const lines = [
            `今日 ${view.todayCount}/${view.goal} 题 · 连续 ${view.streak} 天 · Lv.${view.level}（${view.levelXp}/${view.levelSpan} XP）`,
            view.done ? '今日目标已完成。' : `还差 ${view.remaining} 题完成今日目标。`,
            view.reminder?.enabled
              ? `每日提醒：${view.reminder.time}（${view.reminder.timeZone}）${view.reminder.localOnly ? '，仅页面内' : ''}`
              : view.scheduleAvailable
                ? '尚未设置每日提醒。'
                : '当前 DSH 没有 schedule 服务，无法创建到点提醒。',
            view.app?.installed ? 'Exameow 已安装。' : `Exameow 未检测到，下载：${view.app?.releaseUrl}`,
          ];
          if (value?.awardedXp) lines.unshift(`本轮获得 +${value.awardedXp} XP`);
          if (value?.completedNow) lines.unshift('每日目标达成，连续天数 +1');
          if (value?.app) {
            lines.unshift(value.app.opened ? '已尝试打开 Exameow。' : '未能直接打开 Exameow，请使用下载链接。');
          }
          return [{ type: 'text', text: lines.join('\n') }];
        },
      },
      async execute(args, exec) {
        const input = args && typeof args === 'object' ? args : {};
        const result = await runAction(input, exec?.agent?.id || null);
        return { ok: true, ...result };
      },
    }),
  );
}

function resolveStateFile(config) {
  if (typeof config.stateFile === 'string' && config.stateFile.trim()) {
    return path.resolve(config.stateFile.trim());
  }
  return path.join(os.homedir(), '.exameow-study-habit', 'state.json');
}

function clampGoal(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return DEFAULT_GOAL;
  return Math.min(100, Math.max(1, Math.round(number)));
}

function clampCount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1;
  return Math.min(100, Math.max(1, Math.round(number)));
}

function normalizeTime(value) {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(String(value).trim());
  if (!match) throw new Error('提醒时间格式应为 HH:mm');
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = Number(match[3] || 0);
  if (hour > 23 || minute > 59 || second > 59) {
    throw new Error('提醒时间超出范围');
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}

function normalizeTimeZone(value) {
  const timeZone = String(value || '').trim();
  if (!timeZone) throw new Error('缺少时区');
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
  } catch {
    throw new Error(`无效的时区：${timeZone}`);
  }
  return timeZone;
}

function dateKey(date, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
    const pick = (type) => parts.find((part) => part.type === type)?.value;
    return `${pick('year')}-${pick('month')}-${pick('day')}`;
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function appCandidates() {
  const home = os.homedir();
  if (process.platform === 'darwin') {
    return [
      path.join(home, 'Applications', 'Exameow.app'),
      '/Applications/Exameow.app',
    ];
  }
  if (process.platform === 'win32') {
    const local = process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
    const programFiles = process.env.PROGRAMFILES || 'C:\\Program Files';
    return [
      path.join(local, 'Programs', 'Exameow', 'Exameow.exe'),
      path.join(programFiles, 'Exameow', 'Exameow.exe'),
    ];
  }
  return [
    '/usr/bin/exameow',
    '/usr/local/bin/exameow',
    path.join(home, '.local', 'bin', 'exameow'),
  ];
}

function isAppInstalled() {
  return appCandidates().some((candidate) => existsSync(candidate));
}

async function openApp() {
  const installed = isAppInstalled();
  try {
    if (process.platform === 'darwin') {
      try {
        await execFileAsync('open', ['-b', APP_ID], { timeout: 8000 });
      } catch {
        await execFileAsync('open', ['-a', 'Exameow'], { timeout: 8000 });
      }
    } else if (process.platform === 'win32') {
      const candidate = appCandidates().find((item) => existsSync(item));
      if (candidate) {
        await execFileAsync(candidate, [], { timeout: 8000, windowsHide: true });
      } else {
        await execFileAsync('cmd', ['/c', 'start', '', 'exameow'], {
          timeout: 8000,
          windowsHide: true,
        });
      }
    } else {
      const candidate = appCandidates().find((item) => existsSync(item));
      await execFileAsync(candidate || 'exameow', [], { timeout: 8000 });
    }
    return { ok: true, opened: true, installed, releaseUrl: RELEASE_URL };
  } catch (error) {
    return {
      ok: false,
      opened: false,
      installed,
      releaseUrl: RELEASE_URL,
      error: String(error?.message || error),
    };
  }
}
