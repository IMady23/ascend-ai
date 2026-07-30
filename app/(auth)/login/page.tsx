import { AuthLayout, LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Ascend AI" 
      subtitle="Enter your credentials to access the command center."
    >
      <LoginForm />
    </AuthLayout>
  );
}
