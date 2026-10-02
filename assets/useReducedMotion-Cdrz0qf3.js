import { c as e, o as t } from './index--nGSBySp.js';
var n = e(t(), 1);
function r() {
  let [e, t] = (0, n.useState)(!1);
  return (
    (0, n.useEffect)(() => {
      let e = window.matchMedia(`(prefers-reduced-motion: reduce)`);
      t(e.matches);
      let n = (e) => t(e.matches);
      return (e.addEventListener(`change`, n), () => e.removeEventListener(`change`, n));
    }, []),
    e
  );
}
export { r as t };
