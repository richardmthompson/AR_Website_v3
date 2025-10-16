// EdTech Solutions Data
// Source: EdTech-Technical-Solution-Mapping.md and EdTech-Conference-Strategy-INTEGRATED.md

export interface TechnicalCapability {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
  features: string[];
  useCases: string[];
}

export interface SolutionCategory {
  id: string;
  title: string;
  description: string;
  industryContext?: string; // Current industry challenge/trend context
  targetAudience: string[];  // ['EdTech', 'Universities', 'Schools', 'Publishers', 'VCs']
  roiMetric: string;
  keyFeatures: string[];
  useCases: string[];
  icon: string;  // lucide-react icon name
  color: string; // Tailwind color class

  // New fields from PRP for website-ready content
  context?: string; // 2-3 sentence industry challenge (replaces/supplements description)
  cannotSolve?: string[]; // What we don't solve (honest disclosure)
  canSolve?: string[]; // What we do solve (clear capabilities)
  sampleSolutionHook?: {
    setup: string; // The problem/scenario intro
    result: string; // Bold metric-driven result
    whyItWins: string; // Why this matters to the customer
  };
}

export interface ArchitecturePattern {
  id: string;
  title: string;
  description: string;
  architectureFlow: string[];
  useCases: string[];
  technicalComponents: string[];
  mermaidDiagram?: string; // Optional Mermaid diagram definition
}

export interface ProspectSolution {
  id: string;
  organization: string;
  organizationType: string;
  geography: string;
  scale: string;
  problem: string;
  technicalImplementation: string[];
  timeSavings: string;
  valuePitch: string;
  solutionModels?: string[];
}

// Technical Capabilities Data
export const technicalCapabilities: TechnicalCapability[] = [
  {
    id: 'agentic-ai',
    name: 'Agentic AI',
    description: 'AI agents that autonomously execute multi-step workflows with context-aware decision making',
    icon: 'Brain',
    features: [
      'Conversational AI (chatbots, voice assistants)',
      'Document processing (OCR, extraction, validation)',
      'Multilingual operations across 50+ languages',
      'Context-aware automation with memory',
      'Complex decision-making workflows'
    ],
    useCases: [
      'Student registration (multilingual, international)',
      'Financial aid application processing',
      'Accreditation documentation preparation',
      'Transcript and credential processing',
      'Parent and student communication systems'
    ]
  },
  {
    id: 'n8n-automation',
    name: 'n8n Workflow Automation',
    description: 'Visual workflow builder connecting 400+ systems with custom API integrations',
    icon: 'Link2',
    features: [
      'System integration (SIS, LMS, CRM, payment processors)',
      'Data synchronization across platforms',
      'Schedule-based and trigger-based automation',
      'Event-driven workflows',
      'ETL (Extract, Transform, Load) operations'
    ],
    useCases: [
      'Connecting legacy systems to modern tools',
      'Multi-campus data consolidation',
      'Real-time enrollment updates across systems',
      'Automated reporting and analytics pipelines',
      'Payment gateway integration'
    ]
  },
  {
    id: 'combined-power',
    name: 'Combined Power',
    description: 'Intelligence + Integration = transformative automation that actually works with your existing infrastructure',
    icon: 'Zap',
    features: [
      'Smart document processing with system updates',
      'Intelligent workflow orchestration',
      'End-to-end automation workflows',
      'Scalable infrastructure ready for growth',
      'Human-in-the-loop for critical decisions'
    ],
    useCases: [
      'Complete admissions workflow (application → decision → enrollment)',
      'Financial aid processing with system synchronization',
      'Multi-system credential issuance and verification',
      'Automated compliance reporting across jurisdictions',
      'International student lifecycle management'
    ]
  }
];

// Solution Categories Data
export const solutionCategories: SolutionCategory[] = [
  {
    id: 'skills-credentials',
    title: 'Skills & Credentials Infrastructure',
    description: 'Automated credential issuance, verification, and portability for executive education, alternative credentials, and skills-based programs',
    targetAudience: ['Universities', 'EdTech', 'Assessment'],
    roiMetric: 'Credential processing: 3 days → 15 minutes',
    keyFeatures: [
      'Automated digital credential issuance',
      'Digital badge creation and management',
      'Verification workflows for employers',
      'Skills framework automation',
      'Competency mapping for career guidance'
    ],
    useCases: [
      'Executive education certificates (corporate L&D partnerships)',
      'Alternative credential programs for equity initiatives',
      'Skills-to-employment matching at scale',
      'Language proficiency certificates (TOEIC/TOEFL)',
      'Micro-credentials and continuing education'
    ],
    icon: 'Award',
    color: 'bg-vertical-education',
    context: 'Universities and EdTech platforms are launching micro-credential programs as education shifts from degrees to skills-based learning. The challenge isn\'t creating credential programs—it\'s issuing, verifying, and managing credentials at scale. Manual processes that worked for 100 annual degrees collapse at 1,000+ monthly micro-credentials.',
    cannotSolve: [
      'Credential frameworks or skills taxonomies',
      'Employer recognition of micro-credentials',
      'Quality assurance standards'
    ],
    canSolve: [
      'Automate credential issuance (application → assessment → digital badge)',
      'Build employer verification APIs',
      'Skills taxonomy mapping across frameworks'
    ],
    sampleSolutionHook: {
      setup: 'Universities spend 3 days per credential using manual processes. We automate the workflow: students complete requirements → system verifies → digital badge auto-generates → credential pushes to wallet → employer verification API enables instant checking.',
      result: '3 days → 15 minutes per credential',
      whyItWins: 'It\'s the most obvious bottleneck. Institutions can\'t scale from 100 to 1,000 credentials without automation. This is the "easy yes" that unlocks their program launch.'
    }
  },
  {
    id: 'ai-integration-compliance',
    title: 'AI Integration & Compliance Infrastructure',
    description: 'Complete AI infrastructure for scaling EdTech companies: model integration, compliance automation, and quality control',
    targetAudience: ['EdTech', 'Publishers'],
    roiMetric: '30-40% of engineering time freed for product development',
    keyFeatures: [
      'AI model integration and orchestration',
      'Compliance automation (FERPA, GDPR, local regulations)',
      'Quality control and monitoring',
      'Multilingual AI deployment',
      'AI-powered content generation and QA'
    ],
    useCases: [
      'AI-powered test prep platforms (multilingual)',
      'Adaptive learning content delivery',
      'AI tutor matching and quality assurance',
      'Digital curriculum production with AI QA',
      'Teacher training program automation'
    ],
    icon: 'Shield',
    color: 'bg-vertical-accounting',
    context: 'AI in education is growing rapidly, with 57% of institutions prioritizing AI integration. Small EdTech companies need to integrate AI (chatbots, grading, personalization) but lack dedicated AI teams. Meanwhile, FERPA, GDPR, and state-level AI regulations require extensive compliance documentation.',
    cannotSolve: [
      'AI strategy or feature decisions',
      'Building AI models from scratch',
      'Creating ethical AI frameworks'
    ],
    canSolve: [
      'Automate FERPA/GDPR compliance documentation',
      'Optimize LLM API costs (model routing, RAG)',
      'Build monitoring dashboards and automated testing'
    ],
    sampleSolutionHook: {
      setup: 'EdTech companies waste 30-40% of engineering time building AI infrastructure. We provide plug-and-play AI operations: compliance auto-generates, costs optimize automatically, monitoring shows what\'s happening.',
      result: 'Engineers build features, not infrastructure. Savings: $100K-$300K in engineering time',
      whyItWins: 'Engineering time is the most expensive resource for startups. Clear ROI: stop spending 40% on infrastructure, redirect to revenue-driving features.'
    }
  },
  {
    id: 'assessment-automation',
    title: 'Assessment Automation Platform',
    description: 'End-to-end assessment workflow automation from test administration to scoring, reporting, and credential issuance',
    targetAudience: ['Assessment', 'Universities', 'EdTech'],
    roiMetric: 'Assessment administration: 70% cost reduction per test',
    keyFeatures: [
      'Automated test center operations',
      'Online and hybrid proctoring support',
      'Scoring workflow automation',
      'Multi-country assessment coordination',
      'Certificate and credential issuance'
    ],
    useCases: [
      'Institutional language testing (TOEIC/TOEFL)',
      'English proficiency assessment at scale',
      'Skills assessment for career platforms',
      'Assessment data collection across districts',
      'Standardized testing coordination'
    ],
    icon: 'ClipboardCheck',
    color: 'bg-vertical-ecommerce',
    context: 'The testing market is growing toward $20B by 2033, with 67% of K-12 institutions going digital-first. However, assessment doesn\'t scale with humans—growing from 10,000 to 100,000 assessments means hiring 10x more evaluators. Manual portfolio assessment and multi-location coordination require extensive manual logistics.',
    cannotSolve: [
      'Assessment design or rubric creation',
      'Replacing human expertise on complex evaluations',
      'Formative vs. summative strategy'
    ],
    canSolve: [
      'AI-assisted scoring with human-in-the-loop',
      'Automated portfolio collection and organization',
      'Test administration workflow automation'
    ],
    sampleSolutionHook: {
      setup: 'Assessment organizations face a choice: grow slowly (limited by evaluator hiring) or compromise quality. We provide a third option: AI pre-scores essays and portfolios; humans review and approve. AI handles 80% of clear cases; humans focus on the 20% requiring expertise.',
      result: 'Scale 10x without proportional hiring. Cost per assessment drops 70%',
      whyItWins: 'Solves the growth bottleneck immediately. Organizations can accept more clients today without evaluator capacity concerns. Revenue-unlocking automation.'
    }
  },
  {
    id: 'edtech-product-operations',
    title: 'EdTech Product Operations Infrastructure',
    description: 'Operational automation for scaling EdTech companies: customer onboarding, integrations, support, and partnership management',
    targetAudience: ['EdTech'],
    roiMetric: 'Customer onboarding: 6 weeks → 1 week',
    keyFeatures: [
      'Automated customer onboarding workflows',
      'Pre-built SIS/LMS integrations',
      'Multi-country operations standardization',
      'Support chatbot (tier 1/2 automation)',
      'University partnership management'
    ],
    useCases: [
      'University onboarding for campus operations platforms',
      'Regional expansion (multi-country rollout)',
      'School district customer onboarding',
      'Tutor marketplace operations at scale',
      'B2B EdTech partnership coordination'
    ],
    icon: 'Briefcase',
    color: 'bg-vertical-education',
    context: 'EdTech companies securing Series A funding hit operational bottlenecks: onboarding new school districts takes 4-6 weeks. Each district uses different SIS/LMS systems requiring custom integration. Support teams get overwhelmed. Evidence collection for efficacy studies remains manual.',
    cannotSolve: [
      'Building EdTech products or features',
      'Sales, marketing, or lead generation',
      'Product-market fit decisions'
    ],
    canSolve: [
      'Automate customer onboarding workflows',
      'Pre-built SIS/LMS integration connectors',
      'AI chatbots for tier 1/2 support'
    ],
    sampleSolutionHook: {
      setup: 'EdTech companies onboarding schools manually spend 4-6 weeks doing setup, integration, and training. We provide self-service onboarding: customers complete wizards, pre-built connectors handle integration, automated training delivers resources.',
      result: '4-6 weeks → 3-5 days. 10x faster activation',
      whyItWins: 'Faster onboarding = faster revenue recognition = better cash flow. Sales teams can close deals knowing operations won\'t bottleneck delivery.'
    }
  },
  {
    id: 'international-student-lifecycle',
    title: 'International Student Lifecycle Automation',
    description: 'Complete international student journey automation: application, visa support, enrollment, cross-border transfers',
    targetAudience: ['Universities', 'Schools', 'EdTech'],
    roiMetric: 'Student registration: 3 hours → 15 minutes',
    keyFeatures: [
      'Multilingual application processing (50+ languages)',
      'Document processing (transcripts, visas, credentials)',
      'Cross-border compliance automation',
      'Parent communication in native languages',
      'International credential evaluation'
    ],
    useCases: [
      'Study abroad platform document automation',
      'International school network student transfers',
      'Multi-country school operations',
      'University international admissions',
      'Global education group coordination'
    ],
    icon: 'Globe',
    color: 'bg-vertical-accounting',
    context: 'International student mobility has grown to 6.9 million globally, with students contributing $43.8B to the U.S. economy. However, admissions teams drown in multilingual applications, transcript translations, visa documentation, and 24/7 support across time zones. Manual processing creates brutal backlogs.',
    cannotSolve: [
      'Visa policies or approval decisions',
      'Making international education affordable',
      'International student recruitment'
    ],
    canSolve: [
      'Multilingual AI chatbots (50+ languages, 24/7)',
      'Automated document processing and translation',
      'Visa documentation workflow automation'
    ],
    sampleSolutionHook: {
      setup: 'Universities processing international applications spend 2-4 hours per transcript doing translation, evaluation, and data entry. We automate: applications arrive → AI extracts data → translation happens → credential mapping applies → data populates systems. Multilingual chatbot handles inquiries 24/7.',
      result: '85% faster processing. 3 hours → 15 minutes per student',
      whyItWins: 'International admissions teams are visibly overwhelmed. Backlogs clear, staff work normal hours, student experience improves dramatically. Easy ROI story.'
    }
  },
  {
    id: 'education-finance-operations',
    title: 'Education Finance Operations',
    description: 'Loan processing, portfolio management, and financial operations automation for school financing and scholarships',
    targetAudience: ['Finance', 'Schools'],
    roiMetric: 'Loan processing: 3 days → 6 hours per application',
    keyFeatures: [
      'Automated loan application processing (40+ documents)',
      'AI-powered credit assessment',
      'Portfolio monitoring and risk prediction',
      'Multilingual school communication',
      'Grant and scholarship workflow automation'
    ],
    useCases: [
      'School loan processing at scale (5,000+ schools)',
      'Portfolio management for education lenders',
      'Scholarship application processing',
      'Grant administration automation',
      'School operations bundled with financing'
    ],
    icon: 'DollarSign',
    color: 'bg-vertical-ecommerce',
    context: 'The student loan market is growing from $2.8T to projected $6.8T by 2035. However, loan processing is document hell: 40+ documents per applicant. Underwriters spend 60-70% of time on data extraction, not credit decisions. Compliance demands extensive audit trails. Manual processing becomes the growth bottleneck at scale.',
    cannotSolve: [
      'Student debt crisis or affordability',
      'Lending decisions or creditworthiness',
      'Creating loan products or pricing'
    ],
    canSolve: [
      'Automated document processing (bank statements, pay stubs)',
      'AI-powered credit assessment data aggregation',
      'Compliance documentation auto-generation'
    ],
    sampleSolutionHook: {
      setup: 'Education lenders processing 40+ documents per application spend 60-70% of underwriter time on data extraction. We automate: documents upload → AI extracts financial data → system populates forms → fraud detection flags alterations → compliance audit trail auto-generates.',
      result: '3x faster processing. Underwriters spend 70% on decisions, 30% on verification',
      whyItWins: 'Underwriter time is expensive and limited. Directly increases capacity without hiring. Clear ROI: process 3x more loans with same team.'
    }
  },
  {
    id: 'publisher-digital-transformation',
    title: 'Publisher Digital Transformation Infrastructure',
    description: 'Content production, school network management, and teacher training automation for education publishers',
    targetAudience: ['Publishers'],
    roiMetric: 'Content production time: ↓ 40%',
    keyFeatures: [
      'Digital content production workflows',
      'AI-powered content QA (curriculum alignment, accuracy)',
      'School network relationship management (100+ schools)',
      'Teacher training automation (scale 3x)',
      'Government compliance documentation'
    ],
    useCases: [
      'Digital curriculum production for government partnerships',
      'Publisher operations (content → distribution → training)',
      'School network management and support',
      'Teacher training programs at scale (70,000+ teachers)',
      'Multi-language content localization'
    ],
    icon: 'BookOpen',
    color: 'bg-vertical-education',
    context: 'Education publishers face digital transformation pressure as AI grows from $5.88B to $8.30B (2024-2025). Publishers must shift from print-first to digital-first while managing relationships with 100+ schools, training 70,000+ teachers, and ensuring government curriculum alignment. Content production workflows remain manual and slow.',
    cannotSolve: [
      'Curriculum or content creation',
      'Pedagogical decisions',
      'Digital strategy or business model'
    ],
    canSolve: [
      'Curriculum alignment QA automation',
      'Production workflow orchestration',
      'Teacher training coordination automation'
    ],
    sampleSolutionHook: {
      setup: 'Publishers checking 1,000-page textbooks for government standard alignment spend weeks doing manual verification. We automate QA: content uploads → AI checks every objective against standards → system flags misalignments → compliance report auto-generates.',
      result: 'QA time reduced 40%. Weeks → days',
      whyItWins: 'QA bottleneck delays publication and time-to-market. Faster QA = faster publishing = faster revenue. Critical for government approval processes.'
    }
  },
  {
    id: 'school-group-operations',
    title: 'School Group Operations Platform',
    description: 'Multi-campus operations automation: enrollment, finance consolidation, compliance, and parent communication',
    targetAudience: ['Schools'],
    roiMetric: 'Admin cost per student: ↓ 30-40%',
    keyFeatures: [
      'Multi-campus enrollment coordination',
      'Financial consolidation across locations',
      'Cross-border compliance tracking',
      '24/7 parent support (multilingual AI)',
      'Real-time operations dashboard'
    ],
    useCases: [
      'International school networks (25,000+ students)',
      'Multi-country school operations',
      'Regional campus coordination (ESG reporting)',
      'Affordable school network efficiency',
      'Franchise/multi-site school management'
    ],
    icon: 'Building2',
    color: 'bg-vertical-accounting',
    context: 'International school networks managing 10-25 campuses across countries face operational complexity: enrollment coordination, financial consolidation across jurisdictions, multi-regulatory compliance, and multilingual parent communication. New ESG reporting requirements (EU CSRD, UK TCFD) compound the challenge. Manual processes don\'t scale.',
    cannotSolve: [
      'Teaching quality or educational outcomes',
      'School affordability or business model',
      'Campus expansion strategy'
    ],
    canSolve: [
      'Centralized enrollment with automated sync',
      'Financial consolidation automation (multi-currency, multi-jurisdiction)',
      'ESG reporting data aggregation'
    ],
    sampleSolutionHook: {
      setup: 'School groups managing 25,000 students across 20+ campuses manually re-enter enrollment data per location and spend weeks consolidating financials at month-end. We provide centralized enrollment (enter once, sync everywhere) and automated financial consolidation.',
      result: 'Admin cost per student reduced 30-40%. Month-end closing: weeks → 3 days',
      whyItWins: 'CFOs personally feel month-end chaos. Enrollment staff complain about duplicate data entry daily. Immediate operational relief + clear ROI.'
    }
  }
];

// Architecture Patterns Data
export const architecturePatterns: ArchitecturePattern[] = [
  {
    id: 'document-processing',
    title: 'Intelligent Document Processing Pipeline',
    description: 'End-to-end automation for document-heavy workflows with OCR, classification, extraction, validation, and exception handling',
    architectureFlow: [
      'Document Source (Email/Upload/API)',
      'n8n: Extract + Route to Processing Queue',
      'Agentic AI: OCR → Classify → Extract Data → Validate',
      'n8n: Update Database + Notify Stakeholders + Archive',
      'Agentic AI: Handle Exceptions (missing info, unclear documents)'
    ],
    useCases: [
      'Student registration forms (international students, multilingual)',
      'Accreditation documentation preparation',
      'Financial aid applications',
      'Transcript processing',
      'Visa/immigration documents'
    ],
    technicalComponents: [
      'OCR Engine (Tesseract/Google Vision)',
      'LangChain Document Loaders',
      'OpenAI GPT-4 for extraction',
      'n8n workflow orchestration',
      'PostgreSQL for state management',
      'Webhook triggers for real-time processing'
    ],
    mermaidDiagram: `flowchart LR
    A[Document Source<br/>Email/Upload/API] --> B[n8n Workflow<br/>Extract + Route to Queue]
    B --> C[Agentic AI Agent<br/>OCR → Classify → Extract → Validate]
    C --> D{Valid?}
    D -->|Yes| E[n8n Workflow<br/>Update Database<br/>Notify Stakeholders<br/>Archive Document]
    D -->|No| F[Agentic AI Agent<br/>Handle Exceptions<br/>Request Missing Info]
    F --> G[Human Review/<br/>Resubmission]
    G --> B
    E --> H[Complete]

    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style B fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style C fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style D fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style E fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style F fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style G fill:#ffebee,stroke:#c62828,stroke-width:2px
    style H fill:#e8f5e9,stroke:#388e3c,stroke-width:2px`
  },
  {
    id: 'conversational-agent',
    title: 'Conversational Agent with System Integration',
    description: 'AI-powered chat/voice interface that queries multiple systems, synthesizes information, and executes actions',
    architectureFlow: [
      'User (Student/Parent/Administrator)',
      'Agentic AI: Conversational Interface (multilingual chat/voice)',
      'n8n: Query Multiple Systems (SIS, LMS, Finance, Housing)',
      'Agentic AI: Synthesize Information + Provide Answer',
      'n8n: Execute Actions (enroll, pay, update records)',
      'Agentic AI: Confirm + Follow-up'
    ],
    useCases: [
      'Student registration chatbot',
      'Parent inquiry system',
      'Staff knowledge management',
      'IT helpdesk automation',
      'Course enrollment assistance'
    ],
    technicalComponents: [
      'LangGraph for conversation flow',
      'OpenAI GPT-4 for language understanding',
      'n8n API connectors (SIS, LMS, CRM)',
      'Redis for session state',
      'Twilio/WhatsApp for messaging',
      'Voice AI integration (optional)'
    ],
    mermaidDiagram: `flowchart TD
    A[User Input<br/>Student/Parent/Admin] --> B[Agentic AI<br/>Conversational Interface<br/>Multilingual Support]
    B --> C{Intent<br/>Recognition}
    C -->|Query Info| D[n8n Workflow<br/>Query Systems<br/>SIS/LMS/Finance/Housing]
    C -->|Execute Action| E[n8n Workflow<br/>Execute Actions<br/>Enroll/Pay/Update]
    D --> F[(Multiple<br/>Systems)]
    F --> G[Agentic AI<br/>Synthesize Info<br/>Generate Response]
    E --> H[Agentic AI<br/>Confirm Action<br/>Follow-up Questions]
    G --> I[Response to User]
    H --> I
    I --> J{Conversation<br/>Complete?}
    J -->|No| B
    J -->|Yes| K[End Session]

    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style B fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style C fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style D fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style E fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style F fill:#e0f2f1,stroke:#00897b,stroke-width:2px
    style G fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style H fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style I fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style J fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style K fill:#e8f5e9,stroke:#388e3c,stroke-width:2px`
  },
  {
    id: 'workflow-orchestration',
    title: 'Workflow Orchestration with AI Decision Points',
    description: 'Event-triggered workflows with AI making intelligent routing and recommendation decisions at critical points',
    architectureFlow: [
      'Trigger Event (application submission, enrollment, etc.)',
      'n8n: Fetch Required Data from Multiple Systems',
      'Agentic AI: Assess Eligibility + Make Recommendation',
      'n8n: Route Based on AI Decision',
      'Agentic AI: Communicate with Stakeholders',
      'n8n: Update All Systems + Generate Reports'
    ],
    useCases: [
      'Scholarship application evaluation',
      'Course prerequisite verification',
      'Financial aid determination',
      'Admissions review routing',
      'Compliance checking (accreditation, regulations)'
    ],
    technicalComponents: [
      'Event-driven triggers (webhooks)',
      'n8n decision nodes',
      'LangChain agents for evaluation',
      'OpenAI GPT-4 for assessment',
      'Multi-system API integrations',
      'Notification services (email, SMS, Slack)'
    ],
    mermaidDiagram: `flowchart TD
    A[Trigger Event<br/>Application/Enrollment/Submission] --> B[n8n Workflow<br/>Fetch Required Data<br/>from Multiple Systems]
    B --> C[(Source<br/>Systems)]
    C --> D[Agentic AI Agent<br/>Assess Eligibility<br/>Make Recommendation]
    D --> E{AI Decision}
    E -->|Approved| F[n8n Workflow<br/>Auto-Process Route]
    E -->|Review Needed| G[n8n Workflow<br/>Human Review Route]
    E -->|Rejected| H[n8n Workflow<br/>Rejection Route]
    F --> I[Agentic AI<br/>Communicate<br/>Approval to Stakeholders]
    G --> J[Human Reviewer]
    H --> K[Agentic AI<br/>Communicate<br/>Rejection + Next Steps]
    J --> L{Review<br/>Decision}
    L -->|Approve| F
    L -->|Reject| H
    I --> M[n8n Workflow<br/>Update All Systems<br/>Generate Reports]
    K --> M
    M --> N[Complete]

    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style B fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style C fill:#e0f2f1,stroke:#00897b,stroke-width:2px
    style D fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style E fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style F fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style G fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style H fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style I fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style J fill:#ffebee,stroke:#c62828,stroke-width:2px
    style K fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style L fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style M fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style N fill:#e8f5e9,stroke:#388e3c,stroke-width:2px`
  },
  {
    id: 'data-synchronization',
    title: 'Intelligent Data Synchronization',
    description: 'Scheduled/triggered data extraction with AI-powered deduplication, conflict resolution, and anomaly detection',
    architectureFlow: [
      'Multiple Source Systems (SIS, LMS, CRM, Finance)',
      'n8n: Extract Data on Schedule/Trigger',
      'Agentic AI: Deduplicate + Resolve Conflicts + Enrich Data',
      'n8n: Write to Target Systems + Data Warehouse',
      'Agentic AI: Flag Anomalies for Human Review'
    ],
    useCases: [
      'Legacy system integration',
      'Multi-campus data consolidation',
      'CRM synchronization',
      'Reporting data pipelines',
      'Master data management'
    ],
    technicalComponents: [
      'n8n scheduled triggers',
      'Database connectors (PostgreSQL, MySQL, MongoDB)',
      'OpenAI embeddings for deduplication',
      'ETL transformation logic',
      'Data warehouse (Snowflake/BigQuery)',
      'Anomaly detection algorithms'
    ],
    mermaidDiagram: `flowchart TD
    A[(Source System 1<br/>SIS)] --> E[n8n Workflow<br/>Extract Data<br/>Schedule/Trigger]
    B[(Source System 2<br/>LMS)] --> E
    C[(Source System 3<br/>CRM)] --> E
    D[(Source System 4<br/>Finance)] --> E
    E --> F[Agentic AI Agent<br/>Deduplicate Records<br/>Using Embeddings]
    F --> G{Conflicts<br/>Detected?}
    G -->|Yes| H[Agentic AI Agent<br/>Resolve Conflicts<br/>Apply Business Rules]
    G -->|No| I[Agentic AI Agent<br/>Enrich Data<br/>Validate Quality]
    H --> I
    I --> J[Agentic AI Agent<br/>Anomaly Detection<br/>Flag Issues]
    J --> K{Anomalies<br/>Found?}
    K -->|Yes| L[Human Review<br/>Queue]
    K -->|No| M[n8n Workflow<br/>Write to Target Systems<br/>+ Data Warehouse]
    L --> N[Manual Resolution]
    N --> M
    M --> O[(Target<br/>Systems)]
    M --> P[(Data<br/>Warehouse)]

    style A fill:#e0f2f1,stroke:#00897b,stroke-width:2px
    style B fill:#e0f2f1,stroke:#00897b,stroke-width:2px
    style C fill:#e0f2f1,stroke:#00897b,stroke-width:2px
    style D fill:#e0f2f1,stroke:#00897b,stroke-width:2px
    style E fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style F fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style G fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style H fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style I fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style J fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style K fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style L fill:#ffebee,stroke:#c62828,stroke-width:2px
    style M fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style N fill:#ffebee,stroke:#c62828,stroke-width:2px
    style O fill:#e0f2f1,stroke:#00897b,stroke-width:2px
    style P fill:#e0f2f1,stroke:#00897b,stroke-width:2px`
  }
];

// Prospect Solutions Data (selected examples - can expand)
export const prospectSolutions: ProspectSolution[] = [
  {
    id: 'varthana',
    organization: 'Varthana',
    organizationType: 'School Finance',
    geography: 'India',
    scale: '5,000 schools, Rs 1,700 crore portfolio',
    problem: 'Loan application processing requires 40+ documents per school, credit assessment, compliance checks, and portfolio management at scale',
    technicalImplementation: [
      'School submits via web form/email/WhatsApp → n8n extracts documents',
      'AI Agent "Document Validator": OCR multilingual docs (Hindi, English, regional languages)',
      'AI Agent "School Communicator": Request missing items via WhatsApp/SMS in local languages',
      'n8n: Update Salesforce/CRM with extracted financial data',
      'AI Agent "Credit Assessor": Analyze financials, calculate risk scores, compare to portfolio data',
      'n8n: Route to human underwriter with AI-generated summary and recommendation'
    ],
    timeSavings: '2-3 days → 4-6 hours per application (5x throughput)',
    valuePitch: 'Process thousands of school loans faster. AI handles document processing so underwriters focus on decision-making, not data entry.',
    solutionModels: [
      'Model 1: Direct Customer - Automate Varthana internal operations ($100-200k)',
      'Model 2: Channel Partnership - Offer AR Automation to 5,000 school portfolio',
      'Model 3: Strategic Bundle - Financing + Operations Software integrated offering'
    ]
  },
  {
    id: 'etonhouse',
    organization: 'EtonHouse International School',
    organizationType: 'International School Network',
    geography: 'Multi-country (Worldwide)',
    scale: '25,000 students across multiple countries',
    problem: 'Multi-campus operations coordination, cross-border compliance, parent communication at scale, and financial consolidation across jurisdictions',
    technicalImplementation: [
      'Multi-campus enrollment: AI handles inquiries in local languages, checks availability across campuses',
      'Financial consolidation: n8n pulls data from each campus daily, consolidates with multi-currency handling',
      'Compliance automation: AI monitors regulatory requirements per country, alerts 30/60/90 days before deadlines',
      'Parent communication: 24/7 AI chatbot in multiple languages for common inquiries',
      'Cross-border transfers: Automated workflow for student moving between campuses in different countries'
    ],
    timeSavings: 'Admin cost per student: ↓ 35% ($2.6M annual savings)',
    valuePitch: 'Reduce operational cost per student by 30-40% through automation. Scale without proportional headcount increases. Parent response time: 2 days → 5 minutes.'
  },
  {
    id: 'spacebasic',
    organization: 'SpaceBasic',
    organizationType: 'EdTech Platform',
    geography: 'India',
    scale: '50+ universities, 300% YoY growth',
    problem: 'Customer onboarding at hypergrowth becoming bottleneck. University system integration takes weeks. Support overwhelmed by tier 1/2 questions.',
    technicalImplementation: [
      'Automated onboarding: AI guides university through setup, collects technical requirements',
      'SIS integration: n8n auto-configures connection using university credentials, tests integration',
      'Training automation: AI generates customized training materials based on university-specific setup',
      'Support chatbot: AI handles 70% of tier 1/2 support inquiries',
      'University dashboard: Real-time status updates on onboarding progress'
    ],
    timeSavings: 'Customer onboarding: 6 weeks → 1 week (3x capacity)',
    valuePitch: 'At 300% growth, onboarding is your bottleneck. Automate 70% of onboarding process. Scale to 100+ universities without scaling headcount proportionally.'
  },
  {
    id: 'aksorn-education',
    organization: 'Aksorn Education',
    organizationType: 'Publisher + School Network',
    geography: 'Thailand',
    scale: '40% K-12 market share, 100+ schools, 70,000 teachers trained',
    problem: 'Content production workflows manual and slow. Teacher training does not scale. 100+ school relationships hard to manage.',
    technicalImplementation: [
      'Content production: AI validates curriculum alignment, checks accuracy, ensures age-appropriateness',
      'School network management: Automated content updates, instant distribution to 100+ schools',
      'Teacher training: AI-powered personalized training pathways for 70,000 teachers',
      'QR code content: Automated generation of 3D content links embedded in textbooks',
      'Performance analytics: Real-time tracking of content usage and teacher progress'
    ],
    timeSavings: 'Teacher training scaled 3x without additional trainers. Content production: ↓ 40%',
    valuePitch: 'Scale from training 70,000 teachers to 200,000 with same team size. AI handles personalized delivery, assessment, and certification. Your trainers focus on curriculum development.'
  },
  {
    id: 'leverage-edu',
    organization: 'Leverage Edu',
    organizationType: 'Study Abroad Platform',
    geography: 'India',
    scale: '7.5M students/month, 2M+ counseling sessions',
    problem: 'Document processing for international applications is manual bottleneck. Counselor-student matching suboptimal. University partnership management complex.',
    technicalImplementation: [
      'Document automation: AI processes transcripts, essays, recommendations; validates completeness',
      'Student communication: AI chatbot handles missing document requests, provides application guidance',
      'Counselor matching: AI matches students to counselors based on country, major, language, success probability',
      'University submission: n8n submits applications to universities via API, tracks status',
      'Skills assessment: Automated skills-to-employment mapping for career guidance'
    ],
    timeSavings: 'Document processing automated. Counselor time saved: 40%. Application throughput: 2x',
    valuePitch: 'At 7.5M students/month, manual operations do not scale. AI handles document processing, tier 1/2 questions, counselor matching. Your counselors focus on complex decisions and relationships.'
  },
  {
    id: 'kaizenvest-portfolio',
    organization: 'Kaizenvest Portfolio Companies',
    organizationType: 'VC Portfolio',
    geography: 'Asia',
    scale: '15 portfolio companies',
    problem: 'Portfolio companies spend 30-40% of engineering resources on operational workflows instead of core product. Each rebuilds same integrations.',
    technicalImplementation: [
      'Customer onboarding automation: Pre-built workflows for EdTech customer onboarding',
      'System integration hub: n8n connectors for SIS, LMS, CRM, payment processors',
      'Compliance automation: FERPA, GDPR, local regulation compliance built-in',
      'Support infrastructure: AI chatbots and tier 1/2 support automation',
      'Data analytics pipelines: Standard reporting and analytics workflows'
    ],
    timeSavings: 'Engineering time: 30-40% freed for product development. Unit economics: 30-50% improvement',
    valuePitch: 'Portfolio-wide operational infrastructure. Your portfolio companies focus on product differentiation, we handle operational plumbing. Better unit economics = better valuations at exit.',
    solutionModels: [
      'Portfolio-wide deal at preferred pricing (15 companies × $40-60k = $600-900k ARR)',
      'Due diligence partner: Assess operational efficiency in deal evaluation',
      'Value-add service: VCs offer AR Automation to portfolio (like legal/accounting)',
      'Investment opportunity: Kaizenvest invests in AR Automation'
    ]
  },
  {
    id: 'nahdet-misr',
    organization: 'Nahdet Misr',
    organizationType: 'Publisher + EdVentures VC',
    geography: 'MENA',
    scale: 'Major regional publisher, 20x revenue growth',
    problem: 'Digital curriculum production for Ministry of Education partnerships. Content QA is bottleneck. EdVentures portfolio needs operational support.',
    technicalImplementation: [
      'Curriculum production: AI validates alignment with Egyptian Ministry standards, checks Arabic quality',
      'Content QA: Automated age-appropriateness checking, factual accuracy validation',
      'Ministry submission: AI generates compliance documentation for ministry approval process',
      'Distribution: n8n distributes approved curriculum to all Egyptian schools automatically',
      'Portfolio support: Offer AR Automation infrastructure to EdVentures portfolio companies'
    ],
    timeSavings: 'Digital curriculum production: ↓ 40%. Always ministry-compliant, not scrambling at deadlines',
    valuePitch: 'Three opportunities: (1) Automate Nahdet Misr publishing ops, (2) Operational infrastructure for EdVentures portfolio, (3) Partner for MENA education market entry.'
  },
  {
    id: 'ey-parthenon-clients',
    organization: 'EY-Parthenon Education Clients',
    organizationType: 'Consulting Partnership',
    geography: 'India & MENA',
    scale: 'Multiple education institution clients',
    problem: 'Clients hire consultants for strategy, but struggle with operational transformation implementation. Consultant recommendations often not executed.',
    technicalImplementation: [
      'Co-delivery model: EY-Parthenon provides strategy, AR Automation handles implementation',
      'Credential program implementation: Execute consultant recommendations for alternative credentials',
      'Operational transformation: Automate workflows designed by consulting engagement',
      'Change management: AI-powered training and adoption support for staff',
      'Performance tracking: Dashboards showing ROI of consultant recommendations'
    ],
    timeSavings: 'Implementation accelerated: Strategy → execution in weeks instead of months',
    valuePitch: 'Your clients struggle to implement your strategic recommendations. We execute the operational transformation you design. You maintain strategic relationship, we handle tactical implementation.',
    solutionModels: [
      'Referral partnership: Consultants refer clients for implementation',
      'Co-delivery: Joint proposals for strategy + implementation',
      'Due diligence partner: Support M&A due diligence with operational assessment'
    ]
  }
];
