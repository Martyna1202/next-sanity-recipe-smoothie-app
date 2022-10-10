import { createClient, createPreviewSubscriptionHook } from "next-sanity";

import createImageUrlBuilder from "@sanity/image-url";

const config = {
  projectId: "m06n8ajn",
  dataset: "production",
  apiVersion: "2021-10-21",
  useCdn: true,
};

export const sanityClient = createClient(config);

export const previewClient = createClient({
  ...config,
  token: process.env.SANITY_WRITE_TOKEN,
});

// Helper function to easily switch between normal client and preview client
export const getClient = (usePreview) =>
  usePreview ? previewClient : sanityClient;

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);
