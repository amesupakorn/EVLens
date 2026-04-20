export interface EVCar {
  id: string;
  brand: string;
  model: string;
  type: "Sedan" | "SUV" | "Hatchback";
  priceTHB: number;
  batteryKWh: number;
  consumptionKWhPer100Km: number;
  maxRangeKm: number;
  imageUrl: string;
}

export const cars: EVCar[] = [
  {
    id: "byd-atto-3",
    brand: "BYD",
    model: "Atto 3 Extended Range",
    type: "SUV",
    priceTHB: 899_900,
    batteryKWh: 60.5,
    consumptionKWhPer100Km: 14.9,
    maxRangeKm: 480,
    imageUrl:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "tesla-model-3",
    brand: "Tesla",
    model: "Model 3 Rear-Wheel Drive",
    type: "Sedan",
    priceTHB: 1_599_000,
    batteryKWh: 57.5,
    consumptionKWhPer100Km: 13.2,
    maxRangeKm: 513,
    imageUrl:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "mg4-electric",
    brand: "MG",
    model: "MG4 Electric X",
    type: "Hatchback",
    priceTHB: 869_900,
    batteryKWh: 64,
    consumptionKWhPer100Km: 14.6,
    maxRangeKm: 435,
    imageUrl:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "neta-v-ii",
    brand: "NETA",
    model: "V-II",
    type: "Hatchback",
    priceTHB: 549_000,
    batteryKWh: 36.1,
    consumptionKWhPer100Km: 12.8,
    maxRangeKm: 382,
    imageUrl:
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "deepal-s07",
    brand: "DEEPAL",
    model: "S07",
    type: "SUV",
    priceTHB: 1_399_000,
    batteryKWh: 79.97,
    consumptionKWhPer100Km: 15.8,
    maxRangeKm: 560,
    imageUrl:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ora-good-cat",
    brand: "GWM",
    model: "ORA Good Cat 500 Ultra",
    type: "Hatchback",
    priceTHB: 899_000,
    batteryKWh: 63.1,
    consumptionKWhPer100Km: 13.9,
    maxRangeKm: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "volvo-ex30",
    brand: "Volvo",
    model: "EX30 Extended Range",
    type: "SUV",
    priceTHB: 1_590_000,
    batteryKWh: 69,
    consumptionKWhPer100Km: 15.7,
    maxRangeKm: 480,
    imageUrl:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "xpeng-g6",
    brand: "XPENG",
    model: "G6 Long Range",
    type: "SUV",
    priceTHB: 1_599_000,
    batteryKWh: 87.5,
    consumptionKWhPer100Km: 16.2,
    maxRangeKm: 570,
    imageUrl:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80",
  },
];

export const formatTHB = (value: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
