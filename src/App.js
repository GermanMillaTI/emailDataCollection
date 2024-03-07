import React from "react";

import AllPagesPDFViewer from "./components/pdf/all-pages";
/* This is required only if the project file is located 
inside the app. Otherwise you can use the external link of the pdf file*/


export default function App() {
  return (
    <div className="App">

      <h4>Email Thread Visualizer</h4>
      <div className="all-page-container">
        <AllPagesPDFViewer />
      </div>

    </div>
  );
}
