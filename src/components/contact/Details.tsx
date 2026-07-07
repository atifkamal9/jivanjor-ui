import { Phone, Mail, Clock, MapPin } from "lucide-react";

const contactSections = [
  {
    title: "Customer Support",
    details: [
      {
        label: "Phone",
        value: "1800-XXX-XXX",
        icon: <Phone className="w-6 h-6 text-black shrink-0" strokeWidth={1} />,
      },
      {
        label: "Email",
        value: "support@jivanjor.com",
        icon: <Mail className="w-6 h-6 text-black shrink-0" strokeWidth={1} />,
      },
      {
        label: "Hours",
        value: "Mon-Sat, 9:00 AM – 6:00 PM",
        icon: <Clock className="w-6 h-6 text-black shrink-0" strokeWidth={1} />,
      },
    ],
  },
  {
    title: "Corporate Headquarters",
    details: [
      {
        label: "Address",
        value: "1234, Address Street",
        icon: (
          <MapPin className="w-6 h-6 text-black shrink-0" strokeWidth={1} />
        ),
      },
      {
        label: "Hours",
        value: "Mon-Sat, 9:00 AM – 6:00 PM",
        icon: <Clock className="w-6 h-6 text-black shrink-0" strokeWidth={1} />,
      },
    ],
  },
];

export default function Details() {
  return (
    <section className="flex flex-col items-center lg:items-start text-center lg:text-start max-w-4xl px-5 space-y-5 text-[#222]">
      {/* Title */}
      <h2 className="font-amethysta text-[34px] sm:text-4xl lg:text-[48px]">
        We are always happy to assist you.
      </h2>
      <main className="flex flex-col my-6 gap-8">
        {contactSections.map((section, idx) => (
          <div key={idx} className="flex flex-col space-y-4">
            <p className="font-bold text-xl lg:text-2xl text-left">
              {section.title}
            </p>
            <div className="flex flex-col gap-4">
              {section.details.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex items-start text-lg lg:text-2xl"
                >
                  {/* Icon */}
                  <div className="mr-4 mt-1 shrink-0 w-6.5 h-6.5 flex items-center justify-center">
                    {item.icon}
                  </div>
                  {/* Label & Value Container */}
                  <div className="flex flex-row flex-1 text-left">
                    <span className="w-24 sm:w-32 lg:w-36 font-normal shrink-0">
                      {item.label}
                    </span>
                    <span className="flex-1 font-normal">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </section>
  );
}
