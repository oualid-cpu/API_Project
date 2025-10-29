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
import EventDetails from "./pages/EventDetails.jsx";
// import SignIn from "./pages/SignIn.jsx";
// import SignUp from "./pages/SignUp.jsx";
import { LoginSignUpForms } from "./pages/LoginSignup.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
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

      { path: "user/login", element: <LoginSignUpForms /> }, // "/sign-in"
      { path: "user/sign-up", element: <LoginSignUpForms /> }, // "/sign-up"
      {
        path: "events/new", // "/events/new" (protected)
        element: (
          <Protected>
            <CreateEvent />
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
