import Footer from '../components/Home/Footer'
import Header from '../components/Home/Header'
import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
export default function MyApp({ Component,  pageProps: { session, ...pageProps } }) {
  return (
    <div>
   <SessionProvider session={session}>
  <Header/>
  <Component {...pageProps} />
  <Footer/>
  </SessionProvider>
  </div>
  )
}

//  MyApp
