from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def maps():
    return {
        "map": "Working"
    }