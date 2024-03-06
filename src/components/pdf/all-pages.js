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
    const [messages, setMessages] = useState(Array.from({ length: 1 }, (_, i) => i + 1));

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

    const addMessage = () => {
        setMsgNumber((prevMsgNumber) => prevMsgNumber + 1);
        setMessages((prevMessages) => [...prevMessages, prevMessages.length + 1]);
    };

    console.log(messages)

    const removeMessage = (index) => {
        setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
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
                        <button onClick={addMessage}>Add message</button>
                    </div>
                )}
                <hr />

                {pdfFile &&
                    messages.map((messageIndex) => (
                        <div key={messageIndex}>
                            <div>Message: {messageIndex}</div>
                            <div>
                                <button
                                    onClick={() => {
                                        try {
                                            document.getElementById(`date_${messageIndex}`).value = selections["text"];
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Message Date
                                </button>
                                <textarea id={`date_${messageIndex}`}></textarea>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        try {
                                            document.getElementById(`sender_${messageIndex}`).value = selections["text"];
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Sender
                                </button>
                                <textarea id={`sender_${messageIndex}`}></textarea>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        try {
                                            document.getElementById(`recipient_${messageIndex}`).value = selections["text"];
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Recipient
                                </button>
                                <textarea id={`recipient_${messageIndex}`}></textarea>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        try {
                                            document.getElementById(`body_${messageIndex}`).value = selections["text"];
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Email body
                                </button>
                                <textarea id={`body_${messageIndex}`} rows="10" cols="55"></textarea>
                            </div>
                            <button onClick={() => removeMessage(messageIndex - 1)}>Remove</button>
                            <hr />
                        </div>
                    ))}
            </div>
        </div>
    );
}
