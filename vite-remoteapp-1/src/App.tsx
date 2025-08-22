import "./App.css";
import TestComponent from "./components/TestComponent";

function App() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <span>Hi, i am remote application 1</span>
      <span>Vite + React + TS</span>
      <TestComponent />
    </div>
  );
}

export default App;
