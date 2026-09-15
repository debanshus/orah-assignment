import { useState, useEffect } from 'react';
import { ApiService } from '../services/api.service';
import { SchoolClassDto } from '@orah/shared';
import TakeAttendanceModal from './TakeAttendanceModal';
import DatePickerPopover from './DatePickerPopover';

export default function ClassList() {
  const [classes, setClasses] = useState<SchoolClassDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for attendance modal
  const [activeClass, setActiveClass] = useState<SchoolClassDto | null>(null);
  const [modalConfig, setModalConfig] = useState<{ readOnly: boolean; initialDate?: string }>({ readOnly: false });

  useEffect(() => {
    ApiService.getClasses()
      .then((data) => setClasses(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const openTakeAttendance = (cls: SchoolClassDto) => {
    setActiveClass(cls);
    setModalConfig({ readOnly: false });
  };

  const openHistory = (cls: SchoolClassDto, date: string) => {
    setActiveClass(cls);
    setModalConfig({ readOnly: true, initialDate: date });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Classes</h2>
        
        {loading ? (
          <div className="text-gray-500">Loading classes...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-visible">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cls.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DatePickerPopover onDateSelected={(date) => openHistory(cls, date)} />
                      <button
                        type="button"
                        onClick={() => openTakeAttendance(cls)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Take Attendance
                      </button>
                    </td>
                  </tr>
                ))}
                {classes.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                      No classes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeClass && (
        <TakeAttendanceModal
          schoolClass={activeClass}
          readOnly={modalConfig.readOnly}
          initialDate={modalConfig.initialDate}
          onClose={() => setActiveClass(null)}
        />
      )}
    </>
  );
}
