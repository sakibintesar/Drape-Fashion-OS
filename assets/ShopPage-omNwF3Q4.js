import { a as e, c as t, i as n, n as r, o as i, r as a, t as o } from './index--nGSBySp.js';
var s = t(i(), 1),
  c = [`All`, `Sarees`, `Kurtas`, `Dresses`, `Knitwear`, `Accessories`];
function l(e) {
  return `৳${e.toLocaleString(`en-US`)}`;
}
var u = [
    {
      id: `muslin-summer-dress`,
      name: `Muslin Summer Dress`,
      brand: `Adorn Co.`,
      category: `Dresses`,
      price: 4200,
      image: `https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop`,
      aspect: 0.72,
      colors: [`#f5f0eb`, `#c9a962`, `#8b7355`],
      badge: `New`,
      description: `Featherweight 300-count muslin with a hand-rolled hem. Breathes in July, layers in October.`,
      materials: [`Handspun muslin`, `Mother-of-pearl buttons`]
    },
    {
      id: `linen-tailored-shirt`,
      name: `Linen Tailored Shirt`,
      brand: `Thread Republic`,
      category: `Kurtas`,
      price: 3800,
      image: `https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop`,
      aspect: 0.8,
      colors: [`#e9dfd2`, `#2d2d2d`],
      description: `European flax, garment-washed for softness, cut with a mandarin collar and coconut shell buttons.`,
      materials: [`European flax linen`]
    },
    {
      id: `handwoven-cotton-scarf`,
      name: `Handwoven Cotton Scarf`,
      brand: `Loom & Grace`,
      category: `Accessories`,
      price: 1950,
      image: `https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=800&fit=crop`,
      aspect: 1.4,
      colors: [`#c9a962`, `#e0d3c0`],
      badge: `Bestseller`,
      description: `Handloom cotton with hand-knotted fringe — the everyday layer that goes with everything.`,
      materials: [`Handloom cotton`]
    },
    {
      id: `organic-cotton-trousers`,
      name: `Organic Cotton Trousers`,
      brand: `Zephyr Cuts`,
      category: `Kurtas`,
      price: 3400,
      image: `https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop`,
      aspect: 0.78,
      colors: [`#2d2d2d`, `#6b6b6b`],
      description: `GOTS-certified organic twill with a drawstring waist and deep utility pockets.`,
      materials: [`Organic cotton twill`]
    },
    {
      id: `jamdani-noon-saree`,
      name: `Jamdani Noon Saree`,
      brand: `Nakshi Studio`,
      category: `Sarees`,
      price: 8600,
      compareAtPrice: 10400,
      image: `https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop`,
      aspect: 0.75,
      colors: [`#c9a962`, `#f5f0eb`, `#8b7355`],
      badge: `Limited`,
      description: `Half-motif Jamdani woven on a pit loom in Narayanganj — discontinuous weft figures float on 240-count muslin.`,
      materials: [`Handspun muslin`, `Real zari`]
    },
    {
      id: `indigo-fold-kurta`,
      name: `Indigo Fold Kurta`,
      brand: `Thread Republic`,
      category: `Kurtas`,
      price: 3900,
      image: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop`,
      aspect: 0.8,
      colors: [`#2d3a4a`, `#1a2430`, `#e9dfd2`],
      badge: `New`,
      description: `Fermented natural indigo, dipped fourteen times. The colour ages like denim — better every wash.`,
      materials: [`Natural indigo cotton`]
    },
    {
      id: `zari-evening-stole`,
      name: `Zari Evening Stole`,
      brand: `Loom & Grace`,
      category: `Accessories`,
      price: 2450,
      image: `https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop`,
      aspect: 1.35,
      colors: [`#c9a962`, `#a8873f`],
      badge: `Bestseller`,
      description: `Silk-wool blend with a real zari border — throws over a shoulder and stays exactly where you put it.`,
      materials: [`Silk-wool blend`, `Zari`]
    },
    {
      id: `loom-crew-knit`,
      name: `Loom Crew Knit`,
      brand: `Zephyr Cuts`,
      category: `Knitwear`,
      price: 4200,
      image: `https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop`,
      aspect: 0.95,
      colors: [`#b5a488`, `#2d2d2d`, `#e0d3c0`],
      description: `Hand-framed merino in a saddle shoulder — no seams across the top, so it moves with you.`,
      materials: [`Merino wool`]
    },
    {
      id: `nakshi-border-saree`,
      name: `Nakshi Border Saree`,
      brand: `Nakshi Studio`,
      category: `Sarees`,
      price: 7800,
      image: `https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop`,
      aspect: 0.78,
      colors: [`#8b7355`, `#e9dfd2`],
      description: `Handwoven tant cotton with a hand-drawn nakshi border — stiff enough to pleat, soft enough to live in.`,
      materials: [`Tant cotton`, `Hand-drawn border`]
    },
    {
      id: `muslin-evening-kurta`,
      name: `Muslin Evening Kurta`,
      brand: `Adorn Co.`,
      category: `Kurtas`,
      price: 5200,
      compareAtPrice: 6100,
      image: `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop`,
      aspect: 0.8,
      colors: [`#f5f0eb`, `#c9a962`],
      badge: `Last few`,
      description: `Semi-sheer muslin with a chikan-embroidered placket — evening weight, oven-proof fabrication.`,
      materials: [`Muslin`, `Chikan embroidery`]
    },
    {
      id: `block-print-dupatta`,
      name: `Block-Print Dupatta`,
      brand: `Loom & Grace`,
      category: `Accessories`,
      price: 1650,
      image: `https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop`,
      aspect: 1.4,
      colors: [`#e0d3c0`, `#8b7355`],
      badge: `New`,
      description: `Hand-blocked with carved sheesham stamps — no two repeats land in exactly the same place.`,
      materials: [`Mul cotton`, `Azo-free dyes`]
    },
    {
      id: `loom-woven-wool-shawl`,
      name: `Loom-Woven Wool Shawl`,
      brand: `Loom & Grace`,
      category: `Accessories`,
      price: 3900,
      image: `https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop`,
      aspect: 1.3,
      colors: [`#6d5c42`, `#b5a488`],
      badge: `Limited`,
      description: `Handloom wool from the hill looms, finished with a hand-twisted fringe. Warm without the weight.`,
      materials: [`Hill wool`]
    },
    {
      id: `hand-knit-cardigan`,
      name: `Hand-Knit Cardigan`,
      brand: `Zephyr Cuts`,
      category: `Knitwear`,
      price: 5600,
      image: `https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop`,
      aspect: 1,
      colors: [`#b5a488`, `#2d2d2d`],
      badge: `Bestseller`,
      description: `Hand-knit in ribbed merino with horn buttons — the one cardigan that replaces three.`,
      materials: [`Ribbed merino`, `Horn buttons`]
    },
    {
      id: `tant-cotton-saree`,
      name: `Tant Cotton Saree`,
      brand: `Thread Republic`,
      category: `Sarees`,
      price: 3200,
      image: `https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop`,
      aspect: 0.72,
      colors: [`#e9dfd2`, `#c0392b`],
      description: `Crisp tant cotton with a woven stripe — the daily saree, six yards of breathable structure.`,
      materials: [`Tant cotton`]
    },
    {
      id: `raw-silk-scarf`,
      name: `Raw Silk Scarf`,
      brand: `Nakshi Studio`,
      category: `Accessories`,
      price: 2200,
      compareAtPrice: 2800,
      image: `https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop`,
      aspect: 1.45,
      colors: [`#c9a962`, `#2d3a4a`],
      description: `Matte raw silk with hand-rolled edges — holds a knot, catches the light, refuses to slip.`,
      materials: [`Raw silk`]
    },
    {
      id: `quilted-nehru-vest`,
      name: `Quilted Nehru Vest`,
      brand: `Zephyr Cuts`,
      category: `Knitwear`,
      price: 4700,
      image: `https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop`,
      aspect: 0.9,
      colors: [`#2d2d2d`, `#8b7355`],
      badge: `Last few`,
      description: `Hand-quilted kantha stitch over organic cotton — a vest that reads formal and wears like a cardigan.`,
      materials: [`Kantha quilt`, `Organic cotton`]
    }
  ],
  d = r(),
  f = {
    home: (0, d.jsx)(`path`, {
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      strokeWidth: 1.5,
      d: `M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75`
    }),
    shop: (0, d.jsx)(`path`, {
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      strokeWidth: 1.5,
      d: `M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z`
    }),
    heart: (0, d.jsx)(`path`, {
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      strokeWidth: 1.5,
      d: `M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z`
    }),
    sparkles: (0, d.jsx)(`path`, {
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      strokeWidth: 1.5,
      d: `M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z`
    })
  },
  p = [
    { to: `/`, label: `Home`, icon: `home` },
    { to: `/shop`, label: `Shop`, icon: `shop` },
    { to: `/shop?view=wishlist`, label: `Wishlist`, icon: `heart` },
    { to: `/demo/1`, label: `Demos`, icon: `sparkles` }
  ];
function m({ wishlistCount: e, testId: t }) {
  let { pathname: r, search: i } = n(),
    o = r.startsWith(`/shop`) && new URLSearchParams(i).get(`view`) === `wishlist`,
    s = (e) =>
      e === `/`
        ? r === `/`
        : e === `/shop`
          ? r.startsWith(`/shop`) && !o
          : e === `/shop?view=wishlist`
            ? o
            : r.startsWith(`/demo`);
  return (0, d.jsx)(`nav`, {
    'data-testid': t,
    className: `fixed bottom-0 inset-x-0 z-50 md:hidden bg-surface border-t border-border`,
    'aria-label': `Mobile navigation`,
    children: (0, d.jsx)(`div`, {
      className: `grid grid-cols-4`,
      children: p.map((t) => {
        let n = s(t.to),
          r = t.label === `Wishlist` && e > 0;
        return (0, d.jsxs)(
          a,
          {
            to: t.to,
            'aria-current': n ? `page` : void 0,
            className: `relative flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors ${n ? `text-primary` : `text-text-muted hover:text-text`}`,
            children: [
              (0, d.jsxs)(`span`, {
                className: `relative`,
                children: [
                  (0, d.jsx)(`svg`, {
                    className: `w-6 h-6`,
                    fill: `none`,
                    stroke: `currentColor`,
                    viewBox: `0 0 24 24`,
                    'aria-hidden': `true`,
                    children: f[t.icon]
                  }),
                  r &&
                    (0, d.jsx)(`span`, {
                      className: `absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-primary text-white text-[10px] font-medium rounded-full flex items-center justify-center`,
                      children: e
                    })
                ]
              }),
              t.label
            ]
          },
          t.label
        );
      })
    })
  });
}
var h = {
    featured: `Featured`,
    'price-asc': `Price: low to high`,
    'price-desc': `Price: high to low`,
    name: `Alphabetical`
  },
  g = 1500,
  _ = 9e3;
function v({ filled: e }) {
  return (0, d.jsx)(`svg`, {
    className: `w-5 h-5`,
    fill: e ? `currentColor` : `none`,
    stroke: `currentColor`,
    viewBox: `0 0 24 24`,
    'aria-hidden': `true`,
    children: (0, d.jsx)(`path`, {
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      strokeWidth: 2,
      d: `M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z`
    })
  });
}
function y({ product: e, className: t }) {
  return (0, d.jsxs)(`div`, {
    className: `relative overflow-hidden bg-gradient-to-br from-primary-light via-surface to-background ${t ?? ``}`,
    children: [
      (0, d.jsx)(`span`, {
        className: `absolute inset-0 flex items-center justify-center font-serif text-6xl text-primary/30`,
        'aria-hidden': `true`,
        children: e.name.charAt(0)
      }),
      (0, d.jsx)(`img`, {
        src: e.image,
        alt: e.name,
        loading: `lazy`,
        className: `absolute inset-0 w-full h-full object-cover`,
        onError: (e) => {
          e.currentTarget.style.display = `none`;
        }
      })
    ]
  });
}
function b({ product: e, onQuickView: t }) {
  let { has: n, toggle: r } = o(),
    i = n(e.id);
  return (0, d.jsxs)(`article`, {
    'data-testid': `product-card`,
    className: `group break-inside-avoid mb-6 bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-shadow duration-500`,
    children: [
      (0, d.jsxs)(`div`, {
        className: `relative`,
        style: { aspectRatio: String(e.aspect) },
        children: [
          (0, d.jsx)(y, { product: e, className: `absolute inset-0` }),
          e.badge &&
            (0, d.jsx)(`span`, {
              className: `absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full`,
              children: e.badge
            }),
          (0, d.jsx)(`button`, {
            type: `button`,
            'data-testid': `wishlist-btn`,
            onClick: () => r(e.id),
            'aria-label': i ? `Remove ${e.name} from wishlist` : `Add ${e.name} to wishlist`,
            'aria-pressed': i,
            className: `absolute top-3 right-4 p-2 rounded-full backdrop-blur transition-all duration-300 ${i ? `bg-error/90 text-white scale-110` : `bg-white/80 text-text hover:bg-white`}`,
            children: (0, d.jsx)(v, { filled: i })
          }),
          (0, d.jsx)(`div`, {
            className: `absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300`,
            children: (0, d.jsx)(`button`, {
              type: `button`,
              'data-testid': `quick-view-btn`,
              onClick: () => t(e),
              className: `w-full py-2.5 rounded-full bg-secondary/90 text-white text-sm font-medium backdrop-blur hover:bg-secondary transition-colors`,
              children: `Quick view`
            })
          })
        ]
      }),
      (0, d.jsxs)(`div`, {
        className: `p-5`,
        children: [
          (0, d.jsx)(`p`, {
            className: `text-xs uppercase tracking-widest text-text-muted`,
            children: e.brand
          }),
          (0, d.jsx)(`h3`, {
            className: `font-serif text-lg font-medium text-text mt-1 group-hover:text-primary transition-colors`,
            children: e.name
          }),
          (0, d.jsxs)(`div`, {
            className: `mt-2 flex items-center gap-2`,
            children: [
              (0, d.jsx)(`p`, { className: `font-medium text-text`, children: l(e.price) }),
              e.compareAtPrice &&
                (0, d.jsx)(`p`, {
                  className: `text-sm text-text-muted line-through`,
                  children: l(e.compareAtPrice)
                })
            ]
          }),
          (0, d.jsx)(`div`, {
            className: `mt-3 flex items-center gap-1.5`,
            children: e.colors.map((e) =>
              (0, d.jsx)(
                `span`,
                {
                  className: `w-4 h-4 rounded-full border border-border`,
                  style: { backgroundColor: e },
                  'aria-hidden': `true`
                },
                e
              )
            )
          })
        ]
      })
    ]
  });
}
function x({ product: e, onClose: t, testId: n }) {
  let { has: r, toggle: i } = o(),
    a = r(e.id),
    c = (0, s.useRef)(null);
  return (
    (0, s.useEffect)(() => {
      let e = (e) => {
        e.key === `Escape` && t();
      };
      document.addEventListener(`keydown`, e);
      let n = document.body.style.overflow;
      return (
        (document.body.style.overflow = `hidden`),
        c.current?.focus(),
        () => {
          (document.removeEventListener(`keydown`, e), (document.body.style.overflow = n));
        }
      );
    }, [t]),
    (0, d.jsxs)(`div`, {
      'data-testid': n,
      className: `fixed inset-0 z-[60] flex items-center justify-center p-4`,
      role: `dialog`,
      'aria-modal': `true`,
      'aria-label': `${e.name} quick view`,
      children: [
        (0, d.jsx)(`div`, {
          className: `absolute inset-0 bg-secondary/60 backdrop-blur-sm`,
          onClick: t,
          'aria-hidden': `true`
        }),
        (0, d.jsxs)(`div`, {
          ref: c,
          tabIndex: -1,
          className: `relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-surface rounded-2xl shadow-2xl outline-none animate-scale-in`,
          children: [
            (0, d.jsx)(`button`, {
              type: `button`,
              onClick: t,
              'aria-label': `Close quick view`,
              className: `absolute top-4 right-4 z-10 p-2 rounded-full bg-surface/90 border border-border text-text-muted hover:text-text transition-colors`,
              children: (0, d.jsx)(`svg`, {
                className: `w-5 h-5`,
                fill: `none`,
                stroke: `currentColor`,
                viewBox: `0 0 24 24`,
                'aria-hidden': `true`,
                children: (0, d.jsx)(`path`, {
                  strokeLinecap: `round`,
                  strokeLinejoin: `round`,
                  strokeWidth: 2,
                  d: `M6 18L18 6M6 6l12 12`
                })
              })
            }),
            (0, d.jsxs)(`div`, {
              className: `grid md:grid-cols-2`,
              children: [
                (0, d.jsxs)(`div`, {
                  className: `relative`,
                  children: [
                    (0, d.jsx)(y, {
                      product: e,
                      className: `aspect-[3/4] md:aspect-auto md:h-full md:min-h-[420px]`
                    }),
                    e.badge &&
                      (0, d.jsx)(`span`, {
                        className: `absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full`,
                        children: e.badge
                      })
                  ]
                }),
                (0, d.jsxs)(`div`, {
                  className: `p-8 flex flex-col`,
                  children: [
                    (0, d.jsxs)(`p`, {
                      className: `text-xs uppercase tracking-widest text-text-muted`,
                      children: [e.brand, ` · `, e.category]
                    }),
                    (0, d.jsx)(`h3`, {
                      className: `font-serif text-3xl text-text mt-2`,
                      children: e.name
                    }),
                    (0, d.jsxs)(`div`, {
                      className: `mt-3 flex items-center gap-3`,
                      children: [
                        (0, d.jsx)(`p`, {
                          className: `text-2xl font-medium text-text`,
                          children: l(e.price)
                        }),
                        e.compareAtPrice &&
                          (0, d.jsx)(`p`, {
                            className: `text-text-muted line-through`,
                            children: l(e.compareAtPrice)
                          })
                      ]
                    }),
                    (0, d.jsx)(`p`, {
                      className: `mt-4 text-sm text-text-muted leading-relaxed`,
                      children: e.description
                    }),
                    (0, d.jsxs)(`div`, {
                      className: `mt-5`,
                      children: [
                        (0, d.jsx)(`p`, {
                          className: `text-xs uppercase tracking-widest text-text-muted`,
                          children: `Materials`
                        }),
                        (0, d.jsx)(`p`, {
                          className: `text-sm text-text mt-1`,
                          children: e.materials.join(` · `)
                        })
                      ]
                    }),
                    (0, d.jsxs)(`div`, {
                      className: `mt-5`,
                      children: [
                        (0, d.jsx)(`p`, {
                          className: `text-xs uppercase tracking-widest text-text-muted`,
                          children: `Colours`
                        }),
                        (0, d.jsx)(`div`, {
                          className: `mt-2 flex items-center gap-2`,
                          children: e.colors.map((e) =>
                            (0, d.jsx)(
                              `span`,
                              {
                                className: `w-6 h-6 rounded-full border border-border`,
                                style: { backgroundColor: e },
                                'aria-hidden': `true`
                              },
                              e
                            )
                          )
                        })
                      ]
                    }),
                    (0, d.jsx)(`div`, {
                      className: `mt-auto pt-6`,
                      children: (0, d.jsx)(`button`, {
                        type: `button`,
                        onClick: () => i(e.id),
                        'aria-pressed': a,
                        className: `w-full py-3.5 rounded-full font-medium transition-colors ${a ? `bg-error/90 text-white hover:bg-error` : `bg-primary text-white hover:bg-primary-hover`}`,
                        children: a ? `In your wishlist — tap to remove` : `Add to wishlist`
                      })
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  );
}
function S({
  category: e,
  setCategory: t,
  maxPrice: n,
  setMaxPrice: r,
  onSaleOnly: i,
  setOnSaleOnly: a,
  wishlistOnly: o,
  setWishlistOnly: s,
  wishlistCount: u
}) {
  return (0, d.jsxs)(`div`, {
    className: `space-y-7`,
    children: [
      (0, d.jsxs)(`div`, {
        children: [
          (0, d.jsx)(`p`, {
            className: `text-xs uppercase tracking-widest text-text-muted mb-3`,
            children: `Category`
          }),
          (0, d.jsx)(`div`, {
            className: `flex flex-wrap gap-2`,
            children: c.map((n) =>
              (0, d.jsx)(
                `button`,
                {
                  type: `button`,
                  onClick: () => t(n),
                  'aria-pressed': e === n,
                  className: `px-4 py-1.5 rounded-full text-sm transition-colors ${e === n ? `bg-primary text-white` : `border border-border text-text hover:bg-surface`}`,
                  children: n
                },
                n
              )
            )
          })
        ]
      }),
      (0, d.jsxs)(`div`, {
        children: [
          (0, d.jsx)(`p`, {
            className: `text-xs uppercase tracking-widest text-text-muted mb-3`,
            children: `Max price`
          }),
          (0, d.jsx)(`input`, {
            type: `range`,
            min: g,
            max: _,
            step: 100,
            value: n,
            onChange: (e) => r(Number(e.target.value)),
            className: `w-full accent-primary`,
            'aria-label': `Maximum price`
          }),
          (0, d.jsxs)(`p`, {
            className: `mt-1 font-mono text-xs text-text`,
            children: [`up to `, l(n)]
          })
        ]
      }),
      (0, d.jsxs)(`div`, {
        className: `space-y-3 pt-1`,
        children: [
          (0, d.jsxs)(`label`, {
            className: `flex items-center justify-between text-sm text-text`,
            children: [
              `On sale only`,
              (0, d.jsx)(`input`, {
                type: `checkbox`,
                checked: i,
                onChange: (e) => a(e.target.checked),
                className: `accent-primary w-4 h-4`
              })
            ]
          }),
          (0, d.jsxs)(`label`, {
            className: `flex items-center justify-between text-sm text-text`,
            children: [
              `Wishlist only (`,
              u,
              `)`,
              (0, d.jsx)(`input`, {
                type: `checkbox`,
                checked: o,
                onChange: (e) => s(e.target.checked),
                className: `accent-primary w-4 h-4`
              })
            ]
          })
        ]
      })
    ]
  });
}
function C() {
  let { has: t, count: n } = o(),
    [r, i] = e(),
    a = r.get(`view`) === `wishlist`,
    [l, f] = (0, s.useState)(`All`),
    [p, g] = (0, s.useState)(_),
    [v, y] = (0, s.useState)(!1),
    [C, w] = (0, s.useState)(`featured`),
    [T, E] = (0, s.useState)(null);
  (0, s.useEffect)(() => {
    document.title = `Shop · DRAPE Fashion OS`;
  }, []);
  let D = (e) => {
      let t = new URLSearchParams(r);
      (e ? t.set(`view`, `wishlist`) : t.delete(`view`), i(t, { replace: !0 }));
    },
    O = (0, s.useMemo)(() => {
      let e = u.filter(
        (e) =>
          (l === `All` || e.category === l) &&
          e.price <= p &&
          (!v || e.compareAtPrice !== void 0) &&
          (!a || t(e.id))
      );
      switch (C) {
        case `price-asc`:
          return [...e].sort((e, t) => e.price - t.price);
        case `price-desc`:
          return [...e].sort((e, t) => t.price - e.price);
        case `name`:
          return [...e].sort((e, t) => e.name.localeCompare(t.name));
        default:
          return e;
      }
    }, [l, p, v, C, a, t]);
  return (0, d.jsxs)(`div`, {
    className: `bg-background min-h-screen pb-16 md:pb-0`,
    children: [
      (0, d.jsx)(`section`, {
        className: `border-b border-border bg-surface`,
        children: (0, d.jsxs)(`div`, {
          className: `container py-12`,
          children: [
            (0, d.jsxs)(`div`, {
              className: `flex items-center justify-between`,
              children: [
                (0, d.jsx)(`p`, {
                  className: `text-xs tracking-[0.3em] uppercase text-text-muted`,
                  children: `Phase 9 · The Shop`
                }),
                (0, d.jsx)(`a`, {
                  href: `/`,
                  className: `text-sm text-text-muted hover:text-primary transition-colors`,
                  children: `← Home`
                })
              ]
            }),
            (0, d.jsx)(`h1`, {
              className: `font-serif text-4xl md:text-6xl text-text mt-3`,
              children: `Every thread, on one shelf`
            }),
            (0, d.jsx)(`p`, {
              className: `mt-3 text-text-muted max-w-xl`,
              children: `Sixteen pieces from five ateliers — filter, sort and heart what you love. Your wishlist survives reloads.`
            })
          ]
        })
      }),
      (0, d.jsxs)(`div`, {
        className: `container py-10 lg:grid lg:grid-cols-[250px_1fr] lg:gap-10`,
        children: [
          (0, d.jsx)(`aside`, {
            className: `hidden lg:block`,
            children: (0, d.jsx)(`div`, {
              className: `sticky top-24`,
              children: (0, d.jsx)(S, {
                category: l,
                setCategory: f,
                maxPrice: p,
                setMaxPrice: g,
                onSaleOnly: v,
                setOnSaleOnly: y,
                wishlistOnly: a,
                setWishlistOnly: D,
                wishlistCount: n
              })
            })
          }),
          (0, d.jsxs)(`div`, {
            className: `lg:hidden sticky top-16 z-30 -mx-6 px-6 py-3 bg-background/95 backdrop-blur border-b border-border`,
            children: [
              (0, d.jsxs)(`div`, {
                className: `flex items-center gap-2 overflow-x-auto`,
                children: [
                  c.map((e) =>
                    (0, d.jsx)(
                      `button`,
                      {
                        type: `button`,
                        'data-testid': `category-${e.toLowerCase().replace(/\s+/g, `-`)}`,
                        onClick: () => f(e),
                        'aria-pressed': l === e,
                        className: `shrink-0 px-4 py-1.5 rounded-full text-sm transition-colors ${l === e ? `bg-primary text-white` : `border border-border text-text bg-surface`}`,
                        children: e
                      },
                      e
                    )
                  ),
                  (0, d.jsxs)(`button`, {
                    type: `button`,
                    onClick: () => D(!a),
                    'aria-pressed': a,
                    className: `shrink-0 px-4 py-1.5 rounded-full text-sm transition-colors ${a ? `bg-error/90 text-white` : `border border-border text-text bg-surface`}`,
                    children: [`♥ `, n]
                  })
                ]
              }),
              (0, d.jsxs)(`div`, {
                className: `mt-2 flex items-center justify-between`,
                children: [
                  (0, d.jsxs)(`p`, {
                    className: `text-xs text-text-muted`,
                    children: [O.length, ` piece`, O.length === 1 ? `` : `s`]
                  }),
                  (0, d.jsx)(`select`, {
                    value: C,
                    onChange: (e) => w(e.target.value),
                    'data-testid': `sort-select-mobile`,
                    className: `border border-border rounded-lg px-2 py-1.5 bg-surface text-text text-xs`,
                    'aria-label': `Sort products`,
                    children: Object.entries(h).map(([e, t]) =>
                      (0, d.jsx)(`option`, { value: e, children: t }, e)
                    )
                  })
                ]
              })
            ]
          }),
          (0, d.jsxs)(`div`, {
            children: [
              (0, d.jsxs)(`div`, {
                className: `hidden lg:flex items-center justify-between mb-6`,
                children: [
                  (0, d.jsxs)(`p`, {
                    className: `text-sm text-text-muted`,
                    children: [
                      O.length,
                      ` piece`,
                      O.length === 1 ? `` : `s`,
                      a ? ` in your wishlist` : ``,
                      v ? ` on sale` : ``
                    ]
                  }),
                  (0, d.jsxs)(`label`, {
                    className: `flex items-center gap-2 text-sm text-text-muted`,
                    children: [
                      `Sort`,
                      (0, d.jsx)(`select`, {
                        value: C,
                        onChange: (e) => w(e.target.value),
                        'data-testid': `sort-select`,
                        className: `border border-border rounded-lg px-3 py-2 bg-surface text-text text-sm`,
                        'aria-label': `Sort products`,
                        children: Object.entries(h).map(([e, t]) =>
                          (0, d.jsx)(`option`, { value: e, children: t }, e)
                        )
                      })
                    ]
                  })
                ]
              }),
              O.length === 0
                ? (0, d.jsxs)(`div`, {
                    className: `py-24 text-center`,
                    children: [
                      (0, d.jsx)(`p`, {
                        className: `font-serif text-2xl text-text`,
                        children: `Nothing matches those filters.`
                      }),
                      (0, d.jsx)(`button`, {
                        type: `button`,
                        onClick: () => {
                          (f(`All`), g(_), y(!1), w(`featured`), a && D(!1));
                        },
                        className: `mt-5 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors`,
                        children: `Clear all filters`
                      })
                    ]
                  })
                : (0, d.jsx)(`div`, {
                    'data-testid': `product-grid`,
                    className: `columns-1 sm:columns-2 xl:columns-3 gap-6`,
                    children: O.map((e) => (0, d.jsx)(b, { product: e, onQuickView: E }, e.id))
                  })
            ]
          })
        ]
      }),
      T && (0, d.jsx)(x, { product: T, onClose: () => E(null), testId: `quick-view-modal` }),
      (0, d.jsx)(m, { wishlistCount: n, testId: `mobile-bottom-nav` })
    ]
  });
}
export { C as ShopPage };
