import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { solutionCategories } from "@/lib/edtech-solutions";
import SolutionCategoryCard from "./SolutionCategoryCard";

const filters = [
  { label: 'All Solutions', value: 'all' },
  { label: 'EdTech Companies', value: 'edtech' },
  { label: 'Universities', value: 'universities' },
  { label: 'School Networks', value: 'schools' },
  { label: 'Publishers', value: 'publishers' },
  { label: 'VCs & Investors', value: 'vcs' },
];

export default function SolutionCategoryGrid() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Use useMemo to avoid re-filtering on every render
  const filteredCategories = useMemo(() => {
    if (activeFilter === "all") return solutionCategories;

    return solutionCategories.filter(category =>
      category.targetAudience.some(audience =>
        audience.toLowerCase() === activeFilter.toLowerCase()
      )
    );
  }, [activeFilter]);

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Grid of solution cards */}
      <div className="grid lg:grid-cols-2 gap-8">
        {filteredCategories.map((category) => (
          <SolutionCategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* Show message if no results */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No solutions found for this category. Try a different filter.
          </p>
        </div>
      )}
    </div>
  );
}
