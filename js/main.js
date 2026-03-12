// Configuración de SweetAlert2
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
});

let listaPedido = JSON.parse(localStorage.getItem('lista-cacomixtle')) || [];

// --- CARGA DINÁMICA DE PRODUCTO ---
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') AOS.init();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const contenedor = document.getElementById('detalle-producto');

    if (id && contenedor) {
        fetch('js/datos.json')
            .then(res => res.json())
            .then(data => {
                const p = data.productos.find(i => i.id === id);
                if (p) renderizarProducto(p, contenedor);
            });
    }
    
    mostrarResumen();
});

function renderizarProducto(p, contenedor) {
    // Aquí es donde añadimos la magia del precio original tachado
    contenedor.innerHTML = `
        <div class="col-md-7" data-aos="fade-right">
            <img src="${p.imagenPrincipal}" class="img-fluid w-100 shadow-lg">
        </div>
        <div class="col-md-5" data-aos="fade-left">
            <h1 style="font-family: var(--font-fancy); font-size: 3.5rem;">${p.nombre}</h1>
            <div class="talavera-divider" style="width: 80px; margin: 20px 0;"></div>
            
            <div class="mb-4">
                <span class="price-old h4 text-muted text-decoration-line-through me-3">$${p.precioOriginal}</span>
                <span class="price-new h2" style="color: var(--gold); font-weight: 700;">$${p.precioOferta} MXN</span>
            </div>

            <p class="lead fw-light text-muted mb-4">${p.descripcion}</p>
            
            <div class="row g-3 mb-4">
                <div class="col-8">
                    <label class="small fw-bold text-uppercase opacity-50 mb-1 d-block">Talla</label>
                    <select id="talla" class="form-select border-0 bg-light p-3 fw-bold">
                        <option value="S (Chica)">S (Chica)</option>
                        <option value="M (Mediana)" selected>M (Mediana)</option>
                        <option value="L (Grande)">L (Grande)</option>
                        <option value="XL (Extra Grande)">XL (Extra Grande)</option>
                        <option value="XXL (Doble Extra Grande)">XXL (Doble Extra Grande)</option>
                    </select>
                </div>
                <div class="col-4">
                    <label class="small fw-bold text-uppercase opacity-50 mb-1 d-block">Cantidad</label>
                    <input type="number" id="cantidad" class="form-control border-0 bg-light p-3 fw-bold text-center" value="1" min="1">
                </div>
            </div>

            <div class="d-grid gap-2 mb-5">
                <button onclick="agregarALaLista('${p.nombre}')" class="btn-premium">AÑADIR A MI PEDIDO</button>
                <div class="row g-2">
                    <div class="col-6"><a href="index.html" class="btn-premium w-100 text-center" style="background:#444; font-size:0.65rem; padding:15px;">SEGUIR VIENDO</a></div>
                    <div class="col-6"><button onclick="enviarTodoPorWhatsApp()" class="btn-premium w-100" style="background:#25D366; font-size:0.65rem; padding:15px;">PEDIR TODO</button></div>
                </div>
            </div>

            <div class="p-4 border-top" style="background: #fafafa;">
                <h6 class="hero-subtitle mb-3" style="font-size:0.7rem; letter-spacing:2px;">Tu Selección Actual</h6>
                <div id="resumen-lista"></div>
                <button onclick="limpiarLista()" class="btn btn-link text-muted mt-2 p-0" style="font-size:0.6rem; text-decoration:none; opacity:0.6;">
                    <i class=""></i> Vaciar lista completa
                </button>
            </div>
        </div>`;
}

// (El resto de funciones agregarALaLista, mostrarResumen, etc., se mantienen igual)

function agregarALaLista(nombre) {
    const talla = document.getElementById('talla').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    
    if (cantidad < 1 || isNaN(cantidad)) {
        Swal.fire({ icon: 'error', title: '¡Ups!', text: 'Cantidad no válida.', confirmButtonColor: '#0a0a0a' });
        return;
    }

    listaPedido.push({ nombre, talla, cantidad });
    localStorage.setItem('lista-cacomixtle', JSON.stringify(listaPedido));
    
    Toast.fire({ icon: 'success', title: `¡Añadido! Llevas ${listaPedido.length} productos`, background: '#fff', color: '#000', iconColor: '#c5a059' });
    mostrarResumen();
}

function mostrarResumen() {
    const contenedor = document.getElementById('resumen-lista');
    if (!contenedor) return;

    if (listaPedido.length === 0) {
        contenedor.innerHTML = "<p class='text-muted small'>Tu lista está vacía.</p>";
        return;
    }

    let html = '<ul class="list-group list-group-flush mb-4">';
    listaPedido.forEach((item, i) => {
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0">
                <div>
                    <strong class="text-uppercase" style="font-size:0.75rem;">${item.nombre}</strong><br>
                    <small class="text-muted">Talla: ${item.talla} | Cant: ${item.cantidad}</small>
                </div>
                <button onclick="eliminarDeLista(${i})" class="btn btn-sm text-danger p-0"><i class="fas fa-times"></i></button>
            </li>`;
    });
    html += '</ul>';
    contenedor.innerHTML = html;
}

function eliminarDeLista(index) {
    listaPedido.splice(index, 1);
    localStorage.setItem('lista-cacomixtle', JSON.stringify(listaPedido));
    mostrarResumen();
}

function enviarTodoPorWhatsApp() {
    if (listaPedido.length === 0) {
        Swal.fire({ icon: 'info', title: 'Lista vacía', confirmButtonColor: '#0a0a0a' });
        return;
    }

    let mensaje = "¡Hola Cacomixtle! 👋 Mi pedido es:%0A%0A";
    listaPedido.forEach((item, i) => {
        mensaje += `*${i + 1}. ${item.nombre}*%0A   - Talla: ${item.talla}%0A   - Cantidad: ${item.cantidad}%0A%0A`;
    });

    window.open(`https://wa.me/522225968886?text=${mensaje}`, '_blank');
}

function limpiarLista() {
    Swal.fire({
        title: '¿Borrar todo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0a0a0a',
        confirmButtonText: 'Sí, vaciar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('lista-cacomixtle');
            listaPedido = [];
            location.reload();
        }
    });
}