// ==========================================================
// 1. CONFIGURACIÓN DEL BALANCE FINANCIERO INICIAL
// ==========================================================
// Presupuesto ficticio para la simulación ($15.000.000 COP)
const PRESUPUESTO_INICIAL = 15000000;

// Utilidad para formatear valores en pesos colombianos legibles
function formatearDinero(valor) {
    return "$" + valor.toLocaleString('es-CO') + " COP";
}

// ==========================================================
// 2. LECTURA Y ESCRITURA EN LOCALSTORAGE
// ==========================================
function obtenerCarrito() {
    const data = localStorage.getItem("carritoTech");
    return data ? JSON.parse(data) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carritoTech", JSON.stringify(carrito));
    actualizarContadorNavbar();
}

// ==========================================================
// 3. AGREGAR Y ELIMINAR PRODUCTOS
// ==========================================================
function agregarAlCarrito(nombre, precio, tipo) {
    let carrito = obtenerCarrito();

    // Estructura de cada producto añadido
    const item = {
        id: Date.now(), // Marca de tiempo única para poder borrarlo sin confusiones
        nombre: nombre,
        precio: precio,
        tipo: tipo
    };

    carrito.push(item);
    guardarCarrito(carrito);

    alert(`¡Agregado exitosamente!\nEquipo: ${nombre}\nValor: ${formatearDinero(precio)}`);
}

function eliminarDelCarrito(id) {
    let carrito = obtenerCarrito();
    // Filtramos para conservar todos excepto el que queremos borrar
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function vaciarCarrito() {
    if (confirm("¿Seguro que deseas vaciar todos los equipos del carrito?")) {
        localStorage.removeItem("carritoTech");
        actualizarContadorNavbar();
        renderizarCarrito();
    }
}

// ==========================================================
// 4. ACTUALIZACIÓN DINÁMICA DE VISTA (DOM)
// ==========================================================
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

    // Si nos encontramos en index.html, esta tabla no existe y no hace nada
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
                        ✕ Quitar
                    </button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    // Cálculo del balance
    const saldoRestante = PRESUPUESTO_INICIAL - totalGasto;

    balanceInicialEl.textContent = formatearDinero(PRESUPUESTO_INICIAL);
    totalCarritoEl.textContent = formatearDinero(totalGasto);
    saldoRestanteEl.textContent = formatearDinero(saldoRestante);

    // Advertencia visual si se agota el presupuesto
    if (saldoRestante < 0) {
        saldoRestanteEl.className = "fs-4 text-danger fw-bold mb-0";
    } else {
        saldoRestanteEl.className = "fs-4 text-success fw-bold mb-0";
    }
}

function procesarCompra() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos desde el catálogo antes de facturar.");
        return;
    }

    const total = carrito.reduce((acc, item) => acc + item.precio, 0);

    if (total > PRESUPUESTO_INICIAL) {
        alert(`❌ Presupuesto excedido: El costo (${formatearDinero(total)}) supera el presupuesto asignado de ${formatearDinero(PRESUPUESTO_INICIAL)}.`);
        return;
    }

    alert(`✅ ¡Adquisición simulada completada!\nTotal facturado: ${formatearDinero(total)}\nPresupuesto restante: ${formatearDinero(PRESUPUESTO_INICIAL - total)}`);
    localStorage.removeItem("carritoTech");
    actualizarContadorNavbar();
    renderizarCarrito();
}

// Cargar estado inicial al abrir la página
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorNavbar();
    renderizarCarrito();
});