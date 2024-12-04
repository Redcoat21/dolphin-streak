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
import { GoogleLogo } from '@/core/components/icons/google-logo';
import { ArrowLeft } from 'lucide-react';

export function LoginPage() {
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
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <div className="flex items-center justify-end">
              <Button variant="link" className="px-0" asChild>
                <a href="/forgot-password">Forgot password?</a>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" variant={"custom-accented"}>
              Login
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
            <p className="text-center text-sm text-muted-foreground">
              Not a member?{" "}
              <Button variant="link" className="px-0" asChild>
                <a href="/auth/register">Sign up</a>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
}
