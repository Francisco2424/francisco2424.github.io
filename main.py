from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

from mundial_router import router as mundial_router

app = FastAPI()

# ------------------------------------------------------------
# 🟩 CORS CORRECTO PARA GITHUB PAGES
# ------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://francisco2424.github.io"],  # tu dominio público
    allow_credentials=True,
    allow_methods=["*"],  # IMPORTANTE: permite GET + OPTIONS
    allow_headers=["*"],
)

# ------------------------------------------------------------
# 🟩 Registrar router del Mundial
# ------------------------------------------------------------
app.include_router(mundial_router)

# ------------------------------------------------------------
# 🟩 Ruta raíz
# ------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "Backend de Francisco Mallea funcionando correctamente"}

# ------------------------------------------------------------
# 🟩 Ruta de clima
# ------------------------------------------------------------
@app.get("/api/weather")
def get_weather(city: str, country: str):
    api_key = os.getenv("OPENWEATHER_KEY")
    if not api_key:
        return {"error": "API key no configurada en Render"}

    url = (
        f"https://api.openweathermap.org/data/2.5/weather?"
        f"q={city},{country}&appid={api_key}&units=metric&lang=es"
    )

    try:
        response = requests.get(url, timeout=10)
        data = response.json()

        if "main" in data and "weather" in data:
            return {
                "city": city,
                "temperature": data["main"]["temp"],
                "description": data["weather"][0]["description"],
            }
        else:
            return {"error": "Datos no disponibles para esta ciudad"}

    except Exception as e:
        return {"error": str(e)}
