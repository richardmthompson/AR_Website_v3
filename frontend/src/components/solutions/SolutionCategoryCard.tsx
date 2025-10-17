import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SolutionCategory } from "@/data/edtech-solutions";
import * as Icons from "lucide-react";
import { XCircle, CheckCircle2, ChevronDown } from "lucide-react";

interface SolutionCategoryCardProps {
  category: SolutionCategory;
}

export default function SolutionCategoryCard({ category }: SolutionCategoryCardProps) {
  const Icon = Icons[category.icon as keyof typeof Icons] || Icons.Box;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="p-8 border-2 border-border hover:border-primary hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      {/* Icon with custom color background */}
      <div className={`inline-flex p-4 rounded-lg ${category.color} text-white mb-4 w-fit`}>
        {/* @ts-ignore - Dynamic icon from string */}
        <Icon className="w-8 h-8" />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
        {category.title}
      </h3>

      {/* Context - Prominent */}
      {category.context && (
        <p className="text-base text-foreground leading-relaxed mb-6">
          {category.context}
        </p>
      )}

      {/* Sample Solution Hook - HIGHLIGHTED */}
      {category.sampleSolutionHook && (
        <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-r-4 border-primary mb-6">
          <p className="font-semibold text-primary mb-2 text-sm uppercase tracking-wide">Sample Solution</p>
          <p className="text-sm text-foreground mb-3">{category.sampleSolutionHook.setup}</p>
          <p className="text-xl font-bold text-primary my-3">
            {category.sampleSolutionHook.result}
          </p>
          <p className="text-sm italic text-muted-foreground">{category.sampleSolutionHook.whyItWins}</p>
        </div>
      )}

      {/* ROI metric */}
      <div className="p-3 bg-accent-cream/50 rounded-lg border border-primary/20 mb-4">
        <p className="text-primary font-semibold text-sm">✨ {category.roiMetric}</p>
      </div>

      {/* Target audience badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {category.targetAudience.map((audience, idx) => (
          <Badge key={idx} variant="secondary">{audience}</Badge>
        ))}
      </div>

      {/* Honest Disclosure - Collapsible */}
      {(category.cannotSolve || category.canSolve) && (
        <Accordion type="single" collapsible className="mb-4">
          {category.cannotSolve && (
            <AccordionItem value="cannot-solve" className="border-destructive/20">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <span className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  What We Can't Solve
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 mt-2">
                  {category.cannotSolve.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {category.canSolve && (
            <AccordionItem value="can-solve" className="border-primary/20">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  What We Can Solve
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 mt-2">
                  {category.canSolve.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}

      {/* Expandable details section */}
      <div className="mt-auto">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-primary hover:underline flex items-center gap-1 mb-3"
        >
          {showDetails ? "Hide" : "Show"} technical details
          <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
        </button>

        {showDetails && (
          <div className="space-y-4 border-t pt-4">
            {/* Key features list */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
              <ul className="space-y-2">
                {category.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use cases */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Example Use Cases:</h4>
              <ul className="space-y-2">
                {category.useCases.slice(0, 3).map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
