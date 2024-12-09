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
import { TLoginResponse } from '@/server/types/auth';

// Define the form schema using Zod
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export function LoginPage() {
  const router = useRouter();
  const {
    mutate: login,
    isSuccess,
    isError,
    error,
  } = trpc.auth.login.useMutation({
    onSuccess: (response: TLoginResponse) => {
      const { accessToken, refreshToken } = response.data;

      // Store in local storage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Store in session storage
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      // Redirect to the homepage
      router.push('/');
    },
    onError: (error: { message: string }) => {
      console.error("Login error:", error.message);
    },
  });

  // Initialize the form using useForm
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values);
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
                  render={({ field }: { field: { name: string; ref: (node: HTMLInputElement) => void; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void } }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
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
                  render={({ field }: { field: { name: string; ref: (node: HTMLInputElement) => void; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void } }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-end">
                  <Button variant="link" className="px-0" asChild>
                    <a href="/forgot-password">Forgot password?</a>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  className="w-full"
                  variant="custom-blue"
                  type="submit"
                  disabled={isSuccess}
                >
                  {isSuccess ? "Logged in" : "Login"}
                </Button>
                {isError && <p className="text-red-500">{error.message}</p>}
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
                <p className="text-center text-sm text-muted-foreground">
                  Not a member?{" "}
                  <Button variant="link" className="px-0" asChild>
                    <a href="/auth/register">Sign up</a>
                  </Button>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </Container>
  );
}
