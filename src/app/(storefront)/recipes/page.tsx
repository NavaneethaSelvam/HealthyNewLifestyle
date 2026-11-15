import type { Metadata } from "next";
import Link from "next/link";
import { RecipesExperience } from "@/features/recipes/RecipesExperience";

export const metadata: Metadata = {
  title: "Traditional Recipes | Healthy New Lifestyle",
  description: "Recipe ideas using traditional rice, millets, and pantry ingredients.",
};

export default function RecipesPage() {
  return (
    <main className="hnl-page hnl-recipes-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Recipes</span>
        </nav>

        <RecipesExperience />
      </div>
    </main>
  );
}
