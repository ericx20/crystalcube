export interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "3x3",
    href: "3x3/",
  },
  // {
  //   label: "trainer",
  //   href: "trainer/",
  // },
  // {
  //   label: "tools",
  //   children: [
  //     {
  //       label: "one handed scrambles",
  //       href: "tools/ohscramble/",
  //     },
  //   ],
  // },
];

export default NAV_ITEMS;
