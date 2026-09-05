import { Route, Routes } from "react-router-dom";
import { Editor } from "@/routes/Editor";
import { Screensaver } from "@/routes/Screensaver";

export const App = () => (
  <Routes>
    <Route path="/" element={<Editor />} />
    <Route path="/screensaver" element={<Screensaver />} />
  </Routes>
);
