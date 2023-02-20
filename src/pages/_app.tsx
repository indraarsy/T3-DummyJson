import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";

import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import Layout from "../../components/layouts/Layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Next.js + TRPC + Chakra UI</title>
      </Head>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
