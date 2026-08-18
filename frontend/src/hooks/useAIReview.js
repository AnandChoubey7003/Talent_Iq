import { useMutation } from "@tanstack/react-query";
import { reviewCode } from "../api/ai";

export function useAIReview() {
  return useMutation({
    mutationFn: reviewCode,
  });
}
