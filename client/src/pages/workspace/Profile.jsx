import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@components/layout/AppLayout";
import ProfileSummary from "@components/profile/ProfileSummary";
import ProfilePersonalInfo from "@components/profile/ProfilePersonalInfo";
import ProfileSecurity from "@components/profile/ProfileSecurity";
import ProfilePreferences from "@components/profile/ProfilePreferences";
import ProfileCustomization from "@components/profile/ProfileCustomization";
import "@/styles/profile/profile.css";

const DEFAULT_AVATAR_COLOR = "#cb4528";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const savedAvatar = user?.avatar_preference;
  const savedColor = savedAvatar?.avatar_color ?? DEFAULT_AVATAR_COLOR;
  const savedStyle = savedAvatar?.avatar_style ?? "initials";
  const savedShape = savedAvatar?.blobatar_shape ?? null;

  const [avatarColor, setAvatarColor] = useState(savedColor);
  const [avatarStyle, setAvatarStyle] = useState(savedStyle);
  const [blobatarShape, setBlobatarShape] = useState(savedShape);

  const hasAvatarChanges =
    avatarColor !== savedColor ||
    avatarStyle !== savedStyle ||
    blobatarShape !== savedShape;

  const saveAvatar = () =>
    updateProfile({
      avatar_color: avatarColor,
      avatar_style: avatarStyle,
      blobatar_shape: blobatarShape,
    });

  return (
    <AppLayout>
      <header className="profile-page-header">
        <h1>Tu perfil</h1>
        <p>Gestioná tu información y personalizá tu cuenta.</p>
      </header>

      <ProfileSummary
        name={user?.name}
        seed={user?.email}
        blobatarShape={blobatarShape}
        avatarColor={avatarColor}
        avatarStyle={avatarStyle}
      />

      <div className="profile-grid">
        <div className="profile-grid-col">
          <ProfilePersonalInfo
            name={user?.name}
            email={user?.email}
            location={user?.location}
            bio={user?.bio}
            onSave={updateProfile}
          />
          <ProfileSecurity />
        </div>

        <div className="profile-grid-col">
          <ProfilePreferences
            initialNotificationsEnabled={user?.notifications_enabled ?? true}
          />
          <ProfileCustomization
            name={user?.name}
            seed={user?.email}
            avatarColor={avatarColor}
            avatarStyle={avatarStyle}
            blobatarShape={blobatarShape}
            hasChanges={hasAvatarChanges}
            onSave={saveAvatar}
            onAvatarColorChange={setAvatarColor}
            onAvatarStyleChange={setAvatarStyle}
            onBlobatarShapeChange={setBlobatarShape}
          />
        </div>
      </div>
    </AppLayout>
  );
}
