import { useEffect, useState } from "react";

const MOBILE_VIEWPORT_QUERY = "(max-width: 540px)";

function getInitialViewportState() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(MOBILE_VIEWPORT_QUERY).matches;
}

function useIsMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(getInitialViewportState);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQueryList = window.matchMedia(MOBILE_VIEWPORT_QUERY);
    const updateViewportState = (event?: MediaQueryListEvent) => {
      setIsMobileViewport(event?.matches ?? mediaQueryList.matches);
    };

    updateViewportState();

    mediaQueryList.addEventListener("change", updateViewportState);

    return () => {
      mediaQueryList.removeEventListener("change", updateViewportState);
    };
  }, []);

  return isMobileViewport;
}

export default useIsMobileViewport;
