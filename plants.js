import { fetchPlants, getPlantImagePath } from './modules/api.js';

const plantsContainer = document.querySelector('#plants-container');
const plantsFeedback = document.querySelector('#plants-feedback');
const plantSearch = document.querySelector('#plant-search');
let plants = [];

function renderPlants(searchTerm = '') {
    const query = searchTerm.trim().toLocaleLowerCase('pt-PT');
    const filteredPlants = plants.filter((plant) => {
        const searchableText = [
            plant.nomeComum,
            plant.nomeCientifico,
            plant.tipo
        ].join(' ').toLocaleLowerCase('pt-PT');

        return searchableText.includes(query);
    });

    plantsContainer.replaceChildren();

    if (filteredPlants.length === 0) {
        plantsFeedback.textContent = query
            ? 'Não foram encontradas plantas para essa pesquisa.'
            : 'Ainda não existem plantas para mostrar.';
        return;
    }

    plantsFeedback.textContent = `${filteredPlants.length} ${
        filteredPlants.length === 1 ? 'planta encontrada' : 'plantas encontradas'
    }.`;

    filteredPlants.forEach((plant) => {
        const card = document.createElement('article');
        card.className = 'catalog-card';

        const imageWrap = document.createElement('div');
        imageWrap.className = 'catalog-card-image';
        const image = document.createElement('img');
        image.src = getPlantImagePath(plant);
        image.alt = plant.nomeComum;
        imageWrap.append(image);

        const details = document.createElement('div');
        const title = document.createElement('h2');
        title.textContent = plant.nomeComum;
        const scientificName = document.createElement('p');
        scientificName.textContent = `${plant.nomeCientifico} — ${plant.tipo}`;
        details.append(title, scientificName);

        const favorite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        favorite.setAttribute('viewBox', '0 0 24 24');
        favorite.classList.add('favorite-icon');
        favorite.innerHTML = '<path d="M12 21C7 18 4 14 4 9c5 0 8 3 8 8Zm0-4c0-5 3-8 8-8 0 5-3 9-8 9Z"/>';

        card.append(imageWrap, details, favorite);
        plantsContainer.append(card);
    });
}

plantSearch.addEventListener('input', () => {
    renderPlants(plantSearch.value);
});

try {
    plants = await fetchPlants();
    renderPlants(plantSearch.value);
} catch (error) {
    plantsFeedback.textContent = 'Não foi possível carregar as plantas. Tenta novamente mais tarde.';
    console.error('[VerdeVivo] Falha ao carregar plantas:', error);
} finally {
    plantsContainer.setAttribute('aria-busy', 'false');
}
