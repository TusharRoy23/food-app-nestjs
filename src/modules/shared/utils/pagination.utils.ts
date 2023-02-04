import { PaginationDataResponse, PaginationPayload } from "./response.utils";

export const pagination = ({ page = 1, size = 10 }: { page: number, size: number }): PaginationPayload => {
    const limit = size;
    const offset = (page - 1) * limit;

    return { limit, offset, currentPage: page };
}

export const getPaginationData = ({ total, page, limit }: { total: number, page: number, limit: number }): PaginationDataResponse => {
    const currentPage: number = page;
    const totalPages = Math.ceil(total / limit);
    const nextPage = totalPages - currentPage;

    return { count: total, currentPage, totalPages, nextPage };
}