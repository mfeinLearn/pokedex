document.addEventListener('DOMContentLoaded', function(e) {
  handleOnSearchSubmit()
})

class Pokemon {
  constructor(pokemonData) {
    this.pokedexId = pokemonData.id
    this.name = pokemonData.name
    this.height = pokemonData.height
    this.weight = pokemonData.weight
  }

  captaizeName() {

  }
}


function handleOnSearchSubmit() {
  const form = document.getElementById('pokemon-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    let pokemonName = e.target['search-input'].value.toLowerCase();

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)
    .then(res => res.json())
    .then(pokemonData => {
      const newPokemon = new Pokemon(pokemonData)
      let profileDiv = document.getElementById('profile')
      let headerDiv = document.getElementById('header')
      profileDiv.innerHTML = `
        <h2>PROFILE</h2>
        <ul>
          <li>Height: ${newPokemon.height}</li>
          <li>Weight: ${newPokemon.weight}</li>
        </ul>
      `

      headerDiv.innerHTML = `
        <h1>${newPokemon.capitalizeName()} - #${newPokemon.pokedexId}</h1>
      `
    })

    // console.log('@@event', )
  })
}