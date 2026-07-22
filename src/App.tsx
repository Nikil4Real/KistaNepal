import React, { useState, useEffect } from 'react';
import {
  Calculator,
  FileSpreadsheet,
  Printer,
  Info,
  Percent,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
}

const nepaliNumbers = [
  "", "एक", "दुई", "तीन", "चार", "पाँच", "छ", "सात", "आठ", "नौ", "दस",
  "एघार", "बाह्र", "तेह्र", "चौध", "पन्ध्र", "सोह्र", "सत्र", "अठार", "उन्नाइस", "बीस",
  "इक्कीस", "बाइस", "तेइस", "चौबिस", "पच्चिस", "छब्बीस", "सत्ताइस", "अठ्ठाइस", "उनन्तीस", "तीस",
  "एकतीस", "बत्तीस", "तेतीस", "चौंतीस", "पैंतीस", "छत्तीस", "सैंतीस", "अठतीस", "उनन्चालीस", "चालीस",
  "एकचालीस", "बयालीस", "त्रिचालीस", "चौबालीस", "पैंतालीस", "छियालीस", "सरतालीस", "अठतालीस", "उनन्पचास", "पचास",
  "एकान्न", "बाउन्न", "त्रिपन्न", "चौवन्न", "पचपन्न", "छप्पन्न", "सन्ताउन्न", "अठ्ठाउन्न", "उनन्साठी", "साठी",
  "एकसट्ठी", "बाइसट्ठी", "त्रिसट्ठी", "चौसट्ठी", "पैंसट्ठी", "छियासट्ठी", "सरसट्ठी", "अठसट्ठी", "उनन्सत्तर", "सत्तर",
  "एकहत्तर", "बाहत्तर", "त्रिहत्तर", "चौहत्तर", "पचहत्तर", "छयहत्तर", "सतहत्तर", "अठहत्तर", "उनन्असी", "असी",
  "एक्यासी", "बियासी", "त्रियासी", "चौरासी", "पचासी", "छियासी", "सतासी", "अठासी", "उनन्नब्बे", "नब्बे",
  "एकानब्बे", "बयानब्बे", "त्रियानब्बे", "चौरानब्बे", "पञ्चानब्बे", "छियानब्बे", "सन्तानब्बे", "अन्ठानब्बे", "उनन्सय"
];

const numberToNepaliWordsInNepali = (num: number): string => {
  if (isNaN(num) || num <= 0) return "";
  let temp = Math.floor(num);
  if (temp === 0) return "शून्य रुपैयाँ";

  const crore = Math.floor(temp / 10000000);
  temp %= 10000000;
  const lakh = Math.floor(temp / 100000);
  temp %= 100000;
  const thousand = Math.floor(temp / 1000);
  temp %= 1000;
  const hundred = Math.floor(temp / 100);
  const belowHundred = temp % 100;

  let words = "";
  if (crore > 0) {
    words += (crore < 100 ? nepaliNumbers[crore] : crore) + " करोड ";
  }
  if (lakh > 0) {
    words += (lakh < 100 ? nepaliNumbers[lakh] : lakh) + " लाख ";
  }
  if (thousand > 0) {
    words += (thousand < 100 ? nepaliNumbers[thousand] : thousand) + " हजार ";
  }
  if (hundred > 0) {
    words += nepaliNumbers[hundred] + " सय ";
  }
  if (belowHundred > 0) {
    words += nepaliNumbers[belowHundred] + " ";
  }

  return words.trim() + " रुपैयाँ मात्र";
};

const TRANSLATIONS = {
  EN: {
    nepalStandards: "Nepal Standards",
    emiMethod: "EMI METHOD",
    equatedMonthly: "Equated Monthly",
    epiMethod: "EPI METHOD",
    equatedPrincipal: "Equated Principal",
    loanParameters: "Loan Parameters",
    configureParams: "Configure parameters according to Nepal standards.",
    loanAmount: "Loan Amount (NPR)",
    annualInterestRate: "Annual Interest Rate (%)",
    tenure: "Time Period",
    years: "Years",
    months: "Months",
    yearPreset: "Year",
    yearsPreset: "Years",
    moPreset: "Mo",
    monthsPreset: "Months",
    emiInstallmentLabel: "Equated Monthly Installment (EMI)",
    epiInstallmentLabel: "First Month Repayment (EPI)",
    emiCalculation: "EMI Calculation",
    epiCalculation: "EPI Calculation",
    monthSuffix: "/ month",
    epiReducingNote: "Reducing month-by-month down to {lastPayment} in the final month.",
    loanPrincipal: "Loan Principal",
    totalInterest: "Total Interest",
    grandTotal: "Grand Total",
    chartPrincipal: "Principal",
    chartInterest: "Interest",
    howEmiWorks: "How EMI Works?",
    howEpiWorks: "How EPI Works?",
    emiExplanation: "In EMI (Equated Monthly Installment), your monthly payment is completely uniform. Initially, a major portion of your installment is spent paying off interest. As time progresses, the interest portion shrinks while your principal repayment grows.",
    epiExplanation: "In EPI (Equated Principal Installment), the principal payment is split exactly into equal parts each month. Interest is computed only on your actual outstanding balance. This makes your initial payments higher, but decreases your total interest liability significantly.",
    amortizationSchedule: "Amortization Schedule",
    monthBreakdown: "Month-by-month repayment breakdown.",
    excelExport: "Excel Export",
    saveAsPdf: "Save As PDF",
    tableMonth: "Month",
    tableInstallment: "Monthly Installment",
    tablePrincipalPaid: "Principal Paid",
    tableInterestPaid: "Interest Paid",
    tableRemainingBalance: "Remaining Balance",
    enterValidInputs: "Enter a valid amount, rate, and tenure to display the schedule.",
    footerText: "© 2026 KistaNepal.Com | All Rights Reserved.",
    currencySymbol: "रू",
    reportTitle: "Loan Amortization Statement",
    calculationMethod: "Calculation Method",
    dateLabel: "Date",
    installment: "Installment",
    firstMonthInstallment: "First Month Installment",
    lastMonthInstallment: "Last Month Installment",
  },
  NP: {
    nepalStandards: "नेपाल बैंकिङ मानक",
    emiMethod: "इएमआई विधि",
    equatedMonthly: "समान मासिक किस्ता",
    epiMethod: "इपिआई विधि",
    equatedPrincipal: "समान साँवा किस्ता",
    loanParameters: "कर्जा मापदण्डहरू",
    configureParams: "नेपालको बैंकिङ मानक अनुसार विवरणहरू भर्नुहोस्।",
    loanAmount: "कर्जा रकम (रु)",
    annualInterestRate: "वार्षिक ब्याज दर (%)",
    tenure: "भुक्तानी अवधि",
    years: "वर्ष",
    months: "महिना",
    yearPreset: "वर्ष",
    yearsPreset: "वर्ष",
    moPreset: "महिना",
    monthsPreset: "महिना",
    emiInstallmentLabel: "समान मासिक किस्ता (EMI)",
    epiInstallmentLabel: "पहिलो महिनाको किस्ता (EPI)",
    emiCalculation: "EMI गणना",
    epiCalculation: "EPI गणना",
    monthSuffix: "/ महिना",
    epiReducingNote: "अन्तिम महिनामा घट्दै {lastPayment} सम्म पुग्नेछ।",
    loanPrincipal: "कर्जा साँवा रकम",
    totalInterest: "कुल ब्याज रकम",
    grandTotal: "जम्मा बुझाउनुपर्ने रकम",
    chartPrincipal: "साँवा रकम",
    chartInterest: "ब्याज रकम",
    howEmiWorks: "EMI कसरी काम गर्छ?",
    howEpiWorks: "EPI कसरी काम गर्छ?",
    emiExplanation: "इएमआई (समान मासिक किस्ता) मा, तपाईंको मासिक भुक्तानी सधैं समान रहन्छ। सुरुका महिनाहरूमा किस्ताको ठूलो हिस्सा ब्याज चुक्ता गर्न जान्छ। समय बित्दै जाँदा, ब्याजको हिस्सा घट्दै जान्छ र साँवा भुक्तानीको हिस्सा बढ्दै जान्छ।",
    epiExplanation: "इपिआई (समान साँवा किस्ता) मा, हरेक महिना साँवाको भुक्तानी बराबर भागमा बाँडिन्छ। ब्याज भने बाँकी रहेको साँवा रकममा मात्र गणना गरिन्छ। यसले गर्दा सुरुका महिनाहरूमा भुक्तानी बढी हुन्छ, तर समग्रमा तिर्नुपर्ने कुल ब्याज रकम उल्लेख्य रूपधमा घट्छ।",
    amortizationSchedule: "ऋण भुक्तानी तालिका",
    monthBreakdown: "महिना अनुसारको ऋण चुक्ताको विस्तृत विवरण।",
    excelExport: "एक्सेल निर्यात",
    saveAsPdf: "Save As PDF",
    tableMonth: "महिना",
    tableInstallment: "मासिक किस्ता",
    tablePrincipalPaid: "साँवा भुक्तानी",
    tableInterestPaid: "ब्याज भुक्तानी",
    tableRemainingBalance: "बाँकी ऋण रकम",
    enterValidInputs: "कृपया विवरणहरू सच्याउनुहोस् र तालिका हेर्नुहोस्।",
    footerText: "© २०२६ kistanepal.com — मानक लाख र करोड गणना प्रणाली",
    footerSubtext: "वित्तीय संस्थाहरूका लागि विशेष रूपमा डिजाइन गरिएको, इएमआई (EMI) र इपिआई (EPI) दुवै कर्जा गणना गर्न उपयोगी।",
    currencySymbol: "रु",
    reportTitle: "ऋण भुक्तानी तालिका विवरण",
    calculationMethod: "गणना विधि",
    dateLabel: "मिति",
    installment: "किस्ता",
    firstMonthInstallment: "पहिलो महिनाको किस्ता",
    lastMonthInstallment: "अन्तिम महिनाको किस्ता",
  }
};

export default function App() {
  // Calculator Parameters State
  const [calcType, setCalcType] = useState<'EMI' | 'EPI'>('EMI');
  const [bankName, setBankName] = useState('Rastriya Banijya Bank');
  const [amount, setAmount] = useState<number>(1500000); // Default 15 Lakhs NPR
  const [rate, setRate] = useState<number>(10.5); // Default 10.5%
  const [tenure, setTenure] = useState<number>(5); // Default 5 years
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  // Language State
  const [lang, setLang] = useState<'EN' | 'NP'>('EN');

  // Computed values
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0); // For EMI
  const [firstPayment, setFirstPayment] = useState<number>(0); // For EPI first month
  const [lastPayment, setLastPayment] = useState<number>(0); // For EPI last month

  // Compute Amortization Schedule on parameters change
  useEffect(() => {
    const P = amount || 0;
    const R = rate || 0;
    const n = tenureType === 'years' ? (tenure || 0) * 12 : (tenure || 0);

    if (P <= 0 || R < 0 || n <= 0) {
      setSchedule([]);
      setTotalInterest(0);
      setMonthlyPayment(0);
      setFirstPayment(0);
      setLastPayment(0);
      return;
    }

    const r = R / (12 * 100);
    const tempSchedule: ScheduleRow[] = [];
    let calculatedTotalInterest = 0;

    if (calcType === 'EMI') {
      let emi = 0;
      if (r === 0) {
        emi = P / n;
        let remaining = P;
        for (let i = 1; i <= n; i++) {
          const principal = emi;
          remaining = Math.max(0, remaining - principal);
          if (i === n) remaining = 0;
          tempSchedule.push({
            month: i,
            payment: emi,
            principal: principal,
            interest: 0,
            remaining: remaining
          });
        }
      } else {
        emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        let remaining = P;
        for (let i = 1; i <= n; i++) {
          const interest = remaining * r;
          const principal = emi - interest;
          remaining = Math.max(0, remaining - principal);
          if (i === n) remaining = 0;
          tempSchedule.push({
            month: i,
            payment: emi,
            principal: principal,
            interest: interest,
            remaining: remaining
          });
          calculatedTotalInterest += interest;
        }
      }
      setMonthlyPayment(emi);
      setSchedule(tempSchedule);
      setTotalInterest(calculatedTotalInterest);
    } else {
      // EPI: Fixed Principal, interest calculated on remaining balance
      const fixedPrincipal = P / n;
      let remaining = P;
      for (let i = 1; i <= n; i++) {
        const interest = remaining * r;
        const payment = fixedPrincipal + interest;
        remaining = Math.max(0, remaining - fixedPrincipal);
        if (i === n) remaining = 0;
        tempSchedule.push({
          month: i,
          payment: payment,
          principal: fixedPrincipal,
          interest: interest,
          remaining: remaining
        });
        calculatedTotalInterest += interest;
      }
      setSchedule(tempSchedule);
      setTotalInterest(calculatedTotalInterest);
      if (tempSchedule.length > 0) {
        setFirstPayment(tempSchedule[0].payment);
        setLastPayment(tempSchedule[tempSchedule.length - 1].payment);
      }
    }
  }, [calcType, amount, rate, tenure, tenureType]);

  /**
   * Vedic Format Number System Formatter (Lakhs & Crores)
   * The first grouping is 3 digits from right, then groups of 2 digits.
   */
  const formatNepaliCurrency = (num: number, currentLang: 'EN' | 'NP' = lang): string => {
    const symbol = TRANSLATIONS[currentLang]?.currencySymbol || "रू";
    if (num === null || num === undefined || isNaN(num)) return `${symbol} 0.00`;
    const parts = Number(num).toFixed(2).split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];

    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherParts = integerPart.substring(0, integerPart.length - 3);
    if (otherParts !== '') {
      let grouped = '';
      let temp = otherParts;
      while (temp.length > 0) {
        if (temp.length > 2) {
          grouped = ',' + temp.substring(temp.length - 2) + grouped;
          temp = temp.substring(0, temp.length - 2);
        } else {
          grouped = temp + grouped;
          temp = '';
        }
      }
      integerPart = grouped + ',' + lastThree;
    } else {
      integerPart = lastThree;
    }

    return `${symbol} ${integerPart}.${decimalPart}`;
  };

  /**
   * Convert numbers to verbal representation in English (Lakhs and Crores scale)
   */
  const numberToNepaliWords = (num: number): string => {
    if (isNaN(num) || num <= 0) return "";
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return "";
      let res = "";
      if (n >= 100) {
        res += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n >= 20) {
        res += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      }
      if (n > 0) {
        res += ones[n] + " ";
      }
      return res;
    };

    let temp = Math.floor(num);
    if (temp === 0) return "Zero Rupees";

    const crore = Math.floor(temp / 10000000);
    temp %= 10000000;
    const lakh = Math.floor(temp / 100000);
    temp %= 100000;
    const thousand = Math.floor(temp / 1000);
    temp %= 1000;
    const hundredAndBelow = temp;

    let words = "";
    if (crore > 0) {
      words += convertLessThanThousand(crore) + "Crore ";
    }
    if (lakh > 0) {
      words += convertLessThanThousand(lakh) + "Lakh ";
    }
    if (thousand > 0) {
      words += convertLessThanThousand(thousand) + "Thousand ";
    }
    if (hundredAndBelow > 0) {
      words += convertLessThanThousand(hundredAndBelow);
    }

    return words.trim() + " Rupees Only";
  };

  // Preset Handlers
  const handleAmountPreset = (val: number) => {
    setAmount(val);
  };

  const handleTenurePreset = (val: number) => {
    setTenure(val);
  };

  // Export CSV
  const downloadCSV = () => {
    if (schedule.length === 0) return;
    const headers = ["Month", "Monthly Payment (NPR)", "Principal Repaid (NPR)", "Interest Paid (NPR)", "Remaining Balance (NPR)"];

    let csvRows = [];
    csvRows.push(`"kistanepal.com Loan Amortization Statement"`);
    csvRows.push(`"Loan Type:","${calcType}"`);
    csvRows.push(`"Interest Rate:","${rate.toFixed(2)}%"`);
    csvRows.push(`"Tenure:","${tenure} ${tenureType}"`);
    csvRows.push(`"Generated Date:","${new Date().toLocaleDateString()}"`);
    csvRows.push("");
    csvRows.push(headers.join(","));

    schedule.forEach(row => {
      csvRows.push([
        row.month,
        row.payment.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.remaining.toFixed(2)
      ].join(","));
    });

    // Add BOM for Microsoft Excel Unicode recognition
    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Amortization_Schedule_${calcType}_kistanepal.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print PDF
  const triggerPrint = () => {
    window.print();
  };

  // Interest to Principal Chart calculation
  const grandTotal = (amount || 0) + totalInterest;
  const principalPct = Math.round(((amount || 0) / (grandTotal || 1)) * 100) || 0;
  const interestPct = 100 - principalPct;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-violet-100 selection:text-violet-900">

      {/* ----------------- SCREEN MAIN APP VIEW ----------------- */}
      <div className="flex-grow flex flex-col no-print">

        {/* Navigation / Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[72px] py-1 flex items-center justify-between">

            {/* Branding Logo */}
            <div className="flex items-center">
              <img
                src="/assets/logo.jpg"
                alt="kistanepal.com Logo"
                className="h-[65px] w-auto max-w-[150px] object-contain transition-transform hover:opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Central Mode Toggle (EMI / EPI) */}
            <div className="bg-slate-100 p-1 rounded-xl hidden md:flex items-center gap-1 shadow-inner border border-slate-200/50">
              <button
                type="button"
                onClick={() => setCalcType('EMI')}
                className={`px-5 py-2 rounded-lg font-semibold text-xs tracking-wide transition-all duration-200 flex flex-col items-center justify-center ${calcType === 'EMI'
                  ? 'bg-white text-violet-700 shadow-md'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                <span>{TRANSLATIONS[lang].emiMethod}</span>
                <span className="text-[9px] opacity-75 font-normal">{TRANSLATIONS[lang].equatedMonthly}</span>
              </button>
              <button
                type="button"
                onClick={() => setCalcType('EPI')}
                className={`px-5 py-2 rounded-lg font-semibold text-xs tracking-wide transition-all duration-200 flex flex-col items-center justify-center ${calcType === 'EPI'
                  ? 'bg-white text-violet-700 shadow-md'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                <span>{TRANSLATIONS[lang].epiMethod}</span>
                <span className="text-[9px] opacity-75 font-normal">{TRANSLATIONS[lang].equatedPrincipal}</span>
              </button>
            </div>

            {/* Right Action Switch: Language Selector Toggle */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 bg-slate-100 p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-inner border border-slate-200/50 no-print">
              <button
                onClick={() => setLang('EN')}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-normal transition-all duration-150 ${lang === 'EN'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('NP')}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-normal transition-all duration-150 ${lang === 'NP'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                नेपाली
              </button>
            </div>

          </div>
        </header>

        {/* Dynamic Mode Switcher for Mobile */}
        <div className="md:hidden bg-white border-b border-slate-200 p-3 flex justify-center no-print">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center w-full max-w-sm shadow-inner border border-slate-200/50">
            <button
              type="button"
              onClick={() => setCalcType('EMI')}
              className={`flex-1 py-2 rounded-lg font-semibold text-xs text-center transition-all duration-200 ${calcType === 'EMI'
                ? 'bg-white text-violet-700 shadow-md'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              {TRANSLATIONS[lang].emiMethod}
            </button>
            <button
              type="button"
              onClick={() => setCalcType('EPI')}
              className={`flex-1 py-2 rounded-lg font-semibold text-xs text-center transition-all duration-200 ${calcType === 'EPI'
                ? 'bg-white text-violet-700 shadow-md'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              {TRANSLATIONS[lang].epiMethod}
            </button>
          </div>
        </div>

        {/* View Layout Container */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <AnimatePresence mode="wait">
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Dynamic Parameter Grid and live calculations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Inputs form */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{TRANSLATIONS[lang].loanParameters}</h2>
                      <p className="text-xs text-slate-400">{TRANSLATIONS[lang].configureParams}</p>
                    </div>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">

                    {/* Loan Amount Input with presets */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {TRANSLATIONS[lang].loanAmount}
                        </label>
                        <span className="text-[10.5px] font-semibold text-violet-700 max-w-[65%] truncate" title={lang === 'NP' ? numberToNepaliWordsInNepali(amount) : numberToNepaliWords(amount)}>
                          {lang === 'NP' ? numberToNepaliWordsInNepali(amount) : numberToNepaliWords(amount)}
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 font-bold text-slate-400 text-sm">{TRANSLATIONS[lang].currencySymbol}</span>
                        <input
                          type="number"
                          min="1000"
                          step="1000"
                          value={amount || ''}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition-all duration-200 outline-none text-sm font-bold text-left"
                        />
                      </div>
                      {/* Preset buttons */}
                      <div className="flex flex-wrap gap-1.5 mt-2 no-print">
                        <button
                          type="button"
                          onClick={() => handleAmountPreset(500000)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                        >
                          {lang === 'NP' ? '५ लाख' : '5 Lakh'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAmountPreset(1500000)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                        >
                          {lang === 'NP' ? '१५ लाख' : '15 Lakh'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAmountPreset(5000000)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                        >
                          {lang === 'NP' ? '५० लाख' : '50 Lakh'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAmountPreset(10000000)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                        >
                          {lang === 'NP' ? '१ करोड' : '1 Crore'}
                        </button>
                      </div>
                    </div>

                    {/* Annual Interest Rate (%) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5 text-slate-400" />
                        <span>{TRANSLATIONS[lang].annualInterestRate}</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min="0.1"
                          max="50"
                          step="0.01"
                          value={rate || ''}
                          onChange={(e) => setRate(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition-all duration-200 outline-none text-sm font-bold text-left"
                        />
                        <span className="absolute right-4 text-xs font-bold text-slate-400">%</span>
                      </div>
                    </div>

                    {/* Tenure with switch toggle */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{TRANSLATIONS[lang].tenure}</span>
                        </label>
                        {/* Segmented Switch for Years / Months */}
                        <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200/50 no-print">
                          <button
                            type="button"
                            onClick={() => setTenureType('years')}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all duration-150 ${tenureType === 'years'
                              ? 'bg-white text-violet-700 shadow-sm'
                              : 'text-slate-500'
                              }`}
                          >
                            {TRANSLATIONS[lang].years}
                          </button>
                          <button
                            type="button"
                            onClick={() => setTenureType('months')}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all duration-150 ${tenureType === 'months'
                              ? 'bg-white text-violet-700 shadow-sm'
                              : 'text-slate-500'
                              }`}
                          >
                            {TRANSLATIONS[lang].months}
                          </button>
                        </div>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min="1"
                          value={tenure || ''}
                          onChange={(e) => setTenure(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition-all duration-200 outline-none text-sm font-bold"
                        />
                        <span className="absolute right-4 text-xs font-bold text-slate-400 capitalize">
                          {tenureType === 'years' ? TRANSLATIONS[lang].years : TRANSLATIONS[lang].months}
                        </span>
                      </div>
                      {/* Tenure Presets */}
                      <div className="flex flex-wrap gap-1.5 mt-2 no-print">
                        {tenureType === 'years' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleTenurePreset(1)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                            >
                              1 {TRANSLATIONS[lang].yearPreset}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTenurePreset(3)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                            >
                              3 {TRANSLATIONS[lang].yearsPreset}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTenurePreset(5)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                            >
                              5 {TRANSLATIONS[lang].yearsPreset}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTenurePreset(10)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                            >
                              10 {TRANSLATIONS[lang].yearsPreset}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTenurePreset(20)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                            >
                              20 {TRANSLATIONS[lang].yearsPreset}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleTenurePreset(12)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                            >
                              12 {TRANSLATIONS[lang].moPreset}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTenurePreset(36)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                            >
                              36 {TRANSLATIONS[lang].moPreset}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTenurePreset(60)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                            >
                              60 {TRANSLATIONS[lang].moPreset}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTenurePreset(120)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                            >
                              120 {TRANSLATIONS[lang].moPreset}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTenurePreset(240)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-slate-600 transition-all duration-150"
                            >
                              240 {TRANSLATIONS[lang].moPreset}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                  </form>
                </div>

                {/* RIGHT COLUMN: Summary cards & visual chart */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                  {/* Dark Premium Summary Card */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex-grow flex flex-col justify-between">
                    {/* background pattern */}
                    <div className="absolute right-0 top-0 w-48 h-48 bg-violet-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                          {calcType === 'EMI' ? TRANSLATIONS[lang].emiInstallmentLabel : TRANSLATIONS[lang].epiInstallmentLabel}
                        </span>
                        <span className="text-[10px] bg-violet-800/60 border border-violet-700/50 text-violet-300 px-2.5 py-0.5 rounded-full font-bold">
                          {calcType === 'EMI' ? TRANSLATIONS[lang].emiCalculation : TRANSLATIONS[lang].epiCalculation}
                        </span>
                      </div>

                      <div className="mt-4">
                        {calcType === 'EMI' ? (
                          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            {formatNepaliCurrency(monthlyPayment)}
                            <span className="text-sm font-normal text-slate-400 ml-1">{TRANSLATIONS[lang].monthSuffix}</span>
                          </h3>
                        ) : (
                          <div className="space-y-1">
                            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                              {formatNepaliCurrency(firstPayment)}
                            </h3>
                            <p className="text-xs text-slate-400">
                              {TRANSLATIONS[lang].epiReducingNote.replace('{lastPayment}', formatNepaliCurrency(lastPayment))}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-b border-slate-800/80 my-6">
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{TRANSLATIONS[lang].loanPrincipal}</span>
                        <p className="text-sm font-bold text-slate-100">{formatNepaliCurrency(amount)}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] text-violet-400 font-medium uppercase tracking-wider">{TRANSLATIONS[lang].totalInterest}</span>
                        <p className="text-sm font-bold text-violet-300">{formatNepaliCurrency(totalInterest)}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider font-semibold">{TRANSLATIONS[lang].grandTotal}</span>
                        <p className="text-sm font-bold text-white">{formatNepaliCurrency(grandTotal)}</p>
                      </div>
                    </div>

                    {/* Custom Horizontal Stacked Bar Chart */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-slate-400 rounded-sm"></span>
                          <span>{TRANSLATIONS[lang].chartPrincipal}: <strong>{principalPct}%</strong></span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-violet-500 rounded-sm"></span>
                          <span>{TRANSLATIONS[lang].chartInterest}: <strong>{interestPct}%</strong></span>
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-800 rounded-full flex overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${principalPct}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="bg-slate-400 h-full"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${interestPct}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                          className="bg-violet-500 h-full"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Educational Info Callout */}
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Info className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {calcType === 'EMI' ? TRANSLATIONS[lang].howEmiWorks : TRANSLATIONS[lang].howEpiWorks}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {calcType === 'EMI' ? TRANSLATIONS[lang].emiExplanation : TRANSLATIONS[lang].epiExplanation}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* AMORTIZATION TABLE SECTION */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                {/* Table header control and action exports */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="text-lg font-sans font-semibold text-slate-900">{TRANSLATIONS[lang].amortizationSchedule}</h3>
                    <p className="text-xs text-slate-400">{TRANSLATIONS[lang].monthBreakdown}</p>
                  </div>

                  {/* Export Action Buttons */}
                  <div className="flex items-center gap-2.5 w-full sm:w-auto no-print">
                    <button
                      type="button"
                      onClick={downloadCSV}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all duration-150"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>{TRANSLATIONS[lang].excelExport}</span>
                    </button>
                    <button
                      type="button"
                      onClick={triggerPrint}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-100 transition-all duration-150"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{TRANSLATIONS[lang].saveAsPdf}</span>
                    </button>
                  </div>
                </div>

                {/* Amortization Schedule Data Table */}
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-medium border-b border-slate-100">
                        <th className="py-3 px-4 text-center font-semi-bold font-sans">{TRANSLATIONS[lang].tableMonth}</th>
                        <th className="py-3 px-4 text-right font-semi-bold font-sans">{TRANSLATIONS[lang].tableInstallment}</th>
                        <th className="py-3 px-4 text-right font-semi-bold font-sans">{TRANSLATIONS[lang].tablePrincipalPaid}</th>
                        <th className="py-3 px-4 text-right font-semi-bold font-sans">{TRANSLATIONS[lang].tableInterestPaid}</th>
                        <th className="py-3 px-4 text-right font-semi-bold font-sans">{TRANSLATIONS[lang].tableRemainingBalance}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {schedule.length > 0 ? (
                        schedule.map((row) => (
                          <tr key={row.month} className="hover:bg-violet-50/40 transition-colors duration-150">
                            <td className="py-3.5 px-4 text-center font-normal text-slate-600 font-sans">{row.month}</td>
                            <td className="py-3.5 px-4 text-right font-normal text-slate-900 font-sans">{formatNepaliCurrency(row.payment)}</td>
                            <td className="py-3.5 px-4 text-right font-normal text-slate-500 font-sans">{formatNepaliCurrency(row.principal)}</td>
                            <td className="py-3.5 px-4 text-right font-normal text-violet-600 font-sans">{formatNepaliCurrency(row.interest)}</td>
                            <td className="py-3.5 px-4 text-right font-normal text-slate-700 font-sans">{formatNepaliCurrency(row.remaining)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-normal font-sans">
                            {TRANSLATIONS[lang].enterValidInputs}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>

        </main>

        <footer className="text-slate-500 text-center text-[13px] mt-auto no-print">
          <div className="w-full mx-auto space-y-5">
            <p className="text-slate-500">{TRANSLATIONS[lang].footerText}</p>
            <p>{TRANSLATIONS[lang].footerSubtext}</p>
          </div>
        </footer>

      </div>

      {/* ----------------- PRINT ONLY VIEW ----------------- */}
      <div className="print-only font-sans p-6 bg-white text-slate-900 w-full max-w-4xl mx-auto">
        {/* Header with brand and title */}
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center">
            <img
              src="/assets/logo.jpg"
              alt="kistanepal.com Logo"
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-right">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">{TRANSLATIONS[lang].reportTitle}</h2>
            <p className="text-[9px] text-slate-500">{TRANSLATIONS[lang].dateLabel}: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Info inputted by user on top: amount, interest, tenure */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{TRANSLATIONS[lang].loanAmount}</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{formatNepaliCurrency(amount)}</p>
            <p className="text-[9px] font-semibold text-violet-700 mt-0.5 max-w-full truncate" title={lang === 'NP' ? numberToNepaliWordsInNepali(amount) : numberToNepaliWords(amount)}>
              {lang === 'NP' ? numberToNepaliWordsInNepali(amount) : numberToNepaliWords(amount)}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{TRANSLATIONS[lang].annualInterestRate}</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{rate}%</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{TRANSLATIONS[lang].tenure}</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              {tenure} {tenureType === 'years' ? TRANSLATIONS[lang].years : TRANSLATIONS[lang].months}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{TRANSLATIONS[lang].calculationMethod}</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              {calcType === 'EMI' ? TRANSLATIONS[lang].emiMethod : TRANSLATIONS[lang].epiMethod}
            </p>
          </div>
        </div>

        {/* Summary metrics row */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 border-t border-b border-slate-200">
          <div>
            <p className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">{TRANSLATIONS[lang].loanPrincipal}</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{formatNepaliCurrency(amount)}</p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">{TRANSLATIONS[lang].totalInterest}</p>
            <p className="text-xs font-bold text-violet-700 mt-0.5">{formatNepaliCurrency(totalInterest)}</p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">{TRANSLATIONS[lang].grandTotal}</p>
            <p className="text-xs font-bold text-slate-950 mt-0.5">{formatNepaliCurrency(grandTotal)}</p>
          </div>
        </div>

        {/* Installment details */}
        <div className="mb-6 p-4 bg-violet-50/50 rounded-xl border border-violet-100/50">
          <p className="text-[9px] text-violet-700 uppercase tracking-wider font-bold">{TRANSLATIONS[lang].installment}</p>
          {calcType === 'EMI' ? (
            <p className="text-sm font-extrabold text-violet-950 mt-0.5">
              {formatNepaliCurrency(monthlyPayment)} <span className="text-[10px] font-normal text-violet-600">{TRANSLATIONS[lang].monthSuffix}</span>
            </p>
          ) : (
            <div className="flex gap-8 mt-0.5">
              <div>
                <span className="text-[9px] text-slate-500 block">{TRANSLATIONS[lang].firstMonthInstallment}</span>
                <span className="text-xs font-bold text-slate-900">{formatNepaliCurrency(firstPayment)}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block">{TRANSLATIONS[lang].lastMonthInstallment}</span>
                <span className="text-xs font-bold text-slate-900">{formatNepaliCurrency(lastPayment)}</span>
              </div>
            </div>
          )}
        </div>

        {/* The amortization table of whole tenure below */}
        <div className="mt-6">
          <h3 className="text-[11px] font-sans font-normal text-slate-900 mb-3 uppercase tracking-wider">{TRANSLATIONS[lang].amortizationSchedule} ({calcType})</h3>
          <table className="w-full text-left border-collapse text-[10px] font-sans">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider font-medium border-b border-slate-300">
                <th className="py-2 px-3 text-center border-b font-medium">{TRANSLATIONS[lang].tableMonth}</th>
                <th className="py-2 px-3 text-right border-b font-medium">{TRANSLATIONS[lang].tableInstallment}</th>
                <th className="py-2 px-3 text-right border-b font-medium">{TRANSLATIONS[lang].tablePrincipalPaid}</th>
                <th className="py-2 px-3 text-right border-b font-medium">{TRANSLATIONS[lang].tableInterestPaid}</th>
                <th className="py-2 px-3 text-right border-b font-medium">{TRANSLATIONS[lang].tableRemainingBalance}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {schedule.map((row) => (
                <tr key={row.month} className="page-break-inside-avoid">
                  <td className="py-1.5 px-3 text-center text-slate-600 border-b">{row.month}</td>
                  <td className="py-1.5 px-3 text-right text-slate-900 border-b font-normal">{formatNepaliCurrency(row.payment)}</td>
                  <td className="py-1.5 px-3 text-right text-slate-500 border-b font-normal">{formatNepaliCurrency(row.principal)}</td>
                  <td className="py-1.5 px-3 text-right text-violet-700 border-b font-normal">{formatNepaliCurrency(row.interest)}</td>
                  <td className="py-1.5 px-3 text-right text-slate-800 border-b font-normal">{formatNepaliCurrency(row.remaining)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-18 text-center text-[12px] text-slate-1000 border-t pt-4">
          <p>{TRANSLATIONS[lang].footerText}</p>
        </div>
      </div>

    </div>
  );
}
