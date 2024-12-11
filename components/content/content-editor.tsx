'use client'
import { ForwardRefEditor } from "@/components/content/forward-ref-editor";
import { useEffect, useState } from "react";

export default function ContentEditor({ posts }: { posts: string }) {

    console.log("content post", typeof posts === 'string')
    const [content, setContent] = useState(posts)
    useEffect(() => {
        if (posts) {
            setContent(posts)
        }
    }, [posts])


    const handleChangeContent = (value: string) => setContent(value)
    return (
        <div>
            <ForwardRefEditor className="text-left markdown-content border-dotted border-gray-200 border-2 p-4 rounded-md animate-in ease-in-out duration-75" markdown={content} onChange={handleChangeContent} />
        </div>
    )

}
