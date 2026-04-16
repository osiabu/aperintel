/**
 * Aperintel AI Model Layer
 *
 * Primary:   Gemini 2.5 Pro  (@google/genai)
 * Secondary: Claude Haiku 4.5 (@anthropic-ai/sdk) — fallback if Gemini fails or key absent
 */

const { GoogleGenAI } = require('@google/genai');
const Anthropic = require('@anthropic-ai/sdk');

/**
 * Generate a single non-streaming completion.
 * Returns the response text as a string.
 */
async function generate(systemPrompt, userPrompt, maxTokens = 1024) {
  // --- Primary: Gemini 2.5 Pro ---
  if (process.env.GOOGLE_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens
        }
      });
      return response.text;
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
 * Generate a streaming completion, writing chunks via writeChunk(text).
 * Resolves with the full accumulated text once complete.
 */
async function generateStream(systemPrompt, userPrompt, writeChunk, maxTokens = 2048) {
  // --- Primary: Gemini 2.5 Pro (streaming) ---
  if (process.env.GOOGLE_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-pro',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens
        }
      });

      let accumulated = '';
      for await (const chunk of stream) {
        const text = chunk.text;
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
 * messages is the conversation array in Anthropic format: [{role, content}]
 */
async function chatStream(systemPrompt, messages, writeChunk, maxTokens = 1024) {
  // --- Primary: Gemini 2.5 Pro (multi-turn streaming) ---
  if (process.env.GOOGLE_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

      // Convert Anthropic-style messages to Gemini format
      const geminiContents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-pro',
        contents: geminiContents,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens
        }
      });

      for await (const chunk of stream) {
        const text = chunk.text;
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
