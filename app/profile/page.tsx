import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { ProfileService } from "@/db/profiles";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await ProfileService.getByUserId(user.id);

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-bg via-bg to-panel">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-40 font-bold mb-8 text-text-primary">Profile</h1>

        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-15 font-medium text-text-secondary mb-2">
                Full Name
              </h3>
              <p className="text-18 text-text-primary">
                {profile.full_name || "Not set"}
              </p>
            </div>
            <div>
              <h3 className="text-15 font-medium text-text-secondary mb-2">
                Email
              </h3>
              <p className="text-18 text-text-primary">
                {profile.email || "Not set"}
              </p>
            </div>
            <div>
              <h3 className="text-15 font-medium text-text-secondary mb-2">
                Member Since
              </h3>
              <p className="text-18 text-text-primary">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
