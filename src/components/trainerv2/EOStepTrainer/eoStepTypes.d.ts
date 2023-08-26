export type EOStep =
  | "EO"
  | "EOLine"
  | "EOCross"
  | "EOArrowBack"
  | "EOArrowLeft"
  | "EO222";

export interface EOStepOptions {
  eoStep: EOStep;
}
