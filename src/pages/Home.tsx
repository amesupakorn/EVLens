import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BatteryCharging,
  Car,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Share2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cars, formatTHB } from "../data/cars";
import type { EVCar } from "../data/cars";

interface CalculatorInputs {
  dailyDistanceKm: number;
  selectedCarId: string;
  fuelPriceTHBPerLiter: number;
  iceEfficiencyKmPerLiter: number;
  electricityPlan: "standard" | "tou";
}

interface RangeResult {
  estimatedRangeKm: number;
  daysPerCharge: number;
  chargesPerWeek: number;
  batteryRemainingAfterDay: number;
}

interface SavingsResult {
  monthlyFuelCost: number;
  monthlyEvCost: number;
  monthlySavings: number;
  annualSavings: number;
  breakEvenYears: number;
}

const electricityRates: Record<CalculatorInputs["electricityPlan"], number> = {
  standard: 4.7,
  tou: 2.64,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function calculateRange(
  car: EVCar,
  dailyDistanceKm: number,
): RangeResult {
  const estimatedRangeKm =
    (car.batteryKWh / car.consumptionKWhPer100Km) * 100;
  const safeDailyDistance = Math.max(dailyDistanceKm, 1);
  const daysPerCharge = estimatedRangeKm / safeDailyDistance;
  const chargesPerWeek = Math.max(1, Math.ceil(7 / daysPerCharge));
  const batteryUsedPercent = (safeDailyDistance / estimatedRangeKm) * 100;
  const batteryRemainingAfterDay = clamp(100 - batteryUsedPercent, 0, 100);

  return {
    estimatedRangeKm,
    daysPerCharge,
    chargesPerWeek,
    batteryRemainingAfterDay,
  };
}

function calculateSavings(
  car: EVCar,
  inputs: CalculatorInputs,
): SavingsResult {
  const monthlyDistanceKm = inputs.dailyDistanceKm * 30;
  const safeFuelPrice = Math.max(inputs.fuelPriceTHBPerLiter, 0);
  const safeIceEfficiency = Math.max(inputs.iceEfficiencyKmPerLiter, 1);
  const monthlyFuelCost =
    (monthlyDistanceKm / safeIceEfficiency) * safeFuelPrice;
  const monthlyEvCost =
    ((monthlyDistanceKm * car.consumptionKWhPer100Km) / 100) *
    electricityRates[inputs.electricityPlan];
  const monthlySavings = monthlyFuelCost - monthlyEvCost;
  const annualSavings = monthlySavings * 12;
  const breakEvenYears =
    annualSavings > 0 ? car.priceTHB / annualSavings : Number.POSITIVE_INFINITY;

  return {
    monthlyFuelCost,
    monthlyEvCost,
    monthlySavings,
    annualSavings,
    breakEvenYears,
  };
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/75 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 text-[#171A20] sm:px-6 lg:px-8">
        <Link to="/" className="text-[17px] font-medium tracking-normal">
          EVLens
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {[
            { label: "Search", href: "/cars" },
            { label: "Calculator", href: "#calculator" },
            { label: "Stations", href: "#stations" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded px-4 py-2 text-sm font-medium transition-colors duration-300 hover:bg-black/5"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden min-h-10 rounded bg-[#171A20] px-5 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#393C41] sm:inline-flex sm:items-center">
            Login
          </button>
          <button
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded transition-colors duration-300 hover:bg-black/5 md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#171A20] text-white">
      <img
        src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=2200&q=85"
        alt="Electric vehicle charging at night"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex min-h-[100svh] items-start px-4 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-xl animate-[fadeUp_0.7s_ease-out_both]">
            <p className="mb-3 text-sm font-medium text-white/80">
              Thailand EV decision support
            </p>
            <h1 className="text-[40px] font-medium leading-[1.08] tracking-normal sm:text-[56px] lg:text-[68px]">
              EVLens
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-white/90 sm:text-lg">
              See how far an EV fits your real commute, what it costs to run,
              and which models make sense before you visit the showroom.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#calculator"
                className="inline-flex min-h-10 items-center justify-center rounded bg-[#3E6AE1] px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#345ac1]"
              >
                Calculate my range
              </a>
              <a
                href="#featured"
                className="inline-flex min-h-10 items-center justify-center rounded bg-white px-6 text-sm font-medium text-[#393C41] transition-colors duration-300 hover:bg-[#F4F4F4]"
              >
                View popular EVs
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CalculatorSection() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    dailyDistanceKm: 48,
    selectedCarId: cars[0].id,
    fuelPriceTHBPerLiter: 38,
    iceEfficiencyKmPerLiter: 13,
    electricityPlan: "tou",
  });

  const selectedCar =
    cars.find((car) => car.id === inputs.selectedCarId) ?? cars[0];

  const rangeResult = useMemo(
    () => calculateRange(selectedCar, inputs.dailyDistanceKm),
    [selectedCar, inputs.dailyDistanceKm],
  );

  const savingsResult = useMemo(
    () => calculateSavings(selectedCar, inputs),
    [selectedCar, inputs],
  );

  return (
    <section
      id="calculator"
      className="bg-white px-4 py-20 text-[#171A20] sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div>
          <p className="text-sm font-medium text-[#5C5E62]">Range Calculator</p>
          <h2 className="mt-3 text-[32px] font-medium leading-tight tracking-normal sm:text-[40px]">
            Know your charge rhythm before you buy.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#393C41]">
            Based on battery size and consumption, EVLens estimates how many
            days one charge covers, weekly charge frequency, and the battery
            left when you return home.
          </p>
        </div>

        <div className="rounded bg-[#F4F4F4] p-4 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="text-sm font-medium text-[#393C41]">
                EV model
              </span>
              <select
                value={inputs.selectedCarId}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    selectedCarId: event.target.value,
                  }))
                }
                className="mt-2 h-11 w-full rounded border border-[#D0D1D2] bg-white px-3 text-sm text-[#171A20] outline-none transition-colors duration-300 focus:border-[#3E6AE1]"
              >
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-2">
              <span className="flex items-center justify-between text-sm font-medium text-[#393C41]">
                Daily distance
                <span>{inputs.dailyDistanceKm} km</span>
              </span>
              <input
                type="range"
                min={10}
                max={220}
                step={1}
                value={inputs.dailyDistanceKm}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    dailyDistanceKm: Number(event.target.value),
                  }))
                }
                className="mt-4 h-2 w-full accent-[#3E6AE1]"
              />
            </label>

            <label>
              <span className="text-sm font-medium text-[#393C41]">
                Fuel price
              </span>
              <div className="mt-2 flex h-11 items-center rounded border border-[#D0D1D2] bg-white px-3 focus-within:border-[#3E6AE1]">
                <input
                  type="number"
                  min={1}
                  value={inputs.fuelPriceTHBPerLiter}
                  onChange={(event) =>
                    setInputs((current) => ({
                      ...current,
                      fuelPriceTHBPerLiter: Number(event.target.value),
                    }))
                  }
                  className="w-full bg-transparent text-sm outline-none"
                />
                <span className="text-sm text-[#5C5E62]">THB/L</span>
              </div>
            </label>

            <label>
              <span className="text-sm font-medium text-[#393C41]">
                Current car efficiency
              </span>
              <div className="mt-2 flex h-11 items-center rounded border border-[#D0D1D2] bg-white px-3 focus-within:border-[#3E6AE1]">
                <input
                  type="number"
                  min={1}
                  value={inputs.iceEfficiencyKmPerLiter}
                  onChange={(event) =>
                    setInputs((current) => ({
                      ...current,
                      iceEfficiencyKmPerLiter: Number(event.target.value),
                    }))
                  }
                  className="w-full bg-transparent text-sm outline-none"
                />
                <span className="text-sm text-[#5C5E62]">km/L</span>
              </div>
            </label>

            <div className="md:col-span-2">
              <span className="text-sm font-medium text-[#393C41]">
                Electricity plan
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { id: "standard", label: "Standard", rate: "4.70 THB/kWh" },
                  { id: "tou", label: "TOU off-peak", rate: "2.64 THB/kWh" },
                ].map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() =>
                      setInputs((current) => ({
                        ...current,
                        electricityPlan:
                          plan.id as CalculatorInputs["electricityPlan"],
                      }))
                    }
                    className={`min-h-12 rounded px-3 text-left text-sm transition-colors duration-300 ${
                      inputs.electricityPlan === plan.id
                        ? "bg-[#171A20] text-white"
                        : "bg-white text-[#393C41] hover:bg-[#EEEEEE]"
                    }`}
                  >
                    <span className="block font-medium">{plan.label}</span>
                    <span className="block text-xs opacity-70">{plan.rate}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              icon={<BatteryCharging className="h-5 w-5" />}
              label="Estimated range"
              value={`${Math.round(rangeResult.estimatedRangeKm)} km`}
            />
            <Metric
              icon={<Zap className="h-5 w-5" />}
              label="One charge covers"
              value={`${rangeResult.daysPerCharge.toFixed(1)} days`}
            />
            <Metric
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Charge sessions"
              value={`${rangeResult.chargesPerWeek}/week`}
            />
            <Metric
              icon={<Car className="h-5 w-5" />}
              label="Battery after day"
              value={`${Math.round(rangeResult.batteryRemainingAfterDay)}%`}
            />
          </div>

          <div className="mt-6 border-t border-[#D0D1D2] pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <CostLine
                label="Current fuel"
                value={formatTHB(savingsResult.monthlyFuelCost)}
                detail="per month"
              />
              <CostLine
                label="EV energy"
                value={formatTHB(savingsResult.monthlyEvCost)}
                detail="per month"
              />
              <CostLine
                label="Annual savings"
                value={formatTHB(Math.max(savingsResult.annualSavings, 0))}
                detail={
                  Number.isFinite(savingsResult.breakEvenYears)
                    ? `break-even ${savingsResult.breakEvenYears.toFixed(1)} yrs`
                    : "break-even not reached"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded bg-white p-4">
      <div className="text-[#3E6AE1]">{icon}</div>
      <p className="mt-3 text-xs text-[#5C5E62]">{label}</p>
      <p className="mt-1 text-[22px] font-medium text-[#171A20]">{value}</p>
    </div>
  );
}

function CostLine({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div>
      <p className="text-sm text-[#5C5E62]">{label}</p>
      <p className="mt-1 text-[22px] font-medium text-[#171A20]">{value}</p>
      <p className="mt-1 text-xs text-[#5C5E62]">{detail}</p>
    </div>
  );
}

function FeaturedCarsSection() {
  return (
    <section
      id="featured"
      className="bg-[#171A20] px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-white/70">Featured Cars</p>
            <h2 className="mt-3 text-[32px] font-medium leading-tight tracking-normal sm:text-[40px]">
              Popular EVs in Thailand.
            </h2>
          </div>
          <Link
            to="/cars"
            className="inline-flex min-h-10 items-center gap-2 rounded bg-white px-5 text-sm font-medium text-[#171A20] transition-colors duration-300 hover:bg-[#EEEEEE] sm:self-auto"
          >
            ดูรถเพิ่มเติม
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cars.slice(0, 3).map((car) => (
            <article
              key={car.id}
              className="overflow-hidden rounded bg-white text-[#171A20]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#F4F4F4]">
                <img
                  src={car.imageUrl}
                  alt={`${car.brand} ${car.model}`}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
              <div className="p-5">
                <p className="text-sm text-[#5C5E62]">{car.type}</p>
                <h3 className="mt-1 text-[17px] font-medium">
                  {car.brand} {car.model}
                </h3>
                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#5C5E62]">Range</p>
                    <p className="mt-1 font-medium">{car.maxRangeKm} km</p>
                  </div>
                  <div>
                    <p className="text-[#5C5E62]">Price</p>
                    <p className="mt-1 font-medium">{formatTHB(car.priceTHB)}</p>
                  </div>
                  <div>
                    <p className="text-[#5C5E62]">Battery</p>
                    <p className="mt-1 font-medium">{car.batteryKWh} kWh</p>
                  </div>
                  <div>
                    <p className="text-[#5C5E62]">Consumption</p>
                    <p className="mt-1 font-medium">
                      {car.consumptionKWhPer100Km} kWh
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StationsSection() {
  return (
    <section
      id="stations"
      className="bg-white px-4 py-20 text-[#171A20] sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-[#5C5E62]">
            Charging Access
          </p>
          <h2 className="mt-3 text-[32px] font-medium leading-tight tracking-normal sm:text-[40px]">
            Plan around real charging networks.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#393C41]">
            EVLens is designed to connect buyers with major Thai charging
            networks such as EA Anywhere, PEA Volta, and PTT EV Station.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {["EA Anywhere", "PEA Volta", "PTT EV Station"].map((station) => (
            <a
              key={station}
              href="https://www.google.com/maps/search/EV+charging+station+Thailand"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-14 items-center justify-between rounded bg-[#F4F4F4] px-4 text-sm font-medium transition-colors duration-300 hover:bg-[#EEEEEE]"
            >
              <span className="inline-flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#3E6AE1]" />
                {station}
              </span>
              <ArrowRight className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#F4F4F4] px-4 py-10 text-[#393C41] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[17px] font-medium text-[#171A20]">EVLens</p>
          <p className="mt-2 text-sm text-[#5C5E62]">
            Decision support for EV buyers in Thailand.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <a className="hover:text-[#171A20]" href="#featured">
            Search
          </a>
          <a className="hover:text-[#171A20]" href="#calculator">
            Calculator
          </a>
          <a className="hover:text-[#171A20]" href="#stations">
            Stations
          </a>
          <a className="hover:text-[#171A20]" href="/">
            Privacy
          </a>
        </div>

        <div className="flex items-center gap-2">
          {[Search, Mail, MessageCircle, Share2].map((Icon, index) => (
            <a
              key={index}
              href="/"
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded transition-colors duration-300 hover:bg-white"
              aria-label="Social link"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Navbar />
      <HeroSection />
      <CalculatorSection />
      <FeaturedCarsSection />
      <StationsSection />
      <Footer />
    </main>
  );
}
