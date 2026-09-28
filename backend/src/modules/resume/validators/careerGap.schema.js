const { z } = require("zod");

const careerGapSchema = z.object({
  strongSkills: z.array(z.string().trim().min(1)).max(30),
  skillsToImprove: z.array(z.string().trim().min(1)).max(30),
  missingSkills: z.array(z.string().trim().min(1)).max(30),
  experienceGaps: z.array(z.string().trim().min(1)).max(20),
  learningTopics: z.array(z.string().trim().min(1)).max(30),
  roadmap: z.array(z.object({
    focus: z.string().trim().min(1).max(160),
    reason: z.string().trim().min(1).max(500),
    relatedGap: z.string().trim().min(1).max(160),
  })).max(12),
});

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9+#. ]/g, " ").replace(/\s+/g, " ").trim();

const filterExistingSkillsFromGaps = (analysis, profileAndResumeText) => {
  const evidence = ` ${normalize(profileAndResumeText)} `;
  const hasEvidence = (skill) => {
    const normalizedSkill = normalize(skill);
    return evidence.includes(` ${normalizedSkill} `);
  };
  const missingSkills = analysis.missingSkills.filter((skill) => !hasEvidence(skill));
  const missingKeys = new Set(missingSkills.map(normalize));
  const evidencedStrongSkills = analysis.strongSkills.filter(hasEvidence);
  const strongSkills = new Set(evidencedStrongSkills.map(normalize));
  const skillsToImprove = analysis.skillsToImprove.filter(
    (skill) => hasEvidence(skill) && !strongSkills.has(normalize(skill))
  );
  const validRoadmap = analysis.roadmap.filter((step) => {
    const gap = normalize(step.relatedGap);
    return missingKeys.has(gap) || skillsToImprove.some((skill) => normalize(skill) === gap);
  });

  return {
    ...analysis,
    strongSkills: evidencedStrongSkills,
    missingSkills,
    skillsToImprove,
    roadmap: validRoadmap,
  };
};

const parseCareerGap = (value, evidence) => {
  const result = careerGapSchema.safeParse(value);
  if (!result.success) {
    const error = new Error("AI provider returned invalid career gap analysis.");
    error.statusCode = 502;
    throw error;
  }
  return filterExistingSkillsFromGaps(result.data, evidence);
};

module.exports = { careerGapSchema, parseCareerGap, filterExistingSkillsFromGaps };