import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
import os

def train_data(city):
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', f'{city}.csv')

    try:
        weather = pd.read_csv(data_path, index_col="time")
    except FileNotFoundError:
        raise FileNotFoundError(f"City data for {city} not found.")
    
    # Remove columns with more than 30% null values
    null_percentage = weather.apply(pd.isnull).sum() / weather.shape[0]
    valid_columns = weather.columns[null_percentage < 0.3]
    weather = weather[valid_columns].copy()

    # Forward fill missing values and drop initial rows with missing values
    weather = weather.ffill()
    if weather.iloc[0].isnull().any():
        weather = weather.drop(weather.index[0])

    # Set date index and ensure datetime format
    weather.index = pd.to_datetime(weather.index, format='%d-%m-%Y')

    # Fill missing target columns and shift target variables by one day
    target_columns = {
        "target_temp": "tmax",
        "target_humidity": "Humidity",
        "target_Wind_Speed": "WindSpeed",
        "target_Precipitation": "Precipitation"
    }
    for target_col, original_col in target_columns.items():
        if original_col in weather.columns:
            weather[target_col] = weather.shift(-1)[original_col]
    weather = weather.ffill()

    ## add rolling and month average
    columns_to_rolling = ["tmax", "tmin", "Humidity", "WindSpeed", "Precipitation"]
    rolling_horizons = [3, 14]
    for horizon in rolling_horizons:
        for col in columns_to_rolling:
            weather[f"rolling_{horizon}_{col}"] = weather[col].rolling(horizon).mean()
            weather[f"rolling_{horizon}_{col}_pct"] = (weather[col] - weather[f"rolling_{horizon}_{col}"]) / weather[f"rolling_{horizon}_{col}"]
    # Add month and day averages
    columns_to_avg = ["tmax", "tmin", "Humidity", "WindSpeed", "Precipitation"]
    for col in columns_to_avg:
        weather[f"month_avg_{col}"] = weather[col].groupby(weather.index.month, group_keys=False).apply(lambda x: x.expanding(1).mean())
        weather[f"day_avg_{col}"] = weather[col].groupby(weather.index.day_of_year, group_keys=False).apply(lambda x: x.expanding(1).mean())
    
    weather.fillna(0, inplace=True)

    predictors1 = ["tavg", "tmin", "tmax", "rolling_14_tmax", "rolling_14_tmax_pct", "rolling_14_tmin", "rolling_14_tmin_pct", "rolling_3_tmax", "rolling_3_tmax_pct", "rolling_3_tmin", "rolling_3_tmin_pct", "month_avg_tmax", "day_avg_tmax", "month_avg_tmin", "day_avg_tmin"]
    predictors2 = ["Humidity", "rolling_3_Humidity", "rolling_3_Humidity_pct", "rolling_14_Humidity", "rolling_14_Humidity_pct", "month_avg_Humidity", "day_avg_Humidity"]
    predictors3 = ["WindSpeed", "rolling_3_WindSpeed", "rolling_3_WindSpeed_pct", "rolling_14_WindSpeed", "rolling_14_WindSpeed_pct", "month_avg_WindSpeed", "day_avg_WindSpeed"]
    predictors4 = ["Precipitation", "rolling_3_Precipitation", "rolling_3_Precipitation_pct", "rolling_14_Precipitation", "rolling_14_Precipitation_pct", "month_avg_Precipitation", "day_avg_Precipitation"]

    # Ridge Models for different targets
    model_temp = train_ridge_model(weather, predictors1, "target_temp")
    model_humidity = train_ridge_model(weather, predictors2, "target_humidity")
    model_windspeed = train_ridge_model(weather, predictors3, "target_Wind_Speed")
    model_precipitation = train_ridge_model(weather, predictors4, "target_Precipitation")

    models = [model_temp, model_humidity, model_windspeed, model_precipitation]
    predictors = [predictors1, predictors2, predictors3, predictors4]

    return models, predictors, weather

def train_ridge_model(weather, predictors, target):
    model = Ridge(alpha=0.1)
    X = weather[predictors]
    y = weather[target]
    model.fit(X, y)
    return model

def predict_until_date(model, weather, predictors, date, target_col):
    date = pd.to_datetime(date)
 
    if date in weather.index:
        if target_col in weather.columns:
            actual_value = weather.loc[date, target_col]
            return actual_value 
    
    current_date = weather.index[-1]
    predictions = []
    
    while current_date <= date:
        data_for_prediction = weather.loc[current_date, predictors].to_frame().T
        predicted_value = model.predict(data_for_prediction)[0]
        predictions.append((current_date, predicted_value))
                
        new_row = pd.Series(predicted_value, index=[target_col])
        for predictor in predictors:
            new_row[predictor] = weather.loc[current_date, predictor] + np.random.normal(0, 0.05)
        
        current_date += pd.Timedelta(days=1)
        
        new_row_df = new_row.to_frame().T
        new_row_df.index = [current_date]
        weather = pd.concat([weather, new_row_df])
    
    return predictions[-1][1]
