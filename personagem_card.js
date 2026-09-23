// components/personagem_card.js
// Card exibido em cada item da FlatList.

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function PersonagemCard({ personagem, ao_selecionar }) {
  return (
    <TouchableOpacity style={estilos.card} onPress={() => ao_selecionar(personagem)}>
      <Image source={{ uri: personagem.image }} style={estilos.imagem} />
      <View style={estilos.info}>
        <Text style={estilos.nome}>{personagem.name}</Text>
        <Text style={estilos.detalhe}>Status: {personagem.status}</Text>
        <Text style={estilos.detalhe}>Espécie: {personagem.species}</Text>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 2,
    alignItems: 'center',
  },
  imagem: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  info: { flex: 1 },
  nome: { fontSize: 16, fontWeight: 'bold' },
  detalhe: { fontSize: 13, color: '#555' },
});
