import { CrawlSource, SC, CrawlFreq, AntiBotRisk, WorkerType, ExtractorType } from './types';

function s(
  id: string, name: string, cat: SC, sub: string, home: string,
  rss: string | null, prio: number, trust: number, freq: CrawlFreq,
  apd: number, js = false, abr: AntiBotRisk = 'low', paywall = false,
  lang = 'en', country = 'US'
): CrawlSource {
  const worker: WorkerType = rss ? 'rss' : js ? 'browser' : 'http';
  const extractor: ExtractorType = rss ? 'rss' : 'jsonld';
  return {
    id, name, category: cat, subcategory: sub, homepage: home,
    rss_feed: rss || undefined,
    supports_rss: !!rss, supports_sitemap: true,
    requires_javascript: js, browser_required: js,
    login_required: false, paywall,
    language: lang, country,
    crawl_frequency: freq,
    priority_score: prio, freshness_score: Math.round(prio * 0.85),
    trust_score: trust,
    estimated_articles_per_day: apd,
    anti_bot_risk: abr,
    recommended_worker: worker, extractor_type: extractor,
    jsonld_supported: true, og_supported: true, twitter_card_supported: true,
    recommended_delay: abr === 'high' ? 3000 : abr === 'medium' ? 1500 : 500,
    recommended_timeout: 15000, recommended_retry: 3,
  };
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 1. OFFICIAL AI COMPANIES (55 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const OFFICIAL: CrawlSource[] = [
  s('openai',        'OpenAI News',          'official_company','llm',       'https://openai.com',           'https://openai.com/blog/rss.xml',                                        100,100,'5min', 8),
  s('anthropic',     'Anthropic News',       'official_company','llm',       'https://www.anthropic.com',    'https://www.anthropic.com/news/rss',                                     99, 100,'5min', 5),
  s('google-ai',     'Google AI Blog',       'official_company','llm',       'https://blog.google',          'https://blog.google/technology/ai/rss/',                                 98, 100,'5min', 10),
  s('deepmind',      'Google DeepMind',      'official_company','research',  'https://deepmind.google',      'https://deepmind.google/blog/rss.xml',                                   98, 100,'10min',4),
  s('meta-ai',       'Meta AI Blog',         'official_company','llm',       'https://ai.meta.com',          'https://about.fb.com/news/feed/',                                        97, 98, '10min',6),
  s('microsoft-ai',  'Microsoft AI Blog',    'official_company','llm',       'https://blogs.microsoft.com',  'https://news.microsoft.com/ai/feed/',                                    97, 98, '10min',5),
  s('nvidia-blog',   'NVIDIA AI Blog',       'official_company','hardware',  'https://blogs.nvidia.com',     'https://blogs.nvidia.com/feed/',                                         96, 98, '15min',4),
  s('aws-ml',        'AWS Machine Learning', 'official_company','cloud',     'https://aws.amazon.com',       'https://aws.amazon.com/blogs/machine-learning/feed/',                    95, 98, '15min',5),
  s('huggingface',   'HuggingFace Blog',     'official_company','platform',  'https://huggingface.co',       'https://huggingface.co/blog/feed.xml',                                   95, 97, '10min',4),
  s('mistral',       'Mistral AI News',      'official_company','llm',       'https://mistral.ai',           'https://mistral.ai/fr/news/feed/',                                       94, 96, '15min',2),
  s('cohere',        'Cohere Blog',          'official_company','llm',       'https://cohere.com',           'https://cohere.com/blog/rss/',                                           93, 95, '30min',2),
  s('xai',           'xAI Blog',             'official_company','llm',       'https://x.ai',                 'https://x.ai/blog/rss.xml',                                              94, 96, '15min',2),
  s('perplexity',    'Perplexity Blog',      'official_company','search_ai', 'https://www.perplexity.ai',    'https://blog.perplexity.ai/rss',                                         93, 95, '30min',2),
  s('elevenlabs',    'ElevenLabs Blog',      'official_company','audio_ai',  'https://elevenlabs.io',        'https://elevenlabs.io/blog/rss',                                         90, 93, '30min',2),
  s('stability',     'Stability AI News',    'official_company','image_ai',  'https://stability.ai',         'https://stability.ai/news/rss',                                          89, 90, '30min',1),
  s('midjourney',    'Midjourney Updates',   'official_company','image_ai',  'https://midjourney.com',       'https://updates.midjourney.com/feed',                                    88, 90, '30min',1),
  s('runway',        'Runway News',          'official_company','video_ai',  'https://runwayml.com',         'https://runwayml.com/news/rss',                                          88, 90, '30min',1),
  s('character-ai',  'Character AI Blog',    'official_company','llm',       'https://character.ai',         'https://blog.character.ai/feed/',                                        87, 88, '30min',1),
  s('groq-blog',     'Groq News',            'official_company','hardware',  'https://groq.com',             'https://groq.com/news/rss',                                              87, 88, '30min',1),
  s('cerebras',      'Cerebras Blog',        'official_company','hardware',  'https://www.cerebras.ai',      'https://www.cerebras.ai/blog/rss',                                       86, 87, '30min',1),
  s('ai21',          'AI21 Labs Blog',       'official_company','llm',       'https://www.ai21.com',         null,                                                                     82, 85, '1h',   1, true,'medium'),
  s('aleph-alpha',   'Aleph Alpha Blog',     'official_company','llm',       'https://aleph-alpha.com',      null,                                                                     80, 85, '1h',   1),
  s('adept-ai',      'Adept AI Blog',        'official_company','agent_ai',  'https://www.adept.ai',         null,                                                                     82, 85, '1h',   1),
  s('cognition',     'Cognition AI Blog',    'official_company','agent_ai',  'https://www.cognition.ai',     null,                                                                     83, 86, '1h',   1),
  s('together-ai',   'Together AI Blog',     'official_company','platform',  'https://www.together.ai',      null,                                                                     82, 85, '1h',   1),
  s('replicate',     'Replicate Blog',       'official_company','platform',  'https://replicate.com',        'https://replicate.com/blog/rss',                                         82, 85, '1h',   1),
  s('modal-blog',    'Modal Blog',           'official_company','platform',  'https://modal.com',            'https://modal.com/blog/rss',                                             80, 83, '1h',   1),
  s('scale-ai',      'Scale AI Blog',        'official_company','data',      'https://scale.com',            null,                                                                     84, 87, '1h',   1),
  s('weights-biases','Weights & Biases Blog','official_company','mlops',     'https://wandb.ai',             null,                                                                     83, 86, '1h',   2),
  s('databricks',    'Databricks Blog',      'official_company','platform',  'https://www.databricks.com',   'https://www.databricks.com/feed',                                        85, 87, '1h',   3),
  s('openrouter',    'OpenRouter News',      'official_company','platform',  'https://openrouter.ai',        'https://openrouter.ai/news/rss',                                         78, 80, '1h',   1),
  s('fireworks-ai',  'Fireworks AI Blog',    'official_company','platform',  'https://fireworks.ai',         null,                                                                     77, 80, '2h',   1),
  s('weaviate',      'Weaviate Blog',        'official_company','database',  'https://weaviate.io',          'https://weaviate.io/blog/rss.xml',                                       76, 80, '2h',   2),
  s('pinecone',      'Pinecone Blog',        'official_company','database',  'https://www.pinecone.io',      null,                                                                     76, 80, '2h',   2),
  s('chroma',        'Chroma Blog',          'official_company','database',  'https://www.trychroma.com',    null,                                                                     74, 78, '2h',   1),
  s('anyscale',      'Anyscale Blog',        'official_company','platform',  'https://www.anyscale.com',     'https://www.anyscale.com/blog/rss.xml',                                  76, 80, '2h',   1),
  s('roboflow',      'Roboflow Blog',        'official_company','vision_ai', 'https://roboflow.com',         'https://blog.roboflow.com/rss/',                                         75, 80, '2h',   2),
  s('google-cloud-ai','Google Cloud AI Blog','official_company','cloud',     'https://cloud.google.com',     'https://cloud.google.com/blog/products/ai-machine-learning/rss/',        90, 95, '15min',5),
  s('azure-ai',      'Azure AI Blog',        'official_company','cloud',     'https://azure.microsoft.com',  'https://azure.microsoft.com/en-us/blog/feed/',                           90, 95, '15min',4),
  s('ibm-research',  'IBM Research Blog',    'official_company','research',  'https://research.ibm.com',     null,                                                                     82, 88, '1h',   2),
  s('amazon-science','Amazon Science',       'official_company','research',  'https://www.amazon.science',   'https://www.amazon.science/research-areas/machine-learning/rss',         85, 90, '1h',   2),
  s('apple-ml',      'Apple ML Research',    'official_company','research',  'https://machinelearning.apple.com','https://machinelearning.apple.com/rss.xml',                          87, 92, '1h',   1),
  s('samsung-research','Samsung Research',  'official_company','research',  'https://research.samsung.com', null,                                                                     78, 82, '2h',   1),
  s('inflection',    'Inflection AI Blog',   'official_company','llm',       'https://inflection.ai',        null,                                                                     80, 83, '2h',   1),
  s('harvey-ai',     'Harvey AI Blog',       'official_company','legal_ai',  'https://www.harvey.ai',        null,                                                                     78, 82, '2h',   1),
  s('glean-ai',      'Glean Blog',           'official_company','enterprise','https://www.glean.com',        'https://www.glean.com/blog/rss.xml',                                     76, 80, '2h',   1),
  s('imbue',         'Imbue Blog',           'official_company','agent_ai',  'https://imbue.com',            null,                                                                     77, 81, '2h',   1),
  s('comet-ml',      'Comet ML Blog',        'official_company','mlops',     'https://www.comet.com',        null,                                                                     72, 76, '2h',   1),
  s('label-studio',  'Label Studio Blog',    'official_company','data',      'https://labelstud.io',         null,                                                                     70, 75, '2h',   1),
  s('lightning-ai',  'Lightning AI Blog',    'official_company','platform',  'https://lightning.ai',         'https://lightning.ai/blog/rss.xml',                                      74, 78, '2h',   1),
  s('mistral-platform','Mistral Platform',   'official_company','platform',  'https://console.mistral.ai',   null,                                                                     80, 84, '1h',   1),
  s('moonshot-ai',   'Moonshot AI',          'official_company','llm',       'https://www.moonshot.cn',      null,                                                                     75, 78, '2h',   1, false,'medium',false,'zh','CN'),
  s('deepseek',      'DeepSeek Blog',        'official_company','llm',       'https://www.deepseek.com',     null,                                                                     82, 85, '1h',   2, false,'medium',false,'zh','CN'),
  s('qwen',          'Qwen (Alibaba) Blog',  'official_company','llm',       'https://qwenlm.github.io',     'https://qwenlm.github.io/feed.xml',                                     80, 83, '1h',   1),
  s('nvidia-research','NVIDIA Research',     'official_company','research',  'https://research.nvidia.com',  null,                                                                     87, 90, '1h',   1),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 2. AI NEWS SITES (65 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AI_NEWS: CrawlSource[] = [
  s('venturebeat-ai',    'VentureBeat AI',          'ai_news','general',   'https://venturebeat.com',      'https://venturebeat.com/ai/feed/',                                       95,90,'10min',20),
  s('techcrunch-ai',     'TechCrunch AI',            'ai_news','general',   'https://techcrunch.com',       'https://techcrunch.com/category/artificial-intelligence/feed/',           95,92,'10min',15),
  s('the-decoder',       'The Decoder',              'ai_news','general',   'https://the-decoder.com',      'https://the-decoder.com/feed/',                                          88,88,'15min',6),
  s('marktechpost',      'MarkTechPost',             'ai_news','research',  'https://www.marktechpost.com', 'https://www.marktechpost.com/feed/',                                     82,80,'15min',20),
  s('analytics-india',   'Analytics India Mag',      'ai_news','india',     'https://analyticsindiamag.com','https://analyticsindiamag.com/feed/',                                    80,82,'15min',12),
  s('unite-ai',          'Unite.AI',                 'ai_news','general',   'https://www.unite.ai',         'https://www.unite.ai/feed/',                                             80,80,'30min',10),
  s('ai-business',       'AI Business',              'ai_news','enterprise','https://aibusiness.com',       'https://aibusiness.com/rss',                                             80,80,'30min',8),
  s('synced-review',     'Synced Review',            'ai_news','research',  'https://syncedreview.com',     'https://syncedreview.com/feed/',                                         78,82,'30min',5),
  s('towards-ai',        'Towards AI',               'ai_news','tutorial',  'https://towardsai.net',        'https://towardsai.net/feed/',                                            76,78,'30min',8),
  s('kdnuggets',         'KDnuggets',                'ai_news','general',   'https://www.kdnuggets.com',    'https://www.kdnuggets.com/feed',                                         82,85,'30min',10),
  s('infoq-ai',          'InfoQ AI',                 'ai_news','dev',       'https://www.infoq.com',        'https://feed.infoq.com/ai-ml-data-eng/',                                 78,82,'30min',5),
  s('ai-magazine',       'AI Magazine',              'ai_news','general',   'https://aimagazine.com',       'https://aimagazine.com/rss',                                             75,78,'30min',5),
  s('ml-mastery',        'Machine Learning Mastery', 'ai_news','tutorial',  'https://machinelearningmastery.com','https://machinelearningmastery.com/blog/feed/',                    78,80,'30min',5),
  s('wired-ai',          'Wired AI',                 'ai_news','general',   'https://www.wired.com',        'https://www.wired.com/feed/tag/artificial-intelligence/rss',             90,92,'15min',5, false,'medium'),
  s('mit-techreview',    'MIT Technology Review',    'ai_news','research',  'https://www.technologyreview.com','https://www.technologyreview.com/feed/',                             90,93,'15min',8, false,'medium'),
  s('the-verge-ai',      'The Verge AI',             'ai_news','general',   'https://www.theverge.com',     'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',     90,90,'10min',8),
  s('ars-technica-ai',   'Ars Technica AI',          'ai_news','general',   'https://arstechnica.com',      'https://arstechnica.com/tag/artificial-intelligence/feed/',              88,90,'15min',5),
  s('cnbc-ai',           'CNBC AI',                  'ai_news','business',  'https://www.cnbc.com',         'https://www.cnbc.com/id/100899163/device/rss/rss.html',                  88,88,'15min',8),
  s('reuters-ai',        'Reuters Technology',       'ai_news','business',  'https://www.reuters.com',      'https://feeds.reuters.com/reuters/technologyNews',                       90,92,'10min',10),
  s('ieee-spectrum-ai',  'IEEE Spectrum AI',         'ai_news','research',  'https://spectrum.ieee.org',    'https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss',     85,90,'30min',3),
  s('zdnet-ai',          'ZDNet AI',                 'ai_news','general',   'https://www.zdnet.com',        'https://www.zdnet.com/topic/artificial-intelligence/rss.xml',            82,82,'15min',8),
  s('the-register-ai',   'The Register AI',          'ai_news','dev',       'https://www.theregister.com',  'https://www.theregister.com/software/ai_ml/headlines.atom',             82,84,'15min',5),
  s('siliconangle',      'SiliconANGLE',             'ai_news','business',  'https://siliconangle.com',     'https://siliconangle.com/feed/',                                         78,80,'30min',8),
  s('last-week-ai',      'Last Week in AI',          'ai_news','newsletter','https://lastweekin.ai',        'https://lastweekin.ai/feed',                                             78,82,'1h',   3),
  s('future-tools',      'FutureTools',              'ai_news','tools',     'https://futuretools.io',        'https://futuretools.io/news/rss',                                        75,78,'1h',   5),
  s('fast-company-ai',   'Fast Company Tech',        'ai_news','business',  'https://www.fastcompany.com',  'https://www.fastcompany.com/technology/rss',                             82,84,'15min',5),
  s('ap-news-ai',        'AP News AI',               'ai_news','general',   'https://apnews.com',           'https://apnews.com/hub/artificial-intelligence?format=rss',              88,92,'10min',5),
  s('fortune-ai',        'Fortune AI',               'ai_news','business',  'https://fortune.com',          'https://fortune.com/tag/artificial-intelligence/feed/',                  82,84,'15min',5, false,'medium'),
  s('new-stack-ai',      'The New Stack AI',         'ai_news','dev',       'https://thenewstack.io',       'https://thenewstack.io/blog/feed/',                                      76,78,'1h',   5),
  s('datanami',          'Datanami',                 'ai_news','data',      'https://www.datanami.com',     'https://www.datanami.com/feed/',                                         74,76,'1h',   5),
  s('voicebot-ai',       'Voicebot.ai',              'ai_news','audio_ai',  'https://voicebot.ai',          'https://voicebot.ai/feed/',                                              72,75,'1h',   4),
  s('dzone-ai',          'DZone AI',                 'ai_news','dev',       'https://dzone.com',            'https://feeds.dzone.com/ai',                                             72,75,'1h',   5),
  s('towards-ds',        'Towards Data Science',     'ai_news','tutorial',  'https://towardsdatascience.com','https://towardsdatascience.com/feed',                                  78,80,'30min',15),
  s('built-in-ai',       'Built In AI',              'ai_news','general',   'https://builtin.com',          null,                                                                     70,72,'2h',   5),
  s('ai-authority',      'AI Authority',             'ai_news','general',   'https://aiauthority.com',      null,                                                                     68,70,'2h',   3),
  s('decrypt-ai',        'Decrypt AI',               'ai_news','general',   'https://decrypt.co',           'https://decrypt.co/feed',                                                72,75,'1h',   5),
  s('the-information',   'The Information',          'ai_news','business',  'https://www.theinformation.com',null,                                                                   85,88,'1h',   3, false,'medium',true),
  s('nyt-ai',            'NYT Technology',           'ai_news','general',   'https://www.nytimes.com',      'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',            88,92,'10min',5, false,'medium',true),
  s('wapo-ai',           'Washington Post AI',       'ai_news','general',   'https://www.washingtonpost.com',null,                                                                   85,88,'15min',3, false,'medium',true),
  s('guardian-ai',       'The Guardian AI',          'ai_news','general',   'https://www.theguardian.com',  'https://www.theguardian.com/technology/artificialintelligenceai/rss',   85,88,'15min',5),
  s('techradar-ai',      'TechRadar AI',             'ai_news','general',   'https://www.techradar.com',    'https://www.techradar.com/feeds/tag/ai',                                 78,80,'30min',8),
  s('tomshardware-ai',   "Tom's Hardware AI",        'ai_news','hardware',  'https://www.tomshardware.com', 'https://www.tomshardware.com/feeds/all',                                 75,78,'30min',5),
  s('theatlantic-ai',    'The Atlantic AI',          'ai_news','general',   'https://www.theatlantic.com',  'https://www.theatlantic.com/feed/all/',                                  78,82,'30min',2, false,'medium'),
  s('nature-news-ai',    'Nature News AI',           'ai_news','research',  'https://www.nature.com',       'https://www.nature.com/subjects/machine-learning.rss',                  88,95,'30min',3),
  s('science-daily-ai',  'Science Daily AI',         'ai_news','research',  'https://www.sciencedaily.com', 'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml',75,80,'30min',5),
  s('new-scientist-ai',  'New Scientist AI',         'ai_news','research',  'https://www.newscientist.com', 'https://www.newscientist.com/subject/technology/feed/',                  78,82,'30min',2),
  s('emerj-ai',          'Emerj AI Research',        'ai_news','enterprise','https://emerj.com',            'https://emerj.com/feed/',                                                72,76,'2h',   3),
  s('aimultiple',        'AIMultiple',               'ai_news','enterprise','https://aimultiple.com',       null,                                                                     70,72,'2h',   5),
  s('venturebeat-enterprise','VentureBeat Enterprise','ai_news','enterprise','https://venturebeat.com',     'https://venturebeat.com/category/enterprise-ai/feed/',                   88,88,'15min',8),
  s('ainews-io',         'AI News',                  'ai_news','general',   'https://artificialintelligence-news.com','https://www.artificialintelligence-news.com/feed/',            78,78,'30min',8),
  s('sd-times',          'SD Times AI',              'ai_news','dev',       'https://sdtimes.com',          'https://sdtimes.com/category/ai/feed/',                                  70,72,'2h',   3),
  s('forbes-ai',         'Forbes AI',                'ai_news','business',  'https://www.forbes.com',       'https://www.forbes.com/innovation/ai/feed2/',                            82,80,'30min',5, false,'medium'),
  s('businessinsider-ai','Business Insider AI',      'ai_news','business',  'https://www.businessinsider.com',null,                                                                  78,78,'30min',5, false,'medium',true),
  s('engadget-ai',       'Engadget AI',              'ai_news','general',   'https://www.engadget.com',     'https://www.engadget.com/rss.xml',                                       78,80,'30min',5),
  s('gizmodo-ai',        'Gizmodo AI',               'ai_news','general',   'https://gizmodo.com',          'https://gizmodo.com/feed/rss',                                           72,75,'1h',   5),
  s('popular-science-ai','Popular Science AI',       'ai_news','general',   'https://www.popsci.com',       'https://www.popsci.com/feed/',                                           72,75,'1h',   2),
  s('therundown-ai',     'The Rundown AI',           'ai_news','newsletter','https://www.therundown.ai',    null,                                                                     80,80,'1h',   1, true,'medium'),
  s('tldr-ai',           'TLDR AI',                  'ai_news','newsletter','https://tldr.tech/ai',         null,                                                                     78,78,'1h',   1),
  s('alphasignal',       'AlphaSignal',              'ai_news','newsletter','https://alphasignal.ai',        null,                                                                     76,78,'1h',   1),
  s('mindstream',        'Mindstream',               'ai_news','newsletter','https://www.mindstream.news',  null,                                                                     72,75,'1h',   1),
  s('pcmag-ai',          'PCMag AI',                 'ai_news','general',   'https://www.pcmag.com',        'https://www.pcmag.com/rss/news',                                         70,72,'2h',   3),
  s('indiama-ai',        'India AI (MeitY)',          'ai_news','government','https://indiaai.gov.in',       null,                                                                     75,82,'2h',   2, false,'low',false,'en','IN'),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 3. RESEARCH SOURCES (55 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const RESEARCH: CrawlSource[] = [
  s('arxiv-ai',      'arXiv cs.AI',          'research','papers',  'https://arxiv.org',            'https://arxiv.org/rss/cs.AI',                                            95,95,'30min',30),
  s('arxiv-cl',      'arXiv cs.CL (NLP)',    'research','papers',  'https://arxiv.org',            'https://arxiv.org/rss/cs.CL',                                            95,95,'30min',25),
  s('arxiv-lg',      'arXiv cs.LG (ML)',     'research','papers',  'https://arxiv.org',            'https://arxiv.org/rss/cs.LG',                                            95,95,'30min',40),
  s('arxiv-cv',      'arXiv cs.CV (Vision)', 'research','papers',  'https://arxiv.org',            'https://arxiv.org/rss/cs.CV',                                            93,95,'30min',20),
  s('arxiv-ne',      'arXiv cs.NE (Neural)', 'research','papers',  'https://arxiv.org',            'https://arxiv.org/rss/cs.NE',                                            88,95,'30min',5),
  s('arxiv-ro',      'arXiv cs.RO (Robots)', 'research','papers',  'https://arxiv.org',            'https://arxiv.org/rss/cs.RO',                                            85,95,'30min',8),
  s('arxiv-stat-ml', 'arXiv stat.ML',        'research','papers',  'https://arxiv.org',            'https://arxiv.org/rss/stat.ML',                                          88,95,'30min',10),
  s('papers-code',   'Papers With Code',     'research','papers',  'https://paperswithcode.com',   'https://paperswithcode.com/rss.xml',                                     90,92,'15min',10),
  s('openreview',    'OpenReview',           'research','papers',  'https://openreview.net',       null,                                                                     88,90,'1h',   10, true),
  s('acl-anthology', 'ACL Anthology',        'research','nlp',     'https://aclanthology.org',     null,                                                                     82,90,'2h',   5),
  s('neurips',       'NeurIPS',              'research','conference','https://neurips.cc',          null,                                                                     90,95,'24h',  2),
  s('icml',          'ICML',                 'research','conference','https://icml.cc',             null,                                                                     88,95,'24h',  2),
  s('iclr',          'ICLR',                 'research','conference','https://iclr.cc',             null,                                                                     88,95,'24h',  2),
  s('cvpr',          'CVPR',                 'research','conference','https://cvpr.thecvf.com',     null,                                                                     85,92,'24h',  1),
  s('emnlp',         'EMNLP',                'research','nlp',     'https://2024.emnlp.org',       null,                                                                     82,90,'24h',  1),
  s('google-research','Google Research Blog','research','blog',    'https://research.google',      'https://research.google/blog/rss/',                                      90,95,'1h',   2),
  s('msft-research', 'Microsoft Research',   'research','blog',    'https://www.microsoft.com/research','https://www.microsoft.com/en-us/research/blog/feed/',              88,92,'1h',   2),
  s('meta-research', 'Meta AI Research',     'research','blog',    'https://research.facebook.com','https://research.facebook.com/blog/feed/',                              88,92,'1h',   2),
  s('deepmind-research','DeepMind Research', 'research','blog',    'https://deepmind.google',      'https://deepmind.google/research/publications/rss.xml',                  90,95,'1h',   1),
  s('bair-blog',     'BAIR Blog (Berkeley)', 'research','blog',    'https://bair.berkeley.edu',    'https://bair.berkeley.edu/blog/feed.xml',                                85,90,'1h',   1),
  s('stanford-hai',  'Stanford HAI',         'research','blog',    'https://hai.stanford.edu',     'https://hai.stanford.edu/news/rss.xml',                                  85,92,'1h',   2),
  s('mit-ai',        'MIT AI News',          'research','blog',    'https://news.mit.edu',         'https://news.mit.edu/rss/topic/artificial-intelligence2',                85,90,'1h',   2),
  s('cmu-ml',        'CMU ML Blog',          'research','blog',    'https://blog.ml.cmu.edu',      'https://blog.ml.cmu.edu/feed/',                                         82,88,'2h',   1),
  s('oxford-ml',     'Oxford ML Research',   'research','blog',    'https://www.ox.ac.uk',         null,                                                                     80,88,'2h',   1),
  s('cambridge-ml',  'Cambridge ML Group',   'research','blog',    'https://mlg.eng.cam.ac.uk',    null,                                                                     78,85,'2h',   1),
  s('eth-zurich-ai', 'ETH Zurich AI',        'research','blog',    'https://ml.inf.ethz.ch',       null,                                                                     78,85,'2h',   1),
  s('epfl-ml',       'EPFL ML',              'research','blog',    'https://www.epfl.ch',          null,                                                                     75,82,'2h',   1),
  s('toronto-ai',    'Toronto AI (Vector)',   'research','blog',    'https://vectorinstitute.ai',   'https://vectorinstitute.ai/news/feed/',                                  78,85,'2h',   1),
  s('mila-ai',       'Mila Quebec AI',       'research','blog',    'https://mila.quebec',          null,                                                                     78,85,'2h',   1),
  s('allen-ai',      'Allen Institute AI',   'research','blog',    'https://allenai.org',          'https://allenai.org/blog/rss.xml',                                       82,88,'1h',   2),
  s('eleutherai',    'EleutherAI Blog',      'research','blog',    'https://www.eleuther.ai',      'https://blog.eleuther.ai/rss.xml',                                      80,85,'2h',   1),
  s('openai-research','OpenAI Research',     'research','papers',  'https://openai.com/research',  'https://openai.com/research/rss.xml',                                   95,98,'15min',1),
  s('anthropic-research','Anthropic Research','research','papers', 'https://www.anthropic.com/research','https://www.anthropic.com/research/rss',                          93,98,'30min',1),
  s('harvard-ai',    'Harvard AI',           'research','blog',    'https://seas.harvard.edu',     null,                                                                     78,85,'2h',   1),
  s('princeton-ai',  'Princeton AI',         'research','blog',    'https://ai.princeton.edu',     null,                                                                     76,82,'2h',   1),
  s('nyu-ai',        'NYU AI',               'research','blog',    'https://cilvr.nyu.edu',        null,                                                                     74,80,'2h',   1),
  s('gatech-ai',     'Georgia Tech AI',      'research','blog',    'https://www.cc.gatech.edu',    null,                                                                     72,78,'2h',   1),
  s('umich-ai',      'University of Michigan AI','research','blog','https://ai.umich.edu',         null,                                                                     72,78,'2h',   1),
  s('uw-ai',         'UW AI (Allen School)', 'research','blog',    'https://www.cs.washington.edu',null,                                                                     74,80,'2h',   1),
  s('kaist-ai',      'KAIST AI',             'research','blog',    'https://aiis.kaist.ac.kr',     null,                                                                     68,75,'2h',   1,false,'low',false,'en','KR'),
  s('kaust-ai',      'KAUST AI Initiative',  'research','blog',    'https://cemse.kaust.edu.sa',   null,                                                                     68,75,'2h',   1),
  s('gradient-pub',  'The Gradient Pub',     'research','blog',    'https://thegradient.pub',      'https://thegradient.pub/rss/',                                          78,82,'2h',   2),
  s('distill-pub',   'Distill.pub',          'research','blog',    'https://distill.pub',          'https://distill.pub/rss.xml',                                           85,90,'2h',   1),
  s('cleverhans',    'CleverHans Blog',      'research','security','https://www.cleverhans.io',    null,                                                                     72,78,'2h',   1),
  s('offconvex',     'Off the Convex Path',  'research','blog',    'https://www.offconvex.org',    'https://www.offconvex.org/feed.xml',                                    72,78,'2h',   1),
  s('lil-log',       "Lil'Log (Weng)",       'research','blog',    'https://lilianweng.github.io', 'https://lilianweng.github.io/lil-log/feed.xml',                        80,85,'24h',  1),
  s('interconnects', 'Interconnects',        'research','blog',    'https://www.interconnects.ai', 'https://www.interconnects.ai/feed',                                     78,82,'1h',   1),
  s('ahead-of-ai',   'Ahead of AI',          'research','blog',    'https://magazine.sebastianraschka.com','https://magazine.sebastianraschka.com/feed',                   78,82,'1h',   1),
  s('import-ai',     'Import AI (Jack Clark)','research','newsletter','https://jack-clark.net',    'https://jack-clark.net/feed/',                                          80,85,'1h',   1),
  s('the-batch',     'The Batch (deeplearning.ai)','research','newsletter','https://www.deeplearning.ai/the-batch/','https://www.deeplearning.ai/the-batch/feed/',         82,88,'1h',   1),
  s('latent-space',  'Latent Space Podcast', 'research','podcast', 'https://www.latent.space',     'https://www.latent.space/feed',                                         78,82,'1h',   1),
  s('semantic-scholar','Semantic Scholar',   'research','papers',  'https://www.semanticscholar.org',null,                                                                  82,88,'1h',   5, true),
  s('paperspace-ml', 'Paperspace ML Blog',   'research','blog',    'https://blog.paperspace.com',  'https://blog.paperspace.com/rss/',                                      70,74,'2h',   2),
  s('nlp-news',      'NLP News',             'research','nlp',     'https://nlp.elvissaravia.com',  null,                                                                   72,75,'1h',   1),
  s('ruder-nlp',     'Sebastian Ruder Blog', 'research','nlp',     'https://ruder.io',             'https://ruder.io/rss/index.rss',                                       78,82,'1h',   1),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 4. GITHUB SOURCES (45 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GITHUB: CrawlSource[] = [
  // Trending pages (no RSS â€” browser worker)
  s('gh-trending',      'GitHub Trending',         'github','trending', 'https://github.com/trending',                      null,88,90,'15min',20,true,'medium'),
  s('gh-trending-py',   'GitHub Trending Python',  'github','trending', 'https://github.com/trending/python',               null,85,88,'15min',10,true,'medium'),
  s('gh-trending-ts',   'GitHub Trending TypeScript','github','trending','https://github.com/trending/typescript',           null,80,85,'15min',5, true,'medium'),
  s('gh-trending-jup',  'GitHub Trending Notebooks','github','trending','https://github.com/trending/jupyter-notebook',      null,80,85,'15min',5, true,'medium'),
  s('gh-trending-rust', 'GitHub Trending Rust',    'github','trending', 'https://github.com/trending/rust',                 null,75,80,'30min',3, true,'medium'),
  s('gh-topic-ai',      'GitHub Topic: AI',        'github','topic',   'https://github.com/topics/artificial-intelligence', null,85,88,'30min',10,true,'medium'),
  s('gh-topic-llm',     'GitHub Topic: LLM',       'github','topic',   'https://github.com/topics/llm',                    null,88,90,'15min',10,true,'medium'),
  s('gh-topic-ml',      'GitHub Topic: ML',        'github','topic',   'https://github.com/topics/machine-learning',        null,82,85,'30min',10,true,'medium'),
  s('gh-topic-nlp',     'GitHub Topic: NLP',       'github','topic',   'https://github.com/topics/nlp',                    null,80,83,'30min',5, true,'medium'),
  s('gh-topic-cv',      'GitHub Topic: Vision',    'github','topic',   'https://github.com/topics/computer-vision',         null,78,82,'30min',5, true,'medium'),
  s('gh-topic-agent',   'GitHub Topic: Agent',     'github','topic',   'https://github.com/topics/agent',                  null,82,85,'30min',5, true,'medium'),
  s('gh-topic-rag',     'GitHub Topic: RAG',       'github','topic',   'https://github.com/topics/rag',                    null,82,85,'30min',5, true,'medium'),
  s('gh-topic-diffusion','GitHub Topic: Diffusion','github','topic',   'https://github.com/topics/diffusion-model',         null,78,82,'30min',3, true,'medium'),
  s('gh-topic-chatbot', 'GitHub Topic: Chatbot',   'github','topic',   'https://github.com/topics/chatbot',                null,75,78,'1h',   3, true,'medium'),
  // Org Atom feeds (RSS available)
  s('gh-huggingface',   'HuggingFace GitHub',      'github','org',     'https://github.com/huggingface',                   'https://github.com/huggingface.atom',88,90,'15min',5),
  s('gh-openai',        'OpenAI GitHub',            'github','org',     'https://github.com/openai',                        'https://github.com/openai.atom',90,92,'15min',2),
  s('gh-google',        'Google GitHub',            'github','org',     'https://github.com/google',                        'https://github.com/google.atom',85,88,'15min',5),
  s('gh-microsoft',     'Microsoft GitHub',         'github','org',     'https://github.com/microsoft',                     'https://github.com/microsoft.atom',85,88,'15min',5),
  s('gh-meta-llama',    'Meta LLaMA GitHub',        'github','org',     'https://github.com/meta-llama',                    'https://github.com/meta-llama.atom',88,90,'15min',2),
  s('gh-mistralai',     'Mistral AI GitHub',        'github','org',     'https://github.com/mistralai',                     'https://github.com/mistralai.atom',85,88,'15min',2),
  s('gh-pytorch',       'PyTorch GitHub',           'github','org',     'https://github.com/pytorch',                       'https://github.com/pytorch.atom',82,88,'30min',2),
  s('gh-tensorflow',    'TensorFlow GitHub',        'github','org',     'https://github.com/tensorflow',                    'https://github.com/tensorflow.atom',80,85,'30min',2),
  s('gh-langchain',     'LangChain GitHub',         'github','org',     'https://github.com/langchain-ai',                  'https://github.com/langchain-ai.atom',85,88,'15min',3),
  s('gh-runllama',      'LlamaIndex GitHub',        'github','org',     'https://github.com/run-llama',                     'https://github.com/run-llama.atom',82,85,'15min',2),
  s('gh-ollama',        'Ollama GitHub',            'github','org',     'https://github.com/ollama',                        'https://github.com/ollama.atom',82,85,'30min',2),
  s('gh-vllm',          'vLLM GitHub',              'github','org',     'https://github.com/vllm-project',                  'https://github.com/vllm-project.atom',80,85,'30min',1),
  s('gh-ggerganov',     'llama.cpp (ggerganov)',    'github','org',     'https://github.com/ggerganov',                     'https://github.com/ggerganov.atom',82,87,'30min',2),
  s('gh-eleutherai',    'EleutherAI GitHub',        'github','org',     'https://github.com/EleutherAI',                    'https://github.com/EleutherAI.atom',78,83,'1h',   1),
  s('gh-stanford-crfm', 'Stanford CRFM GitHub',    'github','org',     'https://github.com/stanford-crfm',                 'https://github.com/stanford-crfm.atom',78,85,'1h',  1),
  s('gh-lm-sys',        'lm-sys (LMSYS) GitHub',   'github','org',     'https://github.com/lm-sys',                        'https://github.com/lm-sys.atom',80,85,'30min',1),
  s('gh-unslothai',     'Unsloth GitHub',           'github','org',     'https://github.com/unslothai',                     'https://github.com/unslothai.atom',78,82,'1h',   1),
  s('gh-autogpt',       'AutoGPT GitHub',           'github','org',     'https://github.com/Significant-Gravitas',          'https://github.com/Significant-Gravitas.atom',75,80,'1h',1),
  s('gh-crewai',        'CrewAI GitHub',            'github','org',     'https://github.com/crewAIInc',                     'https://github.com/crewAIInc.atom',75,80,'1h',   1),
  s('gh-microsoft-autogen','Microsoft AutoGen',     'github','org',     'https://github.com/microsoft/autogen',             'https://github.com/microsoft/autogen/releases.atom',78,83,'1h',1),
  s('gh-phidata',       'Phidata (phi)',             'github','org',     'https://github.com/phidatahq',                     'https://github.com/phidatahq.atom',72,76,'1h',   1),
  s('gh-mlc-ai',        'MLC AI GitHub',            'github','org',     'https://github.com/mlc-ai',                        'https://github.com/mlc-ai.atom',75,80,'1h',   1),
  s('gh-nvidia-orgs',   'NVIDIA GitHub Orgs',       'github','org',     'https://github.com/NVIDIA',                        'https://github.com/NVIDIA.atom',82,87,'30min',2),
  s('gh-deepmind',      'DeepMind GitHub',          'github','org',     'https://github.com/google-deepmind',               'https://github.com/google-deepmind.atom',85,90,'30min',1),
  s('gh-apple-ml',      'Apple ML Research GitHub', 'github','org',     'https://github.com/apple',                         'https://github.com/apple.atom',80,85,'1h',   1),
  s('gh-facebookresearch','Meta Research GitHub',   'github','org',     'https://github.com/facebookresearch',              'https://github.com/facebookresearch.atom',82,87,'30min',2),
  s('gh-google-research','Google Research GitHub',  'github','org',     'https://github.com/google-research',               'https://github.com/google-research.atom',82,87,'30min',2),
  s('gh-amazon-science','Amazon Science GitHub',    'github','org',     'https://github.com/amazon-science',                'https://github.com/amazon-science.atom',78,83,'1h',  1),
  s('gh-berri-ai',      'LiteLLM GitHub',           'github','org',     'https://github.com/BerriAI',                       'https://github.com/BerriAI.atom',75,78,'1h',   1),
  s('gh-open-devin',    'OpenDevin GitHub',         'github','org',     'https://github.com/OpenDevin',                     'https://github.com/OpenDevin.atom',78,82,'1h',   1),
  s('gh-private-gpt',   'PrivateGPT GitHub',        'github','org',     'https://github.com/zylon-ai',                      'https://github.com/zylon-ai.atom',72,76,'1h',   1),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 5. COMMUNITY (30 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const COMMUNITY: CrawlSource[] = [
  s('reddit-ml',         'Reddit r/MachineLearning','community','reddit',  'https://reddit.com/r/MachineLearning',  'https://www.reddit.com/r/MachineLearning/.rss',                 88,80,'15min',20, false,'medium'),
  s('reddit-artificial', 'Reddit r/artificial',     'community','reddit',  'https://reddit.com/r/artificial',       'https://www.reddit.com/r/artificial/.rss',                      82,72,'15min',30, false,'medium'),
  s('reddit-openai',     'Reddit r/OpenAI',         'community','reddit',  'https://reddit.com/r/OpenAI',            'https://www.reddit.com/r/OpenAI/.rss',                          85,72,'15min',25, false,'medium'),
  s('reddit-local-llama','Reddit r/LocalLLaMA',     'community','reddit',  'https://reddit.com/r/LocalLLaMA',       'https://www.reddit.com/r/LocalLLaMA/.rss',                      85,75,'15min',20, false,'medium'),
  s('reddit-singularity','Reddit r/singularity',    'community','reddit',  'https://reddit.com/r/singularity',      'https://www.reddit.com/r/singularity/.rss',                     80,70,'15min',20, false,'medium'),
  s('reddit-chatgpt',    'Reddit r/ChatGPT',        'community','reddit',  'https://reddit.com/r/ChatGPT',          'https://www.reddit.com/r/ChatGPT/.rss',                         82,68,'15min',30, false,'medium'),
  s('reddit-learnml',    'Reddit r/learnmachinelearning','community','reddit','https://reddit.com/r/learnmachinelearning','https://www.reddit.com/r/learnmachinelearning/.rss',       72,70,'30min',10, false,'medium'),
  s('reddit-datascience','Reddit r/datascience',    'community','reddit',  'https://reddit.com/r/datascience',      'https://www.reddit.com/r/datascience/.rss',                     75,72,'30min',15, false,'medium'),
  s('reddit-deeplearning','Reddit r/deeplearning',  'community','reddit',  'https://reddit.com/r/deeplearning',     'https://www.reddit.com/r/deeplearning/.rss',                    75,72,'30min',10, false,'medium'),
  s('reddit-stable-diff','Reddit r/StableDiffusion','community','reddit',  'https://reddit.com/r/StableDiffusion',  'https://www.reddit.com/r/StableDiffusion/.rss',                 72,68,'30min',20, false,'medium'),
  s('reddit-midjourney', 'Reddit r/midjourney',     'community','reddit',  'https://reddit.com/r/midjourney',       'https://www.reddit.com/r/midjourney/.rss',                      68,65,'1h',   15, false,'medium'),
  s('reddit-technology', 'Reddit r/technology',     'community','reddit',  'https://reddit.com/r/technology',       'https://www.reddit.com/r/technology/.rss',                      78,70,'30min',30, false,'medium'),
  s('hn-frontpage',      'Hacker News Front Page',  'community','hn',      'https://news.ycombinator.com',          'https://hnrss.org/frontpage',                                   92,82,'10min',20),
  s('hn-ai',             'Hacker News AI',          'community','hn',      'https://news.ycombinator.com',          'https://hnrss.org/newest?q=AI+LLM+ChatGPT+Claude+Gemini',       90,82,'10min',10),
  s('hn-newest',         'Hacker News Newest',      'community','hn',      'https://news.ycombinator.com/newest',   'https://hnrss.org/newest',                                      80,75,'10min',30),
  s('hn-best',           'Hacker News Best',        'community','hn',      'https://news.ycombinator.com/best',     'https://hnrss.org/best',                                        85,82,'15min',10),
  s('lobsters',          'Lobste.rs',               'community','tech',    'https://lobste.rs',                     'https://lobste.rs/rss',                                         78,82,'15min',10),
  s('slashdot',          'Slashdot',                'community','tech',    'https://slashdot.org',                  'https://rss.slashdot.org/Slashdot/slashdotMain',                75,75,'30min',10),
  s('producthunt-ai',    'Product Hunt AI',         'community','product', 'https://www.producthunt.com',           'https://www.producthunt.com/feed?category=artificial-intelligence',80,72,'30min',5),
  s('kaggle-news',       'Kaggle Blog',             'community','data',    'https://medium.com/kaggle-blog',        'https://medium.com/feed/kaggle-blog',                           75,78,'2h',   2),
  s('huggingface-forum', 'HuggingFace Forum',       'community','forum',   'https://discuss.huggingface.co',        null,                                                            70,72,'1h',   5, true,'medium'),
  s('reddit-llmops',     'Reddit r/LLMDevs',        'community','reddit',  'https://reddit.com/r/LLMDevs',          'https://www.reddit.com/r/LLMDevs/.rss',                         72,68,'30min',5, false,'medium'),
  s('reddit-aisafety',   'Reddit r/aisafety',       'community','reddit',  'https://reddit.com/r/aisafety',         'https://www.reddit.com/r/aisafety/.rss',                        70,70,'1h',   5, false,'medium'),
  s('dev-to-ai',         'Dev.to AI',               'community','dev',     'https://dev.to',                        'https://dev.to/feed/tag/ai',                                    72,72,'1h',   10),
  s('hashnode-ai',       'Hashnode AI',             'community','dev',     'https://hashnode.com',                  null,                                                            68,70,'2h',   5, true,'medium'),
  s('medium-ai',         'Medium AI Topic',         'community','blog',    'https://medium.com/tag/artificial-intelligence','https://medium.com/feed/tag/artificial-intelligence',  75,68,'30min',20, false,'medium'),
  s('medium-ml',         'Medium ML Topic',         'community','blog',    'https://medium.com/tag/machine-learning','https://medium.com/feed/tag/machine-learning',               72,68,'30min',15, false,'medium'),
  s('substack-ai',       'Substack AI',             'community','blog',    'https://substack.com',                  null,                                                            70,65,'1h',   5, true,'medium'),
  s('linkedin-ai',       'LinkedIn AI Posts',       'community','social',  'https://www.linkedin.com',              null,                                                            72,65,'1h',   10, true,'high'),
  s('mastodon-ai',       'Mastodon AI (fosstodon)', 'community','social',  'https://fosstodon.org',                 'https://fosstodon.org/tags/ai.rss',                             60,62,'2h',   5),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 6. VC & FUNDING (30 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const VC_FUNDING: CrawlSource[] = [
  s('crunchbase-news',  'Crunchbase News',    'vc_funding','news',    'https://news.crunchbase.com',      'https://news.crunchbase.com/feed/',                                     82,80,'30min',10, false,'medium',true),
  s('a16z',             'a16z Blog',          'vc_funding','vc',      'https://a16z.com',                 'https://a16z.com/feed/',                                                82,85,'1h',   3),
  s('sequoia',          'Sequoia Capital',    'vc_funding','vc',      'https://www.sequoiacap.com',       null,                                                                    78,82,'2h',   1, true,'medium'),
  s('yc-blog',          'YC Blog',            'vc_funding','vc',      'https://www.ycombinator.com/blog', 'https://www.ycombinator.com/blog/rss',                                  82,85,'1h',   2),
  s('greylock',         'Greylock Blog',      'vc_funding','vc',      'https://greylock.com',             'https://greylock.com/feed/',                                            75,80,'2h',   1),
  s('lightspeed',       'Lightspeed Blog',    'vc_funding','vc',      'https://lsvp.com',                 null,                                                                    72,78,'2h',   1),
  s('nea',              'NEA Blog',           'vc_funding','vc',      'https://www.nea.com',              null,                                                                    70,75,'2h',   1),
  s('index-ventures',   'Index Ventures',     'vc_funding','vc',      'https://www.indexventures.com',    null,                                                                    72,78,'2h',   1),
  s('general-catalyst', 'General Catalyst',   'vc_funding','vc',      'https://www.generalcatalyst.com',  null,                                                                    72,78,'2h',   1),
  s('bessemer',         'Bessemer Venture',   'vc_funding','vc',      'https://www.bvp.com',              'https://www.bvp.com/feed/',                                             75,80,'2h',   1),
  s('gv',               'Google Ventures',    'vc_funding','vc',      'https://www.gv.com',               null,                                                                    72,78,'2h',   1),
  s('m12-microsoft',    'M12 (Microsoft VC)', 'vc_funding','vc',      'https://m12.vc',                   null,                                                                    70,75,'2h',   1),
  s('intel-capital',    'Intel Capital',      'vc_funding','vc',      'https://www.intelcapital.com',     null,                                                                    68,72,'2h',   1),
  s('first-round',      'First Round Review', 'vc_funding','vc',      'https://review.firstround.com',    'https://review.firstround.com/feed.xml',                                78,82,'2h',   2),
  s('khosla-ventures',  'Khosla Ventures',    'vc_funding','vc',      'https://www.khoslaventures.com',   null,                                                                    72,78,'2h',   1),
  s('founders-fund',    'Founders Fund',      'vc_funding','vc',      'https://foundersfund.com',          null,                                                                    72,78,'2h',   1),
  s('lux-capital',      'Lux Capital',        'vc_funding','vc',      'https://luxcapital.com',            null,                                                                    68,72,'2h',   1),
  s('theory-ventures',  'Theory Ventures',    'vc_funding','vc',      'https://www.theoryvc.com',          null,                                                                    65,70,'2h',   1),
  s('techcrunch-funding','TechCrunch Funding','vc_funding','news',    'https://techcrunch.com',            'https://techcrunch.com/category/venture/feed/',                         82,82,'15min',5),
  s('vb-funding',       'VentureBeat Funding','vc_funding','news',    'https://venturebeat.com',           'https://venturebeat.com/category/venture/feed/',                        80,80,'15min',5),
  s('sifted',           'Sifted (EU Tech)',   'vc_funding','news',    'https://sifted.eu',                 'https://sifted.eu/feed/',                                               72,76,'1h',   3),
  s('tech-eu',          'Tech.eu',            'vc_funding','news',    'https://tech.eu',                   'https://tech.eu/feed/',                                                 70,74,'1h',   3),
  s('siliconangle-funding','SiliconANGLE Funding','vc_funding','news','https://siliconangle.com',          'https://siliconangle.com/category/investments/feed/',                   72,74,'1h',   3),
  s('dealroom',         'Dealroom News',      'vc_funding','news',    'https://dealroom.co',               null,                                                                    72,76,'2h',   3, true,'medium'),
  s('nvidia-ventures',  'NVIDIA Ventures',    'vc_funding','vc',      'https://nvidiaventures.com',        null,                                                                    72,76,'2h',   1),
  s('samsung-next',     'Samsung NEXT',       'vc_funding','vc',      'https://www.samsungnext.com',       null,                                                                    68,72,'2h',   1),
  s('accel',            'Accel Partners',     'vc_funding','vc',      'https://www.accel.com',             null,                                                                    70,75,'2h',   1),
  s('coatue',           'Coatue Management',  'vc_funding','vc',      'https://www.coatue.com',            null,                                                                    68,72,'2h',   1),
  s('sv-angel',         'SV Angel',           'vc_funding','vc',      'https://svangel.com',               null,                                                                    65,70,'2h',   1),
  s('boldstart',        'Boldstart Ventures', 'vc_funding','vc',      'https://boldstart.vc',              null,                                                                    62,68,'2h',   1),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 7. DEVELOPER BLOGS (35 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DEVELOPER: CrawlSource[] = [
  s('pytorch-blog',     'PyTorch Blog',       'developer','framework', 'https://pytorch.org',              'https://pytorch.org/blog/feed.xml',                                    85,90,'1h',   2),
  s('tensorflow-blog',  'TensorFlow Blog',    'developer','framework', 'https://blog.tensorflow.org',      'https://blog.tensorflow.org/feeds/posts/default',                      82,88,'1h',   1),
  s('jax-blog',         'JAX (Google)',        'developer','framework', 'https://github.com/google/jax',    'https://github.com/google/jax/releases.atom',                          78,85,'2h',   1),
  s('keras-blog',       'Keras Blog',         'developer','framework', 'https://keras.io',                 null,                                                                   78,85,'2h',   1),
  s('fastai-blog',      'fast.ai Blog',       'developer','framework', 'https://www.fast.ai',              'https://www.fast.ai/atom.xml',                                         80,85,'2h',   1),
  s('langchain-blog',   'LangChain Blog',     'developer','framework', 'https://blog.langchain.dev',       'https://blog.langchain.dev/rss/',                                      85,88,'30min',2),
  s('llamaindex-blog',  'LlamaIndex Blog',    'developer','framework', 'https://www.llamaindex.ai',        'https://www.llamaindex.ai/blog/rss.xml',                               82,85,'30min',2),
  s('ollama-blog',      'Ollama Blog',        'developer','tool',     'https://ollama.com',               'https://ollama.com/blog/rss',                                          80,82,'30min',1),
  s('vllm-blog',        'vLLM Blog',          'developer','tool',     'https://blog.vllm.ai',             'https://blog.vllm.ai/feed.xml',                                        80,85,'30min',1),
  s('wandb-blog',       'W&B Blog',           'developer','mlops',    'https://wandb.ai',                 'https://wandb.ai/site/blog/rss.xml',                                   78,82,'1h',   2),
  s('mlflow-blog',      'MLflow Blog',        'developer','mlops',    'https://mlflow.org',               null,                                                                   72,78,'2h',   1),
  s('ray-blog',         'Ray (Anyscale) Blog','developer','platform', 'https://www.anyscale.com',         'https://www.anyscale.com/blog/rss.xml',                                76,80,'2h',   1),
  s('streamlit-blog',   'Streamlit Blog',     'developer','tool',     'https://blog.streamlit.io',        'https://blog.streamlit.io/rss/',                                       72,76,'2h',   1),
  s('gradio-blog',      'Gradio Blog',        'developer','tool',     'https://www.gradio.app',           null,                                                                   70,75,'2h',   1),
  s('litellm-blog',     'LiteLLM Blog',       'developer','tool',     'https://blog.litellm.ai',          null,                                                                   72,76,'1h',   1),
  s('vercel-ai-blog',   'Vercel AI Blog',     'developer','platform', 'https://vercel.com',               'https://vercel.com/blog/rss.xml',                                      80,82,'1h',   2),
  s('cloudflare-ai-blog','Cloudflare AI Blog','developer','platform', 'https://blog.cloudflare.com',      'https://blog.cloudflare.com/tag/ai/rss/',                              80,85,'1h',   2),
  s('openrouter-blog',  'OpenRouter Blog',    'developer','platform', 'https://openrouter.ai',            'https://openrouter.ai/news/rss',                                       75,78,'1h',   1),
  s('deepseek-blog',    'DeepSeek Blog',      'developer','llm',      'https://github.com/deepseek-ai',   'https://github.com/deepseek-ai/DeepSeek-V3/releases.atom',             82,85,'30min',1),
  s('unsloth-blog',     'Unsloth Blog',       'developer','tool',     'https://unsloth.ai',               null,                                                                   75,78,'2h',   1),
  s('modal-blog-dev',   'Modal Labs Blog',    'developer','platform', 'https://modal.com',                'https://modal.com/blog/rss',                                           76,80,'2h',   1),
  s('replicate-blog-dev','Replicate Blog',    'developer','platform', 'https://replicate.com',            'https://replicate.com/blog/rss',                                       74,78,'2h',   1),
  s('dspy-blog',        'DSPy Blog',          'developer','framework', 'https://github.com/stanfordnlp/dspy','https://github.com/stanfordnlp/dspy/releases.atom',                76,80,'2h',   1),
  s('semantic-kernel',  'Semantic Kernel',    'developer','framework', 'https://devblogs.microsoft.com',   'https://devblogs.microsoft.com/semantic-kernel/feed/',                 75,80,'2h',   1),
  s('mem0-blog',        'Mem0 Blog',          'developer','tool',     'https://mem0.ai',                  null,                                                                   68,72,'2h',   1),
  s('opendevin-blog',   'OpenDevin/OpenHands','developer','agent',    'https://github.com/OpenDevin',     'https://github.com/OpenDevin/OpenDevin/releases.atom',                 72,76,'2h',   1),
  s('autogen-blog',     'AutoGen Blog',       'developer','agent',    'https://microsoft.github.io/autogen','https://microsoft.github.io/autogen/blog/rss.xml',                  76,80,'1h',   1),
  s('crewai-blog',      'CrewAI Blog',        'developer','agent',    'https://www.crewai.com',           'https://www.crewai.com/blog/rss.xml',                                  74,78,'2h',   1),
  s('phidata-blog',     'Phidata Blog',       'developer','agent',    'https://www.phidata.com',          null,                                                                   68,72,'2h',   1),
  s('privategpt-blog',  'PrivateGPT',         'developer','local_ai', 'https://docs.privategpt.dev',      null,                                                                   65,70,'2h',   1),
  s('localai-blog',     'LocalAI',            'developer','local_ai', 'https://localai.io',               'https://localai.io/feed.xml',                                          68,72,'2h',   1),
  s('lmstudio-blog',    'LM Studio',          'developer','local_ai', 'https://lmstudio.ai',              null,                                                                   70,74,'2h',   1),
  s('continue-dev',     'Continue.dev Blog',  'developer','coding_ai','https://blog.continue.dev',        'https://blog.continue.dev/rss.xml',                                    70,74,'2h',   1),
  s('cursor-blog',      'Cursor Blog',        'developer','coding_ai','https://www.cursor.com',           null,                                                                   75,78,'1h',   1),
  s('codeium-blog',     'Codeium Blog',       'developer','coding_ai','https://codeium.com',              'https://codeium.com/blog/rss.xml',                                     72,76,'1h',   1),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 8. DOMAIN-SPECIFIC AI (80 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DOMAIN_AI: CrawlSource[] = [
  // Healthcare AI
  s('nih-ai',           'NIH AI News',        'healthcare_ai','government','https://www.nih.gov',           null,                                                                   78,90,'2h',   2),
  s('fda-ai',           'FDA AI',             'healthcare_ai','government','https://www.fda.gov',           null,                                                                   78,90,'2h',   1),
  s('stat-news-ai',     'STAT News AI',       'healthcare_ai','news',     'https://www.statnews.com',      'https://www.statnews.com/feed/',                                       80,85,'1h',   3),
  s('nejm-ai',          'NEJM AI',            'healthcare_ai','journal',  'https://ai.nejm.org',           null,                                                                   82,90,'2h',   2, true,'medium',true),
  s('nature-medicine-ai','Nature Medicine AI','healthcare_ai','journal',  'https://www.nature.com/nm',     'https://www.nature.com/nm.rss',                                        82,92,'2h',   1),
  s('fierce-healthcare-ai','Fierce Healthcare','healthcare_ai','news',    'https://www.fiercehealthcare.com','https://www.fiercehealthcare.com/rss/xml',                           72,75,'1h',   3),
  s('google-health',    'Google Health AI',   'healthcare_ai','company',  'https://health.google',         null,                                                                   78,85,'2h',   1),
  s('microsoft-health', 'Microsoft Health AI','healthcare_ai','company',  'https://www.microsoft.com/en-us/industry/health/',null,                                                72,80,'2h',   1),
  s('tempus-ai',        'Tempus AI Blog',     'healthcare_ai','company',  'https://www.tempus.com',        null,                                                                   70,75,'2h',   1),
  s('recursion-ai',     'Recursion Pharma AI','healthcare_ai','company',  'https://www.recursion.com',     null,                                                                   68,72,'2h',   1),
  s('epic-ai',          'Epic Research AI',   'healthcare_ai','company',  'https://www.epic.com',          null,                                                                   70,78,'2h',   1),
  s('pathai',           'PathAI Blog',        'healthcare_ai','company',  'https://www.pathai.com',        null,                                                                   65,70,'2h',   1),
  s('isomorphic-labs',  'Isomorphic Labs',    'healthcare_ai','research', 'https://www.isomorphiclabs.com',null,                                                                   72,78,'2h',   1),
  s('nvidia-health',    'NVIDIA Healthcare AI','healthcare_ai','company', 'https://www.nvidia.com/en-us/healthcare/',null,                                                         72,80,'2h',   1),
  s('aws-health-ai',    'AWS Health AI',      'healthcare_ai','company',  'https://aws.amazon.com/health/',null,                                                                   72,80,'2h',   1),

  // Finance AI
  s('bloomberg-tech',   'Bloomberg Tech',     'finance_ai','news',       'https://www.bloomberg.com/technology',null,                                                             85,88,'15min',5, false,'high',true),
  s('ft-ai',            'Financial Times AI', 'finance_ai','news',       'https://www.ft.com',            null,                                                                   85,88,'15min',3, false,'high',true),
  s('wsj-ai',           'WSJ AI',             'finance_ai','news',       'https://www.wsj.com',           null,                                                                   85,88,'15min',3, false,'high',true),
  s('mckinsey-ai',      'McKinsey AI',        'finance_ai','consulting', 'https://www.mckinsey.com',      'https://www.mckinsey.com/capabilities/quantumblack/rss',               80,85,'2h',   2),
  s('goldman-ai',       'Goldman Sachs AI',   'finance_ai','banking',   'https://www.goldmansachs.com',   null,                                                                   75,82,'2h',   1),
  s('pwc-ai',           'PwC AI Research',    'finance_ai','consulting', 'https://www.pwc.com',           null,                                                                   74,80,'2h',   2),
  s('deloitte-ai',      'Deloitte AI',        'finance_ai','consulting', 'https://www2.deloitte.com',     null,                                                                   72,78,'2h',   2),
  s('two-sigma',        'Two Sigma Blog',     'finance_ai','quant',     'https://www.twosigma.com',       null,                                                                   70,78,'2h',   1),
  s('accenture-ai',     'Accenture AI',       'finance_ai','consulting', 'https://www.accenture.com',     null,                                                                   72,78,'2h',   2),
  s('fintechfutures-ai','FinTech Futures AI', 'finance_ai','news',      'https://www.fintechfutures.com',  'https://www.fintechfutures.com/feed/',                                68,72,'2h',   2),
  s('americanbanker-ai','American Banker AI', 'finance_ai','news',      'https://www.americanbanker.com', null,                                                                   68,72,'2h',   2, false,'medium',true),

  // Education AI
  s('edsurge-ai',       'EdSurge AI',         'education_ai','news',    'https://www.edsurge.com',        'https://www.edsurge.com/research/articles.rss',                        72,75,'2h',   3),
  s('edtech-digest',    'EdTech Digest',      'education_ai','news',    'https://edtechdigest.com',        'https://edtechdigest.com/feed/',                                       68,70,'2h',   3),
  s('duolingo-ai',      'Duolingo AI Blog',   'education_ai','company', 'https://blog.duolingo.com',      'https://blog.duolingo.com/rss/',                                       75,78,'2h',   1),
  s('khanacademy-ai',   'Khan Academy AI',    'education_ai','company', 'https://blog.khanacademy.org',   'https://blog.khanacademy.org/feed/',                                   75,78,'2h',   1),
  s('coursera-ai',      'Coursera AI Blog',   'education_ai','company', 'https://blog.coursera.org',      'https://blog.coursera.org/feed/',                                      70,74,'2h',   1),
  s('carnegie-learning','Carnegie Learning',  'education_ai','company', 'https://www.carnegielearning.com',null,                                                                  65,70,'2h',   1),
  s('chegg-ai',         'Chegg AI',           'education_ai','company', 'https://www.chegg.com',          null,                                                                   65,70,'2h',   1),
  s('pearson-ai',       'Pearson AI',         'education_ai','company', 'https://www.pearson.com',        null,                                                                   65,70,'2h',   1),
  s('eschool-ai',       'eSchool News AI',    'education_ai','news',    'https://www.eschoolnews.com',    'https://www.eschoolnews.com/category/ai-insights/feed/',                65,68,'2h',   2),
  s('deeplearning-edu', 'DeepLearning.AI Edu','education_ai','company', 'https://www.deeplearning.ai',    'https://www.deeplearning.ai/blog/feed/',                               80,85,'2h',   2),

  // Legal AI
  s('artificial-lawyer','Artificial Lawyer',  'legal_ai','news',        'https://www.artificiallawyer.com','https://www.artificiallawyer.com/feed/',                              75,80,'2h',   3),
  s('law-com-ai',       'Law.com AI',         'legal_ai','news',        'https://www.law.com',            null,                                                                   72,75,'2h',   2, false,'medium',true),
  s('legal-it-insider', 'Legal IT Insider',   'legal_ai','news',        'https://legalitinsider.co.uk',   'https://legalitinsider.co.uk/feed/',                                   68,72,'2h',   2),
  s('harvey-ai-blog',   'Harvey AI Blog',     'legal_ai','company',     'https://www.harvey.ai',          null,                                                                   72,76,'2h',   1),
  s('casetext-blog',    'Casetext Blog',      'legal_ai','company',     'https://casetext.com',           null,                                                                   65,70,'2h',   1),
  s('lexisnexis-ai',    'LexisNexis AI',      'legal_ai','company',     'https://www.lexisnexis.com',     null,                                                                   68,75,'2h',   1),
  s('thomson-reuters-ai','Thomson Reuters AI','legal_ai','company',      'https://www.thomsonreuters.com', null,                                                                   70,78,'2h',   1),
  s('bloomberg-law-ai', 'Bloomberg Law AI',   'legal_ai','company',     'https://pro.bloomberglaw.com',   null,                                                                   70,78,'2h',   1, false,'medium',true),

  // Robotics
  s('ieee-robotics',    'IEEE Robotics',      'robotics','journal',     'https://ieeexplore.ieee.org',    'https://ieeexplore.ieee.org/rss/TOC8860.XML',                          78,85,'2h',   2),
  s('robot-report',     'The Robot Report',   'robotics','news',        'https://www.therobotreport.com', 'https://www.therobotreport.com/feed/',                                  75,78,'2h',   3),
  s('robotics-biz-review','Robotics Business','robotics','news',        'https://www.roboticsbusinessreview.com','https://www.roboticsbusinessreview.com/feed/',                  70,74,'2h',   2),
  s('wevolver',         'Wevolver',           'robotics','news',        'https://www.wevolver.com',       null,                                                                   68,72,'2h',   2),
  s('boston-dynamics',  'Boston Dynamics Blog','robotics','company',    'https://bostondynamics.com',     null,                                                                   75,82,'2h',   1),
  s('figure-ai',        'Figure AI Blog',     'robotics','company',     'https://www.figure.ai',          null,                                                                   72,78,'2h',   1),
  s('agility-robotics', 'Agility Robotics',   'robotics','company',     'https://agilityrobotics.com',   null,                                                                   68,72,'2h',   1),
  s('1x-technologies',  '1X Technologies',    'robotics','company',     'https://www.1x.tech',            null,                                                                   65,70,'2h',   1),
  s('physical-intelligence','Physical Intelligence','robotics','company','https://www.physicalintelligence.company',null,                                                         70,76,'2h',   1),
  s('unitree-robotics', 'Unitree Robotics',   'robotics','company',     'https://www.unitree.com',        null,                                                                   65,70,'2h',1,false,'low',false,'en','CN'),

  // GPU & Semiconductor
  s('nvidia-newsroom',  'NVIDIA Newsroom',    'semiconductor','gpu',    'https://nvidianews.nvidia.com',  'https://nvidianews.nvidia.com/rss/releases',                           92,95,'10min',2),
  s('amd-ai',           'AMD AI Blog',        'semiconductor','gpu',    'https://community.amd.com',      null,                                                                   82,85,'1h',   1),
  s('intel-ai',         'Intel AI Blog',      'semiconductor','chip',   'https://www.intel.com/ai',       'https://www.intel.com/content/www/us/en/artificial-intelligence/blog.rss',78,82,'2h',1),
  s('qualcomm-ai',      'Qualcomm AI Research','semiconductor','chip',  'https://www.qualcomm.com/research/ai','https://www.qualcomm.com/news/rss/rss.xml',                      76,80,'2h',   1),
  s('arm-ai',           'Arm AI',             'semiconductor','chip',   'https://www.arm.com',            'https://community.arm.com/arm-community-blogs/b/ai-and-ml-blog/rss',  74,78,'2h',   1),
  s('sambanova',        'SambaNova Blog',     'semiconductor','chip',   'https://sambanova.ai',           null,                                                                   68,72,'2h',   1),
  s('graphcore',        'Graphcore Blog',     'semiconductor','chip',   'https://www.graphcore.ai',       'https://www.graphcore.ai/posts/rss.xml',                               68,72,'2h',   1),
  s('tenstorrent',      'Tenstorrent Blog',   'semiconductor','chip',   'https://tenstorrent.com',        null,                                                                   65,70,'2h',   1),
  s('hailo',            'Hailo Blog',         'semiconductor','chip',   'https://hailo.ai',               'https://hailo.ai/blog/rss/',                                           62,68,'2h',   1),
  s('d-matrix',         'd-Matrix Blog',      'semiconductor','chip',   'https://www.d-matrix.ai',        null,                                                                   60,65,'2h',   1),

  // Cloud AI
  s('aws-ml-blog',      'AWS ML Blog',        'cloud_ai','cloud',       'https://aws.amazon.com/blogs/machine-learning','https://aws.amazon.com/blogs/machine-learning/feed/',   88,90,'15min',5),
  s('gcp-ai-blog',      'GCP AI Blog',        'cloud_ai','cloud',       'https://cloud.google.com/blog', 'https://cloud.google.com/blog/products/ai-machine-learning/rss/',       88,90,'15min',5),
  s('azure-ai-blog',    'Azure AI Blog',      'cloud_ai','cloud',       'https://azure.microsoft.com/blog','https://azure.microsoft.com/en-us/blog/feed/',                       88,90,'15min',5),
  s('ibm-cloud-ai',     'IBM Cloud AI',       'cloud_ai','cloud',       'https://www.ibm.com/blog',      'https://www.ibm.com/blog/feed/',                                        76,80,'2h',   2),
  s('salesforce-ai',    'Salesforce AI Blog', 'cloud_ai','cloud',       'https://www.salesforce.com/blog','https://www.salesforce.com/blog/rss/',                                76,80,'2h',   2),
  s('snowflake-ai',     'Snowflake AI Blog',  'cloud_ai','cloud',       'https://www.snowflake.com/blog','https://www.snowflake.com/blog/feed/',                                  74,78,'2h',   2),
  s('databricks-ml',    'Databricks ML Blog', 'cloud_ai','cloud',       'https://www.databricks.com/blog','https://www.databricks.com/blog/feed',                                80,84,'1h',   3),
  s('oracle-ai',        'Oracle AI Blog',     'cloud_ai','cloud',       'https://blogs.oracle.com/ai',   null,                                                                   70,75,'2h',   1),
  s('sap-ai',           'SAP AI Blog',        'cloud_ai','cloud',       'https://news.sap.com',          'https://news.sap.com/feed/',                                            68,72,'2h',   1),
  s('redhat-ai',        'Red Hat AI',         'cloud_ai','cloud',       'https://www.redhat.com/en/blog','https://www.redhat.com/en/rss/blog',                                   70,75,'2h',   1),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 9. GOVERNMENT AI (15 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GOVERNMENT_AI: CrawlSource[] = [
  s('nist-ai',          'NIST AI',            'government_ai','us',     'https://www.nist.gov/artificial-intelligence',null,                                                      78,90,'2h',   1),
  s('darpa-ai',         'DARPA AI News',      'government_ai','us',     'https://www.darpa.mil',         'https://www.darpa.mil/rss-feeds/all-news',                              75,88,'2h',   1),
  s('nsf-ai',           'NSF AI',             'government_ai','us',     'https://www.nsf.gov/ai',        null,                                                                   72,85,'2h',   1),
  s('ai-gov',           'AI.gov',             'government_ai','us',     'https://ai.gov',                null,                                                                   70,85,'2h',   1),
  s('uk-aisi',          'UK AI Safety Institute','government_ai','uk',  'https://www.gov.uk/government/organisations/ai-safety-institute','https://www.gov.uk/search/news-and-communications.atom?keywords=AI',68,82,'2h',1,false,'low',false,'en','GB'),
  s('eu-ai-act',        'EU AI Act News',     'government_ai','eu',     'https://digital-strategy.ec.europa.eu',null,                                                            72,85,'2h',1,false,'low',false,'en','EU'),
  s('oecd-ai',          'OECD AI',            'government_ai','intl',   'https://oecd.ai',               null,                                                                   70,82,'2h',   1),
  s('unesco-ai',        'UNESCO AI',          'government_ai','intl',   'https://www.unesco.org/en/artificial-intelligence',null,                                                68,80,'2h',   1),
  s('canada-cifar-ai',  'CIFAR AI (Canada)',  'government_ai','canada', 'https://cifar.ca',              'https://cifar.ca/feed/',                                                65,78,'2h',1,false,'low',false,'en','CA'),
  s('singapore-ai',     'Singapore AI',       'government_ai','sg',     'https://www.smartnation.gov.sg','https://www.smartnation.gov.sg/media-hub/press-releases/rss',          65,78,'2h',1,false,'low',false,'en','SG'),
  s('meity-ai',         'MeitY India AI',     'government_ai','india',  'https://www.meity.gov.in',      null,                                                                   65,80,'2h',1,false,'low',false,'en','IN'),
  s('cisa-ai',          'CISA AI Security',   'government_ai','us',     'https://www.cisa.gov',          'https://www.cisa.gov/news.xml',                                         70,85,'2h',1),
  s('whitehouse-ai',    'White House OSTP AI','government_ai','us',     'https://www.whitehouse.gov/ostp','https://www.whitehouse.gov/feed/',                                    72,85,'2h',1),
  s('australia-ai',     'Australia AI Ethics','government_ai','au',     'https://www.industry.gov.au/ai',null,                                                                   60,75,'2h',1,false,'low',false,'en','AU'),
  s('japan-ai',         'Japan AI Strategy',  'government_ai','jp',     'https://www.digital.go.jp',     null,                                                                   58,72,'2h',1,false,'low',false,'en','JP'),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 10. INDIA AI SOURCES (20 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const INDIA_AI: CrawlSource[] = [
  s('analytics-vidhya', 'Analytics Vidhya',  'india_ai','tutorial',   'https://www.analyticsvidhya.com','https://www.analyticsvidhya.com/blog/feed/',                           80,80,'30min',15,false,'low',false,'en','IN'),
  s('nasscom-ai',       'NASSCOM AI',         'india_ai','industry',   'https://nasscom.in',            null,                                                                   72,80,'2h',3,false,'low',false,'en','IN'),
  s('inc42-ai',         'Inc42 AI',           'india_ai','startup',    'https://inc42.com',             'https://inc42.com/feed/',                                               72,75,'30min',10,false,'low',false,'en','IN'),
  s('yourstory-ai',     'YourStory AI',       'india_ai','startup',    'https://yourstory.com',         null,                                                                   68,72,'1h',5,false,'low',false,'en','IN'),
  s('livemint-ai',      'LiveMint AI',        'india_ai','business',   'https://www.livemint.com',      'https://www.livemint.com/rss/technology',                              70,72,'1h',5,false,'low',false,'en','IN'),
  s('et-ai',            'Economic Times AI',  'india_ai','business',   'https://economictimes.indiatimes.com','https://economictimes.indiatimes.com/tech/rss',                 70,72,'1h',5,false,'low',false,'en','IN'),
  s('moneycontrol-ai',  'Moneycontrol Tech',  'india_ai','business',   'https://www.moneycontrol.com',  null,                                                                   65,68,'1h',3,false,'low',false,'en','IN'),
  s('iit-madras-ai',    'IIT Madras AI',      'india_ai','research',   'https://www.iitm.ac.in',        null,                                                                   68,78,'2h',1,false,'low',false,'en','IN'),
  s('iisc-ai',          'IISc AI Lab',        'india_ai','research',   'https://www.iisc.ac.in',        null,                                                                   65,78,'2h',1,false,'low',false,'en','IN'),
  s('devfolio-ai',      'Devfolio AI',        'india_ai','community',  'https://devfolio.co',           null,                                                                   60,65,'2h',2,false,'low',false,'en','IN'),
  s('great-learning',   'Great Learning AI',  'india_ai','tutorial',   'https://www.mygreatlearning.com','https://www.mygreatlearning.com/blog/category/artificial-intelligence/feed/',65,68,'2h',3,false,'low',false,'en','IN'),
  s('packt-ai',         'Packt AI Books',     'india_ai','tutorial',   'https://www.packtpub.com',      null,                                                                   60,65,'2h',2,false,'low',false,'en','IN'),
  s('geeksforgeeks-ai', 'GeeksForGeeks AI',   'india_ai','tutorial',   'https://www.geeksforgeeks.org', 'https://www.geeksforgeeks.org/feed/',                                  65,65,'1h',10,false,'low',false,'en','IN'),
  s('ndtv-tech-ai',     'NDTV Tech AI',       'india_ai','news',       'https://www.ndtv.com/technology','https://feeds.feedburner.com/ndtvtech',                               65,68,'1h',5,false,'low',false,'en','IN'),
  s('businessline-ai',  'BusinessLine AI',    'india_ai','business',   'https://www.thehindubusinessline.com','https://www.thehindubusinessline.com/companies/telecom/rss',   65,70,'2h',2,false,'low',false,'en','IN'),
  s('the-ken-ai',       'The Ken AI',         'india_ai','business',   'https://the-ken.com',           null,                                                                   70,75,'2h',1,false,'low',false,'en','IN'),
  s('entrackr-ai',      'Entrackr AI',        'india_ai','startup',    'https://entrackr.com',          'https://entrackr.com/feed/',                                           62,65,'2h',2,false,'low',false,'en','IN'),
  s('cbinsights-india', 'CB Insights India',  'india_ai','startup',    'https://www.cbinsights.com',    null,                                                                   70,75,'2h',2,false,'low',false,'en','IN'),
  s('iimb-ai',          'IIM Bangalore AI',   'india_ai','research',   'https://www.iimb.ac.in',        null,                                                                   62,72,'2h',1,false,'low',false,'en','IN'),
  s('nasscom-community','NASSCOM Community',   'india_ai','community',  'https://community.nasscom.in',  null,                                                                   60,68,'2h',3,false,'low',false,'en','IN'),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 11. SEARCH / GOOGLE NEWS / BING NEWS (25 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SEARCH_SOURCES: CrawlSource[] = [
  s('gnews-ai',         'Google News: AI',           'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=artificial+intelligence+AI&hl=en-US&gl=US&ceid=US:en',90,72,'10min',30),
  s('gnews-llm',        'Google News: LLM',          'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=LLM+large+language+model&hl=en-US&gl=US&ceid=US:en', 88,72,'10min',15),
  s('gnews-openai',     'Google News: OpenAI',       'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=OpenAI+ChatGPT&hl=en-US&gl=US&ceid=US:en',           88,72,'10min',15),
  s('gnews-anthropic',  'Google News: Anthropic',    'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=Anthropic+Claude+AI&hl=en-US&gl=US&ceid=US:en',      86,72,'10min',8),
  s('gnews-gemini',     'Google News: Gemini',       'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=Google+Gemini+AI&hl=en-US&gl=US&ceid=US:en',         86,72,'10min',10),
  s('gnews-grok',       'Google News: Grok/xAI',     'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=xAI+Grok+Elon+Musk&hl=en-US&gl=US&ceid=US:en',      84,70,'10min',8),
  s('gnews-nvidia',     'Google News: NVIDIA AI',    'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=NVIDIA+AI+GPU&hl=en-US&gl=US&ceid=US:en',            86,72,'10min',8),
  s('gnews-models',     'Google News: AI Models',    'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=AI+model+release+launch&hl=en-US&gl=US&ceid=US:en',  85,70,'10min',10),
  s('gnews-funding',    'Google News: AI Funding',   'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=AI+startup+funding+investment&hl=en-US&gl=US&ceid=US:en',84,68,'15min',8),
  s('gnews-sam-altman', 'Google News: Sam Altman',   'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=Sam+Altman&hl=en-US&gl=US&ceid=US:en',              82,68,'15min',5),
  s('gnews-karpathy',   'Google News: Karpathy',     'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=Andrej+Karpathy&hl=en-US&gl=US&ceid=US:en',         80,68,'15min',3),
  s('gnews-lecun',      'Google News: Yann LeCun',   'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=Yann+LeCun+Meta+AI&hl=en-US&gl=US&ceid=US:en',      80,68,'15min',3),
  s('gnews-jensen',     'Google News: Jensen Huang', 'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=Jensen+Huang+NVIDIA&hl=en-US&gl=US&ceid=US:en',     82,68,'15min',4),
  s('gnews-andrew-ng',  'Google News: Andrew Ng',    'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=Andrew+Ng+AI&hl=en-US&gl=US&ceid=US:en',            78,68,'15min',2),
  s('gnews-mistral',    'Google News: Mistral AI',   'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=Mistral+AI&hl=en-US&gl=US&ceid=US:en',              80,68,'15min',3),
  s('gnews-deepseek',   'Google News: DeepSeek',     'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=DeepSeek+AI&hl=en-US&gl=US&ceid=US:en',             82,68,'10min',4),
  s('gnews-ai-india',   'Google News: AI India',     'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=artificial+intelligence+India&hl=en-IN&gl=IN&ceid=IN:en',78,65,'15min',8,false,'low',false,'en','IN'),
  s('gnews-ai-agent',   'Google News: AI Agents',    'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=AI+agent+agentic&hl=en-US&gl=US&ceid=US:en',        82,68,'10min',5),
  s('gnews-ai-safety',  'Google News: AI Safety',    'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=AI+safety+alignment&hl=en-US&gl=US&ceid=US:en',     80,70,'15min',4),
  s('gnews-ai-startup', 'Google News: AI Startup',   'social','search', 'https://news.google.com',  'https://news.google.com/rss/search?q=AI+startup+funding+series+round&hl=en-US&gl=US&ceid=US:en',80,65,'15min',6),
  s('bing-ai',          'Bing News: AI',             'social','search', 'https://www.bing.com',      'https://www.bing.com/news/search?q=artificial+intelligence+AI&format=rss',               82,65,'15min',15),
  s('bing-llm',         'Bing News: LLM',            'social','search', 'https://www.bing.com',      'https://www.bing.com/news/search?q=LLM+GPT+Claude+Gemini&format=rss',                    80,65,'15min',10),
  s('bing-nvidia',      'Bing News: NVIDIA',         'social','search', 'https://www.bing.com',      'https://www.bing.com/news/search?q=NVIDIA+AI&format=rss',                                78,65,'15min',5),
  s('bing-openai',      'Bing News: OpenAI',         'social','search', 'https://www.bing.com',      'https://www.bing.com/news/search?q=OpenAI+GPT&format=rss',                               80,65,'15min',8),
  s('bing-ai-startup',  'Bing News: AI Startup',     'social','search', 'https://www.bing.com',      'https://www.bing.com/news/search?q=AI+startup+funding&format=rss',                       76,62,'30min',5),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 12. PODCASTS & YOUTUBE (20 sources)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PODCASTS_YT: CrawlSource[] = [
  s('lex-fridman',      'Lex Fridman Podcast','podcast','ai',           'https://lexfridman.com',        'https://lexfridman.com/feed/podcast/',                                   80,82,'2h',   1),
  s('mlst-podcast',     'ML Street Talk',     'podcast','research',     'https://www.youtube.com/c/MachineLearningStreetTalk','https://www.youtube.com/feeds/videos.xml?channel_id=UCMLtBahI5DMrt0NPvDSoIRQ',75,80,'6h',1),
  s('twiml-podcast',    'TWIML AI Podcast',   'podcast','general',      'https://twimlai.com',           'https://twimlai.com/feed/podcast/',                                      72,78,'6h',   1),
  s('practical-ai',     'Practical AI Podcast','podcast','dev',         'https://practicalai.fm',        'https://changelog.com/practicalai/feed',                                 68,72,'6h',   1),
  s('no-priors',        'No Priors Podcast',  'podcast','general',      'https://www.youtube.com/@NoPriorsPodcast','https://www.youtube.com/feeds/videos.xml?channel_id=UCddiUEpeqJcYeBxX1IVBKvQ',72,76,'6h',1),
  s('latent-space-pod', 'Latent Space Podcast','podcast','dev',         'https://www.latent.space',      'https://api.substack.com/feed/podcast/1011/s/2.rss',                     75,80,'6h',   1),
  s('eye-on-ai',        'Eye on AI',          'podcast','general',      'https://www.eye-on.ai',         'https://www.eye-on.ai/podcast-ai/feed',                                  65,70,'12h',  1),
  s('yt-openai',        'OpenAI YouTube',     'youtube','official',     'https://www.youtube.com/@OpenAI','https://www.youtube.com/feeds/videos.xml?channel_id=UCXZCJLdBC09xxP5Z5AiDSHg',85,90,'6h',1),
  s('yt-google-deepmind','DeepMind YouTube',  'youtube','official',     'https://www.youtube.com/@GoogleDeepMind','https://www.youtube.com/feeds/videos.xml?channel_id=UCP7jMXSY2xbc3KCAE0MHQ-A',82,88,'6h',1),
  s('yt-anthropic',     'Anthropic YouTube',  'youtube','official',     'https://www.youtube.com/@AnthropicAI','https://www.youtube.com/feeds/videos.xml?channel_id=UCVkdHwP97Qf4bBg2TiNBZmg',80,88,'6h',1),
  s('yt-googleai',      'Google AI YouTube',  'youtube','official',     'https://www.youtube.com/@googledevelopers','https://www.youtube.com/feeds/videos.xml?channel_id=UC295-Dw0tDd-hoZkIpnWhSQ',80,88,'6h',2),
  s('yt-huggingface',   'HuggingFace YouTube','youtube','dev',          'https://www.youtube.com/@HuggingFace','https://www.youtube.com/feeds/videos.xml?channel_id=UCHlNU7kIZhRgSbhKx7uZkRw',76,82,'6h',1),
  s('yt-karpathy',      'Karpathy YouTube',   'youtube','education',    'https://www.youtube.com/@AndrejKarpathy','https://www.youtube.com/feeds/videos.xml?channel_id=UCXUPKJO5MZQN11PqgIvyuvQ',82,88,'24h',1),
  s('yt-yannic',        'Yannic Kilcher YT',  'youtube','research',     'https://www.youtube.com/@YannicKilcher','https://www.youtube.com/feeds/videos.xml?channel_id=UCZHmQk67mSJgfCCTn7xBfew',75,80,'12h',1),
  s('yt-sentdex',       'Sentdex YouTube',    'youtube','tutorial',     'https://www.youtube.com/@sentdex','https://www.youtube.com/feeds/videos.xml?channel_id=UCfzlCWGWYyIQ0aLC5w48gBQ',68,72,'12h',1),
  s('yt-3blue1brown',   '3Blue1Brown',        'youtube','education',    'https://www.youtube.com/@3blue1brown','https://www.youtube.com/feeds/videos.xml?channel_id=UCYO_jab_esuFRV4b17AJtAw',72,82,'24h',1),
  s('yt-aiexplained',   'AI Explained YT',    'youtube','news',         'https://www.youtube.com/@aiexplained-official','https://www.youtube.com/feeds/videos.xml?channel_id=UCZLFMC0rgQMU7HFqP5YR-5A',70,74,'12h',1),
  s('yt-matthewberman', 'Matthew Berman YT',  'youtube','news',         'https://www.youtube.com/@matthew_berman','https://www.youtube.com/feeds/videos.xml?channel_id=UCPhkRTd5zwebDnx7vOUAEpA',68,70,'12h',1),
  s('yt-nvidia-ai',     'NVIDIA AI YouTube',  'youtube','official',     'https://www.youtube.com/@NVIDIAAI','https://www.youtube.com/feeds/videos.xml?channel_id=UCYzJem9HzBEcNwRiRWmJMfg',78,85,'6h',1),
  s('yt-mlops-community','MLOps Community YT','youtube','dev',          'https://www.youtube.com/@MLOps-community','https://www.youtube.com/feeds/videos.xml?channel_id=UCYwVKnhMcMtaADIkiAMGA5A',65,70,'12h',1),
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// AGGREGATE ALL SOURCES
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const ALL_SOURCES: CrawlSource[] = [
  ...OFFICIAL,
  ...AI_NEWS,
  ...RESEARCH,
  ...GITHUB,
  ...COMMUNITY,
  ...VC_FUNDING,
  ...DEVELOPER,
  ...DOMAIN_AI,
  ...GOVERNMENT_AI,
  ...INDIA_AI,
  ...SEARCH_SOURCES,
  ...PODCASTS_YT,
];

export const SOURCES_BY_CATEGORY = ALL_SOURCES.reduce((acc, s) => {
  if (!acc[s.category]) acc[s.category] = [];
  acc[s.category].push(s);
  return acc;
}, {} as Record<string, CrawlSource[]>);

export const RSS_SOURCES = ALL_SOURCES.filter(s => s.supports_rss && s.rss_feed);
export const BROWSER_SOURCES = ALL_SOURCES.filter(s => s.browser_required);
export const HTTP_SOURCES = ALL_SOURCES.filter(s => !s.supports_rss && !s.browser_required);

export const TOP_PRIORITY = ALL_SOURCES.filter(s => s.priority_score >= 90).sort((a,b) => b.priority_score - a.priority_score);

export function getSourceById(id: string): CrawlSource | undefined {
  return ALL_SOURCES.find(s => s.id === id);
}

export function getSourcesByFrequency(freq: CrawlSource['crawl_frequency']): CrawlSource[] {
  return ALL_SOURCES.filter(s => s.crawl_frequency === freq);
}

// Stats
export const SOURCE_STATS = {
  total: ALL_SOURCES.length,
  rss: RSS_SOURCES.length,
  browser: BROWSER_SOURCES.length,
  http: HTTP_SOURCES.length,
  byCategory: Object.fromEntries(
    Object.entries(SOURCES_BY_CATEGORY).map(([k, v]) => [k, v.length])
  ),
};

