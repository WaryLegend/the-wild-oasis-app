import Image from "next/image";
import { signInAction } from "@/app/_lib/actions"; // actions file

function SignInButton() {
  return (
    // 1. can't just call signIn func from auth directly cause this file is server render
    // 3. In stead we use server actions
    <form action={signInAction}>
      {/*2. also can not use onClick because this is not use client */}
      <button className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium hover:cursor-pointer">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
