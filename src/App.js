import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import Home from './components/Home';
import CV from './components/CV';
import About from './components/About';

const links = [
    {
        href: '/home',
        text: 'Home',
        component: Home,
        key: 'home',
        exact: true,
    },
    {
        href: '/cv',
        text: 'CV',
        component: CV,
        key: 'cv',
    },
    {
        href: '/about',
        text: 'About',
        component: About,
        key: 'about',
    },
];

const linkToRoute = link => (
    <Route path={link.href} component={link.component} key={link.key} exact={link.exact} />
);

const App = () => (
    <div className="App">
        <header>
            <Header title="Sindri" links={links} />
        </header>
        <Switch>
            {links.map(linkToRoute)}
            <Redirect from="/" to={links[0].href} />
        </Switch>
    </div>
);

export default App;
