'use client'

import { useId, useState } from 'react'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


interface InputPasswordProps extends React.ComponentProps<"input"> {
  title: string

}

export default function InputLogin({
  title,
  ...props
}: InputPasswordProps) {
  const [isVisible, setIsVisible] = useState(false)

  const id = useId()

  return (
    <div className="w-full flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium leading-none">
        {title}
      </Label>
      <div className="relative flex h-14 w-full items-center rounded-xl border border-border bg-background px-4 py-1 focus-within:ring-2 focus-within:ring-focus-ring focus-within:ring-offset-background">
        <Input
          id={id}
          type={props.type !== "password" || isVisible ? "text" : "password"}
          placeholder={props.placeholder}
          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {props.type === "password" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible((prev) => !prev)}
            className="ml-2 text-muted-foreground hover:bg-transparent"
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        )}
      </div>
    </div>
  )

}

