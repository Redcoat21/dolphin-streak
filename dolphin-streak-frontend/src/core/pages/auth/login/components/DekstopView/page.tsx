import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { ZLoginInput } from "@/server/types/auth";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface ILoginDesktopViewProps {
    form: UseFormReturn<z.infer<typeof ZLoginInput>>;
    isPending?: boolean;
    onSubmit: (values: z.infer<typeof ZLoginInput>) => void;
}

export function LoginDesktopView({ form, isPending, onSubmit }: ILoginDesktopViewProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-6 w-full max-w-2xl mx-auto"> {/* Increased max-w to 2xl for wider form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-2">
                    <Input
                        placeholder="Email Address"
                        type="email"
                        className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 rounded-xl w-full"
                        {...form.register('email')}
                    />
                    {form.formState.errors.email && (
                        <p className="text-red-500 text-sm px-1">
                            {form.formState.errors.email.message}
                        </p>
                    )}
                </div>

                <div className="relative space-y-2">
                    <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 pr-10 rounded-xl w-full"
                        {...form.register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-400"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {form.formState.errors.password && (
                        <p className="text-red-500 text-sm px-1">
                            {form.formState.errors.password.message}
                        </p>
                    )}
                </div>

                {/* Remember Me and Forgot Password side by side */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="rememberMe"
                            className="text-white"
                            style={{
                                color: 'white',
                                borderColor: 'white',
                            }}
                            {...form.register('rememberMe')}
                        />
                        <label
                            htmlFor="rememberMe"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-200"
                        >
                            Remember me
                        </label>
                    </div>
                    <a href="/auth/forgot-password" className="text-[#007AFF] text-sm hover:underline">
                        Forgot Password?
                    </a>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-[#007AFF] hover:bg-[#0056b3] text-white rounded-xl transition-colors"
                    disabled={isPending}
                >
                    {isPending ? "Signing in..." : "Sign In"}
                </Button>
            </form>
        </div>
    );
}