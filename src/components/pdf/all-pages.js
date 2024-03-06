import React, { useState, useCallback } from "react";
import { NormalizedSelection, PdfViewer } from "react-pdf-selection";

const Viewer = React.memo(({ document }) => {
    return <div style={{ overflowY: "auto", maxHeight: "100vh" }}>{document}</div>;
});

export default function SinglePage() {
    const [areaSelectionActive, setAreaSelectionActive] = useState(false);
    const [selections, setSelections] = useState([]);
    const [scale, setScale] = useState(1.5);
    const [pdfFile, setPdfFile] = useState(null);
    const [msgNumber, setMsgNumber] = useState(1);

    const setAndLogSelection = useCallback(
        (highlightTip) => {
            setSelections([highlightTip][0]);
        },
        [setSelections]
    );

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Ensure the selected file is a PDF
        if (file && file.type === "application/pdf") {
            setPdfFile(URL.createObjectURL(file));
        } else {
            // Handle the case when a non-PDF file is selected
            alert("Please select a valid PDF file.");
        }
    };


    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            {pdfFile && (
                <div style={{ flex: 1 }}>

                    <div>
                        <button onClick={() => setScale(scale - 0.25)}>Zoom out (-0.25)</button>
                        <button onClick={() => setScale(scale + 0.25)}>Zoom in (+0.25)</button>
                        <button onClick={() => setScale(1.5)}>Reset Zoom</button>
                    </div>



                    <PdfViewer
                        url={pdfFile}
                        selections={[]}
                        enableAreaSelection={() => areaSelectionActive}
                        SelectionType={"text"}
                        onAreaSelection={setAndLogSelection}
                        onTextSelection={setAndLogSelection}
                        scale={scale}
                    >
                        {({ document }) => <Viewer document={document} />}
                    </PdfViewer>
                </div>
            )}

            <div style={{ flex: 0.3, padding: "20px", overflowY: "auto", maxHeight: "100vh" }}>


                {pdfFile && (
                    <div>

                        <button onClick={() => setMsgNumber(msgNumber + 1)}>Add message</button>
                    </div>
                )}
                <hr />

                {pdfFile && (Array.from({ length: msgNumber }, (_, i) => (
                    <div key={i}>
                        <div>Message: {i + 1}</div>
                        <div>
                            <button onClick={() => {
                                try {
                                    document.getElementById(`date_${i}`).value = selections["text"]
                                } catch (e) {
                                    console.log(e)
                                }
                            }}>
                                Message Date
                            </button>
                            <textarea id={`date_${i}`}></textarea>
                        </div>
                        <div>
                            <button onClick={() => {
                                try {
                                    document.getElementById(`sender_${i}`).value = selections["text"]
                                } catch (e) {
                                    console.log(e)
                                }
                            }}>
                                Sender
                            </button>
                            <textarea id={`sender_${i}`}></textarea>
                        </div>
                        <div>
                            <button onClick={() => {
                                try {
                                    document.getElementById(`recipient_${i}`).value = selections["text"]
                                } catch (e) {
                                    console.log(e)
                                }
                            }}>
                                Recipient
                            </button>
                            <textarea id={`recipient_${i}`}></textarea>
                        </div>
                        <div>
                            <button onClick={() => {
                                try {
                                    document.getElementById(`body_${i}`).value = selections["text"]
                                } catch (e) {
                                    console.log(e)
                                }
                            }}>
                                Email body
                            </button>
                            <textarea id={`body_${i}`} rows="10" cols="55"></textarea>
                        </div>
                        <hr />
                    </div>
                )))}
            </div>
        </div>
    );
}
