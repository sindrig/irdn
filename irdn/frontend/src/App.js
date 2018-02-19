import React, { Component } from 'react';
import Header from './components/Header';
import {Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import Home from './Home';

const CV = () => <div>CV</div>;
const Blog = () => <div>Blog</div>;

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
        href: '/blog',
        text: 'Blog',
        component: Blog,
        key: 'blog',
    },
]

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
            <Header title="Sindri" links={links} />
        </header>
        <Switch>
            {links.map(link => <Route path={link.href} component={link.component} key={link.key} exact={link.exact}/>)}
            <Redirect from="/" to={links[0].href} />
        </Switch>
      </div>
    );
  }
}

export default App;
