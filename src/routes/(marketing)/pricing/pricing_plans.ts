export const defaultPlanId = "free"

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "A free plan to get you started!",
    price: "£0",
    priceIntervalName: "per month",
    stripe_price_id: null,
    features: ["MIT Licence", "Fast Performance", "Stripe Integration"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "A plan for power users.",
    price: "£12",
    priceIntervalName: "per month",
    stripe_price_id: "price_1PtWXMEoUGZHLMveW5qlvZIX",
    stripe_product_id: "prod_Ql2c5cqVqj1UQR",
    features: [
      "Access to all features",
      "Explore new features before anyone else",
      "Faster support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "A plan for enterprise users.",
    price: "",
    priceIntervalName: "",
    stripe_price_id: "",
    stripe_product_id: "",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom features",
    ],
  },
]
