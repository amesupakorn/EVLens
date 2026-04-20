# EVLens

EVLens คือเว็บแอปช่วยตัดสินใจสำหรับคนในประเทศไทยที่กำลังเปลี่ยนจากรถน้ำมันมาใช้รถไฟฟ้า (EV) โดยเน้นตอบคำถามสำคัญก่อนซื้อจริง เช่น ขับได้ไกลแค่ไหน ต้องชาร์จกี่ครั้งต่อสัปดาห์ ประหยัดกว่าน้ำมันเท่าไร และมีรุ่นไหนที่เหมาะกับงบประมาณ

## ฟีเจอร์หลัก

- **EV Range Calculator** คำนวณระยะทางโดยประมาณจากขนาดแบตเตอรี่และอัตราสิ้นเปลืองของรถแต่ละรุ่น
- **Cost & Savings Analytics** เปรียบเทียบค่าใช้จ่ายรถน้ำมันกับค่าไฟของรถ EV แบบรายเดือนและรายปี
- **Electricity Plan Toggle** เลือกค่าไฟแบบ Standard หรือ TOU off-peak เพื่อดูผลลัพธ์ที่ใกล้เคียงพฤติกรรมการชาร์จจริง
- **Smart EV Directory** ค้นหาและกรองรถ EV ตามชื่อรุ่น ช่วงราคา และงบสูงสุด
- **Charging Network Links** ลิงก์ไปยังการค้นหาสถานีชาร์จในไทย เช่น EA Anywhere, PEA Volta และ PTT EV Station
- **Responsive UI** รองรับการใช้งานทั้ง desktop และ mobile สำหรับใช้งานตอนหาข้อมูลหรืออยู่ที่โชว์รูม

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- ESLint

## การติดตั้งและรันโปรเจกต์

ต้องมี Node.js และ pnpm ติดตั้งไว้ก่อน

```bash
pnpm install
pnpm dev
```

หลังจากรันคำสั่ง `pnpm dev` แล้ว เปิด URL ที่ Vite แสดงใน terminal เช่น `http://localhost:5173`

## คำสั่งที่ใช้บ่อย

```bash
pnpm dev
```

รัน development server

```bash
pnpm build
```

ตรวจ TypeScript และ build โปรเจกต์สำหรับ production

```bash
pnpm preview
```

พรีวิว production build บนเครื่อง

```bash
pnpm lint
```

ตรวจคุณภาพโค้ดด้วย ESLint

## โครงสร้างโปรเจกต์

```text
EVLens/
├── src/
│   ├── data/
│   │   └── cars.ts        # ข้อมูลรถ EV และ helper สำหรับ format ราคา
│   ├── pages/
│   │   ├── Home.tsx       # หน้าแรก, calculator, featured cars, charging links
│   │   └── Cars.tsx       # หน้า EV directory พร้อมตัวกรอง
│   ├── App.tsx            # Routing หลัก
│   ├── index.css          # Tailwind และ global styles
│   └── main.tsx           # React entry point
├── DESIGN.md              # แนวทาง visual design
├── SPEC.md                # product requirements และฟีเจอร์เป้าหมาย
├── package.json
└── vite.config.ts
```

## หน้าหลักในแอป

- `/` หน้า landing พร้อม calculator, รถแนะนำ และลิงก์สถานีชาร์จ
- `/cars` หน้า EV directory สำหรับค้นหาและกรองรถตามราคา

## วิธีคำนวณโดยสรุป

### Range

ระบบประเมินระยะทางจาก:

```text
estimated range = battery kWh / consumption kWh per 100 km * 100
```

จากนั้นนำระยะทางขับขี่ต่อวันของผู้ใช้ไปคำนวณจำนวนวันที่รถหนึ่งชาร์จครอบคลุม จำนวนครั้งที่ควรชาร์จต่อสัปดาห์ และเปอร์เซ็นต์แบตเตอรี่ที่เหลือหลังจบวัน

### Savings

ระบบคำนวณค่าใช้จ่ายรถน้ำมันจากราคาน้ำมันและอัตราสิ้นเปลืองรถเดิม แล้วเปรียบเทียบกับค่าไฟของ EV ตาม consumption ของรุ่นที่เลือกและแผนค่าไฟที่ผู้ใช้เลือก

## ข้อมูลรถ

ข้อมูลรถอยู่ใน `src/data/cars.ts` โดยแต่ละรุ่นประกอบด้วย:

- แบรนด์และรุ่น
- ประเภทรถ เช่น Sedan, SUV, Hatchback
- ราคาโดยประมาณในไทย
- ขนาดแบตเตอรี่
- อัตราสิ้นเปลือง
- ระยะทางสูงสุด
- รูปภาพประกอบ

> หมายเหตุ: ข้อมูลราคาและสเปกควรตรวจสอบและอัปเดตจากแหล่งข้อมูลตลาดไทยก่อนใช้งานจริงหรือเผยแพร่เป็นข้อมูลอ้างอิง

## Roadmap

- เพิ่มฐานข้อมูลรถ EV ให้ครอบคลุมตลาดไทยมากขึ้น
- เพิ่มตัวกรองตามประเภทรถ ระยะทางสูงสุด และขนาดแบตเตอรี่
- เชื่อมต่อข้อมูลสถานีชาร์จผ่าน API หรือแผนที่แบบ interactive
- เพิ่มหน้ารายละเอียดรถแต่ละรุ่น
- เพิ่มระบบบันทึกรุ่นที่สนใจเพื่อเปรียบเทียบภายหลัง
- เพิ่ม unit test สำหรับ logic การคำนวณ range และ savings

## License

โปรเจกต์นี้ยังไม่ได้ระบุ license
