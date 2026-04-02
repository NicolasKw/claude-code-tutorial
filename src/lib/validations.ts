import { z } from 'zod';

const LINKEDIN_PROFILE_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-_.]{3,100})\/?$/;

export const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  linkedinUrl: z
    .string()
    .min(1, 'LinkedIn profile URL is required')
    .regex(LINKEDIN_PROFILE_REGEX, 'Must be a valid linkedin.com/in/... URL')
    .transform((url) => {
      if (!url.startsWith('http')) return `https://${url}`;
      return url;
    }),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
