import { Div } from "@vkontakte/vkui";
import { saveAs } from "file-saver";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import CalendarGenerator from "./routes/CalendarGenerator";
import { mockUser } from "./routes/FriendsTest";
import VkAppRoot from "./VkAppRoot";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<VkAppRoot />}>
        <Route element={<AppLayout />}>
          <Route index element={<CalendarGenerator users={[mockUser]} />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
