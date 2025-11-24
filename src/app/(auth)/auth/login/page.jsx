import LoginForm from "@/components/auth/login";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center text-sm text-gray-500">
            লোড হচ্ছে...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
