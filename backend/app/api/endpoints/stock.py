from typing import List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter()

class FertilizerItem(BaseModel):
    id: str
    name_en: str
    name_te: str
    name_hi: str
    category: str
    bag_size: str
    stock_bags: int
    govt_rate: float
    market_rate: float
    subsidy_per_bag: float
    status: str
    quota_rule_te: str
    quota_rule_en: str

class StockSummary(BaseModel):
    pacs_name: str
    district: str
    last_updated: str
    total_bags_available: int
    next_rake_arrival: str
    items: List[FertilizerItem]

class HelplineItem(BaseModel):
    id: str
    title_en: str
    title_te: str
    title_hi: str
    number: str
    category: str
    description_en: str
    description_te: str
    operational_hours: str
    toll_free: bool

class WeatherAdvisory(BaseModel):
    location: str
    temp_celsius: int
    condition_en: str
    condition_te: str
    condition_hi: str
    humidity: int
    rain_probability: int
    advisory_en: str
    advisory_te: str
    advisory_hi: str

STOCK_DATA: List[FertilizerItem] = [
    FertilizerItem(
        id="urea",
        name_en="Neem Coated Urea (45 kg)",
        name_te="వేప పూత పూసిన యూరియా (45 కేజీల బస్తా)",
        name_hi="नीम लेपित यूरिया (45 किग्रा बोरी)",
        category="Nitrogenous (N)",
        bag_size="45 kg",
        stock_bags=420,
        govt_rate=266.50,
        market_rate=2450.00,
        subsidy_per_bag=2183.50,
        status="In Stock",
        quota_rule_te="ఎకరానికి 2 బస్తాలు (ఖరీఫ్ వరి/పత్తి)",
        quota_rule_en="2 bags per acre (Kharif Paddy/Cotton)"
    ),
    FertilizerItem(
        id="dap",
        name_en="DAP 18:46:0 (50 kg)",
        name_te="డీఏపీ 18:46:0 (50 కేజీల బస్తా)",
        name_hi="डीएपी 18:46:0 (50 किग्रा बोरी)",
        category="Phosphatic (P)",
        bag_size="50 kg",
        stock_bags=180,
        govt_rate=1350.00,
        market_rate=4100.00,
        subsidy_per_bag=2750.00,
        status="In Stock",
        quota_rule_te="ఎకరానికి 1 బస్తా నాట్లు వేసే సమయంలో",
        quota_rule_en="1 bag per acre as basal dose"
    ),
    FertilizerItem(
        id="mop",
        name_en="MOP - Muriate of Potash (50 kg)",
        name_te="ఎంఓపీ - పొటాష్ ఎరువు (50 కేజీల బస్తా)",
        name_hi="एमओपी - पोटाश खाद (50 किग्रा बोरी)",
        category="Potassic (K)",
        bag_size="50 kg",
        stock_bags=95,
        govt_rate=1655.00,
        market_rate=2800.00,
        subsidy_per_bag=1145.00,
        status="Limited Stock",
        quota_rule_te="2 ఎకరాలకు 1 బస్తా",
        quota_rule_en="1 bag per 2 acres"
    ),
    FertilizerItem(
        id="complex",
        name_en="NPK Complex 20:20:0:13 (50 kg)",
        name_te="కాంప్లెక్స్ ఎరువు 20:20:0:13 (50 కేజీల బస్తా)",
        name_hi="एनपीके कॉम्प्लेक्स 20:20:0:13 (50 किग्रा)",
        category="Complex (NPKS)",
        bag_size="50 kg",
        stock_bags=210,
        govt_rate=1200.00,
        market_rate=1950.00,
        subsidy_per_bag=750.00,
        status="In Stock",
        quota_rule_te="ఎకరానికి 1.5 బస్తాలు",
        quota_rule_en="1.5 bags per acre"
    ),
    FertilizerItem(
        id="paddy_seed",
        name_en="Certified Paddy Seeds (Telangana Sona / RNR 15048)",
        name_te="ధృవీకరించిన తెలంగాణ సోనా వరి విత్తనాలు (30 కేజీలు)",
        name_hi="प्रमाणित धान बीज (तेलंगाना सोना RNR 15048 - 30 किग्रा)",
        category="Certified Seeds",
        bag_size="30 kg",
        stock_bags=140,
        govt_rate=1150.00,
        market_rate=1750.00,
        subsidy_per_bag=600.00,
        status="In Stock",
        quota_rule_te="ఎకరానికి 30 కేజీల బస్తా (92% మొలక శాతం)",
        quota_rule_en="30 kg bag per acre (>92% germination)"
    ),
    FertilizerItem(
        id="cotton_seed",
        name_en="Bollgard II Hybrid Cotton Seed",
        name_te="బీటీ-2 హైబ్రిడ్ పత్తి విత్తనాల ప్యాకెట్ (450 గ్రాములు)",
        name_hi="बोलगार्ड II हाइब्रिड कपास बीज (450 ग्राम पैकेट)",
        category="Certified Seeds",
        bag_size="450 g",
        stock_bags=85,
        govt_rate=864.00,
        market_rate=1100.00,
        subsidy_per_bag=236.00,
        status="In Stock",
        quota_rule_te="ఎకరానికి 2 ప్యాకెట్లు",
        quota_rule_en="2 packets per acre"
    )
]

HELPLINES_DATA: List[HelplineItem] = [
    HelplineItem(
        id="kcc",
        title_en="Kisan Call Centre (KCC)",
        title_te="కిసాన్ కాల్ సెంటర్ (జాతీయ హెల్ప్‌లైన్)",
        title_hi="किसान कॉल सेंटर (राष्ट्रीय हेल्पलाइन)",
        number="1800-180-1551",
        category="National Agriculture Advisory",
        description_en="Toll-free agricultural expertise, pest advisories, and weather guidance in 22 languages.",
        description_te="వ్యవసాయ సలహాలు, తెగుళ్ల నివారణ మరియు వాతావరణ సమాచారం కోసం ఉచిత కాల్ సెంటర్.",
        operational_hours="6:00 AM - 10:00 PM (Daily)",
        toll_free=True
    ),
    HelplineItem(
        id="pmfby",
        title_en="PMFBY Crop Loss 72-Hour Claim Desk",
        title_te="PMFBY పంట నష్టం 72 గంటల క్లెయిమ్ డెస్క్",
        title_hi="पीएमएफबीवाई फसल नुकसान 72 घंटे दावा डेस्क",
        number="14447",
        category="Crop Insurance",
        description_en="Mandatory 72-hour localized crop loss reporting desk for hail, inundation, or storm damage.",
        description_te="అకాల వర్షాలు, వరదల వల్ల పంట నష్టం జరిగితే 72 గంటల్లో ఉచితంగా సమాచారం ఇచ్చే డెస్క్.",
        operational_hours="24x7 Toll-Free",
        toll_free=True
    ),
    HelplineItem(
        id="arcs_srd",
        title_en="Sangareddy District ARCS Office",
        title_te="సంగారెడ్డి జిల్లా సహకార సంఘాల ఉప-రిజిస్ట్రార్ (ARCS)",
        title_hi="संगारेड्डी जिला सहायक रजिस्ट्रार सहकारी समितियां (ARCS)",
        number="08455-276342",
        category="Cooperative Governance & Inspection",
        description_en="Statutory appellate authority for PACS by-law violations, member voting disputes, and audits.",
        description_te="PACS సొసైటీ ఉప-నిబంధనల ఉల్లంఘన, ఎన్నికల వివాదాలు మరియు అవినీతిపై చట్టపరమైన విచారణ అధికారి.",
        operational_hours="10:30 AM - 5:00 PM (Mon-Sat)",
        toll_free=False
    ),
    HelplineItem(
        id="dccb_mgr",
        title_en="DCCB Sangareddy Branch Manager",
        title_te="డీసీసీబీ (DCCB) సంగారెడ్డి బ్రాంచ్ మేనేజర్",
        title_hi="डीसीसीबी संगारेड्डी शाखा प्रबंधक",
        number="08455-272188",
        category="Crop Loans & Subvention",
        description_en="Apex cooperative bank manager for 4% crop loan scale of finance and interest subsidy release.",
        description_te="4% పంట రుణాలు, స్కేల్ ఆఫ్ ఫైనాన్స్ మరియు వడ్డీ రాయితీ విడుదలకు సంబంధించి అధికారిక సంప్రదింపులు.",
        operational_hours="10:00 AM - 4:00 PM (Banking Days)",
        toll_free=False
    ),
    HelplineItem(
        id="aeo_kandi",
        title_en="Kandi Village Agricultural Extension Officer (AEO)",
        title_te="కంది గ్రామ వ్యవసాయ విస్తరణ అధికారి (AEO)",
        title_hi="कांडी ग्राम कृषि विस्तार अधिकारी (AEO)",
        number="+91 94409 01824",
        category="Field Survey & E-Crop Booking",
        description_en="Local village officer for field verification, crop damage panchnama, and Rythu Bharosa verification.",
        description_te="గ్రామ స్థాయిలో పంట నష్టం పంచనామా, ఈ-పంట నమోదు మరియు రైతు భరోసా ధృవీకరణ అధికారి.",
        operational_hours="9:00 AM - 6:00 PM",
        toll_free=False
    ),
    HelplineItem(
        id="cyber_fraud",
        title_en="National Cyber & Banking Fraud Reporting",
        title_te="జాతీయ సైబర్ & బ్యాంకింగ్ మోసాల హెల్ప్‌లైన్",
        title_hi="राष्ट्रीय साइबर एवं बैंकिंग धोखाधड़ी हेल्पलाइन",
        number="1930",
        category="Financial Security",
        description_en="Immediate reporting of unauthorized cooperative bank OTP deductions, fake loan calls, or ATM skimming.",
        description_te="బ్యాంక్ ఖాతా నుండి అనధికారిక లావాదేవీలు లేదా ఓటీపీ మోసాలు జరిగితే తక్షణమే కాల్ చేయవలసిన నంబర్.",
        operational_hours="24x7 Emergency",
        toll_free=True
    )
]

WEATHER_DATA = WeatherAdvisory(
    location="Kandi PACS, Sangareddy",
    temp_celsius=29,
    condition_en="Partly Cloudy",
    condition_te="పాక్షికంగా మేఘావృతం",
    condition_hi="आंशिक रूप से बादल",
    humidity=74,
    rain_probability=25,
    advisory_en="Ideal weather for Kharif paddy first dose fertilizer application and weed management.",
    advisory_te="ఖరీఫ్ వరి నాట్లకు మొదటి దఫా యూరియా వేయడానికి మరియు కలుపు నివారణకు అనుకూలమైన వాతావరణం.",
    advisory_hi="खरीफ धान में पहली खाद की खुराक और खरपतवार नियंत्रण के लिए उपयुक्त मौसम।"
)

@router.get("/stock", response_model=StockSummary)
def get_stock_summary():
    """Retrieve live PACS fertilizer and certified seed inventory with government subsidized rates."""
    total_bags = sum(item.stock_bags for item in STOCK_DATA)
    return StockSummary(
        pacs_name="Kandi Primary Agricultural Credit Society (PACS)",
        district="Sangareddy, Telangana",
        last_updated="28 September 2026, 09:30 AM",
        total_bags_available=total_bags,
        next_rake_arrival="29 September 2026 (IFFCO Sangareddy Depot Rake)",
        items=STOCK_DATA
    )

@router.get("/helplines", response_model=List[HelplineItem])
def get_helpline_directory():
    """Retrieve verified cooperative, grievance, and agricultural helplines."""
    return HELPLINES_DATA

@router.get("/weather", response_model=WeatherAdvisory)
def get_weather_advisory():
    """Retrieve real-time weather and agro-advisory for the PACS village."""
    return WEATHER_DATA
