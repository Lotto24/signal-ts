import './style.css'
import {createEffect, Signal} from "./signal/signal.ts";
import { Pokemon } from "./pokemon/types.ts";
import {fetchAllPokemons} from "./pokemon/pokemon.service.ts";

const list = document.querySelector<HTMLDivElement>('#list')!
const info = document.querySelector<HTMLDivElement>('#info')!
const search = document.querySelector<HTMLInputElement>('#search')!
const pageTitle = document.querySelector<HTMLTitleElement>('#page-title')!

const pokemonsSignal = new Signal<Pokemon[]>([])
const selectedPokemonSignal = new Signal<Pokemon | null>(null)
const searchTextSignal = new Signal<string>('')

createEffect(() => {
    list.innerHTML = pokemonsSignal.get().map(pokemon => `
        <div class="flex items-center cursor-pointer hover:bg-red-100"
             id="${pokemon.name}"
        >
            <img class="w-8" src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
            <div class="text-xs capitalize">${pokemon.name}</div>
        </div>
    `).join('');

    pokemonsSignal.get().forEach(pokemon => {
        document.getElementById(pokemon.name)?.addEventListener('click', () => {
            selectedPokemonSignal.set(pokemon);
        });
    });
})

createEffect(() => {
    if (selectedPokemonSignal.get()) {
        pageTitle.innerText = selectedPokemonSignal.get()?.name || 'Pokemons'
        info.innerHTML = `
            <img src="${selectedPokemonSignal.get()?.sprites.front_default}" alt="${selectedPokemonSignal.get()?.name}" />
            <h2 class="text-xl font-bold h-10">${selectedPokemonSignal.get()?.name}</h2>
            <div>Height - ${selectedPokemonSignal.get()?.height}</div>
            <div>Weight - ${selectedPokemonSignal.get()?.weight}</div>
        `
    } else {
        info.innerHTML = ''
    }
})

createEffect(() => {
    if (searchTextSignal.get()) {
        const searchResult = searchPokemon(searchTextSignal.get())
        if (searchResult.length > 0) {
            pokemonsSignal.set(searchResult)
        }
    }
})

search.addEventListener('input', (e: Event) => {
    const value = (e.target as HTMLInputElement).value.toLowerCase()
    if (value.length <= 2) {
        init()
        return
    }
    searchTextSignal.set(value)
})

function searchPokemon(key: string) {
    return pokemonsSignal.get().filter(pokemon => pokemon.name.includes(key))
}

function init() {

    fetchAllPokemons().then(pokemons => {
        pokemonsSignal.set(pokemons)
    })

}

init()