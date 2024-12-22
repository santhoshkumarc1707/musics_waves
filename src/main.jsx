import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "react-redux";

import { persistStore } from "redux-persist";
import './index.css'
import store from "./store/store.js";
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react';

let persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store={store}>
  <PersistGate persistor={persistor}>
<React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
  </PersistGate>
  </Provider>
)
