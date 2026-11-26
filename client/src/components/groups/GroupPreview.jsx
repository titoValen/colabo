import GroupAvatar from "@/components/groups/GroupAvatar";
import "@/styles/groups/group-shared.css";

export default function GroupPreview({
  name,
  description,
  category,
  color,
  preset,
  avatarUrl,
  coverUrl,
  memberLabel = "1 integrante · tú",
}) {
  return (
    <article className="group-preview" aria-label="Vista previa del grupo">
      <div
        className="group-preview-cover"
        style={{
          backgroundImage: coverUrl ? `url("${coverUrl}")` : undefined,
          "--group-color": color,
        }}
      />
      <div className="group-preview-body">
        <div className="group-preview-avatar">
          <GroupAvatar
            name={name}
            color={color}
            preset={preset}
            imageUrl={avatarUrl}
            size="lg"
          />
        </div>
        <h3 className={`group-preview-name${name ? "" : " is-placeholder"}`}>
          {name || "Nombre del grupo"}
        </h3>
        <div className="group-preview-meta">
          <span className="group-badge" style={{ "--group-color": color }}>
            {category}
          </span>
          <span className="group-preview-members">{memberLabel}</span>
        </div>
        <p
          className={`group-preview-description${description ? "" : " is-placeholder"}`}
        >
          {description || "Aquí se va a ver la descripción de tu grupo."}
        </p>
      </div>
    </article>
  );
}
