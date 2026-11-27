import React, { Suspense, useEffect, useState } from 'react';

export type Provenance = { kind: 'real' | 'model' | 'synthetic'; label: string };
export type TabDef = {
  id: string;
  label: string;
  sub: string;
  track?: string;
  scope: string; // module folder name, wrapper gets class m-<scope>
  provenance: Provenance[];
  note?: string;
  load: () => Promise<{ default: React.ComponentType }>;
};
export type ShellConfig = {
  pillar: string;
  title: string;
  subtitle: string;
  tabs: TabDef[];
  footer: string;
};

const lazyCache = new Map<string, React.LazyExoticComponent<React.ComponentType>>();
function lazyFor(t: TabDef) {
  if (!lazyCache.has(t.id)) lazyCache.set(t.id, React.lazy(t.load));
  return lazyCache.get(t.id)!;
}

function readTab(ids: string[]): string {
  const h = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (ids.includes(h)) return h;
  const q = new URLSearchParams(window.location.search).get('tab');
  if (q && ids.includes(q.toLowerCase())) return q.toLowerCase();
  return ids[0];
}

export function Shell({ config }: { config: ShellConfig }) {
  const ids = config.tabs.map((t) => t.id);
  const [active, setActive] = useState(() => readTab(ids));
  const [visited, setVisited] = useState<string[]>(() => [readTab(ids)]);

  useEffect(() => {
    const onHash = () => setActive(readTab(ids));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    setVisited((v) => (v.includes(active) ? v : [...v, active]));
    const t = config.tabs.find((x) => x.id === active)!;
    document.title = `${t.label} · ${config.title} · Mohammed KM`;
  }, [active]);

  const go = (id: string) => {
    if (id === active) return;
    history.replaceState(null, '', `#${id}`);
    setActive(id);
    window.scrollTo({ top: 0 });
  };

  const tracks = Array.from(new Set(config.tabs.map((t) => t.track).filter(Boolean))) as string[];
  const tabButton = (t: TabDef) => (
    <a
      key={t.id}
      href={`#${t.id}`}
      role="tab"
      className="sh-tab"
      aria-selected={t.id === active}
      onClick={(e) => { e.preventDefault(); go(t.id); }}
    >
      <span className="sh-tab-label">{t.label}</span>
      <span className="sh-tab-sub">{t.sub}</span>
    </a>
  );
  const cur = config.tabs.find((t) => t.id === active)!;

  return (
    <>
      <header className="mkm-topbar">
        <div className="mkm-topbar-inner">
          <div className="mkm-brand">
            <span className="mkm-brand-mark" aria-hidden="true">
              <img src="/favicon.png?v=2" alt="" width="28" height="28" />
            </span>
            <span className="mkm-brand-name">{config.title}</span>
            <span className="mkm-brand-sep" aria-hidden="true"></span>
            <span className="mkm-brand-by">Mohammed KM</span>
          </div>
        </div>
      </header>
      <header className="sh-top">
        <div className="sh-wrap">
          <div className="sh-head">
            <h1 className="sh-title">{config.title}</h1>
            <p className="sh-sub">{config.subtitle}</p>
          </div>
          {tracks.length ? (
            <nav className="sh-tracks" role="tablist" aria-label="Modules">
              {tracks.map((tr) => (
                <div className="sh-track" key={tr}>
                  <span className="sh-track-name">{tr}</span>
                  <div className="sh-tabs">{config.tabs.filter((t) => t.track === tr).map(tabButton)}</div>
                </div>
              ))}
            </nav>
          ) : (
            <nav className="sh-tabs" role="tablist" aria-label="Modules">{config.tabs.map(tabButton)}</nav>
          )}
        </div>
      </header>
      <div className="sh-wrap">
        <div className="sh-prov" aria-label="Data provenance">
          {cur.provenance.map((p) => (
            <span key={p.label} className={`sh-pill ${p.kind}`}>{p.kind === 'real' ? 'real data' : p.kind === 'model' ? 'modelled' : 'synthetic'} · {p.label}</span>
          ))}
          {cur.note ? <span>{cur.note}</span> : null}
        </div>
      </div>
      <main className="sh-main">
        {config.tabs.filter((t) => visited.includes(t.id)).map((t) => {
          const C = lazyFor(t);
          return (
            <section key={t.id} className={`sh-panel m-${t.scope}`} hidden={t.id !== active} role="tabpanel" aria-label={t.label}>
              <Suspense fallback={<div className="sh-wrap" style={{ padding: 40, color: '#6b6b68' }}>Loading…</div>}>
                <C />
              </Suspense>
            </section>
          );
        })}
      </main>
      <footer className="sh-wrap">
        <div className="sh-foot">
          <span>{config.footer}</span>
          <span>
            <a href="https://mohammed-km.in/projects">all projects</a> · <a href="https://mohammed-km.in">mohammed-km.in</a>
          </span>
        </div>
      </footer>
    </>
  );
}
