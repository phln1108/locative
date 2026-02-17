import type React from "react"


interface Props extends React.ComponentProps<"button">{
    icon: React.ReactElement
}

export default function OtherLoginButton({icon, ...props}: Props) {
    return (
        <button
            {...props} 
            className="h-14 border border-border rounded-xl bg-card hover:bg-muted/50 transition-colors flex items-center justify-center disabled:opacity-50 flex-1 cursor-pointer">
            {icon}
        </button>
    )
}