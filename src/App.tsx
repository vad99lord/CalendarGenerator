import AppLayout from "./layouts/AppLayout";
import VkAppRoot from "./layouts/VkAppRoot";
import UsersPicker from "./routes/UsersPicker/UsersPicker";

const App = () => {
  return (
    <VkAppRoot>
      <AppLayout>
        <UsersPicker />
      </AppLayout>
    </VkAppRoot>
  );
};

export default App;
