import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://iufsuoyvkvlynvjtmhrn.supabase.co'
const supabaseKey = 'sb_publishable_taknOjxD4zmLoc9pX-9bhQ_GULCKb_U'
const supabase = createClient(supabaseUrl, supabaseKey)

let carrito = []
let esRegistro = false

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

window.alternarModo = function() {
    esRegistro = !esRegistro
    const btnModo = document.getElementById('btn-modo')
    const btnAuth = document.querySelector('#auth-section button:not(#btn-modo)')

    if (esRegistro) {
        btnAuth.textContent = 'Registrarse'
        btnModo.textContent = 'Ya tengo cuenta'
    } else {
        btnAuth.textContent = 'Iniciar Sesión'
        btnModo.textContent = 'Registrarse'
    }
}

window.manejarAuth = async function() {
    const usernameOriginal = document.getElementById('username-input').value.trim()
    const password = document.getElementById('password-input').value

    if (!usernameOriginal || !password) {
        alert('Por favor completa todos los campos.')
        return
    }

    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(usernameOriginal)) {
        alert('El usuario debe tener entre 3 y 30 caracteres y solo puede usar letras, números, punto, guion o guion bajo.')
        return
    }

    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.')
        return
    }

    const username = usernameOriginal.toLowerCase()
    const emailInterno = `${username}@electroparts.local`

    if (esRegistro) {
        const { data, error } = await supabase.auth.signUp({
            email: emailInterno,
            password,
            options: {
                data: { nombre_usuario: usernameOriginal }
            }
        })

        if (error) {
            alert('Error en el registro: ' + error.message)
            return
        }

        if (!data.session) {
            alert('La cuenta se creó, pero Supabase está solicitando confirmación por correo. Desactiva "Confirm email" en Authentication > Providers > Email para usar solo usuario y contraseña.')
        } else {
            alert('¡Cuenta creada con éxito!')
        }
        window.alternarModo()
    } else {
        const { error } = await supabase.auth.signInWithPassword({
            email: emailInterno,
            password
        })

        if (error) {
            alert('Usuario o contraseña incorrectos.')
            return
        }
        
        alert('¡Bienvenido de nuevo, ' + usernameOriginal + '!')
        verificarSesion()
    }
}

async function verificarSesion() {
    const { data: { session } } = await supabase.auth.getSession()
    const authSection = document.getElementById('auth-section')
    const userInfo = document.getElementById('user-info')
    const saludoUsuario = document.getElementById('saludo-usuario')

    if (session) {
        authSection.style.display = 'none'
        userInfo.style.display = 'block'
        
        const nombreUsuario = session.user.user_metadata?.nombre_usuario || session.user.email.split('@')[0]
        saludoUsuario.textContent = `Hola, ${nombreUsuario}`
    } else {
        authSection.style.display = 'flex'
        userInfo.style.display = 'none'
    }
}

window.cerrarSesion = async function() {
    await supabase.auth.signOut()
    alert('Sesión cerrada.')
    verificarSesion()
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
verificarSesion()