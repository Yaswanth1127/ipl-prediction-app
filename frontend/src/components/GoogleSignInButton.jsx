import { useEffect, useRef } from "react";

export default function GoogleSignInButton({ onCredential, disabled }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || disabled) {
      return undefined;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => onCredential(credential),
      });

      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        text: "continue_with",
        shape: "rectangular",
        width: 260,
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return undefined;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [onCredential, disabled]);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return null;
  }

  return <div ref={buttonRef} className={disabled ? "google-button disabled" : "google-button"} />;
}
