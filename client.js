window.__ModuleLoader__.load({
  id: 'exameow-dsh-habit',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'exameowHabit';
    const API = '/exameow-habit';
    const RELEASE_URL = 'https://github.com/heshengtao/exameow/releases/latest';

    const EN = {
      'card.title': "Today's study",
      'card.loading': 'Loading your streak…',
      'card.streak': 'Streak',
      'card.days': 'days',
      'card.best': 'Best',
      'card.level': 'Lv.',
      'card.questions': 'questions',
      'card.questionUnit': 'q',
      'card.today': 'Today',
      'card.remaining': 'left',
      'card.done': 'Done for today',
      'card.go': 'Study now',
      'card.opening': 'Opening…',
      'card.logOne': '+1 question',
      'card.logFive': '+5 questions',
      'card.checkin': 'Finish today',
      'card.checkinDone': 'Today is complete',
      'card.open': 'Open Exameow',
      'card.download': 'Download Exameow',
      'card.reminder': 'Daily reminder',
      'card.reminderOn': 'On',
      'card.reminderOff': 'Off',
      'card.reminderHint': 'DSH sends this reminder into the current session. Keep DSH running.',
      'card.reminderLocal': 'This DSH build has no schedule service, so the reminder only shows while the page is open.',
      'card.reminderTime': 'Reminder time',
      'card.goalLabel': 'Daily goal',
      'card.save': 'Save',
      'card.saved': 'Saved',
      'card.settings': 'Study settings',
      'card.expand': 'Expand study card',
      'card.collapse': 'Collapse study card',
      'card.error': 'Could not load study data',
      'card.retry': 'Retry',
      'card.due': 'Time to study',
      'card.dueHint': 'Your daily goal is still waiting.',
      'card.notInstalled': 'Exameow not detected',
      'card.installed': 'Exameow detected',
      'card.footer': 'Stored locally · never uploaded',
      'card.xpGain': 'XP earned',
      'card.reminderSaved': 'Reminder updated',
      'card.reminderCleared': 'Reminder turned off',
      'card.goalSaved': 'Daily goal updated',
      'card.noSession': 'A session is required for reminders',
      'card.dismiss': 'Dismiss',
      'card.celebrate': 'Daily goal complete',
    };

    const ZH = {
      'card.title': '今日学习',
      'card.loading': '正在读取学习记录…',
      'card.streak': '连续',
      'card.days': '天',
      'card.best': '最佳',
      'card.level': 'Lv.',
      'card.questions': '题',
      'card.questionUnit': '题',
      'card.today': '今天',
      'card.remaining': '还差',
      'card.done': '今日已完成',
      'card.go': '去学习',
      'card.opening': '正在打开…',
      'card.logOne': '+1 题',
      'card.logFive': '+5 题',
      'card.checkin': '完成今日',
      'card.checkinDone': '今天已完成',
      'card.open': '打开 Exameow',
      'card.download': '下载 Exameow',
      'card.reminder': '每日提醒',
      'card.reminderOn': '已开启',
      'card.reminderOff': '已关闭',
      'card.reminderHint': 'DSH 会在这个时间把提醒发到当前会话，请保持 DSH 运行。',
      'card.reminderLocal': '当前 DSH 没有 schedule 服务，提醒只在页面打开时显示。',
      'card.reminderTime': '提醒时间',
      'card.goalLabel': '每日目标',
      'card.save': '保存',
      'card.saved': '已保存',
      'card.settings': '学习设置',
      'card.expand': '展开学习卡片',
      'card.collapse': '收起学习卡片',
      'card.error': '暂时无法读取学习数据',
      'card.retry': '重试',
      'card.due': '该学习啦',
      'card.dueHint': '今天的目标还在等你。',
      'card.notInstalled': '未检测到 Exameow',
      'card.installed': '已检测到 Exameow',
      'card.footer': '数据保存在本机 · 不上传',
      'card.xpGain': '获得 XP',
      'card.reminderSaved': '提醒已更新',
      'card.reminderCleared': '提醒已关闭',
      'card.goalSaved': '每日目标已更新',
      'card.noSession': '提醒需要当前会话',
      'card.dismiss': '知道了',
      'card.celebrate': '今日目标达成',
    };

    let rootCtx = null;

    function useLocale(ctx) {
      const [, force] = React.useState(0);
      React.useEffect(() => {
        if (!ctx?.locale?.subscribe) return undefined;
        return ctx.locale.subscribe(() => force((value) => value + 1));
      }, [ctx]);
      if (!ctx?.locale?.bind) return (key) => key;
      return ctx.locale.bind(NS);
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
          if (!response.ok || !body.ok) {
            throw new Error(body.error || `HTTP ${response.status}`);
          }
          setState(body.state);
          setError(null);
        } catch (failure) {
          setError(String(failure?.message || failure));
        }
      }, []);

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

      React.useEffect(() => {
        let alive = true;
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
          alive = false;
          clearInterval(timer);
          window.removeEventListener('focus', onFocus);
          document.removeEventListener('visibilitychange', onVisibility);
        };
      }, [load]);

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
          if (!response.ok || !body.ok) {
            throw new Error(body.error || `HTTP ${response.status}`);
          }
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

    function readCollapsed() {
      try {
        return window.localStorage.getItem('exameow-habit-collapsed') !== '0';
      } catch {
        return true;
      }
    }

    function writeCollapsed(value) {
      try {
        window.localStorage.setItem('exameow-habit-collapsed', value ? '1' : '0');
      } catch {
        // Private mode or storage disabled.
      }
    }

    function FlameIcon() {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: 20,
          height: 20,
          'aria-hidden': true,
          className: 'exh-flame-svg',
        },
        h('path', {
          d: 'M12 2.7c1.2 2.8-1.5 3.7-1.5 6.1 0 1.2.8 2.1 1.9 2.1 1.2 0 2-.9 2-2.2 2 1.9 3.4 4.1 3.4 6.8A7.8 7.8 0 1 1 5.9 9.6c0-3 2-5.3 4.6-7.8 0 1.8.4 2.7 1.2 3.3-.4-3.2 1-5.1.3-8.4Z',
          fill: 'currentColor',
        }),
      );
    }

    function BellIcon() {
      return h(
        'svg',
        { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': true },
        h('path', {
          d: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.8,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    function ChevronIcon(props) {
      return h(
        'svg',
        { viewBox: '0 0 24 24', width: 16, height: 16, 'aria-hidden': true },
        h('path', {
          d: props.up ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    function CheckIcon() {
      return h(
        'svg',
        { viewBox: '0 0 24 24', width: 16, height: 16, 'aria-hidden': true },
        h('path', {
          d: 'm5 12 4.5 4.5L19 7',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2.2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    function ArrowIcon() {
      return h(
        'svg',
        { viewBox: '0 0 24 24', width: 15, height: 15, 'aria-hidden': true },
        h('path', {
          d: 'M5 12h14m-5-5 5 5-5 5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    function DownloadIcon() {
      return h(
        'svg',
        { viewBox: '0 0 24 24', width: 15, height: 15, 'aria-hidden': true },
        h('path', {
          d: 'M12 3v12m0 0 4-4m-4 4-4-4M4 20h16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    function formatTime(value) {
      if (typeof value !== 'string') return '20:00';
      const match = /^(\d{1,2}):(\d{2})/.exec(value);
      if (!match) return '20:00';
      return `${match[1].padStart(2, '0')}:${match[2]}`;
    }

    function isPast(time) {
      const match = /^(\d{1,2}):(\d{2})/.exec(formatTime(time));
      if (!match) return false;
      const now = new Date();
      return now.getHours() * 60 + now.getMinutes() >= Number(match[1]) * 60 + Number(match[2]);
    }

    function localDayKey() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    function HabitDock(props) {
      const ctx = rootCtx;
      const t = useLocale(ctx);
      const { state, error, busy, load, act } = useHabit(ctx);
      const sessionId = props?.sessionId;
      const [open, setOpen] = React.useState(() => !readCollapsed());
      const [goalDraft, setGoalDraft] = React.useState(10);
      const [timeDraft, setTimeDraft] = React.useState('20:00');
      const [toast, setToast] = React.useState(null);
      const [celebrate, setCelebrate] = React.useState(false);
      const [dismissed, setDismissed] = React.useState(false);
      const [opening, setOpening] = React.useState(false);

      React.useEffect(() => {
        if (state) {
          setGoalDraft(state.goal);
          setTimeDraft(formatTime(state.reminder?.time));
        }
      }, [state?.goal, state?.reminder?.time]);

      React.useEffect(() => {
        if (!state?.today) return;
        try {
          setDismissed(window.localStorage.getItem('exameow-habit-due-dismissed') === state.today);
        } catch {
          setDismissed(false);
        }
      }, [state?.today]);

      React.useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(null), 2600);
        return () => clearTimeout(timer);
      }, [toast]);

      React.useEffect(() => {
        if (!celebrate) return undefined;
        const timer = setTimeout(() => setCelebrate(false), 1600);
        return () => clearTimeout(timer);
      }, [celebrate]);

      const toggleOpen = () => {
        setOpen((value) => {
          writeCollapsed(value);
          return !value;
        });
      };

      const announce = (message) => setToast(message);

      const onLog = async (count) => {
        try {
          const result = await act('log', { count });
          if (result.completedNow) {
            setCelebrate(true);
            announce(`${t('card.celebrate')} · +${result.awardedXp || 0} XP`);
          } else if (result.awardedXp) {
            announce(`+${result.awardedXp} XP`);
          }
        } catch {
          // The shared error strip explains the failure.
        }
      };

      const onCheckin = async () => {
        try {
          const result = await act('checkin');
          if (result.completedNow) {
            setCelebrate(true);
            announce(`${t('card.celebrate')} · +${result.awardedXp || 0} XP`);
          } else {
            announce(t('card.checkinDone'));
          }
        } catch {
          // The shared error strip explains the failure.
        }
      };

      const onGoal = async () => {
        try {
          await act('set_goal', { goal: goalDraft });
          announce(t('card.goalSaved'));
        } catch {
          // The shared error strip explains the failure.
        }
      };

      const saveReminder = async () => {
        if (!sessionId) {
          announce(t('card.noSession'));
          return;
        }
        try {
          const result = await act('set_reminder', {
            time: timeDraft,
            time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            sessionId,
          });
          announce(result.localOnly ? t('card.reminderLocal') : t('card.reminderSaved'));
        } catch {
          // The shared error strip explains the failure.
        }
      };

      const onReminder = async () => {
        if (!state) return;
        try {
          if (state.reminder?.enabled) {
            await act('clear_reminder');
            announce(t('card.reminderCleared'));
          } else {
            await saveReminder();
          }
        } catch {
          // The shared error strip explains the failure.
        }
      };

      const onOpen = async () => {
        if (!view.app?.installed) {
          window.open(view.app?.releaseUrl || RELEASE_URL, '_blank', 'noopener,noreferrer');
          return;
        }
        setOpening(true);
        try {
          const result = await act('open_app', { sessionId });
          if (!result.app?.opened) {
            announce(`${t('card.notInstalled')} · ${result.app?.releaseUrl || RELEASE_URL}`);
          }
        } catch {
          announce(t('card.error'));
        } finally {
          setOpening(false);
        }
      };

      const onDownload = () => {
        window.open(state?.app?.releaseUrl || RELEASE_URL, '_blank', 'noopener,noreferrer');
      };

      const dismissDue = () => {
        try {
          if (state?.today) {
            window.localStorage.setItem('exameow-habit-due-dismissed', state.today);
          }
        } catch {
          // Ignore storage failures.
        }
        setDismissed(true);
      };

      if (error && !state) {
        return h(
          'section',
          { className: 'exh-card exh-error', 'aria-live': 'polite' },
          h('style', { key: 'exh-style' }, CSS),
          h('div', { className: 'exh-error-row' },
            h('span', { className: 'exh-error-dot' }),
            h('span', { className: 'exh-error-text' }, `${t('card.error')} · ${error}`),
            h('button', { className: 'exh-small', onClick: load }, t('card.retry')),
          ),
        );
      }

      const view = state || {
        goal: 10,
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
        reminder: { enabled: false, time: '20:00', localOnly: false },
        app: { installed: false, releaseUrl: RELEASE_URL },
        scheduleAvailable: true,
      };

      const due =
        view.reminder?.enabled &&
        !view.done &&
        isPast(view.reminder.time) &&
        !dismissed &&
        (state?.today || localDayKey()) === localDayKey();

      const progress = view.done ? 100 : Math.max(0, Math.min(100, view.progress || 0));
      const questionUnit = t('card.questionUnit');

      return h(
        'section',
        {
          className: [
            'exh-card',
            view.done ? 'exh-is-done' : '',
            due ? 'exh-is-due' : '',
            open ? 'exh-is-open' : '',
          ]
            .filter(Boolean)
            .join(' '),
          'aria-label': t('card.title'),
          'data-exameow-habit': 'true',
        },
        h('style', { key: 'exh-style' }, CSS),
        celebrate ? h('div', { className: 'exh-confetti', 'aria-hidden': true },
          Array.from({ length: 12 }, (_, index) =>
            h('i', { key: index, className: `exh-confetti-bit exh-confetti-${index % 6}` }),
          ),
        ) : null,
        h(
          'div',
          { className: 'exh-main' },
          h('div', { className: 'exh-flame' },
            h(FlameIcon),
            h('span', { className: 'exh-streak' }, view.streak),
          ),
          h(
            'div',
            { className: 'exh-copy' },
            h(
              'div',
              { className: 'exh-title-row' },
              h('strong', { className: 'exh-title' }, t('card.title')),
              h('span', { className: 'exh-level' }, `${t('card.level')}${view.level}`),
              due ? h('span', { className: 'exh-due-chip' }, t('card.due')) : null,
            ),
            h(
              'div',
              { className: 'exh-sub' },
              h('span', { className: 'exh-streak-text' }, `${t('card.streak')} ${view.streak} ${t('card.days')}`),
              h('span', { className: 'exh-dot' }, '·'),
              h('span', view.done ? 'exh-count-done' : '', `${view.todayCount}/${view.goal} ${questionUnit}`),
              h('span', { className: 'exh-dot' }, '·'),
              h('span', { className: 'exh-xp' }, `${view.xp} XP`),
            ),
            h('div', { className: 'exh-bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': progress },
              h('span', { className: 'exh-bar-fill', style: { width: `${progress}%` } }),
            ),
          ),
          h(
            'div',
            { className: 'exh-actions' },
            h(
              'button',
              {
                type: 'button',
                className: 'exh-primary',
                onClick: onOpen,
                disabled: opening || Boolean(busy),
                title: view.app?.installed ? t('card.open') : t('card.download'),
              },
              opening
                ? t('card.opening')
                : view.done
                  ? h(React.Fragment, null, h(CheckIcon), h('span', null, t('card.done')))
                  : h(React.Fragment, null, h('span', null, t('card.go')), h(ArrowIcon)),
            ),
            h(
              'button',
              {
                type: 'button',
                className: `exh-icon ${view.reminder?.enabled ? 'exh-icon-on' : ''}`,
                onClick: toggleOpen,
                'aria-expanded': open,
                'aria-label': open ? t('card.collapse') : t('card.expand'),
                title: t('card.settings'),
              },
              h(BellIcon),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'exh-icon exh-chevron',
                onClick: toggleOpen,
                'aria-label': open ? t('card.collapse') : t('card.expand'),
                tabIndex: -1,
              },
              h(ChevronIcon, { up: open }),
            ),
          ),
        ),
        due
          ? h('div', { className: 'exh-due-strip' },
              h('span', null, `${t('card.due')} · ${t('card.dueHint')}`),
              h('button', { type: 'button', className: 'exh-link', onClick: dismissDue }, t('card.dismiss')),
            )
          : null,
        open
          ? h(
              'div',
              { className: 'exh-panel' },
              h(
                'div',
                { className: 'exh-grid' },
                h(
                  'div',
                  { className: 'exh-field' },
                  h('span', { className: 'exh-label' }, t('card.goalLabel')),
                  h(
                    'div',
                    { className: 'exh-goal-row' },
                    h('button', {
                      type: 'button',
                      className: 'exh-step',
                      onClick: () => setGoalDraft((value) => Math.max(1, value - 1)),
                      'aria-label': '-1',
                    }, '−'),
                    h('strong', { className: 'exh-goal-value' }, goalDraft),
                    h('span', { className: 'exh-unit' }, questionUnit),
                    h('button', {
                      type: 'button',
                      className: 'exh-step',
                      onClick: () => setGoalDraft((value) => Math.min(100, value + 1)),
                      'aria-label': '+1',
                    }, '+'),
                    h('button', {
                      type: 'button',
                      className: 'exh-small',
                      onClick: onGoal,
                      disabled: Boolean(busy) || goalDraft === view.goal,
                    }, t('card.save')),
                  ),
                ),
                h(
                  'div',
                  { className: 'exh-field' },
                  h('span', { className: 'exh-label' }, t('card.reminder')),
                  h(
                    'div',
                    { className: 'exh-reminder-row' },
                    h(
                      'button',
                      {
                        type: 'button',
                        role: 'switch',
                        'aria-checked': Boolean(view.reminder?.enabled),
                        'aria-label': t('card.reminder'),
                        className: `exh-switch ${view.reminder?.enabled ? 'exh-switch-on' : ''}`,
                        onClick: onReminder,
                        disabled: Boolean(busy),
                      },
                      h('span', { className: 'exh-switch-knob' }),
                    ),
                    h('input', {
                      type: 'time',
                      className: 'exh-time',
                      value: timeDraft,
                      onChange: (event) => setTimeDraft(event.target.value || '20:00'),
                      'aria-label': t('card.reminderTime'),
                    }),
                    h('span', { className: 'exh-reminder-state' },
                      view.reminder?.enabled ? t('card.reminderOn') : t('card.reminderOff')),
                    view.reminder?.enabled
                      ? h('button', {
                          type: 'button',
                          className: 'exh-small',
                          onClick: saveReminder,
                          disabled: Boolean(busy) || timeDraft === formatTime(view.reminder.time),
                        }, t('card.save'))
                      : null,
                  ),
                  h('p', { className: 'exh-hint' },
                    (view.reminder?.enabled && view.reminder?.localOnly) || view.scheduleAvailable === false
                      ? t('card.reminderLocal')
                      : t('card.reminderHint')),
                ),
              ),
              h(
                'div',
                { className: 'exh-quick' },
                h('button', { type: 'button', className: 'exh-quiet', onClick: () => onLog(1), disabled: Boolean(busy) }, t('card.logOne')),
                h('button', { type: 'button', className: 'exh-quiet', onClick: () => onLog(5), disabled: Boolean(busy) }, t('card.logFive')),
                h('button', { type: 'button', className: 'exh-quiet exh-quiet-accent', onClick: onCheckin, disabled: Boolean(busy) || view.done }, view.done ? t('card.checkinDone') : t('card.checkin')),
                h('button', { type: 'button', className: 'exh-quiet', onClick: onOpen, disabled: opening }, view.app?.installed ? t('card.open') : t('card.download')),
                !view.app?.installed
                  ? h('button', { type: 'button', className: 'exh-quiet', onClick: onDownload }, h(DownloadIcon), t('card.download'))
                  : null,
              ),
              h(
                'div',
                { className: 'exh-foot' },
                h('span', null, t('card.footer')),
                h('span', { className: 'exh-foot-right' },
                  `${t('card.best')} ${view.bestStreak} ${t('card.days')} · ${view.levelXp}/${view.levelSpan} XP`),
              ),
            )
          : null,
        toast ? h('div', { className: 'exh-toast', role: 'status' }, toast) : null,
      );
    }

    const CSS = `
      .exh-card {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        margin: 6px 0 2px;
        padding: 8px 10px;
        border-radius: 14px;
        border: 1px solid var(--dsw-alias-border-l1, rgba(127, 127, 127, .22));
        background-color: var(--dsw-alias-bg-layer-1, rgba(255, 255, 255, .92));
        background-image: linear-gradient(135deg, rgba(255, 122, 24, .10), rgba(240, 68, 106, .05) 55%, transparent);
        color: var(--dsw-alias-label-primary, #1f2328);
        box-shadow: 0 1px 2px rgba(16, 24, 40, .04);
        font-family: inherit;
        overflow: hidden;
        transition: border-color .18s ease, background .18s ease, box-shadow .18s ease;
      }
      .exh-card.exh-is-due {
        border-color: rgba(255, 122, 24, .55);
        box-shadow: 0 0 0 3px rgba(255, 122, 24, .10), 0 2px 8px rgba(240, 68, 106, .10);
      }
      .exh-card.exh-is-done {
        background-image: linear-gradient(135deg, rgba(22, 163, 74, .10), rgba(255, 122, 24, .05) 60%, transparent);
      }
      .exh-main {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }
      .exh-flame {
        position: relative;
        flex: 0 0 auto;
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        border-radius: 12px;
        color: #fff;
        background: linear-gradient(145deg, #FFB020, #FF7A18 55%, #F0446A);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, .28), 0 4px 10px rgba(240, 68, 106, .18);
      }
      .exh-flame-svg { filter: drop-shadow(0 1px 1px rgba(120, 40, 0, .25)); }
      .exh-streak {
        position: absolute;
        right: -4px;
        bottom: -5px;
        min-width: 17px;
        height: 17px;
        padding: 0 4px;
        border-radius: 999px;
        border: 2px solid var(--dsw-alias-bg-layer-1, #fff);
        background: #1f2328;
        color: #fff;
        font-size: 9.5px;
        font-weight: 750;
        line-height: 13px;
        text-align: center;
        font-variant-numeric: tabular-nums;
      }
      .exh-copy { flex: 1 1 auto; min-width: 0; }
      .exh-title-row {
        display: flex;
        align-items: center;
        gap: 7px;
        min-width: 0;
      }
      .exh-title {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: .01em;
        white-space: nowrap;
      }
      .exh-level {
        flex: 0 0 auto;
        padding: 1px 6px;
        border-radius: 999px;
        border: 1px solid rgba(255, 122, 24, .28);
        background: rgba(255, 122, 24, .10);
        color: #c2410c;
        font-size: 10.5px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }
      .exh-due-chip {
        flex: 0 0 auto;
        padding: 1px 7px;
        border-radius: 999px;
        background: #FF7A18;
        color: #fff;
        font-size: 10px;
        font-weight: 750;
        animation: exh-pulse 1.8s ease-in-out infinite;
      }
      .exh-sub {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 2px;
        color: var(--dsw-alias-label-secondary, #667085);
        font-size: 11px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-variant-numeric: tabular-nums;
      }
      .exh-dot { opacity: .5; }
      .exh-count-done { color: var(--dsw-alias-state-success-primary, #15803d); font-weight: 700; }
      .exh-xp { color: #c2410c; font-weight: 650; }
      .exh-bar {
        height: 3px;
        margin-top: 5px;
        border-radius: 999px;
        background: rgba(127, 127, 127, .16);
        overflow: hidden;
      }
      .exh-bar-fill {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #FFB020, #FF7A18 55%, #F0446A);
        transition: width .45s cubic-bezier(.2, .8, .2, 1);
      }
      .exh-actions {
        display: flex;
        align-items: center;
        gap: 5px;
        flex: 0 0 auto;
      }
      .exh-primary {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        height: 30px;
        padding: 0 12px;
        border: 0;
        border-radius: 10px;
        background: linear-gradient(145deg, #FF9F1C, #FF7A18 55%, #F0446A);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, .28), 0 3px 8px rgba(240, 68, 106, .18);
        color: #fff;
        font: inherit;
        font-size: 12px;
        font-weight: 750;
        cursor: pointer;
        white-space: nowrap;
        transition: transform .14s ease, filter .14s ease, opacity .14s ease;
      }
      .exh-primary:hover:not(:disabled) { filter: brightness(1.04); transform: translateY(-1px); }
      .exh-primary:active:not(:disabled) { transform: translateY(0); }
      .exh-primary:disabled { cursor: default; opacity: .78; }
      .exh-icon {
        display: inline-grid;
        place-items: center;
        width: 30px;
        height: 30px;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 9px;
        background: transparent;
        color: var(--dsw-alias-label-secondary, #667085);
        cursor: pointer;
      }
      .exh-icon:hover { background: rgba(127, 127, 127, .10); color: var(--dsw-alias-label-primary, #1f2328); }
      .exh-icon-on { color: #c2410c; background: rgba(255, 122, 24, .10); }
      .exh-chevron { width: 22px; color: var(--dsw-alias-label-secondary, #667085); }
      .exh-panel {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px dashed var(--dsw-alias-border-l1, rgba(127, 127, 127, .22));
      }
      .exh-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
        gap: 10px 18px;
      }
      .exh-field { min-width: 0; }
      .exh-label {
        display: block;
        margin-bottom: 5px;
        color: var(--dsw-alias-label-secondary, #667085);
        font-size: 10.5px;
        font-weight: 700;
        letter-spacing: .04em;
        text-transform: uppercase;
      }
      .exh-goal-row, .exh-reminder-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        min-width: 0;
      }
      .exh-goal-value {
        min-width: 26px;
        text-align: center;
        font-size: 15px;
        font-variant-numeric: tabular-nums;
      }
      .exh-unit { margin-right: 2px; color: var(--dsw-alias-label-secondary, #667085); font-size: 11px; }
      .exh-step {
        width: 24px;
        height: 24px;
        padding: 0;
        border: 1px solid var(--dsw-alias-border-l1, rgba(127, 127, 127, .22));
        border-radius: 7px;
        background: var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, .06));
        color: var(--dsw-alias-label-primary, #1f2328);
        font: inherit;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
      }
      .exh-step:hover { border-color: rgba(255, 122, 24, .45); color: #c2410c; }
      .exh-small {
        height: 24px;
        padding: 0 9px;
        border: 1px solid var(--dsw-alias-border-l1, rgba(127, 127, 127, .22));
        border-radius: 7px;
        background: transparent;
        color: var(--dsw-alias-label-primary, #1f2328);
        font: inherit;
        font-size: 11px;
        font-weight: 650;
        cursor: pointer;
      }
      .exh-small:hover:not(:disabled) { border-color: rgba(255, 122, 24, .45); color: #c2410c; }
      .exh-small:disabled { opacity: .45; cursor: default; }
      .exh-switch {
        position: relative;
        flex: 0 0 auto;
        width: 30px;
        height: 18px;
        padding: 0;
        border: 0;
        border-radius: 999px;
        background: rgba(127, 127, 127, .28);
        cursor: pointer;
        transition: background .18s ease;
      }
      .exh-switch-on { background: linear-gradient(90deg, #FF9F1C, #F0446A); }
      .exh-switch-knob {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1px 2px rgba(16, 24, 40, .25);
        transition: transform .18s cubic-bezier(.2, .8, .2, 1);
      }
      .exh-switch-on .exh-switch-knob { transform: translateX(12px); }
      .exh-time {
        width: 84px;
        height: 26px;
        padding: 0 5px;
        border: 1px solid var(--dsw-alias-border-l1, rgba(127, 127, 127, .22));
        border-radius: 7px;
        background: var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, .05));
        color: var(--dsw-alias-label-primary, #1f2328);
        font: inherit;
        font-size: 11.5px;
        font-variant-numeric: tabular-nums;
      }
      .exh-reminder-state { color: var(--dsw-alias-label-secondary, #667085); font-size: 11px; white-space: nowrap; }
      .exh-hint {
        margin: 6px 0 0;
        color: var(--dsw-alias-label-secondary, #667085);
        font-size: 10.5px;
        line-height: 1.45;
      }
      .exh-quick {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 9px;
      }
      .exh-quiet {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 25px;
        padding: 0 9px;
        border: 1px solid var(--dsw-alias-border-l1, rgba(127, 127, 127, .22));
        border-radius: 7px;
        background: var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, .05));
        color: var(--dsw-alias-label-primary, #1f2328);
        font: inherit;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
      }
      .exh-quiet:hover:not(:disabled) { border-color: rgba(255, 122, 24, .45); }
      .exh-quiet:disabled { opacity: .45; cursor: default; }
      .exh-quiet-accent {
        border-color: rgba(255, 122, 24, .40);
        background: rgba(255, 122, 24, .10);
        color: #c2410c;
      }
      .exh-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: 8px;
        color: var(--dsw-alias-label-secondary, #667085);
        font-size: 10px;
      }
      .exh-foot-right { white-space: nowrap; font-variant-numeric: tabular-nums; }
      .exh-due-strip {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 6px 0 0;
        padding: 5px 8px;
        border-radius: 8px;
        background: rgba(255, 122, 24, .10);
        color: #c2410c;
        font-size: 10.5px;
        font-weight: 600;
      }
      .exh-link {
        flex: 0 0 auto;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        font-size: 10.5px;
        text-decoration: underline;
        cursor: pointer;
      }
      .exh-toast {
        position: absolute;
        right: 10px;
        bottom: 8px;
        max-width: 70%;
        padding: 4px 9px;
        border-radius: 8px;
        background: rgba(31, 35, 40, .92);
        color: #fff;
        font-size: 10.5px;
        font-weight: 600;
        box-shadow: 0 4px 14px rgba(16, 24, 40, .18);
        animation: exh-toast-in .2s ease-out;
        z-index: 3;
      }
      .exh-error-row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 30px;
        font-size: 11.5px;
      }
      .exh-error-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--dsw-alias-state-error-primary, #dc2626);
        flex: 0 0 auto;
      }
      .exh-error-text {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--dsw-alias-label-secondary, #667085);
      }
      .exh-confetti {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 2;
      }
      .exh-confetti-bit {
        position: absolute;
        left: 50%;
        top: 62%;
        width: 5px;
        height: 9px;
        border-radius: 2px;
        opacity: 0;
        animation: exh-pop 1.1s cubic-bezier(.18, .8, .3, 1) forwards;
      }
      .exh-confetti-0 { background: #FFB020; --exh-x: -54px; --exh-y: -30px; --exh-r: 24deg; }
      .exh-confetti-1 { background: #FF7A18; --exh-x: -24px; --exh-y: -38px; --exh-r: -18deg; animation-delay: .04s; }
      .exh-confetti-2 { background: #F0446A; --exh-x: 16px; --exh-y: -34px; --exh-r: 46deg; animation-delay: .02s; }
      .exh-confetti-3 { background: #7C3AED; --exh-x: 50px; --exh-y: -22px; --exh-r: -34deg; animation-delay: .06s; }
      .exh-confetti-4 { background: #16A34A; --exh-x: -38px; --exh-y: -8px; --exh-r: 12deg; animation-delay: .03s; }
      .exh-confetti-5 { background: #0EA5E9; --exh-x: 36px; --exh-y: -4px; --exh-r: -22deg; animation-delay: .05s; }
      @keyframes exh-pop {
        0% { opacity: 0; transform: translate(0, 0) scale(.4) rotate(0); }
        18% { opacity: 1; }
        100% { opacity: 0; transform: translate(var(--exh-x, 0), var(--exh-y, -34px)) scale(1) rotate(var(--exh-r, 120deg)); }
      }
      @keyframes exh-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
      }
      @keyframes exh-toast-in {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @media (max-width: 620px) {
        .exh-level, .exh-xp, .exh-chevron { display: none; }
        .exh-primary { padding: 0 9px; }
        .exh-grid { grid-template-columns: 1fr; }
      }
    `;

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        rootCtx = ctx;
        ctx.effect(() => ctx.locale.register(NS, 'en', EN));
        ctx.effect(() => ctx.locale.register(NS, 'zh', ZH));
        ctx.effect(() =>
          ctx.slots.inject('conversation.composer.dock', () =>
            ctx.slots.register(
              {
                name: 'conversation.composer.dock',
                id: 'exameow-habit',
                order: 3,
                label: () => ctx.locale.bind(NS)('card.title'),
              },
              HabitDock,
            ),
          ),
        );
      },
    };
  },
});
