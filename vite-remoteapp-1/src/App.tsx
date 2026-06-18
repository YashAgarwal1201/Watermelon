// import "./index.css";
// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";

// import Home from "./components/Home";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
// import SubPage1 from "./components/SubPage1";
// import SubPage2 from "./components/SubPage2";

// export default function App() {
//   const basename = (window as any)?.BASENAME ?? "remote/vite_react_remoteapp";

//   return (
//     <BrowserRouter basename={basename}>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="sub-page-1" element={<SubPage1 />} />
//           <Route path="sub-page-2" element={<SubPage2 />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

import "./index.css";

import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SubPage1 from "./components/SubPage1";
import SubPage2 from "./components/SubPage2";

export default function App() {
  // When loaded as a remote, host sets window.BASENAME before mounting.
  // When running standalone (npm run dev / npm run preview), BASENAME is
  // undefined so we fall back to "/" so the router actually matches routes.
  const basename = (window as any)?.BASENAME ?? "/";

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sub-page-1" element={<SubPage1 />} />
          <Route path="sub-page-2" element={<SubPage2 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
