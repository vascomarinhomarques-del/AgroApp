import { fetchPlants } from './modules/api.js';

const careContainer = document.querySelector('#care-plants-container');
const careFeedback = document.querySelector('#care-feedback');

function createCareItem(label, value) {
    const item = document.createElement('p');
    const heading = document.createElement('strong');
    heading.textContent = label;
    item.append(heading, document.createTextNode(value));
    return item;
}

function renderPlantCare(plants) {
    careContainer.replaceChildren();

    if (plants.length === 0) {
        careFeedback.textContent = 'Ainda não existem cuidados para mostrar.';
        return;
    }

    careFeedback.textContent = `${plants.length} ${
        plants.length === 1 ? 'planta na coleção' : 'plantas na coleção'
    }.`;

    plants.forEach((plant) => {
        const card = document.createElement('article');
        card.className = 'care-plant-card';

        const title = document.createElement('h3');
        title.textContent = plant.nomeComum;

        const scientificName = document.createElement('p');
        scientificName.className = 'plant-scientific-name';
        scientificName.textContent = plant.nomeCientifico;

        const details = document.createElement('div');
        details.className = 'plant-care';
        details.append(
            createCareItem('Rega', plant.rega),
            createCareItem('Luz', plant.luz)
        );

        card.append(title, scientificName, details);
        careContainer.append(card);
    });
}

try {
    const plants = await fetchPlants();
    renderPlantCare(plants);
} catch (error) {
    careFeedback.textContent = 'Não foi possível carregar os cuidados. Tenta novamente mais tarde.';
    console.error('[VerdeVivo] Falha ao carregar cuidados das plantas:', error);
} finally {
    careContainer.setAttribute('aria-busy', 'false');
}
