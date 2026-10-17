// 1. Inicializar variables globales en la memoria del navegador
let carrito = JSON.parse(localStorage.getItem('carritoTechStore')) || [];
const presupuestoInicial = 15000000; // $15.000.000 COP

// 2. Función para agregar productos desde el catálogo
function agregarAlCarrito(nombre, precio, tipo) {
    const producto = { nombre, precio, tipo };
    carrito.push(producto);
    localStorage.setItem('carritoTechStore', JSON.stringify(carrito));
    actualizarContador();
    alert(`¡${nombre} se ha añadido al carrito!`);
}

// 3. Función para actualizar el número del contador en la barra de navegación
function actualizarContador() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.innerText = carrito.length;
    }
}

// 4. Función para mostrar los productos en la tabla del carrito y calcular el balance
function renderizarCarrito() {
    const tablaBody = document.getElementById('tabla-carrito-body');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    const totalCarritoElem = document.getElementById('total-carrito');
    const saldoRestanteElem = document.getElementById('saldo-restante');

    // Si no estamos en la página del carrito, finalizamos
    if (!tablaBody) return;

    // Limpiar contenido previo
    tablaBody.innerHTML = '';

    if (carrito.length === 0) {
        if (mensajeVacio) mensajeVacio.style.display = 'block';
        if (totalCarritoElem) totalCarritoElem.innerText = '$0 COP';
        if (saldoRestanteElem) saldoRestanteElem.innerText = `$${presupuestoInicial.toLocaleString('es-CO')} COP`;
        return;
    }

    if (mensajeVacio) mensajeVacio.style.display = 'none';

    let total = 0;

    carrito.forEach((prod, index) => {
        total += prod.precio;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${prod.nombre}</td>
            <td>${prod.tipo}</td>
            <td>$${prod.precio.toLocaleString('es-CO')} COP</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    const saldoRestante = presupuestoInicial - total;

    if (totalCarritoElem) {
        totalCarritoElem.innerText = `$${total.toLocaleString('es-CO')} COP`;
    }

    if (saldoRestanteElem) {
        saldoRestanteElem.innerText = `$${saldoRestante.toLocaleString('es-CO')} COP`;
        if (saldoRestante < 0) {
            saldoRestanteElem.classList.remove('text-success');
            saldoRestanteElem.classList.add('text-danger');
        } else {
            saldoRestanteElem.classList.remove('text-danger');
            saldoRestanteElem.classList.add('text-success');
        }
    }
}

// 5. Función para eliminar un producto individual por su índice
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carritoTechStore', JSON.stringify(carrito));
    actualizarContador();
    renderizarCarrito();
}

// 6. Función para vaciar todo el carrito
function vaciarCarrito() {
    if (carrito.length === 0) {
        alert("El carrito ya está vacío.");
        return;
    }
    if (confirm("¿Estás seguro de que deseas vaciar todo el carrito?")) {
        carrito = [];
        localStorage.removeItem('carritoTechStore');
        actualizarContador();
        renderizarCarrito();
    }
}

// 7. Función para simular el procesamiento de la compra
function procesarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    const total = carrito.reduce((sum, item) => sum + item.precio, 0);

    if (total > presupuestoInicial) {
        alert(`No puedes finalizar la compra. El total ($${total.toLocaleString('es-CO')}) excede tu presupuesto ($${presupuestoInicial.toLocaleString('es-CO')}).`);
    } else {
        alert(`¡Compra realizada con éxito!\nTotal pagado: $${total.toLocaleString('es-CO')} COP\nSaldo restante: $${(presupuestoInicial - total).toLocaleString('es-CO')} COP`);
        carrito = [];
        localStorage.removeItem('carritoTechStore');
        actualizarContador();
        renderizarCarrito();
    }
}

// 8. Event Listener para ejecutar la actualización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    renderizarCarrito();
});