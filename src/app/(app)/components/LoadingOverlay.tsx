import Image from "next/image";

const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-30 h-30 rounded-3xl bg-white flex items-center justify-center">
        <Image alt="Loading" src={"/assets/omnikasir.svg"} width={30} height={30} className="animate-bounce pt-3" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
