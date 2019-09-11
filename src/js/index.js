import "regenerator-runtime/runtime";
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/*
Global state of the pp
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // get the query from view
    const query = searchView.getInput();
    // console.log(query);

    if (query) {
        // new search object and add it to state
        state.search = new Search(query);

        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
        // search for recipes
        await state.search.getResults();

        // render rsults on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        } catch(error) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        // console.log(goToPage);
    }
})

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // get the id from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for changes

        // Create a new recipe object
        state.recipe = new Recipe(id);

        try {

            // Get recipe data
            await state.recipe.getRecipe();

            // Calculate srvings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render the recipe
            console.log(state.recipe);
        } catch(error) {
            alert('Error processing recipe');
        }
    };
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));