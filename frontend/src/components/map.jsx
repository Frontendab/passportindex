import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { API_URL, SITE_KEY } from "../global/variables";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { saveCountries, saveData } from "../redux/reducer_data_map";
import toast from "react-hot-toast";
import ReCAPTCHA from 'react-google-recaptcha';
import { useState } from "react";
import { useEffect } from "react";

countries.registerLocale(en);

export default function Map({data, id}) {

  const dispatch = useDispatch();
  const [geoData, setGeoData] = useState();
  const { map } = useSelector((state) => state.data_map);
  const [captcha, setCaptcha] = useState();

  function toRGBA(rgb, alpha = 0.5) {
    return rgb.replace("rgb", "rgba").replace(")", `, ${alpha})`);
  }

  const onCaptchaChange = (value) => {
    setCaptcha(value);
  };

  const fetchMap = async() => {
    const options = {
      captcha
    };
    try {
      const response = await axios.post(
          `${API_URL}/nationalities/${id}`, options
      );
      if (response.status == 200){
        const data_map = response.data.data;
        const data_countries = response.data.countries;
        dispatch(saveData(
            data_map
        ));
        dispatch(saveCountries(
            data_countries
        ));
        setGeoData(data_countries);
      };
    } catch (error) {
      if (error?.response?.data.status == "error") {
          const msg = error.response.data.message;
          toast.error(msg)
      }
    }
  };

  useEffect(() => {
    if (captcha) {
      fetchMap();
    }
  }, [captcha]);

  return (
    (captcha && map && geoData && data) ? (
    <ComposableMap>
      <Geographies geography={geoData}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const countryCode = geo.id;
            const iso2 = countries.alpha3ToAlpha2(countryCode);
            const main_iso2 = countries.getAlpha2Code(data.name_passport, "en");
            let fillColor = map[iso2] || "#EEE"; // default color
            if (main_iso2 == iso2) fillColor = "#d59b60";
            const hoverColor = toRGBA(fillColor, 0.8);
            return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: fillColor },
                    hover: { fill: hoverColor, cursor: "pointer" },
                  }}
                  className="w-[100px]"
                />
            );
          })
        }
      </Geographies>
    </ComposableMap>
    ) : (
      <ReCAPTCHA
        sitekey={SITE_KEY}
        onChange={onCaptchaChange}
        className="min-h-[500px] flex justify-center items-center captcha-container"
      />
    )
  );
}
