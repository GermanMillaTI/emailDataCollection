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
    const [messages, setMessages] = useState([
        {
            id: Date.now(),
            date: "",
            sender: "",
            recipient: "",
            body: "",
        },
    ]);

    const setAndLogSelection = useCallback(
        (highlightTip) => {
            setSelections([highlightTip][0]);
        },
        [setSelections]
    );

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file && file.type === "application/pdf") {
            setPdfFile(URL.createObjectURL(file));
        } else {
            alert("Please select a valid PDF file.");
        }
    };

    const addMessage = () => {
        setMsgNumber((prevMsgNumber) => prevMsgNumber + 1);
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                id: Date.now(),
                date: "",
                sender: "",
                recipient: "",
                body: "",
            },
        ]);
    };

    const removeMessage = (id) => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    };

    console.log(messages);

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
                    messages.map((message) => (
                        <div key={message.id}>
                            <div>Message: {message.id}</div>
                            <div>
                                <button
                                    onClick={() => {
                                        try {
                                            document.getElementById(`date_${message.id}`).value = selections["text"];
                                            message['date'] = selections["text"];
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Message Date
                                </button>
                                <textarea id={`date_${message.id}`} defaultValue={message.date}></textarea>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        try {
                                            document.getElementById(`sender_${message.id}`).value = selections["text"];
                                            message['sender'] = selections["text"];
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Sender
                                </button>
                                <textarea id={`sender_${message.id}`} defaultValue={message.sender}></textarea>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        try {
                                            const currentRecipient = document.getElementById(`recipient_${message.id}`).value;
                                            const selectedRecipient = selections["text"];

                                            // Check if the current recipient is not empty
                                            if (currentRecipient.trim() !== "") {
                                                const currentRecipientsArray = currentRecipient.split(',');

                                                if (!currentRecipientsArray.includes(selectedRecipient)) {
                                                    currentRecipientsArray.push(selectedRecipient);
                                                }

                                                document.getElementById(`recipient_${message.id}`).value = currentRecipientsArray.join(',');
                                            } else {
                                                document.getElementById(`recipient_${message.id}`).value = selectedRecipient;
                                            }

                                            message['recipient'] = document.getElementById(`recipient_${message.id}`).value;
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Recipient(s): {message['recipient'] == "" ? 0 : message['recipient'].split(",").length}
                                </button>
                                <textarea id={`recipient_${message.id}`} defaultValue={message.recipient}></textarea>
                            </div>

                            <div>
                                <button
                                    onClick={() => {
                                        try {
                                            document.getElementById(`body_${message.id}`).value = selections["text"];
                                            message['body'] = selections["text"];
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Email body
                                </button>
                                <textarea id={`body_${message.id}`} rows="10" cols="55" defaultValue={message.body}></textarea>
                            </div>
                            <button onClick={() => removeMessage(message.id)}>Remove</button>
                            <hr />
                        </div>
                    ))}
            </div>
        </div>
    );
}
