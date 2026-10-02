import { c as e, n as t, o as n, r } from './index--nGSBySp.js';
import { t as i } from './useReducedMotion-Cdrz0qf3.js';
var a = e(n(), 1),
  o = t(),
  s = `npm install @drape/fashion-os`,
  c = [
    {
      name: `Magnetic button`,
      detail: `The button lerps toward your cursor while it is inside the field, then eases home on leave.`
    },
    {
      name: `3D tilt card`,
      detail: `rotateX/rotateY track the pointer position; a glare highlight follows the light.`
    },
    {
      name: `Ripple`,
      detail: `A scale-fade disc spawns at the press point and evaporates in 400ms.`
    },
    {
      name: `Spring toggle`,
      detail: `The knob travels on an overshooting cubic-bezier — flick it and watch it settle.`
    },
    {
      name: `Copy feedback`,
      detail: `Clipboard write with a transient confirmation state — no alert dialogs.`
    },
    {
      name: `Cursor glow`,
      detail: `A lerped radial gradient trails the pointer — fine pointers only, skipped for reduced motion.`
    }
  ];
function l() {
  let e = i(),
    t = (0, a.useRef)(null),
    n = (0, a.useRef)(null),
    l = (0, a.useRef)(null),
    u = (0, a.useRef)(null),
    d = (0, a.useRef)(void 0),
    [f, p] = (0, a.useState)(!1),
    [m, h] = (0, a.useState)(!1),
    [g, _] = (0, a.useState)(!1);
  return (
    (0, a.useEffect)(() => {
      document.title = `Demo 5 — Micro-interaction Lab · DRAPE Fashion OS`;
    }, []),
    (0, a.useEffect)(() => {
      let e = window.matchMedia(`(pointer: fine)`);
      p(e.matches);
      let t = (e) => p(e.matches);
      return (e.addEventListener(`change`, t), () => e.removeEventListener(`change`, t));
    }, []),
    (0, a.useEffect)(() => {
      let r = t.current,
        i = n.current;
      if (!r || !i || e) return;
      let a = 0,
        o = 0,
        s = 0,
        c = 0,
        l = 0,
        u = () => {
          ((c += (o - c) * 0.18),
            (l += (s - l) * 0.18),
            (i.style.transform = `translate(${c.toFixed(2)}px, ${l.toFixed(2)}px)`),
            (a = requestAnimationFrame(u)));
        },
        d = (e) => {
          let t = r.getBoundingClientRect();
          ((o = (e.clientX - (t.left + t.width / 2)) * 0.3),
            (s = (e.clientY - (t.top + t.height / 2)) * 0.3));
        },
        f = () => {
          ((o = 0), (s = 0));
        };
      return (
        r.addEventListener(`pointermove`, d),
        r.addEventListener(`pointerleave`, f),
        (a = requestAnimationFrame(u)),
        () => {
          (cancelAnimationFrame(a),
            r.removeEventListener(`pointermove`, d),
            r.removeEventListener(`pointerleave`, f),
            (i.style.transform = ``));
        }
      );
    }, [e]),
    (0, a.useEffect)(() => {
      let t = l.current;
      if (!t || e) return;
      let n = (e) => {
          let n = t.getBoundingClientRect(),
            r = (e.clientX - n.left) / n.width,
            i = (e.clientY - n.top) / n.height;
          ((t.style.transform = `rotateX(${((0.5 - i) * 14).toFixed(2)}deg) rotateY(${((r - 0.5) * 14).toFixed(2)}deg)`),
            t.style.setProperty(`--glare-x`, `${(r * 100).toFixed(1)}%`),
            t.style.setProperty(`--glare-y`, `${(i * 100).toFixed(1)}%`));
        },
        r = () => {
          t.style.transform = `rotateX(0deg) rotateY(0deg)`;
        };
      return (
        t.addEventListener(`pointermove`, n),
        t.addEventListener(`pointerleave`, r),
        () => {
          (t.removeEventListener(`pointermove`, n), t.removeEventListener(`pointerleave`, r));
        }
      );
    }, [e]),
    (0, a.useEffect)(() => {
      let t = u.current;
      if (!t || !f || e) return;
      let n = 0,
        r = -300,
        i = -300,
        a = -300,
        o = -300,
        s = () => {
          ((a += (r - a) * 0.12),
            (o += (i - o) * 0.12),
            (t.style.transform = `translate(${(a - 128).toFixed(1)}px, ${(o - 128).toFixed(1)}px)`),
            (n = requestAnimationFrame(s)));
        },
        c = (e) => {
          ((r = e.clientX), (i = e.clientY));
        };
      return (
        window.addEventListener(`pointermove`, c, { passive: !0 }),
        (n = requestAnimationFrame(s)),
        () => {
          (cancelAnimationFrame(n), window.removeEventListener(`pointermove`, c));
        }
      );
    }, [f, e]),
    (0, a.useEffect)(
      () => () => {
        d.current && window.clearTimeout(d.current);
      },
      []
    ),
    (0, o.jsxs)(`div`, {
      className: `bg-background`,
      children: [
        (0, o.jsxs)(`section`, {
          className: `relative min-h-[55vh] flex items-center justify-center overflow-hidden demo-hero-gradient`,
          'aria-labelledby': `demo5-title`,
          children: [
            (0, o.jsx)(`div`, {
              className: `absolute top-0 left-0 right-0 z-10`,
              children: (0, o.jsxs)(`div`, {
                className: `container pt-8 flex items-center justify-between`,
                children: [
                  (0, o.jsx)(`span`, {
                    className: `text-xs tracking-[0.3em] uppercase text-text-muted`,
                    children: `Study 05`
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
              className: `container relative z-10 text-center py-20`,
              children: [
                (0, o.jsx)(`p`, {
                  className: `text-xs md:text-sm tracking-[0.35em] uppercase text-text-muted`,
                  children: `Interaction Study · Detail`
                }),
                (0, o.jsx)(`h1`, {
                  id: `demo5-title`,
                  className: `font-serif text-5xl md:text-7xl lg:text-8xl text-text mt-5`,
                  children: `Micro-interaction Lab`
                }),
                (0, o.jsx)(`p`, {
                  className: `mt-6 text-lg md:text-xl text-text-muted max-w-2xl mx-auto`,
                  children: `Six small mechanics, each doing one job well. Everything below responds to your pointer — and to nothing else.`
                })
              ]
            })
          ]
        }),
        (0, o.jsxs)(`section`, {
          className: `container py-24`,
          'aria-labelledby': `demo5-lab`,
          children: [
            (0, o.jsx)(`h2`, {
              id: `demo5-lab`,
              className: `font-serif text-3xl md:text-4xl text-text`,
              children: `The lab`
            }),
            (0, o.jsx)(`p`, {
              className: `mt-2 text-text-muted max-w-2xl`,
              children: `Try each one — these are live components, not recordings.`
            }),
            (0, o.jsxs)(`div`, {
              className: `mt-10 grid gap-6 md:grid-cols-2`,
              children: [
                (0, o.jsxs)(`div`, {
                  className: `demo-card-hover rounded-2xl border border-border bg-surface p-6`,
                  children: [
                    (0, o.jsxs)(`div`, {
                      className: `flex items-center justify-between`,
                      children: [
                        (0, o.jsx)(`h3`, {
                          className: `text-lg font-medium text-text`,
                          children: `Magnetic button`
                        }),
                        (0, o.jsx)(`span`, {
                          className: `font-mono text-xs text-primary`,
                          children: `01`
                        })
                      ]
                    }),
                    (0, o.jsx)(`p`, {
                      className: `mt-1 text-sm text-text-muted`,
                      children: c[0].detail
                    }),
                    (0, o.jsx)(`div`, {
                      ref: t,
                      className: `mt-5 h-44 flex items-center justify-center rounded-xl border border-border bg-primary-light/40 overflow-hidden`,
                      children: (0, o.jsx)(`button`, {
                        ref: n,
                        type: `button`,
                        className: `px-10 py-5 rounded-full bg-primary text-white font-medium shadow-lg will-change-transform`,
                        children: `Pull me`
                      })
                    })
                  ]
                }),
                (0, o.jsxs)(`div`, {
                  className: `demo-card-hover rounded-2xl border border-border bg-surface p-6`,
                  children: [
                    (0, o.jsxs)(`div`, {
                      className: `flex items-center justify-between`,
                      children: [
                        (0, o.jsx)(`h3`, {
                          className: `text-lg font-medium text-text`,
                          children: `3D tilt card`
                        }),
                        (0, o.jsx)(`span`, {
                          className: `font-mono text-xs text-primary`,
                          children: `02`
                        })
                      ]
                    }),
                    (0, o.jsx)(`p`, {
                      className: `mt-1 text-sm text-text-muted`,
                      children: c[1].detail
                    }),
                    (0, o.jsx)(`div`, {
                      className: `perspective-1000 mt-5`,
                      children: (0, o.jsxs)(`div`, {
                        ref: l,
                        className: `preserve-3d relative rounded-xl border border-border bg-primary-light/40 p-8 will-change-transform`,
                        style: { transition: `transform 140ms var(--ease-out-cubic)` },
                        children: [
                          (0, o.jsx)(`div`, {
                            className: `absolute inset-0 rounded-xl pointer-events-none`,
                            style: {
                              background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(201,169,98,0.25), transparent 55%)`
                            },
                            'aria-hidden': `true`
                          }),
                          (0, o.jsx)(`p`, {
                            className: `font-serif text-2xl text-text`,
                            children: `Editorial card`
                          }),
                          (0, o.jsx)(`p`, {
                            className: `mt-2 text-sm text-text-muted`,
                            children: `Move your pointer across the surface.`
                          })
                        ]
                      })
                    })
                  ]
                }),
                (0, o.jsxs)(`div`, {
                  className: `demo-card-hover rounded-2xl border border-border bg-surface p-6`,
                  children: [
                    (0, o.jsxs)(`div`, {
                      className: `flex items-center justify-between`,
                      children: [
                        (0, o.jsx)(`h3`, {
                          className: `text-lg font-medium text-text`,
                          children: `Ripple`
                        }),
                        (0, o.jsx)(`span`, {
                          className: `font-mono text-xs text-primary`,
                          children: `03`
                        })
                      ]
                    }),
                    (0, o.jsx)(`p`, {
                      className: `mt-1 text-sm text-text-muted`,
                      children: c[2].detail
                    }),
                    (0, o.jsx)(`div`, {
                      className: `mt-5 h-44 flex items-center justify-center rounded-xl border border-border bg-primary-light/40`,
                      children: (0, o.jsx)(`button`, {
                        type: `button`,
                        onPointerDown: (e) => {
                          let t = e.currentTarget,
                            n = t.getBoundingClientRect(),
                            r = Math.max(n.width, n.height) * 2.2,
                            i = document.createElement(`span`);
                          ((i.className = `animate-scale-fade`),
                            (i.style.position = `absolute`),
                            (i.style.width = `${r}px`),
                            (i.style.height = `${r}px`),
                            (i.style.left = `${e.clientX - n.left - r / 2}px`),
                            (i.style.top = `${e.clientY - n.top - r / 2}px`),
                            (i.style.borderRadius = `9999px`),
                            (i.style.background = `rgba(255,255,255,0.55)`),
                            (i.style.pointerEvents = `none`),
                            t.appendChild(i),
                            window.setTimeout(() => i.remove(), 480));
                        },
                        className: `relative overflow-hidden px-10 py-5 rounded-full bg-primary text-white font-medium shadow-lg`,
                        children: `Press me`
                      })
                    })
                  ]
                }),
                (0, o.jsxs)(`div`, {
                  className: `demo-card-hover rounded-2xl border border-border bg-surface p-6`,
                  children: [
                    (0, o.jsxs)(`div`, {
                      className: `flex items-center justify-between`,
                      children: [
                        (0, o.jsx)(`h3`, {
                          className: `text-lg font-medium text-text`,
                          children: `Spring toggle`
                        }),
                        (0, o.jsx)(`span`, {
                          className: `font-mono text-xs text-primary`,
                          children: `04`
                        })
                      ]
                    }),
                    (0, o.jsx)(`p`, {
                      className: `mt-1 text-sm text-text-muted`,
                      children: c[3].detail
                    }),
                    (0, o.jsxs)(`div`, {
                      className: `mt-5 h-44 flex items-center justify-center gap-4 rounded-xl border border-border bg-primary-light/40`,
                      children: [
                        (0, o.jsx)(`button`, {
                          type: `button`,
                          role: `switch`,
                          'aria-checked': g,
                          'aria-label': `Spring toggle`,
                          onClick: () => _((e) => !e),
                          className: `relative w-16 h-9 rounded-full transition-colors duration-300 ${g ? `bg-primary` : `bg-border`}`,
                          children: (0, o.jsx)(`span`, {
                            className: `absolute top-1 left-1 w-7 h-7 rounded-full bg-white shadow-md`,
                            style: {
                              transform: `translateX(${g ? 28 : 0}px)`,
                              transition: `transform 420ms var(--ease-spring)`
                            }
                          })
                        }),
                        (0, o.jsx)(`span`, {
                          className: `font-mono text-xs text-text-muted`,
                          children: g ? `on` : `off`
                        })
                      ]
                    })
                  ]
                }),
                (0, o.jsxs)(`div`, {
                  className: `demo-card-hover rounded-2xl border border-border bg-surface p-6`,
                  children: [
                    (0, o.jsxs)(`div`, {
                      className: `flex items-center justify-between`,
                      children: [
                        (0, o.jsx)(`h3`, {
                          className: `text-lg font-medium text-text`,
                          children: `Copy feedback`
                        }),
                        (0, o.jsx)(`span`, {
                          className: `font-mono text-xs text-primary`,
                          children: `05`
                        })
                      ]
                    }),
                    (0, o.jsx)(`p`, {
                      className: `mt-1 text-sm text-text-muted`,
                      children: c[4].detail
                    }),
                    (0, o.jsxs)(`div`, {
                      className: `mt-5 h-44 flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-primary-light/40 px-4`,
                      children: [
                        (0, o.jsx)(`code`, {
                          className: `font-mono text-xs md:text-sm text-text bg-surface border border-border rounded-lg px-3 py-2`,
                          children: s
                        }),
                        (0, o.jsx)(`button`, {
                          type: `button`,
                          onClick: async () => {
                            try {
                              (await navigator.clipboard.writeText(s),
                                h(!0),
                                d.current && window.clearTimeout(d.current),
                                (d.current = window.setTimeout(() => h(!1), 1800)));
                            } catch {
                              h(!1);
                            }
                          },
                          className: `px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${m ? `bg-success text-white` : `bg-primary text-white hover:bg-primary-hover`}`,
                          children: m ? `Copied ✓` : `Copy command`
                        }),
                        (0, o.jsx)(`span`, {
                          className: `text-xs text-text-muted h-4`,
                          'aria-live': `polite`,
                          children: m ? `Install command is on your clipboard.` : ``
                        })
                      ]
                    })
                  ]
                }),
                (0, o.jsxs)(`div`, {
                  className: `demo-card-hover rounded-2xl border border-border bg-surface p-6`,
                  children: [
                    (0, o.jsxs)(`div`, {
                      className: `flex items-center justify-between`,
                      children: [
                        (0, o.jsx)(`h3`, {
                          className: `text-lg font-medium text-text`,
                          children: `Cursor glow`
                        }),
                        (0, o.jsx)(`span`, {
                          className: `font-mono text-xs text-primary`,
                          children: `06`
                        })
                      ]
                    }),
                    (0, o.jsx)(`p`, {
                      className: `mt-1 text-sm text-text-muted`,
                      children: c[5].detail
                    }),
                    (0, o.jsx)(`div`, {
                      className: `mt-5 h-44 flex items-center justify-center rounded-xl border border-border bg-primary-light/40 px-6 text-center`,
                      children:
                        f && !e
                          ? (0, o.jsx)(`p`, {
                              className: `text-sm text-text-muted`,
                              children: `The warm glow trailing your cursor is live right now — keep moving.`
                            })
                          : (0, o.jsx)(`p`, {
                              className: `text-sm text-text-muted`,
                              children: e
                                ? `Disabled for reduced motion.`
                                : `Live on fine pointers — try a mouse or trackpad.`
                            })
                    })
                  ]
                })
              ]
            }),
            f &&
              !e &&
              (0, o.jsx)(`div`, {
                ref: u,
                className: `fixed top-0 left-0 z-40 pointer-events-none w-64 h-64 rounded-full`,
                style: {
                  background: `radial-gradient(circle, rgba(201,169,98,0.28), transparent 65%)`,
                  filter: `blur(28px)`
                },
                'aria-hidden': `true`
              })
          ]
        }),
        (0, o.jsx)(`section`, {
          className: `container pb-24`,
          children: (0, o.jsxs)(`div`, {
            className: `rounded-2xl bg-secondary text-center px-8 py-14`,
            children: [
              (0, o.jsx)(`p`, {
                className: `font-serif text-3xl md:text-4xl text-white`,
                children: `Small hinges swing big doors.`
              }),
              (0, o.jsx)(`p`, {
                className: `mt-3 text-sm text-white/70`,
                children: `Study 05 of 05 — thanks for scrolling through all of them.`
              })
            ]
          })
        })
      ]
    })
  );
}
export { l as Demo5MicroInteractionLab };
