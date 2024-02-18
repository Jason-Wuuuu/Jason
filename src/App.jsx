import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home.jsx";
import Projects from "./components/Projects.jsx";
import Resume from "./components/Resume.jsx";
import ScrollTop from "./components/ScrollTop";

function App() {
  return (
    <Fragment>
      <Header />

      <Routes>
        <Route path="/Jason" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>

      <ScrollTop />
    </Fragment>
  );
}

export default App;
