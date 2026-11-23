import { getPresetIcon } from "@/components/groups/groupWizardConfig";
import "@/styles/groups/group-shared.css";

export default function GroupAvatar({
  name,
  color,
  preset,
  imageUrl,
  size = "md",
}) {
  return (
    <span
      className={`group-avatar group-avatar--${size}`}
      style={{ backgroundColor: color }}
      role="img"
      aria-label={name ? `Imagen del grupo ${name}` : "Imagen del grupo"}
    >
      {imageUrl ? (
        <img className="group-avatar-photo" src={imageUrl} alt="" />
      ) : preset ? (
        <img
          className="group-avatar-icon"
          src={getPresetIcon(preset)}
          alt=""
        />
      ) : (
        <span className="group-avatar-initial">
          {name?.trim()?.[0]?.toUpperCase() ?? "?"}
        </span>
      )}
    </span>
  );
}
