const axios = require("axios");
const { parseResumeAnalysis } = require("../modules/resume/validators/resumeAnalysis.schema");
const { parseResumeTailoring } = require("../modules/resume/validators/resumeTailoring.schema");
const { parseJobMatch } = require("../modules/jobs/validators/jobMatch.schema");
const { parseInterviewPrep } = require("../modules/interviews/validators/interviewPrep.schema");
const { parseCareerGap } = require("../modules/resume/validators/careerGap.schema");
const { parseResumeImprovement } = require("../modules/resume/validators/resumeImprovement.schema");

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = "https://openrouter.ai/api/v1/chat/completions";
    this.model = "meta-llama/llama-3.3-70b-instruct";
    this.client = axios.create({ timeout: 45000 });
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
      const response = await this.client.post(
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

      const cleanedContent = content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error("Resume parsing provider request failed", {
        status: error.response?.status,
        code: error.code,
      });

      throw error;
    }
  }

  async analyzeResume(resumeData, jobDescription) {
    if (!this.apiKey) {
      const error = new Error("Resume analysis is not configured.");
      error.statusCode = 503;
      throw error;
    }

    const normalizedJobDescription = jobDescription?.trim() || "";
    const jobContextRules = normalizedJobDescription
      ? `Compare the resume with this job description. Populate matchedKeywords, missingKeywords, and jobSpecificRecommendations using only the supplied resume and job description.\n\nJob description:\n${normalizedJobDescription}`
      : "No target job was provided. Return empty arrays for matchedKeywords, missingKeywords, and jobSpecificRecommendations. Do not make job-specific claims.";

    const prompt = `
Evaluate the supplied resume for ATS readiness. Use only evidence present in the resume. Do not invent skills, experience, credentials, or outcomes.

Give one overall score and separate 0-100 scores for keyword coverage, skills, experience, education, formatting, and impact. If the resume does not provide evidence for a category, score only what is present and explain the limitation in weaknesses; do not invent facts.

${jobContextRules}

Resume:
${JSON.stringify(resumeData, null, 2)}

Return only valid JSON with this shape:
{
  "score": 0,
  "aiSummary": "",
  "categories": {
    "keywords": 0,
    "skills": 0,
    "experience": 0,
    "education": 0,
    "formatting": 0,
    "impact": 0
  },
  "matchedKeywords": [],
  "missingKeywords": [],
  "jobSpecificRecommendations": [],
  "weakSections": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}

All scores must be numbers from 0 to 100. Arrays must contain concise strings. Recommendations must be actionable and supported by the source content. The summary should be 3-5 sentences. Do not use markdown or add text outside the JSON object.
`;

    try {
      const response = await this.client.post(
        this.baseURL,
        {
          model: this.model,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: "Return an evidence-based resume analysis as valid JSON only.",
            },
            { role: "user", content: prompt },
          ],
        },
        {
          timeout: 45000,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "JobFusion AI",
          },
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        const error = new Error("AI provider returned an empty analysis.");
        error.statusCode = 502;
        throw error;
      }

      const cleanedContent = content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      return parseResumeAnalysis(JSON.parse(cleanedContent));
    } catch (error) {
      console.error("Resume analysis provider request failed", {
        status: error.response?.status,
        code: error.code,
      });

      if (error.statusCode) {
        throw error;
      }

      const providerError = new Error(
        error.code === "ECONNABORTED"
          ? "Resume analysis timed out. Please try again."
          : "Unable to analyze this resume right now. Please try again."
      );
      providerError.statusCode = error.response?.status === 429 ? 429 : 502;
      throw providerError;
    }
  }

  async tailorResume(resumeData, jobDescription) {
    if (!this.apiKey) {
      const error = new Error("Resume tailoring is not configured.");
      error.statusCode = 503;
      throw error;
    }

    const prompt = `
Suggest wording improvements for this resume against the supplied job description.
Do not invent skills, responsibilities, metrics, companies, projects, awards, education, or credentials. Preserve all names, dates, technologies, and factual claims. Only return rewritten summary and descriptions for the existing experience, projects, and achievements at their original indexes. If source text has no factual detail, return it unchanged.

Resume:
${JSON.stringify(resumeData, null, 2)}

Job description:
${jobDescription}

Return JSON only in this shape:
{
  "summary": "",
  "experience": [{ "index": 0, "description": "" }],
  "projects": [{ "index": 0, "description": "" }],
  "achievements": [{ "index": 0, "description": "" }],
  "changes": []
}

Include exactly one indexed item for each source entry in the three arrays, in the same order. Use empty arrays when the source section is empty. Do not return any additional resume fields.
`;

    try {
      const response = await this.client.post(
        this.baseURL,
        {
          model: this.model,
          temperature: 0.2,
          messages: [
            { role: "system", content: "Return only grounded resume wording suggestions as valid JSON." },
            { role: "user", content: prompt },
          ],
        },
        {
          timeout: 45000,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "JobFusion AI",
          },
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        const error = new Error("AI provider returned empty tailoring suggestions.");
        error.statusCode = 502;
        throw error;
      }
      const cleanedContent = content.replace(/```json/gi, "").replace(/```/g, "").trim();
      return parseResumeTailoring(JSON.parse(cleanedContent), resumeData);
    } catch (error) {
      console.error("Resume tailoring provider request failed", {
        status: error.response?.status,
        code: error.code,
      });
      if (error.statusCode) throw error;
      const providerError = new Error(
        error.code === "ECONNABORTED"
          ? "Resume tailoring timed out. Please try again."
          : "Unable to tailor this resume right now. Please try again."
      );
      providerError.statusCode = error.response?.status === 429 ? 429 : 502;
      throw providerError;
    }
  }

  async prepareForInterview({ job, resume }) {
    if (!this.apiKey) {
      const error = new Error("Interview preparation is not configured.");
      error.statusCode = 503;
      throw error;
    }

    const prompt = `
Create interview preparation questions based specifically on this job and the candidate's applied resume. Do not assume skills or experience that are not explicitly present. Questions must be relevant to the role and evidence. Provide fewer questions rather than generic filler when context is limited.

Job:
${JSON.stringify({ title: job.title, company: job.company, description: job.description, skills: job.skills }, null, 2)}

Applied resume:
${JSON.stringify({ summary: resume.summary, skills: resume.skills, experience: resume.experience, projects: resume.projects, education: resume.education }, null, 2)}

Return only JSON with these arrays: technicalQuestions, behavioralQuestions, resumeQuestions, jobSpecificQuestions. Each item must have "question" and "context" strings. Context must cite the supplied resume/job detail that makes the question relevant. Do not include answers or invent a requirement.
`;

    try {
      const response = await this.client.post(
        this.baseURL,
        {
          model: this.model,
          temperature: 0.4,
          messages: [
            { role: "system", content: "Generate grounded interview preparation as valid JSON only." },
            { role: "user", content: prompt },
          ],
        },
        {
          timeout: 45000,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "JobFusion AI",
          },
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        const error = new Error("AI provider returned empty interview preparation.");
        error.statusCode = 502;
        throw error;
      }
      const cleanedContent = content.replace(/```json/gi, "").replace(/```/g, "").trim();
      return parseInterviewPrep(JSON.parse(cleanedContent));
    } catch (error) {
      console.error("Interview preparation provider request failed", {
        status: error.response?.status,
        code: error.code,
      });
      if (error.statusCode) throw error;
      const providerError = new Error(
        error.code === "ECONNABORTED"
          ? "Interview preparation timed out. Please try again."
          : "Unable to prepare interview questions right now. Please try again."
      );
      providerError.statusCode = error.response?.status === 429 ? 429 : 502;
      throw providerError;
    }
  }

  async analyzeCareerGap({ targetRole, profile, resume, jobEvidence }) {
    if (!this.apiKey) {
      const error = new Error("Career analysis is not configured.");
      error.statusCode = 503;
      throw error;
    }

    const evidenceText = JSON.stringify({ profile, resume });
    const prompt = `
Compare this user's actual profile and resume with the selected target role and supplied stored job requirements. Do not infer a missing skill if it is already present in the profile or resume. Only report skill gaps supported by the supplied job requirements. When no stored job requirements are supplied, leave missingSkills empty and make the limited evidence clear in experienceGaps.

Target role: ${targetRole}
Profile and resume:
${evidenceText}

Stored job requirements:
${JSON.stringify(jobEvidence, null, 2)}

Return only JSON with arrays: strongSkills, skillsToImprove, missingSkills, experienceGaps, learningTopics, roadmap. Each roadmap item must contain focus, reason, relatedGap. Do not fabricate credentials, employment, or completed learning.
`;

    try {
      const response = await this.client.post(
        this.baseURL,
        {
          model: this.model,
          temperature: 0.2,
          messages: [
            { role: "system", content: "Return only evidence-based career gap analysis as valid JSON." },
            { role: "user", content: prompt },
          ],
        },
        {
          timeout: 45000,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "JobFusion AI",
          },
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        const error = new Error("AI provider returned empty career analysis.");
        error.statusCode = 502;
        throw error;
      }
      const cleanedContent = content.replace(/```json/gi, "").replace(/```/g, "").trim();
      return parseCareerGap(JSON.parse(cleanedContent), evidenceText);
    } catch (error) {
      console.error("Career analysis provider request failed", {
        status: error.response?.status,
        code: error.code,
      });
      if (error.statusCode) throw error;
      const providerError = new Error(
        error.code === "ECONNABORTED"
          ? "Career analysis timed out. Please try again."
          : "Unable to analyze career gaps right now. Please try again."
      );
      providerError.statusCode = error.response?.status === 429 ? 429 : 502;
      throw providerError;
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
    const response = await this.client.post(
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

    const cleaned = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return parseResumeImprovement(JSON.parse(cleaned), resumeData);
  } catch (error) {
    console.error("Resume improvement provider request failed", {
      status: error.response?.status,
      code: error.code,
    });
    throw error;
  }
}

async matchResumeWithJobDescription(
  resumeData,
  jobDescription
) {
  const prompt = `
You are an expert ATS recruiter and resume reviewer.

Compare the candidate's resume with the provided job description.

Rules:
- Use ONLY the information present in the resume and job description.
- Do NOT invent skills, experience, companies, or certifications.
- Do NOT penalize the resume for information that is not required by the job description.
- Return ONLY valid JSON.
- Match score must be between 0 and 100.
- Provide separate 0-100 scores for skills, experience, education, and keywords.
- Set location score to null when either side has no usable location data.
- List matchedSkills and missingSkills using only explicit job requirements and resume evidence.
- Recommendations should be actionable.
- Extract keywords intelligently.

Resume:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Return ONLY this JSON format:

{
  "matchScore": 0,
  "categories": {
    "skills": 0,
    "experience": 0,
    "education": 0,
    "keywords": 0,
    "location": null
  },
  "matchedSkills": [],
  "missingSkills": [],
  "matchedKeywords": [],
  "missingKeywords": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}
`;

  try {
    if (!this.apiKey) {
      throw new Error(
        "OPENROUTER_API_KEY is not configured"
      );
    }

    const response = await this.client.post(
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
        timeout: 45000,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "JobFusion AI",
        },
      }
    );

    const content =
      response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        "OpenRouter returned an empty response"
      );
    }

    const cleanedContent = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return parseJobMatch(JSON.parse(cleanedContent));
    } catch (parseError) {
      if (parseError.statusCode) {
        throw parseError;
      }
      throw new Error(
        "AI provider returned an invalid job match analysis."
      );
    }
  } catch (error) {
    console.error("Job match provider request failed", {
      status: error.response?.status,
      code: error.code,
    });

    throw error;
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
    const response = await this.client.post(
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

    content = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(content);
  } catch (error) {
    console.error("Cover letter provider request failed", {
      status: error.response?.status,
      code: error.code,
    });

    throw new Error("Failed to generate cover letter.");
  }
}

}

module.exports = new AIService();