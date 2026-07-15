from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def audio():
    return {
        "audio": "Working"
    }