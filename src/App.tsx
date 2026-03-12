import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider";
import { GeolocationProvider } from "./providers/geolocation-provider";
import { AuthProvider } from "./providers/auth-provider";
import { FavoritesProvider } from "./providers/favorites-provider";
import ThemedToastContainer from "./components/theme/themed-toast-container";
import router from "./pages/routes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <GeolocationProvider>
            <ThemedToastContainer />
            <div className="w-full flex justify-center">
              <RouterProvider router={router} />
            </div>
          </GeolocationProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
