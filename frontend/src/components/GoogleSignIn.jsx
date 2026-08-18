import { useEffect, useRef, useState } from "react";
import api from "../api/client";

let gsiPromise;

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gsiPromise) return gsiPromise;
  gsiPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-gsi]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Could not load Google Sign-In")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.gsi = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Google Sign-In"));
    document.head.appendChild(script);
  });
  return gsiPromise;
}

export default function GoogleSignIn({ onCredential, disabled, label = "Continue with Google" }) {
  const hostRef = useRef(null);
  const [config, setConfig] = useState({ enabled: false, client_id: "" });
  const [ready, setReady] = useState(false);
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;

  useEffect(() => {
    api
      .get("/auth/google/config")
      .then((res) => setConfig(res.data))
      .catch(() => setConfig({ enabled: false, client_id: "" }));
  }, []);

  useEffect(() => {
    if (!config.enabled || !config.client_id || !hostRef.current) return undefined;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !hostRef.current) return;
        window.google.accounts.id.initialize({
          client_id: config.client_id,
          callback: (response) => callbackRef.current?.(response.credential),
          ux_mode: "popup",
          auto_select: false,
        });
        hostRef.current.innerHTML = "";
        const width = Math.min(400, Math.max(220, Math.floor(hostRef.current.offsetWidth || 320)));
        window.google.accounts.id.renderButton(hostRef.current, {
          theme: "filled_black",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width,
          logo_alignment: "left",
        });
        setReady(true);
      })
      .catch(() => setReady(false));
    const onResize = () => {
      if (!hostRef.current || !window.google?.accounts?.id) return;
      hostRef.current.innerHTML = "";
      const width = Math.min(400, Math.max(220, Math.floor(hostRef.current.offsetWidth || 320)));
      window.google.accounts.id.renderButton(hostRef.current, {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width,
        logo_alignment: "left",
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [config.enabled, config.client_id]);

  if (!config.enabled) {
    return (
      <button
        type="button"
        disabled
        title="Add GOOGLE_CLIENT_ID to backend/.env"
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold text-zinc-500"
      >
        <GoogleMark />
        {label}
      </button>
    );
  }

  return (
    <div className={`w-full ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <div ref={hostRef} className="flex min-h-10 w-full justify-center overflow-hidden" />
      {!ready && (
        <p className="mt-2 text-center text-xs text-zinc-500">Loading Google Sign-In…</p>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.8-6.7 7.5l6.3 5.3C38.2 37.3 44 32 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
