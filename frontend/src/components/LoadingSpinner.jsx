const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-2 border-emerald-200" />
        <div className="absolute top-0 left-0 h-20 w-20 animate-spin rounded-full border-t-2 border-emerald-500" />
        <div className="sr-only">Loading</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
