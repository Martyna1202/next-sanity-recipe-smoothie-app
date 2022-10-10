import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { groq } from "next-sanity";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

import {
  sanityClient,
  urlFor,
  usePreviewSubscription,
  getClient,
} from "../../lib/sanity";

const recipesQuery = groq`
    *[_type == 'recipe' && slug.current == $slug][0]{
        _id,
        name,
        "slug": slug.current,
        mainImage,
        ingredient[]{
            _key,
            unit,
            wholeNumber,
            fraction,
            ingredient->{
                name
            }
        },
        instructions, 
        likes
    }
`;

export default function OneRecipe({ data, preview }) {
  const [likes, setLikes] = useState(data?.recipe?.likes);

  const router = useRouter();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const addLike = async () => {
    const res = await fetch("/api/handle-likes", {
      method: "POST",
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((error) => console.log(error));

    const data = await res.json();

    setLikes(data.likes);
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { recipe } = data;

  return data ? (
    <article className="recipe">
      <h1>{recipe.name}</h1>

      <button onClick={addLike} className="like-button">
        {likes} likes
      </button>
      <main className="content">
        <Image
          src={urlFor(recipe?.mainImage).width(225).height(225).url()}
          width="225px"
          height="225px"
          alt={recipe.name}
        />
        <div className="breakdown">
          <ul className="ingredients">
            {recipe.ingredient?.map((ingredient) => (
              <li key={ingredient._key} className="ingredient">
                {ingredient?.wholeNumber}
                {ingredient?.fraction} {ingredient?.unit}
                <br />
                {ingredient?.ingredient.name}
              </li>
            ))}
          </ul>

          <PortableText value={data?.recipe?.instructions} />
        </div>
      </main>
    </article>
  ) : null;
}

export async function getStaticProps({ params, preview = false }) {
  // knowing what's inside the paths = content

  const recipe = await getClient(preview).fetch(recipesQuery, {
    slug: params.slug,
  });
  return {
    props: {
      data: { recipe },
      preview,
    },
  };
}
export async function getStaticPaths() {
  // knowing every path

  const paths = await getClient().fetch(
    groq`*[_type == 'recipe' && defined(slug.current)][].slug.current`
  );
  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}
