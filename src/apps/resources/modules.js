import moduleOne from "../../resources/modules/module-1.md?raw";
import moduleTwo from "../../resources/modules/module-2.md?raw";
import moduleThree from "../../resources/modules/module-3.md?raw";
import moduleFour from "../../resources/modules/module-4.md?raw";
import moduleFive from "../../resources/modules/module-5.md?raw";
import moduleSix from "../../resources/modules/module-6.md?raw";
import moduleSeven from "../../resources/modules/module-7.md?raw";
import moduleEight from "../../resources/modules/module-8.md?raw";
import moduleNine from "../../resources/modules/module-9.md?raw";
import moduleTen from "../../resources/modules/module-10.md?raw";

export const modules = [
  {
    slug: "module-1",
    order: 1,
    title: "Introduction and Overview",
    summary: "Kick off the academy with welcome, journey framing, and how to use the program.",
    accent: "from-neutral-900/70 via-neutral-800/60 to-red-600/70",
    badge: "Section 1",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    content: moduleOne,
  },
  {
    slug: "module-2",
    order: 2,
    title: "Designing Your Future",
    summary: "Orient your career goals and design an unforgettable path forward.",
    accent: "from-neutral-900/70 via-red-700/60 to-neutral-800/60",
    badge: "Section 2",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
    content: moduleTwo,
  },
  {
    slug: "module-3",
    order: 3,
    title: "Industry Insider Secrets",
    summary: "Decode industries, research landscapes, and make insights relevant.",
    accent: "from-neutral-900/70 via-neutral-700/60 to-red-700/70",
    badge: "Section 3",
    image:
      "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=800&q=80",
    content: moduleThree,
  },
  {
    slug: "module-4",
    order: 4,
    title: "Critical Thinking Accelerators",
    summary: "Handle ambiguity with models, storytelling, and structured decisions.",
    accent: "from-neutral-900/70 via-neutral-800/60 to-red-500/70",
    badge: "Section 4",
    image:
      "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=80",
    content: moduleFour,
  },
  {
    slug: "module-5",
    order: 5,
    title: "Building Data Literacy",
    summary: "Learn data language, storage choices, architectures, and failure modes.",
    accent: "from-neutral-900/70 via-neutral-700/60 to-red-600/70",
    badge: "Section 5",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    content: moduleFive,
  },
  {
    slug: "module-6",
    order: 6,
    title: "Cheat Your Way Through ETL",
    summary: "Accelerate ETL with shortcuts, platform know-how, and lab practice.",
    accent: "from-neutral-900/70 via-neutral-800/60 to-red-500/70",
    badge: "Section 6",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80",
    content: moduleSix,
  },
  {
    slug: "module-7",
    order: 7,
    title: "Engineering Essentials",
    summary: "Git, CI/CD, DevOps shortcuts, MLOps, containers, and Kubernetes quick wins.",
    accent: "from-neutral-900/70 via-neutral-700/60 to-red-700/70",
    badge: "Section 7",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    content: moduleSeven,
  },
  {
    slug: "module-8",
    order: 8,
    title: "The Modern Makeup of Methodologies",
    summary: "Choose and tailor frameworks across agile, POLDAT, TOGAF, and governance.",
    accent: "from-neutral-900/70 via-neutral-800/60 to-red-500/70",
    badge: "Section 8",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    content: moduleEight,
  },
  {
    slug: "module-9",
    order: 9,
    title: "The Rise of Autonomous Agentic Analytics",
    summary: "Explore LLM fundamentals, orchestration, agents, governance, and RAG.",
    accent: "from-neutral-900/70 via-neutral-700/60 to-red-600/70",
    badge: "Section 9",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    content: moduleNine,
  },
  {
    slug: "module-10",
    order: 10,
    title: "The Resilient Career Playbook",
    summary: "Build a standout portfolio, craft your narrative, and interview with confidence.",
    accent: "from-neutral-900/70 via-neutral-800/60 to-red-700/70",
    badge: "Section 10",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    content: moduleTen,
  },
];

export const moduleLookup = modules.reduce((lookup, module) => {
  lookup[module.slug] = module;
  return lookup;
}, {});
