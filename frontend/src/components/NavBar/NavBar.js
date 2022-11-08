import { useSelector, useDispatch } from 'react-redux';
import styles from './NavBar.module.css';
import { logout } from '../../store/session';
import LoginFormModal from '../SessionForms';
import { SignupFormModal } from '../SessionForms';
import DeveloperMenu from './DeveloperMenu';


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
          <button  id={styles.logout} onClick={logoutUser}>Logout</button>
          <DeveloperMenu />
        </div>
      );
    } else {
      return (
        <div className={styles.linksAuth}>
          <SignupFormModal />
          <br />
          <LoginFormModal />
          <br />
          <DeveloperMenu />
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