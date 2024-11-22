import { Button } from "@/components/ui/button";

export interface ForumPostProps {
    title: string;
    content: string;
    author: string;
    date: string;
    avatarSrc: string;
    onReply: () => void;
}


export const ForumPost: React.FC<ForumPostProps> = ({ title, content, author, date, avatarSrc, onReply }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
                <img src={avatarSrc} alt="Avatar" className="rounded-full mr-2" />
                <span>{author}</span>
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p>{content}</p>
            <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">{date}</span>
                <Button onClick={onReply} size="sm" variant="outline">Reply</Button>
            </div>
        </div>
    );
};
