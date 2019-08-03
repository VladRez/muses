import { connect } from 'react-redux';

import { logout } from '../../actions/session_actions';
import SiteHeader from './site_header';

const mapStateToProps = (state, ownProps) => {
    
  return {
    currentUser : state.session.id === null ? undefined : state.session.id
  };
};

const mapDispatchToProps = dispatch => ({
    logout: ()=> dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteHeader);
