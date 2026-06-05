export const FORMSPREE_PROJECT_INTAKE_URL =
  process.env.NEXT_PUBLIC_FORMSPREE_PROJECT_INTAKE_URL || "";

/** Form ID only, e.g. xyzabcde — optional if full URL is set above */
export const FORMSPREE_PROJECT_INTAKE_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_PROJECT_INTAKE_ID || "";

export const getFormspreeEndpoint = () => {
  if (FORMSPREE_PROJECT_INTAKE_URL) {
    return FORMSPREE_PROJECT_INTAKE_URL.replace(/\/$/, "");
  }
  if (FORMSPREE_PROJECT_INTAKE_ID) {
    return `https://formspree.io/f/${FORMSPREE_PROJECT_INTAKE_ID}`;
  }
  return "";
};
