import { ICategory } from "src/common";
export declare class CategoryResponse {
    category: ICategory;
}
export declare class GetAllResponse {
    result: {
        docsCount?: number;
        limit?: number;
        page?: number;
        currentPage?: number | undefined;
        result: ICategory[];
    };
}
