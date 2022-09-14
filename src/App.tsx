import AppLayout from "./layouts/AppLayout";
import VkAppRoot from "./layouts/VkAppRoot";
import BirthdaysCalendar from "./routes/roots/BirthdaysCalendar";

const App = () => {
  return (
    <VkAppRoot>
      <AppLayout>
        <BirthdaysCalendar />
      </AppLayout>
    </VkAppRoot>
  );
};

export default App;
