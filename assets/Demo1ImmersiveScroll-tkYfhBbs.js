import { c as e, n as t, o as n, r } from './index--nGSBySp.js';
import { t as i } from './lenis-C9A3lpHu.js';
import { t as a } from './useReducedMotion-Cdrz0qf3.js';
var o = e(n(), 1);
function s(e, t = {}) {
  let { staggerDelay: n = 80, ...r } = t,
    [i, a] = (0, o.useState)(new Set()),
    s = (0, o.useRef)(Array(e).fill(null)),
    c = (0, o.useCallback)(
      (e) => (t) => {
        s.current[e] = t;
      },
      []
    );
  return (
    (0, o.useEffect)(() => {
      let e = new IntersectionObserver(
        (t) => {
          t.forEach((t) => {
            let n = Number(t.target.dataset.revealIndex);
            t.isIntersecting
              ? (a((e) => {
                  let t = new Set(e);
                  return (t.add(n), t);
                }),
                r.triggerOnce !== !1 && e.unobserve(t.target))
              : r.triggerOnce === !1 &&
                a((e) => {
                  let t = new Set(e);
                  return (t.delete(n), t);
                });
          });
        },
        { threshold: r.threshold, rootMargin: r.rootMargin }
      );
      return (
        s.current.forEach((t, n) => {
          t && ((t.dataset.revealIndex = String(n)), e.observe(t));
        }),
        () => e.disconnect()
      );
    }, [e, r.threshold, r.rootMargin, r.triggerOnce]),
    { refs: c, visibleIndices: i }
  );
}
var c = t(),
  l = [
    {
      title: `The Loom Room`,
      caption: `Hand-dyed thread walls · 240 count`,
      swatch: `linear-gradient(135deg, #f5f0eb, #e0d3c0)`
    },
    {
      title: `Indigo Vats`,
      caption: `Natural indigo, fermented 14 days`,
      swatch: `linear-gradient(135deg, #2d3a4a, #1a2430)`
    },
    {
      title: `Weaving Shed`,
      caption: `Pit looms · Jamdani motifs`,
      swatch: `linear-gradient(135deg, #8b7355, #6d5c42)`
    },
    {
      title: `Gold Thread`,
      caption: `Zari embroidery · real metallic`,
      swatch: `linear-gradient(135deg, #c9a962, #a8873f)`
    },
    {
      title: `Finishing Table`,
      caption: `Stone-washed · air dried`,
      swatch: `linear-gradient(135deg, #faf6f0, #ddd0c4)`
    },
    {
      title: `The Archive`,
      caption: `Every pattern since 1998`,
      swatch: `linear-gradient(135deg, #3a342c, #241f1e)`
    }
  ],
  u = [
    {
      name: `Inertia smoothing`,
      detail: `Lenis 1.3 drives the native scroller with lerp 0.085 — wheel input is interpolated, never snapped.`
    },
    {
      name: `Parallax depth`,
      detail: `Hero layers translate at different rates, sampled from the real scroll position every frame.`
    },
    {
      name: `Pinned gallery`,
      detail: `A 300vh section with a sticky viewport converts vertical scroll into horizontal travel.`
    },
    {
      name: `Staggered reveal`,
      detail: `IntersectionObserver plus per-card delays keep entrances choreographed, not synchronized.`
    },
    {
      name: `60fps discipline`,
      detail: `Scroll-driven writes are rAF-throttled and mutate styles directly — zero per-frame React renders.`
    },
    {
      name: `Reduced motion`,
      detail: `prefers-reduced-motion disables Lenis, parallax and pinning; content falls back to a static stack.`
    }
  ];
function d() {
  let e = a(),
    t = (0, o.useRef)(null),
    n = (0, o.useRef)(null),
    d = (0, o.useRef)(null),
    f = (0, o.useRef)(null),
    p = (0, o.useRef)(null),
    { refs: m, visibleIndices: h } = s(u.length);
  return (
    (0, o.useEffect)(() => {
      document.title = `Demo 1 — Immersive Scroll · DRAPE Fashion OS`;
    }, []),
    (0, o.useEffect)(() => {
      if (e) return;
      let t = new i({
          lerp: 0.085,
          orientation: `vertical`,
          gestureOrientation: `vertical`,
          smoothWheel: !0,
          wheelMultiplier: 1
        }),
        n = 0,
        r = (e) => {
          (t.raf(e), (n = requestAnimationFrame(r)));
        };
      return (
        (n = requestAnimationFrame(r)),
        () => {
          (cancelAnimationFrame(n), t.destroy());
        }
      );
    }, [e]),
    (0, o.useEffect)(() => {
      let r = !1,
        i = () => {
          r = !1;
          let i = window.scrollY,
            a = document.documentElement.scrollHeight - window.innerHeight;
          if (
            (t.current && (t.current.style.transform = `scaleX(${a > 0 ? Math.min(1, i / a) : 0})`),
            e)
          )
            return;
          (d.current && (d.current.style.transform = `translateY(${(i * 0.32).toFixed(1)}px)`),
            n.current && (n.current.style.transform = `translateY(${(i * 0.16).toFixed(1)}px)`));
          let o = f.current,
            s = p.current;
          if (o && s) {
            let e = o.getBoundingClientRect(),
              t = e.height - window.innerHeight,
              n = t > 0 ? Math.min(1, Math.max(0, -e.top / t)) : 0,
              r = Math.max(0, s.scrollWidth - window.innerWidth);
            s.style.transform = `translate3d(${(-n * r).toFixed(1)}px, 0, 0)`;
          }
        },
        a = () => {
          r || ((r = !0), requestAnimationFrame(i));
        };
      return (
        window.addEventListener(`scroll`, a, { passive: !0 }),
        window.addEventListener(`resize`, a),
        i(),
        () => {
          (window.removeEventListener(`scroll`, a), window.removeEventListener(`resize`, a));
        }
      );
    }, [e]),
    (0, c.jsxs)(`div`, {
      className: `bg-background`,
      children: [
        (0, c.jsx)(`div`, {
          className: `fixed top-0 left-0 right-0 h-[3px] z-50 bg-border/50`,
          'aria-hidden': `true`,
          children: (0, c.jsx)(`div`, {
            ref: t,
            className: `h-full bg-primary origin-left will-change-transform`,
            style: { transform: `scaleX(0)` }
          })
        }),
        (0, c.jsxs)(`section`, {
          className: `relative min-h-[60vh] flex items-center justify-center overflow-hidden demo-hero-gradient`,
          'aria-labelledby': `demo1-title`,
          children: [
            (0, c.jsx)(`div`, {
              className: `absolute top-0 left-0 right-0 z-20`,
              children: (0, c.jsxs)(`div`, {
                className: `container pt-8 flex items-center justify-between`,
                children: [
                  (0, c.jsx)(`span`, {
                    className: `text-xs tracking-[0.3em] uppercase text-text-muted`,
                    children: `Study 01`
                  }),
                  (0, c.jsx)(r, {
                    to: `/`,
                    className: `text-sm text-text-muted hover:text-primary transition-colors`,
                    children: `← Back to overview`
                  })
                ]
              })
            }),
            (0, c.jsxs)(`div`, {
              ref: n,
              className: `absolute inset-0 will-change-transform`,
              'aria-hidden': `true`,
              children: [
                (0, c.jsx)(`div`, {
                  className: `absolute -top-32 -left-24 w-[440px] h-[440px] rounded-full opacity-50`,
                  style: {
                    background: `radial-gradient(circle, rgba(201,169,98,0.45), transparent 68%)`,
                    filter: `blur(36px)`
                  }
                }),
                (0, c.jsx)(`div`, {
                  className: `absolute -bottom-40 -right-20 w-[520px] h-[520px] rounded-full opacity-40`,
                  style: {
                    background: `radial-gradient(circle, rgba(139,115,85,0.4), transparent 68%)`,
                    filter: `blur(44px)`
                  }
                })
              ]
            }),
            (0, c.jsxs)(`div`, {
              className: `container relative z-10 text-center py-20`,
              children: [
                (0, c.jsx)(`p`, {
                  className: `text-xs md:text-sm tracking-[0.35em] uppercase text-text-muted`,
                  children: `Interaction Study · Scroll`
                }),
                (0, c.jsx)(`h1`, {
                  ref: d,
                  id: `demo1-title`,
                  className: `font-serif text-5xl md:text-7xl lg:text-8xl text-text mt-5 will-change-transform`,
                  children: `Immersive Scroll`
                }),
                (0, c.jsx)(`p`, {
                  className: `mt-6 text-lg md:text-xl text-text-muted max-w-2xl mx-auto`,
                  children: `Inertia-smoothed scrolling, parallax depth and a pinned horizontal gallery — scroll slowly and watch the machinery work.`
                }),
                (0, c.jsx)(`div`, {
                  className: `mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-text-muted`,
                  children: [
                    `lenis 1.3`,
                    `lerp 0.085`,
                    `rAF-throttled`,
                    `reduced-motion aware`
                  ].map((e) =>
                    (0, c.jsx)(
                      `span`,
                      {
                        className: `px-3 py-1 rounded-full border border-border bg-surface/70`,
                        children: e
                      },
                      e
                    )
                  )
                })
              ]
            }),
            (0, c.jsx)(`div`, {
              className: `absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce`,
              'aria-hidden': `true`,
              children: (0, c.jsx)(`svg`, {
                className: `w-6 h-6 text-text-muted`,
                fill: `none`,
                stroke: `currentColor`,
                viewBox: `0 0 24 24`,
                children: (0, c.jsx)(`path`, {
                  strokeLinecap: `round`,
                  strokeLinejoin: `round`,
                  strokeWidth: 2,
                  d: `M19 14l-7 7m0 0l-7-7m7 7V3`
                })
              })
            })
          ]
        }),
        e
          ? (0, c.jsxs)(`section`, {
              className: `container py-24`,
              'aria-label': `Collection gallery`,
              children: [
                (0, c.jsx)(`h2`, {
                  className: `font-serif text-3xl md:text-4xl text-text`,
                  children: `The atelier, end to end`
                }),
                (0, c.jsx)(`p`, {
                  className: `mt-2 text-text-muted`,
                  children: `Static layout — pinning and parallax are disabled for reduced motion.`
                }),
                (0, c.jsx)(`div`, {
                  className: `mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3`,
                  children: l.map((e) =>
                    (0, c.jsxs)(
                      `figure`,
                      {
                        className: `rounded-2xl overflow-hidden border border-border bg-surface`,
                        children: [
                          (0, c.jsx)(`div`, { className: `h-48`, style: { background: e.swatch } }),
                          (0, c.jsxs)(`figcaption`, {
                            className: `p-5`,
                            children: [
                              (0, c.jsx)(`p`, {
                                className: `font-medium text-text`,
                                children: e.title
                              }),
                              (0, c.jsx)(`p`, {
                                className: `text-sm text-text-muted mt-1`,
                                children: e.caption
                              })
                            ]
                          })
                        ]
                      },
                      e.title
                    )
                  )
                })
              ]
            })
          : (0, c.jsx)(`section`, {
              ref: f,
              className: `relative`,
              style: { height: `300vh` },
              'aria-label': `Collection gallery`,
              children: (0, c.jsx)(`div`, {
                className: `sticky top-0 h-screen overflow-hidden flex items-center`,
                children: (0, c.jsxs)(`div`, {
                  className: `w-full`,
                  children: [
                    (0, c.jsxs)(`div`, {
                      className: `container flex items-end justify-between mb-8`,
                      children: [
                        (0, c.jsx)(`h2`, {
                          className: `font-serif text-3xl md:text-4xl text-text`,
                          children: `The atelier, end to end`
                        }),
                        (0, c.jsx)(`span`, {
                          className: `text-xs font-mono text-text-muted hidden md:block`,
                          children: `vertical scroll → horizontal travel`
                        })
                      ]
                    }),
                    (0, c.jsx)(`div`, {
                      ref: p,
                      className: `flex gap-6 pl-[6vw] pr-[10vw] w-max will-change-transform`,
                      children: l.map((e, t) =>
                        (0, c.jsxs)(
                          `figure`,
                          {
                            className: `relative shrink-0 w-[74vw] sm:w-[46vw] lg:w-[30vw] rounded-2xl overflow-hidden border border-border bg-surface shadow-lg`,
                            children: [
                              (0, c.jsx)(`div`, {
                                className: `h-[46vh]`,
                                style: { background: e.swatch }
                              }),
                              (0, c.jsxs)(`figcaption`, {
                                className: `p-5 flex items-center justify-between`,
                                children: [
                                  (0, c.jsxs)(`div`, {
                                    children: [
                                      (0, c.jsx)(`p`, {
                                        className: `font-medium text-text`,
                                        children: e.title
                                      }),
                                      (0, c.jsx)(`p`, {
                                        className: `text-sm text-text-muted mt-1`,
                                        children: e.caption
                                      })
                                    ]
                                  }),
                                  (0, c.jsx)(`span`, {
                                    className: `font-mono text-xs text-text-muted`,
                                    children: String(t + 1).padStart(2, `0`)
                                  })
                                ]
                              })
                            ]
                          },
                          e.title
                        )
                      )
                    })
                  ]
                })
              })
            }),
        (0, c.jsxs)(`section`, {
          className: `container py-24`,
          'aria-labelledby': `demo1-aspects`,
          children: [
            (0, c.jsx)(`h2`, {
              id: `demo1-aspects`,
              className: `font-serif text-3xl md:text-4xl text-text`,
              children: `What makes it feel expensive`
            }),
            (0, c.jsx)(`p`, {
              className: `mt-2 text-text-muted max-w-2xl`,
              children: `Six details doing the heavy lifting, each entering the viewport on its own beat.`
            }),
            (0, c.jsx)(`div`, {
              className: `mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3`,
              children: u.map((e, t) => {
                let n = h.has(t);
                return (0, c.jsxs)(
                  `div`,
                  {
                    ref: m(t),
                    className: `demo-card-hover rounded-2xl border border-border bg-surface p-6`,
                    style: n
                      ? {
                          animation: `slideUp 650ms var(--ease-out-cubic) both`,
                          animationDelay: `${(t % 3) * 90}ms`
                        }
                      : { opacity: 0 },
                    children: [
                      (0, c.jsx)(`span`, {
                        className: `font-mono text-xs text-primary`,
                        children: String(t + 1).padStart(2, `0`)
                      }),
                      (0, c.jsx)(`h3`, {
                        className: `mt-3 text-lg font-medium text-text`,
                        children: e.name
                      }),
                      (0, c.jsx)(`p`, {
                        className: `mt-2 text-sm text-text-muted leading-relaxed`,
                        children: e.detail
                      })
                    ]
                  },
                  e.name
                );
              })
            })
          ]
        }),
        (0, c.jsx)(`section`, {
          className: `container pb-24`,
          children: (0, c.jsxs)(`div`, {
            className: `rounded-2xl bg-secondary text-center px-8 py-14`,
            children: [
              (0, c.jsx)(`p`, {
                className: `font-serif text-3xl md:text-4xl text-white`,
                children: `That's the whole trick.`
              }),
              (0, c.jsxs)(`p`, {
                className: `mt-3 text-sm text-white/70`,
                children: [
                  `Study 01 of 05 —`,
                  ` `,
                  (0, c.jsx)(r, {
                    to: `/demo/2`,
                    className: `text-accent hover:underline`,
                    children: `next: kinetic typography`
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
export { d as Demo1ImmersiveScroll };
