import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { ZRegisterInput } from "@/server/types/auth";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useState } from 'react';

interface IRegisterMobileViewProps {
    form: UseFormReturn<z.infer<typeof ZRegisterInput>>;
    isPending?: boolean;
    onSubmit: (values: z.infer<typeof ZRegisterInput>) => void;
}

export function RegisterMobileView({ form, isPending, onSubmit }: IRegisterMobileViewProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-4 px-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Single column layout for mobile */}
                <div className="space-y-4">
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

                <div className="space-y-4">
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
                    className="w-full h-12 bg-[#007AFF] hover:bg-[#0056b3] text-white mt-6 rounded-xl"
                    disabled={isPending}
                >
                    {isPending ? "Creating Account..." : "Continue"}
                </Button>
            </form>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-[#0A0A0A] px-2 text-gray-500 uppercase">
                        Or continue with
                    </span>
                </div>
            </div>
        </div>
    );
}