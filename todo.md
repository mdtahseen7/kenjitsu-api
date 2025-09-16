Fix docker 
1. No need to unpacking format the extension librabry response structure
2. The search type in tmdb needs to check first if there are inputs or none
3. Think how of how redis is used and how caching works across the server  can have a settime expiry or permannet