import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';

export function useImageSlideshow() {
  const [image, setImage] = useState(null);
  const [nextPrompt, setNextPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isStopped, stop] = useState(false);

  const nextImage = useCallback(async () => {

    setLoadedImages(loadedImages => {
    console.log("imgs", loadedImages, isStopped)
      if (loadedImages.length > 0) {
        const [nextImage, ...newLoadedImages] = loadedImages;
        setImage(nextImage);
        setNextPrompt(nextImage["originalPrompt"]);
        return newLoadedImages;
      }
      return loadedImages;
    })

    if (!isStopped)
      setTimeout(nextImage, 2000);

  }, [loadedImages, isStopped]);

  const onNewImage = useCallback((newImage, emptyQueue=false) => {
    return new Promise((resolve, reject) => {
      console.log("loading new image", newImage.prompt);
      const img = new Image();
      img.src = newImage.imageURL;
      img.onload = () => {
        console.log("loaded new image", newImage.prompt);
        setLoadedImages(images => emptyQueue ? [newImage] : [...images, newImage]);
        resolve();
      };
      img.onerror = (error) => {
        console.error("Error loading image", newImage.prompt, error);
        reject(error);
      };
    });
  }, [setLoadedImages]);

  const debouncedUpdateImage = useCallback(debounce(async (newImage) => {
    setIsLoading(true);
    await onNewImage(newImage, true);
    setIsLoading(false);
  }, 3000), [onNewImage]);

  const updateImage = useCallback((newImage) => {
    console.log("calling update image", newImage)
    stop(true);
    debouncedUpdateImage(newImage);
  }, [stop, debouncedUpdateImage]); // Debounce time of 3000ms

  useEffect(()=> nextImage(),[]);

  return { image, nextPrompt, updateImage, isLoading, onNewImage };
}
