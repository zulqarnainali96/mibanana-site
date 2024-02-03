import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { MaterialUIControllerProvider } from "context";
import { Provider } from "react-redux";
import { store, persister } from "redux/store";
import { PersistGate } from "redux-persist/integration/react";
const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <MaterialUIControllerProvider>
          {/* <StrictMode> */}
            <App />
          {/* </StrictMode> */}
        </MaterialUIControllerProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
