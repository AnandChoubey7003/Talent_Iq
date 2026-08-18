import axiosInstance from "../lib/axios";

export async function reviewCode({ code, language, problemTitle, problemDescription }) {
  const response = await axiosInstance.post("/ai/review", {
    code,
    language,
    problemTitle,
    problemDescription,
  });
  return response.data;
}
