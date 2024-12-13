import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Container } from '@/core/components/container';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import { GoogleLogo } from '@/core/components/icons/google-logo';
import { ArrowLeft } from 'lucide-react';
import { ZRegisterInput } from '@/server/types/auth';

export function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ZRegisterInput>>({
    resolver: zodResolver(ZRegisterInput),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      profilePicture: '',
      birthDate: '',
    },
  });

  const { mutate: register, isPending } = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have registered successfully!",
        variant: "default",
      });
      router.push('/auth/login'); // Redirect to login page
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: z.infer<typeof ZRegisterInput>) => {
    register(values);
  };

  return (
    <Container>
      <Button
        variant="ghost"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <form {...form} onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="mb-4">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  {...form.register('firstName')}
                />
                {form.formState.errors.firstName && (
                  <p className="text-red-500">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  {...form.register('lastName')}
                />
                {form.formState.errors.lastName && (
                  <p className="text-red-500">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register('password')}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="profilePicture">Profile Picture (optional)</Label>
                <Input
                  id="profilePicture"
                  type="text"
                  {...form.register('profilePicture')}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="birthDate">Birth Date (optional)</Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...form.register('birthDate')}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              variant={"custom-blue"}
              className="w-full"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Registering..." : "Continue"}
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
              <GoogleLogo />
              Google
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already a member?{" "}
              <Button variant="link" className="px-0" asChild>
                <a href="/auth/login">Login</a>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
}
