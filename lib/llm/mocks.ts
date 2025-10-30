/**
 * LLM Mocks
 * Mock responses for local development and testing
 */

const MOCK_RESPONSES: Record<string, string> = {
  copy_rewriter: JSON.stringify({
    headline: "Transform Your Business in 90 Days or Get Your Money Back",
    subheadline:
      "Join 5,000+ companies using our proven framework to 10x their conversion rates",
    cta: "Start Your Free 14-Day Trial",
    body: [
      "Stop losing customers to confusing offers and weak value propositions.",
      "Our battle-tested system has generated over $500M in revenue for clients across 47 industries.",
      "You'll get a complete conversion optimization framework, weekly coaching calls, and our proprietary analysis tools.",
      "Most clients see a 2-3x improvement in conversion rates within the first 60 days.",
    ],
    reasoning:
      "Focused on specificity, social proof, risk reversal, and clear value proposition. Added concrete numbers and timeframes to increase urgency and certainty.",
  }),

  objection_pack: JSON.stringify({
    handlers: [
      {
        objection: "This is too expensive for my budget right now",
        response:
          "I understand budget concerns. What's the cost of NOT fixing your conversion problem? If you're losing even 10 leads per month at $1,000 LTV, that's $120K annually.",
        proof_points: [
          "Average client ROI is 8.3x in first year",
          "Flexible payment plans available",
          "90-day money-back guarantee removes all risk",
        ],
        reframe:
          "This isn't an expense - it's an investment that pays for itself in the first month for most clients.",
      },
      {
        objection: "I need to think about it / talk to my team",
        response:
          "Absolutely, this should be a confident decision. What specific concerns do you need to address with your team?",
        proof_points: [
          "We can join your team call to answer questions",
          "Detailed ROI calculator available",
          "Case studies in your industry",
        ],
        reframe:
          "The best time to fix conversion leaks is now - every day of delay costs you customers. What information would help you decide today?",
      },
      {
        objection: "I've tried similar solutions before and they didn't work",
        response:
          "That's exactly why we're different. Most solutions focus on tactics, not strategy. What specifically didn't work last time?",
        proof_points: [
          "Custom strategy built for your business",
          "Weekly 1-on-1 coaching included",
          "Results guaranteed or money back",
        ],
        reframe:
          "Your past experience gives you an advantage - you know what doesn't work. Let's show you what does.",
      },
    ],
    preventative_copy: [
      "Unlike other programs that give you generic templates, we build a custom strategy for YOUR business",
      "You're not buying a course - you're getting a done-with-you implementation partner",
      "Risk-free guarantee: if you don't see measurable improvement in 90 days, you get a full refund",
    ],
    trust_builders: [
      "Featured in Forbes, Entrepreneur, and Inc. Magazine",
      "5,000+ businesses in 47 countries trust our framework",
      "Average client rating: 4.9/5 from 2,347 reviews",
      "Founded by former head of growth at 3 unicorn startups",
    ],
  }),

  linkedin_carousel: JSON.stringify({
    title: "5 Conversion Killers Destroying Your Offer",
    hook: "Your offer might be perfect... but your presentation is costing you 80% of potential customers",
    slides: [
      {
        slide_number: 1,
        headline: "Killer #1: Vague Value Proposition",
        body: '"We help businesses grow" means nothing. Specificity sells. "We help B2B SaaS companies add $500K ARR in 6 months" converts.',
        visual_suggestion: "Before/After comparison of vague vs specific copy",
      },
      {
        slide_number: 2,
        headline: "Killer #2: Missing Social Proof",
        body: "Your prospects are skeptical. Numbers speak louder than claims. Show revenue generated, customers served, specific results achieved.",
        visual_suggestion: "Social proof examples with metrics highlighted",
      },
      {
        slide_number: 3,
        headline: "Killer #3: Weak or Hidden CTA",
        body: 'Don\'t make people hunt for next steps. One clear, bold CTA above the fold. "Start Free Trial" beats "Learn More" every time.',
        visual_suggestion: "CTA comparison showing strong vs weak examples",
      },
      {
        slide_number: 4,
        headline: "Killer #4: No Risk Reversal",
        body: "Every prospect fears making a mistake. Guarantees remove friction. Money-back guarantees can increase conversions by 30%+.",
        visual_suggestion: "Risk reversal examples (guarantees, free trials)",
      },
      {
        slide_number: 5,
        headline: "Killer #5: Feature Dumping",
        body: "Features don't sell, transformations do. Instead of listing what it IS, show what it DOES. Paint the after-state.",
        visual_suggestion: "Feature vs benefit transformation examples",
      },
    ],
    cta_slide: {
      headline: "Fix Your Offer in 48 Hours",
      cta: "Get our free Offer Analyzer Tool → [Link]",
    },
  }),

  linkedin_caption: JSON.stringify({
    hook: "I analyzed 500+ offers that generated $100M+. Here's the pattern they all share:",
    body: "Every high-converting offer has these 3 elements:\n\n1. Crystal-clear specificity (not \"better results\" but \"37% more qualified leads in 60 days\")\n\n2. Risk reversal so strong it feels unfair (90-day guarantees, free trials, pay-on-results)\n\n3. Social proof with numbers (not \"trusted by many\" but \"2,347 companies in 47 countries\")\n\nMost offers fail because they're trying to appeal to everyone. The best offers repel 90% of people and magnetically attract the right 10%.\n\nYour offer doesn't need to be perfect. It needs to be SPECIFIC.",
    cta: "Want me to analyze your offer? Drop a comment or DM me.",
    hashtags: [
      "#ConversionOptimization",
      "#OfferCreation",
      "#B2BMarketing",
      "#SalesStrategy",
    ],
  }),

  linkedin_comment: JSON.stringify({
    comments: [
      {
        text: "Great insight! The specificity point really resonates. Too many offers try to be everything to everyone.",
        tone: "Supportive and thoughtful",
      },
      {
        text: "This is gold. The risk reversal example especially - I've been too afraid to offer strong guarantees. Time to rethink that.",
        tone: "Enthusiastic and actionable",
      },
      {
        text: "Curious about the social proof data - did you find that certain types of proof points convert better than others?",
        tone: "Genuinely curious, engagement-focused",
      },
      {
        text: "Sending you a DM - would love to get your take on my current offer positioning.",
        tone: "Direct and actionable",
      },
      {
        text: "The 'repel 90% to attract 10%' framework is counterintuitive but makes total sense. Thanks for sharing!",
        tone: "Thoughtful and appreciative",
      },
    ],
  }),

  linkedin_dm: JSON.stringify({
    messages: [
      {
        sequence_number: 1,
        message:
          "Hey [Name], saw your post about [topic] - the point about [specific detail] really stood out. Are you currently working on refining your offer positioning?",
        timing: "Within 24 hours of connection/interaction",
        trigger: "Engaged with content or connected recently",
      },
      {
        sequence_number: 2,
        message:
          "I noticed you mentioned [pain point] in your comment. I just finished a case study on exactly this - a company went from 2.1% to 6.8% conversion by fixing 3 specific things. Mind if I share it?",
        timing: "2-3 days after message 1 if no response",
        trigger: "Follow-up with value add",
      },
      {
        sequence_number: 3,
        message:
          "No pressure if you're busy! Just wanted to drop this free tool we built - it analyzes offer pages and shows the exact conversion killers. Takes 2 minutes: [link]",
        timing: "4-5 days after message 2 if no response",
        trigger: "Final value-first touch before backing off",
      },
      {
        sequence_number: 4,
        message:
          "Thanks for checking it out! Based on what it found, I see [specific insight]. Want to hop on a quick 15-min call this week to walk through the top 3 fixes?",
        timing: "When prospect engages with tool/content",
        trigger: "Engagement signal (clicked link, replied, etc.)",
      },
    ],
  }),

  ab_test_plan: JSON.stringify({
    overview:
      "7-day structured A/B testing plan focused on high-impact conversion elements. Each day tests a specific hypothesis with clear success criteria and rollback strategy.",
    baseline_metrics: [
      "Current conversion rate: 2.3%",
      "Average time on page: 1:45",
      "Bounce rate: 58%",
      "Form completion rate: 12%",
      "CTA click rate: 8.5%",
    ],
    test_days: [
      {
        day: 1,
        focus: "Headline Clarity & Specificity",
        variants: [
          {
            name: "Control",
            hypothesis: "Current headline is too vague",
            changes: ["Keep existing: 'Transform Your Business'"],
            expected_impact: "Baseline measurement",
          },
          {
            name: "Variant A - Specific Outcome",
            hypothesis: "Specific numbers increase trust and interest",
            changes: [
              "New headline: 'Add $50K MRR in 90 Days or Your Money Back'",
            ],
            expected_impact: "+0.5% conversion rate",
          },
        ],
        metrics_to_track: [
          "Time on page",
          "Scroll depth",
          "CTA click rate",
          "Conversion rate",
        ],
        success_criteria:
          "10% improvement in engagement metrics or 0.3%+ conversion lift",
      },
      {
        day: 2,
        focus: "Social Proof Placement",
        variants: [
          {
            name: "Control",
            hypothesis: "Social proof buried too low on page",
            changes: ["Keep social proof at current position (below fold)"],
            expected_impact: "Baseline",
          },
          {
            name: "Variant A - Hero Social Proof",
            hypothesis: "Early social proof builds immediate credibility",
            changes: [
              "Move testimonials and numbers to hero section",
              'Add: "Join 5,000+ companies" below headline',
            ],
            expected_impact: "+0.4% conversion rate",
          },
        ],
        metrics_to_track: [
          "Bounce rate",
          "Time to CTA click",
          "Form starts",
          "Conversion rate",
        ],
        success_criteria: "Reduced bounce rate by 5%+ or conversion lift 0.3%+",
      },
      {
        day: 3,
        focus: "CTA Copy & Design",
        variants: [
          {
            name: "Control",
            hypothesis: 'Generic "Learn More" creates uncertainty',
            changes: ['Keep existing CTA: "Learn More"'],
            expected_impact: "Baseline",
          },
          {
            name: "Variant A - Outcome-Focused",
            hypothesis: "Specific CTAs clarify value and next step",
            changes: [
              'Change CTA to: "Get My Free Offer Analysis"',
              "Add micro-copy: 'Takes 2 minutes, no credit card'",
            ],
            expected_impact: "+1.2% conversion rate",
          },
        ],
        metrics_to_track: [
          "CTA click rate",
          "Form completion rate",
          "Conversion rate",
        ],
        success_criteria: "CTA click rate increase of 15%+",
      },
    ],
    analysis_framework:
      "Use statistical significance calculator (95% confidence). Minimum 1,000 visitors per variant. Track both leading indicators (clicks, engagement) and lagging indicators (conversions, revenue).",
    rollout_strategy:
      "Implement winning variants progressively. If Day 1 winner shows 0.5%+ lift, make it the new control for Day 2 test. Compound improvements across all winning variants by Day 7.",
  }),
};

export function getMockResponse(key: string): string | null {
  return MOCK_RESPONSES[key] || null;
}

export function getAllMockKeys(): string[] {
  return Object.keys(MOCK_RESPONSES);
}
