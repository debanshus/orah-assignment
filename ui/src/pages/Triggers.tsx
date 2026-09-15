import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';
import { ApiService } from '../services/api.service';
import { SchoolClassDto, AbsentCriteria, CriteriaMetFrequency, EmailSchedule, TriggerRecipient, TriggerResponseDto } from '@orah/shared';

export default function Triggers() {
  const [classes, setClasses] = useState<SchoolClassDto[]>([]);
  const [triggers, setTriggers] = useState<TriggerResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [classId, setClassId] = useState('any');
  const [absentCount, setAbsentCount] = useState<number | ''>('');
  const [absentType, setAbsentType] = useState<AbsentCriteria>(AbsentCriteria.CONSECUTIVE);
  const [withinCount, setWithinCount] = useState<number | ''>('');
  const [withinUnit, setWithinUnit] = useState('days');
  const [alertFrequency, setAlertFrequency] = useState<CriteriaMetFrequency>(CriteriaMetFrequency.ONCE);
  
  const [recipients, setRecipients] = useState<TriggerRecipient[]>([TriggerRecipient.STUDENTS, TriggerRecipient.PARENTS]);
  const [timingType, setTimingType] = useState<EmailSchedule>(EmailSchedule.IMMEDIATELY);
  const [delayedHours, setDelayedHours] = useState<number | ''>('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Dropdown states for recipients multi-select (simple version)
  const [showRecipientsDropdown, setShowRecipientsDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecipientsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  // Error Modal State
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [successModal, setSuccessModal] = useState(false);

  const fetchTriggers = async () => {
    try {
      const data = await ApiService.getTriggers();
      setTriggers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Promise.all([
      ApiService.getClasses().then(setClasses),
      fetchTriggers(),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleRecipient = (value: TriggerRecipient) => {
    setRecipients(prev => 
      prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
    );
  };

  
  const resetForm = () => {
    setClassId('any');
    setAbsentCount('');
    setAbsentType(AbsentCriteria.CONSECUTIVE);
    setWithinCount('');
    setWithinUnit('days');
    setAlertFrequency(CriteriaMetFrequency.ONCE);
    setRecipients([TriggerRecipient.STUDENTS, TriggerRecipient.PARENTS]);
    setTimingType(EmailSchedule.IMMEDIATELY);
    setDelayedHours('');
    setScheduledTime('');
  };

  const handleCreate = async () => {
    // Validation
    if (absentCount === '' || absentCount <= 0) {
      return setErrorModal({ isOpen: true, message: 'Please specify a valid number of absent days.' });
    }
    if (withinCount === '' || withinCount <= 0) {
      return setErrorModal({ isOpen: true, message: 'Please specify a valid time period (within X days/weeks/months).' });
    }
    if (recipients.length === 0) {
      return setErrorModal({ isOpen: true, message: 'Please select at least one recipient.' });
    }
    if (timingType === EmailSchedule.DELAYED && (delayedHours === '' || delayedHours <= 0)) {
      return setErrorModal({ isOpen: true, message: 'Please specify the number of hours for the delayed alert.' });
    }
    if (timingType === EmailSchedule.AT_THIS_TIME && !scheduledTime) {
      return setErrorModal({ isOpen: true, message: 'Please select a specific time for the scheduled alert.' });
    }

    const payload = {
      classId,
      targetAbsentDays: Number(absentCount),
      absentCriteria: absentType,
      timePeriod: Number(withinCount),
      timeUnit: withinUnit,
      criteriaMetFrequency: alertFrequency,
      mail_recipients: recipients,
      mail_schedule: timingType,
      mail_delay_in_hours: timingType === EmailSchedule.DELAYED ? Number(delayedHours) : undefined,
      mail_schedule_time: timingType === EmailSchedule.AT_THIS_TIME ? scheduledTime : undefined,
    };

    try {
      await ApiService.postTrigger(payload);
      setSuccessModal(true);
      await fetchTriggers();
      // Optional: reset form
    } catch (error: any) {
      setErrorModal({ isOpen: true, message: error.message || 'Failed to save trigger.' });
    }
  };

  const formatTriggerStatement = (t: TriggerResponseDto) => {
    const Highlight = ({ children }: { children: React.ReactNode }) => (
      <span className="font-bold text-blue-600">{children}</span>
    );

    return (
      <span>
        When any student of class <Highlight>{t.className}</Highlight> are absent for <Highlight>{t.targetAbsentDays}</Highlight> days{' '}
        <Highlight>{t.absentCriteria === AbsentCriteria.CONSECUTIVE ? 'in a row' : 'in total'}</Highlight>{' '}
        within <Highlight>{t.timePeriod}</Highlight> <Highlight>{t.timeUnit}</Highlight>, send alert{' '}
        <Highlight>{t.criteriaMetFrequency === CriteriaMetFrequency.ONCE ? 'only once when the criteria is met' : 'everytime the criteria is met'}</Highlight>{' '}
        to the recipients <Highlight>{t.mail_recipients.join(', ')}</Highlight>{' '}
        {t.mail_schedule === EmailSchedule.IMMEDIATELY && <Highlight>immediately</Highlight>}
        {t.mail_schedule === EmailSchedule.DELAYED && <>after <Highlight>{t.mail_delay_in_hours}</Highlight> hours</>}
        {t.mail_schedule === EmailSchedule.AT_THIS_TIME && <>at <Highlight>{t.mail_schedule_time}</Highlight></>}
        .
      </span>
    );
  };

  const inputClass = "inline-block border-b-2 border-gray-300 bg-transparent px-2 py-1 mx-2 text-blue-700 font-semibold focus:outline-none focus:border-blue-600 transition-colors text-center";
  const selectClass = "inline-block border-b-2 border-gray-300 bg-transparent px-2 py-1 mx-2 text-blue-700 font-semibold focus:outline-none focus:border-blue-600 transition-colors cursor-pointer appearance-none text-center pr-6"; // using background image for caret later if needed

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Trigger</h2>
          
          {loading ? (
            <div className="text-gray-500">Loading configurations...</div>
          ) : (
            <div className="text-base leading-loose text-gray-800 space-y-4">
              
              {/* Line 2 */}
              <div>
                When any student of class 
                <select 
                  className={selectClass} 
                  value={classId} 
                  onChange={e => setClassId(e.target.value)}
                >
                  <option value="any">any class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Line 3 */}
              <div>
                are absent for 
                <input 
                  type="number" 
                  min="1" 
                  className={`${inputClass} w-20`} 
                  value={absentCount}
                  onChange={e => setAbsentCount(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0"
                /> 
                days
              </div>
              
              {/* Line 4 */}
              <div>
                <select 
                  className={selectClass}
                  value={absentType}
                  onChange={e => setAbsentType(e.target.value as AbsentCriteria)}
                >
                  <option value={AbsentCriteria.CONSECUTIVE}>in a row</option>
                  <option value={AbsentCriteria.PERIOD}>in total</option>
                </select>
              </div>
              
              {/* Line 5 */}
              <div>
                within 
                <input 
                  type="number" 
                  min="1"
                  className={`${inputClass} w-20`} 
                  value={withinCount}
                  onChange={e => setWithinCount(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0"
                />
                <select 
                  className={selectClass}
                  value={withinUnit}
                  onChange={e => setWithinUnit(e.target.value)}
                >
                  <option value="days">days</option>
                  <option value="weeks">weeks</option>
                  <option value="months">months</option>
                </select>,
              </div>
              
              {/* Line 6 */}
              <div>
                send alert 
                <select 
                  className={selectClass}
                  value={alertFrequency}
                  onChange={e => setAlertFrequency(e.target.value as CriteriaMetFrequency)}
                >
                  <option value={CriteriaMetFrequency.ONCE}>only once when the criteria is met</option>
                  <option value={CriteriaMetFrequency.EACH}>everytime the criteria is met</option>
                </select>
              </div>
              
              {/* Line 7 */}
              <div>
                to the recipients 
                <div className="relative inline-block mx-2" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowRecipientsDropdown(!showRecipientsDropdown)}
                    className={`${selectClass} min-w-[150px] text-left`}
                  >
                    {recipients.length === 0 
                      ? 'Select recipients...' 
                      : recipients.join(', ')}
                  </button>
                  {showRecipientsDropdown && (
                    <div className="absolute z-10 mt-1 w-56 bg-white shadow-lg rounded-md border border-gray-200 py-2 text-base text-gray-700 top-full left-0">
                      <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={recipients.includes(TriggerRecipient.STUDENTS)}
                          onChange={() => toggleRecipient(TriggerRecipient.STUDENTS)}
                        />
                        Students
                      </label>
                      <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={recipients.includes(TriggerRecipient.PARENTS)}
                          onChange={() => toggleRecipient(TriggerRecipient.PARENTS)}
                        />
                        Parent of students
                      </label>
                    </div>
                  )}
                </div>

                <select 
                  className={selectClass}
                  value={timingType}
                  onChange={e => setTimingType(e.target.value as EmailSchedule)}
                >
                  <option value={EmailSchedule.IMMEDIATELY}>immediately</option>
                  <option value={EmailSchedule.DELAYED}>in a while</option>
                  <option value={EmailSchedule.AT_THIS_TIME}>at this time</option>
                </select>
                
                {timingType === EmailSchedule.DELAYED && (
                  <span>
                    after 
                    <input 
                      type="number" 
                      min="1"
                      className={`${inputClass} w-20`} 
                      value={delayedHours}
                      onChange={e => setDelayedHours(e.target.value ? Number(e.target.value) : '')}
                      placeholder="0"
                    /> 
                    hours
                  </span>
                )}
                
                {timingType === EmailSchedule.AT_THIS_TIME && (
                  <span>
                    <input 
                      type="time" 
                      className={inputClass} 
                      value={scheduledTime}
                      onChange={e => setScheduledTime(e.target.value)}
                    />
                  </span>
                )}.
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Create
            </button>
          </div>
        </div>

        {/* Existing Triggers Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Configured Triggers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trigger Configuration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {triggers.length > 0 ? (
                  triggers.map((trigger) => (
                    <tr key={trigger.id} className="odd:bg-white even:bg-blue-50">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatTriggerStatement(trigger)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      No triggers configured yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        title="Validation Error"
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />

      <SuccessModal
        isOpen={successModal}
        message="Trigger created successfully!"
        onClose={() => { setSuccessModal(false); resetForm(); }}
      />
    </div>
  );
}
