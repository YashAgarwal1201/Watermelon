import "./App.css";
import Home from "./components/Home";

// In your React remote component
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "tailwindcss/index.css";
// import TestComponent from "./components/TestComponent";

function App() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Home />
      {/* <TestComponent /> */}
    </div>
  );
}

export default App;
