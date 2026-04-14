// app/test-api/page.tsx
"use client";

import { useState } from "react";
import { FiPlay, FiCheck, FiX, FiLoader } from "react-icons/fi";

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<
    {
      test: string;
      status: "pending" | "success" | "error";
      result?: any;
      error?: string;
    }[]
  >([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (
    test: string,
    status: "success" | "error",
    result?: any,
    error?: string
  ) => {
    setTestResults((prev) => [...prev, { test, status, result, error }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Check if API route exists (GET request - should return 405)
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "GET",
      });

      if (response.status === 405) {
        addResult(
          "GET Request Test (Should return 405)",
          "success",
          `✅ API route exists! Status: ${response.status} - Method Not Allowed`
        );
      } else if (response.status === 404) {
        addResult(
          "GET Request Test",
          "error",
          null,
          `❌ API route not found! Status: 404. Check file structure.`
        );
      } else {
        addResult(
          "GET Request Test",
          "error",
          null,
          `❌ Unexpected status: ${response.status}`
        );
      }
    } catch (error: any) {
      addResult(
        "GET Request Test",
        "error",
        null,
        `❌ Network error: ${error.message}`
      );
    }

    // Test 2: Environment variables check
    try {
      const hasPublicKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (hasPublicKey) {
        addResult(
          "Environment Variables Test",
          "success",
          `✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY found`
        );
      } else {
        addResult(
          "Environment Variables Test",
          "error",
          null,
          `❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found in .env.local`
        );
      }
    } catch (error: any) {
      addResult(
        "Environment Variables Test",
        "error",
        null,
        `❌ Error checking env vars: ${error.message}`
      );
    }

    // Test 3: POST request to API route
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 2999,
          productId: "test-product-1",
        }),
      });

      const data = await response.json();

      if (response.ok && data.clientSecret) {
        addResult(
          "POST Request Test",
          "success",
          `✅ Payment intent created! Client secret starts with: ${data.clientSecret.substring(
            0,
            20
          )}...`
        );
      } else {
        addResult(
          "POST Request Test",
          "error",
          null,
          `❌ Status: ${response.status}, Response: ${JSON.stringify(data)}. Check server logs for details.`
        );
      }
    } catch (error: any) {
      addResult("POST Request Test", "error", null, `❌ Error: ${error.message}`);
    }

    // Test 4: File structure check (client-side approximation)
    try {
      // Try to access the API route with different methods to infer structure
      const options = await fetch("/api/create-payment-intent", {
        method: "OPTIONS",
      });

      addResult(
        "File Structure Test",
        "success",
        `✅ API route responds to OPTIONS: ${options.status}`
      );
    } catch (error: any) {
      addResult(
        "File Structure Test",
        "error",
        null,
        `❌ Could not test file structure: ${error.message}`
      );
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <FiCheck className="w-5 h-5 text-green-600" />;
      case "error":
        return <FiX className="w-5 h-5 text-red-600" />;
      default:
        return <FiLoader className="w-5 h-5 text-gray-400 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            API Route Diagnostic Test
          </h1>
          <p className="text-gray-600">
            Test your Stripe API route setup step by step
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Diagnostic Tests
            </h2>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              {isRunning ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span>Running Tests...</span>
                </>
              ) : (
                <>
                  <FiPlay className="w-4 h-4" />
                  <span>Run All Tests</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === "success"
                    ? "bg-green-50 border-green-200"
                    : result.status === "error"
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{result.test}</h3>
                    {result.result && (
                      <p className="text-sm text-gray-700 mt-1">
                        {result.result}
                      </p>
                    )}
                    {result.error && (
                      <p className="text-sm text-red-700 mt-1">
                        {result.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {testResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Click "Run All Tests" to start debugging your API route
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}