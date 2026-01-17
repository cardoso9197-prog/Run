# Editable Location Names Feature

## Overview
After selecting a location on the map, passengers can now **edit and refine the location name** to add more specific details.

## Why This Is Useful

### Problem:
Even with GPS coordinates, reverse geocoding might give generic names like:
- "Bissau, Guinea-Bissau" (too vague)
- "11.8636, -15.5982" (just coordinates)
- "Unnamed Road" (no useful info)

### Solution:
Allow passengers to add **precise details** that help drivers find them:
- "Near the blue gate"
- "Behind the fish market"
- "Next to the big mango tree"
- "White house with red door"

## How It Works

### User Experience:

#### 1. Select Location on Map
```
User taps: "📌 Tap to select pickup on map"
Map opens → User taps location
Returns with: "Bairro de Bissau Velho, Bissau"
```

#### 2. Edit Location Name (NEW!)
```
Text field appears below location button:
┌─────────────────────────────────────────┐
│ Bairro de Bissau Velho, Bissau         │
│ [edit to add details]                   │
└─────────────────────────────────────────┘

User can type:
"Bairro de Bissau Velho - Near blue gate, white house"
```

#### 3. GPS Coordinates Preserved
```
What gets sent to backend:
{
  pickup_address: "Bairro de Bissau Velho - Near blue gate, white house",
  pickup_latitude: 11.8636,  ← STILL EXACT GPS
  pickup_longitude: -15.5982
}
```

### Visual Flow:
```
Book Ride Screen:

📍 Pickup Location
┌───────────────────────────────────────┐
│ 📌 Bairro de Bissau Velho, Bissau   │ ← Tap to change on map
└───────────────────────────────────────┘
┌───────────────────────────────────────┐
│ Bairro de Bissau Velho - Near blue   │ ← Edit for details
│ gate, white house                     │
└───────────────────────────────────────┘

🎯 Dropoff Location  
┌───────────────────────────────────────┐
│ 📌 Aeroporto Internacional            │ ← Tap to change on map
└───────────────────────────────────────┘
┌───────────────────────────────────────┐
│ Aeroporto Internacional - Main        │ ← Edit for details
│ entrance, arrivals area               │
└───────────────────────────────────────┘
```

## Benefits

### For Passengers:
✅ **Can add landmarks** - "Near the mosque"  
✅ **Can add colors** - "Green building"  
✅ **Can add directions** - "Behind the market, left side"  
✅ **Can add names** - "João's shop"  
✅ **Still precise** - GPS coordinates preserved  

### For Drivers:
✅ **More context** - Not just coordinates  
✅ **Visual landmarks** - Easier to find  
✅ **Exact location** - GPS + description  
✅ **Less confusion** - Clear instructions  

### For Guinea-Bissau:
✅ **Works with informal addresses** - "Near X landmark"  
✅ **Local knowledge** - People know local spots  
✅ **Flexible** - No rigid address format needed  

## Technical Implementation

### Code Changes:

**Before (just map selection):**
```javascript
{pickupLocation && (
  <Text>{pickupLocation.name}</Text>
)}
```

**After (map + editable text):**
```javascript
{pickupLocation && (
  <TextInput
    style={styles.locationEditInput}
    value={pickupLocation.name}
    onChangeText={(text) => 
      setPickupLocation({ ...pickupLocation, name: text })
    }
    placeholder="Edit pickup details (e.g., Near the blue gate)"
    multiline
  />
)}
```

### State Management:
```javascript
// Location object structure:
{
  name: "Bairro de Bissau Velho - Near blue gate",  // EDITABLE
  latitude: 11.8636,   // FIXED from map selection
  longitude: -15.5982  // FIXED from map selection
}

// When user edits text:
// - name changes
// - coordinates stay the same
// - GPS precision preserved
```

### Styling:
```javascript
locationEditInput: {
  borderWidth: 1,
  borderColor: '#DDD',
  borderRadius: 8,
  padding: 12,
  fontSize: 14,
  backgroundColor: '#FFF',
  marginBottom: 15,
  minHeight: 50,
  textAlignVertical: 'top',
  color: '#666',
  fontStyle: 'italic',  // Shows it's editable
}
```

## Real-World Examples

### Example 1: Home Pickup
**Map Selection:** "Rua de São Paulo, Bissau"  
**User Edits:** "Rua de São Paulo - Blue gate, big tree in front"  
**Driver Sees:** Clear description + exact GPS  

### Example 2: Market Dropoff
**Map Selection:** "Bandim Market, Bissau"  
**User Edits:** "Bandim Market - Main entrance, near vegetable section"  
**Driver Sees:** Specific spot within market + GPS  

### Example 3: Remote Village
**Map Selection:** "11.9234, -15.7821" (no address available)  
**User Edits:** "My village - Red house next to the well"  
**Driver Sees:** Useful description + exact coordinates  

### Example 4: Airport
**Map Selection:** "Aeroporto Internacional Osvaldo Vieira"  
**User Edits:** "Airport - Departures area, Terminal 1"  
**Driver Sees:** Which entrance + GPS  

## User Instructions

### How to Use:

1. **Tap** the green location button to open map
2. **Select** your location by tapping on the map
3. **Review** the location name that appears
4. **Tap** the text field below to edit
5. **Add details** like:
   - Landmarks nearby
   - Colors of buildings
   - Specific features
   - Directions from main road
6. **Keep it short** - Driver needs to read quickly
7. **Book** your ride!

### Tips for Good Descriptions:

✅ **Good Examples:**
- "Near the blue gate"
- "Behind fish market, left side"
- "White house with red door"
- "Next to the big mango tree"
- "Main entrance, by the flag"

❌ **Avoid:**
- Very long descriptions (keep under 50 words)
- Unclear references ("where we met last time")
- Just copying the map name (add value!)
- Coordinates only (use the description!)

## Best Practices for Guinea-Bissau

### Common Landmarks to Reference:
- Markets (mercado)
- Mosques
- Churches
- Schools
- Government buildings
- Large trees
- Water wells
- Main roads
- Beaches
- Distinctive colored buildings

### Local Context:
- Many areas don't have street names
- Neighborhoods (bairros) are well-known
- Landmarks are primary navigation
- Colors of buildings matter
- Gate colors/styles matter
- Trees and natural features used

### Language:
- Works in Portuguese
- Works in Crioulo
- Can mix languages
- Visual descriptions work best
- No strict format required

## Technical Notes

### Data Flow:
```
1. Map Selection:
   {name: "Bissau", lat: 11.8636, lng: -15.5982}

2. User Edits Name:
   {name: "Bissau - Near blue gate", lat: 11.8636, lng: -15.5982}

3. Backend Receives:
   pickup_address: "Bissau - Near blue gate"
   pickup_latitude: 11.8636
   pickup_longitude: -15.5982

4. Driver Sees:
   - Map with pin at exact GPS location
   - Description: "Bissau - Near blue gate"
```

### Advantages:
- **Multiline** - Can add detailed description
- **Flexible** - No character limit (reasonable)
- **Optional** - Can leave as-is if geocoded name is good
- **Preserved GPS** - Editing text doesn't affect coordinates
- **Instant update** - No need to save separately

## Testing

### Test Cases:

1. **Select and Keep**
   - Select location on map
   - Don't edit text
   - Book ride
   - Verify: Original name sent

2. **Select and Edit**
   - Select location on map
   - Edit to add details
   - Book ride
   - Verify: Edited name sent, GPS preserved

3. **Long Description**
   - Select location
   - Type long description
   - Verify: Multiline works, scrollable

4. **Special Characters**
   - Add accents, emoji, punctuation
   - Verify: All characters preserved

5. **Change Selection**
   - Select pickup on map
   - Edit text
   - Change pickup on map again
   - Verify: Old edits cleared, new name shown

## Future Enhancements

### Phase 2:
- **Save common locations** - "Home", "Work"
- **Location history** - Quick re-use
- **Suggested details** - AI-powered suggestions
- **Voice input** - Speak the details
- **Photo attach** - Take photo of landmark
- **Share location** - Send to driver via WhatsApp

## Summary

✅ **Map gives precision** (GPS coordinates)  
✅ **Text gives context** (human-readable details)  
✅ **Best of both** (exact + descriptive)  
✅ **Perfect for Guinea-Bissau** (works without formal addresses)  

This feature makes location selection both **precise and practical**!
