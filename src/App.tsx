import { TooltipTourProvider } from "@contexts/TooltipTourContext";
import AppLayout from "./layouts/AppLayout";
import VkAppRoot from "./layouts/VkAppRoot";
import BirthdaysCalendar from "./routes/roots/BirthdaysCalendar";

const App = () => {
  return (
    <VkAppRoot>
      <AppLayout>
        <TooltipTourProvider tooltipsCount={3}>
          <BirthdaysCalendar />
        </TooltipTourProvider>
      </AppLayout>
    </VkAppRoot>
  );
};

export default App;
