import { AuthLayout, SignupForm } from "@/features/auth";

export default function SignupPage() {
  return (
    <AuthLayout 
      title="Join Ascend" 
      subtitle="Initialize your personal transformation protocol."
    >
      <SignupForm />
    </AuthLayout>
  );
}
