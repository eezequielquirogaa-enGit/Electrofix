// Teléfono de contacto de la empresa
const TELEFONO_WHATSAPP = "5491122334455";

// URL base de la API REST de ElectroFix
const API_URL = "http://api_electrofix.localhost";

// Almacena los productos traídos desde la base de datos (usado por los filtros)
let PRODUCTOS_DATA = [];

// Inicializa los íconos Lucide solo si el CDN cargó correctamente.
// Evita que un fallo del CDN bloquee la carga de los datos de la API.
function refreshIcons() {
  if (typeof lucide !== "undefined" && typeof lucide.createIcons === "function") {
    lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de iconos Lucide (a prueba de fallos)
  refreshIcons();

  // Referencias al DOM
  const servicesContainer = document.getElementById("services-container");
  const productsContainer = document.getElementById("products-container");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");
  const contactForm = document.getElementById("contact-form");
  const filterBtns = document.querySelectorAll(".filter-btn");

  /* ==========================================
     1. CARGA DINÁMICA DE SERVICIOS DESDE LA API
     ========================================== */
  async function loadServices() {
    try {
      const response = await fetch(`${API_URL}/servicios`);
      const result = await response.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        servicesContainer.innerHTML = result.data.map(service => `
          <div class="card card-content">
            <div style="color: var(--primary-color); margin-bottom: 0.5rem;">
              <i data-lucide="${service.icono}" style="width: 32px; height: 32px;"></i>
            </div>
            <h3 class="card-title">${service.titulo}</h3>
            <p class="card-desc">${service.descripcion}</p>
            <a href="https://wa.me/${TELEFONO_WHATSAPP}?text=Hola!%20Consulta%20por%20servicio%3A%20${encodeURIComponent(service.titulo)}" target="_blank" class="btn btn-outline" style="width: 100%; text-align: center; justify-content: center;">
              Consultar Servicio
            </a>
          </div>
        `).join('');
        refreshIcons();
      } else {
        servicesContainer.innerHTML = `<p style="color: var(--text-muted);">No se pudieron cargar los servicios.</p>`;
      }
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      servicesContainer.innerHTML = `<p style="color: var(--text-muted);">Error de conexión con el servidor de servicios.</p>`;
    }
  }

  /* ==========================================
     2. CARGA DINÁMICA DE PRODUCTOS DESDE LA API
     ========================================== */
  function renderProducts(items) {
    productsContainer.innerHTML = items.map(item => {
      const mensajeWA = encodeURIComponent(`Hola! Estoy interesado en: ${item.nombre} ($${Number(item.precio).toLocaleString('es-AR')}) - Estado: ${item.estado}. ¿Sigue disponible?`);

      return `
        <div class="card">
          <div class="card-img-wrapper">
            <img src="${item.imagen}" alt="${item.nombre}" class="card-img" loading="lazy">
            <span class="badge ${item.estado === 'nuevo' ? 'badge-nuevo' : 'badge-usado'}">${item.estado}</span>
          </div>
          <div class="card-content">
            <h3 class="card-title">${item.nombre}</h3>
            <p class="card-desc">${item.descripcion}</p>
            <div class="card-footer">
              <span class="card-price">$${Number(item.precio).toLocaleString('es-AR')}</span>
              <a href="https://wa.me/${TELEFONO_WHATSAPP}?text=${mensajeWA}" target="_blank" class="btn btn-whatsapp">
                <i data-lucide="shopping-cart"></i> Comprar
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Re-renderizar iconos generados dinámicamente
    refreshIcons();
  }

  async function loadProducts() {
    try {
      const response = await fetch(`${API_URL}/productos`);
      const result = await response.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        PRODUCTOS_DATA = result.data;
        renderProducts(PRODUCTOS_DATA);
      } else {
        productsContainer.innerHTML = `<p style="color: var(--text-muted);">No se pudieron cargar los productos.</p>`;
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      productsContainer.innerHTML = `<p style="color: var(--text-muted);">Error de conexión con el servidor de productos.</p>`;
    }
  }

  /* ==========================================
     3. FILTRADO DE CATÁLOGO
     ========================================== */
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      if (filter === "all") {
        renderProducts(PRODUCTOS_DATA);
      } else {
        const filtered = PRODUCTOS_DATA.filter(p => p.categoria === filter || p.estado === filter);
        renderProducts(filtered);
      }
    });
  });

  /* ==========================================
     4. MODO OSCURO / MODO CLARO
     ========================================== */
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");

    // Cambiar icono
    themeIcon.setAttribute("data-lucide", isDark ? "sun" : "moon");
    refreshIcons();

    // Guardar preferencia local
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Cargar tema guardado
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    themeIcon.setAttribute("data-lucide", "sun");
  }

  /* ==========================================
     5. MENÚ MOBILE RESPONSIVE
     ========================================== */
  mobileToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  /* ==========================================
     6. FORMULARIO CON REDIRECCIÓN A WHATSAPP
     ========================================== */
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const servicio = document.getElementById("servicio").value;
    const mensaje = document.getElementById("mensaje").value;

    const textoArmado = `*Consulta desde la Web*%0A` +
      `*Nombre:* ${nombre}%0A` +
      `*Teléfono:* ${telefono}%0A` +
      `*Tipo:* ${servicio}%0A` +
      `*Mensaje:* ${mensaje}`;

    window.open(`https://wa.me/${TELEFONO_WHATSAPP}?text=${textoArmado}`, "_blank");
  });

  // Carga Inicial desde la API
  loadServices();
  loadProducts();
});
