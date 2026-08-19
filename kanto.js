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
  const pokemons = await resposta.json();

  const lista = document.getElementById("pokemon-list");

  pokemons.forEach((pokemon) => {
    lista.insertAdjacentHTML("beforeend", cardPokemon(pokemon));
  });
}

carregarPokemons();
