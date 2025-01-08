from flask import Flask, request, jsonify
from flask_cors import CORS
from model.cleaned_weather_pred import train_data, predict_until_date

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['OPTIONS'])
def handle_options():
    return '', 200  # Respond with a 200 status for OPTIONS requests

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    city = data.get('city')
    date = data.get('date')

    print(f"City : {city}, Date : {date}")

    # Train the model for the selected city
    try:
        model, predictors, weather = train_data(city)
    except FileNotFoundError:
        return jsonify({"error": f"City data for {city} not found"}), 404
    
    # Prediction for the specified date
    prediction_temp = predict_until_date(model[0], weather, predictors[0], date, 'tavg')
    prediction_humidity = predict_until_date(model[1], weather, predictors[1], date, 'Humidity')
    prediction_wind = predict_until_date(model[2], weather, predictors[2], date, 'WindSpeed')
    prediction_preci = predict_until_date(model[3], weather, predictors[3], date, 'Precipitation')

    prediction_temp = round(prediction_temp, 2)
    prediction_humidity = round(prediction_humidity, 2)
    prediction_wind = round(prediction_wind, 2)
    prediction_preci = round(prediction_preci, 2)

    return jsonify({"city": city, "date": date, "predicted_temperature": prediction_temp, "predicted_humidity": prediction_humidity, "predicted_windspeed": prediction_wind, "predicted_precipitation": prediction_preci})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
