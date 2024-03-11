import Link from "next/link";
import Image from "next/image";

export const Icon = ({
  url,
  imageUrl,
  title,
  isTextButton = true,
  iconOnLeft = true,
  width = 32,
  height = 32,
}) => {
  console.log("url =", `/images/${imageUrl}`);
  return (
    <Link key={url} href={url}>
      <a>
        <Image
          alt={title}
          src={`/images/${imageUrl}`}
          width={width}
          height={height}
          priority={true}
        />
        {isTextButton && title}
      </a>
    </Link>
  );
};

export const RightArrowIcon = ({ url, title, isTextButton = true }) => {
  if (!url) return <>{title}</>;
  return (
    <Link key={url} href={url}>
      <a>⮚{isTextButton && title}</a>
    </Link>
  );
};

export const UpArrowIcon = ({ url, title, isTextButton = true }) => {
  if (!url) return <>{title}</>;
  return (
    <Link key={url} href={url}>
      <a>⮙{isTextButton && title}</a>
    </Link>
  );
};
export const LeftArrowIcon = ({ url, title, isTextButton = true }) => {
  if (!url) return <>{title}</>;
  return (
    <Link key={url} href={url}>
      <a>⮘ {isTextButton && title}</a>
    </Link>
  );
};
