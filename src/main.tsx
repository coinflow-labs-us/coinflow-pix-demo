import ReactDOM from "react-dom/client";
import App, { AppContent } from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PaymentPage } from "./pages/PaymentPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "pay",
        element: <PaymentPage />,
      },
      {
        path: "",
        element: <AppContent />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
