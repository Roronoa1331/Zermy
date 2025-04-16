# AR Product Viewer

This feature allows customers to view products in Augmented Reality (AR) directly in their web browser.

## How It Works

The AR feature uses the following technologies:
- [A-Frame](https://aframe.io/) - A web framework for building VR experiences
- [AR.js](https://ar-js-org.github.io/AR.js-Docs/) - A lightweight library for adding AR capabilities to web applications

## How to Use

1. Navigate to the Products page
2. Click on the "AR-da bax" (View in AR) button next to any product
3. Allow camera access when prompted
4. Point your camera at a flat surface
5. The 3D model of the product will appear in your camera view

## Requirements

- A modern browser that supports WebXR (Chrome, Edge, or Safari on iOS)
- A device with a camera
- For the best experience, use a mobile device

## Adding 3D Models

To add 3D models for your products:

1. Create or obtain 3D models in GLB/GLTF format
2. Host these models on a public URL (e.g., GitHub, CDN)
3. Update the `modelUrl` property in the products array in both `app/ar/[id]/page.tsx` and `app/ar-viewer/[id]/page.tsx` files

## Marker-Based AR

The current implementation uses marker-based AR with the "hiro" marker. You can print this marker or display it on another device to trigger the AR experience.

## Troubleshooting

If the AR feature doesn't work:
- Make sure you're using a compatible browser
- Check that your device has a camera and you've granted permission to use it
- Ensure you have a stable internet connection to load the 3D models
- Try refreshing the page

## Future Improvements

- Add support for markerless AR using surface detection
- Implement product customization in AR
- Add the ability to take screenshots of products in AR
- Support for multiple products in the same AR scene 