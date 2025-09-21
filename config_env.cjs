#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

/**
 * ⚙️ Configuration & Environment Manager
 * إدارة إعدادات النظام ومتغيرات البيئة
 * التحقق من التكوين وإعداد النظام
 */
class ConfigManager {
    constructor() {
        this.config = {
            system: {
                name: 'AuraOS Autopilot System',
                version: '1.0.0',
                environment: process.env.NODE_ENV || 'development',
                port: process.env.PORT || 3000,
                debug: process.env.DEBUG === 'true'
            },
            firebase: {
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            },
            telegram: {
                botToken: process.env.TELEGRAM_BOT_TOKEN,
                adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID
            },
            ai: {
                googleApiKey: process.env.GOOGLE_AI_API_KEY,
                model: 'gemini-pro',
                temperature: 0.3,
                maxTokens: 2048
            },
            autopilot: {
                maxConcurrentTasks: 10,
                taskTimeout: 300000, // 5 minutes
                agentTimeout: 60000, // 1 minute
                feedbackInterval: 300000, // 5 minutes
                cleanupInterval: 3600000 // 1 hour
            },
            logging: {
                level: process.env.LOG_LEVEL || 'info',
                maxFileSize: '10MB',
                maxFiles: 5,
                retentionDays: 7
            },
            analytics: {
                enabled: true,
                dashboardUpdateInterval: 60000, // 1 minute
                reportInterval: 900000, // 15 minutes
                analysisInterval: 3600000 // 1 hour
            }
        };
        
        this.validationRules = {
            firebase: {
                projectId: { required: true, type: 'string', minLength: 5 },
                privateKey: { required: true, type: 'string', pattern: /-----BEGIN PRIVATE KEY-----/ },
                clientEmail: { required: true, type: 'string', pattern: /@.*\.iam\.gserviceaccount\.com$/ }
            },
            telegram: {
                botToken: { required: true, type: 'string', pattern: /^\d+:[A-Za-z0-9_-]+$/ },
                adminChatId: { required: true, type: 'string', pattern: /^-?\d+$/ }
            },
            ai: {
                googleApiKey: { required: true, type: 'string', minLength: 20 }
            }
        };
        
        this.errors = [];
        this.warnings = [];
        
        console.log('⚙️ Configuration Manager initialized');
    }

    /**
     * التحقق من صحة التكوين
     */
    validateConfig() {
        this.errors = [];
        this.warnings = [];
        
        console.log('🔍 Validating configuration...');
        
        // التحقق من Firebase
        this.validateFirebaseConfig();
        
        // التحقق من Telegram
        this.validateTelegramConfig();
        
        // التحقق من Google AI
        this.validateAIConfig();
        
        // التحقق من الإعدادات العامة
        this.validateSystemConfig();
        
        // عرض النتائج
        this.displayValidationResults();
        
        return this.errors.length === 0;
    }

    /**
     * التحقق من إعدادات Firebase
     */
    validateFirebaseConfig() {
        const firebase = this.config.firebase;
        const rules = this.validationRules.firebase;
        
        Object.entries(rules).forEach(([key, rule]) => {
            const value = firebase[key];
            
            if (rule.required && (!value || value.includes('your_') || value.includes('YOUR_'))) {
                this.errors.push(`Firebase ${key} is required and must be configured`);
            } else if (value) {
                if (rule.type && typeof value !== rule.type) {
                    this.errors.push(`Firebase ${key} must be a ${rule.type}`);
                }
                if (rule.minLength && value.length < rule.minLength) {
                    this.errors.push(`Firebase ${key} must be at least ${rule.minLength} characters`);
                }
                if (rule.pattern && !rule.pattern.test(value)) {
                    this.errors.push(`Firebase ${key} format is invalid`);
                }
            }
        });
    }

    /**
     * التحقق من إعدادات Telegram
     */
    validateTelegramConfig() {
        const telegram = this.config.telegram;
        const rules = this.validationRules.telegram;
        
        Object.entries(rules).forEach(([key, rule]) => {
            const value = telegram[key];
            
            if (rule.required && (!value || value.includes('your_') || value.includes('YOUR_'))) {
                this.errors.push(`Telegram ${key} is required and must be configured`);
            } else if (value) {
                if (rule.type && typeof value !== rule.type) {
                    this.errors.push(`Telegram ${key} must be a ${rule.type}`);
                }
                if (rule.pattern && !rule.pattern.test(value)) {
                    this.errors.push(`Telegram ${key} format is invalid`);
                }
            }
        });
    }

    /**
     * التحقق من إعدادات Google AI
     */
    validateAIConfig() {
        const ai = this.config.ai;
        const rules = this.validationRules.ai;
        
        Object.entries(rules).forEach(([key, rule]) => {
            const value = ai[key];
            
            if (rule.required && (!value || value.includes('your_') || value.includes('YOUR_'))) {
                this.errors.push(`Google AI ${key} is required and must be configured`);
            } else if (value) {
                if (rule.type && typeof value !== rule.type) {
                    this.errors.push(`Google AI ${key} must be a ${rule.type}`);
                }
                if (rule.minLength && value.length < rule.minLength) {
                    this.errors.push(`Google AI ${key} must be at least ${rule.minLength} characters`);
                }
            }
        });
    }

    /**
     * التحقق من الإعدادات العامة
     */
    validateSystemConfig() {
        const system = this.config.system;
        
        if (system.port < 1000 || system.port > 65535) {
            this.warnings.push('Port should be between 1000 and 65535');
        }
        
        if (system.environment === 'production' && system.debug) {
            this.warnings.push('Debug mode should be disabled in production');
        }
    }

    /**
     * عرض نتائج التحقق
     */
    displayValidationResults() {
        console.log('='.repeat(60));
        
        if (this.errors.length === 0) {
            console.log('✅ Configuration validation passed');
        } else {
            console.log('❌ Configuration validation failed:');
            this.errors.forEach(error => {
                console.log(`   - ${error}`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log('⚠️ Warnings:');
            this.warnings.forEach(warning => {
                console.log(`   - ${warning}`);
            });
        }
        
        console.log('='.repeat(60));
    }

    /**
     * إنشاء ملف تكوين افتراضي
     */
    async createDefaultConfig() {
        try {
            const defaultConfig = {
                system: {
                    name: 'AuraOS Autopilot System',
                    version: '1.0.0',
                    environment: 'development',
                    port: 3000,
                    debug: true
                },
                firebase: {
                    projectId: 'your-firebase-project-id',
                    privateKey: '-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n',
                    clientEmail: 'firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com'
                },
                telegram: {
                    botToken: 'your_bot_token_here',
                    adminChatId: 'your_chat_id_here'
                },
                ai: {
                    googleApiKey: 'your_gemini_api_key_here',
                    model: 'gemini-pro',
                    temperature: 0.3,
                    maxTokens: 2048
                },
                autopilot: {
                    maxConcurrentTasks: 10,
                    taskTimeout: 300000,
                    agentTimeout: 60000,
                    feedbackInterval: 300000,
                    cleanupInterval: 3600000
                },
                logging: {
                    level: 'info',
                    maxFileSize: '10MB',
                    maxFiles: 5,
                    retentionDays: 7
                },
                analytics: {
                    enabled: true,
                    dashboardUpdateInterval: 60000,
                    reportInterval: 900000,
                    analysisInterval: 3600000
                }
            };

            const configFile = path.join(process.cwd(), 'config.json');
            await fs.writeFile(configFile, JSON.stringify(defaultConfig, null, 2));
            
            console.log('📝 Default configuration file created: config.json');
            return configFile;

        } catch (error) {
            console.error('❌ Failed to create default config:', error);
            throw error;
        }
    }

    /**
     * تحميل التكوين من ملف
     */
    async loadConfigFromFile(configPath) {
        try {
            const configData = await fs.readFile(configPath, 'utf8');
            const fileConfig = JSON.parse(configData);
            
            // دمج التكوين من الملف مع التكوين الحالي
            this.config = this.mergeConfigs(this.config, fileConfig);
            
            console.log(`📁 Configuration loaded from: ${configPath}`);
            return true;

        } catch (error) {
            console.error('❌ Failed to load config from file:', error);
            return false;
        }
    }

    /**
     * دمج التكوينات
     */
    mergeConfigs(baseConfig, fileConfig) {
        const merged = { ...baseConfig };
        
        Object.keys(fileConfig).forEach(key => {
            if (typeof fileConfig[key] === 'object' && !Array.isArray(fileConfig[key])) {
                merged[key] = { ...merged[key], ...fileConfig[key] };
            } else {
                merged[key] = fileConfig[key];
            }
        });
        
        return merged;
    }

    /**
     * حفظ التكوين إلى ملف
     */
    async saveConfigToFile(configPath) {
        try {
            await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));
            console.log(`💾 Configuration saved to: ${configPath}`);
            return true;

        } catch (error) {
            console.error('❌ Failed to save config to file:', error);
            return false;
        }
    }

    /**
     * تحديث قيمة في التكوين
     */
    updateConfig(path, value) {
        const keys = path.split('.');
        let current = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        console.log(`⚙️ Updated config: ${path} = ${value}`);
    }

    /**
     * الحصول على قيمة من التكوين
     */
    getConfig(path) {
        const keys = path.split('.');
        let current = this.config;
        
        for (const key of keys) {
            if (current[key] === undefined) {
                return undefined;
            }
            current = current[key];
        }
        
        return current;
    }

    /**
     * الحصول على التكوين الكامل
     */
    getFullConfig() {
        return this.config;
    }

    /**
     * الحصول على التكوين الآمن (بدون مفاتيح حساسة)
     */
    getSafeConfig() {
        const safeConfig = { ...this.config };
        
        // إخفاء المفاتيح الحساسة
        if (safeConfig.firebase.privateKey) {
            safeConfig.firebase.privateKey = '***HIDDEN***';
        }
        if (safeConfig.telegram.botToken) {
            safeConfig.telegram.botToken = '***HIDDEN***';
        }
        if (safeConfig.ai.googleApiKey) {
            safeConfig.ai.googleApiKey = '***HIDDEN***';
        }
        
        return safeConfig;
    }

    /**
     * إنشاء تقرير التكوين
     */
    generateConfigReport() {
        const report = {
            timestamp: new Date().toISOString(),
            validation: {
                passed: this.errors.length === 0,
                errors: this.errors,
                warnings: this.warnings
            },
            config: this.getSafeConfig(),
            environment: {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
                cwd: process.cwd()
            }
        };
        
        return report;
    }

    /**
     * طباعة تقرير التكوين
     */
    printConfigReport() {
        const report = this.generateConfigReport();
        
        console.log('📊 Configuration Report');
        console.log('='.repeat(60));
        console.log(`🕐 Generated: ${report.timestamp}`);
        console.log(`✅ Validation: ${report.validation.passed ? 'PASSED' : 'FAILED'}`);
        console.log(`🌍 Environment: ${report.environment.platform} ${report.environment.arch}`);
        console.log(`📁 Working Directory: ${report.environment.cwd}`);
        console.log('='.repeat(60));
        
        if (report.validation.errors.length > 0) {
            console.log('❌ Errors:');
            report.validation.errors.forEach(error => {
                console.log(`   - ${error}`);
            });
        }
        
        if (report.validation.warnings.length > 0) {
            console.log('⚠️ Warnings:');
            report.validation.warnings.forEach(warning => {
                console.log(`   - ${warning}`);
            });
        }
        
        console.log('='.repeat(60));
    }

    /**
     * إعادة تعيين التكوين إلى الافتراضي
     */
    resetToDefault() {
        this.config = {
            system: {
                name: 'AuraOS Autopilot System',
                version: '1.0.0',
                environment: 'development',
                port: 3000,
                debug: true
            },
            firebase: {
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            },
            telegram: {
                botToken: process.env.TELEGRAM_BOT_TOKEN,
                adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID
            },
            ai: {
                googleApiKey: process.env.GOOGLE_AI_API_KEY,
                model: 'gemini-pro',
                temperature: 0.3,
                maxTokens: 2048
            },
            autopilot: {
                maxConcurrentTasks: 10,
                taskTimeout: 300000,
                agentTimeout: 60000,
                feedbackInterval: 300000,
                cleanupInterval: 3600000
            },
            logging: {
                level: 'info',
                maxFileSize: '10MB',
                maxFiles: 5,
                retentionDays: 7
            },
            analytics: {
                enabled: true,
                dashboardUpdateInterval: 60000,
                reportInterval: 900000,
                analysisInterval: 3600000
            }
        };
        
        console.log('🔄 Configuration reset to default');
    }
}

// تشغيل التحقق من التكوين إذا كان الملف يتم تنفيذه مباشرة
async function main() {
    try {
        const configManager = new ConfigManager();
        
        // التحقق من التكوين
        const isValid = configManager.validateConfig();
        
        // طباعة تقرير التكوين
        configManager.printConfigReport();
        
        if (!isValid) {
            console.log('\n📝 To fix configuration issues:');
            console.log('1. Update your .env file with correct values');
            console.log('2. Run: node config_env.cjs --create-default');
            console.log('3. See AURAOS_SETUP_GUIDE.md for detailed instructions');
            process.exit(1);
        }
        
        console.log('\n✅ Configuration is valid and ready to use!');
        
    } catch (error) {
        console.error('❌ Configuration check failed:', error);
        process.exit(1);
    }
}

// معالجة الأوامر
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--create-default')) {
        const configManager = new ConfigManager();
        configManager.createDefaultConfig()
            .then(() => {
                console.log('✅ Default configuration created');
                process.exit(0);
            })
            .catch(error => {
                console.error('❌ Failed to create default config:', error);
                process.exit(1);
            });
    } else {
        main();
    }
}

module.exports = ConfigManager;
