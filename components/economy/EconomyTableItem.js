import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib/utils"

export default function EconomyTableItem ({ label, value, icon }) {
    return (
    <div className={"py-[2rem] bg-zinc-800 rounded-flg items-center px-8 flex gap-8 w-full whitespace-nowrap"}>
      <abbr title={label}>
        <FontAwesomeIcon icon={icon} className="text-4xl text-zinc-100" />
      </abbr>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-zinc-200">{label}</span>
        <span className="text-xl font-semibold text-zinc-200">{value}</span>
      </div>
    </div>
    )
};
  