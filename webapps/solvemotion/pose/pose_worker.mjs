import { FilesetResolver, PoseLandmarker } from './vendor/vision_bundle.mjs';

// One explicit local frame per worker; all assets stay on the app's origin.
self.onmessage = async ({ data }) => {
  let image;
  let detector;
  try {
    if (!(data instanceof Uint8Array) || data.byteLength === 0 || data.byteLength > 8000000)
      throw new Error('Invalid frame bytes');
    image = await createImageBitmap(new Blob([data], { type: 'image/jpeg' }));
    if (image.width < 1 || image.height < 1 || image.width * image.height > 32000000)
      throw new Error('Invalid frame geometry');
    const wasm = await FilesetResolver.forVisionTasks(new URL('vendor/wasm', import.meta.url).href, true);
    detector = await PoseLandmarker.createFromOptions(wasm, {
      baseOptions: { modelAssetPath: new URL('pose_landmarker_lite.task', import.meta.url).href, delegate: 'CPU' },
      runningMode: 'IMAGE', numPoses: 2, outputSegmentationMasks: false,
      minPoseDetectionConfidence: 0.5, minPosePresenceConfidence: 0.5,
    });
    const result = detector.detect(image);
    const poses = result.landmarks.map(points => points.map(p => ({
      x: p.x, y: p.y, z: p.z, visibility: p.visibility,
      ...(typeof p.presence === 'number' ? { presence: p.presence } : {}),
    })));
    self.postMessage({ ok: true, width: image.width, height: image.height, poses });
    result.close();
  } catch (_) {
    self.postMessage({ ok: false });
  } finally {
    detector?.close();
    image?.close();
  }
};
