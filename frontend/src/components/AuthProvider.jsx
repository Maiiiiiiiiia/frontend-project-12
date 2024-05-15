import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import routes from '../utils/routes'
import { 
  useDispatch, 
  useSelector,
 } from 'react-redux';
import { setUserData } from '../slices/appSlice.js';
import { ROUTES } from '../utils/router'
import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AuthProvider = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state => state.app));
    // console.log(app); // {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiO…M1MX0.0apLj5uGle0oJTWceA5C8sihWzCLlSQF065Ie17-d8Y', username: 'admin', currentChannelId: '1', currentChannelName: 'general'}
    
    const logOut = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('nickname');
      dispatch(setUserData({ nickname: '', token: null }));
      navigate(routes.loginPathWithoutToken());
      console.log('logOut')
    };
  
    return (
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          
            <div className="container">
            <Navbar.Brand as={Link} to={ROUTES.homePagePath}>Hexlet Chat</Navbar.Brand>
              {app.token
                  ? <Button onClick={() => logOut()} >Выйти</Button>
                 : null}
            </div>
            </nav>
          </div>
        </div>
      </div>
      // <Container>

      // </Container>
      // <AuthContext.Provider value={context}>
      //   {children}
      // </AuthContext.Provider>
    );
  };

  export default AuthProvider;

