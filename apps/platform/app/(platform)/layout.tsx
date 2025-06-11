function LargeScreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden lg:block rounded-lg bg-platform-background h-full overflow-auto">

      {children}
    </div>
  );
}

function SmallScreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="block lg:hidden bg-platform-background h-full gap-4">
      <div className="h-full pb-2">{children}</div>
    </div>
  );
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full bg-background lg:px-4 lg:py-2 flex flex-col">
      {/* Start of Large Screens and above -----------------------------------*/}
      <LargeScreenLayout>{children}</LargeScreenLayout>
      {/* End of Large Screens and above -------------------------------------*/}

      {/* Start of Small Screens and below -----------------------------------*/}
      <SmallScreenLayout>{children}</SmallScreenLayout>
      {/* End of Small Screens and below -------------------------------------*/}
    </div>
  );
}
