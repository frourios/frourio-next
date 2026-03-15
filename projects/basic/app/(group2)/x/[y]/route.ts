import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createRoute } from './frourio.server';

export const { GET } = createRoute({
  get: async ({ query }) => {
    const result = streamText({
      model: openai('gpt-5.2'),
      system: 'You are a helpful assistant.',
      messages: [{ role: 'user', content: query.message }],
    });

    return result.toTextStreamResponse();
  },
});
