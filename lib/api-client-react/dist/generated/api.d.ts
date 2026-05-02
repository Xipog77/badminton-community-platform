import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AcceptInput, Clan, ConfirmInput, CreateClanInput, CreatePostInput, CreateProductInput, HealthStatus, JoinInput, LoginInput, Match, Product, UpdateProfileInput, User } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Simulated login (creates user if missing)
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginInput: LoginInput, options?: RequestInit) => Promise<User>;
export declare const getLoginMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginInput>;
export type LoginMutationError = ErrorType<unknown>;
/**
 * @summary Simulated login (creates user if missing)
 */
export declare const useLogin: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
/**
 * @summary Update current user profile (avatar and skill level)
 */
export declare const getUpdateProfileUrl: () => string;
export declare const updateProfile: (updateProfileInput: UpdateProfileInput, options?: RequestInit) => Promise<User>;
export declare const getUpdateProfileMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
        data: BodyType<UpdateProfileInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
    data: BodyType<UpdateProfileInput>;
}, TContext>;
export type UpdateProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateProfile>>>;
export type UpdateProfileMutationBody = BodyType<UpdateProfileInput>;
export type UpdateProfileMutationError = ErrorType<void>;
/**
 * @summary Update current user profile (avatar and skill level)
 */
export declare const useUpdateProfile: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
        data: BodyType<UpdateProfileInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProfile>>, TError, {
    data: BodyType<UpdateProfileInput>;
}, TContext>;
/**
 * @summary List all match posts
 */
export declare const getListPostsUrl: () => string;
export declare const listPosts: (options?: RequestInit) => Promise<Match[]>;
export declare const getListPostsQueryKey: () => readonly ["/api/posts"];
export declare const getListPostsQueryOptions: <TData = Awaited<ReturnType<typeof listPosts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPosts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPosts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPostsQueryResult = NonNullable<Awaited<ReturnType<typeof listPosts>>>;
export type ListPostsQueryError = ErrorType<unknown>;
/**
 * @summary List all match posts
 */
export declare function useListPosts<TData = Awaited<ReturnType<typeof listPosts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPosts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new match post
 */
export declare const getCreatePostUrl: () => string;
export declare const createPost: (createPostInput: CreatePostInput, options?: RequestInit) => Promise<Match>;
export declare const getCreatePostMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPost>>, TError, {
        data: BodyType<CreatePostInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPost>>, TError, {
    data: BodyType<CreatePostInput>;
}, TContext>;
export type CreatePostMutationResult = NonNullable<Awaited<ReturnType<typeof createPost>>>;
export type CreatePostMutationBody = BodyType<CreatePostInput>;
export type CreatePostMutationError = ErrorType<unknown>;
/**
 * @summary Create a new match post
 */
export declare const useCreatePost: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPost>>, TError, {
        data: BodyType<CreatePostInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPost>>, TError, {
    data: BodyType<CreatePostInput>;
}, TContext>;
/**
 * @summary Get a single match post
 */
export declare const getGetPostUrl: (id: string) => string;
export declare const getPost: (id: string, options?: RequestInit) => Promise<Match>;
export declare const getGetPostQueryKey: (id: string) => readonly [`/api/posts/${string}`];
export declare const getGetPostQueryOptions: <TData = Awaited<ReturnType<typeof getPost>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPost>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPost>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPostQueryResult = NonNullable<Awaited<ReturnType<typeof getPost>>>;
export type GetPostQueryError = ErrorType<unknown>;
/**
 * @summary Get a single match post
 */
export declare function useGetPost<TData = Awaited<ReturnType<typeof getPost>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPost>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Request to join a match (auto-accepted in demo)
 */
export declare const getJoinPostUrl: (id: string) => string;
export declare const joinPost: (id: string, joinInput: JoinInput, options?: RequestInit) => Promise<Match>;
export declare const getJoinPostMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof joinPost>>, TError, {
        id: string;
        data: BodyType<JoinInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof joinPost>>, TError, {
    id: string;
    data: BodyType<JoinInput>;
}, TContext>;
export type JoinPostMutationResult = NonNullable<Awaited<ReturnType<typeof joinPost>>>;
export type JoinPostMutationBody = BodyType<JoinInput>;
export type JoinPostMutationError = ErrorType<unknown>;
/**
 * @summary Request to join a match (auto-accepted in demo)
 */
export declare const useJoinPost: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof joinPost>>, TError, {
        id: string;
        data: BodyType<JoinInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof joinPost>>, TError, {
    id: string;
    data: BodyType<JoinInput>;
}, TContext>;
/**
 * @summary Accept a pending join request
 */
export declare const getAcceptJoinRequestUrl: (id: string) => string;
export declare const acceptJoinRequest: (id: string, acceptInput: AcceptInput, options?: RequestInit) => Promise<Match>;
export declare const getAcceptJoinRequestMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof acceptJoinRequest>>, TError, {
        id: string;
        data: BodyType<AcceptInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof acceptJoinRequest>>, TError, {
    id: string;
    data: BodyType<AcceptInput>;
}, TContext>;
export type AcceptJoinRequestMutationResult = NonNullable<Awaited<ReturnType<typeof acceptJoinRequest>>>;
export type AcceptJoinRequestMutationBody = BodyType<AcceptInput>;
export type AcceptJoinRequestMutationError = ErrorType<unknown>;
/**
 * @summary Accept a pending join request
 */
export declare const useAcceptJoinRequest: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof acceptJoinRequest>>, TError, {
        id: string;
        data: BodyType<AcceptInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof acceptJoinRequest>>, TError, {
    id: string;
    data: BodyType<AcceptInput>;
}, TContext>;
/**
 * @summary List confirmed matches
 */
export declare const getListMatchesUrl: () => string;
export declare const listMatches: (options?: RequestInit) => Promise<Match[]>;
export declare const getListMatchesQueryKey: () => readonly ["/api/matches"];
export declare const getListMatchesQueryOptions: <TData = Awaited<ReturnType<typeof listMatches>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMatches>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMatches>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMatchesQueryResult = NonNullable<Awaited<ReturnType<typeof listMatches>>>;
export type ListMatchesQueryError = ErrorType<unknown>;
/**
 * @summary List confirmed matches
 */
export declare function useListMatches<TData = Awaited<ReturnType<typeof listMatches>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMatches>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a confirmed match
 */
export declare const getGetMatchUrl: (id: string) => string;
export declare const getMatch: (id: string, options?: RequestInit) => Promise<Match>;
export declare const getGetMatchQueryKey: (id: string) => readonly [`/api/matches/${string}`];
export declare const getGetMatchQueryOptions: <TData = Awaited<ReturnType<typeof getMatch>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMatch>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMatch>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMatchQueryResult = NonNullable<Awaited<ReturnType<typeof getMatch>>>;
export type GetMatchQueryError = ErrorType<unknown>;
/**
 * @summary Get a confirmed match
 */
export declare function useGetMatch<TData = Awaited<ReturnType<typeof getMatch>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMatch>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Confirm match result for a player
 */
export declare const getConfirmMatchUrl: (id: string) => string;
export declare const confirmMatch: (id: string, confirmInput: ConfirmInput, options?: RequestInit) => Promise<Match>;
export declare const getConfirmMatchMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof confirmMatch>>, TError, {
        id: string;
        data: BodyType<ConfirmInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof confirmMatch>>, TError, {
    id: string;
    data: BodyType<ConfirmInput>;
}, TContext>;
export type ConfirmMatchMutationResult = NonNullable<Awaited<ReturnType<typeof confirmMatch>>>;
export type ConfirmMatchMutationBody = BodyType<ConfirmInput>;
export type ConfirmMatchMutationError = ErrorType<unknown>;
/**
 * @summary Confirm match result for a player
 */
export declare const useConfirmMatch: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof confirmMatch>>, TError, {
        id: string;
        data: BodyType<ConfirmInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof confirmMatch>>, TError, {
    id: string;
    data: BodyType<ConfirmInput>;
}, TContext>;
/**
 * @summary List marketplace products
 */
export declare const getListProductsUrl: () => string;
export declare const listProducts: (options?: RequestInit) => Promise<Product[]>;
export declare const getListProductsQueryKey: () => readonly ["/api/products"];
export declare const getListProductsQueryOptions: <TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listProducts>>>;
export type ListProductsQueryError = ErrorType<unknown>;
/**
 * @summary List marketplace products
 */
export declare function useListProducts<TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new product
 */
export declare const getCreateProductUrl: () => string;
export declare const createProduct: (createProductInput: CreateProductInput, options?: RequestInit) => Promise<Product>;
export declare const getCreateProductMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProduct>>, TError, {
        data: BodyType<CreateProductInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createProduct>>, TError, {
    data: BodyType<CreateProductInput>;
}, TContext>;
export type CreateProductMutationResult = NonNullable<Awaited<ReturnType<typeof createProduct>>>;
export type CreateProductMutationBody = BodyType<CreateProductInput>;
export type CreateProductMutationError = ErrorType<unknown>;
/**
 * @summary Create a new product
 */
export declare const useCreateProduct: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProduct>>, TError, {
        data: BodyType<CreateProductInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createProduct>>, TError, {
    data: BodyType<CreateProductInput>;
}, TContext>;
/**
 * @summary Get a product
 */
export declare const getGetProductUrl: (id: string) => string;
export declare const getProduct: (id: string, options?: RequestInit) => Promise<Product>;
export declare const getGetProductQueryKey: (id: string) => readonly [`/api/products/${string}`];
export declare const getGetProductQueryOptions: <TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProductQueryResult = NonNullable<Awaited<ReturnType<typeof getProduct>>>;
export type GetProductQueryError = ErrorType<unknown>;
/**
 * @summary Get a product
 */
export declare function useGetProduct<TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List clans
 */
export declare const getListClansUrl: () => string;
export declare const listClans: (options?: RequestInit) => Promise<Clan[]>;
export declare const getListClansQueryKey: () => readonly ["/api/clans"];
export declare const getListClansQueryOptions: <TData = Awaited<ReturnType<typeof listClans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listClans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listClans>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListClansQueryResult = NonNullable<Awaited<ReturnType<typeof listClans>>>;
export type ListClansQueryError = ErrorType<unknown>;
/**
 * @summary List clans
 */
export declare function useListClans<TData = Awaited<ReturnType<typeof listClans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listClans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a clan
 */
export declare const getCreateClanUrl: () => string;
export declare const createClan: (createClanInput: CreateClanInput, options?: RequestInit) => Promise<Clan>;
export declare const getCreateClanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createClan>>, TError, {
        data: BodyType<CreateClanInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createClan>>, TError, {
    data: BodyType<CreateClanInput>;
}, TContext>;
export type CreateClanMutationResult = NonNullable<Awaited<ReturnType<typeof createClan>>>;
export type CreateClanMutationBody = BodyType<CreateClanInput>;
export type CreateClanMutationError = ErrorType<unknown>;
/**
 * @summary Create a clan
 */
export declare const useCreateClan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createClan>>, TError, {
        data: BodyType<CreateClanInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createClan>>, TError, {
    data: BodyType<CreateClanInput>;
}, TContext>;
/**
 * @summary Get a clan
 */
export declare const getGetClanUrl: (id: string) => string;
export declare const getClan: (id: string, options?: RequestInit) => Promise<Clan>;
export declare const getGetClanQueryKey: (id: string) => readonly [`/api/clans/${string}`];
export declare const getGetClanQueryOptions: <TData = Awaited<ReturnType<typeof getClan>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getClan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getClan>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetClanQueryResult = NonNullable<Awaited<ReturnType<typeof getClan>>>;
export type GetClanQueryError = ErrorType<unknown>;
/**
 * @summary Get a clan
 */
export declare function useGetClan<TData = Awaited<ReturnType<typeof getClan>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getClan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Join a clan
 */
export declare const getJoinClanUrl: (id: string) => string;
export declare const joinClan: (id: string, joinInput: JoinInput, options?: RequestInit) => Promise<Clan>;
export declare const getJoinClanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof joinClan>>, TError, {
        id: string;
        data: BodyType<JoinInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof joinClan>>, TError, {
    id: string;
    data: BodyType<JoinInput>;
}, TContext>;
export type JoinClanMutationResult = NonNullable<Awaited<ReturnType<typeof joinClan>>>;
export type JoinClanMutationBody = BodyType<JoinInput>;
export type JoinClanMutationError = ErrorType<unknown>;
/**
 * @summary Join a clan
 */
export declare const useJoinClan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof joinClan>>, TError, {
        id: string;
        data: BodyType<JoinInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof joinClan>>, TError, {
    id: string;
    data: BodyType<JoinInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map