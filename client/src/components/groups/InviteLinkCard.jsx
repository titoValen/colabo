import { useEffect, useState } from "react";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import {
  INVITE_VALID_DAYS,
  buildInviteLink,
} from "@/components/groups/groupWizardConfig";

export default function InviteLinkCard({ code, onGenerate, onRemove }) {
  const [qr, setQr] = useState({ link: "", dataUrl: "", failed: false });
  const link = code ? buildInviteLink(code) : "";

  useEffect(() => {
    if (!link) return undefined;

    let isCancelled = false;

    QRCode.toDataURL(link, {
      width: 220,
      margin: 1,
      color: { dark: "#243b53", light: "#ffffff" },
    })
      .then((dataUrl) => {
        if (!isCancelled) setQr({ link, dataUrl, failed: false });
      })
      .catch(() => {
        if (!isCancelled) setQr({ link, dataUrl: "", failed: true });
      });

    return () => {
      isCancelled = true;
    };
  }, [link]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Enlace copiado.");
    } catch {
      toast.error("No pudimos copiar el enlace. Seleccionalo y copialo a mano.");
    }
  };

  if (!code) {
    return (
      <div className="invite-link-empty">
        <p className="wizard-hint">
          Compartí un enlace o un código QR para que se sumen cuando quieran.
        </p>
        <button type="button" className="btn btn-secondary" onClick={onGenerate}>
          Generar enlace de invitación
        </button>
      </div>
    );
  }

  const isQrReady = qr.link === link && qr.dataUrl;
  const hasQrFailed = qr.link === link && qr.failed;

  return (
    <div className="invite-link">
      <div className="invite-link-main">
        <label htmlFor="invite-link-input" className="wizard-label">
          Tu enlace de invitación
        </label>
        <div className="invite-link-field">
          <input
            id="invite-link-input"
            className="wizard-input"
            value={link}
            readOnly
            onFocus={(event) => event.target.select()}
          />
          <button type="button" className="btn btn-primary" onClick={handleCopy}>
            Copiar
          </button>
        </div>
        <p className="wizard-hint">
          Va a funcionar durante {INVITE_VALID_DAYS} días desde que crees el grupo.
        </p>
        <div className="upload-row">
          <button type="button" className="wizard-link-button" onClick={onGenerate}>
            Generar uno nuevo
          </button>
          <button
            type="button"
            className="wizard-link-button is-muted"
            onClick={onRemove}
          >
            Quitar enlace
          </button>
        </div>
      </div>

      <figure className="invite-qr">
        {isQrReady ? (
          <img src={qr.dataUrl} alt="Código QR del enlace de invitación" />
        ) : (
          <div className="invite-qr-placeholder" role="status">
            {hasQrFailed ? "No pudimos generar el QR." : "Generando QR…"}
          </div>
        )}
        <figcaption>Escaneá para unirte</figcaption>
      </figure>
    </div>
  );
}
