import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { sanityClient, urlFor } from '../lib/sanity';
import recipe from '../studio/schemas/recipe';
// import Image from 'next/image'

const recipesQuery = `*[_type == 'recipe']{
  _id,
  name,
  slug,
  mainImage,
}`;

export default function Home({ recipes }) {


  return (
    <div>
      <Head>
        <title>Martynas recipe app</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome to Martyna's first recipe app</h1>

      <ul className='recipes-list'>
        {recipes?.length > 0 && 
          recipes.map((recipe)=>(
            <li key={recipe._id} className='recipe-card'>
              <Link href={`/recipes/${recipe.slug.current}`}>
                <a>
                  <Image src={urlFor(recipe.mainImage).width(225).height(225).url()} width="225px" height="225px" alt={recipe.name} />
                  <span>{recipe.name}</span>
                </a>
              </Link>
            </li>
            ))}
      </ul>
      
    </div>
  )
}


export async function getStaticProps() {
  const recipes = await sanityClient.fetch(recipesQuery);
  return { props: { recipes } }
}