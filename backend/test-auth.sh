#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Nexpay Authentication API${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Test 1: Register a new user
echo -e "${GREEN}1. Testing User Registration${NC}"
echo "POST $BASE_URL/api/auth/register"
echo ""
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "250788123456",
    "password": "password123",
    "bank": "Bank of Kigali (BK)"
  }'
echo -e "\n\n"

# Test 2: Login with the same user
echo -e "${GREEN}2. Testing User Login${NC}"
echo "POST $BASE_URL/api/auth/login"
echo ""
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "password123"
  }')

echo "$RESPONSE"

# Extract token (simple grep method)
TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "\n${BLUE}Token extracted: ${TOKEN:0:30}...${NC}\n"

# Test 3: Get user profile (protected route)
echo -e "${GREEN}3. Testing Protected Route (Get Profile)${NC}"
echo "GET $BASE_URL/api/auth/me"
echo "Authorization: Bearer $TOKEN"
echo ""
curl -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
