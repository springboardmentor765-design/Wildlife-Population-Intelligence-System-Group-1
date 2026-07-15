from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def reports():
    return {
        "reports": "Working"
    }