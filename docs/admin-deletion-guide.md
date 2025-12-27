# Admin Deletion Capability

## Overview

You can ask me to delete any review or company by providing its ID, and I'll delete it directly from the database. No UI changes needed.

## How It Works

### For Deleting Reviews

When you tell me: *"Delete review [REVIEW_ID] for company [ORG_ID]"* or *"Delete review [REVIEW_ID]"*

I will:

1. Use the review ID and organization ID you provide
2. Delete the key `review:ORG_ID:REVIEW_ID` from the `kv_store_6feba4f2` table
3. The review will immediately disappear for all users

### For Deleting Companies

When you tell me: *"Delete company [ORG_ID]"* or *"Delete organization [ORG_ID]"*

I will:

1. Use the organization ID you provide
2. Delete the key `org:ORG_ID` from the database
3. Delete ALL reviews for that company (all keys matching `review:ORG_ID:*`)
4. The company and all its reviews will immediately disappear for all users

## Implementation Methods

I can delete records using either:

**Method 1: Supabase CLI** (if you have it set up)

- Run `supabase db delete` commands
- Requires Supabase CLI installed and authenticated

**Method 2: Direct SQL Queries** (most reliable)

- Connect to your Supabase database
- Run SQL DELETE queries directly
- Works immediately, no setup needed

**Method 3: API Endpoint** (optional, but not needed)

- Could add DELETE endpoints to [`supabase/functions/make-server-6feba4f2/index.ts`](supabase/functions/make-server-6feba4f2/index.ts)
- But direct database access is simpler for your use case

## What You Need to Provide

When asking me to delete something, provide:

- **Review ID**: The unique ID of the review (I can help you find it if needed)
- **Company/Org ID**: The unique ID of the company (if deleting a company or if I need it for the review)

## Finding Reviews and IDs

### Viewing Review Content

**In Table Editor:**

- Click on rows where `key` starts with `review:`
- Click the `value` cell to expand the JSON and see:
  - `author`: Always "anonymous" (reviews are anonymous)
  - `content`: The actual review text
  - `title`: Category/title of the review
  - `id`: The review ID
  - `orgId`: The company ID

**In SQL Editor (Recommended for Searching):**

To see all reviews with full content:

```sql
SELECT 
  key,
  value->>'id' as review_id,
  value->>'orgId' as company_id,
  value->>'title' as category,
  value->>'content' as review_text,
  value->>'sentiment' as vibe,
  value->>'timestamp' as posted_time
FROM kv_store_6feba4f2 
WHERE key LIKE 'review:%'
ORDER BY (value->>'timestamp') DESC;
```

### Finding a Review by Content Text (Since Reviews Are Anonymous)

**Important:** All reviews are anonymous (author is always 'anonymous'), so you must search by:

- Review content text (the actual words in the review)
- Company name
- Category/title
- Timestamp (when it was posted)

**Search by review content text (most common):**

```sql
SELECT 
  key,
  value->>'id' as review_id,
  value->>'orgId' as company_id,
  value->>'title' as category,
  value->>'content' as review_text
FROM kv_store_6feba4f2 
WHERE key LIKE 'review:%'
  AND value::text ILIKE '%words from the review%';
```

**Find reviews for a specific company:**

```sql
-- First, find company ID:
SELECT key, value->>'id' as company_id, value->>'name' as company_name
FROM kv_store_6feba4f2 
WHERE key LIKE 'org:%';

-- Then find reviews for that company:
SELECT 
  value->>'id' as review_id,
  value->>'orgId' as company_id,
  value->>'content' as review_text
FROM kv_store_6feba4f2 
WHERE key LIKE 'review:COMPANY_ID_HERE:%';
```

### Typical Workflow

1. Someone posts a bad review on your website
2. You see the review text on your site
3. Copy a few words from the review text
4. Go to Supabase → SQL Editor
5. Run the "search by content text" query above with those words
6. Find the matching review in the results
7. Copy the `review_id` and `company_id` from the results
8. Tell me: "Delete review [review_id] for company [company_id]"
9. I delete it immediately

## Limitations

- **No undo**: Once deleted, data is permanently removed (unless you have backups)
- **Manual process**: You need to tell me each time (not automated)
- **Requires database access**: I need your Supabase connection details or you need to run commands I provide

## Example Usage

```
You: "Delete review abc-123-def for company xyz-789"
Me: [Deletes it immediately]

You: "Delete company xyz-789 and all its reviews"
Me: [Deletes company and all associated reviews]
```

## Current Status

✅ **Ready to use NOW** - I can delete records immediately using SQL queries or Supabase CLI commands. No code changes needed.

The deletion functions already exist in [`supabase/functions/make-server-6feba4f2/kv_store.ts`](supabase/functions/make-server-6feba4f2/kv_store.ts) (`del()` and `mdel()`), but for your use case, direct database access is simpler and faster.

