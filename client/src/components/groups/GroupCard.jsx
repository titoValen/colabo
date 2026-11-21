import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import GroupAvatar from "@components/groups/GroupAvatar";
import ProfileAvatar from "@components/profile/ProfileAvatar";
import MembersIcon from "@/assets/icons/profile.svg";
import ChevronIcon from "@/assets/icons/chevron_down.svg";
import "@/styles/groups/group-shared.css";

export default function GroupCard({ group }) {
  const { user } = useAuth();
  const members = group.members_preview ?? [];
  const extraMembers = Math.max(0, group.users_count - members.length);

  return (
    <Link
      to={`/grupos/${group.id}`}
      className="group-card"
      style={{ "--group-color": group.color }}
    >
      <span
        className="group-card-cover group-cover"
        style={{
          backgroundImage: group.cover_url
            ? `url("${group.cover_url}")`
            : undefined,
        }}
      />
      <span className="group-card-avatar">
        <GroupAvatar
          name={group.name}
          color={group.color}
          preset={group.avatar_preset}
          imageUrl={group.avatar_url}
          size="md"
        />
      </span>

      <span className="group-card-body">
        <span className="group-card-name">{group.name}</span>
        <span className="group-card-meta">
          <img src={MembersIcon} alt="" />
          {group.users_count}{" "}
          {group.users_count === 1 ? "integrante" : "integrantes"}
        </span>
        {group.type && (
          <span>
            <span className="group-badge">{group.type}</span>
          </span>
        )}

        <span className="group-card-footer">
          <span className="group-card-members">
            {members.map((member) => (
              <ProfileAvatar
                key={member.id}
                name={member.name}
                seed={member.id === user?.id ? user.email : member.name}
                shape={member.avatar_preference?.blobatar_shape}
                color={member.avatar_preference?.avatar_color}
                style={member.avatar_preference?.avatar_style}
                size="sm"
              />
            ))}
            {extraMembers > 0 && (
              <span className="group-card-more">+{extraMembers}</span>
            )}
          </span>
          <img className="group-card-chevron" src={ChevronIcon} alt="" />
        </span>
      </span>
    </Link>
  );
}
