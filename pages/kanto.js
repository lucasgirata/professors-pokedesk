let pokemons = [];

const searchBar = document.getElementById("search-bar");
const selectTipo = document.getElementById("type-selection");
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
  const resposta = await fetch("../data/kanto.json");
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
  const nomeBusca = normalizarTipo(searchBar.value.trim());
  const tipoSelecionado = selectTipo.value;
  const inicialSelecionado = checkboxInicial.checked;
  const lendarioSelecionado = checkboxLendario.checked;

  const filtrados = pokemons.filter((pokemon) => {
    const nome =
      nomeBusca === "" || normalizarTipo(pokemon.nome).includes(nomeBusca);

    const type =
      tipoSelecionado === "" ||
      pokemon.tipos.some((tipo) => normalizarTipo(tipo) === tipoSelecionado);

    const starter = !inicialSelecionado || pokemon.inicial;
    const legendary = !lendarioSelecionado || pokemon.lendario;

    return nome && type && starter && legendary;
  });

  mostrarPokemons(filtrados);
}

searchBar.addEventListener("input", filterPokemon);
selectTipo.addEventListener("change", filterPokemon);
checkboxInicial.addEventListener("change", filterPokemon);
checkboxLendario.addEventListener("change", filterPokemon);

carregarPokemons();
