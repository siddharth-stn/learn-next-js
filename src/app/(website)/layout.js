import CommonLayout from "@/components/website/CommonLayout";
import "@/styles/website.css"

export const metadata = {
  title: "Website",
  description: "Website section",
};

export default function WebsiteLayout({ children }) {
  return (
    <CommonLayout>
      {children}
    </CommonLayout>
  );
}
