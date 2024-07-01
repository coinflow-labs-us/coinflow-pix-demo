import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfirmationPage } from "./pages/ConfirmationPage.tsx";
import { DepositPage } from "./pages/DepositPage.tsx";
import { PaymentPage } from "./pages/PaymentPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "confirm",
        element: <ConfirmationPage />,
      },
      {
        path: "pay",
        element: <PaymentPage />,
      },
      {
        path: "",
        element: <DepositPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
