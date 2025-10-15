// frontend/src/lib/team-data.ts

export interface TeamMember {
  id: string;
  name: string;
  title: {
    en: string;
    de: string;
  };
  bio: {
    en: string;
    de: string;
  };
  image: string;  // Path to image in public/assets/images/team/
  credentials: {
    en: string[];
    de: string[];
  };
  expertise: {
    en: string[];
    de: string[];
  };
  linkedin?: string;
  email?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'richard-thompson',
    name: 'Richard Thompson',
    title: {
      en: 'Founder, AI Engineer & Automation Architect',
      de: 'Gründer, KI-Ingenieur & Automatisierungsarchitekt',
    },
    bio: {
      en: 'Richard designs and builds the intelligent systems that power AR Automation\'s client solutions - from web platforms to voice-driven mobile applications. With a background in Cognitive Science (First Class Honours, University of Exeter) including research collaboration with Prof. J.L. McClelland at Carnegie Mellon University, he brings both rigorous academic training and practical understanding of how organizations work. Richard\'s context engineering framework has achieved 85-95% first-pass completion rates in AI-assisted development, transforming how AR Automation builds client solutions.',
      de: 'Richard entwirft und entwickelt die intelligenten Systeme, die die Kundenlösungen von AR Automation antreiben - von Webplattformen bis hin zu sprachgesteuerten mobilen Anwendungen. Mit einem Hintergrund in Kognitionswissenschaft (First Class Honours, University of Exeter) einschließlich Forschungszusammenarbeit mit Prof. J.L. McClelland an der Carnegie Mellon University bringt er sowohl rigorose akademische Ausbildung als auch praktisches Verständnis dafür mit, wie Organisationen funktionieren. Richards Context-Engineering-Framework hat 85-95% Erstdurchlauf-Erfolgsraten in der KI-gestützten Entwicklung erreicht und verändert, wie AR Automation Kundenlösungen entwickelt.',
    },
    image: '/assets/images/team/richard-thompson.jpg',
    credentials: {
      en: [
        'BSc Cognitive Science, First Class Honours',
        'Carnegie Mellon University Internship',
        'Published Researcher (Developmental Science, 2007)',
      ],
      de: [
        'BSc Kognitionswissenschaft, First Class Honours',
        'Carnegie Mellon University Praktikum',
        'Veröffentlichter Forscher (Developmental Science, 2007)',
      ],
    },
    expertise: {
      en: [
        'Agentic AI',
        'LangGraph',
        'Python/FastAPI',
        'React/TypeScript',
        'Voice AI',
        'Context Engineering',
      ],
      de: [
        'Agentic AI',
        'LangGraph',
        'Python/FastAPI',
        'React/TypeScript',
        'Voice AI',
        'Context Engineering',
      ],
    },
    linkedin: 'https://www.linkedin.com/in/richardmthompsoncognitivescientist/',
    email: 'richard@arlabs.tech',
  },
  {
    id: 'adam-konopka',
    name: 'Adam Konopka',
    title: {
      en: 'Founder, AI Engineer & Senior Developer',
      de: 'Gründer, KI-Ingenieur & Senior Developer',
    },
    bio: {
      en: 'Adam is a freelance web developer based in Berlin, Germany, bringing extensive full-stack expertise to AR Automation\'s client projects. With a strong foundation from Technische Universität Berlin and deep experience in e-commerce solutions, he specializes in building scalable web applications across diverse industries including accounting, education, and e-commerce. Known for his proactive problem-solving approach and team-oriented mindset, Adam excels at rapidly adapting modern frameworks to deliver robust automation solutions that meet complex business requirements. His multilingual capabilities (German, English, Polish) enable seamless collaboration with international clients.',
      de: 'Adam ist ein freiberuflicher Webentwickler mit Sitz in Berlin, Deutschland, der umfangreiche Full-Stack-Expertise in die Kundenprojekte von AR Automation einbringt. Mit einer soliden Grundlage von der Technischen Universität Berlin und umfangreicher Erfahrung in E-Commerce-Lösungen spezialisiert er sich auf den Aufbau skalierbarer Webanwendungen in verschiedenen Branchen, darunter Rechnungswesen, Bildung und E-Commerce. Bekannt für seinen proaktiven Problemlösungsansatz und seine teamorientierte Denkweise, zeichnet sich Adam durch die schnelle Anpassung moderner Frameworks aus, um robuste Automatisierungslösungen zu liefern, die komplexe Geschäftsanforderungen erfüllen. Seine mehrsprachigen Fähigkeiten (Deutsch, Englisch, Polnisch) ermöglichen eine nahtlose Zusammenarbeit mit internationalen Kunden.',
    },
    image: '/assets/images/team/adam-konopka.jpg',
    credentials: {
      en: [
        'Technische Universität Berlin (2018-2023)',
        'Freelance Web Developer',
        'E-commerce specialist (Shopware, full-stack solutions)',
        'Multilingual: German, English, Polish',
      ],
      de: [
        'Technische Universität Berlin (2018-2023)',
        'Freiberuflicher Webentwickler',
        'E-Commerce-Spezialist (Shopware, Full-Stack-Lösungen)',
        'Mehrsprachig: Deutsch, Englisch, Polnisch',
      ],
    },
    expertise: {
      en: [
        'Vue.js',
        'Node.js',
        'PHP',
        'SQL',
        'Shopware',
        'E-commerce Solutions',
      ],
      de: [
        'Vue.js',
        'Node.js',
        'PHP',
        'SQL',
        'Shopware',
        'E-Commerce-Lösungen',
      ],
    },
    linkedin: 'https://www.linkedin.com/in/adam-konopka-738b35184/',
    email: 'adam@arlabs.tech',
  },
];
