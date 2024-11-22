import { useState, useCallback } from "react";

export const Editor = () => {
    const [content, setContent] = useState("");

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }, []);

    return (
        <textarea value={content} onChange={handleChange} className="w-full bg-gray-700 rounded-lg p-2 min-h-[200px]" />
    );
}
