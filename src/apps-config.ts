import React from 'react';
import {
  // ProductivitySuite,
  // AIFinanceManager,
  // HealthTracker,
  EnhancedCalendarApp,
  EnhancedNotesApp,
  AITravelAgencyApp,
  GamingEntertainmentSuite,
  EnhancedFileManagerApp,
  EnhancedSettingsApp,
  EnhancedUIApp,
  // EnhancedWeatherApp,
  AIAgentsApp,
  AIFeaturesApp,
  // AutomationDashboardApp,
  AutopilotApp,
  CollaborationApp,
  TaskTemplatesApp,
  // TelegramBotApp,
  // EnhancedMCPToolsApp,
  TestLabApp,
  FirestoreTestApp,
  UltimateApp,
  // AdvancedThemeSelector,
  SoundEffectsManager,
  // SmartAutomationSystem,
  // EnhancedIntegrationManager,
  EnhancedRealtimeSyncManager,
  EnhancedCloudStorageManager,
  EnhancedAIAssistant,
  IntelligentTaskManager,
  VoiceCommandSystem,
  AIPoweredDesktop,
  IntelligentAutomationEngine,
  EnhancedAnalyticsDashboard,
  PerformanceMonitor,
  UsageStatistics,
  ProductivityInsights,
  SystemHealthMonitor,
  EnhancedSecurityDashboard,
  DataEncryption,
  UserPermissions,
  LanguageSelector,
  LocalizationManager,
  AdvancedAnimationSystem,
  SystemOptimizer,
  ARVRIntegration,
  BlockchainFeatures,
  IoTConnectivity,
  QuantumComputing,
  NeuralInterfaces,
  SmartWorkflowAutomation,
  AITaskScheduling,
  IntelligentResourceAllocation,
  PredictiveMaintenance,
  ContextSensitiveActions,
  NaturalLanguageProcessing,
  ComputerVision,
  PredictiveAnalytics,
  IntelligentRecommendations,
  AdvancedAIModels,
  AdvancedThemeSystem,
  CustomWallpaperEngine,
  InteractiveWidgets,
  PersonalizationFeatures,
  CreativeTools,
  AnalyticsDashboardApp,
  TaskManagementApp
} from './components'; // Assuming components are exported from a central index file

export const appsConfig = [
  // Core Productivity Apps
  { id: 'productivity_suite', component: ProductivitySuite, category: 'productivity' },
  { id: 'ai_finance_manager', component: AIFinanceManager, category: 'productivity' },
  { id: 'health_tracker', component: HealthTracker, category: 'productivity' },
  { id: 'analytics_dashboard', component: AnalyticsDashboardApp, category: 'productivity' },
  { id: 'task_management', component: TaskManagementApp, category: 'productivity' },
  { id: 'enhanced_calendar', component: EnhancedCalendarApp, category: 'productivity' },
  { id: 'enhanced_notes', component: EnhancedNotesApp, category: 'productivity' },

  // Travel & Lifestyle Apps
  { id: 'ai_travel_agency', component: AITravelAgencyApp, category: 'lifestyle' },
  { id: 'gaming_entertainment_suite', component: GamingEntertainmentSuite, category: 'entertainment' },

  // File & System Management
  { id: 'enhanced_file_manager', component: EnhancedFileManagerApp, category: 'system' },
  { id: 'enhanced_settings', component: EnhancedSettingsApp, category: 'system' },
  { id: 'enhanced_ui', component: EnhancedUIApp, category: 'system' },
  { id: 'enhanced_weather', component: EnhancedWeatherApp, category: 'system' },

  // AI & Automation
  { id: 'ai_agents', component: AIAgentsApp, category: 'ai' },
  { id: 'ai_features', component: AIFeaturesApp, category: 'ai' },
  { id: 'automation_dashboard', component: AutomationDashboardApp, category: 'ai' },
  { id: 'autopilot', component: AutopilotApp, category: 'ai' },

  // Collaboration & Templates
  { id: 'collaboration', component: CollaborationApp, category: 'collaboration' },
  { id: 'task_templates', component: TaskTemplatesApp, category: 'collaboration' },
  { id: 'telegram_bot', component: TelegramBotApp, category: 'collaboration' },
  { id: 'enhanced_mcp_tools', component: EnhancedMCPToolsApp, category: 'collaboration' },

  // Development & Testing
  { id: 'test_lab', component: TestLabApp, category: 'development' },
  { id: 'firestore_test', component: FirestoreTestApp, category: 'development' },
  { id: 'ultimate', component: UltimateApp, category: 'premium' },

  // Advanced Features
  { id: 'advanced_theme_selector', component: AdvancedThemeSelector, category: 'advanced' },
  { id: 'sound_effects_manager', component: SoundEffectsManager, category: 'advanced' },
  { id: 'smart_automation_system', component: SmartAutomationSystem, category: 'advanced' },

  // Integration & Connectivity
  { id: 'enhanced_integration_manager', component: EnhancedIntegrationManager, category: 'integration' },
  { id: 'enhanced_realtime_sync_manager', component: EnhancedRealtimeSyncManager, category: 'integration' },
  { id: 'enhanced_cloud_storage_manager', component: EnhancedCloudStorageManager, category: 'integration' },

  // AI-Powered Features
  { id: 'enhanced_ai_assistant', component: EnhancedAIAssistant, category: 'ai' },
  { id: 'intelligent_task_manager', component: IntelligentTaskManager, category: 'ai' },
  { id: 'voice_command_system', component: VoiceCommandSystem, category: 'ai' },
  { id: 'ai_powered_desktop', component: AIPoweredDesktop, category: 'ai' },
  { id: 'intelligent_automation_engine', component: IntelligentAutomationEngine, category: 'ai' },

  // Analytics & Insights
  { id: 'enhanced_analytics_dashboard', component: EnhancedAnalyticsDashboard, category: 'analytics' },
  { id: 'performance_monitor', component: PerformanceMonitor, category: 'analytics' },
  { id: 'usage_statistics', component: UsageStatistics, category: 'analytics' },
  { id: 'productivity_insights', component: ProductivityInsights, category: 'analytics' },
  { id: 'system_health_monitor', component: SystemHealthMonitor, category: 'analytics' },

  // Security & Privacy
  { id: 'enhanced_security_dashboard', component: EnhancedSecurityDashboard, category: 'security' },
  { id: 'data_encryption', component: DataEncryption, category: 'security' },
  { id: 'user_permissions', component: UserPermissions, category: 'security' },

  // Multi-Language Support
  { id: 'language_selector', component: LanguageSelector, category: 'i18n' },
  { id: 'localization_manager', component: LocalizationManager, category: 'i18n' },

  // Advanced UI/UX
  { id: 'advanced_animation_system', component: AdvancedAnimationSystem, category: 'ui' },
  { id: 'system_optimizer', component: SystemOptimizer, category: 'system' },

  // Future Technologies
  { id: 'ar_vr_integration', component: ARVRIntegration, category: 'future' },
  { id: 'blockchain_features', component: BlockchainFeatures, category: 'future' },
  { id: 'iot_connectivity', component: IoTConnectivity, category: 'future' },
  { id: 'quantum_computing', component: QuantumComputing, category: 'future' },
  { id: 'neural_interfaces', component: NeuralInterfaces, category: 'future' },

  // Advanced Automation
  { id: 'smart_workflow_automation', component: SmartWorkflowAutomation, category: 'automation' },
  { id: 'ai_task_scheduling', component: AITaskScheduling, category: 'automation' },
  { id: 'intelligent_resource_allocation', component: IntelligentResourceAllocation, category: 'automation' },
  { id: 'predictive_maintenance', component: PredictiveMaintenance, category: 'automation' },
  { id: 'context_sensitive_actions', component: ContextSensitiveActions, category: 'automation' },

  // Advanced AI & Machine Learning
  { id: 'natural_language_processing', component: NaturalLanguageProcessing, category: 'ai' },
  { id: 'computer_vision', component: ComputerVision, category: 'ai' },
  { id: 'predictive_analytics', component: PredictiveAnalytics, category: 'ai' },
  { id: 'intelligent_recommendations', component: IntelligentRecommendations, category: 'ai' },
  { id: 'advanced_ai_models', component: AdvancedAIModels, category: 'ai' },

  // Creative & Design Enhancements
  { id: 'advanced_theme_system', component: AdvancedThemeSystem, category: 'creative' },
  { id: 'custom_wallpaper_engine', component: CustomWallpaperEngine, category: 'creative' },
  { id: 'interactive_widgets', component: InteractiveWidgets, category: 'creative' },
  { id: 'personalization_features', component: PersonalizationFeatures, category: 'creative' },
  { id: 'creative_tools', component: CreativeTools, category: 'creative' }
];

