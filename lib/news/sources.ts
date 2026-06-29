import { NewsSource } from './types';

export const NEWS_SOURCES: NewsSource[] = [
  // --- Official Company Blogs ---
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', type: 'rss', category: 'company_blog', company: 'OpenAI' },
  { name: 'Anthropic Blog', url: 'https://www.anthropic.com/rss.xml', type: 'rss', category: 'company_blog', company: 'Anthropic' },
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', type: 'rss', category: 'company_blog', company: 'Google' },
  { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml', type: 'rss', category: 'company_blog', company: 'Google DeepMind' },
  { name: 'Meta AI Blog', url: 'https://ai.meta.com/blog/feed/', type: 'rss', category: 'company_blog', company: 'Meta' },
  { name: 'Microsoft AI Blog', url: 'https://blogs.microsoft.com/ai/feed/', type: 'rss', category: 'company_blog', company: 'Microsoft' },
  { name: 'NVIDIA Blog', url: 'https://blogs.nvidia.com/feed/', type: 'rss', category: 'company_blog', company: 'NVIDIA' },
  { name: 'HuggingFace Blog', url: 'https://huggingface.co/blog/feed.xml', type: 'rss', category: 'company_blog', company: 'HuggingFace' },
  { name: 'Mistral Blog', url: 'https://mistral.ai/news/feed/', type: 'rss', category: 'company_blog', company: 'Mistral' },
  { name: 'Cohere Blog', url: 'https://cohere.com/blog/rss/', type: 'rss', category: 'company_blog', company: 'Cohere' },
  { name: 'Stability AI', url: 'https://stability.ai/news/rss', type: 'rss', category: 'company_blog', company: 'Stability AI' },
  { name: 'Perplexity Blog', url: 'https://blog.perplexity.ai/rss', type: 'rss', category: 'company_blog', company: 'Perplexity' },
  { name: 'Amazon AWS AI', url: 'https://aws.amazon.com/blogs/machine-learning/feed/', type: 'rss', category: 'company_blog', company: 'Amazon' },

  // --- Tech News ---
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', type: 'rss', category: 'news' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/ai/feed/', type: 'rss', category: 'news' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', type: 'rss', category: 'news' },
  { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/artificial-intelligence/rss', type: 'rss', category: 'news' },
  { name: 'MIT Technology Review AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/', type: 'rss', category: 'news' },
  { name: 'Ars Technica AI', url: 'https://arstechnica.com/tag/artificial-intelligence/feed/', type: 'rss', category: 'news' },
  { name: 'ZDNet AI', url: 'https://www.zdnet.com/topic/artificial-intelligence/rss.xml', type: 'rss', category: 'news' },
  { name: 'InfoQ AI', url: 'https://feed.infoq.com/ai-ml-data-eng/', type: 'rss', category: 'news' },
  { name: 'Towards Data Science', url: 'https://towardsdatascience.com/feed', type: 'rss', category: 'news' },

  // --- Google News RSS (real-time) ---
  { name: 'Google News - AI', url: 'https://news.google.com/rss/search?q=artificial+intelligence+AI&hl=en-US&gl=US&ceid=US:en', type: 'rss', category: 'news' },
  { name: 'Google News - OpenAI', url: 'https://news.google.com/rss/search?q=OpenAI&hl=en-US&gl=US&ceid=US:en', type: 'rss', category: 'news' },
  { name: 'Google News - LLM', url: 'https://news.google.com/rss/search?q=LLM+language+model&hl=en-US&gl=US&ceid=US:en', type: 'rss', category: 'news' },
  { name: 'Google News - AI Funding', url: 'https://news.google.com/rss/search?q=AI+startup+funding&hl=en-US&gl=US&ceid=US:en', type: 'rss', category: 'news' },

  // --- Research ---
  { name: 'Arxiv CS.AI', url: 'https://arxiv.org/rss/cs.AI', type: 'rss', category: 'research' },
  { name: 'Arxiv CS.LG', url: 'https://arxiv.org/rss/cs.LG', type: 'rss', category: 'research' },
  { name: 'Arxiv CS.CL', url: 'https://arxiv.org/rss/cs.CL', type: 'rss', category: 'research' },

  // --- Community ---
  { name: 'Hacker News AI', url: 'https://hnrss.org/newest?q=AI+LLM+ChatGPT+Claude+Gemini', type: 'rss', category: 'social' },
  { name: 'Reddit r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning/.rss', type: 'rss', category: 'social' },
  { name: 'Reddit r/artificial', url: 'https://www.reddit.com/r/artificial/.rss', type: 'rss', category: 'social' },
  { name: 'Reddit r/LocalLLaMA', url: 'https://www.reddit.com/r/LocalLLaMA/.rss', type: 'rss', category: 'social' },
  { name: 'Product Hunt AI', url: 'https://www.producthunt.com/feed?category=artificial-intelligence', type: 'rss', category: 'social' },
];

// High-priority GitHub repos to monitor
export const GITHUB_REPOS = [
  'openai/openai-python',
  'anthropics/anthropic-sdk-python',
  'google/generative-ai-python',
  'huggingface/transformers',
  'langchain-ai/langchain',
  'microsoft/autogen',
  'run-llama/llama_index',
  'ollama/ollama',
  'ggerganov/llama.cpp',
  'vllm-project/vllm',
  'BerriAI/litellm',
  'openai/whisper',
  'Stability-AI/stablediffusion',
  'AUTOMATIC1111/stable-diffusion-webui',
  'comfyanonymous/ComfyUI',
  'microsoft/phi-2',
  'mistralai/mistral-src',
];

// AI company keywords for importance detection
export const AI_COMPANY_KEYWORDS = [
  'openai', 'anthropic', 'google deepmind', 'google ai', 'meta ai',
  'microsoft ai', 'nvidia', 'hugging face', 'mistral', 'cohere',
  'stability ai', 'perplexity', 'xai', 'grok', 'sam altman',
  'sundar pichai', 'demis hassabis', 'yann lecun', 'ilya sutskever',
  'gpt', 'claude', 'gemini', 'llama', 'chatgpt', 'copilot',
  'sora', 'dall-e', 'midjourney', 'runway', 'replicate',
];
