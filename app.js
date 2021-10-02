//Height, weight, hp, atk, def, sp.atk, sp.def, speed 
//Height and weight can be found in /pokemon endpoint
//HP is health point, Atk is attack, Def is defense, sp.atk is special attack
//sp.def is special defense, speed is duh, speed. All of these are found in pokemon/id at stats.stat
//Base stats are found in Pokemon/stat.

//Moves can be found in pokemon/id/move endpoint

//Location can be found in pokemon/location_area_encounters

//Evolution


const baseURL = "https://pokeapi.co/api/v2"


async function printInfo(pokemonID) {
    const response = await fetch(baseURL + "/pokemon/" + pokemonID);
    const infoData = await response.json();
    console.log("INFO");
    console.log("height: " + infoData.height + " m");
    console.log("weight: " + infoData.weight + " lbs");
    for (let i = 0; i < infoData.stats.length; i++) {
        console.log(infoData.stats[i].stat.name + ": " + infoData.stats[i].base_stat);
    }
}

async function printMoves(pokemonID) {
    const response = await fetch(baseURL + "/pokemon/" + pokemonID);
    const infoData = await response.json();
    console.log("MOVES");
    for (let i = 0; i < infoData.moves.length; i++) {
        console.log(infoData.moves[i].move.name);
    }
}

async function printLocation(pokemonID) {
    const locationData = await fetch (baseURL + "/pokemon/" + pokemonID + "/encounters");
    console.log("LOCATIONS");
    const locations = await locationData.json();
    for (let i = 0; i < locations.length; i++) {
        console.log(locations[i].location_area.name);
    }
}

async function printEvolution(pokemonID) {
    const getEvolution = await fetch (baseURL + "/pokemon-species/" + pokemonID);
    const evolution = await getEvolution.json();
    const evolutionURL = evolution.evolution_chain.url;

    const getEvolutionData = await fetch(evolutionURL);
    const evolutionData = await getEvolutionData.json();

    let resultChain = new Array();
    let counter = 0;

    //Add the pokemon with the pokemonID as the first element in the chain
    resultChain[counter] = evolutionData.chain.species.name;
    counter++;

    let evolutionChain = evolutionData.chain.evolves_to;
    

    while (evolutionChain.length > 0) {
        resultChain[counter] = evolutionChain[0].species.name;
        counter++;
        evolutionChain = evolutionChain[0].evolves_to;
    }

    console.log(resultChain);

}

async function main() {
    printInfo("bulbasaur");
    printMoves("bulbasaur");
    printLocation("bulbasaur");
    printEvolution("bulbasaur");
}
main()