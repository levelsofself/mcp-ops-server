# Palyan AI Operations - MCP Server

An MCP (Model Context Protocol) server that gives AI assistants access to a multi-agent business operations platform with 12 specialized AI agents covering real estate, legal, translation, research, content creation, training, and more.

## What It Does

This server connects AI assistants to the Palyan AI family - a team of specialized agents built by Arthur Palyan (founder of Levels of Self). Each tool is powered by a dedicated agent with domain expertise:

- **Harout** - Los Angeles real estate market insights
- **Aram** - Business legal guidance and compliance
- **Spartak** - Multi-language translation (6 languages)
- **Kris** - Deep research and competitive analysis
- **Tamara** - Business operations and pipeline metrics
- **Roman** - Professional content creation
- **Nick** - Personal development training programs

All tools are read-only. No user data is collected or stored.

## Tools

| Tool | Description |
|------|-------------|
| `get_real_estate_insights` | LA neighborhood analysis, property recommendations, market data |
| `get_legal_guidance` | Contract review, compliance, government contracting, certifications |
| `translate_content` | Translation between EN, ES, NL, HY, RU, KO with cultural adaptation |
| `research_topic` | Market research, lead enrichment, competitive analysis |
| `get_business_ops` | Pipeline metrics, certifications, team status, business overview |
| `create_content` | Press releases, articles, social posts, marketing materials |
| `get_training` | Workshop outlines, coaching frameworks, training programs |
| `get_family_info` | Team members, capabilities, architecture, contact info |

## Setup as Custom MCP Connector

### Hosted (Recommended)

The server is live and ready to use:

```
URL: https://api.100levelup.com/mcp-ops/
Protocol: MCP 2024-11-05 (Streamable HTTP + SSE)
Authentication: None required (optional API key support)
```

Add to your MCP client config:

```json
{
  "mcpServers": {
    "palyan-ai-ops": {
      "url": "https://api.100levelup.com/mcp-ops/"
    }
  }
}
```

### Self-Hosted

1. Clone this repo
2. Run `node server.js`
3. Server starts on port 3472

## Example Prompts

Try these with any MCP-connected AI assistant:

1. **"What neighborhoods in LA are good for families under $750K?"** - Returns neighborhood analysis with median prices, vibes, and commute times for budget-friendly family areas.

2. **"What do I need to know about government contracting certifications?"** - Returns current certification status (CA Small Business, SAM.gov, Cal eProcure) and relevant NAICS codes.

3. **"Translate this message to Armenian for a business context"** - Routes to Spartak for culturally adapted translation across 6 supported languages.

4. **"Give me a business overview of the Palyan AI operation"** - Returns full business summary: team size, certifications, pipeline metrics, and service areas.

5. **"What training programs are available for emotional intelligence?"** - Returns available programs including Self-Awareness Foundations, Pattern Recognition Workshop, and booking links.

## About

**Palyan AI Operations** is a multi-agent business platform built by Arthur Palyan, operating out of Valencia, CA. The system runs 12 specialized AI agents that handle real estate advisory, legal guidance, translation, research, content creation, and more.

- Business: Levels of Self / Arthur Palyan
- CA Small Business (Micro) Certified: #2050529
- Website: https://www.levelsofself.com
- Game: https://100levelup.com
- Privacy: https://api.100levelup.com/family/privacy.html
- MCP Privacy: https://api.100levelup.com/family/mcp-privacy.html

## Support

- Email: artpalyan@levelsofself.com
- Book a call: https://calendly.com/levelsofself/zoom

## License

MIT - see [LICENSE](LICENSE)
