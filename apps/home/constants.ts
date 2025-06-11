/* ==========================================================================*/
// constants.ts — Application constants for different audiences
/* ==========================================================================*/
// Purpose: Defines constants for builders and enterprise audiences
// Sections: Shared Constants, Hero Constants, Builder Constants, Enterprise Constants, Exports

/* ==========================================================================*/
// Shared Constants
/* ==========================================================================*/

const announcement = {
  text: "🚀 New: Read our vision for the future of AI development",
  button: {
    text: "🚀 New: See Our Vision",
    href: "/resources/future-vision",
    external: true,
  },
};

const footer = {
  copyright: "© 2025 Astral. All rights reserved.",
  contact: "Contact Us",
  linkedin: "LinkedIn",
};

/* ==========================================================================*/
// Hero Constants
/* ==========================================================================*/

const heroConstants = {
  announcement: {
    text: "🚀 New: Read our vision for the future of AI development",
    button: {
      text: "See Our Vision",
      href: "/resources/future-vision",
    },
  },
  title: "We make building with AI dead simple.",
  subtitle: "Everything you need to build with artificial intelligence in one platform.",
  cta: {
    primary: {
      text: "Start Building",
      href: "#quick-start",
    },
    secondary: {
      text: "Watch the film",
      href: "#",
    },
  },
};

/* ==========================================================================*/
// Builder Constants
/* ==========================================================================*/

const builderConstants = {
  navbar: {
    navigation: [
      // {
      //   name: "Docs",
      //   href: "https://docs.useastral.dev",
      //   external: true,
      // },
      // {
      //   name: "Platform",
      //   href: "https://platform.useastral.dev",
      //   external: true,
      // },
      // TODO: turn into resources and add a blog section
      {
        name: "Our Vision",
        href: "/resources/vision",
        external: false,
      },
      {
        name: "Meet Chris",
        href: "https://cal.com/chris-maresca/15min",
        external: true,
      },
      // {
      //   name: "Careers",
      //   href: "/careers",
      //   external: false,
      // },
    ],
    announcement: announcement,
    auth: {
      signup: {
        text: "Sign Up",
        href: "/signup",
        external: false,
      },
      login: {
        text: "Login",
        href: "/login",
        external: false,
      },
    },
  },
  cta: {
    title: "We make building with AI dead simple.",
    subtitle: "Everything you need to build with artificial intelligence in one platform.",
    primary: {
      text: "Quick Start",
      href: "#quick-start",
      external: false,
    },
    secondary: {
      text: "See Our Vision",
      href: "/resources/vision",
      external: true,
    },
  },
  providers: {
    label: "Model Providers",
    title: "One Interface. Every Single Model.",
    subtitle: "Connect to any AI provider through our unified API. Switch between models without changing your code.",
    cta: {
      text: "Quick Start",
      href: "#quick-start",
      external: false,
    },
    list: [
      { name: "OpenAI", logo: "/providers/openai.svg" },
      { name: "Anthropic", logo: "/providers/anthropic.svg" },
      { name: "Gemini", logo: "/providers/gemini.svg" },
      { name: "Azure", logo: "/providers/azure.svg" },
      { name: "Bedrock", logo: "/providers/bedrock.svg" },
      { name: "Google Vertex", logo: "/providers/vertexai.svg" },
      { name: "HuggingFace", logo: "/providers/huggingface.svg" },
      { name: "Ollama", logo: "/providers/ollama.svg" },
      { name: "DeepSeek", logo: "/providers/deepseek.svg" },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about building with Astral's AI platform.",
    items: [
      {
        question: "How do I get started with Astral?",
        answer: "Sign up for a free account, get your API key, and start making requests to any AI model through our unified interface. Check out our quick start guide for step-by-step instructions."
      },
      {
        question: "Which AI models and providers are supported?",
        answer: "We support all major AI providers including OpenAI, Anthropic, Google, Azure, AWS Bedrock, and many more. You can switch between models without changing your code."
      },
      {
        question: "How does pricing work?",
        answer: "We use a pay-as-you-go model with transparent pricing. You only pay for the tokens you use, with no hidden fees. Check our pricing page for detailed rates per model."
      },
      {
        question: "Can I use Astral in production applications?",
        answer: "Absolutely! Astral is designed for production use with 99.9% uptime SLA, robust error handling, and enterprise-grade security. Thousands of developers trust us with their production workloads."
      },
      {
        question: "Do you offer rate limiting and usage controls?",
        answer: "Yes, we provide comprehensive rate limiting, usage quotas, and spending controls. You can set daily/monthly limits and receive alerts when approaching your thresholds."
      },
      {
        question: "How do I switch between different AI models?",
        answer: "Simply change the model parameter in your API request. Our unified interface means you can switch from GPT-4 to Claude to Gemini without changing any other code."
      },
      {
        question: "Is there a free tier available?",
        answer: "Yes! We offer free credits for new users to get started. This includes access to all models and features, so you can test everything before committing to a paid plan."
      }
    ]
  },
};

/* ==========================================================================*/
// Enterprise Constants
/* ==========================================================================*/

const enterpriseConstants = {
  navbar: {
    navigation: [
      {
        name: "Solutions",
        href: "/solutions",
        external: false,
      },
      {
        name: "Enterprise",
        href: "/enterprise",
        external: false,
      },
      {
        name: "Contact",
        href: "/contact",
        external: false,
      },
    ],
    announcement: announcement,
    auth: {
      signup: {
        text: "Get Started",
        href: "/enterprise/signup",
        external: false,
      },
      login: {
        text: "Sign In",
        href: "/login",
        external: false,
      },
    },
  },
  cta: {
    title: "We help every company become an AI company",
    subtitle: "Astral is your firm's operating system for the AI era.",
    primary: {
      text: "Deploy Workflow",
      href: "/enterprise/deploy",
      external: false,
    },
    secondary: {
      text: "See Our Vision",
      href: "/resources/vision",
      external: false,
    },
  },
  providers: {
    label: "Enterprise Integrations",
    title: "Enterprise-Grade AI Infrastructure.",
    subtitle: "Secure, scalable connections to all major AI providers with enterprise SLAs and compliance.",
    cta: {
      text: "See Our Vision",
      href: "/resources/vision",
      external: false,
    },
    list: [
      { name: "OpenAI", logo: "/providers/openai.svg" },
      { name: "Anthropic", logo: "/providers/anthropic.svg" },
      { name: "Gemini", logo: "/providers/gemini.svg" },
      { name: "Azure", logo: "/providers/azure.svg" },
      { name: "Bedrock", logo: "/providers/bedrock.svg" },
      { name: "Google Vertex", logo: "/providers/vertexai.svg" },
      { name: "HuggingFace", logo: "/providers/huggingface.svg" },
      { name: "Ollama", logo: "/providers/ollama.svg" },
      { name: "DeepSeek", logo: "/providers/deepseek.svg" },
    ],
  },
  faq: {
    title: "Enterprise FAQ",
    subtitle: "Answers to common questions about Astral's enterprise AI platform.",
    items: [
      {
        question: "What enterprise features does Astral provide?",
        answer: "Astral Enterprise includes dedicated infrastructure, SSO integration, advanced security controls, custom SLAs, priority support, and comprehensive audit logging for enterprise compliance."
      },
      {
        question: "How does Astral ensure data security and compliance?",
        answer: "We're SOC 2 Type II certified with GDPR compliance. Your data is encrypted in transit and at rest, with no model training on your data. We support private cloud deployments for maximum security."
      },
      {
        question: "Can Astral integrate with our existing systems?",
        answer: "Yes, Astral provides robust APIs and SDKs that integrate seamlessly with your existing infrastructure. We also offer custom integrations and dedicated support for enterprise deployments."
      },
      {
        question: "What kind of SLA do you offer for enterprise customers?",
        answer: "Enterprise customers receive 99.9% uptime SLA with dedicated support channels, priority response times, and custom escalation procedures. We also offer premium SLAs up to 99.99% uptime."
      },
      {
        question: "How does enterprise pricing work?",
        answer: "Enterprise pricing is customized based on your usage volume, required features, and support level. Contact our sales team for a tailored quote that fits your organization's needs."
      },
      {
        question: "Do you offer on-premises or private cloud deployment?",
        answer: "Yes, we offer both private cloud and on-premises deployment options for enterprises with strict data residency or security requirements. This includes full control over your AI infrastructure."
      },
      {
        question: "What support is available for enterprise customers?",
        answer: "Enterprise customers receive dedicated support with priority response times, assigned customer success managers, and access to our solutions architects for implementation guidance."
      }
    ]
  },
};

/* ==========================================================================*/
// Export Constants
/* ==========================================================================*/

export { builderConstants, enterpriseConstants, footer, heroConstants };


