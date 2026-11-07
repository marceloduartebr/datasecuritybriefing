const POR_TIPO = {
  noticia: 'Nova Notícia',
  incidente: 'Novo Incidente',
  vulnerabilidades: 'Nova Vulnerabilidade',
};

export function tituloPush(tipo) {
  return (tipo && POR_TIPO[tipo]) || 'Novo briefing no DSB';
}

export function payloadPush(item) {
  return {
    titulo: tituloPush(item.tipo),
    texto: item.titulo,
    url: item.url,
    tag: item.slug,
  };
}
