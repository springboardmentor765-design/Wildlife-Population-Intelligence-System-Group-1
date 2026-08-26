from fastapi import APIRouter


def coming_soon_router(prefix: str, tags: list[str]) -> APIRouter:
    router = APIRouter(prefix=prefix, tags=tags)
    @router.get("")
    async def coming_soon() -> dict[str, str]:
        return {"message": "Coming Soon"}
    return router
