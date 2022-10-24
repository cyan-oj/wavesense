import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './NavBar.module.css';
import { logout } from '../../store/session';

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
          <Link to={'/signup'}>Signup</Link>
          <br />
          <Link to={'/login'}>Login</Link>
        </div>
      );
    }
  }

  return (
    <>
      <header id={styles.navHeader}>
        <h1 id={styles.logo}>WaveSense //:^D</h1>
        { getLinks() }
      </header>
    </>
  );
}

export default NavBar;