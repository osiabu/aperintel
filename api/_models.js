/**
 * Aperintel AI Model Layer
 *
 * Primary:   Gemini 2.5 Pro  (@google/genai)
 * Fallback:  Claude Haiku 4.5 (@anthropic-ai/sdk) — only if Gemini key absent
 */

const { GoogleGenAI } = require('@google/genai');
const Anthropic = require('@anthropic-ai/sdk');

/**
 * Generate a single completion.
 * Uses streaming internally — generateContent (non-streaming) swallows text
 * output when Gemini 2.5 Pro thinking tokens exhaust the token budget first.
 * Returns the full accumulated text as a string.
 */
async function generate(systemPrompt, userPrompt, maxTokens = 8192) {
  // --- Primary: Gemini 2.5 Pro (via streaming to avoid empty-response issue) ---
  if (process.env.GOOGLE_API_KEY) {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-pro',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: maxTokens
      }
    });
    let text = '';
    for await (const chunk of stream) {
      if (chunk.text) text += chunk.text;
    }
    if (!text.trim()) throw new Error('Empty response from Gemini 2.5 Pro');
    return text;
  }

  // --- Fallback: Claude Haiku 4.5 (only if no Google key) ---
  console.warn('[Gemini] GOOGLE_API_KEY not set — using Haiku 4.5 fallback');
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
async function generateStream(systemPrompt, userPrompt, writeChunk, maxTokens = 8192) {
  // --- Primary: Gemini 2.5 Pro (streaming) ---
  if (process.env.GOOGLE_API_KEY) {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-pro',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
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
    if (!accumulated.trim()) throw new Error('Empty streaming response from Gemini 2.5 Pro');
    return accumulated;
  }

  // --- Fallback: Claude Haiku 4.5 (only if no Google key) ---
  console.warn('[Gemini stream] GOOGLE_API_KEY not set — using Haiku 4.5 fallback');
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
  }

  // --- Fallback: Claude Haiku 4.5 (only if no Google key) ---
  console.warn('[Gemini chat] GOOGLE_API_KEY not set — using Haiku 4.5 fallback');
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
