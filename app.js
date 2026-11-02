import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://iufsuoyvkvlynvjtmhrn.supabase.co'
const supabaseKey = 'sb_publishable_taknOjxD4zmLoc9pX-9bhQ_GULCKb_U'
const supabase = createClient(supabaseUrl, supabaseKey)

let carrito = []

async function cargarProductos() {
    const contenedor = document.getElementById('contenedor')
    const { data, error } = await supabase.from('Productos').select('*')

    if (error) {
        contenedor.innerHTML = '<p>Error al cargar datos</p>'
        return
    }

    contenedor.innerHTML = ''
    data.forEach(producto => {
        const tarjeta = document.createElement('div')
        tarjeta.className = 'card'
        tarjeta.innerHTML = `
            <div>
                <img src="${producto.imagen_url || 'https://via.placeholder.com/150'}" alt="${producto.nombre}" />
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
            </div>
            <button onclick="window.agregarAlCarrito('${producto.nombre}', ${producto.precio})">Agregar al carrito</button>
        `
        contenedor.appendChild(tarjeta)
    })
}

window.agregarAlCarrito = function(nombre, precio) {
    carrito.push({ nombre, precio })
    actualizarCarrito()
}

window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1)
    actualizarCarrito()
}

window.procesarPago = function() {
    if (carrito.length === 0) return
    alert('¡Compra realizada con éxito! Gracias por tu preferencia en ElectroParts.')
    carrito = []
    actualizarCarrito()
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito')
    const totalPagar = document.getElementById('total-pagar')
    const btnPagar = document.getElementById('btn-pagar')

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p style="color: #777; font-size: 14px;">El carrito está vacío</p>'
        totalPagar.textContent = '$0.00'
        btnPagar.style.display = 'none'
        return
    }

    listaCarrito.innerHTML = ''
    let total = 0

    carrito.forEach((item, index) => {
        total += item.precio
        const li = document.createElement('li')
        li.innerHTML = `
            <span>${item.nombre} - $${item.precio}</span>
            <button class="btn-eliminar" onclick="window.eliminarDelCarrito(${index})">X</button>
        `
        listaCarrito.appendChild(li)
    })

    totalPagar.textContent = `$${total.toFixed(2)}`
    btnPagar.style.display = 'block'
}

cargarProductos()