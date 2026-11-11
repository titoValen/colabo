import ProfileAvatar from "@components/ProfileAvatar";
import GroupsIcon from "@/assets/icons/groups.svg";
import TasksIcon from "@/assets/icons/tasks.svg";
import EventsIcon from "@/assets/icons/events.svg";

const STATS = [
  { label: "Grupos", icon: GroupsIcon },
  { label: "Tareas completadas", icon: TasksIcon },
  { label: "Eventos", icon: EventsIcon },
];

export default function ProfileSummary({ name, seed, avatarColor, avatarStyle }) {
  return (
    <section className="profile-card profile-summary">
      <ProfileAvatar
        name={name}
        seed={seed}
        color={avatarColor}
        style={avatarStyle}
        size="lg"
      />

      <div className="profile-summary-info">
        <h2 className="profile-summary-name">{name}</h2>
        <span className="profile-plan-badge">⭐ Plan gratuito</span>
      </div>

      <ul className="profile-stats">
        {STATS.map(({ label, icon }) => (
          <li key={label} className="profile-stat">
            <img src={icon} alt="" />
            <strong>—</strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
