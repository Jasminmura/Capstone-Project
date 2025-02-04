from flask import Flask, request, jsonify
from flask_cors import CORS
from data_loader import find_key_for_lat_lon, predict_val

app = Flask(__name__)
CORS(app)

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """
    Example query:
    /api/weather?lat=51.505&lon=-0.09&startDay=100&range=7
        &temp=1&wind=0&rain=1&moisture=1
    """
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        start_day = int(request.args.get('startDay'))
        day_range = int(request.args.get('range')) 
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid lat/lon/startDay/range"}), 400

    temp_requested = request.args.get('temp', '0') == '1'
    wind_requested = request.args.get('wind', '0') == '1'
    rain_requested = request.args.get('rain', '0') == '1'
    moisture_requested = request.args.get('moisture', '0') == '1'

    key = find_key_for_lat_lon(lat, lon)
    if key is None:
        return jsonify({"error": "No match or nearest lat/lon found in data_cord"}), 404

    years = [2019] 

    temp_values = []
    wind_values = []
    rain_values = []
    moisture_values = []

    for i in range(day_range):
        current_day = start_day + i

        if current_day < 1 or current_day > 365:
            if temp_requested:
                temp_values.append(None)
            if wind_requested:
                wind_values.append(None)
            if rain_requested:
                rain_values.append(None)
            if moisture_requested:
                moisture_values.append(None)
            continue

        if temp_requested:
            tv = predict_val("Temperature", years, current_day, key)
            temp_values.append(tv if tv is not None else None)

        if wind_requested:
            wv = predict_val("Wind", years, current_day, key)
            wind_values.append(wv if wv is not None else None)

        if rain_requested:
            rv = predict_val("Rain", years, current_day, key)
            rain_values.append(rv if rv is not None else None)

        if moisture_requested:
            mv = predict_val("Moisture", years, current_day, key)
            moisture_values.append(mv if mv is not None else None)

    results = {}
    if temp_requested:
        results["temperature"] = temp_values
    if wind_requested:
        results["wind"] = wind_values
    if rain_requested:
        results["rain"] = rain_values
    if moisture_requested:
        results["moisture"] = moisture_values

    if not results:
        return jsonify({"error": "No parameters selected"}), 400

    output = {
        "lat": lat,
        "lon": lon,
        "startDay": start_day,
        "range": day_range,
        "results": results
    }
    return jsonify(output), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)