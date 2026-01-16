import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const aiService = {
  // Calls Spring Boot: POST /api/ai/suggest
  suggest: async ({ userId, personalityKey = "default", prompt }) => {
    if (userId === null || userId === undefined) throw new Error("userId is required");
    if (!prompt || !prompt.trim()) throw new Error("prompt is required");

    const response = await axios.post(`${API_BASE_URL}/ai/suggest`, {
      userId,
      personalityKey,
      prompt,
    });

    return response.data; // { conversationId, reply }
  },
};
