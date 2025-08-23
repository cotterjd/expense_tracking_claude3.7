# Budget Tracker PWA

A simple Progressive Web App (PWA) for tracking expenses and managing budgets.

## Features

- ✅ **Add Expenses**: Enter description and amount with category selection
- ✅ **Category Management**: Add, delete, and organize expense categories
- ✅ **Expense Tracking**: View all expenses grouped by category
- ✅ **Progressive Web App**: Installable on mobile devices and works offline
- ✅ **Local Storage**: All data is stored locally in your browser
- ✅ **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **Adding an Expense**:
   - Enter a description in the text input
   - Enter the amount in the number input
   - Click "Add Expense"
   - Select a category from the popup or create a new one

2. **Managing Categories**:
   - Categories are created automatically when you add expenses
   - You can add new categories in the category selection popup
   - Delete categories by clicking the "Delete" button (this removes all expenses in that category)

3. **Viewing Expenses**:
   - Click on any category card to see all expenses in that category
   - Expenses are shown with description, amount, and date

## Installation

### Local Development
1. Clone or download this repository
2. Open `index.html` in a web browser
3. Or serve it using a local web server:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

### Install as PWA
1. Open the app in a supported browser (Chrome, Firefox, Safari, Edge)
2. Look for the "Install" button in the address bar
3. Click to install the app on your device
4. The app will work offline after installation

## Technical Details

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Storage**: LocalStorage for data persistence
- **PWA Features**: Service Worker for offline functionality, Web App Manifest for installation
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required

## File Structure

```
budget-phi-claude4/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js              # JavaScript application logic
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker for offline functionality
├── icon-192x192.png    # PWA icon (192x192)
├── icon-512x512.png    # PWA icon (512x512)
└── README.md           # This file
```

## Browser Support

- Chrome 67+
- Firefox 76+
- Safari 13+
- Edge 79+

## Data Storage

All data is stored locally in your browser using LocalStorage. This means:
- ✅ Your data stays private (never sent to any server)
- ✅ Fast performance (no network requests)
- ⚠️ Data is tied to this browser/device
- ⚠️ Clearing browser data will remove all expenses

## Future Enhancements

Potential features for future versions:
- Export/Import data functionality
- Budget limits and notifications
- Expense search and filtering
- Charts and analytics
- Dark mode
- Multi-currency support
