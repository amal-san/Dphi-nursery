import React from 'react';
import './App.css';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import Home from './components/Home';
import {HashRouter as Router,Route} from 'react-router-dom';
import { Record } from './components/Home';


const client = new ApolloClient({
  uri: 'https://dphi-nursery.herokuapp.com/graphql/', 
  cache: new InMemoryCache()
});

function App() {
  return (
    <Router>
    <ApolloProvider client={client}>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/records/" component={Record} />
      </div>
    </ApolloProvider>
    </Router>
  ); 
}

export default App;
