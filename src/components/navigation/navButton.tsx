import type { ReactNode } from "react"

interface NavButtonProps {
    icon: ReactNode
    selected?: boolean
    title: string
    onclick?: () => void
}

const NavButton = ({
    icon,
    selected,
    title,
    onclick,
}: NavButtonProps) => {
    return (
        <div className={`${selected ? "bg-sky-600/10" : ""} flex-1 hover:bg-sky-900/15 px-2 py-1 rounded-2xl flex flex-col justify-center items-center gap-1 cursor-pointer`} 
        onClick={
            onclick
        }>
            {icon}
            <div className="text-xs font-semibold leading-4">{title}</div>
        </div>
    )
}

export default NavButton