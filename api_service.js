// Define o endereço oficial da API do Rick and Morty (
const URL_BASE = 'https://rickandmortyapi.com/api/character';

// Função assíncrona que vai buscar os personagens na internet
export async function buscar_personagens() {
  // O 'fetch' faz a requisição web para a URL_BASE. O 'await' espera o servidor responder.
  const resposta = await fetch(URL_BASE);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar personagens: ' + resposta.status);
  }

  // Se deu tudo certo, converte a resposta recebida de texto cru para um objeto/JSON em JavaScript
  const dados = await resposta.json();
  
  // A API do Rick and Morty retorna um objeto estruturado 
  return dados.results; 
}
