// Code execution service using Judge0 CE API

const JUDGE0_API = "https://ce.judge0.com";

// Language IDs supported by Judge0 CE
const JUDGE0_LANGUAGES = {
  javascript: 93, // JavaScript (Node.js 18.15.0)
  python: 92,     // Python (3.11.2)
  java: 91,       // Java (JDK 17.0.6)
  c: 103,         // C (GCC 14.1.0)
  cpp: 105,       // C++ (GCC 14.1.0)
};

/**
 * @param {string} language - programming language key (javascript, python, java, c, cpp)
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageId = JUDGE0_LANGUAGES[language];

    if (!languageId) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    // In Judge0, Java expects the main class to be named "Main"
    let sourceCode = code;
    if (language === "java") {
      if (!sourceCode.includes("class Main") && /class\s+Solution\b/.test(sourceCode)) {
        sourceCode = sourceCode.replace(/class\s+Solution\b/, "public class Main");
      }
    }

    const response = await fetch(
      `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: sourceCode,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        success: false,
        error: `Code execution service error (${response.status}): ${errorText || response.statusText}`,
      };
    }

    const data = await response.json();

    const stdout = data.stdout || "";
    const stderr = data.stderr || "";
    const compileOutput = data.compile_output || "";
    const message = data.message || "";
    const statusId = data.status?.id;

    // Status ID 3 is "Accepted" (execution finished successfully)
    if (statusId === 3) {
      return {
        success: true,
        output: stdout || "No output",
      };
    }

    // Handle compilation or runtime errors
    const errorDetails =
      compileOutput ||
      stderr ||
      message ||
      data.status?.description ||
      "Execution error";

    return {
      success: false,
      output: stdout,
      error: errorDetails,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}
