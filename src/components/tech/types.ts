export type TechItem = {
  name: string;
  slug: string;
};

export type IconifyLogoIcon = {
  width: number;
  height: number;
  body: string;
};

export type AboutCard =
  | { title: string; text: string; span: number }
  | { title: string; description: string; tech: TechItem[]; span: number };
