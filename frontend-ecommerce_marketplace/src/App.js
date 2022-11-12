import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProductDetails from './components/pages/ProductDetails';
import Products from './components/pages/Products';
import SignUp from './components/pages/SignUp';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/productdetails' component={ProductDetails} />
          <PrivateRoute path='/products' component={Products} />
          <Route path='/sign-up' component={SignUp} />
          <PublicRoute path='/login' component={Login} />
          {/* <PrivateRoute path='/dashboard' component={Dashboard} /> */}
        </Switch>
      </Router>
    </>
  );
}

export default App;
