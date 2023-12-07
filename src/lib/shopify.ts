import { z } from "zod";
import dayjs from "dayjs";
import { ShopifyMetaFieldKey } from "@/types/shopify";
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
    const modelVariant = edge.node.metafields.find(
      (metafield) =>
        metafield && metafield.key === ShopifyMetaFieldKey.ModelVariant
    );

    const modelIsForMen = edge.node.metafields.find(
      (metafield) =>
        metafield && metafield.key === ShopifyMetaFieldKey.ModelIsForMen
    );

    const modelDropOffsetDays = edge.node.metafields.find(
      (metafield) =>
        metafield && metafield.key === ShopifyMetaFieldKey.ModelDropOffsetDays
    );

    const images = edge.node.media.nodes.map(
      (node) => node.previewImage.resizedUrl
    );

    const sizes = edge.node.variants.nodes.map((node) => ({
      id: node.id,
      label: node.title,
    }));

    const dropsAt = modelDropOffsetDays
      ? add(todayNoonUtc(), { days: parseInt(modelDropOffsetDays.value, 10) })
      : null;

    return {
      id: edge.node.id,
      model: edge.node.title,
      modelVariant: modelVariant?.value || null,
      isInStock: edge.node.availableForSale,
      isUpcoming: !edge.node.availableForSale,
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
        amount: parseFloat(edge.node.priceRange.maxVariantPrice.amount),
        currencyCode: edge.node.priceRange.maxVariantPrice.currencyCode,
      },
      pageInfo,
    };
  });

  return shoes;
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
