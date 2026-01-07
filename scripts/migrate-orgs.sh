#!/bin/bash

# Migration script to populate organizations in Supabase
# Run this AFTER deploying the edge function with the new org endpoints

API_URL="https://lwqnysvehxjubnzjsteq.supabase.co/functions/v1/make-server-6feba4f2/orgs"
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3cW55c3ZlaHhqdWJuempzdGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NzE3MjMsImV4cCI6MjA4MjI0NzcyM30._wKtJChYXvMpt_-uZtpMN5Pheu-UltT7WgJdJHzzJ1M"

orgs=(
  "toddle"
  "tata consultancy services"
  "hdfc bank"
  "infosys"
  "hindustan unilever"
  "icici bank"
  "bharti airtel"
  "kotak mahindra bank"
  "state bank of india"
  "maruti suzuki"
  "larsen & toubro"
  "nestle india"
  "tata steel"
  "sun pharmaceuticals"
  "tata motors"
  "asian paints"
  "ultratech cement"
  "zamp"
  "apple inc."
  "microsoft corporation"
  "alphabet inc."
  "amazon.com inc."
  "nvidia corporation"
  "tesla inc."
  "meta platforms inc."
  "berkshire hathaway inc."
  "reliance industries"
)

echo "Starting migration of ${#orgs[@]} organizations..."

for org in "${orgs[@]}"; do
  echo "Adding: $org"
  response=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d "{\"name\": \"$org\"}")
  echo "  Response: $response"
done

echo ""
echo "Migration complete! Verifying..."
curl -s "$API_URL" -H "Authorization: Bearer $AUTH_TOKEN" | head -c 500
echo ""






