import OpenAI from "openai";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { prompt, messages, gptVersion } = req.body;

  if (!process.env.SCIPHI_API_KEY) {
    return res.status(500).send("The SCIPHI_API_KEY is missing!");
  }

  const openai = new OpenAI({
    apiKey: process.env.SCIPHI_API_KEY,
    baseURL: process.env.SCIPHI_API_URL,
  });

  console.log("messages = ", messages);
  let messagesForChat = messages.map((message) => {
    return { role: message.ai ? "assistant" : "user", content: message.text };
  });
  messagesForChat.push({ role: "user", content: prompt });
  console.log("messagesForChat = ", messagesForChat);
  const response = await openai.chat.completions.create({
    messages: messagesForChat,
    model: gptVersion,
    temperature: 0.2,
    max_tokens: 16_348,
  });
  res
    .status(200)
    .json({ response: response.completion, context: response.context });
};
