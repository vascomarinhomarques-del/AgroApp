// Configuração mock de dados (Pronto para substituir por chamadas Firebase/Firestore)
export async function fetchPlants() {
  return [
    {
      id: "1",
      nomeComum: "Monstera Deliciosa",
      nomeCientifico: "Monstera deliciosa",
      tipo: "Interior / Ornamental",
      rega: "1 a 2 vezes por semana",
      luz: "Luz indireta forte"
    },
    {
      id: "2",
      nomeComum: "Alecrim",
      nomeCientifico: "Salvia rosmarinus",
      tipo: "Exterior / Aromática",
      rega: "Moderada (solo seco)",
      luz: "Sol direto"
    }
  ];
}