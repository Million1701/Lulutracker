import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import { CheckCircle, Download } from 'lucide-react';

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
      width: 200,
      height: 200,
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
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center gap-12 py-4">
      <div className="w-full max-w-xl">
        {/* Card principal */}
        <div className="sm:bg-white sm:rounded-2xl sm:shadow-xl p-8 space-y-6">
          {/* Header con ícono de éxito */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              ¡QR Generado Exitosamente!
            </h2>
            <p className="text-gray-600">
              Escanea este código o descárgalo para colocarlo en el collar de tu
              mascota
            </p>
          </div>

          {/* Contenedor del QR */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-inner">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div ref={qrRef} />
              </div>
            </div>
          </div>

          {/* Botón de descarga */}
          <Button
            onClick={handleDownload}
            className="w-full py-4 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Descargar QR
          </Button>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              💡 <span className="font-semibold">Nota:</span> Descargue el
              código QR y envíelo por WhatsApp al agente encargado, pues es
              necesario para la personalización de su correa.
            </p>
          </div>
        </div>

        {/* Nota inferior */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Guarda este código en un lugar seguro
        </p>
      </div>
    </div>
  );
};

export default QRSuccess;
