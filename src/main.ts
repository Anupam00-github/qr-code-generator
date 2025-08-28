/**
 * QR Code Generator by E4Dev
 * Advanced QR Code generator with branding support
 */
import qrcodegen from './qrcodegen';

// Types for better TypeScript support
interface QRGeneratorConfig {
  text: string;
  errorCorrection: qrcodegen.QrCode.Ecc;
  borderSize: number;
  qrSize: number;
  foregroundColor: string;
  backgroundColor: string;
  makeClickable: boolean;
  // Branding options
  brandLogo?: string; // base64 data URL
  logoSize: number;
  logoBackground: string;
  customLogoBg: string;
  brandText: string;
  textColor: string;
  textSize: string;
}

interface QRGeneratorElements {
  form: HTMLFormElement;
  inputText: HTMLTextAreaElement;
  errorCorrection: HTMLSelectElement;
  borderSize: HTMLInputElement;
  borderValue: HTMLSpanElement;
  qrSize: HTMLInputElement;
  sizeValue: HTMLSpanElement;
  makeClickable: HTMLInputElement;
  foregroundColor: HTMLInputElement;
  backgroundColor: HTMLInputElement;
  // Branding elements
  brandLogo: HTMLInputElement;
  logoSize: HTMLInputElement;
  logoSizeValue: HTMLSpanElement;
  logoBackground: HTMLSelectElement;
  customLogoBgGroup: HTMLDivElement;
  customLogoBg: HTMLInputElement;
  brandText: HTMLInputElement;
  textColor: HTMLInputElement;
  textSize: HTMLSelectElement;
  // UI elements
  generateBtn: HTMLButtonElement;
  qrResult: HTMLDivElement;
  downloadSvg: HTMLButtonElement;
  downloadPng: HTMLButtonElement;
  clickStatus: HTMLDivElement;
  clickStatusText: HTMLSpanElement;
  // Sharing elements
  createShareable: HTMLButtonElement;
  shareWhatsApp: HTMLButtonElement;
  shareResult: HTMLDivElement;
  shareUrl: HTMLInputElement;
  copyShareUrl: HTMLButtonElement;
}

class QRGenerator {
  private elements: QRGeneratorElements;
  private currentSvg: string = '';
  private currentConfig: QRGeneratorConfig | null = null;
  private logoImage: HTMLImageElement | null = null;
  private shareTemplate: string = '';

  constructor() {
    this.elements = this.getElements();
    this.loadShareTemplate();
    this.initializeEventListeners();
  }

  private async loadShareTemplate(): Promise<void> {
    try {
      const response = await fetch('./share-template.html');
      this.shareTemplate = await response.text();
    } catch (error) {
      console.error('Failed to load share template:', error);
      // Fallback template
      this.shareTemplate = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{{TITLE}}</title></head>
<body style="font-family: sans-serif; text-align: center; padding: 2rem; background: #f5f5f5;">
<div style="background: white; padding: 2rem; border-radius: 1rem; display: inline-block;">
<h1>{{TITLE}}</h1><div onclick="window.open('{{NORMALIZED_URL}}', '_blank')" style="cursor: pointer;">{{QR_SVG}}</div>
{{BRAND_TEXT}}<p>👆 Tap to open: {{TARGET_URL}}</p></div></body></html>`;
    }
  }

  private getElements(): QRGeneratorElements {
    const getElementById = <T extends HTMLElement>(id: string): T => {
      const element = document.getElementById(id) as T;
      if (!element) {
        throw new Error(`Element with id "${id}" not found`);
      }
      return element;
    };

    return {
      form: getElementById<HTMLFormElement>('qr-form'),
      inputText: getElementById<HTMLTextAreaElement>('input-text'),
      errorCorrection: getElementById<HTMLSelectElement>('error-correction'),
      borderSize: getElementById<HTMLInputElement>('border-size'),
      borderValue: getElementById<HTMLSpanElement>('border-value'),
      qrSize: getElementById<HTMLInputElement>('qr-size'),
      sizeValue: getElementById<HTMLSpanElement>('size-value'),
      makeClickable: getElementById<HTMLInputElement>('make-clickable'),
      foregroundColor: getElementById<HTMLInputElement>('foreground-color'),
      backgroundColor: getElementById<HTMLInputElement>('background-color'),
      // Branding elements
      brandLogo: getElementById<HTMLInputElement>('brand-logo'),
      logoSize: getElementById<HTMLInputElement>('logo-size'),
      logoSizeValue: getElementById<HTMLSpanElement>('logo-size-value'),
      logoBackground: getElementById<HTMLSelectElement>('logo-background'),
      customLogoBgGroup: getElementById<HTMLDivElement>('custom-logo-bg-group'),
      customLogoBg: getElementById<HTMLInputElement>('custom-logo-bg'),
      brandText: getElementById<HTMLInputElement>('brand-text'),
      textColor: getElementById<HTMLInputElement>('text-color'),
      textSize: getElementById<HTMLSelectElement>('text-size'),
      // UI elements
      generateBtn: getElementById<HTMLButtonElement>('generate-btn'),
      qrResult: getElementById<HTMLDivElement>('qr-result'),
      downloadSvg: getElementById<HTMLButtonElement>('download-svg'),
      downloadPng: getElementById<HTMLButtonElement>('download-png'),
      clickStatus: getElementById<HTMLDivElement>('click-status'),
      clickStatusText: getElementById<HTMLSpanElement>('click-status-text'),
      // Sharing elements
      createShareable: getElementById<HTMLButtonElement>('create-shareable'),
      shareWhatsApp: getElementById<HTMLButtonElement>('share-whatsapp'),
      shareResult: getElementById<HTMLDivElement>('share-result'),
      shareUrl: getElementById<HTMLInputElement>('share-url'),
      copyShareUrl: getElementById<HTMLButtonElement>('copy-share-url'),
    };
  }

  private initializeEventListeners(): void {
    // Form submission
    this.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.generateQRCode();
    });

    // Border size slider
    this.elements.borderSize.addEventListener('input', () => {
      this.elements.borderValue.textContent = this.elements.borderSize.value;
    });

    // QR size slider
    this.elements.qrSize.addEventListener('input', () => {
      this.elements.sizeValue.textContent = this.elements.qrSize.value;
    });

    // Logo size slider
    this.elements.logoSize.addEventListener('input', () => {
      this.elements.logoSizeValue.textContent = this.elements.logoSize.value + '%';
    });

    // Logo background selection
    this.elements.logoBackground.addEventListener('change', () => {
      const isCustom = this.elements.logoBackground.value === 'custom';
      this.elements.customLogoBgGroup.style.display = isCustom ? 'block' : 'none';
    });

    // Logo file upload
    this.elements.brandLogo.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.loadLogoImage(file);
      }
    });

    // Clickable checkbox
    this.elements.makeClickable.addEventListener('change', () => {
      if (this.elements.inputText.value.trim()) {
        this.generateQRCode();
      }
    });

    // Download buttons
    this.elements.downloadSvg.addEventListener('click', () => {
      this.downloadSvg();
    });

    this.elements.downloadPng.addEventListener('click', () => {
      this.downloadPng();
    });

    // Sharing buttons
    this.elements.createShareable.addEventListener('click', () => {
      this.createShareablePage();
    });

    this.elements.shareWhatsApp.addEventListener('click', () => {
      this.shareOnWhatsApp();
    });

    this.elements.copyShareUrl.addEventListener('click', () => {
      this.copyShareUrl();
    });

    // Real-time generation on input change (debounced)
    let debounceTimer: number;
    const debounceGenerate = () => {
      clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        if (this.elements.inputText.value.trim()) {
          this.generateQRCode();
        }
      }, 500);
    };

    this.elements.inputText.addEventListener('input', debounceGenerate);
    this.elements.errorCorrection.addEventListener('change', debounceGenerate);
    this.elements.borderSize.addEventListener('input', debounceGenerate);
    this.elements.qrSize.addEventListener('input', debounceGenerate);
    this.elements.foregroundColor.addEventListener('change', debounceGenerate);
    this.elements.backgroundColor.addEventListener('change', debounceGenerate);
    // Branding event listeners
    this.elements.logoSize.addEventListener('input', debounceGenerate);
    this.elements.logoBackground.addEventListener('change', debounceGenerate);
    this.elements.customLogoBg.addEventListener('change', debounceGenerate);
    this.elements.brandText.addEventListener('input', debounceGenerate);
    this.elements.textColor.addEventListener('change', debounceGenerate);
    this.elements.textSize.addEventListener('change', debounceGenerate);
  }

  private loadLogoImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.logoImage = img;
        // Generate QR code with new logo
        if (this.elements.inputText.value.trim()) {
          this.generateQRCode();
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private getErrorCorrectionLevel(): qrcodegen.QrCode.Ecc {
    const level = this.elements.errorCorrection.value;
    switch (level) {
      case 'LOW':
        return qrcodegen.QrCode.Ecc.LOW;
      case 'MEDIUM':
        return qrcodegen.QrCode.Ecc.MEDIUM;
      case 'QUARTILE':
        return qrcodegen.QrCode.Ecc.QUARTILE;
      case 'HIGH':
        return qrcodegen.QrCode.Ecc.HIGH;
      default:
        return qrcodegen.QrCode.Ecc.MEDIUM;
    }
  }

  private isUrl(text: string): boolean {
    try {
      new URL(text);
      return true;
    } catch {
      // Check for common URL patterns without protocol
      const urlPattern = /^(www\.|[a-zA-Z0-9-]+\.)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/;
      return urlPattern.test(text);
    }
  }

  private normalizeUrl(text: string): string {
    try {
      new URL(text);
      return text;
    } catch {
      // Add https:// if it looks like a URL but missing protocol
      if (this.isUrl(text)) {
        return `https://${text}`;
      }
      return text;
    }
  }

  private generateQRCode(): void {
    const text = this.elements.inputText.value.trim();
    
    if (!text) {
      this.showError('Please enter some text to generate a QR code');
      return;
    }

    try {
      this.setLoading(true);

      const config: QRGeneratorConfig = {
        text,
        errorCorrection: this.getErrorCorrectionLevel(),
        borderSize: parseInt(this.elements.borderSize.value),
        qrSize: parseInt(this.elements.qrSize.value),
        foregroundColor: this.elements.foregroundColor.value,
        backgroundColor: this.elements.backgroundColor.value,
        makeClickable: this.elements.makeClickable.checked,
        // Branding options
        brandLogo: this.logoImage?.src,
        logoSize: parseInt(this.elements.logoSize.value),
        logoBackground: this.elements.logoBackground.value,
        customLogoBg: this.elements.customLogoBg.value,
        brandText: this.elements.brandText.value.trim(),
        textColor: this.elements.textColor.value,
        textSize: this.elements.textSize.value,
      };

      // Generate QR code using the QR library
      const qr = qrcodegen.QrCode.encodeText(text, config.errorCorrection);
      
      // Convert to SVG with branding
      const svg = this.toSvgStringWithBranding(qr, config);
      
      // Display the QR code
      this.displayQRCode(svg, config);
      
      // Store current state
      this.currentSvg = svg;
      this.currentConfig = config;
      
      // Enable download buttons
      this.elements.downloadSvg.disabled = false;
      this.elements.downloadPng.disabled = false;
      this.elements.createShareable.disabled = false;

      // Hide previous share result
      this.elements.shareResult.style.display = 'none';

    } catch (error) {
      console.error('Error generating QR code:', error);
      this.showError('Failed to generate QR code. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  private toSvgStringWithBranding(qr: qrcodegen.QrCode, config: QRGeneratorConfig): string {
    if (config.borderSize < 0) throw new RangeError('Border must be non-negative');
    if (config.qrSize <= 0) throw new RangeError('Size multiplier must be positive');
    
    const size = qr.size;
    const scaledBorder = config.borderSize * config.qrSize;
    const totalSize = size * config.qrSize + scaledBorder * 2;
    
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" stroke="none">
  <rect width="100%" height="100%" fill="${config.backgroundColor}"/>
  <path d="`;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (qr.getModule(x, y)) {
          const px = x * config.qrSize + scaledBorder;
          const py = y * config.qrSize + scaledBorder;
          svg += `M${px},${py}h${config.qrSize}v${config.qrSize}h-${config.qrSize}z`;
        }
      }
    }
    
    svg += `" fill="${config.foregroundColor}"/>`;

    // Add logo if present
    if (this.logoImage && config.brandLogo) {
      const logoSizePixels = (totalSize * config.logoSize) / 100;
      const logoX = (totalSize - logoSizePixels) / 2;
      const logoY = (totalSize - logoSizePixels) / 2;

      // Add logo background if specified
      if (config.logoBackground !== 'none') {
        const bgColor = config.logoBackground === 'custom' ? config.customLogoBg : '#ffffff';
        const padding = logoSizePixels * 0.1; // 10% padding
        svg += `
  <rect x="${logoX - padding}" y="${logoY - padding}" width="${logoSizePixels + padding * 2}" height="${logoSizePixels + padding * 2}" fill="${bgColor}" rx="${padding}"/>`;
      }

      // Add logo image
      svg += `
  <image x="${logoX}" y="${logoY}" width="${logoSizePixels}" height="${logoSizePixels}" href="${config.brandLogo}"/>`;
    }

    svg += `
</svg>`;

    return svg;
  }

  private displayQRCode(svg: string, config: QRGeneratorConfig): void {
    // Clear previous content
    this.elements.qrResult.innerHTML = '';
    
    // Create container for QR code and branding
    const container = document.createElement('div');
    container.className = config.brandText ? 'with-branding' : '';
    
    // Create QR code wrapper
    const qrWrapper = document.createElement('div');
    qrWrapper.innerHTML = svg;
    
    // Make clickable if enabled and content is a URL
    if (config.makeClickable && this.isUrl(config.text)) {
      qrWrapper.className = 'qr-clickable';
      qrWrapper.style.cursor = 'pointer';
      qrWrapper.setAttribute('role', 'button');
      qrWrapper.setAttribute('tabindex', '0');
      qrWrapper.setAttribute('aria-label', `Click to open ${config.text}`);
      
      const handleClick = (e: Event) => {
        e.preventDefault();
        const url = this.normalizeUrl(config.text);
        window.open(url, '_blank', 'noopener,noreferrer');
        this.showClickFeedback();
      };

      qrWrapper.addEventListener('click', handleClick);
      qrWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      });

      // Show clickable status
      this.updateClickStatus(true, config.text);
    } else {
      // Show non-clickable status if checkbox is checked but content is not URL
      if (config.makeClickable && !this.isUrl(config.text)) {
        this.updateClickStatus(false, 'Content is not a URL');
      } else {
        this.elements.clickStatus.style.display = 'none';
      }
    }
    
    container.appendChild(qrWrapper);
    
    // Add brand text if present
    if (config.brandText) {
      const textElement = document.createElement('div');
      textElement.className = `brand-text ${config.textSize}`;
      textElement.style.color = config.textColor;
      textElement.textContent = config.brandText;
      container.appendChild(textElement);
    }
    
    this.elements.qrResult.appendChild(container);
    
    // Add accessibility attributes to SVG
    const svgElement = this.elements.qrResult.querySelector('svg');
    if (svgElement) {
      svgElement.setAttribute('role', 'img');
      svgElement.setAttribute('aria-label', `QR code for: ${this.elements.inputText.value.substring(0, 100)}${this.elements.inputText.value.length > 100 ? '...' : ''}`);
    }
  }

  private updateClickStatus(isClickable: boolean, text: string): void {
    if (isClickable) {
      this.elements.clickStatusText.textContent = `QR code is clickable - opens ${text}`;
      this.elements.clickStatus.style.display = 'block';
    } else {
      this.elements.clickStatusText.textContent = text;
      this.elements.clickStatus.style.display = 'block';
    }
  }

  private showClickFeedback(): void {
    const feedback = document.createElement('div');
    feedback.className = 'click-feedback';
    feedback.textContent = '✅ Opening link...';
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 2000);
  }

  private createShareablePage(): void {
    if (!this.currentConfig || !this.currentSvg) return;

    const config = this.currentConfig;
    const isUrl = this.isUrl(config.text);
    
    if (!isUrl) {
      alert('Shareable pages work best with URLs. Your QR code will still be shareable but not clickable.');
    }

    // Create the shareable HTML content
    let html = this.shareTemplate;
    
    // Replace placeholders
    const title = config.brandText || 'QR Code';
    const subtitle = isUrl ? 'Tap the QR code to open instantly!' : 'Scan or share this QR code';
    const normalizedUrl = isUrl ? this.normalizeUrl(config.text) : config.text;
    
    let brandTextHtml = '';
    if (config.brandText) {
      brandTextHtml = `<div class="brand-text ${config.textSize}" style="color: ${config.textColor};">${config.brandText}</div>`;
    }
    
    html = html
      .replace(/\{\{TITLE\}\}/g, title)
      .replace(/\{\{SUBTITLE\}\}/g, subtitle)
      .replace(/\{\{QR_SVG\}\}/g, this.currentSvg)
      .replace(/\{\{BRAND_TEXT\}\}/g, brandTextHtml)
      .replace(/\{\{TARGET_URL\}\}/g, config.text)
      .replace(/\{\{NORMALIZED_URL\}\}/g, normalizedUrl);

    // Create a data URL for the shareable page
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Show the shareable URL
    this.elements.shareUrl.value = url;
    this.elements.shareResult.style.display = 'block';
    
    // Show WhatsApp button if it's a URL
    if (isUrl) {
      this.elements.shareWhatsApp.style.display = 'inline-block';
      this.elements.shareWhatsApp.disabled = false;
    }
  }

  private shareOnWhatsApp(): void {
    const shareUrl = this.elements.shareUrl.value;
    if (!shareUrl) return;
    
    const message = `Check out this QR code: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  private async copyShareUrl(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.elements.shareUrl.value);
      
      // Show success feedback
      const originalText = this.elements.copyShareUrl.textContent;
      this.elements.copyShareUrl.classList.add('copy-success');
      this.elements.copyShareUrl.textContent = 'Copied!';
      
      setTimeout(() => {
        this.elements.copyShareUrl.classList.remove('copy-success');
        this.elements.copyShareUrl.textContent = originalText;
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      this.elements.shareUrl.select();
      document.execCommand('copy');
      alert('Link copied to clipboard!');
    }
  }

  private showError(message: string): void {
    this.elements.qrResult.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem;">
        <p><strong>Error:</strong> ${message}</p>
      </div>
    `;
    
    // Disable download buttons
    this.elements.downloadSvg.disabled = true;
    this.elements.downloadPng.disabled = true;
    this.elements.createShareable.disabled = true;
    this.elements.clickStatus.style.display = 'none';
    this.elements.shareResult.style.display = 'none';
  }

  private setLoading(loading: boolean): void {
    this.elements.generateBtn.disabled = loading;
    this.elements.form.classList.toggle('loading', loading);
    
    if (loading) {
      this.elements.generateBtn.textContent = 'Generating...';
    } else {
      this.elements.generateBtn.textContent = 'Generate QR Code';
    }
  }

  private downloadSvg(): void {
    if (!this.currentSvg || !this.currentConfig) return;

    const blob = new Blob([this.currentSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const filename = this.currentConfig.brandText 
      ? `qr-code-${this.currentConfig.brandText.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${this.getTimestamp()}.svg`
      : `qr-code-${this.getTimestamp()}.svg`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  private downloadPng(): void {
    if (!this.currentSvg || !this.currentConfig) return;

    // Create a canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([this.currentSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Get the natural dimensions from the SVG
      const naturalWidth = img.naturalWidth || img.width;
      const naturalHeight = img.naturalHeight || img.height;
      
      // If dimensions are still 0, fall back to calculating from QR code size
      let width = naturalWidth;
      let height = naturalHeight;
      
      if (width === 0 || height === 0) {
        // Calculate size from QR code dimensions
        if (this.currentConfig) {
          const qr = qrcodegen.QrCode.encodeText(this.currentConfig.text, this.currentConfig.errorCorrection);
          const scaledBorder = this.currentConfig.borderSize * this.currentConfig.qrSize;
          const totalSize = qr.size * this.currentConfig.qrSize + scaledBorder * 2;
          width = height = totalSize; // Use actual calculated size
        } else {
          width = height = 200; // fallback size
        }
      }
      
      // Set canvas size (high resolution for crisp output)
      const scale = 4;
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      // Scale the context and ensure high quality rendering
      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = false; // Keep sharp edges for QR codes
      
      // Fill background (in case SVG is transparent)
      ctx.fillStyle = this.currentConfig?.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      // Draw the image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const filename = this.currentConfig?.brandText 
            ? `qr-code-${this.currentConfig.brandText.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${this.getTimestamp()}.png`
            : `qr-code-${this.getTimestamp()}.png`;
          link.href = pngUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(pngUrl);
        }
      }, 'image/png');
      
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      console.error('Failed to load SVG for PNG conversion');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }

  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').substring(0, 19);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new QRGenerator();
});

// Handle any unhandled errors
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
