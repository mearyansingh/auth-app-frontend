import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from 'react-toastify';
import Container from "react-bootstrap/Container";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Loader from "./Components/Loader";
import ProtectedRoute from "./Components/ProtectedRoute";

const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const EmailVerify = lazy(() => import("./Pages/EmailVerify"));
const Profile = lazy(() => import("./Pages/Profile"));
const NotFound = lazy(() => import("./Pages/NotFound"));

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Container fluid="xxl" className="flex-grow-1">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </Container>
      </main >
      <Footer />
      <ToastContainer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "login", element: <Login /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "email-verify", element: <ProtectedRoute><EmailVerify /></ProtectedRoute> },
      { path: "*", element: <NotFound /> },
    ],
    errorElement: <NotFound />,
  },
]);
function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
