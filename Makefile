.PHONY: all frontend api1 api2

# Run all services
all: frontend api1 api2


frontend:
	cd FrontendV2 && cd TalentVerify && npm run start &

api1:
	cd Backend/APIMobeen && venv/Scripts/activate && uvicorn app:app --reload & \

api2:
	cd Backend/APIHuzaifah && venv/Scripts/python -c "import sys; print(sys.executable)" && \
    venv/Scripts/python -m uvicorn app:app --reload --port 9000 &