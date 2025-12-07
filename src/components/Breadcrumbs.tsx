import Link from "next/link";
import { FaHome } from "react-icons/fa";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-4">
      <Link
        href="/dashboard"
        className="text-gray-600 hover:text-blue-600 transition">
        <div className='inline-flex items-center gap-3'>
             <FaHome className="text-gray-800 text-2xl"/> 
             <p> Home</p>
         </div>
      </Link>
     
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-gray-400">›</span>
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}