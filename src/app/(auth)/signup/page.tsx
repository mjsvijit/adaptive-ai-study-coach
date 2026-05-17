import SignUpForm from "@/src/component/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adaptive AI Study Coach - Sign Up",
  description: "Create an account with Adaptive AI Study Coach to unlock personalized learning paths, milestones tracking, and intelligent AI study goal coaching.",
};

export default function SignUp() {
  return <SignUpForm />;
}
