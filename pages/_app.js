import '@/styles/globals.css'
import { Toaster } from "@/components/ui/sonner"
import Head from 'next/head'
require('dotenv').config();

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Arbeiter Web Portal</title>
      </Head>
      <Component {...pageProps} /> 
      <Toaster />
    </>
  )
}
