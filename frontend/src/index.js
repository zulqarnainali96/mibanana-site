import React, { StrictMode } from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { MaterialUIControllerProvider } from "context";
import "./index.css"
import { persister, store } from "redux/store";
import { SocketProvider } from "sockets";
const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <SocketProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
          <MaterialUIControllerProvider>
            {/* <StrictMode> */}
            <App />
            {/* </StrictMode> */}
          </MaterialUIControllerProvider>
        </PersistGate>
      </Provider>
    </SocketProvider>
  </BrowserRouter>
);
