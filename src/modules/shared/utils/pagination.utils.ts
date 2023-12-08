import { IPaginationDataResponse, IPaginationPayload } from './response.utils';

export const pagination = ({
  page = 1,
  size = 10,
}: {
  page: number;
  size: number;
}): IPaginationPayload => {
  const limit = size;
  const offset = (page - 1) * limit;

  return { limit, offset, currentPage: page };
};

export const getPaginationData = ({
  total,
  page = 1,
  limit = 10,
}: {
  total: number;
  page: number;
  limit: number;
}): IPaginationDataResponse => {
  const currentPage: number = page;
  const totalPages = Math.ceil(total / limit);
  const nextPage = totalPages <= currentPage ? 0 : currentPage + 1;

  return { count: total, currentPage, totalPages, nextPage };
};
