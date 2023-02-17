import { Restaurant } from "../schemas"

export interface IRestaurantSearchResult {
    hits: {
        total: number,
        hits: Array<{
            _source: Restaurant
        }>
    }
}