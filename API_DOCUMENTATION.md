# 📖 Eat Wise API Documentation

## Base URLs

- **Production:** `https://eat-wise-silk.vercel.app/api/`
- **Local Development:** `http://localhost:8000/api/`

## Authentication

This API uses **JWT (JSON Web Token)** authentication. After logging in, include the access token in the `Authorization` header for protected endpoints.

### Header Format
```http
Authorization: Bearer <your_access_token>
```

---

## Authentication Endpoints

### Register User

Create a new user account with profile information.

**Endpoint:** `POST /api/register/`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "householdSize": 4,
  "dietaryPreferences": "Vegetarian",
  "location": "New York",
  "budgetRange": "$100-$200"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### Login

Authenticate and receive JWT tokens.

**Endpoint:** `POST /api/auth/login/`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Token Lifetimes:**
- Access Token: 1 hour
- Refresh Token: 7 days

---

### Refresh Token

Get a new access token using the refresh token.

**Endpoint:** `POST /api/auth/refresh/`

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## User Profile

### Get Profile

Retrieve the authenticated user's profile.

**Endpoint:** `GET /api/profile/`

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": 1,
  "householdSize": 4,
  "dietaryPreferences": "Vegetarian",
  "location": "New York",
  "budgetRange": "$100-$200"
}
```

---

### Update Profile

Update user profile information.

**Endpoint:** `PATCH /api/profile/`

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "householdSize": 5,
  "dietaryPreferences": "Vegan",
  "location": "Los Angeles",
  "budgetRange": "$150-$250"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": 1,
  "householdSize": 5,
  "dietaryPreferences": "Vegan",
  "location": "Los Angeles",
  "budgetRange": "$150-$250"
}
```

---

## Food Items

### List All Food Items

Get all available food items with optional filtering and sorting.

**Endpoint:** `GET /api/foodItems/`

**Query Parameters:**
- `category` (optional): Filter by category (e.g., `Fruit`, `Vegetable`)
- `orderBy` (optional): Sort by field (e.g., `name`, `-expirationTimeDays`)

**Examples:**
```http
GET /api/foodItems/
GET /api/foodItems/?category=Fruit
GET /api/foodItems/?orderBy=name
GET /api/foodItems/?category=Vegetable&orderBy=-expirationTimeDays
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Apple",
    "category": "Fruit",
    "expirationTimeDays": 7,
    "costPerUnit": "2.50"
  },
  {
    "id": 2,
    "name": "Banana",
    "category": "Fruit",
    "expirationTimeDays": 5,
    "costPerUnit": "1.50"
  }
]
```

---

### Get Food Item Details

Retrieve details of a specific food item.

**Endpoint:** `GET /api/foodItems/manage/{id}/`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Apple",
  "category": "Fruit",
  "expirationTimeDays": 7,
  "costPerUnit": "2.50"
}
```

---

## User Inventory

### List User Inventory

Get all items in the authenticated user's inventory.

**Endpoint:** `GET /api/userInventory/`

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "food_item": 1,
    "food_item_name": "Apple",
    "food_item_category": "Fruit",
    "quantity": "5.00",
    "unit": "kg",
    "purchase_date": "2025-11-28",
    "expiry_date": "2025-12-05"
  },
  {
    "id": 2,
    "food_item": 3,
    "food_item_name": "Milk",
    "food_item_category": "Dairy",
    "quantity": "2.00",
    "unit": "liters",
    "purchase_date": "2025-11-30",
    "expiry_date": "2025-12-03"
  }
]
```

---

### Add Item to Inventory

Add a new food item to user's inventory.

**Endpoint:** `POST /api/userInventory/`

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "food_item": 1,
  "quantity": 5.0,
  "unit": "kg",
  "expiry_date": "2025-12-05"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "food_item": 1,
  "food_item_name": "Apple",
  "food_item_category": "Fruit",
  "quantity": "5.00",
  "unit": "kg",
  "purchase_date": "2025-11-28",
  "expiry_date": "2025-12-05"
}
```

---

### Update Inventory Item

Update an existing inventory item.

**Endpoint:** `PATCH /api/userInventory/{id}/`

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 3.5,
  "expiry_date": "2025-12-06"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "food_item": 1,
  "food_item_name": "Apple",
  "food_item_category": "Fruit",
  "quantity": "3.50",
  "unit": "kg",
  "purchase_date": "2025-11-28",
  "expiry_date": "2025-12-06"
}
```

---

### Delete Inventory Item

Remove an item from inventory.

**Endpoint:** `DELETE /api/userInventory/{id}/`

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

## Consumption Logs

### List Consumption Logs

Get all consumption logs for the authenticated user, ordered by most recent first.

**Endpoint:** `GET /api/consumptionLogs/`

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "food_item": 1,
    "food_item_name": "Apple",
    "quantity_consumed": "2.00",
    "unit": "kg",
    "consumption_date": "2025-11-30",
    "notes": "Had with breakfast"
  },
  {
    "id": 2,
    "food_item": 3,
    "food_item_name": "Milk",
    "quantity_consumed": "0.50",
    "unit": "liters",
    "consumption_date": "2025-11-29",
    "notes": ""
  }
]
```

---

### Log Consumption

Record food consumption.

**Endpoint:** `POST /api/consumptionLogs/`

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "food_item": 1,
  "quantity_consumed": 2.0,
  "unit": "kg",
  "notes": "Had with breakfast"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "food_item": 1,
  "food_item_name": "Apple",
  "quantity_consumed": "2.00",
  "unit": "kg",
  "consumption_date": "2025-11-30",
  "notes": "Had with breakfast"
}
```

---

### Update Consumption Log

Update an existing consumption log.

**Endpoint:** `PATCH /api/consumptionLogs/{id}/`

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity_consumed": 2.5,
  "notes": "Updated portion size"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "food_item": 1,
  "food_item_name": "Apple",
  "quantity_consumed": "2.50",
  "unit": "kg",
  "consumption_date": "2025-11-30",
  "notes": "Updated portion size"
}
```

---

### Delete Consumption Log

Remove a consumption log entry.

**Endpoint:** `DELETE /api/consumptionLogs/{id}/`

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

## Resources

### List Educational Resources

Get all educational resources (no authentication required).

**Endpoint:** `GET /api/resources/manage/`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Food Storage Tips",
    "description": "Learn how to properly store different types of food",
    "url": "https://example.com/storage-tips",
    "category": "Storage",
    "type": "Article"
  },
  {
    "id": 2,
    "title": "Reducing Food Waste",
    "description": "Practical tips to minimize household food waste",
    "url": "https://example.com/reduce-waste",
    "category": "Sustainability",
    "type": "Guide"
  }
]
```

---

## Health Check

### API Health Status

Check if the API is running.

**Endpoint:** `GET /api/health/`

**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "eat_wise_api"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": [
    "This field is required."
  ]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "A server error occurred."
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Anonymous users:** 100 requests per day
- **Authenticated users:** 1000 requests per day

**Rate limit exceeded response (429):**
```json
{
  "detail": "Request was throttled. Expected available in 3600 seconds."
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST https://eat-wise-silk.vercel.app/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "householdSize": 2,
    "dietaryPreferences": "None",
    "location": "Test City",
    "budgetRange": "$50-$100"
  }'
```

### Login
```bash
curl -X POST https://eat-wise-silk.vercel.app/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

### Get Profile
```bash
curl -X GET https://eat-wise-silk.vercel.app/api/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### List Food Items
```bash
curl -X GET https://eat-wise-silk.vercel.app/api/foodItems/
```

### Add to Inventory
```bash
curl -X POST https://eat-wise-silk.vercel.app/api/userInventory/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "food_item": 1,
    "quantity": 3.0,
    "unit": "kg",
    "expiry_date": "2025-12-10"
  }'
```

---

## Additional Notes

- All dates are in ISO 8601 format: `YYYY-MM-DD`
- Decimal fields accept up to 2 decimal places
- The `user` field is automatically set from the authenticated user
- `purchase_date` and `consumption_date` are automatically set to the current date
- Use `-` prefix in `orderBy` for descending order (e.g., `-expirationTimeDays`)
