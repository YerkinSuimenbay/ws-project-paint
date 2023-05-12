import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
  Link,
  redirect,
  Navigate,
} from "react-router-dom";

import Canvas from "./components/Canvas";
import Settings from "./components/Settings";
import Toolbar from "./components/Toolbar";
import "./styles/app.scss";

const router = createBrowserRouter([
  {
    path: "/:id",
    element: (
      // <div>
      //   <h1>Hello World</h1>
      //   <Link to="about">About Us</Link>
      // </div>
      <div className="app">
        <Toolbar />
        <Settings />
        <Canvas />
      </div>
    ),
  },
  {
    path: "about",
    element: <div>About</div>,
  },
  {
    path: "*",
    // element: <div>*</div>,
    RedirectFunction() {
      redirect(`/${Date.now().toString(16)}`);
    },
  },
]);
function App() {
  // return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
  return (
    <Routes>
      <Route
        path="/:id"
        element={
          <div className="app">
            <Toolbar />
            <Settings />
            <Canvas />
          </div>
        }
      />
      <Route
        path="*"
        element={<Navigate to={`/${Date.now().toString(16)}`} replace />}
      />
    </Routes>
  );
}

export default App;
