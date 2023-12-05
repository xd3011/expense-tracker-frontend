import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { GlobalProvider } from './context/globalContext';
import { GlobalStyle } from './styles/GlobalStyle';
import bg from './img/bg.png'
import AuthService from "./services/auth.service";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import {MainLayout} from './styles/Layouts'
import Orb from './components/Orb/Orb'
import Navigation from './components/Navigation/Navigation'
import Dashboard from './components/Dashboard/Dashboard';
import Income from './components/Income/Income'
import Expenses from './components/Expenses/Expenses';
import { useGlobalContext } from './context/globalContext';
// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";
const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const global = useGlobalContext();
  console.log(global);
  const [active, setActive] = useState(1);
  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);
  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard />;
      case 2:
        return <Dashboard />;
      case 3:
        return <Income />;
      case 4: 
        return <Expenses />;
      default: 
        return <Dashboard />;
    }
  }
  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);
  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <div>
      {currentUser ? (
        <React.StrictMode>
          <GlobalStyle />
          <GlobalProvider>
            <AppStyled bg={bg} className="App">
              {orbMemo}
              <MainLayout>
                <Navigation active={active} setActive={setActive} />
                <main>
                  {displayData()}
                </main>
              </MainLayout>
            </AppStyled>
          </GlobalProvider>
        </React.StrictMode>
      ) : (
        <>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/home"} className="navbar-brand">
              haha
            </Link>
    
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
    
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          </nav>
    
          <div className="container mt-3">
            <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

const AppStyled = styled.div`
height: 100vh;
background-image: url(${props => props.bg});
position: relative;
main{
  flex: 1;
  background: rgba(252, 246, 249, 0.78);
  border: 3px solid #FFFFFF;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  overflow-x: hidden;
  &::-webkit-scrollbar{
    width: 0;
  }
}
`;

export default App;
