import { c as e, n as t, o as n, r } from './index--nGSBySp.js';
import { t as i } from './lenis-C9A3lpHu.js';
import { t as a } from './useReducedMotion-Cdrz0qf3.js';
var o = e(n(), 1),
  s = t(),
  c = [`Kinetic`, `Typography`, `Weight`, `Rhythm`, `Motion`, `Craft`];
function l({ text: e, className: t, delay: n = 0 }) {
  return (0, s.jsx)(`span`, {
    className: t,
    'aria-label': e,
    children: e
      .split(``)
      .map((e, t) =>
        (0, s.jsx)(
          `span`,
          {
            'aria-hidden': `true`,
            className: `inline-block will-change-transform`,
            style: {
              animation: `charRise 700ms var(--ease-out-expo) both`,
              animationDelay: `${n + t * 26}ms`
            },
            children: e === ` ` ? `\xA0` : e
          },
          `${e}-${t}`
        )
      )
  });
}
function u({ reducedMotion: e }) {
  let t = (0, s.jsx)(s.Fragment, {
    children: c.map((e) =>
      (0, s.jsxs)(
        `span`,
        {
          className: `mx-7 inline-flex items-center gap-7`,
          children: [
            (0, s.jsx)(`span`, { className: `font-serif italic`, children: e }),
            (0, s.jsx)(`span`, {
              className: `w-2 h-2 rounded-full bg-accent inline-block`,
              'aria-hidden': `true`
            })
          ]
        },
        e
      )
    )
  });
  return (0, s.jsx)(`div`, {
    className: `overflow-hidden border-y border-border py-5 bg-surface`,
    'aria-hidden': `true`,
    children: (0, s.jsxs)(`div`, {
      className: `flex w-max whitespace-nowrap will-change-transform text-3xl md:text-5xl text-text`,
      style: { animation: e ? void 0 : `marquee 26s linear infinite` },
      children: [
        (0, s.jsx)(`div`, { className: `flex items-center`, children: t }),
        (0, s.jsx)(`div`, { className: `flex items-center`, children: t })
      ]
    })
  });
}
function d() {
  let e = a(),
    t = (0, o.useRef)(null),
    [n, c] = (0, o.useState)(560),
    [d, f] = (0, o.useState)(0.02),
    [p, m] = (0, o.useState)(!1);
  ((0, o.useEffect)(() => {
    document.title = `Demo 2 — Kinetic Typography · DRAPE Fashion OS`;
  }, []),
    (0, o.useEffect)(() => {
      let e = document.createElement(`link`);
      return (
        (e.rel = `stylesheet`),
        (e.href = `https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap`),
        document.head.appendChild(e),
        () => {
          document.head.removeChild(e);
        }
      );
    }, []),
    (0, o.useEffect)(() => {
      if (e) return;
      let n = new i({ lerp: 0.1, smoothWheel: !0 }),
        r = 0,
        a = 0,
        o = (e) => {
          n.raf(e);
          let i = Math.max(-7, Math.min(7, n.velocity * 0.55));
          ((a += (i - a) * 0.12),
            t.current && (t.current.style.transform = `skewY(${a.toFixed(3)}deg)`),
            (r = requestAnimationFrame(o)));
        };
      return (
        (r = requestAnimationFrame(o)),
        () => {
          (cancelAnimationFrame(r), n.destroy());
        }
      );
    }, [e]));
  let h = {
    fontFamily: `'Inter', var(--font-sans)`,
    fontWeight: n,
    letterSpacing: `${d}em`,
    fontStyle: p ? `italic` : `normal`
  };
  return (0, s.jsxs)(`div`, {
    className: `bg-background`,
    children: [
      (0, s.jsxs)(`section`, {
        className: `relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-secondary`,
        'aria-labelledby': `demo2-title`,
        children: [
          (0, s.jsx)(`div`, {
            className: `absolute top-0 left-0 right-0 z-10`,
            children: (0, s.jsxs)(`div`, {
              className: `container pt-8 flex items-center justify-between`,
              children: [
                (0, s.jsx)(`span`, {
                  className: `text-xs tracking-[0.3em] uppercase text-white/60`,
                  children: `Study 02`
                }),
                (0, s.jsx)(r, {
                  to: `/`,
                  className: `text-sm text-white/60 hover:text-white transition-colors`,
                  children: `← Back to overview`
                })
              ]
            })
          }),
          (0, s.jsxs)(`div`, {
            className: `container relative z-10 text-center py-24`,
            children: [
              (0, s.jsx)(`p`, {
                className: `text-xs md:text-sm tracking-[0.35em] uppercase text-white/60`,
                children: `Interaction Study · Type`
              }),
              (0, s.jsx)(`h1`, {
                id: `demo2-title`,
                className: `font-serif text-6xl md:text-8xl lg:text-9xl text-white mt-5 leading-none`,
                children: (0, s.jsx)(l, { text: `Kinetic Type` })
              }),
              (0, s.jsx)(`p`, {
                className: `mt-6 text-lg md:text-xl text-white/75 max-w-2xl mx-auto`,
                children: `Characters rise one by one, the marquee never stops, and the big serif headline below skews with your scroll velocity.`
              })
            ]
          })
        ]
      }),
      (0, s.jsx)(u, { reducedMotion: e }),
      (0, s.jsx)(`section`, {
        className: `min-h-[80vh] flex items-center justify-center overflow-hidden`,
        'aria-labelledby': `demo2-velocity`,
        children: (0, s.jsxs)(`div`, {
          className: `container text-center py-20`,
          children: [
            (0, s.jsx)(`p`, {
              className: `text-xs md:text-sm tracking-[0.35em] uppercase text-text-muted`,
              children: `Scroll velocity → skew`
            }),
            (0, s.jsx)(`h2`, {
              ref: t,
              id: `demo2-velocity`,
              className: `font-serif text-5xl md:text-7xl lg:text-8xl text-text mt-5 will-change-transform`,
              style: { transform: `skewY(0deg)` },
              children: `Faster is stranger`
            }),
            (0, s.jsx)(`p`, {
              className: `mt-6 text-lg text-text-muted max-w-xl mx-auto`,
              children: `Lenis reports velocity every frame; it is eased into a ±7° skewY and written directly to the style.`
            })
          ]
        })
      }),
      (0, s.jsxs)(`section`, {
        className: `container py-24`,
        'aria-labelledby': `demo2-playground`,
        children: [
          (0, s.jsx)(`h2`, {
            id: `demo2-playground`,
            className: `font-serif text-3xl md:text-4xl text-text`,
            children: `Variable font playground`
          }),
          (0, s.jsx)(`p`, {
            className: `mt-2 text-text-muted max-w-2xl`,
            children: `Inter's variable weight axis, loaded on demand for this page. Drag the sliders — the sample re-renders live.`
          }),
          (0, s.jsxs)(`div`, {
            className: `mt-10 grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] items-start`,
            children: [
              (0, s.jsxs)(`div`, {
                className: `space-y-7 rounded-2xl border border-border bg-surface p-6`,
                children: [
                  (0, s.jsxs)(`label`, {
                    className: `block`,
                    children: [
                      (0, s.jsxs)(`span`, {
                        className: `flex items-center justify-between text-sm text-text-muted`,
                        children: [
                          `Font weight`,
                          (0, s.jsx)(`span`, {
                            className: `font-mono text-xs text-text`,
                            children: n
                          })
                        ]
                      }),
                      (0, s.jsx)(`input`, {
                        type: `range`,
                        min: 100,
                        max: 900,
                        step: 10,
                        value: n,
                        onChange: (e) => c(Number(e.target.value)),
                        className: `w-full mt-2 accent-primary`,
                        'aria-label': `Font weight`
                      })
                    ]
                  }),
                  (0, s.jsxs)(`label`, {
                    className: `block`,
                    children: [
                      (0, s.jsxs)(`span`, {
                        className: `flex items-center justify-between text-sm text-text-muted`,
                        children: [
                          `Letter spacing`,
                          (0, s.jsxs)(`span`, {
                            className: `font-mono text-xs text-text`,
                            children: [d.toFixed(3), `em`]
                          })
                        ]
                      }),
                      (0, s.jsx)(`input`, {
                        type: `range`,
                        min: -0.04,
                        max: 0.24,
                        step: 0.005,
                        value: d,
                        onChange: (e) => f(Number(e.target.value)),
                        className: `w-full mt-2 accent-primary`,
                        'aria-label': `Letter spacing`
                      })
                    ]
                  }),
                  (0, s.jsxs)(`div`, {
                    className: `flex items-center justify-between`,
                    children: [
                      (0, s.jsx)(`span`, {
                        className: `text-sm text-text-muted`,
                        children: `Style`
                      }),
                      (0, s.jsx)(`button`, {
                        type: `button`,
                        onClick: () => m((e) => !e),
                        'aria-pressed': p,
                        className: `px-4 py-2 rounded-full text-sm transition-colors ${p ? `bg-primary text-white` : `border border-border text-text hover:bg-background`}`,
                        children: `Italic`
                      })
                    ]
                  })
                ]
              }),
              (0, s.jsx)(`div`, {
                className: `rounded-2xl border border-border bg-surface p-8 md:p-12 flex items-center justify-center min-h-[280px] overflow-hidden`,
                children: (0, s.jsx)(`p`, {
                  className: `text-4xl md:text-6xl text-text leading-tight text-center`,
                  style: h,
                  children: `Handwoven in Dhaka`
                })
              })
            ]
          })
        ]
      }),
      (0, s.jsx)(`section`, {
        className: `container pb-24`,
        children: (0, s.jsxs)(`div`, {
          className: `rounded-2xl border border-border bg-surface text-center px-8 py-12`,
          children: [
            (0, s.jsx)(`p`, {
              className: `font-serif text-2xl md:text-3xl text-text`,
              children: `Type that moves is type that's read.`
            }),
            (0, s.jsxs)(`p`, {
              className: `mt-3 text-sm text-text-muted`,
              children: [
                `Study 02 of 05 —`,
                ` `,
                (0, s.jsx)(r, {
                  to: `/demo/3`,
                  className: `text-primary hover:underline`,
                  children: `next: the physics playground`
                })
              ]
            })
          ]
        })
      })
    ]
  });
}
export { d as Demo2KineticTypography };
