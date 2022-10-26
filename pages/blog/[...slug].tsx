import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import client from "../../.tina/__generated__/client";

const BlogPage = (props) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <>
      <div>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h1 className="text-3xl m-8 text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {data.post?.title}
          </h1>

          <TinaMarkdown content={data.post?.body} />
        </div>
      </div>
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const relativePath = composeSlug(params.slug);
  let data = {};
  let query = {};
  let variables = { relativePath: `${relativePath}.mdx` };
  try {
    const res = await client.queries.post(variables);
    query = res.query;
    data = res.data;
    variables = res.variables;
  } catch {
    // swallow errors related to document creation
  }

  return {
    props: {
      variables: variables,
      data: data,
      query: query,
      //myOtherProp: 'some-other-data',
    },
  };
};

export const getStaticPaths = async () => {
  const postsList = await postConn();
  console.log(postsList);

  return {
    paths: postsList.map((post) => {
      return {
        params: {
          slug: post?._sys.breadcrumbs,
        },
      };
    }),
    fallback: false,
  };
};

export const composeSlug = (slug: string[]) => {
  const lastStringSlug = slug[slug.length - 1];
  const restStringSlug = slug.slice(0, slug.length - 1).join("/");
  return restStringSlug
    ? `${restStringSlug}/${lastStringSlug}`
    : lastStringSlug;
};

export const postConn = async () =>
  (await (
    await client.queries.postConnection()
  ).data.postConnection.edges?.map((edge) => edge?.node)) || [];

export default BlogPage;
