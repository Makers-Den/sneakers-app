import { map, z } from "zod";
import dayjs from "dayjs";
import {
  ShopifyFieldKey,
  ShopifyMetaFieldKey,
  ShopifyMetaObjectType,
} from "@/types/shopify";
import { todayNoonUtc } from "./time";
import { envVariables } from "./env";
import { createNamedLogger } from "./log";
import {
  getCollectionByIdQuery,
  getCollectionByIdSchema,
} from "@/queries/getCollectionById";
import {
  getProductByIdQuery,
  getProductByIdSchema,
} from "@/queries/getProductById";
import {
  searchProductsQuery,
  searchProductsSchema,
} from "@/queries/searchProducts";
import { add } from "date-fns";
import {
  createCheckoutMutation,
  createCheckoutSchema,
} from "@/mutations/createCheckout";
import { mapFieldsToObject } from "./objects";
import {
  MetaObjectTypes,
  getMetaObjectsQuery,
  getMetaObjectsSchema,
} from "@/queries/getMetaObjects";
import {
  getMetaObjectQuery,
  getMetaObjectSchema,
} from "@/queries/getMetaObjectById";
import { ProductQuery, getFeedQuery, getFeedSchema } from "@/queries/getFeed";

const SHOPIFY_API_VERSION = "2023-10";
const SHOPIFY_GRAPHQL_ENDPOINT = `https://${envVariables.shopify.storeDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`;

const logger = createNamedLogger("Shopify");

interface MakeShopifyGraphqlRequestCommand<T extends z.ZodTypeAny> {
  query: string;
  schema: T;
  signal?: AbortSignal;
}

async function makeShopifyGraphqlRequest<T extends z.ZodTypeAny>(
  command: MakeShopifyGraphqlRequestCommand<T>
): Promise<z.infer<T> | null> {
  try {
    const response = await fetch(SHOPIFY_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          envVariables.shopify.storefrontAccessToken,
      },
      body: JSON.stringify({
        query: command.query,
      }),
      signal: command.signal,
    });

    const jsonResponse = await response.json();
    const parsedResponse = command.schema.parse(jsonResponse);

    return parsedResponse;
  } catch (error) {
    if (command.signal?.aborted) {
      return null;
    }

    logger.error("Making shopify graphql request failed", command.query, error);

    throw error;
  }
}

export function mapProduct(product: ProductQuery) {
  const modelVariant = product.metafields.find(
    (metafield) =>
      metafield && metafield.key === ShopifyMetaFieldKey.ModelVariant
  );

  const modelIsForMen = product.metafields.find(
    (metafield) =>
      metafield && metafield.key === ShopifyMetaFieldKey.ModelIsForMen
  );

  const modelDropOffsetDays = product.metafields.find(
    (metafield) =>
      metafield && metafield.key === ShopifyMetaFieldKey.ModelDropOffsetDays
  );

  const images = product.media.nodes.map(
    (node) => node.previewImage.resizedUrl
  );

  const sizes = product.variants.nodes.map((node) => ({
    id: node.id,
    label: node.title,
  }));

  const dropsAt = modelDropOffsetDays
    ? add(todayNoonUtc(), { days: parseInt(modelDropOffsetDays.value, 10) })
    : null;

  return {
    id: product.id,
    model: product.title,
    modelVariant: modelVariant?.value || null,
    isInStock: product.availableForSale,
    isUpcoming: !product.availableForSale,
    isForMen: modelIsForMen?.value ? modelIsForMen.value === "true" : null,
    sizes,
    sizeRange:
      sizes.length === 0
        ? null
        : {
            min: sizes[0],
            max: sizes[sizes.length - 1],
          },
    dropsAt,
    previewImage: images.length === 0 ? null : images[0],
    price: {
      amount: parseFloat(product.priceRange.maxVariantPrice.amount),
      currencyCode: product.priceRange.maxVariantPrice.currencyCode,
    },
  };
}

export type Product = ReturnType<typeof mapProduct>;

interface GetShoesByCollectionIdQuery {
  collectionId: string;
  maxImageHeight: number;
  maxImageWidth: number;
  page?: number;
  perPage?: number;
  cursor?: string;
  signal?: AbortSignal;
}

export async function getShoesByCollectionId(
  query: GetShoesByCollectionIdQuery
) {
  const response = await makeShopifyGraphqlRequest({
    query: getCollectionByIdQuery({
      collectionId: query.collectionId,
      maxImageHeight: query.maxImageHeight,
      maxImageWidth: query.maxImageWidth,
      page: query.page,
      cursor: query.cursor,
      perPage: query.perPage,
    }),
    schema: getCollectionByIdSchema,
    signal: query.signal,
  });

  if (response === null) {
    return null;
  }

  const pageInfo = response.data.collection.products.pageInfo;

  const shoes = response.data.collection.products.edges.map((edge) => {
    return {
      ...mapProduct(edge.node),
      pageInfo,
    };
  });

  return shoes;
}

export interface GetContentCategoriesQuery {
  signal?: AbortSignal;
  image?: { maxHeight: number; maxWidth: number };
}

export type ContentCategoryReferencesType = Exclude<
  MetaObjectTypes,
  ShopifyMetaObjectType.contentCategories
>;

export async function getContentCategories({
  signal,
  image,
}: GetContentCategoriesQuery) {
  const contentCategoriesResponse = await makeShopifyGraphqlRequest({
    query: getMetaObjectsQuery({
      type: ShopifyMetaObjectType.contentCategories,
      image,
    }),
    schema: getMetaObjectsSchema,
    signal: signal,
  });

  if (contentCategoriesResponse === null) {
    return null;
  }

  const storiesResponse = await makeShopifyGraphqlRequest({
    query: getMetaObjectsQuery({
      type: ShopifyMetaObjectType.stories,
      image,
    }),
    schema: getMetaObjectsSchema,
    signal: signal,
  });

  if (storiesResponse === null) {
    return null;
  }

  const blogPostsResponse = await makeShopifyGraphqlRequest({
    query: getMetaObjectsQuery({
      type: ShopifyMetaObjectType.blogPost,
      image,
    }),
    schema: getMetaObjectsSchema,
    signal: signal,
  });

  if (blogPostsResponse === null) {
    return null;
  }

  const stories = storiesResponse.data.metaobjects.nodes.map((storyNode) => {
    const storyData = mapFieldsToObject<{
      title: string;
      thumbnail: string;
      category: string;
    }>(storyNode.fields);

    return {
      id: storyNode.id,
      handle: storyNode.handle,
      data: storyData,
    };
  });

  const blogPosts = blogPostsResponse.data.metaobjects.nodes.map(
    (blogPostNode) => {
      const blogPostData = mapFieldsToObject<{
        title: string;
        thumbnail: string;
        category: string;
      }>(blogPostNode.fields);

      return {
        id: blogPostNode.id,
        handle: blogPostNode.handle,
        data: blogPostData,
      };
    }
  );

  const contentCategories =
    contentCategoriesResponse.data.metaobjects.nodes.map((node) => {
      const data = mapFieldsToObject<{
        title: string;
        description: string;
      }>(node.fields);

      const relatedStories = stories.filter(
        (story) => story.data.category === node.id
      );

      const relatedBlogPosts = blogPosts.filter(
        (blogPost) => blogPost.data.category === node.id
      );

      return {
        id: node.id,
        handle: node.handle,
        data,
        content: [...relatedBlogPosts, ...relatedStories],
      };
    });

  return contentCategories;
}

export type GetBlogPostQuery = {
  blogPostId: string;
  signal?: AbortSignal;
  image?: { maxHeight: number; maxWidth: number };
};

export async function getBlogPost({
  blogPostId,
  signal,
  image,
}: GetBlogPostQuery) {
  const blogPostResponse = await makeShopifyGraphqlRequest({
    query: getMetaObjectQuery({ id: blogPostId, image }),
    schema: getMetaObjectSchema,
    signal: signal,
  });

  if (blogPostResponse === null) {
    return null;
  }

  const blogPostNode = blogPostResponse.data.metaobject;

  const blogPostData = mapFieldsToObject<{
    title: string;
    thumbnail: string;
    category: string;
    content: string;
  }>(blogPostNode.fields);

  const blogPost = {
    id: blogPostNode.id,
    handle: blogPostNode.handle,
    data: blogPostData,
  };

  return blogPost;
}

export type Shoe = Exclude<
  Awaited<ReturnType<typeof getShoesByCollectionId>>,
  null
>[number];

interface GetShoesByIdQuery {
  shoesId: string;
  maxImageHeight: number;
  maxImageWidth: number;
  signal?: AbortSignal;
}

export type ShoesRelatedContentType = Exclude<
  MetaObjectTypes,
  "content_categories"
>;

export async function getShoesById(query: GetShoesByIdQuery) {
  const response = await makeShopifyGraphqlRequest({
    query: getProductByIdQuery({
      productId: query.shoesId,
      maxImageHeight: query.maxImageHeight,
      maxImageWidth: query.maxImageWidth,
    }),
    schema: getProductByIdSchema,
    signal: query.signal,
  });

  if (response === null) {
    return null;
  }

  const { product } = response.data;

  const modelVariant = product.metafields.find(
    (metafield) =>
      metafield && metafield.key === ShopifyMetaFieldKey.ModelVariant
  );

  const modelIsForMen = product.metafields.find(
    (metafield) =>
      metafield && metafield.key === ShopifyMetaFieldKey.ModelIsForMen
  );

  const modelDropOffsetDays = product.metafields.find(
    (metafield) =>
      metafield && metafield.key === ShopifyMetaFieldKey.ModelDropOffsetDays
  );

  const images = product.media.nodes.map(
    (node) => node.previewImage.resizedUrl
  );

  const sizes = product.variants.nodes.map((node) => ({
    id: node.id,
    label: node.title,
  }));

  const dropsAt = modelDropOffsetDays
    ? add(todayNoonUtc(), { days: parseInt(modelDropOffsetDays.value, 10) })
    : null;

  const relatedContent = product.metafields
    .find((metafield) => {
      return metafield && metafield.key === ShopifyMetaFieldKey.RelatedContent;
    })
    ?.references?.nodes.map((node) => {
      const data = mapFieldsToObject<{
        title: string;
        thumbnail: string;
        category: string;
      }>(node.fields);

      return {
        id: node.id,
        type: node.type,
        data,
      };
    });

  return {
    id: product.id,
    model: product.title,
    modelVariant: modelVariant?.value || null,
    isInStock: product.availableForSale,
    isUpcoming: !product.availableForSale,
    isForMen: modelIsForMen?.value ? modelIsForMen.value === "true" : null,
    descriptionHtml: product.descriptionHtml,
    sizes,
    sizeRange:
      sizes.length === 0
        ? null
        : {
            min: sizes[0],
            max: sizes[sizes.length - 1],
          },
    dropsAt,
    images,
    price: {
      amount: parseFloat(product.priceRange.maxVariantPrice.amount),
      currencyCode: product.priceRange.maxVariantPrice.currencyCode,
    },
    relatedContent,
  };
}

interface SearchShoesQuery {
  query: string;
  maxImageHeight: number;
  maxImageWidth: number;
  signal?: AbortSignal;
}

export async function searchShoes(query: SearchShoesQuery) {
  const response = await makeShopifyGraphqlRequest({
    query: searchProductsQuery({
      query: query.query,
      maxImageHeight: query.maxImageHeight,
      maxImageWidth: query.maxImageWidth,
    }),
    schema: searchProductsSchema,
    signal: query.signal,
  });

  if (response === null) {
    return null;
  }

  return response.data.search.nodes.map((node) => {
    const modelVariant = node.metafields.find(
      (metafield) =>
        metafield && metafield.key === ShopifyMetaFieldKey.ModelVariant
    );

    const images = node.media.nodes.map((node) => node.previewImage.resizedUrl);

    return {
      id: node.id,
      model: node.title,
      modelVariant: modelVariant?.value || null,
      previewImage: images.length === 0 ? null : images[0],
    };
  });
}

interface CreateCheckoutCommand {
  sizeId: string;
  signal?: AbortSignal;
}

export async function createCheckout(command: CreateCheckoutCommand) {
  const response = await makeShopifyGraphqlRequest({
    query: createCheckoutMutation({ variantId: command.sizeId }),
    schema: createCheckoutSchema,
    signal: command.signal,
  });

  if (response === null) {
    return null;
  }

  return {
    webUrl: response.data.checkoutCreate.checkout.webUrl,
  };
}

interface GetFeedQuery {
  maxImageHeight: number;
  maxImageWidth: number;
  page?: number;
  perPage?: number;
  cursor?: string;
  signal?: AbortSignal;
}

export type FeedBlog = {
  id: string;
  handle: string;
  type: ShopifyMetaObjectType.blogPost;
  data: {
    title: string;
    thumbnail: string;
  };
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
};

export type FeedProduct = Product & {
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  type: ShopifyMetaObjectType.product;
};

export async function getFeed(query: GetFeedQuery) {
  const response = await makeShopifyGraphqlRequest({
    query: getFeedQuery({
      maxImageHeight: query.maxImageHeight,
      maxImageWidth: query.maxImageWidth,
      page: query.page,
      cursor: query.cursor,
      perPage: query.perPage,
    }),
    schema: getFeedSchema,
    signal: query.signal,
  });

  if (response === null) {
    return null;
  }

  const itemsField = response.data.metaobject.fields?.find(({ key }) => {
    return key === ShopifyFieldKey.items;
  });

  if (!itemsField) {
    return null;
  }

  const pageInfo = itemsField.references.pageInfo;

  const items = itemsField.references.edges
    .map(({ node }) => {
      if (node.type === ShopifyMetaObjectType.blogPost) {
        const blogPostData = mapFieldsToObject<{
          title: string;
          thumbnail: string;
          //@ts-ignore
        }>(node.fields);

        return {
          id: node.id,
          type: node.type,
          data: blogPostData,
          pageInfo,
        };
      }

      if (node.type === ShopifyMetaObjectType.product) {
        const productData = mapFieldsToObject<{
          product: ProductQuery;
          //@ts-ignore
        }>(node.fields);

        console.log("product", productData);

        return {
          ...mapProduct(productData.product),
          pageInfo,
          type: node.type,
        };
      }
    })
    .filter((item) => Boolean(item)) as (FeedProduct | FeedBlog)[];

  return items;
}

export type Feed = Exclude<Awaited<ReturnType<typeof getFeed>>, null>[number];
