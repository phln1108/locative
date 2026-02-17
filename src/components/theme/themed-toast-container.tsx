import { useTheme } from "@/providers/theme-provider";
import { ToastContainer } from "react-toastify";

export default function ThemedToastContainer() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      theme={theme}
    />
  );
}