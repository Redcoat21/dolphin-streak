import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import { Container } from '@/core/components/container';
import { Separator } from '@/components/ui/separator';
import { GoogleLogo } from '@/core/components/icons/google-logo';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/core/stores/authStore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ZLoginInput } from '@/server/types/auth';

export function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: login } = trpc.auth.login.useMutation({
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      setAuth(accessToken, refreshToken);
      toast({
        title: "Login Successful",
        description: "You have logged in successfully!",
        variant: "default",
      });
      router.push('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof ZLoginInput>>({
    resolver: zodResolver(ZLoginInput),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ZLoginInput>) {
    setIsLoading(true);
    login({
      email: values.email,
      password: values.password,
    });
  }

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
            <div className="flex items-center justify-center mb-6">
              <div className="relative h-24 w-24">
                <img
                  src="/api/placeholder/100/100"
                  alt="Learn at home"
                  className="object-cover"
                />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              For free, join now and start learning
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  className="w-full"
                  variant="custom-blue"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <GoogleLogo /> Google
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </Container>
  );
}