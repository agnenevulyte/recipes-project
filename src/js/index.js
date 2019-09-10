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
        // search for recipes
        await state.search.getResults();

        // render rsults on UI
        clearLoader();
        searchView.renderResults(state.search.result);
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
const r = new Recipe(47746);
r.getRecipe();
console.log(r)