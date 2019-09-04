import "regenerator-runtime/runtime";
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

/*
Global state of the pp
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};

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
        // search for recipes
        await state.search.getResults();

        // render rsults on UI
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});