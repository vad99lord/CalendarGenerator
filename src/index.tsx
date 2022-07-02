import "@vkontakte/vkui/dist/vkui.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LaunchParamsProvider } from "./contexts/LaunchParamsContext";
import { fetchVkBridge } from "./network/vk/fetchVkBridge";
import reportWebVitals from "./reportWebVitals";

fetchVkBridge("VKWebAppInit", {});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <LaunchParamsProvider>
        <App />
      </LaunchParamsProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);

//runtime download for eruda console
if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  import("./eruda").then(({ default: eruda }) => {});
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
