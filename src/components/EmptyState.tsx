import Link from "next/link";
import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon = "/mail.jpg"
}: EmptyStateProps) {
    // change icon source to either emoji or image path
    // const isImageIcon = typeof icon === "string" && icon.includes(".");
    const isImageIcon = icon.startsWith("/") || icon.startsWith("http");

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
        {isImageIcon ? (
            <div className="mb-4 relative w-20 h-20">
                <Image 
                src={icon} alt={title} fill sizes="80px"
                className="object-contain"  style={{ objectFit: "contain" }}/>
        </div>
        ) : (
            <div className="text-6xl mb-4">{icon}</div>
        )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-sm mb-6">{description}</p>
      
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}