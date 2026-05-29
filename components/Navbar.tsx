'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BiMenu } from 'react-icons/bi';
import { FaHamburger } from 'react-icons/fa';
import { PiXCircleBold } from 'react-icons/pi';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (pathname === '/login' || pathname === '/register') return null;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const navLinks = [
    { href: '/',           label: 'DASHBOARD' },
    { href: '/analytics',  label: 'ANALYTICS' },
    { href: '/import',     label: 'IMPORT' },
    { href: '/trades/new', label: '+ NEW TRADE' },
  ];

  return (
    <nav style={{
      background: '#0a0a0a',
      borderBottom: '1px solid #1e1e1e',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>

      {/* Top info bar — desktop only */}
      {!isMobile && (
        <div style={{
          borderBottom: '1px solid #1e1e1e',
          padding: '4px 24px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span style={{ color: '#333', fontSize: '10px', letterSpacing: '2px' }}>
            TRADEJOURNAL v2.0.0
          </span>
          <span style={{ color: '#333', fontSize: '10px' }}>
            {new Date().toUTCString().toUpperCase()}
          </span>
        </div>
      )}

      {/* Main bar */}
      <div style={{
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '48px',
      }}>

        {/* Logo */}
        <Link href="/" style={{
          color: '#00ff88', fontWeight: 700,
          fontSize: '14px', letterSpacing: '3px',
          textDecoration: 'none', flexShrink: 0,
        }}>
          TJ
        </Link>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              const isNew = link.label === '+ NEW TRADE';
              return (
                <Link key={link.href} href={link.href} style={{
                  padding: '0 16px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '11px',
                  letterSpacing: '1.5px',
                  fontWeight: isActive ? 600 : 400,
                  color: isNew ? '#00ff88'
                    : isActive ? '#e8e8e8' : '#555',
                  textDecoration: 'none',
                  borderBottom: isActive
                    ? '2px solid #00ff88'
                    : '2px solid transparent',
                  borderLeft: isNew ? '1px solid #1e1e1e' : 'none',
                  marginLeft: isNew ? '8px' : '0',
                }}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Desktop logout */}
        {!isMobile && (
          <button onClick={handleLogout} style={{
            background: 'none',
            border: '1px solid #1e1e1e',
            color: '#555',
            fontSize: '11px',
            letterSpacing: '1.5px',
            padding: '6px 14px',
            cursor: 'pointer',
            fontFamily: 'Roboto Mono, monospace',
          }}>
            LOGOUT
          </button>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none',
            border: '1px solid #1e1e1e',
            color: '#00ff88',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontFamily: 'Roboto Mono, monospace',
            lineHeight: 1,
          }}>
            {menuOpen ? <PiXCircleBold size={25} /> : <BiMenu size={25} />}
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{
          borderTop: '1px solid #1e1e1e',
          background: '#0a0a0a',
        }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '16px 24px',
                borderBottom: '1px solid #111',
                color: pathname === link.href ? '#00ff88' : '#666',
                fontSize: '11px',
                letterSpacing: '2px',
                textDecoration: 'none',
                fontWeight: pathname === link.href ? 600 : 400,
              }}>
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} style={{
            display: 'block',
            width: '100%',
            padding: '16px 24px',
            textAlign: 'left',
            background: 'none',
            border: 'none',
            borderTop: '1px solid #1e1e1e',
            color: '#ff3b3b',
            fontSize: '11px',
            letterSpacing: '2px',
            cursor: 'pointer',
            fontFamily: 'Roboto Mono, monospace',
          }}>
            LOGOUT 
          </button>
        </div>
      )}
    </nav>
  );
}