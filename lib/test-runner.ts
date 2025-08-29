// A very simple test runner and assertion library
// to run tests in the browser.

interface TestResult {
  suite: string;
  description: string;
  success: boolean;
  error?: string;
}

class TestRunner {
  results: TestResult[] = [];
  currentSuite: string = '';
  // This property will hold the test function and its .each method
  test: ((description: string, callback: () => void) => void) & { each: (cases: any[][]) => (description: string, callback: (...args: any[]) => void) => void; };

  constructor() {
    // In the constructor, we create the `test` function.
    // It's the `it` method bound to the current instance.
    // We then attach the `each` method to it.
    this.test = this.it.bind(this) as any;
    this.test.each = this.each.bind(this);
  }

  describe(suiteName: string, callback: () => void) {
    this.currentSuite = suiteName;
    callback();
    this.currentSuite = '';
  }

  it(description: string, callback: () => void) {
    try {
      callback();
      this.results.push({
        suite: this.currentSuite,
        description,
        success: true,
      });
    } catch (e: any) {
      this.results.push({
        suite: this.currentSuite,
        description,
        success: false,
        error: e.message,
      });
    }
  }

  // Implementation of .each
  each(cases: any[][]) {
    return (description: string, callback: (...args: any[]) => void) => {
        cases.forEach(caseArgs => {
            const formatArgs = [...caseArgs];
            const formattedDescription = description.replace(/%[sifd]/g, (match) => {
                const arg = formatArgs.shift();
                return arg !== undefined ? String(arg) : match;
            });

            // For each case, call `it` with the formatted description
            this.it(formattedDescription, () => callback(...caseArgs));
        });
    };
  }

  expect(actual: any) {
    return {
      toEqual: (expected: any) => {
        // Using JSON.stringify for a simple deep comparison, sufficient for this app's data structures.
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        
        if (actualStr !== expectedStr) {
          throw new Error(`Expected: ${expectedStr}\nReceived: ${actualStr}`);
        }
      },
      // You could add other common matchers here if needed, e.g., toBeTruthy, toContain
    };
  }
}

export const runner = new TestRunner();
