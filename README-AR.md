# AR Product Viewer

This feature allows customers to view products in Augmented Reality (AR) directly in their web browser.

## How It Works

The AR feature uses the following technologies:
- [WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API) - A standard API for accessing VR and AR devices
- [Three.js](https://threejs.org/) - A popular JavaScript 3D library
- [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) - For loading 3D models in GLTF/GLB format

## How to Use

1. Navigate to the Products page
2. Click on the "AR-da bax" (View in AR) button next to any product
3. Allow camera access when prompted
4. Point your camera at a flat surface
5. Tap on the screen where you want to place the 3D model
6. The 3D model of the product will appear in your camera view

## Requirements

- A modern browser that supports WebXR (Chrome on Android, Safari on iOS)
- A device with a camera
- For the best experience, use a mobile device

## Adding 3D Models

To add 3D models for your products:

1. Create or obtain 3D models in GLB/GLTF format
2. Host these models on a public URL (e.g., GitHub, CDN)
3. Update the `modelUrl` property in the products array in both `app/ar/[id]/page.tsx` and `app/ar-viewer/[id]/page.tsx` files

## Surface Detection AR

Unlike the previous marker-based implementation, this version uses surface detection:

- No need for printed markers
- Simply point your camera at a flat surface
- Tap on the screen where you want to place the 3D model
- The model will be placed at that location in 3D space

## Troubleshooting

If the AR feature doesn't work:
- Make sure you're using a compatible browser (Chrome on Android or Safari on iOS)
- Check that your device has a camera and you've granted permission to use it
- Ensure you have a stable internet connection to load the 3D models
- Try refreshing the page

## Technical Details

The AR implementation uses:
- WebXR's `immersive-ar` session type
- Hit testing to detect surfaces
- Three.js for 3D rendering
- GLTFLoader for loading 3D models

## Future Improvements

- Add support for model interaction (rotation, scaling)
- Implement product customization in AR
- Add the ability to take screenshots of products in AR
- Support for multiple products in the same AR scene
- Add animations to the 3D models 