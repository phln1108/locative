import { Outlet } from "react-router";
import "react-toastify/dist/ReactToastify.css";

import { Footer } from "@/components/layout/footer";
import Header from "@/components/navigation/header";


export default function DefaultLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col max-w-10xl">
      <Header/>
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
