type PosterImageProps = {
  path: string | null;
  alt: string;
  size?: "w185" | "w342" | "w500";
  fallbackText?: string;
};

export default function PosterImage({
  path,
  alt,
  size = "w342",
  fallbackText = "No image",
}: PosterImageProps) {
  if (!path) {
    return (
      <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-neutral-700 text-xs text-neutral-400">
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={`https://image.tmdb.org/t/p/${size}${path}`}
      alt={alt}
      className="block w-full rounded-lg"
    />
  );
}
