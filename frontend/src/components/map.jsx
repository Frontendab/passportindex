import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { API_URL, SITE_KEY } from "../global/variables";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { saveCountries, saveData } from "../redux/reducer_data_map";
import toast from "react-hot-toast";
import ReCAPTCHA from 'react-google-recaptcha';
import { useState, useEffect } from "react";

countries.registerLocale(en);

export default function Map({data, id}) {
  const dispatch = useDispatch();
  const [geoData, setGeoData] = useState();
  const { map } = useSelector((state) => state.data_map);
  const [captcha, setCaptcha] = useState();

  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  function toRGBA(rgb, alpha = 0.5) {
    if (!rgb.startsWith("rgb")) return rgb;
    return rgb.replace("rgb", "rgba").replace(")", `, ${alpha})`);
  }

  const onCaptchaChange = (value) => {
    setCaptcha(value);
  };

  const getCurrentCountry = (ios2, main_iso2) => {
    let country_detail = data.visa_requirements.filter((country) => country.icon.toLowerCase() == ios2.toLowerCase())[0];
    if (ios2 == main_iso2)
      setTooltipContent(
        `You're country.`
      );
      
    if (country_detail)
      setTooltipContent(
        `${country_detail.name}
          Visa type: ${country_detail.visa_type}
          ${country_detail.days ? `Until: ${country_detail?.days} days` : ""}`
      );
  };

  const fetchMap = async() => {
    try {
      const response = await axios.post(`${API_URL}/nationalities/${id}`, { captcha });
      if (response.status === 200){
        dispatch(saveData(response.data.data));
        dispatch(saveCountries(response.data.countries));
        setGeoData(response.data.countries);
      }
    } catch (error) {
      if (error?.response?.data.status === "error") {
          toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (captcha) fetchMap();
  }, [captcha]);

  return (
    (captcha && map && geoData && data) ? (
    <div className="relative w-full group">
      {/* الـ Tooltip UI */}
      {tooltipContent && (
        <div 
          className="pointer-events-none absolute z-50 bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-xl transition-opacity duration-200 border border-white/10"
          style={{ 
            left: tooltipPos.x + 15, 
            top: tooltipPos.y - 10,
            transform: 'translate(0, -100%)',
            whiteSpace: "pre-line"
          }}
        >
          {tooltipContent}
        </div>
      )}

      <ComposableMap>
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.id;
              const iso2 = countries.alpha3ToAlpha2(countryCode);
              const main_iso2 = countries.getAlpha2Code(data.name_passport, "en");
              
              let fillColor = map[iso2] || "#EEE"; 
              if (main_iso2 === iso2) fillColor = "#d59b60";
              const hoverColor = toRGBA(fillColor, 0.8);

              return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseMove={(e) => {
                      setTooltipPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
                      getCurrentCountry(iso2, main_iso2);
                    }}
                    onMouseLeave={() => setTooltipContent("")}
                    style={{
                      default: { fill: fillColor, outline: "none" },
                      hover: { fill: hoverColor, cursor: "pointer", outline: "none" },
                      pressed: { outline: "none" }
                    }}
                  />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
    ) : (
      <ReCAPTCHA
        sitekey={SITE_KEY}
        onChange={onCaptchaChange}
        className="min-h-[500px] flex justify-center items-center captcha-container"
      />
    )
  );
}