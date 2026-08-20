"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ShieldCheck, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Heading, Subtitle, Title, Paragraph } from "@/components/ui";

interface ReachLeftProps {
  data?: {
    title?: string;
    appText?: string;
    promoImage?: string;
    playStoreLink?: string;
    cards?: { title: string; desc: string; icon: string }[];
  };
}

const defaultCards = [
  {
    title: "Reliable Product Range",
    desc: "Work with adhesives made for superior performance across every woodworking need.",
    icon: "/images/about/Ad-product.svg",
  },
  {
    title: "Trade-Focused Support",
    desc: "Get product information, application guidance and support to recommend with confidence.",
    icon: "/images/about/Spanner.svg",
  },
  {
    title: "Business Growth Opportunity",
    desc: "Connect with a growing adhesive brand that supports contractors, carpenters and channel partners across markets.",
    icon: "/images/contractor/Positive-dynamics.svg",
  },
];

export function ReachLeft({ data }: ReachLeftProps) {
  const title = data?.title || "Step into the realm of Champions and Unlock a world of limitless advantages.";
  const appText = data?.appText || "Download the Jivanjor Achievers Club App to enrol, access contractor benefits, track rewards and stay connected.";
  const promoImage = data?.promoImage || "/images/contractor/contractor-app-promo.png";
  const playStoreLink = data?.playStoreLink || "https://play.google.com/store";
  const cards = data?.cards || defaultCards;

  const renderIcon = (icon: any) => {
    if (typeof icon === "string") {
      const isInvert = icon.includes("Ad-product") || icon.includes("Spanner");
      return (
        <Image
          src={icon}
          className={`aspect-square w-10 h-10 ${isInvert ? "invert brightness-0" : ""}`}
          height={40}
          width={40}
          alt="icon"
        />
      );
    }
    return icon;
  };

  return (
    <div className="flex flex-col space-y-6 text-[#222]">
      <Heading className="text-center md:text-start leading-tight">
        {title}
      </Heading>
      {/* Top section: Text, Download button and Promo Image */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* App text */}
        <div className="hidden md:block col-span-7 max-w-md space-y-4">
          <Subtitle className="leading-relaxed">
            {appText}
          </Subtitle>
          <div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={playStoreLink}
              className="inline-block transition-transform hover:scale-105"
            >
              <Image
                src="/images/contractor/google-play-badge.png"
                alt="Get it on Google Play"
                width={150}
                height={45}
                className="object-contain"
              />
            </a>
          </div>
        </div>

        {/* Promo Image */}
        <div className="md:col-span-5 relative w-full h-51 md:h-55 rounded-[20px] overflow-hidden shadow-md">
          <Image
            fill
            src={promoImage}
            alt="Jivanjor Achievers Club App"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-center text-center md:hidden space-y-4 max-w-85 mx-auto">
          <Subtitle className="leading-relaxed">
            {appText}
          </Subtitle>
          <div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={playStoreLink}
              className="inline-block transition-transform hover:scale-105"
            >
              <Image
                src="/images/contractor/google-play-badge.png"
                alt="Get it on Google Play"
                width={150}
                height={45}
                className="object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Feature Cards Box */}
      <div className="w-full bg-linear-to-r from-[#E7071C] to-[#772571] text-white rounded-[20px] p-10 md:p-12 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center justify-center">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex flex-1 flex-col items-center text-center transition-all duration-300 max-w-60.5"
            >
              <div className="flex items-center justify-center mb-4 md:mb-5">
                {renderIcon(card.icon)}
              </div>
              <Title as="h3" className="mb-2.5 md:mb-5 text-white">
                {card.title}
              </Title>
              <Paragraph className="opacity-90 text-white">{card.desc}</Paragraph>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


interface ReachFormProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  isSticky?: boolean;
  setIsSticky?: (isSticky: boolean) => void;
}

export function ReachForm({
  isOpen: propIsOpen,
  setIsOpen: propSetIsOpen,
  isSticky: propIsSticky,
  setIsSticky: propSetIsSticky,
}: ReachFormProps = {}) {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    city: "",
    pinCode: "",
    queryType: "",
    message: "",
    consent: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [localIsOpen, setLocalIsOpen] = useState(true);
  const [localIsSticky, setLocalIsSticky] = useState(false);

  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
  const setIsOpen =
    propSetIsOpen !== undefined ? propSetIsOpen : setLocalIsOpen;
  const isSticky = propIsSticky !== undefined ? propIsSticky : localIsSticky;
  const setIsSticky =
    propSetIsSticky !== undefined ? propSetIsSticky : setLocalIsSticky;
  const [desktopQueryOpen, setDesktopQueryOpen] = useState(false);
  const [mobileQueryOpen, setMobileQueryOpen] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);

  useEffect(() => {
    if (formRef.current && !isSticky) {
      const height = formRef.current.offsetHeight;
      if (height > 0) {
        setMeasuredHeight(height);
      }
    }
  }, [isSticky, isOpen]);

  const lastScrollY = useRef(0);
  const formRef = useRef<HTMLDivElement>(null);
  const initialTop = useRef<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.mobileNumber ||
      !formData.pinCode ||
      !formData.consent
    ) {
      alert("Please fill all required fields and accept the consent.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await api.submitContractorForm({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        city: formData.city,
        pinCode: formData.pinCode,
        queryType: formData.queryType,
        message: formData.message,
        consent: formData.consent,
        sourceUrl: typeof window !== "undefined" ? window.location.href : "",
      });

      setFormSubmitted(true);
      setFormData({
        fullName: "",
        mobileNumber: "",
        city: "",
        pinCode: "",
        queryType: "",
        message: "",
        consent: false,
      });
      setDesktopQueryOpen(false);
      setMobileQueryOpen(false);
    } catch (err: any) {
      console.error("Contractor form submission error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to submit query. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (!formRef.current) return;

      if (initialTop.current === null && !isSticky) {
        const rect = formRef.current.getBoundingClientRect();
        if (rect.top > 96) {
          initialTop.current = rect.top + window.scrollY;
        }
      }

      const formTop = initialTop.current || 350;
      const stickyThreshold = formTop - 96;

      // Scrolling down and form has reached the top-24 point (96px)
      if (currentY > lastScrollY.current && currentY >= stickyThreshold) {
        setIsOpen(false);
        setIsSticky(true);
      }

      // Back to original position when scrolling up past the threshold
      if (currentY < stickyThreshold) {
        setIsSticky(false);
        setIsOpen(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSticky]);

  return (
    <>
      <div className="hidden relative xl:block w-full bg-white rounded-[20px] shadow-[4px_4px_12px_4px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between p-5 bg-linear-to-r from-[#FF0009] to-[#772571] text-white">
          <Title className="font-google-sans! font-medium pl-3 text-white">
            Reach out to Us
          </Title>
          <ShieldCheck className="w-8 h-8" strokeWidth={1} />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col px-8 py-6 space-y-1"
        >
          {formSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="text-[#772571] text-5xl font-bold">✓</div>
              <Title className="font-google-sans! font-semibold">Thank You!</Title>
              <Paragraph className="">
                Your query has been submitted successfully. Our team will
                contact you shortly.
              </Paragraph>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="mt-4 px-6 py-2 bg-linear-to-r from-[#FF0009] to-[#772571] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Send another query
              </button>
            </div>
          ) : (
            <>
              {/* Full Name */}
              <div className="flex flex-col border-b mt-1">
                <label className="text-base lg:text-xl">Full Name*</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
                />
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col border-b mt-1">
                <label className="text-base lg:text-xl">Mobile Number*</label>
                <input
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNumber: e.target.value })
                  }
                  className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
                />
              </div>

              {/* City & Pin Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col border-b mt-1">
                  <label className="text-base lg:text-xl">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col border-b mt-1">
                  <label className="text-base lg:text-xl">Pin Code*</label>
                  <input
                    type="text"
                    required
                    value={formData.pinCode}
                    onChange={(e) =>
                      setFormData({ ...formData, pinCode: e.target.value })
                    }
                    className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>

              {/* Type of Query */}
              <div
                className={`flex flex-col mt-1 relative ${desktopQueryOpen ? "" : "border-b"}`}
              >
                <label className="text-base lg:text-xl">Type of Query</label>
                <div
                  onClick={() => setDesktopQueryOpen(!desktopQueryOpen)}
                  className="flex items-center justify-between pb-1 cursor-pointer select-none"
                >
                  <span
                    className={`text-base pl-1.5 ${formData.queryType
                      ? "text-foreground"
                      : "text-foreground/60"
                      }`}
                  >
                    {formData.queryType
                      ? formData.queryType === "Product Range"
                        ? "Product Range Query"
                        : formData.queryType === "Contractor Connect App"
                          ? "Contractor Club App"
                          : formData.queryType === "Other"
                            ? "Other Query"
                            : formData.queryType
                      : "Select option"}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${desktopQueryOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>

                {desktopQueryOpen && (
                  <div className="flex flex-col w-full bg-surface py-2 z-20">
                    {[
                      { val: "Product Range", label: "Product Range Query" },
                      { val: "Dealer Enrolment", label: "Dealer Enrolment" },
                      {
                        val: "Contractor Connect App",
                        label: "Contractor Club App",
                      },
                      { val: "Other", label: "Other Query" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, queryType: opt.val });
                          setDesktopQueryOpen(false);
                        }}
                        className="cursor-pointer w-full text-left px-2 hover:font-semibold text-base text-black transition-colors"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col border-b mt-1">
                <label className="text-base lg:text-xl">Message</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none resize-none"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  required
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData({ ...formData, consent: e.target.checked })
                  }
                  className="mt-px w-4 h-4 text-[#772571] focus:ring-[#772571]"
                />
                <label
                  htmlFor="consent-checkbox"
                  className="text-sm select-none"
                >
                  I consent that Jivanjor can use this information to reach out
                  to me.
                </label>
              </div>

              {errorMessage && (
                <p className="text-sm font-medium text-red-600 pt-1">{errorMessage}</p>
              )}

              {/* Submit Button */}
              <div className="mt-0.5 text-center md:text-start">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-linear-to-r from-[#FF0009] to-[#772571] text-white py-2.5 rounded-full font-medium text-base md:text-lg hover:opacity-95 transition-opacity cursor-pointer shadow-md w-40 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      <div
        className="xl:hidden w-full transition-all duration-300"
        style={{ height: isSticky ? `${measuredHeight}px` : "auto" }}
      >
        <div
          ref={formRef}
          className={`xl:hidden max-w-md md:max-w-lg bg-white z-50 rounded-[20px] shadow-[4px_4px_12px_4px_rgba(0,0,0,0.1)] ${isSticky ? "fixed top-24 left-5 right-5 md:left-10 md:right-10 mx-auto" : "mx-5 md:mx-10 overflow-hidden"}`}
        >
          {/* Card Header */}
          <div
            className={`flex items-center justify-between px-5 py-4 transition-all duration-500 ease-in-out ${isOpen
              ? "bg-linear-to-r from-[#FF0009] to-[#772571] text-white rounded-t-[20px]"
              : "active-gradient-border rounded-[20px]"
              }`}
          >
            <Title className="font-google-sans! text-[24px] md:text-[30px] font-medium text-white">
              Reach out to Us
            </Title>
            <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
          </div>
          {/* Form Container */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen
              ? "max-h-200 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
              }`}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col px-8 py-6 space-y-1"
            >
              {formSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="text-[#772571] text-5xl font-bold">✓</div>
                  <Title className="font-google-sans! text-2xl font-semibold">Thank You!</Title>
                  <Paragraph className="">
                    Your query has been submitted successfully. Our team will
                    contact you shortly.
                  </Paragraph>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="mt-4 px-6 py-2 bg-linear-to-r from-[#FF0009] to-[#772571] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <>
                  {/* Full Name */}
                  <div className="flex flex-col border-b mt-1">
                    <label className="text-base lg:text-xl">Full Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="flex flex-col border-b mt-1">
                    <label className="text-base lg:text-xl">
                      Mobile Number*
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobileNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileNumber: e.target.value,
                        })
                      }
                      className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
                    />
                  </div>

                  {/* City & Pin Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col border-b mt-1">
                      <label className="text-base lg:text-xl">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col border-b mt-1">
                      <label className="text-base lg:text-xl">Pin Code*</label>
                      <input
                        type="text"
                        required
                        value={formData.pinCode}
                        onChange={(e) =>
                          setFormData({ ...formData, pinCode: e.target.value })
                        }
                        className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Type of Query */}
                  <div
                    className={`flex flex-col mt-1 relative ${mobileQueryOpen ? "" : "border-b"}`}
                  >
                    <label className="text-base lg:text-xl">
                      Type of Query
                    </label>
                    <div
                      onClick={() => setMobileQueryOpen(!mobileQueryOpen)}
                      className="flex items-center justify-between pb-1 cursor-pointer select-none"
                    >
                      <span
                        className={`text-base pl-1.5 ${formData.queryType
                          ? "text-foreground"
                          : "text-foreground/60"
                          }`}
                      >
                        {formData.queryType
                          ? formData.queryType === "Product Range"
                            ? "Product Range Query"
                            : formData.queryType === "Contractor Connect App"
                              ? "Contractor Club App"
                              : formData.queryType === "Other"
                                ? "Other Query"
                                : formData.queryType
                          : "Select option"}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${mobileQueryOpen ? "rotate-180" : ""
                          }`}
                      />
                    </div>

                    {mobileQueryOpen && (
                      <div className="flex flex-col w-full bg-surface py-2 z-20">
                        {[
                          {
                            val: "Product Range",
                            label: "Product Range Query",
                          },
                          {
                            val: "Dealer Enrolment",
                            label: "Dealer Enrolment",
                          },
                          {
                            val: "Contractor Connect App",
                            label: "Contractor Club App",
                          },
                          { val: "Other", label: "Other Query" },
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, queryType: opt.val });
                              setMobileQueryOpen(false);
                            }}
                            className="cursor-pointer w-full text-left px-2 hover:font-semibold text-base text-black transition-colors"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col border-b mt-1">
                    <label className="text-base lg:text-xl">Message</label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="consent-checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) =>
                        setFormData({ ...formData, consent: e.target.checked })
                      }
                      className="mt-px w-4 h-4 text-[#772571] focus:ring-[#772571]"
                    />
                    <label
                      htmlFor="consent-checkbox"
                      className="text-sm select-none"
                    >
                      I consent that Jivanjor can use this information to reach
                      out to me.
                    </label>
                  </div>

                  {errorMessage && (
                    <p className="text-sm font-medium text-red-600 pt-1">{errorMessage}</p>
                  )}

                  {/* Submit Button */}
                  <div className="mt-0.5 text-center md:text-start">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-linear-to-r from-[#FF0009] to-[#772571] text-white py-2.5 rounded-full font-medium text-base md:text-lg hover:opacity-95 transition-opacity cursor-pointer shadow-md w-40 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Reach() {
  return (
    <section className="relative max-w-360 mx-auto w-full px-5 lg:px-8 pt-5 lg:pt-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8">
          <ReachLeft />
        </div>

        {/* Right Column (Sticky Form) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start z-30">
          <ReachForm />
        </div>
      </div>
    </section>
  );
}
