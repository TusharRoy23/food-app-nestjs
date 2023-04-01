import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { IRestaurantSearchResult } from '../../restaurant/interfaces/IRestaurant-search';
import { Restaurant } from '../../restaurant/schemas';
import { throwException } from '../errors/all.exception';
import { IElasticsearchService } from '../interfaces';
import { CurrentStatus } from '../utils/enum';
import { RestaurantResponse } from '../utils/response.utils';

@Injectable()
export class CustomElasticService implements IElasticsearchService {
  private restaurantIdx = 'restaurants';
  constructor(private readonly elasticSearchService: ElasticsearchService) { }

  async getRestaurantList(): Promise<RestaurantResponse[]> {
    try {
      return await this.elasticSearchService
        .search<IRestaurantSearchResult>({
          index: this.restaurantIdx,
          body: {
            query: {
              bool: {
                must: [
                  {
                    term: {
                      current_status: CurrentStatus.ACTIVE,
                    },
                  },
                ],
              },
            },
          },
        })
        .then((response) => {
          const hits = response.body.hits.hits;
          return hits.map((restaurant) => restaurant._source);
        })
        .catch((error) => {
          throw new InternalServerErrorException('Error on search');
        });
    } catch (error) {
      return throwException(error);
    }
  }

  async searchRestaurant(keyword: string): Promise<RestaurantResponse[]> {
    try {
      return await this.elasticSearchService
        .search<IRestaurantSearchResult>({
          index: this.restaurantIdx,
          body: {
            query: {
              bool: {
                must: [
                  {
                    term: {
                      current_status: CurrentStatus.ACTIVE,
                    },
                  },
                ],
                should: [
                  {
                    query_string: {
                      fields: ['name', 'address'],
                      query: `${keyword}*`,
                    },
                  },
                ],
                minimum_should_match: 1,
              },
            },
          },
        })
        .then((response) => {
          const hits = response.body.hits.hits;
          return hits.map((restaurant) => restaurant._source);
        })
        .catch((error) => {
          throw new InternalServerErrorException('Error on search');
        });
    } catch (error: any) {
      return throwException(error);
    }
  }

  async indexRestaurant(restaurant: Restaurant): Promise<boolean> {
    try {
      return this.elasticSearchService
        .index<IRestaurantSearchResult, RestaurantResponse>({
          index: this.restaurantIdx,
          id: restaurant._id.toString(),
          body: {
            id: restaurant._id,
            name: restaurant.name,
            address: restaurant.address,
            closing_time: restaurant.closing_time,
            opening_time: restaurant.opening_time,
            current_status: restaurant.current_status,
          },
        })
        .then((_) => {
          return true;
        })
        .catch((_) => {
          throw new InternalServerErrorException('Error on indexing');
        });
    } catch (error: any) {
      return throwException(error);
    }
  }
}
