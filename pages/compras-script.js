fetch("./productos.json") // retorna objeto Response
  .then(respuesta => respuesta.json()) // pasar de Response a JS 
  .then(productos => principal(productos))
  .catch(error => lanzarAlerta(error, 'error', true))

function principal(productos) {
  let carritoRecuperado = localStorage.getItem("carrito")
  let carrito = carritoRecuperado ? JSON.parse(carritoRecuperado) : []

  renderizarCarrito(carrito)
  renderizarProductos(productos, carrito)

  let buscador = document.getElementById("buscador")

  let botonBuscar = document.getElementById("buscar")
  botonBuscar.addEventListener("click", () => filtrarYRenderizar(productos, buscador, carrito))

  let botonesCategorias = document.getElementsByClassName("filtroCategoria")
  for (let botonCategoria of botonesCategorias) {
    botonCategoria.addEventListener("click", (e) => filtrarPorCategoria(e, productos, carrito))
  }

  let botonVerOcultar = document.getElementById("verOcultar")
  botonVerOcultar.addEventListener("click", verOcultarCarrito)
}

function filtrarPorCategoria(e, productos, carrito) {
  if (e.target.id === "mostrarTodos") {
    // Mostrar todos los productos sin filtrar por categoría
    renderizarProductos(productos, carrito)
  } else {
    let productosFiltradosCategoria = productos.filter(producto => {
      return producto.categoria === e.target.id
    })
    renderizarProductos(productosFiltradosCategoria, carrito)
  }
}

function filtrarYRenderizar(productos, buscador, carrito) {
  let productosFiltrados = productos.filter(producto => {
    return producto.nombre.includes(buscador.value)
  })
  renderizarProductos(productosFiltrados, carrito)
}

function renderizarProductos(productos, carrito) {
  let contenedor = document.getElementById("contenedorProductos")
  contenedor.innerHTML = ""

  productos.forEach(({ nombre, rutaImagen, precio, id, info, stock }) => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "tarjeta"
    tarjeta.id = "tarjeta" + id

    tarjeta.innerHTML = `
    <div class=nombreImgPrecio>
      <h3>${nombre}</h3>
      <img class=imagenProducto src=../images/${rutaImagen} />
      <p><strong>$${precio}</strong></p>
      <p class="cantidad">Cant. disponible: ${stock}</p>
      </div>
    <div class=oculta>
      <div class=imgInfoPrecio>
        <h3>${nombre}</h3>
        <img class=imagenProducto src=../images/${rutaImagen} />
        <p><strong>$${precio}</strong></p>
        <p>Descripcion de ${nombre} : ${info}</p>
        <button class=agregarCarrito id=${id}>
        <strong>Agregar al carrito </strong>
        <img class=imgCarrito src=../images/carrito-total.jpg />
        </button>
      </div>
    </div> 
    `
    tarjeta.addEventListener("mouseenter", (e) => mostrarInfoExtra(e))
    tarjeta.addEventListener("mouseleave", (e) => mostrarInfoExtra(e))
    contenedor.appendChild(tarjeta)

    // Obtener el elemento del párrafo con la clase "cantidad"
    let cantidadParrafo = tarjeta.querySelector(".cantidad")

    // Cambiar el color del texto según el valor de stock
    if (stock > 10) {
      cantidadParrafo.style.color = "green"
    } else {
      cantidadParrafo.style.color = "red"
    }

    let botonAgregarAlCarrito = document.getElementById(id)
    botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(productos, carrito, e))
  })
}

function mostrarInfoExtra(e) {
  e.target.children[0].classList.toggle("oculta")
  e.target.children[1].classList.toggle("oculta")
}

function agregarProductoAlCarrito(productos, carrito, e) {
  let productoBuscado = productos.find(producto => producto.id === Number(e.target.id))
  let productoEnCarrito = carrito.find(producto => producto.id === productoBuscado.id)

  if (productoBuscado.stock > 0) {
    if (productoEnCarrito) {
      productoEnCarrito.unidades++
      productoEnCarrito.subtotal = productoEnCarrito.unidades * productoEnCarrito.precioUnitario
    } else {
      carrito.push({
        id: productoBuscado.id,
        nombre: productoBuscado.nombre,
        precioUnitario: productoBuscado.precio,
        unidades: 1,
        subtotal: productoBuscado.precio
      })
    }
    productoBuscado.stock--
    localStorage.setItem("carrito", JSON.stringify(carrito))

    agregarProdTostada("Producto agregado", 1500)
  } else {
    lanzarAlerta('Lo sentimos', 'No tenemos stock del producto seleccionado', 'error', true)
  }

  renderizarCarrito(carrito)
}

function renderizarCarrito(productosEnCarrito) {
  let divCarrito = document.getElementById("carrito")

  if (productosEnCarrito.length > 0) {
    divCarrito.innerHTML = `
    <div class="carritoTitulos">
      <p>Producto:</p>
      <p>Precio Unitario:</p>
      <p>Cantidad</p>
      <p>Subtotal</p>
    </div>
    `

    let total = productosEnCarrito.reduce((acum, producto) => acum + producto.subtotal, 0)

    productosEnCarrito.forEach(({ nombre, precioUnitario, unidades, subtotal }, index) => {
      let tarjProdCarrito = document.createElement("div")
      tarjProdCarrito.className = "tarjProdCarrito"
      tarjProdCarrito.innerHTML = `
        <div class="prodCarrito">
          <p>${nombre}</p>
          <button class="quitarProducto" data-index="${index}">-</button>
        </div>
        <p>$${precioUnitario}</p>
        <p>${unidades}</p>
        <p>$${subtotal}</p>
      `
      divCarrito.appendChild(tarjProdCarrito)
    })

    let totalCompra = document.createElement("div")
    totalCompra.innerHTML = `Total a pagar: $${total}`
    totalCompra.classList.add("totalCompra")
    divCarrito.appendChild(totalCompra)

    let botonCompra = document.createElement("button")
    botonCompra.innerHTML = "Finalizar compra"
    botonCompra.addEventListener("click", finalizarCompra)
    botonCompra.classList.add("botonCompra")
    divCarrito.appendChild(botonCompra)

    // Agregar evento a los botones "Quitar"
    let botonesQuitar = divCarrito.querySelectorAll(".quitarProducto")
    botonesQuitar.forEach((boton) => {
      boton.addEventListener("click", (e) => quitarProductoDelCarrito(e, productosEnCarrito))
    })
  } else {
    divCarrito.innerHTML = `<p class="sinProducto">No hay productos en el carrito</p>`
  }
}

function quitarProductoDelCarrito(event, productosEnCarrito) {
  let index = event.target.getAttribute("data-index")
  productosEnCarrito.splice(index, 1)
  localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
  quitarProdTostada("Producto quitado", 1500)
  renderizarCarrito(productosEnCarrito)
}

function finalizarCompra() {
  let carrito = document.getElementById("carrito")
  carrito.innerHTML = ""
  localStorage.removeItem("carrito")
  lanzarAlerta('Gracias por su compra', 'Su compra fue realizada con exito', 'success', true)
}

function verOcultarCarrito() {
  let carrito = document.getElementById("carrito")
  let contenedorProductos = document.getElementById("contenedorProductos")

  carrito.classList.toggle("oculta")
  contenedorProductos.classList.toggle("oculta")
}

function lanzarAlerta(title, text, icon, showConfirmButton, timer) {
  Swal.fire({
    title,
    text: text,
    icon: icon,
    showConfirmButton: showConfirmButton,
    timer: timer,
    width: "300px",
    height: "300px"
  })
}

function agregarProdTostada(text, duration) {
  Toastify({
    text,
    duration,
    className: "tostadaAgregar",
  }).showToast()
}

function quitarProdTostada(text, duration) {
  Toastify({
    text,
    duration,
    className: "tostadaQuitar",
  }).showToast()
}
