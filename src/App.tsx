import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';

const EMAIL = 'contacto@marcogugliandolo.com';
const MAILTO = `mailto:${EMAIL}`;
const MAILTO_PROYECTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Un proyecto')}&body=${encodeURIComponent(
  'Hola Marco,\n\nTe escribo porque necesito…\n\n',
)}`;
const LINKEDIN = 'https://es.linkedin.com/in/marco-gugliandolo-l%C3%B3pez-692a7b147';
const GITHUB = 'https://github.com/marcogugliandolo';

type Project = {
  name: string;
  kind: string;
  url: string;
  domain: string;
  img?: string;
  alt?: string;
};

const projects: Project[] = [
  {
    name: 'vaixa',
    kind: 'Reservas de taxi y VTC en Vilalba',
    url: 'https://vaixataxi.es',
    domain: 'vaixataxi.es',
    img: 'vaixa',
    alt: 'Portada de vaixa: reserva de taxi y VTC en cinco pasos',
  },
  {
    name: 'Soño',
    kind: 'Cafetería con carta y reservas',
    url: 'https://gruposono.com',
    domain: 'gruposono.com',
    img: 'sono',
    alt: 'Portada de la web de la cafetería Soño, con su ilustración de taza y cafetera',
  },
  {
    name: 'Lumaira',
    kind: 'Reservas para un estudio de uñas',
    url: 'https://lumaira.marcogugliandolo.com',
    domain: 'lumaira.marcogugliandolo.com',
    img: 'lumaira',
    alt: 'Selector de servicios de Lumaira Nails Studio, con precio y duración de cada uno',
  },
  {
    name: 'SalsaNova',
    kind: 'Gestión de una escuela de baile',
    url: 'https://salsanova.app',
    domain: 'salsanova.app',
    img: 'salsanova',
    alt: 'Acceso al panel de gestión de la escuela de baile SalsaNova',
  },
  {
    name: 'KreaPC',
    kind: 'Configurador de PC con precios reales',
    url: 'https://kreapc.marcogugliandolo.com',
    domain: 'kreapc.marcogugliandolo.com',
    img: 'kreapc',
    alt: 'Primer paso de KreaPC: elegir entre torre de sobremesa y portátil',
  },
  {
    name: 'Alza',
    kind: 'Control de ingresos y gastos',
    url: 'https://alza.finance',
    domain: 'alza.finance',
    img: 'alza',
    alt: 'Pantalla de acceso de Alza, una app de finanzas personales',
  },
  {
    name: 'Plazafy',
    kind: 'Alquiler de plazas de garaje',
    url: 'https://plazafy.es',
    domain: 'plazafy.es',
  },
  {
    name: 'Server Panel',
    kind: 'El monitor de mis servidores',
    url: 'https://panel.marcogugliandolo.com',
    domain: 'panel.marcogugliandolo.com',
  },
];

type Service = { sub: string; what: string; url?: string };

const services: Service[] = [
  { sub: 'portainer', what: 'Contenedores' },
  { sub: 'grafana', what: 'Métricas' },
  { sub: 'kuma', what: 'Estado de las webs' },
  { sub: 'guacamole', what: 'Escritorio remoto' },
  { sub: 'n8n', what: 'Automatizaciones' },
  { sub: 'nube', what: 'Nextcloud', url: 'https://nube.marcogugliandolo.com/login' },
  { sub: 'bbdd', what: 'Bases de datos' },
  { sub: 'tv', what: 'Jellyfin' },
  { sub: 'npm', what: 'Proxy y certificados' },
  { sub: 'herramientas', what: 'Utilidades' },
  { sub: 'curriculum', what: 'Mi currículum' },
];

const areas = [
  {
    title: 'Desarrollo web',
    text: 'Webs y aplicaciones a medida, pensadas primero para el móvil, desde el diseño hasta el despliegue.',
    terms: ['HTML, CSS y JavaScript', 'React y TypeScript', 'Node y Express'],
  },
  {
    title: 'Administración de sistemas',
    text: 'Despliego, configuro y mantengo servidores y servicios para que estén siempre disponibles.',
    terms: ['Docker y Portainer', 'Nginx Proxy Manager', 'Redes y DNS'],
  },
  {
    title: 'Bases de datos',
    text: 'Diseño, optimizo y administro bases de datos relacionales, con rendimiento y seguridad.',
    terms: ['SQL', 'SQLite', 'Gestor web propio'],
  },
  {
    title: 'Monitorización',
    text: 'Vigilo que todo responda y conecto servicios entre sí para quitar trabajo repetitivo, también con IA.',
    terms: ['Grafana', 'Uptime Kuma', 'n8n'],
  },
];

const navLinks = [
  { name: 'Proyectos', href: '#proyectos' },
  { name: 'Servidores', href: '#servidores' },
  { name: 'Sobre mí', href: '#sobre-mi' },
  { name: 'Contacto', href: '#contacto' },
];

const pic = (name: string, w: 800 | 1200) => `/proyectos/${name}-${w}.webp`;

/* Reveal: every [data-r] rises once when it enters the viewport. */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-r]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* Measures how long each subdomain takes to answer, from the visitor's own browser. */
type PingState = Record<string, number | null | undefined>;

async function ping(url: string): Promise<number | null> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 8000);
  const t0 = performance.now();
  try {
    await fetch(url, { mode: 'no-cors', cache: 'no-store', method: 'HEAD', signal: ctrl.signal });
    return Math.max(1, Math.round(performance.now() - t0));
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

function usePings(target: RefObject<HTMLElement | null>) {
  const [pings, setPings] = useState<PingState>({});
  const [running, setRunning] = useState(false);
  const started = useRef(false);

  const run = useCallback(async () => {
    setRunning(true);
    setPings({});
    await Promise.all(
      services.map(async (s) => {
        const ms = await ping(`https://${s.sub}.marcogugliandolo.com/`);
        setPings((p) => ({ ...p, [s.sub]: ms }));
      }),
    );
    setRunning(false);
  }, []);

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          started.current = true;
          run();
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [run, target]);

  return { pings, running, run };
}

/* Fits the footer wordmark to the full width, whatever the font metrics. */
function FittedWordmark({ text }: { text: string }) {
  const textRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState('0 0 1000 120');

  useLayoutEffect(() => {
    const fit = () => {
      const t = textRef.current;
      if (!t) return;
      const b = t.getBBox();
      if (b.width > 0) setBox(`${b.x} ${b.y} ${b.width} ${b.height}`);
    };
    fit();
    document.fonts?.ready.then(fit);
  }, []);

  return (
    <svg className="wordmark-fit" viewBox={box} role="img" aria-label={text} preserveAspectRatio="xMinYMax meet">
      <text ref={textRef} x="0" y="100" className="wordmark-fit-text">
        {text}
      </text>
    </svg>
  );
}

function Hero({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="hero" id="inicio">
      <div className="topbar">
        <a href="#inicio" className="wordmark">
          marcogugliandolo.com
        </a>
        <nav className="topnav" aria-label="Secciones">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>
              {l.name}
            </a>
          ))}
        </nav>
        <button type="button" className="menu-btn" onClick={onMenu} aria-haspopup="dialog">
          Menú
        </button>
      </div>

      <h1 className="hero-title lines" aria-label="Marco Gugliandolo">
        <span className="line line-1" aria-hidden="true">
          <span data-line style={{ '--i': 0 } as CSSProperties}>
            Marco
          </span>
        </span>
        <span className="line line-2" aria-hidden="true">
          <span data-line style={{ '--i': 1 } as CSSProperties}>
            Gugliandolo
          </span>
        </span>
      </h1>

      <div className="hero-foot">
        <p className="hero-lead">
          Soy Marco Gugliandolo López. Desarrollo webs y administro los servidores donde viven.
        </p>
        <a className="btn btn-ink" href={MAILTO}>
          Escríbeme
        </a>
      </div>
    </header>
  );
}

function Work() {
  const [active, setActive] = useState(0);
  const current = projects[active];

  return (
    <section id="proyectos" className="work" aria-labelledby="work-title">
      <div className="work-list">
        <h2 id="work-title" className="section-title" data-r>
          En producción
        </h2>
        <p className="work-intro" data-r style={{ '--d': 1 } as CSSProperties}>
          Webs y aplicaciones que he hecho y que están funcionando ahora mismo.{' '}
          <span className="hover-hint">Pasa por encima de cada una para verla; al pulsar, se abre.</span>
        </p>
        <ul className="ledger">
          {projects.map((p, i) => (
            <li key={p.name} data-r style={{ '--d': Math.min(i, 6) + 2 } as CSSProperties}>
              {p.img && (
                <img
                  className="row-pic"
                  src={pic(p.img, 800)}
                  width={800}
                  height={600}
                  alt={p.alt}
                  loading="lazy"
                />
              )}
              <a
                className={`row${i === active ? ' is-active' : ''}`}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="row-name">{p.name}</span>
                <span className="row-kind">{p.kind}</span>
                <span className="row-domain">
                  {p.domain}
                  <span className="row-arrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <figure className="preview" aria-hidden="true">
        <div className="preview-frame">
          {projects.map((p, i) =>
            p.img ? (
              <img
                key={p.name}
                className={`preview-img${i === active ? ' is-on' : ''}`}
                src={pic(p.img, 1200)}
                srcSet={`${pic(p.img, 800)} 800w, ${pic(p.img, 1200)} 1200w`}
                sizes="(min-width: 900px) 38vw, 100vw"
                width={1200}
                height={900}
                alt=""
              />
            ) : (
              <div key={p.name} className={`preview-type${i === active ? ' is-on' : ''}`}>
                <span>{p.name}</span>
              </div>
            ),
          )}
        </div>
        <figcaption className="preview-caption">
          {current.img ? `Captura de ${current.domain}` : `${current.domain}, sin captura todavía`}
        </figcaption>
      </figure>
    </section>
  );
}

function Servers() {
  const ref = useRef<HTMLElement>(null);
  const { pings, running, run } = usePings(ref);

  const done = services.filter((s) => pings[s.sub] !== undefined);
  const alive = done.filter((s) => typeof pings[s.sub] === 'number');
  const fastest = alive.reduce<Service | null>(
    (best, s) => (!best || (pings[s.sub] as number) < (pings[best.sub] as number) ? s : best),
    null,
  );

  let summary = 'Midiendo desde tu navegador…';
  if (!running && done.length === services.length) {
    summary =
      alive.length === 0
        ? 'Tu navegador no ha recibido respuesta. Puede que estés sin conexión o tras un cortafuegos.'
        : `Desde tu navegador responden ${alive.length} de ${services.length}. La más rápida, ${fastest?.sub}, en ${pings[fastest!.sub]} ms.`;
  } else if (!running && done.length === 0) {
    summary = 'Los tiempos aparecen al llegar aquí.';
  }

  return (
    <section id="servidores" className="servers" ref={ref} aria-labelledby="servers-title">
      <h2 id="servers-title" className="sr-only">
        Servidores
      </h2>
      <p className="servers-intro" data-r>
        Todo esto lo sirvo yo, desde mis propios servidores con Docker y Portainer. Al lado de cada uno, lo que
        tarda en contestar a tu navegador ahora mismo.
      </p>

      <ul className="poster">
        {services.map((s, i) => {
          const ms = pings[s.sub];
          const status = ms === undefined ? '…' : ms === null ? 'sin respuesta' : `${ms} ms`;
          return (
            <li key={s.sub} data-r style={{ '--d': Math.min(i, 5) } as CSSProperties}>
              <a
                className="poster-item"
                href={s.url ?? `https://${s.sub}.marcogugliandolo.com`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="poster-word">{s.sub}</span>
                <span className="poster-detail">
                  <span>{s.what}</span>
                  <span className={`poster-ms${ms === null ? ' is-down' : ''}`}>
                    {status}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="servers-foot" data-r>
        <p className="servers-summary" aria-live="polite">
          {summary}
        </p>
        <button type="button" className="btn btn-ink" onClick={run} disabled={running}>
          {running ? 'Midiendo…' : 'Medir otra vez'}
        </button>
      </div>
    </section>
  );
}

function Areas() {
  return (
    <section className="areas" aria-labelledby="areas-title">
      <div className="areas-cell">
        <h2 id="areas-title" className="areas-title" data-r>
          <span className="areas-l1">Lo que hago</span>
          <span className="areas-l2">y con qué</span>
        </h2>
        <div className="areas-foot" data-r style={{ '--d': 2 } as CSSProperties}>
          <p>
            Diseño y programo la web, la publico en mis servidores y me encargo de que siga en pie. Ahora mismo
            acepto proyectos nuevos.
          </p>
          <a className="btn btn-accent" href={MAILTO_PROYECTO}>
            Cuéntame tu idea
          </a>
        </div>
      </div>
      <ul className="areas-rows">
        {areas.map((a, i) => (
          <li key={a.title} className="areas-row" data-r style={{ '--d': i } as CSSProperties}>
            <h3>{a.title}</h3>
            <p>{a.text}</p>
            <ul className="areas-terms">
              {a.terms.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function About() {
  return (
    <section id="sobre-mi" className="about" aria-labelledby="about-title">
      <h2 id="about-title" className="sr-only">
        Sobre mí
      </h2>
      <p className="about-text" data-r>
        <strong>Marco Gugliandolo López.</strong> Soy{' '}
        <mark className="hl hl-accent">administrador de sistemas informáticos en red</mark> y monté este rincón
        para enseñar lo que hago, sobre todo desarrollo web y despliegue de servicios. Le doy forma al frontend
        con HTML, CSS y JavaScript, pero donde de verdad me lo paso bien es trasteando con servidores y la
        cultura <mark className="hl hl-paper nowrap">self-hosted</mark>: uso{' '}
        <mark className="hl hl-grey nowrap">Docker y Portainer</mark> a diario para levantar y gestionar mis propios
        contenedores. Últimamente también integro <mark className="hl hl-paper">herramientas de IA</mark> para
        automatizar procesos y probar cosas nuevas. No todo es estar delante de una pantalla (bueno, a veces
        sí): me acompañan la <mark className="hl hl-grey">música, los podcasts y las series</mark>, cacharreo
        con hardware y procuro aprender algo cada día. Esta web junta mis dos pasiones, escribir código y
        administrar sistemas.{' '}
        <a href="#contacto" className="hl hl-accent hl-link">
          Escríbeme y lo hablamos.
        </a>
      </p>
    </section>
  );
}

function Contact() {
  const [avatarOk, setAvatarOk] = useState(true);
  const rows = [
    { label: 'Correo', detail: EMAIL, href: MAILTO, external: false },
    { label: 'LinkedIn', detail: 'Marco Gugliandolo López', href: LINKEDIN, external: true },
    { label: 'GitHub', detail: 'github.com/marcogugliandolo', href: GITHUB, external: true },
  ];

  return (
    <section id="contacto" className="contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="sr-only">
        Contacto
      </h2>
      <ul className="contact-rows">
        {rows.map((r, i) => (
          <li key={r.label} data-r style={{ '--d': i } as CSSProperties}>
            <a
              className="contact-row"
              href={r.href}
              {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="contact-word">{r.label}</span>
              <span className="contact-detail">
                {r.detail}
                {i === 0 && avatarOk && (
                  <img
                    className="contact-avatar"
                    src="https://github.com/marcogugliandolo.png?size=160"
                    width={56}
                    height={56}
                    alt="Foto de Marco Gugliandolo López"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarOk(false)}
                  />
                )}
              </span>
            </a>
          </li>
        ))}
        <li data-r style={{ '--d': 3 } as CSSProperties}>
          <a className="contact-row contact-hello" href={MAILTO}>
            <span className="contact-word">Hola</span>
            <span className="round-btn" aria-hidden="true">
              →
            </span>
            <span className="sr-only">Enviar un correo a {EMAIL}</span>
          </a>
        </li>
      </ul>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-cols">
        <ul>
          <li className="first">Marco Gugliandolo López</li>
          <li>Desarrollo web</li>
          <li>Administración de sistemas</li>
        </ul>
        <ul>
          <li className="first">En esta página</li>
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.name}</a>
            </li>
          ))}
        </ul>
        <ul>
          <li className="first">En la red</li>
          <li>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={MAILTO}>{EMAIL}</a>
          </li>
        </ul>
        <ul>
          <li className="first">Esta web</li>
          <li>Hecha a mano con React</li>
          <li>Servida desde mis servidores</li>
          <li>
            <a href="#inicio">Volver arriba ↑</a>
          </li>
        </ul>
      </div>
      <div className="footer-bottom">
        <FittedWordmark text="marcogugliandolo.com" />
        <p className="legal">
          © {year} Marco Gugliandolo López. Las capturas son de mis propios proyectos.
        </p>
      </div>
    </footer>
  );
}

function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label="Menú">
      <div className="sheet-top">
        <span className="wordmark">marcogugliandolo.com</span>
        <button type="button" className="menu-btn" onClick={onClose} ref={closeRef}>
          Cerrar
        </button>
      </div>
      <nav className="sheet-links" aria-label="Secciones">
        {navLinks.map((l, i) => (
          <a key={l.href} href={l.href} onClick={onClose} style={{ '--d': i } as CSSProperties}>
            {l.name}
          </a>
        ))}
      </nav>
      <a className="btn btn-accent sheet-cta" href={MAILTO}>
        Escríbeme
      </a>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useReveal();

  return (
    <>
      <a className="skip" href="#proyectos">
        Saltar al contenido
      </a>
      <main className="page">
        <Hero onMenu={() => setMenuOpen(true)} />
        <Work />
        <Servers />
        <Areas />
        <About />
        <Contact />
      </main>
      <Footer />
      <MenuSheet open={menuOpen} onClose={closeMenu} />
    </>
  );
}
