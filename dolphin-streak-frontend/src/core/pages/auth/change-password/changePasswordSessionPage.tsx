import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Container } from '@/core/components/container';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TChangePasswordInput, ZChangePasswordInput } from '@/server/types/auth';
import { trpc } from '@/utils/trpc';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


export function ChangePasswordSessionPage() {
  const router = useRouter();
  const { changePasswordSession } = router.query;
  const { iv } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);


  const form = useForm<TChangePasswordInput>({
    resolver: zodResolver(ZChangePasswordInput),
    defaultValues: {
      password: "",
      confirmNewPassword: "",
    },
  });

  const { mutate: changePassword } = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      router.push("/auth/login");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsPending(false);
    }
  });


  const handleSubmit = async (values: TChangePasswordInput) => {
    setIsPending(true);
    if (!changePasswordSession || !iv) {
      toast({
        title: "Error",
        description: "Invalid session or iv",
        variant: "destructive",
      });
      setIsPending(false);
      return;
    }
    changePassword({
      iv: iv as string,
      password: values.password,
      encryptPayload: changePasswordSession as string,
      confirmNewPassword: values.confirmNewPassword,
    });
  };


  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-5">
      <div className="flex h-14 items-center px-4 bg-[#007AFF]">
        <span className="flex-1 text-center font-medium">Change Password</span>
      </div>
      <Container>
        <div className="mx-auto max-w-[800px] pt-8">
          <Card className="bg-[#121212] border-0 shadow-none">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-semibold text-white text-center">
                Choose a New Password
              </CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Set a new password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              className="bg-[#262626] border-none rounded-md px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                              {...field}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="max-w-[200px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              className="bg-[#262626] border-none rounded-md px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                              {...field}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full bg-[#007AFF] hover:bg-[#0056b3] text-white rounded-xl transition-colors" variant="custom-blue" type="submit" disabled={isPending}>
                    {isPending ? "Loading..." : "Confirm Password Change"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
