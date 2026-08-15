import { useLocation } from "wouter";

/**
 * Navigation link that works across wouter versions.
 *
 * wouter v3's <Link> renders its own <a>, so the older
 * <Link><a>…</a></Link> pattern produces a nested anchor — invalid HTML
 * that browsers resolve by breaking navigation entirely. This renders a
 * single plain <a> and drives navigation through the location hook, so
 * there's no nesting either way.
 */
export default function NavLink({
  href,
  children,
  style,
  className,
  onNavigate,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onNavigate?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "style">) {
  const [, navigate] = useLocation();

  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={(e) => {
        // Let modified clicks (new tab, download, etc.) behave natively.
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href);
        window.scrollTo({ top: 0, behavior: "auto" });
        onNavigate?.();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
