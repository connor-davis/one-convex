import { useAuth } from "@workos-inc/authkit-react";
import { Button } from "../ui/button";

export default function SignInForm() {
  const { signIn } = useAuth();

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div className="flex flex-col w-auto h-auto p-3 gap-10 rounded-md border bg-background max-w-md">
        <div className="flex flex-col w-full h-auto gap-3 text-center">
          <p className="font-bold text-primary text-2xl">One Authentication</p>
          <p>
            You are required to authenticate before you can gain access to the
            One system.
          </p>
        </div>

        <Button onClick={() => signIn()}>Continue</Button>
      </div>
    </div>
  );
}
