import { IProduct } from "src/common";
export declare class ProductResponse {
    product: IProduct;
}
export declare class GetAllResponse {
    result: {
        docsCount?: number;
        limit?: number;
        page?: number;
        currentPage?: number | undefined;
        result: IProduct[];
    };
}
