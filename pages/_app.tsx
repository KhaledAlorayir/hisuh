import "../styles/globals.css";
import type { AppProps } from "next/app";
import Chakra from "../components/Chakra";
import Layout from "../components/Layout";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HeadTag from "components/HeadTag";

const client = new QueryClient();

/*
  TODO:
  1- u lists
  2- bookmarks list
  3- private list  
*/

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <HeadTag />
      <SessionProvider session={session}>
        <QueryClientProvider client={client}>
          <Chakra>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Chakra>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
