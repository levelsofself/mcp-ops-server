# Palyan AI Operations - MCP Server

An MCP (Model Context Protocol) server that gives AI assistants access to a multi-agent business operations platform with specialized AI services covering real estate, legal, translation, research, content creation, training, and more.

## What It Does

This server connects AI assistants to the Palyan AI platform - a team of specialized AI agents built by Arthur Palyan (founder of Levels of Self). Each tool is powered by a dedicated agent with domain expertise:

- **LA Real Estate AI** - Los Angeles real estate market insights and neighborhood analysis
- **Legal AI** - Business legal guidance, compliance, and government contracting
- **Translation AI** - Multi-language translation (6 languages) with cultural adaptation
- **Research AI** - Deep research, market analysis, and competitive intelligence
- **Operations AI** - Business operations, service offerings, and company metrics
- **Press & Content AI** - Professional content creation and media materials
- **Training AI** - Personal development training programs and coaching frameworks

All tools are read-only. No user data is collected or stored.

## v2.0.0 Changes

- **API key authentication required** - All requests (except `/health`) require a Bearer token in the Authorization header
- **Sanitized internal data** - No internal names, cert IDs, registration numbers, or pipeline data exposed
- **Renamed tools** - `get_platform_info` replaces `get_family_info`, `team_capabilities` replaces `team_status`
- **Secure by default** - If no API keys are configured, all requests are rejected

## Tools

| Tool | Description |
|------|-------------|
| `get_real_estate_insights` | LA neighborhood analysis, property recommendations, market data |
| `get_legal_guidance` | Contract review, compliance, government contracting, certifications |
| `translate_content` | Translation between EN, ES, NL, HY, RU, KO with cultural adaptation |
| `research_topic` | Market research, lead enrichment, competitive analysis |
| `get_business_ops` | Service offerings, certifications, team capabilities, business overview |
| `create_content` | Press releases, articles, social posts, marketing materials |
| `get_training` | Workshop outlines, coaching frameworks, training programs |
| `get_platform_info` | Platform capabilities, certifications, NAICS codes, contact info |

## Authentication

All requests require a valid API key passed as a Bearer token:

```
Authorization: Bearer YOUR_API_KEY
```

The `/health` endpoint is open and does not require authentication.

## Setup as Custom MCP Connector

### Hosted (Recommended)

The server is live and ready to use:

```
URL: https://api.100levelup.com/mcp-ops/
Protocol: MCP 2024-11-05 (Streamable HTTP + SSE)
Authentication: Bearer token required
```

Add to your MCP client config:

```json
{
  "mcpServers": {
    "palyan-ai-ops": {
      "url": "https://api.100levelup.com/mcp-ops/",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### Self-Hosted

1. Clone this repo
2. Create an API keys file: `echo '["your-key-here"]' > /path/to/mcp-api-keys.json`
3. Update the key file path in `server.js` if needed
4. Run `node server.js`
5. Server starts on port 3472

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check (no auth required) |
| `/sse` | GET | SSE transport connection |
| `/message` | POST | SSE transport messages |
| `/mcp` | POST | Streamable HTTP transport |
| `/mcp` | GET | Server info and tool listing |

## Example Prompts

Try these with any MCP-connected AI assistant:

1. **"What neighborhoods in LA are good for families under $750K?"** - Returns neighborhood analysis with median prices, vibes, and commute times for budget-friendly family areas.

2. **"What do I need to know about government contracting certifications?"** - Returns current certification categories and relevant NAICS codes.

3. **"Translate this message to Armenian for a business context"** - Routes to the Translation AI for culturally adapted translation across 6 supported languages.

4. **"Give me a business overview of the Palyan AI operation"** - Returns business summary: service areas, certification categories, and specialist count.

5. **"What training programs are available for emotional intelligence?"** - Returns available programs including Self-Awareness Foundations, Pattern Recognition Workshop, and booking links.

## Resources

The server exposes MCP resources for direct data access:

| Resource URI | Description |
|-------------|-------------|
| `palyan://platform/overview` | Platform overview and services |
| `palyan://business/certifications` | Active business certification categories |
| `palyan://real-estate/neighborhoods` | LA neighborhood guide with market data |
| `palyan://business/capabilities` | Business capabilities and NAICS codes |

## About

**Palyan AI Operations** is a multi-agent business platform built by Arthur Palyan, operating out of Valencia, CA. The system runs specialized AI agents that handle real estate advisory, legal guidance, translation, research, content creation, and more.

- Business: Levels of Self - Arthur Palyan
- California Certified Small Business (Micro)
- Website: https://www.levelsofself.com
- Game: https://100levelup.com
- Privacy: https://api.100levelup.com/family/privacy.html
- MCP Privacy: https://api.100levelup.com/family/mcp-privacy.html

## Support

- Email: artpalyan@levelsofself.com
- Book a call: https://calendly.com/levelsofself/zoom

## License

MIT - see [LICENSE](LICENSE)
