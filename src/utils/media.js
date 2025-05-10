export const handleTakePhoto = async (onImageCaptured) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("La API de MediaDevices no es compatible con este navegador.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);
    const photoBlob = await imageCapture.takePhoto();
    videoTrack.stop();

    if (onImageCaptured) {
      onImageCaptured(photoBlob);
    }
  } catch (error) {
    console.error("Error al acceder a la cámara:", error);
    alert("Error al acceder a la cámara.");
  }
};

export const handleChooseFromGallery = (onImageSelected) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file && onImageSelected) {
      onImageSelected(file);
    }
  };

  input.click();
};
