from app.api import admin_live_session, admin_news,user_news
from app.api import  auth_routes, user_routes,device_controls_routes, health_monitoring_routes,admin_health_monitoring,admin_device_controls, public_routes, admin_contact, admin_about, file_upload
from app.db.base import Base, engine

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.models import * 
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WOMB Backend",
    description="Backend API for WOMB platform",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# mount your routers
app.include_router(auth_routes.router, prefix="/auth", )
app.include_router(user_routes.router, prefix="/users", )
app.include_router(user_news.router, prefix="/news")
app.include_router(public_routes.router)
app.include_router(device_controls_routes.router, )
app.include_router(health_monitoring_routes.router, )


app.include_router(admin_device_controls.router)
app.include_router(admin_health_monitoring.router)

app.include_router(admin_live_session.router)
app.include_router(admin_news.router)
app.include_router(admin_contact.router)
app.include_router(admin_about.router)
app.include_router(file_upload.router)

# Mount static files for uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/debug/routes")
async def debug_routes():
    routes = []
    for route in app.routes:
        routes.append({
            "path": route.path,
            "name": route.name,
            "methods": route.methods
        })
    return routes