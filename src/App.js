import React from "react";

import AllPagesPDFViewer from "./components/pdf/all-pages";
/* This is required only if the project file is located 
inside the app. Otherwise you can use the external link of the pdf file*/
import samplePDF from "./test3.pdf";


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
