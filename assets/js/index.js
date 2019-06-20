document.addEventListener('DOMContentLoaded', function(event) {
  handleOnSearchSubmit();
});

// flavor_text_entries(en), genera(en)
class Pokemon {
  constructor(pokemonData, pokemonSpeciesData) {
    this.name = pokemonData.name;
    this.stats = this.formatStatsArray(pokemonData.stats);
    this.height = pokemonData.height;
    this.species = pokemonData.species.name;
    this.weight = pokemonData.weight;
    this.abilities = this.formatAbilities(pokemonData.abilities);
    this.types = this.formatTypes(pokemonData.types);
    this.sprites = pokemonData.sprites;
    this.evolvesFrom = pokemonSpeciesData.evolves_from_species
      ? pokemonSpeciesData.evolves_from_species.name
      : '';
    this.color = pokemonSpeciesData.color.name;
    this.description = this.findEnglishDescription(
      pokemonSpeciesData.flavor_text_entries
    );
    this.genus = pokemonSpeciesData.genera[2].genus;
  }

  formatStatsArray(stats) {
    return stats.map(stat => ({
      name: stat.stat.name,
      baseStat: stat.base_stat,
    }));
  }

  formatAbilities(abilities) {
    return abilities.map(({ ability }) => ability.name);
  }

  formatTypes(types) {
    return types.map(({ type }) => type.name);
  }

  findEnglishDescription(flavorText) {
    return flavorText.filter(textObject => textObject.language.name === 'en')[0]
      .flavor_text;
  }
}

Pokemon.prototype.formatHtml = function() {
  return `<div class="span-col-2">
            <h1>${this.name.toUpperCase()}</h1>
          </div>
          <div>
            <h2>PICTURE</h2>
          </div>
          <div>
            <h2>PROFILE</h2>
          </div>
          <div>TYPE</div>
          <div>STATS</div>
          <div class="span-col-2">
            <h2>DESCRIPTION</h2>
            <p></p>
          </div>
  `;
};

function handleOnSearchSubmit() {
  const submitButton = document.getElementById('search-button');

  submitButton.addEventListener('click', async function() {
    const inputValue = document.getElementById('search-input').value;

    const pokemonData = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${inputValue}/`
    ).then(res => res.json());

    const pokemonSpeciesData = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${inputValue}/`
    ).then(res => res.json());

    const pokemon = new Pokemon(pokemonData, pokemonSpeciesData);
    const formatedHtml = pokemon.formatHtml();
    document.getElementsByClassName('grid')[0].innerHTML = formatedHtml;
  });
}
