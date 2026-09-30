// App.js
// Tela principal do aplicativo.

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { buscar_personagens } from './services/api_service';
import PersonagemCard from './components/personagem_card';
import PainelDetalhes from './components/painel_detalhes';

export default function App() {
  // --- DECLARAÇÃO DE ESTADOS (VARIÁVEIS DE CONTROLE DA TELA) ---
  const [personagens, set_personagens] = useState([]); // Guarda a lista original que veio da API
  const [carregando, set_carregando] = useState(true); // Controla se o ícone de "carregando" deve aparecer
  const [atualizando, set_atualizando] = useState(false); // Controla o efeito de "puxar para atualizar" (pull-to-refresh)
  const [erro, set_erro] = useState(null); // Guarda a mensagem de erro caso a API falhe
  const [selecionado, set_selecionado] = useState(null); // Guarda o personagem que o usuário clicou para ver detalhes
  const [texto_pesquisa, set_texto_pesquisa] = useState(''); // O que o usuário digita na barra de busca
  const [filtro_status, set_filtro_status] = useState('Todos'); // O filtro de status selecionado (Alive, Dead, etc.)
  const [ordem, set_ordem] = useState(null); // Define se a lista está ordenada por 'az' ou 'za'

  // Função responsável por buscar os dados na API externa
  async function carregar_dados() {
    try {
      set_erro(null); // Limpa erros anteriores
      set_carregando(true); // Ativa o indicador de carregamento na tela
      const resultado = await buscar_personagens(); // Puxa os dados lá do arquivo de serviço da API
      set_personagens(resultado); // Salva os personagens obtidos no estado
    } catch (erro_capturado) {
      set_erro('Não foi possível carregar os personagens.'); // Se der ruim, define a mensagem de erro
    } finally {
      set_carregando(false); // Desativa o carregamento, independente se deu certo ou errado
    }
  }

  // O useEffect roda automaticamente assim que o aplicativo abre pela primeira vez
  useEffect(() => {
    carregar_dados();
  }, []);

  // Função executada quando o usuário puxa a tela para baixo para atualizar os dados
  async function ao_atualizar() {
    set_atualizando(true);
    await carregar_dados(); // Recarrega os dados da API
    set_atualizando(false);
  }

  // Função inteligente que filtra, pesquisa e ordena os personagens em tempo real
  function obter_lista_filtrada() {
    let lista = [...personagens]; // Cria uma cópia da lista original para não corromper os dados

    // 1. Filtra por texto digitado na barra de pesquisa (ignora maiúsculas/minúsculas)
    if (texto_pesquisa.trim() !== '') {
      lista = lista.filter((item) =>
        item.name.toLowerCase().includes(texto_pesquisa.toLowerCase())
      );
    }

    // 2. Filtra pelo status selecionado (Ex: 'Alive', 'Dead') se não for 'Todos'
    if (filtro_status !== 'Todos') {
      lista = lista.filter((item) => item.status === filtro_status);
    }

    // 3. Ordena alfabeticamente de A a Z ou de Z a A usando o localeCompare
    if (ordem === 'az') {
      lista.sort((a, b) => a.name.localeCompare(b.name));
    } else if (ordem === 'za') {
      lista.sort((a, b) => b.name.localeCompare(a.name));
    }

    return lista; // Retorna a lista pronta para ser exibida
  }

  // Variável que armazena o resultado final já filtrado e ordenado
  const lista_filtrada = obter_lista_filtrada();

  // Função exigida pelo FlatList para transformar o ID de cada item em string única
  function extrair_chave(item) {
    return String(item.id);
  }

  // Função que desenha cada item individualmente na lista usando o componente PersonagemCard
  function renderizar_item({ item }) {
    return <PersonagemCard personagem={item} ao_selecionar={set_selecionado} />;
  }

  return (
    <SafeAreaView style={estilos.container}>
      {/* Título do Aplicativo */}
      <Text style={estilos.titulo_app}>Personagens Rick and Morty</Text>

      {/* Caixa de Texto para Pesquisa por Nome */}
      <TextInput
        style={estilos.campo_busca}
        placeholder="Pesquisar por nome..."
        value={texto_pesquisa}
        onChangeText={set_texto_pesquisa}
      />

      /* Botões de Filtro por Status (Todos, Alive, Dead, unknown) */
      <View style={estilos.linha_filtros}>
        {['Todos', 'Alive', 'Dead', 'unknown'].map((opcao) => (
          <TouchableOpacity
            key={opcao}
            style={[
              estilos.botao_filtro,
              filtro_status === opcao && estilos.botao_filtro_ativo, // Deixa ativo visualmente se selecionado
            ]}
            onPress={() => set_filtro_status(opcao)}
          >
            <Text style={estilos.texto_botao}>{opcao}</Text>
          </TouchableOpacity>
        ))}
      </View>

      /* Botões de Ordenação (A-Z / Z-A) */
      <View style={estilos.linha_filtros}>
        <TouchableOpacity style={estilos.botao_ordem} onPress={() => set_ordem('az')}>
          <Text style={estilos.texto_botao}>A → Z</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botao_ordem} onPress={() => set_ordem('za')}>
          <Text style={estilos.texto_botao}>Z → A</Text>
        </TouchableOpacity>
      </View>

      /* Contador dinâmico mostrando quantos resultados apareceram na tela */
      <Text style={estilos.contador}>
        Resultados encontrados: {lista_filtrada.length}
      </Text>

      /* Exibe o indicador de carregamento rodando na tela se os dados ainda estiverem chegando */
      {carregando && <ActivityIndicator size="large" color="#333" />}

      {/* Exibe mensagem de erro na tela se a requisição falhar */
      {erro && <Text style={estilos.mensagem_erro}>{erro}</Text>}

      {/* Se não estiver carregando e não tiver erro, mostra a lista otimizada (FlatList) */
      {!carregando && !erro && (
        <FlatList
          data={lista_filtrada}
          renderItem={renderizar_item}
          keyExtractor={extrair_chave}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={ao_atualizar} />
          }
        />
      )}

      /* Painel inferior que exibe detalhes caso um personagem seja selecionado */
      <PainelDetalhes personagem={selecionado} />
    </SafeAreaView>
  );
}


const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  titulo_app: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  campo_busca: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  linha_filtros: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  botao_filtro: {
    backgroundColor: '#ddd',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  botao_filtro_ativo: { backgroundColor: '#88a' },
  botao_ordem: {
    backgroundColor: '#ccd',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  texto_botao: { color: '#222', fontWeight: '600' },
  contador: { textAlign: 'center', marginBottom: 6, fontStyle: 'italic' },
  mensagem_erro: { textAlign: 'center', color: 'red', marginTop: 20 },
});
