import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, Download, Upload, FileText, Calculator, TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface DataAnalyzerAppProps {
  onExecute?: (data: any) => void;
}

export default function DataAnalyzerApp({ onExecute }: DataAnalyzerAppProps) {
  const [data, setData] = useState('');
  const [analysisType, setAnalysisType] = useState('descriptive');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!data.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Parse and validate data
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
      
      // Validate data
      if (Array.isArray(parsedData) && parsedData.length === 0) {
        throw new Error('No valid numeric data found. Please provide comma-separated numbers or valid JSON.');
      }
      
      // Try to use real API first, fallback to mock
      try {
        const apiResult = await apiClient.executeMCPTool('data-analyzer', {
          data: parsedData,
          analysisType,
          timestamp: new Date().toISOString()
        });
        
        setResult(apiResult);
        onExecute?.(apiResult);
      } catch (apiError) {
        console.warn('API call failed, using mock analysis:', apiError);
        
        // Fallback to mock analysis
        const mockResult = {
          success: true,
          data: {
            type: analysisType,
            input: parsedData,
            timestamp: new Date().toISOString(),
          },
          analysis: generateMockAnalysis(parsedData, analysisType),
        };
        
        setResult(mockResult);
        onExecute?.(mockResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalysis = (data: any, type: string) => {
    if (Array.isArray(data) && typeof data[0] === 'number') {
      const sorted = [...data].sort((a, b) => a - b);
      const sum = data.reduce((a, b) => a + b, 0);
      const mean = sum / data.length;
      const median = data.length % 2 === 0 
        ? (sorted[data.length / 2 - 1] + sorted[data.length / 2]) / 2
        : sorted[Math.floor(data.length / 2)];
      
      const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
      const stdDev = Math.sqrt(variance);
      
      return {
        descriptive: {
          count: data.length,
          sum,
          mean: Number(mean.toFixed(2)),
          median: Number(median.toFixed(2)),
          min: Math.min(...data),
          max: Math.max(...data),
          range: Math.max(...data) - Math.min(...data),
          variance: Number(variance.toFixed(2)),
          standardDeviation: Number(stdDev.toFixed(2)),
        },
        distribution: {
          quartiles: {
            q1: sorted[Math.floor(data.length * 0.25)],
            q2: median,
            q3: sorted[Math.floor(data.length * 0.75)],
          },
          skewness: calculateSkewness(data, mean, stdDev),
          kurtosis: calculateKurtosis(data, mean, stdDev),
        },
        trends: {
          trend: mean > median ? 'positive' : 'negative',
          volatility: stdDev / mean,
          outliers: data.filter(val => Math.abs(val - mean) > 2 * stdDev),
        },
      };
    }
    
    return {
      type: 'non-numeric',
      message: 'Data analysis for non-numeric data is not yet implemented.',
    };
  };

  const calculateSkewness = (data: number[], mean: number, stdDev: number) => {
    const n = data.length;
    const skewness = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0) / n;
    return Number(skewness.toFixed(3));
  };

  const calculateKurtosis = (data: number[], mean: number, stdDev: number) => {
    const n = data.length;
    const kurtosis = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;
    return Number(kurtosis.toFixed(3));
  };

  const exportResults = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-analysis-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Data Analyzer
          </CardTitle>
          <CardDescription>
            Analyze your data with statistical methods and generate insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Input</label>
            <Textarea
              placeholder="Enter your data here (comma-separated numbers or JSON array)..."
              value={data}
              onChange={(e) => setData(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Analysis Type</label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="descriptive">Descriptive Statistics</SelectItem>
                <SelectItem value="distribution">Distribution Analysis</SelectItem>
                <SelectItem value="trends">Trend Analysis</SelectItem>
                <SelectItem value="correlation">Correlation Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleExecute} 
            disabled={isLoading || !data.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Analyze Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analysis Results
              </span>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {result.data.type}
                </Badge>
                <Badge variant="outline">
                  {result.data.input.length} data points
                </Badge>
              </div>
              
              {result.analysis.descriptive && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {result.analysis.descriptive.mean}
                    </div>
                    <div className="text-sm text-muted-foreground">Mean</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {result.analysis.descriptive.median}
                    </div>
                    <div className="text-sm text-muted-foreground">Median</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {result.analysis.descriptive.standardDeviation}
                    </div>
                    <div className="text-sm text-muted-foreground">Std Dev</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {result.analysis.descriptive.range}
                    </div>
                    <div className="text-sm text-muted-foreground">Range</div>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                Analysis completed at: {new Date(result.data.timestamp).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}