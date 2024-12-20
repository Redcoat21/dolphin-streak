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
import { TLoginInput, ZLoginInput } from '@/server/types/auth';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAuthStore } from '@/core/stores/authStore';
import { LoginDesktopView } from './components/DekstopView/page';
import { LoginMobileView } from './components/MobileView/page';

export function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const form = useForm<TLoginInput>({
    resolver: zodResolver(ZLoginInput),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: login, isPending } = trpc.auth.login.useMutation({
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      setAuth(accessToken, refreshToken);
      router.push('/');
      toast({
        title: "Success!",
        description: "You have successfully logged in.",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const handleSubmit = (values: TLoginInput) => {
    login(values);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-5">
      {isMobile && (
        <div className="flex h-14 items-center px-4 bg-[#007AFF]">
          <span className="flex-1 text-center font-medium">Sign In</span>
        </div>
      )}

      <Container>
        <div className="mx-auto max-w-[600px] pt-8">
          <Card className="bg-[#121212] border-0 shadow-none">
            <CardHeader className="space-y-1 pb-6">
              <h1 className="text-2xl font-semibold text-white text-center">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-center">
                For free, join now and start learning
              </p>
            </CardHeader>

            <CardContent>
              {isMobile ? (
                <LoginMobileView
                  form={form}
                  isPending={isPending}
                  onSubmit={handleSubmit}
                />
              ) : (
                <LoginDesktopView
                  form={form}
                  isPending={isPending}
                  onSubmit={handleSubmit}
                />
              )}
            </CardContent>

            <CardFooter className="flex justify-center pb-6">
              <p className="text-sm text-gray-400">
                Not a member yet?{" "}
                <a
                  href="/auth/register"
                  className="text-[#007AFF] hover:underline"
                >
                  Sign up
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </div>
  );
}