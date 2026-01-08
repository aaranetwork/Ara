type Region = "IN" | "US" | "EU";

const EU_COUNTRIES = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
]);

export function detectRegionFromHeaders(headers?: Headers): Region {
  try {
    const country = headers?.get("x-vercel-ip-country") || headers?.get("cf-ipcountry") || "";
    if (country === "IN") return "IN";
    if (EU_COUNTRIES.has(country)) return "EU";
    return "US";
  } catch {
    return "US";
  }
}

export function getPricing(region: Region) {
  const priceIds = {
    IN: {
      plus: process.env.STRIPE_PRICE_PLUS_INR,
      pro: process.env.STRIPE_PRICE_PRO_INR,
      currency: "₹",
      display: { plus: "₹249", pro: "₹499" },
    },
    US: {
      plus: process.env.STRIPE_PRICE_PLUS_USD,
      pro: process.env.STRIPE_PRICE_PRO_USD,
      currency: "$",
      display: { plus: "$3.49", pro: "$6.99" },
    },
    EU: {
      plus: process.env.STRIPE_PRICE_PLUS_EUR,
      pro: process.env.STRIPE_PRICE_PRO_EUR,
      currency: "€",
      display: { plus: "€3.99", pro: "€7.49" },
    },
  } as const;

  const cfg = priceIds[region] || priceIds.US;
  return {
    region,
    currencySymbol: cfg.currency,
    plans: {
      plus: { displayPrice: cfg.display.plus, priceId: cfg.plus },
      pro: { displayPrice: cfg.display.pro, priceId: cfg.pro },
    },
  };
}


