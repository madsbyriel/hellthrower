import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ConfigProvider from './contexts/ConfigProvider';
import StratagemProvider from './contexts/StratagemProvider';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ConfigProvider>
    <StratagemProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </StratagemProvider>
  </ConfigProvider>
);
