window.__ModuleLoader__.load({
  id: 'exameow-dsh-habit',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'exameowHabit';
    const API = '/exameow-habit';
    const PANEL_ID = 'exameow-study';
    const RELEASE_URL = 'https://github.com/heshengtao/exameow/releases/latest';

    const EN = {
      'nav.title': 'Daily Study',
      'page.title': 'Daily Study',
      'page.subtitle': 'A little every day, keep the streak.',
      'page.openApp': 'Open Exameow',
      'page.downloadApp': 'Download Exameow',
      'page.loading': 'Loading study record…',
      'page.error': 'Could not load study data.',
      'page.retry': 'Retry',
      'page.xp': 'XP',
      'page.questionsShort': 'q',
      'overview.streak': 'day streak',
      'overview.best': 'Best streak',
      'overview.progress': "Today's progress",
      'overview.remaining': 'left',
      'overview.questions': 'questions',
      'overview.done': "Today's goal is complete.",
      'overview.finish': 'Finish today',
      'overview.finished': 'Done today',
      'overview.logOne': '+1 question',
      'overview.logFive': '+5 questions',
      'week.title': 'This week',
      'week.hint': 'Questions completed per day',
      'week.today': 'Today',
      'settings.title': 'Settings',
      'settings.goal': 'Daily goal',
      'settings.goalHint': 'Questions you plan to finish each day.',
      'settings.save': 'Save',
      'settings.reminder': 'Daily reminder',
      'settings.reminderHint': 'DSH sends the reminder into the selected session at the chosen time.',
      'settings.reminderOn': 'On',
      'settings.reminderOff': 'Off',
      'settings.reminderLocal': 'This DSH build has no schedule service, so timed reminders are unavailable.',
      'settings.time': 'Time',
      'settings.session': 'Reminder session',
      'settings.sessionHint': 'The reminder arrives as a message in this session.',
      'settings.noSession': 'Open or create a session first.',
      'settings.unknownSession': 'Original session',
      'settings.untitledSession': 'Untitled session',
      'settings.saveReminder': 'Save reminder',
      'settings.app': 'Exameow',
      'settings.appInstalled': 'Desktop app detected.',
      'settings.appMissing': 'Desktop app not detected.',
      'settings.open': 'Open',
      'settings.download': 'Download',
      'settings.dataNote': 'Study data stays on this device.',
      'toast.logged': 'Practice recorded.',
      'toast.goal': 'Daily goal updated.',
      'toast.reminderOn': 'Daily reminder enabled.',
      'toast.reminderOff': 'Daily reminder disabled.',
      'toast.reminderChanged': 'Reminder updated.',
      'toast.checkin': "Today's goal is complete.",
      'toast.already': 'Today is already complete.',
      'toast.opened': 'Opening Exameow…',
      'toast.openFailed': 'Could not open Exameow; use Download instead.',
      'toast.error': 'Something went wrong. Try again.',
      'toast.noSession': 'Choose a session first.',
      'toast.localOnly': 'This DSH build cannot schedule reminders.',
    };

    const ZH = {
      'nav.title': '每日学习',
      'page.title': '每日学习',
      'page.subtitle': '每天一点，保持连续。',
      'page.openApp': '打开 Exameow',
      'page.downloadApp': '下载 Exameow',
      'page.loading': '正在读取学习记录…',
      'page.error': '暂时无法读取学习数据。',
      'page.retry': '重试',
      'page.xp': 'XP',
      'page.questionsShort': '题',
      'overview.streak': '天连续',
      'overview.best': '最长连续',
      'overview.progress': '今日进度',
      'overview.remaining': '还差',
      'overview.questions': '题',
      'overview.done': '今日目标已完成。',
      'overview.finish': '完成今日',
      'overview.finished': '今日已完成',
      'overview.logOne': '+1 题',
      'overview.logFive': '+5 题',
      'week.title': '本周',
      'week.hint': '每天的完成题数',
      'week.today': '今天',
      'settings.title': '设置',
      'settings.goal': '每日目标',
      'settings.goalHint': '每天计划完成的题数。',
      'settings.save': '保存',
      'settings.reminder': '每日提醒',
      'settings.reminderHint': 'DSH 会在设定时间把提醒发到选中的会话。',
      'settings.reminderOn': '已开启',
      'settings.reminderOff': '已关闭',
      'settings.reminderLocal': '当前 DSH 没有 schedule 服务，无法创建到点提醒。',
      'settings.time': '时间',
      'settings.session': '提醒会话',
      'settings.sessionHint': '提醒会作为一条消息发送到这个会话。',
      'settings.noSession': '请先打开或创建一个会话。',
      'settings.unknownSession': '原提醒会话',
      'settings.untitledSession': '未命名会话',
      'settings.saveReminder': '保存提醒',
      'settings.app': 'Exameow',
      'settings.appInstalled': '已检测到桌面版。',
      'settings.appMissing': '未检测到桌面版。',
      'settings.open': '打开',
      'settings.download': '下载',
      'settings.dataNote': '学习数据只保存在本机。',
      'toast.logged': '已记录练习。',
      'toast.goal': '每日目标已更新。',
      'toast.reminderOn': '每日提醒已开启。',
      'toast.reminderOff': '每日提醒已关闭。',
      'toast.reminderChanged': '提醒已更新。',
      'toast.checkin': '今日目标已完成。',
      'toast.already': '今天已经完成了。',
      'toast.opened': '正在打开 Exameow…',
      'toast.openFailed': '无法打开 Exameow，请使用「下载」。',
      'toast.error': '操作失败，请重试。',
      'toast.noSession': '请先选择一个会话。',
      'toast.localOnly': '当前 DSH 无法创建定时提醒。',
    };

    let rootCtx = null;

    function useActiveLocale(ctx) {
      const [active, setActive] = React.useState(() => ctx?.locale?.getLocale?.().active || 'en');
      React.useEffect(() => {
        if (!ctx?.locale?.subscribe) return undefined;
        return ctx.locale.subscribe(() => setActive(ctx.locale.getLocale().active));
      }, [ctx]);
      return active;
    }

    function useHabit(ctx) {
      const [state, setState] = React.useState(null);
      const [error, setError] = React.useState(null);
      const [busy, setBusy] = React.useState('');

      const load = React.useCallback(async () => {
        try {
          const response = await fetch(`${API}/state`, {
            cache: 'no-store',
            headers: { accept: 'application/json' },
            credentials: 'same-origin',
          });
          const body = await response.json().catch(() => ({}));
          if (!response.ok || !body.ok) throw new Error(body.error || `HTTP ${response.status}`);
          setState(body.state);
          setError(null);
        } catch (failure) {
          setError(String(failure?.message || failure));
        }
      }, []);

      React.useEffect(() => {
        load();
        const timer = setInterval(() => {
          if (!document.hidden) load();
        }, 60000);
        const onFocus = () => load();
        const onVisibility = () => {
          if (!document.hidden) load();
        };
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
          clearInterval(timer);
          window.removeEventListener('focus', onFocus);
          document.removeEventListener('visibilitychange', onVisibility);
        };
      }, [load]);

      React.useEffect(() => {
        const ping = setTimeout(() => {
          fetch(`${API}/action`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ action: 'client_ready' }),
          }).catch(() => {});
        }, 300);
        return () => clearTimeout(ping);
      }, []);

      const act = React.useCallback(async (action, payload = {}) => {
        setBusy(action);
        try {
          const response = await fetch(`${API}/action`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              accept: 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ action, ...payload }),
          });
          const body = await response.json().catch(() => ({}));
          if (!response.ok || !body.ok) throw new Error(body.error || `HTTP ${response.status}`);
          if (body.state) setState(body.state);
          setError(null);
          return body;
        } catch (failure) {
          setError(String(failure?.message || failure));
          throw failure;
        } finally {
          setBusy('');
        }
      }, []);

      return { state, error, busy, load, act };
    }

    function toMillis(value) {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = Date.parse(value);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      return 0;
    }

    function useRecentSessions(props, state, t) {
      const sessions = props.useSessions ? props.useSessions((value) => value) : null;
      const workspaces = props.useWorkspaces ? props.useWorkspaces((value) => value) : null;
      return React.useMemo(() => {
        const byId = sessions?.byId && typeof sessions.byId === 'object' ? sessions.byId : {};
        const archived = new Set(workspaces?.archivedSessionIds || []);
        const rows = Object.values(byId)
          .filter((session) => session && session.id && !session.blank && !archived.has(session.id))
          .sort((left, right) => toMillis(right.updatedAt) - toMillis(left.updatedAt))
          .slice(0, 10)
          .map((session) => ({
            id: session.id,
            title: (session.title || '').trim() || t('settings.untitledSession'),
          }));
        const preferred = state?.reminder?.sessionId;
        if (preferred && !rows.some((row) => row.id === preferred)) {
          rows.unshift({ id: preferred, title: t('settings.unknownSession') });
        }
        return rows;
      }, [sessions, workspaces, state?.reminder?.sessionId, t]);
    }

    function formatTime(value) {
      if (typeof value !== 'string') return '20:00';
      const match = /^(\d{1,2}):(\d{2})/.exec(value);
      if (!match) return '20:00';
      return `${match[1].padStart(2, '0')}:${match[2]}`;
    }

    function systemTimeZone() {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    }

    function fallbackWeek(view) {
      const rows = [];
      for (let offset = 6; offset >= 0; offset -= 1) {
        const date = new Date(Date.now() - offset * 86400000);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        rows.push({
          date: key,
          count: offset === 0 ? view.todayCount : 0,
          done: offset === 0 ? view.done : false,
        });
      }
      return rows;
    }

    function weekLabel(date, today, active, t) {
      if (date === today) return t('week.today');
      const parsed = new Date(`${date}T12:00:00`);
      if (Number.isNaN(parsed.getTime())) return date.slice(5);
      const locale = active === 'zh' ? 'zh-CN' : active || 'en';
      try {
        return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(parsed);
      } catch {
        return date.slice(5);
      }
    }

    function FlameIcon() {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: 22,
          height: 22,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
        },
        h('path', {
          d: 'M12 3.1c1.4 3.2-1.7 4.3-1.7 7 0 1.4.9 2.4 2.1 2.4 1.4 0 2.3-1.1 2.3-2.5 2.2 2.1 3.5 4.3 3.5 6.8A6.7 6.7 0 1 1 6.8 10c0-2.6 1.7-4.8 5.2-6.9Z',
        }),
      );
    }

    function CheckIcon() {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: 15,
          height: 15,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
        },
        h('path', { d: 'm5 12 4.5 4.5L19 7' }),
      );
    }

    function DownloadIcon() {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: 14,
          height: 14,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.8,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
        },
        h('path', { d: 'M12 4v11m0 0 4-4m-4 4-4-4M5 20h14' }),
      );
    }

    function OpenIcon() {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: 14,
          height: 14,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.8,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
        },
        h('path', { d: 'M14 4h6v6M20 4l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4' }),
      );
    }

    function StudyIcon(props) {
      const size = Number(props?.size) || 16;
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
        },
        h('rect', { x: 2.25, y: 3.25, width: 11.5, height: 10.5, rx: 2 }),
        h('path', { d: 'M5.25 2v2.5M10.75 2v2.5M2.5 6.5h11' }),
        h('path', { d: 'm5.4 9.2 1.5 1.5 3.7-3.7' }),
      );
    }

    function StudyPage(props) {
      const ctx = rootCtx;
      const t = typeof props.t === 'function' ? props.t : (key) => key;
      const active = useActiveLocale(ctx);
      const { state, error, busy, load, act } = useHabit(ctx);
      const sessions = useRecentSessions(props, state, t);

      const [goalDraft, setGoalDraft] = React.useState(10);
      const [timeDraft, setTimeDraft] = React.useState('20:00');
      const [selectedSession, setSelectedSession] = React.useState('');
      const [notice, setNotice] = React.useState(null);
      const [opening, setOpening] = React.useState(false);

      React.useEffect(() => {
        if (!state) return;
        setGoalDraft(state.goal);
      }, [state?.goal]);

      React.useEffect(() => {
        if (!state) return;
        setTimeDraft(formatTime(state.reminder?.time));
      }, [state?.reminder?.time]);

      React.useEffect(() => {
        if (sessions.length === 0) {
          if (selectedSession) setSelectedSession('');
          return;
        }
        if (selectedSession && sessions.some((session) => session.id === selectedSession)) return;
        const preferred = state?.reminder?.sessionId;
        const next = preferred && sessions.some((session) => session.id === preferred)
          ? preferred
          : sessions[0].id;
        setSelectedSession(next);
      }, [sessions, selectedSession, state?.reminder?.sessionId]);

      React.useEffect(() => {
        if (!notice) return undefined;
        const timer = setTimeout(() => setNotice(null), 3200);
        return () => clearTimeout(timer);
      }, [notice]);

      const showNotice = (tone, text) => setNotice({ tone, text });

      const view = state || {
        goal: 10,
        today: '',
        todayCount: 0,
        remaining: 10,
        done: false,
        progress: 0,
        streak: 0,
        bestStreak: 0,
        xp: 0,
        level: 1,
        levelXp: 0,
        levelSpan: 100,
        recent: [],
        reminder: { enabled: false, time: '20:00', timeZone: systemTimeZone(), sessionId: null, localOnly: false },
        app: { installed: false, releaseUrl: RELEASE_URL },
        scheduleAvailable: true,
      };

      const recent = Array.isArray(view.recent) && view.recent.length === 7 ? view.recent : fallbackWeek(view);
      const progress = view.done ? 100 : Math.max(0, Math.min(100, view.progress || 0));
      const reminderTime = formatTime(view.reminder?.time);
      const reminderChanged = Boolean(view.reminder?.enabled)
        && (timeDraft !== reminderTime || (selectedSession && selectedSession !== view.reminder?.sessionId));
      const canRemind = view.scheduleAvailable !== false && sessions.length > 0;

      const reminderHint = view.scheduleAvailable === false
        ? t('settings.reminderLocal')
        : sessions.length === 0
          ? t('settings.noSession')
          : view.reminder?.enabled
            ? `${t('settings.reminderOn')} · ${reminderTime}`
            : t('settings.reminderHint');

      const onLog = async (count) => {
        try {
          const result = await act('log', { count });
          if (result.completedNow) showNotice('success', t('toast.checkin'));
          else showNotice('success', `${t('toast.logged')} +${result.awardedXp || 0} ${t('page.xp')}`);
        } catch {
          showNotice('error', t('toast.error'));
        }
      };

      const onCheckin = async () => {
        try {
          const result = await act('checkin');
          showNotice('success', result.alreadyDone ? t('toast.already') : t('toast.checkin'));
        } catch {
          showNotice('error', t('toast.error'));
        }
      };

      const onGoal = async () => {
        try {
          await act('set_goal', { goal: goalDraft });
          showNotice('success', t('toast.goal'));
        } catch {
          showNotice('error', t('toast.error'));
        }
      };

      const onToggleReminder = async () => {
        if (!state) return;
        try {
          if (view.reminder?.enabled) {
            await act('clear_reminder');
            showNotice('success', t('toast.reminderOff'));
            return;
          }
          if (!view.scheduleAvailable) {
            showNotice('error', t('toast.localOnly'));
            return;
          }
          if (!selectedSession) {
            showNotice('error', t('toast.noSession'));
            return;
          }
          const result = await act('set_reminder', {
            time: timeDraft,
            time_zone: systemTimeZone(),
            sessionId: selectedSession,
          });
          showNotice(result.localOnly ? 'error' : 'success', result.localOnly ? t('toast.localOnly') : t('toast.reminderOn'));
        } catch {
          showNotice('error', t('toast.error'));
        }
      };

      const onSaveReminder = async () => {
        if (!selectedSession) {
          showNotice('error', t('toast.noSession'));
          return;
        }
        try {
          const result = await act('set_reminder', {
            time: timeDraft,
            time_zone: systemTimeZone(),
            sessionId: selectedSession,
          });
          showNotice(result.localOnly ? 'error' : 'success', result.localOnly ? t('toast.localOnly') : t('toast.reminderChanged'));
        } catch {
          showNotice('error', t('toast.error'));
        }
      };

      const onOpenApp = async () => {
        if (!view.app?.installed) {
          window.open(view.app?.releaseUrl || RELEASE_URL, '_blank', 'noopener,noreferrer');
          return;
        }
        setOpening(true);
        try {
          const result = await act('open_app', { sessionId: selectedSession || undefined });
          if (result.app?.opened) {
            showNotice('success', t('toast.opened'));
          } else {
            showNotice('error', t('toast.openFailed'));
          }
        } catch {
          showNotice('error', t('toast.openFailed'));
        } finally {
          setOpening(false);
        }
      };

      const header = h(
        'header',
        { className: 'exh-header' },
        h(
          'div',
          { className: 'exh-headerText' },
          h('h1', { className: 'exh-title' }, t('page.title')),
          h('p', { className: 'exh-subtitle' }, t('page.subtitle')),
        ),
        state
          ? h(
              'div',
              { className: 'exh-headerActions' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'exh-btn exh-btnPrimary',
                  onClick: onOpenApp,
                  disabled: opening,
                },
                view.app?.installed ? h(OpenIcon) : h(DownloadIcon),
                h('span', null, view.app?.installed ? t('page.openApp') : t('page.downloadApp')),
              ),
            )
          : null,
      );

      let content;
      if (!state) {
        content = h(
          'div',
          { className: 'exh-panel exh-empty' },
          error
            ? h(
                React.Fragment,
                null,
                h('div', { className: 'exh-emptyTitle' }, t('page.error')),
                h('div', { className: 'exh-emptyHint' }, error),
                h('button', { type: 'button', className: 'exh-btn exh-btnSecondary', onClick: load }, t('page.retry')),
              )
            : h('div', { className: 'exh-emptyTitle' }, t('page.loading')),
        );
      } else {
        content = h(
          React.Fragment,
          null,
          notice
            ? h(
                'div',
                {
                  className: `exh-notice exh-notice-${notice.tone}`,
                  role: 'status',
                  'aria-live': 'polite',
                },
                notice.text,
              )
            : null,
          h(
            'section',
            { className: 'exh-panel exh-overview', 'aria-label': t('overview.progress') },
            h(
              'div',
              { className: 'exh-overviewMain' },
              h(
                'div',
                { className: 'exh-streakBox' },
                h('div', { className: 'exh-flame' }, h(FlameIcon)),
                h(
                  'div',
                  { className: 'exh-streakText' },
                  h('div', { className: 'exh-big' }, view.streak),
                  h('div', { className: 'exh-caption' }, t('overview.streak')),
                ),
              ),
              h(
                'div',
                { className: 'exh-progressBlock' },
                h(
                  'div',
                  { className: 'exh-progressHead' },
                  h('span', null, t('overview.progress')),
                  h('strong', null, `${view.todayCount} / ${view.goal} ${t('overview.questions')}`),
                ),
                h(
                  'div',
                  {
                    className: 'exh-bar',
                    role: 'progressbar',
                    'aria-valuemin': 0,
                    'aria-valuemax': 100,
                    'aria-valuenow': progress,
                  },
                  h('span', { className: 'exh-barFill', style: { width: `${progress}%` } }),
                ),
                h(
                  'div',
                  { className: 'exh-progressFoot' },
                  view.done
                    ? t('overview.done')
                    : `${t('overview.remaining')} ${view.remaining} ${t('overview.questions')}`,
                ),
              ),
              h(
                'div',
                { className: 'exh-stats' },
                h(
                  'div',
                  { className: 'exh-stat' },
                  h('span', { className: 'exh-statValue' }, `Lv.${view.level}`),
                  h('span', { className: 'exh-statLabel' }, `${view.levelXp}/${view.levelSpan} ${t('page.xp')}`),
                ),
                h(
                  'div',
                  { className: 'exh-stat' },
                  h('span', { className: 'exh-statValue' }, view.bestStreak),
                  h('span', { className: 'exh-statLabel' }, t('overview.best')),
                ),
              ),
            ),
            h(
              'div',
              { className: 'exh-quick' },
              h('button', { type: 'button', className: 'exh-btn exh-btnSecondary exh-btnSm', onClick: () => onLog(1), disabled: Boolean(busy) }, t('overview.logOne')),
              h('button', { type: 'button', className: 'exh-btn exh-btnSecondary exh-btnSm', onClick: () => onLog(5), disabled: Boolean(busy) }, t('overview.logFive')),
              h(
                'button',
                {
                  type: 'button',
                  className: 'exh-btn exh-btnPrimary exh-btnSm',
                  onClick: onCheckin,
                  disabled: Boolean(busy) || view.done,
                },
                view.done ? h(CheckIcon) : null,
                h('span', null, view.done ? t('overview.finished') : t('overview.finish')),
              ),
            ),
            h(
              'div',
              { className: 'exh-weekBlock' },
              h(
                'div',
                { className: 'exh-sectionHead' },
                h('h2', { className: 'exh-sectionTitle' }, t('week.title')),
                h('span', { className: 'exh-sectionHint' }, t('week.hint')),
              ),
              h(
                'div',
                { className: 'exh-week' },
                recent.map((day) => {
                  const percent = view.goal > 0
                    ? Math.min(100, Math.round((day.count / view.goal) * 100))
                    : 100;
                  const height = day.count > 0 ? Math.max(6, percent) : 3;
                  return h(
                    'div',
                    {
                      key: day.date,
                      className: [
                        'exh-day',
                        day.done ? 'exh-dayDone' : '',
                        day.date === view.today ? 'exh-dayToday' : '',
                      ].filter(Boolean).join(' '),
                      title: `${day.date} · ${day.count}/${view.goal}`,
                    },
                    h('span', { className: 'exh-dayLabel' }, weekLabel(day.date, view.today, active, t)),
                    h('div', { className: 'exh-dayBar' }, h('span', { className: 'exh-dayFill', style: { height: `${height}%` } })),
                    h('span', { className: 'exh-dayCount' }, day.count),
                  );
                }),
              ),
            ),
          ),
          h(
            'section',
            { className: 'exh-panel exh-settings', 'aria-label': t('settings.title') },
            h('h2', { className: 'exh-settingsTitle' }, t('settings.title')),
            h(
              'div',
              { className: 'exh-rows' },
              h(
                'div',
                { className: 'exh-row' },
                h(
                  'div',
                  { className: 'exh-rowText' },
                  h('div', { className: 'exh-rowTitle' }, t('settings.goal')),
                  h('div', { className: 'exh-rowHint' }, t('settings.goalHint')),
                ),
                h(
                  'div',
                  { className: 'exh-rowControl' },
                  h('button', {
                    type: 'button',
                    className: 'exh-step',
                    onClick: () => setGoalDraft((value) => Math.max(1, value - 1)),
                    disabled: Boolean(busy),
                    'aria-label': '-1',
                  }, '−'),
                  h('span', { className: 'exh-value' }, goalDraft),
                  h('span', { className: 'exh-unit' }, t('page.questionsShort')),
                  h('button', {
                    type: 'button',
                    className: 'exh-step',
                    onClick: () => setGoalDraft((value) => Math.min(100, value + 1)),
                    disabled: Boolean(busy),
                    'aria-label': '+1',
                  }, '+'),
                  h('button', {
                    type: 'button',
                    className: 'exh-btn exh-btnSecondary exh-btnSm',
                    onClick: onGoal,
                    disabled: Boolean(busy) || goalDraft === view.goal,
                  }, t('settings.save')),
                ),
              ),
              h(
                'div',
                { className: 'exh-row' },
                h(
                  'div',
                  { className: 'exh-rowText' },
                  h('div', { className: 'exh-rowTitle' }, t('settings.reminder')),
                  h('div', { className: 'exh-rowHint' }, reminderHint),
                ),
                h(
                  'div',
                  { className: 'exh-rowControl' },
                  h(
                    'button',
                    {
                      type: 'button',
                      role: 'switch',
                      'aria-checked': Boolean(view.reminder?.enabled),
                      'aria-label': t('settings.reminder'),
                      className: `exh-switch ${view.reminder?.enabled ? 'exh-switchOn' : ''}`,
                      onClick: onToggleReminder,
                      disabled: Boolean(busy) || (!view.reminder?.enabled && !canRemind),
                    },
                    h('span', { className: 'exh-knob' }),
                  ),
                  h('input', {
                    type: 'time',
                    className: 'exh-time',
                    value: timeDraft,
                    onChange: (event) => setTimeDraft(event.target.value || '20:00'),
                    disabled: Boolean(busy) || !canRemind,
                    'aria-label': t('settings.time'),
                  }),
                  reminderChanged
                    ? h('button', {
                        type: 'button',
                        className: 'exh-btn exh-btnSecondary exh-btnSm',
                        onClick: onSaveReminder,
                        disabled: Boolean(busy),
                      }, t('settings.saveReminder'))
                    : null,
                ),
              ),
              h(
                'div',
                { className: 'exh-row' },
                h(
                  'div',
                  { className: 'exh-rowText' },
                  h('div', { className: 'exh-rowTitle' }, t('settings.session')),
                  h('div', { className: 'exh-rowHint' }, sessions.length ? t('settings.sessionHint') : t('settings.noSession')),
                ),
                h(
                  'div',
                  { className: 'exh-rowControl' },
                  sessions.length
                    ? h(
                        'select',
                        {
                          className: 'exh-select',
                          value: selectedSession,
                          onChange: (event) => setSelectedSession(event.target.value),
                          disabled: Boolean(busy) || !sessions.length,
                          'aria-label': t('settings.session'),
                        },
                        sessions.map((session) => h('option', { key: session.id, value: session.id }, session.title)),
                      )
                    : h('span', { className: 'exh-muted' }, t('settings.noSession')),
                ),
              ),
              h(
                'div',
                { className: 'exh-row' },
                h(
                  'div',
                  { className: 'exh-rowText' },
                  h('div', { className: 'exh-rowTitle' }, t('settings.app')),
                  h(
                    'div',
                    { className: 'exh-rowHint' },
                    view.app?.installed ? t('settings.appInstalled') : t('settings.appMissing'),
                  ),
                ),
                h(
                  'div',
                  { className: 'exh-rowControl' },
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'exh-btn exh-btnSecondary exh-btnSm',
                      onClick: onOpenApp,
                      disabled: opening,
                    },
                    view.app?.installed ? h(OpenIcon) : h(DownloadIcon),
                    h('span', null, view.app?.installed ? t('settings.open') : t('settings.download')),
                  ),
                  h(
                    'a',
                    {
                      className: 'exh-btn exh-btnGhost exh-btnSm',
                      href: view.app?.releaseUrl || RELEASE_URL,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    },
                    h(DownloadIcon),
                    h('span', null, t('settings.download')),
                  ),
                ),
              ),
            ),
          ),
          h('p', { className: 'exh-note' }, t('settings.dataNote')),
        );
      }

      return h(
        'section',
        { className: 'exh-page', lang: active === 'zh' ? 'zh-CN' : active || 'en' },
        h('style', { key: 'exh-page-style' }, CSS),
        h('div', { className: 'exh-shell' }, header, content),
      );
    }

    const CSS = `
      .exh-page {
        height: 100%;
        min-height: 0;
        overflow-y: auto;
        box-sizing: border-box;
        background: var(--dsw-alias-bg-base, #fff);
        color: var(--dsw-alias-label-primary, #0f1115);
        font-family: inherit;
        font-size: 14px;
        line-height: 1.5;
      }
      .exh-page *, .exh-page *::before, .exh-page *::after { box-sizing: border-box; }
      .exh-shell {
        width: 100%;
        max-width: 1056px;
        margin: 0 auto;
        padding: 28px 48px 48px;
      }
      .exh-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 24px;
      }
      .exh-headerText { min-width: 0; }
      .exh-title {
        margin: 0;
        color: var(--dsw-alias-label-primary, #0f1115);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        letter-spacing: 0;
      }
      .exh-subtitle {
        margin: 4px 0 0;
        color: var(--dsw-alias-label-secondary, #61666b);
        font-size: 13px;
        line-height: 20px;
      }
      .exh-headerActions { display: flex; gap: 8px; flex: 0 0 auto; }
      .exh-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 32px;
        padding: 0 12px;
        border: 1px solid transparent;
        border-radius: 16px;
        background: transparent;
        color: var(--dsw-alias-label-primary, #0f1115);
        font: inherit;
        font-size: 13px;
        line-height: 1;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;
        transition: background .15s ease, border-color .15s ease, opacity .15s ease;
      }
      .exh-btn:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover, rgba(38, 49, 72, .06)); }
      .exh-btn:disabled { opacity: .45; cursor: default; }
      .exh-btnPrimary {
        background: var(--dsw-alias-label-primary, #0f1115);
        color: var(--dsw-alias-bg-base, #fff);
      }
      .exh-btnPrimary:hover:not(:disabled) { opacity: .88; background: var(--dsw-alias-label-primary, #0f1115); }
      .exh-btnSecondary { border-color: var(--dsw-alias-border-l2, rgba(0, 0, 0, .1)); }
      .exh-btnGhost { color: var(--dsw-alias-label-secondary, #61666b); }
      .exh-btnSm { height: 28px; padding: 0 10px; border-radius: 14px; font-size: 12px; }
      .exh-panel {
        margin-bottom: 16px;
        padding: 20px;
        border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, .04));
        border-radius: 16px;
        background: var(--dsw-alias-bg-layer-1, #fff);
      }
      .exh-overview { display: flex; flex-direction: column; gap: 16px; }
      .exh-overviewMain {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.7fr) auto;
        align-items: center;
        gap: 24px;
      }
      .exh-streakBox { display: flex; align-items: center; gap: 12px; min-width: 0; }
      .exh-flame {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        flex: 0 0 auto;
        border-radius: 12px;
        background: rgba(245, 158, 11, .12);
        color: var(--dsw-alias-state-warn-primary, #f59e0b);
      }
      .exh-streakText { min-width: 0; }
      .exh-big {
        color: var(--dsw-alias-label-primary, #0f1115);
        font-size: 28px;
        font-weight: 600;
        line-height: 1.1;
        letter-spacing: -.02em;
        font-variant-numeric: tabular-nums;
      }
      .exh-caption {
        overflow: hidden;
        color: var(--dsw-alias-label-secondary, #61666b);
        font-size: 12px;
        line-height: 17px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .exh-progressBlock { min-width: 0; }
      .exh-progressHead {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        color: var(--dsw-alias-label-secondary, #61666b);
        font-size: 13px;
        line-height: 18px;
      }
      .exh-progressHead strong {
        color: var(--dsw-alias-label-primary, #0f1115);
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }
      .exh-bar {
        width: 100%;
        height: 8px;
        margin: 8px 0 6px;
        border-radius: 999px;
        background: var(--dsw-alias-interactive-bg-hover, rgba(38, 49, 72, .08));
        overflow: hidden;
      }
      .exh-barFill {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: var(--dsw-alias-state-warn-primary, #f59e0b);
        transition: width .35s cubic-bezier(.2, .8, .2, 1);
      }
      .exh-progressFoot { color: var(--dsw-alias-label-secondary, #61666b); font-size: 12px; line-height: 17px; }
      .exh-stats { display: flex; gap: 28px; }
      .exh-stat { display: flex; flex-direction: column; align-items: flex-end; min-width: 0; }
      .exh-statValue {
        color: var(--dsw-alias-label-primary, #0f1115);
        font-size: 20px;
        font-weight: 600;
        line-height: 1.2;
        font-variant-numeric: tabular-nums;
      }
      .exh-statLabel { color: var(--dsw-alias-label-secondary, #61666b); font-size: 12px; line-height: 17px; }
      .exh-quick {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding-top: 14px;
        border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, .04));
      }
      .exh-weekBlock { padding-top: 14px; border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, .04)); }
      .exh-sectionHead {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
      }
      .exh-sectionTitle {
        margin: 0;
        color: var(--dsw-alias-label-primary, #0f1115);
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
      }
      .exh-sectionHint { color: var(--dsw-alias-label-secondary, #61666b); font-size: 12px; line-height: 17px; }
      .exh-week { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 10px; }
      .exh-day { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; }
      .exh-dayLabel {
        overflow: hidden;
        max-width: 100%;
        color: var(--dsw-alias-label-secondary, #61666b);
        font-size: 11px;
        line-height: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .exh-dayBar {
        display: flex;
        align-items: flex-end;
        width: 100%;
        height: 36px;
        border-radius: 6px;
        background: var(--dsw-alias-interactive-bg-hover, rgba(38, 49, 72, .06));
        overflow: hidden;
      }
      .exh-dayFill {
        display: block;
        width: 100%;
        border-radius: 6px 6px 0 0;
        background: var(--dsw-alias-state-warn-primary, #f59e0b);
        transition: height .35s cubic-bezier(.2, .8, .2, 1);
      }
      .exh-dayDone .exh-dayFill { background: var(--dsw-alias-state-success-primary, #22c55e); }
      .exh-dayCount {
        color: var(--dsw-alias-label-secondary, #61666b);
        font-size: 11px;
        line-height: 16px;
        font-variant-numeric: tabular-nums;
      }
      .exh-dayToday .exh-dayLabel { color: var(--dsw-alias-label-primary, #0f1115); font-weight: 500; }
      .exh-dayToday .exh-dayBar { outline: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, .1)); outline-offset: -1px; }
      .exh-settingsTitle {
        margin: 0 0 4px;
        color: var(--dsw-alias-label-primary, #0f1115);
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
      }
      .exh-rows { display: flex; flex-direction: column; }
      .exh-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        min-height: 56px;
        padding: 12px 0;
        border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, .04));
      }
      .exh-rows .exh-row:first-child { border-top: 0; }
      .exh-rowText { min-width: 0; }
      .exh-rowTitle {
        color: var(--dsw-alias-label-primary, #0f1115);
        font-size: 14px;
        line-height: 20px;
      }
      .exh-rowHint {
        margin-top: 2px;
        color: var(--dsw-alias-label-secondary, #61666b);
        font-size: 12px;
        line-height: 17px;
      }
      .exh-rowControl {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 8px;
        flex: 0 0 auto;
      }
      .exh-step {
        display: inline-grid;
        place-items: center;
        width: 28px;
        height: 28px;
        padding: 0;
        border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, .1));
        border-radius: 8px;
        background: transparent;
        color: var(--dsw-alias-label-primary, #0f1115);
        font: inherit;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
      }
      .exh-step:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover, rgba(38, 49, 72, .06)); }
      .exh-step:disabled { opacity: .45; cursor: default; }
      .exh-value {
        min-width: 22px;
        color: var(--dsw-alias-label-primary, #0f1115);
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }
      .exh-unit { margin-right: 2px; color: var(--dsw-alias-label-secondary, #61666b); font-size: 12px; }
      .exh-time, .exh-select {
        height: 30px;
        padding: 0 8px;
        border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, .1));
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-1, #fff);
        color: var(--dsw-alias-label-primary, #0f1115);
        font: inherit;
        font-size: 12px;
        line-height: 1;
      }
      .exh-time { width: 82px; font-variant-numeric: tabular-nums; }
      .exh-select { max-width: 260px; }
      .exh-time:disabled, .exh-select:disabled { opacity: .45; }
      .exh-switch {
        position: relative;
        width: 34px;
        height: 20px;
        padding: 0;
        border: 0;
        border-radius: 999px;
        background: rgba(129, 133, 140, .35);
        cursor: pointer;
        transition: background .18s ease;
      }
      .exh-switchOn { background: var(--dsw-alias-label-primary, #0f1115); }
      .exh-switch:disabled { opacity: .45; cursor: default; }
      .exh-knob {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1px 2px rgba(16, 24, 40, .2);
        transition: transform .18s cubic-bezier(.2, .8, .2, 1);
      }
      .exh-switchOn .exh-knob { transform: translateX(14px); }
      .exh-muted { color: var(--dsw-alias-label-secondary, #61666b); font-size: 12px; }
      .exh-notice {
        margin-bottom: 16px;
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 13px;
        line-height: 20px;
      }
      .exh-notice-success { background: rgba(34, 197, 94, .10); color: var(--dsw-alias-state-success-primary, #15803d); }
      .exh-notice-error { background: rgba(239, 68, 68, .10); color: var(--dsw-alias-state-error-primary, #dc2626); }
      .exh-empty { padding: 48px 20px; text-align: center; }
      .exh-emptyTitle { color: var(--dsw-alias-label-secondary, #61666b); font-size: 14px; line-height: 22px; }
      .exh-emptyHint { margin-top: 4px; color: var(--dsw-alias-label-tertiary, #81858c); font-size: 12px; line-height: 18px; }
      .exh-empty .exh-btn { margin-top: 14px; }
      .exh-note { margin: 4px 0 0; color: var(--dsw-alias-label-tertiary, #81858c); font-size: 12px; line-height: 18px; }
      @media (max-width: 900px) {
        .exh-shell { padding: 24px 24px 40px; }
        .exh-overviewMain { grid-template-columns: 1fr 1fr; }
        .exh-stats { grid-column: 2; justify-content: flex-end; }
      }
      @media (max-width: 680px) {
        .exh-shell { padding: 20px 16px 32px; }
        .exh-header { flex-direction: column; gap: 14px; }
        .exh-headerActions { width: 100%; }
        .exh-headerActions .exh-btn { width: 100%; }
        .exh-overviewMain { grid-template-columns: 1fr; gap: 16px; }
        .exh-stats { grid-column: auto; justify-content: flex-start; gap: 28px; }
        .exh-stat { align-items: flex-start; }
        .exh-row { align-items: flex-start; flex-direction: column; gap: 10px; }
        .exh-rowControl { width: 100%; justify-content: flex-start; }
        .exh-select { max-width: 100%; }
        .exh-week { gap: 6px; }
      }
    `;

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        rootCtx = ctx;
        const t = ctx.locale.bind(NS);
        ctx.effect(() => ctx.locale.register(NS, 'en', EN));
        ctx.effect(() => ctx.locale.register(NS, 'zh', ZH));
        ctx.effect(() =>
          ctx.slots.inject('main', () =>
            ctx.slots.register(
              {
                name: 'main',
                key: PANEL_ID,
                locale: NS,
              },
              StudyPage,
            ),
          ),
        );
        ctx.effect(() =>
          ctx.slots.inject('sidebar.panellist', () =>
            ctx.slots.register(
              {
                name: 'sidebar.panellist',
                id: PANEL_ID,
                order: 20,
                locale: NS,
                label: () => t('nav.title'),
              },
              StudyIcon,
            ),
          ),
        );
      },
    };
  },
});
