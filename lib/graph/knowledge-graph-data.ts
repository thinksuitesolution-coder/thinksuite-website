import { GraphData } from '@/components/graph/KnowledgeGraph';

export const AI_KNOWLEDGE_GRAPH: GraphData = {
  nodes: [
    // ── COMPANIES ──────────────────────────────────────────────
    { id: 'openai',     type: 'company', label: 'OpenAI',      description: 'Creator of GPT series and ChatGPT. Backed by Microsoft. Leading AGI lab.', meta: '$300B val' },
    { id: 'anthropic',  type: 'company', label: 'Anthropic',   description: 'Safety-focused AI lab. Creator of Claude. Founded by ex-OpenAI team.', meta: '$18.4B val' },
    { id: 'google',     type: 'company', label: 'Google',      description: 'Parent of DeepMind. Created Gemini, TPUs, and the Transformer paper.', meta: '$2T cap' },
    { id: 'deepmind',   type: 'company', label: 'Google DeepMind', description: 'Google\'s AI research lab. AlphaFold, AlphaGo, Gemini. Nobel Prize 2024.', meta: 'London' },
    { id: 'meta',       type: 'company', label: 'Meta AI',     description: 'Open-source AI push. LLaMA, SeamlessM4T. Yann LeCun leads research.', meta: 'Open Source' },
    { id: 'microsoft',  type: 'company', label: 'Microsoft',   description: '$13B invested in OpenAI. Copilot integrated across all products. Azure AI.', meta: '$13B OpenAI' },
    { id: 'nvidia',     type: 'company', label: 'NVIDIA',      description: 'GPU monopoly for AI training. CUDA, H100/H200/Blackwell chips.', meta: '$3T market cap' },
    { id: 'xai',        type: 'company', label: 'xAI',         description: 'Elon Musk\'s AI company. Creator of Grok. Built Memphis supercluster.', meta: '$24B val' },
    { id: 'mistral',    type: 'company', label: 'Mistral AI',  description: 'French AI lab. Mixtral MoE architecture. Efficient open models.', meta: '$6.2B val' },
    { id: 'huggingface',type: 'company', label: 'Hugging Face',description: 'The GitHub of AI. Model hub, datasets, Spaces. 500K+ models.', meta: '$4.5B val' },
    { id: 'perplexity', type: 'company', label: 'Perplexity',  description: 'AI-native search engine. Real-time web answers with citations.', meta: '$9B val' },
    { id: 'cohere',     type: 'company', label: 'Cohere',      description: 'Enterprise AI for search, generation, classification.', meta: '$5.5B val' },

    // ── MODELS ─────────────────────────────────────────────────
    { id: 'gpt4o',      type: 'model', label: 'GPT-4o',    description: 'OpenAI\'s flagship multimodal model. Text, vision, audio in one.', meta: 'May 2024' },
    { id: 'gpt5',       type: 'model', label: 'GPT-5',     description: 'OpenAI\'s most capable model. Doctoral-level reasoning. Released 2025.', meta: '2025' },
    { id: 'o3',         type: 'model', label: 'o3 / o4',   description: 'OpenAI reasoning series. Chain-of-thought at inference time. ARC-AGI record.', meta: 'Reasoning' },
    { id: 'claude35',   type: 'model', label: 'Claude 3.5 Sonnet', description: 'Anthropic\'s best model. Top coding, analysis, reasoning benchmarks.', meta: 'Top Coder' },
    { id: 'claude4',    type: 'model', label: 'Claude 4',  description: 'Anthropic\'s next generation model with enhanced reasoning and safety.', meta: '2025' },
    { id: 'gemini2',    type: 'model', label: 'Gemini 2.0', description: 'Google\'s multimodal AI. Native audio/video/image understanding.', meta: 'Multimodal' },
    { id: 'llama4',     type: 'model', label: 'LLaMA 4',   description: 'Meta\'s open source model. MoE architecture, free for commercial use.', meta: 'Open Source' },
    { id: 'grok3',      type: 'model', label: 'Grok 3',    description: 'xAI\'s flagship model. Trained on Colossus 100K GPU cluster.', meta: '100K GPUs' },
    { id: 'mixtral',    type: 'model', label: 'Mixtral 8x22B', description: 'Mistral\'s sparse MoE model. Matches GPT-4 class at lower cost.', meta: 'MoE' },
    { id: 'deepseek',   type: 'model', label: 'DeepSeek R1', description: 'Chinese open reasoning model. Shocked industry with GPT-4 performance at fraction of cost.', meta: 'China' },
    { id: 'gemma',      type: 'model', label: 'Gemma 3',   description: 'Google\'s open source small model. Runs on single GPU.', meta: 'Lightweight' },

    // ── TECHNOLOGIES ───────────────────────────────────────────
    { id: 'transformer',  type: 'technology', label: 'Transformer',    description: 'The "Attention is All You Need" architecture (2017). Foundation of all modern LLMs.', meta: '2017' },
    { id: 'rlhf',         type: 'technology', label: 'RLHF',           description: 'Reinforcement Learning from Human Feedback. Makes models safer and more helpful.', meta: 'Alignment' },
    { id: 'moe',          type: 'technology', label: 'Mixture of Experts', description: 'Sparse activation architecture. Run only subset of params per token. More efficient.', meta: 'Efficiency' },
    { id: 'rag',          type: 'technology', label: 'RAG',            description: 'Retrieval-Augmented Generation. Grounds LLM answers in real-time data.', meta: 'Grounding' },
    { id: 'agents',       type: 'technology', label: 'AI Agents',      description: 'LLMs that can plan, use tools, browse web, write code, execute tasks autonomously.', meta: 'Autonomous' },
    { id: 'multimodal',   type: 'technology', label: 'Multimodal AI',  description: 'Models that understand text, images, audio, video simultaneously.', meta: 'Vision+Audio' },
    { id: 'reasoning',    type: 'technology', label: 'Chain-of-Thought', description: 'LLMs think step-by-step before answering. Dramatically improves complex reasoning.', meta: '↑Accuracy' },
    { id: 'cuda',         type: 'technology', label: 'CUDA',           description: 'NVIDIA\'s parallel computing platform. Every major AI model trains on CUDA GPUs.', meta: 'NVIDIA' },
    { id: 'constitutional_ai', type: 'technology', label: 'Constitutional AI', description: 'Anthropic\'s safety method. AI trained with written principles instead of human labels.', meta: 'Safety' },

    // ── PEOPLE ─────────────────────────────────────────────────
    { id: 'altman',    type: 'person', label: 'Sam Altman',    description: 'CEO of OpenAI. Led ChatGPT launch. $7T chip initiative. Survived board coup.', meta: 'OpenAI CEO' },
    { id: 'dario',     type: 'person', label: 'Dario Amodei',  description: 'CEO of Anthropic. Former VP Research at OpenAI. Safety-first philosophy.', meta: 'Anthropic CEO' },
    { id: 'lecun',     type: 'person', label: 'Yann LeCun',    description: 'Chief AI Scientist at Meta. Turing Award winner. Skeptic of current LLM path to AGI.', meta: 'Meta / NYU' },
    { id: 'hassabis',  type: 'person', label: 'Demis Hassabis', description: 'CEO of Google DeepMind. AlphaFold creator. Nobel Prize Chemistry 2024.', meta: 'Nobel 2024' },
    { id: 'musk',      type: 'person', label: 'Elon Musk',     description: 'CEO of xAI and Tesla. Co-founder of OpenAI (left). Building Grok.', meta: 'xAI CEO' },
    { id: 'jensen',    type: 'person', label: 'Jensen Huang',  description: 'CEO of NVIDIA. Turned CUDA into the backbone of AI. "AI factory" vision.', meta: 'NVIDIA CEO' },
    { id: 'sutskever', type: 'person', label: 'Ilya Sutskever', description: 'Co-founder of OpenAI. Chief Scientist. Left to start SSI (Safe Superintelligence).', meta: 'SSI / ex-OpenAI' },

    // ── CONCEPTS ───────────────────────────────────────────────
    { id: 'agi',        type: 'concept', label: 'AGI',           description: 'Artificial General Intelligence, AI that matches or exceeds human capability across all domains.', meta: '2026,2030?' },
    { id: 'safety',     type: 'concept', label: 'AI Safety',     description: 'Research ensuring AI systems remain aligned with human values as they become more capable.', meta: 'Critical' },
    { id: 'scaling',    type: 'concept', label: 'Scaling Laws',  description: 'More compute + more data + bigger models → predictable performance improvements.', meta: 'Kaplan et al.' },
    { id: 'opensrc',    type: 'concept', label: 'Open Source AI',description: 'Publicly releasing model weights. Meta, Mistral lead. Debate: democratic vs dangerous.', meta: 'vs Closed' },
    { id: 'inference',  type: 'concept', label: 'Inference Compute', description: 'Spending more compute at test time to improve answers. o1/o3 paradigm.', meta: 'New Paradigm' },

    // ── FUNDING ────────────────────────────────────────────────
    { id: 'msft_deal',    type: 'funding', label: 'Microsoft → OpenAI', description: 'Microsoft invested $13B+ in OpenAI across multiple rounds. Azure is exclusive cloud partner.', meta: '$13B+' },
    { id: 'amazon_deal',  type: 'funding', label: 'Amazon → Anthropic', description: 'Amazon committed $4B to Anthropic. AWS exclusive cloud partner.', meta: '$4B' },
    { id: 'softbank_deal',type: 'funding', label: 'SoftBank → OpenAI', description: 'SoftBank led $40B round at $300B valuation in 2025.', meta: '$40B' },
    { id: 'nvidia_invest', type: 'funding', label: 'NVIDIA Investments',description: 'NVIDIA invested in Perplexity, Cohere, Mistral and dozens of AI startups.', meta: 'Multi-portfolio' },
  ],

  edges: [
    // Company → Model
    { source: 'openai',    target: 'gpt4o',    label: 'built',   strength: 0.9 },
    { source: 'openai',    target: 'gpt5',     label: 'built',   strength: 0.9 },
    { source: 'openai',    target: 'o3',       label: 'built',   strength: 0.8 },
    { source: 'anthropic', target: 'claude35', label: 'built',   strength: 0.9 },
    { source: 'anthropic', target: 'claude4',  label: 'built',   strength: 0.9 },
    { source: 'google',    target: 'gemini2',  label: 'built',   strength: 0.9 },
    { source: 'deepmind',  target: 'gemma',    label: 'built',   strength: 0.7 },
    { source: 'meta',      target: 'llama4',   label: 'built',   strength: 0.9 },
    { source: 'xai',       target: 'grok3',    label: 'built',   strength: 0.9 },
    { source: 'mistral',   target: 'mixtral',  label: 'built',   strength: 0.9 },

    // Company → Technology
    { source: 'openai',    target: 'rlhf',     label: 'pioneered', strength: 0.7 },
    { source: 'openai',    target: 'reasoning',label: 'advanced',  strength: 0.7 },
    { source: 'anthropic', target: 'constitutional_ai', label: 'invented', strength: 0.9 },
    { source: 'google',    target: 'transformer', label: 'invented', strength: 1.0 },
    { source: 'meta',      target: 'moe',      label: 'scaled',  strength: 0.6 },
    { source: 'mistral',   target: 'moe',      label: 'adopted', strength: 0.7 },
    { source: 'nvidia',    target: 'cuda',     label: 'created', strength: 1.0 },
    { source: 'cuda',      target: 'transformer', label: 'enables', strength: 0.8 },

    // Model → Technology
    { source: 'gpt5',      target: 'reasoning',label: 'uses',    strength: 0.8 },
    { source: 'o3',        target: 'reasoning',label: 'built on',strength: 0.9 },
    { source: 'o3',        target: 'inference',label: 'uses',    strength: 0.9 },
    { source: 'claude35',  target: 'constitutional_ai', label: 'trained with', strength: 0.8 },
    { source: 'claude35',  target: 'rlhf',     label: 'uses',    strength: 0.6 },
    { source: 'gemini2',   target: 'multimodal',label: 'native', strength: 0.9 },
    { source: 'gpt4o',     target: 'multimodal',label: 'native', strength: 0.9 },
    { source: 'llama4',    target: 'opensrc',  label: 'represents',strength: 0.8 },
    { source: 'mixtral',   target: 'moe',      label: 'uses',    strength: 1.0 },
    { source: 'deepseek',  target: 'reasoning',label: 'uses',    strength: 0.8 },
    { source: 'rag',       target: 'agents',   label: 'enables', strength: 0.7 },

    // People → Company
    { source: 'altman',   target: 'openai',   label: 'leads',   strength: 1.0 },
    { source: 'dario',    target: 'anthropic',label: 'leads',   strength: 1.0 },
    { source: 'lecun',    target: 'meta',     label: 'leads AI',strength: 0.9 },
    { source: 'hassabis', target: 'deepmind', label: 'leads',   strength: 1.0 },
    { source: 'musk',     target: 'xai',      label: 'founded', strength: 1.0 },
    { source: 'jensen',   target: 'nvidia',   label: 'leads',   strength: 1.0 },
    { source: 'sutskever',target: 'openai',   label: 'co-founded',strength: 0.7 },
    { source: 'altman',   target: 'sutskever',label: 'worked with',strength: 0.6 },

    // People → Concepts
    { source: 'altman',   target: 'agi',      label: 'pursuing',  strength: 0.8 },
    { source: 'dario',    target: 'safety',   label: 'champions', strength: 0.9 },
    { source: 'lecun',    target: 'opensrc',  label: 'advocates', strength: 0.8 },
    { source: 'sutskever',target: 'safety',   label: 'champions', strength: 0.8 },

    // Concepts
    { source: 'scaling',  target: 'agi',      label: 'path to?',  strength: 0.6 },
    { source: 'safety',   target: 'agi',      label: 'guards',    strength: 0.7 },
    { source: 'opensrc',  target: 'safety',   label: 'tension with',strength: 0.5 },
    { source: 'inference',target: 'reasoning',label: 'drives',    strength: 0.8 },

    // Company vs Company (competition)
    { source: 'openai',   target: 'anthropic',label: 'competes',  strength: 0.5 },
    { source: 'openai',   target: 'google',   label: 'competes',  strength: 0.5 },
    { source: 'xai',      target: 'openai',   label: 'rivals',    strength: 0.4 },
    { source: 'deepmind', target: 'openai',   label: 'rivals',    strength: 0.4 },
    { source: 'mistral',  target: 'meta',     label: 'competes',  strength: 0.3 },

    // Funding → Company
    { source: 'msft_deal',    target: 'openai',    label: 'funds',   strength: 0.9 },
    { source: 'amazon_deal',  target: 'anthropic', label: 'funds',   strength: 0.9 },
    { source: 'softbank_deal',target: 'openai',    label: 'funds',   strength: 0.9 },
    { source: 'nvidia_invest',target: 'perplexity',label: 'invested',strength: 0.6 },
    { source: 'nvidia_invest',target: 'cohere',    label: 'invested',strength: 0.6 },
    { source: 'microsoft',    target: 'msft_deal', label: 'led',     strength: 0.9 },

    // Ecosystem
    { source: 'huggingface',  target: 'llama4',   label: 'hosts',   strength: 0.7 },
    { source: 'huggingface',  target: 'mixtral',  label: 'hosts',   strength: 0.7 },
    { source: 'huggingface',  target: 'opensrc',  label: 'enables', strength: 0.8 },
    { source: 'perplexity',   target: 'rag',      label: 'built on',strength: 0.8 },
    { source: 'nvidia',       target: 'gpt5',     label: 'trains on H100',strength: 0.6 },
    { source: 'nvidia',       target: 'grok3',    label: 'trains on H100',strength: 0.6 },
  ],
};
