import { IBrand } from "src/common";
export declare class BrandResponse {
    brand: IBrand;
}
export declare class GetAllResponse {
    result: {
        docsCount?: number;
        limit?: number;
        page?: number;
        currentPage?: number | undefined;
        result: IBrand[];
    };
}
