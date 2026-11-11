import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@components/AppLayout";
import ProfileSummary from "@components/ProfileSummary";
import ProfilePersonalInfo from "@components/ProfilePersonalInfo";
import ProfileSecurity from "@components/ProfileSecurity";
import ProfilePreferences from "@components/ProfilePreferences";
import ProfileCustomization from "@components/ProfileCustomization";
import "@/styles/profile.css";

const DEFAULT_AVATAR_COLOR = "#cb4528";

export default function Profile() {
  const { user } = useAuth();
  const [avatarColor, setAvatarColor] = useState(DEFAULT_AVATAR_COLOR);
  const [avatarStyle, setAvatarStyle] = useState("initials");

  return (
    <AppLayout>
      <header className="profile-page-header">
        <h1>Tu perfil</h1>
        <p>Gestioná tu información y personalizá tu cuenta.</p>
      </header>

      <ProfileSummary
        name={user?.name}
        avatarColor={avatarColor}
        avatarStyle={avatarStyle}
      />

      <div className="profile-grid">
        <div className="profile-grid-col">
          <ProfilePersonalInfo name={user?.name} email={user?.email} />
          <ProfileSecurity />
        </div>

        <div className="profile-grid-col">
          <ProfilePreferences
            initialNotificationsEnabled={user?.notifications_enabled ?? true}
          />
          <ProfileCustomization
            name={user?.name}
            avatarColor={avatarColor}
            avatarStyle={avatarStyle}
            onAvatarColorChange={setAvatarColor}
            onAvatarStyleChange={setAvatarStyle}
          />
        </div>
      </div>
    </AppLayout>
  );
}
