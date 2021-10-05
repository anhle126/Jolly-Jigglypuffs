const baseURL = 'https://pokeapi.co/api/v2';

let pokemonArray = new Array();

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('projectTitle').style.fontSize = 'x-large';
    let pokemonID = document.getElementById('search').value;
    printInfo(pokemonID);
  }
});

document.addEventListener('click', (c) => {
  buildPokemonArray();
  if (c.target === document.getElementById('MOVES')) {
    let pokemonID = document.getElementById('search').value;
    printMoves(pokemonID);
  } else if (c.target === document.getElementById('LOCATION')) {
    let pokemonID = document.getElementById('search').value;
    printLocation(pokemonID);
  } else if (c.target === document.getElementById('INFO')) {
    let pokemonID = document.getElementById('search').value;
    printInfo(pokemonID);
  } else if (c.target === document.getElementById('EVOLUTION')) {
    let pokemonID = document.getElementById('search').value;
    printEvolution(pokemonID);
  } else if (c.target === document.getElementById('back')) {
    let index = 0;
    let pokemonID = document.getElementById('search').value;

    for (let i = 0; i < pokemonArray.length; i++) {
      if (pokemonArray[i] === pokemonID) {
        index = i;
        break;
      }
    }
    let prevPokemon = pokemonArray[(index - 1) % pokemonArray.length];
    console.log(prevPokemon);
    const newPokemon = pokemonArray[index + 1];
    console.log(newPokemon);
    document.getElementById('search').value = newPokemon;
    printInfo(newPokemon);
  } else if (c.target === document.getElementById('next')) {
    let index = 0;
    let pokemonID = document.getElementById('search').value;

    for (let i = 0; i < pokemonArray.length; i++) {
      if (pokemonArray[i] === pokemonID) {
        index = i;
        break;
      }
    }
    console.log(index);
    let newIndex = index++;
    let nextPokemon = pokemonArray[newIndex % pokemonArray.length];
    console.log(nextPokemon);
    document.getElementById('search').value = nextPokemon;
    printInfo(nextPokemon);
  }
});

async function printInfo(pokemonID) {
  const response = await fetch(baseURL + '/pokemon/' + pokemonID);
  const infoData = await response.json();

  let height = 'height: ' + infoData.height + ' m<br/>';
  let weight = 'weight: ' + infoData.weight + ' lbs<br/>';
  let stats = '';

  for (let i = 0; i < infoData.stats.length; i++) {
    stats +=
      infoData.stats[i].stat.name +
      ': ' +
      infoData.stats[i].base_stat +
      '<br/>';
  }

  document.getElementById('projectTitle').innerHTML =
    'INFO<br/>' + height + weight + stats;
}

async function printMoves(pokemonID) {
  const response = await fetch(baseURL + '/pokemon/' + pokemonID);
  const infoData = await response.json();
  let moves = '';

  for (let i = 0; i < infoData.moves.length; i++) {
    moves += infoData.moves[i].move.name + '<br/>';
  }

  document.getElementById('projectTitle').innerHTML = 'MOVES<br/>' + moves;
}

async function printLocation(pokemonID) {
  const locationData = await fetch(
    baseURL + '/pokemon/' + pokemonID + '/encounters'
  );

  let locationList = '';
  const locations = await locationData.json();

  for (let i = 0; i < locations.length; i++) {
    locationList += locations[i].location_area.name + '<br/>';
  }

  if (locationList === '') {
    locationList = 'CAN NOT BE CAUGHT IN THE WILD<br/>';
  }

  document.getElementById('projectTitle').innerHTML =
    'LOCATIONS<br/>' + locationList;
}

async function printEvolution(pokemonID) {
  const getEvolution = await fetch(baseURL + '/pokemon-species/' + pokemonID);
  const evolution = await getEvolution.json();
  const evolutionURL = evolution.evolution_chain.url;

  const getEvolutionData = await fetch(evolutionURL);
  const evolutionData = await getEvolutionData.json();

  let resultEvolution = '';
  resultEvolution += evolutionData.chain.species.name + '<br/>';
  let evolutionChain = evolutionData.chain.evolves_to;

  while (evolutionChain.length > 0) {
    resultEvolution += evolutionChain[0].species.name + '<br/>';
    evolutionChain = evolutionChain[0].evolves_to;
  }

  document.getElementById('projectTitle').innerHTML =
    'EVOLUTION<br/>' + resultEvolution;
}

async function buildPokemonArray() {
  const initialResponse = await fetch(baseURL + '/pokemon');
  const parsedResponse = await initialResponse.json();
  let count = 0;
  for (let i = 0; i < parsedResponse.results.length; i++) {
    pokemonArray[i] = parsedResponse.results[i].name;
  }
}
