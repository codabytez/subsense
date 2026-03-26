import { redirect } from "next/navigation";
import { isAuthenticated, fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { OnboardingContent } from "./onboarding-content";

export default async function OnboardingPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/login");

  const user = await fetchAuthQuery(api.users.getCurrentUser);
  if (user) redirect("/dashboard");

  return <OnboardingContent />;
}
