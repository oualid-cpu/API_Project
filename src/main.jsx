import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App.jsx";
import Protected from "./routes/Protected.jsx";

import Home from "./pages/Home.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import EventDetails from "./pages/EventDetails.jsx";
// import SignIn from "./pages/SignIn.jsx";
// import SignUp from "./pages/SignUp.jsx";
import { LoginPage } from "./pages/LoginSignup.jsx";

import NotFound from "./pages/NotFound.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> }, // "/"
      { path: "events/:id", element: <EventDetails /> }, // "/events/:id"

      //Reroute users to the correct tabs
      { path: "login", element: <Navigate to="/user/login" replace /> }, // Route users to login
      { path: "sign-up", element: <Navigate to="/user/sign-up" replace /> }, // Route users to sign up
      { path: "user", element: <Navigate to="/user/login" replace /> }, // Route users to login
      { path: "dashboard", element: <Navigate to="/user/dashboard" replace /> }, // Route users dashboard

      { path: "user/login", element: <LoginPage /> }, // "/sign-in"
      { path: "user/sign-up", element: <LoginPage /> }, // "/sign-up"

      //PROTECTED ROUTES
      {
        path: "user/dashboard",
        element: (
          <Protected>
            <DashboardPage />
          </Protected>
        ),
      },
      {
        path: "events/new", // "/events/new" (protected)
        element: (
          <Protected>
            <DashboardPage />
          </Protected>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
