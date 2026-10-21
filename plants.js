import { fetchPlants } from './modules/api.js';

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
        card.className = 'plant-list-card';

        const illustration = document.createElement('div');
        illustration.className = 'plant-list-illustration';
        illustration.setAttribute('aria-hidden', 'true');
        illustration.textContent = '🌱';

        const details = document.createElement('div');
        details.className = 'plant-list-details';

        const title = document.createElement('h2');
        title.textContent = plant.nomeComum;

        const scientificName = document.createElement('p');
        scientificName.className = 'plant-scientific-name';
        scientificName.textContent = plant.nomeCientifico;

        const type = document.createElement('p');
        type.className = 'plant-type';
        type.textContent = plant.tipo;

        const care = document.createElement('div');
        care.className = 'plant-care';

        const watering = createCareDetail('Rega', plant.rega);
        const light = createCareDetail('Luz', plant.luz);

        care.append(watering, light);
        details.append(title, scientificName, type, care);
        card.append(illustration, details);
        plantsContainer.append(card);
    });
}

function createCareDetail(label, value) {
    const detail = document.createElement('p');
    const heading = document.createElement('strong');
    heading.textContent = label;
    detail.append(heading, document.createTextNode(value));
    return detail;
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
