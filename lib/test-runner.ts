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

  // Alias `test` to `it` for Jest compatibility
  test(description: string, callback: () => void) {
      this.it(description, callback);
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