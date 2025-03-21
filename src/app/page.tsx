"use client";

import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { WEBSITE_URL } from "@/constants/constants";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined" && typeof navigator !== "undefined") {
        const userAgent = navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      }
      return false;
    };

    setIsMobile(checkMobile());
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "1fr",
        alignItems: "center",
        justifyItems: "center",
        minHeight: "100vh",
        margin: 0,
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          margin: 0,
          padding: 0,
        }}
      >
        {(
          <iframe
            ref={iframeRef}
            // src={null}
            style={{
              width: "100%",
              height: isMobile ? "90vh" : "100vh",
              border: "none",
              margin: 0,
              padding: 0,
              overflow: "hidden",
            }}
            allowFullScreen
          ></iframe>
        )}
      </main>
    </div>
  );
}
