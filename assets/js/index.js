document.addEventListener('DOMContentLoaded', function(event) {
  handleOnSearchSubmit();
});

class Pokemon {
  constructor(args) {
    this.name = args.name;
    this.stats = this.formatStatsArray(args.stats);
  }

  formatStatsArray(stats) {
    return stats.map(stat => ({
      name: stat.stat.name,
      baseStat: stat.base_stat,
    }));
  }
}

Pokemon.prototype.formatHtml = function() {
  return `<div class="span-col-2">${this.name}</div>
          <div>picture</div>
          <div>profile</div>
          <div>type</div>
          <div>stats</div>
          <div class="span-col-2">description</div>`;
};

function handleOnSearchSubmit() {
  const submitButton = document.getElementById('search-button');

  submitButton.addEventListener('click', function() {
    const inputValue = document.getElementById('search-input').value;

    fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}/`)
      .then(res => res.json())
      .then(data => {
        const pokemon = new Pokemon(data);
        const formatedHtml = pokemon.formatHtml();

        document.getElementsByClassName('grid')[0].innerHTML = formatedHtml;
      });
  });
}
