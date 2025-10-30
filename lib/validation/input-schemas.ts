import { z } from "zod";

export const inputSchema = z
  .object({
    sourceType: z.enum(["url", "pdf"], {
      required_error: "Please select a source type",
    }),
    url: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    pdfId: z.string().optional(),
    pdfPath: z.string().optional(),
    pdfUrl: z.string().optional(),
    icp: z
      .string()
      .min(10, "ICP details should be at least 10 characters")
      .optional()
      .or(z.literal("")),
    priceTerms: z
      .string()
      .min(5, "Price/terms should be at least 5 characters")
      .optional()
      .or(z.literal("")),
    proofLinks: z
      .array(z.string().url("Please enter a valid URL"))
      .optional()
      .default([]),
    mechanism: z
      .string()
      .min(10, "Mechanism description should be at least 10 characters")
      .optional()
      .or(z.literal("")),
    primaryObjection: z
      .string()
      .min(5, "Primary objection should be at least 5 characters")
      .optional()
      .or(z.literal("")),
    goal: z
      .string()
      .min(5, "Goal should be at least 5 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.sourceType === "url") {
        return !!data.url && data.url.length > 0;
      }
      if (data.sourceType === "pdf") {
        return !!data.pdfId || !!data.pdfPath;
      }
      return true;
    },
    {
      message: "Please provide either a URL or upload a PDF",
      path: ["sourceType"],
    }
  );

export type InputFormData = z.infer<typeof inputSchema>;

export const validateInputs = (data: Partial<InputFormData>) => {
  try {
    inputSchema.parse(data);
    return { success: true as const, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false as const, errors };
    }
    return { success: false as const, errors: { _form: "Validation failed" } };
  }
};

export const validateField = (
  fieldName: keyof InputFormData,
  value: unknown
): string | null => {
  try {
    const fieldSchema = inputSchema.shape[fieldName];
    if (fieldSchema) {
      fieldSchema.parse(value);
    }
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Invalid value";
    }
    return "Invalid value";
  }
};
