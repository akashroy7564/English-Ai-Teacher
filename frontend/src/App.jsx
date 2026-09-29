// import { useState } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {

//     const [message, setMessage] = useState("");
//     const [reply, setReply] = useState("");
//     const [loading, setLoading] = useState(false);

//     const sendMessage = async () => {

//         if (!message.trim() || loading) return;

//         const userMessage = message;

//         setMessage("");
//         setLoading(true);

//         try {

//             const response = await axios.post(
//                 "http://localhost:5001/api/chat",
//                 {
//                     message: userMessage
//                 }
//             );

//             setReply(response.data.reply);

//         } catch (error) {

//             console.log(error);

//             setReply(
//                 "Sorry, I couldn't connect to the AI teacher. Please try again."
//             );

//         } finally {

//             setLoading(false);

//         }
//     };


//     const handleKeyDown = (e) => {

//         if (e.key === "Enter") {
//             sendMessage();
//         }

//     };


//     return (

//         <div className="app">

//             {/* Background decoration */}
//             <div className="background-circle circle-one"></div>
//             <div className="background-circle circle-two"></div>


//             {/* Main container */}
//             <div className="chat-container">


//                 {/* Header */}
//                 <header className="header">

//                     <div className="teacher-profile">

//                         <div className="teacher-avatar">
//                             🤖
//                         </div>

//                         <div>
//                             <h2>English Teacher AI</h2>

//                             <div className="online-status">
//                                 <span></span>
//                                 AI Teacher Online
//                             </div>
//                         </div>

//                     </div>

//                     <div className="level">
//                         <span>Level</span>
//                         <strong>Beginner</strong>
//                     </div>

//                 </header>


//                 {/* Chat area */}
//                 <main className="chat-area">

//                     {/* Welcome message */}

//                     {!reply && !loading && (

//                         <div className="welcome">

//                             <div className="welcome-icon">
//                                 🎓
//                             </div>

//                             <h1>
//                                 Improve your English
//                             </h1>

//                             <p>
//                                 Practice English with your personal AI teacher.
//                                 I'll correct your grammar and help you speak
//                                 more naturally.
//                             </p>

//                             <div className="suggestions">

//                                 <button
//                                     onClick={() =>
//                                         setMessage("I go to market yesterday.")
//                                     }
//                                 >
//                                     ✏️ Correct my grammar
//                                 </button>

//                                 <button
//                                     onClick={() =>
//                                         setMessage("How can I improve my English?")
//                                     }
//                                 >
//                                     💬 Practice conversation
//                                 </button>

//                                 <button
//                                     onClick={() =>
//                                         setMessage("Give me 5 new English words.")
//                                     }
//                                 >
//                                     📚 Learn vocabulary
//                                 </button>

//                             </div>

//                         </div>

//                     )}


//                     {/* User message */}

//                     {reply && (

//                         <div className="message user-message">

//                             <div className="message-avatar">
//                                 👤
//                             </div>

//                             <div className="message-content">

//                                 <span className="message-name">
//                                     You
//                                 </span>

//                                 <div className="bubble user-bubble">
//                                     {userMessage}
//                                 </div>

//                             </div>

//                         </div>

//                     )}


//                     {/* AI response */}

//                     {reply && (

//                         <div className="message ai-message">

//                             <div className="message-avatar ai-avatar">
//                                 🤖
//                             </div>

//                             <div className="message-content">

//                                 <span className="message-name">
//                                     English Teacher
//                                 </span>

//                                 <div className="bubble ai-bubble">
//                                     {reply}
//                                 </div>

//                             </div>

//                         </div>

//                     )}


//                     {/* Loading */}

//                     {loading && (

//                         <div className="message ai-message">

//                             <div className="message-avatar ai-avatar">
//                                 🤖
//                             </div>

//                             <div className="message-content">

//                                 <span className="message-name">
//                                     English Teacher
//                                 </span>

//                                 <div className="bubble ai-bubble typing">

//                                     <span></span>
//                                     <span></span>
//                                     <span></span>

//                                 </div>

//                             </div>

//                         </div>

//                     )}

//                 </main>


//                 {/* Input area */}

//                 <div className="input-section">

//                     <div className="input-wrapper">

//                         <input
//                             type="text"
//                             value={message}
//                             onChange={(e) =>
//                                 setMessage(e.target.value)
//                             }
//                             onKeyDown={handleKeyDown}
//                             placeholder="Type your English sentence..."
//                         />

//                         <button
//                             className="send-button"
//                             onClick={sendMessage}
//                             disabled={loading || !message.trim()}
//                         >
//                             ➤
//                         </button>

//                     </div>

//                     <p className="input-hint">
//                         Press Enter to send
//                     </p>

//                 </div>


//             </div>

//         </div>
//     );
// }

// export default App;


// -------------------------------NEW MODIFIED CODE--------------------


import { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [speakingMessage, setSpeakingMessage] = useState(null);

    // Keep recognition object available
    const recognitionRef = useRef(null);

    // Keep speech synthesis available
    const speechSynthesisRef = useRef(window.speechSynthesis);

    // --------------------------------------------------
    // SPEAK AI RESPONSE
    // --------------------------------------------------

    const speakText = (text, messageId) => {
        const synth = speechSynthesisRef.current;

        if (!synth) {
            console.log("Speech synthesis is not supported.");
            return;
        }

        // If the same message is currently speaking -> STOP
        if (
            synth.speaking &&
            speakingMessage === messageId
        ) {
            synth.cancel();
            setSpeakingMessage(null);
            return;
        }

        // Stop any previous speech
        synth.cancel();

        const speech = new SpeechSynthesisUtterance(text);

        speech.lang = "en-US";
        speech.rate = 0.95;
        speech.pitch = 1.1;
        speech.volume = 1;

        // Get available voices
        const voices = synth.getVoices();

        // Try to find a natural English female voice
        const femaleVoice = voices.find(
            (voice) =>
                voice.lang.toLowerCase().startsWith("en-us") &&
                /female|samantha|zira|jenny|aria|google us english/i.test(
                    voice.name
                )
        );

        // If female voice exists, use it
        if (femaleVoice) {
            speech.voice = femaleVoice;
        } else {
            // Otherwise use any English voice
            const englishVoice = voices.find(
                (voice) =>
                    voice.lang.toLowerCase().startsWith("en")
            );

            if (englishVoice) {
                speech.voice = englishVoice;
            }
        }

        // Speech started
        speech.onstart = () => {
            console.log("AI speech started");
            setSpeakingMessage(messageId);
        };

        // Speech finished
        speech.onend = () => {
            console.log("AI speech ended");
            setSpeakingMessage(null);
        };

        // Speech error
        speech.onerror = (event) => {
            console.log("Speech error:", event);
            setSpeakingMessage(null);
        };

        // Start speaking
        synth.speak(speech);
    };

    // --------------------------------------------------
    // SEND MESSAGE TO AI
    // --------------------------------------------------

    const sendMessage = async (textToSend = message) => {
        const userText = textToSend.trim();

        if (!userText || loading) {
            return;
        }

        // Add user message immediately
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                sender: "user",
                text: userText
            }
        ]);

        // Clear input
        setMessage("");

        // Show loading
        setLoading(true);

        try {
            const response = await axios.post(
                "https://english-sathi.onrender.com/api/chat",
                {
                    message: userText
                }
            );

            const aiReply = response.data.reply;

            const messageId =
                Date.now() + Math.random();

            // Add AI response
            setMessages((prev) => [
                ...prev,
                {
                    id: messageId,
                    sender: "ai",
                    text: aiReply
                }
            ]);

            // ------------------------------------------
            // AUTOMATICALLY SPEAK AI RESPONSE
            // ------------------------------------------

            speakText(aiReply, messageId);

        } catch (error) {
            console.log("AI error:", error);

            const errorId =
                Date.now() + Math.random();

            const errorMessage =
                "Sorry, I couldn't connect to the AI teacher. Please try again.";

            setMessages((prev) => [
                ...prev,
                {
                    id: errorId,
                    sender: "ai",
                    text: errorMessage
                }
            ]);

            speakText(errorMessage, errorId);

        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // ENTER KEY
    // --------------------------------------------------

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    // --------------------------------------------------
    // SPEECH RECOGNITION
    // --------------------------------------------------

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(
                "Speech recognition is not supported in this browser. Please use Google Chrome."
            );

            return;
        }

        // If already listening, stop
        if (listening && recognitionRef.current) {
            recognitionRef.current.stop();
            return;
        }

        const recognition = new SpeechRecognition();

        recognitionRef.current = recognition;

        recognition.lang = "en-US";

        // Stop after user finishes speaking
        recognition.continuous = false;

        // Only final transcript
        recognition.interimResults = false;

        // --------------------------------------------------
        // RECOGNITION START
        // --------------------------------------------------

        recognition.onstart = () => {
            console.log("Listening started");
            setListening(true);
        };

        // --------------------------------------------------
        // SPEECH RESULT
        // --------------------------------------------------

        recognition.onresult = (event) => {
            const transcript =
                event.results[0][0].transcript;

            console.log("Transcript:", transcript);

            // Put transcript in input
            setMessage(transcript);

            // ------------------------------------------
            // AUTOMATICALLY SEND THE MESSAGE
            // ------------------------------------------

            sendMessage(transcript);
        };

        // --------------------------------------------------
        // RECOGNITION ERROR
        // --------------------------------------------------

        recognition.onerror = (event) => {
            console.log(
                "Speech recognition error:",
                event.error
            );

            setListening(false);
        };

        // --------------------------------------------------
        // RECOGNITION END
        // --------------------------------------------------

        recognition.onend = () => {
            console.log("Listening ended");

            setListening(false);

            recognitionRef.current = null;
        };

        // Start microphone
        recognition.start();
    };

    // --------------------------------------------------
    // STOP SPEAKING
    // --------------------------------------------------

    const stopSpeaking = () => {
        const synth = speechSynthesisRef.current;

        if (synth) {
            synth.cancel();
        }

        setSpeakingMessage(null);
    };

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
<div className={`app ${speakingMessage !== null ? "ai-speaking" : ""}`}>

            {/* Background decoration */}
            <div className="background-circle circle-one"></div>
            <div className="background-circle circle-two"></div>

            {/* Main container */}
            <div className="chat-container">

                {/* Header */}
                <header className="header">

                    <div className="teacher-profile">

                        <div className="teacher-avatar">
                            🤖
                        </div>

                        <div>
                            <h2>
                                English Teacher AI
                            </h2>

                            <div className="online-status">
                                <span></span>
                                AI Teacher Online
                            </div>
                        </div>

                    </div>

                    <div className="level">
                        <span>Level</span>
                        <strong>Beginner</strong>
                    </div>

                </header>

                {/* Chat area */}
                <main className="chat-area">

                    {/* Welcome screen */}
                    {messages.length === 0 && !loading && (

                        <div className="welcome">

                            <div className="welcome-icon">
                                🎓
                            </div>

                            <h1>
                                Improve your English
                            </h1>

                            <p>
                                Practice English with your
                                personal AI teacher. I'll
                                correct your grammar and help
                                you speak more naturally.
                            </p>

                            <div className="suggestions">

                                <button
                                    onClick={() =>
                                        setMessage(
                                            "I go to market yesterday."
                                        )
                                    }
                                >
                                    ✏️ Correct my grammar
                                </button>

                                <button
                                    onClick={() =>
                                        setMessage(
                                            "How can I improve my English?"
                                        )
                                    }
                                >
                                    💬 Practice conversation
                                </button>

                                <button
                                    onClick={() =>
                                        setMessage(
                                            "Give me 5 new English words."
                                        )
                                    }
                                >
                                    📚 Learn vocabulary
                                </button>

                            </div>

                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg) => (

                        <div
                            key={msg.id}
                            className={`message ${msg.sender}-message`}
                        >

                            {/* Avatar */}
                            <div
                                className={`message-avatar ${msg.sender === "ai"
                                        ? "ai-avatar"
                                        : ""
                                    }`}
                            >
                                {msg.sender === "ai"
                                    ? "🤖"
                                    : "👤"}
                            </div>

                            {/* Message content */}
                            <div className="message-content">

                                <span className="message-name">

                                    {msg.sender === "ai"
                                        ? "English Teacher"
                                        : "You"}

                                </span>

                                {/* Message bubble */}
                                <div
                                    className={`bubble ${msg.sender === "ai"
                                            ? "ai-bubble"
                                            : "user-bubble"
                                        }`}
                                >

                                    {msg.text}

                                    {/* Speaker button */}
                                    {msg.sender === "ai" && (

                                        <button
                                            className="speak-button"
                                            onClick={() =>
                                                speakText(
                                                    msg.text,
                                                    msg.id
                                                )
                                            }
                                        >
                                            {speakingMessage ===
                                                msg.id
                                                ? "🔇"
                                                : "🔊"}
                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                    {/* Loading */}
                    {loading && (

                        <div className="message ai-message">

                            <div className="message-avatar ai-avatar">
                                🤖
                            </div>

                            <div className="message-content">

                                <span className="message-name">
                                    English Teacher
                                </span>

                                <div className="bubble ai-bubble typing">

                                    <span></span>
                                    <span></span>
                                    <span></span>

                                </div>

                            </div>

                        </div>

                    )}

                </main>

                {/* Input area */}
                <div className="input-section">

                    <div className="input-wrapper">

                        <input
                            type="text"
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Type or speak your English..."
                        />

                        {/* Microphone */}
                        <button
                            className={`mic-button ${listening
                                    ? "listening"
                                    : ""
                                }`}
                            onClick={startListening}
                            disabled={loading}
                        >
                            {listening
                                ? "🔴"
                                : "🎙️"}
                        </button>

                        {/* Send */}
                        <button
                            className="send-button"
                            onClick={() => sendMessage()}
                            disabled={
                                loading ||
                                !message.trim()
                            }
                        >
                            ➤
                        </button>

                    </div>

                    <p className="input-hint">
                        {listening
                            ? "Listening... Speak now"
                            : "Press Enter to send or use the microphone"}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default App;

