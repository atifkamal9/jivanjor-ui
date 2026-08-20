export interface IconOption {
  label: string;
  value: string;
}

export const ALL_ICON_OPTIONS: IconOption[] = [
  { label: "ICON-01.svg", value: "ICON-01.svg" },
  { label: "ICON-02.svg", value: "ICON-02.svg" },
  { label: "ICON-03.svg", value: "ICON-03.svg" },
  { label: "ICON-04.svg", value: "ICON-04.svg" },
  { label: "ICON-05.svg", value: "ICON-05.svg" },
  { label: "ICON-06.svg", value: "ICON-06.svg" },
  { label: "ICON-07.svg", value: "ICON-07.svg" },
  { label: "ICON-08.svg", value: "ICON-08.svg" },
  { label: "ICON-09.svg", value: "ICON-09.svg" },
  { label: "ICON-10.svg", value: "ICON-10.svg" },
  { label: "ICON-11.svg", value: "ICON-11.svg" },
  { label: "ICON-12.svg", value: "ICON-12.svg" },
  { label: "ICON-13.svg", value: "ICON-13.svg" },
  { label: "ICON-14.svg", value: "ICON-14.svg" },
  { label: "ICON-15.svg", value: "ICON-15.svg" },
  { label: "ICON-16.svg", value: "ICON-16.svg" },
  { label: "ICON-17.svg", value: "ICON-17.svg" },
  { label: "ICON-18.svg", value: "ICON-18.svg" },
  { label: "ICON-19.svg", value: "ICON-19.svg" },
  { label: "ICON-20.svg", value: "ICON-20.svg" },
  { label: "ICON-21.svg", value: "ICON-21.svg" },
  { label: "ICON-22.svg", value: "ICON-22.svg" },
  { label: "ICON-23.svg", value: "ICON-23.svg" },
  { label: "ICON-24.svg", value: "ICON-24.svg" },
  { label: "ICON-25.svg", value: "ICON-25.svg" },
  { label: "ICON-26.svg", value: "ICON-26.svg" },
  { label: "ICON-27.svg", value: "ICON-27.svg" },
  { label: "ICON-28.svg", value: "ICON-28.svg" },
  { label: "ICON-29.svg", value: "ICON-29.svg" },
  { label: "ICON-30.svg", value: "ICON-30.svg" },
  { label: "image 18.svg", value: "image 18.svg" },
  { label: "image 19.svg", value: "image 19.svg" },
  { label: "image 20.svg", value: "image 20.svg" },
  { label: "Cycle-arrow.svg", value: "Cycle-arrow.svg" },
  { label: "Circles-seven.svg", value: "Circles-seven.svg" },
  { label: "Texture.svg", value: "Texture.svg" },
  { label: "Asterisk.svg", value: "Asterisk.svg" },
  { label: "Blocks-and-arrows.svg", value: "Blocks-and-arrows.svg" },
  { label: "File-question.svg", value: "File-question.svg" },
  { label: "Star.svg", value: "Star.svg" },
  { label: "Table-report.svg", value: "Table-report.svg" },
  { label: "overview.svg", value: "overview.svg" },
  { label: "badge.svg", value: "badge.svg" },
  { label: "home.svg", value: "home.svg" },
  { label: "chair.png", value: "chair.png" },
  { label: "cabinet.png", value: "cabinet.png" },
  { label: "woodfloor.png", value: "woodfloor.png" },
  { label: "wooden plank.png", value: "wooden plank.png" },
  { label: "checklist.png", value: "checklist.png" },
  { label: "house.png", value: "house.png" },
];

export const ALL_ICON_OPTIONS_WITH_PATH: IconOption[] = ALL_ICON_OPTIONS.map((opt) => ({
  label: opt.label,
  value: opt.value.startsWith("/") ? opt.value : `/icons/${opt.value}`,
}));

export const ABOUT_ICONS: IconOption[] = [
  { label: "Ad-product.svg", value: "/images/about/Ad-product.svg" },
  { label: "Spanner.svg", value: "/images/about/Spanner.svg" },
  { label: "Positive-dynamics.svg", value: "/images/about/Positive-dynamics.svg" },
  { label: "variants.svg", value: "/images/about/variants.svg" },
  { label: "distribution.svg", value: "/images/about/distribution.svg" },
  { label: "professionals.svg", value: "/images/about/professionals.svg" },
  { label: "Leaves.svg", value: "/images/about/Leaves.svg" },
  { label: "presence.svg", value: "/images/about/presence.svg" },
  { label: "dealers.svg", value: "/images/about/dealers.svg" },
  { label: "facilities.svg", value: "/images/about/facilities.svg" },
];

export const ALL_PREDEFINED_ICONS: IconOption[] = [
  ...ALL_ICON_OPTIONS_WITH_PATH,
  ...ABOUT_ICONS,
];
