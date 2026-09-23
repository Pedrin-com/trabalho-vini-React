// services/api_service.js
// Função responsável apenas por consultar a API.
// Mantemos a consulta separada da interface (Requisito 2 da atividade).

const URL_BASE = 'https://rickandmortyapi.com/api/character';

export async function buscar_personagens() {
  const resposta = await fetch(URL_BASE);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar personagens: ' + resposta.status);
  }

  const dados = await resposta.json();
  return dados.results; // a API devolve { info: {...}, results: [...] }
}
