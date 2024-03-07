import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home.jsx";
import Projects from "./components/Projects.jsx";
import ScrollTop from "./components/ScrollTop";

function App() {
  return (
    <Fragment>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>

      <ScrollTop />
    </Fragment>
  );
}

export default App;
