// This is the entry point of the application. It initializes the Vite application and imports the main styles.
import { Outlet } from "react-router";
import Breadcrumbs from "./Breadcrumbs";

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs />
      <Outlet />
    </div>
  );
}
