interface ContentProps {
  data?: {
    text?: string;
  };
}

const defaultText = `Bubbles in laminate applications rarely happen by chance; they are the direct result of trapped air or moisture expanding beneath the surface. When pressing decorative laminates onto MDF or commercial ply, microscopic pockets of air can become trapped if the adhesive is spread unevenly.

In standard environments, a high-quality adhesive can sometimes absorb minor imperfections. However, when working in environments with fluctuating temperatures, the air within these trapped pockets expands, creating enough upward pressure to lift the laminate from the substrate, resulting in visible bubbles.

How Humidity Affects Curing Time

Wood and laminates are hygroscopic, meaning they naturally absorb and release moisture based on the surrounding environment. During monsoon seasons or in coastal regions, the moisture content in commercial plywood can spike significantly. When a water-based synthetic resin (PVA) is applied to damp wood, the curing process slows down.

The water within the adhesive takes longer to evaporate, extending the open time but weakening the initial grab. If pressure is released too early, the laminate can shift or lift, allowing air to enter the joint before the bond reaches its full structural integrity.

Three Application Rules for Flawless Laminates

To achieve a perfectly flat, secure bond on every project, contractors should standardize the following practices:

- Substrate Acclimatization: Never apply laminates to plywood that has just been brought in from the rain or high humidity. Allow both the substrate and the laminate to acclimatize in the working environment for at least 24 to 48 hours before bonding.
- The Right Spread Rate: Using a finely notched trowel is non-negotiable. A notched trowel ensures an even, consistent film of adhesive. Applying too much glue "just to be safe" actually increases the risk of bubbling, as excess moisture becomes trapped under the impermeable laminate.
- Center-to-Edge Pressing: Once the laminate is placed, use a J-roller or a firm block. Always apply heavy pressure starting from the absolute center of the board and work your way outward to the edges. This systematically forces any trapped air out before the edges are sealed.

The Role of Adhesive Formulation

Technique can only take you so far; the chemical makeup of your adhesive dictates your margin of error.

For high-stakes decorative surfaces, professionals should rely on specialist formulations rather than generic woodworking glues. Products like Jivanjor Lamino are specifically engineered with anti-bubble technology and water-resistant properties. Its specific viscosity prevents the easy entrapment of air during the spreading process, ensuring a smooth, premium finish every time.

For projects requiring rapid turnarounds without sacrificing coverage, stepping up to Jivanjor Supremo ensures a high-strength bond that sets rapidly, mitigating the risks associated with extended curing times in unpredictable weather.`;

export default function Content({ data }: ContentProps = {}) {
  const text = data?.text || defaultText;
  const isHtml = /<[a-z][\s\S]*>/i.test(text.trim());

  if (isHtml) {
    return (
      <section className="relative max-w-360 mx-auto w-full h-full px-5 py-4 md:p-6.5 mb-16 lg:mb-20">
        <div
          className="flex flex-col justify-center max-w-87 md:max-w-307 text-[#222] prose-content"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </section>
    );
  }

  const paragraphs = text.split("\n\n").map(p => p.trim()).filter(Boolean);

  return (
    <section className="relative max-w-360 mx-auto w-full h-full px-5 py-4 md:p-6.5 mb-16 lg:mb-20">
      <div className="flex flex-col justify-center max-w-87 md:max-w-307 gap-5 text-[#222]">
        {paragraphs.map((p, idx) => {
          const isHeading = p.length < 100 && !p.includes(".") && !p.startsWith("-") && !p.startsWith("•");
          if (isHeading) {
            return (
              <h2 key={idx} className="font-amethysta text-[28px] md:text-[36px] mt-4">
                {p}
              </h2>
            );
          }
          if (p.startsWith("-") || p.startsWith("•")) {
            const listItems = p.split("\n").map(li => li.replace(/^[-•]\s*/, ""));
            return (
              <ul key={idx} className="list-disc pl-6 md:pl-8 text-lg md:text-[22px] leading-normal space-y-2">
                {listItems.map((li, lIdx) => (
                  <li key={lIdx}>{li}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-lg md:text-[22px] whitespace-pre-line leading-relaxed">
              {p}
            </p>
          );
        })}
      </div>
    </section>
  );
}
