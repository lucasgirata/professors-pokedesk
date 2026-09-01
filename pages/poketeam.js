const API_URL = "http://localhost:3001/team";

let pokemons = [];
let currentTeam = { slots: [null, null, null, null, null, null] };

const searchBar = document.querySelector('input[name="search-bar"]');
const searchResult = document.getElementById("search-result");
const slots = document.querySelectorAll(".pokemon");
const statusText = document.querySelector(".section3 h3");

async function carregarDados() {
  try {
    const [johto, hoenn, kanto, time] = await Promise.all([
      fetch("../data/johto.json").then((r) => r.json()),
      fetch("../data/hoenn.json").then((r) => r.json()),
      fetch("../data/kanto.json").then((r) => r.json()),
      fetch(API_URL).then((r) => r.json()),
    ]);

    pokemons = [...kanto, ...johto, ...hoenn];
    currentTeam = time;

    renderizarTimeSalvo();
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

function renderizarTimeSalvo() {
  slots.forEach((slot, index) => {
    const pokemonId = currentTeam.slots[index];

    if (pokemonId) {
      const pokemon = pokemons.find((p) => p.id == pokemonId);
      if (pokemon) preencherSlot(slot, pokemon, false); // false = não salva de novo
    }
  });

  atualizarStatus();
}

async function salvarTime() {
  try {
    await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentTeam),
    });
  } catch (erro) {
    console.error("Erro ao salvar time:", erro);
  }
}

function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function cardPokemon(pokemon) {
  const tipos = pokemon.tipos
    .map((tipo) => `<span class="tipo ${tipo.toLowerCase()}">${tipo}</span>`)
    .join("");

  return `
    <div class="pokemon-card" draggable="true" data-id="${pokemon.id}">
      <img src="${pokemon.imagem}" alt="${pokemon.nome}">
      <h3>${pokemon.nome}</h3>
      <p>#${pokemon.id}</p>
      <div class="tipos">${tipos}</div>
    </div>
  `;
}

function mostrarResultados(lista) {
  searchResult.innerHTML = "";
  lista.forEach((pokemon) => {
    searchResult.insertAdjacentHTML("beforeend", cardPokemon(pokemon));
  });
  dragConfig();
}

function filtrarPokemon() {
  const busca = normalizarTexto(searchBar.value.trim());

  if (busca === "") {
    searchResult.innerHTML = "";
    return;
  }

  const filtrados = pokemons.filter((pokemon) =>
    normalizarTexto(pokemon.nome).includes(busca),
  );

  mostrarResultados(filtrados);
}

function dragConfig() {
  const cards = document.querySelectorAll(".pokemon-card");
  cards.forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("pokemon-id", card.dataset.id);
    });
  });
}

function configurarSlots() {
  slots.forEach((slot) => {
    slot.addEventListener("dragover", (event) => {
      event.preventDefault();
      slot.classList.add("drag-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("drag-over");
    });

    slot.addEventListener("drop", (event) => {
      event.preventDefault();
      slot.classList.remove("drag-over");

      const pokemonId = event.dataTransfer.getData("pokemon-id");
      const pokemon = pokemons.find((p) => p.id == pokemonId);

      if (pokemon) preencherSlot(slot, pokemon, true);
    });

    const removeBtn = slot.querySelector("button");
    removeBtn.addEventListener("click", () => removerPokemon(slot));
  });
}

function preencherSlot(slot, pokemon, salvar) {
  const index = Number(slot.dataset.slot);

  slot.innerHTML = `
    <img src="${pokemon.imagem}" alt="${pokemon.nome}">
    <p>${pokemon.nome}</p>
    <button>Remover</button>
  `;

  slot.dataset.filled = "true";
  slot
    .querySelector("button")
    .addEventListener("click", () => removerPokemon(slot));

  currentTeam.slots[index] = pokemon.id;

  if (salvar) salvarTime();
  atualizarStatus();
}

function removerPokemon(slot) {
  const index = Number(slot.dataset.slot);

  slot.innerHTML = `
    <img src="../imgs/index/open-pokeball.png" alt="Pokeball">
    <button>Remover</button>
  `;

  slot.dataset.filled = "false";
  slot
    .querySelector("button")
    .addEventListener("click", () => removerPokemon(slot));

  currentTeam.slots[index] = null;

  salvarTime();
  atualizarStatus();
}

function atualizarStatus() {
  const preenchidos = currentTeam.slots.filter((s) => s !== null).length;
  statusText.textContent = `Status da Equipe: ${preenchidos}/6 Pokémon`;
}

searchBar.addEventListener("input", filtrarPokemon);

carregarDados();
configurarSlots();

//npx json-server --watch db.json --port 3001
