import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Users from "./routes/users/users";
import VkAppRoot from "./VkAppRoot";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<VkAppRoot />}>
        <Route element={<AppLayout />}>
          <Route index element={<Users />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
