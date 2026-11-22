import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import AppLayout from "@components/layout/AppLayout";
import Loading from "@components/shared/Loading";
import GroupAvatar from "@components/groups/GroupAvatar";
import {
  AVATAR_PRESETS,
  GROUP_CATEGORIES,
  GROUP_COLORS,
  MEMBER_LIMIT_FREE,
  MEMBER_LIMIT_MIN,
  getPresetIcon,
} from "@components/groups/groupWizardConfig";
import { validateImage } from "@components/groups/groupWizardValidation";
import "@/styles/groups/group-wizard.css";
import "@/styles/groups/edit-group.css";

export default function EditGroup() {
  const { groupId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const avatarInput = useRef(null);
  const coverInput = useRef(null);
  const [source, setSource] = useState(null);
  const [form, setForm] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    apiFetch(`/groups/${groupId}`, { token })
      .then((data) => {
        if (!active) return;
        if (data.my_role !== "admin") {
          navigate(`/grupos/${groupId}`, { replace: true });
          return;
        }

        const { group } = data;
        setSource(data);
        setForm({
          name: group.name ?? "",
          description: group.description ?? "",
          category: group.type ?? "Otros",
          color: group.color,
          avatarPreset: group.avatar_preset,
          memberLimit: group.member_limit,
          invite: group.members_can_invite,
          createTasks: group.members_can_create_tasks,
          addExpenses: group.members_can_add_expenses,
          avatarPreview: group.avatar_url,
          coverPreview: group.cover_url,
        });
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });

    return () => {
      active = false;
    };
  }, [groupId, navigate, token]);

  const update = (patch) => {
    setForm((current) => ({ ...current, ...patch }));
    setError("");
  };

  const handleImage = (kind, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      update(kind === "avatar" ? { avatarPreview: reader.result } : { coverPreview: reader.result });
    reader.readAsDataURL(file);
    if (kind === "avatar") setAvatarFile(file);
    else setCoverFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("El nombre del grupo es obligatorio.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { group, goals, rules, events, tasks } = source;
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        category: form.category,
        color: form.color,
        avatar_preset: form.avatarPreset,
        member_limit: form.memberLimit,
        members_can_invite: form.invite,
        members_can_create_tasks: form.createTasks,
        members_can_add_expenses: form.addExpenses,
        invite_code: null,
        invitees: [],
        purpose: group.purpose ?? null,
        goals: goals.map((goal) => goal.description),
        important_dates: events.map((item) => ({
          title: item.title,
          date: String(item.starts_at).slice(0, 10),
        })),
        rules: rules.map((rule) => ({
          type: rule.type,
          description: rule.description,
          requires_acceptance: rule.requires_acceptance,
        })),
        task: tasks[0]
          ? {
              title: tasks[0].title,
              description: tasks[0].description ?? null,
              due_date: tasks[0].due_date ? String(tasks[0].due_date).slice(0, 10) : null,
            }
          : null,
        expenses: group.expenses_enabled
          ? {
              currency: group.currency,
              budget: group.budget,
              split: group.expense_split,
              contribution_amount: group.contribution_amount,
            }
          : null,
      };

      await apiFetch(`/groups/${groupId}`, {
        method: "PATCH",
        body: payload,
        token,
      });

      if (avatarFile || coverFile) {
        const images = new FormData();
        if (avatarFile) images.append("avatar", avatarFile);
        if (coverFile) images.append("cover", coverFile);
        await apiFetch(`/groups/${groupId}/images`, {
          method: "POST",
          body: images,
          token,
        });
      }

      toast.success("Los cambios del grupo fueron guardados.");
      navigate(`/grupos/${groupId}`, { replace: true });
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (error && !form) {
    return (
      <AppLayout>
        <p className="edit-group-error" role="alert">{error}</p>
      </AppLayout>
    );
  }

  if (!form) {
    return (
      <AppLayout>
        <Loading status="Cargando configuración del grupo..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <header className="edit-group-header">
        <div>
          <p className="edit-group-eyebrow">Configuración del grupo</p>
          <h1>Editar grupo</h1>
        </div>
        <Link to={`/grupos/${groupId}`} className="btn btn-secondary">
          Cancelar
        </Link>
      </header>

      <form className="edit-group-form" onSubmit={handleSubmit}>
        <section className="edit-group-card">
          <h2>Información básica</h2>
          <div className="edit-group-fields">
            <label>
              <span>Nombre del grupo</span>
              <input
                className="wizard-input"
                value={form.name}
                maxLength={80}
                onChange={(event) => update({ name: event.target.value })}
              />
            </label>
            <label>
              <span>Descripción</span>
              <textarea
                className="wizard-input wizard-textarea"
                value={form.description}
                maxLength={500}
                rows={3}
                onChange={(event) => update({ description: event.target.value })}
              />
            </label>
            <label>
              <span>Categoría</span>
              <select
                className="wizard-input"
                value={form.category}
                onChange={(event) => update({ category: event.target.value })}
              >
                {GROUP_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="edit-group-fieldset">
            <legend>Color</legend>
            <div className="edit-group-colors">
              {GROUP_COLORS.map((option) => (
                <label key={option.value} title={option.label}>
                  <input
                    type="radio"
                    name="group-color"
                    value={option.value}
                    checked={form.color === option.value}
                    onChange={() => update({ color: option.value })}
                  />
                  <span style={{ backgroundColor: option.value }} />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="edit-group-fieldset">
            <legend>Icono</legend>
            <div className="edit-group-presets">
              {AVATAR_PRESETS.map((preset) => (
                <label key={preset.key}>
                  <input
                    type="radio"
                    name="avatar-preset"
                    value={preset.key}
                    checked={form.avatarPreset === preset.key}
                    onChange={() => update({ avatarPreset: preset.key })}
                  />
                  <img src={getPresetIcon(preset.key)} alt="" />
                  <span>{preset.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="edit-group-card">
          <h2>Imágenes</h2>
          <div className="edit-group-images">
            <div>
              <span>Avatar</span>
              <button type="button" className="edit-group-avatar-button" onClick={() => avatarInput.current?.click()}>
                <GroupAvatar
                  name={form.name}
                  color={form.color}
                  preset={form.avatarPreset}
                  imageUrl={form.avatarPreview}
                  size="lg"
                />
                <span>Cambiar avatar</span>
              </button>
              <input ref={avatarInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => handleImage("avatar", event)} />
            </div>
            <div>
              <span>Portada</span>
              <button
                type="button"
                className="edit-group-cover-button"
                style={{ "--edit-cover": form.coverPreview ? `url("${form.coverPreview}")` : undefined, "--group-color": form.color }}
                onClick={() => coverInput.current?.click()}
              >
                Cambiar portada
              </button>
              <input ref={coverInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => handleImage("cover", event)} />
            </div>
          </div>
        </section>

        <section className="edit-group-card">
          <h2>Preferencias</h2>
          <label className="edit-group-select">
            <span>Límite de integrantes</span>
            <select
              className="wizard-input"
              value={form.memberLimit}
              onChange={(event) => update({ memberLimit: Number(event.target.value) })}
            >
              {Array.from(
                { length: MEMBER_LIMIT_FREE - MEMBER_LIMIT_MIN + 1 },
                (_, index) => MEMBER_LIMIT_MIN + index,
              ).map((limit) => (
                <option key={limit} value={limit}>{limit}</option>
              ))}
            </select>
          </label>
          <div className="edit-group-toggles">
            <label>
              <input type="checkbox" checked={form.invite} onChange={(event) => update({ invite: event.target.checked })} />
              <span><strong>Permitir invitaciones</strong><small>Los integrantes pueden invitar personas.</small></span>
            </label>
            <label>
              <input type="checkbox" checked={form.createTasks} onChange={(event) => update({ createTasks: event.target.checked })} />
              <span><strong>Crear tareas</strong><small>Los integrantes pueden crear tareas.</small></span>
            </label>
            <label>
              <input type="checkbox" checked={form.addExpenses} onChange={(event) => update({ addExpenses: event.target.checked })} />
              <span><strong>Agregar gastos</strong><small>Los integrantes pueden registrar gastos.</small></span>
            </label>
          </div>
        </section>

        {error && <p className="edit-group-error" role="alert">{error}</p>}
        <div className="edit-group-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
