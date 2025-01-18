import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/core/components/container";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TForgotPasswordInput, ZForgotPasswordInput } from "@/server/types/auth";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function ForgotPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TForgotPasswordInput>({
    resolver: zodResolver(ZForgotPasswordInput),
  });

  const { mutate: forgotPassword, isPending } = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => {
        toast({
            title: "Success!",
            description: "A reset link has been sent to your email address.",
            duration: 3000,
        });
        router.push('/auth/login');
    },
    onError: (error) => {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
            duration: 3000,
        });
      setMessage(error.message || "Failed to send reset link.");
    },
  });

  const onSubmit = async (data: TForgotPasswordInput) => {
    forgotPassword(data);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-5">
        <div className="flex h-14 items-center px-4 bg-[#007AFF]">
            <Button
                variant="ghost"
                className="text-white hover:opacity-80 transition-opacity"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <span className="flex-1 text-center font-medium">Forgot Password</span>
        </div>
        <Container>
            <div className="mx-auto max-w-[800px] pt-8">
                < Card className="bg-[#121212] border-0 shadow-none">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-semibold text-white text-center">
                            Forgot password?
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-center">
                            Enter your email address to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-200">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 rounded-xl w-full"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email?.message}</p>
                                )}
                            </div>
                            {message && <p className="text-center">{message}</p>}
                            <Button className="w-full h-12 bg-[#007AFF] hover:bg-[#0056b3] text-white rounded-xl transition-colors" type="submit" disabled={isPending}>
                                {isPending ? "Loading..." : "Send Reset Link"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Container>
    </div>
  );
}
