import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const content = `# RosantiBike Motorent auth.md

## Overview

RosantiBike Motorent provides public motorcycle rental discovery, live fleet rates, and online rental booking services in Malang and Batu, East Java, Indonesia.

## Agent Audience

This authentication specification is intended for:
- AI Assistants & Search Agents (ChatGPT, Google Gemini, Perplexity, Claude, Apple Intelligence)
- Automated Travel Booking and Recommendation Agents
- Public API Consumers

## Authentication Models & Supported Flows

### 1. Anonymous Access (Public Discovery)

- **Audience:** All AI Agents, Autonomous Systems, and Search Crawlers
- **Supported Identity Types:** \`["anonymous"]\`
- **Scope:** Read-only access to vehicle catalogue, live rental rates, rental terms, FAQ, and travel guides.
- **Endpoints:**
  - \`GET https://api.rosantibikemotorent.com/api/jenis-motor\` (Motorcycle Catalog & Rates)
  - \`GET https://api.rosantibikemotorent.com/api/unit-motor/brands\` (Vehicle Brands)
  - \`GET https://api.rosantibikemotorent.com/api/blog\` (Travel & Rental Guides)
  - \`GET https://rosantibikemotorent.com/llms.txt\` (Structured Knowledge Base)
  - \`GET https://rosantibikemotorent.com/llms-full.txt\` (Full Comprehensive AI Docs)
- **Credential Requirements:** None (Open access for AI discovery and citation).

### 2. Customer Booking & Inquiry

- **Method:** Web Booking System & WhatsApp Automation
- **Scope:** Rental booking submissions with date selection and unit allocation.
- **Endpoints:**
  - \`POST https://api.rosantibikemotorent.com/api/transaksi\` (Direct Booking Submission)
  - \`https://rosantibikemotorent.com/id/booking\` (Interactive Web Form)
- **Requirements:** Customer contact information (Name, WhatsApp Phone Number, Valid ID).

### 3. Administrative Management

- **Method:** OAuth 2.0 Bearer Token (JSON Web Tokens)
- **Header:** \`Authorization: Bearer <TOKEN>\`
- **Scope:** Fleet management, booking approvals, and system settings (Restricted to authorized operators).

## Discovery Endpoints

- **API Catalog (RFC 9727):** \`https://rosantibikemotorent.com/.well-known/api-catalog\`
- **Protected Resource Metadata (RFC 9728):** \`https://rosantibikemotorent.com/.well-known/oauth-protected-resource\`
- **Content Signals & Robots Policy:** \`https://rosantibikemotorent.com/robots.txt\`
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
