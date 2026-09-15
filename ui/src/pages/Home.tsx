import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { ApiService } from '../services/api.service';
import ClassList from '../components/ClassList';
import StudentList from '../components/StudentList';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const handleHealthCheck = useCallback(async () => {
    setIsLoading(true);
    try {
      const isHealthy = await ApiService.checkHealth();
      setModalMessage(isHealthy ? 'I am healthy!' : 'I am down!');
    } catch {
      setModalMessage('I am down!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeModal = useCallback(() => setModalMessage(null), []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onHealthCheck={handleHealthCheck} isLoading={isLoading} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <ClassList />
        <StudentList />
      </main>

      {/* Modal */}
      {modalMessage !== null && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
}

