// // import { StrictMode } from 'react'
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";

// createRoot(document.getElementById("root")!).render(<App />);

import { createRoot } from "react-dom/client";
import "./index.css";
// PrimeReact styles belong in the standalone entry only — NOT in App.tsx
// (the federation entry). When loaded via host they would inject into
// document.head untagged and leak into the host's styles.
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
