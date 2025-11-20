import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';

const QRSuccess = () => {
  const [searchParams] = useSearchParams();
  const qr = searchParams.get('qr');

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // ESTA ES LA URL que tendrá la mascota
  const petUrl = qr ? `${window.location.origin}/pet/${qr}` : null;

  useEffect(() => {
    if (!petUrl) return;

    qrCode.current = new QRCodeStyling({
      width: 300,
      height: 300,
      data: petUrl,
      dotsOptions: {
        color: '#000',
        type: 'rounded',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 8,
      },
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = ''; // limpia antes de insertar
      qrCode.current.append(qrRef.current);
    }
  }, [petUrl]);

  // Descargar QR
  const handleDownload = () => {
    qrCode.current?.download({
      name: 'pet_qr',
      extension: 'png',
    });
  };

  // 🔥 AHORA sí puedes hacer el return condicional DESPUÉS de los hooks
  if (!qr) {
    return <p>Error: No se recibió el código QR.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-8">
      <div className="text-center">
        <h2>QR generado exitosamente</h2>
        <p>Escanea este código o descárgalo para colocarlo en el collar.</p>
      </div>

      <div ref={qrRef} />

      <Button onClick={handleDownload}>Descargar QR</Button>
    </div>
  );

  // <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-12">
  //   <div className="mx-auto max-w-2xl">
  //     <div className="mb-8 text-center">
  //       <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
  //         <Check className="h-8 w-8 text-green-600" />
  //       </div>
  //       <h1 className="text-4xl font-bold text-gray-900">
  //         ¡Mascota registrada!
  //       </h1>
  //       <p className="mt-2 text-lg text-gray-600">
  //         ASDASDASD ahora está protegido con su código QR exclusivo
  //       </p>
  //     </div>

  //     <Card className="overflow-hidden border-2 border-blue-200 shadow-xl">
  //       <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8">
  //         <div className="mb-4 text-center">
  //           <h2 className="text-xl font-semibold text-white">ASDASDASD</h2>
  //           <p className="text-blue-100">ASDASDASD ASDASDASDASD</p>
  //         </div>

  //         <div className="flex justify-center">
  //           <div className="rounded-lg border-4 border-white bg-white p-4 shadow-lg">
  //             <svg
  //               viewBox="0 0 300 300"
  //               className="h-48 w-48"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               ASDASDASD
  //               <image
  //                 href={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Crect fill='white' width='300' height='300'/%3E%3Crect fill='%23000' x='0' y='0' width='30' height='30'/%3E%3Crect fill='%23000' x='270' y='0' width='30' height='30'/%3E%3Crect fill='%23000' x='0' y='270' width='30' height='30'/%3E%3Ccircle cx='150' cy='150' r='40' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E`}
  //                 x="0"
  //                 y="0"
  //                 width="300"
  //                 height="300"
  //               />
  //             </svg>
  //           </div>
  //         </div>

  //         <div className="mt-6 rounded-lg bg-white bg-opacity-10 p-4 backdrop-blur">
  //           <p className="text-center text-sm text-blue-50">
  //             ID único: <span className="font-mono font-bold">ASDASD</span>
  //           </p>
  //         </div>
  //       </div>

  //       <div className="space-y-6 p-8">
  //         <div>
  //           <h3 className="mb-4 text-lg font-semibold text-gray-900">
  //             Descargar código QR
  //           </h3>
  //           <div className="mb-4 flex gap-2">
  //             <label className="flex items-center">
  //               <input type="radio" value="png" className="mr-2 h-4 w-4" />
  //               <span className="text-sm text-gray-700">PNG</span>
  //             </label>
  //             <label className="flex items-center">
  //               <input type="radio" value="pdf" className="mr-2 h-4 w-4" />
  //               <span className="text-sm text-gray-700">PDF</span>
  //             </label>
  //           </div>
  //           <Button className="w-full" size="lg">
  //             <Download className="mr-2 h-5 w-5" />
  //             Descargar QR
  //           </Button>
  //         </div>

  //         <div className="border-t border-gray-200 pt-6">
  //           <h3 className="mb-4 text-lg font-semibold text-gray-900">
  //             Compartir perfil
  //           </h3>
  //           <div className="mb-4 flex items-center rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
  //             <code className="flex-1 break-all text-sm text-gray-600"></code>
  //             <button className="ml-2 rounded-lg bg-blue-100 p-2 text-blue-600 transition-colors hover:bg-blue-200">
  //               <Check className="h-5 w-5" />
  //               <Copy className="h-5 w-5" />
  //             </button>
  //           </div>
  //           <Button variant="outline" className="w-full" size="lg">
  //             <Share2 className="mr-2 h-5 w-5" />
  //             Compartir en redes
  //           </Button>
  //         </div>

  //         <div className="border-t border-gray-200 pt-6">
  //           <h3 className="mb-4 text-lg font-semibold text-gray-900">
  //             Próximos pasos
  //           </h3>
  //           <ul className="space-y-3 text-sm text-gray-600">
  //             <li className="flex items-start">
  //               <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
  //                 1
  //               </span>
  //               <span>Descarga e imprime el código QR</span>
  //             </li>
  //             <li className="flex items-start">
  //               <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
  //                 2
  //               </span>
  //               <span>
  //                 Coloca el código en el collar o etiqueta de tu mascota
  //               </span>
  //             </li>
  //             <li className="flex items-start">
  //               <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
  //                 3
  //               </span>
  //               <span>
  //                 Si alguien encuentra a tu mascota, escanearán el código
  //               </span>
  //             </li>
  //           </ul>
  //         </div>
  //       </div>
  //     </Card>

  //     <Link className="mt-8 w-full" to="/dashboard">
  //       <ArrowLeft className="mr-2 h-5 w-5" />
  //       Volver al dashboard
  //     </Link>
  //   </div>
  // </div>
};

export default QRSuccess;
