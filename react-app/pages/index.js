import Layout from '../components/layout'

function Index () {
  return (
    <>
      Welcome
    </>
  )
}

export default Index

Index.getLayout = function getLayout (page) {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <Layout>{page}</Layout>
}
