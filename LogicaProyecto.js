// Definimos el presupuesto simulado disponible
const PRESUPUESTO_INICIAL = 15000000; 

// Función que formatea un número a pesos colombianos (COP)
function formatearDinero(valor) {
    return "$" + valor.toLocaleString('es-CO') + " COP";
}

// Obtener los productos guardados en el almacenamiento del navegador
function obtenerCarrito() {
    const carritoGuardado = localStorage.getItem("carritoTech");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

// Guardar el listado de productos en el navegador
function guardarCarrito(carrito) {
    localStorage.setItem("carritoTech", JSON.stringify(carrito));
    actualizarContadorNavbar();
}

// Acciones
function agregarAlCarrito(nombre, precio, tipo) {
    let carrito = obtenerCarrito();

    // Creamos el objeto del producto
    const nuevoItem = {
        id: Date.now(), // Identificador único
        nombre: nombre,
        precio: precio,
        tipo: tipo
    };

    carrito.push(nuevoItem);
    guardarCarrito(carrito);

    alert(`¡Éxito! Has añadido "${nombre}" a la simulación.`);
}

function eliminarDelCarrito(id) {
    let carrito = obtenerCarrito();
    // Filtramos para sacar el elemento que coincide con el ID
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito(carrito);
    // Refrescamos la tabla y el balance
    renderizarCarrito();
}

function vaciarCarrito() {
    if (confirm("¿Deseas vaciar todos los productos del carrito?")) {
        localStorage.removeItem("carritoTech");
        actualizarContadorNavbar();
        renderizarCarrito();
    }
}
// RENDERIZADO EN PANTALLA
function actualizarContadorNavbar() {
    const contador = document.getElementById("cart-count");
    if (contador) {
        const carrito = obtenerCarrito();
        contador.textContent = carrito.length;
    }
}

function renderizarCarrito() {
    const tablaBody = document.getElementById("tabla-carrito-body");
    const mensajeVacio = document.getElementById("mensaje-vacio");
    const totalCarritoEl = document.getElementById("total-carrito");
    const saldoRestanteEl = document.getElementById("saldo-restante");
    const balanceInicialEl = document.getElementById("balance-inicial");

    // Si no estamos en carrito.html, salimos
    if (!tablaBody) return;

    const carrito = obtenerCarrito();
    tablaBody.innerHTML = "";

    let totalGasto = 0;

    if (carrito.length === 0) {
        mensajeVacio.style.display = "block";
    } else {
        mensajeVacio.style.display = "none";
        
        carrito.forEach(item => {
            totalGasto += item.precio;

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>${item.nombre}</strong></td>
                <td>${item.tipo}</td>
                <td>${formatearDinero(item.precio)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${item.id})">
                        Eliminar
                    </button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    // Calcular el balance restante
    const saldoRestante = PRESUPUESTO_INICIAL - totalGasto;

    // Actualizar valores numéricos en la interfaz
    balanceInicialEl.textContent = formatearDinero(PRESUPUESTO_INICIAL);
    totalCarritoEl.textContent = formatearDinero(totalGasto);
    saldoRestanteEl.textContent = formatearDinero(saldoRestante);

    // Alerta visual si se excede el presupuesto
    if (saldoRestante < 0) {
        saldoRestanteEl.classList.remove("text-success");
        saldoRestanteEl.classList.add("text-danger");
    } else {
        saldoRestanteEl.classList.remove("text-danger");
        saldoRestanteEl.classList.add("text-success");
    }
}

function procesarCompra() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos primero.");
        return;
    }

    let total = carrito.reduce((acc, item) => acc + item.precio, 0);

    if (total > PRESUPUESTO_INICIAL) {
        alert("⚠️ No puedes completar la compra: Has superado el presupuesto asignado.");
        return;
    }

    alert(`¡Compra simulada con éxito!\nTotal facturado: ${formatearDinero(total)}\nPresupuesto restante: ${formatearDinero(PRESUPUESTO_INICIAL - total)}`);
    localStorage.removeItem("carritoTech");
    actualizarContadorNavbar();
    renderizarCarrito();
}

// Inicialización cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorNavbar();
    renderizarCarrito();
});