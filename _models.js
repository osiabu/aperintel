/**
 * Aperintel AI Model Layer
 *
 * Primary:   Gemini 2.5 Pro  (Google Generative AI)
 * Secondary: Claude Haiku 4.5 (Anthropic) — fallback if Gemini fails or key absent
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');

/**
 * Generate a single non-streaming completion.
 * Returns the response text as a string.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {number} [maxTokens=1024]
 * @returns {Promise<string>}
 */
async function generate(systemPrompt, userPrompt, maxTokens = 1024) {
  // --- Primary: Gemini 2.5 Pro ---
  if (process.env.GOOGLE_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-pro',
        systemInstruction: systemPrompt
      });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: maxTokens }
      });
      return result.response.text();
    } catch (err) {
      console.error('[Gemini 2.5 Pro] error, falling back to Haiku 4.5:', err.message);
    }
  } else {
    console.warn('[Gemini] GOOGLE_API_KEY not set — using Haiku 4.5 fallback');
  }

  // --- Fallback: Claude Haiku 4.5 ---
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });
  return message.content[0].text;
}

/**
 * Generate a streaming completion, writing SSE chunks via `writeChunk(text)`.
 * Resolves with the full accumulated text once complete.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {function(string): void} writeChunk  called with each text delta
 * @param {number} [maxTokens=2048]
 * @returns {Promise<string>}
 */
async function generateStream(systemPrompt, userPrompt, writeChunk, maxTokens = 2048) {
  // --- Primary: Gemini 2.5 Pro (streaming) ---
  if (process.env.GOOGLE_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-pro',
        systemInstruction: systemPrompt
      });
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: maxTokens }
      });

      let accumulated = '';
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          accumulated += text;
          writeChunk(text);
        }
      }
      return accumulated;
    } catch (err) {
      console.error('[Gemini 2.5 Pro stream] error, falling back to Haiku 4.5:', err.message);
    }
  } else {
    console.warn('[Gemini stream] GOOGLE_API_KEY not set — using Haiku 4.5 fallback');
  }

  // --- Fallback: Claude Haiku 4.5 (streaming) ---
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const stream = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    stream: true
  });

  let accumulated = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      accumulated += event.delta.text;
      writeChunk(event.delta.text);
    }
  }
  return accumulated;
}

/**
 * Multi-turn chat streaming — used by chat.js.
 * `messages` is the conversation array in Anthropic format: [{role, content}]
 *
 * @param {string} systemPrompt
 * @param {Array<{role: string, content: string}>} messages
 * @param {function(string): void} writeChunk
 * @param {number} [maxTokens=1024]
 * @returns {Promise<void>}
 */
async function chatStream(systemPrompt, messages, writeChunk, maxTokens = 1024) {
  // --- Primary: Gemini 2.5 Pro (multi-turn streaming) ---
  if (process.env.GOOGLE_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-pro',
        systemInstruction: systemPrompt
      });

      // Convert Anthropic-style messages to Gemini format
      const geminiMessages = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Gemini requires the last message to be from user
      // and history to be all prior messages
      const history = geminiMessages.slice(0, -1);
      const lastMessage = geminiMessages[geminiMessages.length - 1];

      const chat = model.startChat({
        history,
        generationConfig: { maxOutputTokens: maxTokens }
      });

      const result = await chat.sendMessageStream(lastMessage.parts);
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) writeChunk(text);
      }
      return;
    } catch (err) {
      console.error('[Gemini 2.5 Pro chat stream] error, falling back to Haiku 4.5:', err.message);
    }
  } else {
    console.warn('[Gemini chat] GOOGLE_API_KEY not set — using Haiku 4.5 fallback');
  }

  // --- Fallback: Claude Haiku 4.5 (streaming) ---
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const stream = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
    stream: true
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      writeChunk(event.delta.text);
    }
  }
}

module.exports = { generate, generateStream, chatStream };
