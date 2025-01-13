import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export function ForgotPasswordPage() {
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
      setMessage("A reset link has been sent to your email address.");
    },
    onError: (error) => {
      setMessage(error.message || "Failed to send reset link.");
    },
  });

  const onSubmit = async (data: TForgotPasswordInput) => {
    forgotPassword(data);
  };

  return (
    <Container>
      <Button
        variant="ghost"
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Forgot password?
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email address to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email?.message}</p>
                )}
              </div>
              {message && <p className="text-center">{message}</p>}
              <Button className="w-full" variant="custom-blue" type="submit" disabled={isPending}>
                {isPending ? "Loading..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
