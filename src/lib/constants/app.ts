export const APP_NAME = "Hotel de Alfombras Superclim";

export const APP_MODULES = [
  {
    title: "Clientes",
    description: "Alta, consulta y seguimiento de clientes.",
    status: "Disponible",
    href: "/clients",
  },
  {
    title: "Alfombras",
    description: "Registro operativo de piezas y estado actual.",
    status: "Disponible",
    href: "/rugs",
  },
  {
    title: "Ubicaciones",
    description: "Mapa logico del almacen y control de ocupacion.",
    status: "Disponible",
    href: "/locations",
  },
  {
    title: "Movimientos",
    description: "Trazabilidad de entradas, traslados y salidas.",
    status: "Pendiente",
    href: "/",
  },
  {
    title: "Precios",
    description: "Reglas configurables para calculo operativo.",
    status: "Disponible",
    href: "/pricing",
  },
  {
    title: "Recordatorios",
    description: "Agenda futura de recogidas y seguimiento.",
    status: "Pendiente",
    href: "/",
  },
] as const;

export const APP_NAV_ITEMS = [
  {
    label: "Resumen",
    href: "/",
  },
  {
    label: "Clientes",
    href: "/clients",
  },
  {
    label: "Alfombras",
    href: "/rugs",
  },
  {
    label: "Ubicaciones",
    href: "/locations",
  },
  {
    label: "Movimientos",
    href: "/",
  },
  {
    label: "Precios",
    href: "/pricing",
  },
] as const;
