const BASE_URL = "https://api.unsplash.com/";
// GET https://api.unsplash.com/search/photos?query={query}&client_id={access_key}

export async function getImages(query) {
  const res = await fetch(
    `${BASE_URL}/search/photos?query=${query}&orientation=landscape&client_id=${
      import.meta.env.VITE_IMAGE_API_KEY
    }`
  );
  const image = res.json();

  return image;
}
