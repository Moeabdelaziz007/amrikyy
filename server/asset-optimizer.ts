// تحسين الصور والأصول
import sharp from 'sharp';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  progressive?: boolean;
}

export interface AssetOptimizationOptions {
  minify?: boolean;
  compress?: boolean;
  generateSourceMap?: boolean;
}

export class ImageOptimizer {
  private static cache = new Map<string, Buffer>();

  // تحسين صورة واحدة
  static async optimizeImage(
    inputPath: string,
    outputPath: string,
    options: ImageOptimizationOptions = {}
  ): Promise<void> {
    const {
      width = 800,
      height = 600,
      quality = 80,
      format = 'webp',
      progressive = true,
    } = options;

    try {
      let pipeline = sharp(inputPath);

      // تغيير الحجم
      if (width && height) {
        pipeline = pipeline.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // تحسين الجودة والتنسيق
      switch (format) {
        case 'jpeg':
          pipeline = pipeline.jpeg({
            quality,
            progressive,
            mozjpeg: true,
          });
          break;
        case 'png':
          pipeline = pipeline.png({
            quality,
            progressive,
            compressionLevel: 9,
          });
          break;
        case 'webp':
          pipeline = pipeline.webp({
            quality,
            effort: 6,
          });
          break;
        case 'avif':
          pipeline = pipeline.avif({
            quality,
            effort: 9,
          });
          break;
      }

      await pipeline.toFile(outputPath);
    } catch (error) {
      console.error('Error optimizing image:', error);
      throw error;
    }
  }

  // تحسين صورة متعددة الأحجام
  static async optimizeImageMultipleSizes(
    inputPath: string,
    outputDir: string,
    sizes: Array<{ width: number; height: number; suffix: string }>
  ): Promise<void> {
    const promises = sizes.map(async ({ width, height, suffix }) => {
      const outputPath = path.join(
        outputDir,
        `${path.basename(inputPath, path.extname(inputPath))}-${suffix}.webp`
      );
      
      await this.optimizeImage(inputPath, outputPath, {
        width,
        height,
        format: 'webp',
        quality: 85,
      });
    });

    await Promise.all(promises);
  }

  // تحسين صورة مع التخزين المؤقت
  static async optimizeImageCached(
    inputPath: string,
    outputPath: string,
    options: ImageOptimizationOptions = {}
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(inputPath, options);
    
    if (this.cache.has(cacheKey)) {
      const cachedBuffer = this.cache.get(cacheKey)!;
      await fs.writeFile(outputPath, cachedBuffer);
      return;
    }

    await this.optimizeImage(inputPath, outputPath, options);
    
    // تخزين في التخزين المؤقت
    const optimizedBuffer = await fs.readFile(outputPath);
    this.cache.set(cacheKey, optimizedBuffer);
  }

  // إنشاء مفتاح التخزين المؤقت
  private static generateCacheKey(inputPath: string, options: ImageOptimizationOptions): string {
    const optionsString = JSON.stringify(options);
    const hash = createHash('md5').update(`${inputPath}:${optionsString}`).digest('hex');
    return hash;
  }

  // تحسين صورة متدرجة
  static async optimizeImageProgressive(
    inputPath: string,
    outputPath: string,
    options: ImageOptimizationOptions = {}
  ): Promise<void> {
    const {
      width = 800,
      height = 600,
      quality = 80,
      format = 'jpeg',
    } = options;

    try {
      let pipeline = sharp(inputPath);

      // تغيير الحجم
      if (width && height) {
        pipeline = pipeline.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // تحسين متدرج
      if (format === 'jpeg') {
        pipeline = pipeline.jpeg({
          quality,
          progressive: true,
          mozjpeg: true,
        });
      } else if (format === 'png') {
        pipeline = pipeline.png({
          quality,
          progressive: true,
          compressionLevel: 9,
        });
      }

      await pipeline.toFile(outputPath);
    } catch (error) {
      console.error('Error optimizing progressive image:', error);
      throw error;
    }
  }

  // تحسين صورة مع إضافة علامة مائية
  static async optimizeImageWithWatermark(
    inputPath: string,
    outputPath: string,
    watermarkPath: string,
    options: ImageOptimizationOptions = {}
  ): Promise<void> {
    const {
      width = 800,
      height = 600,
      quality = 80,
      format = 'webp',
    } = options;

    try {
      let pipeline = sharp(inputPath);

      // تغيير الحجم
      if (width && height) {
        pipeline = pipeline.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // إضافة علامة مائية
      const watermark = await sharp(watermarkPath)
        .resize(100, 100)
        .png()
        .toBuffer();

      pipeline = pipeline.composite([
        {
          input: watermark,
          gravity: 'southeast',
          blend: 'over',
        },
      ]);

      // تحسين الجودة
      if (format === 'webp') {
        pipeline = pipeline.webp({ quality });
      } else if (format === 'jpeg') {
        pipeline = pipeline.jpeg({ quality });
      }

      await pipeline.toFile(outputPath);
    } catch (error) {
      console.error('Error optimizing image with watermark:', error);
      throw error;
    }
  }
}

export class AssetOptimizer {
  // تحسين ملف CSS
  static async optimizeCSS(inputPath: string, outputPath: string): Promise<void> {
    try {
      const css = await fs.readFile(inputPath, 'utf8');
      
      // إزالة التعليقات والمسافات الزائدة
      const optimizedCSS = css
        .replace(/\/\*[\s\S]*?\*\//g, '') // إزالة التعليقات
        .replace(/\s+/g, ' ') // ضغط المسافات
        .replace(/;\s*}/g, '}') // إزالة الفاصلة المنقوطة قبل الأقواس
        .replace(/\s*{\s*/g, '{') // ضغط الأقواس
        .replace(/\s*}\s*/g, '}') // ضغط الأقواس
        .replace(/\s*;\s*/g, ';') // ضغط الفواصل المنقوطة
        .trim();

      await fs.writeFile(outputPath, optimizedCSS);
    } catch (error) {
      console.error('Error optimizing CSS:', error);
      throw error;
    }
  }

  // تحسين ملف JavaScript
  static async optimizeJS(inputPath: string, outputPath: string): Promise<void> {
    try {
      const js = await fs.readFile(inputPath, 'utf8');
      
      // إزالة التعليقات والمسافات الزائدة
      const optimizedJS = js
        .replace(/\/\*[\s\S]*?\*\//g, '') // إزالة التعليقات متعددة الأسطر
        .replace(/\/\/.*$/gm, '') // إزالة التعليقات أحادية السطر
        .replace(/\s+/g, ' ') // ضغط المسافات
        .replace(/\s*{\s*/g, '{') // ضغط الأقواس
        .replace(/\s*}\s*/g, '}') // ضغط الأقواس
        .replace(/\s*;\s*/g, ';') // ضغط الفواصل المنقوطة
        .trim();

      await fs.writeFile(outputPath, optimizedJS);
    } catch (error) {
      console.error('Error optimizing JavaScript:', error);
      throw error;
    }
  }

  // تحسين ملف HTML
  static async optimizeHTML(inputPath: string, outputPath: string): Promise<void> {
    try {
      const html = await fs.readFile(inputPath, 'utf8');
      
      // إزالة المسافات الزائدة والتحسين
      const optimizedHTML = html
        .replace(/\s+/g, ' ') // ضغط المسافات
        .replace(/>\s+</g, '><') // إزالة المسافات بين العلامات
        .replace(/\s*=\s*/g, '=') // ضغط علامات المساواة
        .trim();

      await fs.writeFile(outputPath, optimizedHTML);
    } catch (error) {
      console.error('Error optimizing HTML:', error);
      throw error;
    }
  }

  // تحسين ملف JSON
  static async optimizeJSON(inputPath: string, outputPath: string): Promise<void> {
    try {
      const json = await fs.readFile(inputPath, 'utf8');
      const parsed = JSON.parse(json);
      const optimizedJSON = JSON.stringify(parsed);
      
      await fs.writeFile(outputPath, optimizedJSON);
    } catch (error) {
      console.error('Error optimizing JSON:', error);
      throw error;
    }
  }

  // تحسين جميع الأصول في مجلد
  static async optimizeAssetsInDirectory(
    inputDir: string,
    outputDir: string,
    options: AssetOptimizationOptions = {}
  ): Promise<void> {
    const files = await fs.readdir(inputDir);
    
    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      
      const ext = path.extname(file).toLowerCase();
      
      try {
        switch (ext) {
          case '.css':
            await this.optimizeCSS(inputPath, outputPath);
            break;
          case '.js':
            await this.optimizeJS(inputPath, outputPath);
            break;
          case '.html':
            await this.optimizeHTML(inputPath, outputPath);
            break;
          case '.json':
            await this.optimizeJSON(inputPath, outputPath);
            break;
          default:
            // نسخ الملفات الأخرى كما هي
            await fs.copyFile(inputPath, outputPath);
        }
      } catch (error) {
        console.error(`Error optimizing ${file}:`, error);
      }
    }
  }
}

export class FontOptimizer {
  // تحسين الخطوط
  static async optimizeFonts(inputDir: string, outputDir: string): Promise<void> {
    const files = await fs.readdir(inputDir);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      
      if (['.woff', '.woff2', '.ttf', '.otf'].includes(ext)) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);
        
        try {
          // نسخ الخطوط المحسنة
          await fs.copyFile(inputPath, outputPath);
        } catch (error) {
          console.error(`Error optimizing font ${file}:`, error);
        }
      }
    }
  }
}

// نظام تحسين الأصول الشامل
export class AssetOptimizationManager {
  // تحسين جميع الأصول
  static async optimizeAllAssets(
    inputDir: string,
    outputDir: string,
    options: {
      images?: ImageOptimizationOptions;
      assets?: AssetOptimizationOptions;
    } = {}
  ): Promise<void> {
    try {
      // إنشاء مجلد الإخراج
      await fs.mkdir(outputDir, { recursive: true });

      // تحسين الصور
      const imageDir = path.join(inputDir, 'images');
      const outputImageDir = path.join(outputDir, 'images');
      
      if (await this.directoryExists(imageDir)) {
        await fs.mkdir(outputImageDir, { recursive: true });
        await this.optimizeImagesInDirectory(imageDir, outputImageDir, options.images);
      }

      // تحسين الأصول الأخرى
      await AssetOptimizer.optimizeAssetsInDirectory(inputDir, outputDir, options.assets);

      // تحسين الخطوط
      const fontDir = path.join(inputDir, 'fonts');
      const outputFontDir = path.join(outputDir, 'fonts');
      
      if (await this.directoryExists(fontDir)) {
        await fs.mkdir(outputFontDir, { recursive: true });
        await FontOptimizer.optimizeFonts(fontDir, outputFontDir);
      }

      console.log('Asset optimization completed successfully');
    } catch (error) {
      console.error('Error optimizing assets:', error);
      throw error;
    }
  }

  // تحسين الصور في مجلد
  private static async optimizeImagesInDirectory(
    inputDir: string,
    outputDir: string,
    options: ImageOptimizationOptions = {}
  ): Promise<void> {
    const files = await fs.readdir(inputDir);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      
      if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'].includes(ext)) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file.replace(ext, '.webp'));
        
        try {
          await ImageOptimizer.optimizeImage(inputPath, outputPath, options);
        } catch (error) {
          console.error(`Error optimizing image ${file}:`, error);
        }
      }
    }
  }

  // التحقق من وجود مجلد
  private static async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }
}
