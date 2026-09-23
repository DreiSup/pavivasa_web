export type FaqQuestion = { question: string; answer?: string }

/** Only with real answers. No answer, no FAQPage. */
export function buildFaqJsonLd(questions: readonly FaqQuestion[]) {
  const answered = questions.filter((q): q is { question: string; answer: string } => Boolean(q.answer))
  if (answered.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answered.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }
}
