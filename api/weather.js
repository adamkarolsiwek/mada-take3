const NOMINATIM_UA = 'DemoApp/1.0 (educational demo)';

const COUNTRY_CITIES = {
  AR: [{name:'Buenos Aires',lat:-34.61,lon:-58.38},{name:'Córdoba',lat:-31.42,lon:-64.19},{name:'Rosario',lat:-32.95,lon:-60.64},{name:'Mendoza',lat:-32.89,lon:-68.85},{name:'Salta',lat:-24.79,lon:-65.41}],
  AU: [{name:'Sydney',lat:-33.87,lon:151.21},{name:'Melbourne',lat:-37.81,lon:144.96},{name:'Brisbane',lat:-27.47,lon:153.02},{name:'Perth',lat:-31.95,lon:115.86},{name:'Adelaide',lat:-34.93,lon:138.60},{name:'Darwin',lat:-12.46,lon:130.84}],
  AT: [{name:'Vienna',lat:48.21,lon:16.37},{name:'Graz',lat:47.07,lon:15.44},{name:'Salzburg',lat:47.80,lon:13.04},{name:'Innsbruck',lat:47.27,lon:11.40},{name:'Linz',lat:48.31,lon:14.29}],
  BE: [{name:'Brussels',lat:50.85,lon:4.35},{name:'Antwerp',lat:51.22,lon:4.40},{name:'Ghent',lat:51.05,lon:3.72},{name:'Liège',lat:50.63,lon:5.57},{name:'Bruges',lat:51.21,lon:3.22}],
  BR: [{name:'São Paulo',lat:-23.55,lon:-46.63},{name:'Rio de Janeiro',lat:-22.91,lon:-43.17},{name:'Brasília',lat:-15.78,lon:-47.93},{name:'Salvador',lat:-12.97,lon:-38.50},{name:'Manaus',lat:-3.10,lon:-60.02},{name:'Fortaleza',lat:-3.72,lon:-38.54},{name:'Curitiba',lat:-25.43,lon:-49.27}],
  CA: [{name:'Toronto',lat:43.65,lon:-79.38},{name:'Vancouver',lat:49.25,lon:-123.12},{name:'Montreal',lat:45.50,lon:-73.57},{name:'Calgary',lat:51.05,lon:-114.07},{name:'Ottawa',lat:45.42,lon:-75.69},{name:'Winnipeg',lat:49.90,lon:-97.14},{name:'Halifax',lat:44.65,lon:-63.58}],
  CH: [{name:'Zurich',lat:47.38,lon:8.54},{name:'Geneva',lat:46.20,lon:6.14},{name:'Bern',lat:46.95,lon:7.45},{name:'Basel',lat:47.56,lon:7.59},{name:'Lugano',lat:46.00,lon:8.95}],
  CN: [{name:'Beijing',lat:39.91,lon:116.39},{name:'Shanghai',lat:31.23,lon:121.47},{name:'Guangzhou',lat:23.13,lon:113.26},{name:'Chengdu',lat:30.66,lon:104.07},{name:'Harbin',lat:45.75,lon:126.63},{name:'Shenzhen',lat:22.54,lon:114.06},{name:'Urumqi',lat:43.80,lon:87.60}],
  CZ: [{name:'Prague',lat:50.09,lon:14.42},{name:'Brno',lat:49.20,lon:16.61},{name:'Ostrava',lat:49.84,lon:18.29},{name:'Plzeň',lat:49.74,lon:13.37}],
  DE: [{name:'Berlin',lat:52.52,lon:13.40},{name:'Hamburg',lat:53.55,lon:9.99},{name:'Munich',lat:48.14,lon:11.58},{name:'Frankfurt',lat:50.11,lon:8.68},{name:'Cologne',lat:50.94,lon:6.96},{name:'Stuttgart',lat:48.78,lon:9.18},{name:'Dresden',lat:51.05,lon:13.74}],
  DK: [{name:'Copenhagen',lat:55.68,lon:12.57},{name:'Aarhus',lat:56.15,lon:10.22},{name:'Odense',lat:55.40,lon:10.38},{name:'Aalborg',lat:57.05,lon:9.92}],
  EG: [{name:'Cairo',lat:30.06,lon:31.25},{name:'Alexandria',lat:31.20,lon:29.92},{name:'Luxor',lat:25.69,lon:32.64},{name:'Aswan',lat:24.09,lon:32.90},{name:'Hurghada',lat:27.26,lon:33.81}],
  ES: [{name:'Madrid',lat:40.42,lon:-3.70},{name:'Barcelona',lat:41.39,lon:2.15},{name:'Valencia',lat:39.47,lon:-0.38},{name:'Seville',lat:37.39,lon:-5.99},{name:'Bilbao',lat:43.26,lon:-2.93},{name:'Málaga',lat:36.72,lon:-4.42},{name:'Santiago de Compostela',lat:42.88,lon:-8.54}],
  FI: [{name:'Helsinki',lat:60.17,lon:24.94},{name:'Tampere',lat:61.50,lon:23.77},{name:'Turku',lat:60.45,lon:22.27},{name:'Oulu',lat:65.01,lon:25.47},{name:'Rovaniemi',lat:66.50,lon:25.73}],
  FR: [{name:'Paris',lat:48.85,lon:2.35},{name:'Lyon',lat:45.75,lon:4.85},{name:'Marseille',lat:43.30,lon:5.37},{name:'Bordeaux',lat:44.84,lon:-0.58},{name:'Toulouse',lat:43.60,lon:1.44},{name:'Nice',lat:43.71,lon:7.26},{name:'Strasbourg',lat:48.57,lon:7.75}],
  GB: [{name:'London',lat:51.51,lon:-0.13},{name:'Manchester',lat:53.48,lon:-2.24},{name:'Birmingham',lat:52.48,lon:-1.89},{name:'Edinburgh',lat:55.95,lon:-3.19},{name:'Glasgow',lat:55.86,lon:-4.25},{name:'Cardiff',lat:51.48,lon:-3.18},{name:'Belfast',lat:54.60,lon:-5.93}],
  GR: [{name:'Athens',lat:37.98,lon:23.73},{name:'Thessaloniki',lat:40.64,lon:22.94},{name:'Patras',lat:38.25,lon:21.73},{name:'Heraklion',lat:35.34,lon:25.13},{name:'Rhodes',lat:36.43,lon:28.22}],
  HR: [{name:'Zagreb',lat:45.81,lon:15.98},{name:'Split',lat:43.51,lon:16.44},{name:'Rijeka',lat:45.33,lon:14.44},{name:'Dubrovnik',lat:42.65,lon:18.09},{name:'Osijek',lat:45.55,lon:18.70}],
  HU: [{name:'Budapest',lat:47.50,lon:19.04},{name:'Debrecen',lat:47.53,lon:21.63},{name:'Miskolc',lat:48.10,lon:20.78},{name:'Pécs',lat:46.07,lon:18.23},{name:'Győr',lat:47.68,lon:17.63}],
  ID: [{name:'Jakarta',lat:-6.21,lon:106.85},{name:'Surabaya',lat:-7.25,lon:112.75},{name:'Bali',lat:-8.34,lon:115.09},{name:'Medan',lat:3.59,lon:98.67},{name:'Makassar',lat:-5.14,lon:119.43}],
  IE: [{name:'Dublin',lat:53.33,lon:-6.25},{name:'Cork',lat:51.90,lon:-8.47},{name:'Galway',lat:53.27,lon:-9.06},{name:'Limerick',lat:52.66,lon:-8.63}],
  IL: [{name:'Tel Aviv',lat:32.06,lon:34.78},{name:'Jerusalem',lat:31.77,lon:35.23},{name:'Haifa',lat:32.82,lon:34.99},{name:'Eilat',lat:29.56,lon:34.95}],
  IN: [{name:'Mumbai',lat:19.08,lon:72.88},{name:'Delhi',lat:28.66,lon:77.23},{name:'Kolkata',lat:22.57,lon:88.36},{name:'Chennai',lat:13.09,lon:80.28},{name:'Bengaluru',lat:12.97,lon:77.59},{name:'Hyderabad',lat:17.38,lon:78.49},{name:'Jaipur',lat:26.91,lon:75.79}],
  IT: [{name:'Rome',lat:41.90,lon:12.50},{name:'Milan',lat:45.46,lon:9.19},{name:'Naples',lat:40.84,lon:14.25},{name:'Turin',lat:45.07,lon:7.69},{name:'Florence',lat:43.77,lon:11.25},{name:'Venice',lat:45.44,lon:12.32},{name:'Palermo',lat:38.12,lon:13.36}],
  JP: [{name:'Tokyo',lat:35.69,lon:139.69},{name:'Osaka',lat:34.69,lon:135.50},{name:'Nagoya',lat:35.18,lon:136.91},{name:'Sapporo',lat:43.06,lon:141.35},{name:'Fukuoka',lat:33.59,lon:130.40},{name:'Hiroshima',lat:34.39,lon:132.46},{name:'Naha',lat:26.21,lon:127.68}],
  KR: [{name:'Seoul',lat:37.57,lon:126.98},{name:'Busan',lat:35.10,lon:129.04},{name:'Incheon',lat:37.46,lon:126.71},{name:'Daegu',lat:35.87,lon:128.60},{name:'Jeju',lat:33.50,lon:126.53}],
  MX: [{name:'Mexico City',lat:19.43,lon:-99.13},{name:'Guadalajara',lat:20.66,lon:-103.35},{name:'Monterrey',lat:25.67,lon:-100.31},{name:'Cancún',lat:21.16,lon:-86.85},{name:'Puebla',lat:19.05,lon:-98.21},{name:'Tijuana',lat:32.53,lon:-117.03}],
  NL: [{name:'Amsterdam',lat:52.37,lon:4.90},{name:'Rotterdam',lat:51.92,lon:4.48},{name:'The Hague',lat:52.08,lon:4.31},{name:'Utrecht',lat:52.09,lon:5.12},{name:'Eindhoven',lat:51.44,lon:5.48}],
  NO: [{name:'Oslo',lat:59.91,lon:10.75},{name:'Bergen',lat:60.39,lon:5.33},{name:'Trondheim',lat:63.43,lon:10.39},{name:'Tromsø',lat:69.65,lon:18.96},{name:'Stavanger',lat:58.97,lon:5.73}],
  NZ: [{name:'Auckland',lat:-36.87,lon:174.77},{name:'Wellington',lat:-41.29,lon:174.78},{name:'Christchurch',lat:-43.53,lon:172.64},{name:'Queenstown',lat:-45.03,lon:168.66}],
  PL: [{name:'Warsaw',lat:52.23,lon:21.01},{name:'Kraków',lat:50.06,lon:19.94},{name:'Gdańsk',lat:54.35,lon:18.65},{name:'Wrocław',lat:51.11,lon:17.04},{name:'Poznań',lat:52.41,lon:16.93},{name:'Łódź',lat:51.77,lon:19.46}],
  PT: [{name:'Lisbon',lat:38.72,lon:-9.14},{name:'Porto',lat:41.15,lon:-8.61},{name:'Faro',lat:37.02,lon:-7.93},{name:'Coimbra',lat:40.21,lon:-8.43},{name:'Funchal',lat:32.65,lon:-16.91}],
  RO: [{name:'Bucharest',lat:44.43,lon:26.10},{name:'Cluj-Napoca',lat:46.77,lon:23.59},{name:'Timișoara',lat:45.75,lon:21.23},{name:'Iași',lat:47.16,lon:27.59},{name:'Constanța',lat:44.17,lon:28.65}],
  RS: [{name:'Belgrade',lat:44.80,lon:20.46},{name:'Novi Sad',lat:45.25,lon:19.84},{name:'Niš',lat:43.32,lon:21.90}],
  RU: [{name:'Moscow',lat:55.76,lon:37.62},{name:'Saint Petersburg',lat:59.93,lon:30.32},{name:'Novosibirsk',lat:55.02,lon:82.92},{name:'Yekaterinburg',lat:56.85,lon:60.61},{name:'Sochi',lat:43.60,lon:39.73},{name:'Vladivostok',lat:43.13,lon:131.91}],
  SA: [{name:'Riyadh',lat:24.69,lon:46.72},{name:'Jeddah',lat:21.54,lon:39.17},{name:'Mecca',lat:21.39,lon:39.86},{name:'Tabuk',lat:28.38,lon:36.57}],
  SE: [{name:'Stockholm',lat:59.33,lon:18.07},{name:'Gothenburg',lat:57.71,lon:11.97},{name:'Malmö',lat:55.61,lon:13.00},{name:'Umeå',lat:63.83,lon:20.26},{name:'Kiruna',lat:67.86,lon:20.23}],
  SK: [{name:'Bratislava',lat:48.15,lon:17.11},{name:'Košice',lat:48.72,lon:21.26},{name:'Prešov',lat:49.00,lon:21.24},{name:'Žilina',lat:49.22,lon:18.74}],
  TH: [{name:'Bangkok',lat:13.75,lon:100.52},{name:'Chiang Mai',lat:18.79,lon:98.99},{name:'Phuket',lat:7.89,lon:98.40},{name:'Pattaya',lat:12.93,lon:100.88}],
  TR: [{name:'Istanbul',lat:41.01,lon:28.95},{name:'Ankara',lat:39.93,lon:32.85},{name:'Izmir',lat:38.42,lon:27.14},{name:'Antalya',lat:36.89,lon:30.71},{name:'Trabzon',lat:41.00,lon:39.72},{name:'Diyarbakır',lat:37.91,lon:40.23}],
  UA: [{name:'Kyiv',lat:50.45,lon:30.52},{name:'Kharkiv',lat:49.99,lon:36.23},{name:'Odessa',lat:46.48,lon:30.73},{name:'Lviv',lat:49.84,lon:24.03}],
  US: [{name:'New York',lat:40.71,lon:-74.01},{name:'Los Angeles',lat:34.05,lon:-118.24},{name:'Chicago',lat:41.85,lon:-87.65},{name:'Houston',lat:29.76,lon:-95.37},{name:'Miami',lat:25.77,lon:-80.19},{name:'Seattle',lat:47.61,lon:-122.33},{name:'Denver',lat:39.74,lon:-104.98},{name:'Anchorage',lat:61.22,lon:-149.90}],
  ZA: [{name:'Johannesburg',lat:-26.20,lon:28.04},{name:'Cape Town',lat:-33.93,lon:18.42},{name:'Durban',lat:-29.86,lon:31.02},{name:'Pretoria',lat:-25.75,lon:28.19}],
};

function isCity(loc) {
  const cls = loc.class || '';
  const typ = loc.type || '';
  if (cls === 'boundary') return true;
  if (cls === 'place' && ['city','town','village','hamlet','municipality',
    'borough','county','state','province','region','country'].includes(typ)) return true;
  return false;
}

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
  const r = await fetch(url);
  const data = await r.json();
  return data.current.temperature_2m;
}

async function cityTemp(city) {
  try {
    const temp = await getWeather(city.lat, city.lon);
    return { ...city, temperature: temp };
  } catch {
    return null;
  }
}

async function mapCities(countryCode, mainLat, mainLon) {
  const cities = (COUNTRY_CITIES[countryCode.toUpperCase()] || [])
    .filter(c => Math.abs(c.lat - mainLat) > 0.4 || Math.abs(c.lon - mainLon) > 0.4)
    .slice(0, 7);
  if (!cities.length) return [];
  const results = await Promise.all(cities.map(cityTemp));
  return results.filter(Boolean);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const query = (req.query.q || '').trim();
  if (!query) return res.status(400).json({ error: 'Query is required.' });

  try {
    const params = new URLSearchParams({
      q: query, format: 'json', limit: '1',
      addressdetails: '1', namedetails: '1',
    });
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { 'User-Agent': NOMINATIM_UA } }
    );
    const results = await geoRes.json();

    if (!results.length) return res.status(404).json({ error: `'${query}' not found.` });

    const loc = results[0];
    const lat = parseFloat(loc.lat);
    const lon = parseFloat(loc.lon);
    const addr = loc.address || {};
    const nd = loc.namedetails || {};
    const country = (addr.country_code || '').toUpperCase();

    const [temp, cities] = await Promise.all([
      getWeather(lat, lon),
      mapCities(country, lat, lon),
    ]);

    if (isCity(loc)) {
      const name = nd['name:en'] || nd.name || addr.city || addr.town || addr.village
        || loc.display_name.split(',')[0].trim();
      const cityLabel = country ? `${name}, ${country}` : name;
      return res.json({ temperature: temp, city: cityLabel, lat, lon, country_code: country, map_cities: cities });
    } else {
      const placeName = nd['name:en'] || nd.name || loc.display_name.split(',')[0].trim();
      const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
      const cityLabel = country ? `${cityName}, ${country}` : cityName;
      return res.json({ temperature: temp, city: cityLabel, place: placeName, lat, lon, country_code: country, map_cities: cities });
    }
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
