import { useSelector, useDispatch } from 'react-redux';
import styles from './NavBar.module.css';
import { logout } from '../../store/session';
import LoginFormModal from '../SessionForms';
import { SignupFormModal } from '../SessionForms';
import PlaylistFormModal from '../PlaylistForm/PlaylistFormModal';

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
        <div className={styles.linksAuth}>
          <PlaylistFormModal />
          <button  id={styles.logout} onClick={logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div className={styles.linksAuth}>
          <SignupFormModal />
          <br />
          <LoginFormModal />
        </div>
      );
    }
  }

  return (
    <>
      <header id={styles.navHeader}>
        { getLinks() }
      </header>
    </>
  );
}

export default NavBar;