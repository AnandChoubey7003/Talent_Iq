import {
  CheckCircleIcon,
  ClockIcon,
  HardDriveIcon,
  CodeIcon,
  AlertTriangleIcon,
  LightbulbIcon,
  XIcon,
  Loader2Icon,
  SparklesIcon,
} from "lucide-react";

function ScoreBadge({ score }) {
  let colorClass = "badge-error";
  if (score >= 8) colorClass = "badge-success";
  else if (score >= 5) colorClass = "badge-warning";

  return <span className={`badge ${colorClass} badge-sm font-bold`}>{score}/10</span>;
}

function ReviewSection({ icon: Icon, title, children, iconColorClass = "text-primary" }) {
  return (
    <div className="bg-base-200 rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${iconColorClass}`} />
        <h4 className="font-semibold text-sm text-base-content">{title}</h4>
      </div>
      <div className="text-sm text-base-content/80 leading-relaxed">{children}</div>
    </div>
  );
}

function AIReviewPanel({ review, isLoading, error, errorMessage, onClose }) {
  if (!review && !isLoading && !error) return null;

  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 text-warning" />
          <span className="font-semibold text-sm">AI Code Review</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle">
            <XIcon className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-base-content/60 animate-pulse">
              Analyzing your code with AI...
            </p>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <AlertTriangleIcon className="w-4 h-4" />
            <span className="text-sm">{errorMessage || "Failed to generate review. Please try again."}</span>
          </div>
        )}

        {review && !isLoading && (
          <div className="space-y-3">
            {/* Overall Feedback */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-base-content leading-relaxed">
                {review.overallFeedback}
              </p>
            </div>

            {/* Correctness */}
            <ReviewSection
              icon={CheckCircleIcon}
              title="Correctness"
              iconColorClass="text-success"
            >
              <div className="flex items-center gap-2">
                <ScoreBadge score={review.correctness?.score} />
                <span>{review.correctness?.summary}</span>
              </div>
            </ReviewSection>

            {/* Time Complexity */}
            <ReviewSection icon={ClockIcon} title="Time Complexity" iconColorClass="text-info">
              <div>
                <code className="badge badge-outline badge-sm mr-2">
                  {review.timeComplexity?.notation}
                </code>
                <span>{review.timeComplexity?.explanation}</span>
              </div>
            </ReviewSection>

            {/* Space Complexity */}
            <ReviewSection
              icon={HardDriveIcon}
              title="Space Complexity"
              iconColorClass="text-secondary"
            >
              <div>
                <code className="badge badge-outline badge-sm mr-2">
                  {review.spaceComplexity?.notation}
                </code>
                <span>{review.spaceComplexity?.explanation}</span>
              </div>
            </ReviewSection>

            {/* Code Quality */}
            <ReviewSection icon={CodeIcon} title="Code Quality" iconColorClass="text-accent">
              <div className="flex items-center gap-2">
                <ScoreBadge score={review.codeQuality?.score} />
                <span>{review.codeQuality?.feedback}</span>
              </div>
            </ReviewSection>

            {/* Edge Cases */}
            {review.edgeCases?.length > 0 && (
              <ReviewSection
                icon={AlertTriangleIcon}
                title="Edge Cases"
                iconColorClass="text-warning"
              >
                <ul className="list-disc list-inside space-y-1">
                  {review.edgeCases.map((edgeCase, idx) => (
                    <li key={idx}>{edgeCase}</li>
                  ))}
                </ul>
              </ReviewSection>
            )}

            {/* Suggestions */}
            {review.suggestions?.length > 0 && (
              <ReviewSection
                icon={LightbulbIcon}
                title="Suggestions"
                iconColorClass="text-warning"
              >
                <ul className="space-y-2">
                  {review.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </ReviewSection>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIReviewPanel;
