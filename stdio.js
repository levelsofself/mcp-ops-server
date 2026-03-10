#!/usr/bin/env node

// Stdio wrapper for Palyan Family AI System Operations MCP Server
// This runs as a proper MCP stdio transport for Claude Desktop
// The HTTP server runs separately on the VPS

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} = require("@modelcontextprotocol/sdk/types.js");

// Family member data
const FAMILY = {
  tamara: { name: "Tamara", role: "Operations Manager", specialty: "Business ops, pipeline management, team coordination, results tracking" },
  harout: { name: "Harout", role: "Real Estate Specialist", specialty: "Los Angeles County real estate, property analysis, neighborhood insights, market trends" },
  aram: { name: "Aram", role: "Legal Counsel", specialty: "Business law, contract review, compliance, government contracting, certifications" },
  roman: { name: "Roman", role: "Press & Content", specialty: "Press releases, articles, social media content, PR strategy, media outreach" },
  spartak: { name: "Spartak", role: "Global Communicator", specialty: "Translation (EN/ES/NL/HY/RU), cultural adaptation, international outreach" },
  kris: { name: "Kris", role: "Research Specialist", specialty: "Lead enrichment, market research, competitive analysis, data gathering" },
  nick: { name: "Nick", role: "Trainer", specialty: "Personal development training, coaching programs, workshop facilitation" },
  harry: { name: "Harry", role: "Book Specialist", specialty: "Book writing, editing, publishing guidance, content structuring" },
  lou: { name: "Lou", role: "Content Creator", specialty: "Long-form content, storytelling, brand narrative, educational materials" },
  lily: { name: "Lily", role: "Self-Awareness Coach", specialty: "Self-awareness coaching, scenario play, exercises, emotional intelligence" },
  lady: { name: "Lady", role: "Email Outreach", specialty: "Email campaigns, follow-up sequences, lead nurturing, CRM management" },
  arthur: { name: "Arthur", role: "Founder & CEO", specialty: "Final authority, vision, strategy, Best Life Coach California 2025" }
};

// LA neighborhoods data
const LA_NEIGHBORHOODS = {
  "Santa Clarita/Valencia": { medianPrice: "$650K-$750K", vibe: "Family-friendly suburbs, good schools, safe", commute: "35-45min to DTLA" },
  "Burbank": { medianPrice: "$850K-$1.1M", vibe: "Entertainment industry hub, walkable downtown", commute: "15-25min to DTLA" },
  "Glendale": { medianPrice: "$900K-$1.2M", vibe: "Armenian community, great restaurants, urban feel", commute: "15-20min to DTLA" },
  "Pasadena": { medianPrice: "$900K-$1.3M", vibe: "Historic, cultural, Old Town dining/shopping", commute: "20-30min to DTLA" },
  "Highland Park": { medianPrice: "$750K-$950K", vibe: "Artsy, gentrifying, great food scene", commute: "15min to DTLA" },
  "Silver Lake": { medianPrice: "$1M-$1.5M", vibe: "Hipster, creative, trendy", commute: "10-15min to DTLA" },
  "Echo Park": { medianPrice: "$800K-$1.1M", vibe: "Eclectic, lake community, diverse", commute: "10min to DTLA" },
  "Los Feliz": { medianPrice: "$1.2M-$2M", vibe: "Upscale bohemian, near Griffith Park", commute: "15min to DTLA" },
  "Woodland Hills": { medianPrice: "$750K-$1M", vibe: "Valley suburb, spacious homes", commute: "40-50min to DTLA" },
  "Sherman Oaks": { medianPrice: "$850K-$1.2M", vibe: "Valley upscale, Ventura Blvd shops", commute: "30-40min to DTLA" },
  "Long Beach": { medianPrice: "$650K-$850K", vibe: "Beach city, port town, diverse", commute: "30-40min to DTLA" },
  "Inglewood": { medianPrice: "$600K-$750K", vibe: "SoFi Stadium area, revitalizing", commute: "20-30min to DTLA" }
};

// Business certifications
const CERTIFICATIONS = {
  "CA Small Business (Micro)": { id: "2050529", status: "Approved", validThrough: "02/29/2028", platform: "Cal eProcure" },
  "SAM.gov": { uei: "Q82DA4R75YC3", status: "Active", cagePending: true },
  "Cal eProcure": { bidderId: "BID0127306", username: "LevelsofSelf", status: "Active" },
  "LA County VSS": { vendorCode: "229877", status: "Active", lsbePending: true }
};

// NAICS codes
const NAICS = [
  { code: "541511", description: "Custom Computer Programming Services", primary: false },
  { code: "541512", description: "Computer Systems Design Services", primary: true },
  { code: "541519", description: "Other Computer Related Services", primary: false },
  { code: "541715", description: "R&D Physical Engineering Life Sciences", primary: false },
  { code: "518210", description: "Computing Infrastructure Data Processing", primary: false }
];

// Supported languages
const LANGUAGES = {
  en: "English", es: "Spanish", nl: "Dutch", hy: "Armenian", ru: "Russian", ko: "Korean"
};

// Tool definitions
const TOOLS = [
  {
    name: "get_real_estate_insights",
    description: "Get Los Angeles real estate market insights, neighborhood analysis, and property recommendations. Powered by Harout, LA market specialist with deep local knowledge.",
    schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What you want to know about LA real estate" },
        budget: { type: "string", description: "Budget range (e.g., 'under 600K', '800K-1.2M')" },
        neighborhood: { type: "string", description: "Specific neighborhood to analyze" },
        property_type: { type: "string", enum: ["single_family", "condo", "multi_family", "investment"], description: "Type of property" }
      }
    }
  },
  {
    name: "get_legal_guidance",
    description: "Get business legal guidance including contract review insights, compliance information, government contracting requirements, and certification guidance. Powered by Aram, in-house AI counsel.",
    schema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Legal topic or question" },
        area: { type: "string", enum: ["contracts", "compliance", "government", "certifications", "business_formation", "intellectual_property"], description: "Area of law" }
      },
      required: ["topic"]
    }
  },
  {
    name: "translate_content",
    description: "Translate content between supported languages with cultural adaptation. Powered by Spartak, global communicator fluent in 6 languages.",
    schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "Text to translate" },
        from_language: { type: "string", enum: ["en", "es", "nl", "hy", "ru", "ko"], description: "Source language code" },
        to_language: { type: "string", enum: ["en", "es", "nl", "hy", "ru", "ko"], description: "Target language code" },
        context: { type: "string", description: "Context for cultural adaptation (business, casual, technical)" }
      },
      required: ["text", "to_language"]
    }
  },
  {
    name: "research_topic",
    description: "Deep research on any topic including market analysis, lead enrichment, competitive intelligence, and data gathering. Powered by Kris, research specialist.",
    schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Research topic or question" },
        type: { type: "string", enum: ["market_research", "lead_enrichment", "competitive_analysis", "general"], description: "Type of research" },
        depth: { type: "string", enum: ["quick", "standard", "deep"], description: "Research depth" }
      },
      required: ["query"]
    }
  },
  {
    name: "get_business_ops",
    description: "Get business operations status including pipeline metrics, team activity, certifications, and active processes. Powered by Tamara, operations manager.",
    schema: {
      type: "object",
      properties: {
        topic: { type: "string", enum: ["pipeline", "certifications", "team_status", "metrics", "overview"], description: "Operations area to query" }
      },
      required: ["topic"]
    }
  },
  {
    name: "create_content",
    description: "Create professional content including press releases, articles, social media posts, and marketing materials. Powered by Roman, press & content specialist.",
    schema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["press_release", "article", "social_post", "email", "blog", "capability_statement"], description: "Content type" },
        topic: { type: "string", description: "What the content should be about" },
        tone: { type: "string", enum: ["professional", "casual", "technical", "inspirational"], description: "Tone of content" },
        length: { type: "string", enum: ["short", "medium", "long"], description: "Content length" }
      },
      required: ["type", "topic"]
    }
  },
  {
    name: "get_training",
    description: "Get personal development training programs, workshop outlines, and coaching frameworks. Powered by Nick, certified trainer.",
    schema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Training topic" },
        format: { type: "string", enum: ["workshop", "course", "one_on_one", "group", "self_paced"], description: "Training format" },
        audience: { type: "string", description: "Target audience" }
      },
      required: ["topic"]
    }
  },
  {
    name: "get_family_info",
    description: "Get information about the Palyan Family AI System family system - team members, capabilities, architecture, and how it works.",
    schema: {
      type: "object",
      properties: {
        topic: { type: "string", enum: ["team", "capabilities", "architecture", "certifications", "naics", "contact"], description: "What to learn about" }
      },
      required: ["topic"]
    }
  }
];

// Resources
const RESOURCES = [
  { uri: "palyan://family/overview", name: "Family AI Overview", description: "Overview of the Palyan Family AI System family system", mimeType: "text/plain" },
  { uri: "palyan://business/certifications", name: "Business Certifications", description: "Active business certifications and registrations", mimeType: "text/plain" },
  { uri: "palyan://real-estate/neighborhoods", name: "LA Neighborhoods Guide", description: "Los Angeles neighborhood guide with market data", mimeType: "text/plain" },
  { uri: "palyan://business/capabilities", name: "Capability Statement", description: "Business capabilities, NAICS codes, and service areas", mimeType: "text/plain" }
];

// Handle tool calls
function handleToolCall(name, args) {
  switch (name) {
    case "get_real_estate_insights": {
      const result = { specialist: "Harout", role: "LA Real Estate Specialist" };
      if (args.neighborhood && LA_NEIGHBORHOODS[args.neighborhood]) {
        result.neighborhood = { name: args.neighborhood, ...LA_NEIGHBORHOODS[args.neighborhood] };
      } else if (args.budget) {
        const budgetNum = parseInt(args.budget.replace(/[^0-9]/g, ""));
        result.recommendations = Object.entries(LA_NEIGHBORHOODS)
          .filter(([_, data]) => {
            const low = parseInt(data.medianPrice.replace(/[^0-9]/g, ""));
            return low <= (budgetNum || 999999) * 1.2;
          })
          .map(([name, data]) => ({ name, ...data }))
          .slice(0, 5);
      } else {
        result.neighborhoods = LA_NEIGHBORHOODS;
      }
      result.note = "For detailed property searches and personalized recommendations, contact Harout via the Levels of Self platform.";
      result.contactWhatsApp = "+1 (818) 439-9770";
      return result;
    }

    case "get_legal_guidance": {
      return {
        specialist: "Aram", role: "In-House AI Counsel",
        topic: args.topic, area: args.area || "general",
        disclaimer: "This is AI-generated legal information, not legal advice. Consult a licensed attorney for specific legal matters.",
        certifications: args.area === "certifications" || args.area === "government" ? CERTIFICATIONS : undefined,
        naics: args.area === "government" ? NAICS : undefined,
        note: "For detailed legal guidance, book a consultation: https://calendly.com/levelsofself/zoom"
      };
    }

    case "translate_content": {
      return {
        specialist: "Spartak", role: "Global Communicator",
        from: LANGUAGES[args.from_language || "en"],
        to: LANGUAGES[args.to_language],
        context: args.context || "business",
        textLength: (args.text || "").length,
        supportedLanguages: LANGUAGES,
        note: "Full translation processing available through the Palyan Family AI System platform. This tool provides translation framework and language support information."
      };
    }

    case "research_topic": {
      return {
        specialist: "Kris", role: "Research Specialist",
        query: args.query,
        type: args.type || "general",
        depth: args.depth || "standard",
        capabilities: ["Market research", "Lead enrichment", "Competitive analysis", "Government opportunity scanning", "Job market analysis"],
        activePipeline: { leads: 946, emailsSent: 437, replies: 88, callsBooked: 17, govOpps: 399 }
      };
    }

    case "get_business_ops": {
      switch (args.topic) {
        case "pipeline":
          return { leads: 946, emailsSent: 437, replies: 88, callsBooked: 17, lifetimeRevenue: "$1,400", govOpportunities: 399, highMatchGov: 13, jobOpportunities: "71K+" };
        case "certifications":
          return CERTIFICATIONS;
        case "team_status":
          return { totalMembers: 12, active: Object.values(FAMILY).map(f => ({ name: f.name, role: f.role })) };
        case "metrics":
          return { gamePlayers: "25,000+", countries: 175, scenarios: 6854, pressFeatures: 16, coaches: 4 };
        case "overview":
          return {
            business: "Levels of Self / Arthur Palyan",
            type: "Sole Proprietorship (DBA)",
            location: "Valencia, CA 91355",
            certifications: Object.keys(CERTIFICATIONS),
            team: Object.values(FAMILY).length + " AI specialists",
            pipeline: { leads: 946, revenue: "$1,400" }
          };
        default:
          return { error: "Unknown topic", available: ["pipeline", "certifications", "team_status", "metrics", "overview"] };
      }
    }

    case "create_content": {
      return {
        specialist: "Roman", role: "Press & Content",
        contentType: args.type,
        topic: args.topic,
        tone: args.tone || "professional",
        length: args.length || "medium",
        note: "Content creation routed to Roman. Full content generation available through the Palyan Family AI System platform.",
        pressRoom: "http://www.einpresswire.com/newsroom/levelsofself/"
      };
    }

    case "get_training": {
      return {
        specialist: "Nick", role: "Trainer",
        topic: args.topic,
        format: args.format || "workshop",
        audience: args.audience || "general",
        availablePrograms: [
          "Self-Awareness Foundations (7 Levels)",
          "Emotional Intelligence for Leaders",
          "Pattern Recognition Workshop",
          "Breakthrough Exercise Certification",
          "Team Awareness Building",
          "Conflict Resolution Through Self-Awareness"
        ],
        bookingUrl: "https://calendly.com/levelsofself/zoom",
        freeResources: {
          game: "https://100levelup.com",
          mastermind: "https://www.levelsofself.com/booking-calendar/free-mastermind-english"
        }
      };
    }

    case "get_family_info": {
      switch (args.topic) {
        case "team":
          return { family: FAMILY };
        case "capabilities":
          return {
            services: ["AI Consulting", "Software Development", "Personal Development Training", "Real Estate Advisory (LA)", "Legal Guidance", "Multi-language Translation", "Research & Enrichment", "Content Creation", "Email Outreach"],
            naics: NAICS
          };
        case "architecture":
          return {
            description: "Multi-agent AI system with 12 specialized members, each with dedicated communication channels and toolsets",
            infrastructure: "DigitalOcean VPS, Caddy reverse proxy, PM2 process management, Vercel (game)",
            agents: Object.values(FAMILY).length,
            mcpEndpoint: "https://api.100levelup.com/mcp-ops/",
            gameEndpoint: "https://api.100levelup.com/mcp/"
          };
        case "certifications":
          return CERTIFICATIONS;
        case "naics":
          return { codes: NAICS };
        case "contact":
          return {
            name: "Arthur Palyan",
            email: "ArtPalyan@LevelsOfSelf.com",
            phone: "(818) 439-9770",
            whatsapp: "wa.me/18184399770",
            website: "https://www.levelsofself.com",
            game: "https://100levelup.com",
            booking: "https://calendly.com/levelsofself/zoom"
          };
        default:
          return { error: "Unknown topic", available: ["team", "capabilities", "architecture", "certifications", "naics", "contact"] };
      }
    }

    default:
      return { error: "Unknown tool" };
  }
}

// Handle resource reads
function handleResourceRead(uri) {
  switch (uri) {
    case "palyan://family/overview":
      return "Palyan Family AI System Operations - Multi-Agent Business System\n\n12 specialized AI family members providing: Operations Management (Tamara), Real Estate (Harout), Legal (Aram), Press & Content (Roman), Translation (Spartak), Research (Kris), Training (Nick), Books (Harry), Content (Lou), Coaching (Lily), Email Outreach (Lady).\n\nFounded by Arthur Palyan. Based in Valencia, CA. CA Certified Small Business (Micro) #2050529.";
    case "palyan://business/certifications":
      return Object.entries(CERTIFICATIONS).map(([name, data]) => name + ": " + JSON.stringify(data)).join("\n");
    case "palyan://real-estate/neighborhoods":
      return Object.entries(LA_NEIGHBORHOODS).map(([name, data]) => name + ": " + data.medianPrice + " | " + data.vibe + " | Commute: " + data.commute).join("\n");
    case "palyan://business/capabilities":
      return "Arthur Palyan DBA Levels of Self\nNAICS: " + NAICS.map(n => n.code + " " + n.description).join(", ") + "\nServices: AI Consulting, Software Development, Training, Coaching, Real Estate Advisory\nCoverage: All 58 California counties (Statewide)\nPlatforms: Web (100levelup.com), iOS, Telegram";
    default:
      return null;
  }
}

const server = new Server(
  { name: "palyan-ai-ops", version: "1.1.0" },
  { capabilities: { tools: {}, resources: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(t => ({ name: t.name, description: t.description, inputSchema: t.schema }))
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const result = handleToolCall(name, args || {});
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: RESOURCES
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const content = handleResourceRead(uri);
  if (content) {
    return { contents: [{ uri, mimeType: "text/plain", text: content }] };
  }
  return { contents: [{ uri, mimeType: "text/plain", text: "Unknown resource" }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
