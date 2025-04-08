import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import ServicePage from './pages/ServicePage';
import MealPage from './pages/MealPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/profile" component={ProfilePage} />
        <Route path="/services" component={ServicePage} />
        <Route path="/meals" component={MealPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/" exact component={DashboardPage} />
      </Switch>
    </Router>
  );
}

export default App;