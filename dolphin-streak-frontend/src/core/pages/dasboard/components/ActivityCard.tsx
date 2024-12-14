// import { motion } from "framer-motion";
import Link from "next/link";
import { ActivityCardProps } from "../types";

export function ActivityCard({ title, icon, description, link }: ActivityCardProps) {
    return (
        <Link href={link}>
            <div
                // whileHover={{y: -5}}
                className="bg-[#1B2335] rounded-xl p-6 text-center hover:bg-[#5AB9EA] 
                          transition-colors duration-300 cursor-pointer h-full shadow-md hover:shadow-lg"
            >
                <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
                <div className="w-16 h-16 mx-auto mb-4">
                    <img src={icon} alt={title} className="w-full h-full object-contain" />
                </div>
                <p className="text-gray-300">{description}</p>
            </div>
        </Link>
    );
}
