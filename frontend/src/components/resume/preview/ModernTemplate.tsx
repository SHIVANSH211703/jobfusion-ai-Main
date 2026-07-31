"use client";

import type { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

export default function ModernTemplate({
  resume,
}: Props) {
  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-10 max-w-4xl mx-auto space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          {resume.personalInfo.fullName}
        </h1>

        <p className="text-gray-600 mt-2">
          {resume.personalInfo.email}
        </p>

        <p className="text-gray-600">
          {resume.personalInfo.phone}
        </p>

        <p className="text-gray-600">
          {resume.personalInfo.location}
        </p>

      </div>

      {/* Summary */}

      <section>

        <h2 className="text-xl font-bold border-b mb-3">
          Professional Summary
        </h2>

        <p>
          {resume.summary}
        </p>

      </section>

      {/* Skills */}

      <section>

        <h2 className="text-xl font-bold border-b mb-3">
          Skills
        </h2>

        <div className="flex flex-wrap gap-2">

          {resume.skills.map((skill) => (

            <span
              key={skill}
              className="bg-gray-100 rounded px-3 py-1 text-sm"
            >
              {skill}
            </span>

          ))}

        </div>

      </section>

      {/* Experience */}

      <section>

        <h2 className="text-xl font-bold border-b mb-4">
          Experience
        </h2>

        <div className="space-y-6">

          {resume.experience.map((exp, index) => (

            <div key={index}>

              <h3 className="font-semibold text-lg">
                {exp.position}
              </h3>

              <p className="text-gray-600">
                {exp.company}
              </p>

              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.endDate}
              </p>

              <p className="mt-2">
                {exp.description}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* Education */}

      <section>

        <h2 className="text-xl font-bold border-b mb-4">
          Education
        </h2>

        <div className="space-y-5">

          {resume.education.map((edu, index) => (

            <div key={index}>

              <h3 className="font-semibold">
                {edu.degree}
              </h3>

              <p>
                {edu.institution}
              </p>

              <p className="text-sm text-gray-500">
                {edu.startDate} - {edu.endDate}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* Projects */}

      <section>

        <h2 className="text-xl font-bold border-b mb-4">
          Projects
        </h2>

        <div className="space-y-5">

          {resume.projects.map((project, index) => (

            <div key={index}>

              <h3 className="font-semibold">
                {project.title}
              </h3>

              <p className="mt-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">

                {project.technologies.map((tech) => (

                  <span
                    key={tech}
                    className="bg-blue-100 rounded px-2 py-1 text-xs"
                  >
                    {tech}
                  </span>

                ))}

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}