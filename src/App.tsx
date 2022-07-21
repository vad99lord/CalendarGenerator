import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import UsersPicker from "./routes/UsersPicker";
import VkAppRoot from "./VkAppRoot";

const App = () => {
  useEffect(() => {
    fetch("api/"
    ).then((response) => response.text()).then((res)=>console.log(res));
  }, []);
  return (
    <Routes>
      <Route path="/" element={<VkAppRoot />}>
        <Route element={<AppLayout />}>
          <Route index element={<UsersPicker />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
