import '../styles/root.css'

export default function MyApp ({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page)
  // eslint-disable-next-line react/react-in-jsx-scope
  return getLayout(<Component {...pageProps} />)
}
