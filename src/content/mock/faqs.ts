import type { Faq } from "../schemas";

/**
 * Only the first answer exists in the design; the other three are drafted
 * from information elsewhere on the page (F10). The user accepted them as
 * test answers (K17), so each ends with a visible "(Test answer.)" note.
 * Lengths vary on purpose (short / medium / long) to exercise the accordion.
 */
const testNote = "(Test answer.)";
export const faqs: Faq[] = [
  {
    id: "states",
    question: "What states do you serve in GLP-1 programs?",
    answer: ["We are currently able to serve GLP-1 programs in all 50 states."],
  },
  {
    id: "languages",
    question: "Which languages do you support?",
    answer: [
      "More than 40, including Spanish, Chinese, Vietnamese, Korean, Tagalog, Russian, Arabic, French, Portuguese and Hindi.",
      "Your physician is US-licensed; our AI care assistant translates every message and your consultation in real time, so you can describe your symptoms in the language you think in.",
      testNote,
    ],
  },
  {
    id: "insurance",
    question: "Do I need insurance?",
    answer: [
      "No. Apsu is cash-pay, so you don't need insurance and there is no appointment to book.",
      testNote,
    ],
  },
  {
    id: "compounded-medication",
    question: "What is compounded medication?",
    answer: [
      "Compounded medication is prepared by a licensed pharmacy for an individual patient, based on a prescription from a licensed provider. Apsu's compounded GLP-1 medications are prepared by licensed U.S. compounding pharmacies.",
      "Compounded medications are not approved or evaluated by the FDA for safety, effectiveness or quality. Your physician decides whether a compounded option is appropriate for you, explains the alternatives, including FDA-approved medications where available, and monitors your progress throughout treatment.",
      "Product appearance may differ from the images shown, and results vary from person to person. If you have questions about a specific medication, your care team can answer them in your language at any time.",
      testNote,
    ],
  },
];
