export interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "trainer",
    href: "train/",
    children: [
      {
        label: "CFOP cross trainer",
        href: "train/cross",
      },
      {
        label: "ZZ EO trainer",
        href: "train/eo",
      },
    ],
  },
  {
    label: "tools",
    children: [
      {
        label: "one handed scrambles",
        href: "tools/ohscramble/",
      },
    ],
  },
];

export default NAV_ITEMS;
