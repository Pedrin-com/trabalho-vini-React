// components/painel_detalhes.js
// Painel exibido apenas quando existe um personagem selecionado
// (renderização condicional com "return null").

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function PainelDetalhes({ personagem }) {
  if (!personagem) {
    return null;
  }

  return (
    <View style={estilos.painel}>
      <Image source={{ uri: personagem.image }} style={estilos.imagem} />
      <Text style={estilos.titulo}>{personagem.name}</Text>
      <Text style={estilos.linha}>Status: {personagem.status}</Text>
      <Text style={estilos.linha}>Espécie: {personagem.species}</Text>
      <Text style={estilos.linha}>Gênero: {personagem.gender}</Text>
      <Text style={estilos.linha}>Origem: {personagem.origin?.name}</Text>
      <Text style={estilos.linha}>Localização: {personagem.location?.name}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  painel: {
    backgroundColor: '#e9ecff',
    margin: 12,
    padding: 12,
    borderRadius: 8,
  },
  imagem: { width: 80, height: 80, borderRadius: 40, alignSelf: 'center', marginBottom: 8 },
  titulo: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  linha: { fontSize: 14, marginBottom: 2 },
});
