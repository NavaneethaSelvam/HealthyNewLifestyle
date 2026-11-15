import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { recipes } from "@/features/recipes/recipes-data";
import { RecipeDetailExperience } from "@/features/recipes/RecipeDetailExperience";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = recipes.find((item) => item.id === slug);
  return {
    title: recipe ? `${recipe.title} | Healthy New Lifestyle` : "Recipe Not Found",
    description: recipe?.summary ?? "Explore traditional recipes.",
  };
}

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="hnl-page">
          <div className="hnl-container hnl-loading-state" role="status">
            <p>Loading recipe…</p>
          </div>
        </main>
      }
    >
      <RecipeDetailContent params={params} />
    </Suspense>
  );
}

async function RecipeDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = recipes.find((item) => item.id === slug);
  if (!recipe) notFound();

  return <RecipeDetailExperience recipe={recipe} />;
}
