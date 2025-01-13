import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Dropzone } from "@/core/components/dropzone";

interface ChangeProfilePictureProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFileAccepted: (file: File) => Promise<void>;
}

export function ChangeProfilePicture({
    open,
    onOpenChange,
    onFileAccepted,
}: ChangeProfilePictureProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Profile Picture</DialogTitle>
                </DialogHeader>
                <Dropzone onFileAccepted={onFileAccepted} />
            </DialogContent>
        </Dialog>
    );
}