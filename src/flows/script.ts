export const introQuickReplies = [
  { title: 'Catálogo', payload: 'CATALOGO' },
  { title: 'Precios', payload: 'PRECIOS' },
  { title: 'Personalizaciones', payload: 'PERSONALIZACIONES' },
  { title: 'Envíos', payload: 'ENVIOS' },
  { title: 'Disponibilidad', payload: 'DISPONIBILIDAD' },
  { title: 'Cómo comprar', payload: 'COMO_COMPRAR' },
  { title: 'Hablar con persona', payload: 'HUMANO' }
];

export const cannedReplies: Record<string, string> = {
  CATALOGO: 'Tenemos biblias Reina Valera, NTV, NVI y ediciones premium. ¿Buscas tamaño compacto, mediano o de estudio?',
  PRECIOS: 'Las biblias personalizadas van desde $45 a $120 USD según edición y acabado. ¿Tienes un presupuesto aproximado?',
  PERSONALIZACIONES: 'Personalizamos con grabado láser, foil dorado/plata, iniciales, nombre completo y dedicatorias. ¿Qué nombre quieres poner?',
  ENVIOS: 'Enviamos a todo el país por paquetería asegurada. Entrega estimada: 3-5 días hábiles. ¿A qué ciudad envíamos?',
  DISPONIBILIDAD: 'Reposición semanal. Tenemos stock limitado de piel color camel, negro y rosa. ¿Cuál te gusta?',
  COMO_COMPRAR: '1) Elige modelo. 2) Define personalización. 3) Pagas por transferencia o tarjeta. 4) Producimos y enviamos. ¿Te ayudo a elegir modelo?',
  HUMANO: '¡Listo! Te paso con una persona del equipo para continuar. 🤝'
};
