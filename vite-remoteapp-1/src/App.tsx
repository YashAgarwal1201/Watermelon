import "./App.css";
import Home from "./components/Home";

// In your React remote component
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "tailwindcss/index.css";
// import TestComponent from "./components/TestComponent";

import {
  BrowserRouter,
  Routes,
  Route,
  // createBrowserRouter,
  // RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import SubPage1 from "./components/SubPage1";
import SubPage2 from "./components/SubPage2";

export default function App() {
  return (
    <BrowserRouter basename="remote/vite_react_remoteapp">
      <Routes>
        {/* Wrap with a layout (header/footer shared) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sub-page-1" element={<SubPage1 />} />
          <Route path="sub-page-2" element={<SubPage2 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       { index: true, element: <Home /> },
//       { path: "sub-page-1", element: <SubPage1 /> },
//       { path: "sub-page-2", element: <SubPage2 /> },
//     ],
//   },
// ]);

// export default function App() {
//   return <RouterProvider router={router} />;
// }
