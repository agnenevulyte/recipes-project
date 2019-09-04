import Search from './models/Search';


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
    const query ='pizza' // TODO

    if (query) {
        // new search object and add it to state
        state.search = new Search(query);

        // prepare UI for results

        // search for recipes
        await state.search.getResults();

        // render rsults on UI
        console.log(state.search.result)
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});