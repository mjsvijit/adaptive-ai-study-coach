import SignInForm from "@/src/component/auth/SignInForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Adaptive AI Study Coach - Sign In",
  description:
    "AI powered study coach to help you learn smarter, not harder. Sign in to access personalized study plans, progress tracking, and more.",
};

export default function SignIn() {
  return <SignInForm />;
}
