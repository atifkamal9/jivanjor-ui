"use client";
import Link from "next/link";
import { useState, useEffect, JSX } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

interface MobileNavProps {
  onClose?: () => void;
}

export default function MobileNav({ onClose }: MobileNavProps) {
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);

  const navLinks: NavItem[] = [
    { label: "About", href: "#" },
    {
      label: "Products",
      href: "/products",
      children: [
        {
          label: "Super Premium Adhesive",
          children: [{ label: "Product 1", href: "#" }],
        },
        {
          label: "Speciality Adhesive",
          children: [{ label: "Product 1", href: "#" }],
        },
        { label: "Regular Adhesive", href: "#" },
        {
          label: "Water Based or Grade Adhesive",
          children: [
            { label: "Watershed", href: "#" },
            { label: "Aquaprotekt", href: "#" },
            { label: "Aquashield", href: "#" },
          ],
        },
        {
          label: "Wood Ancillaries",
          children: [{ label: "Product 1", href: "#" }],
        },
        { label: "ECO", children: [{ label: "Product 1", href: "#" }] },
        {
          label: "Wood Preservatives",
          children: [{ label: "Product 1", href: "#" }],
        },
      ],
    },
    {
      label: "Applications",
      children: [
        { label: "Furniture & Woodwork", href: "#" },
        { label: "Laminates & Finishing", href: "#" },
        { label: "Kitchen & Storage Units", href: "#" },
        { label: "Moisture-Prone Woodwork", href: "#" },
        { label: "PVC & Edge Finishing", href: "#" },
        { label: "Home Repairs & DIY", href: "#" },
        { label: "Foam & Acoustic Bonding", href: "#" },
        { label: "OEM & Bulk Woodwork", href: "#" },
      ],
    },
    { label: "Knowledge Hub", href: "#" },
    { label: "Partner", href: "#" },
    { label: "Contact", href: "#" },
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const toggleExpandItem = (label: string, level: number) => {
    if (level === 0) {
      // Top level - accordion behavior, reset children when switching
      if (expandedParent === label) {
        setExpandedParent(null);
        setExpandedChild(null);
      } else {
        setExpandedParent(label);
        setExpandedChild(null);
      }
    } else {
      // Child level - accordion within children
      setExpandedChild(expandedChild === label ? null : label);
    }
  };

  const renderNavItem = (item: NavItem, level: number = 0): JSX.Element => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded =
      level === 0
        ? expandedParent === item.label
        : expandedChild === item.label;
    const paddingLeft = level * 16;
    const textClasses =
      level === 0 ? "text-lg font-semibold" : "text-base font-medium";
    const verticalPadding = level > 0 ? "py-0.5" : "py-3";

    return (
      <div key={item.label}>
        <div className="flex items-center justify-between pr-3">
          {item.href && !hasChildren ? (
            <Link
              href={item.href}
              className={`flex-1 ${verticalPadding} ${textClasses} hover:text-primary transition-colors duration-200`}
              onClick={onClose}
              style={{ paddingLeft: `${paddingLeft}px` }}
            >
              {item.label}
            </Link>
          ) : (
            <Link
              href={item.href ?? "#"}
              onClick={() => toggleExpandItem(item.label, level)}
              className={`w-full text-left ${verticalPadding} ${textClasses} hover:text-primary transition-colors duration-200`}
              style={{ paddingLeft: `${paddingLeft}px` }}
            >
              {item.label}
            </Link>
          )}
          {hasChildren && (
            <button
              onClick={() => toggleExpandItem(item.label, level)}
              className="hover:bg-gray-100 rounded transition-colors"
            >
              {level > 0 ? (
                isExpanded ? (
                  <Minus size={18} className="text-primary" />
                ) : (
                  <Plus size={18} className="text-primary" />
                )
              ) : (
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="fixed inset-0 top-21 bg-white z-50 h-screen w-screen overflow-y-auto animate-in fade-in duration-300">
      <div className="p-6">{navLinks.map((link) => renderNavItem(link))}</div>
    </section>
  );
}
