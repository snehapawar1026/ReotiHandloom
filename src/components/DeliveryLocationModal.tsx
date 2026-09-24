'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  X,
  Search,
  Check,
  Loader2,
  Navigation,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface DeliveryLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_CITIES = [
  { name: 'Indore', pincode: '452001', state: 'Madhya Pradesh' },
  { name: 'Bhopal', pincode: '462001', state: 'Madhya Pradesh' },
  { name: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { name: 'Delhi / NCR', pincode: '110001', state: 'Delhi' },
  { name: 'Bengaluru', pincode: '560001', state: 'Karnataka' },
  { name: 'Hyderabad', pincode: '500001', state: 'Telangana' },
  { name: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { name: 'Ahmedabad', pincode: '380001', state: 'Gujarat' },
  { name: 'Jaipur', pincode: '302001', state: 'Rajasthan' },
  { name: 'Kolkata', pincode: '700001', state: 'West Bengal' },
  { name: 'Chennai', pincode: '600001', state: 'Tamil Nadu' },
  { name: 'Maheshwar', pincode: '451224', state: 'Madhya Pradesh' },
];

export const DeliveryLocationModal: React.FC<DeliveryLocationModalProps> = ({ isOpen, onClose }) => {
  const [pincodeInput, setPincodeInput] = useState('');
  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [isLoadingPin, setIsLoadingPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentSelected, setCurrentSelected] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      try {
        const cached = localStorage.getItem('rh_exact_loc') || sessionStorage.getItem('rh_exact_loc');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.locationText) {
            setCurrentSelected(parsed.locationText);
          } else if (parsed.city) {
            setCurrentSelected(parsed.postal ? `${parsed.city} (${parsed.postal})` : parsed.city);
          }
        }
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveAndNotifyLocation = (locData: any) => {
    try {
      localStorage.setItem('rh_exact_loc', JSON.stringify(locData));
      sessionStorage.setItem('rh_exact_loc', JSON.stringify(locData));
      window.dispatchEvent(new Event('rh_location_updated'));

      // Also track in background for admin real-time visitor logs
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrl: typeof window !== 'undefined' ? window.location.pathname : '/',
          pageTitle: typeof document !== 'undefined' ? document.title : 'Reoti Handloom',
          type: 'PINCODE_DETECT',
          title: `📍 Delivery Location Selected: ${locData.locationText || locData.city}`,
          clientLocation: locData,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch (e) {}

    const display = locData.postal ? `${locData.city} (${locData.postal})` : locData.city || 'India';
    setCurrentSelected(display);
    setSuccessMessage(`✓ Delivery location set to ${display}! Free Express Shipping available.`);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  // 1. Detect via Device GPS (HTML5 Geolocation)
  const handleUseCurrentLocation = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser. Please enter your Pincode below.');
      return;
    }

    setIsLoadingGps(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const revRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );

          if (revRes.ok) {
            const revData = await revRes.json();
            const exactLocality = revData.locality || revData.city || '';
            const exactCity = revData.city || revData.principalSubdivision || '';
            const exactState = revData.principalSubdivision || '';
            const postcode = revData.postcode || '';

            const locationText = postcode
              ? `${exactLocality ? `${exactLocality}, ` : ''}${exactCity}, ${exactState} (Pin: ${postcode})`
              : `${exactLocality ? `${exactLocality}, ` : ''}${exactCity}, ${exactState}`;

            const exactGpsLoc = {
              city: exactLocality || exactCity || 'Current Location',
              region: exactState,
              country: revData.countryName || 'India',
              postal: postcode,
              latitude: lat,
              longitude: lng,
              locationText,
              isGps: true,
            };

            saveAndNotifyLocation(exactGpsLoc);
          } else {
            // Fallback if reverse geocode is slow
            const fallbackLoc = {
              city: 'Detected Location',
              region: 'India',
              country: 'India',
              postal: '',
              latitude: lat,
              longitude: lng,
              locationText: 'Current Location, India',
              isGps: true,
            };
            saveAndNotifyLocation(fallbackLoc);
          }
        } catch (err) {
          setErrorMessage('Could not fetch exact city from GPS. Please enter your 6-digit Pincode.');
        } finally {
          setIsLoadingGps(false);
        }
      },
      (err) => {
        setIsLoadingGps(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMessage('Location permission was denied. Please enter your 6-digit Pincode below.');
        } else {
          setErrorMessage('Location unavailable. Please enter your Pincode manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // 2. Lookup by 6-digit Indian Pincode
  const handlePincodeSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pin = pincodeInput.trim();
    setErrorMessage('');
    setSuccessMessage('');

    if (!/^\d{6}$/.test(pin)) {
      setErrorMessage('Please enter a valid 6-digit Indian Postal Pincode (e.g. 452001, 110001).');
      return;
    }

    setIsLoadingPin(true);

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data && data[0]?.Status === 'Success' && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const town = po.Name || po.Block || po.District;
        const district = po.District;
        const state = po.State;
        const locText = `${town}, ${district}, ${state} (Pin: ${pin})`;

        const locData = {
          city: district || town,
          region: state,
          country: 'India',
          postal: pin,
          locationText: locText,
          isExactPin: true,
        };

        saveAndNotifyLocation(locData);
      } else {
        // Fallback for custom valid 6-digit pincodes
        const fallbackData = {
          city: `Pincode ${pin}`,
          region: 'India',
          country: 'India',
          postal: pin,
          locationText: `Pincode: ${pin}, India`,
          isExactPin: true,
        };
        saveAndNotifyLocation(fallbackData);
      }
    } catch (err) {
      // Fallback
      const fallbackData = {
        city: `Pincode ${pin}`,
        region: 'India',
        country: 'India',
        postal: pin,
        locationText: `Pincode: ${pin}, India`,
        isExactPin: true,
      };
      saveAndNotifyLocation(fallbackData);
    } finally {
      setIsLoadingPin(false);
    }
  };

  // 3. Quick Select City Chip
  const handleSelectCityChip = (city: { name: string; pincode: string; state: string }) => {
    const locData = {
      city: city.name,
      region: city.state,
      country: 'India',
      postal: city.pincode,
      locationText: `${city.name}, ${city.state} (Pin: ${city.pincode})`,
      isExactPin: true,
    };
    saveAndNotifyLocation(locData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden text-neutral-900 flex flex-col max-h-[90vh]">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-amber-950 via-neutral-950 to-rose-950 text-amber-200 px-5 py-4 flex items-center justify-between border-b border-amber-900/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <MapPin className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-tight">
                Choose Delivery Location
              </h3>
              <p className="text-[11px] text-amber-300 font-sans mt-0.5">
                डिलीवरी लोकेशन चुनें • Check availability & delivery speed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Current Selection Pill if any */}
          {currentSelected && (
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <span className="text-gray-500 text-[10px] uppercase font-bold block">Currently Delivering To</span>
                  <span className="font-bold text-amber-950 text-xs sm:text-sm">{currentSelected}</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                Active
              </span>
            </div>
          )}

          {/* Option 1: 1-Click Current Location GPS */}
          <div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLoadingGps}
              className="w-full py-3.5 px-4 rounded-2xl font-sans font-bold text-sm bg-gradient-to-r from-rose-900 via-rose-800 to-amber-950 text-white hover:from-black hover:to-rose-950 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 group active:scale-[0.99]"
            >
              {isLoadingGps ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Detecting exact GPS location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>📍 Use My Current Location</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-gray-400 text-center mt-1.5 font-sans">
              Instant auto-detection using device GPS
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              OR ENTER PINCODE
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Option 2: Pincode Form */}
          <form onSubmit={handlePincodeSubmit} className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">
              Enter Indian Pincode (6 Digits)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  value={pincodeInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPincodeInput(val);
                    if (val.length === 6) {
                      setErrorMessage('');
                    }
                  }}
                  placeholder="e.g. 452001, 400001, 110001"
                  className="w-full pl-3 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 text-sm font-semibold tracking-wider placeholder:tracking-normal placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={isLoadingPin || pincodeInput.trim().length !== 6}
                className="px-5 py-2.5 rounded-xl bg-amber-950 text-white hover:bg-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {isLoadingPin ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Apply</span>
                )}
              </button>
            </div>
          </form>

          {/* Messages */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Option 3: Popular Cities Chips */}
          <div>
            <span className="text-xs font-bold text-gray-700 block mb-2">
              Popular Cities & Handloom Delivery Hubs
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => handleSelectCityChip(city)}
                  className="p-2 rounded-xl border border-gray-200 hover:border-amber-600 hover:bg-amber-50/60 transition-all text-left group cursor-pointer"
                >
                  <div className="font-bold text-xs text-gray-900 group-hover:text-amber-950 flex items-center justify-between">
                    <span>{city.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{city.pincode}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block truncate">{city.state}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guarantee Badges Footer */}
          <div className="pt-2 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-gray-600">
            <div className="p-2 rounded-xl bg-gray-50 flex flex-col items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-rose-700" />
              <span>Express 3-5 Days</span>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 flex flex-col items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Safe Delivery</span>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 flex flex-col items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Direct Looms</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
