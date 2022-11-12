import "../styles/globals.css";
import type { AppProps } from "next/app";
import Chakra from "../components/Chakra";
import Layout from "../components/Layout";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={client}>
        <Chakra>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Chakra>
      </QueryClientProvider>
    </SessionProvider>
  );
}
