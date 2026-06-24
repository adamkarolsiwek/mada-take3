"""
Local dev server — python3 dev_server.py
Mirrors /api/weather for the Vite proxy.
"""
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import requests

from city_data import COUNTRY_CITIES

NOMINATIM_HEADERS = {'User-Agent': 'DemoApp/1.0 (educational demo)'}


def _is_city(loc):
    cls, typ = loc.get('class', ''), loc.get('type', '')
    if cls == 'boundary':
        return True
    if cls == 'place' and typ in {
        'city', 'town', 'village', 'hamlet', 'municipality',
        'borough', 'county', 'state', 'province', 'region', 'country',
    }:
        return True
    return False


def _weather(lat, lon):
    r = requests.get(
        'https://api.open-meteo.com/v1/forecast',
        params={'latitude': lat, 'longitude': lon,
                'current': 'temperature_2m', 'timezone': 'auto'},
        timeout=6,
    )
    return r.json()['current']['temperature_2m']


def _city_temp(city):
    try:
        t = _weather(city['lat'], city['lon'])
        return {**city, 'temperature': t}
    except Exception:
        return None


def _map_cities(country_code, main_lat, main_lon):
    cities = COUNTRY_CITIES.get(country_code.upper(), [])
    # exclude city too close to the main point
    cities = [c for c in cities
              if abs(c['lat'] - main_lat) > 0.4 or abs(c['lon'] - main_lon) > 0.4]
    cities = cities[:7]
    if not cities:
        return []
    with ThreadPoolExecutor(max_workers=7) as ex:
        results = list(ex.map(_city_temp, cities))
    return [r for r in results if r is not None]


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        query = params.get('q', [''])[0].strip()

        if not query:
            self._send(400, {'error': 'Query is required.'})
            return

        try:
            results = requests.get(
                'https://nominatim.openstreetmap.org/search',
                params={'q': query, 'format': 'json', 'limit': 1,
                        'addressdetails': 1, 'namedetails': 1},
                headers=NOMINATIM_HEADERS,
                timeout=8,
            ).json()

            if not results:
                self._send(404, {'error': f"'{query}' not found."})
                return

            loc = results[0]
            lat, lon = float(loc['lat']), float(loc['lon'])
            addr = loc.get('address', {})
            nd = loc.get('namedetails', {})
            country = addr.get('country_code', '').upper()

            temp = _weather(lat, lon)
            map_cities = _map_cities(country, lat, lon)

            if _is_city(loc):
                name = (nd.get('name:en') or nd.get('name')
                        or addr.get('city') or addr.get('town')
                        or loc['display_name'].split(',')[0].strip())
                city_label = f"{name}, {country}" if country else name
                self._send(200, {
                    'temperature': temp, 'city': city_label,
                    'lat': lat, 'lon': lon, 'country_code': country,
                    'map_cities': map_cities,
                })
            else:
                place_name = (nd.get('name:en') or nd.get('name')
                              or loc['display_name'].split(',')[0].strip())
                city_name = (addr.get('city') or addr.get('town')
                             or addr.get('village') or addr.get('municipality')
                             or addr.get('county') or '')
                city_label = f"{city_name}, {country}" if country else city_name
                self._send(200, {
                    'temperature': temp, 'city': city_label, 'place': place_name,
                    'lat': lat, 'lon': lon, 'country_code': country,
                    'map_cities': map_cities,
                })

        except requests.exceptions.RequestException as e:
            self._send(502, {'error': f'Upstream request failed: {e}'})
        except Exception as e:
            self._send(500, {'error': str(e)})

    def _send(self, status, body):
        payload = json.dumps(body).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *_):
        pass


if __name__ == '__main__':
    port = 8000
    print(f'Dev API server running on http://localhost:{port}')
    HTTPServer(('', port), handler).serve_forever()
