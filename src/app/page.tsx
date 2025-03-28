import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
   <div className="flext flex-col gap-2 bg-gray-100 min-h-screen">
    <Navbar/>
   </div>
  )
}
