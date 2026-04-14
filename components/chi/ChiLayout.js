"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * @param {{
 *   title?: string;
 *   children: import('react').ReactNode;
 *   overlayHeader?: boolean;
 * }} props
 */
export default function ChiLayout({ title, children, overlayHeader }) {
  const fullTitle = title ? `${title} · Chi` : "Chi";
  const [headerVisible, setHeaderVisible] = useState(!overlayHeader);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!overlayHeader) return undefined;

    const onMove = (e) => {
      if (e.clientY <= 56) {
        setHeaderVisible(true);
        return;
      }
      if (headerRef.current?.contains(e.target)) return;
      setHeaderVisible(false);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [overlayHeader]);

  const rootClass =
    "chi-root" + (overlayHeader ? " chi-root--overlay-header" : "");

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={rootClass} data-chi-root>
        <header
          ref={headerRef}
          className={
            overlayHeader
              ? `chi-header chi-header--overlay${headerVisible ? " is-visible" : ""}`
              : "chi-header"
          }
        >
          <Link href="/chi">Home</Link>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link href="/chi/settings">Settings</Link>
          </nav>
        </header>
        {children}
      </div>
    </>
  );
}
