export default function Login() {
  return (
    <>
      <h2>Login</h2>
      
      <form action="#">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" />
        </div>

        <button type="submit">Iniciar Sesión</button>
      </form>
    </>
  );
}
