import logoLulu from '../assets/logo-lulu.png';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#2564eb27] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-8">
        <img
          src={logoLulu}
          alt="Lulu"
          className="w-24 h-24 animate-pulse invert"
        />
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};
