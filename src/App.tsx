import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Friends from "./routes/Friends";
import VkAppRoot from "./VkAppRoot";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<VkAppRoot />}>
        <Route element={<AppLayout />}>
          <Route index element={<Friends />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
