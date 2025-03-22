import { redirect } from "next/navigation";

export default function Home() {
  redirect("/homePage"); // ✅ เปลี่ยนเป็น path ที่คุณต้องการ
}
