const baseURL = 'https://pokeapi.co/api/v2';

let pokemonArray = new Array();

async function main() {
  const initialResponse = await fetch(baseURL + '/pokemon?offset=0&limit=151');
  const parsedResponse = await initialResponse.json();
  for (let i = 0; i < parsedResponse.results.length; i++) {
    pokemonArray[i] = parsedResponse.results[i].name;
  }
  //console.log(pokemonArray);
}

main();

const TypeColor = {
  normal: "#a8a878",
  fighting: "#c03028",
  flying: "#a890f0",
  poison: "#a040a0",
  ground: "#e0c068",
  rock: "#b8a038",
  bug: "#a8b820",
  ghost: "#705898",
  steel: "#b8b8d0",
  fire: "#f08030",
  water: "#6890f0",
  grass: "#78c850",
  electric: "#f8d030",
  psychic: "#f85888",
  ice: "#98d8d8",
  dragon: "#7038f8",
  dark: "#705848",
  fairy: "#ee99ac",
  none: "gray"
}

document.addEventListener('keypress', (e) => {
  try {
    if (e.key === 'Enter') {
      document.getElementById('projectTitle').style.fontSize = 'x-large';
      let pokemonID = document.getElementById('search').value.toLowerCase();
      printInfo(pokemonID);
      printPhoto(pokemonID);
    }
  } catch (err) {
    printInfo(-1);
    printPhoto(-1);
  }
});

document.addEventListener('click', (c) => {
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
        //console.log(index);
        break;
      }
    }

    let prevPokemon = pokemonArray[modulo(index - 1, pokemonArray.length)];
    document.getElementById('search').value = prevPokemon;
    printInfo(prevPokemon);
    printPhoto(prevPokemon);
  } else if (c.target === document.getElementById('next')) {
    let index = 0;
    let pokemonID = document.getElementById('search').value;

    for (let i = 0; i < pokemonArray.length; i++) {
      if (pokemonArray[i] === pokemonID) {
        index = i;
        break;
      }
    }

    let nextPokemon = pokemonArray[modulo(index + 1, pokemonArray.length)];
    //console.log(nextPokemon);
    document.getElementById('search').value = nextPokemon;
    printInfo(nextPokemon);
    printPhoto(nextPokemon);
  }
});

async function printInfo(pokemonID) {
  try {
    const response = await fetch(baseURL + '/pokemon/' + pokemonID);
    const infoData = await response.json();
    //console.log(infoData);
    let height = 'height: ' + infoData.height + ' m<br/>';
    let weight = 'weight: ' + infoData.weight + ' lbs<br/>';
    let stats = '';

    for (let i = 0; i < infoData.stats.length; i++) {
      stats +=
        infoData.stats[i].stat.name.replace(/-/g, ' ') +
        ': ' +
        infoData.stats[i].base_stat +
        '<br/>';
    }

  document.getElementById('projectTitle').innerHTML =
    'INFO<br/><br/>' + height + weight + stats;
  //printPhoto(pokemonID);

    document.getElementById('search').value = infoData.name;
    document.getElementById('type1').innerHTML =
      infoData.types[0].type.name.charAt(0).toUpperCase() +
      infoData.types[0].type.name.substr(1);
    document.getElementById('type1').style.backgroundColor = 
      TypeColor[infoData.types[0].type.name];
    if (infoData.types.length === 2) {
      document.getElementById('type2').innerHTML =
        infoData.types[1].type.name.charAt().toUpperCase() +
        infoData.types[1].type.name.substr(1);
        document.getElementById('type2').style.backgroundColor =
        TypeColor[infoData.types[1].type.name];
    } else {
      document.getElementById('type2').innerHTML = 'None';
      document.getElementById('type2').style.backgroundColor = TypeColor['none'];
    }
  } catch (err) {
    document.getElementById('projectTitle').innerHTML =
      'NO INFO FOUND, INVALID ID';
    document.getElementById('type1').innerHTML = 'Not Found';
    document.getElementById('type2').innerHTML = 'Not Found';
  }
}

async function printMoves(pokemonID) {
  const response = await fetch(baseURL + '/pokemon/' + pokemonID);
  const infoData = await response.json();
  let moves = '';

  for (let i = 0; i < infoData.moves.length; i++) {
    moves += infoData.moves[i].move.name.replace(/-/g, ' ') + '<br/>';
  }

  document.getElementById('projectTitle').innerHTML = 'MOVES<br/><br/>' + moves;
  printPhoto(pokemonID);
}

async function printLocation(pokemonID) {
  const locationData = await fetch(
    baseURL + '/pokemon/' + pokemonID + '/encounters'
  );

  let locationList = '';
  const locations = await locationData.json();

  for (let i = 0; i < locations.length; i++) {
    locationList +=
      locations[i].location_area.name.replace(/-/g, ' ') + '<br/>';
  }

  if (locationList === '') {
    locationList = 'CANNOT BE CAUGHT IN THE WILD<br/>';
  }

  document.getElementById('projectTitle').innerHTML =
    'LOCATIONS<br/><br/>' + locationList;
  printPhoto(pokemonID);
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
    'EVOLUTION<br/><br/>' + resultEvolution;
  printPhoto(pokemonID);
}

async function printPhoto(pokemonID) {
  try {
    const response = await fetch(baseURL + '/pokemon/' + pokemonID);
    const responseJSON = await response.json();

    let photoURL = responseJSON.sprites.front_default;
    document.getElementById('poke').src = photoURL;
  } catch (err) {
    document.getElementById('poke').src = './images/err_img.jpg';
  }
}

function modulo(number, base) {
  let result = number % base;
  if (result < 0) return result + base;
  return result;
}
