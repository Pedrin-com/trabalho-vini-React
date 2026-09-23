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
  const [personagens, set_personagens] = useState([]);
  const [carregando, set_carregando] = useState(true);
  const [atualizando, set_atualizando] = useState(false);
  const [erro, set_erro] = useState(null);
  const [selecionado, set_selecionado] = useState(null);
  const [texto_pesquisa, set_texto_pesquisa] = useState('');
  const [filtro_status, set_filtro_status] = useState('Todos');
  const [ordem, set_ordem] = useState(null);

  // Requisito 2: a consulta à API fica isolada nesta função.
  async function carregar_dados() {
    try {
      set_erro(null);
      set_carregando(true);
      const resultado = await buscar_personagens();
      set_personagens(resultado);
    } catch (erro_capturado) {
      set_erro('Não foi possível carregar os personagens.');
    } finally {
      set_carregando(false);
    }
  }

  // Requisito 1: carregamento automático ao abrir o app.
  useEffect(() => {
    carregar_dados();
  }, []);

  // Funcionalidade extra (Parte 12): puxar para atualizar a lista.
  async function ao_atualizar() {
    set_atualizando(true);
    await carregar_dados();
    set_atualizando(false);
  }

  function obter_lista_filtrada() {
    let lista = [...personagens]; // cópia, para não alterar o estado original com sort()

    if (texto_pesquisa.trim() !== '') {
      lista = lista.filter((item) =>
        item.name.toLowerCase().includes(texto_pesquisa.toLowerCase())
      );
    }

    if (filtro_status !== 'Todos') {
      lista = lista.filter((item) => item.status === filtro_status);
    }

    if (ordem === 'az') {
      lista.sort((a, b) => a.name.localeCompare(b.name));
    } else if (ordem === 'za') {
      lista.sort((a, b) => b.name.localeCompare(a.name));
    }

    return lista;
  }

  const lista_filtrada = obter_lista_filtrada();

  function extrair_chave(item) {
    return String(item.id);
  }

  function renderizar_item({ item }) {
    return <PersonagemCard personagem={item} ao_selecionar={set_selecionado} />;
  }

  return (
    <SafeAreaView style={estilos.container}>
      <Text style={estilos.titulo_app}>Personagens Rick and Morty</Text>

      <TextInput
        style={estilos.campo_busca}
        placeholder="Pesquisar por nome..."
        value={texto_pesquisa}
        onChangeText={set_texto_pesquisa}
      />

      <View style={estilos.linha_filtros}>
        {['Todos', 'Alive', 'Dead', 'unknown'].map((opcao) => (
          <TouchableOpacity
            key={opcao}
            style={[
              estilos.botao_filtro,
              filtro_status === opcao && estilos.botao_filtro_ativo,
            ]}
            onPress={() => set_filtro_status(opcao)}
          >
            <Text style={estilos.texto_botao}>{opcao}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={estilos.linha_filtros}>
        <TouchableOpacity style={estilos.botao_ordem} onPress={() => set_ordem('az')}>
          <Text style={estilos.texto_botao}>A → Z</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botao_ordem} onPress={() => set_ordem('za')}>
          <Text style={estilos.texto_botao}>Z → A</Text>
        </TouchableOpacity>
      </View>

      <Text style={estilos.contador}>
        Resultados encontrados: {lista_filtrada.length}
      </Text>

      {carregando && <ActivityIndicator size="large" color="#333" />}

      {erro && <Text style={estilos.mensagem_erro}>{erro}</Text>}

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
