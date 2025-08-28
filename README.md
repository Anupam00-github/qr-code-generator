# QR Code Generator

A modern, accessible QR Code generator built with TypeScript and Nayuki's QR Code Generator library.

## Features

- 🎨 **Customizable Design**: Change colors, border size, and error correction levels
- 📱 **Responsive UI**: Works seamlessly on desktop and mobile devices
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- ⚡ **Real-time Generation**: QR codes update as you type
- 💾 **Multiple Export Formats**: Download as SVG or high-resolution PNG
- 🔒 **Client-side Only**: All processing happens in your browser for privacy

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Usage

1. Enter any text, URL, or data in the input field
2. Customize the QR code appearance:
   - **Error Correction**: Choose from Low, Medium, Quartile, or High
   - **Border Size**: Adjust white space around the QR code
   - **Colors**: Set custom foreground and background colors
3. The QR code generates automatically as you type
4. Download your QR code as SVG or PNG

## Error Correction Levels

- **Low (~7%)**: Can recover from up to 7% damage
- **Medium (~15%)**: Can recover from up to 15% damage (recommended)
- **Quartile (~25%)**: Can recover from up to 25% damage
- **High (~30%)**: Can recover from up to 30% damage

Higher error correction levels create more complex QR codes but provide better damage resistance.

## Technology Stack

- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Fast build tool and development server
- **Nayuki QR Code Generator**: High-quality, well-tested QR code library
- **Modern CSS**: Responsive design with CSS Grid and Flexbox
- **Web Standards**: Uses modern browser APIs for file downloads

## Browser Support

This application works in all modern browsers that support:
- ES2020 features
- Canvas API (for PNG export)
- Blob API (for file downloads)
- CSS Grid and Flexbox

## Development

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── index.html      # Main HTML file
├── main.ts         # TypeScript application logic
└── styles.css      # CSS styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [Nayuki](https://www.nayuki.io/) for the excellent QR Code Generator library
- Modern web standards for making this possible without heavy frameworks

## Branding Features

### Logo Integration
- **Upload Brand Logo**: Add your company logo to the center of QR codes
- **Logo Size Control**: Adjust logo size from 5% to 30% of QR code size
- **Logo Background Options**: 
  - Transparent (no background)
  - White background (recommended for readability)
  - Custom color background

### Brand Text
- **Custom Text**: Add your brand name or message below the QR code
- **Text Styling**: Choose from small, medium, or large text sizes
- **Color Customization**: Set custom text colors to match your brand

### Smart Branding
- **Error Correction**: Higher error correction levels (Quartile/High) recommended when using logos
- **Automatic Sizing**: Logo and text scale proportionally with QR code size
- **File Naming**: Downloaded files automatically include brand name when specified

### Best Practices
- Keep logos simple and high-contrast for best scanning results
- Use High error correction when adding logos to ensure QR codes remain scannable
- Test QR codes with your target scanning devices after adding branding
- Logos larger than 25% may impact scannability

### Supported Logo Formats
- PNG (recommended for logos with transparency)
- JPG/JPEG
- SVG
- GIF
- WebP

## Clickable QR Codes

### Interactive QR Codes
- **Smart Detection**: Automatically detects if QR content is a URL
- **Touch-Friendly**: Optimized for mobile devices and tablets  
- **One-Tap Access**: Users can tap/click QR codes directly instead of scanning
- **Visual Feedback**: Hover effects and click animations provide clear user feedback

### How It Works
1. **Enable Feature**: Check "Make QR Code Clickable" option
2. **URL Detection**: System automatically detects if your content is a valid URL
3. **Visual Cues**: Clickable QR codes show hover effects and cursor changes
4. **Direct Action**: Clicking opens the URL in a new tab/window

### Supported URL Formats
- Full URLs: `https://example.com`
- HTTP URLs: `http://example.com`  
- Domain-only: `example.com` (automatically adds https://)
- Subdomains: `www.example.com`, `blog.example.com`

### Device Compatibility
- **Desktop**: Hover effects and click functionality
- **Mobile/Tablet**: Touch-optimized with tap feedback
- **Accessibility**: Full keyboard navigation support (Enter/Space keys)
- **Screen Readers**: Proper ARIA labels and role attributes

### Use Cases
- **Business Cards**: Direct links to websites or LinkedIn profiles
- **Marketing Materials**: Instant access to landing pages
- **Event Tickets**: Quick links to event information
- **Restaurant Menus**: Direct access to online menus
- **Social Media**: Links to profiles or specific posts

### Best Practices
- Use clear, short URLs for better user experience
- Test clickable functionality on target devices
- Consider using URL shorteners for long links
- Ensure URLs are accessible and mobile-friendly
- Higher error correction levels recommended for better reliability

### Security Features
- Opens links in new tab/window for security
- Uses `noopener,noreferrer` attributes to prevent security issues
- URL validation before opening
- Visual confirmation when links are opened
