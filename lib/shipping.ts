// Simple shipping ETA utilities for Romania (DPD baseline)
// - Cutoff: orders before 15:00 ship same business day, else next business day
// - Transit: 1–2 zile lucrătoare în funcție de județ (simplificat)

export type EtaResult = {
  shipDate: Date;
  minDate: Date;
  maxDate: Date;
  transitMinDays: number;
  transitMaxDays: number;
  codAvailable: boolean;
};

const RO_WEEKEND = new Set([0, 6]); // duminică=0, sâmbătă=6 (locale dependent)

// Județe unde livrarea tinde să fie 2 zile (zone periferice/depărtate) — euristică simplă
const TWO_DAY_COUNTIES = new Set<string>([
  "Tulcea",
  "Satu Mare",
  "Botoșani","Botosani",
  "Suceava",
  "Maramureș","Maramures",
  "Sălaj","Salaj",
  "Bistrița-Năsăud","Bistrita-Nasaud",
  "Harghita",
]);

export function isBusinessDay(d: Date) {
  const day = d.getDay();
  return !RO_WEEKEND.has(day);
}

export function nextBusinessDay(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  while (!isBusinessDay(d)) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export function addBusinessDays(from: Date, days: number): Date {
  let d = new Date(from);
  let added = 0;
  while (added < days) {
    d = nextBusinessDay(d);
    added++;
  }
  return d;
}

export function computeEtaByCounty(countyRaw: string | null | undefined, nowInput?: Date): EtaResult {
  const now = nowInput ? new Date(nowInput) : new Date();
  const county = String(countyRaw || "").trim();

  // Determine ship date based on cutoff 15:00 and business days
  const cutoffHour = 15;
  let shipDate = new Date(now);
  // If weekend, move to next business day morning
  if (!isBusinessDay(shipDate)) {
    // advance to Monday
    while (!isBusinessDay(shipDate)) {
      shipDate = nextBusinessDay(shipDate);
    }
    shipDate.setHours(9, 0, 0, 0);
  } else {
    const hour = shipDate.getHours();
    if (hour >= cutoffHour) {
      shipDate = nextBusinessDay(shipDate);
      shipDate.setHours(9, 0, 0, 0);
    }
  }

  const isTwoDay = TWO_DAY_COUNTIES.has(county);
  const transitMinDays = 1;
  const transitMaxDays = isTwoDay ? 2 : 2; // conservativ 1–2 zile

  const minDate = addBusinessDays(shipDate, transitMinDays);
  const maxDate = addBusinessDays(shipDate, transitMaxDays);

  return {
    shipDate,
    minDate,
    maxDate,
    transitMinDays,
    transitMaxDays,
    codAvailable: true,
  };
}

export function formatEtaRangeRo(minDate: Date, maxDate: Date): string {
  const days = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
  const d1 = days[minDate.getDay()];
  const d2 = days[maxDate.getDay()];
  const n1 = minDate.getDate();
  const n2 = maxDate.getDate();
  if (minDate.toDateString() === maxDate.toDateString()) {
    return `${d2} ${n2}`;
  }
  return `${d1} ${n1} – ${d2} ${n2}`;
}

export function etaPayload(county: string) {
  const eta = computeEtaByCounty(county);
  const label = formatEtaRangeRo(eta.minDate, eta.maxDate);
  return {
    ok: true,
    county,
    shipDate: eta.shipDate.toISOString(),
    minDate: eta.minDate.toISOString(),
    maxDate: eta.maxDate.toISOString(),
    transitMinDays: eta.transitMinDays,
    transitMaxDays: eta.transitMaxDays,
    codAvailable: eta.codAvailable,
    label,
  };
}
