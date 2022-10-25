import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
import LoginFormModal from '../SessionForms';
import { SignupFormModal } from '../SessionForms';

function NavBar () {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  
  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
  }

  const getLinks = () => {
    if (loggedIn) {
      return (
        <div className="links-nav">

          <button onClick={logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div className="links-auth">
          <SignupFormModal />
          <br />
          <LoginFormModal />
        </div>
      );
    }
  }

  return (
    <>
      <h1>WaveSense //:^D</h1>
      { getLinks() }
    </>
  );
}

export default NavBar;