export const defaultPlanId = "free"

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "A free plan to get you started!",
    price: "$0",
    priceIntervalName: "per month",
    stripe_price_id: null,
    features: ["MIT Licence", "Fast Performance", "Stripe Integration"],
  },
  {
    id: "startup",
    name: "Startup",
    description: "A plan for startups. ",
    price: "$12",
    priceIntervalName: "per month",
    stripe_price_id: "price_1PtWXMEoUGZHLMveW5qlvZIX",
    stripe_product_id: "prod_Ql2c5cqVqj1UQR",
    features: [
      "Everything in Free",
      "Support us with fake money",
      "Test the purchase experience",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "A plan for power users.",
    price: "$18",
    priceIntervalName: "per year",
    stripe_price_id: "price_1PtWWVEoUGZHLMvewCnE32CI",
    stripe_product_id: "prod_Ql2bVVkyjPD3Ez",
    features: [
      "Everything in Startup",
      "Try the 'upgrade plan' UX",
      "Still actually free!",
    ],
  },
]
