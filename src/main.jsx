import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import Pokemon from "./components/Pokemon";
import Cabecera from "./components/Cabecera";
import Detalle from "./components/Detalle";
import Login from "./components/Login";
import { Outlet } from "react-router-dom";
import Jugar from "./components/jugar";
import Error from "./components/Error";
import PrivateRoute from "./components/PrivateRoute";


const router = createBrowserRouter([
  {
    element:(
      <>
        <Cabecera></Cabecera>
        <Outlet></Outlet>
      </>
    ),
  
    children: [
      {
        path: "/",
        element: 
        <>
        <App></App>
        </>,
        errorElement: <h1>Ruta no válida</h1>
      },
      {
        path: "pokemon",
        element: 
        <>
        <Pokemon></Pokemon>
        </>,
      },
      {
        path: "login",
        element: 
        <>
        <Login></Login>
        </>,
      },
      {
        path: "pokemon/:id",
        element: 
        <>
        <Detalle></Detalle>
        </>,
      },
      {
        path: "jugar/",
        element: 
        <PrivateRoute>
        <Jugar></Jugar>
        </PrivateRoute>,
      },
      {
        path: "*",
        element:
          <Error></Error>
      }
    ]
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);