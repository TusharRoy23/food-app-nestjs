import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Restaurant } from '../../restaurant/schemas/restaurant.schema';
import { throwException } from '../errors/all.exception';
import { IElasticsearchService } from '../interfaces';
import { CurrentStatus } from '../utils/enum';
import { IRestaurantResponse } from '../utils/response.utils';

@Injectable()
export class CustomElasticService implements IElasticsearchService {
  private restaurantIdx = 'restaurants';
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async getRestaurantList(): Promise<IRestaurantResponse[]> {
    try {
      return await this.querySearchResult({
        must: [
          {
            term: {
              current_status: CurrentStatus.ACTIVE,
            },
          },
        ],
      });
    } catch (error) {
      return throwException(error);
    }
  }

  async searchRestaurant(keyword: string): Promise<IRestaurantResponse[]> {
    try {
      return await this.querySearchResult({
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
      });
    } catch (error: any) {
      return throwException(error);
    }
  }

  async indexRestaurant(restaurant: Restaurant): Promise<boolean> {
    try {
      return this.elasticSearchService
        .index<IRestaurantResponse>({
          index: this.restaurantIdx,
          id: restaurant._id.toString(),
          document: {
            id: restaurant._id,
            name: restaurant.name,
            address: restaurant.address,
            closing_time: restaurant.closing_time,
            opening_time: restaurant.opening_time,
            current_status: restaurant.current_status,
          },
        })
        .then(() => {
          return true;
        })
        .catch(() => {
          throw new InternalServerErrorException('Error on indexing');
        });
    } catch (error: any) {
      return throwException(error);
    }
  }

  private async querySearchResult(
    searchQuery: any,
  ): Promise<IRestaurantResponse[]> {
    try {
      return await this.elasticSearchService
        .search<IRestaurantResponse>({
          index: this.restaurantIdx,
          query: {
            bool: searchQuery,
          },
        })
        .then((response) =>
          response.hits.hits.map((restaurant) => restaurant._source),
        )
        .catch(() => {
          throw new InternalServerErrorException('Error on search');
        });
    } catch (error) {
      return throwException(error);
    }
  }
}
