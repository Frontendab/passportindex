// import {
//   ComposableMap,
//   Geographies,
//   Geography
// } from "react-simple-maps";

// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// export default function Map({ data }) {

//   return (
//     <ComposableMap>
//       <Geographies geography={geoUrl}>
//         {({ geographies }) =>
//           geographies.map((geo) => {
//             console.log(data[geo.properties.name.toLowerCase()]);
//             return (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   style={{
//                   default: {
//                     fill: (() => {
//                       const countryName = geo.properties.name.toLowerCase();

//                       const foundKey = Object.keys(data).find(key =>
//                         key.includes(countryName) || countryName.includes(key)
//                       );

//                       return foundKey ? data[foundKey] : "#EEE";
//                     })()
//                   },
//                     hover: {
//                       fill: "#999"
//                     }
//                   }}
//                 />
//             );
//           })
//         }
//       </Geographies>
//     </ComposableMap>
//   );
// }