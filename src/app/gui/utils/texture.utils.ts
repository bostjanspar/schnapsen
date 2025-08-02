import * as THREE from 'three';

export class TextureUtils {
  static createTextTexture(text: string, options: any): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    const {
      width = 256,
      height = 128,
      font = '48px Arial',
      fillStyle = 'white',
      textAlign = 'center',
      textBaseline = 'middle',
      backgroundColor = 'transparent',
    } = options;

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;

    if (backgroundColor !== 'transparent') {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.font = font;
    context.fillStyle = fillStyle;
    context.textAlign = textAlign as CanvasTextAlign;
    context.textBaseline = textBaseline as CanvasTextBaseline;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  static createTextTextureLabel(text: string, options: any): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    const {
      width = 256,
      font = '48px Arial',
      fillStyle = 'white',
      textAlign = 'center',
      textBaseline = 'middle',
      backgroundColor = 'transparent',
      padding = 20, // Padding around text
      lineHeight = 1.2, // Line height multiplier
    } = options;

    // Create temporary canvas to measure text
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d')!;
    tempContext.font = font;

    // Split text into lines that fit within the width
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxLineWidth = width - (padding * 2);

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = tempContext.measureText(testLine);
      
      if (metrics.width > maxLineWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    // Calculate font size from font string
    const fontSizeMatch = font.match(/(\d+)px/);
    const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : 48;
    
    // Calculate required height
    const lineSpacing = fontSize * lineHeight;
    const textHeight = lines.length * lineSpacing;
    const height = Math.ceil(textHeight + (padding * 2));

    // Set up the actual canvas
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;

    // Fill background if specified
    if (backgroundColor !== 'transparent') {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Set up text styling
    context.font = font;
    context.fillStyle = fillStyle;
    context.textAlign = textAlign as CanvasTextAlign;
    context.textBaseline = 'top'; // Use 'top' for precise positioning

    // Calculate starting Y position to center text vertically
    const totalTextHeight = (lines.length - 1) * lineSpacing + fontSize;
    const startY = (height - totalTextHeight) / 2;

    // Draw each line
    lines.forEach((line, index) => {
      const x = textAlign === 'center' ? width / 2 : 
                textAlign === 'right' ? width - padding : padding;
      const y = startY + (index * lineSpacing);
      
      context.fillText(line, x, y);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  static createGradientTexture(colors: string[], direction: string): THREE.CanvasTexture {
    // Implementation will go here
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }

  static createPatternTexture(pattern: any, size: number): THREE.CanvasTexture {
    // Implementation will go here
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }

  static createCardBackTexture(design: string, colors: string[]): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 356;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(0, 0, 256, 356);
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCHNAPSEN', 128, 180);
    return  new THREE.CanvasTexture(canvas);

  }
}
