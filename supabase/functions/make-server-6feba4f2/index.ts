import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6feba4f2/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all organizations
app.get("/make-server-6feba4f2/orgs", async (c) => {
  console.log("Fetching all organizations");
  
  try {
    const orgs = await kv.getByPrefix("org:");
    console.log(`Found ${orgs.length} organizations`);
    
    // Sort alphabetically by name
    orgs.sort((a: any, b: any) => a.name.localeCompare(b.name));
    
    return c.json(orgs || []);
  } catch (error: any) {
    console.error("Error fetching organizations:", error);
    return c.json({ error: "Failed to fetch organizations", details: error.message }, 500);
  }
});

// Create a new organization
app.post("/make-server-6feba4f2/orgs", async (c) => {
  try {
    const body = await c.req.json();
    const { name } = body;

    if (!name) {
      return c.json({ error: "Missing required field: name" }, 400);
    }

    const id = crypto.randomUUID();
    
    const newOrg = {
      id,
      name: name.toLowerCase().trim()
    };

    // Key format: org:ORG_ID
    console.log(`Creating organization: org:${id}`);
    await kv.set(`org:${id}`, newOrg);

    return c.json(newOrg, 201);
  } catch (error: any) {
    console.error("Error creating organization:", error);
    return c.json({ error: "Failed to create organization", details: error.message }, 500);
  }
});

// Get reviews for an organization
app.get("/make-server-6feba4f2/reviews/:orgId", async (c) => {
  const orgId = c.req.param("orgId");
  console.log(`Fetching reviews for org: ${orgId}`);
  
  try {
    const reviews = await kv.getByPrefix(`review:${orgId}:`);
    console.log(`Found ${reviews.length} reviews`);
    
    // Sort by timestamp descending
    reviews.sort((a: any, b: any) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    return c.json(reviews || []);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return c.json({ error: "Failed to fetch reviews", details: error.message }, 500);
  }
});

// Create a new review
app.post("/make-server-6feba4f2/reviews", async (c) => {
  try {
    const body = await c.req.json();
    const { orgId, title, content, author, sentiment } = body;

    if (!orgId || !title || !content || !author || !sentiment) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    const newReview = {
      id,
      orgId,
      title,
      content, 
      author,
      timestamp, 
      sentiment
    };

    // Key format: review:ORG_ID:REVIEW_ID
    console.log(`Creating review: review:${orgId}:${id}`);
    await kv.set(`review:${orgId}:${id}`, newReview);

    return c.json(newReview, 201);
  } catch (error: any) {
    console.error("Error creating review:", error);
    return c.json({ error: "Failed to create review", details: error.message }, 500);
  }
});

// Catch-all to help debug 404s
app.all('*', (c) => {
    return c.json({ error: 'Route not found', path: c.req.path }, 404);
});

Deno.serve(app.fetch);
