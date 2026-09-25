// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { GoogleGenAI } from "@google/genai";





// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json())


// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// });


// app.get('/', (req, res) => {
//     res.send("api is working");
//     console.log("English Ai Model is working")
// })




// // app.post("/api/chat", (req, res) => {
// //     const { message } = req.body;
// //     console.log("message received:", message);
// //     res.json({ massage: `Hello, ${message} I am your English teacher AI. How can I help you today?` });
// // })


// app.post("/api/chat", async (req, res) => {

//     try {

//         const { message } = req.body;

//         if (!message) {
//             return res.status(400).json({
//                 message: "Message is required"
//             });
//         }

//         const response = await ai.models.generateContent({

//             model: "gemini-3.8-flash",

//             contents: `
// You are an English speaking teacher.

// Your job is to help the student improve their English.

// Follow these rules:

// 1. Correct grammar mistakes.
// 2. Explain the mistake in simple English.
// 3. Give the corrected sentence.
// 4. Teach useful vocabulary when appropriate.
// 5. Ask a follow-up question so the conversation continues.
// 6. Be friendly and encouraging.
// 7. Do not make the response unnecessarily complicated.
// 8. If the student's English is already correct, tell them that.
// 9. Adapt your English to the student's level.

// Student message:

// ${message}
//             `
//         });

//         res.json({
//             reply: response.text
//         });

//     } catch (error) {

//         console.error("AI ERROR:", error);

//         res.status(500).json({
//             message: "AI error",
//             error: error.message
//         });
//     }
// });





// app.listen(5001, () => {
//     console.log(`server is running on port 5001`)
// })




import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();


// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// Gemini AI
// ===============================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
    res.send("English Teacher AI Backend Running");
});


// ===============================
// Chat Route
// ===============================

app.post("/api/chat", async (req, res) => {

    try {

        const { message } = req.body;


        // Check if message exists
        if (!message || !message.trim()) {

            return res.status(400).json({
                success: false,
                message: "Message is required"
            });

        }


        console.log("User:", message);


        // ===============================
        // Send message to Gemini
        // ===============================

        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: message,

            config: {

                systemInstruction: `
You are a teacher.

Your job is to help the student improve their skills.

Follow these rules:

1. Always be friendly and encouraging.

2. Correct grammar mistakes in the student's sentence.

3. Show the corrected sentence clearly.

4. Explain the grammar mistake in simple English.

5. If the student's sentence is already correct, tell them that it is correct.

6. Help the student improve vocabulary when useful.

7. Use simple English suitable for a beginner or intermediate learner.

8. Ask a follow-up question so the conversation continues.

9. Do not give extremely long explanations.

10. Focus on practical spoken English.

11. Bold the words that are corrected or that are wrong /miss in user message.



IMPORTANT RESPONSE RULES:
- Keep the response short and conversational.
- Do NOT use Markdown.
- Do NOT use **, *, #, bullets, or numbered lists.
- Do NOT use unnecessary formatting.
- Do not give long explanations.
- Use simple English suitable for a beginner.
- Do not say "incorrect" or make the student feel bad.
- First encourage the student.
- Give only the most natural correction.
- If the student's sentence is understandable, explain the natural way to say it.
- alway start new sentence from a new line and do not use any formatting.

Use this format:

Good try! I understand what you mean.

You can also say:
[correct sentence]

Why Because:
[short explanation]

Now Vocabulary Tips:
[one useful vocabulary tip]

And Last Ready for the Question:
[one simple follow-up question]

`
            }

        });


        // ===============================
        // Get Gemini response
        // ===============================

        const reply = response.text;


        console.log("Teacher:", reply);


        // ===============================
        // Send response to frontend
        // ===============================

        res.json({

            success: true,

            reply: reply

        });


    } catch (error) {

        console.error("Gemini Error:", error);


        res.status(500).json({

            success: false,

            message: "AI service error",

            error: error.message

        });

    }

});


// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

});