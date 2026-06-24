import random
import requests
import streamlit as st

st.set_page_config(page_title="Demo App", page_icon="🎲", layout="centered")

st.markdown(
    """
    <style>
    .big-dice  { font-size: 110px; text-align: center; line-height: 1; }
    .dice-num  { font-size: 28px; text-align: center; font-weight: 700; margin-top: -8px; }
    .big-temp  { font-size: 60px; font-weight: 800; text-align: center; }
    .place-name { font-size: 20px; font-weight: 700; text-align: center; }
    .city-sub  { font-size: 16px; text-align: center; color: #888; }
    </style>
    """,
    unsafe_allow_html=True,
)

st.title("Demo App")

FACES = {1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅"}


def _is_city(loc):
    cls, typ = loc.get("class", ""), loc.get("type", "")
    if cls == "boundary":
        return True
    if cls == "place" and typ in {
        "city", "town", "village", "hamlet", "municipality",
        "borough", "county", "state", "province", "region", "country",
    }:
        return True
    return False

if "dice" not in st.session_state:
    st.session_state.dice = random.randint(1, 6)

st.header("🎲 Roll the Dice")
st.markdown(f'<div class="big-dice">{FACES[st.session_state.dice]}</div>', unsafe_allow_html=True)
st.markdown(f'<div class="dice-num">Result: {st.session_state.dice}</div>', unsafe_allow_html=True)

if st.button("🎲 Roll Again", use_container_width=True):
    st.session_state.dice = random.randint(1, 6)
    st.rerun()

st.divider()

st.header("🌡️ Current Weather")
query = st.text_input("City or place", placeholder="e.g. Tokyo, Eiffel Tower, Central Park")

if st.button("Get Temperature", use_container_width=True, disabled=not query.strip()):
    with st.spinner("Fetching…"):
        try:
            results = requests.get(
                "https://nominatim.openstreetmap.org/search",
                params={
                    "q": query.strip(),
                    "format": "json",
                    "limit": 1,
                    "addressdetails": 1,
                    "namedetails": 1,
                },
                headers={"User-Agent": "DemoApp/1.0 (educational demo)"},
                timeout=8,
            ).json()

            if not results:
                st.error(f"'{query}' not found.")
            else:
                loc = results[0]
                lat, lon = float(loc["lat"]), float(loc["lon"])
                addr = loc.get("address", {})
                nd = loc.get("namedetails", {})
                country = addr.get("country_code", "").upper()

                is_city = _is_city(loc)

                wx = requests.get(
                    "https://api.open-meteo.com/v1/forecast",
                    params={
                        "latitude": lat, "longitude": lon,
                        "current": "temperature_2m", "timezone": "auto",
                    },
                    timeout=8,
                ).json()
                temp = wx["current"]["temperature_2m"]

                if is_city:
                    name = (nd.get("name:en") or nd.get("name")
                            or addr.get("city") or addr.get("town")
                            or addr.get("village")
                            or loc["display_name"].split(",")[0].strip())
                    city_label = f"{name}, {country}" if country else name
                    st.markdown(f'<div class="big-temp">{temp}°C</div>', unsafe_allow_html=True)
                    st.markdown(f'<div class="city-sub">{city_label}</div>', unsafe_allow_html=True)
                else:
                    place_name = (nd.get("name:en") or nd.get("name")
                                  or loc["display_name"].split(",")[0].strip())
                    city_name = (addr.get("city") or addr.get("town")
                                 or addr.get("village") or addr.get("municipality")
                                 or addr.get("county") or "")
                    city_label = f"{city_name}, {country}" if country else city_name
                    st.markdown(f'<div class="place-name">{place_name}</div>', unsafe_allow_html=True)
                    st.markdown(f'<div class="big-temp">{temp}°C</div>', unsafe_allow_html=True)
                    st.markdown(f'<div class="city-sub">{city_label}</div>', unsafe_allow_html=True)

        except requests.exceptions.RequestException as e:
            st.error(f"Network error: {e}")
        except Exception as e:
            st.error(f"Unexpected error: {e}")
