document.addEventListener('DOMContentLoaded', function(event) {
  handleOnSearchSubmit();
});

// flavor_text_entries(en), genera(en)
class Pokemon {
  constructor(pokemonData, pokemonSpeciesData) {
    this.name = pokemonData.name;
    this.stats = Pokemon.formatStatsArray(pokemonData.stats);
    this.height = pokemonData.height;
    this.species = pokemonData.species.name;
    this.weight = pokemonData.weight;
    this.abilities = Pokemon.formatAbilities(pokemonData.abilities);
    this.types = Pokemon.formatTypes(pokemonData.types);
    this.sprites = [
      pokemonData.sprites.front_default,
      pokemonData.sprites.front_female,
    ];
    this.evolvesFrom = pokemonSpeciesData.evolves_from_species
      ? pokemonSpeciesData.evolves_from_species.name
      : 'n/a';
    this.color = pokemonSpeciesData.color.name;
    this.description = Pokemon.findEnglishDescription(
      pokemonSpeciesData.flavor_text_entries
    );
    this.genus = pokemonSpeciesData.genera[2].genus;
  }

  static formatStatsArray(stats) {
    return stats.map(stat => ({
      name: stat.stat.name,
      baseStat: stat.base_stat,
    }));
  }

  static formatAbilities(abilities) {
    return abilities.map(({ ability }) => ability.name);
  }

  static formatTypes(types) {
    return types.map(({ type }) => type.name);
  }

  static findEnglishDescription(flavorText) {
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
            <div>
              <img src=${this.sprites[0]} id="pokemon-sprite"/>
              <button id="male-image-button" type="button">Male</button>
              <button id="female-image-button" type="button">Female</button>
            </div>
          </div>
          <div>
            <h2>PROFILE</h2>
            <ul>
              <li>Species: ${this.species}</li>
              <li>Color: ${this.color}</li>
              <li>Height: ${this.height}</li>
              <li>Weight: ${this.weight}</li>
              <li>Genera: ${this.genus}</li>
              <li>Evolves From: ${this.evolvesFrom}</li>
              <li>Abilities: ${this.abilities}</li>
            </ul>
          </div>
          <div>
            <h2>TYPE</h2>
            <ul>
            ${this.types.map(type => `<li> ${type} </li>`).join(' ')}
            </ul>
          </div>
          <div>
            <h2>STATS</h2>
            <ul>
              ${this.stats
                .map(stat => `<li> ${stat.name}:${stat.baseStat} </li>`)
                .join(' ')}
            </ul>
          </div>
          <div class="span-col-2">
            <h2>DESCRIPTION</h2>
            <p>${this.description}</p>
          </div>
  `;
};

function handleOnSearchSubmit() {
  const submitButton = document.getElementById('search-button');
  const synth = window.speechSynthesis;
  const ukEnglishFemale = synth
    .getVoices()
    .find(voice => voice.voiceURI === 'Google UK English Female');

  submitButton.addEventListener('click', async function() {
    const shouldVoiceReadDescription = document.getElementById('text-to-voice')
      .checked;

    const inputValue = document
      .getElementById('search-input')
      .value.toLowerCase();

    const pokemonData = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${inputValue}/`
    ).then(res => res.json());

    const pokemonSpeciesData = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${inputValue}/`
    ).then(res => res.json());

    const pokemon = new Pokemon(pokemonData, pokemonSpeciesData);

    const formatedHtml = pokemon.formatHtml();
    document.getElementsByClassName('grid')[0].innerHTML = formatedHtml;

    if (shouldVoiceReadDescription) {
      const utterThis = new SpeechSynthesisUtterance(
        `${pokemon.name} a ${pokemon.types} type pokemon, ${
          pokemon.description
        }`
      );
      utterThis.voice = ukEnglishFemale;
      synth.speak(utterThis);
    }

    document
      .getElementById('female-image-button')
      .addEventListener('click', function(event) {
        if (pokemon.sprites[1] === null) return;

        document.getElementById('pokemon-sprite').src = `${pokemon.sprites[1]}`;
      });

    document
      .getElementById('male-image-button')
      .addEventListener('click', function(event) {
        document.getElementById('pokemon-sprite').src = `${pokemon.sprites[0]}`;
      });
  });
}
