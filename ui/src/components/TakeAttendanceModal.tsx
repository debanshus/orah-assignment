import { useState, useEffect } from 'react';
import { ApiService } from '../services/api.service';
import { StudentDto, SchoolClassDto } from '@orah/shared';
import ConfirmationModal from './ConfirmationModal';
import SuccessModal from './SuccessModal';

interface Props {
  schoolClass: SchoolClassDto | null;
  onClose: () => void;
  readOnly?: boolean;
  initialDate?: string;
}

export default function TakeAttendanceModal({ schoolClass, onClose, readOnly = false, initialDate }: Props) {
  const [date, setDate] = useState(() => initialDate || new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!schoolClass) return;
    setLoading(true);

    if (readOnly) {
      ApiService.getAttendance(schoolClass.id, date)
        .then((data) => {
          const mappedStudents = data.records.map(r => ({
            id: r.studentId,
            name: r.studentName || 'Unknown',
            email: 'N/A', // Not returned in attendance response
            rollNumber: r.rollNumber
          }));
          setStudents(mappedStudents);
          
          const newPresentMap: Record<string, boolean> = {};
          data.records.forEach(r => {
            newPresentMap[r.studentId] = r.status === 'present';
          });
          setPresentMap(newPresentMap);
        })
        .catch((err) => alert(err.message))
        .finally(() => setLoading(false));
    } else {
      ApiService.getStudents()
        .then((data) => {
          setStudents(data);
          // Default everyone to present? Prompt doesn't specify, we'll leave it as unchecked initially.
        })
        .catch((err) => alert(err.message))
        .finally(() => setLoading(false));
    }
  }, [schoolClass, date, readOnly]);

  if (!schoolClass) return null;

  const presentCount = Object.values(presentMap).filter(Boolean).length;

  const toggleStudent = (id: string) => {
    if (readOnly) return;
    setPresentMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    if (readOnly) {
      onClose();
      return;
    }
    
    if (students.length === 0) {
      alert('No students to submit attendance for.');
      return;
    }
    
    setConfirmOpen(true);
  };

  const executeSubmit = async () => {
    setConfirmOpen(false);
    setSubmitting(true);
    try {
      const records = students.map((s) => ({
        studentId: s.id,
        status: (presentMap[s.id] ? 'present' : 'absent') as 'present' | 'absent',
      }));
      
      await ApiService.postAttendance({
        classId: schoolClass.id,
        date,
        records,
      });
      
      setSuccessOpen(true);
    } catch (error: any) {
      alert(`Error saving attendance: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-full flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{readOnly ? 'Attendance History' : 'Take Attendance'}</h2>
            <p className="text-gray-600 font-medium mt-1">Class: <span className="text-blue-700">{schoolClass.name}</span></p>
          </div>
          <div className="flex flex-col sm:items-end">
            <label htmlFor="date-picker" className="text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              id="date-picker"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={readOnly}
              className={`border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${readOnly ? 'bg-gray-100 border-gray-200' : 'border-gray-300'}`}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">{readOnly ? 'Loading history...' : 'Loading students...'}</div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    {!readOnly && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                    )}
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {students.map((student) => (
                    <tr key={student.id} className="odd:bg-white even:bg-blue-50 hover:bg-blue-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                        {student.rollNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                              <svg className="h-12 w-12 mt-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      {!readOnly && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={!!presentMap[student.id]}
                          onChange={() => toggleStudent(student.id)}
                          disabled={readOnly}
                          className={`h-5 w-5 rounded ${readOnly ? 'text-blue-400 cursor-not-allowed border-gray-200 bg-gray-100' : 'text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer'}`}
                        />
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={readOnly ? 3 : 4} className="px-6 py-10 text-center text-sm text-gray-500">
                        {readOnly ? 'No attendance recorded for this date.' : 'No students found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="text-gray-700">
            <span className="font-bold text-lg text-blue-700">{presentCount}</span> out of <span className="font-bold text-gray-900">{students.length}</span> students present
          </div>
          <div className="flex space-x-3">
            {!readOnly && (
              <button
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting || loading || (students.length === 0 && !readOnly)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : readOnly ? 'Close' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmOpen}
        title="Confirm Attendance"
        message="Is the attendance final? You cannot modify it after saving."
        onConfirm={executeSubmit}
        onCancel={() => setConfirmOpen(false)}
      />

      <SuccessModal
        isOpen={successOpen}
        title="Success"
        message="Attendance saved successfully!"
        onClose={() => {
          setSuccessOpen(false);
          onClose();
        }}
      />
    </div>
  );
}
