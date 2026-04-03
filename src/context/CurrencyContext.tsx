import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ShippingZone {
  id: string;
  region_name: string;
  countries: string[];
  currency_code: string;
  markup_percentage: number;
  flat_shipping_fee: number;
}

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  markupPercent: number;
  flatShippingFee: number;
  regionName: string;
  countryCode: string;
  isLoading: boolean;
  convertPrice: (inrPrice: number) => number;
  formatPrice: (inrPrice: number) => string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹', USD: '$', GBP: '£', EUR: '€', CAD: 'C$', AUD: 'A$', JPY: '¥',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [markupPercent, setMarkupPercent] = useState(0);
  const [flatShippingFee, setFlatShippingFee] = useState(0);
  const [regionName, setRegionName] = useState('India');
  const [countryCode, setCountryCode] = useState('IN');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Detect country
        const geoRes = await fetch('https://ipapi.co/json/');
        const geo = await geoRes.json();
        const detectedCountry = geo.country_code || 'IN';
        setCountryCode(detectedCountry);

        // 2. Load shipping zones
        const { data: zones } = await supabase
          .from('shipping_zones')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (!zones?.length) { setIsLoading(false); return; }

        // 3. Match zone — exact country match first, then wildcard
        const typedZones = zones as unknown as ShippingZone[];
        let matched = typedZones.find(z => z.countries.includes(detectedCountry));
        if (!matched) matched = typedZones.find(z => z.countries.includes('*'));
        if (!matched) { setIsLoading(false); return; }

        setCurrencyCode(matched.currency_code);
        setMarkupPercent(matched.markup_percentage);
        setFlatShippingFee(matched.flat_shipping_fee);
        setRegionName(matched.region_name);

        // 4. Fetch exchange rate if not INR
        if (matched.currency_code !== 'INR') {
          try {
            const rateRes = await fetch(
              `https://api.frankfurter.dev/latest?from=INR&to=${matched.currency_code}`
            );
            const rateData = await rateRes.json();
            const rate = rateData.rates?.[matched.currency_code];
            if (rate) setExchangeRate(rate);
          } catch {
            // Fallback — keep rate as 1, prices will show in INR
            setCurrencyCode('INR');
          }
        }
      } catch {
        // Geolocation failed — stay INR
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const convertPrice = useCallback(
    (inrPrice: number) => {
      const withMarkup = inrPrice * (1 + markupPercent / 100);
      return Math.round(withMarkup * exchangeRate * 100) / 100;
    },
    [exchangeRate, markupPercent]
  );

  const currencySymbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode + ' ';

  const formatPrice = useCallback(
    (inrPrice: number) => {
      const converted = convertPrice(inrPrice);
      return `${currencySymbol}${converted.toLocaleString(undefined, { minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2, maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2 })}`;
    },
    [convertPrice, currencySymbol, currencyCode]
  );

  return (
    <CurrencyContext.Provider value={{
      currencyCode, currencySymbol, exchangeRate, markupPercent,
      flatShippingFee, regionName, countryCode, isLoading,
      convertPrice, formatPrice,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
