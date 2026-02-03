#!/usr/bin/env python
"""Debug script to check routes and start server with debugging"""

import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'src'))

from src.main import app

print("=== Checking registered routes ===")
for route in app.routes:
    if hasattr(route, 'path'):
        methods = getattr(route, 'methods', 'UNKNOWN')
        path = getattr(route, 'path', 'UNKNOWN')
        name = getattr(route, 'name', getattr(route, 'operation_id', 'unknown'))
        print(f'{methods} {path} - {name}')

print("\n=== Starting server with debugging ===")

if __name__ == "__main__":
    import uvicorn

    # Print all routes before starting
    print(f"\nTotal routes: {len(app.routes)}")

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)