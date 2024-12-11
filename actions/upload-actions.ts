'use server';
import { AssemblyAI } from 'assemblyai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const assemblyai = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY as string,
});

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY as string);
const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function transcribeUploadedFile(
  resp: {
    url: string;
    name: string;
  }[]
) {
  if (!resp) {
    return {
      success: false,
      message: 'File upload failed',
      data: null,
    };
  }

  const { url, name } = resp[0];

  if (!url || !name) {
    return {
      success: false,
      message: 'File upload failed',
      data: null,
    };
  }

  try {
    const transcriptions = await assemblyai.transcripts.transcribe({ audio: url });
    // console.log(transcriptions.text);
    return {
      success: true,
      message: 'File uploaded successfully!',
      data: { transcriptions },
    };
  } catch {
    return {
      success: false,
      message: 'File size exceeds the max limit of 20MB',
      data: null,
    };
  }
}

// async function generateBlogPost({ transcriptions }: { transcriptions: string }) {
//   const completion = await openai.chat.completions.create({
//     model: 'text-davinci-003',
//     messages: [
//       {
//         role: 'system',
//         content:
//           "You are a skilled content writer that converts audio transcriptions into well-structured, engaging blog posts in Markdown format. Create a comprehensive blog post with a catchy title, introduction, main body with multiple sections, and a conclusion. Analyze the user's writing style from their previous posts and emulate their tone and style in the new post. Keep the tone casual and professional.",
//       },
//       {
//         role: 'user',
//         content: `Here are some of my previous blog posts for reference:

//       Please convert the following transcription into a well-structured blog post using Markdown formatting. Follow this structure:

//       1. Start with a SEO friendly catchy title on the first line.
//       2. Add two newlines after the title.
//       3. Write an engaging introduction paragraph.
//       4. Create multiple sections for the main content, using appropriate headings (##, ###).
//       5. Include relevant subheadings within sections if needed.
//       6. Use bullet points or numbered lists where appropriate.
//       7. Add a conclusion paragraph at the end.
//       8. Ensure the content is informative, well-organized, and easy to read.
//       9. Emulate my writing style, tone, and any recurring patterns you notice from my previous posts.

//       Here's the transcription to convert: ${transcriptions}`,
//       },
//     ],
//   });
//   console.log(completion.choices[0].message);
//   return completion.choices[0].message.content;
// }

async function generateBlogPost({ transcriptions }: { transcriptions: string }) {
  const content = `Here are some of my previous blog posts for reference:

//       Please convert the following transcription into a well-structured blog post using Markdown formatting. Follow this structure:

//       1. Start with a SEO friendly catchy title on the first line.
//       2. Add two newlines after the title.
//       3. Write an engaging introduction paragraph.
//       4. Create multiple sections for the main content, using appropriate headings (##, ###).
//       5. Include relevant subheadings within sections if needed.
//       6. Use bullet points or numbered lists where appropriate.
//       7. Add a conclusion paragraph at the end.
//       8. Ensure the content is informative, well-organized, and easy to read.
//       9. Emulate my writing style, tone, and any recurring patterns you notice from my previous posts.

//       Here's the transcription to convert: ${transcriptions}`;
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: 'Hello' }],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'You are a skilled content writer that converts audio transcriptions into well-structured, engaging blog posts in Markdown format. Create a comprehensive blog post with a catchy title, introduction, main body with multiple sections, and a conclusion. Analyze the users writing style from their previous posts and emulate their tone and style in the new post. Keep the tone casual and professional.',
          },
        ],
      },
    ],
  });
  const result = await chat.sendMessage(content);
  return result.response.text();
}

export async function generateBlogPostAction({ transcriptions }: { transcriptions: string }) {
  if (transcriptions) {
    const blogPosts = await generateBlogPost({ transcriptions: transcriptions });

    if (!blogPosts) {
      return {
        success: false,
        message: 'Blog Post creation failed',
        data: null,
      };
    }
    return {
      success: true,
      message: 'Blog Post created',
      data: blogPosts,
    };
  }
}
