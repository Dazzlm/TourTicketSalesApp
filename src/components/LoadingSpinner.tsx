import { Loader } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-30 flex-col gap-4">
      <Loader className="animate-spin w-12 h-12 text-blue-500" />
      <p className="text-gray-500">Cargando...</p>
    </div>
  );
};

export default LoadingSpinner;
