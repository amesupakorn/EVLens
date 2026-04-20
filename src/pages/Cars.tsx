import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BatteryCharging,
  CarFront,
  Gauge,
  Search,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { cars, formatTHB } from "../data/cars";

const priceRanges = [
  { label: "ทั้งหมด", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "ต่ำกว่า 8 แสน", min: 0, max: 800_000 },
  { label: "8 แสน - 1.2 ล้าน", min: 800_000, max: 1_200_000 },
  { label: "1.2 - 1.6 ล้าน", min: 1_200_000, max: 1_600_000 },
  { label: "มากกว่า 1.6 ล้าน", min: 1_600_000, max: Number.POSITIVE_INFINITY },
];

const maxPrice = Math.max(...cars.map((car) => car.priceTHB));

export default function Cars() {
  const [modelQuery, setModelQuery] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [maxBudget, setMaxBudget] = useState(maxPrice);

  const selectedRange = priceRanges[selectedPriceRange];

  const filteredCars = useMemo(() => {
    const query = modelQuery.trim().toLowerCase();

    return cars.filter((car) => {
      const searchableName = `${car.brand} ${car.model}`.toLowerCase();
      const matchesModel = query.length === 0 || searchableName.includes(query);
      const matchesRange =
        car.priceTHB >= selectedRange.min && car.priceTHB <= selectedRange.max;
      const matchesBudget = car.priceTHB <= maxBudget;

      return matchesModel && matchesRange && matchesBudget;
    });
  }, [modelQuery, selectedRange, maxBudget]);

  const resetFilters = () => {
    setModelQuery("");
    setSelectedPriceRange(0);
    setMaxBudget(maxPrice);
  };

  return (
    <main className="min-h-screen bg-white text-[#171A20]">
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-[17px] font-medium tracking-normal">
            EVLens
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-10 items-center gap-2 rounded px-3 text-sm font-medium text-[#393C41] transition-colors duration-300 hover:bg-black/5"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าแรก
          </Link>
        </nav>
      </header>

      <section className="bg-[#171A20] px-4 pb-16 pt-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-white/70">EV Directory</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-[40px] font-medium leading-[1.08] tracking-normal sm:text-[56px]">
                เลือกรถ EV ที่เข้ากับงบและชีวิตประจำวัน
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                ค้นหารุ่นที่สนใจ กรองตามช่วงราคา และเทียบสเปกสำคัญก่อนลงลึกกับตัวคำนวณ
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-white/15 pt-5 lg:border-t-0 lg:pt-0">
              <DirectoryStat label="รุ่นทั้งหมด" value={`${cars.length}`} />
              <DirectoryStat
                label="ระยะไกลสุด"
                value={`${Math.max(...cars.map((car) => car.maxRangeKm))} km`}
              />
              <DirectoryStat label="เริ่มต้น" value={formatTHB(549_000)} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded bg-[#F4F4F4] p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_1.4fr_0.9fr] lg:items-end">
              <label>
                <span className="flex items-center gap-2 text-sm font-medium text-[#393C41]">
                  <Search className="h-4 w-4 text-[#3E6AE1]" />
                  รุ่นรถ
                </span>
                <div className="mt-2 flex h-11 items-center rounded border border-[#D0D1D2] bg-white px-3 focus-within:border-[#3E6AE1]">
                  <input
                    value={modelQuery}
                    onChange={(event) => setModelQuery(event.target.value)}
                    placeholder="เช่น BYD, Model 3, MG4"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#8E8E8E]"
                  />
                </div>
              </label>

              <div>
                <span className="flex items-center gap-2 text-sm font-medium text-[#393C41]">
                  <SlidersHorizontal className="h-4 w-4 text-[#3E6AE1]" />
                  ช่วงราคา
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {priceRanges.map((range, index) => (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => setSelectedPriceRange(index)}
                      className={`min-h-11 rounded px-3 text-sm font-medium transition-colors duration-300 ${
                        selectedPriceRange === index
                          ? "bg-[#171A20] text-white"
                          : "bg-white text-[#393C41] hover:bg-[#EEEEEE]"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <label>
                <span className="flex items-center justify-between text-sm font-medium text-[#393C41]">
                  งบสูงสุด
                  <span>{formatTHB(maxBudget)}</span>
                </span>
                <input
                  type="range"
                  min={500_000}
                  max={Math.ceil(maxPrice / 100_000) * 100_000}
                  step={50_000}
                  value={maxBudget}
                  onChange={(event) => setMaxBudget(Number(event.target.value))}
                  className="mt-4 h-2 w-full accent-[#3E6AE1]"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#D0D1D2] pt-5 sm:flex-row sm:items-center">
              <p className="text-sm text-[#5C5E62]">
                พบ {filteredCars.length} รุ่นจากทั้งหมด {cars.length} รุ่น
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-10 items-center justify-center rounded bg-white px-4 text-sm font-medium text-[#393C41] transition-colors duration-300 hover:bg-[#EEEEEE]"
              >
                ล้างตัวกรอง
              </button>
            </div>
          </div>

          {filteredCars.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car) => (
                <article
                  key={car.id}
                  className="overflow-hidden rounded bg-[#F4F4F4]"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#EEEEEE]">
                    <img
                      src={car.imageUrl}
                      alt={`${car.brand} ${car.model}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-[#5C5E62]">{car.type}</p>
                        <h2 className="mt-1 text-[17px] font-medium">
                          {car.brand} {car.model}
                        </h2>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-[#171A20]">
                        {formatTHB(car.priceTHB)}
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                      <CarMetric
                        icon={<Gauge className="h-4 w-4" />}
                        label="Range"
                        value={`${car.maxRangeKm} km`}
                      />
                      <CarMetric
                        icon={<BatteryCharging className="h-4 w-4" />}
                        label="Battery"
                        value={`${car.batteryKWh} kWh`}
                      />
                      <CarMetric
                        icon={<Zap className="h-4 w-4" />}
                        label="Consumption"
                        value={`${car.consumptionKWhPer100Km} kWh/100km`}
                      />
                      <CarMetric
                        icon={<CarFront className="h-4 w-4" />}
                        label="Body"
                        value={car.type}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded bg-[#F4F4F4] px-5 py-16 text-center">
              <p className="text-[22px] font-medium">ไม่พบรุ่นที่ตรงกับตัวกรอง</p>
              <p className="mt-2 text-sm text-[#5C5E62]">
                ลองขยายช่วงราคา หรือลดคำค้นหาให้กว้างขึ้น
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 inline-flex min-h-10 items-center justify-center rounded bg-[#3E6AE1] px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#345ac1]"
              >
                แสดงรถทั้งหมด
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function DirectoryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-white/55">{label}</p>
      <p className="mt-2 text-[22px] font-medium text-white">{value}</p>
    </div>
  );
}

function CarMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded bg-white p-3">
      <div className="text-[#3E6AE1]">{icon}</div>
      <p className="mt-2 text-xs text-[#5C5E62]">{label}</p>
      <p className="mt-1 font-medium text-[#171A20]">{value}</p>
    </div>
  );
}
