// ResumeForm.tsx
// NOTE:
// A complete production ResumeForm with all dynamic sections is several hundred lines.
// This scaffold includes the structure, hooks, and TODO markers for remaining sections.

"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { resumeSchema, ResumeFormValues } from "@/schemas/resume.schema";
import { Resume } from "@/types/resume";
import { useCreateResume } from "@/hooks/resume/useCreateResume";
import { useUpdateResume } from "@/hooks/resume/useUpdateResume";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ResumeFormProps {
  mode: "create" | "edit";
  resume?: Resume;
}

export default function ResumeForm({ mode, resume }: ResumeFormProps) {
  const router = useRouter();

  const createResume = useCreateResume();
  const updateResume = useUpdateResume();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      title: "",
      template: "modern",
      summary: "",
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
      },
      education: [],
      experience: [],
      projects: [],
      skills: [],
      certifications: [],
      achievements: [],
      languages: [],
    },
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } =
    useFieldArray({ control, name: "experience" });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } =
    useFieldArray({ control, name: "education" });

  const { fields: projectFields, append: appendProject, remove: removeProject } =
    useFieldArray({ control, name: "projects" });
    const {
  fields: certificationFields,
  append: appendCertification,
  remove: removeCertification,
} = useFieldArray({
  control,
  name: "certifications",
});

const {
  fields: languageFields,
  append: appendLanguage,
  remove: removeLanguage,
} = useFieldArray({
  control,
  name: "languages",
});

const {
  fields: achievementFields,
  append: appendAchievement,
  remove: removeAchievement,
} = useFieldArray({
  control,
  name: "achievements",
});

  useEffect(() => {
    if (mode === "edit" && resume) {
      reset({
        title: resume.title,
        template: resume.template,
        summary: resume.summary,
        personalInfo: resume.personalInfo,
        education: resume.education,
        experience: resume.experience,
        projects: resume.projects,
        skills: resume.skills,
        certifications: resume.certifications,
        achievements: resume.achievements,
        languages: resume.languages,
      });
    }
  }, [mode, resume, reset]);

  const onSubmit = async (data: ResumeFormValues) => {
    if (mode === "create") {
      await createResume.mutateAsync(data as any);
    } else if (resume) {
      await updateResume.mutateAsync({
  id: (resume as any)._id ?? resume.id,
  payload: data,
});
    }
    router.push("/resume");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader><CardTitle>Resume Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Label>Title</Label>
          <Input {...register("title")} />
          <Label>Summary</Label>
          <textarea className="w-full border rounded p-3" rows={5} {...register("summary")} />
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Input placeholder="Full Name" {...register("personalInfo.fullName")} />
          <Input placeholder="Email" {...register("personalInfo.email")} />
          <Input placeholder="Phone" {...register("personalInfo.phone")} />
          <Input placeholder="Location" {...register("personalInfo.location")} />
        </CardContent>
      </Card>

      
          {/* ================= Experience ================= */}

<Card>

  <CardHeader className="flex flex-row items-center justify-between">

    <CardTitle>
      Experience
    </CardTitle>

    <Button
      type="button"
      onClick={() =>
        appendExperience({
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        })
      }
    >
      + Add Experience
    </Button>

  </CardHeader>

  <CardContent className="space-y-6">

    {experienceFields.length === 0 && (

      <p className="text-sm text-muted-foreground">
        No experience added.
      </p>

    )}

    {experienceFields.map((field, index) => (

      <div
        key={field.id}
        className="rounded-lg border p-5 space-y-4"
      >

        <Input
          placeholder="Company"
          {...register(`experience.${index}.company`)}
        />

        <Input
          placeholder="Position"
          {...register(`experience.${index}.position`)}
        />

        <Input
          placeholder="Location"
          {...register(`experience.${index}.location`)}
        />

        <div className="grid grid-cols-2 gap-4">

          <div>

            <Label>
              Start Date
            </Label>

            <Input
              type="date"
              {...register(
                `experience.${index}.startDate`
              )}
            />

          </div>

          <div>

            <Label>
              End Date
            </Label>

            <Input
              type="date"
              {...register(
                `experience.${index}.endDate`
              )}
            />

          </div>

        </div>

        <textarea
          rows={5}
          placeholder="Describe your work..."
          className="w-full rounded-md border p-3"
          {...register(
            `experience.${index}.description`
          )}
        />

        <Button
          type="button"
          variant="destructive"
          onClick={() =>
            removeExperience(index)
          }
        >
          Remove
        </Button>

      </div>

    ))}

  </CardContent>

</Card>
          {/* ================= Education ================= */}

<Card>

  <CardHeader className="flex flex-row items-center justify-between">

    <CardTitle>
      Education
    </CardTitle>

    <Button
      type="button"
      onClick={() =>
        appendEducation({
          institution: "",
          degree: "",
          field: "",
          grade: "",
          startDate: "",
          endDate: "",
          description: "",
        })
      }
    >
      + Add Education
    </Button>

  </CardHeader>

  <CardContent className="space-y-6">

    {educationFields.length === 0 && (
      <p className="text-sm text-muted-foreground">
        No education added.
      </p>
    )}

    {educationFields.map((field, index) => (

      <div
        key={field.id}
        className="rounded-lg border p-5 space-y-4"
      >

        <Input
          placeholder="Institution"
          {...register(`education.${index}.institution`)}
        />

        <Input
          placeholder="Degree"
          {...register(`education.${index}.degree`)}
        />

        <Input
          placeholder="Field of Study"
          {...register(`education.${index}.field`)}
        />

        <Input
          placeholder="Grade / CGPA"
          {...register(`education.${index}.grade`)}
        />

        <div className="grid grid-cols-2 gap-4">

          <div>
            <Label>Start Date</Label>

            <Input
              type="date"
              {...register(`education.${index}.startDate`)}
            />
          </div>

          <div>
            <Label>End Date</Label>

            <Input
              type="date"
              {...register(`education.${index}.endDate`)}
            />
          </div>

        </div>

        <textarea
          rows={4}
          placeholder="Description"
          className="w-full rounded-md border p-3"
          {...register(`education.${index}.description`)}
        />

        <Button
          type="button"
          variant="destructive"
          onClick={() => removeEducation(index)}
        >
          Remove
        </Button>

      </div>

    ))}

  </CardContent>

</Card>
          {/* ================= Projects ================= */}

<Card>

  <CardHeader className="flex flex-row items-center justify-between">

    <CardTitle>
      Projects
    </CardTitle>

    <Button
      type="button"
      onClick={() =>
        appendProject({
          title: "",
          description: "",
          technologies: [],
          github: "",
          live: "",
        })
      }
    >
      + Add Project
    </Button>

  </CardHeader>

  <CardContent className="space-y-6">

    {projectFields.length === 0 && (
      <p className="text-sm text-muted-foreground">
        No projects added.
      </p>
    )}

    {projectFields.map((field, index) => (

      <div
        key={field.id}
        className="rounded-lg border p-5 space-y-4"
      >

        <Input
          placeholder="Project Title"
          {...register(`projects.${index}.title`)}
        />

        <textarea
          rows={4}
          placeholder="Project Description"
          className="w-full rounded-md border p-3"
          {...register(`projects.${index}.description`)}
        />

        <Input
          placeholder="React, Node.js, MongoDB"
defaultValue={(field as any).technologies?.join(", ") ?? ""}   
       onChange={(e) =>
            setValue(
              `projects.${index}.technologies`,
              e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            )
          }
        />

        <Input
          placeholder="GitHub URL"
          {...register(`projects.${index}.github`)}
        />

        <Input
          placeholder="Live Demo URL"
          {...register(`projects.${index}.live`)}
        />

        <Button
          type="button"
          variant="destructive"
          onClick={() => removeProject(index)}
        >
          Remove
        </Button>

      </div>

    ))}

  </CardContent>

</Card>
          {/* ================= Skills ================= */}

<Card>

  <CardHeader>
    <CardTitle>Skills</CardTitle>
  </CardHeader>

  <CardContent>

    <Input
      placeholder="React, Node.js, MongoDB, Express"
value={(watch("skills") ?? []).join(", ")}
      onChange={(e) =>
        setValue(
          "skills",
          e.target.value
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        )
      }
    />

    <p className="text-sm text-muted-foreground mt-2">
      Separate skills using commas.
    </p>

  </CardContent>

</Card>
          {/* ================= Certifications ================= */}

<Card>

  <CardHeader className="flex flex-row justify-between items-center">

    <CardTitle>
      Certifications
    </CardTitle>

    <Button
      type="button"
      onClick={() =>
        appendCertification({
          name: "",
          issuer: "",
          issueDate: "",
        })
      }
    >
      + Add Certification
    </Button>

  </CardHeader>

  <CardContent className="space-y-5">

    {certificationFields.map((field, index) => (

      <div
        key={field.id}
        className="border rounded-lg p-5 space-y-3"
      >

        <Input
          placeholder="Certification Name"
          {...register(
            `certifications.${index}.name`
          )}
        />

        <Input
          placeholder="Issuer"
          {...register(
            `certifications.${index}.issuer`
          )}
        />

        <Input
          type="date"
          {...register(
            `certifications.${index}.issueDate`
          )}
        />

        <Button
          type="button"
          variant="destructive"
          onClick={() =>
            removeCertification(index)
          }
        >
          Remove
        </Button>

      </div>

    ))}

  </CardContent>

</Card>
          {/* ================= Languages ================= */}

<Card>

  <CardHeader className="flex justify-between flex-row items-center">

    <CardTitle>
      Languages
    </CardTitle>

    <Button
      type="button"
      onClick={() =>
        appendLanguage({
          language: "",
          proficiency: "",
        })
      }
    >
      + Add Language
    </Button>

  </CardHeader>

  <CardContent className="space-y-5">

    {languageFields.map((field, index) => (

      <div
        key={field.id}
        className="border rounded-lg p-5 space-y-3"
      >

        <Input
          placeholder="Language"
          {...register(
            `languages.${index}.language`
          )}
        />

        <Input
          placeholder="Proficiency"
          {...register(
            `languages.${index}.proficiency`
          )}
        />

        <Button
          type="button"
          variant="destructive"
          onClick={() =>
            removeLanguage(index)
          }
        >
          Remove
        </Button>

      </div>

    ))}

  </CardContent>

</Card>
          {/* ================= Achievements ================= */}

<Card>

  <CardHeader className="flex justify-between flex-row items-center">

    <CardTitle>
      Achievements
    </CardTitle>

    <Button
      type="button"
      onClick={() =>
        appendAchievement({
          title: "",
          description: "",
        })
      }
    >
      + Add Achievement
    </Button>

  </CardHeader>

  <CardContent className="space-y-5">

    {achievementFields.map((field, index) => (

      <div
        key={field.id}
        className="border rounded-lg p-5 space-y-3"
      >

        <Input
          placeholder="Achievement Title"
          {...register(
            `achievements.${index}.title`
          )}
        />

        <textarea
          rows={4}
          className="w-full border rounded-md p-3"
          placeholder="Achievement Description"
          {...register(
            `achievements.${index}.description`
          )}
        />

        <Button
          type="button"
          variant="destructive"
          onClick={() =>
            removeAchievement(index)
          }
        >
          Remove
        </Button>

      </div>

    ))}

  </CardContent>

</Card>
  

      <Button type="submit">
        {mode === "create" ? "Create Resume" : "Update Resume"}
      </Button>
    </form>
  );
}
