"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    firmName: "",
    mobileNumber: "",
    city: "",
    pinCode: "",
    queryType: "",
    message: "",
    consent: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [desktopQueryOpen, setDesktopQueryOpen] = useState(false);
  const [mobileQueryOpen, setMobileQueryOpen] = useState(false);

  const lastScrollY = useRef(0);
  const formRef = useRef<HTMLDivElement>(null);
  const initialTop = useRef<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
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
    // Simulate submission
    setFormSubmitted(true);
    setFormData({
      fullName: "",
      firmName: "",
      mobileNumber: "",
      city: "",
      pinCode: "",
      queryType: "",
      message: "",
      consent: false,
    });
    setDesktopQueryOpen(false);
    setMobileQueryOpen(false);
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
      <div className="hidden relative lg:block w-full max-w-2xl bg-white rounded-[20px] shadow-[4px_4px_12px_4px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between p-5 bg-linear-to-r from-[#FF0009] to-[#772571] text-white">
          <h3 className="text-[24px] md:text-[30px] font-medium pl-3">
            Reach out to Us
          </h3>
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
              <h4 className="text-2xl font-semibold">Thank You!</h4>
              <p className="">
                Your query has been submitted successfully. Our team will
                contact you shortly.
              </p>
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
              {/* Firm Name */}
              <div className="flex flex-col border-b mt-1">
                <label className="text-base lg:text-xl">Firm Name*</label>
                <input
                  type="text"
                  required
                  value={formData.firmName}
                  onChange={(e) =>
                    setFormData({ ...formData, firmName: e.target.value })
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
                    className={`text-base pl-1.5 ${
                      formData.queryType
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
                      : "Select"}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      desktopQueryOpen ? "rotate-180" : ""
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

              {/* Submit Button */}
              <div className="mt-1.5 text-center md:text-start">
                <button
                  type="submit"
                  className="bg-linear-to-r from-[#FF0009] to-[#772571] text-white py-2 rounded-full font-medium text-base md:text-lg hover:opacity-95 transition-opacity cursor-pointer shadow-md min-w-60 w-40"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      <div
        className="lg:hidden w-full transition-all duration-300"
        style={{ height: isSticky ? "60px" : "auto" }}
      >
        <div
          ref={formRef}
          className={`lg:hidden max-w-md md:max-w-lg bg-white z-50 rounded-[20px] shadow-[4px_4px_12px_4px_rgba(0,0,0,0.1)] ${isSticky ? "fixed top-24 left-5 right-5 md:left-10 md:right-10 mx-auto" : "mx-5 md:mx-10 overflow-hidden"}`}
        >
          {/* Card Header */}
          <div
            className={`flex items-center justify-between px-5 py-4 transition-all duration-500 ease-in-out ${
              isOpen
                ? "bg-linear-to-r from-[#FF0009] to-[#772571] text-white rounded-t-[20px]"
                : "active-gradient-border rounded-[20px]"
            }`}
          >
            <h3 className="text-[24px] md:text-[30px] font-medium">
              Reach out to Us
            </h3>
            <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
          </div>
          {/* Form Container with Smooth Height Transition */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isOpen
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
                  <h4 className="text-2xl font-semibold">Thank You!</h4>
                  <p className="">
                    Your query has been submitted successfully. Our team will
                    contact you shortly.
                  </p>
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

                  {/* Firm Name */}
                  <div className="flex flex-col border-b mt-1">
                    <label className="text-base lg:text-xl">Firm Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.firmName}
                      onChange={(e) =>
                        setFormData({ ...formData, firmName: e.target.value })
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
                        className={`text-base pl-1.5 ${
                          formData.queryType
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
                          : "Select"}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          mobileQueryOpen ? "rotate-180" : ""
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

                  {/* Submit Button */}
                  <div className="mt-0.5 text-center md:text-start">
                    <button
                      type="submit"
                      className="bg-linear-to-r from-[#FF0009] to-[#772571] text-white py-2 rounded-full font-medium text-base md:text-lg hover:opacity-95 transition-opacity cursor-pointer shadow-md w-40"
                    >
                      Submit
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
