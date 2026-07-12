import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Menu, X, Globe } from 'lucide-react';
import { useDirection } from '../../hooks/useDirection';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-[#212832] text-white  backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="text-xl font-bold tracking-tight">
          {t('nav.logo')}
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center text-white gap-1.5 cursor-pointer rounded-full border border-white border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
            aria-label="Switch language"
            style={{
              fontFamily: 'cairo',
            }}
          >
            <Globe size={13} />
            {i18n.language === 'en' ? 'عربي' : 'English'}
          </button>

          {/* <Link
            to="/contact"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-80 lg:block"
          >
            {t('nav.cta')}
          </Link> */}

          <button
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {/* {menuOpen ? <X size={20} /> : <Menu size={20} />} */}
          </button>
        </div>
      </nav>
      {/* 
      {menuOpen && (
        <div className="border-t border-border bg-background px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map(({ key, to }) => (
              <li key={key}>
                <Link
                  to={to}
                  className="block text-base font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {t(`nav.links.${key}`)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                className="mt-2 block rounded-full bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.cta')}
              </Link>
            </li>
          </ul>
        </div>
      )} */}
    </header>
  );
}
