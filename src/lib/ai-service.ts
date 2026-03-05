interface AIBookResult {
  title: string;
  author: string;
  description: string;
  genre: string;
}

export async function recognizeBook(
  imageBase64: string,
  apiKey: string
): Promise<AIBookResult> {
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const mediaType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `Look at this book cover photo. Extract the following information and respond ONLY with valid JSON, no other text:

{
  "title": "book title",
  "author": "author name",
  "description": "a brief 1-2 sentence description of the book",
  "genre": "genre category (e.g. Fiction, Non-Fiction, Sci-Fi, Mystery, Romance, Biography, etc.)"
}

If you cannot determine a field, use an empty string.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse AI response');
  }

  return JSON.parse(jsonMatch[0]) as AIBookResult;
}
