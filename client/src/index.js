import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// redux
import userReducer from "./state/userReducer";
import roomReducer from "./state/roomReducer";
import { combineReducers, legacy_createStore as createStore } from "redux";
import { Provider } from "react-redux";

import { AppContextProvider } from "./shared/context";

const reducer = combineReducers({
  user: userReducer,
  room: roomReducer,
});

const store = createStore(reducer);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppContextProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContextProvider>
);
