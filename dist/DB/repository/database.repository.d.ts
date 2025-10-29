import { CreateOptions, DeleteResult, HydratedDocument, Types, UpdateWriteOpResult } from "mongoose";
import { FlattenMaps, Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";
export type Lean<T> = FlattenMaps<T>;
export declare abstract class DatabaseRepository<TRowDocument, TDocument = HydratedDocument<TRowDocument>> {
    protected model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    findOne({ filter, select, options }: {
        filter?: RootFilterQuery<TRowDocument>;
        select?: ProjectionType<TRowDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<Lean<TDocument> | TDocument | null>;
    findById({ id, select, options }: {
        id?: RootFilterQuery<TRowDocument> | any;
        select?: ProjectionType<TRowDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<Lean<TDocument> | TDocument | null>;
    find({ filter, select, options }: {
        filter?: RootFilterQuery<TRowDocument>;
        select?: ProjectionType<TRowDocument> | undefined;
        options?: QueryOptions<TDocument> | undefined;
    }): Promise<TDocument[] | [] | Lean<TDocument>[]>;
    paginate({ filter, select, options, page, size }: {
        filter: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | undefined;
        options?: QueryOptions<TDocument> | undefined;
        page?: number | "all";
        size?: number;
    }): Promise<TDocument[] | [] | Lean<TDocument>[] | any>;
    create({ data, options, }: {
        data: Partial<TRowDocument>[];
        options?: CreateOptions | undefined;
    }): Promise<TDocument[]>;
    insertMany({ data, }: {
        data: Partial<TDocument>[];
    }): Promise<TDocument[]>;
    updateOne({ filter, update, options }: {
        filter: RootFilterQuery<TRowDocument>;
        update?: UpdateQuery<TDocument>;
        options?: MongooseUpdateQueryOptions<TDocument> | null;
    }): Promise<UpdateWriteOpResult>;
    updateMany({ filter, update, options }: {
        filter: RootFilterQuery<TRowDocument>;
        update?: UpdateQuery<TDocument>;
        options?: MongooseUpdateQueryOptions<TDocument> | null;
    }): Promise<UpdateWriteOpResult>;
    findByIdAndUpdate({ id, update, options }: {
        id?: Types.ObjectId;
        update?: UpdateQuery<TDocument>;
        options?: QueryOptions<TDocument> | null;
    }): Promise<TDocument | Lean<TDocument> | null>;
    findOneAndUpdate({ filter, update, options }: {
        filter?: RootFilterQuery<TRowDocument>;
        update?: UpdateQuery<TDocument>;
        options?: QueryOptions<TDocument> | null;
    }): Promise<TDocument | Lean<TDocument> | null>;
    deleteOne({ filter, }: {
        filter: RootFilterQuery<TRowDocument>;
    }): Promise<DeleteResult>;
    findOneAndDelete({ filter, options }: {
        filter: RootFilterQuery<TRowDocument>;
        options?: QueryOptions<TDocument> | null;
    }): Promise<TDocument | null>;
    deleteMany({ filter, }: {
        filter: RootFilterQuery<TDocument>;
    }): Promise<DeleteResult>;
}
