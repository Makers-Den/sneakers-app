import { z } from "zod";
import { envVariables } from "./env";
import { createNamedLogger } from "./log";
import {
  getCollectionByIdQuery,
  getCollectionByIdSchema,
} from "../queries/getCollectionById";
import dayjs from "dayjs";
import { ShopifyMetaFieldKey } from "../types/shopify";
import { todayNoonUtc } from "./time";
import {
  getProductByIdQuery,
  getProductByIdSchema,
} from "../queries/getProductByIs";

const SHOPIFY_API_VERSION = "2023-10";
const SHOPIFY_GRAPHQL_ENDPOINT = `https://${envVariables.shopify.storeDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`;

const logger = createNamedLogger("Shopify");

async function makeShopifyGraphqlRequest<T extends z.ZodTypeAny>(
  query: string,
  schema: T
): Promise<z.infer<T>> {
  try {
    const response = await fetch(SHOPIFY_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          envVariables.shopify.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
      }),
    });

    const jsonResponse = await response.json();
    const parsedResponse = schema.parse(jsonResponse);

    return parsedResponse;
  } catch (error) {
    logger.error("Making shopify graphql request failed", query, error);

    throw error;
  }
}

interface GetSneakersByCollectionIdQuery {
  collectionId: string;
}

export async function getSneakersByCollectionId(
  query: GetSneakersByCollectionIdQuery
) {
  const response = await makeShopifyGraphqlRequest(
    getCollectionByIdQuery({ collectionId: query.collectionId }),
    getCollectionByIdSchema
  );

  const sneakers = response.data.collection.products.edges.map((edge) => {
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

    const images = edge.node.media.nodes.map((node) => node.previewImage.url);

    const sizes = edge.node.variants.nodes.map((node) => ({
      id: node.id,
      name: node.title,
    }));

    const dropsAt = modelDropOffsetDays
      ? dayjs(todayNoonUtc())
          .add(parseInt(modelDropOffsetDays.value, 10), "day")
          .toDate()
      : null;

    return {
      id: edge.node.id,
      model: edge.node.title,
      modelVariant: modelVariant?.value || null,
      isInStock: edge.node.availableForSale,
      isUpcoming: !edge.node.availableForSale,
      isForMen: modelIsForMen?.value ? modelIsForMen.value === "true" : null,
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
        amount: edge.node.priceRange.maxVariantPrice.amount,
        currencyCode: edge.node.priceRange.maxVariantPrice.currencyCode,
      },
    };
  });

  return sneakers;
}

interface GetSneakersByIdQuery {
  sneakersId: string;
}

export async function getSneakersById(query: GetSneakersByIdQuery) {
  const response = await makeShopifyGraphqlRequest(
    getProductByIdQuery({ productId: query.sneakersId }),
    getProductByIdSchema
  );

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

  const images = product.media.nodes.map((node) => node.previewImage.url);

  const sizes = product.variants.nodes.map((node) => ({
    id: node.id,
    name: node.title,
  }));

  const dropsAt = modelDropOffsetDays
    ? dayjs(todayNoonUtc())
        .add(parseInt(modelDropOffsetDays.value, 10), "day")
        .toDate()
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
      amount: product.priceRange.maxVariantPrice.amount,
      currencyCode: product.priceRange.maxVariantPrice.currencyCode,
    },
  };
}
