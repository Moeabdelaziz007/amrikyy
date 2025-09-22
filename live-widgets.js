/* AuraWidgets: Lightweight Live Widgets API (vanilla JS + ECharts) */
(function () {
  const DEFAULTS = {
    wsPath: '/ws/automation',
    restBase: '/api/v1',
    maxPoints: 120,
    animationDuration: 400,
    animationEasing: 'cubicOut',
  };

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = e => reject(e);
      document.head.appendChild(s);
    });
  }

  function resolveApiBase() {
    const { protocol, hostname } = window.location;
    const port = 3001; // server/index.ts uses 3001
    return `${protocol}//${hostname}:${port}`;
  }

  function ensureECharts() {
    if (window.echarts) return Promise.resolve(window.echarts);
    return loadScriptOnce(
      'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js'
    ).then(() => window.echarts);
  }

  class WSClient {
    constructor(url) {
      this.url = url;
      this.ws = null;
      this.listeners = new Set();
      this.reconnectDelayMs = 1000;
      this._connect();
    }

    _connect() {
      try {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {};
        this.ws.onmessage = evt => {
          try {
            const msg = JSON.parse(evt.data);
            this.listeners.forEach(cb => cb(msg));
          } catch {}
        };
        this.ws.onclose = () => {
          setTimeout(() => this._connect(), this.reconnectDelayMs);
          this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, 10000);
        };
        this.ws.onerror = () => {
          try {
            this.ws.close();
          } catch {}
        };
      } catch {}
    }

    subscribe(cb) {
      this.listeners.add(cb);
      return () => this.listeners.delete(cb);
    }
  }

  function createLiveLineChart(el, options) {
    const state = {
      opts: Object.assign({ series: [] }, options || {}),
      data: {},
    };

    let chart;
    let dispose = () => {};

    function ensureChart() {
      return ensureECharts().then(echarts => {
        chart = echarts.init(el);
        chart.setOption({
          animationDurationUpdate: DEFAULTS.animationDuration,
          animationEasing: DEFAULTS.animationEasing,
          title: {
            text: state.opts.title || 'Live System Metrics',
            textStyle: { color: '#cbd5e1' },
          },
          tooltip: { trigger: 'axis' },
          legend: { textStyle: { color: '#94a3b8' } },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: { color: '#94a3b8' },
          },
          yAxis: { type: 'value', axisLabel: { color: '#94a3b8' } },
          series: state.opts.series.map(s => ({
            name: s.name,
            type: 'line',
            symbol: s.symbol || 'circle',
            symbolSize: s.symbolSize || 6,
            smooth: true,
            showSymbol: false,
            areaStyle: s.area ? {} : undefined,
            data: [],
          })),
        });
      });
    }

    function pushPoint(name, value) {
      const nowLabel = new Date().toLocaleTimeString();
      state.data[name] = state.data[name] || [];
      state.data[name].push([nowLabel, value]);
      if (
        state.data[name].length > (state.opts.maxPoints || DEFAULTS.maxPoints)
      ) {
        state.data[name].shift();
      }
      if (chart) {
        const series = (state.opts.series || []).map(s => ({
          name: s.name,
          type: 'line',
          data: (state.data[s.name] || []).map(([x, y]) => ({
            name: x,
            value: [x, y],
          })),
          symbol: s.symbol || 'circle',
          symbolSize: s.symbolSize || 6,
          smooth: true,
          showSymbol: false,
          areaStyle: s.area ? {} : undefined,
        }));
        const x = (state.data[Object.keys(state.data)[0]] || []).map(
          ([x]) => x
        );
        chart.setOption({ xAxis: { data: x }, series });
      }
    }

    ensureChart();

    return { pushPoint, dispose };
  }

  function createAgentStatusWidget(el, options) {
    const opts = Object.assign({}, options || {});
    const container = el;
    container.innerHTML = '';
    const statusEl = document.createElement('div');
    statusEl.className = 'agent-status-widget';
    statusEl.style.cssText =
      'display:flex;align-items:center;gap:8px;color:#cbd5e1;';
    statusEl.innerHTML = `
			<span style="width:10px;height:10px;border-radius:50%;background:#10b981;display:inline-block" id="dot"></span>
			<span id="label">Agent: ${opts.agentId || ''}</span>
			<span id="meta" style="margin-left:auto;font-family:monospace;font-size:12px;color:#94a3b8"></span>
		`;
    container.appendChild(statusEl);

    let timer = null;
    async function tick() {
      try {
        const base = resolveApiBase();
        const res = await fetch(
          `${base}${DEFAULTS.restBase}/agents/${opts.agentId}/metrics`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('metrics fetch failed');
        const { data } = await res.json();
        statusEl.querySelector('#label').textContent =
          `${data.name} (${data.status})`;
        statusEl.querySelector('#meta').textContent =
          `tasks=${data.performance.tasksCompleted} sr=${Math.round(data.performance.successRate)}%`;
        statusEl.querySelector('#dot').style.background =
          data.status === 'active'
            ? '#10b981'
            : data.status === 'learning'
              ? '#f59e0b'
              : data.status === 'error'
                ? '#ef4444'
                : '#64748b';
      } catch (e) {}
    }
    tick();
    timer = setInterval(tick, 5000);
    return {
      dispose: () => {
        if (timer) clearInterval(timer);
      },
    };
  }

  function connect(options) {
    const base = resolveApiBase();
    const token = (options && options.token) || 'demo';
    const wsUrl = `${base.replace(/^http/, 'ws')}${DEFAULTS.wsPath}?token=${encodeURIComponent(token)}`;
    const client = new WSClient(wsUrl);
    return client;
  }

  function createSystemLiveChart(el, wsClient) {
    const chart = createLiveLineChart(el, {
      title: 'CPU / Memory',
      series: [
        { name: 'CPU Load', symbol: 'circle', area: true },
        { name: 'Memory %', symbol: 'triangle', area: true },
      ],
    });
    const unsub = wsClient.subscribe(msg => {
      if (
        msg &&
        msg.type === 'system_health' &&
        msg.data &&
        msg.data.components
      ) {
        const cpu = Number(msg.data.components.cpu?.value || 0);
        const mem = Number(msg.data.components.memory?.value || 0);
        chart.pushPoint('CPU Load', cpu);
        chart.pushPoint('Memory %', mem);
      }
    });
    return {
      dispose: () => {
        unsub();
        chart.dispose();
      },
    };
  }

  window.AuraWidgets = {
    connect,
    LiveLineChart: createLiveLineChart,
    SystemLiveChart: createSystemLiveChart,
    AgentStatus: createAgentStatusWidget,
  };
})();
