import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider";
import ThemedToastContainer from "./components/theme/themed-toast-container";
import router from "./pages/routes";

export default function App() {
  return (
    <ThemeProvider>
      <ThemedToastContainer />
      <div className="w-full flex justify-center">
        <RouterProvider router={router} />,
      </div>
    </ThemeProvider>
  );
}
