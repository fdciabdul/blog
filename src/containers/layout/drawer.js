import { connect } from 'react-redux'
import { closeDrawer } from '@/redux/actions/layout'
import { changeSearchKeyword } from '@/redux/actions/search'
import Drawer from '@/components/Layout/Drawer'

const mapStateToProps = state => ({
  isShowDrawer: state.layout.drawer.isShowDrawer,
  mdSource: state.layout.toc.source,
  searchKeyword: state.search.query.keyword
})

const mapDispatchToProps = dispatch => ({
  closeDrawer: () => dispatch(closeDrawer()),
  changeSearchKeyword: keyword => dispatch(changeSearchKeyword(keyword))
})

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)
