import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { GoogleLogo } from '@/core/components/icons/google-logo';
import { Eye, EyeOff } from 'lucide-react';
import { ZRegisterInput } from "@/server/types/auth";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useState } from 'react';

interface IRegisterDekstopViewProps {
    form: UseFormReturn<z.infer<typeof ZRegisterInput>>;
    isPending?: boolean;
    onSubmit: (values: z.infer<typeof ZRegisterInput>) => void;
}

export function RegisterDekstopView({ form, isPending, onSubmit }: IRegisterDekstopViewProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="max-w-[600px] mx-auto space-y-6 px-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Two column layout for desktop */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="First Name"
                            className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 rounded-xl"
                            {...form.register('firstName')}
                        />
                        {form.formState.errors.firstName && (
                            <p className="text-red-500 text-sm px-1">
                                {form.formState.errors.firstName.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input
                            placeholder="Last Name"
                            className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 rounded-xl"
                            {...form.register('lastName')}
                        />
                        {form.formState.errors.lastName && (
                            <p className="text-red-500 text-sm px-1">
                                {form.formState.errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Input
                        placeholder="Email Address"
                        type="email"
                        className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 rounded-xl"
                        {...form.register('email')}
                    />
                    {form.formState.errors.email && (
                        <p className="text-red-500 text-sm px-1">
                            {form.formState.errors.email.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="relative space-y-2">
                        <Input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 pr-10 rounded-xl"
                            {...form.register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {form.formState.errors.password && (
                            <p className="text-red-500 text-sm px-1">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="relative space-y-2">
                        <Input
                            placeholder="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 pr-10 rounded-xl"
                            {...form.register('confirmPassword')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Input
                        type="date"
                        className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 rounded-xl"
                        {...form.register('birthDate')}
                    />
                    {form.formState.errors.birthDate && (
                        <p className="text-red-500 text-sm px-1">
                            {form.formState.errors.birthDate.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-[#007AFF] hover:bg-[#0056b3] text-white rounded-xl"
                    disabled={isPending}
                >
                    {isPending ? "Creating Account..." : "Create Account"}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-[#121212] px-2 text-gray-500 uppercase">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-[#1E1E1E] border-0 text-white hover:bg-[#2a2a2a] rounded-xl"
            >
                <GoogleLogo className="mr-2 h-5 w-5" />
                Sign up with Google
            </Button>
        </div>
    );
}