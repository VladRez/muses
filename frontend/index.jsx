//React
import React from "react";
import ReactDOM from "react-dom";
//Components
import Root from "./components/root";
import configureStore from "./store/store";

document.addEventListener("DOMContentLoaded", () => {
  let store;

  if (window.currentUser) {
    const preloadedState = {
      // entities: {
      //   users: { [window.currentUser.id]: window.currentUser }
      // },
      session: { id: window.currentUser.id }
    };
    //TO DO: delete currentUser before merge
    delete window.currentUser;
    store = configureStore(preloadedState);
  } else {
    store = configureStore();
  }

  const root = document.getElementById("root");
  ReactDOM.render(<Root store={store} />, root);
  // window.store = store
});
