import { useEffect, useState } from 'react';
import { MapPin, Calendar, CheckCircle, XCircle, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { locationReportService } from '../services/locationReportService';
import { locationService } from '../services/locationService';
import { LocationReport, LocationReportStatus } from '../types';
import { LoadingScreen } from '../components/LoadingScreen';
import Button from '../components/ui/Button';

interface ReportWithPet extends LocationReport {
  pet_name: string;
  pet_photo: string | null;
}

const LocationReportsDashboard = () => {
  const [reports, setReports] = useState<ReportWithPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<LocationReportStatus | 'all'>('all');
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await locationReportService.getReportsWithPetInfo();
      setReports(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando reportes:', err);
      setError('No se pudieron cargar los reportes. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: LocationReportStatus) => {
    setUpdatingReportId(reportId);
    try {
      await locationReportService.updateReportStatus(reportId, newStatus);
      // Actualizar el estado localmente
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (err) {
      console.error('Error actualizando estado:', err);
      alert('No se pudo actualizar el estado del reporte');
    } finally {
      setUpdatingReportId(null);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      return;
    }

    try {
      await locationReportService.deleteReport(reportId);
      setReports((prev) => prev.filter((report) => report.id !== reportId));
    } catch (err) {
      console.error('Error eliminando reporte:', err);
      alert('No se pudo eliminar el reporte');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: LocationReportStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      verified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      dismissed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    const labels = {
      pending: 'Pendiente',
      verified: 'Verificado',
      dismissed: 'Descartado',
    };

    const icons = {
      pending: <Clock className="h-4 w-4" />,
      verified: <CheckCircle className="h-4 w-4" />,
      dismissed: <XCircle className="h-4 w-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const filteredReports = filterStatus === 'all'
    ? reports
    : reports.filter((report) => report.status === filterStatus);

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const verifiedCount = reports.filter((r) => r.status === 'verified').length;
  const dismissedCount = reports.filter((r) => r.status === 'dismissed').length;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Reportes de Ubicación
            </h1>
            <Link to="/dashboard">
              <Button variant="outline">
                ← Volver al Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Visualiza y administra los reportes de ubicación de tus mascotas
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Estadísticas */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => setFilterStatus('all')}
            className={`rounded-lg border-2 p-4 text-left transition ${
              filterStatus === 'all'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300'
            }`}
          >
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</div>
            <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {reports.length}
            </div>
          </button>

          <button
            onClick={() => setFilterStatus('pending')}
            className={`rounded-lg border-2 p-4 text-left transition ${
              filterStatus === 'pending'
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-yellow-300'
            }`}
          >
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</div>
            <div className="mt-1 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {pendingCount}
            </div>
          </button>

          <button
            onClick={() => setFilterStatus('verified')}
            className={`rounded-lg border-2 p-4 text-left transition ${
              filterStatus === 'verified'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300'
            }`}
          >
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Verificados</div>
            <div className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
              {verifiedCount}
            </div>
          </button>
        </div>

        {/* Lista de Reportes */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-12 text-center">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                No hay reportes {filterStatus !== 'all' && `(${filterStatus})`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filterStatus === 'all'
                  ? 'Aún no hay reportes de ubicación para tus mascotas.'
                  : `No hay reportes con estado "${filterStatus}".`}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Información de la mascota y ubicación */}
                  <div className="flex-1 space-y-3">
                    {/* Mascota */}
                    <div className="flex items-center gap-3">
                      {report.pet_photo ? (
                        <img
                          src={report.pet_photo}
                          alt={report.pet_name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-2xl">
                          🐾
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {report.pet_name}
                        </h3>
                        {getStatusBadge(report.status)}
                      </div>
                    </div>

                    {/* Fecha */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {formatDate(report.reported_at)}
                    </div>

                    {/* Dirección */}
                    {report.address && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>{report.address}</span>
                      </div>
                    )}

                    {/* Coordenadas y precisión */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-500">
                      <span>Lat: {report.latitude.toFixed(6)}</span>
                      <span>Lon: {report.longitude.toFixed(6)}</span>
                      {report.accuracy && (
                        <span>Precisión: {Math.round(report.accuracy)}m</span>
                      )}
                    </div>

                    {/* Enlace a Google Maps */}
                    <a
                      href={locationService.getGoogleMapsUrl(report.latitude, report.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ver en Google Maps
                    </a>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 sm:items-end">
                    {report.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(report.id, 'verified')}
                          disabled={updatingReportId === report.id}
                          className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verificar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(report.id, 'dismissed')}
                          disabled={updatingReportId === report.id}
                          className="border-gray-500 text-gray-600 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Descartar
                        </Button>
                      </>
                    )}

                    {report.status !== 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(report.id, 'pending')}
                        disabled={updatingReportId === report.id}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Marcar Pendiente
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationReportsDashboard;
