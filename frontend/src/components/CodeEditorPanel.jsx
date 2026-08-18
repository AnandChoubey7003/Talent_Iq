import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, SparklesIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onAIReview,
  isReviewing,
  hasOutput,
}) {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          {LANGUAGE_CONFIG[selectedLanguage]?.icon && (
            <img
              src={LANGUAGE_CONFIG[selectedLanguage].icon}
              alt={LANGUAGE_CONFIG[selectedLanguage]?.name || selectedLanguage}
              className="size-6 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <select className="select select-sm" value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {onAIReview && (
            <button
              className="btn btn-secondary btn-sm gap-2"
              disabled={!hasOutput || isReviewing || isRunning}
              onClick={onAIReview}
              title={!hasOutput ? "Run your code first to enable AI review" : "Get AI code review"}
            >
              {isReviewing ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Reviewing...
                </>
              ) : (
                <>
                  <SparklesIcon className="size-4" />
                  AI Review
                </>
              )}
            </button>
          )}

          <button className="btn btn-primary btn-sm gap-2" disabled={isRunning} onClick={onRunCode}>
            {isRunning ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="size-4" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
