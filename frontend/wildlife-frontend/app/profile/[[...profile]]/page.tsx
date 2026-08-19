import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
      <UserProfile path="/profile" routing="path" />
    </div>
  );
}
