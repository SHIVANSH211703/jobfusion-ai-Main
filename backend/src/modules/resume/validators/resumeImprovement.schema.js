const { z } = require("zod");

const improvementSchema = z.object({
  summary: z.string().max(2000),
  experience: z.array(z.object({ description: z.string().max(10000) }).passthrough()).max(50),
  projects: z.array(z.object({ description: z.string().max(10000) }).passthrough()).max(50),
  skills: z.array(z.string().trim().min(1)).max(100),
  achievements: z.array(z.object({ description: z.string().max(5000) }).passthrough()).max(50),
  changes: z.array(z.string().trim().min(1)).max(40),
});

const parseResumeImprovement = (value, sourceResume) => {
  const result = improvementSchema.safeParse(value);
  if (!result.success) {
    const error = new Error("AI provider returned invalid resume improvements.");
    error.statusCode = 502;
    throw error;
  }

  const suggestion = result.data;
  const sections = ["experience", "projects", "achievements"];
  for (const section of sections) {
    if (suggestion[section].length !== (sourceResume[section] || []).length) {
      const error = new Error("AI provider changed the number of existing resume entries.");
      error.statusCode = 502;
      throw error;
    }
  }

  const sourceSkills = new Set((sourceResume.skills || []).map((skill) => skill.toLowerCase().trim()));
  if (suggestion.skills.some((skill) => !sourceSkills.has(skill.toLowerCase().trim()))) {
    const error = new Error("AI provider added skills not present in the source resume.");
    error.statusCode = 502;
    throw error;
  }

  return {
    summary: suggestion.summary,
    experience: (sourceResume.experience || []).map((item, index) => ({
      ...item,
      description: suggestion.experience[index].description,
    })),
    projects: (sourceResume.projects || []).map((item, index) => ({
      ...item,
      description: suggestion.projects[index].description,
    })),
    skills: sourceResume.skills || [],
    achievements: (sourceResume.achievements || []).map((item, index) => ({
      ...item,
      description: suggestion.achievements[index].description,
    })),
    changes: suggestion.changes,
  };
};

module.exports = { improvementSchema, parseResumeImprovement };