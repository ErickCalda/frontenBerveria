import React, { memo } from "react";

const HamburgerIcon = memo(() => (
  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
));

const CloseIcon = memo(() => (
  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
));

export default function MobileToggleButton({ menuOpen, setMenuOpen }) {
  return (
    <div className="md:hidden">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label="Abrir menú principal"
        className="p-2"
        type="button"
      >
        {!menuOpen ? <HamburgerIcon /> : <CloseIcon />}
      </button>
    </div>
  );
}
