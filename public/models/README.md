# 3D Models Directory

This directory contains 3D models used in the AR Product Viewer.

## Directory Structure

```
public/models/
├── products/           # Product-specific 3D models
│   ├── bag/           # Example: Bag product models
│   │   ├── model.gltf # Main model file
│   │   └── textures/  # Textures for the model
│   └── carpet/        # Example: Carpet product models
└── README.md          # This file
```

## Adding New Models

1. Create a new directory for your product under `products/`
2. Place your GLTF/GLB model file in the product directory
3. If your model uses external textures, create a `textures/` subdirectory
4. Update the product data in `app/ar-viewer/[id]/page.tsx` with the new model path

## Model Requirements

- Format: GLTF 2.0 or GLB
- Maximum file size: 10MB recommended
- Polygon count: Optimize for mobile devices
- Textures: Include all necessary textures
- Scale: Models should be properly scaled (1 unit = 1 meter)

## Recommended Model Sources

1. **Free Sources:**
   - [Sketchfab Free Models](https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount)
   - [Google 3D Assets](https://poly.google.com/)
   - [Khronos Group glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models)

2. **Paid Sources:**
   - [Sketchfab](https://sketchfab.com/3d-models)
   - [CGTrader](https://www.cgtrader.com/3d-models)
   - [TurboSquid](https://www.turbosquid.com/Search/3D-Models/free)
   - [Unity Asset Store](https://assetstore.unity.com/3d)

## Model Optimization Tips

1. Reduce polygon count for mobile devices
2. Optimize texture sizes (max 2048x2048)
3. Use texture compression when possible
4. Remove unused materials and textures
5. Test loading performance on mobile devices 