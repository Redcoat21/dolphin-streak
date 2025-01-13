import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Container } from '@/core/components/container';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import { ArrowLeft } from 'lucide-react';
import { TRegisterInput, ZRegisterInput } from '@/server/types/auth';
import { useMediaQuery } from '@/hooks/use-media-query';
import { RegisterMobileView } from './components/MobileView/page';
import { RegisterDekstopView } from './components/DekstopView/page';

export function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const form = useForm<TRegisterInput>({
    resolver: zodResolver(ZRegisterInput),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
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
      router.push('/auth/login');
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: TRegisterInput) => {
    register(values);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-5">
      {isMobile && (
        <div className="flex h-14 items-center px-4 bg-[#007AFF]">
          <span className="flex-1 text-center font-medium">Signup</span>
        </div>
      )}

      <Container>
        <div className="mx-auto max-w-[600px]">
          <Card className="bg-[#121212] border-0 shadow-none">
            <CardHeader className="space-y-1 pb-6">
              <h1 className="text-2xl font-semibold text-white text-center">
                Create an Account
              </h1>
            </CardHeader>

            <CardContent>
              {isMobile ? (
                <RegisterMobileView
                  form={form}
                  isPending={isPending}
                  onSubmit={handleSubmit}
                />
              ) : (
                <RegisterDekstopView
                  form={form}
                  isPending={isPending}
                  onSubmit={handleSubmit}
                />
              )}
            </CardContent>

            <CardFooter className="flex justify-center pb-6">
              <p className="text-sm text-gray-400">
                Already a member?{" "}
                <a
                  href="/auth/login"
                  className="text-[#007AFF] hover:underline"
                >
                  Login
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </div>
  );
}