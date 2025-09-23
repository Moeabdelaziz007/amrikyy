import { useState } from 'react';
import { Calculator, History, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AICalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string
  ): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;

      setHistory(prev => [calculation, ...prev.slice(0, 9)]);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const buttons = [
    {
      label: 'C',
      onClick: clear,
      className: 'bg-destructive/20 hover:bg-destructive/30',
    },
    {
      label: '⌫',
      onClick: () => setDisplay(display.slice(0, -1) || '0'),
      className: 'bg-secondary/20',
    },
    {
      label: '÷',
      onClick: () => inputOperation('÷'),
      className: 'bg-primary/20',
    },
    {
      label: '×',
      onClick: () => inputOperation('×'),
      className: 'bg-primary/20',
    },

    {
      label: '7',
      onClick: () => inputNumber('7'),
      className: 'bg-glass-secondary',
    },
    {
      label: '8',
      onClick: () => inputNumber('8'),
      className: 'bg-glass-secondary',
    },
    {
      label: '9',
      onClick: () => inputNumber('9'),
      className: 'bg-glass-secondary',
    },
    {
      label: '-',
      onClick: () => inputOperation('-'),
      className: 'bg-primary/20',
    },

    {
      label: '4',
      onClick: () => inputNumber('4'),
      className: 'bg-glass-secondary',
    },
    {
      label: '5',
      onClick: () => inputNumber('5'),
      className: 'bg-glass-secondary',
    },
    {
      label: '6',
      onClick: () => inputNumber('6'),
      className: 'bg-glass-secondary',
    },
    {
      label: '+',
      onClick: () => inputOperation('+'),
      className: 'bg-primary/20',
    },

    {
      label: '1',
      onClick: () => inputNumber('1'),
      className: 'bg-glass-secondary',
    },
    {
      label: '2',
      onClick: () => inputNumber('2'),
      className: 'bg-glass-secondary',
    },
    {
      label: '3',
      onClick: () => inputNumber('3'),
      className: 'bg-glass-secondary',
    },
    {
      label: '=',
      onClick: performCalculation,
      className: 'bg-gradient-primary hover:opacity-90 row-span-2',
    },

    {
      label: '0',
      onClick: () => inputNumber('0'),
      className: 'bg-glass-secondary col-span-2',
    },
    {
      label: '.',
      onClick: () =>
        setDisplay(display.includes('.') ? display : display + '.'),
      className: 'bg-glass-secondary',
    },
  ];

  return (
    <div className="h-full flex bg-gradient-to-br from-orange-900/20 to-red-900/20">
      {/* Calculator */}
      <div className="flex-1 p-4">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">AI Calculator</h2>
            <p className="text-sm text-muted-foreground">
              Smart calculations made easy
            </p>
          </div>
        </div>

        <Card className="glass border-white/20">
          <CardHeader>
            <div className="text-right">
              <div className="text-3xl font-mono min-h-[2rem] break-all">
                {display}
              </div>
              {operation && previousValue !== null && (
                <div className="text-sm text-muted-foreground">
                  {previousValue} {operation}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  onClick={button.onClick}
                  className={`h-12 ${button.className}`}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <div className="w-80 glass border-l border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">History</h3>
          </div>
          <Button
            onClick={clearHistory}
            variant="outline"
            size="sm"
            className="glass border-white/20"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No calculations yet</p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="p-2 glass border border-white/10 rounded text-sm font-mono"
              >
                {item}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
