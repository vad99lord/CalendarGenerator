import { TooltipProvider } from "@contexts/TooltipContext";
import AppLayout from "./layouts/AppLayout";
import VkAppRoot from "./layouts/VkAppRoot";
import BirthdaysCalendar from "./routes/roots/BirthdaysCalendar";

const App = () => {
  return (
    <VkAppRoot>
      <AppLayout>
        <TooltipProvider>
          <BirthdaysCalendar />
        </TooltipProvider>
      </AppLayout>
    </VkAppRoot>
  );
};

export default App;
