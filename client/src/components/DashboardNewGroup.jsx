import NewGroupIllustration from "@/assets/illustration/colabo_new_group.webp";

export default function DashboardNewGroup() {
  return (
    <section className="dashboard-card dashboard-new-group">
      <img
        className="dashboard-new-group-image"
        src={NewGroupIllustration}
        alt=""
      />
      <h2 className="dashboard-new-group-title">¿Nuevo grupo?</h2>
      <p className="dashboard-new-group-text">
        Crear un grupo es el primer paso para organizarse mejor.
      </p>
      <button
        type="button"
        className="dashboard-new-group-button"
        disabled
      >
        Crear grupo
      </button>
    </section>
  );
}
