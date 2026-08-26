"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ShieldCheck, Loader2, MapPin } from "lucide-react";
import { Title, Paragraph } from "@/components/ui";
import { lookupPinCode } from "@/lib/pincodes";
import { api } from "@/lib/api";

export interface ContactFormProps {
  defaultQueryType?: string;
  formType?: "CONTACT" | "DEALER" | "CONTRACTOR";
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  isSticky?: boolean;
  setIsSticky?: (isSticky: boolean) => void;
}

const QUERY_OPTIONS = [
  { val: "Product Range", label: "Product Range Query" },
  { val: "Dealer Enrolment", label: "Dealer Inquiry" },
  { val: "Contractor Connect App", label: "Contractor Club App" },
  { val: "Other", label: "Other Query" },
];

export default function ContactForm({
  defaultQueryType = "",
  formType = "CONTACT",
  isOpen: propIsOpen,
  setIsOpen: propSetIsOpen,
  isSticky: propIsSticky,
  setIsSticky: propSetIsSticky,
}: ContactFormProps = {}) {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    pinCode: "",
    city: "",
    state: "",
    queryType: defaultQueryType,
    message: "",
    consent: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [localIsOpen, setLocalIsOpen] = useState(true);
  const [localIsSticky, setLocalIsSticky] = useState(false);

  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
  const setIsOpen = propSetIsOpen !== undefined ? propSetIsOpen : setLocalIsOpen;
  const isSticky = propIsSticky !== undefined ? propIsSticky : localIsSticky;
  const setIsSticky = propSetIsSticky !== undefined ? propSetIsSticky : setLocalIsSticky;

  const [desktopQueryOpen, setDesktopQueryOpen] = useState(false);
  const [mobileQueryOpen, setMobileQueryOpen] = useState(false);

  const lastScrollY = useRef(0);
  const formRef = useRef<HTMLDivElement>(null);
  const initialTop = useRef<number | null>(null);

  // Sync defaultQueryType if prop changes
  useEffect(() => {
    if (defaultQueryType && !formData.queryType) {
      setFormData((prev) => ({ ...prev, queryType: defaultQueryType }));
    }
  }, [defaultQueryType, formData.queryType]);

  const handlePinCodeChange = async (val: string) => {
    const cleanVal = val.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pinCode: cleanVal }));

    if (cleanVal.length === 6) {
      const location = await lookupPinCode(cleanVal);
      if (location) {
        setFormData((prev) => ({
          ...prev,
          city: location.city,
          state: location.state,
        }));
      }
    } else if (formData.city || formData.state) {
      setFormData((prev) => ({ ...prev, city: "", state: "" }));
    }
  };

  const getQueryTypeDisplayLabel = (val: string) => {
    const found = QUERY_OPTIONS.find((opt) => opt.val === val);
    return found ? found.label : val || "Select Option";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      alert("Please enter your Full Name.");
      return;
    }
    if (!formData.mobileNumber.trim()) {
      alert("Please enter your Mobile Number.");
      return;
    }
    if (!formData.pinCode || formData.pinCode.length !== 6) {
      alert("Please enter a valid 6-digit PIN Code.");
      return;
    }
    if (!formData.consent) {
      alert("Please accept the consent checkbox to proceed.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        fullName: formData.fullName,
        firmName: "", // Firm name removed from UI as requested
        mobileNumber: formData.mobileNumber,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        queryType: formData.queryType,
        message: formData.message,
        consent: formData.consent,
        sourceUrl: typeof window !== "undefined" ? window.location.href : "",
      };

      if (formType === "DEALER") {
        await api.submitDealerForm({
          ...payload,
          interestedIn: formData.queryType || "Dealer Enrolment",
        });
      } else if (formType === "CONTRACTOR") {
        await api.submitContractorForm(payload);
      } else {
        await api.submitContactForm(payload);
      }

      setFormSubmitted(true);
      setFormData({
        fullName: "",
        mobileNumber: "",
        pinCode: "",
        city: "",
        state: "",
        queryType: defaultQueryType,
        message: "",
        consent: false,
      });
      setDesktopQueryOpen(false);
      setMobileQueryOpen(false);
    } catch (err: any) {
      console.error("Form submission error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit query. Please try again.";
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

      if (currentY > lastScrollY.current && currentY >= stickyThreshold) {
        setIsOpen(false);
        setIsSticky(true);
      }

      if (currentY < stickyThreshold) {
        setIsSticky(false);
        setIsOpen(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSticky, setIsOpen, setIsSticky]);

  const renderFormFields = (isMobile: boolean) => (
    <>
      {/* Full Name */}
      <div className="flex flex-col border-b mt-1">
        <label>Full Name*</label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Mobile Number */}
      <div className="flex flex-col border-b mt-1">
        <label>Mobile Number*</label>
        <input
          type="tel"
          required
          value={formData.mobileNumber}
          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
          className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
        />
      </div>

      {/* PIN Code (Mandatory, City removed from UI but auto-populated) */}
      <div className="flex flex-col border-b mt-1">
        <div className="flex items-center justify-between">
          <label>PIN Code*</label>
          {formData.city && (
            <span className="text-[11px] font-semibold text-[#772571] flex items-center gap-1">
              <MapPin className="w-3 h-3 inline" />
              {formData.city}{formData.state ? `, ${formData.state}` : ""}
            </span>
          )}
        </div>
        <input
          type="text"
          required
          maxLength={6}
          placeholder="e.g. 110001"
          value={formData.pinCode}
          onChange={(e) => handlePinCodeChange(e.target.value)}
          className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Type of Query */}
      <div
        className={`flex flex-col mt-1.5 relative ${(isMobile ? mobileQueryOpen : desktopQueryOpen) ? "" : "border-b"
          }`}
      >
        <label>Type of Query</label>
        <div
          onClick={() => {
            if (isMobile) {
              setMobileQueryOpen(!mobileQueryOpen);
            } else {
              setDesktopQueryOpen(!desktopQueryOpen);
            }
          }}
          className="flex items-center justify-between pb-1 cursor-pointer select-none"
        >
          <span
            className={`text-base pl-1 ${formData.queryType ? "text-foreground" : "text-foreground/60"
              }`}
          >
            {formData.queryType
              ? getQueryTypeDisplayLabel(formData.queryType)
              : "Select Option"}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${(isMobile ? mobileQueryOpen : desktopQueryOpen) ? "rotate-180" : ""
              }`}
          />
        </div>

        {(isMobile ? mobileQueryOpen : desktopQueryOpen) && (
          <div className="flex flex-col w-full bg-surface py-2 z-20">
            {QUERY_OPTIONS.map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, queryType: opt.val });
                  if (isMobile) {
                    setMobileQueryOpen(false);
                  } else {
                    setDesktopQueryOpen(false);
                  }
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
        <label>Message</label>
        <textarea
          rows={2}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-transparent border-0 p-0 text-foreground text-base focus:ring-0 focus:outline-none resize-none"
        />
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-2.5 pt-2">
        <input
          type="checkbox"
          id={`consent-checkbox-${isMobile ? "mobile" : "desktop"}`}
          required
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          className="mt-px w-4 h-4 text-[#772571] focus:ring-[#772571]"
        />
        <label
          htmlFor={`consent-checkbox-${isMobile ? "mobile" : "desktop"}`}
          className="text-sm select-none"
        >
          I consent that Jivanjor can use this information to reach out to me.
        </label>
      </div>

      {errorMessage && (
        <p className="text-sm font-medium text-red-600 pt-1">{errorMessage}</p>
      )}

      {/* Submit Button */}
      <div className="mt-2 text-center md:text-start">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-linear-to-r from-[#FF0009] to-[#772571] text-white py-2 rounded-full font-medium hover:opacity-95 transition-opacity cursor-pointer shadow-md min-w-40 w-40 flex items-center justify-center gap-2 disabled:opacity-60"
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
  );

  return (
    <>
      {/* Desktop Container */}
      <div className="hidden relative lg:block w-full max-w-2xl bg-white rounded-[20px] shadow-[4px_4px_12px_4px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between p-5 bg-linear-to-r from-[#FF0009] to-[#772571] text-white">
          <Title className="font-google-sans! font-medium pl-3 text-white">
            Reach out to Us
          </Title>
          <ShieldCheck className="w-8 h-8" strokeWidth={1} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col px-8 py-6 space-y-2">
          {formSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="text-[#772571] text-5xl font-bold">✓</div>
              <Title className="font-google-sans! font-semibold">Thank You!</Title>
              <Paragraph className="">
                Your query has been submitted successfully. Our team will contact you shortly.
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
            renderFormFields(false)
          )}
        </form>
      </div>

      {/* Mobile Sticky Drawer Container */}
      <div
        className="lg:hidden w-full transition-all duration-300"
        style={{ height: isSticky ? "60px" : "auto" }}
      >
        <div
          ref={formRef}
          className={`lg:hidden max-w-md md:max-w-lg bg-white z-50 rounded-[20px] shadow-[4px_4px_12px_4px_rgba(0,0,0,0.1)] ${isSticky
            ? "fixed top-24 left-5 right-5 md:left-10 md:right-10 mx-auto"
            : "mx-5 md:mx-10 overflow-hidden"
            }`}
        >
          {/* Card Header */}
          <div
            className={`flex items-center justify-between px-5 py-4 transition-all duration-500 ease-in-out ${isOpen
              ? "bg-linear-to-r from-[#FF0009] to-[#772571] text-white rounded-t-[20px]"
              : "active-gradient-border rounded-[20px]"
              }`}
          >
            <Title
              className={`font-google-sans! font-medium ${isSticky ? "text-black" : "text-white"
                }`}
            >
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
            <form onSubmit={handleSubmit} className="flex flex-col px-8 py-6 space-y-2">
              {formSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="text-[#772571] text-5xl font-bold">✓</div>
                  <Title className="font-google-sans! text-2xl font-semibold">
                    Thank You!
                  </Title>
                  <Paragraph className="">
                    Your query has been submitted successfully. Our team will contact you shortly.
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
                renderFormFields(true)
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
