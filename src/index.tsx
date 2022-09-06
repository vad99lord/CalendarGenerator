import { AuthProvider } from "@contexts/AuthContext";
import { CacheProvider } from "@contexts/CacheContext";
import { ConfigProvider } from "@contexts/ConfigContext";
import "@vkontakte/vkui/dist/vkui.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { fetchVkBridge } from "./network/vk/fetchVkBridge";
import reportWebVitals from "./reportWebVitals";

fetchVkBridge("VKWebAppInit", {});

ReactDOM.render(
  // <React.StrictMode>
    <CacheProvider>
      <ConfigProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </CacheProvider>,
  // </React.StrictMode>,
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
