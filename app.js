import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://iufsuoyvkvlynvjtmhrn.supabase.co/rest/v1/'
const supabaseKey = 'sb_publishable_taknOjxD4zmLoc9pX-9bhQ_GULCKb_U'
const supabase = createClient(supabaseUrl, supabaseKey)

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
        <img src="${producto.imagen_url || 'https://via.placeholder.com/150'}" alt="${producto.nombre}" />
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
    `

    contenedor.appendChild(tarjeta)
})
}

cargarProductos()