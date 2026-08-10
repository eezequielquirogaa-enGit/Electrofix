// Teléfono de contacto de la empresa
const TELEFONO_WHATSAPP = "5491122334455";

// SERVICIOS TÉCNICOS
const SERVICIOS_DATA = [
  {
    id: "s1",
    titulo: "Diagnóstico y Reparación",
    descripcion: "Revisión completa de placa, motor, bomba y rodamientos a domicilio.",
    icono: "wrench"
  },
  {
    id: "s2",
    titulo: "Mantenimiento Preventivo",
    descripcion: "Limpieza interna, cambio de mangueras y ajuste general de componentes.",
    icono: "shield-check"
  },
  {
    id: "s3",
    titulo: "Reparación de Placas Electrónicas",
    descripcion: "Reparación a nivel componente para placas principales de todas las marcas.",
    icono: "cpu"
  }
];

// PRODUCTOS: LAVARROPAS Y REPUESTOS (NUEVOS Y USADOS)
const PRODUCTOS_DATA = [
  {
    id: "p1",
    nombre: "Lavarropas Automático 7kg",
    categoria: "lavarropas",
    estado: "usado", // "nuevo" o "usado"
    precio: 280000,
    descripcion: "Restaurado a nuevo. Carga frontal, 1000 RPM, excelente estado general y 6 meses de garantía.",
    imagen: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcS9sZu1HeOovRehAD9dPcy1bDM-yKO7P4SGomGc3vMHqrJkqo7jA0nz8lVTWTN5ytXQjvAOUzNr2Q-bu2g"
  },
  {
    id: "p2",
    nombre: "Bomba de Desagüe Universal",
    categoria: "repuesto",
    estado: "nuevo",
    precio: 18500,
    descripcion: "Compatible con la mayoría de marcas (Drean, Whirlpool, LG). Alta durabilidad.",
    imagen: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRkjZGhp7fItoOG_L-S6vNKeQ1hdt00NHv9xCZSrE_a41Url4eKnNgWZBswTuFVgJos27QBWF96KNFI0wc"
  },
  {
    id: "p3",
    nombre: "Plaqueta Electrónica Universal",
    categoria: "repuesto",
    estado: "nuevo",
    precio: 42000,
    descripcion: "Plaqueta de reemplazo programable para lavarropas de carga superior y frontal.",
    imagen: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQzIpD6hGJL1MbFswSXCRxelT4zkDaT3QXUeN__nK5CPO7i6iXTk20Jc6ns2wgmuuIPvFJcpsfpTmsvF5I"
  },
  {
    id: "p4",
    nombre: "Correa de Transmisión 5V",
    categoria: "repuesto",
    estado: "nuevo",
    precio: 9500,
    descripcion: "Correa elástica original para motor de lavarropas de diversas marcas.",
    imagen: "https://www.serviceitalia.com.ar/images/uploads/ecommerce/1487_00.png"
  }
];