function getInitials(name) {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function ProfileAvatar({ name, color, style = "initials", size = "lg" }) {
  const className = `profile-avatar profile-avatar--${size} profile-avatar--${style}`;

  if (style === "illustrated") {
    return <span className={className} style={{ backgroundColor: color }} aria-hidden="true" />;
  }

  return (
    <span className={className} style={{ backgroundColor: color }}>
      {getInitials(name)}
    </span>
  );
}
