# Token Expiration Handling - Implementation Guide

## 🚀 **IMPLEMENTED SOLUTION**

Your application now has **automatic token expiration handling** that will:
- ✅ Automatically detect expired tokens
- ✅ Show "Session expired" message to users  
- ✅ Redirect to login page automatically
- ✅ Handle 401 responses from API calls
- ✅ Validate tokens on app load and periodically

## 📋 **What's Changed**

### 1. **New API Helper (`/src/lib/api.ts`)**
```typescript
// Use these instead of fetch() for authenticated requests:
import { apiGet, apiPost, apiPut, apiDelete, APIError } from "@/lib/api";

// Examples:
const response = await apiGet('/admin/about/');
const response = await apiPost('/admin/contact/', contactData);
const response = await apiPut(`/admin/about/${id}`, aboutData);
```

### 2. **Enhanced useAuth Hook**
- Now automatically detects expired tokens on app load
- Periodically validates tokens (every 5 minutes)
- Shows session expired message when tokens expire
- Automatically logs out users with expired tokens

### 3. **Updated ContactEditor Example**
The ContactEditor component now uses the new API helper and will automatically handle token expiration.

## 🔧 **How to Update Your Components**

### Before (Old Way):
```typescript
const response = await fetch(`${API_URL}/admin/contact/`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  method: 'GET',
});

if (!response.ok) {
  // Manual error handling needed
  throw new Error('Request failed');
}
```

### After (New Way):
```typescript
import { apiGet, APIError } from "@/lib/api";

try {
  const response = await apiGet('/admin/contact/');
  const data = await response.json();
} catch (error) {
  if (error instanceof APIError && error.status === 401) {
    // Token expired - automatically handled by API helper
    return; 
  }
  // Handle other errors
}
```

## 📝 **Migration Steps for Other Components**

### Step 1: Add Import
```typescript
import { apiGet, apiPost, apiPut, apiDelete, APIError } from "@/lib/api";
```

### Step 2: Replace fetch() calls

**GET Requests:**
```typescript
// OLD:
const response = await fetch(`${API_URL}/endpoint`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// NEW:
const response = await apiGet('/endpoint');
```

**POST Requests:**
```typescript  
// OLD:
const response = await fetch(`${API_URL}/endpoint`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
});

// NEW:
const response = await apiPost('/endpoint', data);
```

### Step 3: Update Error Handling
```typescript
try {
  const response = await apiGet('/endpoint');
  const data = await response.json();
} catch (error) {
  if (error instanceof APIError) {
    if (error.status === 401) {
      // Token expired - handled automatically
      return;
    }
    if (error.status === 404) {
      // Handle not found
    }
    // Handle other API errors
  }
  // Handle network errors
}
```

## 🎯 **Components That Need Updates**

Based on the codebase, these components have manual token handling and should be updated:

1. **Dashboard.tsx** - Line 68
2. **AboutEditor.tsx** - Lines 51, 153, 174  
3. **NewsManager.tsx** - Lines 115, 192, 236, 288
4. **DeviceCard.tsx** - Lines 76, 109, 134
5. **DataForm.tsx** - Line 71
6. **HistoryModal.tsx** - Line 58
7. **DataHistoryModal.tsx** - Lines 59, 100, 131
8. **UserEditForm.tsx** - Line 91
9. **UserTable.tsx** - Line 169
10. **UserDeviceHistory.tsx** - Line 54
11. **LiveSessionManager.tsx** - Line 79

## ✨ **Benefits of New System**

1. **Better User Experience**: Users get clear messages when sessions expire
2. **Automatic Cleanup**: Invalid tokens are automatically removed
3. **Consistent Error Handling**: All 401 responses handled the same way
4. **Proactive Detection**: Tokens validated on app load and periodically
5. **Developer Friendly**: Simpler API calls with built-in error handling

## 🔍 **Testing the Solution**

### Test Session Expiration:
1. Log in to the application
2. Open browser dev tools → Application → Local Storage
3. Find the `token` key and modify it (add random characters)
4. Try to navigate to any authenticated page or make an API call
5. **Expected Result**: You should see "Session expired" message and be redirected to login

### Test Automatic Validation:
1. Log in with a valid token
2. Wait for the token to naturally expire (check token exp time)
3. **Expected Result**: App should automatically log you out within 5 minutes

## ⚙️ **Configuration Options**

### Change Token Check Interval:
In `useAuth.tsx`, modify this line:
```typescript
}, 5 * 60 * 1000); // Currently checks every 5 minutes
```

### Disable Automatic Token Validation:
For public endpoints that don't need authentication:
```typescript
const response = await apiGet('/public/contact/', { requiresAuth: false });
```

## 🚨 **Important Notes**

- **Existing Components**: Continue working as before, but without automatic token expiration handling
- **New Components**: Should use the new API helper for better user experience
- **Migration**: Can be done gradually - update components one at a time
- **Backward Compatible**: Old fetch() calls still work, just without automatic expiration handling

The solution is now fully implemented and ready to use! 🎉
