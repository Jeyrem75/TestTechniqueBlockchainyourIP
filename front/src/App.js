import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import GuideList from "./pages/GuideList";
import CourseList from "./pages/CourseList";
import { useContext } from "react";
import { Context } from "./context/Context";
import Register from "./pages/Register";

function App() {
  const { user, dispatch } = useContext(Context);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  }

  const Layout = () => {
    return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <nav className="bg-black text-white py-4 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold" style={{margin: '0 auto'}}>BlockchainyourIP</h1>
        </div>
      </nav>
      <div className="flex-1 flex">
        <aside className="w-64 bg-black text-white p-4">
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4">Menu</h2>
            <ul className="space-y-2 flex-1 overflow-y-auto">
              <li>
                <a href="/" className="hover:text-blue-300 block">Accueil</a>
              </li>
              {user ? (
                <>
                  <li>
                    <a href="/guides" className="hover:text-blue-300 block">Guides</a>
                  </li>
                  <li>
                    <a href="/courses" className="hover:text-blue-300 block">Formations</a>
                  </li>
                  <li className="hover:text-blue-300 block" onClick={handleLogout}>
                    <a href="/">{user && "Se déconnecter"}</a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a href="/register" className="hover:text-blue-300 block">S'inscrire</a>
                  </li>
                  <li>
                    <a href="/login" className="hover:text-blue-300 block">Se connecter</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </aside>

        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
   
    )
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/register",
          element: user ? <Navigate to="/" /> : <Register />
        },
        {
          path: "/login",
          element: user ? <Navigate to="/" /> : <Login />
        },
        {
          path: "/guides",
          element: <GuideList />,
        },
        {
          path: "/courses",
          element: user ? <CourseList /> : <Navigate to="/login" />,
        },
        {
          path: "/courses/:id",
          element: user ? <CourseList /> : <Navigate to="/login" />,
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
