import { color, font } from "@/lib/theme";

/**
 * Global styles for the screenprint system. Injected once by Layout.
 * Everything here is either a reset, a reusable print primitive, or a
 * keyframe — page-specific styling stays with its page.
 */
export default function GlobalStyle() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; background: ${color.paper}; color: ${color.ink}; }
      a { color: inherit; text-decoration: none; }
      button { font: inherit; }
      ::selection { background: ${color.sun}; color: ${color.ink}; }

      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-track { background: ${color.paperDeep}; }
      ::-webkit-scrollbar-thumb { background: ${color.ink}; }

      :focus-visible {
        outline: 3px solid ${color.tongue};
        outline-offset: 2px;
      }

      /* --- print primitives --- */

      .press {
        transition: transform 0.12s cubic-bezier(0.2,0,0,1),
                    box-shadow 0.12s cubic-bezier(0.2,0,0,1);
      }
      .press:hover { transform: translate(-2px, -2px); }
      .press:active { transform: translate(2px, 2px); }

      /* Misregistration: the color layer slides against the ink layer. */
      .misreg { position: relative; }
      .misreg::before {
        content: "";
        position: absolute;
        inset: 0;
        background: var(--misreg-color, ${color.croc});
        transform: translate(6px, 6px);
        z-index: -1;
        transition: transform 0.18s cubic-bezier(0.2,0,0,1);
      }
      .misreg:hover::before { transform: translate(10px, 10px); }

      .ticker-track {
        display: flex;
        width: max-content;
        animation: ticker 30s linear infinite;
      }
      @keyframes ticker {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      @keyframes feedIn {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes sweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
      }

      @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
        .ticker-track { animation: none; }
      }
    `}</style>
  );
}
