import { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Magic Lips — Our Story",
};

export default function AboutPage() {
  return <AboutContent />;
}
