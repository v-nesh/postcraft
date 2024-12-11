'use client';

import { string, z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
// import { generateBlogPostAction, transcribeUploadedFile } from '@/actions/upload-actions';
import { useUploadThing } from '@/utils/uploadthing';
import { generateBlogPostAction, transcribeUploadedFile } from '@/actions/upload-actions';
import { useState } from 'react';
import ContentEditor from '@/components/content/content-editor';


const schema = z.object({
  file: z
    .instanceof(File, { message: 'Invalid file' })
    .refine((file) => file.size <= 20 * 1024 * 1024, 'File size must not exceed 20MB')
    .refine(
      (file) => file.type.startsWith('audio/') || file.type.startsWith('video/'),
      'File must be an audio or a video file'
    ),
});

export default function UploadForm() {
  const [post, setPost] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const { startUpload } = useUploadThing('videoOrAudioUploader', {
    onClientUploadComplete: (metadata) => {
      toast({ title: 'uploaded successfully!' });
    },
    onUploadError: (err) => {
      console.error('Error occurred', err);
    },
    onUploadBegin: () => {
      toast({ title: 'Upload has begun 🚀!' });
    },
  });

  const handleTranscribe = async (formData: FormData) => {
    const file = formData.get('file') as File;

    const validatedFields = schema.safeParse({ file });

    if (!validatedFields.success) {
      console.log('validatedFields', validatedFields.error.flatten().fieldErrors);
      toast({
        title: '❌ Something went wrong',
        variant: 'destructive',
        description: validatedFields.error.flatten().fieldErrors.file?.[0] ?? 'Invalid file',
      });
    }

    if (file) {
      const resp: any = await startUpload([file]);
      // console.log('resp======>', resp);

      if (!resp) {
        toast({
          title: 'Something went wrong',
          description: 'Please use a different file',
          variant: 'destructive',
        });
      }
      toast({
        title: '🎙️ Transcription is in progress...',
        description: 'We are working on that',
      });

      const result = await transcribeUploadedFile(resp);
      // console.log(result);
      const { data = null, message = null } = result || {};

      if (!result || (!data && !message)) {
        toast({
          title: 'An unexpected error occurred',
          description: 'An error occurred during transcription. Please try again.',
        });
      }
      if (data && data.transcriptions.text) {
        toast({
          title: '🤖 Generating AI blog post...',
          description: 'Please wait while we generate your blog post.',
        });
        // console.log({ data });
        const blogPost = await generateBlogPostAction({
          transcriptions: data.transcriptions.text,
        });
        console.log({ blogPost })
        if (blogPost?.data) {
          toast({
            title: '🎉 Woohoo! Your AI blog is created! 🎊',
            description: 'Time to put on your editor hat, Click the post and edit it!',
          });
          setPost(blogPost?.data)
        }

      }
    }
  };


  return (
    <>
      <div className='flex justify-center'>
        <form className='flex flex-col gap-6' action={handleTranscribe}>
          <div className='flex justify-end items-center gap-1.5'>
            <Input id='file' name='file' type='file' accept='audio/*,video/*' required />
            <Button className='bg-purple-600'>Transcribe</Button>
          </div>
        </form>
      </div>
      <div className='py-12'>
        {post &&
          <div className='mx-auto w-full max-w-screen-xl px-2.5 lg:px-0 mb-12 mt-28'>
            <div className='flex justify-between items-center border-b-2  border-gray-200/5 pb-4'>
              <div>
                <h2 className='text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2'>Edit your post</h2>
                <p className='text-gray-600'>Start editing your blog post</p>
              </div>
            </div>
            <ContentEditor posts={post} />
          </div>
        }
      </div>
    </ >
  );
}
