export function renderPlantList(plants) {
  const container = document.getElementById('plantsContainer');
  if (!container) return;

  container.innerHTML = '';

  if (plants.length === 0) {
    container.innerHTML = '<p>Nenhuma planta encontrada.</p>';
    return;
  }

  plants.forEach((plant) => {
    const card = document.createElement('article');
    card.className = 'plant-card';
    card.innerHTML = `
      <h3>${plant.nomeComum}</h3>
      <p><em>${plant.nomeCientifico}</em></p>
      <p><strong>Tipo:</strong> ${plant.tipo}</p>
      <p><strong>Rega:</strong> ${plant.rega}</p>
      <p><strong>Luz:</strong> ${plant.luz}</p>
    `;
    container.appendChild(card);
  });
}