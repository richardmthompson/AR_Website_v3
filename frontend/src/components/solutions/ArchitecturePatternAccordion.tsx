import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { architecturePatterns } from "@/data/edtech-solutions";

export default function ArchitecturePatternAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {architecturePatterns.map((pattern) => (
        <AccordionItem
          key={pattern.id}
          value={pattern.id}
          className="border-2 border-border rounded-lg px-6"
        >
          <AccordionTrigger className="text-xl font-bold hover:text-primary">
            {pattern.title}
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <p className="text-muted-foreground mb-6">{pattern.description}</p>

            {/* Architecture flow with numbered steps */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Architecture Flow:</h4>
              <div className="space-y-3">
                {pattern.architectureFlow.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-sm pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Use cases in a grid */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Use Cases:</h4>
              <ul className="grid md:grid-cols-2 gap-2">
                {pattern.useCases.map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical components as badges */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2 text-sm">Technical Stack:</h4>
              <div className="flex flex-wrap gap-2">
                {pattern.technicalComponents.map((component, idx) => (
                  <Badge key={idx} variant="outline">
                    {component}
                  </Badge>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
