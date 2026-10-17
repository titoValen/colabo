export default function AuthField({ label, input }) {
  const { error, ...inputProps } = input;

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={inputProps.id}>
        {label}
      </label>
      <input
        className="auth-input"
        {...inputProps}
      />
      {error}
    </div>
  );
}
