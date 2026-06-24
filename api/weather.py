from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, urlencode
from urllib.request import urlopen, Request
from urllib.error import URLError
import json

NOMINATIM_UA = 'DemoApp/1.0 (educational demo)'


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


def _get(url, headers=None):
    req = Request(url, headers=headers or {})
    with urlopen(req, timeout=8) as r:
        return json.loads(r.read())


def _weather(lat, lon):
    data = _get(
        f'https://api.open-meteo.com/v1/forecast'
        f'?latitude={lat}&longitude={lon}&current=temperature_2m&timezone=auto'
    )
    return data['current']['temperature_2m']


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        query = params.get('q', [''])[0].strip()

        if not query:
            self._send(400, {'error': 'Query is required.'})
            return

        try:
            qs = urlencode({
                'q': query,
                'format': 'json',
                'limit': 1,
                'addressdetails': 1,
                'namedetails': 1,
            })
            results = _get(
                f'https://nominatim.openstreetmap.org/search?{qs}',
                headers={'User-Agent': NOMINATIM_UA},
            )

            if not results:
                self._send(404, {'error': f"'{query}' not found."})
                return

            loc = results[0]
            lat, lon = float(loc['lat']), float(loc['lon'])
            addr = loc.get('address', {})
            nd = loc.get('namedetails', {})

            country = addr.get('country_code', '').upper()

            if _is_city(loc):
                name = (nd.get('name:en') or nd.get('name')
                        or addr.get('city') or addr.get('town')
                        or addr.get('village')
                        or loc['display_name'].split(',')[0].strip())
                city_label = f"{name}, {country}" if country else name
                self._send(200, {'temperature': _weather(lat, lon), 'city': city_label})

            else:
                place_name = (nd.get('name:en') or nd.get('name')
                              or loc['display_name'].split(',')[0].strip())
                city_name = (addr.get('city') or addr.get('town')
                             or addr.get('village') or addr.get('municipality')
                             or addr.get('county') or '')
                city_label = f"{city_name}, {country}" if country else city_name
                self._send(200, {
                    'temperature': _weather(lat, lon),
                    'city': city_label,
                    'place': place_name,
                })

        except URLError as e:
            self._send(502, {'error': f'Upstream request failed: {e.reason}'})
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
