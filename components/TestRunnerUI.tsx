import React, { useState, useEffect } from 'react';
import { runner } from '../lib/test-runner';

// Augment Window instead of redeclaring Jest globals to avoid type conflicts
declare global {
    interface Window {
        describe: any;
        it: any;
        test: any;
        expect: any;
    }
}

interface TestResult {
  suite: string;
  description: string;
  success: boolean;
  error?: string;
}

const TestRunnerUI: React.FC = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        const runTests = async () => {
            // Expose test functions globally for the test file to use
            (window as any).describe = runner.describe.bind(runner);
            (window as any).it = runner.it.bind(runner);
            // Assign runner.test directly. It is a pre-bound function with an .each property.
            // Using .bind() here would create a new function and strip the .each property.
            (window as any).test = runner.test;
            (window as any).expect = runner.expect.bind(runner);

            // Dynamically import the test file using a root-relative path ('/...')
            // to ensure the browser can find it regardless of the current page's path.
            // @ts-ignore - Vite resolves this at runtime in the browser
            await import('/calculation.test.ts');
            
            setResults([...runner.results]); // Create a new array to trigger re-render
            setIsRunning(false);
        };
        runTests();
        
        // Cleanup function to reset results if component unmounts
        return () => {
            runner.results = [];
        };
    }, []);

    const groupedResults = results.reduce((acc, result) => {
        (acc[result.suite] = acc[result.suite] || []).push(result);
        return acc;
    }, {} as { [suite: string]: TestResult[] });
    
    const totalTests = results.length;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    if (isRunning) {
        return <div className="text-center p-8">Futtatom a teszteket...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Tesztek Eredménye</h2>
            <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-md bg-gray-100 dark:bg-gray-900/50">
                <div className="text-gray-600 dark:text-gray-400">Összes teszt: <span className="font-bold text-gray-800 dark:text-gray-200">{totalTests}</span></div>
                <div className="text-green-700 dark:text-green-400">Sikeres: <span className="font-bold">{passedTests}</span></div>
                {failedTests > 0 && <div className="text-red-700 dark:text-red-400">Sikertelen: <span className="font-bold">{failedTests}</span></div>}
            </div>

            {Object.entries(groupedResults).map(([suite, tests]) => (
                <div key={suite} className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-gray-800 dark:text-gray-200">{suite}</h3>
                    <ul className="space-y-2">
                        {tests.map((result, index) => (
                            <li key={index} className={`p-3 rounded-md border ${result.success ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'}`}>
                                <div className="flex items-center">
                                    {result.success ? 
                                        (<span className="text-green-500 mr-2 font-bold">✓</span>) : 
                                        (<span className="text-red-500 mr-2 font-bold">✗</span>)
                                    }
                                    <span className="text-gray-700 dark:text-gray-300">{result.description}</span>
                                </div>
                                {!result.success && <pre className="mt-2 p-2 text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded whitespace-pre-wrap font-mono">{result.error}</pre>}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default TestRunnerUI;