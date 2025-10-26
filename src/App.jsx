import BgRemove from "./components/BgRemove";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Uploads from "./components/Uploads";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BgRemove />} />
      <Route path="/uploads" element={<Uploads />} />
    </Routes>
  );
}

export default App;
