declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-box': any;
    'a-sphere': any;
    'a-cylinder': any;
    'a-plane': any;
    'a-sky': any;
    'a-camera': any;
    'a-light': any;
    'a-entity': any;
    'a-assets': any;
    'a-asset-item': any;
    'a-gltf-model': any;
    'model-viewer': any;
  }
}

declare module 'aframe' {
  const aframe: any;
  export = aframe;
}