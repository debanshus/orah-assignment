import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SuccessModal from '../components/SuccessModal';
import { ApiService } from '../services/api.service';
import { ConcernResponseDto, ConcernStatus } from '@orah/shared';

export default function Concerns() {
  const [concerns, setConcerns] = useState<ConcernResponseDto[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { status: ConcernStatus, notes: string }>>({});
  const [loading, setLoading] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<{ isOpen: boolean, concern: ConcernResponseDto | null }>({ isOpen: false, concern: null });

  useEffect(() => {
    fetchConcerns();
  }, []);

  const fetchConcerns = () => {
    setLoading(true);
    ApiService.getConcerns()
      .then((data) => {
        setConcerns(data);
        const newDrafts: Record<string, { status: ConcernStatus, notes: string }> = {};
        data.forEach(i => {
          newDrafts[i.id] = { status: i.status, notes: i.notes || '' };
        });
        setDrafts(newDrafts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdate = async (concernId: string) => {
    try {
      await ApiService.updateConcern(concernId, drafts[concernId]);
      setSuccessModal(true);
      fetchConcerns();
    } catch (e) {
      alert('Failed to update concern.');
    }
  };

  const handleAlert = (concernId: string) => {
    alert(`Alert sent for concern ${concernId}!`);
  };

  const handleDraftChange = (id: string, field: 'status' | 'notes', value: string) => {
    setDrafts(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Concerns</h2>
            <p className="text-gray-600 mt-1">Review and follow up on triggered attendance alerts.</p>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-gray-500">Loading concerns...</div>
            ) : concerns.length === 0 ? (
              <div className="text-gray-500">No concerns logged yet.</div>
            ) : (
              <div className="space-y-6">
                {concerns.map(concern => {
                  const draft = drafts[concern.id] || { status: concern.status, notes: concern.notes || '' };
                  
                  return (
                    <div key={concern.id} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm flex flex-col md:flex-row gap-6">
                      {/* Left: Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{concern.studentName}</h3>
                            <p className="text-sm text-blue-600 font-medium">Class: {concern.className}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            concern.status === ConcernStatus.OPEN ? 'bg-red-100 text-red-800' :
                            concern.status === ConcernStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {concern.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">Trigger:</span> {concern.triggerDetails}
                        </div>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(concern.createdAt).toLocaleString()}
                        </p>
                        
                        <button
                          onClick={() => setSelectedEmails({ isOpen: true, concern })}
                          className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Emails Sent
                        </button>
                      </div>

                      {/* Right: Action */}
                      <div className="w-full md:w-1/3 flex flex-col gap-3 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                        <label className="text-sm font-medium text-gray-700">Staff Notes</label>
                        <textarea
                          className="w-full h-24 resize-none border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add note..."
                          value={draft.notes}
                          onChange={(e) => handleDraftChange(concern.id, 'notes', e.target.value)}
                        />
                        
                        <div className="flex gap-2">
                          <select
                            className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            value={draft.status}
                            onChange={(e) => handleDraftChange(concern.id, 'status', e.target.value)}
                          >
                            <option value={ConcernStatus.OPEN}>Open</option>
                            <option value={ConcernStatus.IN_PROGRESS}>In Progress</option>
                            <option value={ConcernStatus.RESOLVED}>Resolved</option>
                          </select>
                          <button
                            onClick={() => handleUpdate(concern.id)}
                            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            Update
                          </button>
                        </div>

                        <button
                          onClick={() => handleAlert(concern.id)}
                          className="w-full mt-2 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          Email Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <SuccessModal
        isOpen={successModal}
        message="Concern updated successfully!"
        onClose={() => setSuccessModal(false)}
      />

      {/* Emails Modal */}
      {selectedEmails.isOpen && selectedEmails.concern && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setSelectedEmails({ isOpen: false, concern: null })}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 transform transition-all max-h-[80vh] flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
              Emails Sent - {selectedEmails.concern.studentName}
            </h3>
            
            <div className="overflow-y-auto flex-1 pr-2 space-y-4">
              {/* Note: In a real app we'd map over concern.emailLogs, which we just added to the shared package */}
              {((selectedEmails.concern as any).emailLogs || []).length === 0 ? (
                <p className="text-gray-500 italic">No emails sent for this concern yet.</p>
              ) : (
                ((selectedEmails.concern as any).emailLogs || []).map((log: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm text-sm">
                    <p className="mb-1"><span className="font-semibold text-gray-700">To:</span> {log.to_address}</p>
                    <p className="mb-1"><span className="font-semibold text-gray-700">Time:</span> {new Date(log.sent_at).toLocaleString()}</p>
                    <p className="mb-3"><span className="font-semibold text-gray-700">Subject:</span> {log.subject}</p>
                    <div className="bg-white border border-gray-200 rounded p-3 text-gray-600 max-h-48 overflow-y-auto" dangerouslySetInnerHTML={{ __html: log.body }} />
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6 border-t pt-4 text-right">
              <button
                onClick={() => setSelectedEmails({ isOpen: false, concern: null })}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
