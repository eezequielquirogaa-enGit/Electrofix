// URL base de la API REST de ElectroFix
const API_URL = "http://api_electrofix.localhost";

// Protección de ruta: si no hay token, redirigir al login
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

/**
 * Función asíncrona genérica para peticiones HTTP con token JWT
 */
async function apiCall(url, metodo, data = null) {
  const token = localStorage.getItem("token");

  const options = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  };

  if (data && metodo !== "GET") {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    // Intercepción 401: token expirado o inválido
    if (response.status === 401) {
      alert("Su sesión ha expirado. Inicie sesión nuevamente.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
      return null;
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error procesando petición");
    }
    return result;
  } catch (error) {
    console.error("Fallo:", error);
    alert(error.message);
    return null;
  }
}

/* ═════════════════════════════════════════════════════
   INICIALIZACIÓN (tema + íconos + carga inicial)
   ═════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeIcon.setAttribute("data-lucide", isDark ? "sun" : "moon");
    lucide.createIcons();
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    themeIcon.setAttribute("data-lucide", "sun");
    lucide.createIcons();
  }

  // Manejador del formulario de alta / edición
  document.getElementById("product-admin-form").addEventListener("submit", guardarProducto);
  document.getElementById("product-admin-form").addEventListener("reset", limpiarFormulario);

  // Carga la lista de productos desde la API
  leerProductos();
});

/* ═════════════════════════════════════════════════════
   LISTADO DE PRODUCTOS
   ═════════════════════════════════════════════════════ */
async function leerProductos() {
  const tbody = document.getElementById("inventory-tbody");
  tbody.innerHTML = "<tr><td colspan='8'><div class='empty-state'>Cargando registros...</div></td></tr>";

  const response = await apiCall(`${API_URL}/productos`, "GET");

  tbody.innerHTML = "";

  if (response && response.status === "success" && Array.isArray(response.data)) {
    response.data.forEach(p => {
      const precio = Number(p.precio).toLocaleString("es-AR");
      const catBadge = p.categoria === "lavarropas" ? "badge-cat-lavarropas" : "badge-cat-repuesto";
      const estBadge = p.estado === "nuevo" ? "badge-estado-nuevo" : "badge-estado-usado";

      tbody.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td><img src="${p.imagen}" alt="${p.nombre}" class="thumb" loading="lazy"></td>
          <td>${p.nombre}</td>
          <td><span class="badge-cat ${catBadge}">${p.categoria}</span></td>
          <td><span class="badge-cat ${estBadge}">${p.estado}</span></td>
          <td>$${precio}</td>
          <td>${p.stock}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="cargarEdicion(${p.id})">
              <i data-lucide="pencil"></i> Editar
            </button>
            <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id})">
              <i data-lucide="trash-2"></i> Eliminar
            </button>
          </td>
        </tr>`;
    });
    lucide.createIcons();
  } else {
    tbody.innerHTML = "<tr><td colspan='8'><div class='empty-state'>No se encontraron productos en la base de datos.</div></td></tr>";
  }
}

/* ═════════════════════════════════════════════════════
   GUARDAR (ALTA o EDICIÓN)
   ═════════════════════════════════════════════════════ */
async function guardarProducto(e) {
  e.preventDefault();

  const id = document.getElementById("product-id").value;
  const payload = {
    nombre: document.getElementById("prod-nombre").value.trim(),
    categoria: document.getElementById("prod-categoria").value,
    estado: document.getElementById("prod-estado").value,
    precio: parseFloat(document.getElementById("prod-precio").value),
    stock: parseInt(document.getElementById("prod-stock").value, 10) || 1,
    imagen: document.getElementById("prod-imagen").value.trim(),
    descripcion: document.getElementById("prod-descripcion").value.trim()
  };

  if (!payload.nombre || !payload.imagen || !payload.descripcion || isNaN(payload.precio)) {
    alert("Por favor complete todos los campos obligatorios");
    return;
  }

  let res;
  if (id) {
    res = await apiCall(`${API_URL}/productos/${id}`, "PUT", payload);
  } else {
    res = await apiCall(`${API_URL}/productos`, "POST", payload);
  }

  if (res && res.status === "success") {
    alert(id ? "Producto actualizado correctamente" : "Producto guardado correctamente");
    limpiarFormulario();
    leerProductos();
  }
}

/* ═════════════════════════════════════════════════════
   EDICIÓN
   ═════════════════════════════════════════════════════ */
async function cargarEdicion(id) {
  const response = await apiCall(`${API_URL}/productos/${id}`, "GET");
  if (!response || response.status !== "success" || !response.data) {
    return;
  }

  const p = response.data;
  document.getElementById("product-id").value = p.id;
  document.getElementById("prod-nombre").value = p.nombre;
  document.getElementById("prod-categoria").value = p.categoria;
  document.getElementById("prod-estado").value = p.estado;
  document.getElementById("prod-precio").value = p.precio;
  document.getElementById("prod-stock").value = p.stock;
  document.getElementById("prod-imagen").value = p.imagen;
  document.getElementById("prod-descripcion").value = p.descripcion;

  document.getElementById("form-title").innerText = "Editar Artículo";
  document.getElementById("form-title-icon").setAttribute("data-lucide", "pencil");
  document.getElementById("btn-guardar").innerHTML = '<i data-lucide="save"></i> Guardar Cambios';
  document.getElementById("btn-cancelar").style.display = "inline-flex";
  lucide.createIcons();
}

/* ═════════════════════════════════════════════════════
   ELIMINACIÓN
   ═════════════════════════════════════════════════════ */
async function eliminarProducto(id) {
  if (!confirm("¿Está seguro de que desea eliminar este producto?")) {
    return;
  }

  const res = await apiCall(`${API_URL}/productos/${id}`, "DELETE");
  if (res && res.status === "success") {
    alert("Producto eliminado correctamente");
    if (document.getElementById("product-id").value == id) {
      limpiarFormulario();
    }
    leerProductos();
  }
}

/* ═════════════════════════════════════════════════════
   LIMPIAR FORMULARIO
   ═════════════════════════════════════════════════════ */
function limpiarFormulario() {
  document.getElementById("product-id").value = "";
  document.getElementById("product-admin-form").reset();

  document.getElementById("form-title").innerText = "Agregar Nuevo Artículo";
  document.getElementById("form-title-icon").setAttribute("data-lucide", "plus-circle");
  document.getElementById("btn-guardar").innerHTML = '<i data-lucide="save"></i> Guardar en BD (API)';
  document.getElementById("btn-cancelar").style.display = "none";
  lucide.createIcons();
}
