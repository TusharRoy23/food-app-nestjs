import { RestaurantResponse } from "../../shared/utils/response.utils";

export interface IRestaurantSearchResult {
    hits: {
        total: number,
        hits: Array<{
            _source: RestaurantResponse
        }>
    }
}