// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <Script
            src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
            strategy="beforeInteractive"
            type="module"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
