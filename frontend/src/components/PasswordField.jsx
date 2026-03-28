import { useId, useState } from "react";

function EyeIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="password-toggle-icon">
      <path
        d={
          open
            ? "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            : "M3 4.5 19.5 21M10.6 6.1A11.8 11.8 0 0 1 12 6c6.5 0 10 6 10 6a18.6 18.6 0 0 1-4 4.3M6.5 8.1A18.6 18.6 0 0 0 2 12s3.5 6 10 6c1.2 0 2.3-.2 3.4-.5M9.9 9.9a3 3 0 0 0 4.2 4.2"
        }
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function PasswordField({
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "",
  name,
}) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();

  return (
    <label htmlFor={inputId}>
      {label}
      <div className="password-field">
        <input
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
    </label>
  );
}
