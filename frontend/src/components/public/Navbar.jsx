import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const Navbar = ({ name = "Portfolio" }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    if (onHome) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    else navigate(`/#${id}`);
  };

  const solid = scrolled || !onHome || open;
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header
      data-testid="public-navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        solid ? "glass shadow-soft" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-xs font-black text-white">
            {initials}
          </span>
          <span className="text-sm font-bold tracking-tight text-gray-900">{name}</span>
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`/#${l.id}`}
                onClick={go(l.id)}
                data-testid={`nav-link-${l.id}`}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-blue"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          data-testid="nav-menu-toggle"
          onClick={() => setOpen((o) => !o)}
          className="text-gray-900 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <ul className="glass flex flex-col gap-1 border-t px-6 py-4 md:hidden">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`/#${l.id}`} onClick={go(l.id)} className="block rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};
