import Groq from "groq-sdk";
import foodModel from "../models/foodModel.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatWithBot = async (req, res) => {
  try {
    const { message, history } = req.body;
    // history = array of { role: "user"/"assistant", content: "..." }

    // ── STEP 1: RETRIEVAL ──────────────────────────────────────────
    // Fetch all food items from your MongoDB (your own data)
    const allFoods = await foodModel.find({});

    // Build a readable "knowledge base" string from your menu
    const menuContext = allFoods
      .map(
        (food) =>
          `Name: ${food.name} | Category: ${food.category} | Price: $${food.price} | Description: ${food.description}`
      )
      .join("\n");

    // ── STEP 2: AUGMENT ────────────────────────────────────────────
    // Inject the menu data into the system prompt
    const systemPrompt = `
You are a helpful assistant for a food delivery app called "Tomato".
Answer customer questions about the menu, prices, categories, and orders.
Be friendly, concise, and helpful.

Here is the current menu data you must use to answer questions:
──────────────────────────────
${menuContext}
──────────────────────────────
If a question is unrelated to food or this app, politely say you can only help with food-related topics.
    `.trim();

    // ── STEP 3: GENERATION ─────────────────────────────────────────
    // Build the messages array: system + chat history + new user message
    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []),          // previous turns for multi-turn chat
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",    // fast & free on Groq
      messages,
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    res.json({ success: true, reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ success: false, message: "Chatbot error" });
  }
};