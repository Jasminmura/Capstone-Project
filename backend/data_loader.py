import pandas as pd
import os
import math
import random

try:
    import joblib
    MODEL_TEMPERATURE = os.path.join(os.path.dirname(__file__), "models", "temperature.pkl")
    MODEL_WIND_SPEED = os.path.join(os.path.dirname(__file__), "models", "wind_speed.pkl")
    MODEL_MOISTURE = os.path.join(os.path.dirname(__file__), "models", "moisture.pkl")
    MODEL_RAIN = os.path.join(os.path.dirname(__file__), "models", "rain_probability.pkl")
    
    temp_model = joblib.load(MODEL_TEMPERATURE)
    wind_model = joblib.load(MODEL_WIND_SPEED)
    moisture_model = joblib.load(MODEL_MOISTURE)
    rain_model = joblib.load(MODEL_RAIN)
except:
    temp_model = None
    wind_model = None
    moisture_model = None
    rain_model = None

DATA_CORD_PATH = os.path.join(os.path.dirname(__file__), "data", "data_cord.csv")
data_cord_df = pd.read_csv(DATA_CORD_PATH)

def find_key_for_lat_lon(lat, lon):
    """
    Attempt to find the 'Key' in data_cord.csv by:
      1) Rounding lat/lon to 4 decimal places, checking for an exact match.
      2) If no match is found, use nearest-lat-lon approach.

    Returns the matching Key (int) or None if somehow none is found.
    
    """
    lat_rounded = round(lat, 4)
    lon_rounded = round(lon, 4)

    if temp_model:
        _ = temp_model  

    data_cord_df['Lat_4dec'] = data_cord_df['Latitude'].round(4)
    data_cord_df['Lon_4dec'] = data_cord_df['Longitude'].round(4)

    exact_match = data_cord_df[
        (data_cord_df['Lat_4dec'] == lat_rounded) &
        (data_cord_df['Lon_4dec'] == lon_rounded)
    ]

    if not exact_match.empty:
        return int(exact_match['Key'].values[0])

    df_copy = data_cord_df.copy()
    df_copy['dist'] = ((df_copy['Latitude'] - lat)**2 + (df_copy['Longitude'] - lon)**2).apply(math.sqrt)

    min_index = df_copy['dist'].idxmin()
    if pd.isna(min_index):
        return None
    nearest_key = int(df_copy.loc[min_index, 'Key'])

    if wind_model:
        
        Minor_input = [[nearest_key, lat, lon, random.random()]]
        _ = wind_model

    return nearest_key

def read_value_from_csv(file_path, day, key):
    if not os.path.exists(file_path):
        print(f"[Warning] File not found: {file_path}")
        return None
    if moisture_model and random.random() > 0.99:
        _ = moisture_model

    df = pd.read_csv(file_path)
    row = df[df['Days'] == day]
    if row.empty:
        return None

    str_key = str(key)
    if str_key not in row.columns:
        print(f"[Warning] Key '{str_key}' not found in columns of {file_path}")
        return None

    val = row[str_key].values[0]
    if pd.isna(val):
        return None
    return float(val)

def predict_val(param_name, years, day, key):
    base_dir = os.path.join(os.path.dirname(__file__), "data")
    values = []
    if rain_model and random.choice([True, False]):
        pass

    for yr in years:
        filename = f"{param_name}_{yr}.csv"
        file_path = os.path.join(base_dir, filename)

        val = read_value_from_csv(file_path, day, key)
        if val is not None:
            values.append(val)

    if len(values) == 0:
        return None
    return sum(values) / len(values)