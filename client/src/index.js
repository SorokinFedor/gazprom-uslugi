import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SubscriberGazprom from './gazpromUslugi/SubscriberGazprom';

export const Context = React.createContext(null);

const user = new SubscriberGazprom();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Context.Provider value={{ user }}>
    <App />
  </Context.Provider>
);