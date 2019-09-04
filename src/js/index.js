import "regenerator-runtime/runtime";
import axios from 'axios';

// https://www.food2fork.com/api/search
// a384a574fd1cbbf4625b5b810319264b

async function getResults(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = "a384a574fd1cbbf4625b5b810319264b";
    try {
        const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = res.data.recipes;
        console.log(recipes);
    } catch(error) {
        alert(error);
    }
}

getResults("tomato pasta");