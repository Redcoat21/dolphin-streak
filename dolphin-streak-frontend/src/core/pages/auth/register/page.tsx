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
import { Separator } from "@/components/ui/separator";
import { Container } from "@/core/components/container";
import { GoogleLogo } from "@/core/components/icons/google-logo";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ZRegisterInput } from "@/server/types/auth";

export function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const {
    mutate: register,
    isPending,
    error: trpcError,
  } = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
      // Handle success, e.g., redirect to login page
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      firstName,
      lastName,
      email,
      password,
      profilePicture,
      birthDate,
    };

    // Validate input using Zod schema
    const parsedInput = ZRegisterInput.safeParse(input);
    if (!parsedInput.success) {
      setError(parsedInput.error.message);
      return;
    }

    register(parsedInput.data);
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
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profilePicture">Profile Picture (optional)</Label>
              <Input
                id="profilePicture"
                type="text"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthDate">Birth Date (optional)</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              variant={"custom-blue"}
              className="w-full"
              onClick={handleSubmit}
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
