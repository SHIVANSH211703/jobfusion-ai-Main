const axios = require("axios");

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = "https://openrouter.ai/api/v1/chat/completions";
    this.model = "meta-llama/llama-3.3-70b-instruct";
  }

  async parseResume(resumeText) {
    const prompt = `
You are an expert ATS Resume Parser.

Extract the resume into structured JSON.

Return ONLY valid JSON.

DO NOT:
- Wrap the response in markdown
- Use \`\`\`json
- Add explanations
- Add extra text

Return JSON in this format only:

{
  "title":"",
  "personalInfo":{
    "fullName":"",
    "email":"",
    "phone":"",
    "location":"",
    "linkedin":"",
    "github":"",
    "portfolio":""
  },
  "summary":"",
  "education":[],
  "experience":[],
  "projects":[],
  "skills":[],
  "certifications":[],
  "languages":[],
  "achievements":[],
  "customSections":[]
}

Resume:

${resumeText}
`;

    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: this.model,
          temperature: 0,
          messages: [
            {
              role: "system",
              content:
                "You are an expert ATS Resume Parser. Return ONLY valid JSON. Never use markdown or code blocks.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "JobFusion AI",
          },
        }
      );

      const content = response.data.choices[0].message.content;

      console.log("\n========== RAW AI RESPONSE ==========");
      console.log(content);
      console.log("=====================================\n");

      const cleanedContent = content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error("\n========== AI ERROR ==========");
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("Message:", error.message);
      console.error("==============================\n");

      throw error;
    }
  }

  async analyzeResume(resumeData) {
  const prompt = `
You are a Senior ATS Resume Reviewer with 15+ years of experience helping candidates pass ATS systems such as Greenhouse, Lever, Workday, Taleo, iCIMS, and SuccessFactors.

Your job is to evaluate the resume exactly like an ATS and an experienced recruiter.

Evaluate the following areas:

1. ATS Compatibility
2. Resume Structure
3. Professional Summary
4. Technical Skills
5. Work Experience
6. Projects
7. Education
8. Certifications
9. Achievements
10. Keywords
11. Readability
12. Overall Recruiter Impression

Scoring Guidelines:

90-100 = Excellent
80-89 = Very Good
70-79 = Good
60-69 = Needs Improvement
Below 60 = Poor

Resume:

${JSON.stringify(resumeData, null, 2)}

Return ONLY valid JSON.

{
  "score": 0,
  "aiSummary": "",
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}

Rules:

- Return ONLY JSON.
- Do not use markdown.
- Do not use code blocks.
- Score must be between 0 and 100.
- aiSummary must be 3-5 professional sentences.
- strengths must contain exactly 5 points.
- weaknesses must contain exactly 5 points.
- recommendations must contain exactly 5 actionable improvements.
- Never mention missing information if the resume already contains it.
- Base every suggestion strictly on the provided resume.
- Do not invent missing fields.
`;

  try {
    const response = await axios.post(
      this.baseURL,
      {
        model: this.model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are an expert ATS Resume Reviewer. Return ONLY valid JSON. Never use markdown or explanations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "JobFusion AI",
        },
      }
    );

    const content = response.data.choices[0].message.content;

    console.log("\n========== ATS AI RESPONSE ==========");
    console.log(content);
    console.log("=====================================\n");

    const cleanedContent = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error("\n========== ATS AI ERROR ==========");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    console.error("==================================\n");

    throw error;
  }
}

async improveResume(resumeData) {
  const prompt = `
You are a professional resume writer with 15+ years of experience helping candidates land jobs at Google, Microsoft, Amazon, Meta and other top companies.

Your task is to improve this resume.

Improve:

1. Professional Summary
2. Experience
3. Projects
4. Skills
5. Achievements

DO NOT change:

- Name
- Email
- Phone
- Education
- Dates
- Company names

Rules:

- Make every sentence ATS friendly.
- Use strong action verbs.
- Improve grammar.
- Improve readability.
- Add professional wording.
- Keep all information truthful.
- Do not invent experience.
- Do not invent companies.
- Do not invent achievements.

Resume:

${JSON.stringify(resumeData, null, 2)}

Return ONLY JSON.

{
  "summary":"",
  "experience":[],
  "projects":[],
  "skills":[],
  "achievements":[],
  "changes":[]
}
`;

  try {
    const response = await axios.post(
      this.baseURL,
      {
        model: this.model,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer. Return ONLY JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "JobFusion AI",
        },
      }
    );

    const content = response.data.choices[0].message.content;

    console.log(content);

    const cleaned = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
}

async matchResumeWithJobDescription(resumeData, jobDescription) {
  const prompt = `
You are an expert ATS recruiter and resume reviewer.

Compare the candidate's resume with the provided job description.

Rules:
- Use ONLY the information present in the resume and job description.
- Do NOT invent skills, experience, companies, or certifications.
- Do NOT penalize the resume for information that is not required by the job description.
- Return ONLY valid JSON.
- Match score must be between 0 and 100.
- Recommendations should be actionable.
- Extract keywords intelligently.

Resume:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Return ONLY this JSON format:

{
  "matchScore": 0,
  "matchedKeywords": [],
  "missingKeywords": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}
`;

  try {
    const response = await axios.post(
      this.baseURL,
      {
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "You are an ATS Resume Matching Expert. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    let content = response.data.choices[0].message.content.trim();

    // Remove markdown if present
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(content);
  } catch (error) {
    console.error("Job Match AI Error:", error.response?.data || error.message);
    throw new Error("Failed to analyze job match.");
  }
}

async generateCoverLetter(
  resumeData,
  jobDescription,
  tone = "professional"
) {
  const prompt = `
You are an expert HR recruiter and professional resume writer.

Generate a personalized cover letter based ONLY on the candidate's resume and the provided job description.

Tone:
${tone}

Rules:

- Use ONLY information available in the resume.
- Never invent companies, skills, achievements or experience.
- Tailor the cover letter according to the job description.
- Mention the most relevant experience.
- Keep it concise (300-400 words).
- Make it ATS-friendly.
- Use professional grammar.
- Return ONLY valid JSON.

Resume:

${JSON.stringify(resumeData, null, 2)}

Job Description:

${jobDescription}

Return ONLY this JSON:

{
  "coverLetter": ""
}
`;

  try {
    const response = await axios.post(
      this.baseURL,
      {
        model: this.model,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are an expert cover letter writer. Return ONLY valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "JobFusion AI",
        },
      }
    );

    let content = response.data.choices[0].message.content.trim();

    console.log("\n========== COVER LETTER AI RESPONSE ==========");
    console.log(content);
    console.log("==============================================\n");

    content = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(content);
  } catch (error) {
    console.error("\n========== COVER LETTER AI ERROR ==========");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    console.error("===========================================\n");

    throw new Error("Failed to generate cover letter.");
  }
}

}

module.exports = new AIService();