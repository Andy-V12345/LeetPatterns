function Skeleton({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={className + " skeleton"}
      {...props}
    >
      {children}
    </div>
  )
}

export { Skeleton }
