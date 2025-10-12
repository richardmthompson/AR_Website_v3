import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prospectSolutions } from "@/lib/edtech-solutions";
import { MapPin, TrendingUp, CheckCircle2 } from "lucide-react";

const organizationTypes = [
  { label: "All", value: "all" },
  { label: "EdTech", value: "EdTech Platform" },
  { label: "Schools", value: "School" },
  { label: "Finance", value: "Finance" },
  { label: "Publishers", value: "Publisher" },
  { label: "Consulting", value: "Consulting" },
];

export default function ProspectSolutionTabs() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-8">
        {organizationTypes.map((type) => (
          <TabsTrigger key={type.value} value={type.value}>
            {type.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {organizationTypes.map((type) => {
        const filteredSolutions = type.value === "all"
          ? prospectSolutions
          : prospectSolutions.filter(sol =>
              sol.organizationType.includes(type.value)
            );

        return (
          <TabsContent key={type.value} value={type.value} className="space-y-6">
            {filteredSolutions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No solutions available for this category yet.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredSolutions.map((solution) => (
                  <Card key={solution.id} className="p-6 hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2">{solution.organization}</h3>
                      <Badge variant="secondary" className="mb-2">
                        {solution.organizationType}
                      </Badge>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {solution.geography}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {solution.scale}
                        </div>
                      </div>
                    </div>

                    {/* Problem */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-destructive mb-2">Problem:</h4>
                      <p className="text-sm">{solution.problem}</p>
                    </div>

                    {/* Technical Implementation */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-primary mb-2">
                        Technical Implementation:
                      </h4>
                      <ul className="space-y-2">
                        {solution.technicalImplementation.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Time Savings */}
                    <div className="p-3 bg-accent-cream/50 rounded-lg mb-4">
                      <p className="text-primary font-semibold text-sm">
                        ⚡ {solution.timeSavings}
                      </p>
                    </div>

                    {/* Value Pitch */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Value Pitch:</h4>
                      <p className="text-sm text-muted-foreground">{solution.valuePitch}</p>
                    </div>

                    {/* Solution Models (if available) */}
                    {solution.solutionModels && solution.solutionModels.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <h4 className="text-sm font-semibold mb-2">Multiple Solution Models:</h4>
                        <ul className="space-y-1">
                          {solution.solutionModels.map((model, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{model}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
