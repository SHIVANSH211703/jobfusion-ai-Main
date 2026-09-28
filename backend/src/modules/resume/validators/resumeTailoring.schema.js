const { z } = require("zod");

const sectionSuggestionsSchema = z.array(z.object({
  index: z.number().int().min(0),
  description: z.string().max(10000),
})).max(50);

const resumeTailoringSchema = z.object({
  summary: z.string().max(2000),
  experience: sectionSuggestionsSchema,
  projects: sectionSuggestionsSchema,
  achievements: sectionSuggestionsSchema,
  changes: z.array(z.string().trim().min(1)).max(40),
});

const parseResumeTailoring = (value, sourceResume) => {
  const result = resumeTailoringSchema.safeParse(value);
  if (!result.success) {
    const error = new Error("AI provider returned invalid resume tailoring suggestions.");
    error.statusCode = 502;
    throw error;
  }

  const suggestions = result.data;
  const sourceSections = {
    experience: sourceResume.experience || [],
    projects: sourceResume.projects || [],
    achievements: sourceResume.achievements || [],
  };

  for (const [section, entries] of Object.entries(sourceSections)) {
    const proposed = suggestions[section];
    if (proposed.length !== entries.length || proposed.some((item, index) => item.index !== index)) {
      const error = new Error("AI provider returned suggestions outside the source resume sections.");
      error.statusCode = 502;
      throw error;
    }
  }

  return suggestions;
};

module.exports = { resumeTailoringSchema, parseResumeTailoring };