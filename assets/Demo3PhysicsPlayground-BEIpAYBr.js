import { c as e, n as t, o as n, r } from './index--nGSBySp.js';
import { t as i } from './useReducedMotion-Cdrz0qf3.js';
var a = e(n(), 1),
  o = t(),
  s = [`#8b7355`, `#c9a962`, `#2d2d2d`, `#b5a488`, `#6d5c42`, `#e0d3c0`, `#a8873f`],
  c = 0,
  l = 2400,
  u = 0.3,
  d = 1;
function f() {
  let e = i(),
    t = (0, a.useRef)(null),
    n = (0, a.useRef)(null),
    f = (0, a.useRef)(null),
    p = (0, a.useRef)({ gravity: 950, restitution: 0.78 }),
    [m, h] = (0, a.useState)(950),
    [g, _] = (0, a.useState)(0.78),
    [v, y] = (0, a.useState)(26),
    [b, x] = (0, a.useState)(!e),
    [S, C] = (0, a.useState)(0);
  return (
    (0, a.useEffect)(() => {
      document.title = `Demo 3 — Physics Playground · DRAPE Fashion OS`;
    }, []),
    (0, a.useEffect)(() => {
      p.current = { gravity: m, restitution: g };
    }),
    (0, a.useEffect)(() => {
      e && x(!1);
    }, [e]),
    (0, a.useEffect)(() => {
      f.current?.setCount(v);
    }, [v]),
    (0, a.useEffect)(() => {
      let e = t.current,
        r = n.current;
      if (!e || !r) return;
      let i = r.getContext(`2d`);
      if (!i) return;
      let a = e.clientWidth,
        o = e.clientHeight,
        c = Math.min(window.devicePixelRatio || 1, 2),
        l = !1,
        u = [],
        d = (e) => {
          u.length = 0;
          for (let t = 0; t < e; t++) {
            let e = 12 + Math.random() * 22;
            u.push({
              x: e + Math.random() * Math.max(1, a - e * 2),
              y: Math.random() * Math.max(1, o * 0.4),
              vx: (Math.random() - 0.5) * 240,
              vy: (Math.random() - 0.5) * 120,
              r: e,
              color: s[t % s.length],
              grabbed: !1
            });
          }
        };
      d(v);
      let m = () => {
          (i.clearRect(0, 0, a, o),
            (i.strokeStyle = `rgba(139,115,85,0.25)`),
            (i.lineWidth = 1),
            i.beginPath(),
            i.moveTo(0, o - 0.5),
            i.lineTo(a, o - 0.5),
            i.stroke());
          for (let e of u)
            ((i.globalAlpha = e.grabbed ? 0.85 : 0.92),
              i.beginPath(),
              i.arc(e.x, e.y, e.r, 0, Math.PI * 2),
              (i.fillStyle = e.color),
              i.fill(),
              (i.globalAlpha = 1),
              i.beginPath(),
              i.arc(e.x - e.r * 0.3, e.y - e.r * 0.35, e.r * 0.28, 0, Math.PI * 2),
              (i.fillStyle = `rgba(255,255,255,0.5)`),
              i.fill(),
              e.grabbed &&
                ((i.strokeStyle = `rgba(201,169,98,0.9)`),
                (i.lineWidth = 2),
                i.beginPath(),
                i.arc(e.x, e.y, e.r + 3, 0, Math.PI * 2),
                i.stroke()));
        },
        h = (e) => {
          let t = p.current.gravity,
            n = p.current.restitution;
          for (let r of u)
            r.grabbed ||
              ((r.vy += t * e),
              (r.x += r.vx * e),
              (r.y += r.vy * e),
              r.x - r.r < 0
                ? ((r.x = r.r), (r.vx = -r.vx * n))
                : r.x + r.r > a && ((r.x = a - r.r), (r.vx = -r.vx * n)),
              r.y - r.r < 0
                ? ((r.y = r.r), (r.vy = -r.vy * n))
                : r.y + r.r > o &&
                  ((r.y = o - r.r),
                  (r.vy = -r.vy * n),
                  (r.vx *= 0.985),
                  Math.abs(r.vy) < 26 && (r.vy = 0)));
          for (let e = 0; e < u.length; e++)
            for (let t = e + 1; t < u.length; t++) {
              let r = u[e],
                i = u[t],
                a = i.x - r.x,
                o = i.y - r.y,
                s = Math.hypot(a, o),
                c = r.r + i.r;
              if (s <= 0 || s >= c) continue;
              let l = a / s,
                d = o / s,
                f = c - s,
                p = r.grabbed ? 0 : 1 / (r.r * r.r),
                m = i.grabbed ? 0 : 1 / (i.r * i.r),
                h = p + m;
              if (h <= 0) continue;
              ((r.x -= l * f * (p / h)),
                (r.y -= d * f * (p / h)),
                (i.x += l * f * (m / h)),
                (i.y += d * f * (m / h)));
              let g = i.vx - r.vx,
                _ = i.vy - r.vy,
                v = g * l + _ * d;
              if (v < 0) {
                let e = (-(1 + n) * v) / h;
                ((r.vx -= e * p * l),
                  (r.vy -= e * p * d),
                  (i.vx += e * m * l),
                  (i.vy += e * m * d));
              }
            }
        },
        g = null,
        _ = { x: 0, y: 0, t: 0 },
        y = { x: 0, y: 0 },
        b = (e) => {
          let t = r.getBoundingClientRect();
          return {
            x: ((e.clientX - t.left) / t.width) * a,
            y: ((e.clientY - t.top) / t.height) * o
          };
        },
        x = (e) => {
          let t = b(e);
          for (let n = u.length - 1; n >= 0; n--) {
            let i = u[n];
            if (Math.hypot(t.x - i.x, t.y - i.y) <= i.r + 6) {
              ((g = i),
                (i.grabbed = !0),
                (i.vx = 0),
                (i.vy = 0),
                (_ = { x: t.x, y: t.y, t: performance.now() }),
                (y.x = 0),
                (y.y = 0),
                r.setPointerCapture(e.pointerId),
                m());
              return;
            }
          }
        },
        S = (e) => {
          if (!g) return;
          let t = b(e),
            n = performance.now(),
            r = Math.max(8, n - _.t) / 1e3;
          ((y.x = y.x * 0.5 + ((t.x - _.x) / r) * 0.5),
            (y.y = y.y * 0.5 + ((t.y - _.y) / r) * 0.5),
            (g.x = Math.min(Math.max(t.x, g.r), a - g.r)),
            (g.y = Math.min(Math.max(t.y, g.r), o - g.r)),
            (_ = { x: t.x, y: t.y, t: n }),
            m());
        },
        w = (e) => {
          g &&
            ((g.grabbed = !1),
            (g.vx = Math.max(-2400, Math.min(2400, y.x))),
            (g.vy = Math.max(-2400, Math.min(2400, y.y))),
            (g = null),
            r.hasPointerCapture(e.pointerId) && r.releasePointerCapture(e.pointerId),
            m());
        };
      (r.addEventListener(`pointerdown`, x),
        r.addEventListener(`pointermove`, S),
        r.addEventListener(`pointerup`, w),
        r.addEventListener(`pointercancel`, w),
        (f.current = {
          setCount: (e) => {
            if (e !== u.length) {
              for (; u.length > e;) u.pop();
              for (; u.length < e;) {
                let e = u.length,
                  t = 12 + Math.random() * 22;
                u.push({
                  x: t + Math.random() * Math.max(1, a - t * 2),
                  y: Math.random() * Math.max(1, o * 0.4),
                  vx: (Math.random() - 0.5) * 240,
                  vy: (Math.random() - 0.5) * 120,
                  r: t,
                  color: s[e % s.length],
                  grabbed: !1
                });
              }
              m();
            }
          },
          reset: () => {
            (d(u.length), m());
          },
          setPaused: (e) => {
            l = e;
          }
        }));
      let T = () => {
        ((a = e.clientWidth),
          (o = e.clientHeight),
          (r.width = Math.round(a * c)),
          (r.height = Math.round(o * c)),
          (r.style.width = `${a}px`),
          (r.style.height = `${o}px`),
          i.setTransform(c, 0, 0, c, 0, 0));
        for (let e of u)
          ((e.x = Math.min(e.x, Math.max(e.r, a - e.r))),
            (e.y = Math.min(e.y, Math.max(e.r, o - e.r))));
        m();
      };
      T();
      let E = new ResizeObserver(T);
      E.observe(e);
      let D = 0,
        O = performance.now(),
        k = 0,
        A = 0,
        j = (e) => {
          D = requestAnimationFrame(j);
          let t = Math.min((e - O) / 1e3, 0.032);
          ((O = e),
            l || h(t),
            m(),
            k++,
            (A += t),
            A >= 0.5 && (C(Math.round(k / A)), (k = 0), (A = 0)));
        };
      return (
        (D = requestAnimationFrame(j)),
        () => {
          (cancelAnimationFrame(D),
            E.disconnect(),
            r.removeEventListener(`pointerdown`, x),
            r.removeEventListener(`pointermove`, S),
            r.removeEventListener(`pointerup`, w),
            r.removeEventListener(`pointercancel`, w),
            (f.current = null));
        }
      );
    }, []),
    (0, a.useEffect)(() => {
      f.current?.setPaused(!b);
    }, [b]),
    (0, o.jsxs)(`div`, {
      className: `bg-background`,
      children: [
        (0, o.jsxs)(`section`, {
          className: `relative min-h-[45vh] flex items-center justify-center overflow-hidden demo-hero-gradient`,
          'aria-labelledby': `demo3-title`,
          children: [
            (0, o.jsx)(`div`, {
              className: `absolute top-0 left-0 right-0 z-10`,
              children: (0, o.jsxs)(`div`, {
                className: `container pt-8 flex items-center justify-between`,
                children: [
                  (0, o.jsx)(`span`, {
                    className: `text-xs tracking-[0.3em] uppercase text-text-muted`,
                    children: `Study 03`
                  }),
                  (0, o.jsx)(r, {
                    to: `/`,
                    className: `text-sm text-text-muted hover:text-primary transition-colors`,
                    children: `← Back to overview`
                  })
                ]
              })
            }),
            (0, o.jsxs)(`div`, {
              className: `container relative z-10 text-center py-16`,
              children: [
                (0, o.jsx)(`p`, {
                  className: `text-xs md:text-sm tracking-[0.35em] uppercase text-text-muted`,
                  children: `Interaction Study · Physics`
                }),
                (0, o.jsx)(`h1`, {
                  id: `demo3-title`,
                  className: `font-serif text-5xl md:text-7xl lg:text-8xl text-text mt-5`,
                  children: `Physics Playground`
                }),
                (0, o.jsx)(`p`, {
                  className: `mt-6 text-lg md:text-xl text-text-muted max-w-2xl mx-auto`,
                  children: `A hand-rolled 2D engine — gravity, restitution, collisions and drag-to-throw. Grab a ball and throw it.`
                })
              ]
            })
          ]
        }),
        (0, o.jsxs)(`section`, {
          className: `container pb-24`,
          'aria-labelledby': `demo3-controls`,
          children: [
            (0, o.jsx)(`h2`, {
              id: `demo3-controls`,
              className: `font-serif text-3xl md:text-4xl text-text`,
              children: `Tune the engine`
            }),
            (0, o.jsx)(`p`, {
              className: `mt-2 text-text-muted max-w-2xl`,
              children: `Sliders write straight into the simulation. Drag balls with the pointer — velocity at release becomes the throw.`
            }),
            (0, o.jsxs)(`div`, {
              className: `mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8`,
              children: [
                (0, o.jsxs)(`div`, {
                  className: `grid gap-6 md:grid-cols-3`,
                  children: [
                    (0, o.jsxs)(`label`, {
                      className: `block`,
                      children: [
                        (0, o.jsxs)(`span`, {
                          className: `flex items-center justify-between text-sm text-text-muted`,
                          children: [
                            `Gravity`,
                            (0, o.jsxs)(`span`, {
                              className: `font-mono text-xs text-text`,
                              children: [m, ` px/s²`]
                            })
                          ]
                        }),
                        (0, o.jsx)(`input`, {
                          type: `range`,
                          min: c,
                          max: l,
                          step: 20,
                          value: m,
                          onChange: (e) => h(Number(e.target.value)),
                          className: `w-full mt-2 accent-primary`,
                          'aria-label': `Gravity`
                        })
                      ]
                    }),
                    (0, o.jsxs)(`label`, {
                      className: `block`,
                      children: [
                        (0, o.jsxs)(`span`, {
                          className: `flex items-center justify-between text-sm text-text-muted`,
                          children: [
                            `Restitution`,
                            (0, o.jsx)(`span`, {
                              className: `font-mono text-xs text-text`,
                              children: g.toFixed(2)
                            })
                          ]
                        }),
                        (0, o.jsx)(`input`, {
                          type: `range`,
                          min: u,
                          max: d,
                          step: 0.02,
                          value: g,
                          onChange: (e) => _(Number(e.target.value)),
                          className: `w-full mt-2 accent-primary`,
                          'aria-label': `Restitution`
                        })
                      ]
                    }),
                    (0, o.jsxs)(`label`, {
                      className: `block`,
                      children: [
                        (0, o.jsxs)(`span`, {
                          className: `flex items-center justify-between text-sm text-text-muted`,
                          children: [
                            `Ball count`,
                            (0, o.jsx)(`span`, {
                              className: `font-mono text-xs text-text`,
                              children: v
                            })
                          ]
                        }),
                        (0, o.jsx)(`input`, {
                          type: `range`,
                          min: 6,
                          max: 60,
                          step: 1,
                          value: v,
                          onChange: (e) => y(Number(e.target.value)),
                          className: `w-full mt-2 accent-primary`,
                          'aria-label': `Ball count`
                        })
                      ]
                    })
                  ]
                }),
                (0, o.jsxs)(`div`, {
                  className: `mt-6 flex flex-wrap items-center gap-3`,
                  children: [
                    (0, o.jsx)(`button`, {
                      type: `button`,
                      onClick: () => x((e) => !e),
                      className: `px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${b ? `border border-border text-text hover:bg-background` : `bg-primary text-white hover:bg-primary-hover`}`,
                      children: b ? `Pause` : `Play`
                    }),
                    (0, o.jsx)(`button`, {
                      type: `button`,
                      onClick: () => f.current?.reset(),
                      className: `px-6 py-2.5 rounded-full text-sm font-medium border border-border text-text hover:bg-background transition-colors`,
                      children: `Reset`
                    }),
                    (0, o.jsxs)(`span`, {
                      className: `font-mono text-xs text-text-muted ml-auto`,
                      'aria-live': `polite`,
                      children: [S, ` fps · `, v, ` balls`]
                    })
                  ]
                }),
                (0, o.jsx)(`div`, {
                  ref: t,
                  className: `mt-6 h-[480px] md:h-[560px] rounded-xl border border-border bg-primary-light/30`,
                  children: (0, o.jsx)(`canvas`, {
                    ref: n,
                    className: `block rounded-xl`,
                    style: { touchAction: `none`, cursor: `grab` },
                    'aria-label': `Physics ball pit — drag balls to throw them`
                  })
                }),
                e &&
                  (0, o.jsx)(`p`, {
                    className: `mt-4 text-xs text-text-muted`,
                    children: `Reduced motion detected — the simulation starts paused. Press Play to opt in.`
                  })
              ]
            })
          ]
        }),
        (0, o.jsx)(`section`, {
          className: `container pb-24`,
          children: (0, o.jsxs)(`div`, {
            className: `rounded-2xl border border-border bg-surface text-center px-8 py-12`,
            children: [
              (0, o.jsx)(`p`, {
                className: `font-serif text-2xl md:text-3xl text-text`,
                children: `Every engine is just integration by parts.`
              }),
              (0, o.jsxs)(`p`, {
                className: `mt-3 text-sm text-text-muted`,
                children: [
                  `Study 03 of 05 —`,
                  ` `,
                  (0, o.jsx)(r, {
                    to: `/demo/4`,
                    className: `text-primary hover:underline`,
                    children: `next: the generative atmosphere`
                  })
                ]
              })
            ]
          })
        })
      ]
    })
  );
}
export { f as Demo3PhysicsPlayground };
