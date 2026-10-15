export default function Register() {
  return (
    <>
      <h2>Register</h2>

      <form action="#">
        <div>
          <label htmlFor="name">Nombre</label>
          <input type="text" id="name" />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" />
        </div>

        <div>
          <label htmlFor="confirmpassword">Confirmar Contraseña</label>
          <input type="password" id="confirmpassword" />
        </div>

        <button type="submit">Registrarse</button>
      </form>
    </>
  );
}
