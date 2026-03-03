import { createBrowserRouter } from "react-router-dom";
import HomePage from "./home";
import DefaultLayout from "./layouts/default";
import IslandLayout from "./layouts/island";
import LoginPage from "./login";
import RegisterPage from "./register";
import MapPage from "./map";
import NotFound from "./not-found";
import CategoriesPage from "./categories";
import NearbyPlacesPage from "./nearBy";
import ProfilePage from "./profile";
import BioPage from "./bio";
import FavoritesPage from "./favorites";
import CategoryCardsPage from "./category-cards";


const router = createBrowserRouter([
    {
        path: "/",
        Component: DefaultLayout,
        children: [
            {
                index: true,
                Component: HomePage
            },
            {
                path: "categories",
                Component: CategoriesPage
            },
            {
                path: "nearby",
                Component: NearbyPlacesPage
            },
            {
                path: "profile",
                Component: ProfilePage
            },
            {
                path: "favorites",
                Component: FavoritesPage
            },
            {
                path: "category",
                Component: CategoryCardsPage
            },
        ]
    },
    {
        Component: IslandLayout,
        children: [
            {
                path: "login",
                Component: LoginPage
            },
            {
                path: "register",
                Component: RegisterPage
            }
        ]
    },
    {
        path: "map",
        Component: MapPage
    },
    {
        path: "*",
        Component: NotFound
    },
    {
        path: "bio/:placeId",
        Component: BioPage
    }
]);

export default router;
