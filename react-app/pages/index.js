import Layout from '../components/layout'
import {GoogleApiWrapper} from 'google-maps-react';

export default GoogleApiWrapper({
  apiKey: (YOUR_GOOGLE_API_KEY_GOES_HERE)
})(MapContainer)
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
