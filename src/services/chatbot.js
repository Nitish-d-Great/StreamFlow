import OpenAI from "openai"

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

if (!API_KEY) {
  console.error("VITE_OPENAI_API_KEY is not defined. Please ensure your .env file is in the project root and the key is correctly defined.")
}

console.log("Initializing OpenAI client with API Key:", API_KEY ? "Loaded" : "Missing/Undefined");
const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in Vite/React
})

export async function getMovieSuggestions(prompt) {
  console.log("Calling getMovieSuggestions with prompt:", prompt)
  console.log("OpenAI API Key status:", API_KEY ? "Loaded" : "Missing/Undefined")

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Or "gpt-4" if you have access and prefer it
      messages: [
        {
          role: "system",
          content: "You are a helpful movie suggestion chatbot. You will suggest movies to watch from Hollywood and Bollywood based on user preferences. You can also ask clarifying questions to narrow down the suggestions.",
        },
        {
          role: "user",
          content: "Hello! I'm here to help you find some great movies. What kind of movies are you in the mood for? Hollywood or Bollywood?",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
    })

    const text = response.choices[0].message.content
    console.log("Parsed text response from OpenAI:", text)
    return text
  } catch (error) {
    console.error("Error in getMovieSuggestions (OpenAI API):", error)
    throw error // Re-throw the error so ChatbotPage can catch it
  }
}
