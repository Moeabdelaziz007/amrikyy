import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  Activity,
  Moon,
  Sun,
  Droplets,
  Apple,
  Dumbbell,
  Brain,
  Zap,
  Calendar,
  TrendingUp,
  Target,
  Award,
  Clock,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Settings,
  Bell,
  Star,
  AlertCircle,
  CheckCircle,
  Timer,
  MapPin,
  Wind,
  Thermometer,
  Eye,
  Scale,
  Users,
  MessageCircle,
  Share,
  Download,
  Upload
} from 'lucide-react';

interface HealthMetric {
  id: string;
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'sleep' | 'steps' | 'calories' | 'water' | 'mood' | 'energy';
  value: number;
  unit: string;
  timestamp: Date;
  notes?: string;
  category: string;
}

interface Workout {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
  calories: number;
  date: Date;
  exercises: Exercise[];
  notes?: string;
}

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: Date;
  ingredients: string[];
  notes?: string;
}

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility' | 'general';
  target: number;
  current: number;
  deadline: Date;
  unit: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
}

interface HealthInsight {
  totalSteps: number;
  totalCalories: number;
  averageSleep: number;
  averageHeartRate: number;
  weightChange: number;
  weeklyProgress: number[];
  topExercises: Array<{ name: string; count: number; calories: number }>;
  nutritionBalance: {
    protein: number;
    carbs: number;
    fat: number;
  };
  healthScore: number;
  recommendations: string[];
}

const HealthTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'metrics' | 'workouts' | 'nutrition' | 'goals' | 'insights'>('dashboard');
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [insights, setInsights] = useState<HealthInsight | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedMetrics = localStorage.getItem('health-metrics');
    const savedWorkouts = localStorage.getItem('health-workouts');
    const savedMeals = localStorage.getItem('health-meals');
    const savedGoals = localStorage.getItem('health-goals');
    
    if (savedMetrics) setMetrics(JSON.parse(savedMetrics));
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  // Save data to localStorage
  const saveData = useCallback(() => {
    localStorage.setItem('health-metrics', JSON.stringify(metrics));
    localStorage.setItem('health-workouts', JSON.stringify(workouts));
    localStorage.setItem('health-meals', JSON.stringify(meals));
    localStorage.setItem('health-goals', JSON.stringify(goals));
  }, [metrics, workouts, meals, goals]);

  useEffect(() => {
    saveData();
  }, [saveData]);

  // Calculate health insights
  useEffect(() => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Recent metrics (last 7 days)
    const recentMetrics = metrics.filter(m => m.timestamp >= weekAgo);
    const recentWorkouts = workouts.filter(w => w.date >= weekAgo);
    const recentMeals = meals.filter(m => m.date >= weekAgo);

    // Total steps and calories
    const totalSteps = recentMetrics
      .filter(m => m.type === 'steps')
      .reduce((sum, m) => sum + m.value, 0);

    const totalCalories = recentWorkouts.reduce((sum, w) => sum + w.calories, 0);

    // Average sleep
    const sleepMetrics = recentMetrics.filter(m => m.type === 'sleep');
    const averageSleep = sleepMetrics.length > 0 
      ? sleepMetrics.reduce((sum, m) => sum + m.value, 0) / sleepMetrics.length 
      : 0;

    // Average heart rate
    const heartRateMetrics = recentMetrics.filter(m => m.type === 'heart_rate');
    const averageHeartRate = heartRateMetrics.length > 0 
      ? heartRateMetrics.reduce((sum, m) => sum + m.value, 0) / heartRateMetrics.length 
      : 0;

    // Weight change
    const weightMetrics = metrics.filter(m => m.type === 'weight').sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
    const weightChange = weightMetrics.length >= 2 
      ? weightMetrics[weightMetrics.length - 1].value - weightMetrics[0].value 
      : 0;

    // Weekly progress (last 7 days)
    const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayWorkouts = workouts.filter(w => 
        w.date.toDateString() === date.toDateString()
      );
      return dayWorkouts.reduce((sum, w) => sum + w.calories, 0);
    });

    // Top exercises
    const exerciseCount = recentWorkouts.reduce((acc, workout) => {
      workout.exercises.forEach(exercise => {
        acc[exercise.name] = {
          count: (acc[exercise.name]?.count || 0) + 1,
          calories: (acc[exercise.name]?.calories || 0) + workout.calories
        };
      });
      return acc;
    }, {} as Record<string, { count: number; calories: number }>);

    const topExercises = Object.entries(exerciseCount)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));

    // Nutrition balance
    const nutritionBalance = recentMeals.reduce((acc, meal) => {
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fat += meal.fat;
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 });

    // Health score calculation (0-100)
    let healthScore = 0;
    
    // Sleep score (0-25)
    if (averageSleep >= 7 && averageSleep <= 9) healthScore += 25;
    else if (averageSleep >= 6 && averageSleep <= 10) healthScore += 20;
    else healthScore += 10;

    // Activity score (0-25)
    const weeklyCalories = weeklyProgress.reduce((sum, cal) => sum + cal, 0);
    if (weeklyCalories >= 2000) healthScore += 25;
    else if (weeklyCalories >= 1500) healthScore += 20;
    else if (weeklyCalories >= 1000) healthScore += 15;
    else healthScore += 5;

    // Heart rate score (0-25)
    if (averageHeartRate >= 60 && averageHeartRate <= 100) healthScore += 25;
    else if (averageHeartRate >= 50 && averageHeartRate <= 120) healthScore += 20;
    else healthScore += 10;

    // Weight management score (0-25)
    if (Math.abs(weightChange) <= 1) healthScore += 25;
    else if (Math.abs(weightChange) <= 2) healthScore += 20;
    else if (Math.abs(weightChange) <= 5) healthScore += 15;
    else healthScore += 5;

    // Generate recommendations
    const recommendations = [];
    if (averageSleep < 7) recommendations.push("Try to get 7-9 hours of sleep per night");
    if (weeklyCalories < 1000) recommendations.push("Increase your physical activity");
    if (averageHeartRate > 100) recommendations.push("Consider consulting a healthcare provider about your heart rate");
    if (Math.abs(weightChange) > 5) recommendations.push("Monitor your weight changes and adjust your routine");

    setInsights({
      totalSteps,
      totalCalories,
      averageSleep,
      averageHeartRate,
      weightChange,
      weeklyProgress,
      topExercises,
      nutritionBalance,
      healthScore,
      recommendations
    });
  }, [metrics, workouts, meals]);

  const addMetric = (metricData: Omit<HealthMetric, 'id'>) => {
    const newMetric: HealthMetric = {
      ...metricData,
      id: Date.now().toString()
    };
    setMetrics(prev => [...prev, newMetric]);
  };

  const addWorkout = (workoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...workoutData,
      id: Date.now().toString()
    };
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const addMeal = (mealData: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...mealData,
      id: Date.now().toString()
    };
    setMeals(prev => [...prev, newMeal]);
  };

  const addGoal = (goalData: Omit<HealthGoal, 'id' | 'progress'>) => {
    const newGoal: HealthGoal = {
      ...goalData,
      id: Date.now().toString(),
      progress: (goalData.current / goalData.target) * 100
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const getMetricIcon = (type: HealthMetric['type']) => {
    const icons = {
      weight: Scale,
      blood_pressure: Heart,
      heart_rate: Activity,
      sleep: Moon,
      steps: Activity,
      calories: Zap,
      water: Droplets,
      mood: Brain,
      energy: Zap
    };
    return icons[type] || Activity;
  };

  const getWorkoutTypeColor = (type: Workout['type']) => {
    const colors = {
      cardio: 'bg-red-100 text-red-800',
      strength: 'bg-blue-100 text-blue-800',
      flexibility: 'bg-green-100 text-green-800',
      sports: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  };

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Health Score Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Health Score</h3>
            <p className="text-3xl font-bold">{insights?.healthScore || 0}/100</p>
            <p className="text-blue-100">
              {insights?.healthScore && insights.healthScore >= 80 ? 'Excellent!' :
               insights?.healthScore && insights.healthScore >= 60 ? 'Good' :
               insights?.healthScore && insights.healthScore >= 40 ? 'Fair' : 'Needs Improvement'}
            </p>
          </div>
          <div className="text-right">
            <Award className="h-12 w-12 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Steps Today</p>
              <p className="text-2xl font-bold text-gray-900">{insights?.totalSteps.toLocaleString() || '0'}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calories Burned</p>
              <p className="text-2xl font-bold text-orange-600">{insights?.totalCalories || '0'}</p>
            </div>
            <Zap className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Sleep</p>
              <p className="text-2xl font-bold text-purple-600">{insights?.averageSleep.toFixed(1) || '0'}h</p>
            </div>
            <Moon className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Heart Rate</p>
              <p className="text-2xl font-bold text-red-600">{Math.round(insights?.averageHeartRate || 0)} bpm</p>
            </div>
            <Heart className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
        <div className="flex items-end space-x-2 h-32">
          {insights?.weeklyProgress.map((calories, index) => {
            const height = (calories / Math.max(...insights.weeklyProgress, [1])) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-orange-500 rounded-t"
                  style={{ height: `${height}%` }}
                />
                <p className="text-xs text-gray-600 mt-2">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Workouts</h3>
        <div className="space-y-3">
          {workouts.slice(-5).reverse().map(workout => (
            <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkoutTypeColor(workout.type)}`}>
                  {workout.type}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{workout.name}</p>
                  <p className="text-sm text-gray-500">{workout.duration}min • {workout.date.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-orange-600">{workout.calories} cal</p>
                <p className="text-xs text-gray-500 capitalize">{workout.intensity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Recommendations */}
      {insights && insights.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Health Recommendations</h3>
          <div className="space-y-2">
            {insights.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-blue-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const MetricsTab = () => (
    <div className="space-y-6">
      {/* Add Metric Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Health Metric</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          addMetric({
            type: formData.get('type') as HealthMetric['type'],
            value: parseFloat(formData.get('value') as string),
            unit: formData.get('unit') as string,
            timestamp: new Date(formData.get('timestamp') as string),
            category: formData.get('category') as string,
            notes: formData.get('notes') as string
          });
          (e.target as HTMLFormElement).reset();
        }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="type" className="px-3 py-2 border rounded-lg" required>
              <option value="weight">Weight</option>
              <option value="blood_pressure">Blood Pressure</option>
              <option value="heart_rate">Heart Rate</option>
              <option value="sleep">Sleep Hours</option>
              <option value="steps">Steps</option>
              <option value="calories">Calories</option>
              <option value="water">Water Intake</option>
              <option value="mood">Mood (1-10)</option>
              <option value="energy">Energy Level (1-10)</option>
            </select>
            <input
              name="value"
              type="number"
              step="0.1"
              placeholder="Value"
              className="px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="unit"
              type="text"
              placeholder="Unit (kg, lbs, bpm, etc.)"
              className="px-3 py-2 border rounded-lg"
              required
            />
            <input
              name="timestamp"
              type="datetime-local"
              defaultValue={new Date().toISOString().slice(0, 16)}
              className="px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <input
            name="category"
            type="text"
            placeholder="Category"
            className="px-3 py-2 border rounded-lg"
            required
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            className="w-full px-3 py-2 border rounded-lg"
            rows={2}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Metric
          </button>
        </form>
      </div>

      {/* Metrics List */}
      <div className="space-y-4">
        {metrics.slice(-10).reverse().map(metric => {
          const Icon = getMetricIcon(metric.type);
          return (
            <div key={metric.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{metric.type.replace('_', ' ')}</h4>
                    <p className="text-sm text-gray-500">{metric.timestamp.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{metric.value} {metric.unit}</p>
                  {metric.notes && (
                    <p className="text-sm text-gray-500">{metric.notes}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const WorkoutsTab = () => (
    <div className="space-y-6">
      {/* Add Workout Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Workout</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          addWorkout({
            name: formData.get('name') as string,
            type: formData.get('type') as Workout['type'],
            duration: parseInt(formData.get('duration') as string),
            intensity: formData.get('intensity') as Workout['intensity'],
            calories: parseInt(formData.get('calories') as string),
            date: new Date(formData.get('date') as string),
            exercises: [], // Simplified for now
            notes: formData.get('notes') as string
          });
          (e.target as HTMLFormElement).reset();
        }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              placeholder="Workout name"
              className="px-3 py-2 border rounded-lg"
              required
            />
            <select name="type" className="px-3 py-2 border rounded-lg" required>
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="flexibility">Flexibility</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="duration"
              type="number"
              placeholder="Duration (minutes)"
              className="px-3 py-2 border rounded-lg"
              required
            />
            <select name="intensity" className="px-3 py-2 border rounded-lg" required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              name="calories"
              type="number"
              placeholder="Calories burned"
              className="px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <input
            name="date"
            type="datetime-local"
            defaultValue={new Date().toISOString().slice(0, 16)}
            className="px-3 py-2 border rounded-lg"
            required
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            className="w-full px-3 py-2 border rounded-lg"
            rows={2}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Workout
          </button>
        </form>
      </div>

      {/* Workouts List */}
      <div className="space-y-4">
        {workouts.slice(-10).reverse().map(workout => (
          <div key={workout.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Dumbbell className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">{workout.name}</h4>
                  <p className="text-sm text-gray-500">{workout.date.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{workout.duration}min</p>
                <p className="text-sm text-gray-500">{workout.calories} calories</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkoutTypeColor(workout.type)}`}>
                {workout.type}
              </div>
              <span className="text-xs text-gray-500 capitalize">{workout.intensity} intensity</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-red-600" />
                <h1 className="text-xl font-bold text-gray-900">Health Tracker</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <Settings className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'metrics', label: 'Metrics', icon: Activity },
              { id: 'workouts', label: 'Workouts', icon: Dumbbell },
              { id: 'nutrition', label: 'Nutrition', icon: Apple },
              { id: 'goals', label: 'Goals', icon: Target },
              { id: 'insights', label: 'Insights', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'metrics' && <MetricsTab />}
        {activeTab === 'workouts' && <WorkoutsTab />}
        {activeTab === 'nutrition' && (
          <div className="text-center py-12">
            <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nutrition Tracking</h3>
            <p className="text-gray-600">Nutrition and meal tracking features coming soon.</p>
          </div>
        )}
        {activeTab === 'goals' && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Health Goals</h3>
            <p className="text-gray-600">Goal setting and tracking features coming soon.</p>
          </div>
        )}
        {activeTab === 'insights' && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Health Insights</h3>
            <p className="text-gray-600">Advanced health insights and analytics coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTracker;
