import Axios from 'axios';
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Link,
} from 'react-router-dom';
import {
  Container, Row, Col, Nav, Navbar, Tab,
} from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import Events from './Events';
import Map from './Add/TestMap';
import Gallery from './Gallery/Gallery';
import Landing from './Landing/Landing';
import SetupProfile from './ProfileSetup/Setup';
import Search from './search/Search';
import Splash from './splash/Splash';
// import lslist from './livestream/lsList.jsx';

import Discover from './Discover/Discover';
import LsList from './livestream/lsList.jsx';

const App = () => {
  const [view, setView] = useState('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [genre, setGenre] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['testCookie']);

  useEffect(() => {
    if (cookies.testCookie && cookies.testCookie.loggedIn) {
      setUser(cookies.testCookie.userName);
      setUserInfo(cookies.testCookie);
      if (cookies.testCookie.genreId.length > 0) {
        setGenre(cookies.testCookie.genreId);
      }
      if (!cookies.testCookie.profilePrompt) {
        setView('Setup');
      }
      setIsLoggedIn(cookies.testCookie.loggedIn);
    }
  }, []);

  const loginRedir = () => {
    // TODO: fix this with react router
    window.location = `${process.env.REDIRECT}api/oauth/google`;
  };

  const logout = () => {
    Axios.get('/api/oauth/logout');
  };

  const renderView = () => {
    if (view === 'Home') {
      return <Landing user={user} genre={genre} />;
    } if (view === 'Add') {
      return <Map />;
    } if (view === 'Search') {
      return <Search userInfo={userInfo} />;
    } if (view === 'Gallery') {
      return <Gallery />;
    } if (view === 'Events') {
      return <Events user={user} userInfo={userInfo} />;
    } if (view === 'Map') {
      return <Map />;
    } if (view === 'Setup') {
      return <SetupProfile setView={setView} setUser={setUser} user={user} setGenre={setGenre} />;
    } if (view === 'Discover') {
      return <Discover genre={genre} />;
    } if (view === 'Livestreams') {
      return <LsList />
    }
    return <Splash />;
  };

  if (!user) {
    return (
      <div>
        <Splash loginRedir={loginRedir} />
      </div>
    );
  }

  if (view === 'Setup') {
    return (
      <div className="Page-JSX-View-Container">
        {renderView()}
      </div>
    );
  }
  return (
    <div className="Page-JSX-View-Container">
      <Navbar collapseOnSelect expand="lg" variant="dark" sticky="top" className="main-nav">
        {view !== 'Setup' && (
          <Navbar.Brand onClick={() => setView('Home')}>
            Welcome,
            {' '}
            {user}
            !
          </Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="justify-content-between">
            <Nav.Link className="main-nav-link" onClick={() => setView('Home')}>Home</Nav.Link>
            <Nav.Link className="main-nav-link" onClick={() => setView('Add')}>Add</Nav.Link>
            <Nav.Link className="main-nav-link" onClick={() => setView('Search')}>Search</Nav.Link>
            <Nav.Link className="main-nav-link" onClick={() => setView('Events')}>Events</Nav.Link>
            <Nav.Link className="main-nav-link" onClick={() => setView('Gallery')}>Gallery</Nav.Link>
            <Nav.Link className="main-nav-link" onClick={() => setView('Discover')}>Discover</Nav.Link>
            <Nav.Link className="main-nav-link" onClick={() => setView('Livestreams')}>Livestreams</Nav.Link>
            <Nav.Link
              onClick={() => {
                logout();
                setUser('');
              }}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div>
        {renderView()}
      </div>
    </div>

  );
};

export default App;
