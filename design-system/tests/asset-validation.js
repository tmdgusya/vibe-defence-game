const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');
const { createHash } = require('crypto');

class AssetValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.totalSize = 0;
    
    this.budgets = {
      total: 2 * 1024 * 1024,
      tower: 90 * 1024,
      enemy: 100 * 1024,
      ui: 20 * 1024,
      effect: 50 * 1024,
      sound: 30 * 1024,
      background: 80 * 1024
    };
    
    this.expectedSizes = {
      tower: { width: 64, height: 64 },
      enemy: { width: 32, height: 32 },
      projectile: { width: 8, height: 8 },
      icon: { width: 32, height: 32 }
    };
  }

  validateAsset(filePath) {
    const relativePath = path.relative(process.cwd(), filePath);
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const fileExt = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, fileExt);
    
    this.totalSize += fileSize;
    
    this.validateFileSize(relativePath, fileSize, fileName);
    this.validateNaming(relativePath, fileName);
    this.validateFormat(relativePath, fileExt);
    
    if (this.isImageFile(fileExt)) {
      this.validateImageSize(relativePath);
    }
    
    return {
      path: relativePath,
      size: fileSize,
      valid: this.isValidAsset(relativePath, fileSize, fileName)
    };
  }

  validateFileSize(relativePath, fileSize, fileName) {
    const category = this.getAssetCategory(relativePath);
    const budget = this.budgets[category];
    
    if (budget && fileSize > budget) {
      this.errors.push(
        `File ${relativePath} (${this.formatBytes(fileSize)}) exceeds ${category} budget of ${this.formatBytes(budget)}`
      );
    }
    
    if (this.totalSize > this.budgets.total) {
      this.errors.push(
        `Total asset size ${this.formatBytes(this.totalSize)} exceeds budget of ${this.formatBytes(this.budgets.total)}`
      );
    }
  }

  validateNaming(relativePath, fileName) {
    const category = this.getAssetCategory(relativePath);
    
    if (fileName !== fileName.toLowerCase()) {
      this.errors.push(
        `File ${relativePath} contains uppercase letters - use lowercase only`
      );
    }
    
    if (fileName.includes(' ')) {
      this.errors.push(
        `File ${relativePath} contains spaces - use hyphens instead`
      );
    }
    
    switch (category) {
      case 'tower':
        if (!fileName.match(/^[a-z]+-level\d+$/)) {
          this.errors.push(
            `Tower file ${relativePath} should follow pattern: {type}-level{number}`
          );
        }
        break;
      case 'enemy':
        if (!fileName.match(/^[a-z]+-(walk|attack|death|fly)$/)) {
          this.errors.push(
            `Enemy file ${relativePath} should follow pattern: {type}-{action}`
          );
        }
        break;
      case 'ui':
        if (!fileName.match(/^[a-z]+-[a-z]+-[a-z]+$/)) {
          this.warnings.push(
            `UI file ${relativePath} may not follow standard pattern: {category}-{name}-{state}`
          );
        }
        break;
    }
  }

  validateFormat(relativePath, fileExt) {
    const category = this.getAssetCategory(relativePath);
    const allowedFormats = {
      tower: ['.png'],
      enemy: ['.png'],
      ui: ['.png', '.svg'],
      effect: ['.png'],
      sound: ['.mp3'],
      background: ['.jpg', '.png']
    };
    
    if (allowedFormats[category] && !allowedFormats[category].includes(fileExt)) {
      this.errors.push(
        `File ${relativePath} uses invalid format ${fileExt} for ${category} assets`
      );
    }
  }

  validateImageSize(relativePath) {
    this.warnings.push(
      `Image size validation needed for ${relativePath} - check dimensions manually`
    );
  }

  getAssetCategory(filePath) {
    const lowerPath = filePath.toLowerCase();
    
    if (lowerPath.includes('/towers/')) return 'tower';
    if (lowerPath.includes('/enemies/')) return 'enemy';
    if (lowerPath.includes('/ui/')) return 'ui';
    if (lowerPath.includes('/effects/')) return 'effect';
    if (lowerPath.includes('/sounds/')) return 'sound';
    if (lowerPath.includes('/backgrounds/')) return 'background';
    
    return 'other';
  }

  isImageFile(ext) {
    return ['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext);
  }

  isValidAsset(relativePath, fileSize, fileName) {
    const category = this.getAssetCategory(relativePath);
    const budget = this.budgets[category];
    
    return (
      fileName === fileName.toLowerCase() &&
      !fileName.includes(' ') &&
      (!budget || fileSize <= budget) &&
      fileName.length > 0 &&
      fileName.length < 100
    );
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateReport(results) {
    const validAssets = results.filter(r => r.valid);
    const invalidAssets = results.filter(r => !r.valid);
    
    console.log('='.repeat(80));
    console.log('📊 ASSET VALIDATION REPORT');
    console.log('='.repeat(80));
    
    console.log(`\n📈 SUMMARY:`);
    console.log(`   Total Assets: ${results.length}`);
    console.log(`   Valid Assets: ${validAssets.length}`);
    console.log(`   Invalid Assets: ${invalidAssets.length}`);
    console.log(`   Total Size: ${this.formatBytes(this.totalSize)}`);
    console.log(`   Budget Used: ${((this.totalSize / this.budgets.total) * 100).toFixed(1)}%`);
    
    if (this.errors.length > 0) {
      console.log(`\n❌ ERRORS (${this.errors.length}):`);
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`);
      this.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }
    
    if (this.errors.length === 0) {
      console.log(`\n✅ All assets pass validation!`);
    }
    
    console.log(`\n📂 CATEGORY BREAKDOWN:`);
    const categories = {};
    results.forEach(result => {
      const category = this.getAssetCategory(result.path);
      if (!categories[category]) categories[category] = { count: 0, size: 0 };
      categories[category].count++;
      categories[category].size += result.size;
    });
    
    Object.entries(categories).forEach(([category, data]) => {
      const budget = this.budgets[category];
      const budgetUsed = budget ? (data.size / budget * 100).toFixed(1) : 'N/A';
      console.log(`   ${category}: ${data.count} files, ${this.formatBytes(data.size)} (${budgetUsed}% of budget)`);
    });
    
    console.log('\n' + '='.repeat(80));
    
    return {
      summary: {
        total: results.length,
        valid: validAssets.length,
        invalid: invalidAssets.length,
        errors: this.errors.length,
        warnings: this.warnings.length,
        totalSize: this.totalSize,
        budgetUsed: (this.totalSize / this.budgets.total) * 100
      },
      categories,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  validateDirectory(directory) {
    const results = [];
    
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory() && !file.startsWith('.')) {
          walkDir(fullPath);
        } else if (stats.isFile() && this.isAssetFile(fullPath)) {
          results.push(this.validateAsset(fullPath));
        }
      });
    };
    
    walkDir(directory);
    return this.generateReport(results);
  }

  isAssetFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.mp3', '.wav'].includes(ext);
  }
}

if (require.main === module) {
  const directory = process.argv[2] || 'public/assets';
  const validator = new AssetValidator();
  
  console.log(`🔍 Validating assets in: ${directory}`);
  
  if (!fs.existsSync(directory)) {
    console.error(`❌ Directory ${directory} does not exist`);
    process.exit(1);
  }
  
  const report = validator.validateDirectory(directory);
  
  if (report.summary.errors > 0) {
    process.exit(1);
  }
}

module.exports = AssetValidator;