import { AuthLayout, ForgotPasswordForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Reset Protocol" 
      subtitle="We will send instructions to restore access."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
