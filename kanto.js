let pokemons = [];

const selectTipo = document.getElementById("type-selection");
const buttonFilter = document.querySelector(".section1 button");
const checkboxInicial = document.getElementById("iniciais");
const checkboxLendario = document.getElementById("lendario");

function cardPokemon(pokemon) {
  const tipos = pokemon.tipos
    .map((tipo) => `<span class="tipo ${tipo.toLowerCase()}">${tipo}</span>`)
    .join("");

  return `
    <div class="pokemon-card">
      <img src="${pokemon.imagem}" alt="${pokemon.nome}">
      <h3>${pokemon.nome}</h3>
      <p>#${pokemon.id}</p>

      <div class="tipos">
        ${tipos}
      </div>
    </div>
  `;
}

async function carregarPokemons() {
  const resposta = await fetch("./data/kanto.json");
  pokemons = await resposta.json();

  mostrarPokemons(pokemons);
}

function mostrarPokemons(listaPokemons) {
  const lista = document.getElementById("pokemon-list");

  lista.innerHTML = "";

  listaPokemons.forEach((pokemon) => {
    lista.insertAdjacentHTML("beforeend", cardPokemon(pokemon));
  });
}

function normalizarTipo(tipo) {
  return tipo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function filterPokemon() {
  const tipoSelecionado = selectTipo.value;
  const inicialSelecionado = checkboxInicial.checked;
  const lendarioSelecionado = checkboxLendario.checked;

  const filtrados = pokemons.filter((pokemon) => {
    const type =
      tipoSelecionado === "" ||
      pokemon.tipos.some((tipo) => normalizarTipo(tipo) === tipoSelecionado);

    const starter = !inicialSelecionado || pokemon.inicial;
    const legendary = !lendarioSelecionado || pokemon.lendario;

    return type && starter && legendary;
  });

  mostrarPokemons(filtrados);
}

buttonFilter.addEventListener("click", filterPokemon);

carregarPokemons();
