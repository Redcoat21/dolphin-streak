import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TUpdateProfileInput, TUserData } from "@/server/types/auth";

interface ProfileEditProps {
    userData: TUserData | null | undefined;
    onCancel: () => void;
    onSave: (values: TUpdateProfileInput) => Promise<void>;
}

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
});


export function ProfileEdit({ userData, onCancel, onSave }: ProfileEditProps) {
    const form = useForm<TUpdateProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: userData?.firstName || "",
            lastName: userData?.lastName || "",
        },
    });

    const handleSave = async (values: TUpdateProfileInput) => {
        await onSave(values);
    };

    return (
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        {...form.register("firstName")}
                        className="w-full"
                    />
                    {form.formState.errors.firstName && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.firstName.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        {...form.register("lastName")}
                        className="w-full"
                    />
                    {form.formState.errors.lastName && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.lastName.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
