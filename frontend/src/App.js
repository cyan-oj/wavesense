import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; 
import { Switch, Route } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';

import MainPage from './components/MainPage/MainPage';
// import LoginForm from './components/SessionForms/LoginForm';
// import SignupForm from './components/SessionForms/SignupForm';
import Visualizer from './components/Visualizer/Visualizer';
import { getCurrentUser } from './store/session';
import PlaylistSongIndex from './components/Playlist/PlaylistSongIndex/PlaylistSongIndex';


function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser()).then(() => setLoaded(true));
  }, [dispatch]);

  return loaded && (
    <>
      <NavBar />
      <Switch>
        <AuthRoute exact path="/" component={MainPage} />
        <Route exact path="/visualizer" component={Visualizer} />
        <Route exact path="/test" component={PlaylistSongIndex} />
      </Switch>
    </>
  );
}

export default App;