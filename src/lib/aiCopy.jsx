import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateCopyFromEvent(event) {
  const prompt = `You are copyrighter for the company "eventually" - an event aggregating website. Your job is to write compelling marketing copy for the event titled "${event.title}" with description: "${event.description}". You are only tasked with writing a maximum of 2 paragraphs about the description of the event. Feel free to keep the tone light-hearted, friendly, but also humorous. Make jokes where you can. Some events are not real, so get creative!`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}
