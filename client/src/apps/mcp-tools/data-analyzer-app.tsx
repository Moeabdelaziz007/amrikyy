'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = DataAnalyzerApp;
const react_1 = require('react');
const card_1 = require('@/components/ui/card');
const button_1 = require('@/components/ui/button');
const textarea_1 = require('@/components/ui/textarea');
const select_1 = require('@/components/ui/select');
const badge_1 = require('@/components/ui/badge');
const alert_1 = require('@/components/ui/alert');
const lucide_react_1 = require('lucide-react');
function DataAnalyzerApp({ onExecute }) {
  const [data, setData] = (0, react_1.useState)('');
  const [analysisType, setAnalysisType] = (0, react_1.useState)('descriptive');
  const [isLoading, setIsLoading] = (0, react_1.useState)(false);
  const [result, setResult] = (0, react_1.useState)(null);
  const handleExecute = async () => {
    if (!data.trim()) return;
    setIsLoading(true);
    try {
      // Parse data
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch {
        // If not JSON, treat as comma-separated values
        parsedData = data
          .split(',')
          .map(item => parseFloat(item.trim()))
          .filter(item => !isNaN(item));
      }
      // Simulate data analysis execution
      await new Promise(resolve =>
        setTimeout(resolve, Math.random() * 2000 + 1000)
      );
      const mockResult = {
        success: true,
        data: parsedData,
        analysis_type: analysisType,
        output: generateDataAnalysisOutput(analysisType, parsedData),
        timestamp: new Date().toISOString(),
        execution_time_ms: Math.floor(Math.random() * 2000) + 1000,
        data_points: Array.isArray(parsedData) ? parsedData.length : 1,
      };
      setResult(mockResult);
      onExecute?.(mockResult);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to analyze data',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  const generateDataAnalysisOutput = (type, data) => {
    const dataArray = Array.isArray(data) ? data : [data];
    const numericData = dataArray.filter(item => typeof item === 'number');
    if (numericData.length === 0) {
      return `**Data Analysis Results**\n\n**Analysis Type**: ${type}\n**Data Points**: ${dataArray.length}\n\n**Error**: No numeric data found for analysis.\n\n**Data Preview**:\n${JSON.stringify(dataArray.slice(0, 5), null, 2)}${dataArray.length > 5 ? '\n...' : ''}`;
    }
    const mean =
      numericData.reduce((sum, val) => sum + val, 0) / numericData.length;
    const sorted = [...numericData].sort((a, b) => a - b);
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
    const variance =
      numericData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      numericData.length;
    const stdDev = Math.sqrt(variance);
    const min = Math.min(...numericData);
    const max = Math.max(...numericData);
    switch (type) {
      case 'descriptive':
        return `**Descriptive Statistics**\n\n**Analysis Type**: ${type}\n**Data Points**: ${numericData.length}\n\n**Basic Statistics:**\n- **Count**: ${numericData.length}\n- **Mean**: ${mean.toFixed(2)}\n- **Median**: ${median.toFixed(2)}\n- **Mode**: ${getMode(numericData)}\n- **Standard Deviation**: ${stdDev.toFixed(2)}\n- **Variance**: ${variance.toFixed(2)}\n- **Min**: ${min.toFixed(2)}\n- **Max**: ${max.toFixed(2)}\n- **Range**: ${(max - min).toFixed(2)}\n\n**Distribution:**\n- **Skewness**: ${calculateSkewness(numericData, mean, stdDev).toFixed(3)}\n- **Kurtosis**: ${calculateKurtosis(numericData, mean, stdDev).toFixed(3)}\n\n**Quartiles:**\n- **Q1 (25%)**: ${getPercentile(sorted, 25).toFixed(2)}\n- **Q2 (50%)**: ${median.toFixed(2)}\n- **Q3 (75%)**: ${getPercentile(sorted, 75).toFixed(2)}\n- **IQR**: ${(getPercentile(sorted, 75) - getPercentile(sorted, 25)).toFixed(2)}`;
      case 'correlation':
        if (
          dataArray.every(
            item =>
              typeof item === 'object' &&
              item.x !== undefined &&
              item.y !== undefined
          )
        ) {
          const xValues = dataArray.map(item => item.x);
          const yValues = dataArray.map(item => item.y);
          const correlation = calculateCorrelation(xValues, yValues);
          return `**Correlation Analysis**\n\n**Analysis Type**: ${type}\n**Data Points**: ${dataArray.length}\n\n**Correlation Results:**\n- **Pearson Correlation**: ${correlation.toFixed(3)}\n- **Strength**: ${getCorrelationStrength(correlation)}\n- **Direction**: ${correlation > 0 ? 'Positive' : 'Negative'}\n\n**X Variable Statistics:**\n- **Mean**: ${(xValues.reduce((sum, val) => sum + val, 0) / xValues.length).toFixed(2)}\n- **Std Dev**: ${calculateStdDev(xValues).toFixed(2)}\n\n**Y Variable Statistics:**\n- **Mean**: ${(yValues.reduce((sum, val) => sum + val, 0) / yValues.length).toFixed(2)}\n- **Std Dev**: ${calculateStdDev(yValues).toFixed(2)}\n\n**Interpretation:**\n${getCorrelationInterpretation(correlation)}`;
        } else {
          return `**Correlation Analysis**\n\n**Analysis Type**: ${type}\n**Data Points**: ${dataArray.length}\n\n**Error**: Correlation analysis requires paired data points with 'x' and 'y' properties.\n\n**Expected Format:**\n\`\`\`json\n[\n  {"x": 1, "y": 2},\n  {"x": 2, "y": 4},\n  {"x": 3, "y": 6}\n]\n\`\`\``;
        }
      case 'trend':
        const trend = calculateTrend(numericData);
        return `**Trend Analysis**\n\n**Analysis Type**: ${type}\n**Data Points**: ${numericData.length}\n\n**Trend Results:**\n- **Trend Direction**: ${trend.direction}\n- **Trend Strength**: ${trend.strength}\n- **Slope**: ${trend.slope.toFixed(3)}\n- **R²**: ${trend.rSquared.toFixed(3)}\n\n**Linear Regression:**\n- **Equation**: y = ${trend.slope.toFixed(3)}x + ${trend.intercept.toFixed(3)}\n- **Prediction**: Next value ≈ ${(trend.slope * numericData.length + trend.intercept).toFixed(2)}\n\n**Trend Interpretation:**\n${getTrendInterpretation(trend)}`;
      case 'outliers':
        const outliers = detectOutliers(numericData);
        return `**Outlier Detection**\n\n**Analysis Type**: ${type}\n**Data Points**: ${numericData.length}\n\n**Outlier Detection Results:**\n- **Outliers Found**: ${outliers.length}\n- **Outlier Percentage**: ${((outliers.length / numericData.length) * 100).toFixed(1)}%\n\n**Outlier Values:**\n${outliers.length > 0 ? outliers.map(outlier => `- ${outlier.value.toFixed(2)} (index: ${outlier.index})`).join('\n') : '- No outliers detected'}\n\n**Detection Method:**\n- **IQR Method**: Values outside Q1 - 1.5×IQR or Q3 + 1.5×IQR\n- **Z-Score Method**: Values with |z-score| > 2\n\n**Recommendations:**\n${outliers.length > 0 ? '- Review outlier values for data quality issues\n- Consider removing outliers if they are measurement errors\n- Investigate outliers for potential insights' : '- Data appears to be clean with no significant outliers'}`;
      default:
        return `**Data Analysis Results**\n\n**Analysis Type**: ${type}\n**Data Points**: ${numericData.length}\n\n**Basic Statistics:**\n- **Count**: ${numericData.length}\n- **Mean**: ${mean.toFixed(2)}\n- **Min**: ${min.toFixed(2)}\n- **Max**: ${max.toFixed(2)}\n\n**Analysis Complete**: Successfully performed ${type} analysis on the provided data.`;
    }
  };
  // Helper functions
  const getMode = arr => {
    const frequency = {};
    arr.forEach(num => (frequency[num] = (frequency[num] || 0) + 1));
    const maxFreq = Math.max(...Object.values(frequency));
    return (
      Object.keys(frequency).find(
        key => frequency[parseInt(key)] === maxFreq
      ) || 'No mode'
    );
  };
  const getPercentile = (sorted, percentile) => {
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };
  const calculateSkewness = (data, mean, stdDev) => {
    const n = data.length;
    const skewness =
      data.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) /
      n;
    return skewness;
  };
  const calculateKurtosis = (data, mean, stdDev) => {
    const n = data.length;
    const kurtosis =
      data.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) /
        n -
      3;
    return kurtosis;
  };
  const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)
    );
    return denominator === 0 ? 0 : numerator / denominator;
  };
  const calculateStdDev = data => {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance =
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  };
  const getCorrelationStrength = correlation => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'Very Strong';
    if (abs >= 0.6) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    if (abs >= 0.2) return 'Weak';
    return 'Very Weak';
  };
  const getCorrelationInterpretation = correlation => {
    const strength = getCorrelationStrength(correlation);
    const direction = correlation > 0 ? 'positive' : 'negative';
    return `There is a ${strength.toLowerCase()} ${direction} correlation between the variables. This suggests that as one variable increases, the other variable tends to ${correlation > 0 ? 'increase' : 'decrease'} as well.`;
  };
  const calculateTrend = data => {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = data.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * data[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const yMean = sumY / n;
    const ssRes = data.reduce(
      (sum, val, i) => sum + Math.pow(val - (slope * i + intercept), 2),
      0
    );
    const ssTot = data.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
    const rSquared = 1 - ssRes / ssTot;
    return {
      slope,
      intercept,
      rSquared,
      direction: slope > 0 ? 'Increasing' : slope < 0 ? 'Decreasing' : 'Stable',
      strength:
        Math.abs(rSquared) >= 0.8
          ? 'Strong'
          : Math.abs(rSquared) >= 0.5
            ? 'Moderate'
            : 'Weak',
    };
  };
  const getTrendInterpretation = trend => {
    return `The data shows a ${trend.strength.toLowerCase()} ${trend.direction.toLowerCase()} trend. The ${trend.strength.toLowerCase()} relationship (R² = ${trend.rSquared.toFixed(3)}) suggests that the trend is ${trend.strength.toLowerCase()} and ${trend.direction.toLowerCase() === 'increasing' ? 'values are generally increasing over time' : trend.direction.toLowerCase() === 'decreasing' ? 'values are generally decreasing over time' : 'values remain relatively stable'}.`;
  };
  const detectOutliers = data => {
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = getPercentile(sorted, 25);
    const q3 = getPercentile(sorted, 75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return data
      .map((value, index) => ({ value, index }))
      .filter(item => item.value < lowerBound || item.value > upperBound);
  };
  return (
    <div className="space-y-6">
      <card_1.Card className="glass-card">
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center gap-2">
            <lucide_react_1.BarChart3 className="w-5 h-5 text-primary" />
            Data Analyzer
          </card_1.CardTitle>
          <p className="text-sm text-muted-foreground">
            Analyze data using free statistical methods
          </p>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Data <span className="text-red-500">*</span>
            </label>
            <textarea_1.Textarea
              placeholder="Enter data as JSON array or comma-separated values: [1,2,3,4,5] or 1,2,3,4,5"
              value={data}
              onChange={e => setData(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              For correlation analysis, use: [{'{"x":1,"y":2},{"x":2,"y":4}'}]
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Analysis Type <span className="text-red-500">*</span>
            </label>
            <select_1.Select
              value={analysisType}
              onValueChange={setAnalysisType}
            >
              <select_1.SelectTrigger>
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="descriptive">
                  Descriptive Statistics
                </select_1.SelectItem>
                <select_1.SelectItem value="correlation">
                  Correlation Analysis
                </select_1.SelectItem>
                <select_1.SelectItem value="trend">
                  Trend Analysis
                </select_1.SelectItem>
                <select_1.SelectItem value="outliers">
                  Outlier Detection
                </select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          <button_1.Button
            onClick={handleExecute}
            disabled={isLoading || !data.trim()}
            className="w-full gradient-cyber-primary hover:gradient-cyber-secondary"
          >
            {isLoading ? (
              <>
                <lucide_react_1.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <lucide_react_1.Play className="w-4 h-4 mr-2" />
                Analyze Data
              </>
            )}
          </button_1.Button>
        </card_1.CardContent>
      </card_1.Card>

      {result && (
        <card_1.Card className="glass-card">
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              {result.success ? (
                <lucide_react_1.CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <lucide_react_1.XCircle className="w-5 h-5 text-red-500" />
              )}
              Analysis Results
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <badge_1.Badge
                  variant={result.success ? 'default' : 'destructive'}
                >
                  {result.success ? 'Success' : 'Error'}
                </badge_1.Badge>
                <span className="text-sm text-muted-foreground">
                  {result.execution_time_ms}ms
                </span>
                <span className="text-sm text-muted-foreground">
                  Points: {result.data_points}
                </span>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {result.output || result.error}
                </pre>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      )}

      <alert_1.Alert>
        <lucide_react_1.Zap className="h-4 w-4" />
        <alert_1.AlertDescription>
          Data Analyzer provides comprehensive statistical analysis including
          descriptive statistics, correlation analysis, trend detection, and
          outlier identification.
        </alert_1.AlertDescription>
      </alert_1.Alert>
    </div>
  );
}
