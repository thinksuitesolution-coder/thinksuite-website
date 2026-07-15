'use client'
import { useState, useEffect } from 'react'
import ToolDemoAnimation from './ToolDemoAnimation'
import ToolAuthModal from './ToolAuthModal'
import ToolSubscribeModal from './ToolSubscribeModal'
import { useAuth } from '@/lib/auth-context'

export const ALL_TOOLS = [
  {
    id: 'texttovoice',
    slug: 'voice',
    label: 'AI Voice Studio',
    icon: '🎙',
    color: '#1a237e',
    tagline: 'Turn Text into Human-Like Voice',
    subTagline: 'in 28+ Languages · Instantly',
    description: 'Convert any script into natural, studio-quality voice in seconds. Perfect for ads, podcasts, explainer videos, IVR systems, and multilingual content at scale.',
    features: [
      { icon: '🌐', title: '28+ Languages & Accents', desc: 'Hindi, English, Spanish, Arabic, and 24 more regional languages' },
      { icon: '🎤', title: 'Voice Cloning', desc: 'Clone any voice from a 30-second sample with 99% accuracy' },
      { icon: '⚡', title: 'Instant MP3 Download', desc: 'HD-quality audio ready in under 10 seconds' },
      { icon: '🎛', title: 'Speed & Pitch Control', desc: 'Fine-tune tone, pace, and emotion to match your brand' },
    ],
    stats: [
      { value: '28+', label: 'Languages' },
      { value: '500K+', label: 'Audios Created' },
      { value: '10s', label: 'Avg. Generation' },
      { value: '4.9★', label: 'User Rating' },
    ],
    tags: ['ElevenLabs', '28 Languages', 'Voice Clone', 'Bulk Export'],
    useCases: ['Marketing Ads', 'Podcast Intros', 'IVR Systems', 'YouTube Voiceover', 'E-Learning', 'Audiobooks', 'Product Demos'],
    howItWorks: [
      { step: '1', title: 'Paste Your Script', desc: 'Type or paste any text – from a single sentence to a full article or podcast episode.' },
      { step: '2', title: 'Choose Voice & Language', desc: 'Pick from 100+ AI voices across 28 languages and regional accents including Hindi, Tamil, Bengali.' },
      { step: '3', title: 'Download & Publish', desc: 'Get studio-quality MP3 in seconds. Use anywhere, no attribution needed.' },
    ],
    benefits: [
      { icon: '💰', title: 'Save 90% on Voice Production', desc: 'Eliminate expensive studio recordings and voiceover artists' },
      { icon: '🚀', title: 'Scale Content Instantly', desc: 'Create hundreds of audio pieces in the time it takes to record one' },
      { icon: '🌍', title: 'Reach Global Audiences', desc: 'Localize content for India and 27 other countries in minutes' },
    ],
    faqs: [
      { q: 'Which AI model powers the voice generation?', a: 'We use ElevenLabs, the world\'s most advanced text-to-speech AI, for ultra-realistic voice generation with natural pauses and intonation.' },
      { q: 'Can I clone my own voice?', a: 'Yes! Upload a 30-second audio sample and our AI will clone your voice for future use. Voice cloning is available on paid plans.' },
      { q: 'What audio formats are supported for download?', a: 'You can download your generated audio in MP3, WAV, and OGG formats in studio-quality (up to 192kbps).' },
      { q: 'How many languages does AI Voice Studio support?', a: 'We support 28+ languages including Hindi, English (Indian accent), Spanish, Arabic, French, German, Japanese, Tamil, Telugu, Bengali, and more.' },
      { q: 'Is there a character limit per generation?', a: 'Free plan supports up to 1,000 characters per generation. Paid plans support unlimited characters and bulk generation.' },
    ],
  },
  {
    id: 'imagestudio',
    slug: 'imagestudio',
    label: 'AI Image Studio',
    icon: '◈',
    color: '#7c3aed',
    tagline: 'Create Stunning Marketing Visuals',
    subTagline: 'with DALL-E 3, GPT Image & Gemini',
    description: 'Generate professional marketing posters, product images, and social media creatives in seconds. No design skills needed – just describe what you want and let AI do the work.',
    features: [
      { icon: '🖼', title: 'DALL-E 3 & GPT Image 1', desc: 'Access the world\'s most powerful image generation AI models' },
      { icon: '📦', title: 'Bulk Poster Generation', desc: 'Create 10+ variations in one click for A/B testing campaigns' },
      { icon: '⬆️', title: '4x AI Upscaling', desc: 'Enhance any image to print-ready resolution (up to 4096×4096)' },
      { icon: '✂️', title: 'Background Removal', desc: 'One-click clean cutouts for product shots and e-commerce' },
    ],
    stats: [
      { value: '3', label: 'AI Models' },
      { value: '2M+', label: 'Images Created' },
      { value: '4x', label: 'AI Upscaling' },
      { value: '4.8★', label: 'User Rating' },
    ],
    tags: ['DALL-E 3', 'Bulk', '4x Upscale', 'Background Removal'],
    useCases: ['Social Media Posts', 'Product Photography', 'Ad Banners', 'Marketing Posters', 'Brand Assets', 'E-commerce Images', 'Festival Creatives'],
    howItWorks: [
      { step: '1', title: 'Describe Your Vision', desc: 'Write a prompt like \'luxury real estate poster, blue theme, modern fonts, Indian festive style\'.' },
      { step: '2', title: 'Pick a Model & Style', desc: 'Choose from DALL-E 3, GPT Image 1, or Gemini Imagen based on your quality needs.' },
      { step: '3', title: 'Download & Use', desc: 'Get high-resolution images ready for web, print, social media, and digital ads.' },
    ],
    benefits: [
      { icon: '🎨', title: 'No Design Skills Needed', desc: 'Just describe what you want – AI handles all the design work' },
      { icon: '⏱', title: '10x Faster Than Photoshop', desc: 'Go from idea to ready-to-publish visual in under 30 seconds' },
      { icon: '💸', title: 'Cut Design Costs by 80%', desc: 'Replace expensive graphic designers for routine marketing visuals' },
    ],
    faqs: [
      { q: 'Which AI image models are available?', a: 'We offer DALL-E 3 (OpenAI), GPT Image 1 (latest from OpenAI), and Gemini Imagen (Google) – all the top AI image models in one platform.' },
      { q: 'What image sizes and aspect ratios can I generate?', a: 'We support 1:1 (square), 16:9 (landscape), 9:16 (portrait/Reels), and 4:3 aspect ratios in resolutions up to 1024×1024 with 4x upscaling to 4096×4096.' },
      { q: 'Can I generate images in bulk?', a: 'Yes! Our bulk generation feature lets you create 10+ image variations in one click – perfect for A/B testing ad creatives.' },
      { q: 'How does background removal work?', a: 'Our AI automatically detects and removes backgrounds with precision, giving you clean product cutouts ready for e-commerce or marketing use.' },
      { q: 'Are the generated images copyright-free?', a: 'Images generated on our platform are yours to use commercially without any attribution requirements, as per our terms of service.' },
    ],
  },
  {
    id: 'contentgen',
    slug: 'content',
    label: 'AI Content Generator',
    icon: '✍️',
    color: '#1a237e',
    tagline: 'Blog Posts, Ads & Email Campaigns',
    subTagline: 'Powered by AI · Ready in Seconds',
    description: 'Generate high-converting copy for blogs, social media, email campaigns, and ads instantly. Trained on thousands of top-performing marketing pieces across industries.',
    features: [
      { icon: '📝', title: 'Blog & Article Writing', desc: 'SEO-optimized long-form content (1000-5000 words) in minutes' },
      { icon: '📣', title: 'Ad Copy & Headlines', desc: 'Our AI ad copy generator writes high-converting copy for Facebook, Google, Instagram, and LinkedIn ads' },
      { icon: '📧', title: 'Email Campaigns', desc: 'Subject lines, body copy, and CTAs that increase open rates by 3x' },
      { icon: '📲', title: 'Social Media Captions', desc: 'Our AI social media caption generator creates viral-ready posts with hashtags for Instagram, LinkedIn, Twitter, YouTube' },
    ],
    stats: [
      { value: '50+', label: 'Content Types' },
      { value: '1M+', label: 'Copies Written' },
      { value: '3x', label: 'Faster Than Humans' },
      { value: '4.9★', label: 'User Rating' },
    ],
    tags: ['Blog', 'Ads', 'Email', 'Social Media'],
    useCases: ['Product Descriptions', 'Email Newsletters', 'Google Ads', 'Instagram Captions', 'Sales Pages', 'Press Releases', 'LinkedIn Posts'],
    howItWorks: [
      { step: '1', title: 'Choose Content Type', desc: 'Select from blog post, ad copy, email, caption, and 50+ more content templates.' },
      { step: '2', title: 'Add Your Context', desc: 'Describe your product, target audience, tone of voice, and key selling points.' },
      { step: '3', title: 'Generate & Publish', desc: 'Get polished, ready-to-publish content in under 30 seconds. Edit and export with one click.' },
    ],
    benefits: [
      { icon: '📈', title: 'Higher Conversions', desc: 'AI-trained on top-performing marketing copy that actually converts' },
      { icon: '🔍', title: 'Built-in SEO', desc: 'Every piece optimized with keywords, headings, and meta descriptions' },
      { icon: '🌐', title: 'Multilingual Content', desc: 'Generate content in English, Hindi, and 10+ regional languages' },
    ],
    faqs: [
      { q: 'What types of content can I generate?', a: '50+ content types including blog posts, Facebook ads, Google ads, email subject lines, product descriptions, social media captions, press releases, sales pages, and more.' },
      { q: 'Is the generated content SEO-friendly?', a: 'Yes! Our AI automatically includes relevant keywords, proper heading structure (H1, H2, H3), meta descriptions, and natural keyword density for SEO optimization.' },
      { q: 'Can I generate content in Hindi or regional languages?', a: 'Absolutely. We support content generation in English, Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, and 10+ other Indian languages.' },
      { q: 'How long does it take to generate content?', a: 'Most content types are ready in under 30 seconds. Long-form blog posts (3000+ words) may take up to 2 minutes.' },
      { q: 'Can I edit the AI-generated content?', a: 'Yes! All generated content comes with a built-in editor. You can refine, rephrase, expand or shorten any section before publishing or exporting.' },
      { q: 'Is AI generated content good for SEO?', a: 'Yes, when it is structured properly. Our AI content generator builds in proper heading hierarchy, keyword placement, and meta descriptions automatically, which are the on-page basics search engines look for. The content still performs best when you review it for accuracy and add your own brand voice before publishing.' },
      { q: 'Can AI content actually rank on Google?', a: 'Yes, AI-generated content ranks on Google regularly. Google has stated it evaluates content on quality and usefulness, not on how it was produced. Content generated with our tool that is edited, fact-checked, and genuinely useful to readers ranks the same as human-written content.' },
      { q: 'AI content generator vs hiring a human copywriter, which is better?', a: 'They solve different problems. Our AI content generator is faster and cheaper for high-volume needs like product descriptions, ad variations, and social captions. A human copywriter is still better for brand-defining pieces where nuance and original voice matter most. Most of our users combine both: AI for volume, human review for anything customer-facing at scale.' },
      { q: 'Can I generate ad copy with this tool?', a: 'Yes, the AI ad copy generator produces headline and body variations for Facebook, Google, Instagram, and LinkedIn ads, formatted to each platform\'s character limits so you can test multiple angles quickly.' },
      { q: 'Does it work as an AI SEO content generator too?', a: 'Yes. Alongside social captions, the tool doubles as an AI SEO content generator for blog posts and articles, automatically structuring headings, keyword density, and meta descriptions so the piece is ready to publish and optimized to rank.' },
    ],
  },
  {
    id: 'texttovideo',
    slug: 'video',
    label: 'AI Video Studio',
    icon: '🎬',
    color: '#7c3aed',
    tagline: 'Text to Video, Avatar & Lip Sync',
    subTagline: 'Powered by Veo 2 · Studio Quality in Minutes',
    description: 'Create professional videos from text, images, or scripts. Generate AI avatars, add lip sync, and produce studio-quality content – no camera, no crew, no expensive software needed.',
    features: [
      { icon: '🎬', title: 'Text to Video (Veo 2)', desc: 'Google\'s most advanced video AI model for cinematic quality results' },
      { icon: '🤖', title: 'AI Avatar Generation', desc: 'Realistic talking avatars from any photo – great for presenters' },
      { icon: '👄', title: 'Lip Sync Technology', desc: 'Perfectly sync any audio track to any face automatically' },
      { icon: '🖼', title: 'Image to Video', desc: 'Animate your static images into engaging cinematic video clips' },
    ],
    stats: [
      { value: 'Veo 2', label: 'Latest AI Model' },
      { value: '100K+', label: 'Videos Created' },
      { value: '4K', label: 'Max Resolution' },
      { value: '4.9★', label: 'User Rating' },
    ],
    tags: ['Veo 2', 'Avatar', 'Lip Sync', '4K'],
    useCases: ['Product Demos', 'Social Media Reels', 'Training Videos', 'Ad Campaigns', 'AI Presenters', 'YouTube Content', 'Explainer Videos'],
    howItWorks: [
      { step: '1', title: 'Write Your Script', desc: 'Describe your scene or paste a full video script – the AI handles visuals automatically.' },
      { step: '2', title: 'Choose Style & Avatar', desc: 'Pick a visual style, AI avatar, background, and aspect ratio (9:16, 16:9, 1:1).' },
      { step: '3', title: 'Render & Download', desc: 'Get a polished MP4 video in up to 4K resolution, ready to publish in minutes.' },
    ],
    benefits: [
      { icon: '📹', title: 'No Camera or Crew Needed', desc: 'Produce professional videos entirely with AI – from concept to final cut' },
      { icon: '⏰', title: 'Videos in Minutes, Not Weeks', desc: 'Cut video production time from weeks to minutes with AI automation' },
      { icon: '💰', title: '90% Lower Production Cost', desc: 'Eliminate studio, equipment, and editing costs entirely' },
    ],
    faqs: [
      { q: 'What AI model powers the video generation?', a: 'We use Google\'s Veo 2 – the world\'s most advanced text-to-video AI – plus Minimax for avatar generation and lip sync features.' },
      { q: 'What video resolutions are supported?', a: 'We support up to 4K resolution (3840×2160) for standard video and 1080p for AI avatar videos. Output in MP4 format.' },
      { q: 'How does AI avatar lip sync work?', a: 'Upload a photo or select an AI avatar, add your audio (or use AI voice), and our AI automatically animates the face to perfectly match the speech.' },
      { q: 'Can I generate videos from images?', a: 'Yes! Our image-to-video feature animates any static image into a cinematic clip – great for product showcases and portfolio slideshows.' },
      { q: 'How long can videos be?', a: 'Free plan generates videos up to 5 seconds. Paid plans support up to 60 seconds per generation with unlimited generations per month.' },
    ],
  },
  {
    id: 'leadgeneration',
    slug: 'lead-generation',
    label: 'AI Lead Generation',
    icon: '🎯',
    color: '#7c3aed',
    tagline: 'Find 100+ Targeted B2B Leads',
    subTagline: 'Auto Cold Email · Book Meetings · Export to CRM',
    description: 'Discover verified B2B leads by niche in seconds. AI automatically enriches company data, sends personalised cold emails via Gmail, books meetings via Google Calendar, and exports to CSV or Google Drive – all in one workflow.',
    features: [
      { icon: '🏢', title: 'Niche-Targeted Lead Discovery', desc: 'Find verified businesses by industry, location, and company size using Vibe Prospecting AI' },
      { icon: '✉️', title: 'AI Cold Email via Gmail', desc: 'Personalised cold emails auto-written by AI and sent directly through your Gmail account' },
      { icon: '📅', title: 'Auto Meeting Booking', desc: 'One-click Google Calendar invite sent to leads – no manual back-and-forth needed' },
      { icon: '☁️', title: 'CSV & Google Drive Export', desc: 'Download leads as CSV or save directly to Google Drive for seamless CRM integration' },
    ],
    stats: [
      { value: '100+', label: 'Leads per Search' },
      { value: '95%', label: 'Email Deliverability' },
      { value: '3x', label: 'More Replies' },
      { value: '4.9★', label: 'User Rating' },
    ],
    tags: ['Vibe Prospecting', 'Gmail MCP', 'Google Calendar', 'Google Drive'],
    useCases: ['Marketing Agencies', 'SaaS Sales', 'B2B Outreach', 'Freelancers', 'Real Estate', 'Recruitment', 'Consulting Firms', 'Startups'],
    howItWorks: [
      { step: '1', title: 'Enter Your Target Niche', desc: 'Type any industry or business type – e.g. \'dental clinics in Mumbai\' or \'SaaS startups in Bangalore\' – and set filters.' },
      { step: '2', title: 'AI Finds & Enriches Leads', desc: 'Vibe Prospecting AI fetches 100+ matching businesses with contact details, then AI enriches each lead with company insights.' },
      { step: '3', title: 'Send Emails & Book Meetings', desc: 'Select leads and hit send – AI writes and delivers personalised cold emails via your Gmail. Book discovery calls in one click.' },
    ],
    benefits: [
      { icon: '⚡', title: '10x Faster Than Manual Prospecting', desc: 'What takes a sales team a week now takes 5 minutes – verified leads, enriched and ready to contact' },
      { icon: '🤖', title: 'Fully Automated Outreach Pipeline', desc: 'From lead discovery to cold email to meeting booking – the entire pipeline runs on autopilot' },
      { icon: '💰', title: 'Cut CAC by 60%', desc: 'Replace expensive lead databases and SDR hours with AI-powered outreach that converts at 3x the industry average' },
    ],
    faqs: [
      { q: 'How does the lead discovery work?', a: 'We use Vibe Prospecting AI to search verified business databases and find companies matching your niche, location, and size filters.' },
      { q: 'Can I send cold emails from my own Gmail account?', a: 'Yes! We integrate with Gmail via MCP so cold emails are sent from your own address – improving deliverability and keeping replies in your inbox.' },
      { q: 'How does the AI personalise cold emails?', a: 'AI reads each company\'s website, industry, and enrichment data to write a unique, context-aware email for every lead.' },
      { q: 'What CRMs can I export leads to?', a: 'You can download a CSV file compatible with HubSpot, Salesforce, Zoho, Pipedrive, and any other CRM. You can also save directly to Google Drive.' },
      { q: 'Is there a limit on how many leads I can generate?', a: 'Free plan includes up to 25 leads per search session. Paid plans unlock 100+ leads per search, unlimited enrichment, bulk email sending, and Google Drive auto-sync.' },
    ],
  },
]

const FEATURE_QUICK_TIPS: Record<string, Array<{english: string; flow: string[]; detail: string}>> = {
  voice: [
    { english: 'Supports 28+ languages including Hindi, Tamil, Telugu, English (Indian accent), Spanish, Arabic, French, and German – each with multiple regional accent options for male and female voices.', flow: ['Write script', 'Choose language', 'Select accent/speaker', 'AI processes', 'Download MP3'], detail: 'Each language comes with multiple speaker options – male, female, young, old. Indian languages are especially well-supported: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada natural speakers available. Pro tip: for Indian English accent, specifically choose \'English (India)\' – it sounds far more relatable to Indian audiences than generic American English.' },
    { english: 'Upload a 30-second audio sample and AI builds an exact clone of that voice – same tone, same pitch, same speaking style. Use it for every future script with one click.', flow: ['Record 30 sec of clear audio', 'Open Voice Clone tab', 'Upload audio file', 'AI voice model created', 'Generate any script in that voice'], detail: 'For best voice cloning results: use a background noise-free recording at normal speaking pace, and include varied sentences (mix questions, statements, exclamations). Once the clone is built, use it unlimited times. This feature is ideal for brand voice consistency – every ad, podcast, and explainer in the same familiar voice.' },
    { english: 'Get studio-quality audio in MP3, WAV, or OGG format in under 10 seconds. HD quality up to 192kbps – ready for direct publishing on YouTube, podcasts, or ads.', flow: ['Enter script', 'Select voice and language', 'Click Generate', 'Wait 10 sec', 'Press Download'], detail: 'Format guide: MP3 (192kbps) most popular, works on any platform, small file size. WAV – uncompressed, use for studio editing and video production. OGG – optimized for web streaming, best for website audio players. For most use cases, MP3 is the right choice – upload and use directly.' },
    { english: 'Fine-tune voice speed (0.5x–2x), pitch, and emotional tone with sliders. Add natural pauses, adjust pacing, and set excitement or calm modes to match your content.', flow: ['Generate voice', 'Open controls panel', 'Adjust speed slider', 'Fine-tune pitch', 'Preview, save changes'], detail: 'Speed guide: 0.8x – audiobooks and educational content (slow for clarity), 1.0x – normal conversational speed, 1.2x – ads and promos (energetic feel), 1.5x+ – fast-paced social media content. Pitch adjustment: slightly high pitch = happy/excited feel; slightly low pitch = professional/authoritative feel.' },
  ],
  imagestudio: [
    { english: 'Access DALL-E 3 and GPT Image 1 – world\'s most advanced image generation models – in one platform. Both understand complex, detailed prompts and generate photorealistic or artistic results.', flow: ['Write prompt (any language)', 'Choose model (DALL-E 3 / GPT Image 1)', 'Select size and style', 'Click Generate', 'Preview and download'], detail: 'Model selection guide: DALL-E 3 – best for artistic, creative, illustrations, and graphic art; GPT Image 1 – best for photorealism, product images, and commercial visuals.' },
    { english: 'Generate 10+ image variations from one prompt in a single click. AI creates subtle differences in composition, colors, and layout – perfect for A/B testing ad creatives.', flow: ['Write main concept/prompt', 'Select Bulk Mode', 'Choose variation count (5/10+)', 'Generate', 'Compare all images, download'], detail: 'Bulk generation automatically creates slight variations – same message, different angles. Ideal for marketing agencies: 10 options for a client project ready in one click.' },
    { english: 'Enhance any low-resolution image to 4x its original size using AI pixel enhancement. Upscale to print-ready 4096×4096 resolution – sharper details, no blur.', flow: ['Upload image (any resolution)', 'Select 4x Upscale option', 'AI processes (30-60 sec)', 'Preview HD image', 'Download'], detail: 'AI upscaling use cases: upscaling old brand logos to HD (for signage/print), making low-res product photos print-ready for e-commerce listings, restoring compressed social media images.' },
    { english: 'Remove image backgrounds in one click with AI edge detection. Get clean, transparent PNG cutouts – perfect for e-commerce listings, marketing materials, and design work.', flow: ['Upload product/subject image', 'Click Background Remove', 'AI precisely detects edges', 'Transparent PNG ready', 'Download and use on any background'], detail: 'Background removal accuracy: simple products (90%+ accuracy), complex items with hair/fur (85%+ accuracy). Fine-tune option also available where you can manually adjust edges.' },
  ],
  content: [
    { english: 'Generate SEO-optimized blog posts from 1,000 to 5,000 words. AI structures content with proper H1/H2/H3 headings, keyword integration, meta description, and natural flow.', flow: ['Enter topic/keyword', 'Choose word count', 'Select tone (formal/casual/fun)', 'Click Generate', 'Review and publish'], detail: 'Blog generation process: AI first researches the topic, then builds a proper outline – Introduction, multiple H2 sections with H3 subsections, Conclusion with CTA. Relevant keywords are naturally integrated into each section.' },
    { english: 'Create high-converting ad copy for Facebook, Google, Instagram, and LinkedIn. Multiple headline variations, body copy, and call-to-action options generated in one click.', flow: ['Describe your product/service', 'Choose platform (FB/Google/IG/LinkedIn)', 'Add target audience', 'Click Generate', 'Pick the best version and launch'], detail: 'Platform-specific formats: Facebook Ads – Primary Text (125 chars) + Headline + Description; Google Ads – Responsive Search Ad (15 headlines + 4 descriptions); Instagram – Caption + 30 hashtags.' },
    { english: 'Write complete email campaigns – subject lines, preview text, body copy, and CTAs. AI-crafted for high open rates and click-through rates based on proven email marketing formulas.', flow: ['Set campaign goal', 'Describe target audience', 'Add key message/offer', 'Generate full email', 'Review, test, and send'], detail: 'Email campaign structure: 3-5 A/B variant subject lines (different psychological hooks each), preview text, opening hook, problem-solution body copy, social proof section, clear CTA button text.' },
    { english: 'Generate viral-ready social media captions with relevant hashtags for Instagram, LinkedIn, Twitter/X, and YouTube. Tone and format automatically adapted for each platform.', flow: ['Describe your post topic or image', 'Select platform', 'Choose tone (fun/professional/inspiring)', 'Generate caption + hashtags', 'Copy and post'], detail: 'Platform-specific output: Instagram – engaging caption + 30 mixed hashtags (10 high/10 medium/10 low competition), LinkedIn – professional hook + industry insights + 3-5 relevant hashtags, Twitter/X – punchy 280-char optimized copy.' },
  ],
  video: [
    { english: 'Convert any text script into high-quality video using Google\'s Veo 2 model. Generate realistic scenes, cinematic shots, and smooth transitions from plain text descriptions.', flow: ['Write script/scene description', 'Choose style and duration', 'Veo 2 AI processes it', 'Preview the video', 'Download or publish'], detail: 'For best Veo 2 results: write detailed scene descriptions – camera angle (close-up, wide shot, aerial), lighting (soft morning light, dramatic shadows), setting (busy city street, minimalist office). Add \'cinematic\', \'photorealistic\', \'high quality\' to your prompt for premium quality output.' },
    { english: 'Create photorealistic talking AI avatars that deliver your script on screen. Choose from diverse professional presenters or generate a custom avatar from your photo.', flow: ['Choose avatar style/profession', 'Type or upload your script', 'Select voice and language', 'Generate avatar video', 'Download the ready video'], detail: 'Avatar styles available: Corporate Executive, Teacher/Trainer, Doctor/Professional, Casual Influencer, News Anchor. Custom avatar: upload your photo – AI creates an avatar based on your likeness.' },
    { english: 'Automatically sync any audio track to a face video – AI analyzes lip movements and perfectly matches them to new audio. Perfect for dubbing, voice replacement, and language localization.', flow: ['Upload face/talking head video', 'Upload new audio file', 'AI analyzes lip movements', 'Sync processing (few minutes)', 'Download dubbed video'], detail: 'Lip sync use cases: dubbing existing English brand videos into Hindi, translating international YouTube content for regional audiences, updating presenter videos without reshooting.' },
    { english: 'Animate any static image – product photos, illustrations, or graphics – into smooth, engaging short videos with AI-generated motion effects.', flow: ['Upload static image', 'Choose motion style', 'Set duration (3/5/10 sec)', 'AI generates motion', 'Download video'], detail: 'Motion styles available: Ken Burns Effect (smooth zoom + pan), Parallax 3D (depth illusion), Ambient Motion (subtle environmental movement), Zoom Pulse (rhythmic zoom), Slide Reveal (dramatic reveal).' },
  ],
  'lead-generation': [
    { english: 'Find 100+ targeted B2B leads in any niche using Vibe Prospecting AI. Filter by industry, location, company size, employee count, and job title to find your exact ideal customer.', flow: ['Describe ideal customer profile', 'Set industry and location filters', 'AI finds leads (1-2 min)', 'Review results quality', 'Export to CSV or CRM'], detail: 'Lead discovery filter options: Industry, Location (city, state, country), Company Size (1-10, 11-50, 51-200, 200+). Per lead data: company name, website, LinkedIn URL, decision-maker name + title, email, phone, company description.' },
    { english: 'Send AI-personalized cold emails directly from your Gmail. AI researches each company and writes custom emails referencing their specific situation – not generic templates.', flow: ['Select leads', 'Define email goal/offer', 'AI researches each lead', 'Custom email is generated', 'Review/approve and send directly from Gmail'], detail: 'AI personalization depth: company recent news, LinkedIn activity, website content analysis, industry-specific pain points. Email structure: Personalized opening, relevant problem identification, your solution connection, social proof, clear CTA.' },
    { english: 'Automatically book meetings when leads respond positively. Google Calendar integration lets prospects self-schedule from your email – eliminates back-and-forth scheduling.', flow: ['Connect Google Calendar', 'Set available slots', 'Booking link auto-included in emails', 'Prospect clicks link and chooses slot', 'Auto-confirmed in calendar with reminder sent'], detail: 'Auto-booking setup: define your available hours, buffer time between meetings, and max meetings per day. Meeting details auto-generated: Zoom/Google Meet link automatically created, meeting agenda pre-filled, reminders sent.' },
    { english: 'Export all leads with full contact details to CSV or sync directly to Google Drive. Pre-built field mappings for HubSpot, Salesforce, and other popular CRMs.', flow: ['Select leads (individual or bulk)', 'Choose export format (CSV/Drive)', 'Customize fields', 'Click Export', 'Import into CRM'], detail: 'Export customization: choose which fields to include – company name, website, email, phone, LinkedIn, decision maker name, notes, lead score, engagement status. CRM integration guides available for: HubSpot, Salesforce, Zoho CRM, Pipedrive.' },
  ],
}

// Tools that require login (live tools)
const AUTH_REQUIRED_SLUGS = ['content', 'lead-generation']

// Tools that are coming soon (not yet live)
const COMING_SOON_SLUGS = ['voice', 'imagestudio', 'video']

// Dashboard URLs per tool (null = tool not yet launched)
const TOOL_DASHBOARD: Record<string, string | null> = {
  'content': '/dashboard/content',
  'lead-generation': '/dashboard/lead-generation',
  'voice': null,
  'imagestudio': null,
  'video': null,
}

export default function ToolLanding({ slug }: { slug: string }) {
  const tool = ALL_TOOLS.find(t => t.slug === slug)
  const [isMobile, setIsMobile] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [openTip, setOpenTip] = useState<number | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [comingSoonOpen, setComingSoonOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [subStatus, setSubStatus] = useState<'checking' | 'none' | 'active' | 'expired'>('checking')
  const { user, loading } = useAuth()

  const isComingSoon = COMING_SOON_SLUGS.includes(slug)

  const handleCTA = () => {
    if (isComingSoon) {
      setComingSoonOpen(true)
      return
    }
    if (!user) { setAuthOpen(true); return }
    if (subStatus === 'active') {
      const dashUrl = TOOL_DASHBOARD[slug]
      if (dashUrl) window.location.href = dashUrl
      return
    }
    setSubscribeOpen(true)
  }

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Auto-open auth modal if this tool requires login and user is not signed in
  useEffect(() => {
    if (!loading && !user && AUTH_REQUIRED_SLUGS.includes(slug)) {
      setAuthOpen(true)
    }
  }, [loading, user, slug])

  // After login, check subscription status for this tool
  useEffect(() => {
    if (!user || loading || !AUTH_REQUIRED_SLUGS.includes(slug)) return
    fetch('/api/subscription-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.uid, toolSlug: slug }),
    })
      .then(r => r.json())
      .then(d => {
        const s = d.status === 'active' ? 'active' : d.status === 'expired' ? 'expired' : 'none'
        setSubStatus(s)
        if (s === 'none' || s === 'expired') setSubscribeOpen(true)
      })
      .catch(() => setSubStatus('none'))
  }, [user, loading, slug])

  if (!tool) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f8ff' }}>
        <div style={{ color: '#1a237e', fontSize: 16 }}>Loading...</div>
      </div>
    )
  }

  const otherTools = ALL_TOOLS.filter(t => t.slug !== slug)

  return (
    <>
    <div style={{ minHeight: '100vh', background: '#f0f8ff', color: '#1a237e', fontFamily: "'Segoe UI',system-ui,sans-serif", overflowX: 'hidden' }}>

      {/* HERO */}
      <section style={{ padding: isMobile ? '100px 20px 48px' : '140px 40px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#f0f8ff 0%,#e8f4fc 55%,#f0f8ff 100%)' }} />
          <div style={{ position: 'absolute', top:'-15%', left:'20%', width:960, height:960, borderRadius:'50%', background:`radial-gradient(circle,${tool.color}10 0%,transparent 65%)`, animation:'tOrb1 15s ease-in-out infinite', filter:'blur(55px)' }} />
          <div style={{ position: 'absolute', bottom:'-30%', right:'3%', width:860, height:860, borderRadius:'50%', background:`radial-gradient(circle,${tool.color}08 0%,transparent 65%)`, animation:'tOrb2 20s ease-in-out infinite', filter:'blur(72px)' }} />
          <div style={{ position: 'absolute', top:'30%', left:'-12%', width:720, height:720, borderRadius:'50%', background:'radial-gradient(circle,rgba(26,35,126,0.05) 0%,transparent 65%)', animation:'tOrb3 26s ease-in-out infinite', filter:'blur(68px)' }} />
          <div style={{ position: 'absolute', inset:0, backgroundImage:'linear-gradient(rgba(26,35,126,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(26,35,126,0.03) 1px,transparent 1px)', backgroundSize:'80px 80px' }} />
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start', marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${tool.color}10`, border: `1px solid ${tool.color}30`, borderRadius: 100, padding: '6px 16px 6px 10px' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${tool.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{tool.icon}</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: tool.color, letterSpacing: 0.3 }}>{tool.label}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 52 : 72 }}>
            <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
              <h1 style={{ fontSize: isMobile ? 36 : 58, fontWeight: 900, lineHeight: 1.07, marginBottom: 14, letterSpacing: -2, color: '#0f172a' }}>
                {tool.tagline}
              </h1>
              <h2 style={{ fontSize: isMobile ? 21 : 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 24, letterSpacing: -1, background: `linear-gradient(90deg, ${tool.color}, #00bcd4)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {tool.subTagline}
              </h2>
              <p style={{ fontSize: isMobile ? 15 : 17, color: '#64748b', lineHeight: 1.9, marginBottom: 40, maxWidth: 540 }}>
                {tool.description}
              </p>

              <div style={{ display: 'flex', gap: isMobile ? 20 : 36, marginBottom: 40, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                {tool.stats.map((s, i) => (
                  <div key={i} style={{ textAlign: isMobile ? 'center' : 'left' }}>
                    <div style={{ fontSize: isMobile ? 22 : 30, fontWeight: 900, color: tool.color, letterSpacing: -1, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600, marginTop: 4, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <button onClick={handleCTA}
                  style={{ padding: '15px 38px', background: `linear-gradient(135deg, ${tool.color}, ${tool.color}cc)`, border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.2, boxShadow: `0 8px 32px ${tool.color}25` }}>
                  {isComingSoon ? 'Notify Me at Launch →'
                    : !user ? 'Start Today →'
                    : subStatus === 'checking' ? 'Loading…'
                    : subStatus === 'active' ? (TOOL_DASHBOARD[slug] ? 'Access Dashboard →' : 'You\'re Subscribed ✓')
                    : 'Subscribe Now →'}
                </button>
                <a href="/tools"
                  style={{ padding: '15px 28px', background: '#ffffff', border: '1px solid rgba(26,35,126,0.15)', borderRadius: 12, color: '#1a237e', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                  View All Tools
                </a>
              </div>

              <div style={{ marginTop: 28, display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                {['✓ Monthly subscription','✓ No setup needed','✓ Cancel anytime'].map(t => (
                  <span key={t} style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Right card */}
            <div style={{ width: isMobile ? '100%' : 420, flexShrink: 0 }}>
              <div style={{ background: '#ffffff', border: `1px solid ${tool.color}20`, borderRadius: 22, overflow: 'hidden', boxShadow: `0 20px 60px rgba(26,35,126,0.10)` }}>
                <div style={{ padding: '14px 18px', background: '#f8faff', borderBottom: `1px solid ${tool.color}12`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${tool.color}12`, border: `1px solid ${tool.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{tool.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{tool.label}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>AI-powered · Ready to use</div>
                  </div>
                  <div style={{ marginLeft: 'auto', padding: '4px 12px', background: `${tool.color}10`, border: `1px solid ${tool.color}25`, borderRadius: 100, fontSize: 10, color: tool.color, fontWeight: 800 }}>● LIVE</div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                    {tool.tags.slice(0,4).map(tag => (
                      <div key={tag} style={{ padding: '5px 12px', background: `${tool.color}08`, border: `1px solid ${tool.color}18`, borderRadius: 100, fontSize: 11, color: tool.color, fontWeight: 700 }}>{tag}</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                    {tool.features.slice(0,3).map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f8faff', border: '1px solid rgba(26,35,126,0.07)', borderRadius: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${tool.color}10`, border: `1px solid ${tool.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{f.title}</div>
                          <div style={{ fontSize: 10.5, color: '#94a3b8', lineHeight: 1.4 }}>{f.desc.substring(0, 48)}...</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleCTA}
                    style={{ width: '100%', padding: '13px', background: `${tool.color}10`, border: `1px solid ${tool.color}25`, borderRadius: 12, color: tool.color, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {isComingSoon ? 'Coming Soon →'
                      : !user ? 'Get Started →'
                      : subStatus === 'active' ? 'Access Dashboard →'
                      : 'Subscribe →'}
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {tool.stats.slice(0,2).map((s, i) => (
                  <div key={i} style={{ padding: '16px 18px', background: '#ffffff', border: `1px solid ${tool.color}15`, borderRadius: 14, textAlign: 'center', boxShadow: '0 2px 8px rgba(26,35,126,0.05)' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: tool.color, letterSpacing: -1 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, marginTop: 3, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ borderTop: '1px solid rgba(26,35,126,0.08)', padding: isMobile ? '52px 20px' : '80px 40px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: tool.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: 12 }}>What&apos;s Inside</div>
            <div style={{ fontSize: isMobile ? 26 : 38, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>Key Features</div>
            <div style={{ fontSize: 15, color: '#64748b', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
              Tap any feature card to see a detailed quick tip – how it works, full flow, and pro tips.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 16 : 24 }}>
            {tool.features.map((f, i) => {
              const tips = (FEATURE_QUICK_TIPS[tool.slug] || [])[i]
              const isOpen = openTip === i
              return (
                <div key={i} style={{ background: isOpen ? `${tool.color}04` : '#f8faff', border: `1px solid ${isOpen ? tool.color+'25' : 'rgba(26,35,126,0.09)'}`, borderRadius: 20, overflow: 'hidden' }}>
                  <button onClick={() => setOpenTip(isOpen ? null : i)}
                    style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: isMobile ? '22px 20px' : '26px 28px', display: 'flex', alignItems: 'flex-start', gap: 16, textAlign: 'left', fontFamily: 'inherit' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${tool.color}12`, border: `1px solid ${tool.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: isMobile ? 15 : 16, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{f.title}</div>
                      <div style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</div>
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: isOpen ? `${tool.color}12` : 'rgba(26,35,126,0.05)', border: `1px solid ${isOpen ? tool.color+'30' : 'rgba(26,35,126,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 14, color: isOpen ? tool.color : '#64748b', transform: isOpen ? 'rotate(45deg)' : 'none', display: 'block' }}>+</span>
                    </div>
                  </button>
                  {isOpen && tips && (
                    <div style={{ padding: isMobile ? '0 20px 24px' : '0 28px 28px', borderTop: `1px solid ${tool.color}12` }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${tool.color}10`, border: `1px solid ${tool.color}20`, borderRadius: 100, padding: '5px 12px', marginTop: 20, marginBottom: 18 }}>
                        <span style={{ fontSize: 12 }}>💡</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: tool.color, letterSpacing: 0.5, textTransform: 'uppercase' as const }}>Quick Tip</span>
                      </div>
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 10 }}>How It Works – Step by Step</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                          {tips.flow.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: idx===0 ? `${tool.color}12` : idx===tips.flow.length-1 ? `${tool.color}15` : 'rgba(26,35,126,0.04)', border: `1px solid ${idx===0||idx===tips.flow.length-1 ? tool.color+'25' : 'rgba(26,35,126,0.09)'}`, borderRadius: 20 }}>
                                <span style={{ fontSize: 9, fontWeight: 800, color: tool.color, opacity: 0.7 }}>{idx+1}</span>
                                <span style={{ fontSize: 11, fontWeight: 600, color: idx===0||idx===tips.flow.length-1 ? '#0f172a' : '#334155', whiteSpace: 'nowrap' as const }}>{step}</span>
                              </div>
                              {idx < tips.flow.length-1 && <span style={{ fontSize: 12, color: tool.color, opacity: 0.5, flexShrink: 0 }}>→</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: 14, padding: '14px 16px', background: '#f8faff', border: '1px solid rgba(26,35,126,0.08)', borderRadius: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 7 }}>Overview</div>
                        <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.75 }}>{tips.english}</div>
                      </div>
                      <div style={{ padding: '14px 16px', background: '#f0f8ff', border: '1px solid rgba(26,35,126,0.06)', borderRadius: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 7 }}>📖 Detail / Pro Tips</div>
                        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>{tips.detail}</div>
                      </div>
                      <button onClick={handleCTA}
                        style={{ marginTop: 16, width: '100%', padding: '12px', background: `${tool.color}10`, border: `1px solid ${tool.color}22`, borderRadius: 12, color: tool.color, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {isComingSoon ? 'Notify Me →'
                : !user ? `Try ${tool.label} Free →`
                : subStatus === 'active' ? 'Access Dashboard →'
                : 'Subscribe Now →'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      {tool.benefits && (
        <section style={{ borderTop: '1px solid rgba(26,35,126,0.08)', padding: isMobile ? '52px 20px' : '80px 40px', background: 'rgba(26,35,126,0.02)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: tool.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: 12 }}>Business Impact</div>
              <div style={{ fontSize: isMobile ? 26 : 36, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>Proven Business Results</div>
              <div style={{ fontSize: 15, color: '#64748b', marginTop: 12, maxWidth: 440, margin: '12px auto 0' }}>Real outcomes from businesses using {tool.label} every day.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 16 : 24 }}>
              {tool.benefits.map((b, i) => (
                <div key={i} style={{ padding: '32px 28px', background: '#ffffff', border: `1px solid ${tool.color}15`, borderRadius: 22, boxShadow: '0 4px 20px rgba(26,35,126,0.06)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 15, background: `${tool.color}10`, border: `1px solid ${tool.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18 }}>{b.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>{b.title}</div>
                  <div style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.75 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* USE CASES */}
      <section style={{ borderTop: '1px solid rgba(26,35,126,0.08)', padding: isMobile ? '52px 20px' : '72px 40px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: tool.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: 12 }}>Who Uses This</div>
            <div style={{ fontSize: isMobile ? 24 : 34, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>Built for Every Use Case</div>
            <div style={{ fontSize: 15, color: '#64748b', marginTop: 10 }}>Trusted by businesses in every industry</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {tool.useCases.map((uc) => (
              <div key={uc} style={{ padding: '11px 22px', background: `${tool.color}08`, border: `1px solid ${tool.color}18`, borderRadius: 100, fontSize: 13.5, color: '#334155', fontWeight: 600 }}>
                {uc}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ borderTop: '1px solid rgba(26,35,126,0.08)', padding: isMobile ? '52px 20px' : '80px 40px', background: 'rgba(26,35,126,0.02)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: tool.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: 12 }}>Simple 3-Step Process</div>
            <div style={{ fontSize: isMobile ? 26 : 38, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>How {tool.label} Works</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 20 : 28 }}>
            {tool.howItWorks.map((step, i) => (
              <div key={i} style={{ padding: '36px 28px', background: '#ffffff', border: `1px solid ${tool.color}12`, borderRadius: 22, textAlign: 'center', boxShadow: '0 4px 20px rgba(26,35,126,0.06)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${tool.color}18, ${tool.color}08)`, border: `1px solid ${tool.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: tool.color, margin: '0 auto 20px' }}>{step.step}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>{step.title}</div>
                <div style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.75 }}>{step.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 52, padding: isMobile ? '28px 24px' : '40px 48px', background: `${tool.color}06`, border: `1px solid ${tool.color}15`, borderRadius: 24, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: 24, textAlign: isMobile ? 'center' : 'left' }}>
            <div>
              <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
                {isComingSoon ? `${tool.label} – Coming Soon!` : `Ready to try ${tool.label}?`}
              </div>
              <div style={{ fontSize: 14, color: '#64748b' }}>
                {isComingSoon ? 'We\'re working on it. Be the first to know when it launches.' : 'Subscribe monthly. No setup fees. Cancel anytime.'}
              </div>
            </div>
            <button onClick={handleCTA}
              style={{ padding: '15px 40px', background: `linear-gradient(135deg, ${tool.color}, ${tool.color}bb)`, border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, boxShadow: `0 8px 28px ${tool.color}25` }}>
              {isComingSoon ? 'Notify Me →'
                : !user ? 'Subscribe Now →'
                : subStatus === 'active' ? 'Access Dashboard →'
                : 'Subscribe Now →'}
            </button>
          </div>
        </div>
      </section>

      {/* GUARANTEE + DEMO (dark section for contrast) */}
      <section style={{ padding: isMobile ? '36px 20px' : '56px 40px', background: 'linear-gradient(180deg,#1a237e 0%,#0d1757 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? 32 : 56, background: 'rgba(255,255,255,0.06)', borderRadius: 32, padding: isMobile ? '28px 24px' : '44px 64px', border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-25%', left: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,188,212,0.15) 0%,transparent 65%)', filter: 'blur(90px)', pointerEvents: 'none' }} />
            <div style={{ width: isMobile ? '100%' : '52%', flexShrink: 0, position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 22, overflow: 'hidden' }}>
                <div style={{ padding: '11px 16px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ padding: '3px 18px', background: 'rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 10.5, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{tool.icon} {tool.label}</div>
                  </div>
                  <div style={{ padding: '3px 10px', background: 'rgba(0,188,212,0.25)', border: '1px solid rgba(0,188,212,0.4)', borderRadius: 100, fontSize: 9, color: '#00bcd4', fontWeight: 800 }}>PRO</div>
                </div>
                <ToolDemoAnimation slug={tool.slug} color={tool.color} />
              </div>
            </div>
            <div style={{ flex: 1, position: 'relative', zIndex: 1, textAlign: isMobile ? 'center' : 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#00bcd4', letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 18 }}>ThinkSuite AI.</div>
              <h2 style={{ fontSize: isMobile ? 30 : 48, fontWeight: 900, color: '#ffffff', lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
                High-quality results,<br />or your money back.
              </h2>
              <p style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.9, marginBottom: 36, maxWidth: 420, margin: isMobile ? '0 auto 36px' : '0 0 36px' }}>
                On ThinkSuite AI, you can grow your business risk-free. Every AI tool is backed by our 7-day money-back guarantee so you can create, generate, and scale with total confidence.
              </p>
              <button onClick={handleCTA}
                style={{ padding: '16px 48px', background: '#ffffff', border: 'none', borderRadius: 100, color: '#1a237e', fontSize: 15, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 40px rgba(255,255,255,0.2)' }}>
                {isComingSoon ? 'Notify Me →'
                : !user ? 'Try now →'
                : subStatus === 'active' ? 'Access Dashboard →'
                : 'Subscribe Now →'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ borderTop: '1px solid rgba(26,35,126,0.08)', borderBottom: '1px solid rgba(26,35,126,0.08)', padding: isMobile ? '28px 20px' : '36px 40px', background: '#f0f4ff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: isMobile ? 20 : 44 }}>
          {[
            { icon: '🔒', text: 'Enterprise Security' },
            { icon: '⚡', text: '99.9% Uptime' },
            { icon: '🌍', text: '50+ Countries' },
            { icon: '💳', text: '₹20 Trial' },
            { icon: '🎯', text: 'No CC Needed' },
            { icon: '🌐', text: 'Global Payments' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', fontWeight: 600 }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {tool.faqs && (
        <section style={{ borderTop: '1px solid rgba(26,35,126,0.08)', padding: isMobile ? '48px 20px' : '72px 40px', background: '#ffffff' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: tool.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: 10 }}>FAQ</div>
              <div style={{ fontSize: isMobile ? 26 : 36, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>Frequently Asked Questions</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tool.faqs.map((faq, i) => (
                <div key={i} style={{ background: '#f8faff', border: `1px solid ${openFaq===i ? tool.color+'30' : 'rgba(26,35,126,0.09)'}`, borderRadius: 14, overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaq(openFaq===i ? null : i)}
                    style={{ width: '100%', padding: '18px 22px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontFamily: 'inherit', textAlign: 'left' }}>
                    <span style={{ fontSize: isMobile ? 13.5 : 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{faq.q}</span>
                    <span style={{ fontSize: 18, color: tool.color, flexShrink: 0, transform: openFaq===i ? 'rotate(45deg)' : 'none', display: 'block' }}>+</span>
                  </button>
                  {openFaq===i && (
                    <div style={{ padding: '0 22px 18px', fontSize: 13.5, color: '#64748b', lineHeight: 1.75 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OTHER TOOLS */}
      <section style={{ borderTop: '1px solid rgba(26,35,126,0.08)', padding: isMobile ? '52px 20px' : '80px 40px', background: 'rgba(26,35,126,0.02)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: tool.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: 12 }}>Full Suite</div>
            <div style={{ fontSize: isMobile ? 24 : 34, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>
              Explore All <span style={{ color: '#1a237e' }}>ThinkSuite</span> AI Tools
            </div>
            <div style={{ fontSize: 15, color: '#64748b', marginTop: 10 }}>5 specialized AI tools. One platform. One subscription.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 16 }}>
            {otherTools.map(t => (
              <a key={t.slug} href={`/tools/${t.slug}`}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 22px', background: '#ffffff', border: `1px solid ${t.color}12`, borderRadius: 18, textDecoration: 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${t.color}10`, border: `1px solid ${t.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 20 : 22, flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize: isMobile ? 12 : 13.5, fontWeight: 800, color: '#0f172a', marginBottom: 3 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{t.tags.slice(0,2).join(' · ')}</div>
                </div>
              </a>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="/tools"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', background: 'linear-gradient(135deg,#1a237e,#00bcd4)', borderRadius: 12, color: '#ffffff', fontSize: 14, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 28px rgba(26,35,126,0.2)' }}>
              Access All AI Tools – Start Today →
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes tOrb1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,-70px) scale(1.18)}66%{transform:translate(-60px,90px) scale(0.88)}}
        @keyframes tOrb2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-110px,-90px) scale(1.25)}70%{transform:translate(70px,50px) scale(0.82)}}
        @keyframes tOrb3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(130px,-110px) scale(1.12)}}
      `}</style>
    </div>
    <ToolAuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} toolName={tool.label} slug={slug} redirectTo={`/tools/${slug}`} />
    {user && (
      <ToolSubscribeModal
        isOpen={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
        toolSlug={slug}
        toolName={tool.label}
        toolColor={tool.color}
        toolIcon={tool.icon}
        userId={user.uid}
        onSubscribed={() => { setSubStatus('active'); setSubscribeOpen(false) }}
      />
    )}

    {/* Coming Soon Modal */}
    {comingSoonOpen && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)' }} onClick={() => setComingSoonOpen(false)} />
        <div style={{ position: 'relative', background: '#ffffff', borderRadius: 24, padding: isMobile ? '36px 24px' : '48px 40px', maxWidth: 440, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.2)', textAlign: 'center' }}>
          <button onClick={() => setComingSoonOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8', padding: 4 }}>
            <i className="fa-solid fa-xmark" />
          </button>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: `${tool.color}12`, border: `1px solid ${tool.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px' }}>{tool.icon}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f1f5f9', borderRadius: 100, padding: '5px 14px', marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: 1.5, textTransform: 'uppercase' as const }}>Coming Soon</span>
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 12, letterSpacing: -0.5 }}>{tool.label}</h3>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 28 }}>
            We&apos;re working hard to bring you {tool.label}. Sign up to get early access and be the first to know when it launches!
          </p>
          <button onClick={() => { setComingSoonOpen(false); setAuthOpen(true) }}
            style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg, ${tool.color}, ${tool.color}cc)`, border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 8px 24px ${tool.color}25`, marginBottom: 12 }}>
            Notify Me at Launch →
          </button>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>No spam. We&apos;ll email you once and only when it&apos;s live.</p>
        </div>
      </div>
    )}
    </>
  )
}
