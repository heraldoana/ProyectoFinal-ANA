const formularioCrear = document.getElementById("formularioCrear")
const formularioSesion = document.getElementById("formularioSesion")
const crearUsuarioBtn = document.getElementById("crearUsuarioBtn")
const iniciarSesionBtn = document.getElementById("iniciarSesionBtn")
const usernameCreate = document.getElementById("usernameCreate")
const passwordCreate = document.getElementById("passwordCreate")
const username = document.getElementById("username")
const password = document.getElementById("password")
const mensajeDiv = document.getElementById("mensaje")

// Variables para almacenar el usuario y la contraseña creados
let usuarioCreado = ""
let contraseñaCreada = ""

// Agrega un evento clic al botón "Crear usuario"
crearUsuarioBtn.addEventListener("click", () => {
  // Obtiene el usuario y la contraseña ingresados en el formulario de creación
  usuarioCreado = usernameCreate.value
  contraseñaCreada = passwordCreate.value

  // Oculta el formulario de creación
  formularioCrear.style.display = "none"
  // Muestra el formulario de inicio de sesión
  formularioSesion.style.display = "block"
})

// Agrega un evento clic al botón "Iniciar Sesión"
iniciarSesionBtn.addEventListener("click", () => {
  // Obtiene el usuario y la contraseña ingresados en el formulario de inicio de sesión
  const usuarioIngresado = username.value
  const contraseñaIngresada = password.value

  // Verifica si el usuario y la contraseña coinciden con los creados
  if (usuarioIngresado === usuarioCreado && contraseñaIngresada === contraseñaCreada) {
    // Si coinciden, redirige a una página (por ejemplo, "pagina.html")
    window.location.href = './pages/compras.html'
  } else {
    // Si no coinciden, muestra un mensaje de error o realiza otra acción
    mensajeDiv.textContent = 'Usuario o contraseña incorrectos'
    mensajeDiv.className = "mensaje"
  }
})      

      // Limpiar campos de entrada
      usernameInput.value = ''
      passwordInput.value = ''