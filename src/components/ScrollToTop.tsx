import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router preserves scroll position across navigations. Reset it on every
// pathname change. useLayoutEffect runs synchronously before paint so the user
// never sees the old scroll position flash; instant behavior survives
// Suspense remounts that would interrupt a smooth animation.
export function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}
