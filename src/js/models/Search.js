import axios from 'axios';
import {key, proxy} from '../config';

// https://www.food2fork.com/api/search
// a384a574fd1cbbf4625b5b810319264b


export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            // console.log(res);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch(error) {
            alert(error);
        }
    }
}