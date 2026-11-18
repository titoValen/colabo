import { Blobatar } from "@blobatar/react";
import { BLOBATAR_SHAPES } from "./blobatarShapes";
import "@/styles/avatar.css";

const BLOBATAR_FALLBACK_SEED = "colabo";
const EYE_LIGHT = "#ffffff";
const EYE_DARK = "#243b53";
const DEFAULT_COLOR = "#cb4528";

function getInitials(name) {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function getRelativeLuminance(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Elige ojos claros u oscuros según cuál contraste mejor con el color del perfil.
function getEyeColor(bodyColor) {
  const bodyLuminance = getRelativeLuminance(bodyColor);
  const contrastWithLight = 1.05 / (bodyLuminance + 0.05);
  const contrastWithDark = (bodyLuminance + 0.05) / (getRelativeLuminance(EYE_DARK) + 0.05);

  return contrastWithLight >= contrastWithDark ? EYE_LIGHT : EYE_DARK;
}

export default function ProfileAvatar({
  name,
  seed,
  shape,
  color = DEFAULT_COLOR,
  style = "initials",
  size = "lg",
}) {
  const className = `profile-avatar profile-avatar--${size} profile-avatar--${style}`;

  if (style === "blobatar") {
    // Mismo seed => mismo blobatar. Se genera en el navegador, sin pedidos de red.
    const blobatarSeed = seed || name || BLOBATAR_FALLBACK_SEED;
    const shapePosition = BLOBATAR_SHAPES.find((option) => option.value === shape)?.position;

    return (
      <span className={className} aria-hidden="true">
        <Blobatar
          name={blobatarSeed}
          palette={{ head: color, eye: getEyeColor(color) }}
          traits={shapePosition === undefined ? undefined : { shape: shapePosition }}
          alt=""
        />
      </span>
    );
  }

  return (
    <span className={className} style={{ backgroundColor: color }}>
      {getInitials(name)}
    </span>
  );
}
