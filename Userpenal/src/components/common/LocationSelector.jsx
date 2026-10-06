import { useState, useEffect } from "react";
import { MapPin, Navigation, Check, X, Search, Loader2, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const POPULAR_CITIES = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Ahmedabad",
  "Surat",
  "Pune",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Vadodara",
  "Rajkot",
  "Indore",
  "Chandigarh",
  "Lucknow",
  "Bhopal",
  "Nagpur",
  "Gandhinagar"
];

// Coordinate mapping for auto-detection fallback
const CITY_COORDINATES = [
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { name: "Gandhinagar", lat: 23.2156, lon: 72.6369 },
  { name: "Surat", lat: 21.1702, lon: 72.8311 },
  { name: "Vadodara", lat: 22.3072, lon: 73.1812 },
  { name: "Rajkot", lat: 22.3039, lon: 70.8022 },
  { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { name: "Pune", lat: 18.5204, lon: 73.8567 },
  { name: "Delhi NCR", lat: 28.7041, lon: 77.1025 },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { name: "Indore", lat: 22.7196, lon: 75.8577 },
  { name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
];

function getNearestCity(lat, lon) {
  let nearest = CITY_COORDINATES[0];
  let minDistance = Infinity;

  CITY_COORDINATES.forEach((city) => {
    const dLat = city.lat - lat;
    const dLon = city.lon - lon;
    const dist = dLat * dLat + dLon * dLon;
    if (dist < minDistance) {
      minDistance = dist;
      nearest = city;
    }
  });

  return nearest.name;
}

export function getLocation() {
  return localStorage.getItem("user_city_v2") || "";
}

export function setLocation(city) {
  if (city) {
    localStorage.setItem("user_city_v2", city);
  } else {
    localStorage.removeItem("user_city_v2");
  }
  window.dispatchEvent(
    new CustomEvent("user_location_changed", { detail: { city } })
  );
}

export default function LocationSelector({ triggerClassName = "" }) {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(() => getLocation());
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const handleLocationChange = (e) => {
      setSelectedCity(e.detail?.city || "");
    };

    window.addEventListener("user_location_changed", handleLocationChange);

    // Auto-detect location on initial mount if not already saved
    // if (!getLocation()) {
    //   handleDetectLocation(true);
    // }

    return () => {
      window.removeEventListener("user_location_changed", handleLocationChange);
    };
  }, []);

  const handleSelectCity = (city, showNotification = true) => {
    setLocation(city);
    setSelectedCity(city);
    setOpen(false);
    if (showNotification) {
      toast.success(`📍 Location auto-set to ${city}`);
    }
  };

  const handleClear = () => {
    setLocation("");
    setSelectedCity("");
    setOpen(false);
    toast.info("📍 Showing results for All India");
  };

  const handleDetectLocation = async (isSilent = false) => {
    if (!isSilent) setIsDetecting(true);
    let detectedCity = "";

    // Strategy 1: Instant IP-based Location Detection
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.city) {
          detectedCity = data.city;
        }
      }
    } catch {
      // Fallback
    }

    // Secondary IP API fallback
    if (!detectedCity) {
      try {
        const res = await fetch("https://ipwho.is/");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.city) {
            detectedCity = data.city;
          }
        }
      } catch {
        // silent
      }
    }

    // Strategy 2: Browser Geolocation API if available
    if (!detectedCity && navigator.geolocation) {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            detectedCity = getNearestCity(latitude, longitude);
            resolve();
          },
          () => {
            resolve();
          },
          { timeout: 3000, enableHighAccuracy: false }
        );
      });
    }

    // Final Fallback if offline or denied
    if (!detectedCity) {
      detectedCity = "Ahmedabad";
    }

    if (!isSilent) setIsDetecting(false);
    handleSelectCity(detectedCity, !isSilent);
  };

  const filteredCities = POPULAR_CITIES.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Select City or Auto-Detect Location"
        className={
          triggerClassName ||
          "inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold transition-all shrink-0 whitespace-nowrap shadow-2xs"
        }
      >
        <MapPin size={13} className="text-blue-600 shrink-0" />
        <span className="truncate max-w-[100px] sm:max-w-[130px] whitespace-nowrap font-bold">
          {selectedCity || "Select City"}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#172554] flex items-center gap-2">
              <MapPin className="size-5 text-blue-600" />
              Select Your Location
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Choose your city to discover top colleges, entrance cutoffs, and admissions near you.
            </DialogDescription>
          </DialogHeader>

          {/* Instant Auto-Detect Button */}
          <div className="mt-4">
            <button
              type="button"
              disabled={isDetecting}
              onClick={() => handleDetectLocation(false)}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100/80 text-blue-900 font-extrabold text-xs transition-all active:scale-[0.99] disabled:opacity-60 shadow-2xs"
            >
              {isDetecting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span>Auto-Detecting Your Location...</span>
                </>
              ) : (
                <>
                  <Navigation size={15} className="text-blue-600 fill-blue-600" />
                  <span>📍 Auto-Detect My Location (GPS / Near-By Area)</span>
                </>
              )}
            </button>
          </div>

          <div className="relative my-3 flex items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-white">
              OR SEARCH MANUALLY
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              type="text"
              placeholder="Search city (e.g. Mumbai, Ahmedabad)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs rounded-xl border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:border-blue-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Popular Cities Grid */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Popular Academic Cities
              </span>
              {selectedCity && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[11px] font-extrabold text-blue-600 hover:underline"
                >
                  Clear / All India
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredCities.map((city) => {
                const isSelected = selectedCity.toLowerCase() === city.toLowerCase();
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left border transition-all ${
                      isSelected
                        ? "border-[#172554] bg-[#EFF6FF] text-[#172554] ring-2 ring-[#172554]/10 shadow-2xs"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="truncate">{city}</span>
                    {isSelected && <Check size={13} className="text-blue-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
              {filteredCities.length === 0 && (
                <div className="col-span-full py-4 text-center text-xs text-slate-500">
                  No matches for &quot;{searchQuery}&quot;.{" "}
                  <button
                    type="button"
                    onClick={() => handleSelectCity(searchQuery)}
                    className="text-blue-600 font-extrabold underline ml-1"
                  >
                    Select &quot;{searchQuery}&quot; anyway
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
