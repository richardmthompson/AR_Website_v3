import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

// Initialize mermaid with custom configuration
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
    nodeSpacing: 35,
    rankSpacing: 40,
  },
});

export default function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const renderDiagram = async () => {
      if (containerRef.current && chart) {
        try {
          // Clear previous content
          containerRef.current.innerHTML = '';

          // Use mermaid.render with unique ID for each diagram
          const { svg } = await mermaid.render(`diagram-${uniqueId}`, chart);

          // Insert the rendered SVG
          containerRef.current.innerHTML = svg;

          // Scale the SVG to fit the container
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            // Remove fixed dimensions and let it scale based on viewBox
            const width = svgElement.getAttribute('width');
            const height = svgElement.getAttribute('height');

            // Set viewBox if not already set
            if (!svgElement.getAttribute('viewBox') && width && height) {
              svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
            }

            // Remove fixed dimensions and set to 100%
            svgElement.removeAttribute('width');
            svgElement.removeAttribute('height');
            svgElement.style.width = '100%';
            svgElement.style.height = '100%';
            svgElement.style.maxHeight = '700px';
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          containerRef.current.innerHTML = '<p class="text-destructive text-sm">Error rendering diagram</p>';
        }
      }
    };

    renderDiagram();
  }, [chart, uniqueId]);

  return (
    <div
      ref={containerRef}
      className="mermaid-container w-full p-3 bg-white rounded-lg border border-border overflow-auto flex items-start justify-center"
      style={{ minHeight: '200px', maxHeight: '750px' }}
    />
  );
}
