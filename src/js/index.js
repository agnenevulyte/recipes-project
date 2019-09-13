import "regenerator-runtime/runtime";
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/*
Global state of the pp
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};
window.state = state;

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // get the query from view
    const query = searchView.getInput();
    // test
    // const query = 'pizza';
    // console.log(query);

    if (query) {
        // new search object and add it to state
        state.search = new Search(query);

        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
        // search for recipes
            await state.search.getResults();

            // render rsults on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert('Something is wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// test
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        };
        // Create a new recipe object
        state.recipe = new Recipe(id);

        // testing
        window.r = state.recipe;

        try {

            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
        
            // Calculate srvings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render the recipe
            clearLoader();
            // console.log(state.recipe);
            recipeView.renderRecipe(state.recipe);
        } catch(error) {
            alert('Error processing recipe');
        }
    };
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * SHOPPING LIST CONTROLLER
 */
const controlList = () => {
    // 1. create a new list if there is none yet
    if(!state.list) {
        state.list = new List();
    };
    // 2. add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest(".shopping__item").dataset.itemid
    
    // Handle delete button;
    if(e.target.matches(".shopping__delete, .shopping__delete *")) {
        // delete from state
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);

    // handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});



/**
 * LIKES CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // user has not yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // toggle the like button

        // add like to UI list
            console.log(state.likes);


    // user has liked current recipe
    } else {
        // remove like from the state
        state.likes.deleteLike(currentID);
        // toggle the like button

        // remove like from UI list
        console.log(state.likes);
    }
}



// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
    // console.log(state.recipe);
});
