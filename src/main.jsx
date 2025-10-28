import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Protected from "./routes/Protected.jsx";

import Home from "./pages/Home.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
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
      { path: "sign-in", element: <SignIn /> }, // "/sign-in"
      { path: "sign-up", element: <SignUp /> }, // "/sign-up"
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
