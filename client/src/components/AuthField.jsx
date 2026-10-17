export default function AuthField({ label, input }) {
  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={input.id}>
        {label}
      </label>
      <input
        className="auth-input"
        {...input}
      />
    </div>
  )
}
