import "../styles/globals.css";
import type { AppProps } from "next/app";
import Chakra from "../components/Chakra";
import Layout from "../components/Layout";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Chakra>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Chakra>
    </SessionProvider>
  );
}
