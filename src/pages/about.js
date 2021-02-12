import About from '@/containers/about/about'
import { fetchAbout } from '@/redux/actions/about'

About.getInitialProps = async props => {
  const { store, isServer } = props.ctx
  if (isServer) {
    store.dispatch(fetchAbout())
  }
  return { isServer }
}

export default About
