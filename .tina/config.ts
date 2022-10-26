import { defaultConfig } from "next/dist/server/config-shared";
import { defineSchema, defineConfig, defineStaticConfig } from "tinacms";
import { client } from "./__generated__/client";

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export const kebabCase = (str: any) =>
  // remove title case
  str &&
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x: any) => x.toLowerCase())
    .join("-");

export const composeSlug = (slug: string[]) => {
  const lastStringSlug = slug[slug.length - 1];
  const restStringSlug = slug.slice(0, slug.length - 1).join("/");
  return restStringSlug
    ? `${restStringSlug}/${lastStringSlug}`
    : lastStringSlug;
};

export const categories = [
  "general",
  "bookmarks",
  "chuletas",
  "herramientas",
  "javascript",
  "linux",
  "react",
  "otros",
];

export const generic = ["personal", "bookmarks", "chuletas"];

export const so = ["linux", "ubuntu", "terminal", "bash", "touchpad"];
export const db = ["mongodb"];

export const tools = ["git", "github", "vscode", "firefox"];

export const react = ["react", "hooks", "hoc"];

export const javascript = [
  "javascript",
  "typescript",
  "es6",
  "ajax",
  "fetch",
  "promises",
  "jquery",
  "async-await",
  "spread",
  "destructuring",
];

export const node = ["nvm", "nodejs", "npm", "yarn"];

export const tagOptions = [
  ...generic,
  ...so,
  ...db,
  ...tools,
  ...javascript,
  ...node,
  ...react,
];

export const tagsSearcher = [
  ...so,
  ...db,
  ...tools,
  ...javascript,
  ...node,
  ...react,
];

const config = defineStaticConfig({
  schema: {
    collections: [
      {
        label: "Blog Posts",
        name: "post",
        path: "content/posts",
        format: "mdx",
        ui: {
          filename: {
            readonly: true,
            slugify({ category, title }) {
              return `${kebabCase(category)}/${kebabCase(title)}`;
            },
          },
          router({ document }) {
            return `/blog/${composeSlug(document._sys.breadcrumbs)}`;
          },
        },
        defaultItem: {
          title: "New Post",
          tags: {
            options: "",
          },
          category: categories[0],
          body: "",
          draft: true,
          featured: false,
          publishedAt: new Date().toISOString(),
        },
        fields: [
          {
            type: "string",
            label: "Title",
            name: "title",
          },
          {
            name: "summary",
            label: "Summary",
            type: "string",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            label: "Category",
            name: "category",
            options: categories,
          },
          {
            name: "tags",
            label: "Tags",
            type: "object",
            fields: [
              {
                type: "string",
                label: "Options",
                name: "options",
                list: true,
                options: tagOptions,
              },
            ],
          },
          {
            type: "rich-text",
            label: "Blog Post Body",
            name: "body",
            isBody: true,
          },
          {
            label: "Related Posts",
            name: "relatedPosts",
            type: "object",
            fields: [
              {
                type: "reference",
                label: "Post One",
                name: "postOne",
                collections: ["post"],
              },
              {
                type: "reference",
                label: "Post Two",
                name: "postTwo",
                collections: ["post"],
              },
              {
                type: "reference",
                label: "Post Three",
                name: "postThree",
                collections: ["post"],
              },
            ],
          },
          {
            type: "boolean",
            label: "Featured",
            name: "featured",
          },
          {
            type: "boolean",
            label: "Draft",
            name: "draft",
          },
          {
            type: "datetime",
            label: "Published Date",
            name: "publishedAt",
          },
        ],
      },
    ],
  },
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch,
  token: process.env.TINA_TOKEN!,
  build: {
    publicFolder: "public",
    outputFolder: "admin",
  },
});

export default config;
